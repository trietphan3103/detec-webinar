import { config } from 'dotenv';

// Load theo độ ưu tiên tăng dần (giống Vite/Next.js)
const NODE_ENV = process.env.NODE_ENV || 'development';
config({ path: '.env' });
config({ path: `.env.${NODE_ENV}`, override: true });
config({ path: '.env.local', override: true });
config({ path: `.env.${NODE_ENV}.local`, override: true });
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

// ── helpers ──────────────────────────────────────────────────────────────────

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

// ── API route ─────────────────────────────────────────────────────────────────

app.post('/api/submit', async (req, res) => {
  try {
    const { name, phone, email, clinic_name, city, question, eventId, fbc, fbp, userAgent } = req.body;

    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      '0.0.0.0';

    const ua = userAgent || req.headers['user-agent'] || '';

    const [detecRes] = await Promise.all([
      // 1. DETEC — create user + log submit
      fetch(`${process.env.DETEC_API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.DETEC_API_KEY!,
        },
        body: JSON.stringify({ name, phone, email, clinic_name, city, question }),
      }),

      // 2. Meta CAPI — Lead event
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
});

// ── Analytics API ─────────────────────────────────────────────────────────────

app.get('/api/analytics/pixel', async (req, res) => {
  const token = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID || '916740607846322';
  if (!token) return res.status(400).json({ error: 'META_ACCESS_TOKEN not configured' });

  const days = Number(req.query.days) || 7;
  const fromParam = req.query.from as string | undefined;
  const toParam = req.query.to as string | undefined;
  const startTime = fromParam ? Math.floor(new Date(fromParam).getTime() / 1000) : Math.floor(Date.now() / 1000) - days * 86400;
  const endTime = toParam ? Math.floor(new Date(toParam).getTime() / 1000) + 86400 : undefined;

  try {
    const baseParams = `start_time=${startTime}${endTime ? `&end_time=${endTime}` : ''}&access_token=${token}`;
    const [r, fsSourceRes] = await Promise.all([
      fetch(`https://graph.facebook.com/v19.0/${pixelId}/stats?${baseParams}&aggregation=event`),
      fetch(`https://graph.facebook.com/v19.0/${pixelId}/stats?${baseParams}&event=FormSubmit&aggregation=event_source`),
    ]);
    const json = await r.json() as { data?: Array<{ start_time: string; data: Array<{ value: string; count: number }> }>; error?: unknown };
    if (!r.ok) return res.status(r.status).json(json);

    // FormSubmit SERVER count (CAPI) = 1:1 with real submits, no browser+CAPI double-count
    let fsServer = 0;
    if (fsSourceRes.ok) {
      const fsJson = await fsSourceRes.json() as { data?: Array<{ data: Array<{ value: string; count: number }> }> };
      for (const h of fsJson.data ?? []) {
        for (const e of h.data ?? []) {
          if (e.value === 'SERVER') fsServer += e.count;
        }
      }
    }

    // Dedup buckets by start_time
    const seenBuckets = new Set<string>();
    const uniqueHours = (json.data ?? []).filter(h => {
      if (seenBuckets.has(h.start_time)) return false;
      seenBuckets.add(h.start_time);
      return true;
    });

    // Aggregate by day
    const dailyMap: Record<string, Record<string, number>> = {};
    const totals: Record<string, number> = {};

    for (const hour of uniqueHours) {
      const day = hour.start_time.slice(0, 10);
      if (!dailyMap[day]) dailyMap[day] = {};
      for (const evt of hour.data ?? []) {
        dailyMap[day][evt.value] = (dailyMap[day][evt.value] ?? 0) + evt.count;
        if (evt.value !== 'FormSubmit') {
          totals[evt.value] = (totals[evt.value] ?? 0) + evt.count;
        }
      }
    }

    // Use CAPI (SERVER) count as deduplicated FormSubmit
    totals['FormSubmit'] = fsServer;

    const daily = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, evts]) => ({ date, ...evts }));

    // Aggregate by hour-of-day (0–23) across all days (FormSubmit uses raw for trend shape)
    const hourMap: Record<number, Record<string, number>> = {};
    for (const hour of uniqueHours) {
      const h = (parseInt(hour.start_time.slice(11, 13), 10) + 7) % 24; // UTC+7
      if (!hourMap[h]) hourMap[h] = {};
      for (const evt of hour.data ?? []) {
        hourMap[h][evt.value] = (hourMap[h][evt.value] ?? 0) + evt.count;
      }
    }
    const hourly = Array.from({ length: 24 }, (_, h) => ({ hour: h, ...(hourMap[h] ?? {}) }));

    res.json({ totals, daily, hourly, days });
  } catch (err) {
    console.error('[/api/analytics/pixel]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Ads Insights API ──────────────────────────────────────────────────────────

app.get('/api/analytics/ads', async (req, res) => {
  const token = process.env.META_ACCESS_TOKEN;
  const adAccountId = process.env.META_AD_ACCOUNT_ID || 'act_1044450030603564';
  if (!token) return res.status(400).json({ error: 'META_ACCESS_TOKEN not configured' });

  const days = Number(req.query.days) || 7;
  const fromParam = req.query.from as string | undefined;
  const toParam = req.query.to as string | undefined;

  const since = fromParam || new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const until = toParam || new Date().toISOString().slice(0, 10);

  try {
    const fields = [
      'ad_id', 'campaign_name', 'adset_name', 'ad_name',
      'impressions', 'reach', 'clicks', 'spend',
      'cpm', 'cpc', 'ctr',
      'actions', 'cost_per_action_type',
    ].join(',');

    const timeRange = encodeURIComponent(JSON.stringify({ since, until }));
    const url = `https://graph.facebook.com/v19.0/${adAccountId}/insights?fields=${fields}&time_range=${timeRange}&level=ad&limit=50&access_token=${token}`;

    const r = await fetch(url);
    const json = await r.json() as {
      data?: Array<Record<string, unknown>>;
      error?: unknown;
      paging?: unknown;
    };
    if (!r.ok) return res.status(r.status).json(json);

    // Fetch post URLs via ad creatives (batch)
    const adIds = (json.data ?? []).map(d => d.ad_id as string).filter(Boolean);
    const postUrlMap: Record<string, string> = {};
    if (adIds.length > 0) {
      try {
        const creativeRes = await fetch(
          `https://graph.facebook.com/v19.0/?ids=${adIds.join(',')}&fields=creative{effective_object_story_id}&access_token=${token}`
        );
        const creativeJson = await creativeRes.json() as Record<string, { creative?: { effective_object_story_id?: string } }>;
        for (const [adId, adData] of Object.entries(creativeJson)) {
          const storyId = adData?.creative?.effective_object_story_id;
          if (storyId) {
            const [pageId, postId] = storyId.split('_');
            postUrlMap[adId] = `https://www.facebook.com/permalink.php?story_fbid=${postId}&id=${pageId}`;
          }
        }
      } catch { /* ignore creative fetch errors */ }
    }

    // Normalize actions array → flat object { action_type: count }
    const rows = (json.data ?? []).map((row) => {
      const actions: Record<string, number> = {};
      for (const a of (row.actions as Array<{ action_type: string; value: string }> ?? [])) {
        actions[a.action_type] = Number(a.value);
      }
      const costPerAction: Record<string, number> = {};
      for (const a of (row.cost_per_action_type as Array<{ action_type: string; value: string }> ?? [])) {
        costPerAction[`cost_${a.action_type}`] = Number(a.value);
      }
      const lpv = actions['landing_page_view'] ?? 0;
      const adId = row.ad_id as string;
      return {
        ad_id: adId,
        post_url: postUrlMap[adId] || null,
        campaign_name: row.campaign_name,
        adset_name: row.adset_name,
        ad_name: row.ad_name,
        impressions: Number(row.impressions ?? 0),
        reach: Number(row.reach ?? 0),
        clicks: Number(row.clicks ?? 0),
        landing_page_views: lpv,
        spend: Number(row.spend ?? 0),
        cpm: Number(row.cpm ?? 0),
        cpc: Number(row.cpc ?? 0),
        ctr: Number(row.ctr ?? 0),
        ...actions,
        ...costPerAction,
      };
    });

    // Campaign-level rollup
    const campaignMap: Record<string, typeof rows[0]> = {};
    for (const r of rows) {
      const key = r.campaign_name as string;
      if (!campaignMap[key]) { campaignMap[key] = { ...r }; }
      else {
        const c = campaignMap[key];
        c.impressions += r.impressions;
        c.reach += r.reach;
        c.clicks += r.clicks;
        c.landing_page_views = (c.landing_page_views ?? 0) + (r.landing_page_views ?? 0);
        c.spend += r.spend;
        for (const k of Object.keys(r)) {
          if (['impressions','reach','clicks','landing_page_views','spend'].includes(k)) continue;
          if (typeof r[k as keyof typeof r] === 'number' && k !== 'cpm' && k !== 'cpc' && k !== 'ctr') {
            (c as Record<string, number>)[k] = ((c as Record<string, number>)[k] ?? 0) + (r as Record<string, number>)[k];
          }
        }
        c.cpm = c.impressions > 0 ? c.spend / c.impressions * 1000 : 0;
        c.cpc = c.clicks > 0 ? c.spend / c.clicks : 0;
        c.ctr = c.impressions > 0 ? c.clicks / c.impressions * 100 : 0;
      }
    }

    res.json({
      ads: rows,
      campaigns: Object.values(campaignMap),
      since,
      until,
    });
  } catch (err) {
    console.error('[/api/analytics/ads]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Static SPA ────────────────────────────────────────────────────────────────

const distDir = join(__dirname, 'dist');
app.use(express.static(distDir));
app.get('*', (_req, res) => {
  res.sendFile(join(distDir, 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 8080;
createServer(app).listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
