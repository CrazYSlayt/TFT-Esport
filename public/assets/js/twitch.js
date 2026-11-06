/* Streamer-Karten mit Live-Punkt (Live Streams und Pro Players). data-only="pro" zeigt nur Pros. */
(function () {
  const D = window.TFTE;
  const { fmt, creatorCard, loadChannels } = window.UI;
  const box = document.getElementById('creators');
  const list = box.dataset.only === 'pro' ? D.creators.filter((c) => c.pro) : D.creators;
  box.innerHTML = list.map(creatorCard).join('');

  async function renderStatus() {
    const channels = await loadChannels(list.map((c) => c.login));
    if (!channels) return;
    document.querySelectorAll('[data-live]').forEach((el) => {
      const ch = channels[el.dataset.live];
      if (!ch) return;
      el.classList.toggle('is-live', ch.live);
      el.querySelector('.dot').classList.toggle('is-live', ch.live);
      el.lastChild.textContent = ch.live ? `Live · ${fmt(ch.viewers)}` : 'Offline';
    });
  }
  renderStatus();
  setInterval(renderStatus, 120000);
})();
