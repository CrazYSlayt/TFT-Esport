/* Turnierseite: window.cupPage(c) baut die Inhalte. tools/build-tournaments.js schreibt sie fest ins HTML (für Suchmaschinen),
   im Browser werden sie mit dem aktuellen Stand und der Ortszeit des Besuchers neu gefüllt. */
(function () {
  const { icon, esc, label, tag, toDate, endOf, fmtDate, fmtTime, fmtWhen, fmtDay, cupDays, cupPast, signupState, hostOf, keyFacts } = window.UI;

  window.cupPage = function cupPage(c) {
    const s = signupState(c);
    const past = cupPast(c);

    const tags = tag(label('cupLevels', c.level), c.level) + tag(window.UI.where(c), 'region') +
      (past ? tag('Past', 'past') : `<span class="signup-pill is-${s.key}">${esc(s.text)}</span>`);

    /* Termine als Zeitleiste, nach Datum sortiert (bei mehreren Qualifiern kann der Anmeldeschluss zwischen Spieltagen liegen) */
    const steps = [];
    if (c.signupStart) steps.push([c.signupStart, 'Sign-up opens', fmtWhen(c.signupStart)]);
    if (c.signupDeadline) steps.push([endOf(c.signupDeadline).toISOString(), 'Sign-up deadline', fmtWhen(c.signupDeadline)]);
    cupDays(c).forEach((d) => steps.push([d.from, d.label || 'Game days',
      d.to.slice(0, 10) !== d.from.slice(0, 10) ? `${fmtDay(d.from, true)} – ${fmtDay(d.to, true)}${/T/.test(d.from) ? `, starts ${fmtTime(d.from)}` : ''}` : fmtWhen(d.from)]));
    steps.sort((a, b) => toDate(a[0]) - toDate(b[0]));

    const sources = (c.sources || []).filter(Boolean);
    // Ergebnis bzw. Zwischenstand, von der Redaktion im Editor eingetragen
    const top = (c.result && c.result.top ? c.result.top : []).filter((t) => t.name);
    const result = top.length ? `
      <h2>${past ? 'Result' : 'Current standings'}</h2>
      <ol class="podium podium-full">${top.map((t, i) => `<li class="p${i + 1}"><span class="pos">${i + 1}</span><span class="who">${esc(t.name)}</span>${t.points !== undefined && t.points !== '' ? `<b>${esc(t.points)} pts</b>` : ''}</li>`).join('')}</ol>
      ${c.result.note ? `<p>${esc(c.result.note)}</p>` : ''}
      ${c.result.source ? `<p class="muted-note">${icon('info')}<span>Source: <a href="${esc(c.result.source)}" target="_blank" rel="noopener">${esc(hostOf(c.result.source))}</a></span></p>` : ''}` : '';

    const body = `
      ${result}
      <h2>Schedule</h2>
      <ol class="timeline">${steps.map(([, k, v]) => `<li><b>${esc(k)}</b>${esc(v)}</li>`).join('')}</ol>
      <p class="muted-note">${icon('info')}Times are shown in your local time. No time means the organizer has not published one.</p>
      ${c.format ? `<h2>Format</h2><p>${esc(c.format)}</p>` : ''}
      ${c.prize ? `<h2>Prize pool</h2><p>${esc(c.prize)}</p>` : ''}
      ${c.organizer ? `<h2>Organizer</h2><p>${esc(c.organizer)}</p>` : ''}
      <div class="source-box">
        <b>Sources &amp; last check</b>
        ${sources.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(hostOf(u))}${icon('external')}</a>`).join('') || '<span>No source listed</span>'}
        ${c.checked ? `<span>Last checked: ${esc(fmtDate(c.checked))}</span>` : ''}
      </div>`;

    const aside = `
      <p class="signup is-${past ? 'closed' : s.key}">${esc(past ? 'This tournament is over' : s.text)}</p>
      ${c.signupUrl && !past && s.key !== 'closed'
        ? `<a class="btn btn-primary btn-block" href="${esc(c.signupUrl)}" target="_blank" rel="noopener">Go to sign-up${icon('external')}</a>` : ''}
      ${c.streamUrl ? `<a class="btn btn-twitch btn-block" href="${esc(c.streamUrl)}" target="_blank" rel="noopener">Watch the broadcast${icon('external')}</a>` : ''}
      <p class="editor-note">${icon('info')}Sign-up runs directly through the organizer. Their information always takes priority.</p>
      <a class="climb-link" href="https://www.tftclimb.com/tierlist" target="_blank" rel="noopener">${icon('star')}<span><b>Prepare like the pros</b><small>Current tier list on TFTClimb</small></span></a>`;

    return { tags, info: c.info || '', facts: keyFacts(c), body, aside };
  };

  // Im Browser: feste Inhalte mit dem aktuellen Stand überschreiben
  const id = document.body.dataset.cup;
  if (!id) return;
  const c = window.TFTE.cups.find((x) => x.id === id);
  if (!c) return;
  const p = window.cupPage(c);
  const set = (k, html) => { document.getElementById(k).innerHTML = html; };
  set('cup-tags', p.tags);
  set('cup-facts', p.facts);
  set('cup-body', p.body);
  set('cup-aside-body', p.aside);
})();
