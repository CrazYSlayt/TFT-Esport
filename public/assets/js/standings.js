/* Tactician's Crown: Tabelle mit Regions-Filter, Platz je Spiel als farbige Chips, Punktebalken und Trennlinie.
   <div data-standings="live"></div> → aktuelle Tabelle (crown-live.js: Score Sheet über /api/crown-standings, sonst gespeichert)
   <div data-standings="1" data-cut="32"></div> → gespeicherter Spieltag (assets/data/crown-standings.js), z. B. im Tagesbericht
   Optional: data-title="id" / data-sub="id" → Überschrift und Unterzeile werden an den Stand angepasst. */
(function () {
  const D = window.TFTE;
  const S = D.crownStandings;
  const { esc, link, icon } = window.UI;
  const REGIONS = ['AMER', 'EMEA', 'APAC', 'CN'];
  const chip = (g) => (g ? `<span class="sg-chip p${g}" title="Place ${g}">${g}</span>` : '<span class="sg-chip is-empty">–</span>');

  // gespeicherter Tag → gleiches Format wie die Live-Tabelle
  function fromDay(day, cut) {
    const rows = (S && S.days[day]) || [];
    return { day: Number(day), label: `after Day ${day}`, games: rows[0] ? rows[0].games.length : 0, gameNo: Number(day) === 1 ? 1 : 7,
      cutLabel: cut ? `Cut – top ${cut} advance` : '', rows: rows.map((r) => ({ ...r, out: !!cut && r.rank > cut })), live: false };
  }

  function render(box, t) {
    const rows = t.rows;
    const max = Math.max(1, ...rows.map((r) => r.pts));
    let region = '';
    const draw = () => {
      const shown = rows.filter((r) => !region || r.region === region);
      const firstOut = shown.findIndex((r) => r.out);
      box.innerHTML = `
        <div class="sg-bar">
          <div class="chips" role="group" aria-label="Filter by region">
            ${['', ...REGIONS].map((r) => `<button type="button" class="chip" data-r="${r}" aria-pressed="${r === region}">${r || 'All'} <span class="chip-count">${r ? rows.filter((x) => x.region === r).length : rows.length}</span></button>`).join('')}
          </div>
          <p class="sg-legend">${t.live ? `<span class="sg-live"><span class="rec-dot" aria-hidden="true"></span>Live · ${esc(t.label)}</span>` : esc(t.label)} <span class="sg-chip p1">1</span>win <span class="sg-chip p3">3</span>top 4 <span class="sg-chip p6">6</span>bottom 4</p>
        </div>
        <div class="sg-wrap"><table class="sg-table">
          <thead><tr><th>#</th><th>Player</th><th class="sg-hide-s">Region</th>${Array.from({ length: t.games }, (_, i) => `<th class="sg-g">G${t.gameNo + i}</th>`).join('')}<th>Points</th></tr></thead>
          <tbody>${shown.map((r, i) => {
            const line = i === firstOut && i > 0 ? `<tr class="sg-cut"><td colspan="${t.games + 4}"><span>${icon('swords')}${esc(t.cutLabel || 'Eliminated')}</span></td></tr>` : '';
            return `${line}<tr class="${r.out ? 'is-out' : ''}${r.rank <= 3 && !r.out ? ` is-top is-top${r.rank}` : ''}">
              <td class="sg-rank">${r.rank}</td>
              <td class="sg-name">${r.login ? `<a href="${link(`tft-streamers/${r.login}.html`)}">${esc(r.name)}</a>` : esc(r.name)}${r.tag ? ` <small>${esc(r.tag)}</small>` : ''}${r.out ? ' <span class="sg-out">Out</span>' : ''}${r.champion ? ` <span class="sg-champ">${window.UI.gameIcon('crown')}World Champion</span>` : ''}${r.checkmate ? ' <span class="sg-check" title="20+ points: the next win takes the title">Checkmate</span>' : ''}<span class="sg-show-s">${esc(r.region)}</span></td>
              <td class="sg-hide-s"><span class="sg-reg r-${esc(r.region.toLowerCase())}">${esc(r.region)}</span></td>
              ${r.games.map((g) => `<td class="sg-g">${chip(g)}</td>`).join('')}
              <td class="sg-pts"><b>${r.pts}</b><span class="sg-meter"><i style="width:${Math.round((r.pts / max) * 100)}%"></i></span></td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>
        <p class="sg-note">${icon('info')}Points per game: 1st = 8 … 8th = 1, points carry over from Day 1. Ties are broken by wins + top 4s, then by placement counts and the most recent game.${S ? ` Source: <a href="${esc(S.source)}" target="_blank" rel="noopener">score sheet</a> (${esc(S.sourceNote)})${t.live ? ', updated automatically' : ''}.` : ''}</p>`;
      box.querySelectorAll('[data-r]').forEach((b) => b.addEventListener('click', () => { region = b.dataset.r; draw(); }));
    };
    draw();
    if (box.dataset.title && document.getElementById(box.dataset.title)) document.getElementById(box.dataset.title).textContent = t.final ? "Tactician's Crown 2026 final: live standings" : `Tactician's Crown standings ${t.label.replace(/^Day/, 'on Day')}`;
    if (box.dataset.sub && document.getElementById(box.dataset.sub)) document.getElementById(box.dataset.sub).textContent = t.day === 1 ? 'Top 32 advance to Day 2 – points carry over.' : t.final ? 'Checkmate final: reach 20 points, then win a game to become World Champion.' : 'Day 2: Rounds of 32, 24, 16 and 8 – the best eight play Sunday\'s final.';
  }

  document.querySelectorAll('[data-standings]').forEach((box) => {
    if (box.dataset.standings === 'live') {
      const first = D.crownTableStatic && D.crownTableStatic();
      if (first) render(box, first);
      if (D.crownTable) {
        const load = (fresh) => D.crownTable(fresh).then((t) => { if (t && t.live) render(box, t); });
        load(false);
        setInterval(() => load(true), 120000);   // offene Seite bleibt aktuell
      }
      return;
    }
    render(box, fromDay(box.dataset.standings, Number(box.dataset.cut || 0)));
  });
})();
