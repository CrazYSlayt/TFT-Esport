/* Live-Streams: alle TFT-Streams von Twitch über den lokalen Server (/api/streams), Filter nach Sprache und Pros.
   Ohne Twitch-Verbindung gibt es keine Demo-Streams, sondern einen Hinweis und einen Leerzustand. */
(function () {
  const D = window.TFTE;
  const { esc, fmt, empty, streamCard, langName, loadStreams, STREAM_REASONS, icon } = window.UI;
  const $ = (id) => document.getElementById(id);

  const PAGE_SIZE = 30;
  const REFRESH_MS = 120000;
  const pros = new Set(D.proStreamers.map((p) => p.login.toLowerCase()));
  const state = { lang: 'all', prosOnly: false, shown: PAGE_SIZE, data: null, reason: null };

  async function load() {
    const { data, reason } = await loadStreams();
    state.data = data;
    state.reason = reason;
    render();
  }

  const filtered = () => state.data.streams.filter((s) =>
    (state.lang === 'all' || s.lang === state.lang) && (!state.prosOnly || pros.has(s.login.toLowerCase())));

  function renderSummary() {
    const d = state.data;
    if (!d) {
      $('live-summary').innerHTML = '<span class="rec-dot"></span>Keine Live-Daten';
      $('source-note').innerHTML = `<div class="notice"><span>${icon('info')}</span><span><strong>Twitch nicht verbunden.</strong> ${STREAM_REASONS[state.reason] || STREAM_REASONS['no-server']}</span></div>`;
      return;
    }
    const time = new Date(d.updatedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    $('live-summary').innerHTML = `<span class="rec-dot"></span><b>${fmt(d.totalStreams)}</b>&nbsp;Streams live · <b>${fmt(d.totalViewers)}</b>&nbsp;Zuschauer · Stand ${time} Uhr${d.capped ? ' · Top 2.000' : ''}`;
    $('source-note').innerHTML = '';
  }

  function renderChips() {
    const box = $('lang-chips');
    $('pros-only').hidden = !state.data || !pros.size;
    if (!state.data) { box.innerHTML = ''; return; }
    const counts = {};
    state.data.streams.forEach((s) => { counts[s.lang] = (counts[s.lang] || 0) + 1; });
    // Deutsch immer vorne, danach die Sprachen mit den meisten Streams
    let langs = Object.keys(counts).sort((a, b) => (b === 'de') - (a === 'de') || counts[b] - counts[a]).slice(0, 9);
    if (state.lang !== 'all' && !langs.includes(state.lang)) langs.push(state.lang);
    box.innerHTML =
      `<button type="button" class="chip" data-lang="all" aria-pressed="${state.lang === 'all'}">Alle Sprachen <span class="chip-count">${fmt(state.data.streams.length)}</span></button>` +
      langs.map((l) => `<button type="button" class="chip" data-lang="${esc(l)}" aria-pressed="${state.lang === l}">${esc(langName(l))} <span class="chip-count">${counts[l] || 0}</span></button>`).join('');
    $('pros-only').setAttribute('aria-pressed', state.prosOnly);
  }

  function renderGrid() {
    const grid = $('stream-grid');
    const more = $('load-more');
    if (!state.data) {
      grid.innerHTML = empty({ ic: 'radio', title: 'Hier erscheinen die Live-Streams', text: 'Sobald Twitch verbunden ist, siehst du hier alle laufenden TFT-Streams.' });
      $('grid-sub').textContent = '';
      more.hidden = true;
      return;
    }
    const list = filtered();
    grid.innerHTML = list.length
      ? list.slice(0, state.shown).map((s) => streamCard(s, pros.has(s.login.toLowerCase()))).join('')
      : empty({ ic: 'radio', title: 'Gerade keine Streams für diesen Filter', text: 'Probier eine andere Sprache oder schau später noch einmal vorbei.' });
    $('grid-sub').textContent = `${fmt(list.length)} ${list.length === 1 ? 'Stream' : 'Streams'}`;
    more.hidden = list.length <= state.shown;
    more.textContent = `Mehr Streams (${fmt(Math.max(0, list.length - state.shown))} weitere)`;
  }

  function render() {
    renderSummary();
    renderChips();
    renderGrid();
  }

  $('lang-chips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (!b) return;
    state.lang = b.dataset.lang;
    state.shown = PAGE_SIZE;
    renderChips();
    renderGrid();
  });
  $('pros-only').addEventListener('click', () => {
    state.prosOnly = !state.prosOnly;
    state.shown = PAGE_SIZE;
    renderChips();
    renderGrid();
  });
  $('load-more').addEventListener('click', () => { state.shown += PAGE_SIZE; renderGrid(); });

  load();
  setInterval(load, REFRESH_MS);
})();
