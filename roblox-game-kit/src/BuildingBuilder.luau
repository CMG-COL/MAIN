--!strict
-- BuildingBuilder: parametrische Gebäude (Stockwerke, Fenster, Tür, Flachdach).
-- Wände werden aus Segmenten gebaut (keine CSG-Unions nötig).
-- Nutzung:
--   local BuildingBuilder = require(game.ServerStorage.RobloxGameKit.BuildingBuilder)
--   BuildingBuilder.build({ position = Vector3.new(50, 0, 0), floors = 3 })

local BuildingBuilder = {}

export type BuildingConfig = {
	name: string?,
	position: Vector3?, -- Bodenmittelpunkt
	width: number?, -- X
	depth: number?, -- Z
	floors: number?,
	floorHeight: number?,
	wallThickness: number?,
	wallColor: Color3?,
	wallMaterial: Enum.Material?,
	windowColor: Color3?,
	windowsPerWall: number?,
	roofColor: Color3?,
	doorHeight: number?,
	doorWidth: number?,
}

local DEFAULTS: BuildingConfig = {
	name = "Building",
	position = Vector3.new(0, 0, 0),
	width = 30,
	depth = 24,
	floors = 3,
	floorHeight = 10,
	wallThickness = 1,
	wallColor = Color3.fromRGB(238, 232, 219),
	wallMaterial = Enum.Material.Concrete,
	windowColor = Color3.fromRGB(121, 181, 220),
	windowsPerWall = 3,
	roofColor = Color3.fromRGB(60, 60, 60),
	doorHeight = 7,
	doorWidth = 5,
}

local function makePart(parent: Instance, props: { [string]: any }): BasePart
	local part = Instance.new("Part")
	part.Anchored = true
	part.TopSurface = Enum.SurfaceType.Smooth
	part.BottomSurface = Enum.SurfaceType.Smooth
	for key, value in props do
		(part :: any)[key] = value
	end
	part.Parent = parent
	return part
end

-- Baut eine Wand entlang X (front/back) mit Fensteröffnungen; optional Türloch.
local function buildWall(
	model: Model,
	origin: CFrame, -- Mitte der Wand-Grundlinie, Blick nach außen
	length: number,
	cfg: BuildingConfig,
	floorIndex: number,
	withDoor: boolean
)
	local h = cfg.floorHeight :: number
	local t = cfg.wallThickness :: number
	local windows = cfg.windowsPerWall :: number
	local baseY = floorIndex * h

	local windowWidth = length / (windows * 2 + 1) -- Fenster und Pfeiler wechseln sich ab
	local windowHeight = h * 0.45
	local sillHeight = h * 0.3 -- Brüstung
	local lintelHeight = h - sillHeight - windowHeight -- Sturz oben

	-- Segmente entlang der Wand: Pfeiler | Fenster | Pfeiler | ...
	local x = -length / 2
	for i = 1, windows * 2 + 1 do
		local segWidth = windowWidth
		local isWindowSlot = (i % 2 == 0)
		local centerX = x + segWidth / 2

		if isWindowSlot then
			local isDoorSlot = withDoor and floorIndex == 0 and i == windows + (windows % 2 == 0 and 0 or 1)
			if isDoorSlot then
				-- Türöffnung: nur Sturz oben, unten frei
				local dh = cfg.doorHeight :: number
				makePart(model, {
					Name = "DoorLintel",
					Size = Vector3.new(segWidth, h - dh, t),
					Color = cfg.wallColor,
					Material = cfg.wallMaterial,
					CFrame = origin * CFrame.new(centerX, baseY + dh + (h - dh) / 2, 0),
				})
			else
				-- Brüstung
				makePart(model, {
					Name = "Sill",
					Size = Vector3.new(segWidth, sillHeight, t),
					Color = cfg.wallColor,
					Material = cfg.wallMaterial,
					CFrame = origin * CFrame.new(centerX, baseY + sillHeight / 2, 0),
				})
				-- Fensterglas
				makePart(model, {
					Name = "Window",
					Size = Vector3.new(segWidth, windowHeight, t * 0.3),
					Color = cfg.windowColor,
					Material = Enum.Material.Glass,
					Transparency = 0.35,
					CFrame = origin * CFrame.new(centerX, baseY + sillHeight + windowHeight / 2, 0),
				})
				-- Sturz
				makePart(model, {
					Name = "Lintel",
					Size = Vector3.new(segWidth, lintelHeight, t),
					Color = cfg.wallColor,
					Material = cfg.wallMaterial,
					CFrame = origin * CFrame.new(centerX, baseY + sillHeight + windowHeight + lintelHeight / 2, 0),
				})
			end
		else
			-- Massiver Pfeiler
			makePart(model, {
				Name = "Pier",
				Size = Vector3.new(segWidth, h, t),
				Color = cfg.wallColor,
				Material = cfg.wallMaterial,
				CFrame = origin * CFrame.new(centerX, baseY + h / 2, 0),
			})
		end
		x += segWidth
	end
end

function BuildingBuilder.build(config: BuildingConfig?): Model
	local cfg: BuildingConfig = table.clone(DEFAULTS)
	if config then
		for key, value in config :: any do
			(cfg :: any)[key] = value
		end
	end

	local w = cfg.width :: number
	local d = cfg.depth :: number
	local floors = cfg.floors :: number
	local h = cfg.floorHeight :: number
	local t = cfg.wallThickness :: number
	local pos = cfg.position :: Vector3

	local model = Instance.new("Model")
	model.Name = cfg.name :: string

	local base = CFrame.new(pos)

	-- Bodenplatte
	makePart(model, {
		Name = "Foundation",
		Size = Vector3.new(w, 1, d),
		Color = cfg.roofColor,
		Material = Enum.Material.Concrete,
		CFrame = base * CFrame.new(0, -0.5, 0),
	})

	for floor = 0, floors - 1 do
		-- Front (Tür im Erdgeschoss) und Rückseite
		buildWall(model, base * CFrame.new(0, 0, d / 2 - t / 2), w, cfg, floor, true)
		buildWall(model, base * CFrame.new(0, 0, -(d / 2 - t / 2)) * CFrame.Angles(0, math.rad(180), 0), w, cfg, floor, false)
		-- Seitenwände (mit Fenstern, ohne Tür)
		buildWall(model, base * CFrame.new(w / 2 - t / 2, 0, 0) * CFrame.Angles(0, math.rad(-90), 0), d - 2 * t, cfg, floor, false)
		buildWall(model, base * CFrame.new(-(w / 2 - t / 2), 0, 0) * CFrame.Angles(0, math.rad(90), 0), d - 2 * t, cfg, floor, false)

		-- Zwischendecke / Dach
		local isRoof = floor == floors - 1
		makePart(model, {
			Name = isRoof and "Roof" or ("Ceiling_" .. floor),
			Size = Vector3.new(w, 1, d),
			Color = isRoof and cfg.roofColor or cfg.wallColor,
			Material = Enum.Material.Concrete,
			CFrame = base * CFrame.new(0, (floor + 1) * h + 0.5, 0),
		})
	end

	-- Dachkante
	makePart(model, {
		Name = "RoofTrim",
		Size = Vector3.new(w + 1, 1.5, d + 1),
		Color = cfg.roofColor,
		Material = Enum.Material.Slate,
		CFrame = base * CFrame.new(0, floors * h + 1, 0),
	})

	model.Parent = workspace
	return model
end

return BuildingBuilder
