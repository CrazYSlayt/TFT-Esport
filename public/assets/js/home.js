/* Startseite: Begrüßung, das nächste große Match, „Finde dein nächstes Turnier“ (Liste oder Monatskalender),
   Set-Termine, zuletzt gespielt und News. Janna steht als Bild direkt im HTML. */
(function () {
  const D = window.TFTE;
  const { icon, crown, esc, empty, label, finderRow, finderStatus, cupUrl, sortByDateDesc, upcomingCups, signupOpen,
    fmtDay, fmtDate, endOf, toDate, ymd, cupDays, cupPast, cupEnd, startOfToday, calendarGrid, calLegend, SET_ICON, janna, articleUrl } = window.UI;
  const $ = (id) => document.getElementById(id);

  const upcoming = upcomingCups();
  const daysUntil = (iso) => Math.round((toDate(iso.slice(0, 10)) - startOfToday()) / 864e5);
  const relDays = (n) => (n < 0 ? 'vorbei' : n === 0 ? 'heute' : n === 1 ? 'morgen' : `in ${n} Tagen`);
  const nextBlock = (c) => cupDays(c).find((x) => endOf(x.to) >= new Date());
  const range = (b) => `${fmtDay(b.from)}${b.to.slice(0, 10) !== b.from.slice(0, 10) ? ` – ${fmtDay(b.to)}` : ''}`;

  /* ---------- Kennzahlen in der hellgrünen Fläche der Begrüßung ---------- */
  function renderStats() {
    const open = upcoming.filter(signupOpen).sort((a, b) => endOf(a.signupDeadline) - endOf(b.signupDeadline));
    const stat = (value, text, href, cls = '') => href
      ? `<a class="hstat ${cls}" href="${href}"><b>${value}</b><span>${text}</span></a>`
      : `<div class="hstat ${cls}"><b>${value}</b><span>${text}</span></div>`;
    const next = open[0]
      ? stat(esc(fmtDay(open[0].signupDeadline)), `Nächster Anmeldeschluss · ${esc(open[0].name)}`, cupUrl(open[0]), 'is-date')
      : upcoming[0] ? stat(esc(fmtDay(nextBlock(upcoming[0]).from)), `Nächstes Turnier · ${esc(upcoming[0].name)}`, cupUrl(upcoming[0]), 'is-date') : '';
    $('hero-stats').innerHTML =
      stat(upcoming.length, upcoming.length === 1 ? 'kommendes Turnier' : 'kommende Turniere', '#finder-title') +
      stat(open.length, open.length === 1 ? 'Anmeldung offen' : 'Anmeldungen offen') + next;
  }

  /* ---------- Das nächste große Match ---------- */
  function renderNextCup() {
    const box = $('next-cup');
    const c = upcoming[0];
    if (!c) {
      box.classList.add('is-empty');
      box.innerHTML = `<div class="feature-text">
          <h3>Gerade ist kein Turnier eingetragen</h3>
          <p class="feature-rel">Neue Termine erscheinen hier automatisch.</p>
          <a class="btn btn-cream" href="cups.html">Zum Turnierkalender${icon('arrow')}</a>
        </div>
        <div class="feature-stage" aria-hidden="true">${janna('traurig', 'at-r')}</div>`;
      return;
    }
    const b = nextBlock(c);
    const n = daysUntil(b.from);
    const s = finderStatus(c);
    box.innerHTML = `
      <div class="feature-text">
        <span class="feature-tag">${crown()}${esc(label('cupLevels', c.level))}</span>
        <h3><a href="${cupUrl(c)}">${esc(c.name)}</a></h3>
        <div class="feature-meta">
          <span class="feature-date">${icon('calendar')}${esc(range(b))}</span>
          <span class="pill-dark">${icon('pin')}${esc(label('regions', c.region))}</span>
          ${b.label ? `<span class="pill-dark">${esc(b.label)}</span>` : ''}
        </div>
        <p class="feature-rel"><b>${n <= 0 ? 'Läuft gerade' : `Los geht’s ${relDays(n)}`}</b> · ${esc(s.text)}</p>
        <a class="btn btn-cream" href="${cupUrl(c)}">Turnier ansehen${icon('arrow')}</a>
      </div>
      <div class="feature-stage" aria-hidden="true">${janna('pokal', 'at-r')}</div>`;
  }

  /* ---------- Finde dein nächstes Turnier ---------- */
  const FILTERS = {
    alle: () => true,
    mitspielen: (c) => ['open', 'soon', 'unknown'].includes(finderStatus(c).key),
    zuschauen: (c) => ['none', 'closed'].includes(finderStatus(c).key),
    dach: (c) => c.region === 'dach'
  };
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) { /* egal */ } } };
  const thisMonth = () => ymd(new Date()).slice(0, 7);
  let filter = 'alle';
  let view = store.get('tfte-home-view') === 'kalender' ? 'kalender' : 'liste';
  let month = thisMonth();

  function renderFinder() {
    const pick = FILTERS[filter];
    const box = $('finder');
    document.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.filter === filter));
    document.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.view === view));
    box.classList.toggle('is-cal', view === 'kalender');

    if (view === 'kalender') {
      const [y, m] = month.split('-').map(Number);
      box.innerHTML = `<div class="cal">
        <div class="cal-head">
          <button type="button" class="icon-btn" data-month="-1" aria-label="Vorheriger Monat">${icon('chevronLeft')}</button>
          <h3 aria-live="polite">${new Date(y, m - 1, 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</h3>
          <button type="button" class="icon-btn" data-month="1" aria-label="Nächster Monat">${icon('chevronRight')}</button>
        </div>
        ${calendarGrid(month, D.cups.filter(pick))}
        <div class="cal-legend">${calLegend()}${month !== thisMonth() ? '<button type="button" class="reset-btn" data-today>Zum aktuellen Monat</button>' : ''}</div>
      </div>`;
      return;
    }

    const list = upcoming.filter(pick);
    box.innerHTML = list.length
      ? `<div class="finder-list">${list.slice(0, 8).map(finderRow).join('')}</div>
         ${list.length > 8 ? `<a class="finder-more link-arrow" href="cups.html?ansicht=liste">Alle ${list.length} Turniere${icon('arrow')}</a>` : ''}`
      : empty({ pose: 'traurig', cls: 'empty-tight', title: filter === 'alle' ? 'Noch keine kommenden Turniere' : 'Gerade nichts für diesen Filter', text: 'Neue Termine erscheinen hier automatisch – oder schau in den Kalender.', href: 'cups.html', cta: 'Zum Turnierkalender' });
  }

  document.querySelector('.finder-bar').addEventListener('click', (e) => {
    const f = e.target.closest('[data-filter]');
    const v = e.target.closest('[data-view]');
    if (f) filter = f.dataset.filter;
    else if (v) { view = v.dataset.view; store.set('tfte-home-view', view); }
    else return;
    renderFinder();
  });
  $('finder').addEventListener('click', (e) => {
    if (e.target.closest('[data-today]')) { month = thisMonth(); renderFinder(); return; }
    const b = e.target.closest('[data-month]');
    if (!b) return;
    const [y, m] = month.split('-').map(Number);
    month = ymd(new Date(y, m - 1 + Number(b.dataset.month), 1)).slice(0, 7);
    renderFinder();
  });

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

  /* ---------- Zuletzt gespielt ---------- */
  function renderRecent() {
    const past = D.cups.filter(cupPast).sort((a, b) => cupEnd(b) - cupEnd(a)).slice(0, 4);
    $('recent').innerHTML = past.length
      ? `<ul class="deadline-list">${past.map((c) => `<li><a href="${cupUrl(c)}"><b>${esc(c.name)}</b><span class="is-muted">${esc(fmtDay(ymd(cupEnd(c))))}</span></a></li>`).join('')}</ul>`
      : empty({ ic: 'trophy', cls: 'empty-tight', title: 'Noch keine vergangenen Turniere' });
  }

  /* ---------- Neues aus der Szene ---------- */
  function renderNews() {
    const list = sortByDateDesc(D.articles).slice(0, 4);
    $('home-news').innerHTML = list.length
      ? `<ul class="deadline-list">${list.map((a) => `<li><a href="${articleUrl(a)}"><b>${esc(a.title)}</b><span class="is-muted">${esc(fmtDate(a.date))}</span></a></li>`).join('')}</ul>`
      : empty({ ic: 'news', cls: 'empty-tight', title: 'Noch keine News', text: 'Sobald die ersten Artikel online sind, stehen sie hier.' });
  }

  renderStats();
  renderNextCup();
  renderFinder();
  renderSetDates();
  renderRecent();
  renderNews();
})();
