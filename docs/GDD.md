# TURBO SIESTA — Game Design Document (v1.0)

> **Slow town. Full throttle.**
> Top-Down-Arcade-Fahrspiel für iPhone (HTML5/PWA) · kostenlos · ohne Werbung · PG-13

## 1. High Concept

**Turbo Siesta** ist Crazy-Taxi-Adrenalin im Körper eines Lieferfahrers: In **Solara Bay**,
der verschlafensten Küstenstadt der Welt, gilt per Stadtverordnung Dauer-Siesta — und du
bist der einzige Mensch, der es eilig hat. Die Liefer-App **„¡Pronto!"** verspricht
Zustellung in Minuten; du musst dieses Versprechen einlösen, während die **Siesta-Patrol**
über die Ruhe wacht.

Der Design-Stil überträgt den Vibe von GTA V (sonnige Küstenstadt, Palmen, Satire,
Fahndungssterne, runde Minimap) in eine **eigene, originale** Candy-Arcade-Optik
(„Sunset-Pop") — ohne jegliche Rockstar-IP, ohne Gewalt, ohne Waffen.

## 2. Unique Selling Proposition

**Das Fahndungslevel ist dein Score-Multiplikator.**
Ruhestörungs-Sterne (1–5) sind keine Strafe, sondern Einsatz: Jede Einnahme wird live mit
der Sternzahl multipliziert (×1–×5). Aber: Alles Verdiente ist zunächst **ungesichertes
Trinkgeld**. Gebankt wird nur in der **Waschanlage** — die zugleich die Sterne abwäscht.
Wirst du vorher von der Siesta-Patrol eingekeilt: **Knöllchen-Selfie**, das ungesicherte
Geld ist weg, das gebankte bleibt. Risiko-Ökonomie wie am 90er-Automaten, komplett PG-13.

Zweiter Signature-Move: der **Musterbürger-Trick**. Sterne wird man auch los, indem man
demonstrativ brav im Schritttempo an der Patrol vorbeischleicht — „Der? Niemals.
Der blinkt ja."

## 3. Setting & Welt

**Solara Bay** — ewige Golden Hour, Work-Life-Balance ins Absurde getrieben. Die Satire
lebt in der Welt, nie in Cutscenes: Radio-Ticker („Bürgermeisterin eröffnet dritte
Hängematten-Spur"), fiktive Marken (Möbelhaus **BJÖRNSTAD**, Krypto **$SOLCOIN**,
Saft-Kette **Kale Force One**).

### Distrikte
| Distrikt | Charakter |
|---|---|
| **La Promenada** | Strandmeile mit Influencern und weiten Driftkurven für lange Combo-Linien |
| **Mercado Viejo** | Enge Marktgassen: beste Abkürzungen, dichteste Beinahe-Unfälle, höchstes Sterne-Risiko |
| **Marina Bling** | Yachthafen der Krypto-Bros; hier starten die fetten, heißen Jobs |
| **Colina Vista** | Villen-Viertel mit Golden-Hour-Spots, Ziel aller Influencer-Shuttles |

## 4. Core Loop

1. **Job annehmen**: 3 Auftrags-Marker auf der Karte (drive-through, kein Menü).
2. **Abliefern gegen Timer**: Zielmarker + Pfeil + Minimap; Combo-Serie steigert den Lohn.
3. **Risiko steuern**: Heiße Jobs zahlen doppelt, starten aber mit Sternen. Sterne
   multiplizieren ALLE Einnahmen — solange man nicht erwischt wird.
4. **Sichern**: Waschanlage bankt das Trinkgeld, wäscht Sterne ab, verkauft Upgrades.
5. **„Noch eine Runde"**: sofort zurück auf die Straße.

## 5. Systeme (implementiert in v1.0)

- **Fahrphysik**: Arcade-Handling (Beschleunigung, Bremse/Rückwärts, geschwindigkeits-
  abhängige Lenkung, Offroad-Verlangsamung, Kollisions-Sliding, Neon-Driftspuren).
- **Missionen** (5 Typen): Churros, Eis, Influencer-Shuttle (+0,6 Sterne), Krypto-Kurier
  (+1 Stern), Heiße Jobs (+1,6 Sterne, doppelter Lohn). Lohn = Basis × Distanz ×
  Serien-Multiplikator × Sterne-Multiplikator.
- **Siesta-Patrol**: Verfolger-KI mit Hindernis-Sonden; Einkeilen bei Schritttempo →
  Knöllchen. Entkommen durch Abstand — oder schneller per Musterbürger-Trick.
- **Wallet/Bank**: Ungesichertes Trinkgeld (HUD groß) vs. Bank (persistent, localStorage).
- **Passanten**: hechten komödiantisch weg (nie verletzt), Sprechblasen („OHA!", „¡Uy!"),
  **Schulterblick-Bonus** für Beinahe-Unfälle.
- **Verkehr**: Spurfolgende Zivil-Autos, Hupen, Anrempeln mit Trudel-Animation.
- **Upgrades**: Turbotank, Grip-Reifen, Alphorn-Hupe (größeres Bonus-Fenster),
  Feder-Stoßstange (Rempler-Verzeihung). Kosten skalieren ×1,6 pro Stufe.
- **Sound**: WebAudio-Synthese (Motor, Zweiton-Sirene, Kassen-Blips) — keine Assets,
  iOS-Unlock per erster Berührung.
- **Stadt**: 112×112 Kacheln, deterministisch generiert (fester Seed), 4 Distrikte,
  Strand + Meer, Parks mit Palmen, Parkplätze, Container-Docks.

## 6. Art Direction „Sunset-Pop"

Ewige Golden Hour: **Asphalt in warmem Lila statt Grau**, lange weiche Schatten in eine
Richtung, flache Vektorformen, Comic-Onomatopoesie statt Gewalt. HUD im
Motel-Neonschild-Stil: runde Minimap, flackernde Neon-Sterne, Kassenbon-Ticker.

| Farbe | Verwendung |
|---|---|
| `#FF5E5B` Coral-Rush | Spielerauto, CTA |
| `#FFC145` Golden-Hour-Gelb | Sterne, Cash, Timer |
| `#FF8C42` Sunset-Orange | Himmelslicht, Marker |
| `#3D2C5E` Siesta-Lila | Asphalt & Schatten |
| `#00B8A9` Lagunen-Türkis | Meer, Wasser |
| `#2E9E63` Palmen-Grün | Vegetation |
| `#F9E9D0` Stuck-Creme | Gebäude, Strand |
| `#4EA8FF` Patrol-Blau | Siesta-Patrol |
| `#FF4FA0` Neon-Flamingo | Driftspuren, Combo |

## 7. Abgrenzung zu GTA (IP-Sicherheit)

Übertragen wird ausschließlich das **Genre-Vokabular** (Küstenstadt, Palmen,
Fahndungssterne, Minimap, Satire) in eigener Ausführung: eigener Name, eigene Stadt,
eigene Marken, eigene Farbwelt, eigener Ton (PG-13-Komödie statt Crime-Drama), keine
Charaktere/Orte/Logos/Assets/Schriftzüge von Rockstar. Fahndungssterne und Minimaps sind
genre-übliche Spielmechaniken (u. a. Driver, Saints Row, Retro City Rampage).

## 8. Roadmap (nach v1.0)

- **v1.1 „Daily Rush"**: täglicher globaler Seed mit identischer Job-Sequenz,
  teilbarer Score-Card (Canvas-Screenshot).
- **v1.2 „Schichten"**: optionaler 3-Minuten-Schichtmodus mit Stempelkarten-Abrechnung
  und „Noch eine Schicht"-Button unterm Daumen.
- **v1.3 „Big Job Freitag"**: wöchentlicher mehrstufiger Heist (z. B. „Die
  Gartenzwerg-Connection") mit Leaderboard.
- **App Store**: Capacitor-Wrap (siehe `docs/IOS-APP-STORE.md`), sobald organische
  Traktion den 99-USD-Developer-Account rechtfertigt.

## 9. Technik

Ein einziges Canvas-2D-Spiel ohne Frameworks und ohne externe Assets (~1.500 Zeilen JS),
als PWA installierbar (Service Worker, Manifest, Icons), offline-fähig, Savegame in
localStorage. Ziel: 60 fps auf iPhone; Culling über räumliche Buckets, gecappte
Entity-Zahlen, keine Pro-Frame-Allokationen in heißen Pfaden.
