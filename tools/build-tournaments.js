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
const { esc, tag, cupDays, cupPast, cupUrl, fmtDate, fmtDays, hostOf, label, icon, creatorImage } = window.UI;

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
  const title = esc(`${c.name}: TFT Streamer Profile | TFT E-Sports`);
  const desc = esc(clip(`${c.name}, TFT streamer on Twitch: profile, live status and channel links. ${c.focus || ''}`, 134));
  const st = c.stats || {};
  const facts = [
    c.realName && ['users', 'Real name', esc(c.realName)],
    ['twitch', 'Twitch', `<a href="https://www.twitch.tv/${esc(c.login)}" target="_blank" rel="noopener">${esc(c.login)}</a>`, 'stream channel'],
    ['shield', 'Role', esc(c.role || 'Streamer')],
    c.worldTitles && ['trophy', 'World titles', esc(c.worldTitles), 'Tactician\'s Crown'],
    st.wins !== undefined && ['star', 'Tournament wins', esc(st.wins), 'official events'],
    st.top8 !== undefined && ['list', 'Top 8 finishes', esc(st.top8), 'official events'],
    st.events !== undefined && ['calendar', 'Tournaments played', esc(st.events), 'official events since 2024'],
    (c.career || []).length && ['swords', 'Teams so far', esc(c.career.length)],
    ...(c.extra || []).map(([ic, k, v, sub]) => [ic, esc(k), esc(v), sub && esc(sub)])
  ].filter(Boolean);
  const upcoming = (c.events || []).map((id) => cups.find((x) => x.id === id)).filter((e) => e && !cupPast(e));
  const placeClass = (p) => (/^1/.test(p) ? 'p1' : /^2/.test(p) ? 'p2' : /^3/.test(p) ? 'p3' : '');
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: c.name, url, sameAs: [`https://www.twitch.tv/${c.login}`, ...(c.links || []).map((l) => l.url)] };
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
<body data-page="twitch" data-streamer="${esc(c.login)}">
  <header id="site-header"></header>

  <main class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="../index.html">Home</a><span data-icon="chevronRight"></span><a href="../twitch.html">Live Streams</a><span data-icon="chevronRight"></span><span>${esc(c.name)}</span>
    </nav>

    <div class="pf-top">
      <aside class="pf-card">
        <div class="pf-portrait">${creatorImage(c)}</div>
        <h1>${esc(c.name)}</h1>
        <p class="pf-sub">TFT player profile</p>
        <div class="pf-tags">${tag(c.role || 'Streamer', 'solid')}${c.region ? tag(c.region, 'region') : ''}</div>
        ${c.country ? `<p class="pf-country">${icon('pin')}${esc(c.country)}</p>` : ''}
        ${c.team ? `<div class="pf-team"><small>Team</small><b>${esc(c.team)}</b>${c.teamSince ? `<small>since ${esc(c.teamSince)}</small>` : ''}</div>` : ''}
        ${c.prize ? `<div class="pf-prize"><small>Total prize money</small><b>${esc(c.prize.amount)}</b>${c.prize.note ? `<small>${esc(c.prize.note)}</small>` : ''}</div>` : ''}
      </aside>

      ${(c.career || []).length ? `<section class="pf-box" aria-labelledby="career-title">
        <div class="pf-head">${icon('clock')}<h2 id="career-title">Career</h2><span>every team, newest first</span></div>
        <ol class="pf-career">${c.career.map((t) => `<li class="${t.to ? '' : 'is-now'}"><b>${esc(t.team)}</b><span>${esc(t.from)} – ${esc(t.to || 'today')}</span></li>`).join('')}</ol>
      </section>` : ''}

      <section class="pf-box" aria-labelledby="facts-title">
        <div class="pf-head">${icon('users')}<h2 id="facts-title">Profile</h2></div>
        <dl class="pf-facts">${facts.map(([ic, k, v, sub]) => `<div><span class="pf-ic">${icon(ic)}</span><span><dt>${k}</dt><dd>${v}</dd>${sub ? `<small>${sub}</small>` : ''}</span></div>`).join('')}</dl>
      </section>
    </div>

    <section class="pf-live" id="streamer-live" aria-label="Live stream">
      <div class="pf-media" id="streamer-player"><span class="pf-offline">${icon('twitch')}Offline</span></div>
      <div class="pf-live-text">
        <p class="streamer-status" id="streamer-status"><span class="dot" aria-hidden="true"></span>${esc(c.name)} is offline right now</p>
        <p class="pf-live-title" id="streamer-title">twitch.tv/${esc(c.login)}</p>
        <div class="hero-actions">
          <button type="button" class="btn btn-primary" id="streamer-load">Watch here</button>
          <a class="btn btn-ghost" href="https://www.twitch.tv/${esc(c.login)}" target="_blank" rel="noopener">Open on Twitch${icon('external')}</a>
          ${(c.links || []).map((l) => `<a class="btn btn-ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}${icon('external')}</a>`).join('')}
        </div>
        <p class="pf-note">The player loads from Twitch only after you click “Watch here”.</p>
      </div>
    </section>

    <section class="pf-box pf-who" aria-labelledby="who-title">
      <h2 id="who-title">Who is ${esc(c.name)}?</h2>
      <p>${esc(c.about || '')}</p>
    </section>

    ${(c.results || []).length || upcoming.length ? `<div class="pf-bottom">
      ${(c.results || []).length ? `<section class="pf-box" aria-labelledby="results-title">
        <h2 id="results-title">${esc(c.name)}'s biggest results</h2>
        <p class="pf-sub-left">Selected finishes, newest first</p>
        <div class="pf-table-wrap"><table class="pf-table">
          <thead><tr><th>Date</th><th>Place</th><th>Tournament</th><th>Prize</th></tr></thead>
          <tbody>${c.results.map((r) => `<tr><td>${esc(fmtDate(r.date))}</td><td><span class="pf-place ${placeClass(r.place)}">${esc(r.place)}</span></td><td><b>${esc(r.event)}</b> <span class="pf-tier ${r.tier === 'World' ? 'is-world' : ''}">${esc(r.tier)}</span></td><td>${esc(r.prize || '–')}</td></tr>`).join('')}</tbody>
        </table></div>
      </section>` : ''}
      ${upcoming.length ? `<section class="pf-box" aria-labelledby="next-title">
        <h2 id="next-title">Next tournaments</h2>
        <ul class="deadline-list">${upcoming.map((e) => `<li><a href="${cupUrl(e)}"><b>${esc(e.name)}</b><span class="is-muted">${esc(fmtDays(e).split(' · ').pop())}</span></a></li>`).join('')}</ul>
      </section>` : ''}
    </div>` : ''}

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
  <script src="../assets/js/streamer.js"></script>
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
