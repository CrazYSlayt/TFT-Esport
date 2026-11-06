/* TFT E-Sports – gemeinsame Teile: Header, Navigation, Drawer, Suche, Footer und Helfer für alle Seiten. */
(function () {
  const D = window.TFTE;

  /* ---------- Symbole (24x24, Strich) ---------- */
  const ICONS = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    search: '<circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4.2-4.2"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
    external: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    chevronLeft: '<path d="m15 6-6 6 6 6"/>',
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    calendar: '<rect x="3.5" y="4.5" width="17" height="16" rx="3"/><path d="M8 2.5v4M16 2.5v4M3.5 10h17"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4.5a2.5 2.5 0 0 0 2.6 3.5M17 6h2.5a2.5 2.5 0 0 1-2.6 3.5"/><path d="M12 14v3.5M8.5 20.5h7M9.5 17.5h5v3h-5z"/>',
    twitch: '<path d="M4.5 3.5h16v10l-4 4h-4l-3 3v-3h-5z"/><path d="M11 8v4M15.5 8v4"/>',
    radio: '<path d="M4.9 19.1a10 10 0 0 1 0-14.2M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M19.1 4.9a10 10 0 0 1 0 14.2"/><circle cx="12" cy="12" r="2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.8 6.5-5.8s5.9 2.2 6.5 5.8"/><circle cx="17" cy="9" r="2.6"/><path d="M16.5 14.4c2.7.2 4.6 2.2 5 5.6"/>',
    news: '<path d="M4 5.5h12.5v13a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2z"/><path d="M16.5 9.5H20v9a2 2 0 0 1-4 0M7.5 9h5.5M7.5 12.5h5.5M7.5 16h3.5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="9.5" r="1.8"/><path d="m4 17 4.5-4.5 3.5 3.5 2.5-2.5L20 18"/>',
    play: '<path d="M8 5.5v13l10-6.5z"/>',
    swords: '<path d="M14.5 17.5 3.5 6.5v-3h3l11 11M13 19l6-6M16 16l4 4M19 21l2-2"/><path d="m14.5 6.5 3-3h3v3l-3 3M5 14l4 4M7 17l-3 3M3 19l2 2"/>',
    star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
    shield: '<path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6z"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
    sofa: '<path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11"/><path d="M3.5 12.5a2 2 0 0 1 4 0V14h9v-1.5a2 2 0 0 1 4 0V18h-17z"/><path d="M6 18v2M18 18v2"/>'
  };
  const icon = (name, cls = '') =>
    `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  /* Krone aus dem Logo */
  const crown = (cls = '') =>
    `<svg class="crown ${cls}" viewBox="0 0 48 40" aria-hidden="true"><path fill="currentColor" d="M24 2.5 30.5 15 40 6.5l-2.8 22.5H10.8L8 6.5 17.5 15z"/><path fill="currentColor" d="M10.5 32h27a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-27A1.5 1.5 0 0 1 9 36.5v-3a1.5 1.5 0 0 1 1.5-1.5z"/><path fill="none" stroke="var(--crown-cut, #F7F3EA)" stroke-width="2.2" stroke-linecap="round" d="M24 14v10"/></svg>`;

  /* ---------- Helfer ---------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => Number(n).toLocaleString('en-US');
  const served = location.protocol.startsWith('http');
  // Links relativ zur Projektwurzel, damit die Seite auch per Doppelklick (file://) läuft.
  // Wurzel = Pfad, über den diese Seite app.js einbindet (z. B. '../' für news/vorlage.html).
  const ROOT = (document.currentScript.getAttribute('src') || '').replace(/assets\/js\/app\.js.*$/, '');
  const link = (file) => ROOT + file;
  // Adresse in der Leiste ändern (Filter teilbar); manche Browser erlauben das bei file:// nicht
  const setUrl = (url) => { try { history.replaceState(null, '', url); } catch (_) { /* egal */ } };

  // Uhrzeiten stehen in den Daten in deutscher Zeit ('2026-11-07T18:00') und werden in der Ortszeit des Besuchers angezeigt.
  // Reines Datum bleibt ein Kalendertag (00:00 Ortszeit). Angaben mit Z oder +01:00 gelten wie geschrieben.
  function berlin(iso) {
    const utc = new Date(`${iso.slice(0, 16)}:00Z`);
    const at = (timeZone) => new Date(utc.toLocaleString('en-US', { timeZone }));
    return new Date(utc.getTime() - (at('Europe/Berlin') - at('UTC')));
  }
  const toDate = (iso) => (!/T/.test(iso) ? new Date(`${iso}T00:00`) : /(Z|[+-]\d\d:\d\d)$/.test(iso) ? new Date(iso) : berlin(iso));
  const fmtDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) => toDate(iso).toLocaleDateString('en-GB', opts);
  const fmtTime = (iso) => toDate(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dayMonth = (iso) => {
    const d = toDate(iso);
    return { day: String(d.getDate()).padStart(2, '0'), mon: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() };
  };

  const label = (list, id) => (D[list].find((x) => x.id === id) || {}).label || id;
  const catLabel = (id) => (D.newsCategories.find((c) => c.id === id) || {}).short || id;
  const articleUrl = (a) => link(`news/${encodeURIComponent(a.slug)}.html`);
  const sortByDateDesc = (list) => [...list].sort((a, b) => toDate(b.date) - toDate(a.date));
  function startOfToday() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  // Reines Datum gilt bis zum Ende des Tages (Anmeldeschluss „14.09.“ = noch am 14.09. möglich)
  const endOf = (iso) => (/T/.test(iso) ? toDate(iso) : new Date(toDate(iso).getTime() + 864e5 - 1));
  // „Sat 10 Oct“ (mit Jahr „Sat 10 Oct 2026“), mit Uhrzeit „Sat 10 Oct 2026, 18:00“
  const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDay = (iso, year = false) => {
    const d = toDate(iso);
    return `${WD[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}${year ? ` ${d.getFullYear()}` : ''}`;
  };
  const fmtWhen = (iso) => fmtDay(iso, true) + (/T/.test(iso) ? `, ${fmtTime(iso)}` : '');

  /* ---------- Turniere ---------- */
  const cupUrl = (c) => link(c.page || `tft-tournaments/${encodeURIComponent(c.id)}.html`);
  const cupDays = (c) => (c.days || []).filter((d) => d.from).map((d) => ({ from: d.from, to: d.to || d.from, label: d.label || '' }))
    .sort((a, b) => toDate(a.from) - toDate(b.from));
  const cupStart = (c) => { const d = cupDays(c); return d.length ? toDate(d[0].from) : null; };
  const cupEnd = (c) => { const d = cupDays(c); return d.length ? endOf(d[d.length - 1].to) : null; };
  const cupPast = (c) => { const e = cupEnd(c); return !!e && e < new Date(); };
  // Alle Spieltage als 'JJJJ-MM-TT' (für den Kalender)
  function cupDates(c) {
    const out = [];
    for (const d of cupDays(c)) {
      for (let x = toDate(d.from.slice(0, 10)); x <= toDate(d.to.slice(0, 10)); x.setDate(x.getDate() + 1)) out.push(ymd(x));
    }
    return out;
  }
  const byStart = (a, b) => (cupStart(a) || 0) - (cupStart(b) || 0);
  // Nächster Spielblock, der noch nicht vorbei ist (bei Turnieren über Wochen, z. B. Qualifier im Sept., Finale im Dez.)
  const cupNext = (c) => { const d = cupDays(c).find((x) => endOf(x.to) >= new Date()); return d ? toDate(d.from) : null; };
  const upcomingCups = () => D.cups.filter((c) => cupNext(c)).sort((a, b) => cupNext(a) - cupNext(b));
  // Spieltage lesbar: „Sat 10 Oct – Sun 11 Oct · Fri 16 Oct – Sun 18 Oct“
  const fmtDays = (c) => cupDays(c).map((d) =>
    `${d.label ? `${d.label}: ` : ''}${fmtDay(d.from)}${d.to !== d.from ? ` – ${fmtDay(d.to)}` : ''}${/T/.test(d.from) ? `, ${fmtTime(d.from)}` : ''}`).join(' · ');

  // Anmeldestatus: open | soon | closed | unknown | none
  function signupState(c) {
    const now = new Date();
    if (!c.signupDeadline && !c.signupUrl) return { key: 'none', text: 'No sign-up – qualified players only' };
    if (!c.signupDeadline) return { key: 'unknown', text: 'Deadline not announced yet' };
    if (endOf(c.signupDeadline) < now) return { key: 'closed', text: 'Sign-up closed' };
    if (c.signupStart && toDate(c.signupStart) > now) return { key: 'soon', text: `Sign-up opens ${fmtDay(c.signupStart)}` };
    return { key: 'open', text: `Sign-up open until ${fmtDay(c.signupDeadline)}` };
  }
  const signupOpen = (c) => signupState(c).key === 'open';
  const hostOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (_) { return url; } };

  /* ---------- Bausteine ---------- */
  // Beschrifteter Bildplatzhalter, bis echte Bilder vorhanden sind
  const imgPlaceholder = (text, cls = '') =>
    `<div class="ph-img ${cls}" role="img" aria-label="Image placeholder: ${esc(text)}"><span>${icon('image')}${esc(text)}</span></div>`;

  // Janna, das Maskottchen: 10 Posen in assets/img/janna/ – als Oberkörper ('-bust', Standard) oder ganze Figur.
  // Posen: winken, caster, ueberlegen, pokal, tablet, staunen, daumen, traurig, fan, krone
  // In Boxen immer am Rand: cls 'at-r' (rechts) oder 'at-l' (links), siehe CSS „Janna“.
  const janna = (pose, cls = '', full = false) =>
    `<img class="janna janna-${pose} ${cls}" src="${link(`assets/img/janna/janna-${pose}${full ? '' : '-bust'}.png`)}" alt="" loading="lazy" decoding="async" />`;
  const searchEmpty = (title, text, pose) => `<div class="search-empty">${janna(pose, 'search-janna')}<p class="empty-title">${title}</p><p class="empty-text">${text}</p></div>`;

  // Leerzustand: Symbol (oder Janna), Titel, kurzer Text, optional ein Link
  const empty = ({ ic = 'info', title, text, href, cta, cls = '', pose }) => `
    <div class="empty ${cls} ${pose ? 'has-janna' : ''}">
      ${pose ? janna(pose, 'empty-janna at-l') : `<span class="empty-ic">${icon(ic)}</span>`}
      <div>
        <p class="empty-title">${title}</p>
        ${text ? `<p class="empty-text">${text}</p>` : ''}
        ${href ? `<a class="link-arrow" href="${href}">${cta}${icon('arrow')}</a>` : ''}
      </div>
    </div>`;

  const tag = (text, kind = '') => `<span class="tag ${kind ? `tag-${kind}` : ''}">${esc(text)}</span>`;

  function articleCard(a) {
    return `<a class="card news-card" href="${articleUrl(a)}">
      ${a.image ? `<img class="card-img" src="${esc(link(a.image))}" alt="" loading="lazy" />` : imgPlaceholder('Article image', 'card-img')}
      <div class="card-body">
        ${tag(catLabel(a.cat), a.cat)}
        <h3 class="card-title">${esc(a.title)}</h3>
        <p class="card-meta">${esc(fmtDate(a.date))}${a.readMin ? ` · ${a.readMin} min read` : ''}<span class="card-go">${icon('arrow')}</span></p>
      </div>
    </a>`;
  }

  // Kompakte Zeile (Startseite „Was steht an?“)
  function cupRow(c) {
    const dm = dayMonth(ymd(cupNext(c) || cupStart(c)));
    const s = signupState(c);
    return `<a class="cup-row" href="${cupUrl(c)}">
      <span class="date-block"><b>${dm.day}</b><small>${dm.mon}</small></span>
      <span class="cup-row-main">
        <strong>${esc(c.name)}</strong>
        <span class="cup-row-meta">
          ${tag(label('cupLevels', c.level), c.level)}
          <span>${esc(label('regions', c.region))}</span>
          <span class="signup is-${s.key}">${esc(s.text)}</span>
        </span>
      </span>
      <span class="row-go">${icon('arrow')}</span>
    </a>`;
  }

  // Zeile „Finde dein nächstes Turnier“ (Startseite): Datum, Art, Name, Region · Spielblock, Anmeldestatus
  const LEVEL_IC = { regional: 'pin', streamer: 'twitch', eigener: 'users' };
  function finderStatus(c) {
    let key = signupState(c).key;
    if (key === 'unknown' && c.requirement === 'quali') key = 'none';   // Info-Link, aber keine offene Anmeldung
    const st = {
      open: () => ({ ic: 'users', text: `Sign up by ${fmtDay(c.signupDeadline)}` }),
      soon: () => ({ ic: 'clock', text: `Sign-up opens ${fmtDay(c.signupStart)}` }),
      unknown: () => ({ ic: 'info', text: 'Sign-up to be announced' }),
      closed: () => ({ ic: 'play', text: 'Watch' }),
      none: () => ({ ic: 'lock', text: 'Qualified only' })
    }[key]();
    return { key, ...st };
  }
  function finderRow(c) {
    const next = cupDays(c).find((x) => endOf(x.to) >= new Date()) || cupDays(c)[0];
    const dm = dayMonth(next.from.slice(0, 10));
    const st = finderStatus(c);
    return `<a class="finder-row" href="${cupUrl(c)}">
      <span class="date-badge"><b>${dm.day}</b><small>${dm.mon}</small></span>
      <span class="level-ic is-${esc(c.level)}">${c.level === 'offiziell' ? crown() : icon(LEVEL_IC[c.level] || 'trophy')}</span>
      <span class="finder-main"><strong>${esc(c.name)}</strong><small>${esc(label('regions', c.region))} · ${esc(next.label || label('cupLevels', c.level))}</small></span>
      <span class="status-pill is-${st.key}">${icon(st.ic)}${esc(st.text)}</span>
      <span class="row-go">${icon('arrow')}</span>
    </a>`;
  }

  // Die fünf Kernfragen eines Turniers – auf Karten und auf der Detailseite gleich
  function keyFacts(c) {
    const s = signupState(c);
    const deadline = c.signupDeadline ? fmtWhen(c.signupDeadline)
      : !c.signupUrl ? 'No sign-up' : cupPast(c) ? 'Not stated by the organizer' : 'Not announced yet';
    const where = c.signupUrl
      ? `<a href="${esc(c.signupUrl)}" target="_blank" rel="noopener">${esc(hostOf(c.signupUrl))}${icon('external')}</a>`
      : 'No sign-up – qualified players only';
    return `<dl class="keyfacts">
      <div><dt>${icon('users')}Who can enter?</dt><dd>${esc(c.eligibility || 'Not announced yet')}</dd></div>
      <div><dt>${icon('shield')}Rank requirement</dt><dd>${esc(c.rank || 'Not announced yet')}</dd></div>
      <div class="kf-${s.key}"><dt>${icon('clock')}Sign-up deadline</dt><dd>${esc(deadline)}</dd></div>
      <div><dt>${icon('calendar')}Game days</dt><dd>${esc(fmtDays(c) || 'Not announced yet')}</dd></div>
      <div><dt>${icon('link')}Where to sign up</dt><dd>${where}</dd></div>
    </dl>`;
  }

  // Turnierkarte mit den Kernfragen (Übersicht)
  function cupCard(c) {
    const s = signupState(c);
    const past = cupPast(c);
    return `<article class="cup-card ${past ? 'is-past' : ''}">
      <header class="cup-card-head">
        <div class="cup-card-tags">${tag(label('cupLevels', c.level), c.level)}${tag(label('regions', c.region), 'region')}${past ? tag('Past', 'past') : ''}</div>
        <h3><a href="${cupUrl(c)}">${esc(c.name)}</a></h3>
        ${past ? '' : `<span class="signup-pill is-${s.key}">${esc(s.text)}</span>`}
      </header>
      ${keyFacts(c)}
      <footer class="cup-card-foot">
        <a class="link-arrow" href="${cupUrl(c)}">Full details${icon('arrow')}</a>
        ${c.checked ? `<span>Checked ${esc(fmtDate(c.checked))}${c.organizer ? ` · ${esc(c.organizer)}` : ''}</span>` : ''}
      </footer>
    </article>`;
  }

  /* ---------- Monatskalender: Spieltage, Anmeldeschlüsse und Set-Termine (Startseite und Turnierseite) ---------- */
  const SET_ICON = { 'set-start': 'star', pbe: 'info', 'set-end': 'clock' };
  const setEventsOn = (key) => (D.setEvents || []).filter((e) => e.date === key);
  function calendarGrid(month, cups) {
    const [y, m] = month.split('-').map(Number);
    const first = new Date(y, m - 1, 1);
    const last = new Date(y, m, 0);
    const start = new Date(first);
    start.setDate(1 - ((first.getDay() + 6) % 7));            // Woche beginnt am Montag
    const today = ymd(new Date());
    const now = new Date();
    let cells = '';
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      if (i >= 35 && d > last) break;                          // sechste Woche nur, wenn der Monat sie braucht
      const key = ymd(d);
      const infos = setEventsOn(key);
      const deadlines = cups.filter((c) => c.signupDeadline && c.signupDeadline.slice(0, 10) === key);
      const plays = cups.filter((c) => cupDates(c).includes(key));
      cells += `<div class="cal-day ${d.getMonth() !== m - 1 ? 'other' : ''} ${key === today ? 'today' : ''}">
        <span class="cal-num">${d.getDate()}</span>
        ${infos.map((e) => `<span class="cal-ev cal-info is-${esc(e.kind)}" title="${esc(`${e.title} – ${e.info}`)}">${icon(SET_ICON[e.kind] || 'info')}${esc(e.short || e.title)}</span>`).join('')}
        ${deadlines.map((c) => `<a class="cal-ev cal-deadline ${endOf(c.signupDeadline) < now ? 'past' : ''}" href="${cupUrl(c)}" title="Sign-up deadline: ${esc(c.name)}">${icon('clock')}Deadline · ${esc(c.name)}</a>`).join('')}
        ${plays.map((c) => `<a class="cal-ev ${esc(c.level)} ${cupPast(c) ? 'past' : ''}" href="${cupUrl(c)}" title="${esc(c.name)}">${esc(c.name)}</a>`).join('')}
      </div>`;
    }
    return `<div class="cal-grid">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => `<div class="cal-wd">${w}</div>`).join('')}${cells}</div>`;
  }
  const calLegend = () => `<span><i class="lg lg-offiziell"></i>Official</span><span><i class="lg lg-regional"></i>Regional</span>
    <span><i class="lg lg-streamer"></i>Streamer cup</span><span><i class="lg lg-deadline"></i>Sign-up deadline</span><span><i class="lg lg-info"></i>Set date</span>`;

  /* ---------- Twitch: Creator-Karten ---------- */
  const twitchUrl = (login) => `https://www.twitch.tv/${encodeURIComponent(login)}`;
  // Profilbild: Karikatur aus assets/img/streamers/ (image in den Daten) oder ein Platzhalter mit Anfangsbuchstabe
  const creatorUrl = (c) => link(`tft-streamers/${encodeURIComponent(c.login)}.html`);
  const creatorImage = (c) => (c.image
    ? `<img class="creator-img" src="${esc(link(c.image))}" alt="Caricature of ${esc(c.name)}" loading="lazy" decoding="async" />`
    : `<span class="creator-initial" aria-hidden="true">${esc(c.name.charAt(0))}</span>`);
  const creatorCard = (c) => `<a class="card creator-card" href="${creatorUrl(c)}">
      <div class="creator-top">${creatorImage(c)}<span class="creator-live" data-live="${esc(c.login)}"><span class="dot" aria-hidden="true"></span><span>Offline</span></span></div>
      <div class="card-body">
        <span><strong>${esc(c.name)}</strong><small>${esc(c.focus || '')}</small></span>
        <span class="card-go">${icon('arrow')}</span>
      </div>
    </a>`;
  // Leerer Platz: bleibt als beschrifteter Platzhalter sichtbar, bis die Redaktion Creator auswählt
  const creatorSlot = (n) => `<div class="card creator-card">
      <div class="creator-top"><span class="creator-initial is-empty" aria-hidden="true">${icon('users')}</span></div>
      <div class="card-body">
        <span><strong>Placeholder: streamer ${n}</strong><small>Profile coming soon</small></span>
      </div>
    </div>`;

  /* ---------- Twitch: Stream-Karten und Player-Fenster ---------- */
  let langNames = null;
  try { langNames = new Intl.DisplayNames(['en'], { type: 'language' }); } catch (_) { /* älterer Browser */ }
  function langName(code) {
    if (!code || code === 'other') return 'Other';
    try { const n = langNames && langNames.of(code); return n ? n.charAt(0).toUpperCase() + n.slice(1) : code.toUpperCase(); } catch (_) { return code.toUpperCase(); }
  }
  function uptime(iso) {
    const min = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    const h = Math.floor(min / 60);
    return h ? `${h} h ${min % 60} min` : `${min} min`;
  }
  const streams = new Map();   // login → Stream, damit ein Klick das Player-Fenster öffnen kann
  function streamCard(s, isPro = false) {
    streams.set(s.login, s);
    const minute = Math.floor(Date.now() / 60000);   // umgeht Twitchs Vorschaubild-Cache einmal pro Minute
    return `<a class="card stream-card" href="${twitchUrl(s.login)}" target="_blank" rel="noopener" data-watch="${esc(s.login)}">
      <div class="thumb">
        ${s.thumb ? `<img src="${esc(s.thumb)}?t=${minute}" alt="" loading="lazy" />` : ''}
        <span class="badge-live">Live</span>
        <span class="viewer-pill">${fmt(s.viewers)} viewers</span>
      </div>
      <div class="card-body">
        <span class="stream-name">${esc(s.name)}${isPro ? tag('Pro') : ''}</span>
        <p class="stream-title" title="${esc(s.title)}">${esc(s.title || '')}</p>
        <div class="stream-meta"><span>${esc(langName(s.lang))}</span><span>live for ${uptime(s.startedAt)}</span></div>
      </div>
    </a>`;
  }

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  const closeModal = () => { document.body.classList.remove('modal-open'); modal.innerHTML = ''; };
  function openWatch(s) {
    const host = encodeURIComponent(location.hostname);
    modal.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="Stream by ${esc(s.name)}">
      <div class="watch-head">
        <div class="watch-title"><strong>${esc(s.name)}</strong><span>${esc(s.title || '')}</span></div>
        <a class="btn btn-ghost" href="${twitchUrl(s.login)}" target="_blank" rel="noopener">Open on Twitch${icon('external')}</a>
        <button type="button" class="icon-btn" aria-label="Close" data-close-modal>${icon('x')}</button>
      </div>
      <div class="watch-main">
        <div class="player"><iframe src="https://player.twitch.tv/?channel=${encodeURIComponent(s.login)}&parent=${host}&autoplay=true" allowfullscreen allow="autoplay; fullscreen" title="Twitch player"></iframe></div>
        <iframe class="chat" src="https://www.twitch.tv/embed/${encodeURIComponent(s.login)}/chat?parent=${host}" title="Twitch chat"></iframe>
      </div>
    </div>`;
    document.body.classList.add('modal-open');
  }
  function initWatch() {
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-close-modal]')) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    // Einfacher Klick öffnet den Player auf der Seite (der Twitch-Player lädt erst dann); Strg/Cmd-Klick öffnet Twitch
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-watch]');
      if (!a || !served || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
      const s = streams.get(a.dataset.watch);
      if (!s) return;
      e.preventDefault();
      openWatch(s);
    });
    // Kaputtes Vorschaubild → nur die dunkle Fläche zeigen
    document.addEventListener('error', (e) => { if (e.target instanceof HTMLImageElement && e.target.closest('.thumb')) e.target.remove(); }, true);
  }

  /* ---------- Live-Status einzelner Kanäle, auch außerhalb von TFT (/api/channels) ---------- */
  async function loadChannels(logins) {
    if (!served || !logins.length) return null;
    try {
      const r = await fetch(`/api/channels?login=${logins.map(encodeURIComponent).join(',')}`);
      const json = await r.json();
      return json.source === 'twitch' ? json.channels : null;
    } catch (_) { return null; }
  }

  /* ---------- Twitch-Daten (Vercel-Funktion /api/streams, lokal server.ps1) ---------- */
  async function loadStreams() {
    if (!served) return { data: null, reason: 'no-server' };
    try {
      const r = await fetch('/api/streams', { cache: 'no-store' });
      const json = await r.json();
      if (!r.ok) return { data: null, reason: 'twitch-error' };
      if (json.source !== 'twitch') return { data: null, reason: json.reason || 'no-credentials' };
      return { data: json, reason: null };
    } catch (_) { return { data: null, reason: 'no-server' }; }
  }
  const STREAM_REASONS = {
    'no-credentials': 'Live data from Twitch is being connected. Until then you can watch directly on Twitch.',
    'no-server': 'Live data from Twitch is only available on the published site.',
    'twitch-error': 'Twitch cannot be reached right now. Please try again in a moment.'
  };

  /* ---------- Navigation ---------- */
  // mark: kleines Zeichen vor dem Menüpunkt (grüner Live-Punkt bzw. Symbol), wie bei dota2news.com
  const NAV = [
    { id: 'cups', href: link('tft-tournaments.html'), label: 'Tournaments' },
    { id: 'matches', href: link('live-matches.html'), label: 'Live Matches', mark: '<span class="nav-dot" aria-hidden="true"></span>' },
    { id: 'twitch', href: link('twitch.html'), label: 'Live Streams', mark: icon('radio') },
    { id: 'pros', href: link('pro-players.html'), label: 'Pro Players' },
    { id: 'news', href: link('news.html'), label: 'News' }
  ];
  const LEGAL = [
    { href: link('about.html'), label: 'About' },
    { href: link('contact.html'), label: 'Contact' },
    { href: link('legal-notice.html'), label: 'Legal notice' },
    { href: link('privacy.html'), label: 'Privacy' }
  ];
  // Marke: Janna-Kopf als Symbol, dazu der Schriftzug „TFT E-Sports“ (E-Sports in Gold)
  const brand = () => `<a class="brand" href="${link('index.html')}" aria-label="${D.site.name} home">
      <img class="brand-head" src="${link('assets/brand/janna-kopf.png')}" alt="" width="147" height="160" />
      <span class="brand-word">TFT<em>E-Sports</em></span></a>`;

  function renderHeader() {
    const el = document.getElementById('site-header');
    if (!el) return;
    const page = document.body.dataset.page;
    const section = page === 'streams' ? 'twitch' : page;
    el.className = 'site-header';
    el.innerHTML = `
      <div class="header-bar">
        <button class="hb-cell burger" type="button" aria-label="Open menu" data-open-drawer>${icon('menu')}</button>
        ${brand()}
        <nav class="mainnav" aria-label="Main navigation">
          ${NAV.map((n) => `<a href="${n.href}" ${section === n.id ? 'class="active" aria-current="page"' : ''}>${n.mark || ''}${n.label}</a>`).join('')}
        </nav>
        <button class="hb-cell hb-search" type="button" aria-label="Open search" data-open-search>${icon('search')}<span>Search</span></button>
      </div>`;
  }

  /* ---------- Leiste unter dem Menü: Kanal des Betreibers mit grünem Live-Punkt oder grauem Offline-Punkt ---------- */
  const OWN_CHANNEL = { login: 'crazyslayt', name: 'CrazYSlayt' };
  function renderLiveBar() {
    const header = document.getElementById('site-header');
    if (!header) return;
    const url = twitchUrl(OWN_CHANNEL.login);
    header.insertAdjacentHTML('afterend', `<div class="live-bar" id="live-bar"><a class="wrap live-bar-in" href="${url}" target="_blank" rel="noopener"></a></div>`);
    const box = document.querySelector('#live-bar a');
    const show = (ch) => {
      document.getElementById('live-bar').classList.toggle('is-live', !!(ch && ch.live));
      box.innerHTML = ch && ch.live
        ? `<span class="dot is-live" aria-hidden="true"></span><b>${OWN_CHANNEL.name}</b><span class="lb-state">is live</span><span class="lb-title">${esc(ch.title || '')}</span><span class="lb-go">${fmt(ch.viewers)} viewers · Watch${icon('arrow')}</span>`
        : `<span class="dot" aria-hidden="true"></span><b>${OWN_CHANNEL.name}</b><span class="lb-state">offline</span><span class="lb-go">Twitch${icon('external')}</span>`;
    };
    const update = async () => { const c = await loadChannels([OWN_CHANNEL.login]); show(c && c[OWN_CHANNEL.login]); };
    show(null);
    update();
    setInterval(update, 120000);
  }

  function renderDrawer() {
    const page = document.body.dataset.page;
    const section = page === 'streams' ? 'twitch' : page;
    const wrap = document.createElement('div');
    wrap.className = 'drawer-wrap';
    wrap.innerHTML = `
      <div class="drawer-backdrop" data-close-drawer></div>
      <aside class="drawer" aria-label="Menu">
        <div class="drawer-head">${brand()}<button type="button" class="icon-btn" aria-label="Close menu" data-close-drawer>${icon('x')}</button></div>
        <nav aria-label="Menu">
          <a href="${link('index.html')}" ${page === 'home' ? 'aria-current="page"' : ''}>Home</a>
          ${NAV.map((n) => `<a href="${n.href}" ${section === n.id ? 'aria-current="page"' : ''}>${n.label}</a>`).join('')}
        </nav>
        <p class="drawer-label">More</p>
        <nav class="drawer-more" aria-label="More">
          <a href="${link('tft-tacticians-crown.html')}">${icon('trophy')}World Championship</a>
          <a href="${link('index.html#set-dates-card')}">${icon('calendar')}Set dates</a>
          ${LEGAL.slice(0, 2).map((l) => `<a href="${l.href}">${icon(l.label === 'Contact' ? 'mail' : 'info')}${l.label}</a>`).join('')}
          <a href="${D.site.network.url}" target="_blank" rel="noopener">${icon('external')}${esc(D.site.network.name)} – tools &amp; coaching</a>
        </nav>
        <a class="btn btn-primary btn-block" href="${link('tft-tournaments.html')}">All tournaments${icon('arrow')}</a>
      </aside>`;
    document.body.appendChild(wrap);
    const toggle = (open) => document.body.classList.toggle('drawer-open', open);
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-open-drawer]')) toggle(true);
      else if (e.target.closest('[data-close-drawer]')) toggle(false);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
  }

  /* ---------- Suche (News und Cups) ---------- */
  function renderSearch() {
    const wrap = document.createElement('div');
    wrap.className = 'search-overlay';
    wrap.innerHTML = `
      <div class="search-box" role="dialog" aria-modal="true" aria-label="Search">
        <div class="search-input">
          ${icon('search')}
          <input type="search" placeholder="Search news and tournaments …" autocomplete="off" aria-label="Search term" />
          <button type="button" class="icon-btn" aria-label="Close search" data-close-search>${icon('x')}</button>
        </div>
        <div class="search-results" aria-live="polite"></div>
      </div>`;
    document.body.appendChild(wrap);
    const input = wrap.querySelector('input');
    const results = wrap.querySelector('.search-results');
    const items = () => [
      ...D.articles.map((a) => ({ kind: 'News', title: a.title, text: `${a.title} ${a.teaser || ''} ${catLabel(a.cat)}`, href: articleUrl(a) })),
      ...D.cups.map((c) => ({ kind: 'Tournament', title: c.name, text: `${c.name} ${label('regions', c.region)} ${c.organizer || ''} ${c.format || ''}`, href: cupUrl(c) }))
    ];

    function run() {
      const all = items();
      if (!all.length) {
        results.innerHTML = searchEmpty('Nothing to find yet', 'As soon as the first news and tournaments are online, you will find them here.', 'tablet');
        return;
      }
      const q = input.value.trim().toLowerCase();
      const list = q ? all.filter((x) => x.text.toLowerCase().includes(q)) : all.slice(0, 6);
      results.innerHTML = list.length
        ? `<p class="search-hint">${q ? `${list.length} ${list.length === 1 ? 'result' : 'results'}` : 'Latest entries'}</p>` +
          list.map((x) => `<a class="search-item" href="${x.href}">${tag(x.kind)}<strong>${esc(x.title)}</strong></a>`).join('')
        : searchEmpty('No results', 'Try another term – for example a tournament name or “EMEA”.', 'thinking');
    }

    const open = () => { document.body.classList.add('search-open'); run(); setTimeout(() => input.focus(), 30); };
    const close = () => document.body.classList.remove('search-open');
    input.addEventListener('input', run);
    wrap.addEventListener('click', (e) => { if (e.target === wrap || e.target.closest('[data-close-search]')) close(); });
    document.addEventListener('click', (e) => { if (e.target.closest('[data-open-search]')) open(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
    });
  }

  /* ---------- Werbeflächen links und rechts neben dem Inhalt ----------
     Nur auf breiten Bildschirmen (ab 1760 px: 120 × 600, ab 1840 px: 160 × 600), siehe CSS „Werbeflächen“.
     Bis echte Banner eingebunden sind, bleibt der Platz leer. AD_PLACEHOLDERS = true zeigt beschriftete Platzhalter. */
  const AD_PLACEHOLDERS = false;
  function renderAdRails() {
    if (!AD_PLACEHOLDERS) return;
    const slot = (side) => `<aside class="ad-rail ad-${side}" aria-label="Ad space">
        <div class="ad-slot"><span>Ad</span><small>Ad space <b class="ad-120">120 × 600</b><b class="ad-160">160 × 600</b></small></div>
      </aside>`;
    document.body.insertAdjacentHTML('beforeend', slot('left') + slot('right'));
  }

  /* ---------- Google Analytics: Cookie-Hinweis und Widerspruch (wie bei TFTClimb und TFT Arcade) ----------
     Das Tag lädt schon im Kopf der Seite (assets/js/ga.js). „Decline“ schaltet es sofort und für künftige Besuche ab
     und löscht die Analytics-Cookies. Wahl im Browser: tfte_ga = 'ok' | 'no'. Schalter auch in der Datenschutzerklärung. */
  function initAnalytics() {
    const id = window.TFTE_GA_ID;
    if (!id) return;
    const KEY = 'tfte_ga';
    const read = () => { try { return localStorage.getItem(KEY); } catch (_) { return null; } };
    const write = (v) => { try { localStorage.setItem(KEY, v); } catch (_) { /* kein Speicher */ } };
    function deleteCookies() {
      const host = location.hostname, root = host.split('.').slice(-2).join('.');
      document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => /^_ga(_|$)/.test(n)).forEach((n) => {
        [host, `.${host}`, `.${root}`, ''].forEach((d) => { document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ''}`; });
      });
    }
    // nach erneuter Zustimmung ohne Neuladen starten
    function load() {
      window[`ga-disable-${id}`] = false;
      if (!served) return;
      if (!window.gtag) {
        const s = document.createElement('script');
        s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
      }
      window.gtag('config', id);
    }
    function showState() {
      const st = document.getElementById('ga-state'), bt = document.getElementById('ga-toggle');
      if (!st || !bt) return;
      const off = read() === 'no';
      st.textContent = off ? 'Google Analytics is turned off for this browser.' : 'Google Analytics is active for this browser.';
      bt.textContent = off ? 'Allow again' : 'Decline analytics';
      bt.dataset.ga = off ? 'ok' : 'no';
    }
    function choose(v) {
      write(v);
      if (v === 'no') { window[`ga-disable-${id}`] = true; deleteCookies(); } else load();
      const b = document.getElementById('ckb');
      if (b) b.remove();
      showState();
    }
    // kleines Popup unten rechts; Details stehen in der Datenschutzerklärung
    function banner() {
      if (document.getElementById('ckb')) return;
      document.body.insertAdjacentHTML('beforeend', `<div class="ckb" id="ckb" role="region" aria-label="Cookie notice">
        <img class="ckb-logo" src="${link('assets/brand/janna-kopf.png')}" alt="" width="46" height="50" />
        <div class="ckb-tx"><b>Cookies</b>
          <p>We use Google Analytics cookies to improve our site. <a href="${link('privacy.html')}">Privacy policy</a></p>
          <div class="ckb-bt"><button type="button" class="ckb-no" data-ga="no">Decline</button><button type="button" class="ckb-ok" data-ga="ok">OK</button></div>
        </div></div>`);
    }
    document.addEventListener('click', (e) => { const b = e.target.closest('[data-ga]'); if (b) choose(b.dataset.ga); });
    // „Cookie settings“ im Footer: Hinweis wieder zeigen statt zur Datenschutzerklärung zu gehen
    document.addEventListener('click', (e) => { if (e.target.closest('[data-ckb]')) { e.preventDefault(); banner(); } }, true);
    if (!read()) banner();
    showState();
  }

  /* ---------- Footer: Marke, Spalten, Rechtszeile – Janna steht rechts und schaut oben heraus ---------- */
  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    el.className = 'site-footer';
    el.innerHTML = `
      <div class="wrap footer-cols">
        ${janna('crown', 'footer-janna', true)}
        <div class="footer-about">
          ${brand()}
          <p class="footer-claim">Your game. Your scene. Your seat. Tournaments, streams and news for everyone who plays TFT or loves watching it.</p>
        </div>
        <nav aria-label="Explore"><h4>Explore</h4>${NAV.map((n) => `<a href="${n.href}">${n.label}</a>`).join('')}</nav>
        <nav aria-label="TFT E-Sports"><h4>${esc(D.site.name)}</h4>${LEGAL.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}</nav>
        <nav aria-label="Network"><h4>Network</h4><a class="footer-network" href="${D.site.network.url}" target="_blank" rel="noopener">${esc(D.site.network.name)}${icon('external')}</a><span class="footer-note">Tier lists, tools and coaching</span></nav>
      </div>
      <div class="wrap footer-legal">
        <p>${D.site.name} isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
        <p>© ${new Date().getFullYear()} ${esc(D.site.name)} · Part of the ${esc(D.site.network.name)} Network · <a href="${link('legal-notice.html')}">Legal notice</a> · <a href="${link('privacy.html')}">Privacy</a> · <a href="${link('privacy.html')}" data-ckb>Cookie settings</a></p>
      </div>`;
  }

  window.UI = {
    janna, finderRow, finderStatus, creatorUrl, creatorImage, loadChannels, icon, crown, esc, fmt, served, link, setUrl, toDate, fmtDate, fmtTime, dayMonth, label, catLabel, articleUrl, cupUrl,
    sortByDateDesc, upcomingCups, startOfToday, signupOpen, imgPlaceholder, empty, tag, articleCard, cupRow,
    calendarGrid, calLegend, SET_ICON,
    ymd, endOf, fmtDay, fmtWhen, cupDays, cupStart, cupNext, cupEnd, cupPast, cupDates, byStart, fmtDays, signupState, hostOf, keyFacts, cupCard,
    twitchUrl, creatorCard, creatorSlot, streamCard, langName, loadStreams, STREAM_REASONS
  };

  // Symbole im statischen HTML: <span data-icon="arrow"></span> wird zum SVG
  document.querySelectorAll('[data-icon]').forEach((el) => { el.outerHTML = icon(el.dataset.icon); });
  document.querySelectorAll('[data-crown]').forEach((el) => { el.outerHTML = crown(); });
  // Seitenkopf als Box, aus der Janna oben herausragt: <section class="page-head" data-janna="tablet">
  document.querySelectorAll('.page-head[data-janna]').forEach((el) => {
    el.classList.add('has-janna');
    el.insertAdjacentHTML('beforeend', janna(el.dataset.janna, 'head-janna at-r'));
  });

  renderHeader();
  renderLiveBar();
  renderDrawer();
  renderSearch();
  renderFooter();
  renderAdRails();
  initAnalytics();
  initWatch();
})();
