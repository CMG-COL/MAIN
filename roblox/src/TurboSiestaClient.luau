-- Turbo Siesta — Client: Fahrsteuerung (VehicleSeat-Inputs), Top-Down-Kamera
-- und HUD im Sunset-Pop-Stil. Läuft in StarterPlayerScripts.

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Workspace = game:GetService("Workspace")

local Config = require(ReplicatedStorage:WaitForChild("TSConfig"))
local player = Players.LocalPlayer

local function rgb(t)
	return Color3.fromRGB(t[1], t[2], t[3])
end

-- ------------------------------------------------------------------ Auto finden
local myCar = nil
local mySeat = nil
local myBase = nil

local function tryAdoptCar(model)
	if model:IsA("Model") and model:GetAttribute("TSOwner") == player.UserId then
		myCar = model
		mySeat = model:WaitForChild("Seat", 5)
		myBase = model:WaitForChild("Base", 5)
	end
end

local dynamic = Workspace:WaitForChild("TSDynamic", 30)
if dynamic then
	for i, m in pairs(dynamic:GetChildren()) do
		tryAdoptCar(m)
	end
	dynamic.ChildAdded:Connect(function(m)
		task.wait(0.2)
		tryAdoptCar(m)
	end)
end

local function isSeated()
	if not mySeat or not mySeat.Parent then
		return false
	end
	local occ = mySeat.Occupant
	if not occ then
		return false
	end
	local char = player.Character
	return char ~= nil and occ:IsDescendantOf(char)
end

-- ------------------------------------------------------------------- Fahrphysik
local speed = 0

RunService.Heartbeat:Connect(function(dt)
	if not (myBase and myBase.Parent and isSeated()) then
		speed = 0
		return
	end
	local throttle = mySeat.Throttle -- 1 vor, -1 zurück (WASD, Pfeile, Mobile-UI)
	local steer = mySeat.Steer -- -1 links, 1 rechts

	local turbo = player:GetAttribute("TSTurbo") or 0
	local grip = player:GetAttribute("TSGrip") or 0
	local maxS = Config.Car.maxSpeed + turbo * Config.Car.maxSpeedPerTurbo
	local accel = Config.Car.accel + turbo * Config.Car.accelPerTurbo

	local pos = myBase.Position
	local offroad = not Config.isRoadAt(pos.X, pos.Z)
	if offroad then
		local f = Config.Car.offroadFactor + grip * Config.Car.offroadGripBonus
		maxS = maxS * math.min(1, f)
	end

	local target = 0
	if throttle > 0 then
		target = maxS
	elseif throttle < 0 then
		target = -Config.Car.reverseSpeed
	end
	if speed < target then
		speed = math.min(target, speed + accel * dt)
	else
		speed = math.max(target, speed - (throttle < 0 and accel or accel * 1.6) * dt)
	end

	local speedFrac = math.abs(speed) / (Config.Car.maxSpeed + turbo * Config.Car.maxSpeedPerTurbo)
	local turnRate = (Config.Car.turnRate + grip * Config.Car.turnPerGrip)
		* (0.35 + 0.65 * math.min(1, speedFrac * 1.6))
	local dirSign = speed < 0 and 1 or -1
	local turn = steer * turnRate * dirSign

	local look = myBase.CFrame.LookVector
	local flat = Vector3.new(look.X, 0, look.Z)
	if flat.Magnitude < 0.05 then
		flat = Vector3.new(0, 0, -1)
	else
		flat = flat.Unit
	end
	local vy = myBase.AssemblyLinearVelocity.Y
	myBase.AssemblyLinearVelocity = flat * speed + Vector3.new(0, vy, 0)
	myBase.AssemblyAngularVelocity = Vector3.new(0, turn, 0)

	-- Anti-Flip: wenn das Auto kippt, sanft aufrichten
	if myBase.CFrame.UpVector.Y < 0.35 then
		local p = myBase.Position
		myBase.CFrame = CFrame.new(Vector3.new(p.X, p.Y + 2, p.Z), Vector3.new(p.X + flat.X, p.Y + 2, p.Z + flat.Z))
		myBase.AssemblyLinearVelocity = Vector3.new(0, 0, 0)
		myBase.AssemblyAngularVelocity = Vector3.new(0, 0, 0)
	end
end)

