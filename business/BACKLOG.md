# Backlog — Turbo Siesta

Ein Zug alle paar Tage. Oberster nicht blockierter Eintrag gewinnt. Stränge:
**P** = Produkt/Grafik · **M** = Monetarisierung · **G** = Growth.

**Vorrangregel:** Solange Session-Zeit, D1 oder Like-Ratio unter Ziel liegen, hat
P Vorrang vor M und G (Begründung in `BUSINESS-CASE.md` Abschnitt 3).

## Jetzt (nächste Züge, in dieser Reihenfolge)

| # | Strang | Zug | Messgröße | Status |
|---|---|---|---|---|
| 1 | — | **Spiel auf Public schalten** + Store-Seite füllen (Icon, 3 Thumbnails, Beschreibung, Genre, Fragebogen, API-Services) | Spiel ist öffentlich erreichbar | offen · CEO (lokal) |
| 2 | P | **Design-Upgrades einspielen** (Modelle aus dem Design-Chat) → neue `.rbxlx`, in Studio testen, Update publishen | Optik entspricht den Thumbnails | wartet auf Assets |
| 3 | P | **Erste 60 Sekunden**: Spawn direkt im Auto mit aktivem Erstauftrag statt daneben | Abbruch in Minute 1 ↓ | offen |
| 4 | G | **Erste Messwerte erfassen** (Creator Dashboard → `MESSWERTE.md`) | Basiswerte existieren | blockiert durch #1 |
| 5 | M | **Kosmetik-Pass „Lackierungen"** (49–99 R$) via ShopKit einbauen | Zahlerquote in % | blockiert bis Haltequoten ok |
| 6 | P | **Zivilverkehr + Feder-Stoßstange** (Parität zur Web-Fassung) | Session-Zeit ↑ | offen |
| 7 | G | **3 Clips drehen** (Musterbürger-Trick, Knöllchen, Alphorn-Hupe) | Klicks auf Spiel-Link | offen |
| 8 | P | **Radio Solara mit eigener CMG-Musik** — 3–4 Instrumental-Loops, Sender-Umschalter im Auto, Mute-Knopf, Credits mit Link | Session-Zeit ↑ | wartet auf Tracks vom CEO |

### Musik-Strategie — drei Wege, in dieser Reihenfolge prüfen

**Weg A — Lizenzierter Katalog über Partner-Distributor (bevorzugt, offen)**
Roblox betreibt eine **Music Top 100** (Beta), gerankt nach *Playtime* und
*Adoption* (Zahl der Experiences, die den Track nutzen). Sie umfasst lizenzierte
Musik, die über Partner-Distributoren mit ISRC eingespeist wird — genannt sind
**DistroKid**, Monstercat, APM, Clippsly.

Wenn der bestehende CMG-Katalog über DistroKid für Roblox freigegeben werden
kann, löst das das Fingerprint-Problem vollständig und macht die Musik zugleich
chart-fähig. Das eigene Spiel wäre der erste Playtime-Lieferant.
→ **Zu klären durch den CEO im DistroKid-Konto.** Offene Punkte: Verfügbarkeit
der Roblox-Option, Konditionen, wie freigegebene Tracks in der eigenen Experience
referenziert werden.

**Weg B — Eigene Audio-Uploads (funktioniert, aber nur für neues Material)**
Selbst hochgeladene Assets laufen durch Audible-Magic-Fingerprinting. Alles, was
je über einen Distributor lief, wird getroffen; einen Eigentumsnachweis gibt es
nicht, Treffer zählen gegen den Account. Deshalb hier ausschließlich **neu
produzierte, nie distribuierte** Instrumentals.

**Weg C — Web-Fassung**
Kein Scanner, eigenes Hosting. Der bestehende Katalog kann dort uneingeschränkt
laufen und als Schaufenster dienen.

