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

Die Seite ist **englisch** (Zielgruppe weltweit, Betreiber-Tools wie der Editor bleiben deutsch).

| Adresse | Datei (in `public/`) | Inhalt | Index |
|---|---|---|---|
| `/` | `index.html` | Begrüßung, Hinweis auf die Weltmeisterschaft, nächstes Match, Turnierfinder (Liste/Kalender), Streams, Set-Termine | ja |
| `/tft-tournaments` | `tft-tournaments.html` | Monatskalender + Liste, Filter (`?view=list&region=emea&entry=offen` …) | ja |
| `/tft-tournaments/<id>` | `tft-tournaments/<id>.html` | Feste Seite pro Turnier, **erzeugt** von `tools/build-tournaments.js` | ja; vergangene inoffizielle: noindex |
| `/tft-tacticians-crown` | `tft-tacticians-crown.html` | Weltmeisterschaft: Countdown, Twitch-Player, Co-Streams, Ablauf, FAQ | ja |
| `/live-matches` | `live-matches.html` | Live jetzt / Up next, heute, 7 Tage, letzte Ergebnisse (nur offizielle Turniere) | ja |
| `/twitch`, `/twitch/live-streams` | `twitch.html`, `twitch/live-streams.html` | Übertragungen, englische Streams, alle TFT-Streams | ja |
| `/news`, `/news/template` | `news.html`, `news/template.html` | News-Übersicht, Artikelvorlage | ja / noindex |
| `/pro-players`, `/about`, `/contact`, `/legal-notice`, `/privacy` | `*.html` | Platzhalter bzw. Rechtliches | noindex |

## Inhalte pflegen

Alle Inhalte stehen in `public/assets/js/data.js` (Format als Kommentar dort). Die Listen sind leer – Übersichten zeigen Leerzustände,
bis Einträge da sind. Besucher können keine Cups anlegen; Cups trägt nur die Redaktion ein.

- **Artikel:** `public/news/template.html` nach `public/news/<slug>.html` kopieren, Platzhalter ersetzen, `noindex` entfernen, canonical/og:url anpassen,
  Eintrag in `articles` ergänzen, Adresse in `public/sitemap.xml` aufnehmen. `top: true` macht ihn zur Titelstory.
- **Turniere:** `Turniere bearbeiten.html` im Hauptordner doppelklicken (Chrome oder Edge), Formular ausfüllen, „Speichern“. Beim ersten Speichern einmal `public/assets/data/turniere.js` auswählen. Jedes Turnier braucht Quelle(n) des Veranstalters und ein Prüfdatum. Texte auf Englisch, Uhrzeiten in deutscher Zeit (Besucher sehen ihre Ortszeit). Die Turnierseiten und die Sitemap entstehen beim Veröffentlichen neu; lokal: `node tools/build-tournaments.js`.
- **Creator / Übertragungen:** Einträge in `creators` (`featured: true` = Startseite) und `broadcasts`.

## SEO-Regeln (aus TFTClimb / TFT Arcade)

Genau eine sichtbare H1 ≤ 54 Zeichen (nie versteckt), title ≤ 60 mit Keyword vorne, Meta-Beschreibung ≤ 134 mit Keyword,
canonical = eigene saubere Adresse, Vorlagen und leere Bereiche auf noindex und nicht in der Sitemap.
Prüfen mit:

```
node tools/seo-check.js
```

Der Check prüft außerdem interne Links (müssen vorerst relativ sein), Sitemap und Symbolnamen (`data-icon`).

## Twitch verbinden

Die Streams kommen über die Vercel-Funktion `api/streams.js`.

1. Auf https://dev.twitch.tv/console eine Anwendung registrieren (Redirect `http://localhost`, Client Type **Confidential**).
2. Im Vercel-Projekt unter Settings → Environment Variables `TWITCH_CLIENT_ID` und `TWITCH_CLIENT_SECRET` eintragen, danach neu veröffentlichen.
   Ohne Zugangsdaten zeigen die Twitch-Seiten einen Hinweis statt Streams; der Player auf der Crown-Seite funktioniert auch ohne.

Das Secret nie committen und nie teilen. `server.ps1` ist die alte lokale Variante (liest `twitch.config.json`).

## Technik

- Statische HTML-Seiten, eine Datei pro Adresse; Kopf-Daten (title, description, canonical, og) stehen direkt im HTML.
- `public/assets/js/app.js`: Header, Navigation, Drawer, Suche, Footer, gemeinsame Bausteine, Twitch-Player-Fenster.
- `public/assets/js/home.js`, `news.js`, `cups.js`, `turnier.js`, `crown.js`, `live.js`, `twitch.js`, `streams.js`: Logik je Seite.
- Schriften (Barlow) liegen lokal in `public/assets/fonts/` – keine Verbindung zu Google.
- Ordner: `public/` = die Website (nur dieser Ordner wird ausgeliefert), `api/` = Twitch-Funktion, `tools/` = Prüf- und Build-Skript, im Hauptordner `index.html` (Weiterleitung zur Startseite), Twitch-Server und Doku.

## Veröffentlichen (GitHub + Vercel)

- Repository: `github.com/CrazYSlayt/TFT-Esport` (privat), Vercel-Projekt importiert es, ausgeliefert wird nur `public/` (`vercel.json`).
- Änderungen hochladen: **`Änderungen veröffentlichen.cmd`** doppelklicken – Vercel stellt sie danach automatisch live.
- Solange `vercel.json` den Header `X-Robots-Tag: noindex, nofollow` setzt, ist die Seite für Suchmaschinen gesperrt.
  Zum echten Start diesen Block entfernen.

## Offen vor dem Launch

- Domain: `https://www.tft-esports.com`; `tft-esports.com` leitet per `vercel.json` auf `www` weiter.
- Sperre für Suchmaschinen entfernen (Header in `vercel.json`), Search Console einrichten.
- Über-uns-Text füllen, Pro Players und News mit ersten Einträgen starten.
