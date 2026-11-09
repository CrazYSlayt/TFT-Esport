/* Startseite: Kopf mit dem großen Event (Weltmeisterschaft, danach das nächste Turnier), Kennzahlen, Turnierfinder,
   Set-Termine, zuletzt gespielt, laufende Streams und Spielerprofile. Janna steht als Bild direkt im HTML. */
(function () {
  const D = window.TFTE;
  const { icon, esc, fmt, empty, label, finderRow, finderStatus, cupUrl, upcomingCups, signupOpen, loadStreams, streamCard,
    fmtDay, endOf, toDate, ymd, cupDays, cupPast, cupEnd, startOfToday, calendarGrid, calLegend, SET_ICON, STREAM_REASONS } = window.UI;
  const $ = (id) => document.getElementById(id);

  const upcoming = upcomingCups();
  const daysUntil = (iso) => Math.round((toDate(iso.slice(0, 10)) - startOfToday()) / 864e5);
  const relDays = (n) => (n < 0 ? 'over' : n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`);
  const nextBlock = (c) => cupDays(c).find((x) => endOf(x.to) >= new Date());
  const range = (b) => `${fmtDay(b.from)}${b.to.slice(0, 10) !== b.from.slice(0, 10) ? ` – ${fmtDay(b.to)}` : ''}`;

  /* ---------- Kopf: das große Event ----------
     Im HTML steht die Weltmeisterschaft fest (für Suchmaschinen). Ist sie vorbei, zeigt der Kopf das nächste Turnier. */
  const featured = D.cups.find((c) => c.page && !cupPast(c)) || upcoming[0];
  const isWorlds = !!(featured && featured.page);
  function fillHero() {
    if (!featured || isWorlds) return;
    const b = nextBlock(featured);
    $('hh-title').textContent = featured.name;
    $('hh-lead').textContent = featured.info || '';
    $('hh-meta').innerHTML = `<span class="feature-date">${icon('calendar')}${esc(range(b))}</span>
      <span class="pill-dark">${icon('pin')}${esc(label('regions', featured.region))}</span>
      <span class="pill-dark">${esc(label('cupLevels', featured.level))}</span>`;
    $('hh-go').href = cupUrl(featured);
    $('hh-go').firstChild.textContent = 'View tournament';
    $('hh-watch').hidden = !featured.streamUrl;
    if (featured.streamUrl) $('hh-watch').href = featured.streamUrl;
  }
  // Startzeit: bei der Weltmeisterschaft die gemeldete Uhrzeit (startReported), sonst der erste noch offene Spieltag
  function startOf(c) {
    if (c.startReported && new Date(c.startReported) > new Date(Date.now() - 864e5 * 3)) return new Date(c.startReported);
    return toDate(nextBlock(c).from);
  }
  function renderCountdown() {
    const box = $('hh-countdown');
    if (!featured) { box.innerHTML = ''; return; }
    const b = nextBlock(featured);
    const now = new Date();
    if (now >= toDate(b.from.slice(0, 10)) && now <= endOf(b.to)) {
      const dates = cupDays(featured).flatMap((x) => { const out = []; for (let d = toDate(x.from.slice(0, 10)); d <= toDate(x.to.slice(0, 10)); d.setDate(d.getDate() + 1)) out.push(ymd(d)); return out; });
      box.innerHTML = `<p class="cd-state"><span class="rec-dot" aria-hidden="true"></span>Day ${dates.indexOf(ymd(now)) + 1} of ${dates.length} – live now</p>`;
      return;
    }
    const left = Math.max(0, startOf(featured) - now);
    const part = (v, l) => `<span class="cd-part"><b>${String(v).padStart(2, '0')}</b><small>${l}</small></span>`;
    box.innerHTML = part(Math.floor(left / 864e5), 'days') + part(Math.floor(left / 36e5) % 24, 'hours') + part(Math.floor(left / 6e4) % 60, 'minutes');
  }

  /* ---------- Auf einen Blick ---------- */
  const tile = (ic, value, text, href) => `<a class="g-tile" href="${href}"><span class="g-ic">${icon(ic)}</span><span><b>${value}</b><small>${text}</small></span></a>`;
  function renderTiles(data) {
    const open = upcoming.filter(signupOpen);
    $('glance-tiles').innerHTML =
      tile('trophy', upcoming.length, upcoming.length === 1 ? 'upcoming tournament' : 'upcoming tournaments', '#finder-title') +
      tile('users', open.length, open.length === 1 ? 'open sign-up' : 'open sign-ups', 'tft-tournaments.html?view=list&open=1') +
      tile('radio', data ? fmt(data.totalStreams) : '–', 'TFT streams live now', 'twitch.html') +
      tile('play', data ? fmt(data.totalViewers) : '–', 'viewers watching TFT', 'twitch.html');
  }

  /* ---------- Find your next tournament ---------- */
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
          <button type="button" class="icon-btn" data-month="-1" aria-label="Previous month">${icon('chevronLeft')}</button>
          <h3 aria-live="polite">${new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h3>
          <button type="button" class="icon-btn" data-month="1" aria-label="Next month">${icon('chevronRight')}</button>
        </div>
        ${calendarGrid(month, D.cups.filter(pick))}
        <div class="cal-legend">${calLegend()}${month !== thisMonth() ? '<button type="button" class="reset-btn" data-today>Back to this month</button>' : ''}</div>
      </div>`;
      return;
    }

    const list = upcoming.filter(pick);
    box.innerHTML = list.length
      ? `<div class="finder-list">${list.slice(0, 8).map(finderRow).join('')}</div>
         ${list.length > 8 ? `<a class="finder-more link-arrow" href="tft-tournaments.html?view=list">All ${list.length} tournaments${icon('arrow')}</a>` : ''}`
      : empty({ pose: 'sad', cls: 'empty-tight', title: filter === 'alle' ? 'No upcoming tournaments yet' : 'Nothing for this filter right now', text: 'New dates appear here automatically – or have a look at the calendar.', href: 'tft-tournaments.html', cta: 'Tournament calendar' });
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
      : empty({ ic: 'calendar', cls: 'empty-tight', title: 'No set dates listed' });
  }

  /* ---------- Zuletzt gespielt: offizielle Turniere mit Sieger ---------- */
  function renderRecent() {
    const past = D.cups.filter((c) => cupPast(c) && c.level === 'offiziell').sort((a, b) => cupEnd(b) - cupEnd(a)).slice(0, 4);
    $('recent').innerHTML = past.length
      ? `<ul class="deadline-list">${past.map((c) => {
          const winner = c.result && c.result.top && c.result.top[0] && c.result.top[0].name;
          return `<li><a href="${cupUrl(c)}"><b>${esc(c.name)}${winner ? `<small class="winner">${icon('trophy')}${esc(winner)}</small>` : ''}</b><span class="is-muted">${esc(fmtDay(ymd(cupEnd(c))))}</span></a></li>`;
        }).join('')}</ul>`
      : empty({ ic: 'trophy', cls: 'empty-tight', title: 'No past tournaments yet' });
  }

  /* ---------- Live jetzt: die größten TFT-Streams, Klick spielt auf der Seite ab ---------- */
  async function renderStreams() {
    const { data, reason } = await loadStreams();
    renderTiles(data);
    const box = $('home-streams');
    if (!data) {
      box.className = '';
      box.innerHTML = `<div class="notice"><span>${icon('info')}</span><span>${STREAM_REASONS[reason] || STREAM_REASONS['no-server']}</span></div>`;
      return;
    }
    const official = data.streams.find((s) => s.login.toLowerCase() === 'teamfighttactics');
    const list = [...(official ? [official] : []), ...data.streams.filter((s) => s !== official)].slice(0, 4);
    box.className = 'stream-grid home-streams';
    box.innerHTML = list.length ? list.map((s) => streamCard(s)).join('') : empty({ ic: 'radio', cls: 'empty-tight', title: 'No TFT stream is live right now' });
  }

  fillHero();
  renderCountdown();
  renderTiles(null);
  renderFinder();
  renderSetDates();
  renderRecent();
  renderStreams();
  setInterval(renderCountdown, 30000);
  setInterval(renderStreams, 120000);
})();
