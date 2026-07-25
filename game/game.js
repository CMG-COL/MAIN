'use strict';
/* =========================================================================
   SUNNYSIDE HUSTLE — Top-Down-Arcade-Fahrspiel für iPhone (Canvas 2D, PWA)
   Eigenständiger Stil "im Geiste von" GTA V: sonnige Küstenstadt, Palmen,
   Fahndungssterne, satirischer Ton — alles original, nichts kopiert.
   ========================================================================= */

/* ---------------------------- Branding & Texte --------------------------- */
const BRAND = {
  name1: 'TURBO',
  name2: 'SIESTA',
  city: 'Solara Bay',
  tagline: 'Slow town. Full throttle.',
  saveKey: 'turbosiesta.save.v1',
  startHint: 'Links lenken · Rechts Gas',
  pedLines: ['OHA!', '¡Uy!', 'Meine Churros!', 'Ich film das!', 'SIESTA!!', 'Uy, uy, uy!', 'Mein Smoothie!', 'Ruhestörung!'],
  bootLines: [
    'Radio Solara: Bürgermeisterin eröffnet dritte Hängematten-Spur.',
    'Stadtverordnung §1: Es ist immer irgendwo Siesta.',
    'BJÖRNSTAD: Möbel, die du nie aufbauen wirst. Jetzt mit Rabatt.',
    '$SOLCOIN heute: -38%. "Ein guter Einstiegszeitpunkt", sagt der Bro.',
    'Kale Force One: Der einzige Saft mit Anwaltsschreiben-Geschmack.',
    'Die Siesta-Patrol bittet: Bitte hupen Sie leiser.',
  ],
  bustedTitle: 'KNÖLLCHEN!',
  bustedText: 'Eingekeilt. Knöllchen-Selfie. Dein ungesichertes Trinkgeld:',
};

/* ------------------------------- Farbwelt -------------------------------- */
const PAL = {
  // "Sunset-Pop": ewige Golden Hour — Asphalt in warmem Lila statt Grau
  grass: '#7fae6a', park: '#2E9E63', parkDark: '#298f58',
  road: '#3D2C5E', roadLine: '#FFC145', sidewalk: '#a394c2', sidewalkEdge: '#8f80b0',
  beach: '#F9E9D0', beachDark: '#efdcb8', water: '#00B8A9', waterDeep: '#00a396',
  lot: '#54427c',
  shadow: 'rgba(61,44,94,0.32)',
  downtown: ['#e8d9c0', '#d9c6a8', '#f0e2c8', '#c9b494', '#e0cfae'],
  beachside: ['#f2b8c6', '#f7d59c', '#a8dcd9', '#f6e7c1', '#d9b8e8'],
  docks: ['#b08a67', '#c9a2e8', '#7fc3e0', '#e8c15a', '#9c7a5c'],
  burbs: ['#f6e7c1', '#f2c9a2', '#e8b88f', '#f0d9b0', '#e0c39c'],
  roofline: 'rgba(255,244,214,0.4)',
  palmTrunk: '#8a6644', palmLeaf: '#2E9E63', palmLeafLight: '#3cb374',
  player: '#FF5E5B', playerDark: '#d94744',
  cop: '#f4f0ff', copDark: '#4EA8FF',
  traffic: ['#e8c15a', '#7fc3e0', '#c9a2e8', '#8fce8f', '#e89a72', '#f2f2f2', '#6d89c9'],
  star: '#FFC145',
  hud: 'rgba(43,26,85,0.75)', hudText: '#fff6e6', accent: '#FF8C42', good: '#7dde8b', bad: '#ff5c5c',
  flamingo: '#FF4FA0',
  sunset1: 'rgba(255,140,66,0.10)', sunset2: 'rgba(90,40,120,0.14)',
};

/* --------------------------- Missionen & Shop ---------------------------- */
const MTYPES = [
  { id: 'churro', label: 'CHURROS', color: '#FFC145', icon: 'C', payMult: 1.0, risk: 0, timeFactor: 0.95,
    flavor: ['32 Churros. Noch warm. Noch.', 'Die halbe Stadt bestellt Frühstück. Um 17 Uhr.', 'Der Bäcker macht Siesta. Du nicht.'] },
  { id: 'eis', label: 'EIS', color: '#7fc3e0', icon: 'E', payMult: 1.15, risk: 0, timeFactor: 0.8,
    flavor: ['30 Kugeln. Die Waffel schmilzt!', 'Eis für die Siesta-Patrol. Ironie fährt mit.', 'Vanille-Notfall an der Promenada.'] },
  { id: 'shuttle', label: 'SHUTTLE', color: '#c9a2e8', icon: 'S', payMult: 1.35, risk: 0.6, timeFactor: 0.85,
    flavor: ['@LaVidaLotta braucht Golden-Hour-Content. JETZT.', 'B-Promi flieht vor der eigenen Doku.', 'DJ Solara kommt zu spät zum eigenen Set.'] },
  { id: 'krypto', label: 'KRYPTO', color: '#4EA8FF', icon: 'K', payMult: 1.6, risk: 1.0, timeFactor: 1.0,
    flavor: ['Hardware-Wallet für den $SOLCOIN-Bro. Der Kurs fällt.', 'Ein Umschlag aus Marina Bling. Frag nicht.', 'Ein NFT-Poster. "Wertanlage."'] },
  { id: 'heiss', label: 'HEISS', color: '#FF5E5B', icon: 'H', payMult: 2.0, risk: 1.6, timeFactor: 1.05,
    flavor: ['Leasing nicht gezahlt: Hol den Wagen. Diskret.', '12 Sammler-Gartenzwerge. Keine Fragen.', 'Jemand schuldet dem Pfandhaus ein Jetski.'] },
];

const UPGRADES = [
  { id: 'turbo', name: 'Turbotank', desc: '+ Beschleunigung & Topspeed', base: 320 },
  { id: 'grip', name: 'Grip-Reifen', desc: '+ Kurvenhalt für Mercado Viejo', base: 300 },
  { id: 'horn', name: 'Alphorn-Hupe', desc: 'Passanten springen früher — mehr Bonus', base: 280 },
  { id: 'bumper', name: 'Feder-Stoßstange', desc: 'Rempler kosten weniger Tempo', base: 260 },
];