-- --------------------------------------------------------------- Top-Down-Kamera
local camera = Workspace.CurrentCamera

RunService.RenderStepped:Connect(function()
	if myBase and myBase.Parent and isSeated() then
		camera.CameraType = Enum.CameraType.Scriptable
		local p = myBase.Position
		local vel = myBase.AssemblyLinearVelocity
		local ahead = Vector3.new(vel.X, 0, vel.Z) * 0.55
		local focus = p + ahead
		camera.CFrame = CFrame.new(Vector3.new(focus.X, p.Y + 96, focus.Z + 34), focus)
	else
		camera.CameraType = Enum.CameraType.Custom
	end
end)

-- ------------------------------------------------------------------------- HUD
local gui = Instance.new("ScreenGui")
gui.Name = "TurboSiestaHUD"
gui.ResetOnSpawn = false
gui.IgnoreGuiInset = true
gui.Parent = player:WaitForChild("PlayerGui")

local FONT = Enum.Font.FredokaOne

local function label(props)
	local l = Instance.new("TextLabel")
	l.BackgroundTransparency = props.bg and 0.25 or 1
	l.BackgroundColor3 = Color3.fromRGB(43, 26, 85)
	l.BorderSizePixel = 0
	l.Font = FONT
	l.TextColor3 = props.color or Color3.new(1, 1, 1)
	l.Text = props.text or ""
	l.TextScaled = true
	l.Size = props.size
	l.Position = props.pos
	l.AnchorPoint = props.anchor or Vector2.new(0, 0)
	l.Parent = props.parent or gui
	if props.bg then
		local c = Instance.new("UICorner")
		c.CornerRadius = UDim.new(0, 12)
		c.Parent = l
	end
	return l
end

local walletL = label({ text = "$0", color = rgb(Config.Colors.star), bg = true,
	size = UDim2.new(0, 150, 0, 44), pos = UDim2.new(0, 14, 0, 14) })
local bankL = label({ text = "Bank $0", color = Color3.fromRGB(255, 246, 230), bg = true,
	size = UDim2.new(0, 150, 0, 26), pos = UDim2.new(0, 14, 0, 62) })
local serieL = label({ text = "", color = rgb(Config.Colors.flamingo), bg = true,
	size = UDim2.new(0, 150, 0, 26), pos = UDim2.new(0, 14, 0, 92) })
serieL.Visible = false

local starsL = label({ text = "", color = rgb(Config.Colors.star),
	size = UDim2.new(0, 240, 0, 34), pos = UDim2.new(1, -14, 0, 14), anchor = Vector2.new(1, 0) })
starsL.TextXAlignment = Enum.TextXAlignment.Right
local multL = label({ text = "", color = rgb(Config.Colors.star),
	size = UDim2.new(0, 240, 0, 22), pos = UDim2.new(1, -14, 0, 50), anchor = Vector2.new(1, 0) })
multL.TextXAlignment = Enum.TextXAlignment.Right

local missionL = label({ text = "", color = Color3.new(1, 1, 1), bg = true,
	size = UDim2.new(0, 300, 0, 34), pos = UDim2.new(0.5, 0, 0, 14), anchor = Vector2.new(0.5, 0) })
