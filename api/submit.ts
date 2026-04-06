import type { IncomingMessage, ServerResponse } from 'node:http';

type VercelRequest = IncomingMessage & { body: any; query: Record<string, string> };
type VercelResponse = ServerResponse & { status: (code: number) => VercelResponse; json: (data: unknown) => void };

async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('84')) return digits;
  if (digits.startsWith('0')) return '84' + digits.slice(1);
  return '84' + digits;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, email, clinic_name, city, question, eventId, fbc, fbp, userAgent } = req.body;

    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      (req.headers['x-real-ip'] as string) ||
      '0.0.0.0';

    const ua = userAgent || req.headers['user-agent'] || '';

    const [detecRes] = await Promise.all([
      fetch(`${process.env.DETEC_API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.DETEC_API_KEY!,
        },
        body: JSON.stringify({ name, phone, email, clinic_name, city, question }),
      }),

      (async () => {
        const [hashedEmail, hashedPhone] = await Promise.all([
          sha256(email.trim().toLowerCase()),
          sha256(normalizePhone(phone)),
        ]);

        const userData: Record<string, unknown> = {
          em: [hashedEmail],
          ph: [hashedPhone],
          client_ip_address: clientIp,
          client_user_agent: ua,
        };
        if (fbc) userData.fbc = fbc;
        if (fbp) userData.fbp = fbp;

        return fetch(
          `https://graph.facebook.com/v19.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: [{
                event_name: 'FormSubmit',
                event_time: Math.floor(Date.now() / 1000),
                event_id: eventId || `formsubmit-${Date.now()}`,
                action_source: 'website',
                event_source_url: process.env.APP_URL || '',
                user_data: userData,
              }],
            }),
          }
        );
      })(),
    ]);

    const data = await detecRes.json();
    res.status(detecRes.status).json(data);
  } catch (err) {
    console.error('[/api/submit]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
