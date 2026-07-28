# Turbo Siesta → Roblox: Einstellen & Vermarkten

Dieser Ordner enthält die vollständige **Roblox-Portierung** von Turbo Siesta:
eine fertige Place-Datei (`TurboSiesta.rbxlx`), die Luau-Quellen (`src/`) und den
Builder (`build-rbxlx.js`). Die Welt (Solara Bay in 3D, Golden-Hour-Licht,
Missionen, Siesta-Patrol, Waschanlage, Upgrades) entsteht komplett zur Laufzeit
aus den Skripten — die Place-Datei ist dadurch klein und robust.

## In 10 Minuten live auf roblox.com

Roblox-Publishing läuft zwingend über einen (kostenlosen) Roblox-Account —
deshalb sind das die einzigen Schritte, die Handarbeit brauchen:

1. **Account & Studio**: Auf [roblox.com](https://www.roblox.com) kostenlos
   registrieren → [Roblox Studio](https://create.roblox.com) installieren (Mac/PC).
2. **Öffnen**: `TurboSiesta.rbxlx` doppelklicken (oder Studio → File → Open from File).
   Mit „Play" (F5) einmal Probe fahren.
3. **Veröffentlichen**: File → **Publish to Roblox** → „Create new experience" →
   Name: `🌴 Turbo Siesta: Delivery Drift` (Begründung in
   [`../marketing/ROBLOX-MARKETING.md`](../marketing/ROBLOX-MARKETING.md)).
4. **Creator Dashboard** ([create.roblox.com/dashboard](https://create.roblox.com/dashboard)) → Experience auswählen:
   - **Beschreibung**: EN + DE aus dem Marketing-Dokument einfügen.
   - **Icon**: `../marketing/roblox-assets/roblox-icon-512.png`
   - **Thumbnails**: die drei PNGs aus `../marketing/roblox-assets/` hochladen.
   - **Genre**: Sports & Racing → Racing · **Geräte**: Computer, Phone, Tablet, Console.
   - **Maturity-Fragebogen** ehrlich ausfüllen → Ergebnis „Minimal" (keine Gewalt).
   - **Access**: Public. **Server-Größe**: 12.
5. **API-Zugriff für Savegames**: Dashboard → Experience → Settings → Security →
   „**Enable Studio Access to API Services**" aktivieren (nötig für die
   DataStore-Persistenz von Bank & Upgrades).

Danach gilt der 6-Wochen-Wachstumsplan aus `../marketing/ROBLOX-MARKETING.md`
(Soft-Launch → Metrik-Iteration → wöchentliche Updates — alles ohne Robux-Budget).

## Was die Portierung spielerisch enthält

- **Solara Bay in 3D**: prozedurale Stadt (gleiches Layout-Prinzip wie die
  Web-Version), Lila-Asphalt, Palmen, Strand, ewige Golden Hour (Lighting +
  Atmosphere), ¡Pronto!-Hub-Plaza als Spawn.
- **Fahren**: Auto pro Spieler (VehicleSeat — WASD/Pfeile, Gamepad und Roblox-
  Mobile-Touch-UI funktionieren automatisch), Top-Down-Kamera mit Blick voraus,
  Offroad-Verlangsamung, Anti-Flip.
- **Kernloop wie im Original**: 3 Job-Marker (5 Typen inkl. riskante Jobs),
  Liefer-Timer, Serie, **Ruhestörungs-Sterne = Live-Multiplikator ×1–×5**,
  ungesichertes Trinkgeld vs. Bank, **Waschanlage** bankt + wäscht Sterne,
  **Knöllchen** bei Einkeilung, **Musterbürger-Trick** (brav schleichen).
- **Siesta-Patrol**: Verfolger mit Blaulicht, Hindernis-Sonden, Stuck-Rescue.
- **Siesta-Bürger**: hechten mit Sprechblasen („OHA!", „¡Uy!") zur Seite,
  Schulterblick-Bonus für knappe Vorbeifahrten.
- **Upgrades** am Hub (ProximityPrompt): Turbotank, Grip-Reifen, Alphorn-Hupe.
- **Persistenz**: Bank + Upgrades via DataStore; `Bank` als Leaderstat sichtbar
  in der Spielerliste (sozialer Vergleich = kostenlose Session-Verlängerung).
- **Compliance**: bewusst ohne Krypto-Gag ($SOLCOIN der Web-Version wurde für
  Roblox in einen neutralen „KURIER"-Job umgewandelt — siehe Marketing-Doku §8).

## Quellen bearbeiten

```bash
# Nach Änderungen an src/*.luau die Place-Datei neu bauen:
node build-rbxlx.js
```

Alternativ die drei Skripte direkt in Studio pflegen (ReplicatedStorage/TSConfig,
ServerScriptService/TurboSiestaServer, StarterPlayerScripts/TurboSiestaClient) —
oder mit [Rojo](https://rojo.space) synchronisieren, wenn ein Dauer-Workflow
gewünscht ist.

## Roadmap Roblox (nach Soft-Launch-Metriken priorisieren)

1. Erste-60-Sekunden-Optimierung: Spawn direkt im Auto mit aktivem Erstauftrag.
2. Co-Play-Hebel: Konvoi-Bonus, geteilte Sterne-Eskalation (Freunde-Effekt).
3. Zivilverkehr + Feder-Stoßstangen-Upgrade (Parität zur Web-Version).
4. Wöchentliche Content-Häppchen für die Update-Kadenz (neue Distrikt-Blöcke,
   Hupen-Sounds, „Night Shift"-Event).