missionL.Visible = false
local timerBg = Instance.new("Frame")
timerBg.Size = UDim2.new(0, 280, 0, 8)
timerBg.Position = UDim2.new(0.5, 0, 0, 52)
timerBg.AnchorPoint = Vector2.new(0.5, 0)
timerBg.BackgroundColor3 = Color3.fromRGB(43, 26, 85)
timerBg.BorderSizePixel = 0
timerBg.Visible = false
timerBg.Parent = gui
local timerBar = Instance.new("Frame")
timerBar.Size = UDim2.new(1, 0, 1, 0)
timerBar.BackgroundColor3 = rgb(Config.Colors.star)
timerBar.BorderSizePixel = 0
timerBar.Parent = timerBg

local hintL = label({ text = "In die Marker fahren = Job annehmen · Waschanlage bankt dein Trinkgeld",
	color = Color3.fromRGB(255, 246, 230), bg = true,
	size = UDim2.new(0, 420, 0, 30), pos = UDim2.new(0.5, 0, 1, -56), anchor = Vector2.new(0.5, 1) })
task.delay(12, function()
	hintL.Visible = false
end)

-- Toast-Stapel
local toastFrame = Instance.new("Frame")
toastFrame.BackgroundTransparency = 1
toastFrame.Size = UDim2.new(0, 340, 0, 130)
toastFrame.Position = UDim2.new(0.5, 0, 0, 66)
toastFrame.AnchorPoint = Vector2.new(0.5, 0)
toastFrame.Parent = gui
local toastLayout = Instance.new("UIListLayout")
toastLayout.Padding = UDim.new(0, 6)
toastLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
toastLayout.Parent = toastFrame

local function showToast(msg)
	local t = label({ text = msg, color = Color3.fromRGB(255, 246, 230), bg = true,
		size = UDim2.new(1, 0, 0, 30), pos = UDim2.new(0, 0, 0, 0), parent = toastFrame })
	task.delay(3.2, function()
		t:Destroy()
	end)
end

-- ------------------------------------------------------------ Attribute binden
local function updateWallet()
	walletL.Text = "$" .. tostring(player:GetAttribute("TSWallet") or 0)
end
local function updateStars()
	local s = player:GetAttribute("TSStars") or 0
	local txt = ""
	for i = 1, 5 do
		txt = txt .. (i <= s and "★" or "☆")
	end
	starsL.Text = txt
	multL.Text = s > 0 and ("ALLES ×" .. math.max(1, s)) or ""
end
local function updateSerie()
	local s = player:GetAttribute("TSSerie") or 0
	serieL.Visible = s >= 2
	serieL.Text = "SERIE ×" .. string.format("%.2f", 1 + s * 0.15)
end
local function updateMission()
	local m = player:GetAttribute("TSMission") or ""
	missionL.Visible = (m ~= "")
	timerBg.Visible = (m ~= "")
	missionL.Text = m
end

player:GetAttributeChangedSignal("TSWallet"):Connect(updateWallet)
player:GetAttributeChangedSignal("TSStars"):Connect(updateStars)
player:GetAttributeChangedSignal("TSSerie"):Connect(updateSerie)
player:GetAttributeChangedSignal("TSMission"):Connect(updateMission)
player:GetAttributeChangedSignal("TSToast"):Connect(function()
	local raw = player:GetAttribute("TSToast") or ""
	local sep = string.find(raw, "|", 1, true)
	if sep then
		showToast(string.sub(raw, sep + 1))
	end
end)

RunService.Heartbeat:Connect(function()
	local left = player:GetAttribute("TSTimeLeft") or 0
	local total = player:GetAttribute("TSTimeTotal") or 1
	if total > 0 then
		local frac = math.max(0, math.min(1, left / total))
		timerBar.Size = UDim2.new(frac, 0, 1, 0)
		timerBar.BackgroundColor3 = frac < 0.25 and Color3.fromRGB(255, 92, 92) or rgb(Config.Colors.star)
	end
	local ls = player:FindFirstChild("leaderstats")
	local bank = ls and ls:FindFirstChild("Bank")
	if bank then
		bankL.Text = "Bank $" .. tostring(bank.Value)
	end
end)

updateWallet()
updateStars()
updateSerie()
updateMission()
