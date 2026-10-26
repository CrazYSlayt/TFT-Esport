/* Twitch-Übersicht: Creator-Empfehlungen, Turnierübertragungen und deutschsprachige Live-Streams (über /api/streams). */
(function () {
  const D = window.TFTE;
  const { icon, esc, link, empty, dayMonth, fmtTime, toDate, startOfToday, twitchUrl, creatorCard, creatorSlot, streamCard, loadStreams, STREAM_REASONS } = window.UI;
  const $ = (id) => document.getElementById(id);

  /* ---------- Creator ---------- */
  const creators = D.creators.length ? D.creators.map(creatorCard) : [1, 2, 3].map(creatorSlot);
  $('creators').innerHTML = creators.join('');

  /* ---------- Turnierübertragungen ---------- */
  const casts = D.broadcasts.filter((b) => toDate(b.date) >= startOfToday()).sort((a, b) => toDate(a.date) - toDate(b.date));
  $('broadcasts').innerHTML = casts.length
    ? casts.map((b) => {
      const dm = dayMonth(b.date);
      return `<a class="cup-row" href="${esc(b.url || twitchUrl(b.channel))}" target="_blank" rel="noopener">
        <span class="date-block"><b>${dm.day}</b><small>${dm.mon}</small></span>
        <span class="cup-row-main"><strong>${esc(b.title)}</strong><span class="cup-row-meta"><span>${esc(fmtTime(b.date))} Uhr</span><span>twitch.tv/${esc(b.channel)}</span></span></span>
        <span class="row-go">${icon('external')}</span>
      </a>`;
    }).join('')
    : empty({ ic: 'radio', title: 'Noch keine Übertragungen geplant', text: 'Sobald Turniere live gezeigt werden, stehen Termin und Kanal hier.' });

  /* ---------- Jetzt live (Deutsch) ---------- */
  async function renderLive() {
    const { data, reason } = await loadStreams();
    const box = $('live-now');
    if (!data) {
      box.innerHTML = `<div class="notice"><span>${icon('info')}</span><span><strong>Keine Live-Daten.</strong> ${STREAM_REASONS[reason] || STREAM_REASONS['no-server']}</span></div>`;
      return;
    }
    const pros = new Set(D.proStreamers.map((p) => p.login.toLowerCase()));
    const de = data.streams.filter((s) => s.lang === 'de').slice(0, 4);
    box.className = de.length ? 'stream-grid' : '';
    box.innerHTML = de.length
      ? de.map((s) => streamCard(s, pros.has(s.login.toLowerCase()))).join('')
      : empty({ ic: 'radio', title: 'Gerade ist kein deutschsprachiger TFT-Stream live', text: 'In anderen Sprachen läuft vielleicht etwas.', href: link('twitch/live-streams.html'), cta: 'Alle Live-Streams' });
  }
  renderLive();
})();
