# Entwürfe (werden nicht veröffentlicht)

Vercel veröffentlicht nur `public/`. Hier liegen Artikel, die noch auf Ergebnisse warten.

## Tactician's Crown 2026 – Tagesberichte

| Datei | Erscheint | Slug |
|---|---|---|
| crown-day-1.html | Fr 13.11. abends | tacticians-crown-2026-day-1 |
| crown-day-2.html | Sa 14.11. abends | tacticians-crown-2026-day-2 |
| crown-day-3.html | So 15.11. abends | tacticians-crown-2026-final |

Alles in `[[…]]` wird erst mit den echten Ergebnissen ausgefüllt (Quelle: offizieller Stream / competetft.com, sonst als Drittquelle kennzeichnen).

Zum Veröffentlichen:
1. Platzhalter ausfüllen, nicht Bekanntes streichen (nichts erfinden).
2. Datei nach `public/news/<slug>.html` kopieren.
3. Eintrag oben in `articles` in `public/assets/js/data.js` (Vorlage steht als Kommentar in jeder Datei), `top: true` vom Vorbericht auf den neuen Bericht verschieben.
4. Ergebnis in `public/assets/data/turniere.js` beim Crown eintragen (`result.top`).
5. `node tools/seo-check.js`, freigeben lassen, push.
