# roblox-game-kit

Fertiger Luau-Content-Baukasten für dein Roblox-Spiel: **Autos, Gebäude und kaufbare Items** — gebaut, um von Claude Code über den **Studio-MCP** (`run_code`) direkt in dein Spiel eingespielt zu werden.

## Was drin ist

| Modul | Zweck |
| --- | --- |
| `src/CarBuilder.luau` | Parametrische, **fahrbare** Autos (Constraint-Fahrwerk, Lenkung vorn, VehicleSeat) |
| `src/BuildingBuilder.luau` | Parametrische Gebäude: Stockwerke, Fensterreihen, Tür, Flachdach — ohne CSG |
| `src/ShopKit.luau` | Verkaufsstand mit ProximityPrompts + MarketplaceService-Anbindung (Game Passes & Developer Products, inkl. sicherem `ProcessReceipt`) |
| `src/DesignPresets.luau` | Fertige Designs: Sportwagen, Geländewagen, Taxi, Polizei · Wohnhaus, Bürohaus, Laden |

## Installation in dein Spiel (einmalig)

1. In Roblox Studio: **ServerStorage** → Rechtsklick → *Insert Object* → **Folder**, Name: `RobloxGameKit`
2. Für jede Datei aus `src/`: **ModuleScript** im Ordner anlegen (gleicher Name ohne `.luau`) und den Dateiinhalt hineinkopieren.

Oder du lässt das dein lokales Claude Code mit Studio-MCP machen: *„Lies die Dateien aus roblox-game-kit/src und leg sie als ModuleScripts unter ServerStorage.RobloxGameKit an."*

## Benutzung (Beispiele)

Ein Sportwagen am Spawn:

```lua
local Presets = require(game.ServerStorage.RobloxGameKit.DesignPresets)
local CarBuilder = require(game.ServerStorage.RobloxGameKit.CarBuilder)
CarBuilder.build(Presets.cars.sportwagen(Vector3.new(0, 5, 0)))
```

Eine kleine Straße mit drei Häusern:

```lua
local Presets = require(game.ServerStorage.RobloxGameKit.DesignPresets)
local BuildingBuilder = require(game.ServerStorage.RobloxGameKit.BuildingBuilder)
BuildingBuilder.build(Presets.buildings.wohnhaus(Vector3.new(-60, 0, 40)))
BuildingBuilder.build(Presets.buildings.laden(Vector3.new(0, 0, 40)))
BuildingBuilder.build(Presets.buildings.buerohaus(Vector3.new(70, 0, 40)))
```

Shop mit einem Game Pass und einem Developer Product (IDs vorher im Creator Hub anlegen: dein Spiel → *Monetization*):

```lua
local ShopKit = require(game.ServerStorage.RobloxGameKit.ShopKit)
ShopKit.createShopStand({
    position = Vector3.new(25, 0, 10),
    signText = "🛒 CMG SHOP",
    items = {
        { name = "VIP-Pass", gamePassId = 0 },   -- ← deine Game-Pass-ID
        { name = "500 Coins", productId = 0 },   -- ← deine Product-ID
    },
})
ShopKit.setupReceiptProcessor({
    [0] = function(player) -- ← deine Product-ID
        -- Coins gutschreiben
    end,
})
```

Eigene Designs sind nur ein Config-Table entfernt — alle Parameter (Farben, Größen, Stockwerke, Radgröße, Tempo …) sind in den Modulen dokumentiert.

## Zusammenspiel mit den MCP-Servern

- **Studio-MCP** (lokal): führt diese Module per `run_code` aus → Inhalte erscheinen sofort im offenen Place, inkl. Undo.
- **roblox-mcp** (`../roblox-mcp`): liefert die Datenseite — Katalogpreise, Spieldaten, Open-Cloud-Zugriff (DataStores, Live-Messages an Server).