/* ------------------------------ Mathe-Kram ------------------------------- */
const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const dist2 = (ax, ay, bx, by) => { const dx = ax - bx, dy = ay - by; return dx * dx + dy * dy; };
const angTo = (ax, ay, bx, by) => Math.atan2(by - ay, bx - ax);
function angDiff(a, b) { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; }
function mulberry32(s) { return function () { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (arr, r) => arr[Math.floor((r || Math.random()) * arr.length) % arr.length];
function rrect(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
const fmt$ = (n) => '$' + Math.round(n).toLocaleString('de-DE');

/* ------------------------------ Canvas-Setup ----------------------------- */
const cvs = document.getElementById('game');
const ctx = cvs.getContext('2d');
let VW = 0, VH = 0, SCALE = 1, DPR = 1;
let SAFE = { top: 12, right: 12, bottom: 12, left: 12 };

function readSafeArea() {
  const probe = document.getElementById('safe-probe');
  if (!probe) return;
  const cs = getComputedStyle(probe);
  SAFE.top = Math.max(12, parseFloat(cs.top) || 0);
  SAFE.left = Math.max(12, parseFloat(cs.left) || 0);
  SAFE.right = Math.max(12, parseFloat(cs.right) || 0);
  SAFE.bottom = Math.max(12, parseFloat(cs.bottom) || 0);
}
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  VW = window.innerWidth; VH = window.innerHeight;
  cvs.width = Math.round(VW * DPR); cvs.height = Math.round(VH * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  SCALE = clamp(Math.min(VW, VH) / 430, 0.85, 1.55);
  readSafeArea();
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 250));

/* ------------------------------ Stadt-Layout ----------------------------- */
const TILE = 36, GW = 112, GH = 112;
const T_GRASS = 0, T_ROAD = 1, T_SIDE = 2, T_BLDG = 3, T_PARK = 4, T_WATER = 5, T_BEACH = 6, T_LOT = 7;
const grid = new Uint8Array(GW * GH);
const tileAt = (tx, ty) => (tx < 0 || ty < 0 || tx >= GW || ty >= GH) ? T_GRASS : grid[ty * GW + tx];
const setTile = (tx, ty, t) => { if (tx >= 0 && ty >= 0 && tx < GW && ty < GH) grid[ty * GW + tx] = t; };
const isSolidTile = (t) => t === T_BLDG || t === T_WATER;
const solidAt = (px, py) => isSolidTile(tileAt(Math.floor(px / TILE), Math.floor(py / TILE)));
const onRoadAt = (px, py) => { const t = tileAt(Math.floor(px / TILE), Math.floor(py / TILE)); return t === T_ROAD || t === T_LOT; };

const buildings = [], palms = [], props = [], roadTiles = [];
const CELL = 8, CGW = Math.ceil(GW / CELL), CGH = Math.ceil(GH / CELL);
const cellBuildings = [], cellPalms = [], cellProps = [];
for (let i = 0; i < CGW * CGH; i++) { cellBuildings.push([]); cellPalms.push([]); cellProps.push([]); }
const cellIndex = (px, py) => {
  const cx = clamp(Math.floor(px / TILE / CELL), 0, CGW - 1);
  const cy = clamp(Math.floor(py / TILE / CELL), 0, CGH - 1);
  return cy * CGW + cx;
};

function districtAt(tx, ty) {
  if (tx >= 78) return 'beachside';
  if (tx < 42 && ty < 58) return 'downtown';
  if (ty >= 72) return 'docks';
  return 'burbs';
}

const roadsV = [], roadsH = [];
function generateCity() {
  const rng = mulberry32(20260725);
  for (let x = 4; x <= 94; x += 10) roadsV.push(x);
  for (let y = 4; y <= 100; y += 8) roadsH.push(y);

  // Küste: Strand + Wasser am Ostrand
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    if (x >= 104) setTile(x, y, T_WATER);
    else if (x >= 97) setTile(x, y, T_BEACH);
  }
  // Straßen (je 2 Kacheln breit)
  for (const rx of roadsV) for (let y = 4; y <= 101; y++) { setTile(rx, y, T_ROAD); setTile(rx + 1, y, T_ROAD); }
  for (const ry of roadsH) for (let x = 4; x <= 96; x++) { setTile(x, ry, T_ROAD); setTile(x + 1, ry, T_ROAD); }

  // Blöcke füllen
  for (let vi = 0; vi < roadsV.length - 1; vi++) for (let hi = 0; hi < roadsH.length - 1; hi++) {
    const x0 = roadsV[vi] + 2, x1 = roadsV[vi + 1] - 1;
    const y0 = roadsH[hi] + 2, y1 = roadsH[hi + 1] - 1;
    if (x1 < x0 || y1 < y0 || x0 >= 97) continue;
    const cx = (x0 + x1) >> 1, cy = (y0 + y1) >> 1;
    const dist = districtAt(cx, cy);
    // Gehweg-Ring
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= Math.min(x1, 96); x++) {
      if (x === x0 || x === x1 || y === y0 || y === y1) setTile(x, y, T_SIDE);
    }
    const roll = rng();
    const ix0 = x0 + 1, ix1 = Math.min(x1, 96) - 1, iy0 = y0 + 1, iy1 = y1 - 1;
    if (ix1 < ix0 || iy1 < iy0) continue;
    if (roll < 0.13) { // Park mit Palmen
      for (let y = iy0; y <= iy1; y++) for (let x = ix0; x <= ix1; x++) setTile(x, y, T_PARK);
      const n = 2 + Math.floor(rng() * 4);
      for (let i = 0; i < n; i++) addPalm((ix0 + rng() * (ix1 - ix0 + 1)) * TILE, (iy0 + rng() * (iy1 - iy0 + 1)) * TILE, rng);
    } else if (roll < 0.2) { // Parkplatz
      for (let y = iy0; y <= iy1; y++) for (let x = ix0; x <= ix1; x++) setTile(x, y, T_LOT);
      for (let i = 0; i < 3; i++) if (rng() < 0.7) addProp('parked', (ix0 + 0.5 + Math.floor(rng() * (ix1 - ix0)) ) * TILE, (iy0 + 0.5 + Math.floor(rng() * (iy1 - iy0))) * TILE, rng);
    } else {
      fillBuildings(ix0, iy0, ix1, iy1, dist, rng);
    }
  }
  // Strand-Deko
  const brng = mulberry32(99);
  for (let y = 4; y < GH - 4; y += 2) {
    if (brng() < 0.34) addPalm((97.5 + brng() * 5.5) * TILE, y * TILE, brng);
    if (brng() < 0.2) addProp('umbrella', (98 + brng() * 5) * TILE, (y + 1) * TILE, brng);
  }
  // Container an den Docks
  const drng = mulberry32(7);
  for (const b of buildings) if (b.district === 'docks' && drng() < 0.5) {
    addProp('container', b.x + b.w * drng(), b.y - 14, drng);
  }
  // Straßenkacheln sammeln (für Spawns/Missionen)
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    if (grid[y * GW + x] === T_ROAD) roadTiles.push({ x, y });
  }
}
function fillBuildings(ix0, iy0, ix1, iy1, district, rng) {
  const w = ix1 - ix0 + 1, h = iy1 - iy0 + 1;
  const splitX = w >= 6 && rng() < 0.75;
  const splitY = h >= 4 && rng() < (district === 'burbs' ? 0.8 : 0.35);
  const xs = splitX ? [ix0, ix0 + Math.floor(w / 2) + (rng() < 0.5 ? -1 : 0), ix1 + 1] : [ix0, ix1 + 1];
  const ys = splitY ? [iy0, iy0 + Math.floor(h / 2), iy1 + 1] : [iy0, iy1 + 1];
  for (let xi = 0; xi < xs.length - 1; xi++) for (let yi = 0; yi < ys.length - 1; yi++) {
    const bx0 = xs[xi] + (xi > 0 ? 1 : 0), bx1 = xs[xi + 1] - 1;
    const by0 = ys[yi] + (yi > 0 ? 1 : 0), by1 = ys[yi + 1] - 1;
    if (bx1 < bx0 || by1 < by0 || rng() < 0.06) continue;
    for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) setTile(x, y, T_BLDG);
    const colors = PAL[district] || PAL.burbs;
    const b = {
      x: bx0 * TILE + 2, y: by0 * TILE + 2,
      w: (bx1 - bx0 + 1) * TILE - 4, h: (by1 - by0 + 1) * TILE - 4,
      color: pick(colors, rng()), tall: district === 'downtown' ? 2 + rng() * 2 : 0.8 + rng() * 0.8,
      district, seed: rng(),
    };
    buildings.push(b);
    cellBuildings[cellIndex(b.x + b.w / 2, b.y + b.h / 2)].push(b);
  }
}
function addPalm(x, y, rng) {
  const p = { x, y, r: 13 + rng() * 7, sway: rng() * TAU };
  palms.push(p); cellPalms[cellIndex(x, y)].push(p);
}
function addProp(type, x, y, rng) {
  const p = { type, x, y, a: rng() * TAU, c: Math.floor(rng() * 5) };
  props.push(p); cellProps[cellIndex(x, y)].push(p);
}

function randomRoadPos(minD, maxD, fromX, fromY) {
  for (let i = 0; i < 60; i++) {
    const t = roadTiles[Math.floor(Math.random() * roadTiles.length)];
    const px = t.x * TILE + TILE / 2, py = t.y * TILE + TILE / 2;
    const d = Math.sqrt(dist2(px, py, fromX, fromY));
    if (d >= minD && d <= maxD) return { x: px, y: py };
  }
  const t = roadTiles[Math.floor(Math.random() * roadTiles.length)];
  return { x: t.x * TILE + TILE / 2, y: t.y * TILE + TILE / 2 };
}

/* ------------------------------- Minimap --------------------------------- */
const mmCvs = document.createElement('canvas');
function renderMinimap() {
  mmCvs.width = GW; mmCvs.height = GH;
  const m = mmCvs.getContext('2d');
  const cols = {
    [T_GRASS]: '#6f9e5c', [T_ROAD]: '#3f3f4a', [T_SIDE]: '#8a847f', [T_BLDG]: '#5d5470',
    [T_PARK]: '#5f9752', [T_WATER]: '#2e7f9e', [T_BEACH]: '#e8d3a0', [T_LOT]: '#66626a',
  };
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    m.fillStyle = cols[grid[y * GW + x]] || '#000';
    m.fillRect(x, y, 1, 1);
  }
}

/* -------------------------------- Audio ---------------------------------- */
const Snd = {
  ctx: null, master: null, engine: null, engineGain: null,
  sirenOsc: null, sirenGain: null, sirenPhase: 0, muted: false,
  init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.8;
      this.master.connect(this.ctx.destination);
      this.engine = this.ctx.createOscillator();
      this.engine.type = 'sawtooth';
      this.engine.frequency.value = 50;
      const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
      this.engineGain = this.ctx.createGain(); this.engineGain.gain.value = 0;
      this.engine.connect(lp); lp.connect(this.engineGain); this.engineGain.connect(this.master);
      this.engine.start();
      this.sirenOsc = this.ctx.createOscillator(); this.sirenOsc.type = 'triangle';
      this.sirenGain = this.ctx.createGain(); this.sirenGain.gain.value = 0;
      this.sirenOsc.connect(this.sirenGain); this.sirenGain.connect(this.master);
      this.sirenOsc.start();
    } catch (e) { /* Audio optional */ }
  },
  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
  setMuted(m) { this.muted = m; if (this.master) this.master.gain.value = m ? 0 : 0.8; },
  engineAt(ratio, on) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.engine.frequency.setTargetAtTime(46 + ratio * 130, t, 0.05);
    this.engineGain.gain.setTargetAtTime(on ? 0.05 + ratio * 0.05 : 0, t, 0.1);
  },
  sirenAt(on, dt) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (on) {
      this.sirenPhase += dt * 2.2;
      const f = (Math.floor(this.sirenPhase) % 2 === 0) ? 690 : 920;
      this.sirenOsc.frequency.setTargetAtTime(f, t, 0.04);
      this.sirenGain.gain.setTargetAtTime(0.045, t, 0.1);
    } else this.sirenGain.gain.setTargetAtTime(0, t, 0.15);
  },
  blip(freq, dur, type, vol) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type || 'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur);
  },
  sfx(name) {
    if (!this.ctx || this.muted) return;
    switch (name) {
      case 'cash': this.blip(880, 0.09); setTimeout(() => this.blip(1320, 0.12), 70); break;
      case 'pickup': this.blip(520, 0.08, 'sine'); setTimeout(() => this.blip(780, 0.1, 'sine'), 60); break;
      case 'crash': { const t = this.ctx.currentTime, len = 0.18;
        const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * len, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
        const src = this.ctx.createBufferSource(); src.buffer = buf;
        const g = this.ctx.createGain(); g.gain.value = 0.16;
        src.connect(g); g.connect(this.master); src.start(t); break; }
      case 'busted': this.blip(420, 0.25, 'sawtooth', 0.14); setTimeout(() => this.blip(300, 0.3, 'sawtooth', 0.14), 180); break;
      case 'buy': this.blip(660, 0.07); setTimeout(() => this.blip(990, 0.14), 60); break;
      case 'fail': this.blip(330, 0.18, 'sine', 0.1); setTimeout(() => this.blip(240, 0.24, 'sine', 0.1), 130); break;
      case 'honk': this.blip(310, 0.14, 'square', 0.08); break;
      case 'star': this.blip(1180, 0.1, 'triangle', 0.12); break;
    }
  },
};

/* -------------------------------- Eingabe -------------------------------- */
const input = { steer: 0, gas: false, brake: false };
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'KeyP' || e.code === 'Escape') togglePause();
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

const touches = { stick: null, gas: null, brake: null };
const stick = { active: false, bx: 0, by: 0, dx: 0 };
const btnGas = { x: 0, y: 0, r: 56 }, btnBrake = { x: 0, y: 0, r: 42 };
let isTouchDevice = false;
function layoutButtons() {
  btnGas.x = VW - SAFE.right - 62; btnGas.y = VH - SAFE.bottom - 88;
  btnBrake.x = VW - SAFE.right - 158; btnBrake.y = VH - SAFE.bottom - 50;
}
const hitCircle = (x, y, c, slack) => dist2(x, y, c.x, c.y) < (c.r + (slack || 14)) * (c.r + (slack || 14));

