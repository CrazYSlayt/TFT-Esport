/* TFTEsport – gemeinsame Teile: Header, Navigation, Drawer, Suche, Footer und Helfer für alle Seiten. */
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
  const fmt = (n) => Number(n).toLocaleString('de-DE');
  const served = location.protocol.startsWith('http');
  // Links relativ zur Projektwurzel, damit die Seite auch per Doppelklick (file://) läuft.
  // Wurzel = Pfad, über den diese Seite app.js einbindet (z. B. '../' für news/vorlage.html).
  const ROOT = (document.currentScript.getAttribute('src') || '').replace(/assets\/js\/app\.js.*$/, '');
  const link = (file) => ROOT + file;
  // Adresse in der Leiste ändern (Filter teilbar); manche Browser erlauben das bei file:// nicht
  const setUrl = (url) => { try { history.replaceState(null, '', url); } catch (_) { /* egal */ } };

  // Ohne Zeitzone gelten ISO-Angaben als Ortszeit ('2026-11-07T18:00'); reines Datum bekommt 00:00, sonst wäre es UTC.
  const toDate = (iso) => new Date(/T/.test(iso) ? iso : `${iso}T00:00`);
  const fmtDate = (iso, opts = { day: '2-digit', month: '2-digit', year: 'numeric' }) => toDate(iso).toLocaleDateString('de-DE', opts);
  const fmtTime = (iso) => toDate(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const dayMonth = (iso) => {
    const d = toDate(iso);
    return { day: String(d.getDate()).padStart(2, '0'), mon: d.toLocaleDateString('de-DE', { month: 'short' }).replace('.', '').toUpperCase() };
  };

  const label = (list, id) => (D[list].find((x) => x.id === id) || {}).label || id;
  const catLabel = (id) => (D.newsCategories.find((c) => c.id === id) || {}).short || id;
  const articleUrl = (a) => link(`news/${encodeURIComponent(a.slug)}.html`);
  const sortByDateDesc = (list) => [...list].sort((a, b) => toDate(b.date) - toDate(a.date));
  function startOfToday() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  // Reines Datum gilt bis zum Ende des Tages (Anmeldeschluss „14.09.“ = noch am 14.09. möglich)
  const endOf = (iso) => (/T/.test(iso) ? toDate(iso) : new Date(toDate(iso).getTime() + 864e5 - 1));
  // „Sa 10.10.“ (mit Jahr „Sa 10.10.2026“), mit Uhrzeit „Sa 10.10.2026, 18:00 Uhr“
  const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const fmtDay = (iso, year = false) => {
    const d = toDate(iso);
    return `${WD[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${year ? d.getFullYear() : ''}`;
  };
  const fmtWhen = (iso) => fmtDay(iso, true) + (/T/.test(iso) ? `, ${fmtTime(iso)} Uhr` : '');

  /* ---------- Turniere ---------- */
  const cupUrl = (c) => link(`cups/turnier.html?id=${encodeURIComponent(c.id)}`);
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
  // Spieltage lesbar: „Sa, 10.10. – So, 11.10. · Fr, 16.10. – So, 18.10.“
  const fmtDays = (c) => cupDays(c).map((d) =>
    `${d.label ? `${d.label}: ` : ''}${fmtDay(d.from)}${d.to !== d.from ? ` – ${fmtDay(d.to)}` : ''}${/T/.test(d.from) ? `, ${fmtTime(d.from)} Uhr` : ''}`).join(' · ');

  // Anmeldestatus: open | soon | closed | unknown | none
  function signupState(c) {
    const now = new Date();
    if (!c.signupDeadline && !c.signupUrl) return { key: 'none', text: 'Keine Anmeldung – nur Qualifizierte' };
    if (!c.signupDeadline) return { key: 'unknown', text: 'Anmeldeschluss noch nicht bekannt' };
    if (endOf(c.signupDeadline) < now) return { key: 'closed', text: 'Anmeldung beendet' };
    if (c.signupStart && toDate(c.signupStart) > now) return { key: 'soon', text: `Anmeldung ab ${fmtDay(c.signupStart)}` };
    return { key: 'open', text: `Anmeldung offen bis ${fmtDay(c.signupDeadline)}` };
  }
  const signupOpen = (c) => signupState(c).key === 'open';
  const hostOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (_) { return url; } };

  /* ---------- Bausteine ---------- */
  // Beschrifteter Bildplatzhalter, bis echte Bilder vorhanden sind
  const imgPlaceholder = (text, cls = '') =>
    `<div class="ph-img ${cls}" role="img" aria-label="Bildplatzhalter: ${esc(text)}"><span>${icon('image')}${esc(text)}</span></div>`;

  // Maskottchen: Bild aus assets/img/ (erst .webp, dann .png). Fehlt die Datei, bleibt ein beschrifteter Platzhalter.
  const MASCOT = ['assets/img/maskottchen.webp', 'assets/img/maskottchen.png'];
  const mascot = (cls = '') =>
    `<span class="mascot ${cls}"><img src="${link(MASCOT[0])}" alt="" data-try="1" onerror="UI.mascotNext(this)" /><span class="mascot-ph">Maskottchen</span></span>`;
  function mascotNext(img) {
    const i = Number(img.dataset.try);
    if (i < MASCOT.length) { img.dataset.try = i + 1; img.src = link(MASCOT[i]); return; }
    img.closest('.mascot').classList.add('is-missing');
    img.remove();
  }
  const searchEmpty = (title, text) => `<div class="search-empty">${mascot('search-mascot')}<p class="empty-title">${title}</p><p class="empty-text">${text}</p></div>`;

  // Leerzustand: Symbol, Titel, kurzer Text, optional ein Link
  const empty = ({ ic = 'info', title, text, href, cta, cls = '' }) => `
    <div class="empty ${cls}">
      <span class="empty-ic">${icon(ic)}</span>
      <div>
        <p class="empty-title">${title}</p>
        ${text ? `<p class="empty-text">${text}</p>` : ''}
        ${href ? `<a class="link-arrow" href="${href}">${cta}${icon('arrow')}</a>` : ''}
      </div>
    </div>`;

  const tag = (text, kind = '') => `<span class="tag ${kind ? `tag-${kind}` : ''}">${esc(text)}</span>`;

  function articleCard(a) {
    return `<a class="card news-card" href="${articleUrl(a)}">
      ${a.image ? `<img class="card-img" src="${esc(link(a.image))}" alt="" loading="lazy" />` : imgPlaceholder('Artikelbild', 'card-img')}
      <div class="card-body">
        ${tag(catLabel(a.cat), a.cat)}
        <h3 class="card-title">${esc(a.title)}</h3>
        <p class="card-meta">${esc(fmtDate(a.date))}${a.readMin ? ` · ${a.readMin} Min.` : ''}<span class="card-go">${icon('arrow')}</span></p>
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

  // Die fünf Kernfragen eines Turniers – auf Karten und auf der Detailseite gleich
  function keyFacts(c) {
    const s = signupState(c);
    const deadline = c.signupDeadline ? fmtWhen(c.signupDeadline)
      : !c.signupUrl ? 'Keine Anmeldung' : cupPast(c) ? 'Keine Angabe des Veranstalters' : 'Noch nicht bekannt';
    const where = c.signupUrl
      ? `<a href="${esc(c.signupUrl)}" target="_blank" rel="noopener">${esc(hostOf(c.signupUrl))}${icon('external')}</a>`
      : 'Keine Anmeldung – nur Qualifizierte';
    return `<dl class="keyfacts">
      <div><dt>${icon('users')}Wer darf teilnehmen?</dt><dd>${esc(c.eligibility || 'Noch nicht bekannt')}</dd></div>
      <div><dt>${icon('shield')}Rangbeschränkung</dt><dd>${esc(c.rank || 'Noch nicht bekannt')}</dd></div>
      <div class="kf-${s.key}"><dt>${icon('clock')}Anmeldeschluss</dt><dd>${esc(deadline)}</dd></div>
      <div><dt>${icon('calendar')}Gespielt wird</dt><dd>${esc(fmtDays(c) || 'Noch nicht bekannt')}</dd></div>
      <div><dt>${icon('link')}Anmeldung</dt><dd>${where}</dd></div>
    </dl>`;
  }

  // Turnierkarte mit den Kernfragen (Übersicht)
  function cupCard(c) {
    const s = signupState(c);
    const past = cupPast(c);
    return `<article class="cup-card ${past ? 'is-past' : ''}">
      <header class="cup-card-head">
        <div class="cup-card-tags">${tag(label('cupLevels', c.level), c.level)}${tag(label('regions', c.region), 'region')}${past ? tag('Vorbei', 'past') : ''}</div>
        <h3><a href="${cupUrl(c)}">${esc(c.name)}</a></h3>
        ${past ? '' : `<span class="signup-pill is-${s.key}">${esc(s.text)}</span>`}
      </header>
      ${keyFacts(c)}
      <footer class="cup-card-foot">
        <a class="link-arrow" href="${cupUrl(c)}">Alle Details${icon('arrow')}</a>
        ${c.checked ? `<span>Geprüft am ${esc(fmtDate(c.checked))}${c.organizer ? ` · ${esc(c.organizer)}` : ''}</span>` : ''}
      </footer>
    </article>`;
  }

  /* ---------- Twitch: Creator-Karten ---------- */
  const twitchUrl = (login) => `https://www.twitch.tv/${encodeURIComponent(login)}`;
  const creatorCard = (c) => `<a class="card creator-card" href="${twitchUrl(c.login)}" target="_blank" rel="noopener">
      ${imgPlaceholder('Stream-Vorschau', 'card-img')}
      <div class="card-body">
        <span class="avatar-ph">${icon('twitch')}</span>
        <span><strong>${esc(c.name)}</strong><small>${esc(c.focus || '')}</small></span>
        <span class="card-go">${icon('external')}</span>
      </div>
    </a>`;
  // Leerer Platz: bleibt als beschrifteter Platzhalter sichtbar, bis die Redaktion Creator auswählt
  const creatorSlot = (n) => `<div class="card creator-card">
      ${imgPlaceholder('Stream-Vorschau', 'card-img')}
      <div class="card-body">
        <span class="avatar-ph">${icon('users')}</span>
        <span><strong>Platzhalter: Creator ${n}</strong><small>Redaktionelle Empfehlung</small></span>
      </div>
    </div>`;

  /* ---------- Twitch: Stream-Karten und Player-Fenster ---------- */
  let langNames = null;
  try { langNames = new Intl.DisplayNames(['de'], { type: 'language' }); } catch (_) { /* älterer Browser */ }
  function langName(code) {
    if (!code || code === 'other') return 'Andere';
    try { const n = langNames && langNames.of(code); return n ? n.charAt(0).toUpperCase() + n.slice(1) : code.toUpperCase(); } catch (_) { return code.toUpperCase(); }
  }
  function uptime(iso) {
    const min = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    const h = Math.floor(min / 60);
    return h ? `${h} Std. ${min % 60} Min.` : `${min} Min.`;
  }
  const streams = new Map();   // login → Stream, damit ein Klick das Player-Fenster öffnen kann
  function streamCard(s, isPro = false) {
    streams.set(s.login, s);
    const minute = Math.floor(Date.now() / 60000);   // umgeht Twitchs Vorschaubild-Cache einmal pro Minute
    return `<a class="card stream-card" href="${twitchUrl(s.login)}" target="_blank" rel="noopener" data-watch="${esc(s.login)}">
      <div class="thumb">
        ${s.thumb ? `<img src="${esc(s.thumb)}?t=${minute}" alt="" loading="lazy" />` : ''}
        <span class="badge-live">Live</span>
        <span class="viewer-pill">${fmt(s.viewers)} Zuschauer</span>
      </div>
      <div class="card-body">
        <span class="stream-name">${esc(s.name)}${isPro ? tag('Pro') : ''}</span>
        <p class="stream-title" title="${esc(s.title)}">${esc(s.title || '')}</p>
        <div class="stream-meta"><span>${esc(langName(s.lang))}</span><span>seit ${uptime(s.startedAt)}</span></div>
      </div>
    </a>`;
  }

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  const closeModal = () => { document.body.classList.remove('modal-open'); modal.innerHTML = ''; };
  function openWatch(s) {
    const host = encodeURIComponent(location.hostname);
    modal.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="Stream von ${esc(s.name)}">
      <div class="watch-head">
        <div class="watch-title"><strong>${esc(s.name)}</strong><span>${esc(s.title || '')}</span></div>
        <a class="btn btn-ghost" href="${twitchUrl(s.login)}" target="_blank" rel="noopener">Auf Twitch öffnen${icon('external')}</a>
        <button type="button" class="icon-btn" aria-label="Schließen" data-close-modal>${icon('x')}</button>
      </div>
      <div class="watch-main">
        <div class="player"><iframe src="https://player.twitch.tv/?channel=${encodeURIComponent(s.login)}&parent=${host}&autoplay=true" allowfullscreen allow="autoplay; fullscreen" title="Twitch-Player"></iframe></div>
        <iframe class="chat" src="https://www.twitch.tv/embed/${encodeURIComponent(s.login)}/chat?parent=${host}" title="Twitch-Chat"></iframe>
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

  /* ---------- Twitch-Daten über den lokalen Server (server.ps1 → /api/streams) ---------- */
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
    'no-credentials': 'Twitch ist noch nicht verbunden: Client-ID und Secret in <code>twitch.config.json</code> eintragen und den Server neu starten.',
    'no-server': 'Live-Daten von Twitch kommen mit der Anbindung. Bis dahin bleibt dieser Bereich leer.',
    'twitch-error': 'Twitch ist gerade nicht erreichbar. Details stehen im Server-Fenster.'
  };

  /* ---------- Navigation ---------- */
  const NAV = [
    { id: 'news', href: link('news.html'), label: 'News' },
    { id: 'matches', href: link('live-matches.html'), label: 'Live Matches' },
    { id: 'twitch', href: link('twitch.html'), label: 'Live Streams' },
    { id: 'cups', href: link('cups.html'), label: 'Turniere' },
    { id: 'pros', href: link('pro-players.html'), label: 'Pro Players' }
  ];
  const LEGAL = [
    { href: link('ueber-uns.html'), label: 'Über uns' },
    { href: link('kontakt.html'), label: 'Kontakt' },
    { href: link('impressum.html'), label: 'Impressum' },
    { href: link('datenschutz.html'), label: 'Datenschutz' }
  ];
  const brand = () => `<a class="brand" href="${link('index.html')}" aria-label="${D.site.name} Startseite">${crown()}<span class="brand-word">TFTESPORT<small>.com</small></span></a>`;

  function renderHeader() {
    const el = document.getElementById('site-header');
    if (!el) return;
    const page = document.body.dataset.page;
    const section = page === 'streams' ? 'twitch' : page;
    el.className = 'site-header';
    el.innerHTML = `
      <div class="topstrip"><div class="wrap">
        <span>Zuhause im <b>${esc(D.site.network.name)} Network</b></span>
        <a href="${D.site.network.url}" target="_blank" rel="noopener">${esc(D.site.network.name)}${icon('external')}</a>
      </div></div>
      <div class="wrap header-main">
        <button class="icon-btn burger" type="button" aria-label="Menü öffnen" data-open-drawer>${icon('menu')}</button>
        ${brand()}
        <nav class="mainnav" aria-label="Hauptnavigation">
          ${NAV.map((n) => `<a href="${n.href}" ${section === n.id ? 'class="active" aria-current="page"' : ''}>${n.label}</a>`).join('')}
        </nav>
        <div class="header-actions">
          <button class="icon-btn" type="button" aria-label="Suche öffnen" data-open-search>${icon('search')}</button>
          <span class="divider" aria-hidden="true"></span>
          <a class="btn btn-primary" href="${link('cups.html')}">Dabei sein${icon('arrow')}</a>
        </div>
      </div>`;
  }

  function renderDrawer() {
    const page = document.body.dataset.page;
    const section = page === 'streams' ? 'twitch' : page;
    const wrap = document.createElement('div');
    wrap.className = 'drawer-wrap';
    wrap.innerHTML = `
      <div class="drawer-backdrop" data-close-drawer></div>
      <aside class="drawer" aria-label="Menü">
        <div class="drawer-head">${brand()}<button type="button" class="icon-btn" aria-label="Menü schließen" data-close-drawer>${icon('x')}</button></div>
        <nav aria-label="Menü">
          <a href="${link('index.html')}" ${page === 'home' ? 'aria-current="page"' : ''}>Startseite</a>
          ${NAV.map((n) => `<a href="${n.href}" ${section === n.id ? 'aria-current="page"' : ''}>${n.label}</a>`).join('')}
        </nav>
        <a class="btn btn-primary btn-block" href="${link('cups.html')}">Dabei sein${icon('arrow')}</a>
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
      <div class="search-box" role="dialog" aria-modal="true" aria-label="Suche">
        <div class="search-input">
          ${icon('search')}
          <input type="search" placeholder="News und Turniere durchsuchen …" autocomplete="off" aria-label="Suchbegriff" />
          <button type="button" class="icon-btn" aria-label="Suche schließen" data-close-search>${icon('x')}</button>
        </div>
        <div class="search-results" aria-live="polite"></div>
      </div>`;
    document.body.appendChild(wrap);
    const input = wrap.querySelector('input');
    const results = wrap.querySelector('.search-results');
    const items = () => [
      ...D.articles.map((a) => ({ kind: 'News', title: a.title, text: `${a.title} ${a.teaser || ''} ${catLabel(a.cat)}`, href: articleUrl(a) })),
      ...D.cups.map((c) => ({ kind: 'Turnier', title: c.name, text: `${c.name} ${label('regions', c.region)} ${c.organizer || ''} ${c.format || ''}`, href: cupUrl(c) }))
    ];

    function run() {
      const all = items();
      if (!all.length) {
        results.innerHTML = searchEmpty('Noch nichts zu finden', 'Sobald die ersten News und Turniere online sind, findest du sie hier.');
        return;
      }
      const q = input.value.trim().toLowerCase();
      const list = q ? all.filter((x) => x.text.toLowerCase().includes(q)) : all.slice(0, 6);
      results.innerHTML = list.length
        ? `<p class="search-hint">${q ? `${list.length} Treffer` : 'Neueste Einträge'}</p>` +
          list.map((x) => `<a class="search-item" href="${x.href}">${tag(x.kind)}<strong>${esc(x.title)}</strong></a>`).join('')
        : searchEmpty('Keine Treffer', 'Versuch es mit einem anderen Begriff – zum Beispiel einem Turniernamen oder „DACH“.');
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

  /* ---------- Footer: Marke mit Maskottchen, Spalten, Rechtszeile ---------- */
  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    el.className = 'site-footer';
    el.innerHTML = `
      <div class="wrap footer-cols">
        <div class="footer-about">
          ${mascot('footer-mascot')}
          <div>
            ${brand()}
            <p class="footer-claim">Dein Game. Deine Szene. Dein Platz. News, Turniere und Streams für alle, die TFT spielen oder gern zuschauen.</p>
          </div>
        </div>
        <nav aria-label="Entdecken"><h4>Entdecken</h4>${NAV.map((n) => `<a href="${n.href}">${n.label}</a>`).join('')}</nav>
        <nav aria-label="TFTEsport"><h4>${esc(D.site.name)}</h4>${LEGAL.map((l) => `<a href="${l.href}">${l.label}</a>`).join('')}</nav>
        <nav aria-label="Netzwerk"><h4>Netzwerk</h4><a class="footer-network" href="${D.site.network.url}" target="_blank" rel="noopener">${esc(D.site.network.name)}${icon('external')}</a><span class="footer-note">Tierlists, Tools und Coaching</span></nav>
      </div>
      <div class="wrap footer-legal">
        <p>${D.site.name} ist nicht von Riot Games unterstützt und gibt nicht die Ansichten oder Meinungen von Riot Games oder Personen wieder, die offiziell an der Produktion oder Verwaltung von Riot-Games-Eigentum beteiligt sind. Riot Games und alle zugehörigen Eigentümer sind Marken oder eingetragene Marken von Riot Games, Inc.</p>
        <p>© ${new Date().getFullYear()} ${esc(D.site.name)} · Teil des ${esc(D.site.network.name)} Network</p>
      </div>`;
  }

  window.UI = {
    mascot, mascotNext, icon, crown, esc, fmt, served, link, setUrl, toDate, fmtDate, fmtTime, dayMonth, label, catLabel, articleUrl, cupUrl,
    sortByDateDesc, upcomingCups, startOfToday, signupOpen, imgPlaceholder, empty, tag, articleCard, cupRow,
    ymd, endOf, fmtDay, fmtWhen, cupDays, cupStart, cupNext, cupEnd, cupPast, cupDates, byStart, fmtDays, signupState, hostOf, keyFacts, cupCard,
    twitchUrl, creatorCard, creatorSlot, streamCard, langName, loadStreams, STREAM_REASONS
  };

  // Symbole im statischen HTML: <span data-icon="arrow"></span> wird zum SVG
  document.querySelectorAll('[data-icon]').forEach((el) => { el.outerHTML = icon(el.dataset.icon); });
  // Maskottchen-Plätze im statischen HTML: <span data-mascot="klasse"></span>
  document.querySelectorAll('[data-mascot]').forEach((el) => { el.outerHTML = mascot(el.dataset.mascot); });

  renderHeader();
  renderDrawer();
  renderSearch();
  renderFooter();
  initWatch();
})();
