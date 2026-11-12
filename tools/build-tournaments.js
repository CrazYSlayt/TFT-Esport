// TFT E-Sports – schreibt aus assets/data/turniere.js eine feste Seite pro Turnier (public/tft-tournaments/<id>.html) und die sitemap.xml.
// Läuft automatisch beim Veröffentlichen auf Vercel (vercel.json, buildCommand); lokal: node tools/build-tournaments.js
// Turniere mit eigenem „page“ (z. B. die Weltmeisterschaft) bekommen keine erzeugte Seite.
// Vergangene inoffizielle Turniere bleiben abrufbar, gehen aber nicht in die Suche (noindex).
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', 'public');
const SITE = 'https://www.tft-esports.com';
const OUT = path.join(ROOT, 'tft-tournaments');
const STREAMERS = path.join(ROOT, 'tft-streamers');
const STATIC_PAGES = ['/', '/tft-tournaments', '/tft-tacticians-crown', '/live-matches', '/twitch', '/pro-players', '/news', '/about'];

/* ---------- Seitenskripte ohne Browser laden: eine Attrappe genügt, gebraucht werden nur die Bausteine aus window.UI ---------- */
const stub = () => new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => '' : k === 'dataset' ? {} : stub()), apply: () => stub(), set: () => true });
global.window = global;
global.document = {
  currentScript: { getAttribute: () => '../assets/js/app.js' },
  querySelectorAll: () => [], querySelector: () => null, getElementById: () => null, createElement: stub, addEventListener() {},
  body: { dataset: {}, appendChild() {}, insertAdjacentHTML() {} }
};
global.location = { protocol: 'https:', hostname: '', search: '' };
global.history = { replaceState() {} };
for (const f of ['assets/js/data.js', 'assets/data/turniere.js', 'assets/js/app.js', 'assets/js/turnier.js']) {
  vm.runInThisContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), { filename: f });
}
const { cups, creators, articles = [] } = window.TFTE;
const { esc, tag, cupDays, cupPast, cupUrl, fmtDate, fmtDays, hostOf, label, icon, crown, ageOf } = window.UI;

const clip = (s, n) => (s.length <= n ? s : `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…`);
const keyword = (name) => (/\bTFT\b/.test(name) ? name : `TFT ${name}`);
const titleOf = (c) => `${clip(keyword(c.name).replace(/ – .*$/, (m) => (keyword(c.name).length > 44 ? '' : m)), 44)} | TFT E-Sports`;
const descOf = (c) => clip(`${keyword(c.name)}: who can enter, rank rules, dates, format and sign-up for this ${window.UI.where(c)} tournament.`, 134);
const indexable = (c) => c.level === 'offiziell' || !cupPast(c);

function html(c) {
  const p = window.cupPage(c);
  const url = `${SITE}/tft-tournaments/${c.id}`;
  const title = esc(titleOf(c)), desc = esc(descOf(c));
  const days = cupDays(c);
  const event = {
    '@context': 'https://schema.org', '@type': 'SportsEvent', name: c.name, sport: 'Teamfight Tactics', url,
    startDate: days[0].from.slice(0, 10), endDate: days[days.length - 1].to.slice(0, 10),
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'VirtualLocation', url: c.streamUrl || c.signupUrl || url },
    ...(c.organizer ? { organizer: { '@type': 'Organization', name: c.organizer } } : {})
  };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- Erzeugt von tools/build-tournaments.js – nicht von Hand ändern, sondern im Editor -->
  <title>${title}</title>
  <meta name="description" content="${desc}" />