const uiHits = [];
function addHit(x, y, w, h, fn) { uiHits.push({ x, y, w, h, fn }); }
function tapUI(x, y) {
  for (const h of uiHits) if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) { h.fn(); return true; }
  return false;
}

cvs.addEventListener('touchstart', (e) => {
  e.preventDefault(); isTouchDevice = true;
  Snd.init(); Snd.resume();
  for (const t of e.changedTouches) {
    const x = t.clientX, y = t.clientY;
    if (game.state !== 'play') { tapScreen(x, y); continue; }
    if (tapUI(x, y)) continue;
    if (hitCircle(x, y, btnGas)) { touches.gas = t.identifier; input.gas = true; }
    else if (hitCircle(x, y, btnBrake)) { touches.brake = t.identifier; input.brake = true; }
    else if (x < VW * 0.46) { touches.stick = t.identifier; stick.active = true; stick.bx = x; stick.by = y; stick.dx = 0; }
    else if (y < VH * 0.4) { /* freie Fläche rechts oben: Gas als Fallback */ touches.gas = t.identifier; input.gas = true; }
  }
}, { passive: false });
cvs.addEventListener('touchmove', (e) => {
  e.preventDefault();
  for (const t of e.changedTouches) {
    if (t.identifier === touches.stick) stick.dx = clamp((t.clientX - stick.bx) / 48, -1, 1);
  }
}, { passive: false });
function endTouch(e) {
  e.preventDefault();
  for (const t of e.changedTouches) {
    if (t.identifier === touches.stick) { touches.stick = null; stick.active = false; stick.dx = 0; }
    if (t.identifier === touches.gas) { touches.gas = null; input.gas = false; }
    if (t.identifier === touches.brake) { touches.brake = null; input.brake = false; }
  }
}
cvs.addEventListener('touchend', endTouch, { passive: false });
cvs.addEventListener('touchcancel', endTouch, { passive: false });
cvs.addEventListener('mousedown', (e) => { Snd.init(); Snd.resume(); if (game.state !== 'play') tapScreen(e.clientX, e.clientY); else tapUI(e.clientX, e.clientY); });
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());

function pollKeyboard() {
  let steer = 0;
  if (keys.ArrowLeft || keys.KeyA) steer -= 1;
  if (keys.ArrowRight || keys.KeyD) steer += 1;
  if (stick.active) steer = stick.dx;
  input.steer = steer;
  const kGas = keys.ArrowUp || keys.KeyW, kBrake = keys.ArrowDown || keys.KeyS || keys.Space;
  if (!isTouchDevice) { input.gas = !!kGas; input.brake = !!kBrake; }
  else { if (kGas) input.gas = true; if (kBrake) input.brake = true; }
}

/* ------------------------------- Spielstand ------------------------------ */
const save = { cash: 0, best: 0, upg: { turbo: 0, grip: 0, horn: 0, bumper: 0 }, mute: false, seenHint: false };
function loadSave() {
  try {
    const raw = localStorage.getItem(BRAND.saveKey);
    if (raw) Object.assign(save, JSON.parse(raw));
  } catch (e) { /* privater Modus etc. */ }
  Snd.muted = !!save.mute;
}
let saveTimer = 0;
function persist() {
  try { localStorage.setItem(BRAND.saveKey, JSON.stringify(save)); } catch (e) { }
}

/* --------------------------------- Welt ---------------------------------- */
const game = {
  state: 'title', time: 0, heat: 0, evade: 0, bustT: 0,
  combo: 0, wallet: 0, banked: 0, shake: 0, bootLine: 0, hintT: 6,
  garageCooldown: 0, fine: 0, toasts: [], pops: [], bubbles: [],
};
// Sterne = Ruhestörungs-Level = Live-Multiplikator auf alles Ungesicherte (×1–×5)
const starMult = () => Math.max(1, Math.ceil(game.heat));
const cam = { x: 0, y: 0 };
const player = { x: 0, y: 0, angle: -Math.PI / 2, speed: 0, w: 17, h: 34, skidT: 0 };
const trafficCars = [], peds = [], cops = [], particles = [], skids = [];
let offers = [], activeMission = null, garagePos = null;

function statMax() { return 250 + save.upg.turbo * 18; }
function statAccel() { return 300 + save.upg.turbo * 36; }
function statGrip() { return 2.6 + save.upg.grip * 0.35; }
function hornRadius() { return 54 + save.upg.horn * 9; }
function bumperSave() { return save.upg.bumper; }

function resetPlayer(px, py) {
  player.x = px; player.y = py; player.angle = -Math.PI / 2; player.speed = 0;
}
function startRun() {
  game.state = 'play';
  game.heat = 0; game.evade = 0; game.bustT = 0; game.combo = 0; game.wallet = 0;
  cops.length = 0; activeMission = null;
  makeOffers();
  if (!save.seenHint) { game.hintT = 6; save.seenHint = true; persist(); } else game.hintT = 2.5;
}

/* ------------------------------- Missionen ------------------------------- */
function makeOffers() {
  offers = [];
  const usedTypes = new Set();
  for (let i = 0; i < 3; i++) {
    let mt;
    do { mt = pick(MTYPES); } while (usedTypes.has(mt.id) && usedTypes.size < MTYPES.length);
    usedTypes.add(mt.id);
    const p = randomRoadPos(500, 2200, player.x, player.y);
    offers.push({ type: mt, x: p.x, y: p.y, pulse: Math.random() * TAU });
  }
}
function acceptOffer(o) {
  const drop = randomRoadPos(700, 2600, o.x, o.y);
  const d = Math.sqrt(dist2(o.x, o.y, drop.x, drop.y));
  const pay = Math.round((45 + d * 0.05 * o.type.payMult) / 5) * 5;
  const time = (d / 165 + 9) * o.type.timeFactor;
  activeMission = { type: o.type, x: drop.x, y: drop.y, pay, time, total: time, flavor: pick(o.type.flavor) };
  offers = offers.filter((x) => x !== o);
  if (o.type.risk > 0) { addHeat(o.type.risk); Snd.sfx('star'); }
  Snd.sfx('pickup');
  toast(o.type.label + ': ' + activeMission.flavor, o.type.color);
}
function completeMission() {
  const streakMult = 1 + game.combo * 0.15;
  const sm = starMult();
  const payout = Math.round(activeMission.pay * streakMult * sm);
  game.wallet += payout; // ungesichert! Erst die Waschanlage macht daraus Bank-Cash.
  game.combo = Math.min(game.combo + 1, 10);
  pop(player.x, player.y - 30, '+' + fmt$(payout) + (sm > 1 ? ' ×' + sm : ''), sm > 1 ? PAL.star : PAL.good);
  toast(sm > 1 ? 'Abgeliefert bei ' + sm + ' Sternen — ×' + sm + '!' : 'Abgeliefert!', PAL.good);
  Snd.sfx('cash');
  activeMission = null;
  makeOffers();
}
function failMission(reason) {
  toast(reason || 'Job verpatzt.', PAL.bad);
  Snd.sfx('fail');
  game.combo = 0; activeMission = null;
  if (offers.length < 3) makeOffers();
}

function addHeat(h) {
  const before = Math.ceil(game.heat);
  game.heat = clamp(game.heat + h, 0, 5);
  if (Math.ceil(game.heat) > before) Snd.sfx('star');
  game.evade = 0;
}

/* --------------------------------- Cops ---------------------------------- */
function spawnCop() {
  const p = randomRoadPos(480, 900, player.x, player.y);
  cops.push({ x: p.x, y: p.y, angle: angTo(p.x, p.y, player.x, player.y), speed: 0, w: 17, h: 32, stuck: 0, flash: Math.random() * 10 });
}
function updateCops(dt) {
  const want = Math.ceil(game.heat);
  while (cops.length < want) spawnCop();
  if (want === 0 && cops.length) cops.length = 0;
  let anyNear = false;
  for (const c of cops) {
    const d = Math.sqrt(dist2(c.x, c.y, player.x, player.y));
    if (d < 460) anyNear = true;
    const target = angTo(c.x, c.y, player.x, player.y);
    let steerTo = target;
    // Hindernis-Sonden
    const probe = 44;
    const fx = c.x + Math.cos(c.angle) * probe, fy = c.y + Math.sin(c.angle) * probe;
    if (solidAt(fx, fy)) {
      const lx = c.x + Math.cos(c.angle - 0.9) * probe, ly = c.y + Math.sin(c.angle - 0.9) * probe;
      steerTo = solidAt(lx, ly) ? c.angle + 1.1 : c.angle - 1.1;
    }
    const diff = angDiff(c.angle, steerTo);
    c.angle += clamp(diff, -2.4 * dt, 2.4 * dt);
    const wantSpeed = d < 60 ? 150 : 235 + Math.ceil(game.heat) * 14;
    c.speed = lerp(c.speed, wantSpeed, 1 - Math.pow(0.02, dt));
    const nx = c.x + Math.cos(c.angle) * c.speed * dt;
    const ny = c.y + Math.sin(c.angle) * c.speed * dt;
    if (!solidAt(nx, ny)) { c.x = nx; c.y = ny; c.stuck = 0; }
    else { c.stuck += dt; c.angle += 2.2 * dt; }
    if (c.stuck > 2.2) { const p = randomRoadPos(420, 700, player.x, player.y); c.x = p.x; c.y = p.y; c.stuck = 0; }
    c.flash += dt * 8;
    // Rammt der Cop den Spieler?
    if (d < 30) {
      if (Math.abs(player.speed) < 45) game.bustT += dt;
      else { player.speed *= 0.86; game.shake = Math.max(game.shake, 3); }
    }
  }
  if (game.heat > 0) {
    // Entweder klassisch abhängen — oder der Musterbürger-Trick: demonstrativ
    // brav im Schritttempo an der Patrol vorbeischleichen (geht schneller).
    const creeping = anyNear && Math.abs(player.speed) < 45;
    if (!anyNear) game.evade += dt;
    else if (creeping && game.bustT < 0.05) game.evade += dt * 1.6;
    else game.evade = 0;
    if (game.evade > 4) {
      game.heat = Math.max(0, Math.ceil(game.heat) - 1); game.evade = 0;
      if (creeping) toast('"Der? Niemals. Der blinkt ja."', PAL.good);
      else if (game.heat === 0) toast('Ruhestörung vergessen. Siesta siegt.', PAL.good);
    }
  }
  if (!cops.some((c) => dist2(c.x, c.y, player.x, player.y) < 40 * 40)) game.bustT = Math.max(0, game.bustT - dt * 2);
  if (game.bustT > 1.05) busted();
}
function busted() {
  // Kein Drama, keine Zelle: Knöllchen-Selfie. Das ungesicherte Trinkgeld ist
  // futsch — was auf der Bank liegt, bleibt.
  game.fine = Math.round(game.wallet);
  game.wallet = 0;
  game.state = 'busted';
  game.heat = 0; cops.length = 0; game.bustT = 0; game.combo = 0;
  if (activeMission) { activeMission = null; makeOffers(); }
  Snd.sfx('busted');
  Snd.engineAt(0, false); Snd.sirenAt(false, 0);
  persist();
}

