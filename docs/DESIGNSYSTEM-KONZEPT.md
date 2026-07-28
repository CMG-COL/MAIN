# Designsystem für eine Welt — Konzept

**Stand:** 28.07.2026 · **Status:** Vorschlag zur Entscheidung
**Frage des CEO:** Wie legen wir das, was ich reingebe, als Designsystem an, aus
dem dann alles gebaut wird — nicht nur das eine Spiel?

---

## Der Kernbefund

Was du beschreibst, sind **zwei Systeme**, die häufig verwechselt werden:

| | **Kanon** (Weltenbibel) | **Designsystem** |
|---|---|---|
| Regelt | *Was wahr ist* | *Wie es aussieht und gebaut wird* |
| Inhalt | Figuren, Orte, Regeln der Welt, Zeitachse, Ton | Farben, Licht, Material, Typografie, Bausteine |
| Ändert sich | selten, mit Bedacht | laufend, in Versionen |
| Bricht bei Verstoß | die Glaubwürdigkeit | die Wiedererkennung |

Beides braucht es. In der Transmedia-Praxis heißt das erste **Production Bible**
oder **World Bible** — ein Dokument, das den Kanon über Produkte hinweg festhält,
die Jahre auseinanderliegen und von Teams gebaut werden, die sich nie treffen.
Genau deine Lage: Spiel, Videos, Musik, Social, mehrere Chats.

**Wir haben das erste schon** (`WELTENBIBEL.md`, `PLOT-UND-SZENEN.md`). Was fehlt,
ist das zweite — und zwar in einer Form, aus der **wirklich gebaut** wird.

---

## Der entscheidende Punkt: maschinenlesbar oder wertlos

Ein Designsystem, das nur aus Dokumenten besteht, wird nach zwei Wochen ignoriert.
Wer es ernst meint, macht die Grundwerte **maschinenlesbar** und **generiert**
daraus alles Weitere. Dann kann niemand mehr danebenbauen, weil die Farbe im
Spiel und die Farbe auf der Website aus derselben Zeile kommen.

Dafür gibt es seit Oktober 2025 einen stabilen Standard: das **Design Tokens
Format** der W3C Community Group (DTCG, Fassung 2025.10), getragen von Adobe,
Google, Meta und Figma. Eine JSON-Datei, `$value` und `$type` überall, mit
Referenzen, die jede Umwandlung überleben. Unterstützt von Figma, Style
Dictionary, Tokens Studio und anderen. Die Verbreitung lag 2026 bei 84 % der
befragten Teams — es ist der Normalfall, nicht die Ausnahme.

**Und wir haben faktisch schon angefangen:** `roblox/src/TSConfig.luau` enthält
bereits die Palette als Tabelle. Das ist eine Proto-Token-Datei — sie muss nur
herausgehoben und zur Quelle gemacht werden, statt eine Kopie zu sein.

---

## Vorschlag: vier Schichten

### 1 · Kanon — was wahr ist
`docs/WELTENBIBEL.md`, `docs/PLOT-UND-SZENEN.md`
Figuren, Orte, Regeln, Ton. Ändert sich nur durch CEO-Entscheidung.
**Status: existiert.**

### 2 · Tokens — die Grundwerte, maschinenlesbar
`design/tokens.json` im DTCG-Format. Nicht nur Farben:

| Gruppe | Beispiele |
|---|---|
| **color** | Coral-Rush, Siesta-Lila, Neon-Flamingo, Patrol-Blau … |
| **light** | Uhrzeit der Dämmerung, Himmelsfarbe, Nebeldichte, Bloom-Stärke |
| **material** | Rauheit von nassem Asphalt, Metallwert von Chrom, Glasfarbe |
| **type** | Display- und Textschrift, Größenraster, Laufweite |
| **motion** | Kameranachlauf, Beschleunigungskurven, Blinkfrequenz |
| **space** | HUD-Abstände, Sicherheitsränder |

