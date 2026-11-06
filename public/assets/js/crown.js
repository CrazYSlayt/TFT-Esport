/* Tactician's Crown: Countdown, Startzeiten in Ortszeit, Twitch-Player (lädt erst auf Klick) und laufende Co-Streams.
   Die Startzeit 11:00 UTC stammt aus Drittquellen, Riot nennt noch keine Uhrzeit – auf der Seite steht das dazu.
   Nach dem Turnier erscheint das im Editor eingetragene Ergebnis oben. */
(function () {
  const D = window.TFTE;
  const { icon, esc, served, cupPast, cupDays, endOf, toDate, startOfToday, loadStreams, streamCard, fmt, STREAM_REASONS } = window.UI;
  const $ = (id) => document.getElementById(id);

  const CHANNEL = 'teamfighttactics';
  const START = new Date('2026-11-13T11:00:00Z');
  const cup = D.cups.find((c) => c.id === 'tacticians-crown-set-18');
  const lastDay = endOf(cupDays(cup).slice(-1)[0].to);

  /* ---------- Countdown ---------- */
  function renderCountdown() {
    const box = $('crown-countdown');
    const now = new Date();
    if (cupPast(cup)) { box.innerHTML = '<p class="cd-state">The Tactician\'s Crown has finished.</p>'; return; }
    if (now >= toDate('2026-11-13') && now <= lastDay) {
      const day = Math.round((startOfToday() - toDate('2026-11-13')) / 864e5) + 1;
      box.innerHTML = `<p class="cd-state"><span class="rec-dot" aria-hidden="true"></span>Day ${day} of 3 – watch below</p>`;
      return;
    }
    const left = Math.max(0, START - now);
    const part = (v, l) => `<span class="cd-part"><b>${String(v).padStart(2, '0')}</b><small>${l}</small></span>`;
    box.innerHTML = part(Math.floor(left / 864e5), 'days') + part(Math.floor(left / 36e5) % 24, 'hours') + part(Math.floor(left / 6e4) % 60, 'minutes');
  }

  /* ---------- Startzeiten in der Ortszeit des Besuchers ---------- */
  function renderLocalTimes() {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    document.querySelectorAll('[data-utc]').forEach((el) => {
      el.textContent = new Date(el.dataset.utc).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    });
    $('crown-zone').textContent = zone ? zone.replace(/_/g, ' ') : 'your local time';
  }

  /* ---------- Twitch-Player: Twitch lädt erst nach dem Klick ---------- */
  $('crown-load').addEventListener('click', () => {
    const host = encodeURIComponent(location.hostname);
    if (!served || !host) { window.open(`https://www.twitch.tv/${CHANNEL}`, '_blank', 'noopener'); return; }
    $('crown-player').innerHTML = `<iframe src="https://player.twitch.tv/?channel=${CHANNEL}&parent=${host}&autoplay=true" allowfullscreen allow="autoplay; fullscreen" title="Official Teamfight Tactics broadcast on Twitch"></iframe>`;
  });

  /* ---------- Offizieller Kanal und Co-Streams ---------- */
  const isCrownStream = (s) => s.login.toLowerCase() !== CHANNEL && /crown|world championship/i.test(s.title || '');
  async function renderStreams() {
    const { data, reason } = await loadStreams();
    const status = $('crown-status');
    const box = $('crown-costreams');
    if (!data) {
      status.textContent = 'Official broadcast on Twitch';
      box.className = '';
      box.innerHTML = `<div class="notice"><span>${icon('info')}</span><span>${STREAM_REASONS[reason] || STREAM_REASONS['no-server']} Co-streamers are announced by <a href="https://x.com/CompeteTFT" target="_blank" rel="noopener">@CompeteTFT</a>.</span></div>`;
      return;
    }
    const official = data.streams.find((s) => s.login.toLowerCase() === CHANNEL);
    status.innerHTML = official
      ? `<span class="rec-dot" aria-hidden="true"></span>Live now · ${fmt(official.viewers)} viewers`
      : 'The official channel is offline right now';
    const co = data.streams.filter(isCrownStream).slice(0, 8);
    box.className = co.length ? 'stream-grid' : '';
    box.innerHTML = co.length
      ? co.map((s) => streamCard(s)).join('')
      : `<div class="notice"><span>${icon('info')}</span><span>No co-stream with the Crown in its title is live right now. During the event they appear here automatically. Co-streamers are announced by <a href="https://x.com/CompeteTFT" target="_blank" rel="noopener">@CompeteTFT</a>.</span></div>`;
  }

  /* ---------- Ergebnis, sobald eingetragen ---------- */
  function renderResult() {
    const top = (cup.result && cup.result.top ? cup.result.top : []).filter((t) => t.name);
    if (!top.length) return;
    $('crown-result').hidden = false;
    $('crown-result-list').innerHTML = top.map((t, i) => `<li class="p${i + 1}"><span class="pos">${i + 1}</span><span class="who">${esc(t.name)}</span>${t.points !== undefined && t.points !== '' ? `<b>${esc(t.points)} pts</b>` : ''}</li>`).join('');
  }

  renderCountdown();
  renderLocalTimes();
  renderResult();
  renderStreams();
  setInterval(renderCountdown, 30000);
  setInterval(renderStreams, 120000);
})();
