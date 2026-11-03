/* Startseite: Turniere im Fokus – Kennzahlen, Turniertabelle mit Schnellfiltern, „Diese Woche“, „Zuletzt gespielt“, dann Streams und News. */
(function () {
  const D = window.TFTE;
  const { icon, esc, tag, empty, label, articleCard, cupRow, cupUrl, sortByDateDesc, upcomingCups, signupOpen, signupState,
    fmtDay, fmtWhen, endOf, toDate, ymd, cupDays, cupDates, cupPast, cupEnd, hostOf, startOfToday, creatorCard, creatorSlot } = window.UI;
  const $ = (id) => document.getElementById(id);

  const upcoming = upcomingCups();
  const openSoonest = upcoming.filter(signupOpen).sort((a, b) => endOf(a.signupDeadline) - endOf(b.signupDeadline));

  /* ---------- Kennzahlen neben dem Titel ---------- */
  function renderStats() {
    const next = openSoonest[0];
    const tile = (href, ic, value, text, cls = '') =>
      `<a class="stat-tile ${cls}" href="${href}">${icon(ic)}<span><b>${value}</b><small>${text}</small></span></a>`;
    $('stat-tiles').innerHTML =
      tile('cups.html', 'trophy', upcoming.length, upcoming.length === 1 ? 'kommendes Turnier' : 'kommende Turniere') +
      tile('cups.html?offen=1', 'users', openSoonest.length, openSoonest.length === 1 ? 'Anmeldung offen' : 'Anmeldungen offen') +
      (next
        ? tile(cupUrl(next), 'clock', esc(fmtDay(next.signupDeadline)), `Nächster Anmeldeschluss · ${esc(next.name)}`, 'is-wide')
        : tile('cups.html', 'clock', '–', 'Gerade keine offene Anmeldung', 'is-wide'));
  }

  /* ---------- Turniertabelle ---------- */
  const FILTERS = [
    { id: 'alle', label: 'Alle', test: () => true },
    { id: 'offen', label: 'Anmeldung offen', test: signupOpen },
    { id: 'offiziell', label: 'Offiziell', test: (c) => c.level === 'offiziell' },
    { id: 'community', label: 'Community & Streamer', test: (c) => c.level !== 'offiziell' },
    { id: 'dach', label: 'DACH', test: (c) => c.region === 'dach' }
  ];
  let filter = 'alle';

  // Nächster Spielblock eines Turniers und wie weit er weg ist
  function nextBlock(c) {
    const now = new Date();
    const b = cupDays(c).find((x) => endOf(x.to) >= now);
    if (!b) return null;
    const start = toDate(b.from);
    const days = Math.round((toDate(b.from.slice(0, 10)) - startOfToday()) / 864e5);
    const rel = start <= now || days < 0 ? 'läuft gerade' : days === 0 ? 'heute' : days === 1 ? 'morgen' : `in ${days} Tagen`;
    const range = `${fmtDay(b.from)}${b.to.slice(0, 10) !== b.from.slice(0, 10) ? ` – ${fmtDay(b.to)}` : ''}`;
    return { range, rel, label: b.label, live: rel === 'läuft gerade' };
  }

  function row(c) {
    const n = nextBlock(c);
    const s = signupState(c);
    const deadline = c.signupDeadline ? `bis ${fmtWhen(c.signupDeadline)}` : '';
    return `<tr>
      <td class="t-when" data-label="Wann">
        <b>${esc(n.range)}</b>
        <small class="${n.live ? 'is-live' : ''}">${n.label ? `${esc(n.label)} · ` : ''}${esc(n.rel)}</small>
      </td>
      <td class="t-name" data-label="Turnier">
        <a href="${cupUrl(c)}">${esc(c.name)}</a>
        <span class="t-tags">${tag(label('cupLevels', c.level), c.level)}${tag(label('regions', c.region), 'region')}</span>
      </td>
      <td class="t-who" data-label="Wer darf teilnehmen?"><span class="clamp" title="${esc(c.eligibility)}">${esc(c.eligibility || 'Noch nicht bekannt')}</span></td>
      <td class="t-rank" data-label="Rang"><span class="clamp" title="${esc(c.rank)}">${esc(c.rank || 'Noch nicht bekannt')}</span></td>
      <td class="t-signup" data-label="Anmeldung">
        <span class="signup-pill is-${s.key}">${esc(s.key === 'open' ? 'Anmeldung offen' : s.text)}</span>
        ${deadline && s.key !== 'closed' ? `<small>${esc(deadline)}</small>` : ''}
        ${c.signupUrl && s.key !== 'closed' ? `<a href="${esc(c.signupUrl)}" target="_blank" rel="noopener">${esc(hostOf(c.signupUrl))}${icon('external')}</a>` : ''}
      </td>
      <td class="t-go"><a href="${cupUrl(c)}" aria-label="Details zu ${esc(c.name)}">${icon('arrow')}</a></td>
    </tr>`;
  }

  function renderChips() {
    $('t-chips').innerHTML = FILTERS.map((f) => {
      const n = upcoming.filter(f.test).length;
      return `<button type="button" class="chip" data-f="${f.id}" aria-pressed="${filter === f.id}">${esc(f.label)} <span class="chip-count">${n}</span></button>`;
    }).join('');
  }

  function renderTable() {
    const list = upcoming.filter(FILTERS.find((f) => f.id === filter).test);
    $('t-table').innerHTML = list.length
      ? `<table class="cup-table">
          <thead><tr><th>Wann</th><th>Turnier</th><th>Wer darf teilnehmen?</th><th>Rang</th><th>Anmeldung</th><th><span class="sr-label">Details</span></th></tr></thead>
          <tbody>${list.map(row).join('')}</tbody>
        </table>`
      : empty({ ic: 'trophy', title: upcoming.length ? 'Keine Turniere für diesen Filter' : 'Gerade sind keine kommenden Turniere eingetragen',
        text: 'Neue Termine erscheinen hier automatisch, sobald die Redaktion sie eingetragen hat.', href: 'cups.html', cta: 'Zum Turnierkalender' });
  }

  $('t-chips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-f]');
    if (!b) return;
    filter = b.dataset.f;
    renderChips();
    renderTable();
  });

  /* ---------- Diese Woche ---------- */
  function renderWeek() {
    const days = Array.from({ length: 7 }, (_, i) => ymd(new Date(startOfToday().getTime() + i * 864e5)));
    const week = upcoming.filter((c) => cupDates(c).some((d) => days.includes(d)));
    const next = upcoming[0];
    $('week-list').innerHTML = week.length
      ? week.map(cupRow).join('')
      : empty({ ic: 'calendar', cls: 'empty-tight', title: 'Diese Woche wird kein Turnier gespielt',
        text: next ? `Als Nächstes: ${esc(next.name)}.` : 'Neue Termine erscheinen hier automatisch.', href: next ? cupUrl(next) : '', cta: 'Details' });
  }

  /* ---------- Zuletzt gespielt ---------- */
  function renderRecent() {
    const past = D.cups.filter(cupPast).sort((a, b) => cupEnd(b) - cupEnd(a)).slice(0, 4);
    $('recent').innerHTML = past.length
      ? `<ul class="deadline-list">${past.map((c) => `<li><a href="${cupUrl(c)}"><b>${esc(c.name)}</b><span class="is-muted">${esc(fmtDay(ymd(cupEnd(c))))}</span></a></li>`).join('')}</ul>`
      : empty({ ic: 'trophy', cls: 'empty-tight', title: 'Noch keine vergangenen Turniere' });
  }

  /* ---------- Streams und News ---------- */
  function renderCreators() {
    const picks = D.creators.filter((c) => c.featured).slice(0, 3);
    $('home-creators').innerHTML = [0, 1, 2].map((i) => (picks[i] ? creatorCard(picks[i]) : creatorSlot(i + 1))).join('');
  }
  function renderNews() {
    const list = sortByDateDesc(D.articles).slice(0, 5);
    const box = $('home-news');
    box.classList.toggle('grid-5', list.length > 0);
    box.innerHTML = list.length
      ? list.map(articleCard).join('')
      : empty({ ic: 'news', title: 'Noch keine News', text: 'Sobald die ersten Artikel online sind, findest du sie hier – offizielle Meldungen, Turniere und Neues aus der Szene.' });
  }

  renderStats();
  renderChips();
  renderTable();
  renderWeek();
  renderRecent();
  renderCreators();
  renderNews();
})();
