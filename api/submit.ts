export const config = { runtime: 'edge' };

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

function getCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { name, phone, email, clinic_name, city, eventId, fbc, fbp, userAgent } = body;

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '0.0.0.0';

    const ua = userAgent || request.headers.get('user-agent') || '';

    // Run DETEC API + Meta CAPI in parallel
    const [detecRes] = await Promise.all([
      // 1. DETEC — create user + log submit
      fetch(`${process.env.DETEC_API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.DETEC_API_KEY!,
        },
        body: JSON.stringify({ name, phone, email, clinic_name, city }),
      }),

      // 2. Meta CAPI — Lead event
      (async () => {
        const [hashedEmail, hashedPhone] = await Promise.all([
          sha256(email.trim().toLowerCase()),
          sha256(normalizePhone(phone)),
        ]);

        const cookieHeader = request.headers.get('cookie');
        const fbcValue = fbc || getCookie(cookieHeader, '_fbc');
        const fbpValue = fbp || getCookie(cookieHeader, '_fbp');

        const userData: Record<string, unknown> = {
          em: [hashedEmail],
          ph: [hashedPhone],
          client_ip_address: clientIp,
          client_user_agent: ua,
        };
        if (fbcValue) userData.fbc = fbcValue;
        if (fbpValue) userData.fbp = fbpValue;

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
                event_source_url: 'https://detec-webinar.vercel.app',
                user_data: userData,
              }],
            }),
          }
        );
      })(),
    ]);

    const data = await detecRes.json();

    return new Response(JSON.stringify(data), {
      status: detecRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
