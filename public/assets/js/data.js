/*
 * TFT E-Sports – Inhalte der Seite.
 * Alle Listen sind bewusst leer: keine erfundenen Artikel, Termine oder Creator.
 * Sobald ein Eintrag ergänzt wird, erscheint er automatisch auf den Übersichten; bis dahin zeigen sie Leerzustände.
 * Datumsangaben immer als ISO-Text in deutscher Zeit, z. B. '2026-11-07T18:00'; angezeigt wird die Ortszeit des Besuchers. Alle Texte auf Englisch.
 */
window.TFTE = {
  site: {
    name: 'TFT E-Sports',
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
   * { login: 'twitch_login', name, focus: 'kurze Zeile', bio, pro: true (= auch unter Pro Players), region, team, lang,
   *   highlights: ['belegter Erfolg'], events: ['turnier-id'], image: 'assets/img/streamers/<login>.png' (Karikatur, nur mit Einverständnis),
   *   links: [{ label, url }], sources: ['https://…'], checked: '2026-11-06' }
   * Nur belegte Angaben, keine Klarnamen, Geburtsdaten oder Zuschauerzahlen ohne Datum.
   */
  creators: [
    {
      "login": "crazyslayt",
      "name": "CrazYSlayt",
      "focus": "TFT Challenger · Founder of TFTClimb",
      "bio": "TFT Challenger and founder of TFTClimb, the home of tier lists, tools and coaching for Teamfight Tactics.",
      "image": "",
      "links": [
        {
          "label": "TFTClimb",
          "url": "https://www.tftclimb.com"
        },
        {
          "label": "Coaching",
          "url": "https://www.tftclimb.com/coaching"
        }
      ]
    },
    {
      "login": "dishsoap",
      "name": "Dishsoap",
      "pro": true,
      "focus": "Two-time TFT World Champion",
      "region": "AMER",
      "team": "TFT Academy",
      "lang": "English",
      "bio": "One of only two players to win the TFT World Championship twice. Dishsoap also co-runs TFT Academy with Frodan and hosts the TFT Study Hall podcast.",
      "highlights": [
        "World Champion: Inkborn Fables Tactician's Crown (Set 11, 2024, $150,000)",
        "World Champion: Into the Arcane Tactician's Crown (Set 13)",
        "Set 18: AMER Pro Points leader, direct slot at the Tactician's Crown",
        "Co-founder of TFT Academy, host of the TFT Study Hall podcast"
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "image": "",
      "links": [
        {
          "label": "YouTube",
          "url": "https://www.youtube.com/@dishsoaptft"
        },
        {
          "label": "X",
          "url": "https://x.com/dishsoaptft"
        },
        {
          "label": "TFT Academy",
          "url": "https://tftacademy.com/about/dishsoap"
        }
      ],
      "sources": [
        "https://tftacademy.com/about/dishsoap",
        "https://www.esportsearnings.com/players/115504-dishsoap-joseph-goldsmith",
        "https://riftdaily.com/tft-enchanted-wilds-tacticians-crown/"
      ],
      "checked": "2026-11-06"
    },
    {
      "login": "wasianiverson",
      "name": "wasianiverson",
      "pro": true,
      "focus": "TFT Pro Circuit champion",
      "region": "AMER",
      "team": "TFT Academy",
      "lang": "English",
      "bio": "Canadian TFT pro and content creator who plays for Academy, the team of TFT Academy. He won the AMER Riftbeast Cup in Set 18 and qualified directly for the Tactician's Crown.",
      "highlights": [
        "Set 18: winner of the AMER Riftbeast Cup (Sep 2026), direct slot at the Tactician's Crown",
        "Winner of the Demacia Cup and Bilgewater Cup (2026)",
        "Winner of a Tactician's Cup and the Americas Golden Spatula (2025)"
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "image": "",
      "links": [
        {
          "label": "X",
          "url": "https://x.com/wasianiverson"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Wasianiverson",
        "https://liquipedia.net/tft/Enchanted_Wilds/TFT_Pro_Circuit/AMER/Riftbeast_Cup",
        "https://riftdaily.com/tft-enchanted-wilds-tacticians-crown/"
      ],
      "checked": "2026-11-06"
    },
    {
      "login": "k3soju",
      "name": "k3soju",
      "pro": true,
      "focus": "TFT pro and streamer",
      "region": "AMER",
      "team": "Team Vitality",
      "lang": "English",
      "bio": "American TFT pro and one of the best-known streamers in the game. k3soju has played for Team Vitality since 2024 and organizes the K3Soju Invitational.",
      "highlights": [
        "3rd–4th at the Esports World Cup 2024",
        "3rd at TwitchCon 2019",
        "Competed at the Dragonlands World Championship (2022)",
        "Nominated for Best Strategy Game Streamer at the 2022 Streamer Awards"
      ],
      "image": "",
      "links": [],
      "sources": [
        "https://liquipedia.net/tft/K3soju",
        "https://www.esportsearnings.com/players/72993-k3soju-michael-zhang",
        "https://en.wikipedia.org/wiki/2022_Streamer_Awards"
      ],
      "checked": "2026-11-06"
    },
    {
      "login": "sologesang",
      "name": "Sologesang",
      "focus": "Germany's biggest TFT streamer",
      "region": "EMEA",
      "lang": "German",
      "bio": "German TFT streamer and the country's most-watched TFT channel by a wide margin, according to MeinMMO. He is also the face of the TK TFT Cup, one of the biggest community tournaments in the DACH region.",
      "highlights": [
        "Host of the TK TFT Cup (Season II with a €5,000 prize pool)",
        "Most-watched TFT streamer in Germany and 6th worldwide (MeinMMO, May 2024)",
        "Best tournament result: 4th at Mortdog Madness Reckoning (2021)"
      ],
      "events": [
        "tk-tft-cup-season-2-2026"
      ],
      "image": "",
      "links": [
        {
          "label": "X",
          "url": "https://x.com/sologesangtv"
        },
        {
          "label": "YouTube",
          "url": "https://www.youtube.com/channel/UCC7u7Ri5zj7WFAPVaQBpqEg"
        }
      ],
      "sources": [
        "https://mein-mmo.de/en/he-is-the-biggest-twitch-streamer-in-his-category-but-hardly-anyone-knows-him-this-is-sologesang,1129562/",
        "https://earlygame.com/de/news/tk-tft-cup/der-tk-tft-cup-feat.-sologesang-geht-an-den-start-ablauf-preispool-mehr"
      ],
      "checked": "2026-11-06"
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

  /* Twitch-Logins, die auf /twitch als „Pro“ markiert werden. { login, name, role } */
  proStreamers: []
};
