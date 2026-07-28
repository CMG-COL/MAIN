# Bericht Phase 2 — Entwicklung

**Projekt:** Turbo Siesta · **Datum:** 25.07.2026 · **Status:** ✅ v1.0 spielbar

## Was gebaut wurde

Ein vollständig spielbares Top-Down-Fahrspiel als **Einzeldatei-Canvas-Engine ohne
Frameworks und ohne externe Assets** (~1.500 Zeilen JavaScript), ausgeliefert als
installierbare, offline-fähige PWA für iPhone-Safari.

### Umfang v1.0

| System | Details |
|---|---|
| Stadt | 112×112 Kacheln, deterministisch generiert: 4 Distrikte, Straßenraster, Strand + Meer, Parks/Palmen, Parkplätze, Container-Docks |
| Fahrphysik | Arcade-Handling, Offroad-Verlangsamung, Kollisions-Sliding, Rückstoß, Neon-Driftspuren, Kamera mit Blick-voraus |
| Missionen | 5 Typen mit Satire-Flavor, Lohn = Distanz × Serie × Sterne-Multiplikator, Timer, 3 Marker gleichzeitig |
| Siesta-Patrol | Verfolger-KI mit Hindernis-Sonden, Einkeil-Mechanik → Knöllchen-Selfie, Musterbürger-Trick (brav schleichen = Sterne schneller weg) |
| Ökonomie | Ungesichertes Trinkgeld vs. Bank (localStorage), Waschanlagen-Banking, 4 Upgrades mit Kosten-Skalierung |
| Belebung | Zivilverkehr (Spurlogik, Hupen, Trudel-Rempler), Passanten mit Hechtsprung + Sprechblasen + Schulterblick-Bonus |
| UI/HUD | Kassenbon-Ticker, Neon-Sterne mit ×-Anzeige, runde Minimap mit Blips, Zielpfeil, Toasts, Titelscreen im Synthwave-Look, Pause/Knöllchen/Waschanlagen-Screens |
| Steuerung | Virtueller Joystick + GAS/STOP (Multi-Touch-sicher), parallel Tastatur (WASD/Pfeile) für Desktop |
| Sound | WebAudio-Synthese: Motor (drehzahlabhängig), Zweiton-Sirene, 8 SFX — iOS-Audio-Unlock per erster Berührung |
| PWA | Manifest, Service Worker (cache-first), Icons 180/512 px (prozedural in Headless-Chromium gerendert), Safe-Area-Handling |

## Technische Entscheidungen

1. **Kein Framework, keine Assets:** Alles prozedural (Stadt, Grafik, Sound, Icons) —
   Ladezeit < 1 s, keine Lizenzfragen, triviales Deployment (5 Dateien).
2. **Deterministischer Stadt-Seed:** identische Stadt für alle Spieler — Voraussetzung
   für die geplante „Daily Rush"-Vergleichbarkeit (v1.1).
3. **Culling statt Pre-Rendering:** sichtbare Kacheln direkt zeichnen + räumliche Buckets
   für Gebäude/Palmen/Props — spart ~65 MB Chunk-Canvases, läuft auf iPhone flüssig.
4. **Konzept-Treue:** Wallet/Bank, Sterne-Multiplikator, Musterbürger-Trick und
   Knöllchen-Selfie aus Phase 1 sind vollständig implementiert.

## Qualitätssicherung

- `node --check`: Syntax sauber.
- **Playwright-Smoke-Test** (iPhone-Viewport 390×844, Touch-Events via CDP):
  Titel → Start → Gasgeben → Lenken (Driftspuren sichtbar) → Pause-Menü.
  **Ergebnis: 0 JS-Fehler**, 6 Screenshots als Beleg.
- **Adversariale Code-Review** (Multi-Agent): 3 Review-Dimensionen (Logik,
  iOS/Mobile/PWA, Performance), jeder Befund von einem unabhängigen Verifizierer
  geprüft; bestätigte Befunde wurden gefixt (Details im PR).

## Offene Punkte → Roadmap

Daily Rush (Tages-Seed + Share-Card), 3-Minuten-Schichtmodus, Big Job Freitag,
Haptik (Vibration API), Capacitor-Wrap für den App Store (`docs/IOS-APP-STORE.md`).