**Werbe-Regel beachten:** Seit 4. Mai 2026 gilt bei Roblox als Werbung, was
plattformfremde Produkte bewirbt — ein Spotify-Verweis im Spiel fällt darunter.
Im Spiel deshalb nur on-platform nennen (Titel, Interpret, „Radio Solara
präsentiert"), harte Links in die Store-Beschreibung.

### Zug 8 im Detail — Radio Solara

**Warum:** Musik ist in Fahrspielen einer der stärksten Verweilgründe, und
Session-Zeit ist der wichtigste Ranking-Treiber. Eigene CMG-Musik kostet nichts,
gehört uns und ist nicht kopierbar. „Radio Solara" existiert bereits als
Satire-Ticker in der Fiktion.

**Was der CEO liefert:** 3–4 Instrumental-Loops, je 60–120 Sekunden, nahtlos
loopbar, Sunset-Pop-Ton (warmer Synthwave mit Latin-Einschlag). Als MP3 oder OGG,
≤ 48 kHz, Stereo, nicht übersteuert.

**Rechte-Realität (wichtig, korrigiert):** Roblox prüft mit **Audible Magic**
(Audio-Fingerprinting) gegen eine Datenbank veröffentlichter Musik. Ein Track,
der über einen Distributor bei Streaming-Diensten liegt, ist dort erfasst — der
Scanner schlägt an und **erkennt nicht, dass der Uploader der Rechteinhaber ist.**

Es gibt **keinen Weg, Eigentum nachzuweisen.** Entwickler fordern diese Funktion
seit Jahren, sie existiert nicht; nur ein allgemeiner Einspruch über „Violations
& Appeals", langsam und ohne Garantie. Wiederholte IP-Treffer zählen als
Verstöße gegen den Account, nicht nur gegen die Datei — das Spiel selbst steht
damit im Risiko. Selbst Musik ohne jede Online-Präsenz wird laut Forenberichten
falsch positiv getroffen.

**Konsequenz — Zwei-Kanal-Regel:**
- **Roblox:** ausschließlich neu produzierte Instrumentals, die **nie** bei einem
  Distributor waren und es auch später nicht werden. Kein Fingerprint, kein Treffer.
- **Web/PWA:** dort gibt es keinen Scanner (eigenes Hosting) — hier kann der
  bestehende CMG-Katalog laufen und als Schaufenster für die Musik dienen.

**Plattform-Rahmen:** Upload kostenlos, 100 Assets/30 Tage (2.000 bei
ID-Verifizierung), max. 20 MB und 7 Minuten je Datei. Neue Uploads sind privat —
die Experience muss explizit freigegeben werden.

**Umsetzung:** Sender-Umschalter im Auto, Mute-Knopf (Pflicht — nicht
abschaltbare Musik kostet Likes), Credits im HUD mit Link in der
Store-Beschreibung. In der Web-Fassung dieselben Loops, komprimiert, damit die
Ladezeit unter einer Sekunde bleibt.

**Ausbaustufen (jeweils eigener Zug, nach Messwerten priorisieren):**

| Stufe | Inhalt | Warum |
|---|---|---|
| 8a | Grundton für Roblox: Motor, Sirene, Kasse, Crash, Hupe — die Roblox-Fassung hat aktuell **gar keinen Ton** | Basis; ohne Motorsound fühlt sich Fahren tot an |
| 8b | Radio mit 3–4 Sendern, Umschalter, Mute | Session-Zeit |
| 8c | Moderationen zwischen den Tracks, die nebenbei Spielmechanik erklären („der Musterbürger-Trick") | Onboarding, das nicht wie Onboarding klingt — zahlt auf die erste Minute ein |
| 8d | Szenenbasierte Musik: ruhig beim Cruisen → Spannungs-Layer ab 1 Stern → Verfolgungsmusik ab 3 → Erfolgs-Jingle in der Waschanlage | Musik als Feedback statt als Tapete |
| 8e | Club-Zone in La Promenada oder Marina Bling mit eigenem Track, Licht, Tanz-Emotes, Lieferaufträge dorthin | freiwilliger Verweilort = direkte Session-Zeit |

**Nebeneffekt Marketing:** Cross-Promotion in beide Richtungen — das Spiel
bewirbt die Musik, die Musikkanäle bewerben das Spiel.

## Bewertet, aber noch nicht eingeplant

- **P** Konvoi-Bonus und geteilte Sterne-Eskalation (Co-Play-Hebel, treibt den Freunde-Effekt)
- **P** Haptik/Sound-Ausbau in Roblox (braucht hochgeladene Audio-Assets)
- **G** „Night Shift"-Event als Wochen-Update mit eigenem Thumbnail
- **G** Roblox-Gruppe als Heimat für künftige Spiele + Gruppen-Bonus
- **M** VIP-Pass (199 R$) — erst wenn Zahlerquote aus #5 bekannt
- **P** `roblox-game-kit` einbinden: CarBuilder, BuildingBuilder, ShopKit (liegt auf Branch `claude/mcp-roblox-bd7r3q`) — **Entscheidung CEO offen**, ob in den Hauptbranch übernommen wird

## Abgelehnt

| Idee | Grund |
|---|---|
| Kaufbares Tempo-/Grip-Upgrade | Pay-to-win bei aktiver Rangliste, zerstört Like-Ratio |
| Zufalls-Lackkisten | Zufallskäufe an minderjährige Zielgruppe |
| Werbebudget vor erreichten Haltequoten | Verbrennt Geld, siehe `BUSINESS-CASE.md` Abschnitt 2 |
| Fremde Spielnamen als Store-Tags | Verstoß gegen Roblox-Metadatenregeln |

## Blocker

| Blocker | Wirkung | Auflösung durch |
|---|---|---|
| Roblox aus Cloud-Session gesperrt | Kein Publishing, keine automatischen Sanity Checks, MCP-Tools unbenutzbar | Netzwerk-Freigabe `*.roblox.com` **oder** Arbeit in lokaler Session |
| Werbebudget-Obergrenze nicht gesetzt | Szenario B/C nicht freigegeben | CEO |
| Zeithorizont nicht gesetzt | Abbruchkriterien ohne Frist | CEO |
