/* News-Übersicht: Filter nach Kategorie (per Adresse verlinkbar: /news?kategorie=turniere). */
(function () {
  const D = window.TFTE;
  const { esc, empty, articleCard, sortByDateDesc, link, setUrl } = window.UI;
  const $ = (id) => document.getElementById(id);

  const articles = sortByDateDesc(D.articles);
  const valid = (id) => D.newsCategories.some((c) => c.id === id);
  let cat = new URLSearchParams(location.search).get('kategorie');
  if (!valid(cat)) cat = 'all';

  function render() {
    const counts = {};
    articles.forEach((a) => { counts[a.cat] = (counts[a.cat] || 0) + 1; });
    const chips = [{ id: 'all', label: 'Alle' }, ...D.newsCategories];
    $('news-filter').innerHTML = chips.map((c) => {
      const n = c.id === 'all' ? articles.length : counts[c.id] || 0;
      return `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${cat === c.id}">${esc(c.label)} <span class="chip-count">${n}</span></button>`;
    }).join('');

    const list = articles.filter((a) => cat === 'all' || a.cat === cat);
    $('news-count').textContent = `${list.length} Artikel`;
    const box = $('news-list');
    box.classList.toggle('grid-3', list.length > 0);
    box.classList.toggle('show-all', list.length > 0);
    if (list.length) { box.innerHTML = list.map(articleCard).join(''); return; }

    const c = D.newsCategories.find((x) => x.id === cat);
    box.innerHTML = articles.length
      ? empty({ ic: 'news', title: `Noch keine Artikel in „${esc(c.label)}“`, text: 'In dieser Kategorie ist gerade nichts erschienen. Schau in die anderen Bereiche oder komm bald wieder vorbei.', href: link('news.html'), cta: 'Alle News anzeigen' })
      : empty({ ic: 'news', title: 'Hier entstehen gerade die ersten News', text: 'Bald findest du hier offizielle Meldungen, Turniere und Ergebnisse, Neues aus der Twitch-Szene und verständliche Erklärungen. Bis dahin: Schau doch bei den Turnieren vorbei.', href: link('cups.html'), cta: 'Zu den Turnieren' });
  }

  $('news-filter').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = b.dataset.cat;
    const url = new URL(location.href);
    if (cat === 'all') url.searchParams.delete('kategorie'); else url.searchParams.set('kategorie', cat);
    setUrl(url);
    render();
  });

  render();
})();
