# Backlog — Turbo Siesta

Ein Zug alle paar Tage. Oberster nicht blockierter Eintrag gewinnt. Stränge:
**P** = Produkt/Grafik · **M** = Monetarisierung · **G** = Growth.

**Vorrangregel:** Solange Session-Zeit, D1 oder Like-Ratio unter Ziel liegen, hat
P Vorrang vor M und G (Begründung in `BUSINESS-CASE.md` Abschnitt 3).

## Jetzt (nächste Züge, in dieser Reihenfolge)

**CEO-Entscheidung vom 26.07.2026:** Das Spiel bleibt **privat**, bis Optik und
Ton stimmen. Begründung: Der Algorithmus testet neue Experiences mit kleinen
Impression-Wellen; ein Livegang mit halbfertiger Optik und ohne Ton verschenkt
diese ersten Wellen. Erst gut machen, dann öffnen.

| # | Strang | Zug | Messgröße | Status |
|---|---|---|---|---|
| 1 | P | **Design-Upgrades einspielen** (Modelle aus dem Design-Chat) → neue `.rbxlx`, in Studio testen | Optik entspricht den Thumbnails | wartet auf Assets |
| 2 | P | **Grundton für Roblox** (8a): Motor, Sirene, Kasse, Crash, Hupe — aktuell hat die Roblox-Fassung **gar keinen Ton** | Spiel fühlt sich lebendig an | offen, kann sofort starten |
| 3 | P | **Erste 60 Sekunden**: Spawn direkt im Auto mit aktivem Erstauftrag statt daneben | Abbruch in Minute 1 ↓ | offen |
| 4 | P | **Radio Solara** (8b–8d): Sender, Umschalter, Mute, szenenbasierte Musik | Session-Zeit ↑ | wartet auf Tracks |
| 5 | — | **Store-Seite fertig füllen** (Icon, 3 Thumbnails, Beschreibung, Genre, Fragebogen, API-Services) — **noch nicht Public** | Seite ist vollständig | offen · lokale Session |
| 6 | — | **Public schalten** — erst wenn 1 bis 5 erledigt und in Studio getestet | Spiel öffentlich | **Freigabe CEO** |
| 7 | G | **Erste Messwerte erfassen** (Creator Dashboard → `MESSWERTE.md`) | Basiswerte existieren | blockiert durch #6 |
| 8 | G | **3 Clips drehen** (Musterbürger-Trick, Knöllchen, Alphorn-Hupe) | Klicks auf Spiel-Link | offen |
| 9 | P | **Zivilverkehr + Feder-Stoßstange** (Parität zur Web-Fassung) | Session-Zeit ↑ | offen |
| 10 | M | **Kosmetik-Pass „Lackierungen"** (49–99 R$) via ShopKit einbauen | Zahlerquote in % | blockiert bis Haltequoten ok |
| 11 | P | **Club-Zone** (8e) mit eigenem Track, Licht, Tanz-Emotes | Session-Zeit ↑ | nach Livegang |

### Musik-Strategie — drei Wege, in dieser Reihenfolge prüfen

**Weg A — DistroKid → Roblox (geprüft, mit harter Einschränkung)**
Roblox betreibt eine **Music Top 100** (Beta), gerankt nach *Playtime* und
*Adoption* (Zahl der Experiences, die den Track nutzen), gespeist aus lizenzierter
Musik über Partner-Distributoren mit ISRC — darunter **DistroKid**.

*Ablauf:* Im DistroKid-Upload „Roblox" als Store auswählen; bei bestehenden
Releases über die Album-Seite → „+Add to more stores".

*Bedingungen (recherchiert 26.07.2026):*
- 100 % der Verlagsrechte müssen beim Uploader liegen
- **Keine Registrierung bei einer Verwertungsgesellschaft** (genannt ASCAP, BMI —
  **GEMA fällt genauso darunter**). Das schließt den bestehenden, GEMA-gemeldeten
  CMG-Katalog aus.
- Kein explizites Material
- Der Roblox Creator Store ist kuratiert — Opt-in ist keine Aufnahmegarantie
- **Keine Monetarisierung**: Roblox zahlt über diesen Weg keine Tantiemen

*Konsequenz:* Der Weg funktioniert nur mit **neu produzierten Tracks, die bewusst
nicht bei der GEMA angemeldet werden**. Dafür sind sie dann offiziell lizenziert
(kein Fingerprint-Risiko), chart-fähig und auch von anderen Entwicklern nutzbar,
was direkt auf „Adoption" einzahlt. Wert = Reichweite für die Musik, nicht Umsatz.
→ **Entscheidung CEO:** GEMA-Verzicht für die Spiel-Tracks ja oder nein.

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
