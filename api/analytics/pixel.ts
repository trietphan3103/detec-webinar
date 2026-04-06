import type { IncomingMessage, ServerResponse } from 'node:http';

type VercelRequest = IncomingMessage & { query: Record<string, string> };
type VercelResponse = ServerResponse & { status: (code: number) => VercelResponse; json: (data: unknown) => void };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID || '916740607846322';
  if (!token) return res.status(400).json({ error: 'META_ACCESS_TOKEN not configured' });

  const q = req.query as Record<string, string | undefined>;
  const days = Number(q.days) || 7;
  const fromParam = q.from;
  const toParam = q.to;
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

    // FormSubmit SERVER count (CAPI) = deduplicated, 1:1 with real submits
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

    const dailyMap: Record<string, Record<string, number>> = {};
    const totals: Record<string, number> = {};

    for (const hour of uniqueHours) {
      const day = hour.start_time.slice(0, 10);
      if (!dailyMap[day]) dailyMap[day] = {};
      for (const evt of hour.data ?? []) {
        if (evt.value === 'FormSubmit') continue; // use deduplicated SERVER count instead
        dailyMap[day][evt.value] = (dailyMap[day][evt.value] ?? 0) + evt.count;
        totals[evt.value] = (totals[evt.value] ?? 0) + evt.count;
      }
    }

    totals['FormSubmit'] = fsServer;

    const daily = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, evts]) => ({ date, ...evts }));

    const hourMap: Record<number, Record<string, number>> = {};
    for (const hour of uniqueHours) {
      const h = (parseInt(hour.start_time.slice(11, 13), 10) + 7) % 24; // UTC+7
      if (!hourMap[h]) hourMap[h] = {};
      for (const evt of hour.data ?? []) {
        hourMap[h][evt.value] = (hourMap[h][evt.value] ?? 0) + evt.count;
      }
    }
    const hourly = Array.from({ length: 24 }, (_, h) => ({ hour: h, ...(hourMap[h] ?? {}) }));

    res.status(200).json({ totals, daily, hourly, days });
  } catch (err) {
    console.error('[/api/analytics/pixel]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
