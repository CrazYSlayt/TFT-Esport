/* Twitch-Übersicht: Creator-Empfehlungen, Turnierübertragungen und englischsprachige Live-Streams (über /api/streams). */
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
        <span class="cup-row-main"><strong>${esc(b.title)}</strong><span class="cup-row-meta"><span>${/T/.test(b.date) ? esc(fmtTime(b.date)) : 'Time TBA'}</span><span>twitch.tv/${esc(b.channel)}</span></span></span>
        <span class="row-go">${icon('external')}</span>
      </a>`;
    }).join('')
    : empty({ ic: 'radio', title: 'No broadcasts scheduled yet', text: 'As soon as tournaments are shown live, the date and channel appear here.' });

  /* ---------- Jetzt live (Englisch) ---------- */
  async function renderLive() {
    const { data, reason } = await loadStreams();
    const box = $('live-now');
    if (!data) {
      box.innerHTML = `<div class="notice"><span>${icon('info')}</span><span><strong>No live data.</strong> ${STREAM_REASONS[reason] || STREAM_REASONS['no-server']}</span></div>`;
      return;
    }
    const pros = new Set(D.proStreamers.map((p) => p.login.toLowerCase()));
    const en = data.streams.filter((s) => s.lang === 'en').slice(0, 4);
    box.className = en.length ? 'stream-grid' : '';
    box.innerHTML = en.length
      ? en.map((s) => streamCard(s, pros.has(s.login.toLowerCase()))).join('')
      : empty({ pose: 'sad', title: 'No English TFT stream is live right now', text: 'Something may be running in other languages.', href: link('twitch/live-streams.html'), cta: 'All live streams' });
  }
  renderLive();
})();
