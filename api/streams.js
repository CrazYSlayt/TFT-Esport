// Vercel-Funktion: alle laufenden Teamfight-Tactics-Streams von Twitch, die meisten Zuschauer zuerst.
// Zugangsdaten nur als Umgebungsvariablen im Vercel-Projekt: TWITCH_CLIENT_ID und TWITCH_CLIENT_SECRET.
// Ohne Zugangsdaten antwortet sie mit { source: 'none', reason: 'no-credentials' }; die Seite zeigt dann einen Hinweis.
// Antwortformat wie server.ps1: { source, game, updatedAt, totalStreams, totalViewers, capped, streams: [...] }
const GAME = 'Teamfight Tactics';
const MAX_PAGES = 20;   // 20 × 100 Streams

let token = null;       // bleibt erhalten, solange die Funktion warm ist
let tokenUntil = 0;
let gameId = null;

async function getToken(id, secret) {
  if (token && Date.now() < tokenUntil) return token;
  const body = new URLSearchParams({ client_id: id, client_secret: secret, grant_type: 'client_credentials' });
  const r = await fetch('https://id.twitch.tv/oauth2/token', { method: 'POST', body });
  if (!r.ok) throw new Error(`Twitch token ${r.status}: ${(await r.text()).slice(0, 200)}`);   // Twitch nennt nur den Grund, z. B. „invalid client“
  const j = await r.json();
  token = j.access_token;
  tokenUntil = Date.now() + (j.expires_in - 300) * 1000;
  return token;
}

async function helix(path, id, secret, retry = true) {
  const r = await fetch(`https://api.twitch.tv/helix/${path}`, { headers: { 'Client-Id': id, Authorization: `Bearer ${await getToken(id, secret)}` } });
  if (r.status === 401 && retry) { token = null; return helix(path, id, secret, false); }
  if (!r.ok) throw new Error(`Twitch ${path.split('?')[0]} ${r.status}`);
  return r.json();
}

module.exports = async (req, res) => {
  const id = (process.env.TWITCH_CLIENT_ID || '').trim();      // Leerzeichen vom Einfügen stören Twitch
  const secret = (process.env.TWITCH_CLIENT_SECRET || '').trim();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (!id || !secret) {
    res.setHeader('Cache-Control', 's-maxage=60');
    res.statusCode = 200;
    res.end(JSON.stringify({ source: 'none', reason: 'no-credentials' }));
    return;
  }
  try {
    if (!gameId) {
      const g = await helix(`games?name=${encodeURIComponent(GAME)}`, id, secret);
      if (!g.data || !g.data.length) throw new Error('Twitch category not found');
      gameId = g.data[0].id;
    }
    const streams = [];
    let total = 0;
    let cursor = null;
    for (let i = 0; i < MAX_PAGES; i++) {
      const r = await helix(`streams?game_id=${gameId}&type=live&first=100${cursor ? `&after=${cursor}` : ''}`, id, secret);
      for (const s of r.data) {
        total += s.viewer_count;
        streams.push({
          login: s.user_login, name: s.user_name, title: s.title, viewers: s.viewer_count, lang: s.language, startedAt: s.started_at,
          thumb: s.thumbnail_url.replace('{width}x{height}', '440x248'), tags: (s.tags || []).slice(0, 3), mature: !!s.is_mature
        });
      }
      cursor = r.pagination && r.pagination.cursor;
      if (!cursor || !r.data.length) { cursor = null; break; }   // Twitch liefert auch mitten in der Liste manchmal weniger als 100
    }
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');   // Vercel beantwortet Abrufe eine Minute aus dem Zwischenspeicher
    res.statusCode = 200;
    res.end(JSON.stringify({ source: 'twitch', game: GAME, updatedAt: new Date().toISOString(), totalStreams: streams.length, totalViewers: total, capped: !!cursor, streams }));
  } catch (err) {
    console.error(err);
    res.statusCode = 502;
    res.end(JSON.stringify({ source: 'none', reason: 'twitch-error' }));
  }
};
