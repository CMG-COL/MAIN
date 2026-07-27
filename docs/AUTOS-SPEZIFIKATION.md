# Fahrzeuge — Technik-Recherche und Spezifikation

**Stand:** 26.07.2026 · **Für:** Design-Chat und Studio-Session
**Frage des CEO:** Mit welcher Technik bekomme ich die höchstqualitativen Autos ins Spiel?

---

## Teil 1 — Die drei Wege, mit Bewertung

### Weg A — Parts (was das Spiel heute macht)

Autos aus Roblox-Grundkörpern zusammengesetzt, per Skript gebaut. Kostenlos,
sofort änderbar, keine externen Werkzeuge.

**Aber:** Es sieht immer nach Bauklötzen aus. Für den Look aus deinem
Bildmaterial reicht das nicht. Und paradoxerweise ist es oft sogar *teurer* für
schwache Geräte als ein importiertes Mesh, weil viele Einzelteile mehr kosten als
ein optimiertes Modell.

→ **Nur noch für Platzhalter und Hintergrund-Deko.**

### Weg B — Mesh-Import mit PBR *(die Empfehlung)*

Ein in Blender modelliertes Auto wird als Mesh importiert und bekommt über
**SurfaceAppearance** echte Materialeigenschaften: Metallglanz, Rauheit,
Lackreflexionen, Normal Maps. Das ist der Weg, mit dem die nassen, spiegelnden
Wagen aus deinem Material im Spiel überhaupt möglich werden.

Importierte Mesh-Fahrzeuge sind deutlich hochwertiger als zusammengesetzte
Fahrzeuge — präzise Geometrie, und dabei oft nur ein Bruchteil der Rechenlast.

→ **Das ist der Weg für alles, was der Spieler aus der Nähe sieht.**

### Weg C — Cube 3D (Roblox' eigene KI)

Roblox hat mit **Cube 3D** eine eingebaute KI, die aus Textbeschreibungen direkt
texturierte 3D-Modelle erzeugt — in Studio über den KI-Assistenten oder per Skript
(`GenerationService:GenerateModelAsync`). Ein Part dient als Rahmen, der die Größe
vorgibt. Seit Februar 2026 gibt es zusätzlich eine 4D-Beta.

**Realistische Einschätzung:** Für schnelle Platzhalter und Hintergrundobjekte
brauchbar, für den Helden-Wagen nicht. KI-generierte Meshes haben unsaubere
Topologie und Texturen, die einer Nahaufnahme nicht standhalten.

→ **Gut zum Ausprobieren von Formen, nicht für das finale Auto.**

---

## Teil 2 — Verbindliche Spezifikationen

### Qualitätsstufen

Nicht jedes Auto braucht dieselbe Qualität. Entscheidend ist, **wie nah die
Kamera kommt** und **wie viele gleichzeitig im Bild sind**.

| Stufe | Wofür | Dreiecke | Material | Collision |
|---|---|---|---|---|
| **Held** | Spielerauto, Top-Auto im Lost District, Schaustücke vor dem Casino | 8.000–12.000 | volles PBR (4 Maps) | `Hull` |
| **Standard** | Siesta-Patrol, Rennteilnehmer | 3.000–5.000 | PBR mit Color + Normal | `Hull` |
| **Hintergrund** | Zivilverkehr, geparkte Autos | 800–2.000 | nur Farbtextur | `Box` |

**Harte Grenzen von Roblox:** Der Importer nimmt maximal 21.000 Dreiecke pro
Mesh im Einzelimport, rund 10.000 im Stapelimport. Für flüssiges Spielen auf dem
Handy gilt: Requisiten deutlich unter 5.000, Figuren um 10.000.

**Warum die Stufen wichtig sind:** Zehn Held-Autos gleichzeitig im Bild ruinieren
die Bildrate auf dem Handy — und die Bildrate entscheidet über die Session-Zeit,
also über die Reichweite. Ein Held-Auto plus neun Hintergrund-Autos sieht besser
aus als zehn mittelmäßige.

### Aufbau eines Held-Autos

Getrennte Meshes, damit Teile einzeln reagieren können:

| Teil | Zweck |
|---|---|
| Karosserie | Hauptmesh, trägt die Lackierung |
| Glas | eigenes Mesh, eigenes Material (durchsichtig, spiegelnd) |
| 4 Räder | einzeln, damit sie sich drehen |
| Scheinwerfer / Rücklichter | eigene Meshes mit Neon-Material |
| Heckflügel, Spiegel | optional, an der Karosserie befestigt |

### Texturen (PBR)

Vier Maps pro Fahrzeug, jeweils **1024×1024** (Held) bzw. **512×512** (Standard):

| Map | Was sie macht |
|---|---|
| **ColorMap** | Grundfarbe, Racing-Stripes, Aufkleber |
| **NormalMap** | Fugen, Kanten, Blechfalze — ohne zusätzliche Geometrie |
| **RoughnessMap** | **Der wichtigste für unseren Look** — steuert, wie nass und spiegelnd der Lack wirkt |
| **MetalnessMap** | Chrom, Felgen, Zierleisten |

Der Nass-Effekt aus deinem Bildmaterial entsteht fast vollständig über die
RoughnessMap. Ein dunkler Lack mit niedriger Rauheit sieht aus wie frisch
geregnet — genau der Look aus „Lost Area".

### Import-Einstellungen in Studio

