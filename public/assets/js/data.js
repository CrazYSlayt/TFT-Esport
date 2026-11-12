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
   *   startReported: '2026-11-13T12:00:00Z' (gemeldete Startzeit in UTC für den Countdown, optional)
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
      "age": 34,
      "ageChecked": "2026-11-12",
      "country": "Germany",
      "region": "EMEA",
      "about": "CrazYSlayt (Claudio) is a German TFT player and streamer from Frankfurt who streams in German. He has been a TFT Challenger since Set 15 and a coach since Set 17, with a peak of 1,002 LP. He founded TFTClimb, the home of tier lists, tools and coaching for Teamfight Tactics, together with his partner Kevin10K, and runs TFT E-Sports.",
      "image": "assets/img/streamers/crazyslayt.png",
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
        { "date": "2026-11-01", "place": "3rd", "event": "EMEA Regional Finals (Enchanted Wilds)", "tier": "Regional", "prize": "€5,000" },
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
        "https://liquipedia.net/tft/Bensac",
        "https://liquipedia.net/tft/Enchanted_Wilds/EMEA/Regional_Finals"
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
    },
    {
      "login": "cambulee",
      "name": "Cambulee",
      "pro": true,
      "country": "United States",
      "role": "Pro player",
      "focus": "Blossom Cup champion (AMER)",
      "region": "AMER",
      "team": "Final Lobby Gaming",
      "teamSince": "July 2026",
      "about": "Cambulee is an American Teamfight Tactics player who plays for Final Lobby Gaming. Cambulee qualified for the Enchanted Wilds Tactician's Crown by winning the Blossom Cup, an AMER TFT Pro Circuit event, in October 2026. Cambulee previously finished 8th at the Cyber City Tactician's Crown and 2nd at the Lore & Legends AMER Regional Finals.",
      "stats": {
        "wins": 1,
        "top8": 8,
        "events": 26
      },
      "prize": {
        "amount": "$70,090",
        "note": "according to Liquipedia",
        "source": "https://liquipedia.net/tft/Cambulee"
      },
      "career": [
        {
          "team": "Final Lobby Gaming",
          "from": "Jul 2026"
        },
        {
          "team": "Isurus",
          "from": "Apr 2026",
          "to": "May 2026"
        }
      ],
      "results": [
        {
          "date": "2026-11-01",
          "place": "2nd",
          "event": "Enchanted Wilds AMER Regional Finals",
          "tier": "Regional"
        },
        {
          "date": "2026-10-04",
          "place": "1st",
          "event": "Blossom Cup (AMER)",
          "tier": "Pro Circuit",
          "prize": "$3,000"
        },
        {
          "date": "2026-06-07",
          "place": "4th",
          "event": "Anima Cup (AMER)",
          "tier": "Pro Circuit",
          "prize": "$1,500"
        },
        {
          "date": "2026-03-15",
          "place": "2nd",
          "event": "Lore & Legends AMER Regional Finals",
          "tier": "Regional",
          "prize": "$6,500"
        },
        {
          "date": "2025-11-02",
          "place": "4th",
          "event": "K.O. Coliseum AMER Regional Finals",
          "tier": "Regional",
          "prize": "$4,500"
        },
        {
          "date": "2025-08-31",
          "place": "2nd",
          "event": "Battle Academia Cup (AMER)",
          "tier": "Pro Circuit",
          "prize": "$2,000"
        },
        {
          "date": "2025-07-13",
          "place": "8th",
          "event": "Cyber City Tactician's Crown",
          "tier": "World",
          "prize": "$12,000"
        },
        {
          "date": "2025-06-29",
          "place": "2nd",
          "event": "Cyber City Americas Golden Spatula",
          "tier": "Regional",
          "prize": "$6,500"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "X",
          "url": "https://x.com/cambuleetft"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Cambulee"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/cambulee"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Cambulee",
        "https://tftlobby.gg/players/cambulee",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://liquipedia.net/tft/Enchanted_Wilds/AMER/Regional_Finals"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "brosephtft",
      "name": "Broseph",
      "pro": true,
      "country": "Canada",
      "role": "Pro player",
      "focus": "AMER Regional Finals winner",
      "region": "AMER",
      "about": "Broseph is a Canadian Teamfight Tactics player. Broseph qualified for the Enchanted Wilds Tactician's Crown through the AMER Regional Finals, which Broseph won in November 2026. Broseph earlier placed 3rd at the Lore & Legends AMER Regional Finals and played the Lore & Legends Tactician's Crown.",
      "stats": {
        "wins": 1,
        "top8": 3,
        "events": 15
      },
      "prize": {
        "amount": "$38,744",
        "note": "according to Liquipedia",
        "source": "https://liquipedia.net/tft/Broseph"
      },
      "career": [
        {
          "team": "GodLike Esports",
          "from": "May 2026"
        }
      ],
      "results": [
        {
          "date": "2026-11-01",
          "place": "1st",
          "event": "Enchanted Wilds AMER Regional Finals",
          "tier": "Regional",
          "prize": "$14,000"
        },
        {
          "date": "2026-09-19",
          "place": "11th",
          "event": "Elderwood Cup (AMER)",
          "tier": "Pro Circuit",
          "prize": "$800"
        },
        {
          "date": "2026-05-24",
          "place": "3rd",
          "event": "Dark Star Cup (EMEA)",
          "tier": "Pro Circuit",
          "prize": "$1,700"
        },
        {
          "date": "2026-03-28",
          "place": "26th",
          "event": "Lore & Legends Tactician's Crown",
          "tier": "World",
          "prize": "$4,500"
        },
        {
          "date": "2026-03-15",
          "place": "3rd",
          "event": "Lore & Legends AMER Regional Finals",
          "tier": "Regional",
          "prize": "$5,500"
        },
        {
          "date": "2025-05-25",
          "place": "2nd",
          "event": "Cyber City Americas Tactician's Cup #2",
          "tier": "Regional",
          "prize": "$1,700"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "X",
          "url": "https://x.com/brosephtft"
        },
        {
          "label": "YouTube",
          "url": "https://www.youtube.com/@brosephtft"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Broseph"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/broseph"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Broseph",
        "https://tftlobby.gg/players/broseph",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://liquipedia.net/tft/Enchanted_Wilds/AMER/Regional_Finals"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "bopster",
      "noTwitch": true,
      "name": "bopster",
      "pro": true,
      "country": "United States",
      "role": "Pro player",
      "focus": "Regional Finals qualifier (AMER)",
      "region": "AMER",
      "about": "bopster (listed on Liquipedia as BOPSTER) is an American Teamfight Tactics player. bopster qualified for the Enchanted Wilds Tactician's Crown as one of the top five of the AMER Regional Finals. bopster won the Cyber City Americas Golden Spatula in 2025 and the Magic n' Mayhem Americas Tactician's Cup #3 in 2024.",
      "stats": {
        "wins": 2,
        "top8": 6,
        "events": 25
      },
      "prize": {
        "amount": "$37,855",
        "note": "according to Liquipedia",
        "source": "https://liquipedia.net/tft/BOPSTER"
      },
      "results": [
        {
          "date": "2026-11-01",
          "place": "3rd",
          "event": "Enchanted Wilds AMER Regional Finals",
          "tier": "Regional"
        },
        {
          "date": "2026-09-27",
          "place": "7th",
          "event": "Tactician's Trials 1 (AMER)",
          "tier": "Regional"
        },
        {
          "date": "2025-08-31",
          "place": "8th",
          "event": "Battle Academia Cup (AMER)",
          "tier": "Pro Circuit",
          "prize": "$1,000"
        },
        {
          "date": "2025-07-12",
          "place": "29th",
          "event": "Cyber City Tactician's Crown",
          "tier": "World",
          "prize": "$3,500"
        },
        {
          "date": "2025-06-29",
          "place": "1st",
          "event": "Cyber City Americas Golden Spatula",
          "tier": "Regional",
          "prize": "$14,000"
        },
        {
          "date": "2024-11-08",
          "place": "36th",
          "event": "Magic n' Mayhem Tactician's Crown",
          "tier": "World",
          "prize": "$2,000"
        },
        {
          "date": "2024-10-20",
          "place": "1st",
          "event": "Magic n' Mayhem Americas Tactician's Cup #3",
          "tier": "Regional",
          "prize": "$3,000"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "X",
          "url": "https://x.com/bopstertft"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/BOPSTER"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/bopster"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/BOPSTER",
        "https://tftlobby.gg/players/bopster",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://liquipedia.net/tft/Enchanted_Wilds/AMER/Regional_Finals"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "upsetmax_",
      "name": "Upsetmax",
      "pro": true,
      "realName": "Max Chen",
      "country": "Canada",
      "role": "Pro player",
      "focus": "Regional Finals qualifier (AMER)",
      "region": "AMER",
      "team": "Final Lobby Gaming",
      "teamSince": "July 2026",
      "about": "Max \"Upsetmax\" Chen is a Canadian Teamfight Tactics player who plays for Final Lobby Gaming; Liquipedia also lists earlier coaching roles with TG. Upsetmax qualified for the Enchanted Wilds Tactician's Crown as one of the top five of the AMER Regional Finals. Upsetmax finished 2nd at the Blossom Cup (AMER) in October 2026 and 12th at the Space Gods Tactician's Crown.",
      "stats": {
        "wins": 0,
        "top8": 3,
        "events": 14
      },
      "prize": {
        "amount": "$25,407",
        "note": "according to Liquipedia",
        "source": "https://liquipedia.net/tft/Upsetmax"
      },
      "career": [
        {
          "team": "Final Lobby Gaming",
          "from": "Jul 2026"
        }
      ],
      "results": [
        {
          "date": "2026-11-01",
          "place": "4th",
          "event": "Enchanted Wilds AMER Regional Finals",
          "tier": "Regional"
        },
        {
          "date": "2026-10-04",
          "place": "2nd",
          "event": "Blossom Cup (AMER)",
          "tier": "Pro Circuit",
          "prize": "$2,000"
        },
        {
          "date": "2026-09-19",
          "place": "15th",
          "event": "Elderwood Cup (AMER)",
          "tier": "Pro Circuit",
          "prize": "$700"
        },
        {
          "date": "2026-09-05",
          "place": "18th",
          "event": "Riftbeast Cup (AMER)",
          "tier": "Pro Circuit",
          "prize": "$600"
        },
        {
          "date": "2026-07-11",
          "place": "12th",
          "event": "Space Gods Tactician's Crown",
          "tier": "World",
          "prize": "$10,000"
        },
        {
          "date": "2026-07-05",
          "place": "4th",
          "event": "Space Gods AMER Regional Finals",
          "tier": "Regional",
          "prize": "$4,500"
        },
        {
          "date": "2025-04-27",
          "place": "8th",
          "event": "Cyber City Americas Tactician's Cup #1",
          "tier": "Regional",
          "prize": "$400"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "X",
          "url": "https://x.com/Upsetmax_"
        },
        {
          "label": "YouTube",
          "url": "https://www.youtube.com/@UpsetmaxTFT"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Upsetmax"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/upsetmax"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Upsetmax",
        "https://tftlobby.gg/players/upsetmax",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://liquipedia.net/tft/Enchanted_Wilds/AMER/Regional_Finals"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "ego_illusions",
      "name": "ego",
      "pro": true,
      "realName": "Heitor Henrique Lemos",
      "born": "1994-05-14",
      "country": "Brazil",
      "role": "Pro player",
      "focus": "Regional Finals qualifier (AMER)",
      "region": "AMER",
      "about": "ego (Liquipedia ID: ego illusions) is a Brazilian Teamfight Tactics player who competes as TFTLAB ego. ego qualified for the Enchanted Wilds Tactician's Crown as one of the top five of the AMER Regional Finals. ego previously played the Magic n' Mayhem Tactician's Crown in 2024.",
      "stats": {
        "wins": 0,
        "top8": 3,
        "events": 21
      },
      "results": [
        {
          "date": "2026-09-27",
          "place": "31st",
          "event": "Tactician's Trials 1 (AMER)",
          "tier": "Regional"
        },
        {
          "date": "2026-03-15",
          "place": "26th",
          "event": "Lore & Legends AMER Regional Finals",
          "tier": "Regional"
        },
        {
          "date": "2026-01-18",
          "place": "5th",
          "event": "Lore & Legends Americas Tactician's Cup #1",
          "tier": "Regional"
        },
        {
          "date": "2025-03-02",
          "place": "13th",
          "event": "Into the Arcane Americas Golden Spatula",
          "tier": "Regional"
        },
        {
          "date": "2025-01-19",
          "place": "6th",
          "event": "Into the Arcane Americas Tactician's Cup #1",
          "tier": "Regional"
        },
        {
          "date": "2024-11-10",
          "place": "33rd",
          "event": "Magic n' Mayhem Tactician's Crown",
          "tier": "World"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "X",
          "url": "https://x.com/ego_illusions"
        },
        {
          "label": "Instagram",
          "url": "https://www.instagram.com/ego_illusions"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Ego_illusions"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/ego"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Ego_illusions",
        "https://tftlobby.gg/players/ego",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://liquipedia.net/tft/Enchanted_Wilds/AMER/Regional_Finals"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "josuedeleted",
      "name": "Deleted",
      "pro": true,
      "realName": "Josué Daniel Delgado Valle",
      "country": "Peru",
      "role": "Pro player",
      "focus": "Regional Finals qualifier (AMER)",
      "region": "AMER",
      "about": "Deleted (Liquipedia ID: JosueDeleted) is a Peruvian Teamfight Tactics player who competes as MJS Deleted. Deleted qualified for the Enchanted Wilds Tactician's Crown as one of the top five of the AMER Regional Finals. Earlier in the Enchanted Wilds season Deleted reached the finals of the Riftbeast Cup (AMER).",
      "results": [
        {
          "date": "2026-09-06",
          "place": "6th",
          "event": "Riftbeast Cup (AMER)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2026-05-24",
          "place": "6th",
          "event": "Dark Star Cup (EMEA)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2026-03-15",
          "place": "24th",
          "event": "Lore & Legends AMER Regional Finals",
          "tier": "Regional"
        },
        {
          "date": "2025-11-02",
          "place": "26th",
          "event": "K.O. Coliseum AMER Regional Finals",
          "tier": "Regional"
        },
        {
          "date": "2025-09-14",
          "place": "5th",
          "event": "K.O. Coliseum Americas Tactician's Cup #1",
          "tier": "Regional"
        },
        {
          "date": "2025-06-22",
          "place": "12th",
          "event": "Cyber City Americas Tactician's Cup #3",
          "tier": "Regional"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "X",
          "url": "https://x.com/JosueDeleted"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/JosueDeleted"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/deleted"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/JosueDeleted",
        "https://tftlobby.gg/players/deleted",
        "https://tftlobby.gg/players/josuedeleted",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://liquipedia.net/tft/Enchanted_Wilds/AMER/Regional_Finals"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "seoill",
      "noTwitch": true,
      "name": "seoill",
      "pro": true,
      "realName": "Park Chan-seo",
      "country": "South Korea",
      "role": "Pro player",
      "focus": "Riftbeast Cup champion (APAC)",
      "region": "APAC",
      "about": "seoill is a South Korean Teamfight Tactics player. seoill qualified for the Enchanted Wilds Tactician's Crown by winning the Riftbeast Cup on the APAC Pro Circuit in September 2026 and later also won the Enchanted Wilds APAC Regional Finals. At the K.O. Coliseum Tactician's Crown in November 2025, seoill finished 6th.",
      "prize": {
        "amount": "$50,150",
        "note": "according to Liquipedia",
        "source": "https://liquipedia.net/tft/Seoill"
      },
      "results": [
        {
          "date": "2026-11-01",
          "place": "1st",
          "event": "Enchanted Wilds APAC Regional Finals",
          "tier": "Regional",
          "prize": "$14,000"
        },
        {
          "date": "2026-09-20",
          "place": "5th",
          "event": "Elderwood Cup (APAC)",
          "tier": "Pro Circuit",
          "prize": "$1,300"
        },
        {
          "date": "2026-09-06",
          "place": "1st",
          "event": "Riftbeast Cup (APAC)",
          "tier": "Pro Circuit",
          "prize": "$3,000"
        },
        {
          "date": "2026-07-12",
          "place": "37th",
          "event": "Space Gods Tactician's Crown",
          "tier": "World"
        },
        {
          "date": "2026-07-05",
          "place": "8th",
          "event": "Space Gods APAC Regional Finals",
          "tier": "Regional",
          "prize": "$1,300"
        },
        {
          "date": "2026-06-07",
          "place": "3rd",
          "event": "Anima Cup (APAC)",
          "tier": "Pro Circuit",
          "prize": "$1,700"
        },
        {
          "date": "2026-05-10",
          "place": "1st",
          "event": "Stargazer Cup (APAC)",
          "tier": "Pro Circuit",
          "prize": "$3,000"
        },
        {
          "date": "2025-11-16",
          "place": "6th",
          "event": "K.O. Coliseum Tactician's Crown",
          "tier": "World",
          "prize": "$15,000"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "CHZZK",
          "url": "https://chzzk.naver.com/3694562f50e0f44ab161be354c702ccd"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Seoill"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/seoill"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Seoill",
        "https://tftlobby.gg/players/seoill",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "withoutyou1030",
      "name": "WithoutYou",
      "pro": true,
      "country": "Taiwan",
      "role": "Pro player",
      "focus": "Elderwood Cup champion (APAC)",
      "region": "APAC",
      "worldTitles": 1,
      "about": "WithoutYou (Liquipedia ID: CantWithoutYou) is a Taiwanese Teamfight Tactics player who won the K.O. Coliseum Tactician's Crown in November 2025 and its $150,000 first prize. The qualification for the Enchanted Wilds Tactician's Crown came by winning the Elderwood Cup on the APAC Pro Circuit in September 2026. From April to June 2026, WithoutYou played for ROC Esports.",
      "prize": {
        "amount": "$171,949",
        "note": "according to Liquipedia",
        "source": "https://liquipedia.net/tft/CantWithoutYou"
      },
      "career": [
        {
          "team": "ROC Esports",
          "from": "Apr 2026",
          "to": "Jun 2026"
        },
        {
          "team": "Al Qadsiah Esports",
          "from": "Feb 2025",
          "to": "May 2025"
        }
      ],
      "results": [
        {
          "date": "2026-10-04",
          "place": "5th",
          "event": "Blossom Cup (APAC)",
          "tier": "Pro Circuit",
          "prize": "$1,300"
        },
        {
          "date": "2026-09-20",
          "place": "1st",
          "event": "Elderwood Cup (APAC)",
          "tier": "Pro Circuit",
          "prize": "$3,000"
        },
        {
          "date": "2026-06-06",
          "place": "13th",
          "event": "Anima Cup (APAC)",
          "tier": "Pro Circuit",
          "prize": "$700"
        },
        {
          "date": "2026-05-09",
          "place": "14th",
          "event": "Stargazer Cup (APAC)",
          "tier": "Pro Circuit",
          "prize": "$700"
        },
        {
          "date": "2025-11-16",
          "place": "1st",
          "event": "K.O. Coliseum Tactician's Crown",
          "tier": "World",
          "prize": "$150,000"
        },
        {
          "date": "2025-11-02",
          "place": "4th",
          "event": "K.O. Coliseum APAC Regional Finals",
          "tier": "Regional",
          "prize": "$4,500"
        },
        {
          "date": "2024-04-28",
          "place": "4th",
          "event": "Inkborn Fables APAC Tactician's Cup #1",
          "tier": "Regional",
          "prize": "$800"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/CantWithoutYou"
        },
        {
          "label": "Riot: WithoutYou wins the Tactician's Crown",
          "url": "https://teamfighttactics.leagueoflegends.com/en-au/news/esports/withoutyou-wins-the-tacticians-crown/"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/CantWithoutYou",
        "https://teamfighttactics.leagueoflegends.com/en-au/news/esports/withoutyou-wins-the-tacticians-crown/",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "steppytft",
      "name": "steppy",
      "pro": true,
      "country": "Singapore",
      "role": "Pro player",
      "focus": "Blossom Cup champion (APAC)",
      "region": "APAC",
      "about": "steppy is a Singaporean Teamfight Tactics player who won the Inkborn Fables APAC Golden Spatula in 2024 and the Space Gods APAC Regional Finals in July 2026. steppy qualified for the Enchanted Wilds Tactician's Crown by winning the Blossom Cup on the APAC Pro Circuit in October 2026, after finishing 16th, 22nd and 39th at three earlier Tactician's Crowns.",
      "prize": {
        "amount": "$62,800",
        "note": "according to Liquipedia",
        "source": "https://liquipedia.net/tft/Steppy"
      },
      "results": [
        {
          "date": "2026-10-04",
          "place": "1st",
          "event": "Blossom Cup (APAC)",
          "tier": "Pro Circuit",
          "prize": "$3,000"
        },
        {
          "date": "2026-07-12",
          "place": "39th",
          "event": "Space Gods Tactician's Crown",
          "tier": "World"
        },
        {
          "date": "2026-07-05",
          "place": "1st",
          "event": "Space Gods APAC Regional Finals",
          "tier": "Regional",
          "prize": "$14,000"
        },
        {
          "date": "2026-01-11",
          "place": "2nd",
          "event": "Shurima Cup (APAC)",
          "tier": "Pro Circuit",
          "prize": "$2,000"
        },
        {
          "date": "2025-07-12",
          "place": "22nd",
          "event": "Cyber City Tactician's Crown",
          "tier": "World",
          "prize": "$5,500"
        },
        {
          "date": "2025-06-29",
          "place": "4th",
          "event": "Cyber City APAC Golden Spatula",
          "tier": "Regional",
          "prize": "$4,500"
        },
        {
          "date": "2024-07-13",
          "place": "16th",
          "event": "Inkborn Fables Tactician's Crown",
          "tier": "World",
          "prize": "$7,000"
        },
        {
          "date": "2024-07-07",
          "place": "1st",
          "event": "Inkborn Fables APAC Golden Spatula",
          "tier": "Regional",
          "prize": "$14,000"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Steppy"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/steppy"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Steppy",
        "https://tftlobby.gg/players/steppy",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "ironbogg",
      "name": "Iron Bog",
      "pro": true,
      "realName": "Cheung Tsz Hin",
      "born": "1998-09-19",
      "country": "Hong Kong",
      "role": "Pro player",
      "focus": "Pro Points leader (APAC)",
      "region": "APAC",
      "team": "Flash Wolves",
      "about": "Iron Bog is a Teamfight Tactics player from Hong Kong who plays for Flash Wolves. According to Liquipedia, Iron Bog won the APAC Regional Finals in Set 12 Magic n' Mayhem and then played that set's Tactician's Crown. Iron Bog qualified for the Enchanted Wilds Tactician's Crown as the APAC leader in Pro Points.",
      "results": [
        {
          "date": "2026-07-12",
          "place": "34th",
          "event": "Space Gods Tactician's Crown",
          "tier": "World"
        },
        {
          "date": "2026-03-29",
          "place": "34th",
          "event": "Lore & Legends Tactician's Crown",
          "tier": "World"
        },
        {
          "date": "2024-11-10",
          "place": "25th",
          "event": "Magic n' Mayhem Tactician's Crown",
          "tier": "World",
          "prize": "$4,500"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Instagram",
          "url": "https://www.instagram.com/ironbogg"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Iron_Bog"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/iron-bog"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Iron_Bog",
        "https://tftlobby.gg/players/iron-bog",
        "https://www.esportsearnings.com/players/150917-iron-bog-",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "jazlatte",
      "name": "JazLatte",
      "pro": true,
      "born": "1995-04-10",
      "country": "Taiwan",
      "role": "Pro player",
      "focus": "Regional Finals top 7 (APAC)",
      "region": "APAC",
      "about": "JazLatte is a Taiwanese Teamfight Tactics player who competes under the ROC tag. JazLatte qualified for the Enchanted Wilds Tactician's Crown with a top-7 finish at the APAC Regional Finals and has played two earlier Tactician's Crowns, finishing 24th at Inkborn Fables in 2024 and 35th at Lore & Legends in March 2026.",
      "results": [
        {
          "date": "2026-03-29",
          "place": "35th",
          "event": "Lore & Legends Tactician's Crown",
          "tier": "World"
        },
        {
          "date": "2024-07-14",
          "place": "24th",
          "event": "Inkborn Fables Tactician's Crown",
          "tier": "World",
          "prize": "$4,500"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Instagram",
          "url": "https://www.instagram.com/lattetft"
        },
        {
          "label": "YouTube",
          "url": "https://www.youtube.com/@user-ub2df5zu1c"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/JazLatte"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/jazlatte"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/JazLatte",
        "https://liquipedia.net/tft/CantWithoutYou",
        "https://tftlobby.gg/players/jazlatte",
        "https://www.esportsearnings.com/players/129318-jazlatte-/results-by-prize",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "aq1h99",
      "name": "AQ1H",
      "pro": true,
      "country": "Hong Kong",
      "role": "Pro player",
      "focus": "Regional Finals top 7 (APAC)",
      "region": "APAC",
      "about": "AQ1H is a Teamfight Tactics player from Hong Kong who competes under the FW tag. AQ1H finished 2nd at the Cyber City Tactician's Crown in July 2025 and 12th at the Lore & Legends Tactician's Crown in March 2026, and qualified for the Enchanted Wilds Tactician's Crown with a top-7 finish at the APAC Regional Finals.",
      "stats": {
        "wins": 0,
        "top8": 1,
        "events": 3
      },
      "results": [
        {
          "date": "2026-07-12",
          "place": "35th",
          "event": "Space Gods Tactician's Crown",
          "tier": "World"
        },
        {
          "date": "2026-03-29",
          "place": "12th",
          "event": "Lore & Legends Tactician's Crown",
          "tier": "World"
        },
        {
          "date": "2025-07-13",
          "place": "2nd",
          "event": "Cyber City Tactician's Crown",
          "tier": "World"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Instagram",
          "url": "https://www.instagram.com/hu_qi_eddy"
        },
        {
          "label": "Threads",
          "url": "https://www.threads.net/@hu_qi_eddy"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/AlphaQi"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/aq1h"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/AlphaQi",
        "https://liquipedia.net/tft/Iron_Bog",
        "https://tftlobby.gg/players/aq1h",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "milo",
      "noTwitch": true,
      "name": "Milo",
      "pro": true,
      "realName": "Lê Đức Hải",
      "born": "2003-08-21",
      "country": "Vietnam",
      "role": "Pro player",
      "focus": "Regional Finals qualifier (APAC)",
      "region": "APAC",
      "about": "Milo is a Vietnamese TFT player who finished 4th at the Enchanted Wilds APAC Regional Finals, a top-7 finish that qualified Milo for the Enchanted Wilds Tactician's Crown. Milo previously played the Into the Arcane, Lore & Legends and Space Gods Tactician's Crowns and placed 3rd at both the Lore & Legends and Space Gods APAC Regional Finals. Milo also finished 2nd at the Esports World Cup 2025.",
      "results": [
        {
          "date": "2026-11-01",
          "place": "4th",
          "event": "Enchanted Wilds: APAC Regional Finals",
          "tier": "Regional",
          "prize": "$4,500"
        },
        {
          "date": "2026-10-04",
          "place": "7th",
          "event": "Blossom Cup (APAC)",
          "tier": "Pro Circuit",
          "prize": "$1,100"
        },
        {
          "date": "2026-07-11",
          "place": "23rd",
          "event": "Space Gods Tactician's Crown",
          "tier": "World",
          "prize": "$5,000"
        },
        {
          "date": "2026-07-05",
          "place": "3rd",
          "event": "Space Gods: APAC Regional Finals",
          "tier": "Regional",
          "prize": "$5,500"
        },
        {
          "date": "2026-03-28",
          "place": "20th",
          "event": "Lore & Legends Tactician's Crown",
          "tier": "World",
          "prize": "$6,000"
        },
        {
          "date": "2026-03-15",
          "place": "3rd",
          "event": "Lore & Legends: APAC Regional Finals",
          "tier": "Regional",
          "prize": "$5,500"
        },
        {
          "date": "2025-03-15",
          "place": "22nd",
          "event": "Into the Arcane Tactician's Crown",
          "tier": "World",
          "prize": "$5,500"
        },
        {
          "date": "2025-03-02",
          "place": "4th",
          "event": "Into the Arcane: APAC Golden Spatula",
          "tier": "Regional",
          "prize": "$4,500"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "YouTube",
          "url": "https://www.youtube.com/@MiloTFT"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Miloo"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/milo"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Miloo",
        "https://liquipedia.net/tft/Miloo/Results",
        "https://tftlobby.gg/players/milo",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "pigpig",
      "noTwitch": true,
      "name": "pigpig",
      "pro": true,
      "country": "Taiwan",
      "role": "Pro player",
      "focus": "Regional Finals qualifier (APAC)",
      "region": "APAC",
      "about": "pigpig is a TFT player from Taiwan who qualified for the Enchanted Wilds Tactician's Crown with a top-7 finish at the Enchanted Wilds APAC Regional Finals.",
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Pigpig"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Pigpig",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "title_tft",
      "name": "title",
      "pro": true,
      "born": "2002-11-09",
      "country": "Japan",
      "role": "Pro player",
      "focus": "Two-time world champion (APAC)",
      "region": "APAC",
      "team": "ZETA DIVISION",
      "worldTitles": 2,
      "about": "title is a Japanese TFT player and, according to Liquipedia, the first two-time TFT World Champion: title won the Runeterra Reforged Championship in November 2023 and the Magic n' Mayhem Tactician's Crown in November 2024. title also finished 2nd at the Dragonlands World Championship in 2022. title qualified for the Enchanted Wilds Tactician's Crown with a top-7 finish at the Enchanted Wilds APAC Regional Finals.",
      "results": [
        {
          "date": "2026-07-12",
          "place": "10th",
          "event": "Space Gods Tactician's Crown",
          "tier": "World"
        },
        {
          "date": "2024-11-10",
          "place": "1st",
          "event": "Magic n' Mayhem Tactician's Crown",
          "tier": "World",
          "prize": "$150,000"
        },
        {
          "date": "2024-07-14",
          "place": "17th",
          "event": "Inkborn Fables Tactician's Crown",
          "tier": "World",
          "prize": "$6,000"
        },
        {
          "date": "2023-11-05",
          "place": "1st",
          "event": "Runeterra Reforged Championship",
          "tier": "World",
          "prize": "$150,000"
        },
        {
          "date": "2022-11-20",
          "place": "2nd",
          "event": "Dragonlands World Championship",
          "tier": "World",
          "prize": "$75,000"
        },
        {
          "date": "2022-05-01",
          "place": "27th",
          "event": "Gizmos & Gadgets World Championship",
          "tier": "World",
          "prize": "$3,500"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "X",
          "url": "https://x.com/loltitle"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Title"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/title"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Title",
        "https://tftlobby.gg/players/title",
        "https://www.esportsearnings.com/players/107460-title-",
        "https://dtcl.vnggames.com/en-us/news/esports/title-is-the-runeterra-reforged-champion",
        "https://www.gamemeca.com/en/view.php?gid=1782791",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "maris",
      "noTwitch": true,
      "name": "Maris",
      "pro": true,
      "realName": "Nguyễn Dương Anh",
      "born": "2003-07-28",
      "country": "Vietnam",
      "role": "Pro player",
      "focus": "Regional Finals qualifier (APAC)",
      "region": "APAC",
      "about": "Maris is a Vietnamese TFT player who has also competed as HnZ Maris and VP Maris. Maris previously played the Magic n' Mayhem Tactician's Crown (22nd) in 2024 and the Space Gods Tactician's Crown (27th) in 2026, and qualified for the Enchanted Wilds Tactician's Crown with a top-7 finish at the Enchanted Wilds APAC Regional Finals.",
      "results": [
        {
          "date": "2026-07-12",
          "place": "27th",
          "event": "Space Gods Tactician's Crown",
          "tier": "World"
        },
        {
          "date": "2024-11-10",
          "place": "22nd",
          "event": "Magic n' Mayhem Tactician's Crown",
          "tier": "World"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "YouTube",
          "url": "https://www.youtube.com/@marisnguyen2601"
        },
        {
          "label": "Facebook",
          "url": "https://www.facebook.com/maris.nguyen.anh"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Maris"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/maris"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Maris",
        "https://tftlobby.gg/players/maris",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "iceemperoz",
      "noTwitch": true,
      "name": "iCeEmperoz",
      "pro": true,
      "realName": "Trần Văn Minh",
      "born": "2005-11-09",
      "country": "Vietnam",
      "role": "Pro player",
      "focus": "Regional Finals qualifier (APAC)",
      "region": "APAC",
      "about": "iCeEmperoz is a Vietnamese TFT player who qualified for the Enchanted Wilds Tactician's Crown with a top-7 finish at the Enchanted Wilds APAC Regional Finals.",
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "YouTube",
          "url": "https://www.youtube.com/@iceemperoz"
        },
        {
          "label": "Facebook",
          "url": "https://www.facebook.com/iCeEmperoz"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/ICeEmperoz"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/ICeEmperoz",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "hanxing",
      "noTwitch": true,
      "name": "Hanxing",
      "pro": true,
      "realName": "Huang Yefeng",
      "country": "China",
      "role": "Pro player",
      "focus": "Elderwood Cup champion (CN)",
      "region": "CN",
      "about": "Hanxing (寒星) is a Chinese Teamfight Tactics player who competes under the YSG tag. Hanxing qualified for the Enchanted Wilds Tactician's Crown by winning the CN Elderwood Cup of the TFT Pro Circuit in September 2026. Previous Tactician's Crown appearances include a 9th place at Lore & Legends and 5th place at the Runeterra Reforged Championship.",
      "prize": {
        "amount": "$180,428",
        "note": "according to Liquipedia",
        "source": "https://liquipedia.net/tft/HanXing"
      },
      "career": [
        {
          "team": "Weibo Gaming",
          "from": "Jun 2024",
          "to": "Aug 2024"
        }
      ],
      "results": [
        {
          "date": "2026-09-20",
          "place": "1st",
          "event": "TFT Pro Circuit Elderwood Cup (CN)",
          "tier": "Pro Circuit",
          "prize": "$3,000"
        },
        {
          "date": "2026-05-17",
          "place": "3rd",
          "event": "Space Gods TFT Pro Circuit – CN JOC",
          "tier": "Pro Circuit",
          "prize": "$4,405"
        },
        {
          "date": "2026-03-28",
          "place": "9th",
          "event": "Lore & Legends Tactician's Crown",
          "tier": "World",
          "prize": "$11,000"
        },
        {
          "date": "2026-03-21",
          "place": "4th",
          "event": "JOC 2026 Spring Regional Finals (CN)",
          "tier": "Regional",
          "prize": "$8,713"
        },
        {
          "date": "2025-07-13",
          "place": "23rd",
          "event": "Cyber City Tactician's Crown",
          "tier": "World"
        },
        {
          "date": "2025-07-05",
          "place": "3rd",
          "event": "JOC 8 Regional Finals (CN)",
          "tier": "Regional",
          "prize": "$13,956"
        },
        {
          "date": "2023-11-05",
          "place": "5th",
          "event": "Runeterra Reforged Championship",
          "tier": "World",
          "prize": "$14,000"
        },
        {
          "date": "2023-09-03",
          "place": "2nd",
          "event": "JOC 3 Regional Finals (CN)",
          "tier": "Regional",
          "prize": "$55,118"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Huya",
          "url": "https://www.huya.com/172392"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/HanXing"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/hanxing"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/HanXing",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown/Qualification",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://tftlobby.gg/players/hanxing"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "baizhi",
      "noTwitch": true,
      "name": "Baizhi",
      "pro": true,
      "realName": "Jiang Chenyu",
      "country": "China",
      "role": "Pro player",
      "focus": "TOC 2026 Fall Regional Finals winner (CN)",
      "region": "CN",
      "about": "Baizhi (白纸), listed on Liquipedia as Pale, is a Chinese Teamfight Tactics player. Baizhi qualified for the Enchanted Wilds Tactician's Crown by winning the TFT Open Championship (TOC) 2026 Fall Regional Finals in November 2026, one of the four TOC Regional Finals slots for China.",
      "prize": {
        "amount": "$149,920",
        "note": "according to Liquipedia",
        "source": "https://liquipedia.net/tft/Pale"
      },
      "results": [
        {
          "date": "2026-11-07",
          "place": "1st",
          "event": "TOC 2026 Fall Regional Finals (CN)",
          "tier": "Regional",
          "prize": "$149,779"
        },
        {
          "date": "2026-10-18",
          "place": "21st",
          "event": "TOC 2026 Fall Super Server (CN)",
          "tier": "Regional"
        },
        {
          "date": "2026-05-01",
          "place": "7th",
          "event": "TOC 2026 Spring Douyin Cup (CN)",
          "tier": "Regional"
        },
        {
          "date": "2025-09-14",
          "place": "8th",
          "event": "TOC 2025 Fall Huya Warrior Cup Season 10 (CN)",
          "tier": "Regional"
        },
        {
          "date": "2024-09-01",
          "place": "4th",
          "event": "TOC 9 Kuaishou Finals (CN)",
          "tier": "Regional",
          "prize": "$141"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Huya",
          "url": "https://www.huya.com/138716"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Pale"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Pale",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown/Qualification",
        "https://liquipedia.net/tft/TOC/2026/Fall/Regional_Finals",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "ace-tft",
      "noTwitch": true,
      "name": "Ace",
      "pro": true,
      "realName": "Huang Huatai",
      "born": "1998-12-23",
      "country": "China",
      "role": "Pro player",
      "focus": "TOC Regional Finals runner-up (CN)",
      "region": "CN",
      "about": "Ace is a Chinese Teamfight Tactics player and a former winner of the TOC 6 Regional Finals. Ace qualified for the Enchanted Wilds Tactician's Crown by finishing 2nd at the TFT Open Championship (TOC) 2026 Fall Regional Finals.",
      "results": [
        {
          "date": "2026-11-07",
          "place": "2nd",
          "event": "TOC 2026 Fall Regional Finals (CN)",
          "tier": "Regional"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Huya",
          "url": "https://www.huya.com/265743"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Ace"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Ace",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown/Qualification",
        "https://liquipedia.net/tft/TOC/2026/Fall/Regional_Finals",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "rue-tft",
      "noTwitch": true,
      "name": "Rue",
      "pro": true,
      "country": "China",
      "role": "Pro player",
      "focus": "TOC Regional Finals 3rd place (CN)",
      "region": "CN",
      "about": "Rue (之忧参上) is a Chinese Teamfight Tactics player. Rue qualified for the Enchanted Wilds Tactician's Crown by finishing 3rd at the TFT Open Championship (TOC) 2026 Fall Regional Finals.",
      "results": [
        {
          "date": "2026-11-07",
          "place": "3rd",
          "event": "TOC 2026 Fall Regional Finals (CN)",
          "tier": "Regional"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Rue"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Rue",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown/Qualification",
        "https://liquipedia.net/tft/TOC/2026/Fall/Regional_Finals",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "myyz",
      "noTwitch": true,
      "name": "Myyz",
      "pro": true,
      "country": "China",
      "role": "Pro player",
      "focus": "TOC Regional Finals 4th place (CN)",
      "region": "CN",
      "about": "Myyz (没有预兆) is a Chinese Teamfight Tactics player. Myyz qualified for the Enchanted Wilds Tactician's Crown by finishing 4th at the TFT Open Championship (TOC) 2026 Fall Regional Finals, taking the last of the four TOC slots.",
      "results": [
        {
          "date": "2026-11-07",
          "place": "4th",
          "event": "TOC 2026 Fall Regional Finals (CN)",
          "tier": "Regional"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Myyz"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Myyz",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown/Qualification",
        "https://liquipedia.net/tft/TOC/2026/Fall/Regional_Finals",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "cangshan",
      "noTwitch": true,
      "name": "Cangshan",
      "pro": true,
      "country": "China",
      "role": "Pro player",
      "focus": "TOC Pro Circuit winner (CN)",
      "region": "CN",
      "about": "Cangshan (苍山负雪i), listed on Liquipedia and tftlobby.gg as CSFX, is a Chinese Teamfight Tactics player. Cangshan qualified for the Enchanted Wilds Tactician's Crown by winning the TOC event of the CN TFT Pro Circuit. Cangshan previously played the Lore & Legends Tactician's Crown, finishing 32nd.",
      "results": [
        {
          "date": "2026-03-29",
          "place": "32nd",
          "event": "Lore & Legends Tactician's Crown",
          "tier": "World"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/CangShan"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/csfx"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/CangShan",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown/Qualification",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://tftlobby.gg/players/csfx"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "huiyuan",
      "noTwitch": true,
      "name": "HuiYuan",
      "pro": true,
      "realName": "Yan Hanxin",
      "country": "China",
      "role": "Pro player",
      "focus": "JOC 4 Regional Finals runner-up (CN)",
      "region": "CN",
      "about": "HuiYuan (in-game name 灰原的小迷弟) is a Chinese TFT player who finished 2nd at the JOC 4 Regional Finals in February 2024. HuiYuan is one of eleven Chinese players in the Enchanted Wilds Tactician's Crown field and qualified through China's own qualification events.",
      "prize": {
        "amount": "$56,968",
        "note": "according to Esports Earnings",
        "source": "https://www.esportsearnings.com/players/146578-huiyuan-yan-hanxin"
      },
      "results": [
        {
          "date": "2024-06-30",
          "place": "15th–16th",
          "event": "JOC 5 Regional Finals (CN)",
          "tier": "Regional",
          "prize": "$1,376"
        },
        {
          "date": "2024-02-25",
          "place": "2nd",
          "event": "JOC 4 Regional Finals (CN)",
          "tier": "Regional",
          "prize": "$55,592"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Huya",
          "url": "https://www.huya.com/138439"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/HuiYuan"
        },
        {
          "label": "Esports Earnings",
          "url": "https://www.esportsearnings.com/players/146578-huiyuan-yan-hanxin"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/HuiYuan",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown/Qualification",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://www.esportsearnings.com/players/146578-huiyuan-yan-hanxin"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "hanghang",
      "noTwitch": true,
      "name": "HangHang",
      "pro": true,
      "realName": "Lin Hang",
      "born": "2001-01-25",
      "country": "China",
      "role": "Pro player",
      "focus": "Second Tactician's Crown appearance (CN)",
      "region": "CN",
      "about": "HangHang (in-game name 杭杭) is a Chinese TFT player who previously played the Magic n' Mayhem Tactician's Crown in November 2024. HangHang is one of eleven Chinese players in the Enchanted Wilds Tactician's Crown field and qualified through China's own qualification events.",
      "prize": {
        "amount": "$2,000",
        "note": "according to Esports Earnings",
        "source": "https://www.esportsearnings.com/players/150918-hanghang-lin-hang"
      },
      "results": [
        {
          "date": "2024-11-10",
          "place": "35th",
          "event": "Magic n' Mayhem Tactician's Crown",
          "tier": "World",
          "prize": "$2,000"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Huya",
          "url": "https://www.huya.com/531309"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/HangHang"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/hanghang"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/HangHang",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown/Qualification",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://tftlobby.gg/players/hanghang",
        "https://www.esportsearnings.com/players/150918-hanghang-lin-hang"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "linshen",
      "noTwitch": true,
      "name": "linshen",
      "pro": true,
      "role": "Pro player",
      "focus": "Tactician's Crown qualifier (CN)",
      "region": "CN",
      "about": "linshen is a Chinese TFT player listed in Riot's primer with the team tag SCG. linshen is one of eleven Chinese players in the Enchanted Wilds Tactician's Crown field and qualified through China's own qualification events.",
      "events": [
        "tacticians-crown-set-18"
      ],
      "sources": [
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown/Qualification",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "hexi",
      "noTwitch": true,
      "name": "hexi",
      "pro": true,
      "realName": "Zheng Wei",
      "country": "China",
      "role": "Pro player",
      "focus": "Tactician's Crown qualifier (CN)",
      "region": "CN",
      "about": "hexi (in-game name 云鹤追) is a Chinese TFT player listed in Riot's primer with the team tag SCG. hexi is one of eleven Chinese players in the Enchanted Wilds Tactician's Crown field and qualified through China's own qualification events.",
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Hexi"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Hexi",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown/Qualification",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "diaomei",
      "noTwitch": true,
      "name": "diaomei",
      "pro": true,
      "realName": "He Jionghao",
      "country": "China",
      "role": "Pro player",
      "focus": "JOC Pro Circuit winner (CN)",
      "region": "CN",
      "about": "diaomei (in-game name 糕手雕妹) is a Chinese TFT player listed in Riot's primer with the team tag TLG. diaomei qualified for the Enchanted Wilds Tactician's Crown by winning the TFT Pro Circuit CN JOC event in September 2026. It is diaomei's third Tactician's Crown in a row, after finishing 28th at Lore & Legends and 24th at Space Gods earlier in 2026.",
      "results": [
        {
          "date": "2026-09-13",
          "place": "1st",
          "event": "TFT Pro Circuit – CN JOC (Enchanted Wilds)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2026-07-12",
          "place": "24th",
          "event": "Space Gods Tactician's Crown",
          "tier": "World"
        },
        {
          "date": "2026-03-29",
          "place": "28th",
          "event": "Lore & Legends Tactician's Crown",
          "tier": "World"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Diaomei"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/diaomei"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Diaomei",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown",
        "https://liquipedia.net/tft/Enchanted_Wilds/Tacticians_Crown/Qualification",
        "https://liquipedia.net/tft/Enchanted_Wilds/TFT_Pro_Circuit/CN/JOC",
        "https://liquipedia.net/tft/Tencent_Games",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/",
        "https://riftdaily.com/tft-enchanted-wilds-tacticians-crown/",
        "https://tftlobby.gg/players/diaomei"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "skipaeus",
      "name": "Skipaeus",
      "pro": true,
      "realName": "Samuel Křišťan",
      "country": "Czech Republic",
      "role": "Pro player",
      "focus": "Blossom Cup champion (EMEA)",
      "region": "EMEA",
      "about": "Samuel \"Skipaeus\" Křišťan is a Czech Teamfight Tactics player who played for Flip Flop Esports from 2024 to 2025. Skipaeus finished 2nd at the EMEA Reckoning Finals in 2021 and 5th at the Remix Rumble Championship in 2024. Skipaeus qualified for the Enchanted Wilds Tactician's Crown by winning the Blossom Cup (EMEA) on the Pro Circuit in October 2026.",
      "prize": {
        "amount": "$53,935",
        "note": "according to Liquipedia",
        "source": "https://liquipedia.net/tft/Skipaeus"
      },
      "career": [
        {
          "team": "Flip Flop Esports",
          "from": "Feb 2024",
          "to": "Aug 2025"
        }
      ],
      "results": [
        {
          "date": "2026-11-01",
          "place": "13th–16th",
          "event": "EMEA Regional Finals (Enchanted Wilds)",
          "tier": "Regional",
          "prize": "€550"
        },
        {
          "date": "2026-10-04",
          "place": "1st",
          "event": "Blossom Cup (EMEA)",
          "tier": "Pro Circuit",
          "prize": "$3,000"
        },
        {
          "date": "2024-03-03",
          "place": "5th",
          "event": "Remix Rumble Championship",
          "tier": "World",
          "prize": "$14,000"
        },
        {
          "date": "2024-02-25",
          "place": "2nd",
          "event": "Rising Legends: Remix Rumble – Finals (EMEA)",
          "tier": "Regional",
          "prize": "$5,417"
        },
        {
          "date": "2023-07-16",
          "place": "2nd",
          "event": "Rising Legends: Runeterra Reforged – Golden Spatula Cup #1 (EMEA)",
          "tier": "Regional",
          "prize": "$1,684"
        },
        {
          "date": "2022-08-14",
          "place": "1st",
          "event": "Rising Legends: Dragonlands – Golden Spatula Cup #2 (EMEA)",
          "tier": "Regional",
          "prize": "$1,025"
        },
        {
          "date": "2021-10-03",
          "place": "13th–14th",
          "event": "Reckoning Championship",
          "tier": "World",
          "prize": "$7,500"
        },
        {
          "date": "2021-08-15",
          "place": "2nd",
          "event": "EMEA: Reckoning – Finals",
          "tier": "Regional",
          "prize": "$5,896"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "X",
          "url": "https://x.com/SamuelKristan1"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Skipaeus"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/skipaeus"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Skipaeus",
        "https://liquipedia.net/tft/Enchanted_Wilds/EMEA/Regional_Finals",
        "https://tftlobby.gg/players/skipaeus",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "l3scoco",
      "name": "L3SCoco",
      "pro": true,
      "realName": "Mathieu Nencioni",
      "country": "France",
      "role": "Pro player",
      "focus": "EMEA Regional Finals champion",
      "region": "EMEA",
      "team": "Gentle Mates",
      "teamSince": "September 2023",
      "about": "Mathieu \"L3SCoco\" Nencioni is a French Teamfight Tactics player who has played for Gentle Mates since 2023. L3SCoco competed at the Gizmos & Gadgets and Dragonlands World Championships and the Cyber City Tactician's Crown, and won the Soul Fighter Cup (EMEA) in September 2025. L3SCoco qualified for the Enchanted Wilds Tactician's Crown by winning the EMEA Regional Finals.",
      "career": [
        {
          "team": "Gentle Mates",
          "from": "Sep 2023"
        },
        {
          "team": "Solary",
          "from": "Aug 2020",
          "to": "Dec 2022"
        }
      ],
      "results": [
        {
          "date": "2026-11-01",
          "place": "1st",
          "event": "EMEA Regional Finals (Enchanted Wilds)",
          "tier": "Regional",
          "prize": "€12,850"
        },
        {
          "date": "2025-09-21",
          "place": "1st",
          "event": "Soul Fighter Cup (EMEA)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2025-07-13",
          "place": "19th",
          "event": "Tactician's Crown (Cyber City)",
          "tier": "World",
          "prize": "$6,000"
        },
        {
          "date": "2024-04-28",
          "place": "1st",
          "event": "Rising Legends: Inkborn Fables – Golden Spatula Cup #1 (EMEA)",
          "tier": "Regional",
          "prize": "€2,500"
        },
        {
          "date": "2022-11-20",
          "place": "14th",
          "event": "Dragonlands World Championship",
          "tier": "World",
          "prize": "$8,000"
        },
        {
          "date": "2022-11-06",
          "place": "4th",
          "event": "Rising Legends: Dragonlands – Finals (EMEA)",
          "tier": "Regional",
          "prize": "$1,818"
        },
        {
          "date": "2022-05-01",
          "place": "21st",
          "event": "Gizmos & Gadgets World Championship",
          "tier": "World",
          "prize": "$5,000"
        },
        {
          "date": "2022-03-27",
          "place": "3rd",
          "event": "Rising Legends: Gizmos & Gadgets – Finals (EMEA)",
          "tier": "Regional",
          "prize": "$2,210"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "X",
          "url": "https://x.com/L3S_Coco"
        },
        {
          "label": "Instagram",
          "url": "https://www.instagram.com/L3SCoco"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/L3SCoco"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/l3scoco"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/L3SCoco",
        "https://liquipedia.net/tft/Enchanted_Wilds/EMEA/Regional_Finals",
        "https://tftlobby.gg/players/l3scoco",
        "https://www.esportsearnings.com/players/107359-l3s-coco-mathieu-nencioni",
        "https://www.esportsearnings.com/players/107359-l3s-coco-mathieu-nencioni/team-history",
        "https://www.esportsearnings.com/players/107359-l3s-coco-mathieu-nencioni/results-by-year",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "yakumo",
      "noTwitch": true,
      "name": "Yakumo",
      "pro": true,
      "country": "Kyrgyzstan",
      "role": "Pro player",
      "focus": "EMEA Regional Finals runner-up",
      "region": "EMEA",
      "about": "Yakumo, also known as Yatora, is a Teamfight Tactics player from Kyrgyzstan who started playing the game because of k3soju. Yakumo finished 6th at the Blossom Cup (EMEA) in October 2026. Yakumo qualified for the Enchanted Wilds Tactician's Crown through the EMEA Regional Finals, where Yakumo placed 2nd.",
      "stats": {
        "wins": 0,
        "top8": 2,
        "events": 3
      },
      "results": [
        {
          "date": "2026-11-01",
          "place": "2nd",
          "event": "EMEA Regional Finals (Enchanted Wilds)",
          "tier": "Regional",
          "prize": "€6,000"
        },
        {
          "date": "2026-10-04",
          "place": "6th",
          "event": "Blossom Cup (EMEA)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2024-07-07",
          "place": "16th",
          "event": "Rising Legends: Inkborn Fables – Finals (EMEA)",
          "tier": "Regional",
          "prize": "$596"
        },
        {
          "date": "2024-04-28",
          "place": "19th",
          "event": "Rising Legends: Inkborn Fables – Golden Spatula Cup #1 (EMEA)",
          "tier": "Regional",
          "prize": "$161"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Yatora"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/yakumo"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Yatora",
        "https://liquipedia.net/tft/Enchanted_Wilds/EMEA/Regional_Finals",
        "https://tftlobby.gg/players/yakumo",
        "https://www.esportsearnings.com/players/146786-yatora-",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "cynar_",
      "name": "Cynarr",
      "pro": true,
      "country": "Turkey",
      "role": "Pro player",
      "focus": "Regional Finals qualifier (EMEA)",
      "region": "EMEA",
      "about": "Cynarr (Liquipedia ID: Cynar) is a Turkish Teamfight Tactics player with several Rising Legends results in EMEA, including 3rd at a Runeterra Reforged Golden Spatula Cup in 2023 and 6th at the Remix Rumble Finals in 2024. Cynarr qualified for the Enchanted Wilds Tactician's Crown through the EMEA Regional Finals, where Cynarr placed 4th.",
      "results": [
        {
          "date": "2026-11-01",
          "place": "4th",
          "event": "EMEA Regional Finals (Enchanted Wilds)",
          "tier": "Regional",
          "prize": "€4,000"
        },
        {
          "date": "2024-07-07",
          "place": "12th",
          "event": "Rising Legends: Inkborn Fables – Finals (EMEA)",
          "tier": "Regional",
          "prize": "$596"
        },
        {
          "date": "2024-04-28",
          "place": "6th",
          "event": "Rising Legends: Inkborn Fables – Golden Spatula Cup #1 (EMEA)",
          "tier": "Regional",
          "prize": "$535"
        },
        {
          "date": "2024-02-25",
          "place": "6th",
          "event": "Rising Legends: Remix Rumble – Finals (EMEA)",
          "tier": "Regional",
          "prize": "$1,625"
        },
        {
          "date": "2024-01-14",
          "place": "7th",
          "event": "Rising Legends: Remix Rumble – Golden Spatula Cup #1 (EMEA)",
          "tier": "Regional",
          "prize": "$329"
        },
        {
          "date": "2023-10-22",
          "place": "11th",
          "event": "Rising Legends: Runeterra Reforged – Finals (EMEA)",
          "tier": "Regional",
          "prize": "$846"
        },
        {
          "date": "2023-08-13",
          "place": "3rd",
          "event": "Rising Legends: Runeterra Reforged – Golden Spatula Cup #2 (EMEA)",
          "tier": "Regional",
          "prize": "$1,094"
        },
        {
          "date": "2022-11-06",
          "place": "16th",
          "event": "Rising Legends: Dragonlands – Finals (EMEA)",
          "tier": "Regional",
          "prize": "$404"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "X",
          "url": "https://x.com/cynartft"
        },
        {
          "label": "YouTube",
          "url": "https://www.youtube.com/CynarTFT41"
        },
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Cynar"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/cynarr"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Cynar",
        "https://liquipedia.net/tft/Enchanted_Wilds/EMEA/Regional_Finals",
        "https://tftlobby.gg/players/cynarr",
        "https://www.esportsearnings.com/players/107370-cynarr-",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "osk_uu",
      "name": "oskuu",
      "pro": true,
      "country": "Finland",
      "role": "Pro player",
      "focus": "Regional Finals qualifier (EMEA)",
      "region": "EMEA",
      "about": "oskuu is a Finnish Teamfight Tactics player. oskuu qualified for the Enchanted Wilds Tactician's Crown through the EMEA Regional Finals, where oskuu placed 5th.",
      "results": [
        {
          "date": "2026-11-01",
          "place": "5th",
          "event": "EMEA Regional Finals (Enchanted Wilds)",
          "tier": "Regional",
          "prize": "€3,000"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Oskuu"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/oskuu"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Oskuu",
        "https://liquipedia.net/tft/Enchanted_Wilds/EMEA/Regional_Finals",
        "https://tftlobby.gg/players/oskuu",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
    },
    {
      "login": "whyyoumadpro",
      "name": "whyyoumadpro",
      "pro": true,
      "country": "Germany",
      "role": "Pro player",
      "focus": "Regional Finals qualifier (EMEA)",
      "region": "EMEA",
      "about": "whyyoumadpro is a German Teamfight Tactics player who reached the finals of two Pro Circuit cups in autumn 2026, placing 4th at both the Elderwood Cup and the Blossom Cup. whyyoumadpro qualified for the Enchanted Wilds Tactician's Crown through the EMEA Regional Finals, where whyyoumadpro placed 6th.",
      "stats": {
        "wins": 0,
        "top8": 3,
        "events": 4
      },
      "results": [
        {
          "date": "2026-11-01",
          "place": "6th",
          "event": "EMEA Regional Finals (Enchanted Wilds)",
          "tier": "Regional",
          "prize": "€2,000"
        },
        {
          "date": "2026-10-04",
          "place": "4th",
          "event": "Blossom Cup (EMEA)",
          "tier": "Pro Circuit"
        },
        {
          "date": "2026-09-20",
          "place": "4th",
          "event": "Elderwood Cup",
          "tier": "Pro Circuit"
        },
        {
          "date": "2026-05-24",
          "place": "32nd",
          "event": "Dark Star Cup",
          "tier": "Pro Circuit"
        }
      ],
      "events": [
        "tacticians-crown-set-18"
      ],
      "links": [
        {
          "label": "Liquipedia",
          "url": "https://liquipedia.net/tft/Whyyoumadpro"
        },
        {
          "label": "tftlobby.gg",
          "url": "https://tftlobby.gg/players/whyyoumadpro"
        }
      ],
      "sources": [
        "https://liquipedia.net/tft/Whyyoumadpro",
        "https://liquipedia.net/tft/Enchanted_Wilds/EMEA/Regional_Finals",
        "https://tftlobby.gg/players/whyyoumadpro",
        "https://competetft.com/en-US/tournament/116918001686340951/qualification/overview",
        "https://teamfighttactics.leagueoflegends.com/en-us/news/esports/enchanted-wilds-tacticians-crown-primer/"
      ],
      "checked": "2026-11-12"
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
