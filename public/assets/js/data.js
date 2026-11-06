/*
 * TFTEsport – Inhalte der Seite.
 * Alle Listen sind bewusst leer: keine erfundenen Artikel, Termine oder Creator.
 * Sobald ein Eintrag ergänzt wird, erscheint er automatisch auf den Übersichten; bis dahin zeigen sie Leerzustände.
 * Datumsangaben immer als ISO-Text in deutscher Zeit, z. B. '2026-11-07T18:00'; angezeigt wird die Ortszeit des Besuchers. Alle Texte auf Englisch.
 */
window.TFTE = {
  site: {
    name: 'TFTEsport',
    url: 'https://www.tft-esports.com',          // eigene Domain (seit 03.11.2026), tft-esports.com leitet auf www weiter
    network: { name: 'TFTClimb', url: 'https://www.tftclimb.com' }
  },

  /* News-Kategorien (Filter auf /news, Chips auf der Startseite) */
  newsCategories: [
    { id: 'offiziell', label: 'Official updates', short: 'Official' },
    { id: 'turniere', label: 'Tournaments & results', short: 'Tournaments' },
    { id: 'szene', label: 'Twitch & scene', short: 'Twitch & scene' },
    { id: 'orientierung', label: 'Guides', short: 'Guides' }
  ],

  /*
   * Artikel. Jede Seite liegt als eigene Datei unter news/<slug>.html (Kopie von news/vorlage.html).
   * { slug: 'tft-…', cat: 'offiziell' | 'turniere' | 'szene' | 'orientierung', title, teaser, date: '2026-…', readMin: 4,
   *   author: 'Name', image: 'assets/img/news/….webp' (optional), top: true (= Titelstory, optional) }
   */
  articles: [],

  /* Turnier-Filter */
  regions: [
    { id: 'global', label: 'Global' },
    { id: 'emea', label: 'EMEA' },
    { id: 'euw', label: 'EUW' },
    { id: 'eune', label: 'EUNE' },
    { id: 'dach', label: 'DACH' }
  ],
  requirements: [
    { id: 'offen', label: 'Open to everyone' },
    { id: 'rang', label: 'Rank requirement' },
    { id: 'quali', label: 'Qualified / invite only' }
  ],
  cupLevels: [
    { id: 'offiziell', label: 'Official event' },
    { id: 'regional', label: 'Regional tournament' },
    { id: 'streamer', label: 'Streamer cup' },
    { id: 'eigener', label: 'Own cup' }
  ],

  /*
   * Turniere – stehen in assets/data/turniere.js und werden mit „Turniere bearbeiten.html“ (Hauptordner) gepflegt.
   * Nur die Redaktion trägt Turniere ein – Besucher können keine erstellen. Eigene Seite pro Turnier: tft-tournaments/<id>.html (tools/build-tournaments.js), page: 'datei.html' = handgeschriebene Seite.
   * { id, name, level: 'offiziell' | 'regional' | 'streamer' | 'eigener', region: 'emea', organizer,
   *   requirement: 'offen' | 'rang' | 'quali', eligibility: 'Wer darf teilnehmen?', rank: 'Rangbeschränkung',
   *   signupStart / signupDeadline: '2026-09-14' oder '2026-09-14T18:00' (deutsche Zeit, leer = keine Anmeldung),
   *   signupUrl, days: [{ from, to, label }] (Spieltage), format, prize, streamUrl, info,
   *   sources: ['https://…'] (Veranstalterquellen), checked: '2026-10-26' (zuletzt geprüft),
   *   result: { top: [{ name, points }] (Platz 1, 2, … – Punkte optional), note: 'kurzer Hinweis', source: 'https://…' } }
   *   „result“ trägt die Redaktion nach dem Turnier ein; leer = Ergebnis noch nicht eingetragen (Live Matches, Turnierseite).
   */
  cups: [],

  /* Set-Termine (Set-Start, PBE, Set-Ende) – stehen in assets/data/set-termine.js und erscheinen als Info im Kalender. */
  setEvents: [],

  /*
   * Streamer-Profile (redaktionell ausgewählt). Jeder Eintrag bekommt eine Seite unter tft-streamers/<login>.html.
   * { login: 'twitch_login', name: 'Anzeigename', focus: 'kurze Zeile', bio: 'Text', image: 'assets/img/streamers/<login>.png' (Karikatur, optional),
   *   links: [{ label, url }] }
   * Nur Streamer eintragen, die mit Profil und Karikatur einverstanden sind.
   */
  creators: [
    {
      login: 'crazyslayt', name: 'CrazYSlayt', focus: 'TFT Challenger · Founder of TFTClimb',
      bio: 'TFT Challenger and founder of TFTClimb, the home of tier lists, tools and coaching for Teamfight Tactics.',
      image: '',
      links: [{ label: 'TFTClimb', url: 'https://www.tftclimb.com' }, { label: 'Coaching', url: 'https://www.tftclimb.com/coaching' }]
    }
  ],

  /*
   * Turnierübertragungen.
   * { title, cup: 'slug' (optional), date: '2026-…T18:00', channel: 'twitch_login', url: 'https://www.twitch.tv/…' }
   */
  broadcasts: [
    { title: "Tactician's Crown – Day 1", cup: 'tacticians-crown-set-18', date: '2026-11-13', channel: 'teamfighttactics' },
    { title: "Tactician's Crown – Day 2", cup: 'tacticians-crown-set-18', date: '2026-11-14', channel: 'teamfighttactics' },
    { title: "Tactician's Crown – Grand Final", cup: 'tacticians-crown-set-18', date: '2026-11-15', channel: 'teamfighttactics' }
  ],

  /* Live Matches und Pro Players: Bereiche bleiben in der Navigation, Inhalte folgen später. */
  liveMatches: [],
  proPlayers: [],

  /* Twitch-Logins, die auf /twitch/live-streams als „Pro“ markiert werden. { login, name, role } */
  proStreamers: []
};
