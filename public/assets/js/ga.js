/* Google Analytics wie bei TFTClimb und TFT Arcade: misst jeden Besuch ab dem Aufruf, nicht erst nach Bestätigung im Cookie-Hinweis (bewusste Entscheidung).
   Wer „Decline“ wählt, wird ab dann nicht mehr erfasst (tfte_ga = 'no', Hinweis und Schalter in app.js). Lokal (localhost, Datei) wird nichts gesendet. */
(function () {
  var id = 'G-BR1YHWMCDR', off = false;
  window.TFTE_GA_ID = id;
  try { off = localStorage.getItem('tfte_ga') === 'no'; } catch (e) { /* kein Speicher */ }
  if (location.protocol === 'file:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  if (off) { window['ga-disable-' + id] = true; return; }
  var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id; document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id);
})();
