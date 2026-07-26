# Business Case — Turbo Siesta auf Roblox

**Stand:** 26.07.2026 · **Verfasser:** Claude (CFO-Rolle) · **Freigabe offen:** Budget-Obergrenze und Zeithorizont durch CEO

> Alle Plattformzahlen sind belegt in
> `.claude/skills/cg-siesta-pmo/references/roblox-monetarisierung.md`.
> Annahmen über *unser* Spiel sind als Annahme markiert und werden durch echte
> Messwerte ersetzt, sobald sie vorliegen (`MESSWERTE.md`).

## 1. Die Plattform-Rechnung, ungeschminkt

Das ist die wichtigste Tabelle des Dokuments. Sie zeigt, wie viel von dem, was
ein Spieler ausgibt, tatsächlich als Geld bei uns landet.

| Schritt | Wert |
|---|---|
| Spieler kauft Robux | ca. 400 Robux für 4,99 USD → **~0,0125 USD je Robux** |
| Spieler kauft bei uns einen Pass für 99 Robux | Gegenwert seines Einsatzes: ~1,24 USD |
| Roblox behält 30 % Marktplatzgebühr | uns bleiben **69,3 Robux** |
| DevEx-Auszahlung, Standardkurs 0,0038 USD/Robux | **0,26 USD** |

**Von 1,24 USD Spielerausgabe kommen bei uns 0,26 USD an — rund 21 %.** Das ist
keine Besonderheit unseres Spiels, das ist die Plattform. Jede Umsatzplanung muss
mit dieser Quote rechnen.

Der erhöhte DevEx-Kurs von 0,0054 USD (seit 8. Juni 2026, +42 %) gilt nur für
Käufe von US-Spielern mit verifiziertem Alter 18+. Unsere Zielgruppe ist
überwiegend jünger — **wir planen mit dem Standardkurs.**

**Auszahlungsschwelle: 100.000 verdiente Robux.** Darunter gibt es kein Geld,
nur einen Robux-Kontostand.

| Meilenstein | Nötige Spieler-Ausgabe | Unser Robux-Verdienst | Auszahlung |
|---|---|---|---|
| Erste DevEx-Auszahlung | ~142.900 Robux | 100.000 Robux | **~380 USD** |
| Entspricht Pass-Verkäufen à 99 Robux | ~1.444 Stück | | |

## 2. Was das für Werbung bedeutet — der unbequeme Teil

Ads Manager: Mindestbudget ~35 USD (10 Ad Credits ≈ 2.850 Robux), Sponsored
Experiences typisch 0,10–0,50 USD pro Klick.

Rechnung für ein Mindest-Experiment, bei 0,30 USD pro Klick:

| | |
|---|---|
| Budget | 35 USD |
| Klicks | ~117 |
| davon tatsächlich gespielt (Annahme 50 %) | ~58 Spieler |
| **Kosten pro Spieler** | **~0,60 USD** |
| davon kaufen einen 99-Robux-Pass (Annahme 2 %) | ~1,2 Käufe |
| Umsatz daraus | **~0,31 USD** |

**Bezahlte Werbung kann sich bei diesen Preisen nicht selbst tragen** — nicht um
Faktor zwei, sondern um Faktor fünfzig. Wer 0,60 USD pro Spieler zahlt und
0,005 USD pro Spieler verdient, kauft sich kein Wachstum, sondern ein Loch.

Daraus folgt die zentrale strategische Empfehlung:

> **Werbung ist kein Umsatzkanal, sondern ein Anschubkanal.** Ihr einziger
> legitimer Zweck ist, dem Roblox-Algorithmus genug erste Spieler zu liefern,
> damit er das Spiel testet und bei guten Quoten *kostenlose* Impressions
> nachschiebt. Budget deshalb als gedeckelter Einmal-Versuch behandeln, nicht als
> Investition mit Rückfluss — und **erst zünden, wenn die Haltequoten stimmen.**

## 3. Was zuerst passieren muss

Solange die Retention nicht sitzt, ist jede Mark für Werbung und jede Stunde für
Monetarisierung verschwendet. Die Reihenfolge ist nicht verhandelbar:

1. **Halten** — Abbruch in Minute 1, Session-Zeit, D1. Ziel: Session ≥ 6 min, D1 ≥ 12 %, Like-Ratio ≥ 85 %.
2. **Verdienen** — erst dann Passes einbauen und Konversion messen.
3. **Wachsen** — erst dann organische Clips skalieren, und ganz zuletzt Budget.

## 4. Monetarisierungs-Optionen im ethischen Rahmen

Die Guardrail aus `CLAUDE.md` gilt: Kosmetik und faire Komfortfunktionen, keine
bezahlten Zufalls-Belohnungen, kein Pay-to-win.

