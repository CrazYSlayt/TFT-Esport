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
   * { login: 'twitch_login', name, role, focus: 'kurze Zeile', about: 'Text für „Who is …?“', pro: true (= auch unter Pro Players),
   *   realName (nur wenn öffentlich bekannt), country, region, team, teamSince, worldTitles,
   *   stats: { wins, top8, events } (offizielle Turniere laut tftlobby.gg), prize: { amount, note, source },
   *   career: [{ team, from, to }] (neueste zuerst, ohne to = aktuell),
   *   results: [{ date, place, event, tier, prize }], events: ['turnier-id'],
   *   image: 'assets/img/streamers/<login>.png' (Karikatur, nur mit Einverständnis), links: [{ label, url }], sources: ['https://…'], checked }
   * Nur belegte Angaben, keine Geburtsdaten, keine Zuschauerzahlen ohne Datum.
   */
  creators: [
    {
      "login": "crazyslayt",
      "name": "CrazYSlayt",
      "role": "Streamer & coach",
      "extra": [["star", "Rank", "Challenger", "since Set 15"], ["trophy", "Peak", "1,002 LP"], ["users", "Coach", "since Set 17"], ["link", "Project", "TFTClimb", "founder"]],
      "focus": "TFT Challenger · Founder of TFTClimb",
      "realName": "Claudio",
      "country": "Germany",
      "region": "EMEA",
      "about": "CrazYSlayt (Claudio) from Frankfurt has been a TFT Challenger since Set 15 and a coach since Set 17, with a peak of 1,002 LP. He founded TFTClimb, the home of tier lists, tools and coaching for Teamfight Tactics, together with his partner Kevin10K, and runs TFT E-Sports.",
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
      "realName": "Joseph Goldsmith",
      "country": "United States",
      "role": "Pro player",
      "focus": "Two-time TFT World Champion",
      "region": "AMER",
      "team": "TFT Academy",
      "teamSince": "February 2026",
      "about": "Dishsoap (real name Joseph Goldsmith) is a professional TFT player from the United States and one of only two players to win the World Championship twice: Inkborn Fables in 2024 and Into the Arcane in 2025. Besides competing he co-runs TFT Academy with Frodan and hosts the TFT Study Hall podcast. In Set 18 he led the AMER Pro Points and qualified directly for the Tactician's Crown.",
      "worldTitles": 2,
      "stats": {
        "wins": 2,
        "top8": 11,
        "events": 28
      },
      "prize": {
        "amount": "$376,805",
        "note": "EsportsEarnings lists only $182,032",
        "source": "https://baike.baidu.com/en/item/Dishsoap/4954994"
      },
      "career": [
        {
          "team": "TFT Academy",
          "from": "Feb 2026"
        },
        {
          "team": "100 Thieves",
          "from": "May 2025",
          "to": "Feb 2026"
        },
        {
          "team": "Fnatic",
          "from": "May 2024",
          "to": "May 2025"
        },
        {
          "team": "Disguised",
          "from": "Nov 2023",
          "to": "May 2024"
        }
      ],
      "results": [
        {
          "date": "2026-09-20",
          "place": "2nd",
          "event": "Elderwood Cup (EMEA)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2026-09-06",
          "place": "3rd",
          "event": "Riftbeast Cup (AMER)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2026-05-24",
          "place": "2nd",
          "event": "Dark Star Cup (EMEA)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2026-02-01",
          "place": "3rd",
          "event": "Bilgewater Cup (AMER)",
          "tier": "Pro Circuit",
          "prize": "$1,700"
        },
        {
          "date": "2025-03-16",
          "place": "1st",
          "event": "Into the Arcane Tactician's Crown",
          "tier": "World",
          "prize": "$150,000"
        },
        {
          "date": "2025-03-02",
          "place": "2nd",
          "event": "Americas Golden Spatula",
          "tier": "Regional"
        },
        {
          "date": "2025-02-16",
          "place": "1st",
          "event": "Tactician's Cup 2 (AMER)",
          "tier": "Regional"
        },
        {
          "date": "2024-07-14",
          "place": "1st",
          "event": "Inkborn Fables Tactician's Crown",
          "tier": "World",
          "prize": "$150,000"
        },
        {
          "date": "2024-02-25",
          "place": "1st",
          "event": "Remix Rumble: NA Regional Finals",
          "tier": "Regional",
          "prize": "$10,000"
        }
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
        "https://tftlobby.gg/players/dishsoap",
        "https://www.esportsearnings.com/players/115504-dishsoap-joseph-goldsmith",
        "https://baike.baidu.com/en/item/Dishsoap/4954994",
        "https://riftdaily.com/tft-enchanted-wilds-tacticians-crown/"
      ],
      "checked": "2026-11-06"
    },
    {
      "login": "wasianiverson",
      "name": "wasianiverson",
      "pro": true,
      "realName": "Nicholas Faust",
      "country": "Canada",
      "role": "Pro player",
      "focus": "TFT Pro Circuit champion",
      "region": "AMER",
      "team": "TFT Academy",
      "teamSince": "February 2025",
      "about": "wasianiverson (real name Nicholas Faust) is a professional TFT player and content creator from Canada, playing for Academy, the team of TFT Academy. He finished 3rd at the Cyber City Tactician's Crown in 2025 and has six official tournament wins. By winning the AMER Riftbeast Cup in Set 18 he qualified directly for the Tactician's Crown.",
      "stats": {
        "wins": 6,
        "top8": 11,
        "events": 29
      },
      "prize": {
        "amount": "$62,250",
        "source": "https://www.esportsearnings.com/players/129315-wasianiverson-nicholas-faust"
      },
      "career": [
        {
          "team": "TFT Academy",
          "from": "Feb 2025"
        },
        {
          "team": "Fnatic",
          "from": "May 2024",
          "to": "Feb 2025"
        }
      ],
      "results": [
        {
          "date": "2026-09-06",
          "place": "1st",
          "event": "Riftbeast Cup (AMER)",
          "tier": "Pro Circuit",
          "prize": "$3,000"
        },
        {
          "date": "2026-05-10",
          "place": "2nd",
          "event": "Stargazer Cup (AMER)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2026-02-15",
          "place": "1st",
          "event": "Demacia Cup (AMER)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2026-02-01",
          "place": "1st",
          "event": "Bilgewater Cup (AMER)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2026-01-11",
          "place": "1st",
          "event": "Shurima Cup (AMER)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2025-07-13",
          "place": "3rd",
          "event": "Cyber City Tactician's Crown",
          "tier": "World",
          "prize": "$25,000"
        },
        {
          "date": "2025-05-25",
          "place": "1st",
          "event": "Tactician's Cup 2 (AMER)",
          "tier": "Regional"
        },
        {
          "date": "2025-03-02",
          "place": "1st",
          "event": "Americas Golden Spatula",
          "tier": "Regional"
        },
        {
          "date": "2023-11-05",
          "place": "3rd",
          "event": "Runeterra Reforged Championship",
          "tier": "World",
          "prize": "$25,000"
        }
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
        "https://tftlobby.gg/players/wasianiverson",
        "https://www.esportsearnings.com/players/129315-wasianiverson-nicholas-faust",
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
      "realName": "Michael Zhang",
      "country": "United States",
      "role": "Pro player & streamer",
      "focus": "TFT pro and streamer",
      "region": "AMER",
      "team": "Team Vitality",
      "teamSince": "June 2024",
      "about": "k3soju (real name Michael Zhang) is an American TFT pro and one of the best-known streamers in the game. He has played for Team Vitality since 2024 after years with Cloud9, and organizes the K3Soju Invitational. In 2026 he won two Pro Circuit cups and finished 6th at the Space Gods Tactician's Crown.",
      "stats": {
        "wins": 2,
        "top8": 10,
        "events": 21
      },
      "prize": {
        "amount": "$30,050",
        "source": "https://www.esportsearnings.com/players/72993-k3soju-michael-zhang"
      },
      "career": [
        {
          "team": "Team Vitality",
          "from": "Jun 2024"
        },
        {
          "team": "Disguised",
          "from": "Nov 2023",
          "to": "2024"
        },
        {
          "team": "Cloud9",
          "from": "Aug 2019",
          "to": "Nov 2023"
        }
      ],
      "results": [
        {
          "date": "2026-07-12",
          "place": "6th",
          "event": "Space Gods Tactician's Crown",
          "tier": "World"
        },
        {
          "date": "2026-07-05",
          "place": "3rd",
          "event": "AMER Regional Finals (Space Gods)",
          "tier": "Regional"
        },
        {
          "date": "2026-06-07",
          "place": "1st",
          "event": "Anima Cup (AMER)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2026-05-10",
          "place": "1st",
          "event": "Stargazer Cup (AMER)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2025-09-21",
          "place": "3rd",
          "event": "Soul Fighter Cup (EMEA)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2024-08-11",
          "place": "3rd–4th",
          "event": "Esports World Cup 2024",
          "tier": "Invitational",
          "prize": "$11,250"
        },
        {
          "date": "2022-11-20",
          "place": "23rd",
          "event": "Dragonlands World Championship",
          "tier": "World",
          "prize": "$4,500"
        },
        {
          "date": "2019-09-28",
          "place": "3rd",
          "event": "TwitchCon 2019",
          "tier": "Invitational",
          "prize": "$8,600"
        }
      ],
      "image": "",
      "links": [],
      "sources": [
        "https://tftlobby.gg/players/k3soju",
        "https://www.esportsearnings.com/players/72993-k3soju-michael-zhang",
        "https://liquipedia.net/tft/K3soju",
        "https://en.wikipedia.org/wiki/2022_Streamer_Awards"
      ],
      "checked": "2026-11-06"
    },
    {
      "login": "sologesang",
      "name": "Sologesang",
      "country": "Germany",
      "role": "Streamer & pro player",
      "extra": [["trophy", "Tactician's Crown", "2 appearances", "2024 and 2025"], ["calendar", "Community cup", "TK TFT Cup", "host"]],
      "focus": "Germany's biggest TFT streamer",
      "region": "EMEA",
      "about": "Sologesang is a German TFT streamer and, according to MeinMMO in May 2024, the most-watched TFT channel in Germany by a wide margin. He also competes at the top level and has played at the Tactician's Crown twice. He is the face of the TK TFT Cup, one of the biggest community tournaments in the DACH region.",
      "prize": {
        "amount": "$50,831",
        "source": "https://www.esportsearnings.com/players/6583-sologesang-sang-ngo/results-by-prize"
      },
      "results": [
        {
          "date": "2025-07-13",
          "place": "9th–16th",
          "event": "Cyber City Tactician's Crown",
          "tier": "World",
          "prize": "$11,000"
        },
        {
          "date": "2025-06-29",
          "place": "4th",
          "event": "Cyber City: EMEA Regional Finals",
          "tier": "Regional",
          "prize": "$4,688"
        },
        {
          "date": "2024-07-14",
          "place": "23rd",
          "event": "Inkborn Fables Tactician's Crown",
          "tier": "World",
          "prize": "$4,500"
        },
        {
          "date": "2020-03-13",
          "place": "5th",
          "event": "Galaxies Showcase",
          "tier": "Invitational",
          "prize": "$10,750"
        },
        {
          "date": "2019-10-31",
          "place": "9th–16th",
          "event": "Red Bull Rise of the Elements Invitational",
          "tier": "Invitational",
          "prize": "$7,500"
        }
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
        "https://www.esportsearnings.com/players/6583-sologesang-sang-ngo/results-by-prize",
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
