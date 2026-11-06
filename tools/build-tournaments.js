// TFTEsport – schreibt aus assets/data/turniere.js eine feste Seite pro Turnier (public/tft-tournaments/<id>.html) und die sitemap.xml.
// Läuft automatisch beim Veröffentlichen auf Vercel (vercel.json, buildCommand); lokal: node tools/build-tournaments.js
// Turniere mit eigenem „page“ (z. B. die Weltmeisterschaft) bekommen keine erzeugte Seite.
// Vergangene inoffizielle Turniere bleiben abrufbar, gehen aber nicht in die Suche (noindex).
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', 'public');
const SITE = 'https://www.tft-esports.com';
const OUT = path.join(ROOT, 'tft-tournaments');
const STATIC_PAGES = ['/', '/tft-tournaments', '/tft-tacticians-crown', '/live-matches', '/twitch', '/twitch/live-streams', '/news'];

/* ---------- Seitenskripte ohne Browser laden: eine Attrappe genügt, gebraucht werden nur die Bausteine aus window.UI ---------- */
const stub = () => new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => '' : k === 'dataset' ? {} : stub()), apply: () => stub(), set: () => true });
global.window = global;
global.document = {
  currentScript: { getAttribute: () => '../assets/js/app.js' },
  querySelectorAll: () => [], getElementById: () => null, createElement: stub, addEventListener() {},
  body: { dataset: {}, appendChild() {}, insertAdjacentHTML() {} }
};
global.location = { protocol: 'https:', hostname: '', search: '' };
global.history = { replaceState() {} };
for (const f of ['assets/js/data.js', 'assets/data/turniere.js', 'assets/js/app.js', 'assets/js/turnier.js']) {
  vm.runInThisContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), { filename: f });
}
const { cups } = window.TFTE;
const { esc, cupDays, cupPast, label } = window.UI;

const clip = (s, n) => (s.length <= n ? s : `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…`);
const keyword = (name) => (/\bTFT\b/.test(name) ? name : `TFT ${name}`);
const titleOf = (c) => `${clip(keyword(c.name).replace(/ – .*$/, (m) => (keyword(c.name).length > 47 ? '' : m)), 47)} | TFTEsport`;
const descOf = (c) => clip(`${keyword(c.name)}: who can enter, rank rules, dates, format and sign-up for this ${label('regions', c.region)} tournament.`, 134);
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
  <meta property="og:site_name" content="TFTEsport" />
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

const urls = [...STATIC_PAGES, ...built.filter(indexable).map((c) => `/tft-tournaments/${c.id}`)];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<!-- Erzeugt von tools/build-tournaments.js. Nur Seiten, die in die Suche sollen (kein noindex). -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc></url>`).join('\n')}
</urlset>
`);
console.log(`✔ ${built.length} Turnierseiten, ${urls.length} Adressen in der Sitemap`);
