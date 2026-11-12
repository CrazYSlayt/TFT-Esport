/* Spielerkarten mit Live-Punkt (Startseite, Live Streams, Pro Players).
   data-only="pro"    → nur Pros (Pro Players, mit Regions-Filter darüber)
   data-only="twitch" → nur Profile mit Twitch-Kanal (Live Streams)
   data-limit="10"    → höchstens so viele Karten (Startseite) */
(function () {
  const D = window.TFTE;
  const { fmt, esc, creatorCard, loadChannels } = window.UI;
  const box = document.getElementById('creators');
  const only = box.dataset.only;
  let list = only === 'pro' ? D.creators.filter((c) => c.pro)
    : only === 'twitch' ? D.creators.filter((c) => !c.noTwitch)
      : D.creators;
  if (box.dataset.limit) list = list.slice(0, Number(box.dataset.limit));

  // Pro Players: Regionen als Filter (gemerkt in der Adresse, z. B. pro-players.html?region=emea)
  const REGIONS = ['AMER', 'EMEA', 'APAC', 'CN'];
  let region = (new URLSearchParams(location.search).get('region') || '').toUpperCase();
  if (!REGIONS.includes(region)) region = '';
  let bar = null;
  if (only === 'pro') {
    bar = document.createElement('div');
    bar.className = 'chips player-filter';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Filter by region');
    box.before(bar);
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('[data-region]');
      if (!b) return;
      region = b.dataset.region;
      const url = new URL(location.href);
      if (region) url.searchParams.set('region', region.toLowerCase()); else url.searchParams.delete('region');
      history.replaceState(null, '', url);
      render();
      renderStatus();
    });
  }

  function render() {
    const shown = region ? list.filter((c) => c.region === region) : list;
    if (bar) {
      const count = (r) => (r ? list.filter((c) => c.region === r).length : list.length);
      bar.innerHTML = ['', ...REGIONS].map((r) => `<button type="button" class="chip" data-region="${r}" aria-pressed="${r === region}">${r || 'All regions'} <span class="chip-count">${count(r)}</span></button>`).join('');
    }
    box.innerHTML = shown.map(creatorCard).join('');
  }

  let channels = null;
  async function renderStatus() {
    if (!channels) channels = await loadChannels(list.filter((c) => !c.noTwitch).map((c) => c.login));
    if (!channels) return;
    document.querySelectorAll('[data-live]').forEach((el) => {
      const ch = channels[el.dataset.live];
      if (!ch) return;
      el.classList.toggle('is-live', ch.live);
      el.querySelector('.dot').classList.toggle('is-live', ch.live);
      el.lastChild.textContent = ch.live ? `Live · ${fmt(ch.viewers)}` : 'Offline';
    });
  }
  render();
  renderStatus();
  setInterval(() => { channels = null; renderStatus(); }, 120000);
})();
