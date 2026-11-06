/*
 * TFT E-Sports – Set-Termine als Info im Kalender (Set-Start, PBE-Start, Set-Ende).
 * kind: 'set-start' | 'pbe' | 'set-end'. short = kurze Bezeichnung im Kalender. Datum laut Quelle; Riot plant Patches in Pacific Time.
 * Von Hand pflegen: neue Einträge einfach ergänzen, alte dürfen stehen bleiben. Texte auf Englisch, die Seite ist englisch.
 */
window.TFTE.setEvents = [
  {
    "date": "2026-08-26",
    "kind": "set-start",
    "title": "Set 18 launches",
    "short": "Set 18 start",
    "info": "Enchanted Wilds goes live with patch 18.1.",
    "source": "https://support.riotgames.com/en-us/tft/events/patch-schedule-teamfight-tactics"
  },
  {
    "date": "2026-11-11",
    "kind": "pbe",
    "title": "Set 19 on PBE",
    "short": "Set 19 PBE",
    "info": "Not confirmed by Riot yet – with patch 18.6B according to Little Buddy Bot.",
    "source": "Patch plan TFTClimb (Little Buddy Bot)"
  },
  {
    "date": "2026-11-30",
    "kind": "set-end",
    "title": "Last day of Set 18",
    "short": "Set 18 end",
    "info": "Set 18 ends with the launch of Set 19 (patch 19.1 on 1 Dec).",
    "source": "https://support.riotgames.com/en-us/tft/events/patch-schedule-teamfight-tactics"
  },
  {
    "date": "2026-12-01",
    "kind": "set-start",
    "title": "Set 19 launches",
    "short": "Set 19 start",
    "info": "Patch 19.1 according to Riot's official patch schedule.",
    "source": "https://support.riotgames.com/en-us/tft/events/patch-schedule-teamfight-tactics"
  }
];