**Achtung Pay-to-win:** Das Spiel hat eine Rangliste (`Bank` als Leaderstat). Ein
kaufbares Tempo-Upgrade wäre damit Pay-to-win — und würde die Like-Ratio
zerstören, also genau die Kennzahl, die über Reichweite entscheidet. Tempo bleibt
erspielbar.

| Kandidat | Typ | Preisidee | Bewertung |
|---|---|---|---|
| Lackierungen / Auto-Skins | Pass, kosmetisch | 49–99 R$ | **Empfehlung für Zug M1.** Fair, sichtbar, passt zum Sunset-Pop-Look |
| Hupen-Sounds (Alphorn & Co.) | Pass, kosmetisch | 49 R$ | Gut, hoher Spaßfaktor, null Balance-Wirkung |
| VIP-Pass (Namensfarbe, exklusiver Lack, Emote) | Pass, kosmetisch | 199 R$ | Solide Zweitstufe, sobald Zahlerquote messbar |
| Zweiter Auftrags-Slot | Developer Product, Komfort | 25 R$ | Grenzfall — verändert Spielbalance, erst nach Test |
| Tempo-/Grip-Upgrade kaufbar | — | — | **Abgelehnt.** Pay-to-win bei Rangliste |
| Zufalls-Lackkisten | — | — | **Abgelehnt.** Zufallskäufe an Minderjährige |

## 5. Kostenseite

| Position | Betrag | Status |
|---|---|---|
| Roblox-Veröffentlichung | 0 € | erledigt, kostenlos |
| Web-/PWA-Kanal | 0 € | läuft, Static-Hosting kostenlos möglich |
| Assets (Icon, Thumbnails) | 0 € | prozedural gerendert, kein Einkauf |
| Claude-Nutzung (Entwicklung, PMO) | Abo | läuft über CEO-Konto, in `FINANZEN.md` als Aufwand geführt |
| Werbebudget | **offen** | Obergrenze durch CEO zu setzen |
| Apple-Developer-Account (nur falls App Store) | 99 USD/Jahr | nicht beantragt, nicht empfohlen vor Traktion |

## 6. Szenarien — zur Auswahl durch den CEO

Weil die Budget-Obergrenze noch nicht gesetzt ist, drei benannte Varianten. Alle
setzen voraus, dass die Haltequoten aus Abschnitt 3 vorher erreicht sind.

| | **A — Nullbudget** | **B — Anschub** | **C — Test mit Serie** |
|---|---|---|---|
| Werbeausgabe | 0 € | einmalig ~35 € | 3 × 35 € über 6 Wochen |
| Erwartete gekaufte Spieler | 0 | ~60 | ~180 |
| Zweck | rein organisch | einmaliger Algorithmus-Anschub | Lernen, welche Anzeige/Thumbnail zieht |
| Realistischer Umsatz daraus | 0 € | < 1 € | < 3 € |
| Was es wirklich bringt | langsamer, aber kostenloser Aufbau | ein Datenpunkt | belastbare CTR-Vergleiche |
| Abbruchkriterium | — | wenn Session-Zeit der gekauften Spieler < organische | wenn Runde 1 keine Impression-Steigerung auslöst |

**Empfehlung: A bis die Haltequoten stimmen, dann B als einmaliges Experiment.**
C erst, wenn B einen messbaren Impression-Effekt gezeigt hat. Der Hebel dieses
Projekts liegt nicht im Budget, sondern in den ersten 60 Sekunden des Spiels.

## 7. Break-even, nüchtern

Erste Auszahlung (380 USD) erfordert ~1.444 Pass-Verkäufe. Bei 2 % Zahlerquote
sind das **~72.000 Spielbesuche**. Für ein neues Spiel ohne Budget ist das ein
Ziel für Monate, nicht Wochen — und es setzt voraus, dass der Algorithmus
mitspielt.

Ehrliche Erwartung für die ersten 30 Tage: **Umsatz nahe null, Erkenntnis hoch.**
Erfolg in Phase 1 heißt: Haltequoten im Zielbereich, nicht Robux auf dem Konto.
Wer in dieser Phase auf Umsatz optimiert, verliert die Reichweite, die den Umsatz
später erst möglich macht.

## 8. Was diesen Case ungültig macht

- Roblox ändert Gebühren, DevEx-Kurs oder Auszahlungsschwelle → Referenzdatei und
  diesen Case aktualisieren.
- Unsere gemessene Zahlerquote weicht stark von 2 % ab → Abschnitt 2 und 7 neu
  rechnen.
- Das Spiel erreicht die Haltequoten nach zwei Iterationsrunden nicht → dann ist
  nicht das Marketing das Problem, sondern der Spielkern (Abbruchkriterien in
  `marketing/ROBLOX-MARKETING.md`).
