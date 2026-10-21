// --- per-IP burst guard (added by security hardening) ---
const __rlBuckets = (globalThis.__rlBuckets = globalThis.__rlBuckets || new Map());
function __rateLimited(req, res, limit = 20, windowMs = 600000) {
  const ip = ((req.headers && req.headers["x-forwarded-for"]) || "").split(",")[0].trim() || "unknown";
  const now = Date.now();
  const hits = (__rlBuckets.get(ip) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) { res.status(429).json({ error: "Too many requests from this network. Please wait a minute and try again." }); return true; }
  hits.push(now); __rlBuckets.set(ip, hits); return false;
}

module.exports = async (req, res) => {
  if (__rateLimited(req, res)) return;
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return res.status(503).json({ message: 'YouTube API key is not configured.' });
  const q = String(req.query.q || '').slice(0, 160);
  const region = /^[A-Z]{2}$/.test(String(req.query.region || '').toUpperCase()) ? String(req.query.region).toUpperCase() : 'IN';
  if (!q) return res.status(400).json({ message: 'Search text is required.' });
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  Object.entries({ part: 'snippet', type: 'video', maxResults: '9', q, regionCode: region, safeSearch: 'moderate', key }).forEach(([k,v])=>url.searchParams.set(k,v));
  try {
    const upstream = await fetch(url);
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ message: data.error?.message || 'YouTube search failed.' });
    const items = (data.items || []).filter(x=>x.id?.videoId).map(x=>({ id:x.id.videoId, title:x.snippet.title, channel:x.snippet.channelTitle, published:x.snippet.publishedAt, thumbnail:x.snippet.thumbnails?.medium?.url || x.snippet.thumbnails?.default?.url }));
    res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ items });
  } catch { return res.status(502).json({ message: 'YouTube is temporarily unavailable.' }); }
};