Das Besondere hier: **Licht und Material gehören mit hinein.** Bei einer Welt,
die von „nass und magenta" lebt, ist die Rauheit des Asphalts genauso ein
Markenwert wie die Hausfarbe.

### 3 · Regeln — was Tokens nicht ausdrücken können
`docs/DESIGN-BRIEFING.md`
Komposition, Kameranähe, Silhouette-vor-Detail, „keine Tagszenen", was den Stil
kaputt macht. Prosa, weil es Urteil verlangt.
**Status: existiert, heute aktualisiert.**

### 4 · Bausteine — was daraus gebaut wird
| Baustein | Wofür |
|---|---|
| **UI-Kit** | HUD, Menüs, Website, Nachrichtenportal |
| **3D-Kit** | Fahrzeuge, Gebäude, Requisiten (Specs in `AUTOS-SPEZIFIKATION.md`) |
| **Bild-Kit** | Prompt-Bausteine für Bildgenerierung, aus den Tokens abgeleitet |
| **Bewegtbild-Kit** | Farbkorrektur-Vorgabe (LUT), Titel, Übergänge |

---

## Der Generator — hier entsteht der eigentliche Nutzen

Eine Quelle, viele Ziele. Ein Skript liest `design/tokens.json` und schreibt:

```
design/tokens.json  (die einzige Wahrheit)
        │
        ├──▶  roblox/src/TSConfig.luau        Farben, Licht, Material fürs Spiel
        ├──▶  game/tokens.css                 CSS-Variablen für Web und Website
        ├──▶  design/figma-tokens.json        Import für Figma
        ├──▶  design/prompt-kit.md            Prompt-Bausteine für Bildgenerierung
        └──▶  design/preview/*.html           sichtbare Vorschau je Baustein
```

**Der Prompt-Kit ist der unterschätzte Teil.** Aus den Tokens lassen sich feste
Textbausteine erzeugen — „wet asphalt, magenta dusk sky #FF4FA0, teal shadows,
silhouetted palms, warm window lights" — die der Design-Chat jedem Bildauftrag
voranstellt. Damit sehen generierte Bilder aus wie dieselbe Welt, ohne dass
jemand die Regeln im Kopf haben muss.

---

## Die Begriffe in Claude Design (bestätigt vom Design-Chat, 28.07.2026)

| Begriff | Was es ist | Inhalt |
|---|---|---|
| **Projekt** | Der Arbeitsraum. Chat, Dateien, Deliverables zu einem Vorhaben | Konkrete Artefakte: dieses Deck, dieser Prototyp |
| **Designsystem** | Ein Projekt, das anderen Projekten **als visuelle Referenz angehängt** wird | Farben, Typografie, Spacing, Komponenten, Assets — **nur Stil, keine Inhalte** |
| **Template** | Wiederverwendbare Vorlage für ein **Format** | Fertige Struktur plus Platzhalter |

In einem Satz: **Designsystem = wie es aussieht. Template = wie es aufgebaut ist.
Projekt = was konkret entsteht.**

**Die zwei Regeln, die daraus folgen:**

1. **Ein Designsystem pro Marke oder Welt** — nicht pro Farbvariante. Varianten
   gehören als Themes bzw. Token-Sets **hinein**, nicht daneben.
2. **Templates liegen im Designsystem**, nicht in den Projekten — dann erben sie
   die Tokens automatisch. Projekte sind nur noch die echten Deliverables, mit
   angehängtem Designsystem.

**Anti-Pattern, ausdrücklich benannt:** Stil direkt im Projekt entwickeln. Er ist
dann nicht wiederverwendbar und driftet mit jedem neuen Projekt auseinander.

Das deckt sich mit dem Token-Ansatz oben: Was hier „Themes und Token-Sets" heißt,
ist genau die DTCG-Struktur — eine Quelle, mehrere Ausprägungen.

## Wo das System lebt

Das passt genau auf die Brücken, die bereits geprüft sind:

