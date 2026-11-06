// Gemeinsamer Zugang zur Twitch-API für die Vercel-Funktionen (Dateien mit _ werden nicht als eigene Adresse veröffentlicht).
// Zugangsdaten nur als Umgebungsvariablen im Vercel-Projekt: TWITCH_CLIENT_ID und TWITCH_CLIENT_SECRET.
let token = null;       // bleibt erhalten, solange die Funktion warm ist
let tokenUntil = 0;

const credentials = () => ({
  id: (process.env.TWITCH_CLIENT_ID || '').trim(),      // Leerzeichen vom Einfügen stören Twitch
  secret: (process.env.TWITCH_CLIENT_SECRET || '').trim()
});

async function getToken({ id, secret }) {
  if (token && Date.now() < tokenUntil) return token;
  const body = new URLSearchParams({ client_id: id, client_secret: secret, grant_type: 'client_credentials' });
  const r = await fetch('https://id.twitch.tv/oauth2/token', { method: 'POST', body });
  if (!r.ok) throw new Error(`Twitch token ${r.status}: ${(await r.text()).slice(0, 200)}`);   // Twitch nennt nur den Grund, z. B. „invalid client“
  const j = await r.json();
  token = j.access_token;
  tokenUntil = Date.now() + (j.expires_in - 300) * 1000;
  return token;
}

async function helix(path, creds, retry = true) {
  const r = await fetch(`https://api.twitch.tv/helix/${path}`, { headers: { 'Client-Id': creds.id, Authorization: `Bearer ${await getToken(creds)}` } });
  if (r.status === 401 && retry) { token = null; return helix(path, creds, false); }
  if (!r.ok) throw new Error(`Twitch ${path.split('?')[0]} ${r.status}`);
  return r.json();
}

function send(res, status, body, cache) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (cache) res.setHeader('Cache-Control', cache);
  res.statusCode = status;
  res.end(JSON.stringify(body));
}

module.exports = { credentials, helix, send };
