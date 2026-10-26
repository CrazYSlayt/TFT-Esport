/* Startseite: nächster Termin, Titelstory, zwei Artikel, „Was steht an?“, News-Raster, Anmeldeschlüsse, Twitch-Empfehlungen. */
(function () {
  const D = window.TFTE;
  const { icon, esc, tag, empty, imgPlaceholder, articleCard, cupRow, articleUrl, catLabel, fmtDate, sortByDateDesc, upcomingCups,
    signupOpen, fmtWhen, endOf, cupUrl, creatorCard, creatorSlot, link } = window.UI;
  const $ = (id) => document.getElementById(id);

  const articles = sortByDateDesc(D.articles);
  const top = articles.find((a) => a.top) || articles[0];
  const rest = articles.filter((a) => a !== top);

  /* ---------- Nächster Termin (rechts neben dem Titel) ---------- */
  function renderNextTile() {
    const open = upcomingCups().filter((c) => signupOpen(c)).sort((a, b) => endOf(a.signupDeadline) - endOf(b.signupDeadline));
    const next = upcomingCups()[0];
    const el = $('next-tile');
    if (open.length) {
      const c = open[0];
      el.href = cupUrl(c);
      el.innerHTML = `${icon('clock')}<span><small>Nächster Anmeldeschluss</small><b>${esc(c.name)}</b><em>${esc(fmtWhen(c.signupDeadline))}</em></span>`;
    } else if (next) {
      el.href = cupUrl(next);
      el.innerHTML = `${icon('trophy')}<span><small>Nächstes Turnier</small><b>${esc(next.name)}</b></span>`;
    } else {
      el.innerHTML = `${icon('calendar')}<span><small>Turnierkalender</small><b>Noch keine Termine</b></span>`;
    }
  }

  /* ---------- Titelstory ---------- */
  function renderStory() {
    $('story').outerHTML = top
      ? `<a class="story" href="${articleUrl(top)}">
          ${top.image ? `<img src="${esc(link(top.image))}" alt="" />` : imgPlaceholder('Titelbild', 'ph-dark')}
          <div class="story-body">
            <div class="story-tags">${tag('Titelstory', 'solid')}${tag(catLabel(top.cat), top.cat)}</div>
            <h2>${esc(top.title)}</h2>
            ${top.teaser ? `<p>${esc(top.teaser)}</p>` : ''}
          </div>
        </a>`
      : `<div class="story">
          ${imgPlaceholder('Titelbild · Platzhalter', 'ph-dark')}
          <div class="story-body">
            <div class="story-tags">${tag('Titelstory', 'solid')}</div>
            <h2>Platzhalter: Titelstory</h2>
            <p>Hier erscheint der wichtigste Artikel – mit Bild, Schlagzeile und kurzem Teaser.</p>
          </div>
        </div>`;
  }

  /* ---------- Zwei hervorgehobene Artikel neben der Titelstory ---------- */
  function renderFeatured() {
    const card = (a) => `<a class="card feat-card" href="${articleUrl(a)}">
        ${a.image ? `<img class="card-img" src="${esc(link(a.image))}" alt="" loading="lazy" />` : imgPlaceholder('Artikelbild', 'card-img')}
        <div class="card-body"><p class="card-meta-top">${tag(catLabel(a.cat), a.cat)}<span>${esc(fmtDate(a.date))}</span></p><h3 class="card-title">${esc(a.title)}</h3></div>
      </a>`;
    const slot = (n) => `<div class="card feat-card">
        ${imgPlaceholder('Artikelbild', 'card-img')}
        <div class="card-body"><p class="card-meta-top">${tag('Kategorie')}</p><h3 class="card-title">Platzhalter: Artikel ${n}</h3></div>
      </div>`;
    $('featured').innerHTML = [0, 1].map((i) => (rest[i] ? card(rest[i]) : slot(i + 1))).join('');
  }

  /* ---------- Was steht an? (Reiter: kommend / Anmeldung offen) ---------- */
  let tab = 'kommend';
  function renderUpcoming() {
    // Auf dem Handy wächst das Widget mit, deshalb dort weniger Einträge; am Desktop scrollt die Liste
    const max = window.matchMedia('(max-width: 680px)').matches ? 3 : 8;
    const list = upcomingCups().filter((c) => tab === 'kommend' || signupOpen(c)).slice(0, max);
    $('upcoming-list').innerHTML = list.length
      ? list.map(cupRow).join('')
      : empty({ ic: 'calendar', cls: 'empty-tight', title: tab === 'offen' ? 'Gerade keine offene Anmeldung' : 'Noch keine Turniere eingetragen', text: 'Neue Termine erscheinen hier automatisch.' });
    document.querySelectorAll('[data-tab]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.tab === tab));
  }
  document.querySelector('.widget .seg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    tab = b.dataset.tab;
    renderUpcoming();
  });

  /* ---------- Neues aus der Szene (Filter oben unter dem Titel) ---------- */
  let cat = 'all';
  function renderChips() {
    const chips = [{ id: 'all', short: 'Alle News' }, ...D.newsCategories];
    $('news-chips').innerHTML = chips.map((c) =>
      `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${cat === c.id}">${esc(c.short)}</button>`).join('');
  }
  function renderNews() {
    const list = rest.slice(2).filter((a) => cat === 'all' || a.cat === cat).slice(0, 10);
    const box = $('home-news');
    box.classList.toggle('grid-5', list.length > 0);
    box.innerHTML = list.length
      ? list.map(articleCard).join('')
      : empty({
        ic: 'news',
        title: cat === 'all' ? 'Noch keine News' : `Noch keine News in „${esc(D.newsCategories.find((c) => c.id === cat).label)}“`,
        text: 'Sobald die ersten Artikel online sind, findest du sie hier – offizielle Meldungen, Turniere und Neues aus der Szene.'
      });
  }
  $('news-chips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = b.dataset.cat;
    renderChips();
    renderNews();
  });

  /* ---------- Auf einen Blick: Anmeldeschlüsse ---------- */
  function renderDeadlines() {
    const open = upcomingCups().filter((c) => signupOpen(c)).sort((a, b) => endOf(a.signupDeadline) - endOf(b.signupDeadline)).slice(0, 5);
    $('deadlines').innerHTML = open.length
      ? `<ul class="deadline-list">${open.map((c) => `<li><a href="${cupUrl(c)}"><b>${esc(c.name)}</b><span>bis ${esc(fmtWhen(c.signupDeadline))}</span></a></li>`).join('')}</ul>`
      : empty({ ic: 'clock', cls: 'empty-tight', title: 'Gerade keine offene Anmeldung', text: 'Sobald neue Turniere eingetragen sind, stehen ihre Anmeldeschlüsse hier.' });
  }

  /* ---------- Twitch-Empfehlungen ---------- */
  function renderCreators() {
    const picks = D.creators.filter((c) => c.featured).slice(0, 3);
    $('home-creators').innerHTML = [0, 1, 2].map((i) => (picks[i] ? creatorCard(picks[i]) : creatorSlot(i + 1))).join('');
  }

  renderNextTile();
  renderStory();
  renderFeatured();
  renderUpcoming();
  renderChips();
  renderNews();
  renderDeadlines();
  renderCreators();
})();
