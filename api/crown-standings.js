// Vercel-Funktion: aktuelle Tabelle des Tactician's Crown direkt aus dem Score Sheet (Google Sheets, öffentlicher CSV-Export).
// So bleibt die Tabelle auf der Seite aktuell, ohne dass jemand etwas einträgt oder neu veröffentlicht.
// Antwort: { ok, updatedAt, gamesPlayed, rounds, rows: [{ rank, name, region, pts, games: [13 × Platz|null], lobbies: [7 × Lobby|''] }] }
// Spalten im Sheet (Zeile „GROUP STANDINGS“): links Rang/Region/Name/Punkte in der offiziellen Reihenfolge,
// rechts je Spieler L, G1, G2, L, G3, G4 … L, G13. Zwischenspeicher: 45 s im Speicher, CDN 60 s.
const { send } = require('./_twitch');

const BASE = 'https://docs.google.com/spreadsheets/d/1hdpC1heu2AU3MMfCbUNRXH7vgBRFABpyYbZLrhSXDo8/export?format=csv&gid=';
const SHEET = BASE + '142365733';   // Group Stage (Tag 1 und 2)
const FINAL = BASE + '794316248';   // Final Day (Checkmate)
const GAME_COLS = [10, 11, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26, 28];   // G1 … G13
const LOBBY_COLS = [9, 12, 15, 18, 21, 24, 27];                              // Lobby je Runde
let memo = null;

function parse(text) {
  const rows = []; let row = []; let f = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; continue; }
    if (ch === '"') q = true; else if (ch === ',') { row.push(f); f = ''; } else if (ch === '\n') { row.push(f); rows.push(row); row = []; f = ''; } else if (ch !== '\r') f += ch;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows;
}

function build(csv) {
  const rows = parse(csv.replace(/^﻿/, ''));
  const head = rows.findIndex((r) => r[0] === 'GROUP STANDINGS');
  if (head < 0) throw new Error('sheet layout changed');
  const data = rows.slice(head + 1).filter((r) => /^\d+$/.test(r[0]));
  const byName = new Map(data.map((r) => [r[7], r]));
  const num = (v) => (/^[1-8]$/.test(String(v).trim()) ? Number(v) : null);
  const out = data.map((r) => {
    const p = byName.get(r[2]);
    if (!p) throw new Error('player missing: ' + r[2]);
    return {
      rank: Number(r[0]), name: r[2].trim(), region: r[1].trim(), pts: Number(r[3]),
      games: GAME_COLS.map((c) => num(p[c])), lobbies: LOBBY_COLS.map((c) => String(p[c] || '').trim())
    };
  });
  const gamesPlayed = GAME_COLS.reduce((n, _, i) => (out.some((r) => r.games[i] !== null) ? i + 1 : n), 0);
  const rounds = LOBBY_COLS.reduce((n, _, i) => (out.some((r) => r.lobbies[i]) ? i + 1 : n), 0);
  return { ok: true, updatedAt: new Date().toISOString(), gamesPlayed, rounds, source: SHEET.replace(/export\?.*$/, 'htmlview'), rows: out };
}

// Final Day: links Platz („1st - $150k“), rechts je Spieler Region, Name, Pts, G1 … G8, Total, …, Win (TRUE/FALSE)
function buildFinal(csv) {
  const rows = parse(csv.replace(/^\uFEFF/, ''));
  const head = rows.findIndex((r) => r[0] === 'Final Standings');
  if (head < 0) return null;
  const data = rows.slice(head + 1).filter((r) => /^\d(st|nd|rd|th)\b/.test(r[0] || ''));
  const num = (v) => (/^[1-8]$/.test(String(v).trim()) ? Number(v) : null);
  const players = data.filter((r) => String(r[8] || '').trim()).map((r) => ({
    name: r[8].trim(), region: String(r[7] || '').trim(), pts: Number(r[9]) || 0,
    games: [10, 11, 12, 13, 14, 15, 16, 17].map((c) => num(r[c])), win: String(r[r.length - 1]).trim().toUpperCase() === 'TRUE'
  }));
  if (!players.length) return null;
  // Reihenfolge links (offiziell, mit Tiebreakern) samt Preisgeld
  const order = data.map((r, i) => ({ place: i + 1, prize: (String(r[0]).split(' - ')[1] || '').trim(), name: String(r[2] || '').trim() }));
  const byName = new Map(players.map((p) => [p.name, p]));
  const ranked = order.filter((o) => byName.has(o.name)).map((o) => ({ rank: o.place, prize: o.prize, ...byName.get(o.name) }));
  const list = ranked.length === players.length ? ranked : players.map((p, i) => ({ rank: i + 1, prize: (order[i] || {}).prize || '', ...p }));
  const gamesPlayed = [0, 1, 2, 3, 4, 5, 6, 7].reduce((n, i) => (list.some((p) => p.games[i] !== null) ? i + 1 : n), 0);
  return { gamesPlayed, champion: (list.find((p) => p.win) || {}).name || '', rows: list };
}

module.exports = async (req, res) => {
  if (memo && Date.now() - memo.at < 45e3) return send(res, 200, memo.body, 's-maxage=60, stale-while-revalidate=300');
  try {
    const [r, rf] = await Promise.all([fetch(SHEET, { redirect: 'follow' }), fetch(FINAL, { redirect: 'follow' }).catch(() => null)]);
    if (!r.ok) throw new Error(`sheet ${r.status}`);
    const body = build(await r.text());
    try { if (rf && rf.ok) body.final = buildFinal(await rf.text()); } catch (_) { body.final = null; }
    memo = { at: Date.now(), body };
    return send(res, 200, body, 's-maxage=60, stale-while-revalidate=300');
  } catch (e) {
    if (memo && Date.now() - memo.at < 30 * 6e4) return send(res, 200, { ...memo.body, stale: true }, 's-maxage=30');
    return send(res, 502, { ok: false, reason: 'sheet-error' }, 's-maxage=15');
  }
};

module.exports.build = build;   // für lokale Tests
module.exports.buildFinal = buildFinal;
