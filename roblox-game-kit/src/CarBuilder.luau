--!strict
-- CarBuilder: parametrische, fahrbare Autos aus Parts + Constraints.
-- Nutzung (z. B. via Studio-MCP run_code oder Command Bar):
--   local CarBuilder = require(game.ServerStorage.RobloxGameKit.CarBuilder)
--   CarBuilder.build({ position = Vector3.new(0, 5, 0) })

local CarBuilder = {}

export type CarConfig = {
	name: string?,
	position: Vector3?,
	bodyColor: Color3?,
	cabinColor: Color3?,
	wheelColor: Color3?,
	bodyMaterial: Enum.Material?,
	chassisSize: Vector3?, -- Länge (X), Höhe (Y), Breite (Z)
	wheelRadius: number?,
	wheelWidth: number?,
	maxSteerAngle: number?, -- Grad
	maxSpeed: number?, -- rad/s der Radmotoren
	torque: number?,
}

local DEFAULTS: CarConfig = {
	name = "Car",
	position = Vector3.new(0, 5, 0),
	bodyColor = Color3.fromRGB(196, 40, 28),
	cabinColor = Color3.fromRGB(27, 42, 53),
	wheelColor = Color3.fromRGB(17, 17, 17),
	bodyMaterial = Enum.Material.SmoothPlastic,
	chassisSize = Vector3.new(12, 1.2, 6),
	wheelRadius = 1.4,
	wheelWidth = 1,
	maxSteerAngle = 30,
	maxSpeed = 40,
	torque = 10000,
}

local function makePart(props: { [string]: any }): BasePart
	local part = Instance.new("Part")
	part.Anchored = false
	part.TopSurface = Enum.SurfaceType.Smooth
	part.BottomSurface = Enum.SurfaceType.Smooth
	for key, value in props do
		(part :: any)[key] = value
	end
	return part
end

local function weld(a: BasePart, b: BasePart)
	local w = Instance.new("WeldConstraint")
	w.Part0 = a
	w.Part1 = b
	w.Parent = a
end

-- Baut ein Rad samt Aufhängung. Vorderräder bekommen einen Lenk-Servo,
-- alle Räder einen Motor-Hinge.
local function buildWheel(
	model: Model,
	chassis: BasePart,
	offset: Vector3,
	isFront: boolean,
	cfg: CarConfig
): (HingeConstraint, HingeConstraint?)
	local radius = cfg.wheelRadius :: number
	local width = cfg.wheelWidth :: number

	-- Radträger (Knuckle): kleines unsichtbares Teil zwischen Chassis und Rad
	local knuckle = makePart({
		Name = "Knuckle",
		Size = Vector3.new(0.4, 0.4, 0.4),
		Transparency = 1,
		CFrame = chassis.CFrame * CFrame.new(offset),
		CanCollide = false,
		Massless = true,
	})
	knuckle.Parent = model

	local wheel = makePart({
		Name = isFront and "FrontWheel" or "RearWheel",
		Shape = Enum.PartType.Cylinder,
		Size = Vector3.new(width, radius * 2, radius * 2),
		Color = cfg.wheelColor,
		Material = Enum.Material.Rubber,
		-- Zylinder-Achse (X) quer zur Fahrtrichtung stellen
		CFrame = chassis.CFrame * CFrame.new(offset) * CFrame.Angles(0, 0, math.rad(90)) * CFrame.Angles(math.rad(90), 0, 0),
		CustomPhysicalProperties = PhysicalProperties.new(1.2, 1, 0.2, 1, 1),
	})
	wheel.Parent = model

	-- Lenkung (nur vorn): Servo-Hinge Chassis→Knuckle um die Y-Achse
	local steerHinge: HingeConstraint? = nil
	if isFront then
		local a0 = Instance.new("Attachment")
		a0.CFrame = CFrame.new(offset) * CFrame.Angles(0, 0, math.rad(90))
		a0.Parent = chassis
		local a1 = Instance.new("Attachment")
		a1.CFrame = CFrame.Angles(0, 0, math.rad(90))
		a1.Parent = knuckle

		local servo = Instance.new("HingeConstraint")
		servo.Name = "SteerHinge"
		servo.Attachment0 = a0
		servo.Attachment1 = a1
		servo.ActuatorType = Enum.ActuatorType.Servo
		servo.ServoMaxTorque = math.huge
		servo.AngularSpeed = 4
		servo.TargetAngle = 0
		servo.Parent = knuckle
		steerHinge = servo
	else
		weld(chassis, knuckle)
	end

	-- Antrieb: Motor-Hinge Knuckle→Rad um die Radachse
	local m0 = Instance.new("Attachment")
	m0.CFrame = CFrame.new(0, 0, 0) * CFrame.Angles(0, math.rad(90), 0)
	m0.Parent = knuckle
	local m1 = Instance.new("Attachment")
	m1.CFrame = CFrame.Angles(0, 0, math.rad(90))
	m1.Parent = wheel

	local motor = Instance.new("HingeConstraint")
	motor.Name = "WheelMotor"
	motor.Attachment0 = m0
	motor.Attachment1 = m1
	motor.ActuatorType = Enum.ActuatorType.Motor
	motor.MotorMaxTorque = cfg.torque :: number
	motor.AngularVelocity = 0
	motor.Parent = wheel

	return motor, steerHinge
