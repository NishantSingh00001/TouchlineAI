module.exports = async (req, res) => {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return res.status(503).json({ message: 'Demo mode: configure API_FOOTBALL_KEY in Vercel to request live football data.' });
  const action = req.query.action || 'live';
  const allowed = new Set(['live', 'events', 'statistics', 'lineups']);
  if (!allowed.has(action)) return res.status(400).json({ message: 'Unsupported action.' });
  const fixture = req.query.fixture;
  if (action !== 'live' && !/^\d+$/.test(String(fixture || ''))) return res.status(400).json({ message: 'A numeric fixture ID is required for this action.' });
  const url = new URL(`https://v3.football.api-sports.io/fixtures/${action === 'live' ? '' : action}`);
  if (action === 'live') url.searchParams.set('live', 'all'); else url.searchParams.set('fixture', fixture);
  try {
    const upstream = await fetch(url, { headers: { 'x-apisports-key': key } });
    const body = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=20');
    return res.status(upstream.status).json(body);
  } catch { return res.status(502).json({ message: 'Football data provider is temporarily unavailable.' }); }
};