| Einstellung | Wert | Warum |
|---|---|---|
| `CollisionFidelity` | **Hull** | Für Fahrzeuge ideal — genau genug, günstig zu berechnen |
| `RenderFidelity` | **Automatic** | Zeigt weniger Details, je weiter das Objekt weg ist |
| `CastShadow` | an bei Held, aus bei Hintergrund | Schatten kosten spürbar Leistung |
| `DoubleSided` | aus | Verdoppelt sonst unnötig die Last |

`PreciseConvexDecomposition` **nicht** für Fahrzeuge verwenden — das ist für
Geometrie gedacht, auf der Spieler laufen.

### Export aus Blender

- Format **`.fbx`** oder **`.gltf`**
- Maßstab: 1 Blender-Einheit = 1 Stud. Ein Sportwagen ist etwa **6 Studs breit,
  11 lang, 4 hoch**
- Nullpunkt in der **Mitte der Bodenfläche**, Nase zeigt **−Z**
- Alle Transformationen angewandt, saubere Namen ohne Umlaute
- Nur Quads und Dreiecke, keine N-Gons

---

## Teil 3 — Wo Autos im Spiel vorkommen

Die Orte, nach denen du gefragt hast — mit der jeweils nötigen Qualität.

| # | Ort | Kameranähe | Stufe | Anzahl | Anmerkung |
|---|---|---|---|---|---|
| 1 | **¡Pronto!-Hub / Startszene** | sehr nah | Held | 1 | Der erste Eindruck. Hier wird über den Look entschieden |
| 2 | **Spielerauto im Fahren** | mittel, Draufsicht | Held | 1 | Dauerhaft im Bild, muss aus der Vogelperspektive lesbar sein |
| 3 | **Siesta-Patrol** | mittel, in Bewegung | Standard | 1–5 | Muss auf einen Blick als Polizei erkennbar sein |
| 4 | **Zivilverkehr** | mittel bis fern | Hintergrund | ~11 | Dürfen dem Spielerauto nicht die Aufmerksamkeit stehlen |
| 5 | **Parkplätze** | fern | Hintergrund | 2–3 je Platz | Reine Deko |
| 6 | **Vorfahrt des Casinos** | nah, stehend | Held | 3–5 | Die Schaustücke aus deiner Geschichte. Hier darf geprotzt werden |
| 7 | **Lost District — das Top-Auto** | sehr nah, inszeniert | Held | 1 | Das erzählerisch wichtigste Objekt des Spiels |
| 8 | **Car Race — Startaufstellung** | nah | Held + Standard | 4–8 | Ein Held vorn, der Rest Standard |
| 9 | **Store-Grafiken und Trailer** | frei | ohne Grenze | — | Wird gerendert, nicht gespielt — hier gelten keine Budgets |

**Aussteigen:** Aktuell steigt man nur am Hub aus. Wenn Aussteigen an weiteren
Orten kommen soll (Casino, Club, Lost District), steigt die Anforderung an das
Auto dort auf **Held** — die Kamera kommt dann nah heran. Das ist eine
Design-Entscheidung mit Kosten, deshalb bewusst treffen.

---

## Teil 4 — Was der Design-Chat liefern soll

**Pro Fahrzeug ein Ordner** mit:

```
auto-jester-held/
  auto-jester-held.fbx        (oder .gltf)
  color.png                   1024x1024
  normal.png                  1024x1024
  roughness.png               1024x1024
  metalness.png               1024x1024
  NOTIZ.md                    Dreieckszahl, Stufe, wofür gedacht
```

**Reihenfolge der Fahrzeuge nach Wichtigkeit:**

1. **Jesters Auto** (Held) — das Top-Auto aus dem Lost District, zugleich das
   Spielerauto. Der wichtigste Gegenstand der ganzen Welt
2. **Siesta-Patrol** (Standard) — Wiedererkennung wichtiger als Detail
3. **Casino-Schaustücke** (Held, 3 Stück) — dürfen extrem sein
4. **Zivilverkehr** (Hintergrund, 4–6 Varianten)

**Verbindlich für alle:** Farben aus der Palette der Welt, damit nichts
herausfällt. Keine realen Automarken, keine erkennbaren Nachbauten existierender
Modelle — eigene Formen, die *an* eine Klasse erinnern (Roadster, Muscle,
Supersportler), ohne ein bestimmtes Auto zu sein.

---

## Teil 5 — Der ehrliche Vorbehalt

Ein Mesh-Auto mit vollem PBR sieht in Studio großartig aus. Auf einem vier Jahre
alten Android-Handy mit fünf davon im Bild kann es ruckeln. Deshalb:

**Jedes Held-Auto braucht eine Hintergrund-Variante.** Nicht als Sparmaßnahme,
sondern als Teil der Lieferung. Sonst müssen wir später zwischen „sieht gut aus"
und „läuft" wählen — und diese Wahl verliert man immer.

---

## Quellen

- [Fortgeschrittene Roblox-Meshes: PBR, Rigging, LOD](https://nilo.io/articles/advanced-roblox-custom-meshes)
- [Modelle in Roblox Studio importieren (2026)](https://3d-agent.com/roblox/studio)
- [Mesh-importierte Fahrzeuge im Vergleich](https://roblox-vehicles.fandom.com/wiki/Category:Mesh-imported_vehicles)
- [Roblox Cube 3D — Ankündigung](https://about.roblox.com/newsroom/2025/03/introducing-roblox-cube)
- [Cube 3D und Mesh Generation API](https://www.auganix.org/xr-news-roblox-launches-cube-3d-and-mesh-generation-api-for-ai-powered-3d-design/)
- [3D-Meshes für Roblox erstellen (2026)](https://blog.nilo.io/create-3d-meshes-roblox)