/* ------------------------------ Verkehr & Peds --------------------------- */
const DIRS = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];
function spawnTraffic() {
  const p = randomRoadPos(420, 1000, player.x, player.y);
  const dir = Math.floor(Math.random() * 4);
  trafficCars.push({
    x: p.x, y: p.y, dir, angle: Math.atan2(DIRS[dir].y, DIRS[dir].x), speed: 55 + Math.random() * 35,
    color: pick(PAL.traffic), w: 16, h: 30, honkT: 0, bump: 0, spin: 0,
  });
}
function updateTraffic(dt) {
  while (trafficCars.length < 11) spawnTraffic();
  for (let i = trafficCars.length - 1; i >= 0; i--) {
    const c = trafficCars[i];
    if (dist2(c.x, c.y, player.x, player.y) > 1400 * 1400) { trafficCars.splice(i, 1); continue; }
    if (c.bump > 0) { // angerempelt: trudeln
      c.bump -= dt; c.x += Math.cos(c.angle) * c.speed * dt * 0.4; c.angle += c.spin * dt;
      continue;
    }
    // bremsen, wenn was vor der Haube ist
    const fx = c.x + Math.cos(c.angle) * 40, fy = c.y + Math.sin(c.angle) * 40;
    let blocked = dist2(fx, fy, player.x, player.y) < 34 * 34;
    if (!blocked) for (const o of trafficCars) { if (o !== c && dist2(fx, fy, o.x, o.y) < 26 * 26) { blocked = true; break; } }
    const wantSpeed = blocked ? 0 : 55 + (c.speed % 35);
    if (blocked && c.honkT <= 0 && Math.random() < 0.02) { Snd.sfx('honk'); c.honkT = 2; }
    c.honkT -= dt;
    const cur = lerp(c.speed * (blocked ? 0 : 1), wantSpeed, 0.5);
    const step = cur * dt;
    const nx = c.x + DIRS[c.dir].x * step, ny = c.y + DIRS[c.dir].y * step;
    // An Kachelmitte: Richtung neu würfeln, wenn vorn keine Straße
    const tx = Math.floor(nx / TILE), ty = Math.floor(ny / TILE);
    const aheadT = tileAt(tx + DIRS[c.dir].x, ty + DIRS[c.dir].y);
    if (aheadT !== T_ROAD) {
      const options = [];
      for (let d = 0; d < 4; d++) {
        if (d === (c.dir + 2) % 4) continue;
        if (tileAt(tx + DIRS[d].x, ty + DIRS[d].y) === T_ROAD) options.push(d);
      }
      if (options.length) c.dir = pick(options);
      else c.dir = (c.dir + 2) % 4;
    }
    const ta = Math.atan2(DIRS[c.dir].y, DIRS[c.dir].x);
    c.angle += clamp(angDiff(c.angle, ta), -4 * dt, 4 * dt);
    if (!blocked && onRoadAt(nx, ny)) { c.x = nx; c.y = ny; }
    // Kollision mit Spieler
    if (dist2(c.x, c.y, player.x, player.y) < 26 * 26 && Math.abs(player.speed) > 70) {
      c.bump = 1.2; c.spin = (Math.random() - 0.5) * 6; c.angle += (Math.random() - 0.5) * 0.6;
      player.speed *= 0.7 + bumperSave() * 0.04; game.shake = 4; sparks(c.x, c.y, 6);
      Snd.sfx('crash');
      if (game.heat > 0) addHeat(0.15);
    }
  }
}
function spawnPed() {
  for (let i = 0; i < 40; i++) {
    const a = Math.random() * TAU, d = 300 + Math.random() * 700;
    const px = player.x + Math.cos(a) * d, py = player.y + Math.sin(a) * d;
    const t = tileAt(Math.floor(px / TILE), Math.floor(py / TILE));
    if (t === T_SIDE || t === T_BEACH || t === T_PARK) {
      peds.push({ x: px, y: py, a: Math.random() * TAU, t: 0, dive: 0, dvx: 0, dvy: 0, hue: Math.floor(Math.random() * 5), said: false, paid: false });
      return;
    }
  }
}
function updatePeds(dt) {
  while (peds.length < 13) spawnPed();
  for (let i = peds.length - 1; i >= 0; i--) {
    const p = peds[i];
    if (dist2(p.x, p.y, player.x, player.y) > 1300 * 1300) { peds.splice(i, 1); continue; }
    p.t += dt;
    if (p.dive > 0) {
      p.dive -= dt; p.x += p.dvx * dt; p.y += p.dvy * dt;
      continue;
    }
    // Ausweich-Hechtsprung (niemand wird je verletzt — Comedy!)
    const d2p = dist2(p.x, p.y, player.x, player.y);
    const hr = hornRadius();
    if (d2p < hr * hr && Math.abs(player.speed) > 65) {
      const away = angTo(player.x, player.y, p.x, p.y);
      p.dive = 0.7; p.dvx = Math.cos(away) * 190; p.dvy = Math.sin(away) * 190;
      if (!p.said && Math.random() < 0.7) { bubble(p.x, p.y, pick(BRAND.pedLines)); p.said = true; }
      // Schulterblick-Bonus: Beinahe-Unfälle sind guter Content
      if (!p.paid && Math.abs(player.speed) > 85) {
        p.paid = true;
        const bonus = (8 + save.upg.horn * 4) * starMult();
        game.wallet += bonus;
        pop(p.x, p.y - 14, '+' + fmt$(bonus) + ' knapp!', PAL.flamingo);
      }
      continue;
    }
    if (Math.random() < 0.01) p.a += (Math.random() - 0.5) * 2;
    const nx = p.x + Math.cos(p.a) * 22 * dt, ny = p.y + Math.sin(p.a) * 22 * dt;
    const t = tileAt(Math.floor(nx / TILE), Math.floor(ny / TILE));
    if (t === T_SIDE || t === T_BEACH || t === T_PARK || t === T_LOT) { p.x = nx; p.y = ny; }
    else p.a += Math.PI / 2 + Math.random();
  }
}

/* ------------------------- Partikel, Skids, Popups ------------------------ */
function sparks(x, y, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU, s = 60 + Math.random() * 160;
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.4, max: 0.4, color: '#ffd23f', size: 2.5 });
  }
}
function splash(x, y) {
  for (let i = 0; i < 8; i++) {
    const a = Math.random() * TAU, s = 40 + Math.random() * 110;
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.5, max: 0.5, color: '#bfe6f2', size: 3 });
  }
}
function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.92; p.vy *= 0.92;
    if (p.life <= 0) particles.splice(i, 1);
  }
  for (let i = skids.length - 1; i >= 0; i--) { skids[i].life -= dt; if (skids[i].life <= 0) skids.splice(i, 1); }
  for (let i = game.pops.length - 1; i >= 0; i--) { const p = game.pops[i]; p.t += dt; p.y -= 24 * dt; if (p.t > 1.6) game.pops.splice(i, 1); }
  for (let i = game.bubbles.length - 1; i >= 0; i--) { game.bubbles[i].t += dt; if (game.bubbles[i].t > 1.8) game.bubbles.splice(i, 1); }
  for (let i = game.toasts.length - 1; i >= 0; i--) { game.toasts[i].t += dt; if (game.toasts[i].t > 3.4) game.toasts.splice(i, 1); }
}
function pop(x, y, text, color) { game.pops.push({ x, y, text, color, t: 0 }); }
function bubble(x, y, text) { game.bubbles.push({ x, y, text, t: 0 }); }
function toast(text, color) { game.toasts.push({ text, color: color || PAL.hudText, t: 0 }); if (game.toasts.length > 3) game.toasts.shift(); }