end

function CarBuilder.build(config: CarConfig?): Model
	local cfg: CarConfig = table.clone(DEFAULTS)
	if config then
		for key, value in config :: any do
			(cfg :: any)[key] = value
		end
	end

	local size = cfg.chassisSize :: Vector3
	local pos = cfg.position :: Vector3

	local model = Instance.new("Model")
	model.Name = cfg.name :: string

	local chassis = makePart({
		Name = "Chassis",
		Size = size,
		Color = cfg.bodyColor,
		Material = cfg.bodyMaterial,
		CFrame = CFrame.new(pos),
	})
	chassis.Parent = model
	model.PrimaryPart = chassis

	-- Kabine
	local cabin = makePart({
		Name = "Cabin",
		Size = Vector3.new(size.X * 0.45, size.Y * 1.6, size.Z * 0.9),
		Color = cfg.cabinColor,
		Material = cfg.bodyMaterial,
		CFrame = chassis.CFrame * CFrame.new(-size.X * 0.05, size.Y * 1.3, 0),
	})
	cabin.Parent = model
	weld(chassis, cabin)

	-- Motorhaube (flacher Keil vorn)
	local hood = makePart({
		Name = "Hood",
		Size = Vector3.new(size.X * 0.35, size.Y * 0.8, size.Z * 0.9),
		Color = cfg.bodyColor,
		Material = cfg.bodyMaterial,
		CFrame = chassis.CFrame * CFrame.new(size.X * 0.3, size.Y * 0.9, 0),
	})
	hood.Parent = model
	weld(chassis, hood)

	-- Sitz
	local seat = Instance.new("VehicleSeat")
	seat.Name = "DriverSeat"
	seat.Size = Vector3.new(2, 1, 2)
	seat.Color = cfg.cabinColor :: Color3
	seat.MaxSpeed = cfg.maxSpeed :: number
	seat.TopSurface = Enum.SurfaceType.Smooth
	seat.CFrame = chassis.CFrame * CFrame.new(-size.X * 0.05, size.Y * 0.6 + 0.5, 0)
	seat.Parent = model
	weld(chassis, seat)

	-- Räder an den vier Ecken
	local wheelY = -size.Y / 2
	local xOff = size.X / 2 - (cfg.wheelRadius :: number)
	local zOff = size.Z / 2 + (cfg.wheelWidth :: number) / 2 + 0.1

	local motors: { HingeConstraint } = {}
	local servos: { HingeConstraint } = {}
	for _, corner in {
		{ Vector3.new(xOff, wheelY, zOff), true },
		{ Vector3.new(xOff, wheelY, -zOff), true },
		{ Vector3.new(-xOff, wheelY, zOff), false },
		{ Vector3.new(-xOff, wheelY, -zOff), false },
	} do
		local motor, servo = buildWheel(model, chassis, corner[1] :: Vector3, corner[2] :: boolean, cfg)
		table.insert(motors, motor)
		if servo then
			table.insert(servos, servo)
		end
	end

	-- Fahr-Logik: Sitz-Input auf Motoren/Servos übertragen
	local controller = Instance.new("Script")
	controller.Name = "DriveController"
	controller.Source = [[
local seat = script.Parent :: VehicleSeat
local model = seat.Parent
local MAX_STEER = ]] .. tostring(cfg.maxSteerAngle) .. [[

local motors = {}
local servos = {}
for _, d in model:GetDescendants() do
	if d.Name == "WheelMotor" then table.insert(motors, d) end
	if d.Name == "SteerHinge" then table.insert(servos, d) end
end

local function update()
	for _, m in motors do
		-- Vorzeichen je nach Radseite, damit alle in Fahrtrichtung drehen
		local side = math.sign(m.Attachment0.WorldPosition.Z - seat.Position.Z)
		m.AngularVelocity = -seat.Throttle * seat.MaxSpeed * (side >= 0 and 1 or -1)
	end
	for _, s in servos do
		s.TargetAngle = seat.Steer * MAX_STEER
	end
end

seat:GetPropertyChangedSignal("Throttle"):Connect(update)
seat:GetPropertyChangedSignal("Steer"):Connect(update)
]]
	controller.Parent = seat

	model.Parent = workspace
	return model
end

return CarBuilder
