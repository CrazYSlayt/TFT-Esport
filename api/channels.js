// Vercel-Funktion: Live-Status einzelner Kanäle, unabhängig vom gestreamten Spiel. Aufruf: /api/channels?login=crazyslayt,anderer
// Antwort: { source: 'twitch', channels: { crazyslayt: { live: true, title, viewers, game, startedAt } | { live: false } } }
// Zwischenspeicher wie in streams.js: CDN plus letzte gute Antwort je Kanal-Liste im Speicher, bei Twitch-Fehlern bis 15 min alt.
const { credentials, helix, send, remember, recall, CACHE_OK, CACHE_ERR } = require('./_twitch');

const MAX_LOGINS = 20;
const FRESH = 45e3;
const FALLBACK = 15 * 6e4;

module.exports = async (req, res) => {
  const creds = credentials();
  if (!creds.id || !creds.secret) return send(res, 200, { source: 'none', reason: 'no-credentials' }, 's-maxage=60');
  const raw = String(new URL(req.url, 'https://x').searchParams.get('login') || '');
  const logins = [...new Set(raw.toLowerCase().split(',').map((s) => s.trim()).filter((s) => /^[a-z0-9_]{3,25}$/.test(s)))].slice(0, MAX_LOGINS);
  if (!logins.length) return send(res, 400, { source: 'none', reason: 'no-login' });
  const key = `channels:${[...logins].sort().join(',')}`;
  const cached = recall(key, FRESH);
  if (cached) return send(res, 200, cached, CACHE_OK);
  try {
    const r = await helix(`streams?type=live&first=${MAX_LOGINS}&${logins.map((l) => `user_login=${l}`).join('&')}`, creds);
    const channels = Object.fromEntries(logins.map((l) => [l, { live: false }]));
    for (const s of r.data) {
      channels[s.user_login.toLowerCase()] = { live: true, title: s.title, viewers: s.viewer_count, game: s.game_name, startedAt: s.started_at, thumb: (s.thumbnail_url || '').replace('{width}x{height}', '640x360') };
    }
    const body = { source: 'twitch', channels };
    remember(key, body);
    send(res, 200, body, CACHE_OK);
  } catch (err) {
    console.error(err);
    const old = recall(key, FALLBACK);
    if (old) return send(res, 200, { ...old, stale: true }, CACHE_ERR);
    send(res, 502, { source: 'none', reason: 'twitch-error' }, CACHE_ERR);
  }
};
