-- Turbo Siesta — Server: baut Solara Bay, verwaltet Missionen, Ökonomie,
-- Siesta-Patrol und Bürger. Läuft in ServerScriptService.

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local Lighting = game:GetService("Lighting")

local Config = require(ReplicatedStorage:WaitForChild("TSConfig"))

local TILE = Config.TILE
local ox, oz = Config.origin()
local rng = Random.new(Config.SEED)

local function rgb(t)
	return Color3.fromRGB(t[1], t[2], t[3])
end

local function pickList(list, r)
	local i = 1 + math.floor((r or rng:NextNumber()) * #list)
	if i > #list then
		i = #list
	end
	return list[i]
end

-- ---------------------------------------------------------------- Welt-Ordner
local city = Instance.new("Folder")
city.Name = "SolaraBay"
city.Parent = workspace

local dynamic = Instance.new("Folder")
dynamic.Name = "TSDynamic"
dynamic.Parent = workspace

local function part(props)
	local p = Instance.new("Part")
	p.Anchored = true
	p.CanCollide = true
	p.CastShadow = true
	p.Material = Enum.Material.SmoothPlastic
	p.TopSurface = Enum.SurfaceType.Smooth
	p.BottomSurface = Enum.SurfaceType.Smooth
	if props.name then p.Name = props.name end
	if props.size then p.Size = props.size end
	if props.cf then p.CFrame = props.cf end
	if props.color then p.Color = props.color end
	if props.material then p.Material = props.material end
	if props.transparency then p.Transparency = props.transparency end
	if props.cancollide ~= nil then p.CanCollide = props.cancollide end
	if props.anchored ~= nil then p.Anchored = props.anchored end
	if props.shape then p.Shape = props.shape end
	p.Parent = props.parent or city
	return p
end

-- --------------------------------------------------------------- Golden Hour
local function setupLighting()
	Lighting.ClockTime = 17.4
	Lighting.Brightness = 2.4
	Lighting.Ambient = Color3.fromRGB(120, 84, 110)
	Lighting.OutdoorAmbient = Color3.fromRGB(150, 100, 96)
	Lighting.GeographicLatitude = 15
	local cc = Instance.new("ColorCorrectionEffect")
	cc.TintColor = Color3.fromRGB(255, 226, 200)
	cc.Saturation = 0.18
	cc.Contrast = 0.06
	cc.Parent = Lighting
	local atmo = Instance.new("Atmosphere")
	atmo.Density = 0.35
	atmo.Color = Color3.fromRGB(255, 160, 100)
	atmo.Decay = Color3.fromRGB(140, 70, 100)
	atmo.Haze = 1.6
	atmo.Parent = Lighting
end

-- --------------------------------------------------------------- Stadt bauen
local HUB = { vx = 24, vy = 12 } -- Plaza-Block: zwischen Straßen 24/34 und 12/20

local function buildGroundAndRoads()
	local W = Config.GW * TILE
	local H = Config.GH * TILE
	-- Gras-Grundplatte
	part({ name = "Grass", size = Vector3.new(W + 240, 1, H + 240), color = rgb(Config.Colors.grass),
		cf = CFrame.new(ox + W / 2, -0.5, oz + H / 2), material = Enum.Material.Grass })
	-- Strand
	local bw = (Config.WATER_X - Config.BEACH_X) * TILE
	part({ name = "Beach", size = Vector3.new(bw, 0.24, H), color = rgb(Config.Colors.beach),
		cf = CFrame.new(ox + Config.BEACH_X * TILE + bw / 2, 0.08, oz + H / 2), material = Enum.Material.Sand })
	-- Meer (Deko, dahinter unsichtbare Wand)
	part({ name = "Sea", size = Vector3.new(260, 0.2, H + 240), color = rgb(Config.Colors.water),
		cf = CFrame.new(ox + Config.WATER_X * TILE + 130, 0.02, oz + H / 2),
		material = Enum.Material.Glass, transparency = 0.15 })
	-- Unsichtbare Grenzen
	local walls = {
		{ Vector3.new(4, 40, H + 240), CFrame.new(ox + Config.WATER_X * TILE + 2, 20, oz + H / 2) },
		{ Vector3.new(4, 40, H + 240), CFrame.new(ox - 20, 20, oz + H / 2) },
		{ Vector3.new(W + 240, 40, 4), CFrame.new(ox + W / 2, 20, oz - 20) },
		{ Vector3.new(W + 240, 40, 4), CFrame.new(ox + W / 2, 20, oz + H + 20) },
	}
	for i = 1, #walls do
		part({ name = "Wall", size = walls[i][1], cf = walls[i][2], transparency = 1 })
	end
	-- Straßen
	local zLen = 58 * TILE
	local zMid = oz + 33 * TILE
	for i = 1, #Config.ROADS_V do
		local rx = Config.ROADS_V[i]
		part({ name = "RoadV", size = Vector3.new(2 * TILE, 0.2, zLen), color = rgb(Config.Colors.road),
			cf = CFrame.new(ox + (rx + 1) * TILE, 0.1, zMid), material = Enum.Material.Asphalt })
		-- Mittellinie (gestrichelt, spart Parts: alle 3 Kacheln)
		for tz = 5, 60, 3 do
			if (tz - 4) % 8 > 1 then
				part({ name = "Dash", size = Vector3.new(0.7, 0.06, TILE * 0.9), color = rgb(Config.Colors.roadLine),
					cf = CFrame.new(ox + (rx + 1) * TILE, 0.23, oz + (tz + 0.5) * TILE), cancollide = false })
			end
		end
	end
	local xLen = 52 * TILE
	local xMid = ox + 30 * TILE
	for i = 1, #Config.ROADS_H do
		local ry = Config.ROADS_H[i]
		part({ name = "RoadH", size = Vector3.new(xLen, 0.16, 2 * TILE), color = rgb(Config.Colors.road),
			cf = CFrame.new(xMid, 0.08, oz + (ry + 1) * TILE), material = Enum.Material.Asphalt })
	end
end

local function buildPalm(x, z, scale)
	local s = scale or 1
	local h = (12 + rng:NextNumber() * 5) * s
	local lean = (rng:NextNumber() - 0.5) * 0.25
	local trunk = part({ name = "PalmTrunk", size = Vector3.new(h, 1.1 * s, 1.1 * s),
		color = rgb(Config.Colors.palmTrunk), material = Enum.Material.Wood,
		cf = CFrame.new(x, h / 2, z) * CFrame.Angles(0, rng:NextNumber() * 6.28, math.rad(90) + lean) })
	local topPos = trunk.CFrame * CFrame.new(h / 2, 0, 0)
	for i = 1, 6 do
		local a = (i / 6) * math.pi * 2
		part({ name = "PalmLeaf", size = Vector3.new(7 * s, 0.35, 1.9 * s), color = rgb(Config.Colors.palmLeaf),
			material = Enum.Material.Grass, cancollide = false,
			cf = CFrame.new(topPos.Position) * CFrame.Angles(0, a, -0.42) * CFrame.new(3.2 * s, 0, 0) })
	end
end

local function buildParkedCar(x, z)
	local col = pickList(Config.Colors.docks)
	local a = rng:NextNumber() * 6.28
	part({ name = "ParkedCar", size = Vector3.new(5.5, 1.6, 10), color = rgb(col),
		cf = CFrame.new(x, 0.95, z) * CFrame.Angles(0, a, 0) })
	part({ name = "ParkedCabin", size = Vector3.new(4.6, 1.2, 4.5), color = Color3.fromRGB(40, 40, 60),
		cf = CFrame.new(x, 2.2, z) * CFrame.Angles(0, a, 0) })
end

local function buildBlockContent(x0, z0, x1, z1, district)
	-- Kachel-Indizes des Innenbereichs (ohne Gehweg-Ring)
	local wx0 = ox + x0 * TILE
	local wz0 = oz + z0 * TILE
	local w = (x1 - x0 + 1) * TILE
	local d = (z1 - z0 + 1) * TILE
	local roll = rng:NextNumber()
	if roll < 0.15 then -- Park
		part({ name = "Park", size = Vector3.new(w - 2, 0.3, d - 2), color = rgb(Config.Colors.park),
			cf = CFrame.new(wx0 + w / 2, 0.15, wz0 + d / 2), material = Enum.Material.Grass })
		local n = 3 + math.floor(rng:NextNumber() * 3)
		for i = 1, n do
			buildPalm(wx0 + 4 + rng:NextNumber() * (w - 8), wz0 + 4 + rng:NextNumber() * (d - 8), 0.9)
		end
		return
	end
	if roll < 0.25 then -- Parkplatz
		part({ name = "Lot", size = Vector3.new(w - 2, 0.26, d - 2), color = Color3.fromRGB(84, 66, 124),
			cf = CFrame.new(wx0 + w / 2, 0.13, wz0 + d / 2), material = Enum.Material.Concrete })
		for i = 1, 2 do
			buildParkedCar(wx0 + 6 + rng:NextNumber() * (w - 12), wz0 + 6 + rng:NextNumber() * (d - 12))
		end
		return
	end
	-- Gebäude: 1, 2 oder 4 Boxen
	local palette = Config.Colors[district] or Config.Colors.burbs
	local splitX = (rng:NextNumber() < 0.6)
	local splitZ = (rng:NextNumber() < (district == "burbs" and 0.7 or 0.3))
	local xs = splitX and { 0, 0.5, 1 } or { 0, 1 }
	local zs = splitZ and { 0, 0.5, 1 } or { 0, 1 }
	for xi = 1, #xs - 1 do
		for zi = 1, #zs - 1 do
			if rng:NextNumber() > 0.08 then
				local bw = (xs[xi + 1] - xs[xi]) * w - 4
				local bd = (zs[zi + 1] - zs[zi]) * d - 4
				local bh
				if district == "downtown" then
					bh = 36 + rng:NextNumber() * 46
				elseif district == "docks" then
					bh = 10 + rng:NextNumber() * 8
				else
					bh = 12 + rng:NextNumber() * 12
				end
				local bx = wx0 + xs[xi] * w + bw / 2 + 2
				local bz = wz0 + zs[zi] * d + bd / 2 + 2
				part({ name = "Bldg", size = Vector3.new(bw, bh, bd), color = rgb(pickList(palette)),
					cf = CFrame.new(bx, bh / 2, bz),
					material = district == "downtown" and Enum.Material.Glass or Enum.Material.Concrete })
			end
		end
	end
end

local function buildBlocks()
	for vi = 1, #Config.ROADS_V - 1 do
		for hi = 1, #Config.ROADS_H - 1 do
			local x0 = Config.ROADS_V[vi] + 2
			local x1 = Config.ROADS_V[vi + 1] - 1
			local z0 = Config.ROADS_H[hi] + 2
			local z1 = Config.ROADS_H[hi + 1] - 1
			if x1 >= x0 and z1 >= z0 and x0 < Config.BEACH_X then
				-- Gehweg-Ring
				local wx0 = ox + x0 * TILE
				local wz0 = oz + z0 * TILE
				local w = (x1 - x0 + 1) * TILE
				local d = (z1 - z0 + 1) * TILE
				part({ name = "Side", size = Vector3.new(w, 0.3, d), color = rgb(Config.Colors.sidewalk),
					cf = CFrame.new(wx0 + w / 2, 0.15, wz0 + d / 2), material = Enum.Material.Concrete })
				if Config.ROADS_V[vi] == HUB.vx and Config.ROADS_H[hi] == HUB.vy then
					buildHub(x0, z0, x1, z1)
				else
					local cx = math.floor((x0 + x1) / 2)
					local cz = math.floor((z0 + z1) / 2)
					buildBlockContent(x0 + 1, z0 + 1, x1 - 1, z1 - 1, Config.districtAt(cx, cz))
				end
			end
		end
	end
	-- Strand-Palmen
	for tz = 6, 58, 4 do
		if rng:NextNumber() < 0.8 then
			buildPalm(ox + (Config.BEACH_X + 1 + rng:NextNumber() * 2.5) * TILE, oz + tz * TILE, 1)
		end
	end
end

-- ------------------------------------------------------------------ Hub-Plaza
local washZone
local spawnLocation

function buildHub(x0, z0, x1, z1)
	local wx0 = ox + x0 * TILE
	local wz0 = oz + z0 * TILE
	local w = (x1 - x0 + 1) * TILE
	local d = (z1 - z0 + 1) * TILE
	local cx = wx0 + w / 2
	local cz = wz0 + d / 2
	part({ name = "Plaza", size = Vector3.new(w - 2, 0.32, d - 2), color = Color3.fromRGB(226, 210, 186),
		cf = CFrame.new(cx, 0.16, cz), material = Enum.Material.Concrete })
	-- Spawn
	spawnLocation = Instance.new("SpawnLocation")
	spawnLocation.Name = "ProntoHub"
	spawnLocation.Size = Vector3.new(10, 0.4, 10)
	spawnLocation.CFrame = CFrame.new(cx + w / 4, 0.55, cz)
	spawnLocation.Anchored = true
	spawnLocation.Neutral = true
	spawnLocation.Color = rgb(Config.Colors.flamingo)
	spawnLocation.Material = Enum.Material.Neon
	spawnLocation.Duration = 0
	spawnLocation.Parent = city
	-- Hub-Schild
	local sign = part({ name = "HubSign", size = Vector3.new(14, 4, 0.6), color = rgb(Config.Colors.flamingo),
		material = Enum.Material.Neon, cf = CFrame.new(cx, 9, wz0 + 2) })
	local sg = Instance.new("SurfaceGui")
	sg.Face = Enum.NormalId.Front
	sg.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud
	sg.PixelsPerStud = 30
	sg.Parent = sign
	local tl = Instance.new("TextLabel")
	tl.Size = UDim2.new(1, 0, 1, 0)
	tl.BackgroundTransparency = 1
	tl.Text = "¡PRONTO! HUB"
	tl.TextColor3 = Color3.new(1, 1, 1)
	tl.TextScaled = true
	tl.Font = Enum.Font.FredokaOne
	tl.Parent = sg
	part({ name = "SignPole1", size = Vector3.new(0.6, 7, 0.6), color = Color3.fromRGB(60, 50, 80),
		cf = CFrame.new(cx - 6, 3.5, wz0 + 2) })
	part({ name = "SignPole2", size = Vector3.new(0.6, 7, 0.6), color = Color3.fromRGB(60, 50, 80),
		cf = CFrame.new(cx + 6, 3.5, wz0 + 2) })
	-- Upgrade-Stände
	for i = 1, #Config.Upgrades do
		local u = Config.Upgrades[i]
		local px = wx0 + 8 + (i - 1) * 12
		local pz = wz0 + d - 8
		local stand = part({ name = "Upgrade_" .. u.id, size = Vector3.new(4, 3.4, 4),
			color = rgb(Config.Colors.star), material = Enum.Material.Neon, cf = CFrame.new(px, 1.7, pz) })
		local prompt = Instance.new("ProximityPrompt")
		prompt.ActionText = u.name
		prompt.ObjectText = u.desc
		prompt.HoldDuration = 0.4
		prompt.MaxActivationDistance = 12
		prompt.RequiresLineOfSight = false
		prompt.Parent = stand
		prompt.Triggered:Connect(function(plr)
			buyUpgrade(plr, u, prompt)
		end)
	end
	-- Waschanlage: Bogen über der Straße westlich des Hubs
	local roadX = ox + (HUB.vx + 1) * TILE
	local archZ = cz
	part({ name = "WashPillar1", size = Vector3.new(2, 10, 2), color = rgb(Config.Colors.wash),
		cf = CFrame.new(roadX - TILE - 1, 5, archZ), material = Enum.Material.Neon })
	part({ name = "WashPillar2", size = Vector3.new(2, 10, 2), color = rgb(Config.Colors.wash),
		cf = CFrame.new(roadX + TILE + 1, 5, archZ), material = Enum.Material.Neon })
	local beam = part({ name = "WashBeam", size = Vector3.new(2 * TILE + 4, 2, 2), color = rgb(Config.Colors.wash),
		cf = CFrame.new(roadX, 11, archZ), material = Enum.Material.Neon })
	local bb = Instance.new("BillboardGui")
	bb.Size = UDim2.new(0, 260, 0, 60)
	bb.StudsOffset = Vector3.new(0, 3, 0)
	bb.AlwaysOnTop = true
	bb.MaxDistance = 500
	bb.Parent = beam
	local bt = Instance.new("TextLabel")
	bt.Size = UDim2.new(1, 0, 1, 0)
	bt.BackgroundTransparency = 1
	bt.Text = "WASCHANLAGE — bankt & wäscht Sterne"
	bt.TextColor3 = rgb(Config.Colors.wash)
	bt.TextScaled = true
	bt.Font = Enum.Font.FredokaOne
	bt.Parent = bb
	washZone = part({ name = "WashZone", size = Vector3.new(2 * TILE, 8, 6), transparency = 1,
		cancollide = false, cf = CFrame.new(roadX, 4, archZ) })
end

-- ------------------------------------------------------------- Spieler-Status
local state = {}

local function toast(plr, msg)
	local st = state[plr]
	if not st then
		return
	end
	st.toastN = st.toastN + 1
	plr:SetAttribute("TSToast", tostring(st.toastN) .. "|" .. msg)
end

function buyUpgrade(plr, u, prompt)
	local st = state[plr]
	if not st then
		return
	end
	local lvl = plr:GetAttribute("TS" .. u.id) or 0
	if lvl >= 5 then
		toast(plr, u.name .. ": MAX ausgebaut.")
		return
	end
	local cost = math.floor(u.base * (1.6 ^ lvl) / 10 + 0.5) * 10
	local bank = st.bankValue.Value
	if bank < cost then
		toast(plr, u.name .. " kostet $" .. cost .. " — erst banken!")
		return
	end
	st.bankValue.Value = bank - cost
	plr:SetAttribute("TS" .. u.id, lvl + 1)
	toast(plr, u.name .. " Stufe " .. (lvl + 1) .. " eingebaut!")
	prompt.ObjectText = u.desc .. " (Stufe " .. (lvl + 1) .. "/5)"
end

-- --------------------------------------------------------------- Fahrzeugbau
local function buildCar(plr)
	local model = Instance.new("Model")
	model.Name = "TSCar_" .. plr.Name
	model:SetAttribute("TSOwner", plr.UserId)

	local base = Instance.new("Part")
	base.Name = "Base"
	base.Size = Vector3.new(6, 1.4, 11)
	base.Color = rgb(Config.Colors.player)
	base.Material = Enum.Material.SmoothPlastic
	base.CustomPhysicalProperties = PhysicalProperties.new(1.2, 1.4, 0.2, 1, 1)
	base.Parent = model

	local cabin = Instance.new("Part")
	cabin.Name = "Cabin"
	cabin.Size = Vector3.new(5, 1.3, 4.6)
	cabin.Color = Color3.fromRGB(43, 26, 69)
	cabin.Material = Enum.Material.Glass
	cabin.Transparency = 0.25
	cabin.CanCollide = false
	cabin.Massless = true
	cabin.Parent = model

	local seat = Instance.new("VehicleSeat")
	seat.Name = "Seat"
	seat.Size = Vector3.new(3, 0.6, 3)
	seat.Color = Color3.fromRGB(43, 26, 69)
	seat.MaxSpeed = 0 -- Fahrlogik übernimmt der Client-Loop
	seat.Torque = 0
	seat.TurnSpeed = 0
	seat.HeadsUpDisplay = false
	seat.CanCollide = false
	seat.Massless = true
	seat.Parent = model

	local function weldTo(p, offset)
		p.CFrame = base.CFrame * offset
		local w = Instance.new("WeldConstraint")
		w.Part0 = base
		w.Part1 = p
		w.Parent = p
	end

	local spawnCF = spawnLocation and (spawnLocation.CFrame * CFrame.new(-14, 2.2, (plr.UserId % 5) * 4 - 8))
		or CFrame.new(0, 3, 0)
	base.CFrame = spawnCF * CFrame.Angles(0, math.rad(-90), 0)
	weldTo(cabin, CFrame.new(0, 1.3, 0.6))
	weldTo(seat, CFrame.new(0, 0.9, 0.6))

	for wx = -1, 1, 2 do
		for wz = -1, 1, 2 do
			local wheel = Instance.new("Part")
			wheel.Name = "Wheel"
			wheel.Shape = Enum.PartType.Cylinder
			wheel.Size = Vector3.new(1, 2.2, 2.2)
			wheel.Color = Color3.fromRGB(30, 24, 44)
			wheel.Material = Enum.Material.SmoothPlastic
			wheel.CanCollide = false
			wheel.Massless = true
			wheel.Parent = model
			wheel.CFrame = base.CFrame * CFrame.new(wx * 3.1, -0.5, wz * 3.6) * CFrame.Angles(0, 0, math.rad(90))
			local w = Instance.new("WeldConstraint")
			w.Part0 = base
			w.Part1 = wheel
			w.Parent = wheel
		end
	end

	model.PrimaryPart = base
	model.Parent = dynamic
	base:SetNetworkOwner(plr)
	return model, seat, base
end

-- ----------------------------------------------------------------- Missionen
local function randomRoadPos(fromPos, minD, maxD)
	for i = 1, 80 do
		local tx = 4 + math.floor(math.random() * 52)
		local tz = 4 + math.floor(math.random() * 58)
		if Config.isRoadTile(tx, tz) then
			local x, z = Config.tileToWorld(tx, tz)
			local d = (Vector3.new(x, 0, z) - Vector3.new(fromPos.X, 0, fromPos.Z)).Magnitude
			if d >= minD and d <= maxD then
				return Vector3.new(x, 0, z)
			end
		end
	end
	local x, z = Config.tileToWorld(30, 30)
	return Vector3.new(x, 0, z)
end

local function makePad(pos, colorT, labelText, isDrop)
	local pad = part({ name = isDrop and "DropPad" or "OfferPad", shape = Enum.PartType.Cylinder,
		size = Vector3.new(0.5, 14, 14), color = rgb(colorT), material = Enum.Material.Neon,
		cancollide = false, cf = CFrame.new(pos.X, 0.4, pos.Z) * CFrame.Angles(0, 0, math.rad(90)),
		parent = dynamic })
	local bb = Instance.new("BillboardGui")
	bb.Size = UDim2.new(0, 190, 0, 54)
	bb.StudsOffset = Vector3.new(0, 7, 0)
	bb.AlwaysOnTop = true
	bb.MaxDistance = 650
	bb.Parent = pad
	local tl = Instance.new("TextLabel")
	tl.Size = UDim2.new(1, 0, 1, 0)
	tl.BackgroundTransparency = 1
	tl.Text = labelText
	tl.TextColor3 = rgb(colorT)
	tl.TextStrokeTransparency = 0.2
	tl.TextScaled = true
	tl.Font = Enum.Font.FredokaOne
	tl.Parent = bb
	return pad
end

local function clearOffers(st)
	for i = 1, #st.offers do
		if st.offers[i].pad then
			st.offers[i].pad:Destroy()
		end
	end
	st.offers = {}
end

local function makeOffers(plr)
	local st = state[plr]
	if not st or not st.base then
		return
	end
	clearOffers(st)
	for i = 1, 3 do
		local mt = Config.Missions[1 + math.floor(math.random() * #Config.Missions)]
		local pos = randomRoadPos(st.base.Position, 140, 520)
		local pad = makePad(pos, mt.color, mt.label, false)
		st.offers[#st.offers + 1] = { mtype = mt, pos = pos, pad = pad }
	end
end

local function starsOf(st)
	return math.max(0, math.ceil(st.heat - 0.001))
end

local function addHeat(plr, h)
	local st = state[plr]
	st.heat = math.min(5, st.heat + h)
	st.evade = 0
	plr:SetAttribute("TSStars", starsOf(st))
end

local function acceptOffer(plr, offer)
	local st = state[plr]
	local drop = randomRoadPos(offer.pos, 180, 650)
	local d = (drop - offer.pos).Magnitude
	local pay = math.floor((45 + d * 0.55 * offer.mtype.payMult) / 5 + 0.5) * 5
	local total = (d / 34 + 12) * offer.mtype.timeFactor
	st.active = {
		mtype = offer.mtype, pos = drop, pay = pay, timeLeft = total, total = total,
		pad = makePad(drop, offer.mtype.color, "★ " .. offer.mtype.label, true),
	}
	offer.pad:Destroy()
	for i = #st.offers, 1, -1 do
		if st.offers[i] == offer then
			table.remove(st.offers, i)
		end
	end
	if offer.mtype.risk > 0 then
		addHeat(plr, offer.mtype.risk)
	end
	local flavor = offer.mtype.flavor[1 + math.floor(math.random() * #offer.mtype.flavor)]
	plr:SetAttribute("TSMission", offer.mtype.label .. " · $" .. pay)
	toast(plr, offer.mtype.label .. ": " .. flavor)
end

local function endMission(plr, ok)
	local st = state[plr]
	local m = st.active
	if not m then
		return
	end
	if m.pad then
		m.pad:Destroy()
	end
	st.active = nil
	plr:SetAttribute("TSMission", "")
	if ok then
		local serieMult = 1 + st.serie * 0.15
		local sm = math.max(1, starsOf(st))
		local payout = math.floor(m.pay * serieMult * sm + 0.5)
		st.wallet = st.wallet + payout
		st.serie = math.min(10, st.serie + 1)
		if sm > 1 then
			toast(plr, string.format(Config.Texts.deliveredHot, starsOf(st), sm) .. " +$" .. payout)
		else
			toast(plr, Config.Texts.delivered .. " +$" .. payout)
		end
	else
		st.serie = 0
		toast(plr, Config.Texts.tooLate)
	end
	plr:SetAttribute("TSWallet", st.wallet)
	plr:SetAttribute("TSSerie", st.serie)
	makeOffers(plr)
end

-- -------------------------------------------------------------- Siesta-Patrol
local function buildCop(pos)
	local model = Instance.new("Model")
	model.Name = "Patrol"
	local base = Instance.new("Part")
	base.Name = "Base"
	base.Size = Vector3.new(6, 1.6, 11)
	base.Color = Color3.fromRGB(244, 240, 255)
	base.Material = Enum.Material.SmoothPlastic
	base.Anchored = true
	base.CFrame = CFrame.new(pos.X, 1.3, pos.Z)
	base.Parent = model
	local stripe = Instance.new("Part")
	stripe.Size = Vector3.new(6.05, 0.5, 3)
	stripe.Color = rgb(Config.Colors.patrol)
	stripe.Material = Enum.Material.SmoothPlastic
	stripe.Anchored = true
	stripe.CanCollide = false
	stripe.CFrame = base.CFrame * CFrame.new(0, 0.6, 0)
	stripe.Parent = model
	local l1 = Instance.new("Part")
	l1.Size = Vector3.new(1.4, 0.7, 1.4)
	l1.Material = Enum.Material.Neon
	l1.Color = Color3.fromRGB(255, 60, 60)
	l1.Anchored = true
	l1.CanCollide = false
	l1.CFrame = base.CFrame * CFrame.new(-1.2, 1.4, -0.5)
	l1.Name = "LightA"
	l1.Parent = model
	local l2 = l1:Clone()
	l2.Color = rgb(Config.Colors.patrol)
	l2.CFrame = base.CFrame * CFrame.new(1.2, 1.4, -0.5)
	l2.Name = "LightB"
	l2.Parent = model
	model.PrimaryPart = base
	model.Parent = dynamic
	return { model = model, base = base, heading = 0, stuckT = 0, lastPos = base.Position, lights = { l1, l2 } }
end

local rayParams = RaycastParams.new()
rayParams.FilterType = Enum.RaycastFilterType.Include

local function updateCops(plr, st, dt, now)
	local want = starsOf(st)
	while #st.cops < want do
		st.cops[#st.cops + 1] = buildCop(randomRoadPos(st.base.Position, 150, 320))
	end
	while #st.cops > want do
		st.cops[#st.cops].model:Destroy()
		table.remove(st.cops)
	end
	if want == 0 then
		return false
	end
	local anyNear = false
	local carPos = st.base.Position
	local carSpeed = st.base.AssemblyLinearVelocity.Magnitude
	rayParams.FilterDescendantsInstances = { city }
	for i = 1, #st.cops do
		local cop = st.cops[i]
		local pos = cop.base.Position
		local toCar = Vector3.new(carPos.X - pos.X, 0, carPos.Z - pos.Z)
		local dist = toCar.Magnitude
		if dist < Config.Police.nearDist then
			anyNear = true
		end
		local desired = math.atan2(toCar.X, toCar.Z)
		-- Hindernis-Sonde
		local dir = Vector3.new(math.sin(cop.heading), 0, math.cos(cop.heading))
		local hit = workspace:Raycast(pos + Vector3.new(0, 1, 0), dir * 16, rayParams)
		if hit then
			desired = cop.heading + 1.15
		end
		local diff = math.atan2(math.sin(desired - cop.heading), math.cos(desired - cop.heading))
		local maxTurn = 2.2 * dt
		if diff > maxTurn then
			diff = maxTurn
		elseif diff < -maxTurn then
			diff = -maxTurn
		end
		cop.heading = cop.heading + diff
		local speed = Config.Police.speedBase + want * Config.Police.speedPerStar
		if dist < 18 then
			speed = math.max(20, carSpeed * 0.9)
		end
		local stepDir = Vector3.new(math.sin(cop.heading), 0, math.cos(cop.heading))
		local newPos = pos + stepDir * speed * dt
		local flatPos = Vector3.new(newPos.X, 1.3, newPos.Z)
		cop.base.CFrame = CFrame.lookAt(flatPos, flatPos + stepDir)
		local moved = (newPos - cop.lastPos).Magnitude
		cop.lastPos = newPos
		if moved < speed * dt * 0.25 then
			cop.stuckT = cop.stuckT + dt
		else
			cop.stuckT = 0
		end
		if cop.stuckT > 2 then
			local p = randomRoadPos(carPos, 100, 220)
			cop.base.CFrame = CFrame.new(p.X, 1.3, p.Z)
			cop.stuckT = 0
		end
		-- Deko-Teile mitführen + Blaulicht
		local flash = math.floor(now * 4) % 2 == 0
		cop.lights[1].Color = flash and Color3.fromRGB(255, 60, 60) or rgb(Config.Colors.patrol)
		cop.lights[2].Color = flash and rgb(Config.Colors.patrol) or Color3.fromRGB(255, 60, 60)
		for j, child in pairs(cop.model:GetChildren()) do
			if child ~= cop.base and child:IsA("BasePart") then
				local offset = child.Name == "LightA" and CFrame.new(-1.2, 1.4, -0.5)
					or child.Name == "LightB" and CFrame.new(1.2, 1.4, -0.5)
					or CFrame.new(0, 0.6, 0)
				child.CFrame = cop.base.CFrame * offset
			end
		end
		-- Knöllchen-Check
		if dist < Config.Police.ticketDist and carSpeed < Config.Police.ticketSpeed then
			st.bustT = st.bustT + dt
		end
	end
	if st.bustT > Config.Police.ticketTime then
		st.bustT = 0
		st.wallet = 0
		st.serie = 0
		st.heat = 0
		plr:SetAttribute("TSWallet", 0)
		plr:SetAttribute("TSSerie", 0)
		plr:SetAttribute("TSStars", 0)
		toast(plr, Config.Texts.ticket)
		if st.active then
			endMission(plr, false)
		end
	else
		st.bustT = math.max(0, st.bustT - dt * 0.5)
	end
	-- Abkühlung: Abstand halten ODER Musterbürger-Trick (brav schleichen)
	local creeping = anyNear and carSpeed < Config.Police.ticketSpeed and st.bustT < 0.05
	if not anyNear then
		st.evade = st.evade + dt
	elseif creeping then
		st.evade = st.evade + dt * Config.Police.creepFactor
	else
		st.evade = 0
	end
	if st.evade > Config.Police.evadeTime then
		st.evade = 0
		st.heat = math.max(0, starsOf(st) - 1)
		plr:SetAttribute("TSStars", starsOf(st))
		if creeping then
			toast(plr, Config.Texts.musterbuerger)
		elseif st.heat == 0 then
			toast(plr, Config.Texts.cooled)
		end
	end
	return true
end

-- ------------------------------------------------------- Siesta-Bürger (NPCs)
local function buildBuerger(pos)
	local body = part({ name = "Buerger", size = Vector3.new(1.7, 3, 1.7),
		color = rgb(pickList(Config.Colors.beachside)), cancollide = false,
		cf = CFrame.new(pos.X, 1.6, pos.Z), parent = dynamic })
	local head = part({ name = "BuergerHead", shape = Enum.PartType.Ball, size = Vector3.new(1.3, 1.3, 1.3),
		color = Color3.fromRGB(232, 184, 143), cancollide = false,
		cf = CFrame.new(pos.X, 3.6, pos.Z), parent = dynamic })
	return { body = body, head = head, paid = false, diveT = 0 }
end

local function sidewalkPosNear(pos)
	for i = 1, 30 do
		local tx, tz = Config.worldToTile(pos.X, pos.Z)
		local rx = tx + math.floor(math.random() * 30) - 15
		local rz = tz + math.floor(math.random() * 30) - 15
		if rx >= 5 and rx < Config.BEACH_X and rz >= 5 and rz < 60 then
			if not Config.isRoadTile(rx, rz) then
				-- direkt neben einer Straße?
				if Config.isRoadTile(rx - 1, rz) or Config.isRoadTile(rx + 1, rz)
					or Config.isRoadTile(rx, rz - 1) or Config.isRoadTile(rx, rz + 1) then
					local x, z = Config.tileToWorld(rx, rz)
					return Vector3.new(x, 0, z)
				end
			end
		end
	end
	return nil
end

local function updateBuerger(plr, st, dt)
	local carPos = st.base.Position
	local carSpeed = st.base.AssemblyLinearVelocity.Magnitude
	-- Nachschub
	while #st.peds < 6 do
		local p = sidewalkPosNear(carPos)
		if p then
			st.peds[#st.peds + 1] = buildBuerger(p)
		else
			break
		end
	end
	local hupe = plr:GetAttribute("TSHupe") or 0
	local radius = 12 + hupe * 2
	for i = #st.peds, 1, -1 do
		local ped = st.peds[i]
		local d = (ped.body.Position - carPos).Magnitude
		if d > 260 then
			ped.body:Destroy()
			ped.head:Destroy()
			table.remove(st.peds, i)
		elseif ped.diveT <= 0 and d < radius and carSpeed > 24 then
			ped.diveT = 1
			local away = (ped.body.Position - carPos)
			away = Vector3.new(away.X, 0, away.Z).Unit * 9
			local target = ped.body.CFrame + away + Vector3.new(0, 1.5, 0)
			TweenService:Create(ped.body, TweenInfo.new(0.4, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
				{ CFrame = target }):Play()
			TweenService:Create(ped.head, TweenInfo.new(0.4, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
				{ CFrame = target * CFrame.new(0, 2, 0) }):Play()
			local bb = Instance.new("BillboardGui")
			bb.Size = UDim2.new(0, 120, 0, 40)
			bb.StudsOffset = Vector3.new(0, 3.4, 0)
			bb.AlwaysOnTop = true
			bb.Parent = ped.head
			local tl = Instance.new("TextLabel")
			tl.Size = UDim2.new(1, 0, 1, 0)
			tl.BackgroundTransparency = 1
			tl.Text = Config.PedLines[1 + math.floor(math.random() * #Config.PedLines)]
			tl.TextColor3 = Color3.new(1, 1, 1)
			tl.TextStrokeTransparency = 0.1
			tl.TextScaled = true
			tl.Font = Enum.Font.FredokaOne
			tl.Parent = bb
			game:GetService("Debris"):AddItem(bb, 1.4)
			if not ped.paid and carSpeed > 34 then
				ped.paid = true
				local bonus = (8 + hupe * 4) * math.max(1, starsOf(st))
				st.wallet = st.wallet + bonus
				plr:SetAttribute("TSWallet", st.wallet)
				toast(plr, "+$" .. bonus .. " knapp vorbei!")
			end
		elseif ped.diveT > 0 then
			ped.diveT = ped.diveT - dt
		end
	end
end

-- ------------------------------------------------------------- Persistenz
local DataStoreService = game:GetService("DataStoreService")
local store = nil
pcall(function()
	store = DataStoreService:GetDataStore("TurboSiesta_v1")
end)

local function savePlayer(plr)
	if not store then
		return
	end
	local st = state[plr]
	if not st then
		return
	end
	local data = { bank = st.bankValue.Value }
	for i = 1, #Config.Upgrades do
		local u = Config.Upgrades[i]
		data["u" .. u.id] = plr:GetAttribute("TS" .. u.id) or 0
	end
	pcall(function()
		store:SetAsync("p" .. plr.UserId, data)
	end)
end

local function loadPlayer(plr, bank)
	if not store then
		return
	end
	local ok, data = pcall(function()
		return store:GetAsync("p" .. plr.UserId)
	end)
	if ok and type(data) == "table" then
		bank.Value = data.bank or 0
		for i = 1, #Config.Upgrades do
			local u = Config.Upgrades[i]
			plr:SetAttribute("TS" .. u.id, data["u" .. u.id] or 0)
		end
	end
end

-- ----------------------------------------------------------- Spieler-Lifecycle
local function setupPlayer(plr)
	local ls = Instance.new("Folder")
	ls.Name = "leaderstats"
	ls.Parent = plr
	local bank = Instance.new("IntValue")
	bank.Name = "Bank"
	bank.Value = 0
	bank.Parent = ls

	state[plr] = {
		wallet = 0, serie = 0, heat = 0, evade = 0, bustT = 0, toastN = 0,
		offers = {}, active = nil, cops = {}, peds = {}, bankValue = bank,
		car = nil, seat = nil, base = nil, washCooldown = 0,
	}
	plr:SetAttribute("TSWallet", 0)
	plr:SetAttribute("TSStars", 0)
	plr:SetAttribute("TSSerie", 0)
	plr:SetAttribute("TSMission", "")
	task.spawn(loadPlayer, plr, bank)

	plr.CharacterAdded:Connect(function()
		task.wait(0.5)
		local st = state[plr]
		if not st then
			return
		end
		if st.car then
			st.car:Destroy()
		end
		local car, seat, base = buildCar(plr)
		st.car = car
		st.seat = seat
		st.base = base
		if #st.offers == 0 and not st.active then
			makeOffers(plr)
		end
	end)
end

Players.PlayerAdded:Connect(setupPlayer)

Players.PlayerRemoving:Connect(function(plr)
	savePlayer(plr)
	local st = state[plr]
	if st then
		clearOffers(st)
		if st.active and st.active.pad then
			st.active.pad:Destroy()
		end
		for i = 1, #st.cops do
			st.cops[i].model:Destroy()
		end
		for i = 1, #st.peds do
			st.peds[i].body:Destroy()
			st.peds[i].head:Destroy()
		end
		if st.car then
			st.car:Destroy()
		end
		state[plr] = nil
	end
end)

-- ------------------------------------------------------------------ Main-Loop
local function mainLoop()
	local now = 0
	RunService.Heartbeat:Connect(function(dt)
		now = now + dt
		for plr, st in pairs(state) do
			if st.base and st.base.Parent then
				local carPos = st.base.Position
				-- Angebote einsammeln
				if not st.active then
					for i = #st.offers, 1, -1 do
						local o = st.offers[i]
						if (Vector3.new(o.pos.X, 0, o.pos.Z) - Vector3.new(carPos.X, 0, carPos.Z)).Magnitude < 12 then
							acceptOffer(plr, o)
							break
						end
					end
				else
					st.active.timeLeft = st.active.timeLeft - dt
					plr:SetAttribute("TSTimeLeft", st.active.timeLeft)
					plr:SetAttribute("TSTimeTotal", st.active.total)
					local m = st.active
					if (Vector3.new(m.pos.X, 0, m.pos.Z) - Vector3.new(carPos.X, 0, carPos.Z)).Magnitude < 12 then
						endMission(plr, true)
					elseif m.timeLeft <= 0 then
						endMission(plr, false)
					end
				end
				-- Waschanlage
				if st.washCooldown > 0 then
					st.washCooldown = st.washCooldown - dt
				elseif washZone and (washZone.Position - carPos).Magnitude < 11 then
					st.washCooldown = 4
					if st.wallet > 0 then
						st.bankValue.Value = st.bankValue.Value + st.wallet
						toast(plr, string.format(Config.Texts.washBank, st.wallet))
						st.wallet = 0
						plr:SetAttribute("TSWallet", 0)
					elseif starsOf(st) > 0 then
						toast(plr, Config.Texts.washClean)
					end
					st.heat = 0
					st.bustT = 0
					plr:SetAttribute("TSStars", 0)
				end
				updateCops(plr, st, dt, now)
				updateBuerger(plr, st, dt)
			end
		end
	end)
end

game:BindToClose(function()
	local list = Players:GetPlayers()
	for i = 1, #list do
		savePlayer(list[i])
	end
end)

-- ----------------------------------------------------------------------- Boot
setupLighting()
buildGroundAndRoads()
buildBlocks()
mainLoop()

print("[TurboSiesta] Solara Bay steht. Viel Trinkgeld!")
