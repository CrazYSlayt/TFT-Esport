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
   *   author: 'Name', image: 'assets/img/news/….webp' (optional), top: true (= Titelstory, optional),
   *   cover: 'trophy' (ohne Foto: grünes Titelbild mit Janna in dieser Pose), coverText: 'Zeile unter dem Schriftzug' }
   * Neue Artikel landen automatisch in der sitemap.xml (tools/build-tournaments.js).
   */
  articles: [
    {
      slug: 'tacticians-crown-2026-preview', cat: 'turniere', date: '2026-11-10', readMin: 4, author: 'TFT E-Sports editors',
      title: "Tactician's Crown 2026: Schedule, Players, Stream",
      teaser: 'From Friday, 40 players fight for the Enchanted Wilds title and $470,000. Everything you need for the World Championship weekend.',
      cover: 'trophy', coverText: 'World Championship · 13–15 Nov', top: true
    },
    {
      slug: 'how-tft-esports-works', cat: 'orientierung', date: '2026-11-10', readMin: 6, author: 'TFT E-Sports editors',
      title: 'How TFT Esports Works: From Ranked to Worlds',
      teaser: 'Tactician\'s Trials, Pro Circuit, Regional Finals and the Tactician\'s Crown – the road to Worlds and how you can take part.',
      cover: 'thinking', coverText: 'Guide · From ranked to Worlds'
    },
    {
      url: 'tft-tacticians-crown.html', cat: 'turniere', date: '2026-11-06', author: 'TFT E-Sports editors',
      title: "Tactician's Crown: World Championship Guide",
      teaser: 'Schedule, format, prize pool, qualified players and the live stream – all in one place.',
      cover: 'crown', coverText: 'Guide · Live stream & schedule'
    }
  ],

  /*
   * „TFT explained“ auf der Startseite: kurze Fragen mit einer Kennzahl, Link auf die Seite mit der Antwort.
   * stat: feste Zahl – oder statFrom: 'topStream' | 'nextSet' | 'upcoming' (wird live berechnet). pose = Janna-Pose.
   */
  explained: [
    { cat: 'Esports', q: 'How does TFT esports work?', text: 'From ranked to Worlds: Trials, Pro Circuit, Regional Finals and the Tactician\'s Crown.', stat: '5 steps', statLabel: 'from ranked to the World Championship', href: 'news/how-tft-esports-works.html', pose: 'thinking' },
    { cat: 'Worlds', q: 'What is the Tactician\'s Crown?', text: 'The TFT World Championship at the end of every set – 40 players, three days.', stat: '$470,000', statLabel: 'prize pool in Set 18', href: 'tft-tacticians-crown.html', pose: 'trophy' },
    { cat: 'Compete', q: 'How do I qualify for Tactician\'s Trials?', text: 'Compete Card, sign-up and the ladder snapshot decide who gets a slot.', stat: '256', statLabel: 'players per Trials event', href: 'news/how-tft-esports-works.html#trials', pose: 'tablet' },
    { cat: 'Watch', q: 'Who is the biggest TFT streamer right now?', text: 'Measured live on Twitch – updated every few minutes.', statFrom: 'topStream', statLabel: 'most viewers right now', href: 'twitch.html', pose: 'caster' },
    { cat: 'Set', q: 'When does the next TFT set start?', text: 'Launch, PBE and the last day of the current set.', statFrom: 'nextSet', statLabel: 'next set launch', href: '#set-title', pose: 'waving' },
    { cat: 'Tournaments', q: 'Which TFT tournaments can I play?', text: 'Pick your country – we only show the cups you can actually enter.', statFrom: 'upcoming', statLabel: 'upcoming tournaments for you', href: 'tft-tournaments.html', pose: 'fan' }
  ],
  explainedLinks: [
    { q: 'What is a Compete Card?', href: 'news/how-tft-esports-works.html#compete-card' },
    { q: 'How do Tactician\'s Trials work?', href: 'news/how-tft-esports-works.html#trials' },
    { q: 'What is the TFT Pro Circuit?', href: 'news/how-tft-esports-works.html#pro-circuit' },
    { q: 'How do the Regional Finals work?', href: 'news/how-tft-esports-works.html#regional-finals' },
    { q: 'How does the checkmate final work?', href: 'tft-tacticians-crown.html#faq' },
    { q: 'Where can I watch TFT esports?', href: 'tft-tacticians-crown.html#watch' }
  ],

  /* Turnier-Filter
     Offizielle Turniere (Trials, Regionals) gehören zu einer der Riot-Regionen, kleinere Cups zusätzlich zu Ländern (cup.countries).
     „Wo spielst du?“ im Kalender: ein Land zeigt die weltweiten Turniere, die offiziellen seiner Region und die Cups für dieses Land. */
  regions: [
    { id: 'global', label: 'Global' },
    { id: 'amer', label: 'Americas' },
    { id: 'emea', label: 'EMEA' },
    { id: 'apac', label: 'APAC' },
    { id: 'cn', label: 'China' }
  ],
  countries: [
    { id: 'de', label: 'Germany', region: 'emea' },
    { id: 'at', label: 'Austria', region: 'emea' },
    { id: 'ch', label: 'Switzerland', region: 'emea' },
    { id: 'pl', label: 'Poland', region: 'emea' },
    { id: 'it', label: 'Italy', region: 'emea' },
    { id: 'fr', label: 'France', region: 'emea' },
    { id: 'es', label: 'Spain', region: 'emea' },
    { id: 'pt', label: 'Portugal', region: 'emea' },
    { id: 'gb', label: 'United Kingdom', region: 'emea' },
    { id: 'ie', label: 'Ireland', region: 'emea' },
    { id: 'nl', label: 'Netherlands', region: 'emea' },
    { id: 'be', label: 'Belgium', region: 'emea' },
    { id: 'dk', label: 'Denmark', region: 'emea' },
    { id: 'se', label: 'Sweden', region: 'emea' },
    { id: 'no', label: 'Norway', region: 'emea' },
    { id: 'fi', label: 'Finland', region: 'emea' },
    { id: 'cz', label: 'Czechia', region: 'emea' },
    { id: 'sk', label: 'Slovakia', region: 'emea' },
    { id: 'hu', label: 'Hungary', region: 'emea' },
    { id: 'ro', label: 'Romania', region: 'emea' },
    { id: 'gr', label: 'Greece', region: 'emea' },
    { id: 'tr', label: 'Türkiye', region: 'emea' },
    { id: 'ua', label: 'Ukraine', region: 'emea' },
    { id: 'us', label: 'United States', region: 'amer' },
    { id: 'ca', label: 'Canada', region: 'amer' },
    { id: 'br', label: 'Brazil', region: 'amer' },
    { id: 'mx', label: 'Mexico', region: 'amer' },
    { id: 'ar', label: 'Argentina', region: 'amer' },
    { id: 'cl', label: 'Chile', region: 'amer' },
    { id: 'kr', label: 'South Korea', region: 'apac' },
    { id: 'jp', label: 'Japan', region: 'apac' },
    { id: 'vn', label: 'Vietnam', region: 'apac' },
    { id: 'tw', label: 'Taiwan', region: 'apac' },
    { id: 'th', label: 'Thailand', region: 'apac' },
    { id: 'ph', label: 'Philippines', region: 'apac' },
    { id: 'sg', label: 'Singapore', region: 'apac' },
    { id: 'au', label: 'Australia', region: 'apac' },
    { id: 'nz', label: 'New Zealand', region: 'apac' }
  ],
  // Ländergruppen mit eigenem Namen (für die Anzeige, z. B. „DACH“ statt drei Ländern)
  countryGroups: [
    { label: 'DACH', countries: ['de', 'at', 'ch'] },
    { label: 'Nordics', countries: ['dk', 'se', 'no', 'fi'] },
    { label: 'Benelux', countries: ['be', 'nl'] }
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
   * { id, name, level: 'offiziell' | 'regional' | 'streamer' | 'eigener', region: 'global' | 'amer' | 'emea' | 'apac' | 'cn',
   *   countries: ['de', 'at', 'ch'] (nur Cups für bestimmte Länder; leer = ganze Region), organizer,
   *   requirement: 'offen' | 'rang' | 'quali', eligibility: 'Wer darf teilnehmen?', rank: 'Rangbeschränkung',
   *   signupStart / signupDeadline: '2026-09-14' oder '2026-09-14T18:00' (deutsche Zeit, leer = keine Anmeldung),
   *   signupUrl, days: [{ from, to, label }] (Spieltage), format, prize, streamUrl, info,
   *   sources: ['https://…'] (Veranstalterquellen), checked: '2026-10-26' (zuletzt geprüft),
   *   result: { top: [{ name, points }] (Platz 1, 2, … – Punkte optional), note: 'kurzer Hinweis', source: 'https://…' } }
   *   page: 'datei.html' (eigene Seite, z. B. Weltmeisterschaft, steht dann groß oben auf der Startseite),
   *   startReported: '2026-11-13T11:00:00Z' (gemeldete Startzeit in UTC für den Countdown, optional)
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
   *   image: 'assets/img/streamers/<login>.png' (Karikatur, nur mit Einverständnis), links: [{ label, url }], sources: ['https://…'], checked,
   *   noTwitch: true (Profi ohne belegten Twitch-Kanal – login ist dann nur der Seitenname, kein Live-Block),
   *   riotId: { id: 'Name#TAG', server: 'euw1', source } (nur mit Quelle – ergibt den MetaTFT-Link) }
   * Nur belegte Angaben, keine Zuschauerzahlen ohne Datum. born: '2001-06-26' oder nur '2006' (nur mit Quelle in sources) – angezeigt wird das Alter bzw. das Geburtsjahr.
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
      "born": "2001-06-26",
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
        "https://liquipedia.net/tft/Dishsoap",
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
      "born": "1996-11-16",
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
    },
    {
      "login": "zyk0o",
      "noTwitch": true,
      "realName": "Zakariya Olabi",
      "name": "ZyK0o",
      "pro": true,
      "country": "France",
      "role": "Pro player",
      "focus": "Riftbeast Cup champion, 2021 Worlds runner-up",
      "region": "EMEA",
      "about": "ZyK0o is a French TFT player who competes in EMEA under the MIH tag. He finished 2nd at the Fates World Championship in April 2021 and has since played at the Runeterra Reforged Championship (2023) and the Space Gods Tactician's Crown (2026). In Set 18 he won the EMEA Riftbeast Cup, the first TFT Pro Circuit stop, and qualified directly for the Tactician's Crown.",
      "prize": {
        "amount": "$44,292",
        "note": "Esports Earnings, without Pro Circuit 2025–26",
        "source": "https://www.esportsearnings.com/players/91635-zyk0o-"
      },
      "results": [
        { "date": "2026-11-01", "place": "12th", "event": "EMEA Regional Finals (Enchanted Wilds)", "tier": "Regional" },
        { "date": "2026-09-20", "place": "6th", "event": "Elderwood Cup (EMEA)", "tier": "Pro Circuit" },
        { "date": "2026-09-06", "place": "1st", "event": "Riftbeast Cup (EMEA)", "tier": "Pro Circuit" },
        { "date": "2026-07-12", "place": "38th", "event": "Space Gods Tactician's Crown", "tier": "World" },
        { "date": "2025-09-21", "place": "4th", "event": "Soul Fighter Cup (EMEA)", "tier": "Pro Circuit" },
        { "date": "2023-11-05", "place": "28th", "event": "Runeterra Reforged Championship", "tier": "World", "prize": "$3,500" },
        { "date": "2023-10-22", "place": "2nd", "event": "Runeterra Reforged EMEA Finals", "tier": "Regional", "prize": "$10,572" },
        { "date": "2021-04-09", "place": "2nd", "event": "Fates World Championship", "tier": "World", "prize": "$26,000" },
        { "date": "2021-03-14", "place": "5th", "event": "Fates EMEA Regional Finals", "tier": "Regional", "prize": "$1,789" }
      ],
      "events": ["tacticians-crown-set-18"],
      "image": "",
      "links": [
        { "label": "tftlobby.gg", "url": "https://tftlobby.gg/players/zyk0o" }
      ],
      "sources": [
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://riftdaily.com/tft-enchanted-wilds-tacticians-crown/",
        "https://tftlobby.gg/players/zyk0o",
        "https://www.esportsearnings.com/players/91635-zyk0o-",
        "https://www.invenglobal.com/articles/13757/8ljaywalking-named-teamfight-tactics-fates-world-champion",
        "https://liquipedia.net/tft/ZyK0o"
      ],
      "checked": "2026-11-11"
    },
    {
      "login": "bensac",
      "noTwitch": true,
      "realName": "Alexandre Mokhefi",
      "name": "Bensac",
      "pro": true,
      "country": "France",
      "role": "Pro player",
      "focus": "EMEA Pro Points leader, Worlds 5th in 2026",
      "region": "EMEA",
      "about": "Bensac is a French TFT player who competes in EMEA under the MIH tag. He played the Cyber City Tactician's Crown in 2025 and finished 5th at the Space Gods Tactician's Crown in 2026. In Set 18 he reached the Grand Final of the EMEA Regional Finals and, as the region's Pro Points leader, qualified directly for the Tactician's Crown.",
      "stats": { "wins": 0, "top8": 3, "events": 7 },
      "prize": {
        "amount": "$7,590",
        "note": "Esports Earnings, without 2026 results",
        "source": "https://www.esportsearnings.com/players/144307-bensac-"
      },
      "results": [
        { "date": "2026-11-01", "place": "Top 3", "event": "EMEA Regional Finals (Enchanted Wilds)", "tier": "Regional" },
        { "date": "2026-10-04", "place": "3rd", "event": "Blossom Cup (EMEA)", "tier": "Pro Circuit" },
        { "date": "2026-07-12", "place": "5th", "event": "Space Gods Tactician's Crown", "tier": "World" },
        { "date": "2025-07-13", "place": "21st", "event": "Cyber City Tactician's Crown", "tier": "World", "prize": "$5,500" },
        { "date": "2024-03-11", "place": "9th–16th", "event": "Magic n' Mayhem EMEA Regional Finals", "tier": "Regional", "prize": "$598" }
      ],
      "events": ["tacticians-crown-set-18"],
      "image": "",
      "links": [
        { "label": "tftlobby.gg", "url": "https://tftlobby.gg/players/bensac" }
      ],
      "sources": [
        "https://tftlobby.gg/players/bensac",
        "https://tftlobby.gg/t/emea-regional-finals-enchanted-wilds/grand-finals",
        "https://www.esportsearnings.com/players/144307-bensac-",
        "https://riftdaily.com/tft-enchanted-wilds-tacticians-crown/",
        "https://teamfighttactics.leagueoflegends.com/en-au/news/esports/5-questions-with-aur-huanmie-the-space-gods-champion",
        "https://liquipedia.net/tft/Bensac"
      ],
      "checked": "2026-11-11"
    },
    {
      "login": "chunington",
      "name": "Chunington",
      "pro": true,
      "realName": "Austin Chun",
      "born": "2004-01-17",
      "country": "United States",
      "role": "Pro player",
      "focus": "Elderwood Cup champion (AMER)",
      "region": "AMER",
      "team": "Final Lobby Gaming",
      "teamSince": "May 2026",
      "about": "Chunington (real name Austin Chun) is a TFT player from the United States who competes in AMER for Final Lobby Gaming. He won the AMER Elderwood Cup in Set 18 and qualified directly for the Tactician's Crown. Earlier in the set he finished 4th at the Riftbeast Cup and 5th at the Blossom Cup.",
      "stats": { "wins": 1, "top8": 7, "events": 22 },
      "prize": {
        "amount": "$31,166",
        "note": "according to Liquipedia",
        "source": "https://liquipedia.net/tft/Chunington"
      },
      "career": [
        { "team": "Final Lobby Gaming", "from": "May 2026" },
        { "team": "Isurus (loan)", "from": "Apr 2026", "to": "May 2026" },
        { "team": "Final Lobby Gaming", "from": "Mar 2026", "to": "Apr 2026" }
      ],
      "results": [
        { "date": "2026-11-01", "place": "13th", "event": "AMER Regional Finals (Enchanted Wilds)", "tier": "Regional", "prize": "$600" },
        { "date": "2026-10-04", "place": "5th", "event": "Blossom Cup (AMER)", "tier": "Pro Circuit", "prize": "$1,300" },
        { "date": "2026-09-20", "place": "1st", "event": "Elderwood Cup (AMER)", "tier": "Pro Circuit", "prize": "$3,000" },
        { "date": "2026-09-06", "place": "4th", "event": "Riftbeast Cup (AMER)", "tier": "Pro Circuit", "prize": "$1,500" },
        { "date": "2026-02-15", "place": "7th", "event": "Demacia Cup (AMER)", "tier": "Pro Circuit", "prize": "$1,100" },
        { "date": "2026-02-01", "place": "2nd", "event": "Bilgewater Cup (AMER)", "tier": "Pro Circuit", "prize": "$2,000" }
      ],
      "events": ["tacticians-crown-set-18"],
      "image": "",
      "links": [
        { "label": "X", "url": "https://x.com/Chunington_tft" },
        { "label": "tftlobby.gg", "url": "https://tftlobby.gg/players/chunington" }
      ],
      "sources": [
        "https://liquipedia.net/tft/Chunington",
        "https://tftlobby.gg/players/chunington",
        "https://riftdaily.com/tft-enchanted-wilds-tacticians-crown/"
      ],
      "checked": "2026-11-11"
    },
    {
      "login": "wigwugg",
      "noTwitch": true,
      "born": "2006",
      "name": "wigwugg",
      "pro": true,
      "country": "Canada",
      "role": "Pro player",
      "focus": "Elderwood Cup champion (EMEA side)",
      "region": "AMER",
      "team": "Final Lobby Gaming",
      "teamSince": "July 2026",
      "about": "wigwugg is a Canadian TFT player who competes in AMER and has played for Final Lobby Gaming since July 2026. In Set 18 he won the EMEA side of the cross-region Elderwood Cup. That win qualified him directly for the Tactician's Crown, where he takes one of the AMER slots.",
      "stats": { "wins": 1, "top8": 4, "events": 17 },
      "career": [
        { "team": "Final Lobby Gaming", "from": "Jul 2026" }
      ],
      "results": [
        { "date": "2026-11-01", "place": "46th", "event": "AMER Regional Finals (Enchanted Wilds)", "tier": "Regional" },
        { "date": "2026-10-04", "place": "23rd", "event": "Blossom Cup (AMER)", "tier": "Pro Circuit" },
        { "date": "2026-09-20", "place": "1st", "event": "Elderwood Cup (EMEA)", "tier": "Pro Circuit", "prize": "$3,000" },
        { "date": "2026-05-24", "place": "5th", "event": "Dark Star Cup (AMER)", "tier": "Pro Circuit" },
        { "date": "2026-05-10", "place": "8th", "event": "Stargazer Cup (AMER)", "tier": "Pro Circuit" },
        { "date": "2026-01-18", "place": "2nd", "event": "Tactician's Cup 1 (AMER)", "tier": "Regional" }
      ],
      "events": ["tacticians-crown-set-18"],
      "image": "",
      "links": [
        { "label": "X", "url": "https://x.com/wigwugg" },
        { "label": "tftlobby.gg", "url": "https://tftlobby.gg/players/wigwugg" }
      ],
      "sources": [
        "https://tftlobby.gg/players/wigwugg",
        "https://riftdaily.com/tft-enchanted-wilds-tacticians-crown/",
        "https://liquipedia.net/tft/Wigwugg",
        "https://finallobbygaming.com/"
      ],
      "checked": "2026-11-11"
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
