/* Turnier-Detailseite: liest ?id=… und zeigt Kernfragen, Termine, Format, Quellen und Anmeldung. */
(function () {
  const D = window.TFTE;
  const { icon, esc, link, label, tag, empty, toDate, endOf, fmtDate, fmtTime, fmtWhen, fmtDay, cupDays, cupPast, signupState, hostOf, keyFacts } = window.UI;
  const $ = (id) => document.getElementById(id);

  const id = new URLSearchParams(location.search).get('id');
  const c = D.cups.find((x) => x.id === id);

  if (!c) {
    $('cup-name').textContent = 'Turnier nicht gefunden';
    document.querySelector('.layout-aside').outerHTML = empty({
      ic: 'trophy', title: 'Dieses Turnier gibt es nicht (mehr)',
      text: 'Vielleicht wurde es umbenannt oder entfernt. In der Übersicht findest du alle aktuellen Turniere.',
      href: link('cups.html'), cta: 'Zu allen Turnieren'
    });
    return;
  }

  document.title = `${c.name} – TFT Turnier | TFTEsport`;
  const s = signupState(c);
  const past = cupPast(c);

  $('crumb-name').textContent = c.name;
  $('cup-name').textContent = c.name;
  $('cup-tags').innerHTML = tag(label('cupLevels', c.level), c.level) + tag(label('regions', c.region), 'region') +
    (past ? tag('Vorbei', 'past') : `<span class="signup-pill is-${s.key}">${esc(s.text)}</span>`);
  $('cup-info').textContent = c.info || '';
  $('cup-facts').innerHTML = keyFacts(c);

  /* Termine als Zeitleiste, nach Datum sortiert (bei mehreren Qualifiern kann der Anmeldeschluss zwischen Spieltagen liegen) */
  const steps = [];
  if (c.signupStart) steps.push([c.signupStart, 'Anmeldung öffnet', fmtWhen(c.signupStart)]);
  if (c.signupDeadline) steps.push([endOf(c.signupDeadline).toISOString(), 'Anmeldeschluss', fmtWhen(c.signupDeadline)]);
  cupDays(c).forEach((d) => steps.push([d.from, d.label || 'Spieltage',
    d.to.slice(0, 10) !== d.from.slice(0, 10) ? `${fmtDay(d.from, true)} – ${fmtDay(d.to, true)}${/T/.test(d.from) ? `, Start ${fmtTime(d.from)} Uhr` : ''}` : fmtWhen(d.from)]));
  steps.sort((a, b) => toDate(a[0]) - toDate(b[0]));

  const sources = (c.sources || []).filter(Boolean);
  $('cup-body').innerHTML = `
    <h2>Termine</h2>
    <ol class="timeline">${steps.map(([, k, v]) => `<li><b>${esc(k)}</b>${esc(v)}</li>`).join('')}</ol>
    <p class="muted-note">${icon('info')}Termine in deutscher Zeit. Ohne Uhrzeit hat der Veranstalter noch keine genannt.</p>
    ${c.format ? `<h2>Format &amp; Ablauf</h2><p>${esc(c.format)}</p>` : ''}
    ${c.prize ? `<h2>Preisgeld</h2><p>${esc(c.prize)}</p>` : ''}
    ${c.organizer ? `<h2>Veranstalter</h2><p>${esc(c.organizer)}</p>` : ''}
    <div class="source-box">
      <b>Quellen &amp; Prüfstand</b>
      ${sources.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(hostOf(u))}${icon('external')}</a>`).join('') || '<span>Keine Quelle hinterlegt</span>'}
      ${c.checked ? `<span>Zuletzt geprüft: ${esc(fmtDate(c.checked))}</span>` : ''}
    </div>`;

  /* Anmeldung (Seitenleiste) */
  $('cup-aside').insertAdjacentHTML('beforeend', `
    <p class="signup is-${past ? 'closed' : s.key}">${esc(past ? 'Turnier ist vorbei' : s.text)}</p>
    ${c.signupUrl && !past && s.key !== 'closed'
      ? `<a class="btn btn-primary btn-block" href="${esc(c.signupUrl)}" target="_blank" rel="noopener">Zur Anmeldung${icon('external')}</a>` : ''}
    ${c.streamUrl ? `<a class="btn btn-twitch btn-block" href="${esc(c.streamUrl)}" target="_blank" rel="noopener">Zur Übertragung${icon('external')}</a>` : ''}
    <p class="editor-note">${icon('info')}Die Anmeldung läuft direkt beim Veranstalter. Maßgeblich sind immer dessen Angaben.</p>`);
})();
