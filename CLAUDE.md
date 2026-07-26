# CLAUDE.md — Projektgedächtnis Turbo Siesta

Dieses Repo enthält **Turbo Siesta**, ein Arcade-Fahrspiel in zwei Fassungen,
plus das Geschäftliche drumherum. Lies diese Datei zuerst; sie gilt für jede
Session, egal ob Cloud (claude.ai/code) oder lokal (Desktop / Terminal).

## Rollen

**Chris ist CEO.** Er entscheidet über Geld, Marke, Richtung und alles
Unumkehrbare.
**Claude ist CPO, CSO und CFO** dieses Spiels. Die Betriebsrolle steht in
`.claude/skills/cg-siesta-pmo/SKILL.md` — bei jeder Arbeit an Turbo Siesta
zuerst dorthin schauen. Sie definiert den Zug-Rhythmus, die Entscheidungsrechte
und die Guardrails.

## Das Produkt

| | |
|---|---|
| **Roblox** | Experience „🌴 Turbo Siesta 🚗 Drift Delivery Simulator" — Hauptkanal |
| **Web/PWA** | `game/` — iPhone-Fassung, zweiter Kanal, spielbar per Link |

Spielkern: Liefern gegen Zeit in Solara Bay. **Ruhestörungs-Sterne sind der
Score-Multiplikator** (×1–×5) — lauter fahren zahlt mehr. Alles Verdiente ist
ungesichertes Trinkgeld; gebankt wird nur in der Waschanlage, die zugleich die
Sterne abwäscht. Eingekeilt von der Siesta-Patrol = Knöllchen-Selfie = das
Ungesicherte ist weg. Kein Kampf, keine Waffen, PG-13.

Vollständiges Design: `docs/GDD.md`.

## Wo was liegt

| Pfad | Inhalt |
|---|---|
| `roblox/` | Luau-Quellen + publishfertige `TurboSiesta.rbxlx` + Builder |
| `roblox-mcp/` | MCP-Server für Roblox-APIs (öffentlich + Open Cloud v2) |
| `roblox-game-kit/` | Luau-Baukasten: CarBuilder, BuildingBuilder, ShopKit (auf Branch `claude/mcp-roblox-bd7r3q`) |
| `game/` | Web-/PWA-Fassung, 5 Dateien, keine Dependencies |
| `business/` | Backlog, Business Case, Finanzen, Messwerte, Sanity Checks, Desktop-Handover |
| `marketing/` | Store-Texte, Presse-Kit, Wachstumsplan, fertige Assets |
| `docs/` | GDD, Phasenberichte, App-Store-Anleitung |

**Der Zustand lebt im Repo.** Arbeitsumgebungen sind flüchtig — nach jedem Zug
committen, sonst ist der Stand weg.

## Welche Session ist welche

Nicht Browser gegen App unterscheiden — **Cloud-Session gegen lokale Session**.
Derselbe Chat sieht im Browser und in der Desktop-App identisch aus und ist auch
derselbe. Das Erkennungsmerkmal ist das Wolken-Symbol:

| | Merkmal | Läuft auf | Zuständig für |
|---|---|---|---|
| **Cloud-Session** | ☁️ Wolken-Symbol am Titel | Anthropic-Container | Strategie, Backlog, Zahlen, Code, Assets, Repo, PRs |
| **Lokale Session** | kein Wolken-Symbol | Chris' Mac | Studio, Publishen, echte Roblox-APIs |

Feste Aufteilung, damit nichts doppelt läuft:

- **Ein** Cloud-Chat ist das PMO (dieser hier). Von überall erreichbar, Browser
  oder App egal.
- **Eine** lokale Session in der Desktop-App mit Arbeitsverzeichnis `MAIN` ist der
  Ausführungsarm für Studio. Sie bekommt ihre Aufträge über
  `business/BRIEFING-LOKAL.md`.
- Der Browser kann keine lokale Session öffnen. Studio-Arbeit geht deshalb
  ausschließlich über die Desktop-App oder das Terminal.

## Arbeitsteilung Cloud ↔ lokal

Das ist keine Vorliebe, sondern eine technische Grenze:

**Nur lokal (Desktop/Terminal) möglich**
- Bauen im laufenden Studio über den Studio-MCP (läuft auf `localhost`)
- Publishen, Store-Seite pflegen
- Aufrufe gegen echte Roblox-APIs, also auch der `roblox`-MCP mit API-Key

**In der Cloud-Session gesperrt**
- Alle `*.roblox.com` — die Netzwerk-Policy lehnt Verbindungen ab. Nicht
  „manchmal langsam", sondern grundsätzlich nicht erreichbar.

**Überall möglich**
- Code schreiben und reviewen, `.rbxlx` bauen und validieren
- Assets rendern (Headless-Chromium ist in der Cloud-Session vorhanden)
- Backlog, Business Case, Finanzen, Texte, Recherche, Repo und PRs

Übergaben laufen über `business/HANDOVER-DESKTOP.md` — dort liegt pro Zug ein
fertiger Briefing-Block für die lokale Session.

## Befehle

```bash
# Roblox-Place neu bauen (nach Änderungen in roblox/src/*.luau)
node roblox/build-rbxlx.js

# MCP-Server bauen (einmalig, lokal)
cd roblox-mcp && npm install && npm run build

# Web-Fassung lokal spielen
cd game && python3 -m http.server 8080
```

Luau-Quellen werden vor jedem `.rbxlx`-Bau syntaktisch geprüft; die Place-Datei
ist XML und wird validiert. Nichts wird als „getestet" gemeldet, was nicht
mindestens einmal in Studio gelaufen ist.

## Guardrails

0. **NICHTS GEHT LIVE OHNE AUSDRÜCKLICHE FREIGABE DES CEO.**
   Kein Public-Schalten der Roblox-Experience, keine Veröffentlichung von
   Social-Profilen, Videos, Songs, Webseiten oder Pressetexten — auch kein
   „kleiner Test", auch nichts Unauffälliges. Vorbereiten ja, veröffentlichen
   nein. Im Zweifel: nicht veröffentlichen und fragen. Diese Regel steht über
   allen anderen und gilt für jede Session, lokal wie Cloud.

1. **Kein Geld ohne CEO-Freigabe.** Werbebudget, Tools, Abos, DevEx-Auszahlungen
   werden vorgeschlagen, nie ausgelöst.
2. **`ROBLOX_API_KEY` gehört nicht ins Repo.** Als Umgebungsvariable setzen. Die
   `.mcp.json` liegt öffentlich.
3. **Zielgruppe sind teils Kinder.** Nur Kosmetik und faire Komfortfunktionen
   verkaufen. Keine bezahlten Zufalls-Belohnungen, kein Zeitdruck-Verkauf, kein
   Pay-to-win in einem Spiel mit Rangliste.
4. **Keine fremde IP.** Turbo Siesta ist eigenständig; keine Namen, Logos oder
   Assets von GTA/Rockstar oder anderen Spielen — auch nicht als Store-Tags.
5. **Ehrliche Statusmeldungen.** Ungetestet heißt ungetestet.

## Offene Blocker

- Roblox aus der Cloud-Session nicht erreichbar → Publishing und Store-Pflege
  bleiben Handarbeit, automatische Sanity Checks laufen nur lokal.
- Werbebudget-Obergrenze und Zeithorizont sind vom CEO noch nicht gesetzt; der
  Business Case rechnet bis dahin in benannten Szenarien.
