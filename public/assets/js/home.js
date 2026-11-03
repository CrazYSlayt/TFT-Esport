/* Startseite: Turniere im Fokus – Kennzahlen, Monatskalender mit Set-Terminen, nächstes Turnier, Set-Termine,
   „Was steht an?“, Turnierkarten, zuletzt gespielt, dann Streams und News. */
(function () {
  const D = window.TFTE;
  const { icon, esc, tag, empty, label, articleCard, cupRow, cupCard, keyFacts, cupUrl, sortByDateDesc, upcomingCups, signupOpen,
    fmtDay, endOf, toDate, ymd, cupDays, cupPast, cupEnd, startOfToday, calendarGrid, calLegend, SET_ICON, creatorCard, creatorSlot } = window.UI;
  const $ = (id) => document.getElementById(id);

  const upcoming = upcomingCups();
  const openSoonest = upcoming.filter(signupOpen).sort((a, b) => endOf(a.signupDeadline) - endOf(b.signupDeadline));
  const daysUntil = (iso) => Math.round((toDate(iso.slice(0, 10)) - startOfToday()) / 864e5);
  const relDays = (n) => (n < 0 ? 'vorbei' : n === 0 ? 'heute' : n === 1 ? 'morgen' : `in ${n} Tagen`);

  /* ---------- Kennzahlen neben dem Titel ---------- */
  function renderStats() {
    const next = openSoonest[0];
    const tile = (href, ic, value, text, cls = '') =>
      `<a class="stat-tile ${cls}" href="${href}">${icon(ic)}<span><b>${value}</b><small>${text}</small></span></a>`;
    $('stat-tiles').innerHTML =
      tile('cups.html', 'trophy', upcoming.length, upcoming.length === 1 ? 'kommendes Turnier' : 'kommende Turniere') +
      tile('cups.html?offen=1', 'users', openSoonest.length, openSoonest.length === 1 ? 'Anmeldung offen' : 'Anmeldungen offen') +
      (next
        ? tile(cupUrl(next), 'clock', esc(fmtDay(next.signupDeadline)), `Nächster Anmeldeschluss · ${esc(next.name)}`, 'is-wide')
        : tile('cups.html', 'clock', '–', 'Gerade keine offene Anmeldung', 'is-wide'));
  }

  /* ---------- Monatskalender (oben links) ---------- */
  let month = ymd(new Date()).slice(0, 7);
  function renderCalendar() {
    const [y, m] = month.split('-').map(Number);
    $('cal-title').textContent = new Date(y, m - 1, 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    $('home-cal').innerHTML = calendarGrid(month, D.cups);
    $('home-cal-legend').innerHTML = calLegend() +
      (month !== ymd(new Date()).slice(0, 7) ? '<button type="button" class="reset-btn" data-today>Zum aktuellen Monat</button>' : '');
  }
  document.querySelector('.home-cal').addEventListener('click', (e) => {
    if (e.target.closest('[data-today]')) { month = ymd(new Date()).slice(0, 7); renderCalendar(); return; }
    const b = e.target.closest('[data-month]');
    if (!b) return;
    const [y, m] = month.split('-').map(Number);
    month = ymd(new Date(y, m - 1 + Number(b.dataset.month), 1)).slice(0, 7);
    renderCalendar();
  });

  /* ---------- Nächstes Turnier ---------- */
  function renderNextCup() {
    const c = upcoming[0];
    if (!c) {
      $('next-cup').innerHTML = `<div class="panel-head"><h3>Nächstes Turnier</h3></div>` +
        empty({ ic: 'trophy', cls: 'empty-tight', title: 'Noch keine kommenden Turniere', text: 'Neue Termine erscheinen hier automatisch.' });
      return;
    }
    const b = cupDays(c).find((x) => endOf(x.to) >= new Date());
    const n = daysUntil(b.from);
    const range = `${fmtDay(b.from)}${b.to.slice(0, 10) !== b.from.slice(0, 10) ? ` – ${fmtDay(b.to)}` : ''}`;
    $('next-cup').innerHTML = `
      <p class="plan-label">${icon('trophy')}Nächstes Turnier</p>
      <h3><a href="${cupUrl(c)}">${esc(c.name)}</a></h3>
      <div class="cup-card-tags">${tag(label('cupLevels', c.level), c.level)}${tag(label('regions', c.region), 'region')}</div>
      <p class="next-when"><b>${esc(range)}</b><span>${b.label ? `${esc(b.label)} · ` : ''}${n <= 0 ? 'läuft gerade' : relDays(n)}</span></p>
      ${keyFacts(c)}
      <a class="link-arrow" href="${cupUrl(c)}">Alle Details${icon('arrow')}</a>`;
  }

  /* ---------- Set-Termine ---------- */
  function renderSetDates() {
    const list = (D.setEvents || []).filter((e) => daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date));
    $('set-dates').innerHTML = list.length
      ? `<ul class="set-list">${list.map((e) => `<li class="is-${esc(e.kind)}">
          <span class="set-ic">${icon(SET_ICON[e.kind] || 'info')}</span>
          <span><b>${esc(e.title)}</b><small>${esc(e.info)}</small></span>
          <span class="set-date"><b>${esc(fmtDay(e.date))}</b><small>${relDays(daysUntil(e.date))}</small></span>
        </li>`).join('')}</ul>`
      : empty({ ic: 'calendar', cls: 'empty-tight', title: 'Keine Set-Termine eingetragen' });
  }

  /* ---------- Was steht an? ---------- */
  let tab = 'kommend';
  function renderUpcoming() {
    const list = upcoming.filter((c) => tab === 'kommend' || signupOpen(c)).slice(0, 8);
    $('upcoming-list').innerHTML = list.length
      ? list.map(cupRow).join('')
      : empty({ ic: 'calendar', cls: 'empty-tight', title: tab === 'offen' ? 'Gerade keine offene Anmeldung' : 'Noch keine Turniere eingetragen', text: 'Neue Termine erscheinen hier automatisch.' });
    document.querySelectorAll('[data-tab]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.tab === tab));
  }
  document.querySelector('.widget .seg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    tab = b.dataset.tab;
    renderUpcoming();
  });

  /* ---------- Turnierkarten ---------- */
  function renderCards() {
    $('upcoming-cards').innerHTML = upcoming.length
      ? `<div class="cup-cards">${upcoming.slice(0, 6).map(cupCard).join('')}</div>`
      : empty({ ic: 'trophy', title: 'Gerade sind keine kommenden Turniere eingetragen', text: 'Neue Termine erscheinen hier automatisch.', href: 'cups.html', cta: 'Zum Turnierkalender' });
  }

  /* ---------- Zuletzt gespielt ---------- */
  function renderRecent() {
    const past = D.cups.filter(cupPast).sort((a, b) => cupEnd(b) - cupEnd(a)).slice(0, 4);
    $('recent').innerHTML = past.length
      ? `<ul class="deadline-list">${past.map((c) => `<li><a href="${cupUrl(c)}"><b>${esc(c.name)}</b><span class="is-muted">${esc(fmtDay(ymd(cupEnd(c))))}</span></a></li>`).join('')}</ul>`
      : empty({ ic: 'trophy', cls: 'empty-tight', title: 'Noch keine vergangenen Turniere' });
  }

  /* ---------- Streams und News ---------- */
  function renderCreators() {
    const picks = D.creators.filter((c) => c.featured).slice(0, 3);
    $('home-creators').innerHTML = [0, 1, 2].map((i) => (picks[i] ? creatorCard(picks[i]) : creatorSlot(i + 1))).join('');
  }
  function renderNews() {
    const list = sortByDateDesc(D.articles).slice(0, 5);
    const box = $('home-news');
    box.classList.toggle('grid-5', list.length > 0);
    box.innerHTML = list.length
      ? list.map(articleCard).join('')
      : empty({ ic: 'news', title: 'Noch keine News', text: 'Sobald die ersten Artikel online sind, findest du sie hier – offizielle Meldungen, Turniere und Neues aus der Szene.' });
  }

  renderStats();
  renderCalendar();
  renderNextCup();
  renderSetDates();
  renderUpcoming();
  renderCards();
  renderRecent();
  renderCreators();
  renderNews();
})();