/* ------------------------------ Spieler-Physik --------------------------- */
function carCorners(x, y, angle, w, h) {
  const ca = Math.cos(angle), sa = Math.sin(angle);
  const hw = w / 2, hh = h / 2;
  // Auto zeigt mit "h" nach vorn entlang angle
  return [
    { x: x + ca * hh - sa * hw, y: y + sa * hh + ca * hw },
    { x: x + ca * hh + sa * hw, y: y + sa * hh - ca * hw },
    { x: x - ca * hh - sa * hw, y: y - sa * hh + ca * hw },
    { x: x - ca * hh + sa * hw, y: y - sa * hh - ca * hw },
  ];
}
function collides(x, y, angle) {
  for (const c of carCorners(x, y, angle, player.w, player.h)) if (solidAt(c.x, c.y)) return true;
  return false;
}
function updatePlayer(dt) {
  const maxS = statMax(), acc = statAccel(), grip = statGrip();
  const offroad = !onRoadAt(player.x, player.y) && tileAt(Math.floor(player.x / TILE), Math.floor(player.y / TILE)) !== T_SIDE;
  const cap = offroad ? maxS * 0.55 : maxS;

  if (input.gas) player.speed += acc * dt;
  else if (input.brake) player.speed -= (player.speed > 0 ? 420 : 160) * dt;
  else player.speed -= player.speed * 1.1 * dt;
  player.speed = clamp(player.speed, -95, cap);
  if (Math.abs(player.speed) < 2 && !input.gas && !input.brake) player.speed = 0;

  const speedRatio = Math.abs(player.speed) / maxS;
  const steerPow = grip * (0.35 + 0.65 * Math.min(speedRatio * 1.6, 1));
  player.angle += input.steer * steerPow * dt * (player.speed < 0 ? -1 : 1);

  // Driftspuren bei hartem Einlenken
  if (Math.abs(input.steer) > 0.75 && speedRatio > 0.55) {
    player.skidT += dt;
    const c = carCorners(player.x, player.y, player.angle, player.w, player.h);
    skids.push({ x1: c[2].x, y1: c[2].y, x2: c[3].x, y2: c[3].y, life: 4 });
    if (skids.length > 260) skids.splice(0, skids.length - 260);
  } else player.skidT = 0;

  const step = player.speed * dt;
  const nx = player.x + Math.cos(player.angle) * step;
  const ny = player.y + Math.sin(player.angle) * step;
  const bx = clamp(nx, TILE * 2, (GW - 2) * TILE), by = clamp(ny, TILE * 2, (GH - 2) * TILE);
  if (!collides(bx, by, player.angle)) { player.x = bx; player.y = by; }
  else if (!collides(bx, player.y, player.angle)) { player.x = bx; player.speed *= 0.92; }
  else if (!collides(player.x, by, player.angle)) { player.y = by; player.speed *= 0.92; }
  else {
    if (Math.abs(player.speed) > 90) {
      game.shake = 5; sparks(player.x + Math.cos(player.angle) * 16, player.y + Math.sin(player.angle) * 16, 8);
      const fx = player.x + Math.cos(player.angle) * 20, fy = player.y + Math.sin(player.angle) * 20;
      if (tileAt(Math.floor(fx / TILE), Math.floor(fy / TILE)) === T_WATER) splash(fx, fy);
      Snd.sfx('crash');
    }
    player.speed *= -(0.32 - bumperSave() * 0.03);
  }

  Snd.engineAt(speedRatio, game.state === 'play');

  // Missionen einsammeln / abliefern
  if (!activeMission) {
    for (const o of offers) if (dist2(player.x, player.y, o.x, o.y) < 46 * 46) { acceptOffer(o); break; }
  } else {
    activeMission.time -= dt;
    if (dist2(player.x, player.y, activeMission.x, activeMission.y) < 46 * 46) completeMission();
    else if (activeMission.time <= 0) failMission('Zu spät! Der Kunde storniert.');
  }

  // Waschanlage: bankt das ungesicherte Trinkgeld, wäscht die Sterne ab
  if (game.garageCooldown > 0) game.garageCooldown -= dt;
  else if (garagePos && dist2(player.x, player.y, garagePos.x, garagePos.y) < 52 * 52 && Math.abs(player.speed) < 70) {
    game.state = 'garage'; player.speed = 0;
    game.banked = Math.round(game.wallet);
    if (game.banked > 0) { save.cash += game.banked; game.wallet = 0; Snd.sfx('cash'); }
    if (save.cash > save.best) save.best = save.cash;
    game.heat = 0; cops.length = 0; game.bustT = 0;
    persist();
    Snd.engineAt(0, false); Snd.sirenAt(false, 0);
  }
}

/* -------------------------------- Update --------------------------------- */
let last = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min((now - last) / 1000 || 0.016, 1 / 30);
  last = now;
  game.time += dt;
  uiHits.length = 0;

  if (game.state === 'play') {
    pollKeyboard();
    updatePlayer(dt);
    updateTraffic(dt);
    updatePeds(dt);
    updateCops(dt);
    Snd.sirenAt(cops.length > 0, dt);
    saveTimer += dt;
    if (saveTimer > 4) { saveTimer = 0; persist(); }
  }
  updateParticles(dt);
  game.shake = Math.max(0, game.shake - dt * 14);
  if (game.hintT > 0 && game.state === 'play') game.hintT -= dt;

  // Kamera: folgt mit Blick voraus
  const look = 46 * Math.min(Math.abs(player.speed) / 200, 1);
  const tx = player.x + Math.cos(player.angle) * look;
  const ty = player.y + Math.sin(player.angle) * look;
  const k = 1 - Math.pow(0.0012, dt);
  cam.x = lerp(cam.x, tx, k); cam.y = lerp(cam.y, ty, k);

  render();
}

/* ------------------------------- Rendering ------------------------------- */
function render() {
  ctx.fillStyle = PAL.water;
  ctx.fillRect(0, 0, VW, VH);
  if (game.state === 'title') { drawTitle(); return; }

  const shX = (Math.random() - 0.5) * game.shake, shY = (Math.random() - 0.5) * game.shake;
  ctx.save();
  ctx.translate(VW / 2 + shX, VH / 2 + shY);
  ctx.scale(SCALE, SCALE);
  ctx.translate(-cam.x, -cam.y);

  const hw = VW / 2 / SCALE + TILE * 2, hh = VH / 2 / SCALE + TILE * 2;
  const x0 = Math.max(0, Math.floor((cam.x - hw) / TILE)), x1 = Math.min(GW - 1, Math.ceil((cam.x + hw) / TILE));
  const y0 = Math.max(0, Math.floor((cam.y - hh) / TILE)), y1 = Math.min(GH - 1, Math.ceil((cam.y + hh) / TILE));

  drawTiles(x0, y0, x1, y1);
  drawRoadLines(x0, y0, x1, y1);
  drawSkids();
  drawMarkers();
  const cells = visibleCells(x0, y0, x1, y1);
  drawShadowsAndProps(cells);
  drawPeds();
  drawCars();
  drawPalmTops(cells);
  drawParticlesAndBubbles();
  ctx.restore();

  drawSunsetOverlay();
  drawHUD();
  if (game.state === 'garage') drawGarage();
  if (game.state === 'busted') drawBusted();
  if (game.state === 'pause') drawPause();
}

