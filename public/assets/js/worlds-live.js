/* Live Matches: die Lobbys des Tactician's Crown, die gerade spielen (Score Sheet über /api/crown-standings, crown-live.js).
   Zeigt die Lobbys der aktuellen Runde mit den Platzierungen der Runde, im Finale die Final-Lobby mit Checkmate-Stand.
   Darunter steht die komplette Live-Tabelle (standings.js, data-standings="live"). Aktualisiert sich alle 2 Minuten. */
(function () {
  const D = window.TFTE;
  const { esc, link, icon, gameIcon, fmtTime } = window.UI;
  const box = document.getElementById('worlds-live');
  if (!box || !D.crownTable) return;
  const $ = (id) => document.getElementById(id);
  const ROUNDS = [
    { name: 'Day 1 · Round 1', games: [0, 1] }, { name: 'Day 1 · Round 2', games: [2, 3] }, { name: 'Day 1 · Round 3', games: [4, 5] },
    { name: 'Day 2 · Round of 32', games: [6, 7] }, { name: 'Day 2 · Round of 24', games: [8, 9] },
    { name: 'Day 2 · Round of 16', games: [10, 11] }, { name: 'Day 2 · Round of 8', games: [12] }
  ];
  const chip = (g) => (g ? `<span class="sg-chip p${g}">${g}</span>` : '<span class="sg-chip is-empty">–</span>');
  const prof = (p) => (p.login ? link(`tft-streamers/${p.login}.html`) : '#');
  const player = (p) => `<a href="${prof(p)}">${p.champion ? gameIcon('crown', 'wl-champ') : ''}${esc(p.name)}</a>${p.tag ? ` <small>${esc(p.tag)}</small>` : ''}`;

  function lobbyCard(title, sub, list, gameNos) {
    return `<div class="wl-lobby">
      <p class="wl-lobby-head"><b>${esc(title)}</b><span>${esc(sub)}</span></p>
      <table class="wl-table"><thead><tr><th>Player</th>${gameNos.map((n) => `<th>G${n}</th>`).join('')}<th>Pts</th></tr></thead>
        <tbody>${list.map((p) => `<tr class="${p.champion ? 'is-champ' : ''}">
          <td class="wl-name">${player(p)}<span class="sg-reg r-${esc((p.region || '').toLowerCase())}">${esc(p.region || '')}</span>${p.checkmate ? '<span class="sg-check">CM</span>' : ''}</td>
          ${p.round.map(chip).map((c) => `<td class="wl-g">${c}</td>`).join('')}
          <td class="wl-pts"><b>${p.pts}</b></td></tr>`).join('')}</tbody></table>
    </div>`;
  }

  function render() {
    const j = D.crownRaw;
    if (!j) { box.hidden = true; return; }
    const who = D.crownWho;
    box.hidden = false;
    // Finale
    if (j.final && j.final.rows && j.final.rows.length) {
      const f = j.final;
      const n = Math.max(1, f.gamesPlayed);
      const list = f.rows.map((r) => ({ ...who(r.name), region: r.region, pts: r.pts, round: r.games.slice(0, Math.min(8, n + (f.champion ? 0 : 1))),
        checkmate: r.pts >= 20 && !r.win, champion: !!r.win }));
      const nos = list[0] ? list[0].round.map((_, i) => i + 1) : [];
      $('wl-title').textContent = f.champion ? `${who(f.champion).name} is the TFT World Champion` : 'Tactician\'s Crown final: the live lobby';
      $('wl-sub').textContent = f.champion ? 'Checkmate complete – final standings below.' : `Checkmate: 20 points, then a win takes the title · ${f.gamesPlayed} game${f.gamesPlayed === 1 ? '' : 's'} played`;
      $('wl-lobbies').innerHTML = `<div class="wl-grid is-final">${lobbyCard('Final lobby', 'points from 0 · CM = on checkmate', list, nos)}</div>`;
      return;
    }
    // Gruppenphase: aktuelle Runde
    const r = Math.max(0, j.rounds - 1);
    const round = ROUNDS[r] || ROUNDS[0];
    const played = round.games.filter((g) => j.rows.some((p) => p.games[g] !== null)).length;
    const lettered = j.rows.filter((p) => p.lobbies[r]);
    const letters = [...new Set(lettered.map((p) => p.lobbies[r]))].sort();
    const nos = round.games.map((g) => g + 1);
    const cards = letters.map((L) => {
      const list = lettered.filter((p) => p.lobbies[r] === L).map((p) => ({ ...who(p.name), region: p.region, pts: p.pts, round: round.games.map((g) => p.games[g]) }))
        .sort((a, b) => (b.round.reduce((s, g) => s + (g ? 9 - g : 0), 0) - a.round.reduce((s, g) => s + (g ? 9 - g : 0), 0)) || (b.pts - a.pts));
      return lobbyCard(`Lobby ${L}`, `${list.length} players`, list, nos);
    }).join('');
    $('wl-title').textContent = `Tactician's Crown live lobbies: ${round.name}`;
    $('wl-sub').textContent = `Games ${nos.join(' and ')} · ${played === round.games.length ? 'round complete – next lobbies follow' : played ? `game ${nos[played - 1]} played` : 'about to start'} · points shown are total tournament points`;
    $('wl-lobbies').innerHTML = `<div class="wl-grid">${cards}</div>`;
    $('wl-updated').textContent = j.updatedAt ? `Updated ${fmtTime(j.updatedAt)}` : '';
  }

  const load = (fresh) => D.crownTable(fresh).then(render);
  load(false);
  setInterval(() => load(true), 120000);
})();
