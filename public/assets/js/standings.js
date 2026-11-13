/* Tactician's Crown: Tabelle eines Spieltags (Daten: assets/data/crown-standings.js).
   <div data-standings="1" data-cut="32"></div> → Tabelle mit Regions-Filter, Platz je Spiel als farbige Chips,
   Punktebalken und Trennlinie am Cut. Spieler sind mit ihren Profilen verlinkt. */
(function () {
  const S = window.TFTE.crownStandings;
  const { esc, link, icon } = window.UI;
  if (!S) return;
  const REGIONS = ['AMER', 'EMEA', 'APAC', 'CN'];

  const chip = (g) => `<span class="sg-chip p${g}" title="Place ${g}">${g}</span>`;
  const place = (n) => n + (n % 10 === 1 && n % 100 !== 11 ? 'st' : n % 10 === 2 && n % 100 !== 12 ? 'nd' : n % 10 === 3 && n % 100 !== 13 ? 'rd' : 'th');

  function render(box) {
    const day = box.dataset.standings;
    const rows = S.days[day] || [];
    const cut = Number(box.dataset.cut || 0);
    const max = Math.max(...rows.map((r) => r.pts));
    let region = '';
    const games = rows[0] ? rows[0].games.length : 0;

    const draw = () => {
      const shown = rows.filter((r) => !region || r.region === region);
      box.innerHTML = `
        <div class="sg-bar">
          <div class="chips" role="group" aria-label="Filter by region">
            ${['', ...REGIONS].map((r) => `<button type="button" class="chip" data-r="${r}" aria-pressed="${r === region}">${r || 'All'} <span class="chip-count">${r ? rows.filter((x) => x.region === r).length : rows.length}</span></button>`).join('')}
          </div>
          <p class="sg-legend"><span class="sg-chip p1">1</span>win <span class="sg-chip p3">3</span>top 4 <span class="sg-chip p6">6</span>bottom 4</p>
        </div>
        <div class="sg-wrap"><table class="sg-table">
          <thead><tr><th>#</th><th>Player</th><th class="sg-hide-s">Region</th>${Array.from({ length: games }, (_, i) => `<th class="sg-g">G${i + 1}</th>`).join('')}<th>Points</th></tr></thead>
          <tbody>${shown.map((r) => {
            const out = cut && r.rank > cut;
            const line = cut && !region && r.rank === cut + 1 ? `<tr class="sg-cut"><td colspan="${games + 4}"><span>${icon('swords')}Cut – top ${cut} advance</span></td></tr>` : '';
            return `${line}<tr class="${out ? 'is-out' : ''}${r.rank <= 3 ? ` is-top is-top${r.rank}` : ''}">
              <td class="sg-rank">${r.rank}</td>
              <td class="sg-name">${r.login ? `<a href="${link(`tft-streamers/${r.login}.html`)}">${esc(r.name)}</a>` : esc(r.name)}${r.tag ? ` <small>${esc(r.tag)}</small>` : ''}${out ? ' <span class="sg-out">Out</span>' : ''}<span class="sg-show-s">${esc(r.region)}</span></td>
              <td class="sg-hide-s"><span class="sg-reg r-${esc(r.region.toLowerCase())}">${esc(r.region)}</span></td>
              ${r.games.map((g) => `<td class="sg-g">${chip(g)}</td>`).join('')}
              <td class="sg-pts"><b>${r.pts}</b><span class="sg-meter"><i style="width:${Math.round((r.pts / max) * 100)}%"></i></span></td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>
        <p class="sg-note">${icon('info')}Points per game: 1st = 8 … 8th = 1. Ties are broken by wins + top 4s, then by placement counts and the most recent game. Source: <a href="${esc(S.source)}" target="_blank" rel="noopener">score sheet</a> (${esc(S.sourceNote)}).</p>`;
      box.querySelectorAll('[data-r]').forEach((b) => b.addEventListener('click', () => { region = b.dataset.r; draw(); }));
    };
    draw();
  }
  document.querySelectorAll('[data-standings]').forEach(render);
  window.UI.placeLabel = place;
})();