${indexable(c) ? '' : '  <meta name="robots" content="noindex, follow" />\n'}  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="TFT E-Sports" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/assets/img/og-tft-esports.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="#213d2c" />
  <link rel="icon" type="image/png" sizes="64x64" href="../assets/brand/favicon-64.png" />
  <link rel="apple-touch-icon" href="../assets/brand/apple-touch-icon.png" />
  <link rel="preload" href="../assets/fonts/Barlow-800-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="../assets/css/fonts.css" />
  <link rel="stylesheet" href="../assets/css/style.css" />
  <script src="../assets/js/ga.js"></script>
  <script type="application/ld+json">${JSON.stringify(event).replace(/</g, '\\u003c')}</script>
</head>
<body data-page="cups" data-cup="${esc(c.id)}">
  <header id="site-header"></header>

  <main class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="../index.html">Home</a><span data-icon="chevronRight"></span><a href="../tft-tournaments.html">Tournaments</a><span data-icon="chevronRight"></span><span>${esc(c.name)}</span>
    </nav>

    <div class="layout-aside">
      <article>
        <header class="article-head">
          <div class="byline" id="cup-tags">${p.tags}</div>
          <h1>${esc(c.name)}</h1>
          <p class="article-teaser">${esc(p.info)}</p>
        </header>

        <section class="glance" aria-labelledby="glance-title">
          <h2 id="glance-title">Everything at a glance</h2>
          <div id="cup-facts">${p.facts}</div>
        </section>

        <div class="prose" id="cup-body">${p.body}</div>
      </article>

      <aside class="aside-card" aria-labelledby="signup-title">
        <div class="aside-stage">
          <h2 id="signup-title">Sign-up</h2>
          <img class="janna janna-thumbs-up at-r" src="../assets/img/janna/janna-thumbs-up-bust.png" alt="" decoding="async" />
        </div>
        <div class="aside-body" id="cup-aside-body">${p.aside}</div>
      </aside>
    </div>
  </main>

  <footer id="site-footer"></footer>

  <script src="../assets/js/data.js"></script>
  <script src="../assets/data/turniere.js"></script>
  <script src="../assets/js/app.js"></script>
  <script src="../assets/js/turnier.js"></script>
