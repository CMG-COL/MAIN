# Bericht Phase 1 — Konzeption

**Projekt:** Turbo Siesta · **Datum:** 25.07.2026 · **Status:** ✅ abgeschlossen

## Vorgehen

Statt eines einzelnen Konzepts wurden **drei unabhängige Konzept-Pitches** aus bewusst
unterschiedlichen Blickwinkeln erstellt (Multi-Agent-Verfahren) und anschließend von einer
Jury-Instanz zu einem finalen Konzept verschmolzen:

| Pitch | Blickwinkel | Kernidee |
|---|---|---|
| „Sunnyside Hustle" | Missions-/Risiko-Design | Job-Eskalationsleiter: legal = sicher, halbseiden = Sterne |
| „Turbo Siesta" | Arcade-First (Crazy Taxi) | Die einzige eilige Person in einer Dauer-Siesta-Stadt |
| Satire-Pitch | Welt & Ton | Gig-Economy-Parodie, fiktive Marken, Radio-Satire |

**Jury-Entscheidung:** Basis „Turbo Siesta" (stärkster Sofort-Reiz + klarster
„one more run"-Loop), verschmolzen mit der Risiko-Ökonomie aus Pitch 1 und der
Satire-Welt aus Pitch 3.

## Ergebnis (Kurzfassung)

- **Titel:** Turbo Siesta — „Slow town. Full throttle."
- **Setting:** Solara Bay, Küstenstadt in ewiger Golden Hour und verordneter Dauer-Siesta;
  vier Distrikte (La Promenada, Mercado Viejo, Marina Bling, Colina Vista).
- **USP:** Fahndungssterne = Ruhestörungs-Level = **Live-Score-Multiplikator**. Heat ist
  Einsatz, nicht Strafe. Ungesichertes Trinkgeld vs. Bank (Waschanlagen-Banking),
  Knöllchen-Selfie statt Gewalt, Musterbürger-Trick zum Sterne-Abbau.
- **Stil-Transfer statt Kopie:** GTA-V-Vibe (Küste, Palmen, Sterne-HUD, Minimap, Satire)
  in eigener „Sunset-Pop"-Optik: Lila-Asphalt, Candy-Farben, Neon-Driftspuren. Keine
  Rockstar-IP, PG-13, keine Waffen.
- **Vertrieb:** Kostenlos als Web-/PWA-Spiel (sofort spielbar, 0 € Distribution),
  App Store später via Capacitor.

Vollständiges Konzept: siehe [`GDD.md`](./GDD.md).

## Entscheidungen & Begründung

1. **HTML5-Canvas statt nativem Swift:** 0 € Distribution (PWA statt 99-USD-Account),
   sofortige Spielbarkeit per Link = zugleich der zentrale Marketing-Hebel; App-Store-Weg
   bleibt via Capacitor offen.
2. **PG-13 ohne Waffen:** bewusste Abgrenzung vom Vorbild — rechtlich sauber,
   App-Store-freundlich, und die Satire trägt den GTA-Charme besser als Gewalt.
3. **Scope-Schnitt für v1.0:** „Daily Rush" (globaler Tages-Seed), 3-Minuten-Schichtmodus
   und „Big Job Freitag" aus dem Jury-Konzept wurden in die Roadmap (v1.1–v1.3)
   verschoben, damit v1.0 in einem Rutsch spielbar fertig wird.

## Aufwand Phase 1

4 Konzept-Agenten (3 Pitches + Jury), Ergebnis als strukturiertes JSON direkt in die
Entwicklung übernommen.
