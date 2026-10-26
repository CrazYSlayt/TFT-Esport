/*
 * TFTEsport – Inhalte der Seite.
 * Alle Listen sind bewusst leer: keine erfundenen Artikel, Termine oder Creator.
 * Sobald ein Eintrag ergänzt wird, erscheint er automatisch auf den Übersichten; bis dahin zeigen sie Leerzustände.
 * Datumsangaben immer als ISO-Text in Ortszeit, z. B. '2026-11-07T18:00'.
 */
window.TFTE = {
  site: {
    name: 'TFTEsport',
    url: 'https://www.tftesport.com',          // Platzhalter-Domain aus dem Designkonzept, vor dem Launch bestätigen
    network: { name: 'TFTClimb', url: 'https://www.tftclimb.com' }
  },

  /* News-Kategorien (Filter auf /news, Chips auf der Startseite) */
  newsCategories: [
    { id: 'offiziell', label: 'Offizielle Meldungen', short: 'Offiziell' },
    { id: 'turniere', label: 'Turniere & Ergebnisse', short: 'Turniere' },
    { id: 'szene', label: 'Twitch & Szene', short: 'Twitch & Szene' },
    { id: 'orientierung', label: 'Orientierung', short: 'Orientierung' }
  ],

  /*
   * Artikel. Jede Seite liegt als eigene Datei unter news/<slug>.html (Kopie von news/vorlage.html).
   * { slug: 'tft-…', cat: 'offiziell' | 'turniere' | 'szene' | 'orientierung', title, teaser, date: '2026-…', readMin: 4,
   *   author: 'Name', image: 'assets/img/news/….webp' (optional), top: true (= Titelstory, optional) }
   */
  articles: [],

  /* Turnier-Filter */
  regions: [
    { id: 'global', label: 'Weltweit' },
    { id: 'emea', label: 'EMEA' },
    { id: 'euw', label: 'EUW' },
    { id: 'eune', label: 'EUNE' },
    { id: 'dach', label: 'DACH' }
  ],
  requirements: [
    { id: 'offen', label: 'Offen für alle' },
    { id: 'rang', label: 'Mit Rang-Voraussetzung' },
    { id: 'quali', label: 'Nur Qualifizierte / Einladung' }
  ],
  cupLevels: [
    { id: 'offiziell', label: 'Offizieller Wettbewerb' },
    { id: 'regional', label: 'Regionales Turnier' },
    { id: 'streamer', label: 'Streamer-Cup' },
    { id: 'eigener', label: 'Eigener Cup' }
  ],

  /*
   * Turniere – stehen in assets/data/turniere.js und werden mit „Turniere bearbeiten.html“ (Hauptordner) gepflegt.
   * Nur die Redaktion trägt Turniere ein – Besucher können keine erstellen. Detailseite: cups/turnier.html?id=<id>.
   * { id, name, level: 'offiziell' | 'regional' | 'streamer' | 'eigener', region: 'emea', organizer,
   *   requirement: 'offen' | 'rang' | 'quali', eligibility: 'Wer darf teilnehmen?', rank: 'Rangbeschränkung',
   *   signupStart / signupDeadline: '2026-09-14' oder '2026-09-14T18:00' (deutsche Zeit, leer = keine Anmeldung),
   *   signupUrl, days: [{ from, to, label }] (Spieltage), format, prize, streamUrl, info,
   *   sources: ['https://…'] (Veranstalterquellen), checked: '2026-10-26' (zuletzt geprüft) }
   */
  cups: [],

  /*
   * Twitch-Creator-Empfehlungen (redaktionell ausgewählt).
   * { login: 'twitch_login', name: 'Anzeigename', focus: 'Ranked & Analyse', lang: 'de', featured: true }
   */
  creators: [],

  /*
   * Turnierübertragungen.
   * { title, cup: 'slug' (optional), date: '2026-…T18:00', channel: 'twitch_login', url: 'https://www.twitch.tv/…' }
   */
  broadcasts: [],

  /* Live Matches und Pro Players: Bereiche bleiben in der Navigation, Inhalte folgen später. */
  liveMatches: [],
  proPlayers: [],

  /* Twitch-Logins, die auf /twitch/live-streams als „Pro“ markiert werden. { login, name, role } */
  proStreamers: []
};
