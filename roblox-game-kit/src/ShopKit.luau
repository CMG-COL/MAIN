--!strict
-- ShopKit: kaufbare Sachen im Spiel — Game Passes & Developer Products.
-- Baut einen Verkaufsstand mit ProximityPrompts und verdrahtet MarketplaceService.
--
-- Vorbereitung (einmalig im Creator Hub, create.roblox.com):
--   Dein Spiel → Monetization → Game Pass / Developer Product anlegen → ID kopieren.
--
-- Nutzung:
--   local ShopKit = require(game.ServerStorage.RobloxGameKit.ShopKit)
--   ShopKit.createShopStand({
--       position = Vector3.new(20, 0, 20),
--       items = {
--           { name = "VIP-Pass", gamePassId = 123456789 },
--           { name = "100 Coins", productId = 987654321 },
--       },
--   })
--   ShopKit.setupReceiptProcessor({
--       [987654321] = function(player)
--           -- Hier Coins gutschreiben, z. B. über dein Leaderstats/DataStore-System
--           print(player.Name .. " hat 100 Coins gekauft")
--       end,
--   })

local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local ShopKit = {}

export type ShopItem = {
	name: string,
	gamePassId: number?, -- entweder gamePassId ...
	productId: number?, -- ... oder productId setzen
}

export type ShopConfig = {
	name: string?,
	position: Vector3?,
	items: { ShopItem },
	standColor: Color3?,
	signText: string?,
}

function ShopKit.createShopStand(config: ShopConfig): Model
	local model = Instance.new("Model")
	model.Name = config.name or "Shop"

	local pos = config.position or Vector3.new(0, 0, 0)
	local color = config.standColor or Color3.fromRGB(245, 205, 48)

	-- Theke
	local counter = Instance.new("Part")
	counter.Name = "Counter"
	counter.Anchored = true
	counter.Size = Vector3.new(2 + #config.items * 4, 3.5, 3)
	counter.Color = color
	counter.Material = Enum.Material.WoodPlanks
	counter.CFrame = CFrame.new(pos + Vector3.new(0, 1.75, 0))
	counter.TopSurface = Enum.SurfaceType.Smooth
	counter.Parent = model

	-- Schild
	local signPost = Instance.new("Part")
	signPost.Name = "Sign"
	signPost.Anchored = true
	signPost.Size = Vector3.new(counter.Size.X, 2, 0.4)
	signPost.Color = Color3.fromRGB(40, 40, 40)
	signPost.Material = Enum.Material.SmoothPlastic
	signPost.CFrame = counter.CFrame * CFrame.new(0, 4, 0)
	signPost.Parent = model

	local gui = Instance.new("SurfaceGui")
	gui.Face = Enum.NormalId.Front
	gui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud
	gui.PixelsPerStud = 50
	gui.Parent = signPost
	local label = Instance.new("TextLabel")
	label.Size = UDim2.fromScale(1, 1)
	label.BackgroundTransparency = 1
	label.TextColor3 = Color3.new(1, 1, 1)
	label.TextScaled = true
	label.Font = Enum.Font.GothamBold
	label.Text = config.signText or "🛒 SHOP"
	label.Parent = gui

	-- Ein Podest + Prompt pro Artikel
	for index, item in config.items do
		local xOffset = (index - (#config.items + 1) / 2) * 4

		local pedestal = Instance.new("Part")
		pedestal.Name = "Pedestal_" .. item.name
		pedestal.Anchored = true
		pedestal.Size = Vector3.new(2.5, 1, 2.5)
		pedestal.Color = Color3.fromRGB(230, 230, 230)
		pedestal.Material = Enum.Material.Marble
		pedestal.CFrame = counter.CFrame * CFrame.new(xOffset, counter.Size.Y / 2 + 0.5, 0)
		pedestal.Parent = model

		local prompt = Instance.new("ProximityPrompt")
		prompt.ActionText = "Kaufen"
		prompt.ObjectText = item.name
		prompt.HoldDuration = 0.3
		prompt.MaxActivationDistance = 12
		prompt.Parent = pedestal

		prompt.Triggered:Connect(function(player: Player)
			if item.gamePassId then
				MarketplaceService:PromptGamePassPurchase(player, item.gamePassId)
			elseif item.productId then
				MarketplaceService:PromptProductPurchase(player, item.productId)
			else
				warn("ShopKit: Item '" .. item.name .. "' hat weder gamePassId noch productId")
			end
		end)
	end

	model.Parent = workspace
	return model
end

-- Verarbeitet Developer-Product-Käufe. handlers: { [productId] = function(player) ... }
-- WICHTIG: Nur EINMAL pro Spiel aufrufen (ProcessReceipt darf nur einen Handler haben).
function ShopKit.setupReceiptProcessor(handlers: { [number]: (Player) -> () })
	MarketplaceService.ProcessReceipt = function(receiptInfo)
		local player = Players:GetPlayerByUserId(receiptInfo.PlayerId)
		if not player then
			-- Spieler offline: später erneut versuchen
			return Enum.ProductPurchaseDecision.NotProcessedYet
		end

		local handler = handlers[receiptInfo.ProductId]
		if not handler then
			warn("ShopKit: Kein Handler für ProductId " .. receiptInfo.ProductId)
			return Enum.ProductPurchaseDecision.NotProcessedYet
		end

		local ok, err = pcall(handler, player)
		if not ok then
			warn("ShopKit: Handler-Fehler für ProductId " .. receiptInfo.ProductId .. ": " .. tostring(err))
			return Enum.ProductPurchaseDecision.NotProcessedYet
		end
		return Enum.ProductPurchaseDecision.PurchaseGranted
	end
end

-- Prüft, ob ein Spieler einen Game Pass besitzt (mit Fehlerbehandlung).
function ShopKit.playerOwnsPass(player: Player, gamePassId: number): boolean
	local ok, owns = pcall(function()
		return MarketplaceService:UserOwnsGamePassAsync(player.UserId, gamePassId)
	end)
	return ok and owns == true
end

return ShopKit
