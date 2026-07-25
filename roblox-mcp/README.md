# roblox-mcp

Ein MCP-Server (Model Context Protocol) für **Roblox.com**, gebaut für **Claude Code**.

Er stellt zwei Ebenen der Roblox-APIs als Tools bereit:

1. **Öffentliche Web-APIs** — komplett ohne API-Key oder Login: User-Profile, Spiele/Experiences, Gruppen, Katalog (Avatar-Shop), Badges, Avatar-Bilder und laufende Spiel-Server.
2. **Open Cloud v2** (optional, per `ROBLOX_API_KEY`) — für die eigenen Experiences: Universe-/Place-Infos, DataStores lesen und Nachrichten in laufende Spiele senden (MessagingService).

> **Roblox Studio steuern?** Dafür gibt es einen separaten, offiziellen Weg — siehe [Roblox Studio als MCP-Server](#roblox-studio-als-mcp-server) unten. Dieser Server hier deckt die Website-/Cloud-Seite ab, der Studio-MCP die Engine-Seite (Szenen bauen, Luau-Code ausführen). Beide zusammen ergeben das komplette Setup.

## Tools

| Tool | Beschreibung |
| --- | --- |
| `get_user` | User-Profil per numerischer User-ID |
| `get_users_by_usernames` | Exakte Usernamen → User-IDs auflösen (bis 50 auf einmal) |
| `search_users` | User per Keyword suchen |
| `get_user_friends` | Freundesliste + Anzahl eines Users |
| `get_user_badges` | Badges eines Users (neueste zuerst) |
| `get_avatar_thumbnails` | Avatar-Headshot-Bild-URLs (PNG, wählbare Größe) |
| `get_game_details` | Spieldetails inkl. Spielerzahl, Visits, Favorites, Votes — per `universeId` **oder** `placeId` (die Zahl aus der Spiel-URL) |
| `get_game_icons` | Spiel-Icon-URLs per universeId |
| `get_game_servers` | Laufende öffentliche Server eines Spiels (Spielerzahl, Ping) |
| `search_games` | Spiele per Keyword suchen (Omni-Search, gleiche API wie die Roblox-Website) |
| `get_group` | Gruppen-Info per Gruppen-ID |
| `search_groups` | Gruppen per Keyword suchen |
| `search_catalog` | Avatar-Shop / Katalog durchsuchen (inkl. Robux-Preise) |

### Open-Cloud-Tools (benötigen `ROBLOX_API_KEY`)

| Tool | Beschreibung | Benötigter Scope |
| --- | --- | --- |
| `opencloud_get_universe` | Universe-Details der eigenen Experience | `universe:read` |
| `opencloud_get_place` | Place-Details innerhalb eines Universe | `universe.place:read` |
| `opencloud_list_data_stores` | DataStores eines Universe auflisten | `universe-datastores.control:list` |
| `opencloud_get_data_store_entry` | Einzelnen DataStore-Eintrag lesen | `universe-datastores.objects:read` |
| `opencloud_publish_message` | Nachricht an laufende Game-Server senden (MessagingService) | `universe-messaging-service:publish` |

API-Key erstellen: [create.roblox.com/dashboard/credentials](https://create.roblox.com/dashboard/credentials) → API-Key mit den obigen Scopes für deine Experience anlegen → als Umgebungsvariable `ROBLOX_API_KEY` setzen (siehe unten). Ohne Key funktionieren alle öffentlichen Tools weiterhin; die Open-Cloud-Tools geben dann eine klare Fehlermeldung mit Anleitung zurück.

## Installation

```bash
cd roblox-mcp
npm install
npm run build
```

## In Claude Code einbinden

Am einfachsten per CLI (im Projektordner oder mit absolutem Pfad):

```bash
claude mcp add roblox -- node /pfad/zu/roblox-mcp/dist/index.js
```

Oder manuell in `.mcp.json` im Projekt-Root (Team-weit, wird eingecheckt). Mit optionalem Open-Cloud-Key:

```json
{
  "mcpServers": {
    "roblox": {
      "command": "node",
      "args": ["roblox-mcp/dist/index.js"],
      "env": {
        "ROBLOX_API_KEY": "${ROBLOX_API_KEY}"
      }
    }
  }
}
```

Danach Claude Code neu starten — die Tools erscheinen unter dem Server-Namen `roblox`. Den API-Key **nicht** in die Datei schreiben, sondern in der Shell exportieren (`export ROBLOX_API_KEY=...`).

## Roblox Studio als MCP-Server

Laut den offiziellen Roblox-Developer-Docs gibt es für die **Studio-Seite** (Objekte in der Szene bauen, Luau-Code ausführen, Modelle aus dem Creator Store einfügen) einen eigenen MCP-Server direkt von Roblox:

- **Eingebaut in Studio (empfohlen):** Neuere Studio-Versionen bringen einen eingebauten MCP-Server mit. Aktivieren unter *File → Studio Settings → Beta Features → MCP Server*, dann in den *Assistant Settings → MCP Servers* „Enable Studio as MCP server" einschalten und per *Quick connect* die Config für Claude Code übernehmen. Änderungen von Claude landen dabei in Studios Undo-History (Strg+Z funktioniert).
- **Standalone-Variante:** [Roblox/studio-rust-mcp-server](https://github.com/Roblox/studio-rust-mcp-server) — der offizielle Open-Source-Server mit den Tools `run_code` (Luau in Studio ausführen, Output zurückbekommen) und `insert_model` (Modelle aus dem Creator Store einfügen). Roblox entwickelt ihn nicht mehr aktiv weiter, da der eingebaute Server der empfohlene Weg ist.

**Empfohlenes Gesamt-Setup:** `roblox` (dieser Server, Website + Open Cloud) **plus** der Studio-MCP — dann kann Claude Code sowohl Daten von Roblox.com abfragen als auch direkt in Studio bauen.

## Beispiel-Prompts

- „Such das Roblox-Spiel *Adopt Me* und zeig mir die aktuellen Spielerzahlen."
- „Wer ist der Roblox-User `builderman`? Zeig Profil und Badges."
- „Wie viele Leute spielen gerade auf den öffentlichen Servern von Place 920587237?"
- „Such im Roblox-Katalog nach ‚Kopfhörer' unter 100 Robux."

## Hinweise

- **Rate-Limits:** Roblox drosselt per IP. Bei HTTP 429 gibt der Server eine klare Fehlermeldung zurück — kurz warten und erneut versuchen.
- **`placeId` vs. `universeId`:** Die Zahl in einer Spiel-URL (`roblox.com/games/<placeId>/…`) ist die *placeId*. `get_game_details` löst sie automatisch zur *universeId* auf.
- **Nur öffentliche Daten:** Es werden keine Cookies oder API-Keys verwendet. Authentifizierte Aktionen (Open Cloud: DataStores, MessagingService, Inventar etc.) sind bewusst nicht enthalten — möglicher Ausbau in einer späteren Version über `ROBLOX_API_KEY`.
