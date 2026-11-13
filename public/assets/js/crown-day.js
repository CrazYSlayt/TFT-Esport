/* Spieltag-Artikel zum Tactician's Crown: Podium, Regionen-Grafik, Lobby-Sieger und Abstimmungen aus den Tabellendaten
   (assets/data/crown-standings.js). <main data-crown-day="1" data-cut="32">.
   Abstimmungen: Die Wahl wird nur auf dem Gerät gespeichert (noch keine gemeinsame Auswertung). */
(function () {
  const S = window.TFTE.crownStandings;
  const { esc, link, icon, crown } = window.UI;
  const root = document.querySelector('[data-crown-day]');
  if (!S || !root) return;
  const day = root.dataset.crownDay;
  const cut = Number(root.dataset.cut || 0);
  const rows = S.days[day] || [];
  const $ = (id) => document.getElementById(id);
  const prof = (r) => (r.login ? link(`tft-streamers/${r.login}.html`) : '#');
  const chips = (g) => g.map((p) => `<span class="sg-chip p${p}">${p}</span>`).join('');
  const REGIONS = [['AMER', 'Americas'], ['EMEA', 'Europe, Middle East & Africa'], ['APAC', 'Asia-Pacific'], ['CN', 'China']];

  /* Podium: die ersten vier */
  if ($('cd-podium')) {
    $('cd-podium').innerHTML = rows.slice(0, 4).map((r) => `<a class="cd-pod is-${r.rank}" href="${prof(r)}">
        <span class="cd-pod-rank">${r.rank === 1 ? crown() : ''}${r.rank}</span>
        <span class="cd-pod-who"><b>${esc(r.name)}</b><small>${esc(r.tag ? `${r.tag} · ` : '')}${esc(r.region)}</small></span>
        <span class="cd-pod-pts"><b>${r.pts}</b><small>points</small></span>
        <span class="cd-pod-games">${chips(r.games)}</span>
      </a>`).join('');
  }

  /* Regionen: wer ist weiter */
  if ($('cd-regions')) {
    $('cd-regions').innerHTML = REGIONS.map(([r, full]) => {
      const all = rows.filter((x) => x.region === r);
      const inn = all.filter((x) => !cut || x.rank <= cut);
      const avg = all.reduce((a, x) => a + x.pts, 0) / (all.length || 1);
      const best = all[0];
      return `<div class="cd-reg r-${r.toLowerCase()}">
          <div class="cd-reg-head"><b>${r}</b><small>${full}</small></div>
          <div class="cd-reg-bar" role="img" aria-label="${inn.length} of ${all.length} players advance">${all.map((x) => `<i class="${!cut || x.rank <= cut ? 'is-in' : ''}"></i>`).join('')}</div>
          <p class="cd-reg-nums"><b>${inn.length}/${all.length}</b> advance · avg <b>${avg.toFixed(1)}</b> pts</p>
          ${best ? `<p class="cd-reg-best">Best: <a href="${prof(best)}">${esc(best.name)}</a> (${best.rank}.)</p>` : ''}
        </div>`;
    }).join('');
  }

  /* Lobby-Sieger je Spiel */
  if ($('cd-lobbies')) {
    const games = rows[0] ? rows[0].games.length : 0;
    $('cd-lobbies').innerHTML = Array.from({ length: games }, (_, g) => {
      const winners = rows.filter((r) => r.games[g] === 1).sort((a, b) => a.lobbies[Math.floor(g / 2)].localeCompare(b.lobbies[Math.floor(g / 2)]));
      return `<div class="cd-game"><p class="cd-game-head">Game ${g + 1}</p><ul>${winners.map((r) => `<li><span class="cd-lob">${esc(r.lobbies[Math.floor(g / 2)])}</span><a href="${prof(r)}">${esc(r.name)}</a><small>${esc(r.region)}</small></li>`).join('')}</ul></div>`;
    }).join('');
  }

  /* Verlauf: Zwischenrang nach jedem Spiel (nur Punkte; gleiche Punkte = gleicher Rang) als kleine Kurve.
     <div data-race="Maris" data-race-note="…"></div> */
  const games = rows[0] ? rows[0].games.length : 0;
  const after = Array.from({ length: games }, (_, k) => {
    const sc = rows.map((r) => ({ n: r.name, s: r.games.slice(0, k + 1).reduce((a, g) => a + (9 - g), 0) }));
    return Object.fromEntries(sc.map((x) => [x.n, 1 + sc.filter((y) => y.s > x.s).length]));
  });
  document.querySelectorAll('[data-race]').forEach((el) => {
    const r = rows.find((x) => x.name === el.dataset.race);
    if (!r) return;
    const path = after.map((m) => m[r.name]);
    const n = rows.length, W = 260, H = 96, px = (i) => 14 + (i * (W - 28)) / (games - 1), py = (rk) => 10 + ((rk - 1) * (H - 20)) / (n - 1);
    const cy = cut ? py(cut + 0.5) : 0;
    el.innerHTML = `<div class="cd-race-head"><a href="${prof(r)}"><b>${esc(r.name)}</b></a><small>${esc(r.region)} · final ${r.rank}. · ${r.pts} pts</small></div>
      <svg class="cd-race-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(r.name)}: rank after each game ${path.join(', ')}">
        ${cut ? `<line class="cd-race-cut" x1="0" x2="${W}" y1="${cy}" y2="${cy}"/><text class="cd-race-cut-t" x="${W - 4}" y="${cy - 3}" text-anchor="end">cut</text>` : ''}
        <polyline class="cd-race-line" points="${path.map((rk, i) => `${px(i)},${py(rk)}`).join(' ')}"/>
        ${path.map((rk, i) => `<circle class="cd-race-dot p${r.games[i]}" cx="${px(i)}" cy="${py(rk)}" r="5"/><text class="cd-race-t" x="${px(i)}" y="${py(rk) + (rk > n / 2 ? -9 : 17)}" text-anchor="middle">${rk}</text>`).join('')}
      </svg>
      <p class="cd-race-games">${r.games.map((g, i) => `<span>G${i + 1} ${`<span class="sg-chip p${g}">${g}</span>`}</span>`).join('')}</p>`;
  });

  /* Abstimmungen: gemeinsame Auswertung über /api/poll (Upstash Redis). Ohne Datenbank oder lokal per Doppelklick
     bleibt die Wahl nur auf dem Gerät. Ergebnisse erscheinen erst nach der eigenen Stimme. */
  const { served } = window.UI;
  const read = (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } };
  const write = (k, v) => { try { localStorage.setItem(k, v); } catch (_) { /* privat */ } };
  let voter = read('tfte-voter');
  if (!voter) {
    voter = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `v${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    write('tfte-voter', voter);
  }
  const api = async (id, option) => {
    if (!served) return null;
    try {
      const r = option
        ? await fetch('/api/poll', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, option, voter }) })
        : await fetch(`/api/poll?id=${encodeURIComponent(id)}&voter=${encodeURIComponent(voter)}`, { cache: 'no-store' });
      const j = await r.json();
      return j && j.ok ? j : null;
    } catch (_) { return null; }
  };
  document.querySelectorAll('[data-poll]').forEach((box) => {
    const kind = box.dataset.poll;
    const pollId = kind === 'champion' ? `crown26-d${day}-champion` : 'crown26-region';
    const key = `tfte-poll-${pollId}`;
    const opts = kind === 'champion'
      ? [...rows.filter((r) => !cut || r.rank <= cut).slice(0, 8).map((r) => ({ id: r.name, label: r.name, sub: `${r.rank}. · ${r.region}` })), { id: 'other', label: 'Someone else', sub: `from the top ${cut || rows.length}` }]
      : REGIONS.map(([r, full]) => ({ id: r, label: r, sub: full }));
    let result = null;   // { counts, total } vom Server
    const draw = () => {
      const pick = read(key);
      const showRes = !!(result && pick);
      const total = result ? result.total : 0;
      box.querySelector('.cd-poll-opts').innerHTML = opts.map((o) => {
        const n = result && result.counts[o.id] ? result.counts[o.id] : 0;
        const pct = total ? Math.round((n / total) * 100) : 0;
        return `<button type="button" class="cd-opt${showRes ? ' has-res' : ''}" data-id="${esc(o.id)}" aria-pressed="${pick === o.id}"${showRes ? ` style="--pct:${pct}%"` : ''}>
          <b>${esc(o.label)}</b><small>${showRes ? `${pct}% · ${n}` : esc(o.sub)}</small>${pick === o.id ? icon('star') : ''}</button>`;
      }).join('');
      const label = pick ? (opts.find((o) => o.id === pick) || {}).label || pick : '';
      box.querySelector('.cd-poll-foot').textContent = result
        ? (pick ? `Your pick: ${label} · ${total} vote${total === 1 ? '' : 's'} so far. Tap another option to change your vote.` : `${total} vote${total === 1 ? '' : 's'} so far – vote to see the results.`)
        : (pick ? `Your pick: ${label} – saved on this device.` : 'Tap an option to lock in your pick.');
    };
    box.addEventListener('click', async (e) => {
      const b = e.target.closest('.cd-opt');
      if (!b) return;
      const same = read(key) === b.dataset.id;
      write(key, b.dataset.id);
      draw();
      const now = box.querySelector(`.cd-opt[data-id="${CSS.escape(b.dataset.id)}"]`);
      if (now) { now.classList.add('is-pop'); setTimeout(() => now.classList.remove('is-pop'), 450); }
      if (!same) {
        const r = (now || b).getBoundingClientRect();
        confetti(r.left + r.width / 2, r.top + r.height / 2);
        toast(box, `Locked in: ${(opts.find((o) => o.id === b.dataset.id) || {}).label || b.dataset.id}!`);
        const j = await api(pollId, b.dataset.id);
        if (j) { result = j; draw(); }
      }
    });
    draw();
    api(pollId).then((j) => {
      if (!j) return;
      result = j;
      if (j.mine && j.mine !== read(key)) write(key, j.mine);   // Stimme vom Server übernehmen (z. B. nach Gerätewechsel desselben Browsers)
      if (!j.mine && read(key)) api(pollId, read(key)).then((k) => { if (k) { result = k; draw(); } });   // lokale Wahl von vorher nachtragen
      draw();
    });
  });

  /* Klick-Feedback: Konfetti in Grün und Gold und eine kurze Meldung */
  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function confetti(x, y) {
    if (calm) return;
    const colors = ['#f1be29', '#ffe28a', '#2eac59', '#295c3a', '#ffffff', '#c48d12'];
    const layer = document.createElement('div');
    layer.className = 'cd-confetti';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    for (let i = 0; i < 46; i++) {
      const p = document.createElement('i');
      const angle = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 150;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--dy', `${Math.sin(angle) * dist - 60}px`);
      p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
      p.style.animationDelay = `${Math.random() * 60}ms`;
      if (i % 3 === 0) p.classList.add('is-round');
      layer.appendChild(p);
    }
    setTimeout(() => layer.remove(), 1400);
  }
  function toast(box, text) {
    let t = box.querySelector('.cd-toast');
    if (!t) { t = document.createElement('p'); t.className = 'cd-toast'; t.setAttribute('role', 'status'); box.appendChild(t); }
    t.textContent = text;
    t.classList.remove('is-on');
    void t.offsetWidth;
    t.classList.add('is-on');
  }
})();
