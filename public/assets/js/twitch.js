/* Live Streams: laufende Streams ganz oben, daneben der Zeitplan der Übertragungen, darunter die Streamer-Profile (über /api/streams und /api/channels). */
(function () {
  const D = window.TFTE;
  const { icon, esc, fmt, link, empty, dayMonth, fmtTime, toDate, startOfToday, twitchUrl, creatorCard, creatorSlot, streamCard, loadStreams, loadChannels, STREAM_REASONS } = window.UI;
  const $ = (id) => document.getElementById(id);

  /* ---------- Streamer-Profile: Karten, Live-Punkt kommt nach ---------- */
  const SLOTS = 3;
  $('creators').innerHTML = [...D.creators.map(creatorCard), ...Array.from({ length: Math.max(0, SLOTS - D.creators.length) }, (_, i) => creatorSlot(D.creators.length + i + 1))].join('');
  async function renderCreatorStatus() {
    const channels = await loadChannels(D.creators.map((c) => c.login));
    if (!channels) return;
    document.querySelectorAll('[data-live]').forEach((el) => {
      const ch = channels[el.dataset.live];
      if (!ch) return;
      el.classList.toggle('is-live', ch.live);
      el.lastChild.textContent = ch.live ? `Live · ${fmt(ch.viewers)}` : 'Offline';
    });
  }

  /* ---------- Zeitplan ---------- */
  const casts = D.broadcasts.filter((b) => toDate(b.date) >= startOfToday()).sort((a, b) => toDate(a.date) - toDate(b.date));
  $('broadcasts').innerHTML = casts.length
    ? casts.map((b) => {
      const dm = dayMonth(b.date);
      return `<a class="tt-row" href="${esc(b.url || twitchUrl(b.channel))}" target="_blank" rel="noopener">
        <span class="date-badge"><b>${dm.day}</b><small>${dm.mon}</small></span>
        <span class="tt-main"><strong>${esc(b.title)}</strong><small>${/T/.test(b.date) ? esc(fmtTime(b.date)) : 'Time TBA'} · twitch.tv/${esc(b.channel)}</small></span>
      </a>`;
    }).join('')
    : empty({ ic: 'radio', cls: 'empty-tight', title: 'No broadcasts scheduled yet', text: 'As soon as tournaments are shown live, the date and channel appear here.' });

  /* ---------- Jetzt live: englische Streams zuerst, sonst die größten ---------- */
  async function renderLive() {
    const { data, reason } = await loadStreams();
    const box = $('live-now');
    if (!data) {
      $('live-count').textContent = '';
      box.innerHTML = `<div class="notice"><span>${icon('info')}</span><span><strong>No live data.</strong> ${STREAM_REASONS[reason] || STREAM_REASONS['no-server']}</span></div>`;
      return;
    }
    $('live-count').innerHTML = `<span class="rec-dot"></span><b>${fmt(data.totalStreams)}</b>&nbsp;streams live · <b>${fmt(data.totalViewers)}</b>&nbsp;viewers`;
    const pros = new Set(D.proStreamers.map((p) => p.login.toLowerCase()));
    const en = data.streams.filter((s) => s.lang === 'en');
    const list = (en.length >= 3 ? en : data.streams).slice(0, 6);
    box.className = list.length ? 'stream-grid' : '';
    box.innerHTML = list.length
      ? list.map((s) => streamCard(s, pros.has(s.login.toLowerCase()))).join('')
      : empty({ pose: 'sad', title: 'No TFT stream is live right now', text: 'Have a look at the timetable for the next broadcast.', href: link('twitch/live-streams.html'), cta: 'All live streams' });
  }

  renderLive();
  renderCreatorStatus();
  setInterval(renderLive, 120000);
  setInterval(renderCreatorStatus, 120000);
})();
