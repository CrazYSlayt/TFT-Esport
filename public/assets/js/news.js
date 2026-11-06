/* News-Übersicht: Filter nach Kategorie (per Adresse verlinkbar: /news?category=turniere). */
(function () {
  const D = window.TFTE;
  const { esc, empty, articleCard, sortByDateDesc, link, setUrl } = window.UI;
  const $ = (id) => document.getElementById(id);

  const articles = sortByDateDesc(D.articles);
  const valid = (id) => D.newsCategories.some((c) => c.id === id);
  let cat = new URLSearchParams(location.search).get('category');
  if (!valid(cat)) cat = 'all';

  function render() {
    const counts = {};
    articles.forEach((a) => { counts[a.cat] = (counts[a.cat] || 0) + 1; });
    const chips = [{ id: 'all', label: 'All' }, ...D.newsCategories];
    $('news-filter').innerHTML = chips.map((c) => {
      const n = c.id === 'all' ? articles.length : counts[c.id] || 0;
      return `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${cat === c.id}">${esc(c.label)} <span class="chip-count">${n}</span></button>`;
    }).join('');

    const list = articles.filter((a) => cat === 'all' || a.cat === cat);
    $('news-count').textContent = `${list.length} ${list.length === 1 ? 'article' : 'articles'}`;
    const box = $('news-list');
    box.classList.toggle('grid-3', list.length > 0);
    box.classList.toggle('show-all', list.length > 0);
    if (list.length) { box.innerHTML = list.map(articleCard).join(''); return; }

    const c = D.newsCategories.find((x) => x.id === cat);
    box.innerHTML = articles.length
      ? empty({ ic: 'news', title: `No articles in “${esc(c.label)}” yet`, text: 'Nothing has been published in this category so far. Have a look at the other sections or come back soon.', href: link('news.html'), cta: 'Show all news' })
      : empty({ pose: 'tablet', title: 'The first news are on their way', text: 'Soon you will find official updates, tournaments and results, news from the Twitch scene and clear explanations here. Until then: have a look at the tournaments.', href: link('tft-tournaments.html'), cta: 'Go to tournaments' });
  }

  $('news-filter').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = b.dataset.cat;
    const url = new URL(location.href);
    if (cat === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', cat);
    setUrl(url);
    render();
  });

  render();
})();
