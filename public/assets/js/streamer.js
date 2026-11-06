/* Streamer-Profil: Live-Block mit Vorschaubild und Status; der Twitch-Player lädt erst nach dem Klick. Das Profil selbst steht fest im HTML (tools/build-tournaments.js). */
(function () {
  const { fmt, esc, served, loadChannels } = window.UI;
  const $ = (id) => document.getElementById(id);
  const login = document.body.dataset.streamer;
  const name = document.querySelector('h1').textContent;
  let playing = false;

  async function renderStatus() {
    const channels = await loadChannels([login]);
    const ch = channels && channels[login];
    if (!ch) return;
    const box = $('streamer-status');
    box.classList.toggle('is-live', ch.live);
    box.innerHTML = ch.live
      ? `<span class="dot is-live" aria-hidden="true"></span>${esc(name)} is live on Twitch · <b>${fmt(ch.viewers)}</b>&nbsp;viewers${ch.game ? ` · ${esc(ch.game)}` : ''}`
      : `<span class="dot" aria-hidden="true"></span>${esc(name)} is offline right now`;
    if (ch.live) $('streamer-title').textContent = ch.title || '';
    if (ch.live && ch.thumb && !playing) {
      const minute = Math.floor(Date.now() / 60000);   // umgeht Twitchs Vorschaubild-Cache einmal pro Minute
      $('streamer-player').innerHTML = `<img src="${esc(ch.thumb)}?t=${minute}" alt="" /><span class="badge-live">Live</span>`;
    }
  }

  $('streamer-load').addEventListener('click', () => {
    const host = encodeURIComponent(location.hostname);
    if (!served || !host) { window.open(`https://www.twitch.tv/${login}`, '_blank', 'noopener'); return; }
    playing = true;
    $('streamer-live').classList.add('is-playing');
    $('streamer-player').innerHTML = `<iframe src="https://player.twitch.tv/?channel=${encodeURIComponent(login)}&parent=${host}&autoplay=true" allowfullscreen allow="autoplay; fullscreen" title="Twitch player"></iframe>`;
  });

  renderStatus();
  setInterval(renderStatus, 120000);
})();
