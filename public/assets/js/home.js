/* Startseite im Aufbau von dota2news: Kopfzeile mit Live-Zuschauern, Top-Event (Weltmeisterschaft, danach das nächste Turnier),
   die zwei neuesten Artikel, Esports-Spalte (Upcoming / Results), Info-Leiste, Live-Streams, Turnierfinder, Set-Termine und Spieler.
   „Wo spielst du?“ gilt für Esports-Spalte, Info-Leiste und Finder gemeinsam und wird gemerkt (wie im Kalender). */
(function () {
  const D = window.TFTE;
  const { icon, esc, fmt, empty, label, crown, finderRow, finderStatus, cupUrl, upcomingCups, signupOpen, loadStreams, streamCard, articleCard,
    sortByDateDesc, articleUrl, fmtDate, fmtDay, endOf, toDate, ymd, cupDays, cupPast, cupEnd, startOfToday, calendarGrid, calLegend, SET_ICON, STREAM_REASONS,
    playableFrom, whereOptions, whereLabel, getWhere, setWhere, where: whereOf } = window.UI;
  const $ = (id) => document.getElementById(id);

  const upcoming = upcomingCups();
  const daysUntil = (iso) => Math.round((toDate(iso.slice(0, 10)) - startOfToday()) / 864e5);
  const relDays = (n) => (n < 0 ? 'over' : n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`);
  const nextBlock = (c) => cupDays(c).find((x) => endOf(x.to) >= new Date());
  const range = (b) => `${fmtDay(b.from)}${b.to.slice(0, 10) !== b.from.slice(0, 10) ? ` – ${fmtDay(b.to)}` : ''}`;
  const isLiveNow = (c) => { const b = nextBlock(c); const now = new Date(); return !!b && now >= toDate(b.from.slice(0, 10)) && now <= endOf(b.to); };
  const pastOfficial = D.cups.filter((c) => cupPast(c) && c.level === 'offiziell').sort((a, b) => cupEnd(b) - cupEnd(a));
  const winnerOf = (c) => c.result && c.result.top && c.result.top[0] && c.result.top[0].name;

  let where = getWhere();
  const mine = (list) => list.filter((c) => playableFrom(c, where));

  /* ---------- Beiträge: Artikel plus Ergebnis-Meldungen der offiziellen Turniere ---------- */
  const shortName = (c) => c.name.replace(/ – .*$/, '');
  const resultNews = pastOfficial.filter(winnerOf).map((c) => ({
    url: c.page || `tft-tournaments/${c.id}.html`, cat: 'turniere', date: ymd(cupEnd(c)),
    title: `${shortName(c)}: ${winnerOf(c)} wins`, cover: 'thumbs-up', coverText: `Result · ${whereOf(c)}`
  }));
  const articles = sortByDateDesc(D.articles || []);
  const top = articles.find((a) => a.top) || articles[0];
  const side = articles.filter((a) => a !== top).slice(0, 2);
  const latest = sortByDateDesc([...articles.filter((a) => a !== top && !side.includes(a)), ...resultNews]).slice(0, 10);
  const catShort = (id) => (D.newsCategories.find((c) => c.id === id) || {}).short || id;
  const metaOf = (a) => `${fmtDate(a.date)}${a.readMin ? ` · ${a.readMin} min read` : ''}`;

  // Top Story: große Bildkarte, Janna in ganzer Figur (Platzhalter bis zu eigenen Titelbildern)
  function renderTopStory() {
    if (!top) return;
    const box = $('top-story');
    box.innerHTML = `
      <img class="janna ts-janna" src="assets/img/janna/janna-${esc(top.cover || 'trophy')}.png" alt="" decoding="async" />
      <div class="ts-text">
        <div class="ts-tags"><span class="te-tag is-gold">Top story</span><span class="te-tag">${esc(catShort(top.cat))}</span><span class="ts-meta">${esc(metaOf(top))}</span></div>
        <h2 class="ts-title"><a href="${articleUrl(top)}">${esc(top.title)}</a></h2>
        ${top.teaser ? `<p class="ts-teaser">${esc(top.teaser)}</p>` : ''}
        <p class="ts-count" id="ts-count" aria-live="polite"></p>
      </div>`;
  }
  function renderSideNews() {
    $('hub-news').innerHTML = side.length ? side.map(articleCard).join('')
      : empty({ ic: 'news', cls: 'empty-tight', title: 'More stories are on their way', href: 'news.html', cta: 'News' });
  }
  function renderLatest() {
    $('latest-news').innerHTML = latest.length ? latest.map(articleCard).join('')
      : empty({ ic: 'news', cls: 'empty-tight', title: 'More news are on their way' });
  }

  /* ---------- Countdown in der Top Story: das große Event (Weltmeisterschaft, sonst das nächste Turnier) ---------- */
  const featured = D.cups.find((c) => c.page && !cupPast(c)) || upcoming[0];
  function startOf(c) {
    if (c.startReported && new Date(c.startReported) > new Date(Date.now() - 864e5 * 3)) return new Date(c.startReported);
    return toDate(nextBlock(c).from);
  }
  function renderCountdown() {
    const box = $('ts-count');
    if (!box || !featured || !nextBlock(featured)) { if (box) box.innerHTML = ''; return; }
    const name = esc(shortName(featured));
    if (isLiveNow(featured)) {
      const dates = cupDays(featured).flatMap((x) => { const out = []; for (let d = toDate(x.from.slice(0, 10)); d <= toDate(x.to.slice(0, 10)); d.setDate(d.getDate() + 1)) out.push(ymd(d)); return out; });
      box.innerHTML = `<a href="${cupUrl(featured)}"><span class="rec-dot" aria-hidden="true"></span>${name}: Day ${dates.indexOf(ymd(new Date())) + 1} of ${dates.length} – live now${icon('arrow')}</a>`;
      return;
    }
    const left = Math.max(0, startOf(featured) - new Date());
    const d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60;
    box.innerHTML = `<a href="${cupUrl(featured)}">${icon('clock')}${name} starts in <b>${d}d ${h}h ${String(m).padStart(2, '0')}m</b>${icon('arrow')}</a>`;
  }

  /* ---------- TFT explained ---------- */
  function statOf(x) {
    if (x.statFrom === 'topStream') return liveData && liveData.streams[0] ? liveData.streams[0].name : 'Live';
    if (x.statFrom === 'upcoming') return String(mine(upcoming).length);
    if (x.statFrom === 'nextSet') {
      const set = (D.setEvents || []).filter((e) => e.kind === 'set-start' && daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];
      return set ? fmtDate(set.date).replace(/ \d{4}$/, '') : '–';
    }
    return x.stat;
  }
  function renderExplained() {
    $('explained').innerHTML = (D.explained || []).map((x) => `<a class="ex-card" href="${esc(x.href)}">
        <span class="ex-box">
          <span class="ex-cat">${esc(x.cat)}</span>
          <b class="ex-q">${esc(x.q)}</b>
          <span class="ex-text">${esc(x.text)}</span>
          <span class="ex-stat">${esc(statOf(x))}</span>
          <span class="ex-label">${esc(x.statLabel)}</span>
          <img class="janna ex-janna" src="assets/img/janna/janna-${esc(x.pose)}-bust.png" alt="" loading="lazy" decoding="async" />
        </span>
        <span class="ex-foot"><span>TFT explained · ${esc(x.q.replace(/\?$/, ''))}</span>${icon('arrow')}</span>
      </a>`).join('');
    $('explained-links').innerHTML = (D.explainedLinks || []).map((x) => `<a class="chip" href="${esc(x.href)}">${esc(x.q)}</a>`).join('') +
      '<a class="chip is-dark" href="news.html?category=orientierung">All guides →</a>';
  }

  /* ---------- Esports-Spalte ---------- */
  let tab = 'next';
  const LEVEL_IC = { regional: 'pin', streamer: 'twitch', eigener: 'users' };
  const levelIc = (c) => `<span class="eb-ic is-${esc(c.level)}">${c.level === 'offiziell' ? crown() : icon(LEVEL_IC[c.level] || 'trophy')}</span>`;
  function ebNext(c) {
    const b = nextBlock(c), st = finderStatus(c), live = isLiveNow(c);
    return `<a class="eb-item${live ? ' is-live' : ''}" href="${cupUrl(c)}">
      <span class="eb-top">${levelIc(c)}<span class="eb-kind">${esc(label('cupLevels', c.level))} · ${esc(whereOf(c))}</span>${live ? '<span class="badge-live">Live</span>' : ''}</span>
      <b class="eb-name">${esc(c.name)}</b>
      <span class="eb-meta"><span>${icon('calendar')}${esc(range(b))}${b.label ? ` · ${esc(b.label)}` : ''}</span><span class="status-pill is-${st.key}">${icon(st.ic)}${esc(st.text)}</span></span>
      ${c.streamUrl && (live || c.level === 'offiziell') ? `<span class="eb-watch">Watch live: <span>${icon('twitch')}${esc(c.streamUrl.replace(/^https?:\/\/(www\.)?/, ''))}</span></span>` : ''}
    </a>`;
  }
  function ebResult(c) {
    const w = winnerOf(c);
    return `<a class="eb-item" href="${cupUrl(c)}">
      <span class="eb-top">${levelIc(c)}<span class="eb-kind">${esc(whereOf(c))} · ${esc(fmtDay(ymd(cupEnd(c))))}</span></span>
      <b class="eb-name">${esc(c.name)}</b>
      <span class="eb-meta">${w ? `<span class="eb-winner">${icon('trophy')}${esc(w)}</span>` : '<span class="is-muted">Result not entered yet</span>'}</span>
    </a>`;
  }
  // Weltmeisterschaft: aktuelle Tabelle (assets/data/crown-standings.js), solange das Turnier läuft der erste Reiter
  const CS = D.crownStandings;
  const crownCup = D.cups.find((c) => c.id === 'tacticians-crown-set-18');
  const csDay = CS ? Math.max(...Object.keys(CS.days).map(Number)) : 0;
  const showWorlds = !!csDay && crownCup && cupEnd(crownCup) > new Date(Date.now() - 3 * 864e5);
  if (showWorlds) tab = 'worlds';
  else { const t = document.querySelector('[data-tab="worlds"]'); if (t) t.remove(); }
  // Tabelle: live aus dem Score Sheet (crown-live.js), bis dahin die gespeicherte; Ausgeschiedene unter dem Strich
  let crownT = D.crownTableStatic ? D.crownTableStatic() : null;
  const loadCrown = (fresh) => D.crownTable && D.crownTable(fresh).then((t) => { if (t) { crownT = t; if (tab === 'worlds') renderEsports(); } });
  loadCrown(false);
  setInterval(() => loadCrown(true), 120000);
  // Tagesbericht verlinken, sobald es ihn gibt (Artikel mit slug tacticians-crown-2026-day-N)
  const recapDay = Math.max(0, ...(D.articles || []).map((a) => { const m = /^tacticians-crown-2026-day-(\d)$/.exec(a.slug || ''); return m ? Number(m[1]) : 0; }));
  function ebStandings() {
    const t = crownT;
    if (!t) return '';
    const prof = (r) => (r.login ? `tft-streamers/${esc(r.login)}.html` : 'tft-tacticians-crown.html#standings');
    const firstOut = t.rows.findIndex((r) => r.out);
    return `<div class="eb-st">
      <p class="eb-st-head">${window.UI.gameIcon('crown')}<b>Tactician's Crown</b><span>${t.live ? '<span class="rec-dot" aria-hidden="true"></span>' : ''}${esc(t.label)}</span></p>
      <ol class="eb-st-list">${t.rows.map((r, i) => `${i === firstOut && i > 0 ? `<li class="eb-st-cut"><span>${t.day === 1 ? 'Cut' : 'Out'}</span></li>` : ''}<li class="${r.out ? 'is-out' : ''}${r.rank <= 3 && !r.out ? ' is-top' : ''}">
        <span class="eb-st-rank">${r.rank}</span><a href="${prof(r)}">${r.champion ? window.UI.gameIcon('crown', 'eb-st-champ') : ''}${esc(r.name)}${r.checkmate ? ' <small class="eb-st-cm">CM</small>' : ''}</a><span class="sg-reg r-${esc(r.region.toLowerCase())}">${esc(r.region)}</span><b>${r.pts}</b></li>`).join('')}</ol>
      <div class="eb-st-links"><a class="link-arrow" href="tft-tacticians-crown.html#standings">Full standings${icon('arrow')}</a>${recapDay ? `<a class="link-arrow" href="news/tacticians-crown-2026-day-${recapDay}.html">Day ${recapDay} recap${icon('arrow')}</a>` : ''}</div>
    </div>`;
  }  function renderEsports() {
    document.querySelectorAll('[data-tab]').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === tab));
    document.querySelector('.eb-where').hidden = tab === 'worlds';
    if (tab === 'worlds') { $('eb-list').innerHTML = ebStandings(); return; }
    const list = tab === 'next' ? mine(upcoming).slice(0, 6) : mine(pastOfficial).slice(0, 6);
    $('eb-list').innerHTML = list.length ? list.map(tab === 'next' ? ebNext : ebResult).join('')
      : empty({ ic: tab === 'next' ? 'calendar' : 'trophy', cls: 'empty-tight', title: tab === 'next' ? 'No upcoming tournaments for this selection' : 'No results for this selection yet' });
  }
  document.querySelector('.eb-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (b) { tab = b.dataset.tab; renderEsports(); }
  });

  /* ---------- Info-Leiste ---------- */
  let liveData = null;
  const strip = (kicker, main, sub, href, cls = '') => `<a class="is-tile ${cls}" href="${href}"><small>${kicker}</small><b>${main}</b><span>${sub}</span></a>`;
  function renderStrip() {
    const tiles = [];
    const last = mine(pastOfficial)[0];
    if (last) tiles.push(strip(`${icon('trophy')}Latest result · ${esc(fmtDay(ymd(cupEnd(last))))}`, esc(last.name), winnerOf(last) ? `Winner: <em>${esc(winnerOf(last))}</em>` : 'Result coming soon', cupUrl(last)));
    const next = mine(upcoming).find((c) => !isLiveNow(c)) || mine(upcoming)[0];
    if (next) tiles.push(strip(`${icon('calendar')}${isLiveNow(next) ? 'Running now' : 'Next up'} · ${esc(fmtDay(nextBlock(next).from))}`, esc(next.name), `${esc(whereOf(next))} · ${relDays(daysUntil(nextBlock(next).from))}`, cupUrl(next)));
    const top = liveData && liveData.streams[0];
    tiles.push(top
      ? strip(`${icon('radio')}Biggest stream now`, esc(top.name), `<em>${fmt(top.viewers)}</em> viewers · ${fmt(liveData.totalStreams)} TFT streams live`, 'twitch.html')
      : strip(`${icon('radio')}Live streams`, 'TFT on Twitch', 'All live streams on one page', 'twitch.html'));
    const open = mine(upcoming).filter(signupOpen).sort((a, b) => toDate(a.signupDeadline) - toDate(b.signupDeadline));
    const soon = mine(upcoming).find((c) => finderStatus(c).key === 'soon');
    tiles.push(open.length
      ? strip(`${icon('users')}Open sign-ups`, `${open.length} ${open.length === 1 ? 'tournament' : 'tournaments'}`, `Next deadline: <em>${esc(fmtDay(open[0].signupDeadline))}</em>`, 'tft-tournaments.html?view=list&amp;open=1')
      : strip(`${icon('users')}Open sign-ups`, 'None right now', soon ? `Next: ${esc(soon.name)}` : 'New cups appear here first', 'tft-tournaments.html?view=list'));
    const set = (D.setEvents || []).filter((e) => e.kind === 'set-start' && daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];
    if (set) tiles.push(strip(`${icon('star')}Next set`, esc(set.title.replace(/ launches$/, '')), `${esc(fmtDay(set.date))} · <em>${relDays(daysUntil(set.date))}</em>`, '#set-title', 'is-dark'));
    $('info-strip').innerHTML = tiles.join('');
  }

  /* ---------- Find your next tournament ---------- */
  const FILTERS = {
    alle: () => true,
    mitspielen: (c) => ['open', 'soon', 'unknown'].includes(finderStatus(c).key),
    zuschauen: (c) => ['none', 'closed'].includes(finderStatus(c).key)
  };
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) { /* egal */ } } };
  const thisMonth = () => ymd(new Date()).slice(0, 7);
  let filter = 'alle';
  let view = store.get('tfte-home-view') === 'kalender' ? 'kalender' : 'liste';
  let month = thisMonth();

  function renderFinder() {
    const pick = (c) => FILTERS[filter](c) && playableFrom(c, where);
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
         ${list.length > 8 ? `<a class="finder-more link-arrow" href="tft-tournaments.html?view=list${where ? `&amp;where=${where}` : ''}">All ${list.length} tournaments${icon('arrow')}</a>` : ''}`
      : empty({ pose: 'sad', cls: 'empty-tight', title: filter === 'alle' && !where ? 'No upcoming tournaments yet' : 'Nothing for this filter right now', text: 'New dates appear here automatically – or have a look at the calendar.', href: 'tft-tournaments.html', cta: 'Tournament calendar' });
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

  /* ---------- „Wo spielst du?“ – zwei Auswahlfelder, ein Zustand ---------- */
  function renderWhere() {
    ['eb-where', 'home-where'].forEach((id) => { $(id).innerHTML = whereOptions(where); });
    $('home-where').closest('.where-pick').classList.toggle('is-set', !!where);
    $('eb-where').closest('.eb-where').classList.toggle('is-set', !!where);
  }
  ['eb-where', 'home-where'].forEach((id) => $(id).addEventListener('change', (e) => {
    where = e.target.value;
    setWhere(where);
    renderWhere(); renderEsports(); renderStrip(); renderFinder(); renderExplained();
  }));

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

  /* ---------- Live: Kopfzeile, Info-Leiste und die größten Streams ---------- */
  async function renderStreams() {
    const { data, reason } = await loadStreams();
    liveData = data;
    $('hl-viewers').textContent = data ? fmt(data.totalViewers) : '–';
    renderStrip();
    renderExplained();
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

  renderTopStory();
  renderCountdown();
  renderSideNews();
  renderLatest();
  renderExplained();
  renderWhere();
  renderEsports();
  renderStrip();
  renderFinder();
  renderSetDates();
  renderStreams();
  setInterval(renderCountdown, 30000);
  setInterval(renderStreams, 120000);
})();
