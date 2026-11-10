/* Turniere: Monatskalender als Übersicht (Standard) und Listenansicht. Oben „Wo spielst du?“ (Land oder Region, wird gemerkt):
   zeigt die weltweiten Turniere, die offiziellen der eigenen Region und die Cups für das eigene Land.
   Dazu Filter für Datum, Teilnahme, Art und offene Anmeldung. Einstellungen stehen in der Adresse (?view=list&where=de …). */
(function () {
  const D = window.TFTE;
  const { icon, esc, link, setUrl, empty, playableFrom, whereLabel, whereOptions, getWhere, setWhere, isWhere, countryOf, label, ymd, startOfToday, cupStart, cupPast, cupDates, byStart, signupOpen, cupCard, calendarGrid, calLegend } = window.UI;
  const $ = (id) => document.getElementById(id);
  const form = $('cup-filters');

  const DEFAULTS = { view: 'calendar', month: '', range: 'upcoming', date: '', where: '', entry: '', type: '', open: '' };
  const ym = (d) => ymd(d).slice(0, 7);
  const monthName = (d, opts) => d.toLocaleDateString('en-GB', opts);

  /* ---------- Zustand aus der Adresse ---------- */
  const params = new URLSearchParams(location.search);
  const state = {};
  Object.keys(DEFAULTS).forEach((k) => { state[k] = params.get(k) || DEFAULTS[k]; });
  if (!['list', 'calendar'].includes(state.view)) state.view = 'calendar';
  if (!/^\d{4}-\d{2}$/.test(state.month)) state.month = ym(new Date());
  // alte Adressen mit ?region=… weiter verstehen; ohne Angabe gilt die gemerkte Auswahl
  if (!state.where && params.get('region')) state.where = params.get('region') === 'dach' ? 'de' : params.get('region');
  if (!isWhere(state.where)) state.where = getWhere();

  function syncUrl() {
    const url = new URL(location.href);
    url.search = '';
    Object.keys(DEFAULTS).forEach((k) => {
      const keep = k === 'month' ? state.view === 'calendar' && state.month !== ym(new Date()) : state[k] && state[k] !== DEFAULTS[k];
      if (keep) url.searchParams.set(k, state[k]);
    });
    setUrl(url);
  }

  /* ---------- Filterfelder ---------- */
  const options = (list, all) => `<option value="">${all}</option>` + list.map((x) => `<option value="${x.id}">${esc(x.label)}</option>`).join('');
  $('f-req').innerHTML = options(D.requirements, 'All');
  $('f-level').innerHTML = options(D.cupLevels, 'All types');

  function fillForm() {
    form.elements.range.value = state.range;
    $('f-where').innerHTML = whereOptions(state.where);
    $('f-where').closest('.where-pick').classList.toggle('is-set', !!state.where);
    renderWhereNote();
    form.elements.entry.value = state.entry;
    form.elements.type.value = state.type;
    form.elements.open.checked = state.open === '1';
    form.elements.date.value = state.date;
    $('date-field').classList.toggle('show', state.range === 'day');
    $('range-field').hidden = state.view === 'calendar';   // im Kalender wählt man den Monat direkt
    document.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.view === state.view));
  }

  /* ---------- Filtern ---------- */
  const matchesBase = (c) => cupStart(c) && playableFrom(c, state.where) &&
    (!state.entry || c.requirement === state.entry) &&
    (!state.type || c.level === state.type) &&
    (state.open !== '1' || signupOpen(c));
  function inRange(c) {
    const today = startOfToday();
    if (state.range === 'all') return true;
    if (state.range === 'day') return state.date ? cupDates(c).includes(state.date) : !cupPast(c);
    if (cupPast(c)) return false;
    if (state.range === '7' || state.range === '30') return cupStart(c) < new Date(today.getTime() + Number(state.range) * 864e5);
    return true;
  }
  const filtersActive = () => ['where', 'entry', 'type', 'open'].some((k) => state[k]) || (state.view === 'list' && state.range !== 'upcoming');
  const count = (n, suffix = '') => `${n} ${n === 1 ? 'tournament' : 'tournaments'}${suffix}`;

  const noCupsAtAll = () => empty({ pose: 'sad', title: 'No tournaments listed yet', text: 'As soon as the editors add new dates, they appear here – with entry rules, sign-up deadlines and game days.' });
  const noMatch = (text) => empty({ pose: 'thinking', title: 'No tournaments for this selection', text, href: link('tft-tournaments.html'), cta: 'Reset filters' });

  // Karten nach Monat gruppiert
  function grouped(list) {
    const groups = new Map();
    list.forEach((c) => {
      const key = monthName(cupStart(c), { month: 'long', year: 'numeric' });
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(c);
    });
    return [...groups].map(([month, cups]) => `<div class="month-group"><h2>${esc(month)}</h2><div class="cup-cards">${cups.map(cupCard).join('')}</div></div>`).join('');
  }

  /* ---------- Liste ---------- */
  function renderList() {
    const list = D.cups.filter((c) => matchesBase(c) && inRange(c)).sort(byStart);
    $('cups-count').textContent = count(list.length);
    if (!D.cups.length) return noCupsAtAll();
    if (!list.length) return noMatch(filtersActive() ? 'Try another time frame or country.' : 'There are no upcoming tournaments right now. New dates appear here automatically.');
    return grouped(list);
  }

  /* ---------- Kalender (Monatsansicht) ---------- */
  function renderCalendar() {
    const [y, m] = state.month.split('-').map(Number);
    const first = new Date(y, m - 1, 1);
    const all = D.cups.filter(matchesBase);
    // im Monat: mindestens ein Spieltag oder der Anmeldeschluss liegt im Monat
    const inMonth = all.filter((c) => cupDates(c).some((d) => d.startsWith(state.month)) || (c.signupDeadline || '').startsWith(state.month)).sort(byStart);
    $('cups-count').textContent = count(inMonth.length, ' this month');
    const title = monthName(first, { month: 'long', year: 'numeric' });
    const below = !D.cups.length ? noCupsAtAll()
      : inMonth.length ? `<div class="cup-cards">${inMonth.map(cupCard).join('')}</div>`
        : empty({ ic: 'calendar', cls: 'empty-tight', title: 'No tournaments listed for this month', text: filtersActive() ? 'The filters may not match – or try the next month.' : 'Try the next month or come back soon.' });
    return `<div class="cal">
        <div class="cal-head">
          <button type="button" class="icon-btn" data-month="-1" aria-label="Previous month">${icon('chevronLeft')}</button>
          <h2 aria-live="polite">${esc(title)}</h2>
          <button type="button" class="icon-btn" data-month="1" aria-label="Next month">${icon('chevronRight')}</button>
        </div>
        ${calendarGrid(state.month, all)}
        <div class="cal-legend">
          ${calLegend()}
          ${state.month !== ym(new Date()) ? '<button type="button" class="reset-btn" data-today>Back to this month</button>' : ''}
        </div>
      </div>
      <div class="month-group"><h2>Tournaments in ${esc(monthName(first, { month: 'long' }))}</h2>${below}</div>`;
  }

  function render() {
    fillForm();
    $('cups-results').innerHTML = state.view === 'calendar' ? renderCalendar() : renderList();
    syncUrl();
  }

  /* ---------- Ereignisse ---------- */
  form.addEventListener('change', () => {
    state.range = form.elements.range.value;
    state.entry = form.elements.entry.value;
    state.type = form.elements.type.value;
    state.open = form.elements.open.checked ? '1' : '';
    state.date = state.range === 'day' ? form.elements.date.value : '';
    if (state.range === 'day' && !state.date) state.date = ymd(new Date());
    render();
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  $('f-where').addEventListener('change', (e) => {
    state.where = e.target.value;
    setWhere(state.where);
    render();
  });
  // Hinweis unter der Auswahl: was gezeigt wird
  function renderWhereNote() {
    const note = $('where-note');
    note.hidden = !state.where;
    if (!state.where) return;
    const c = countryOf(state.where);
    const region = label('regions', c ? c.region : state.where);
    note.innerHTML = c
      ? `${icon('info')}<span>Showing what you can enter from <b>${esc(c.label)}</b>: global events, official ${esc(region)} events and cups for ${esc(c.label)}.</span>`
      : `${icon('info')}<span>Showing global events and everything in <b>${esc(region)}</b>. Pick your country for a shorter list.</span>`;
  }
  $('reset-filters').addEventListener('click', () => {
    const view = state.view;
    Object.assign(state, DEFAULTS, { view, month: ym(new Date()), where: state.where });   // das eigene Land bleibt
    render();
  });
  document.querySelector('.seg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-view]');
    if (!b) return;
    state.view = b.dataset.view;
    render();
  });
  $('cups-results').addEventListener('click', (e) => {
    if (e.target.closest('[data-today]')) { state.month = ym(new Date()); render(); return; }
    const b = e.target.closest('[data-month]');
    if (!b) return;
    const [y, m] = state.month.split('-').map(Number);
    state.month = ym(new Date(y, m - 1 + Number(b.dataset.month), 1));
    render();
  });

  render();
})();
