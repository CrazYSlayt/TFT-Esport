// Vercel-Funktion: Live-Status einzelner Kanäle, unabhängig vom gestreamten Spiel. Aufruf: /api/channels?login=crazyslayt,anderer
// Antwort: { source: 'twitch', channels: { crazyslayt: { live: true, title, viewers, game, startedAt } | { live: false } } }
const { credentials, helix, send } = require('./_twitch');

const MAX_LOGINS = 20;

module.exports = async (req, res) => {
  const creds = credentials();
  if (!creds.id || !creds.secret) return send(res, 200, { source: 'none', reason: 'no-credentials' }, 's-maxage=60');
  const raw = String(new URL(req.url, 'https://x').searchParams.get('login') || '');
  const logins = [...new Set(raw.toLowerCase().split(',').map((s) => s.trim()).filter((s) => /^[a-z0-9_]{3,25}$/.test(s)))].slice(0, MAX_LOGINS);
  if (!logins.length) return send(res, 400, { source: 'none', reason: 'no-login' });
  try {
    const r = await helix(`streams?type=live&first=${MAX_LOGINS}&${logins.map((l) => `user_login=${l}`).join('&')}`, creds);
    const channels = Object.fromEntries(logins.map((l) => [l, { live: false }]));
    for (const s of r.data) {
      channels[s.user_login.toLowerCase()] = { live: true, title: s.title, viewers: s.viewer_count, game: s.game_name, startedAt: s.started_at, thumb: (s.thumbnail_url || '').replace('{width}x{height}', '640x360') };
    }
    send(res, 200, { source: 'twitch', channels }, 's-maxage=60, stale-while-revalidate=120');
  } catch (err) {
    console.error(err);
    send(res, 502, { source: 'none', reason: 'twitch-error' });
  }
};
