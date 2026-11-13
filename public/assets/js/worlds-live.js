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
    const table = $('wl-standings');
    const setTitle = (t) => { $('wl-title').innerHTML = `<span class="rec-dot" aria-hidden="true"></span>${esc(t)}`; };
    if (!j) {
      setTitle('Live now');
      $('wl-sub').textContent = 'No live lobbies right now. During the Tactician\'s Crown the running lobbies appear here automatically.';
      $('wl-lobbies').innerHTML = `<a class="link-arrow wl-more" href="${link('tft-tournaments.html')}">See all upcoming TFT tournaments${icon('arrow')}</a>`;
      if (table) table.hidden = true;
      return;
    }
    const who = D.crownWho;
    if (table) table.hidden = false;
    if ($('updated') && j.updatedAt) $('updated').textContent = `Updated ${fmtTime(j.updatedAt)}`;
    // Finale
    if (j.final && j.final.rows && j.final.rows.length) {
      const f = j.final;
      const n = Math.max(1, f.gamesPlayed);
      const list = f.rows.map((r) => ({ ...who(r.name), region: r.region, pts: r.pts, round: r.games.slice(0, Math.min(8, n + (f.champion ? 0 : 1))),
        checkmate: r.pts >= 20 && !r.win, champion: !!r.win }));
      const nos = list[0] ? list[0].round.map((_, i) => i + 1) : [];
      setTitle(f.champion ? `${who(f.champion).name} is the TFT World Champion` : 'Tactician\'s Crown final: the live lobby');
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
    setTitle(`Tactician's Crown live lobbies: ${round.name}`);
    $('wl-sub').textContent = `Games ${nos.join(' and ')} · ${played === round.games.length ? 'round complete – next lobbies follow' : played ? `game ${nos[played - 1]} played` : 'about to start'} · points shown are total tournament points`;
    $('wl-lobbies').innerHTML = `<div class="wl-grid">${cards}</div>`;
    $('wl-updated').textContent = j.updatedAt ? `Updated ${fmtTime(j.updatedAt)}` : '';
  }

  // Rechts neben der Tabelle: Durchschnittsplatzierung (AVP) je Region über alle bisher gespielten Spiele aller Spieler
  // der Region (wie im Tab „Regional AVP“ des Score Sheets), dazu Sieg- und Top-4-Quote, wer noch dabei ist und der Beste.
  const REG = [['AMER', 'Americas'], ['EMEA', 'Europe, Middle East & Africa'], ['APAC', 'Asia-Pacific'], ['CN', 'China']];
  const pct = (n, all) => (all ? `${Math.round((n / all) * 100)}%` : '–');
  function renderRegions(t) {
    const el = $('wl-regions');
    const j = D.crownRaw;
    if (!el || !t || !j) return;
    const fin = !!(j.final && j.final.rows && j.final.rows.length);
    const src = fin ? j.final.rows : j.rows;
    const stats = REG.map(([r, full]) => {
      const g = src.filter((x) => x.region === r).flatMap((x) => x.games.filter(Boolean));
      const inn = t.rows.filter((x) => x.region === r && !x.out);
      return { r, full, n: g.length, avp: g.length ? g.reduce((a, b) => a + b, 0) / g.length : null,
        win: g.filter((x) => x === 1).length, top4: g.filter((x) => x <= 4).length, inn: inn.length, all: t.rows.filter((x) => x.region === r).length, best: inn[0] };
    }).filter((s) => !fin || s.all);
    const ranked = stats.slice().sort((a, b) => (a.avp ?? 9) - (b.avp ?? 9));
    el.innerHTML = ranked.map((s, i) => `<div class="wl-reg r-${s.r.toLowerCase()}">
        <p class="wl-reg-head"><b>${i + 1}. ${s.r}</b><span>${esc(s.full)}</span></p>
        <p class="wl-reg-avg"><b>${s.avp ? s.avp.toFixed(2) : '–'}</b><small>avg placement</small></p>
        <span class="wl-reg-bar"><i style="width:${s.avp ? Math.round(((8 - s.avp) / 7) * 100) : 0}%"></i></span>
        <p class="wl-reg-meta">Win ${pct(s.win, s.n)} · Top 4 ${pct(s.top4, s.n)} · ${s.n} games</p>
        <p class="wl-reg-meta">${s.inn}/${s.all} still in${s.best ? ` · best: <a href="${prof(s.best)}">${esc(s.best.name)}</a> (${s.best.rank}.)` : ''}</p>
      </div>`).join('') + `<p class="wl-reg-note">Average placement of every game played by the region's players${fin ? ' in the final' : ''} – lower is better. Same method as the score sheet's “Regional AVP”.</p>`;
  }

  const load = (fresh) => D.crownTable(fresh).then((t) => { render(); renderRegions(t); });
  load(false);
  setInterval(() => load(true), 120000);
})();
