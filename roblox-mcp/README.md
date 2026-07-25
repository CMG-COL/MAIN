# roblox-mcp

Ein MCP-Server (Model Context Protocol) für **Roblox.com**, gebaut für **Claude Code**.

Er stellt die öffentlichen Roblox-Web-APIs als Tools bereit — komplett **ohne API-Key oder Login**:
User-Profile, Spiele/Experiences, Gruppen, Katalog (Avatar-Shop), Badges, Avatar-Bilder und laufende Spiel-Server.

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

Oder manuell in `.mcp.json` im Projekt-Root (Team-weit, wird eingecheckt):

```json
{
  "mcpServers": {
    "roblox": {
      "command": "node",
      "args": ["roblox-mcp/dist/index.js"]
    }
  }
}
```

Danach Claude Code neu starten — die Tools erscheinen unter dem Server-Namen `roblox`.

## Beispiel-Prompts

- „Such das Roblox-Spiel *Adopt Me* und zeig mir die aktuellen Spielerzahlen."
- „Wer ist der Roblox-User `builderman`? Zeig Profil und Badges."
- „Wie viele Leute spielen gerade auf den öffentlichen Servern von Place 920587237?"
- „Such im Roblox-Katalog nach ‚Kopfhörer' unter 100 Robux."

## Hinweise

- **Rate-Limits:** Roblox drosselt per IP. Bei HTTP 429 gibt der Server eine klare Fehlermeldung zurück — kurz warten und erneut versuchen.
- **`placeId` vs. `universeId`:** Die Zahl in einer Spiel-URL (`roblox.com/games/<placeId>/…`) ist die *placeId*. `get_game_details` löst sie automatisch zur *universeId* auf.
- **Nur öffentliche Daten:** Es werden keine Cookies oder API-Keys verwendet. Authentifizierte Aktionen (Open Cloud: DataStores, MessagingService, Inventar etc.) sind bewusst nicht enthalten — möglicher Ausbau in einer späteren Version über `ROBLOX_API_KEY`.
