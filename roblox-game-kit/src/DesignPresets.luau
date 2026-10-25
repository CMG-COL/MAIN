--!strict
-- DesignPresets: fertige Design-Vorlagen für CarBuilder und BuildingBuilder.
-- Nutzung:
--   local Presets = require(game.ServerStorage.RobloxGameKit.DesignPresets)
--   local CarBuilder = require(game.ServerStorage.RobloxGameKit.CarBuilder)
--   CarBuilder.build(Presets.cars.sportwagen(Vector3.new(0, 5, 0)))

local DesignPresets = {}

DesignPresets.cars = {
	sportwagen = function(position: Vector3)
		return {
			name = "Sportwagen",
			position = position,
			bodyColor = Color3.fromRGB(213, 29, 36),
			cabinColor = Color3.fromRGB(20, 20, 20),
			bodyMaterial = Enum.Material.SmoothPlastic,
			chassisSize = Vector3.new(13, 1, 6),
			wheelRadius = 1.3,
			maxSpeed = 60,
			torque = 14000,
			maxSteerAngle = 25,
		}
	end,

	gelaendewagen = function(position: Vector3)
		return {
			name = "Geländewagen",
			position = position,
			bodyColor = Color3.fromRGB(58, 78, 52),
			cabinColor = Color3.fromRGB(35, 35, 35),
			bodyMaterial = Enum.Material.Metal,
			chassisSize = Vector3.new(11, 1.8, 6.5),
			wheelRadius = 2,
			wheelWidth = 1.4,
			maxSpeed = 35,
			torque = 20000,
			maxSteerAngle = 35,
		}
	end,

	taxi = function(position: Vector3)
		return {
			name = "Taxi",
			position = position,
			bodyColor = Color3.fromRGB(245, 205, 48),
			cabinColor = Color3.fromRGB(27, 42, 53),
			chassisSize = Vector3.new(12, 1.3, 6),
			maxSpeed = 45,
			torque = 11000,
		}
	end,

	polizei = function(position: Vector3)
		return {
			name = "Polizeiwagen",
			position = position,
			bodyColor = Color3.fromRGB(255, 255, 255),
			cabinColor = Color3.fromRGB(0, 32, 96),
			chassisSize = Vector3.new(12.5, 1.2, 6),
			maxSpeed = 55,
			torque = 13000,
		}
	end,
}

DesignPresets.buildings = {
	wohnhaus = function(position: Vector3)
		return {
			name = "Wohnhaus",
			position = position,
			width = 26,
			depth = 20,
			floors = 2,
			floorHeight = 9,
			wallColor = Color3.fromRGB(238, 232, 219),
			wallMaterial = Enum.Material.Brick,
			windowsPerWall = 2,
			roofColor = Color3.fromRGB(96, 46, 32),
		}
	end,

	buerohaus = function(position: Vector3)
		return {
			name = "Bürohaus",
			position = position,
			width = 34,
			depth = 28,
			floors = 6,
			floorHeight = 10,
			wallColor = Color3.fromRGB(160, 170, 180),
			wallMaterial = Enum.Material.Concrete,
			windowColor = Color3.fromRGB(90, 140, 190),
			windowsPerWall = 4,
			roofColor = Color3.fromRGB(50, 50, 50),
		}
	end,

	laden = function(position: Vector3)
		return {
			name = "Ladengeschäft",
			position = position,
			width = 22,
			depth = 16,
			floors = 1,
			floorHeight = 11,
			wallColor = Color3.fromRGB(215, 100, 70),
			wallMaterial = Enum.Material.Stucco,
			windowsPerWall = 3,
			roofColor = Color3.fromRGB(70, 70, 70),
		}
	end,
}

return DesignPresets
