# Finanzerfassung — Turbo Siesta

Führt Ausgaben und Einnahmen. Nach jedem Zug fortschreiben. Währung: EUR, Robux
zusätzlich in R$.

**Kursannahmen** (Quelle: `.claude/skills/cg-siesta-pmo/references/roblox-plattformfakten.md`)
- Roblox behält 30 % → uns bleiben 70 % der ausgegebenen Robux
- DevEx Standardkurs: 0,0038 USD je verdienten Robux
- Auszahlungsschwelle: 100.000 verdiente Robux

## Ausgaben

| Datum | Position | Betrag | Freigabe | Beleg |
|---|---|---|---|---|
| 25.07.2026 | Roblox-Veröffentlichung | 0,00 € | — | kostenlos |
| 25.07.2026 | Assets (Icon, 3 Thumbnails) | 0,00 € | — | prozedural gerendert, kein Einkauf |
| 25.07.2026 | Web-Kanal (PWA) | 0,00 € | — | Static-Hosting kostenlos |
| — | Werbebudget | offen | **CEO ausstehend** | Szenarien in `BUSINESS-CASE.md` §6 |
| laufend | Claude-Nutzung (Entwicklung + PMO) | Abo | CEO | läuft über bestehendes Abo, siehe unten |
| **Summe Barausgaben** | | **0,00 €** | | |

### Zum Aufwand für Claude-Nutzung

Die Sessions laufen über das bestehende Abo des CEO, es entstehen keine
projektspezifischen Rechnungen. Exakte Token-Kosten kann ich nicht messen — die
belastbare Quelle ist die Nutzungsübersicht im Anthropic-Konto. Hier wird deshalb
der **Aufwand** protokolliert, nicht der Preis:

| Datum | Session | Was entstand |
|---|---|---|
| 25.07.2026 | Konzept + Entwicklung | Konzept (3 Pitches + Jury), Web-Spiel v1.0, QA (Smoke-, Monkey-Test, adversariale Review), Marketing-Paket, Roblox-Portierung |
| 26.07.2026 | Roblox v1.1 + PMO | HUD-/Licht-/Schild-Fixes, Sportwagen-Assets v2, Store-Texte, PMO-Rolle, Business Case, Backlog |

## Einnahmen

| Datum | Quelle | R$ brutto | R$ verdient (70 %) | Gegenwert USD | Ausgezahlt |
|---|---|---|---|---|---|
| — | noch keine | 0 | 0 | 0,00 | nein |
| **Summe** | | **0** | **0** | **0,00** | |

**Fortschritt zur ersten Auszahlung:** 0 von 100.000 verdienten Robux (0 %).

## Saldo

| | |
|---|---|
| Barausgaben | 0,00 € |
| Bareinnahmen | 0,00 € |
| **Saldo** | **0,00 €** |
| Nicht liquider Robux-Bestand | 0 R$ |

## Regeln

1. Jede Ausgabe braucht vorher eine CEO-Freigabe und wird mit Betrag, Zweck und
   Abbruchkriterium eingetragen.
2. Robux zählen erst als Einnahme, wenn sie ausgezahlt wurden. Vorher sind sie
   Bestand, kein Geld.
3. Werbeausgaben werden je Kampagne einzeln geführt, mit Kosten pro Spieler und
   dem tatsächlich erzielten Umsatz daneben — damit sichtbar bleibt, ob sich der
   Kanal trägt (Prognose: tut er bei aktuellen Preisen nicht, siehe Business Case).
