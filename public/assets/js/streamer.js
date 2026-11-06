/* Streamer-Profil: Live-Status des Kanals und Twitch-Player, der erst nach dem Klick lädt. Das Profil selbst steht fest im HTML (tools/build-tournaments.js). */
(function () {
  const { fmt, esc, served, loadChannels } = window.UI;
  const $ = (id) => document.getElementById(id);
  const login = document.body.dataset.streamer;

  async function renderStatus() {
    const channels = await loadChannels([login]);
    const ch = channels && channels[login];
    const box = $('streamer-status');
    if (!ch) return;
    box.classList.toggle('is-live', ch.live);
    box.innerHTML = ch.live
      ? `<span class="dot is-live" aria-hidden="true"></span><b>Live now</b> · ${fmt(ch.viewers)} viewers${ch.game ? ` · ${esc(ch.game)}` : ''}`
      : '<span class="dot" aria-hidden="true"></span>Offline right now';
  }

  $('streamer-load').addEventListener('click', () => {
    const host = encodeURIComponent(location.hostname);
    if (!served || !host) { window.open(`https://www.twitch.tv/${login}`, '_blank', 'noopener'); return; }
    $('streamer-player').innerHTML = `<iframe src="https://player.twitch.tv/?channel=${encodeURIComponent(login)}&parent=${host}&autoplay=true" allowfullscreen allow="autoplay; fullscreen" title="Twitch player"></iframe>`;
  });

  renderStatus();
  setInterval(renderStatus, 120000);
})();
