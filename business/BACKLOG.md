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
