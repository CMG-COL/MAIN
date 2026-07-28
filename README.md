# 🌴 TURBO SIESTA

> **Slow town. Full throttle.** — Top-Down-Arcade-Fahrspiel für iPhone (PWA)

In **Solara Bay**, der verschlafensten Küstenstadt der Welt, gilt per Stadtverordnung
Dauer-Siesta — und du bist der einzige Mensch, der es eilig hat. Liefere Churros, Eis
und zwielichtige Pakete, sammle Ruhestörungs-Sterne und kassiere den Multiplikator:
**Dein Fahndungslevel ist dein Score.**

Kostenlos · ohne Werbung · ohne Waffen · im Design-Geist von GTA V, aber 100 % original.

## Sofort spielen

Das Spiel ist eine einzige statische Web-App — jeder Static-Host funktioniert:

```bash
# lokal ausprobieren
cd game && python3 -m http.server 8080
# → http://localhost:8080 (am besten im iPhone-Safari: Teilen → "Zum Home-Bildschirm")
```

Deploy: `game/`-Ordner auf GitHub Pages, Netlify, Vercel o. ä. schieben — fertig.
App-Store-Release: siehe [`docs/IOS-APP-STORE.md`](docs/IOS-APP-STORE.md).

## Steuerung

- **Touch:** links lenken (virtueller Joystick), rechts GAS / STOP
- **Tastatur:** WASD/Pfeile, Leertaste = Bremse, P/Esc = Pause

## So funktioniert's

1. In Marker fahren = Job annehmen, gegen Timer abliefern, Serie aufbauen.
2. Heiße Jobs bringen Sterne — Sterne multiplizieren **alle** Einnahmen (×1–×5).
3. Verdientes ist **ungesichertes Trinkgeld**: Erst die **Waschanlage** (W-Marker) bankt
   es — und wäscht die Sterne ab. Eingekeilt? **Knöllchen-Selfie**, Trinkgeld weg.
4. Geheimtipp: im Schritttempo brav an der Siesta-Patrol vorbeischleichen baut Sterne
   schneller ab. *„Der? Niemals. Der blinkt ja."*

## Repository

| Pfad | Inhalt |
|---|---|
| `game/` | Das komplette Web-Spiel (5 Dateien + Icons, keine Dependencies) |
| `roblox/` | **Roblox-Portierung**: fertige Place-Datei + Luau-Quellen + Publish-Anleitung |
| `roblox-mcp/` | MCP-Server für Roblox-APIs (21 Werkzeuge: öffentlich + Open Cloud v2) |
| `roblox-game-kit/` | Luau-Baukasten: CarBuilder, BuildingBuilder, ShopKit, DesignPresets |
| `business/` | Backlog, Business Case, Finanzen, Messwerte, Prüflisten, Briefings |
| `docs/GDD.md` | Game Design Document |
| `docs/BERICHT-PHASE-*.md` | Projektberichte: Konzeption, Entwicklung, Web-Marketing, Roblox |
| `docs/IOS-APP-STORE.md` | Capacitor-Anleitung für den App-Store-Release |
| `marketing/` | ASO-Listing, Presse-Kit, Launch-Plan, Roblox-Marketing + Assets (Budget: 0 €) |

## Rechtliches / Stil-Abgrenzung

Turbo Siesta überträgt Genre-Vokabular (Küstenstadt, Palmen, Fahndungssterne, Minimap,
Satire) in eine eigene Welt mit eigenem Namen, eigenen Marken und eigener „Sunset-Pop"-
Optik. Keine Rockstar-Inhalte, -Namen, -Logos oder -Assets. PG-13: keine Waffen, niemand
wird verletzt.

---

© Cologne Music Group · Made with ♥ in Köln
