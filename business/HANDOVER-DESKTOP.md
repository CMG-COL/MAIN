# Handover an die lokale Session (Studio-Arbeit)

Warum es diese Datei gibt: Der Studio-MCP läuft auf `localhost` des Macs. Eine
Cloud-Session erreicht ihn prinzipiell nicht und hat zusätzlich keinen Zugang zu
`*.roblox.com`. Alles, was das laufende Studio oder die echten Roblox-APIs
anfasst, muss lokal passieren. **Das Repo ist die Brücke.**

## Ablauf pro Zug

1. Cloud-Session baut und committet (Code, `.rbxlx`, Assets, Backlog).
2. Lokal: `git pull` im geklonten `MAIN`.
3. Lokale Session bekommt den Briefing-Block von unten — ohne weitere Erklärung.
4. Lokale Session liefert die **Rückmeldung** und committet, was im Studio
   entstanden ist.
5. Cloud-Session bucht das Ergebnis in `FINANZEN.md` / `MESSWERTE.md` und wählt
   den nächsten Zug.

## Einmalige Einrichtung lokal

```bash
git clone https://github.com/CMG-COL/MAIN.git
cd MAIN
git checkout claude/gta-style-ios-game-1lrny6
cd roblox-mcp && npm install && npm run build && cd ..
export ROBLOX_API_KEY="…"   # in ~/.zshrc, NICHT ins Repo
```

Studio-MCP aktivieren: Studio → **File → Studio Settings → Beta Features →
„MCP Server"** → Studio neu starten → **Assistant Settings → MCP Servers →
„Enable Studio as MCP server" → Quick connect → Claude**.

Dann eine **lokale** Claude-Session mit Arbeitsverzeichnis `MAIN` starten (nicht
eine Cloud-Session — die haben ein Wolken-Symbol). `CLAUDE.md` und die Skills
unter `.claude/skills/` werden automatisch geladen.

---

## Briefing-Block: Zug 1 — Store-Seite fertigstellen

> Kontext liegt in `CLAUDE.md` und `.claude/skills/cg-siesta-pmo/SKILL.md`.
> Experience: „🌴 Turbo Siesta 🚗 Drift Delivery Simulator", aktuell **Private**.
>
> Aufgaben:
> 1. Prüfe über den `roblox`-MCP (Open Cloud, `universe:read`), wie die Experience
>    aktuell konfiguriert ist: Name, Beschreibung, Sichtbarkeit, Altersfreigabe.
> 2. Melde mir, was von der Prüfliste in `business/SANITY-CHECKS.md` fehlt.
> 3. Setze die Experience auf **Public** (Studio: File → Game Settings →
>    Permissions → Playability: Public) — vorher den Maturity-Fragebogen
>    ausfüllen, falls Roblox das verlangt.
> 4. Lade Icon und die drei Thumbnails aus `marketing/roblox-assets/` hoch,
>    Reihenfolge: `thumb-1-x5-tips`, `thumb-2-busted`, `thumb-3-bank-it`.
> 5. Beschreibung und Genre aus `marketing/ROBLOX-MARKETING.md` eintragen.
> 6. Aktiviere Settings → Security → „Enable Studio Access to API Services".
>
> **Rückmeldung an mich:** Universe-ID, Place-ID, Sichtbarkeitsstatus, welche
> Punkte der Prüfliste jetzt grün sind, und die erste Messwert-Zeile aus dem
> Creator Dashboard (Besuche, Session-Zeit, Like-Ratio) für `MESSWERTE.md`.

## Briefing-Block: Zug 2 — Design-Upgrades einspielen

> Die neuen Modelle liegen unter `assets/design-upgrades/` (kommt von Chris).
>
> Aufgaben:
> 1. Modelle in Studio importieren und am Hub platzieren; prüfen, ob sie zum
>    Sunset-Pop-Look passen (Palette in `roblox/src/TSConfig.luau`).
> 2. Falls sie das Spielerauto ersetzen: `buildCar` in
>    `roblox/src/TurboSiestaServer.luau` entsprechend anpassen, `.rbxlx` neu bauen
>    (`node roblox/build-rbxlx.js`), in Studio testen.
> 3. Publishen über **Update existing experience** — nie „Create new".
>
> **Rückmeldung:** Screenshot aus dem laufenden Spiel, gefühlte Framerate auf dem
> Handy, und ob die Optik jetzt zu den Store-Thumbnails passt.

## Was die lokale Session zurückliefern soll — immer

- Was tatsächlich läuft, was nicht (ungetestet heißt ungetestet)
- Neue IDs (Universe, Place, Pass, Developer Product)
- Zahlen aus dem Creator Dashboard für `MESSWERTE.md`
- Commit auf dem Branch `claude/gta-style-ios-game-1lrny6`
