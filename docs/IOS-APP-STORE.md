# Turbo Siesta → iOS App Store (Capacitor-Anleitung)

Das Spiel läuft ab Tag 1 kostenlos als PWA im iPhone-Safari („Zum Home-Bildschirm").
Dieser Weg beschreibt den **optionalen** App-Store-Release, sobald sich der
Apple-Developer-Account (99 USD/Jahr — der einzige Kostenpunkt des Projekts) lohnt.

## Voraussetzungen

- macOS mit Xcode (aktuell), Apple-Developer-Account
- Node.js ≥ 18

## Schritte

```bash
# 1. Projekt anlegen (einmalig, außerhalb dieses Repos oder unter /app-shell)
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/ios

# 2. Capacitor initialisieren
npx cap init "Turbo Siesta" "com.colognemusicgroup.turbosiesta" --web-dir=game

# 3. Web-Assets aus diesem Repo als web-dir verwenden
#    (game/ enthält index.html, game.js, style.css, icons/ — komplett self-contained)
npx cap add ios
npx cap copy ios

# 4. Xcode öffnen und konfigurieren
npx cap open ios
```

## In Xcode einstellen

1. **Signing & Capabilities**: Team wählen, Bundle-ID `com.colognemusicgroup.turbosiesta`.
2. **Display Name**: „Turbo Siesta".
3. **Orientierung**: Portrait + Landscape erlauben (das Spiel unterstützt beides).
4. **Statusbar**: verstecken bzw. `black-translucent` (das Spiel zeichnet Vollbild und
   berücksichtigt Safe-Areas selbst).
5. **App-Icons**: `game/icons/icon-512.png` als Basis in den Asset-Katalog (Xcode
   generiert die Größen; alternativ https://icon.kitchen mit derselben Datei).

## Hinweise

- **Kein Tracking, keine Ads, keine IAP** → App-Privacy-Formular ist trivial
  („Daten werden nicht erhoben"), Altersfreigabe 9+/12+ (Comic-Verfolgungsjagden).
- Der Service Worker ist im Capacitor-Container wirkungslos (dort lädt alles lokal) —
  kein Änderungsbedarf, er schadet nicht.
- localStorage funktioniert im Container unverändert (Savegames bleiben erhalten).
- Vor dem Review-Einreichen: `orientation`-Verhalten auf echtem Gerät testen und die
  Store-Texte aus `marketing/APP-STORE-LISTING.md` übernehmen.