| Ort | Rolle |
|---|---|
| **Repo** | Quelle: `tokens.json`, Generator, Regeln. Hier wird geändert |
| **claude.ai/design** | Sichtbares System: Vorschau je Baustein, blätterbar. Ich kann direkt hineinschreiben (Werkzeug `DesignSync`) |
| **Figma** | Layouts und Feinarbeit, Tokens importiert |
| **Drive** | Medien: Bilder, Videos, Musik |

**Das ist der Punkt, an dem `DesignSync` wirklich nützlich wird:** Nicht als
Datenkanal für 3D-Modelle, sondern als *Schaufenster* — du blätterst auf
claude.ai/design durch Farben, HUD-Bausteine, Fahrzeugklassen und siehst, ob es
zusammenpasst. Gebaut wird weiter aus dem Repo.

> **Merkposten (CEO, 28.07.2026):** Claude Design kann **jeden MCP aus dem
> claude.ai-Konto** nutzen. Damit hat der Design-Chat dieselben Connectors wie
> diese Session — Google Drive, Figma, Canva und weitere. Praktische Folge: Kein
> Umweg über Chris als Boten. Der Design-Chat kann direkt in dieselben Ablagen
> schreiben, aus denen ich lese; laut Produktdoku kann Claude Design außerdem
> **Repos verknüpfen** und damit Spezifikationen live lesen statt als Kopie.
> Beim Aufsetzen des Design-Kreislaufs berücksichtigen.

---

## Was ich vorschlage zu tun

**Zug 1 — Tokens herausheben** (kann ich sofort, ohne dich)
`design/tokens.json` anlegen: Farben aus der bestehenden Palette, dazu Licht und
Material für „Dämmerung nach dem Regen". Generator schreiben, der `TSConfig.luau`
und `tokens.css` daraus erzeugt. Ab dann ist die Palette an *einer* Stelle.

**Zug 2 — Prompt-Kit ableiten** (kann ich sofort)
Textbausteine für den Design-Chat, damit generierte Bilder auf Stil bleiben.

**Zug 3 — Sichtbares System auf claude.ai/design** (kann ich, dauert länger)
Vorschauseiten je Baustein, über `DesignSync` hochgeladen.

**Zug 4 — Rückfluss organisieren** (braucht deine Ordnerstruktur)
Wie kommt Neues vom Design-Chat in die Tokens? Vorschlag: Er liefert Material
plus eine Notiz „diese Farbe ist neu"; ich nehme sie in die Tokens auf oder
begründe, warum nicht.

---

## Die ehrliche Einschränkung

Ein Designsystem zahlt sich nur aus, wenn **wirklich daraus generiert wird**.
Wenn Werte weiter von Hand kopiert werden, ist es ein hübsches Dokument, das
niemand liest, und der Aufwand war umsonst. Der Generator ist deshalb wichtiger
als jede Dokumentseite — und er ist der Teil, den ich bauen kann.

Zweite Einschränkung: Für **Bildgenerierung** gibt es keine echte Token-Bindung.
Ein Prompt-Kit erhöht die Trefferquote deutlich, garantiert aber nichts. Die
Auswahl bleibt Handarbeit — man verwirft mehr, als man behält.

---

## Quellen

- [Design Tokens Community Group (W3C)](https://www.w3.org/community/design-tokens/) · [designtokens.org](https://www.designtokens.org/)
- [DTCG-Format in Style Dictionary](https://styledictionary.com/info/dtcg/)
- [Design Tokens mit dem W3C-Standard, 2026](https://malakavenu.com/articles/design-tokens-w3c-2026)
- [Praxisleitfaden W3C-DTCG-Tokens](https://tasteprofile.io/blog/w3c-dtcg-design-tokens-practical-guide)
- [Transmedia Production Bible — Vorlage](https://www.personalizemedia.com/dummies-guide-to-writing-a-transmedia-production-bible/)
- [Production Bible, Leitfaden 2026](https://storyflow.so/blog/what-is-a-production-bible-complete-guide)
- [Screen Australia — Transmedia Production Bible Template (PDF)](https://www.screenaustralia.gov.au/wp-content/uploads/2026/02/Transmedia-production-bible-template.pdf)
