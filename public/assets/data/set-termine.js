/*
 * TFTEsport – Set-Termine als Info im Kalender (Set-Start, PBE-Start, Set-Ende).
 * kind: 'set-start' | 'pbe' | 'set-end'. short = kurze Bezeichnung im Kalender. Datum laut Quelle; Riot plant Patches in Pacific Time.
 * Von Hand pflegen: neue Einträge einfach ergänzen, alte dürfen stehen bleiben.
 */
window.TFTE.setEvents = [
  {
    "date": "2026-08-26",
    "kind": "set-start",
    "title": "Set 18 startet",
    "short": "Set 18 Start",
    "info": "Enchanted Wilds geht mit Patch 18.1 live.",
    "source": "https://support.riotgames.com/en-us/tft/events/patch-schedule-teamfight-tactics"
  },
  {
    "date": "2026-11-11",
    "kind": "pbe",
    "title": "Set 19 auf dem PBE",
    "short": "Set 19 PBE",
    "info": "Noch nicht von Riot bestätigt – mit Patch 18.6B laut Little Buddy Bot.",
    "source": "Patch-Plan TFTClimb (Little Buddy Bot)"
  },
  {
    "date": "2026-11-30",
    "kind": "set-end",
    "title": "Letzter Tag von Set 18",
    "short": "Set 18 Ende",
    "info": "Set 18 endet mit dem Start von Set 19 (Patch 19.1 am 01.12.).",
    "source": "https://support.riotgames.com/en-us/tft/events/patch-schedule-teamfight-tactics"
  },
  {
    "date": "2026-12-01",
    "kind": "set-start",
    "title": "Set 19 startet",
    "short": "Set 19 Start",
    "info": "Patch 19.1 laut offiziellem Riot-Patchplan.",
    "source": "https://support.riotgames.com/en-us/tft/events/patch-schedule-teamfight-tactics"
  }
];
