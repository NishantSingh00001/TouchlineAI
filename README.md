# TOUCHLINE — Match Intelligence

A free-first, multi-page football analysis prototype for Vercel. Pages work in demo mode without credentials:

- `index.html` — match room, sample event timeline, rule-based tactical prompts, country-aware official streaming link.
- `dream-league.html` — editable player lineups, CSV import/template download, explainable matchup probabilities, animated five-minute mini-match.
- `clips.html` — search official YouTube-published clips, with a direct YouTube fallback when no API key is configured; regional streaming destination.
- `method.html` — model notes, limitations, sources, and setup information.

## Deploy on Vercel

1. Upload the contents of this folder to a GitHub repository.
2. In Vercel, import that repository. No build command or framework preset is needed; leave the output directory at the project root.
3. Deploy. Demo mode works immediately.
4. Optional: in **Project → Settings → Environment Variables**, add `API_FOOTBALL_KEY` and/or `YOUTUBE_API_KEY`, then redeploy. These values are read only by serverless functions under `/api`; never put them in browser code.

The region endpoint reads Vercel's `x-vercel-ip-country` request header. Local preview falls back to the browser language and then India. The country dropdown lets a visitor override region and stores that preference locally.

## Free connectors

- API-Football has a documented free tier (quota and competition coverage can change). `API_FOOTBALL_KEY` enables `/api/football?action=live`; fixture detail actions require a `fixture` query parameter. Keep within the account quota.
- YouTube Data API search requires a Google Cloud project/API key and quota. `YOUTUBE_API_KEY` enables `/api/clips?q=...&region=IN`. Without it, the app offers direct YouTube search instead.
- No API keys are included in this archive. Both connectors are optional; the full interactive demo works without them.

## Important behavior

- Match-room sample scores, events, and coaching cues are labeled as sample/synthetic. Live data access is an optional connector; this demo UI does not yet automatically select and render a particular live fixture.
- The five-minute Dream League simulation is synthetic and illustrative, not a real match forecast.
- YouTube clips open on YouTube. TOUCHLINE does not host or restream match footage.
- Streaming rights vary by league, territory, and season. A regional provider link is a starting point and does not guarantee that a specific match is available. The rights holder controls subscriptions and access. Use the competition's official broadcaster guide when a verified event-specific destination is needed.
- In the India mapping, provider links use JioHotstar/JioStar. For other countries, the current Premier League broadcaster list provides the mapped regional provider starting points. Users can change country manually.

## Sources

- [Vercel request headers](https://vercel.com/docs/headers/request-headers)
- [API-Football free tier guide](https://www.api-football.com/news/post/how-to-get-started-with-api-football-the-complete-beginner-s-guide)
- [YouTube Data API search](https://developers.google.com/youtube/v3/docs/search/list)
- [Premier League broadcasters](https://www.premierleague.com/ar/media/broadcasters)
- [Indian Super League broadcasters](https://www.indiansuperleague.com/broadcasters)
