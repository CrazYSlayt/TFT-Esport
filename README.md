# TFTEsport – Grundgerüst

Treffpunkt für TFT-Spieler und Zuschauer aller Spielstärken: News, Cups und Twitch. Teil des TFTClimb Network.
Stand: Grundgerüst mit Navigation, Seiten, Filtern, Vorlagen und Leerzuständen – **noch nicht veröffentlicht**.

## Ansehen

**`index.html` im Hauptordner doppelklicken** – öffnet direkt die Startseite. Kein Server nötig:
alle Links und Pfade sind vorerst relativ (`news.html`, `../assets/…`), damit alles per Doppelklick läuft.
Nur die Twitch-Live-Daten brauchen später die Anbindung.

Die Spalte „Adresse“ unten sind die späteren Live-Adressen (stehen schon in canonical und Sitemap).
Beim Live-Gang werden die Links auf diese sauberen Adressen umgestellt.

## Seiten

| Adresse | Datei (in `public/`) | Inhalt | Index |
|---|---|---|---|
| `/` | `index.html` | Titelstory, kommende Turniere, Live Matches + Livestats (geplant), News, „Diese Woche in TFT“ (geplant), aktive Streams | ja |
| `/news` | `news.html` | News-Übersicht, Filter `?kategorie=offiziell\|turniere\|szene\|orientierung` | ja |
| `/news/vorlage` | `news/vorlage.html` | Artikelvorlage | noindex |
| `/live-matches` | `live-matches.html` | Leerzustand + geplanter Aufbau | noindex |
| `/twitch` | `twitch.html` | Live Streams: Kanalempfehlungen, Übertragungen & Co-Streams, „Jetzt live auf Deutsch“ | ja |
| `/twitch/live-streams` | `twitch/live-streams.html` | Alle TFT-Streams (Twitch-API), Sprachfilter | ja |
| `/cups` | `cups.html` | Turniere: Monatskalender (Standard) + Liste, Karten mit den fünf Kernfragen, Filter Region, Datum, Teilnahme, Art, offene Anmeldung | ja |
| `/cups/turnier?id=…` | `cups/turnier.html` | Detailseite für jedes Turnier (aus den Daten) | noindex |
| `/pro-players` | `pro-players.html` | Leerzustand + geplante Übersicht und Spielerprofil | noindex |
| `/ueber-uns`, `/kontakt`, `/impressum`, `/datenschutz` | `*.html` | Platzhalter, vor Launch ausfüllen | noindex |

Navigation: News · Live Matches · Live Streams · Turniere · Pro Players. Boxen mit „Geplant“ zeigen Bereiche, die noch gebaut werden.

## Inhalte pflegen

Alle Inhalte stehen in `public/assets/js/data.js` (Format als Kommentar dort). Die Listen sind leer – Übersichten zeigen Leerzustände,
bis Einträge da sind. Besucher können keine Cups anlegen; Cups trägt nur die Redaktion ein.

- **Artikel:** `public/news/vorlage.html` nach `public/news/<slug>.html` kopieren, Platzhalter ersetzen, `noindex` entfernen, canonical/og:url anpassen,
  Eintrag in `articles` ergänzen, Adresse in `public/sitemap.xml` aufnehmen. `top: true` macht ihn zur Titelstory.
- **Turniere:** `Turniere bearbeiten.html` im Hauptordner doppelklicken (Chrome oder Edge), Formular ausfüllen, „Speichern“. Beim ersten Speichern einmal `public/assets/data/turniere.js` auswählen. Jedes Turnier braucht Quelle(n) des Veranstalters und ein Prüfdatum.
- **Creator / Übertragungen:** Einträge in `creators` (`featured: true` = Startseite) und `broadcasts`.

## SEO-Regeln (aus TFTClimb / TFT Arcade)

Genau eine sichtbare H1 ≤ 54 Zeichen (nie versteckt), title ≤ 60 mit Keyword vorne, Meta-Beschreibung ≤ 134 mit Keyword,
canonical = eigene saubere Adresse, Vorlagen und leere Bereiche auf noindex und nicht in der Sitemap.
Prüfen mit:

```
node tools/seo-check.js
```

Der Check prüft außerdem interne Links (müssen vorerst relativ sein), Sitemap und Symbolnamen (`data-icon`).

## Twitch verbinden (später)

1. Auf https://dev.twitch.tv/console eine Anwendung registrieren (Redirect `http://localhost`, Client Type **Confidential**).
2. `twitch.config.example.json` nach `twitch.config.json` kopieren, Client ID und Secret eintragen.
3. Server starten: `powershell -ExecutionPolicy Bypass -File server.ps1 -Open` → http://localhost:8080.
   Ohne Zugangsdaten zeigen die Twitch-Seiten einen Hinweis statt Demo-Streams.

`twitch.config.json` enthält ein Geheimnis: nie committen, nie teilen. Sie liegt außerhalb von `public/` und wird nie ausgeliefert.

## Technik

- Statische HTML-Seiten, eine Datei pro Adresse; Kopf-Daten (title, description, canonical, og) stehen direkt im HTML.
- `public/assets/js/app.js`: Header, Navigation, Drawer, Suche, Footer, gemeinsame Bausteine, Twitch-Player-Fenster.
- `public/assets/js/home.js`, `news.js`, `cups.js`, `twitch.js`, `streams.js`: Logik je Seite.
- Schriften (Barlow) liegen lokal in `public/assets/fonts/` – keine Verbindung zu Google.
- Ordner: `public/` = die Website (nur dieser Ordner wird ausgeliefert), `tools/` = Prüfskript, im Hauptordner `index.html` (Weiterleitung zur Startseite), Twitch-Server und Doku.

## Offen vor dem Launch

- Interne Links von `….html` auf saubere Adressen umstellen (`/news`), Vercel `cleanUrls`.

- Domain bestätigen (Platzhalter `https://www.tftesport.com` in allen Seiten, `sitemap.xml`, `robots.txt`, `data.js`, `tools/seo-check.js`).
- Impressum, Datenschutz, Kontakt ausfüllen; Vorschaubild (og:image) und Logo-Datei ergänzen.
- Hosting: Die Twitch-Anbindung läuft bisher nur über `server.ps1`. Für Vercel braucht es eine Serverless-Funktion für `/api/streams`
  (Ausgabeordner ist dann `public/`).
