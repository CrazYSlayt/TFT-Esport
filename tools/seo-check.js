// TFTEsport – prüft alle Seiten auf die SEO-Regeln (wie bei TFTClimb und TFT Arcade) und auf kaputte Links.
// Regeln: genau eine sichtbare H1 ≤ 54 Zeichen, title ≤ 60, Meta-Beschreibung ≤ 134, keine doppelten Titel,
// canonical = eigene saubere Adresse, indexierbare Seiten mit Keyword „TFT“ in title und Beschreibung und in der Sitemap,
// alle internen Links, Bilder und Symbole (data-icon) vorhanden.
// Aufruf: node tools/seo-check.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');
const SITE = 'https://www.tftesport.com';
const SKIP = new Set(['assets']);

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (SKIP.has(f.name)) continue;
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p); else if (f.name.endsWith('.html')) files.push(p);
  }
})(ROOT);

const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
const urlOf = (file) => { const rel = path.relative(ROOT, file).replace(/\\/g, '/').replace(/\.html$/, ''); return rel === 'index' ? '/' : '/' + rel; };
// Adresse → Datei: saubere Adresse (/news, wie in Sitemap und canonical) oder relativer Dateilink (news.html, ../assets/…)
const exists = (u, fromDir = ROOT) => {
  const p = decodeURI(u.split(/[?#]/)[0]);
  if (p === '/') return true;
  const base = p.startsWith('/') ? path.join(ROOT, p) : path.resolve(fromDir, p);
  return [base, base + '.html'].some((x) => fs.existsSync(x) && fs.statSync(x).isFile());
};
const iconNames = new Set([...fs.readFileSync(path.join(ROOT, 'assets/js/app.js'), 'utf8').match(/const ICONS = \{([\s\S]*?)\n {2}\};/)[1].matchAll(/^\s+(\w+):/gm)].map((m) => m[1]));

const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const inSitemap = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '') || '/'));

const problems = [], titles = {};
for (const f of files) {
  const url = urlOf(f);
  const html = fs.readFileSync(f, 'utf8');
  const bad = (m) => problems.push(`${url}: ${m}`);
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const is404 = url === '/404';

  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  if (h1s.length !== 1) bad(`${h1s.length} H1 statt genau einer`);
  for (const h of h1s) {
    const t = text(h[1]);
    if (t.length > 54) bad(`H1 ${t.length} > 54 Zeichen: „${t}“`);
    if (/hidden|sr-only|visually-hidden|display:\s*none/.test(h[0])) bad('H1 ist versteckt');
  }

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) bad('title fehlt');
  else {
    const t = text(title);
    if (t.length > 60) bad(`title ${t.length} > 60 Zeichen`);
    if (!noindex && !/TFT/.test(t.replace('TFTEsport', ''))) bad('Keyword „TFT“ fehlt im title');
    (titles[t] = titles[t] || []).push(url);
  }
  if (!desc) bad('Meta-Beschreibung fehlt');
  else {
    if (text(desc).length > 134) bad(`Meta-Beschreibung ${text(desc).length} > 134 Zeichen`);
    if (!noindex && !/TFT/.test(desc.replace('TFTEsport', ''))) bad('Keyword „TFT“ fehlt in der Meta-Beschreibung');
  }
  if (!/<html lang="de">/.test(html)) bad('lang="de" fehlt');

  if (!is404) {
    const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    if (!canon) bad('canonical fehlt');
    else if (canon !== SITE + url) bad(`canonical ${canon} ≠ ${SITE + url}`);
    const og = (html.match(/<meta property="og:url" content="([^"]+)"/) || [])[1];
    if (og !== canon) bad('og:url ≠ canonical');
    if (noindex && inSitemap.has(url)) bad('steht auf noindex, ist aber in der Sitemap');
    if (!noindex && !inSitemap.has(url)) bad('indexierbar, fehlt aber in sitemap.xml');
  }

  for (const m of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
    if (m[1].startsWith('//') || /^[a-z]+:/i.test(m[1])) continue;   // extern (https:, mailto: …)
    if (m[1].startsWith('/')) bad(`Wurzel-Pfad ${m[1]} – läuft nicht per Doppelklick, relativ verlinken`);
    else if (!exists(m[1], path.dirname(f))) bad(`Link/Datei ohne Ziel: ${m[1]}`);
  }
  for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!html.includes(`id="${m[1]}"`)) bad(`Sprungmarke #${m[1]} fehlt`);
  for (const m of html.matchAll(/data-icon="(\w+)"/g)) if (!iconNames.has(m[1])) bad(`Symbol „${m[1]}“ fehlt in app.js`);
}
for (const [t, list] of Object.entries(titles)) if (list.length > 1) problems.push(`Doppelter title „${t}“: ${list.join(', ')}`);
for (const u of inSitemap) if (!exists(u)) problems.push(`Sitemap: ${u} existiert nicht`);

// Interne Links in den Skripten (Navigation, Footer) müssen ebenfalls existieren
for (const js of fs.readdirSync(path.join(ROOT, 'assets/js'))) {
  const src = fs.readFileSync(path.join(ROOT, 'assets/js', js), 'utf8');
  for (const m of src.matchAll(/link\('([a-z0-9/.-]+\.html)'\)/g)) if (!exists(m[1])) problems.push(`assets/js/${js}: Link ohne Ziel ${m[1]}`);
  for (const m of src.matchAll(/href: '(\/[^']*)'/g)) problems.push(`assets/js/${js}: Wurzel-Pfad ${m[1]} – link('….html') verwenden`);
  for (const m of src.matchAll(/icon\('(\w+)'/g)) if (!iconNames.has(m[1])) problems.push(`assets/js/${js}: Symbol „${m[1]}“ fehlt`);
}

if (problems.length) {
  console.error(`✖ SEO-Check: ${problems.length} Problem(e)\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`✔ SEO-Check: ${files.length} Seiten in Ordnung (${inSitemap.size} in der Sitemap)`);
