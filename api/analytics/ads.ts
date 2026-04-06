import type { IncomingMessage, ServerResponse } from 'node:http';

type VercelRequest = IncomingMessage & { query: Record<string, string> };
type VercelResponse = ServerResponse & { status: (code: number) => VercelResponse; json: (data: unknown) => void };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = process.env.META_ACCESS_TOKEN;
  const adAccountId = process.env.META_AD_ACCOUNT_ID || 'act_1044450030603564';
  if (!token) return res.status(400).json({ error: 'META_ACCESS_TOKEN not configured' });

  const q = req.query as Record<string, string | undefined>;
  const days = Number(q.days) || 7;
  const since = q.from || new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const until = q.to || new Date().toISOString().slice(0, 10);

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
    const json = await r.json() as { data?: Array<Record<string, unknown>>; error?: unknown };
    if (!r.ok) return res.status(r.status).json(json);

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
      } catch { /* ignore */ }
    }

    const rows = (json.data ?? []).map((row) => {
      const actions: Record<string, number> = {};
      for (const a of (row.actions as Array<{ action_type: string; value: string }> ?? [])) {
        actions[a.action_type] = Number(a.value);
      }
      const costPerAction: Record<string, number> = {};
      for (const a of (row.cost_per_action_type as Array<{ action_type: string; value: string }> ?? [])) {
        costPerAction[`cost_${a.action_type}`] = Number(a.value);
      }
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
        landing_page_views: actions['landing_page_view'] ?? 0,
        spend: Number(row.spend ?? 0),
        cpm: Number(row.cpm ?? 0),
        cpc: Number(row.cpc ?? 0),
        ctr: Number(row.ctr ?? 0),
        ...actions,
        ...costPerAction,
      };
    });

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
          if (['impressions','reach','clicks','landing_page_views','spend','ad_id','post_url','campaign_name','adset_name','ad_name'].includes(k)) continue;
          if (typeof r[k as keyof typeof r] === 'number' && k !== 'cpm' && k !== 'cpc' && k !== 'ctr') {
            (c as Record<string, number>)[k] = ((c as Record<string, number>)[k] ?? 0) + (r as Record<string, number>)[k];
          }
        }
        c.cpm = c.impressions > 0 ? c.spend / c.impressions * 1000 : 0;
        c.cpc = c.clicks > 0 ? c.spend / c.clicks : 0;
        c.ctr = c.impressions > 0 ? c.clicks / c.impressions * 100 : 0;
      }
    }

    res.status(200).json({ ads: rows, campaigns: Object.values(campaignMap), since, until });
  } catch (err) {
    console.error('[/api/analytics/ads]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
