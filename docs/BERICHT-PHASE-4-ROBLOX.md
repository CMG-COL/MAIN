# Bericht Phase 4 — Roblox: Einstellen & Plattform-Vermarktung

**Projekt:** Turbo Siesta · **Datum:** 25.07.2026 · **Status:** ✅ publishfertig (finaler Upload = 10 Min. Handarbeit mit Roblox-Account)

## Ausgangslage & Entscheidung

Roblox akzeptiert kein HTML5 — Spiele laufen dort ausschließlich als
Luau-Skripte in der Roblox-Engine. Turbo Siesta wurde deshalb **vollständig
nach Luau portiert** (keine Emulation, echte 3D-Adaption mit Top-Down-Kamera).
Das Publishing selbst erfordert zwingend einen Roblox-Account samt Studio-Login;
deshalb ist das Deliverable eine **fertige Place-Datei + Klick-Anleitung**
(`roblox/README.md`) — vom Öffnen bis „live" sind es ~10 Minuten.

## Was gebaut wurde (`roblox/`)

| Artefakt | Inhalt |
|---|---|
| `TurboSiesta.rbxlx` | Fertige Place-Datei (öffnen → Publish). Enthält nur 3 Skripte — die Welt entsteht zur Laufzeit |
| `src/TSConfig.luau` | Geteilte Konfiguration: Stadtraster-Mathematik, Sunset-Pop-Palette, Missionen, Upgrades, Tuning |
| `src/TurboSiestaServer.luau` | Stadtgenerator (Solara Bay in 3D), Golden-Hour-Lighting, Fahrzeug-Spawning, Missionen, Siesta-Patrol-KI, Waschanlagen-Banking, Bürger-NPCs, Upgrades, DataStore-Persistenz |
| `src/TurboSiestaClient.luau` | Fahrphysik-Loop (VehicleSeat-Inputs → mobile Touch-Steuerung gratis), Top-Down-Kamera, HUD (Trinkgeld/Bank/Sterne/Serie/Timer/Toasts) |
| `build-rbxlx.js` | Reproduzierbarer Build der Place-Datei aus den Quellen |

**Kernloop 1:1 erhalten:** Sterne = Live-Multiplikator, ungesichertes Trinkgeld
vs. Bank, Waschanlage, Knöllchen, Musterbürger-Trick, Schulterblick-Bonus.
**Roblox-Extras:** `Bank` als Leaderstat in der Spielerliste (sozialer Vergleich),
Persistenz via DataStore, 12-Spieler-Server für den Freunde-Effekt.

**Qualitätssicherung ohne Roblox-Zugang:** Luau-Quellen syntaktisch validiert
(Lua-5.1-kompatibel gehalten), rbxlx-XML maschinell validiert, nur konservative,
etablierte Roblox-APIs verwendet. Erster Studio-Testlauf (F5) ist Teil der
Publish-Anleitung.

## Plattform-Vermarktung (0 Robux)

Komplettpaket in `marketing/ROBLOX-MARKETING.md` + `marketing/roblox-assets/`:

- **Titel-Empfehlung:** „🌴 Turbo Siesta: Delivery Drift" (Keyword-Kalkül dokumentiert, 4 Alternativen).
- **Beschreibung** EN + DE (Hook-Zeile, Feature-Bullets, Update-Log-Kultur).
- **Einstellungen:** Genre Racing, Maturity „Minimal", alle Geräte, 12er-Server — je mit Begründung.
- **Assets:** Icon 512² + 3 Thumbnails 1920×1080 (×5-TIPS / BUSTED / BANK IT), prozedural im Spiel-Look gerendert; A/B-Testregel fürs Thumbnail.
- **6-Wochen-Wachstumsplan:** Soft-Launch → Metrik-Iteration (Session-Zeit, D1/D7, Like-Ratio) → wöchentliche Update-Kadenz → Co-Play-Hebel → Shorts-Cross-Promo. Realistische 30-Tage-Ziele + 3 Kill-Kriterien.
- **Compliance-Check:** Satire ok; **$SOLCOIN wurde für Roblox entfernt** (Krypto-Moderationsrisiko) — der Job heißt dort „KURIER"; BJÖRNSTAD-Parodie unbedenklich gehalten; GTA-IP-Abgrenzung dokumentiert.

## Warum kein automatischer Upload aus dieser Session

Roblox-Publishing braucht Account-Authentifizierung (Studio-Login oder einen
Open-Cloud-API-Key des Creators). Beides liegt hier bewusst nicht vor. Sobald du
einen Open-Cloud-API-Key anlegst (Creator Dashboard → Open Cloud), lässt sich
der Upload zusätzlich per API automatisieren — die manuelle Studio-Route bleibt
aber der empfohlene erste Weg (Probefahrt vor dem Livegang).
