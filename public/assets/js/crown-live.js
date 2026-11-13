/* Tactician's Crown: Tabelle live aus /api/crown-standings (Score Sheet), sonst die gespeicherte (assets/data/crown-standings.js).
   window.TFTE.crownTable(): Promise → { day, label, games (Anzahl Spalten), gameNo (erste Spielnummer), cutLabel, rows, live }
   rows: { rank, name, tag, login, region, pts, games: [Platz|null], out } – Ausgeschiedene stehen hinten. */
(function () {
  const D = window.TFTE;
  const { served } = window.UI;
  const ALIAS = { wasian: 'wasianiverson' };
  const byName = new Map((D.creators || []).map((c) => [c.name.toLowerCase(), c.login]));
  // „FL Chunington“ → Name „Chunington“, Kürzel „FL“, Profil
  function who(full) {
    const parts = String(full).trim().split(/\s+/);
    for (let i = 0; i < parts.length; i++) {
      const n = parts.slice(i).join(' ').toLowerCase();
      const login = ALIAS[n] || byName.get(n);
      if (login) return { name: parts.slice(i).join(' '), tag: parts.slice(0, i).join(' '), login };
    }
    return { name: String(full).trim(), tag: '', login: '' };
  }

  // gespeicherte Tabelle (neuester Tag) im selben Format
  function fromStatic() {
    const S = D.crownStandings;
    if (!S) return null;
    const day = Math.max(...Object.keys(S.days).map(Number));
    const cut = { 1: 32, 2: 8 }[day] || 0;
    const rows = S.days[day].map((r) => ({ ...r, out: !!cut && day === 1 && r.rank > cut }));
    return { day, label: `after Day ${day}`, games: rows[0] ? rows[0].games.length : 0, gameNo: day === 1 ? 1 : 7, cutLabel: day === 1 ? 'Top 32 advance to Day 2' : 'Top 8 reach the final', rows, live: false };
  }

  // Finale (Checkmate): 8 Spieler, Punkte ab 0, ab 20 Punkten reicht ein Sieg – Sieger = Weltmeister
  function fromFinal(f) {
    const played = f.gamesPlayed;
    const rows = f.rows.map((r) => ({ rank: r.rank, ...who(r.name), region: r.region, pts: r.pts, games: r.games.slice(0, Math.max(1, played)), out: false,
      prize: r.prize, checkmate: r.pts >= 20 && !r.win, champion: !!r.win }));
    const label = f.champion ? `Final · ${who(f.champion).name} is World Champion` : played ? `Final · after game ${played}` : 'Final · starting soon';
    return { day: 3, final: true, label, games: Math.max(1, played), gameNo: 1, cutLabel: '', rows, live: true, champion: f.champion ? who(f.champion) : null };
  }

  function fromLive(j) {
    if (j.final && j.final.rows && j.final.rows.length) return fromFinal(j.final);
    const played = j.gamesPlayed;
    const day = played > 6 ? 2 : 1;
    const from = day === 1 ? 0 : 6, to = day === 1 ? 6 : 13;
    const round = j.rounds - 1;                    // letzte Runde mit Lobbys
    const rows = j.rows.map((r) => {
      const p = who(r.name);
      const out = day === 1 ? (played >= 6 && r.rank > 32) : !r.lobbies[round];
      return { rank: r.rank, ...p, region: r.region, pts: r.pts, games: r.games.slice(from, to), lobbies: r.lobbies, out };
    });
    rows.sort((a, b) => (a.out - b.out) || (a.rank - b.rank));
    const dayGames = played - from;
    const label = day === 1 ? (played >= 6 ? 'after Day 1' : `Day 1 · after game ${played}`)
      : (played >= 13 ? 'after Day 2' : `Day 2 · after game ${dayGames} of 7`);
    // nur Spalten zeigen, die schon gespielt sind (Tag 2: mindestens die erste)
    const games = Math.max(day === 1 ? 6 : 1, dayGames);
    rows.forEach((r) => { r.games = r.games.slice(0, games); });
    return { day, label, games, gameNo: from + 1, cutLabel: day === 1 ? 'Top 32 advance to Day 2' : 'Eliminated players are listed below the line', rows, live: true, updatedAt: j.updatedAt };
  }

  let pending = null;
  D.crownTable = (fresh = false) => {
    if (fresh) pending = null;
    if (!pending) {
      pending = (async () => {
        if (served) {
          try {
            const r = await fetch('/api/crown-standings', { cache: 'no-store' });
            const j = await r.json();
            if (j && j.ok && j.rows && j.rows.length) { D.crownRaw = j; return fromLive(j); }
          } catch (_) { /* gespeicherte Tabelle */ }
        }
        return fromStatic();
      })();
    }
    return pending;
  };
  D.crownTableStatic = fromStatic;
  D.crownTableFromLive = fromLive;   // für Tests
  D.crownWho = who;
})();