function drawTiles(x0, y0, x1, y1) {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const t = grid[y * GW + x];
    let col = PAL.grass;
    if (t === T_ROAD) col = PAL.road;
    else if (t === T_SIDE) col = PAL.sidewalk;
    else if (t === T_BLDG) col = PAL.sidewalk;
    else if (t === T_PARK) col = ((x + y) & 1) ? PAL.park : PAL.parkDark;
    else if (t === T_WATER) col = ((x * 7 + y * 3 + (game.time * 2 | 0)) % 9 < 1) ? PAL.waterDeep : PAL.water;
    else if (t === T_BEACH) col = ((x + y) & 1) ? PAL.beach : PAL.beachDark;
    else if (t === T_LOT) col = PAL.lot;
    ctx.fillStyle = col;
    ctx.fillRect(x * TILE, y * TILE, TILE + 0.5, TILE + 0.5);
  }
}
function drawRoadLines(x0, y0, x1, y1) {
  ctx.fillStyle = PAL.roadLine;
  for (const rx of roadsV) {
    if (rx + 1 < x0 || rx > x1) continue;
    const lx = (rx + 1) * TILE - 1.5;
    for (let y = Math.max(y0, 4); y <= Math.min(y1, 101); y++) {
      if (grid[y * GW + rx] !== T_ROAD) continue;
      if (roadsH.some((ry) => y >= ry && y <= ry + 1)) continue; // Kreuzung frei
      ctx.fillRect(lx, y * TILE + 5, 3, TILE - 14);
    }
  }
  for (const ry of roadsH) {
    if (ry + 1 < y0 || ry > y1) continue;
    const ly = (ry + 1) * TILE - 1.5;
    for (let x = Math.max(x0, 4); x <= Math.min(x1, 96); x++) {
      if (grid[ry * GW + x] !== T_ROAD) continue;
      if (roadsV.some((rx) => x >= rx && x <= rx + 1)) continue;
      ctx.fillRect(x * TILE + 5, ly, TILE - 14, 3);
    }
  }
}
function visibleCells(x0, y0, x1, y1) {
  const out = [];
  const c0x = Math.max(0, Math.floor(x0 / CELL)), c1x = Math.min(CGW - 1, Math.floor(x1 / CELL));
  const c0y = Math.max(0, Math.floor(y0 / CELL)), c1y = Math.min(CGH - 1, Math.floor(y1 / CELL));
  for (let cy = c0y; cy <= c1y; cy++) for (let cx = c0x; cx <= c1x; cx++) out.push(cy * CGW + cx);
  return out;
}
function drawShadowsAndProps(cells) {
  // Lange Sonnenuntergangs-Schatten
  ctx.fillStyle = PAL.shadow;
  for (const ci of cells) {
    for (const b of cellBuildings[ci]) {
      const s = 4 + b.tall * 4;
      ctx.fillRect(b.x + s, b.y + s, b.w, b.h);
    }
    for (const p of cellPalms[ci]) {
      ctx.beginPath(); ctx.ellipse(p.x + p.r * 0.9, p.y + p.r * 0.9, p.r * 0.9, p.r * 0.45, 0, 0, TAU); ctx.fill();
    }
  }
  for (const ci of cells) {
    for (const b of cellBuildings[ci]) drawBuilding(b);
    for (const p of cellProps[ci]) drawProp(p);
  }
}
function drawBuilding(b) {
  ctx.fillStyle = b.color;
  ctx.fillRect(b.x, b.y, b.w, b.h);
  // Dach-Detail: hellere Kante + Aufbauten
  ctx.fillStyle = PAL.roofline;
  ctx.fillRect(b.x, b.y, b.w, 3);
  ctx.fillRect(b.x, b.y, 3, b.h);
  ctx.fillStyle = 'rgba(20,16,42,0.18)';
  ctx.fillRect(b.x + b.w - 3, b.y, 3, b.h);
  ctx.fillRect(b.x, b.y + b.h - 3, b.w, 3);
  const s = b.seed;
  if (b.district === 'downtown') {
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    const n = 2 + Math.floor(s * 3);
    for (let i = 0; i < n; i++) {
      const gx = b.x + 6 + ((s * 137 + i * 53) % Math.max(1, b.w - 22));
      const gy = b.y + 6 + ((s * 91 + i * 71) % Math.max(1, b.h - 22));
      ctx.fillRect(gx, gy, 12, 12);
    }
  } else if (b.district === 'docks') {
    ctx.fillStyle = 'rgba(20,16,42,0.2)';
    for (let gx = b.x + 8; gx < b.x + b.w - 8; gx += 14) ctx.fillRect(gx, b.y + 6, 4, b.h - 12);
  } else if (s < 0.35 && b.w > 50) { // Klima-Kasten
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(b.x + b.w * 0.55, b.y + b.h * 0.3, 10, 10);
  }
}
function drawProp(p) {
  ctx.save(); ctx.translate(p.x, p.y);
  if (p.type === 'umbrella') {
    ctx.rotate(p.a * 0.1);
    ctx.beginPath(); ctx.arc(0, 0, 11, 0, TAU);
    ctx.fillStyle = p.c % 2 ? '#ff8c42' : '#7fc3e0'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 11, p.a, p.a + Math.PI / 2); ctx.lineTo(0, 0); ctx.closePath();
    ctx.fillStyle = '#fff6e6'; ctx.fill();
  } else if (p.type === 'container') {
    ctx.rotate(p.a * 0.06);
    ctx.fillStyle = ['#c0563e', '#3e7ac0', '#3f7d4e', '#b8913a', '#777'][p.c];
    ctx.fillRect(-24, -9, 48, 18);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let x = -20; x < 22; x += 8) ctx.fillRect(x, -9, 2, 18);
  } else if (p.type === 'parked') {
    ctx.rotate((p.c % 2) * Math.PI / 2);
    drawCarBody(0, 0, 0, 13, 24, pick(PAL.traffic, (p.c + 1) / 6), false);
  }
  ctx.restore();
}
function drawPalmTops(cells) {
  for (const ci of cells) for (const p of cellPalms[ci]) {
    const sway = Math.sin(game.time * 1.2 + p.sway) * 2;
    ctx.fillStyle = PAL.palmTrunk;
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + p.sway;
      ctx.beginPath();
      ctx.ellipse(p.x + Math.cos(a) * p.r * 0.55 + sway, p.y + Math.sin(a) * p.r * 0.55,
        p.r * 0.62, p.r * 0.22, a, 0, TAU);
      ctx.fillStyle = i % 2 ? PAL.palmLeaf : PAL.palmLeafLight;
      ctx.fill();
    }
    ctx.beginPath(); ctx.arc(p.x + sway * 0.5, p.y, 3.2, 0, TAU);
    ctx.fillStyle = PAL.palmTrunk; ctx.fill();
  }
}
function drawSkids() {
  ctx.strokeStyle = 'rgba(255,79,160,0.42)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath();
  for (const s of skids) {
    ctx.globalAlpha = Math.min(1, s.life / 4);
    ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2);
  }
  ctx.stroke(); ctx.globalAlpha = 1;
}
function drawMarkers() {
  const pulse = 1 + Math.sin(game.time * 5) * 0.12;
  if (!activeMission) {
    for (const o of offers) drawMarker(o.x, o.y, o.type.color, o.type.icon, 26 * pulse);
  } else {
    drawMarker(activeMission.x, activeMission.y, activeMission.type.color, '★', 30 * pulse);
  }
  if (garagePos) drawMarker(garagePos.x, garagePos.y, '#7dde8b', 'W', 26);
}
function drawMarker(x, y, color, icon, r) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
  ctx.fillStyle = color + '33'; ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r * 0.6, 0, TAU);
  ctx.fillStyle = color + '66'; ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r * 0.34, 0, TAU);
  ctx.fillStyle = color; ctx.fill();
  ctx.fillStyle = '#14102a';
  ctx.font = '900 ' + Math.round(r * 0.38) + 'px -apple-system, Arial, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(icon, x, y + 1);
}
function drawCarBody(x, y, angle, w, h, color, isPlayer) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI / 2);
  ctx.fillStyle = 'rgba(20,16,42,0.3)';
  rrect(ctx, -w / 2 + 2, -h / 2 + 3, w, h, 4); ctx.fill();
  ctx.fillStyle = color;
  rrect(ctx, -w / 2, -h / 2, w, h, 4); ctx.fill();
  ctx.fillStyle = 'rgba(20,20,40,0.75)';
  rrect(ctx, -w / 2 + 2.5, -h / 2 + h * 0.24, w - 5, h * 0.2, 2); ctx.fill();
  rrect(ctx, -w / 2 + 2.5, h / 2 - h * 0.3, w - 5, h * 0.14, 2); ctx.fill();
  if (isPlayer) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(-w / 2 + 1.5, -h / 2 + 1.5, 3, 3);
    ctx.fillRect(w / 2 - 4.5, -h / 2 + 1.5, 3, 3);
    if (input.brake) {
      ctx.fillStyle = '#ff3b3b';
      ctx.fillRect(-w / 2 + 1.5, h / 2 - 4, 3.5, 2.8);
      ctx.fillRect(w / 2 - 5, h / 2 - 4, 3.5, 2.8);
    }
  }
  ctx.restore();
}
function drawCars() {
  for (const c of trafficCars) drawCarBody(c.x, c.y, c.angle, c.w, c.h, c.color, false);
  for (const c of cops) {
    drawCarBody(c.x, c.y, c.angle, c.w, c.h, PAL.cop, false);
    ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.angle + Math.PI / 2);
    ctx.fillStyle = PAL.copDark;
    ctx.fillRect(-c.w / 2, -3, c.w, 6);
    const red = Math.floor(c.flash) % 2 === 0;
    ctx.fillStyle = red ? '#ff3b3b' : '#3b7bff';
    ctx.fillRect(-5, -2, 4, 4);
    ctx.fillStyle = red ? '#3b7bff' : '#ff3b3b';
    ctx.fillRect(1, -2, 4, 4);
    ctx.restore();
  }
  drawCarBody(player.x, player.y, player.angle, player.w, player.h, PAL.player, true);
}
function drawPeds() {
  for (const p of peds) {
    const wob = Math.sin(p.t * 10) * 1.2;
    ctx.save(); ctx.translate(p.x, p.y);
    if (p.dive > 0) ctx.rotate(p.dive * 8);
    ctx.fillStyle = 'rgba(20,16,42,0.25)';
    ctx.beginPath(); ctx.ellipse(1.5, 2, 4.5, 3, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = ['#e8c15a', '#7fc3e0', '#c9a2e8', '#8fce8f', '#ff8c42'][p.hue];
    ctx.beginPath(); ctx.arc(0, wob * 0.3, 4, 0, TAU); ctx.fill();
    ctx.fillStyle = '#e8b88f';
    ctx.beginPath(); ctx.arc(0, -1 + wob * 0.2, 2.4, 0, TAU); ctx.fill();
    ctx.restore();
  }
}
function drawParticlesAndBubbles() {
  for (const p of particles) {
    ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const b of game.bubbles) {
    const a = clamp(1.8 - b.t, 0, 1);
    ctx.globalAlpha = a;
    ctx.font = '700 11px -apple-system, Arial, sans-serif';
    const w = ctx.measureText(b.text).width + 14;
    ctx.fillStyle = '#fff6e6';
    rrect(ctx, b.x - w / 2, b.y - 34 - b.t * 10, w, 18, 8); ctx.fill();
    ctx.fillStyle = '#14102a';
    ctx.fillText(b.text, b.x, b.y - 25 - b.t * 10);
  }
  for (const p of game.pops) {
    ctx.globalAlpha = clamp(1.6 - p.t, 0, 1);
    ctx.font = '900 15px -apple-system, Arial, sans-serif';
    ctx.strokeStyle = 'rgba(20,16,42,0.7)'; ctx.lineWidth = 3;
    ctx.strokeText(p.text, p.x, p.y);
    ctx.fillStyle = p.color; ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
}
let sunsetGrad = null, vignette = null, gradKey = '';
function drawSunsetOverlay() {
  const key = VW + 'x' + VH;
  if (key !== gradKey) {
    gradKey = key;
    sunsetGrad = ctx.createLinearGradient(0, 0, VW, VH);
    sunsetGrad.addColorStop(0, PAL.sunset1);
    sunsetGrad.addColorStop(1, PAL.sunset2);
    vignette = ctx.createRadialGradient(VW / 2, VH / 2, Math.min(VW, VH) * 0.42, VW / 2, VH / 2, Math.max(VW, VH) * 0.75);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(15,8,30,0.34)');
  }
  ctx.fillStyle = sunsetGrad; ctx.fillRect(0, 0, VW, VH);
  ctx.fillStyle = vignette; ctx.fillRect(0, 0, VW, VH);
}

/* --------------------------------- HUD ----------------------------------- */
function drawHUD() {
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  // Ungesichertes Trinkgeld (groß) + Bank (klein) — der Kassenbon-Ticker
  ctx.fillStyle = PAL.hud;
  rrect(ctx, SAFE.left, SAFE.top, 152, 48, 14); ctx.fill();
  ctx.fillStyle = game.wallet > 0 ? PAL.star : 'rgba(255,246,230,0.8)';
  ctx.font = '900 17px -apple-system, Arial, sans-serif';
  ctx.fillText(fmt$(game.wallet), SAFE.left + 14, SAFE.top + 15);
  ctx.fillStyle = 'rgba(255,246,230,0.7)';
  ctx.font = '700 11px -apple-system, Arial, sans-serif';
  ctx.fillText('Bank ' + fmt$(save.cash), SAFE.left + 14, SAFE.top + 34);
  // Combo
  if (game.combo >= 2) {
    ctx.fillStyle = PAL.hud;
    rrect(ctx, SAFE.left, SAFE.top + 54, 96, 26, 13); ctx.fill();
    ctx.fillStyle = PAL.flamingo;
    ctx.font = '900 13px -apple-system, Arial, sans-serif';
    ctx.fillText('SERIE ×' + (1 + game.combo * 0.15).toFixed(2), SAFE.left + 12, SAFE.top + 67);
  }
  // Ruhestörungs-Sterne = Multiplikator
  const stars = Math.ceil(game.heat);
  const sx = VW - SAFE.right - 5 * 26;
  for (let i = 0; i < 5; i++) {
    drawStar(sx + i * 26 + 12, SAFE.top + 17, 10, i < stars ? PAL.star : 'rgba(255,255,255,0.22)', i < stars && cops.length > 0);
  }
  if (stars > 0) {
    ctx.textAlign = 'right';
    ctx.font = '900 13px -apple-system, Arial, sans-serif';
    ctx.fillStyle = PAL.star;
    ctx.fillText('ALLES ×' + stars, VW - SAFE.right - 6, SAFE.top + 40);
    ctx.textAlign = 'left';
  }
  // Fast-verhaftet-Ring
  if (game.bustT > 0.05) {
    ctx.strokeStyle = PAL.bad; ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(VW / 2, VH / 2, 46, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(game.bustT / 1.05, 1));
    ctx.stroke();
  }
  // Missionsleiste
  if (activeMission) {
    const w = Math.min(300, VW - 160);
    const mx = VW / 2 - w / 2, my = SAFE.top;
    ctx.fillStyle = PAL.hud;
    rrect(ctx, mx, my, w, 40, 12); ctx.fill();
    ctx.fillStyle = activeMission.type.color;
    ctx.font = '900 12px -apple-system, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(activeMission.type.label + ' · ' + fmt$(activeMission.pay), mx + 12, my + 13);
    const frac = clamp(activeMission.time / activeMission.total, 0, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    rrect(ctx, mx + 12, my + 24, w - 24, 8, 4); ctx.fill();
    ctx.fillStyle = frac < 0.25 ? PAL.bad : activeMission.type.color;
    rrect(ctx, mx + 12, my + 24, (w - 24) * frac, 8, 4); ctx.fill();
  }
  // Zielpfeil
  const target = activeMission ? activeMission : nearestOffer();
  if (target && game.state === 'play') {
    const a = angTo(player.x, player.y, target.x, target.y);
    const scr = 58;
    const ax = VW / 2 + Math.cos(a) * scr, ay = VH / 2 + Math.sin(a) * scr;
    ctx.save(); ctx.translate(ax, ay); ctx.rotate(a);
    ctx.fillStyle = activeMission ? activeMission.type.color : (target.type ? target.type.color : PAL.accent);
    ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-6, -7); ctx.lineTo(-2, 0); ctx.lineTo(-6, 7); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  drawMinimapHUD();
  drawTouchControls();
  drawToasts();
  // Pause-Knopf
  const pb = { x: VW / 2 + (VW / 2 - SAFE.right - 40) * 0.62, y: SAFE.top, w: 34, h: 34 };
  ctx.fillStyle = PAL.hud; rrect(ctx, pb.x, pb.y, pb.w, pb.h, 10); ctx.fill();
  ctx.fillStyle = PAL.hudText;
  ctx.fillRect(pb.x + 11, pb.y + 10, 4, 14); ctx.fillRect(pb.x + 19, pb.y + 10, 4, 14);
  addHit(pb.x - 8, pb.y - 8, pb.w + 16, pb.h + 16, togglePause);
  // Steuerungs-Hinweis
  if (game.hintT > 0 && isTouchDevice) {
    ctx.globalAlpha = clamp(game.hintT, 0, 1);
    ctx.fillStyle = PAL.hud;
    const tw = 230;
    rrect(ctx, VW / 2 - tw / 2, VH - SAFE.bottom - 210, tw, 30, 15); ctx.fill();
    ctx.fillStyle = PAL.hudText;
    ctx.font = '700 13px -apple-system, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(BRAND.startHint, VW / 2, VH - SAFE.bottom - 195);
    ctx.globalAlpha = 1;
  }
}
function nearestOffer() {
  let best = null, bd = Infinity;
  for (const o of offers) { const d = dist2(player.x, player.y, o.x, o.y); if (d < bd) { bd = d; best = o; } }
  return best;
}
function drawStar(x, y, r, color, flash) {
  ctx.save(); ctx.translate(x, y);
  if (flash) ctx.rotate(Math.sin(game.time * 10) * 0.12);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * TAU) / 5;
    const a2 = a + TAU / 10;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.lineTo(Math.cos(a2) * r * 0.45, Math.sin(a2) * r * 0.45);
  }
  ctx.closePath();
  ctx.fillStyle = color; ctx.fill();
  ctx.restore();
}
function drawMinimapHUD() {
  const size = 118, r = size / 2;
  const mx = VW - SAFE.right - size, my = VH - SAFE.bottom - size - (isTouchDevice ? 150 : 0);
  ctx.save();
  ctx.beginPath(); ctx.arc(mx + r, my + r, r, 0, TAU); ctx.clip();
  const zoom = 3.2;
  const cx = clamp(player.x / TILE, size / 2 / zoom, GW - size / 2 / zoom);
  const cy = clamp(player.y / TILE, size / 2 / zoom, GH - size / 2 / zoom);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(mmCvs, cx - r / zoom, cy - r / zoom, size / zoom, size / zoom, mx, my, size, size);
  const toMap = (wx, wy) => ({ x: mx + r + (wx / TILE - cx) * zoom, y: my + r + (wy / TILE - cy) * zoom });
  const blip = (wx, wy, color, rad) => {
    const p = toMap(wx, wy);
    if (dist2(p.x, p.y, mx + r, my + r) > (r - 4) * (r - 4)) {
      const a = angTo(mx + r, my + r, p.x, p.y);
      p.x = mx + r + Math.cos(a) * (r - 6); p.y = my + r + Math.sin(a) * (r - 6);
    }
    ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, TAU); ctx.fillStyle = color; ctx.fill();
  };
  if (!activeMission) for (const o of offers) blip(o.x, o.y, o.type.color, 3.5);
  else blip(activeMission.x, activeMission.y, activeMission.type.color, 4);
  if (garagePos) blip(garagePos.x, garagePos.y, '#7dde8b', 3);
  for (const c of cops) blip(c.x, c.y, PAL.bad, 3);
  const pp = toMap(player.x, player.y);
  ctx.save(); ctx.translate(pp.x, pp.y); ctx.rotate(player.angle);
  ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-4, -4); ctx.lineTo(-4, 4); ctx.closePath();
  ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.restore();
  ctx.restore();
  ctx.beginPath(); ctx.arc(mx + r, my + r, r, 0, TAU);
  ctx.strokeStyle = 'rgba(255,246,230,0.6)'; ctx.lineWidth = 3; ctx.stroke();
}
function drawTouchControls() {
  if (!isTouchDevice || game.state !== 'play') return;
  layoutButtons();
  // Joystick
  const jx = stick.active ? stick.bx : SAFE.left + 76;
  const jy = stick.active ? stick.by : VH - SAFE.bottom - 88;
  ctx.globalAlpha = stick.active ? 0.5 : 0.28;
  ctx.beginPath(); ctx.arc(jx, jy, 46, 0, TAU);
  ctx.fillStyle = '#fff6e6'; ctx.fill();
  ctx.globalAlpha = stick.active ? 0.85 : 0.4;
  ctx.beginPath(); ctx.arc(jx + stick.dx * 30, jy, 22, 0, TAU);
  ctx.fillStyle = PAL.accent; ctx.fill();
  // Gas / Bremse
  ctx.globalAlpha = input.gas ? 0.85 : 0.35;
  ctx.beginPath(); ctx.arc(btnGas.x, btnGas.y, btnGas.r, 0, TAU);
  ctx.fillStyle = PAL.good; ctx.fill();
  ctx.fillStyle = '#14102a'; ctx.font = '900 15px -apple-system, Arial, sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('GAS', btnGas.x, btnGas.y + 1);
  ctx.globalAlpha = input.brake ? 0.85 : 0.35;
  ctx.beginPath(); ctx.arc(btnBrake.x, btnBrake.y, btnBrake.r, 0, TAU);
  ctx.fillStyle = PAL.bad; ctx.fill();
  ctx.fillStyle = '#14102a'; ctx.font = '900 12px -apple-system, Arial, sans-serif';
  ctx.fillText('STOP', btnBrake.x, btnBrake.y + 1);
  ctx.globalAlpha = 1;
}
function drawToasts() {
  ctx.textAlign = 'center';
  let y = SAFE.top + 58;
  for (const t of game.toasts) {
    const a = t.t < 0.2 ? t.t / 0.2 : t.t > 2.9 ? clamp((3.4 - t.t) / 0.5, 0, 1) : 1;
    ctx.globalAlpha = a * 0.95;
    ctx.font = '700 13px -apple-system, Arial, sans-serif';
    const w = ctx.measureText(t.text).width + 26;
    ctx.fillStyle = PAL.hud;
    rrect(ctx, VW / 2 - w / 2, y, w, 26, 13); ctx.fill();
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, VW / 2, y + 13.5);
    y += 32;
  }
  ctx.globalAlpha = 1;
}

