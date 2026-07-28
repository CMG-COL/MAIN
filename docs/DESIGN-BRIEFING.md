# Design-Briefing — Turbo Siesta / Solara Bay

**Für:** den Design-Chat und alle, die Material für diese Welt bauen
**Stand:** 26.07.2026

Lies zuerst `WELTENBIBEL.md` (die Welt) und dann dieses Dokument (was konkret
gebraucht wird). Der Spiel-Aufbau steht in `GDD.md`.

---

## Der Look: „Sunset-Pop"

Der Vibe eines sonnigen Open-World-Fahrspiels — aber **komplett eigenständig
umgesetzt**, nie kopiert. Keine Marken, Logos, Fahrzeugformen oder Schriftzüge,
die an bestehende Spiele erinnern.

**Die drei Regeln, die den Stil ausmachen:**

1. **Ewige Golden Hour.** Die Sonne steht immer knapp über dem Horizont. Alles
   wirft lange, weiche Schatten in *eine* Richtung. Kein Mittag, keine Nacht.
2. **Asphalt ist lila, nicht grau.** Der wichtigste Trick des Stils: Die Straße
   nimmt das Abendlicht auf. Grau würde die ganze Welt tot machen.
3. **Flache, klare Formen mit satten Farben.** Bonbonfarben statt Realismus,
   lesbare Silhouetten statt Detailtreue. Es soll auf einem Handybildschirm in
   einer Zehntelsekunde erkennbar sein.

### Palette

| Farbe | Hex | Verwendung |
|---|---|---|
| Coral-Rush | `#FF5E5B` | Spielerauto, wichtigste Aktionen |
| Golden-Hour-Gelb | `#FFC145` | Sterne, Geld, Timer, Straßenmarkierung |
| Sunset-Orange | `#FF8C42` | Himmelslicht, Marker |
| Siesta-Lila | `#3D2C5E` | **Asphalt und Schatten** |
| Lagunen-Türkis | `#00B8A9` | Meer, Pools |
| Palmen-Grün | `#2E9E63` | Vegetation |
| Stuck-Creme | `#F9E9D0` | Gebäude, Strand |
| Patrol-Blau | `#4EA8FF` | Siesta-Patrol, Blaulicht |
| Neon-Flamingo | `#FF4FA0` | Driftspuren, Combo, Neonschilder |

### Ton

Komödie, nie Bedrohung. Wenn etwas schiefgeht, ist es peinlich, nicht brutal.
Niemand wird verletzt — Passanten hechten mit Sprechblasen („OHA!", „¡Uy!") zur
Seite, die Polizei macht ein Knöllchen-Selfie statt einer Verhaftung.

---

## Die Welt: Solara Bay

Küstenstadt, vier Distrikte:

| Distrikt | Charakter |
|---|---|
| **La Promenada** | Strandmeile, Influencer, weite Kurven |
| **Mercado Viejo** | Enge Marktgassen, beste Abkürzungen, höchstes Risiko |
| **Marina Bling** | Yachthafen, Neureiche, die fetten Aufträge |
| **Colina Vista** | Serpentinen zu den Villen, Golden-Hour-Aussichtspunkte |

Fiktive Marken der Welt (parodistisch, keine realen Vorbilder erkennbar):
Möbelhaus **BJÖRNSTAD**, Saftkette **Kale Force One**, Liefer-App **¡Pronto!**,
Sender **Radio Solara**.

---

## Was konkret gebraucht wird

### Vorrang 1 — Fahrzeuge

Das Spielerauto ist das, was der Spieler die ganze Zeit ansieht. Aktuell ist es
ein einfacher Kasten und damit die größte Schwachstelle.

- **Spielerauto**: Sportwagen-Silhouette, getaperte Nase, breite Schultern,
  Heckflügel, sichtbare Felgen, Racing-Stripes. Farbe Coral-Rush.
- **Siesta-Patrol**: dieselbe Formensprache, weiß mit Patrol-Blau, Blaulicht.
- **Zivilverkehr**: 4–6 Varianten in den Palettenfarben, schlichter als das
  Spielerauto — sie dürfen ihm nicht die Aufmerksamkeit stehlen.

### Vorrang 2 — Stadt

- Gebäude je Distrikt (Downtown-Hochhäuser, Strandbauten, Villen, Markthallen)
- Palmen, Straßenmöbel, Neonschilder der fiktiven Marken
- Die **¡Pronto!-Plaza** als Startpunkt und die **Waschanlage** als
  Wiedererkennungsort — beides sind zentrale Spielorte

### Vorrang 3 — Die Figur

Der Künstler, der zugleich Hauptfigur ist. Aussehen, Kleidung, Wiedererkennung
über alle Kanäle (Spiel, Video, Social). **Noch nicht entschieden** — siehe
offene Punkte in der Weltenbibel.

### Bereits fertig, als Stilreferenz nutzbar

In `04-MARKETING/roblox-assets/`: App-Icon und drei Store-Grafiken im
Sunset-Pop-Look, mit Sportwagen-Silhouetten und Logo-Lockup. Sie zeigen, wie das
Spiel aussehen *soll* — die 3D-Umsetzung muss dorthin aufschließen.

---

## Technische Rahmenbedingungen

**Für Roblox:**
- Zielgerät ist das **Handy**. Sparsame Geometrie, wenige Teile pro Objekt,
  keine unnötigen Details. Ein flüssiges einfaches Modell schlägt ein
  ruckelndes schönes.
- Modelle als `.rbxm` oder als Luau-Bauanleitung. Beides brauchbar.
- Materialien: Roblox-Standardmaterialien reichen. Neon sparsam einsetzen —
  es ist im Sunset-Pop der Akzent, nicht die Grundfarbe.
- Farben exakt aus der Palette oben, damit alles zusammenpasst.

**Für 2D (Web, Social, Video):** keine technischen Grenzen, gern in
Originalauflösung.

---

## Was den Stil kaputt macht

- Grauer Asphalt
- Realistische Fahrzeug- oder Häuserproportionen
- Alles, was an bestehende Spielemarken erinnert — Namen, Logos, Wagenformen
- Gewaltdarstellung, Waffen, Blut
- Zu viele Details: Auf dem Handy wird daraus Matsch

---

## Wo die Ergebnisse hin sollen

In den Sammelordner, den Chris angelegt hat. Dateien gern mit sprechenden Namen
(`auto-spieler-v1.rbxm`, `gebaeude-villa-01.rbxm`). Eine kurze Notiz dazu, was es
ist und wofür gedacht, spart später Rückfragen.

**Und die Regel gilt auch hier: Nichts wird veröffentlicht, bevor Chris es
freigibt.** Auch keine Vorschauen, keine Moodboards auf Social.
