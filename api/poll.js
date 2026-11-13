// Vercel-Funktion: Abstimmungen (z. B. „Wer gewinnt den Tactician's Crown?“) mit gemeinsamer Auswertung.
// Speicher: Upstash Redis, mit dem Vercel-Projekt verbunden (Umgebungsvariablen KV_REST_API_URL / KV_REST_API_TOKEN
// oder UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN). Alle Schlüssel beginnen mit „tfte:“ (Datenbank wird mit
// TFTClimb/TFTArcade geteilt).
//   GET  /api/poll?id=crown26-d1-champion[&voter=…]  → { ok, id, counts: { option: n }, total, mine }
//   POST /api/poll  { id, option, voter }             → dasselbe nach der Stimme (eine Stimme pro Besucher, Ändern zählt um)
// voter: zufällige ID aus dem Browser (localStorage) – keine Konten, keine IP-Adressen gespeichert.
// Gegen Spam: höchstens 20 Stimmen pro Minute je Anschluss; dafür nur ein Hash der IP mit Tagesdatum, 60 s gültig.
const crypto = require('crypto');
const { send } = require('./_twitch');

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const POLL_ID = /^(crown26-(d[1-3]-champion|region)|selftest)$/;   // selftest: nur zum Prüfen nach dem Deploy
const OPTION = /^[\p{L}\p{N} ._'’-]{1,24}$/u;
const VOTER = /^[a-z0-9-]{8,64}$/i;
const MAX_OPTIONS = 12;
const RATE = 20;

// Stimme atomar setzen bzw. umziehen, dann alle Zählungen zurückgeben
const VOTE_LUA = `
local old = redis.call('HGET', KEYS[1], ARGV[1])
if old == ARGV[2] then return redis.call('HGETALL', KEYS[2]) end
if redis.call('HEXISTS', KEYS[2], ARGV[2]) == 0 and redis.call('HLEN', KEYS[2]) >= tonumber(ARGV[3]) then return {'__full__', '0'} end
redis.call('HSET', KEYS[1], ARGV[1], ARGV[2])
redis.call('HINCRBY', KEYS[2], ARGV[2], 1)
if old then
  local n = redis.call('HINCRBY', KEYS[2], old, -1)
  if n <= 0 then redis.call('HDEL', KEYS[2], old) end
end
return redis.call('HGETALL', KEYS[2])`;

async function redis(cmd) {
  const r = await fetch(URL_, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || `redis ${r.status}`);
  return j.result;
}
async function pipeline(cmds) {
  const r = await fetch(`${URL_}/pipeline`, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds) });
  const j = await r.json();
  if (!r.ok) throw new Error(`redis ${r.status}`);
  return j.map((x) => x.result);
}
const toCounts = (flat) => {
  const counts = {};
  for (let i = 0; i + 1 < (flat || []).length; i += 2) { const n = Number(flat[i + 1]); if (n > 0) counts[flat[i]] = n; }
  return counts;
};
const reply = (res, id, counts, mine) => send(res, 200, { ok: true, id, counts, total: Object.values(counts).reduce((a, b) => a + b, 0), mine: mine || null }, 'no-store');

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (_) { return {}; } }
  return new Promise((ok) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 2000) req.destroy(); });
    req.on('end', () => { try { ok(JSON.parse(data || '{}')); } catch (_) { ok({}); } });
    req.on('error', () => ok({}));
  });
}

module.exports = async (req, res) => {
  if (!URL_ || !TOKEN) return send(res, 200, { ok: false, reason: 'no-db' }, 'no-store');
  const q = new URL(req.url, 'http://x').searchParams;
  try {
    if (req.method === 'GET') {
      const id = q.get('id') || '';
      if (!POLL_ID.test(id)) return send(res, 400, { ok: false, reason: 'bad-poll' }, 'no-store');
      const voter = q.get('voter') || '';
      const [flat, mine] = await pipeline([['HGETALL', `tfte:poll:${id}:counts`], VOTER.test(voter) ? ['HGET', `tfte:poll:${id}:votes`, voter] : ['ECHO', '']]);
      return reply(res, id, toCounts(flat), mine || null);
    }
    if (req.method === 'POST') {
      const b = await readBody(req);
      const id = String(b.id || ''), option = String(b.option || '').trim(), voter = String(b.voter || '');
      if (!POLL_ID.test(id) || !OPTION.test(option) || !VOTER.test(voter)) return send(res, 400, { ok: false, reason: 'bad-request' }, 'no-store');
      const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
      const rk = `tfte:rl:${crypto.createHash('sha256').update(`${ip}|${new Date().toISOString().slice(0, 10)}|tfte-poll`).digest('hex').slice(0, 20)}`;
      const [hits] = await pipeline([['INCR', rk], ['EXPIRE', rk, '60']]);
      if (Number(hits) > RATE) return send(res, 429, { ok: false, reason: 'slow-down' }, 'no-store');
      const flat = await redis(['EVAL', VOTE_LUA, '2', `tfte:poll:${id}:votes`, `tfte:poll:${id}:counts`, voter, option, String(MAX_OPTIONS)]);
      if (flat && flat[0] === '__full__') return send(res, 400, { ok: false, reason: 'too-many-options' }, 'no-store');
      return reply(res, id, toCounts(flat), option);
    }
    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { ok: false, reason: 'method' }, 'no-store');
  } catch (e) {
    return send(res, 502, { ok: false, reason: 'db-error' }, 'no-store');
  }
};