/* ------------------------------ Screens/Menüs ---------------------------- */
function bigButton(cx, cy, w, h, label, fn, color) {
  ctx.fillStyle = color || PAL.accent;
  rrect(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fill();
  ctx.fillStyle = '#14102a';
  ctx.font = '900 ' + Math.round(h * 0.42) + 'px -apple-system, Arial, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy + 1);
  addHit(cx - w / 2 - 8, cy - h / 2 - 8, w + 16, h + 16, fn);
}
function drawLogo(cx, cy, s) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.045);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const f1 = '900 italic ' + Math.round(46 * s) + 'px -apple-system, "Arial Black", Arial, sans-serif';
  const f2 = '900 italic ' + Math.round(58 * s) + 'px -apple-system, "Arial Black", Arial, sans-serif';
  ctx.font = f1;
  ctx.fillStyle = '#3d1e66'; ctx.fillText(BRAND.name1, 3, -26 * s + 3);
  ctx.fillStyle = '#ffd23f'; ctx.fillText(BRAND.name1, 0, -26 * s);
  ctx.font = f2;
  ctx.fillStyle = '#3d1e66'; ctx.fillText(BRAND.name2, 3, 26 * s + 3);
  ctx.fillStyle = '#ff4f6d'; ctx.fillText(BRAND.name2, 0, 26 * s);
  ctx.restore();
}
function drawTitle() {
  // Synthwave-Sonnenuntergang
  const sky = ctx.createLinearGradient(0, 0, 0, VH);
  sky.addColorStop(0, '#2b1a55'); sky.addColorStop(0.45, '#8c3a6e');
  sky.addColorStop(0.72, '#ff8c42'); sky.addColorStop(1, '#ffd23f');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, VW, VH);
  const sunY = VH * 0.52, sunR = Math.min(VW, VH) * 0.23;
  const sun = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
  sun.addColorStop(0, '#ffe89c'); sun.addColorStop(1, '#ff5e7a');
  ctx.fillStyle = sun;
  ctx.beginPath(); ctx.arc(VW / 2, sunY, sunR, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(43,26,85,0.9)';
  for (let i = 0; i < 5; i++) ctx.fillRect(VW / 2 - sunR, sunY + i * 14 + 4, sunR * 2, 4 + i * 1.5);
  // Meer
  ctx.fillStyle = '#25708e';
  ctx.fillRect(0, VH * 0.62, VW, VH * 0.38);
  ctx.fillStyle = 'rgba(255,210,63,0.35)';
  for (let i = 0; i < 8; i++) ctx.fillRect(VW / 2 - 40 - i * 8, VH * 0.63 + i * 9, 80 + i * 16, 2.5);
  // Palmen-Silhouetten
  drawPalmSilhouette(VW * 0.12, VH * 0.66, Math.min(VW, VH) * 0.16, 1);
  drawPalmSilhouette(VW * 0.9, VH * 0.7, Math.min(VW, VH) * 0.2, -1);
  drawLogo(VW / 2, VH * 0.26, Math.min(1.2, VW / 420));
  ctx.font = '700 14px -apple-system, Arial, sans-serif';
  ctx.fillStyle = '#fff6e6'; ctx.textAlign = 'center';
  ctx.fillText(BRAND.tagline, VW / 2, VH * 0.26 + 74);
  bigButton(VW / 2, VH * 0.78, 220, 58, 'LOSFAHREN', () => { startRun(); }, '#ffd23f');
  if (save.best > 0) {
    ctx.fillStyle = 'rgba(20,16,42,0.55)';
    rrect(ctx, VW / 2 - 90, VH * 0.86, 180, 30, 15); ctx.fill();
    ctx.fillStyle = '#fff6e6'; ctx.font = '700 13px -apple-system, Arial, sans-serif';
    ctx.fillText('Bank: ' + fmt$(save.cash), VW / 2, VH * 0.86 + 15);
  }
  // Boot-Zeile (Satire-Ticker)
  ctx.fillStyle = 'rgba(255,246,230,0.75)';
  ctx.font = 'italic 600 12px -apple-system, Arial, sans-serif';
  ctx.fillText(BRAND.bootLines[game.bootLine % BRAND.bootLines.length], VW / 2, VH - SAFE.bottom - 10);
  if (Math.floor(game.time / 4) % BRAND.bootLines.length !== game.bootLine) game.bootLine = Math.floor(game.time / 4) % BRAND.bootLines.length;
  drawMuteBtn(VW - SAFE.right - 26, SAFE.top + 18);
}
function drawPalmSilhouette(x, y, h, flip) {
  ctx.save(); ctx.translate(x, y); ctx.scale(flip, 1);
  ctx.fillStyle = '#2b1a45';
  ctx.beginPath();
  ctx.moveTo(-4, 0); ctx.quadraticCurveTo(6, -h * 0.5, h * 0.25, -h);
  ctx.lineTo(h * 0.25 + 7, -h + 4); ctx.quadraticCurveTo(14, -h * 0.5, 6, 0);
  ctx.closePath(); ctx.fill();
  ctx.save(); ctx.translate(h * 0.26, -h);
  for (let i = 0; i < 5; i++) {
    const a = -0.5 + i * 0.42;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * h * 0.16, Math.sin(a) * h * 0.13, h * 0.19, h * 0.05, a, 0, TAU);
    ctx.fill();
  }
  ctx.restore(); ctx.restore();
}
function drawMuteBtn(x, y) {
  ctx.font = '900 17px -apple-system, Arial, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(20,16,42,0.55)';
  ctx.beginPath(); ctx.arc(x, y, 17, 0, TAU); ctx.fill();
  ctx.fillStyle = '#fff6e6';
  ctx.fillText(Snd.muted ? '🔇' : '🔊', x, y + 1);
  addHit(x - 25, y - 25, 50, 50, () => { save.mute = !save.mute; Snd.setMuted(save.mute); persist(); });
}
function overlayBase(title, color) {
  ctx.fillStyle = 'rgba(15,8,30,0.72)';
  ctx.fillRect(0, 0, VW, VH);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 italic 40px -apple-system, "Arial Black", Arial, sans-serif';
  ctx.fillStyle = '#3d1e66'; ctx.fillText(title, VW / 2 + 3, VH * 0.24 + 3);
  ctx.fillStyle = color; ctx.fillText(title, VW / 2, VH * 0.24);
}
function drawBusted() {
  overlayBase(BRAND.bustedTitle, PAL.bad);
  ctx.font = '600 15px -apple-system, Arial, sans-serif';
  ctx.fillStyle = '#fff6e6';
  ctx.fillText(BRAND.bustedText, VW / 2, VH * 0.36);
  ctx.font = '900 30px -apple-system, Arial, sans-serif';
  ctx.fillStyle = PAL.bad;
  ctx.fillText('-' + fmt$(game.fine), VW / 2, VH * 0.44);
  bigButton(VW / 2, VH * 0.62, 250, 56, 'WEITER GEHT\'S', () => {
    const p = randomRoadPos(200, 600, player.x, player.y);
    resetPlayer(p.x, p.y);
    game.state = 'play';
  }, '#ffd23f');
}
function drawPause() {
  overlayBase('PAUSE', '#ffd23f');
  bigButton(VW / 2, VH * 0.45, 230, 54, 'WEITERFAHREN', () => { game.state = 'play'; }, '#7dde8b');
  bigButton(VW / 2, VH * 0.57, 230, 54, save.mute ? 'TON AN' : 'TON AUS', () => { save.mute = !save.mute; Snd.setMuted(save.mute); persist(); }, '#7fc3e0');
  bigButton(VW / 2, VH * 0.69, 230, 54, 'ZUM TITEL', () => { game.state = 'title'; persist(); }, '#c9a2e8');
}
function drawGarage() {
  ctx.fillStyle = 'rgba(15,8,30,0.78)';
  ctx.fillRect(0, 0, VW, VH);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 italic 30px -apple-system, "Arial Black", Arial, sans-serif';
  ctx.fillStyle = '#7dde8b';
  ctx.fillText('WASCHANLAGE', VW / 2, SAFE.top + 40);
  ctx.font = '700 14px -apple-system, Arial, sans-serif';
  ctx.fillStyle = PAL.good;
  ctx.fillText(
    (game.banked > 0 ? 'Gesichert: +' + fmt$(game.banked) + ' · ' : 'Sterne abgewaschen · ') + 'Bank: ' + fmt$(save.cash),
    VW / 2, SAFE.top + 72);
  const w = Math.min(340, VW - 40);
  let y = SAFE.top + 104;
  for (const u of UPGRADES) {
    const lvl = save.upg[u.id], maxed = lvl >= 5;
    const cost = Math.round(u.base * Math.pow(1.6, lvl) / 10) * 10;
    ctx.fillStyle = 'rgba(255,246,230,0.12)';
    rrect(ctx, VW / 2 - w / 2, y, w, 62, 12); ctx.fill();
    ctx.textAlign = 'left';
    ctx.font = '900 15px -apple-system, Arial, sans-serif';
    ctx.fillStyle = '#fff6e6';
    ctx.fillText(u.name, VW / 2 - w / 2 + 14, y + 18);
    ctx.font = '600 12px -apple-system, Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,246,230,0.7)';
    ctx.fillText(u.desc, VW / 2 - w / 2 + 14, y + 38);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i < lvl ? PAL.accent : 'rgba(255,255,255,0.2)';
      rrect(ctx, VW / 2 - w / 2 + 14 + i * 16, y + 48, 12, 6, 3); ctx.fill();
    }
    const canBuy = !maxed && save.cash >= cost;
    ctx.fillStyle = maxed ? 'rgba(255,255,255,0.25)' : canBuy ? PAL.good : 'rgba(255,92,92,0.5)';
    rrect(ctx, VW / 2 + w / 2 - 96, y + 14, 84, 34, 17); ctx.fill();
    ctx.textAlign = 'center';
    ctx.font = '900 13px -apple-system, Arial, sans-serif';
    ctx.fillStyle = '#14102a';
    ctx.fillText(maxed ? 'MAX' : fmt$(cost), VW / 2 + w / 2 - 54, y + 31);
    if (canBuy) {
      addHit(VW / 2 + w / 2 - 100, y + 8, 92, 46, () => {
        save.cash -= cost; save.upg[u.id]++; Snd.sfx('buy'); persist();
      });
    }
    y += 70;
  }
  bigButton(VW / 2, Math.min(y + 44, VH - SAFE.bottom - 40), 230, 54, 'WEITERFAHREN', () => {
    game.state = 'play'; game.garageCooldown = 3;
  }, '#ffd23f');
}
function tapScreen(x, y) {
  if (tapUI(x, y)) return;
  if (game.state === 'title') startRun();
}
function togglePause() {
  if (game.state === 'play') { game.state = 'pause'; Snd.engineAt(0, false); Snd.sirenAt(false, 0); }
  else if (game.state === 'pause') game.state = 'play';
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.state === 'play') { game.state = 'pause'; persist(); }
});

/* --------------------------------- Boot ---------------------------------- */
function boot() {
  resize();
  loadSave();
  generateCity();
  renderMinimap();
  // Startpunkt: Kreuzung nahe Zentrum; Werkstatt einen Block weiter
  resetPlayer(25 * TILE, 45 * TILE);
  cam.x = player.x; cam.y = player.y;
  garagePos = { x: 25 * TILE + TILE / 2, y: 36 * TILE + TILE / 2 };
  makeOffers();
  requestAnimationFrame(frame);
}
boot();
