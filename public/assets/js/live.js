/* Live Matches: was heute läuft (oder als Nächstes kommt), Spielplan heute und der nächsten 7 Tage, letzte Ergebnisse.
   Grundlage sind die Turniere aus dem Kalender (assets/data/turniere.js). „Live“ heißt hier: heute ist Spieltag –
   mit bekannter Startzeit ab dieser Uhrzeit. Echte Live-Punktestände kommen erst mit einer Datenquelle;
   bis dahin zeigt die Karte den Stand, den die Redaktion unter „Ergebnis“ einträgt. */
(function () {
  const D = window.TFTE;
  const { icon, esc, tag, label, empty, cupUrl, cupDays, cupDates, cupNext, cupPast, cupEnd, upcomingCups, endOf, toDate, ymd,
    fmtDay, fmtTime, hostOf, startOfToday, SET_ICON } = window.UI;
  const $ = (id) => document.getElementById(id);
  const WD_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  const hasTime = (iso) => /T\d\d:\d\d/.test(iso || '');
  const blocksOn = (c, key) => cupDays(c).filter((b) => key >= b.from.slice(0, 10) && key <= b.to.slice(0, 10));
  const daysUntil = (key) => Math.round((toDate(key) - startOfToday()) / 864e5);
  const relDays = (n) => (n === 0 ? 'heute' : n === 1 ? 'morgen' : `in ${n} Tagen`);
  const SHORT_LEVEL = { offiziell: 'Offiziell', regional: 'Regional', streamer: 'Streamer-Cup', eigener: 'Eigener Cup' };
  const levelTag = (c) => tag(SHORT_LEVEL[c.level] || label('cupLevels', c.level), c.level);
  // „twitch.tv/teamfighttactics“ statt der ganzen Adresse
  const shortUrl = (url) => { try { const u = new URL(url); return hostOf(url) + u.pathname.replace(/\/$/, ''); } catch (_) { return url; } };
  const watch = (c) => (c.streamUrl
    ? `<a class="watch-chip" href="${esc(c.streamUrl)}" target="_blank" rel="noopener">${icon(/twitch/.test(c.streamUrl) ? 'twitch' : 'play')}${esc(shortUrl(c.streamUrl))}</a>`
    : '<span class="watch-none">Stream noch nicht bekannt</span>');
  const top = (c) => (c.result && c.result.top ? c.result.top.filter((t) => t.name) : []);

  // Platzierungen (Ergebnis oder von der Redaktion eingetragener Zwischenstand)
  const standings = (c, n) => `<ol class="podium">${top(c).slice(0, n).map((t, i) => `<li class="p${i + 1}">
      <span class="pos">${i + 1}</span><span class="who">${esc(t.name)}</span>${t.points !== undefined && t.points !== '' ? `<b>${esc(t.points)} P.</b>` : ''}</li>`).join('')}</ol>`;

  /* ---------- Live jetzt / Als Nächstes ---------- */
  function liveCard(c, key) {
    const b = blocksOn(c, key)[0];
    const dates = [...new Set(cupDates(c))].sort();
    const now = new Date();
    const start = hasTime(b.from) ? new Date(`${key}T${b.from.slice(11, 16)}`) : null;
    const isLive = start && now >= start;
    const badge = isLive ? '<span class="lc-badge is-live">Live</span>' : '<span class="lc-badge is-today">Heute</span>';
    const when = start ? (isLive ? `seit ${fmtTime(b.from)} Uhr` : `ab ${fmtTime(b.from)} Uhr`) : 'Uhrzeit laut Veranstalter offen';
    return `<article class="live-card ${isLive ? 'is-live' : ''}">
      <div class="lc-top">${badge}<span class="lc-day">Spieltag ${dates.indexOf(key) + 1} von ${dates.length}</span>${levelTag(c)}</div>
      <h3><a href="${cupUrl(c)}">${esc(c.name)}</a></h3>
      <p class="lc-meta">${icon('pin')}${esc(label('regions', c.region))}${b.label ? ` · ${esc(b.label)}` : ''} · ${esc(when)}</p>
      ${top(c).length
        ? `<div class="lc-score"><p class="lc-score-head">Zwischenstand <small>eingetragen von der Redaktion</small></p>${standings(c, 4)}</div>`
        : `<div class="lc-score is-empty">${icon('info')}<span>Live-Punktestand folgt, sobald eine Datenquelle angebunden ist.</span></div>`}
      <div class="lc-watch"><span>Zuschauen:</span>${watch(c)}</div>
    </article>`;
  }
  function nextCard(c) {
    const b = cupDays(c).find((x) => endOf(x.to) >= new Date());
    const n = daysUntil(b.from.slice(0, 10));
    const range = `${fmtDay(b.from)}${b.to.slice(0, 10) !== b.from.slice(0, 10) ? ` – ${fmtDay(b.to)}` : ''}`;
    return `<article class="live-card is-next">
      <div class="lc-top"><span class="lc-badge is-next">${esc(relDays(n))}</span>${levelTag(c)}</div>
      <h3><a href="${cupUrl(c)}">${esc(c.name)}</a></h3>
      <p class="lc-meta">${icon('calendar')}${esc(range)}${hasTime(b.from) ? `, ${fmtTime(b.from)} Uhr` : ''}${b.label ? ` · ${esc(b.label)}` : ''}</p>
      <p class="lc-meta">${icon('pin')}${esc(label('regions', c.region))}</p>
      <div class="lc-watch"><span>Zuschauen:</span>${watch(c)}</div>
    </article>`;
  }
  function renderLive() {
    const key = ymd(new Date());
    const today = D.cups.filter((c) => blocksOn(c, key).length);
    if (today.length) {
      $('live-title').innerHTML = '<span class="rec-dot" aria-hidden="true"></span>Live jetzt';
      $('live-sub').textContent = today.length === 1 ? 'Heute ist 1 Turnier-Spieltag' : `Heute sind ${today.length} Turnier-Spieltage`;
      $('live-cards').innerHTML = today.map((c) => liveCard(c, key)).join('');
      return;
    }
    const next = upcomingCups().slice(0, 3);
    $('live-title').textContent = 'Als Nächstes';
    $('live-sub').textContent = next.length ? 'Gerade läuft kein Turnier – das steht als Nächstes an.' : 'Gerade läuft kein Turnier.';
    $('live-cards').innerHTML = next.length
      ? next.map(nextCard).join('')
      : empty({ ic: 'calendar', cls: 'empty-tight', title: 'Noch keine kommenden Turniere eingetragen', text: 'Neue Termine erscheinen hier automatisch.' });
  }

  /* ---------- Spielplan: Einträge eines Tages (Spieltage, Anmeldeschlüsse, Set-Termine) ---------- */
  function entriesOn(key) {
    const out = [];
    D.cups.forEach((c) => blocksOn(c, key).forEach((b) => out.push({
      time: hasTime(b.from) ? fmtTime(b.from) : '', name: c.name, href: cupUrl(c), sub: `${label('cupLevels', c.level)}${b.label ? ` · ${b.label}` : ''}`, kind: c.level
    })));
    D.cups.filter((c) => c.signupDeadline && c.signupDeadline.slice(0, 10) === key).forEach((c) => out.push({
      time: hasTime(c.signupDeadline) ? fmtTime(c.signupDeadline) : '', name: `Anmeldeschluss: ${c.name}`, href: cupUrl(c), sub: 'Anmeldung beim Veranstalter', kind: 'deadline'
    }));
    (D.setEvents || []).filter((e) => e.date === key).forEach((e) => out.push({ time: '', name: e.title, sub: e.info, kind: 'set', ic: SET_ICON[e.kind] }));
    return out.sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  }
  const row = (e) => `<li class="sched-row is-${esc(e.kind)}">
      <span class="sched-time ${e.time || e.ic ? '' : 'is-open'}">${e.time ? esc(e.time) : e.ic ? icon(e.ic) : 'Zeit offen'}</span>
      <span class="sched-main">${e.href ? `<a href="${e.href}">${esc(e.name)}</a>` : `<b>${esc(e.name)}</b>`}<small>${esc(e.sub)}</small></span>
    </li>`;

  function renderToday() {
    const d = new Date();
    $('today-date').textContent = `${WD_LONG[d.getDay()]}, ${fmtDay(ymd(d)).slice(3)}`;
    const list = entriesOn(ymd(d));
    if (list.length) { $('today').innerHTML = `<ul class="sched">${list.map(row).join('')}</ul>`; return; }
    const next = upcomingCups()[0];
    $('today').innerHTML = empty({ ic: 'calendar', cls: 'empty-tight', title: 'Heute keine Spiele',
      text: next ? `Nächster Spieltag: ${fmtDay(ymd(cupNext(next)))} · ${esc(next.name)}` : 'Neue Termine erscheinen hier automatisch.' });
  }

  function renderWeek() {
    let html = '';
    for (let i = 1; i <= 7; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const list = entriesOn(ymd(d));
      if (list.length) html += `<h3 class="sched-day">${WD_LONG[d.getDay()]}, ${fmtDay(ymd(d)).slice(3)}</h3><ul class="sched">${list.map(row).join('')}</ul>`;
    }
    $('week').innerHTML = html || empty({ ic: 'calendar', cls: 'empty-tight', title: 'In den nächsten 7 Tagen steht nichts an' });
  }

  /* ---------- Letzte Ergebnisse ---------- */
  function renderResults() {
    const past = D.cups.filter(cupPast).sort((a, b) => cupEnd(b) - cupEnd(a)).slice(0, 5);
    $('results').innerHTML = past.length ? past.map((c) => `<article class="res-card">
        <div class="lc-top"><span class="res-final">Beendet · ${esc(fmtDay(ymd(cupEnd(c))))}</span>${levelTag(c)}</div>
        <h3><a href="${cupUrl(c)}">${esc(c.name)}</a></h3>
        ${top(c).length
          ? `${standings(c, 4)}${c.result.note ? `<p class="res-note">${esc(c.result.note)}</p>` : ''}`
          : `<p class="res-missing">Ergebnis noch nicht eingetragen.${c.sources && c.sources[0] ? ` <a href="${esc(c.sources[0])}" target="_blank" rel="noopener">Zum Veranstalter${icon('external')}</a>` : ''}</p>`}
      </article>`).join('')
      : empty({ ic: 'trophy', cls: 'empty-tight', title: 'Noch keine vergangenen Turniere' });
  }

  function render() {
    $('updated').textContent = `Stand ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`;
    renderLive();
    renderToday();
    renderWeek();
    renderResults();
  }
  render();
  setInterval(render, 60000);   // „Live“/„Heute“ und Uhrzeit aktuell halten, solange die Seite offen ist
})();
