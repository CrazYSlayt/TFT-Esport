/* Live Matches: was heute läuft (oder als Nächstes kommt), Spielplan heute und der nächsten 7 Tage, letzte Ergebnisse.
   Grundlage sind die Turniere aus dem Kalender (assets/data/turniere.js). „Live“ heißt hier: heute ist Spieltag –
   mit bekannter Startzeit ab dieser Uhrzeit. Echte Live-Punktestände kommen erst mit einer Datenquelle;
   bis dahin zeigt die Karte den Stand, den die Redaktion unter „Ergebnis“ einträgt.
   Letzte Ergebnisse: nur offizielle Turniere – vergangene inoffizielle Cups pflegen wir bewusst nicht nach. */
(function () {
  const D = window.TFTE;
  const { icon, esc, tag, label, empty, cupUrl, cupDays, cupDates, cupNext, cupPast, cupEnd, upcomingCups, endOf, toDate, ymd,
    fmtDay, fmtTime, hostOf, startOfToday, SET_ICON } = window.UI;
  const $ = (id) => document.getElementById(id);
  const longDay = (d) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const hasTime = (iso) => /T\d\d:\d\d/.test(iso || '');
  const blocksOn = (c, key) => cupDays(c).filter((b) => key >= b.from.slice(0, 10) && key <= b.to.slice(0, 10));
  const daysUntil = (key) => Math.round((toDate(key) - startOfToday()) / 864e5);
  const relDays = (n) => (n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`);
  const SHORT_LEVEL = { offiziell: 'Official', regional: 'Regional', streamer: 'Streamer cup', eigener: 'Own cup' };
  const levelTag = (c) => tag(SHORT_LEVEL[c.level] || label('cupLevels', c.level), c.level);
  // „twitch.tv/teamfighttactics“ statt der ganzen Adresse
  const shortUrl = (url) => { try { const u = new URL(url); return hostOf(url) + u.pathname.replace(/\/$/, ''); } catch (_) { return url; } };
  const watch = (c) => (c.streamUrl
    ? `<a class="watch-chip" href="${esc(c.streamUrl)}" target="_blank" rel="noopener">${icon(/twitch/.test(c.streamUrl) ? 'twitch' : 'play')}${esc(shortUrl(c.streamUrl))}</a>`
    : '<span class="watch-none">Stream not announced yet</span>');
  const top = (c) => (c.result && c.result.top ? c.result.top.filter((t) => t.name) : []);

  // Platzierungen (Ergebnis oder von der Redaktion eingetragener Zwischenstand)
  const standings = (c, n) => `<ol class="podium">${top(c).slice(0, n).map((t, i) => `<li class="p${i + 1}">
      <span class="pos">${i + 1}</span><span class="who">${esc(t.name)}</span>${t.points !== undefined && t.points !== '' ? `<b>${esc(t.points)} pts</b>` : ''}</li>`).join('')}</ol>`;

  /* ---------- Live jetzt / Als Nächstes ---------- */
  function liveCard(c, key) {
    const b = blocksOn(c, key)[0];
    const dates = [...new Set(cupDates(c))].sort();
    const now = new Date();
    const start = hasTime(b.from) ? toDate(`${key}T${b.from.slice(11, 16)}`) : null;
    const isLive = start && now >= start;
    const badge = isLive ? '<span class="lc-badge is-live">Live</span>' : '<span class="lc-badge is-today">Today</span>';
    const when = start ? (isLive ? `since ${fmtTime(start.toISOString())}` : `from ${fmtTime(start.toISOString())}`) : 'start time not announced';
    return `<article class="live-card ${isLive ? 'is-live' : ''}">
      <div class="lc-top">${badge}<span class="lc-day">Day ${dates.indexOf(key) + 1} of ${dates.length}</span>${levelTag(c)}</div>
      <h3><a href="${cupUrl(c)}">${esc(c.name)}</a></h3>
      <p class="lc-meta">${icon('pin')}${esc(window.UI.where(c))}${b.label ? ` · ${esc(b.label)}` : ''} · ${esc(when)}</p>
      ${top(c).length
        ? `<div class="lc-score"><p class="lc-score-head">Current standings <small>entered by the editors</small></p>${standings(c, 4)}</div>`
        : `<div class="lc-score is-empty">${icon('info')}<span>Live points will follow once a data source is connected.</span></div>`}
      <div class="lc-watch"><span>Watch:</span>${watch(c)}</div>
    </article>`;
  }
  function nextCard(c) {
    const b = cupDays(c).find((x) => endOf(x.to) >= new Date());
    const n = daysUntil(b.from.slice(0, 10));
    const range = `${fmtDay(b.from)}${b.to.slice(0, 10) !== b.from.slice(0, 10) ? ` – ${fmtDay(b.to)}` : ''}`;
    return `<article class="live-card is-next">
      <div class="lc-top"><span class="lc-badge is-next">${esc(relDays(n))}</span>${levelTag(c)}</div>
      <h3><a href="${cupUrl(c)}">${esc(c.name)}</a></h3>
      <p class="lc-meta">${icon('calendar')}${esc(range)}${hasTime(b.from) ? `, ${fmtTime(b.from)}` : ''}${b.label ? ` · ${esc(b.label)}` : ''}</p>
      <p class="lc-meta">${icon('pin')}${esc(window.UI.where(c))}</p>
      <div class="lc-watch"><span>Watch:</span>${watch(c)}</div>
    </article>`;
  }
  function renderLive() {
    const key = ymd(new Date());
    const today = D.cups.filter((c) => blocksOn(c, key).length);
    if (today.length) {
      $('live-title').innerHTML = '<span class="rec-dot" aria-hidden="true"></span>Live now';
      $('live-sub').textContent = today.length === 1 ? '1 tournament has a game day today' : `${today.length} tournaments have a game day today`;
      $('live-cards').innerHTML = today.map((c) => liveCard(c, key)).join('');
      return;
    }
    const next = upcomingCups().slice(0, 3);
    $('live-title').textContent = 'Up next';
    $('live-sub').textContent = next.length ? 'No tournament is running right now – this is what comes next.' : 'No tournament is running right now.';
    $('live-cards').innerHTML = next.length
      ? next.map(nextCard).join('')
      : empty({ ic: 'calendar', cls: 'empty-tight', title: 'No upcoming tournaments listed yet', text: 'New dates appear here automatically.' });
  }

  /* ---------- Spielplan: Einträge eines Tages (Spieltage, Anmeldeschlüsse, Set-Termine) ---------- */
  function entriesOn(key) {
    const out = [];
    D.cups.forEach((c) => blocksOn(c, key).forEach((b) => out.push({
      time: hasTime(b.from) ? fmtTime(`${key}T${b.from.slice(11, 16)}`) : '', name: c.name, href: cupUrl(c), sub: `${label('cupLevels', c.level)}${b.label ? ` · ${b.label}` : ''}`, kind: c.level
    })));
    D.cups.filter((c) => c.signupDeadline && c.signupDeadline.slice(0, 10) === key).forEach((c) => out.push({
      time: hasTime(c.signupDeadline) ? fmtTime(c.signupDeadline) : '', name: `Sign-up deadline: ${c.name}`, href: cupUrl(c), sub: 'Sign up with the organizer', kind: 'deadline'
    }));
    (D.setEvents || []).filter((e) => e.date === key).forEach((e) => out.push({ time: '', name: e.title, sub: e.info, kind: 'set', ic: SET_ICON[e.kind] }));
    return out.sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  }
  const row = (e) => `<li class="sched-row is-${esc(e.kind)}">
      <span class="sched-time ${e.time || e.ic ? '' : 'is-open'}">${e.time ? esc(e.time) : e.ic ? icon(e.ic) : 'Time TBA'}</span>
      <span class="sched-main">${e.href ? `<a href="${e.href}">${esc(e.name)}</a>` : `<b>${esc(e.name)}</b>`}<small>${esc(e.sub)}</small></span>
    </li>`;

  function renderToday() {
    const d = new Date();
    $('today-date').textContent = longDay(d);
    const list = entriesOn(ymd(d));
    if (list.length) { $('today').innerHTML = `<ul class="sched">${list.map(row).join('')}</ul>`; return; }
    const next = upcomingCups()[0];
    $('today').innerHTML = empty({ ic: 'calendar', cls: 'empty-tight', title: 'No games today',
      text: next ? `Next game day: ${fmtDay(ymd(cupNext(next)))} · ${esc(next.name)}` : 'New dates appear here automatically.' });
  }

  function renderWeek() {
    let html = '';
    for (let i = 1; i <= 7; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const list = entriesOn(ymd(d));
      if (list.length) html += `<h3 class="sched-day">${longDay(d)}</h3><ul class="sched">${list.map(row).join('')}</ul>`;
    }
    $('week').innerHTML = html || empty({ ic: 'calendar', cls: 'empty-tight', title: 'Nothing scheduled for the next 7 days' });
  }

  /* ---------- Letzte Ergebnisse: nur offizielle Turniere ---------- */
  function renderResults() {
    const past = D.cups.filter((c) => cupPast(c) && c.level === 'offiziell').sort((a, b) => cupEnd(b) - cupEnd(a)).slice(0, 5);
    $('results').innerHTML = past.length ? past.map((c) => `<article class="res-card">
        <div class="lc-top"><span class="res-final">Finished · ${esc(fmtDay(ymd(cupEnd(c))))}</span>${levelTag(c)}</div>
        <h3><a href="${cupUrl(c)}">${esc(c.name)}</a></h3>
        ${top(c).length
          ? `${standings(c, 4)}${c.result.note ? `<p class="res-note">${esc(c.result.note)}</p>` : ''}`
          : `<p class="res-missing">Result not added yet.${c.sources && c.sources[0] ? ` <a href="${esc(c.sources[0])}" target="_blank" rel="noopener">Organizer${icon('external')}</a>` : ''}</p>`}
      </article>`).join('')
      : empty({ ic: 'trophy', cls: 'empty-tight', title: 'No past tournaments yet' });
  }

  function render() {
    $('updated').textContent = `Updated ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    renderLive();
    renderToday();
    renderWeek();
    renderResults();
  }
  render();
  setInterval(render, 60000);   // „Live“/„Today“ und Uhrzeit aktuell halten, solange die Seite offen ist
})();
