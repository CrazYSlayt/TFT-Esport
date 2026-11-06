// Vercel-Funktion: alle laufenden Teamfight-Tactics-Streams von Twitch, die meisten Zuschauer zuerst.
// Ohne Zugangsdaten antwortet sie mit { source: 'none', reason: 'no-credentials' }; die Seite zeigt dann einen Hinweis.
// Antwortformat wie server.ps1: { source, game, updatedAt, totalStreams, totalViewers, capped, streams: [...] }
const { credentials, helix, send } = require('./_twitch');

const GAME = 'Teamfight Tactics';
const MAX_PAGES = 20;   // 20 × 100 Streams
let gameId = null;

module.exports = async (req, res) => {
  const creds = credentials();
  if (!creds.id || !creds.secret) return send(res, 200, { source: 'none', reason: 'no-credentials' }, 's-maxage=60');
  try {
    if (!gameId) {
      const g = await helix(`games?name=${encodeURIComponent(GAME)}`, creds);
      if (!g.data || !g.data.length) throw new Error('Twitch category not found');
      gameId = g.data[0].id;
    }
    const streams = [];
    let total = 0;
    let cursor = null;
    for (let i = 0; i < MAX_PAGES; i++) {
      const r = await helix(`streams?game_id=${gameId}&type=live&first=100${cursor ? `&after=${cursor}` : ''}`, creds);
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
    // Vercel beantwortet Abrufe eine Minute aus dem Zwischenspeicher
    send(res, 200, { source: 'twitch', game: GAME, updatedAt: new Date().toISOString(), totalStreams: streams.length, totalViewers: total, capped: !!cursor, streams }, 's-maxage=60, stale-while-revalidate=120');
  } catch (err) {
    console.error(err);
    send(res, 502, { source: 'none', reason: 'twitch-error' });
  }
};
