/* Turniere: Monatskalender als Übersicht (Standard) und Listenansicht, Filter für Region, Datum, Teilnahme, Art und offene Anmeldung.
   Darunter die Turniere als Karten mit den fünf Kernfragen. Einstellungen stehen in der Adresse (?ansicht=liste&region=emea …). */
(function () {
  const D = window.TFTE;
  const { icon, esc, link, setUrl, empty, cupUrl, ymd, endOf, startOfToday, cupStart, cupPast, cupDates, byStart, signupOpen, cupCard } = window.UI;
  const $ = (id) => document.getElementById(id);
  const form = $('cup-filters');

  const DEFAULTS = { ansicht: 'kalender', monat: '', zeitraum: 'kommend', datum: '', region: '', teilnahme: '', art: '', offen: '' };
  const ym = (d) => ymd(d).slice(0, 7);

  /* ---------- Zustand aus der Adresse ---------- */
  const params = new URLSearchParams(location.search);
  const state = {};
  Object.keys(DEFAULTS).forEach((k) => { state[k] = params.get(k) || DEFAULTS[k]; });
  if (!['liste', 'kalender'].includes(state.ansicht)) state.ansicht = 'kalender';
  if (!/^\d{4}-\d{2}$/.test(state.monat)) state.monat = ym(new Date());

  function syncUrl() {
    const url = new URL(location.href);
    url.search = '';
    Object.keys(DEFAULTS).forEach((k) => {
      const keep = k === 'monat' ? state.ansicht === 'kalender' && state.monat !== ym(new Date()) : state[k] && state[k] !== DEFAULTS[k];
      if (keep) url.searchParams.set(k, state[k]);
    });
    setUrl(url);
  }

  /* ---------- Filterfelder ---------- */
  const options = (list, all) => `<option value="">${all}</option>` + list.map((x) => `<option value="${x.id}">${esc(x.label)}</option>`).join('');
  $('f-region').innerHTML = options(D.regions, 'Alle Regionen');
  $('f-req').innerHTML = options(D.requirements, 'Alle');
  $('f-level').innerHTML = options(D.cupLevels, 'Alle Arten');

  function fillForm() {
    form.zeitraum.value = state.zeitraum;
    form.region.value = state.region;
    form.teilnahme.value = state.teilnahme;
    form.art.value = state.art;
    form.offen.checked = state.offen === '1';
    form.datum.value = state.datum;
    $('date-field').classList.toggle('show', state.zeitraum === 'tag');
    $('range-field').hidden = state.ansicht === 'kalender';   // im Kalender wählt man den Monat direkt
    document.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.view === state.ansicht));
  }

  /* ---------- Filtern ---------- */
  // Region: EUW/EUNE/DACH zeigen auch EMEA-Turniere, jede Region auch weltweite
  const SUB_EMEA = ['euw', 'eune', 'dach'];
  const inRegion = (c) => !state.region || c.region === state.region || c.region === 'global' ||
    (SUB_EMEA.includes(state.region) && c.region === 'emea');
  const matchesBase = (c) => cupStart(c) && inRegion(c) &&
    (!state.teilnahme || c.requirement === state.teilnahme) &&
    (!state.art || c.level === state.art) &&
    (state.offen !== '1' || signupOpen(c));
  function inRange(c) {
    const today = startOfToday();
    if (state.zeitraum === 'alle') return true;
    if (state.zeitraum === 'tag') return state.datum ? cupDates(c).includes(state.datum) : !cupPast(c);
    if (cupPast(c)) return false;
    if (state.zeitraum === '7' || state.zeitraum === '30') return cupStart(c) < new Date(today.getTime() + Number(state.zeitraum) * 864e5);
    return true;
  }
  const filtersActive = () => ['region', 'teilnahme', 'art', 'offen'].some((k) => state[k]) || (state.ansicht === 'liste' && state.zeitraum !== 'kommend');
  const count = (n, suffix = '') => `${n} ${n === 1 ? 'Turnier' : 'Turniere'}${suffix}`;

  const noCupsAtAll = () => empty({ ic: 'trophy', title: 'Noch keine Turniere eingetragen', text: 'Sobald die Redaktion neue Termine einträgt, erscheinen sie hier – mit Teilnahmebedingungen, Anmeldeschluss und Spielterminen.' });
  const noMatch = (text) => empty({ ic: 'calendar', title: 'Keine Turniere für diese Auswahl', text, href: link('cups.html'), cta: 'Filter zurücksetzen' });

  // Karten nach Monat gruppiert
  function grouped(list) {
    const groups = new Map();
    list.forEach((c) => {
      const key = cupStart(c).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
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
    if (!list.length) return noMatch(filtersActive() ? 'Probier einen anderen Zeitraum oder eine andere Region.' : 'Gerade stehen keine kommenden Turniere an. Neue Termine erscheinen hier automatisch.');
    return grouped(list);
  }

  /* ---------- Kalender (Monatsansicht) ---------- */
  function renderCalendar() {
    const [y, m] = state.monat.split('-').map(Number);
    const first = new Date(y, m - 1, 1);
    const last = new Date(y, m, 0);
    const start = new Date(first);
    start.setDate(1 - ((first.getDay() + 6) % 7));            // Woche beginnt am Montag
    const all = D.cups.filter(matchesBase);
    // im Monat: mindestens ein Spieltag oder der Anmeldeschluss liegt im Monat
    const inMonth = all.filter((c) => cupDates(c).some((d) => d.startsWith(state.monat)) || (c.signupDeadline || '').startsWith(state.monat)).sort(byStart);
    $('cups-count').textContent = count(inMonth.length, ' im Monat');

    const today = ymd(new Date());
    let cells = '';
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      if (i >= 35 && d > last) break;                          // sechste Woche nur, wenn der Monat sie braucht
      const key = ymd(d);
      const plays = all.filter((c) => cupDates(c).includes(key));
      const deadlines = all.filter((c) => c.signupDeadline && c.signupDeadline.slice(0, 10) === key);
      cells += `<div class="cal-day ${d.getMonth() !== m - 1 ? 'other' : ''} ${key === today ? 'today' : ''}">
        <span class="cal-num">${d.getDate()}</span>
        ${deadlines.map((c) => `<a class="cal-ev cal-deadline ${endOf(c.signupDeadline) < new Date() ? 'past' : ''}" href="${cupUrl(c)}" title="Anmeldeschluss: ${esc(c.name)}">${icon('clock')}Anmeldeschluss · ${esc(c.name)}</a>`).join('')}
        ${plays.map((c) => `<a class="cal-ev ${esc(c.level)} ${cupPast(c) ? 'past' : ''}" href="${cupUrl(c)}" title="${esc(c.name)}">${esc(c.name)}</a>`).join('')}
      </div>`;
    }
    const title = first.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    const below = !D.cups.length ? noCupsAtAll()
      : inMonth.length ? `<div class="cup-cards">${inMonth.map(cupCard).join('')}</div>`
        : empty({ ic: 'calendar', cls: 'empty-tight', title: 'In diesem Monat sind keine Turniere eingetragen', text: filtersActive() ? 'Vielleicht passen die Filter nicht – oder blättere einen Monat weiter.' : 'Blättere einen Monat weiter oder schau bald wieder vorbei.' });
    return `<div class="cal">
        <div class="cal-head">
          <button type="button" class="icon-btn" data-month="-1" aria-label="Vorheriger Monat">${icon('chevronLeft')}</button>
          <h2 aria-live="polite">${esc(title)}</h2>
          <button type="button" class="icon-btn" data-month="1" aria-label="Nächster Monat">${icon('chevronRight')}</button>
        </div>
        <div class="cal-grid">
          ${['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((w) => `<div class="cal-wd">${w}</div>`).join('')}
          ${cells}
        </div>
        <div class="cal-legend">
          <span><i class="lg lg-offiziell"></i>Offiziell</span><span><i class="lg lg-regional"></i>Regional</span>
          <span><i class="lg lg-streamer"></i>Streamer-Cup</span><span><i class="lg lg-eigener"></i>Eigener Cup</span>
          <span><i class="lg lg-deadline"></i>Anmeldeschluss</span>
          ${state.monat !== ym(new Date()) ? '<button type="button" class="reset-btn" data-today>Zum aktuellen Monat</button>' : ''}
        </div>
      </div>
      <div class="month-group"><h2>Turniere im ${esc(first.toLocaleDateString('de-DE', { month: 'long' }))}</h2>${below}</div>`;
  }

  function render() {
    fillForm();
    $('cups-results').innerHTML = state.ansicht === 'kalender' ? renderCalendar() : renderList();
    syncUrl();
  }

  /* ---------- Ereignisse ---------- */
  form.addEventListener('change', () => {
    state.zeitraum = form.zeitraum.value;
    state.region = form.region.value;
    state.teilnahme = form.teilnahme.value;
    state.art = form.art.value;
    state.offen = form.offen.checked ? '1' : '';
    state.datum = state.zeitraum === 'tag' ? form.datum.value : '';
    if (state.zeitraum === 'tag' && !state.datum) state.datum = ymd(new Date());
    render();
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  $('reset-filters').addEventListener('click', () => {
    const view = state.ansicht;
    Object.assign(state, DEFAULTS, { ansicht: view, monat: ym(new Date()) });
    render();
  });
  document.querySelector('.seg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-view]');
    if (!b) return;
    state.ansicht = b.dataset.view;
    render();
  });
  $('cups-results').addEventListener('click', (e) => {
    if (e.target.closest('[data-today]')) { state.monat = ym(new Date()); render(); return; }
    const b = e.target.closest('[data-month]');
    if (!b) return;
    const [y, m] = state.monat.split('-').map(Number);
    state.monat = ym(new Date(y, m - 1 + Number(b.dataset.month), 1));
    render();
  });

  render();
})();