</body>
</html>
`;
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const built = cups.filter((c) => !c.page && cupDays(c).length);
for (const c of built) fs.writeFileSync(path.join(OUT, `${c.id}.html`), html(c));

/* ---------- Streamer-Profile ---------- */
function streamerHtml(c) {
  const url = `${SITE}/tft-streamers/${c.login}`;
  // noTwitch: true = Profi ohne (belegten) Twitch-Kanal – login ist dann nur der Seitenname, kein Live-Block
  const tw = !c.noTwitch;
  const title = esc(tw ? `${c.name}: TFT Streamer Profile | TFT E-Sports` : `${c.name}: TFT Pro Player Profile | TFT E-Sports`);
  const desc = esc(clip(tw ? `${c.name}, TFT streamer on Twitch: profile, live status and channel links. ${c.focus || ''}`
    : `${c.name}, TFT pro player: profile, results and links. ${c.focus || ''}`, 134));
  // Riot-ID → MetaTFT-Profil (nur mit Quelle in den Daten: riotId: { id: 'Name#TAG', server: 'euw1', source })
  const meta = c.riotId && c.riotId.id && c.riotId.server
    ? `https://www.metatft.com/player/${encodeURIComponent(c.riotId.server)}/${encodeURIComponent(c.riotId.id.replace('#', '-'))}` : '';
  const links = [...(meta ? [{ label: 'MetaTFT', url: meta }] : []), ...(c.links || [])];
  const st = c.stats || {};
  // Player Card rechts: immer dieselben 8 Themen mit Symbol (fehlt ein Wert: „–“), damit alle Karten gleich aussehen.
  // [Symbol, Bezeichnung, Wert, Zusatz, Klasse]
  const NA = '–';
  const num = (v) => (v === undefined || v === null || v === '' ? NA : esc(v));
  const placeNum = (p) => { const m = String(p).match(/\d+/); return m ? Number(m[0]) : 99; };
  const worlds = (c.results || []).filter((r) => r.tier === 'World').sort((a, b) => placeNum(a.place) - placeNum(b.place))[0];
  const shortEvent = (e) => e.replace(/ Tactician's Crown$| World Championship$| Championship$/, '');
  const latest = (c.results || []).slice().sort((a, b) => b.date.localeCompare(a.date))[0];
  // Teams als Zeitleiste ganz rechts in der Karte (neueste oben); ohne career nur das aktuelle Team
  const teams = (c.career || []).length ? c.career : c.team ? [{ team: c.team, from: c.teamSince || '' }] : [];
  const nextUp = (c.events || []).map((id) => cups.find((x) => x.id === id)).filter((e) => e && !cupPast(e))[0];
  const tiles = c.pro || !(c.extra || []).length ? [
    ['crown', 'World titles', c.worldTitles ? esc(c.worldTitles) : NA, 'Tactician\'s Crown', c.worldTitles ? 'is-gold' : ''],
    ['medal', 'Best at Worlds', worlds ? esc(worlds.place) : NA, worlds ? esc(shortEvent(worlds.event)) : 'no Worlds result yet'],
    ['trophy', 'Wins', num(st.wins), 'official events'],
    ['star', 'Top 8s', num(st.top8), 'official events'],
    ['calendar', 'Events played', num(st.events), 'official, since 2024'],
    ['swords', 'Latest', latest ? esc(latest.place) : NA, latest ? esc(shortEvent(latest.event)) : 'no result listed'],
    ['clock', 'Next event', nextUp ? esc(nextUp.name.replace(/ – .*$/, '')) : NA, nextUp ? esc(fmtDays(nextUp).split(' · ').pop()) : 'none announced'],
    ['target', 'Top 8 rate', st.top8 !== undefined && st.events ? `${Math.round((st.top8 / st.events) * 100)}%` : NA,
      st.top8 !== undefined && st.events ? `${esc(st.top8)} of ${esc(st.events)} events` : 'not enough data']
  ] : [
    ...(c.extra || []).map(([ic, k, v, sub]) => [ic, esc(k), esc(v), sub ? esc(sub) : '']),
    ['globe', 'Region', c.region ? esc(c.region) : NA, c.country ? esc(c.country) : ''],
    ['pin', 'Country', c.country ? esc(c.country) : NA, ''],
    ['shield', 'Role', esc(c.role || 'Streamer'), ''],
    ['twitch', 'Channel', tw ? esc(c.login) : NA, tw ? 'on Twitch' : '']
  ].slice(0, 8);
  // Name links in der Karte: Vorname klein – Spielername groß – Nachname klein
  const [first, ...rest] = (c.realName || '').split(' ').filter(Boolean);
  const last = rest.join(' ');
  const tileIcon = (ic) => (ic === 'crown' ? crown() : icon(ic));
  const photo = c.image
    ? `<img class="pc-img" src="../${esc(c.image)}" alt="${esc(c.name)}" decoding="async" />`
    : `<span class="pc-initial" aria-hidden="true">${esc(c.name.charAt(0))}</span>`;
  const linkBtn = (l) => `<a class="pc-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}${icon('external')}</a>`;
  const upcoming = (c.events || []).map((id) => cups.find((x) => x.id === id)).filter((e) => e && !cupPast(e));
  const placeClass = (p) => (/^1/.test(p) ? 'p1' : /^2/.test(p) ? 'p2' : /^3/.test(p) ? 'p3' : '');
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: c.name, url, sameAs: [...(tw ? [`https://www.twitch.tv/${c.login}`] : []), ...links.map((l) => l.url)] };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- Erzeugt von tools/build-tournaments.js aus assets/js/data.js (creators) -->
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="profile" />
  <meta property="og:site_name" content="TFT E-Sports" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/${c.image || 'assets/img/og-tft-esports.png'}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="#213d2c" />
  <link rel="icon" type="image/png" sizes="64x64" href="../assets/brand/favicon-64.png" />
  <link rel="apple-touch-icon" href="../assets/brand/apple-touch-icon.png" />
  <link rel="preload" href="../assets/fonts/Barlow-800-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="../assets/css/fonts.css" />
  <link rel="stylesheet" href="../assets/css/style.css" />
  <script src="../assets/js/ga.js"></script>
  <script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>
