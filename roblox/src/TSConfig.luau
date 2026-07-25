-- TSConfig: Geteilte Konfiguration für Turbo Siesta (Roblox-Portierung).
-- Bewusst Lua-5.1-kompatibel gehalten (keine Compound-Assignments/Typen),
-- damit die Quellen extern validierbar bleiben.

local Config = {}

-- Stadtraster: 1 Kachel = 12 Studs, 64x64 Kacheln (~768x768 Studs)
Config.TILE = 12
Config.GW = 64
Config.GH = 64
Config.SEED = 20260725

-- Straßen: vertikale Spalten alle 10 Kacheln (4..54), horizontale Reihen alle 8 (4..60)
Config.ROADS_V = { 4, 14, 24, 34, 44, 54 }
Config.ROADS_H = { 4, 12, 20, 28, 36, 44, 52, 60 }
Config.BEACH_X = 56 -- ab hier Strand
Config.WATER_X = 60 -- ab hier Meer

function Config.origin()
	return -(Config.GW * Config.TILE) / 2, -(Config.GH * Config.TILE) / 2
end

function Config.tileToWorld(tx, tz)
	local ox, oz = Config.origin()
	return ox + (tx + 0.5) * Config.TILE, oz + (tz + 0.5) * Config.TILE
end

function Config.worldToTile(x, z)
	local ox, oz = Config.origin()
	return math.floor((x - ox) / Config.TILE), math.floor((z - oz) / Config.TILE)
end

function Config.isRoadTile(tx, tz)
	if tx < 4 or tz < 4 or tz > 61 then
		return false
	end
	local isV = false
	if tx <= 55 then
		local m = (tx - 4) % 10
		isV = (m == 0 or m == 1)
	end
	local isH = false
	if tx <= 55 then
		local m = (tz - 4) % 8
		isH = (m == 0 or m == 1)
	end
	return isV or isH
end

function Config.isRoadAt(x, z)
	local tx, tz = Config.worldToTile(x, z)
	return Config.isRoadTile(tx, tz)
end

-- Distrikt-Zuordnung (Analog zur Web-Version, herunterskaliert)
function Config.districtAt(tx, tz)
	if tx >= 44 then
		return "beachside"
	end
	if tx < 24 and tz < 32 then
		return "downtown"
	end
	if tz >= 40 and tx < 32 then
		return "docks"
	end
	return "burbs"
end

-- Sunset-Pop-Palette (RGB 0-255)
Config.Colors = {
	road = { 61, 44, 94 },
	roadLine = { 255, 193, 69 },
	sidewalk = { 163, 148, 194 },
	grass = { 127, 174, 106 },
	park = { 46, 158, 99 },
	beach = { 249, 233, 208 },
	water = { 0, 184, 169 },
	player = { 255, 94, 91 },
	patrol = { 78, 168, 255 },
	star = { 255, 193, 69 },
	flamingo = { 255, 79, 160 },
	wash = { 125, 222, 139 },
	palmTrunk = { 138, 102, 68 },
	palmLeaf = { 46, 158, 99 },
	downtown = { { 232, 217, 192 }, { 217, 198, 168 }, { 240, 226, 200 }, { 201, 180, 148 } },
	beachside = { { 242, 184, 198 }, { 247, 213, 156 }, { 168, 220, 217 }, { 246, 231, 193 } },
	docks = { { 176, 138, 103 }, { 201, 162, 232 }, { 127, 195, 224 }, { 232, 193, 90 } },
	burbs = { { 246, 231, 193 }, { 242, 201, 162 }, { 232, 184, 143 }, { 240, 217, 176 } },
}

-- Missionstypen (Lohn = Basis + Distanz-Rate, dann × Serie × Sterne)
Config.Missions = {
	{ id = "churro", label = "CHURROS", color = { 255, 193, 69 }, payMult = 1.0, risk = 0, timeFactor = 0.95,
		flavor = { "32 Churros. Noch warm. Noch.", "Die halbe Stadt bestellt Frühstück. Um 17 Uhr.", "Der Bäcker macht Siesta. Du nicht." } },
	{ id = "eis", label = "EIS", color = { 127, 195, 224 }, payMult = 1.15, risk = 0, timeFactor = 0.8,
		flavor = { "30 Kugeln. Die Waffel schmilzt!", "Eis für die Siesta-Patrol. Ironie fährt mit.", "Vanille-Notfall an der Promenada." } },
	{ id = "shuttle", label = "SHUTTLE", color = { 201, 162, 232 }, payMult = 1.35, risk = 0.6, timeFactor = 0.85,
		flavor = { "@LaVidaLotta braucht Golden-Hour-Content. JETZT.", "B-Promi flieht vor der eigenen Doku.", "DJ Solara kommt zu spät zum eigenen Set." } },
	-- Hinweis: bewusst ohne Krypto-Referenzen (Roblox-Moderation), anders als die Web-Version
	{ id = "kurier", label = "KURIER", color = { 78, 168, 255 }, payMult = 1.6, risk = 1.0, timeFactor = 1.0,
		flavor = { "Ein Umschlag aus Marina Bling. Frag nicht.", "Ein Paket. Es tickt nicht, versprochen.", "Ein Poster. 'Wertanlage.'" } },
	{ id = "heiss", label = "HEISS", color = { 255, 94, 91 }, payMult = 2.0, risk = 1.6, timeFactor = 1.05,
		flavor = { "Leasing nicht gezahlt: Hol den Wagen. Diskret.", "12 Sammler-Gartenzwerge. Keine Fragen.", "Jemand schuldet dem Pfandhaus ein Jetski." } },
}

-- Upgrades (Roblox-Set; Feder-Stoßstange folgt mit dem Verkehrs-Update)
Config.Upgrades = {
	{ id = "Turbo", name = "Turbotank", desc = "+ Beschleunigung & Topspeed", base = 320 },
	{ id = "Grip", name = "Grip-Reifen", desc = "+ Kurvenhalt, weniger Offroad-Malus", base = 300 },
	{ id = "Hupe", name = "Alphorn-Hupe", desc = "Bürger springen früher — mehr Bonus", base = 280 },
}

Config.PedLines = { "OHA!", "¡Uy!", "Meine Churros!", "Ich film das!", "SIESTA!!", "Uy, uy, uy!" }

Config.Texts = {
	ticket = "KNÖLLCHEN! Ungesichertes Trinkgeld weg.",
	washBank = "Gesichert: +$%d — Sterne abgewaschen.",
	washClean = "Sterne abgewaschen. Braver Bürger.",
	musterbuerger = "\"Der? Niemals. Der blinkt ja.\"",
	cooled = "Ruhestörung vergessen. Siesta siegt.",
	tooLate = "Zu spät! Der Kunde storniert.",
	delivered = "Abgeliefert!",
	deliveredHot = "Abgeliefert bei %d Sternen — ×%d!",
}

-- Fahrzeug-Tuning
Config.Car = {
	maxSpeed = 62,        -- Studs/s Grundwert
	maxSpeedPerTurbo = 6,
	accel = 34,
	accelPerTurbo = 5,
	reverseSpeed = 20,
	turnRate = 1.35,      -- rad/s Grundwert
	turnPerGrip = 0.18,
	offroadFactor = 0.55, -- Anteil der Höchstgeschwindigkeit abseits der Straße
	offroadGripBonus = 0.06,
}

Config.Police = {
	speedBase = 58,
	speedPerStar = 3,
	ticketDist = 13,
	ticketSpeed = 9,
	ticketTime = 1.2,
	nearDist = 140,
	evadeTime = 4,
	creepFactor = 1.6,
}

return Config