</head>
<body data-page="${tw ? 'twitch' : 'pros'}"${tw ? ` data-streamer="${esc(c.login)}"` : ''}>
  <header id="site-header"></header>

  <main class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="../index.html">Home</a><span data-icon="chevronRight"></span>${tw ? '<a href="../twitch.html">Live Streams</a>' : '<a href="../pro-players.html">Pro Players</a>'}<span data-icon="chevronRight"></span><span>${esc(c.name)}</span>
    </nav>

    <!-- Player Card: links die Karte (Bild aus assets/img/streamers/, sobald vorhanden – darunter Preisgeld, Name, Alter, Herkunft),
         rechts die Einzelheiten -->
    <section class="pc" aria-label="Player card">
      <div class="pc-side">
        <div class="pc-photo">
          ${photo}
          ${c.worldTitles ? `<span class="pc-crown" title="World titles">${crown()}<b>×${esc(c.worldTitles)}</b></span>` : ''}
        </div>
        <div class="pc-prize"><small>Prize money won</small><b>${c.prize ? esc(c.prize.amount) : NA}</b><small>${c.prize && c.prize.note ? esc(c.prize.note) : c.prize ? 'all official events' : 'not known yet'}</small></div>
        <div class="pc-id">
          ${c.region ? `<p class="pc-region">${icon('globe')}${esc(c.region)}</p>` : ''}
          <p>${[ageOf(c) && (/^born/.test(ageOf(c)) ? esc(ageOf(c).replace('born', 'Born')) : `Age ${esc(ageOf(c).replace(' years', ''))}`), c.country && `${icon('pin')}${esc(c.country)}`].filter(Boolean).join('<span class="pc-dot" aria-hidden="true">·</span>')}</p>
        </div>
      </div>
      <div class="pc-info">
        <h1 class="pc-name">${first ? `<small>${esc(first)}</small> ` : ''}<b>${esc(c.name)}</b>${last ? ` <small>${esc(last)}</small>` : ''}</h1>
        <p class="pc-role">${esc(c.role || 'Streamer')}${c.focus ? ` · ${esc(c.focus)}` : ''}</p>
        <dl class="pc-stats">${tiles.map(([ic, k, v, sub, cls]) => `<div class="${cls || ''}${v === NA ? ' is-empty' : ''}"><span class="pc-ic">${tileIcon(ic)}</span><span class="pc-tx"><dt>${k}</dt><dd>${v}</dd>${sub ? `<small>${sub}</small>` : ''}</span></div>`).join('')}</dl>
        ${tw || links.length ? `<div class="pc-links">${tw ? `<a class="pc-link is-twitch" href="https://www.twitch.tv/${esc(c.login)}" target="_blank" rel="noopener">${icon('twitch')}twitch.tv/${esc(c.login)}</a>` : ''}${links.map(linkBtn).join('')}</div>` : ''}
      </div>
      <div class="pc-timeline">
        <p class="pc-kicker">${icon('shield')}Teams</p>
        ${teams.length ? `<ol>${teams.map((t) => `<li class="${t.to ? '' : 'is-now'}"><b>${esc(t.team)}</b><small>${esc(t.from)}${t.to ? ` – ${esc(t.to)}` : t.from ? ' – today' : 'today'}</small></li>`).join('')}</ol>`
          : '<p class="pc-none">No team listed</p>'}
      </div>
    </section>

    ${tw ? `<section class="pf-live" id="streamer-live" aria-label="Live stream">
      <div class="pf-media" id="streamer-player"><span class="pf-offline">${icon('twitch')}Offline</span></div>
      <div class="pf-live-text">
        <p class="streamer-status" id="streamer-status"><span class="dot" aria-hidden="true"></span>${esc(c.name)} is offline right now</p>
        <p class="pf-live-title" id="streamer-title">twitch.tv/${esc(c.login)}</p>
        <div class="hero-actions">
          <button type="button" class="btn btn-primary" id="streamer-load">Watch here</button>
          <a class="btn btn-ghost" href="https://www.twitch.tv/${esc(c.login)}" target="_blank" rel="noopener">Open on Twitch${icon('external')}</a>
        </div>
        <p class="pf-note">The player loads from Twitch only after you click “Watch here”. Twitch pauses embedded streams when you switch to fullscreen – press play once and it keeps running.</p>
      </div>
    </section>` : ''}

    <div class="pf-bottom">
      <div class="pf-col">
      <section class="pf-box pf-who" aria-labelledby="who-title">
        <h2 id="who-title">Who is ${esc(c.name)}?</h2>
        <p>${esc(c.about || '')}</p>
      </section>
      ${(c.results || []).length ? `<section class="pf-box" aria-labelledby="results-title">
        <h2 id="results-title">Tournament history</h2>
        <p class="pf-sub-left">${esc(c.name)}'s selected finishes, newest first</p>
        <div class="pf-table-wrap"><table class="pf-table">
          <thead><tr><th>Date</th><th>Place</th><th>Tournament</th><th>Prize</th></tr></thead>
          <tbody>${c.results.map((r) => `<tr><td>${esc(fmtDate(r.date))}</td><td><span class="pf-place ${placeClass(r.place)}">${esc(r.place)}</span></td><td><b>${esc(r.event)}</b> <span class="pf-tier ${r.tier === 'World' ? 'is-world' : ''}">${esc(r.tier)}</span></td><td>${esc(r.prize || '–')}</td></tr>`).join('')}</tbody>
        </table></div>
      </section>` : ''}
      </div>
      ${upcoming.length ? `<section class="pf-box" aria-labelledby="next-title">
        <h2 id="next-title">Next tournaments</h2>
        <ul class="deadline-list">${upcoming.map((e) => `<li><a href="${cupUrl(e)}"><b>${esc(e.name)}</b><span class="is-muted">${esc(fmtDays(e).split(' · ').pop())}</span></a></li>`).join('')}</ul>
      </section>` : ''}
    </div>

    ${(c.sources || []).length ? `<div class="source-box crown-sources">
      <b>Sources</b>
      ${c.sources.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(hostOf(u))}${icon('external')}</a>`).join('')}
      ${c.checked ? `<span>Last checked: ${esc(fmtDate(c.checked))}</span>` : ''}
    </div>` : ''}
  </main>

  <footer id="site-footer"></footer>

  <script src="../assets/js/data.js"></script>
  <script src="../assets/data/turniere.js"></script>
  <script src="../assets/js/app.js"></script>
  ${tw ? '<script src="../assets/js/streamer.js"></script>' : ''}
</body>
</html>
`;
}
fs.rmSync(STREAMERS, { recursive: true, force: true });
fs.mkdirSync(STREAMERS, { recursive: true });
for (const c of creators) fs.writeFileSync(path.join(STREAMERS, `${c.login}.html`), streamerHtml(c));

const urls = [...STATIC_PAGES, ...built.filter(indexable).map((c) => `/tft-tournaments/${c.id}`), ...creators.map((c) => `/tft-streamers/${c.login}`), ...articles.filter((a) => a.slug && !a.url).map((a) => `/news/${a.slug}`)];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<!-- Erzeugt von tools/build-tournaments.js. Nur Seiten, die in die Suche sollen (kein noindex). -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc></url>`).join('\n')}
</urlset>
`);
console.log(`✔ ${built.length} Turnierseiten, ${creators.length} Streamer-Profile, ${urls.length} Adressen in der Sitemap`);
