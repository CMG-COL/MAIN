// Turbo Siesta — Asset-Generator v2: Sportwagen-Silhouetten + Logo-Lockup.
// Rendert Icon (512) und 3 Roblox-Thumbnails (1920x1080) in Headless-Chromium.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LIB = `
const TAU = Math.PI * 2;
function rr(c, x, y, w, h, r) {
  r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

// Top-Down-Sportwagen: getaperte Nase, breite Schultern, Heckflügel, Felgen.
// Länge = 2*L, Breite an den Schultern = 2*W. Nase zeigt nach -y.
function sportsCar(c, cx, cy, rot, scale, opt) {
  const body = opt.body, accent = opt.accent || '#ffffff';
  const glass = opt.glass || '#241640';
  const rim = opt.rim || '#FFC145';
  c.save();
  c.translate(cx, cy);
  c.rotate(rot);
  c.scale(scale, scale);

  const L = 58, W = 27;

  // Neon-Underglow
  if (opt.glow) {
    const g = c.createRadialGradient(0, 0, 6, 0, 0, L * 1.5);
    g.addColorStop(0, opt.glow);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.globalAlpha = 0.55;
    c.fillStyle = g;
    c.fillRect(-L * 1.5, -L * 1.5, L * 3, L * 3);
    c.globalAlpha = 1;
  }

  // Reifen (dunkel) + Felgen
  const wheel = (wx, wy, ww, wh) => {
    c.fillStyle = '#17101f';
    rr(c, wx - ww / 2, wy - wh / 2, ww, wh, 3.5);
    c.fill();
    c.fillStyle = rim;
    rr(c, wx - ww / 2 + 1.8, wy - wh / 2 + 3, ww - 3.6, wh - 6, 2);
    c.fill();
  };
  wheel(-W - 2.5, -L * 0.52, 9, 20);
  wheel(W + 2.5, -L * 0.52, 9, 20);
  wheel(-W - 3.5, L * 0.46, 11, 23);
  wheel(W + 3.5, L * 0.46, 11, 23);

  // Schatten unter der Karosserie
  c.fillStyle = 'rgba(15,8,30,0.45)';
  carSilhouette(c, L, W, 5, 7);
  c.fill();

  // Karosserie mit Verlauf (Lichtkante oben links)
  const paint = c.createLinearGradient(-W, -L, W, L);
  paint.addColorStop(0, opt.bodyLight || body);
  paint.addColorStop(0.5, body);
  paint.addColorStop(1, opt.bodyDark || body);
  c.fillStyle = paint;
  carSilhouette(c, L, W, 0, 0);
  c.fill();

  // Racing-Stripes
  c.save();
  c.clip();
  c.fillStyle = accent;
  c.globalAlpha = 0.9;
  c.fillRect(-7.5, -L, 5.5, L * 2);
  c.fillRect(2, -L, 5.5, L * 2);
  c.globalAlpha = 1;
  c.restore();

  // Frontsplitter
  c.fillStyle = '#17101f';
  rr(c, -W * 0.82, -L - 1, W * 1.64, 6, 3);
  c.fill();

  // Windschutzscheibe + Heckscheibe
  const gl = c.createLinearGradient(0, -L * 0.35, 0, L * 0.1);
  gl.addColorStop(0, 'rgba(190,230,255,0.55)');
  gl.addColorStop(1, glass);
  c.fillStyle = gl;
  c.beginPath();
  c.moveTo(-W * 0.62, -L * 0.06);
  c.quadraticCurveTo(0, -L * 0.30, W * 0.62, -L * 0.06);
  c.lineTo(W * 0.55, L * 0.12);
  c.lineTo(-W * 0.55, L * 0.12);
  c.closePath();
  c.fill();

  c.fillStyle = glass;
  c.beginPath();
  c.moveTo(-W * 0.55, L * 0.30);
  c.quadraticCurveTo(0, L * 0.46, W * 0.55, L * 0.30);
  c.lineTo(W * 0.5, L * 0.19);
  c.lineTo(-W * 0.5, L * 0.19);
  c.closePath();
  c.fill();

  // Dach-Segment zwischen den Scheiben
  c.fillStyle = opt.bodyDark || body;
  rr(c, -W * 0.56, L * 0.11, W * 1.12, L * 0.1, 2);
  c.fill();

  // Lufteinlässe auf der Haube
  c.fillStyle = 'rgba(23,16,31,0.75)';
  rr(c, -W * 0.42, -L * 0.62, W * 0.3, L * 0.18, 2.5);
  c.fill();
  rr(c, W * 0.12, -L * 0.62, W * 0.3, L * 0.18, 2.5);
  c.fill();

  // Seitenspiegel
  c.fillStyle = opt.bodyDark || body;
  rr(c, -W - 4, -L * 0.02, 6, 4.5, 2);
  c.fill();
  rr(c, W - 2, -L * 0.02, 6, 4.5, 2);
  c.fill();

  // Heckflügel
  c.fillStyle = '#17101f';
  rr(c, -W * 0.5, L * 0.72, 4, 9, 1.5);
  c.fill();
  rr(c, W * 0.5 - 4, L * 0.72, 4, 9, 1.5);
  c.fill();
  const wing = c.createLinearGradient(-W, 0, W, 0);
  wing.addColorStop(0, opt.bodyLight || body);
  wing.addColorStop(1, opt.bodyDark || body);
  c.fillStyle = wing;
  rr(c, -W * 1.02, L * 0.79, W * 2.04, 7.5, 3);
  c.fill();

  // Scheinwerfer / Rücklichter
  c.fillStyle = '#ffe89c';
  rr(c, -W * 0.72, -L * 0.93, W * 0.42, 5.5, 2.5);
  c.fill();
  rr(c, W * 0.3, -L * 0.93, W * 0.42, 5.5, 2.5);
  c.fill();
  c.fillStyle = '#ff3b5c';
  rr(c, -W * 0.8, L * 0.6, W * 1.6, 4.5, 2);
  c.fill();

  c.restore();
}

function carSilhouette(c, L, W, ox, oy) {
  c.beginPath();
  c.moveTo(ox + 0, oy - L);                                  // Nasenspitze
  c.bezierCurveTo(ox + W * 0.72, oy - L, ox + W, oy - L * 0.55, ox + W, oy - L * 0.15);
  c.bezierCurveTo(ox + W * 1.03, oy + L * 0.3, ox + W, oy + L * 0.62, ox + W * 0.93, oy + L * 0.86);
  c.quadraticCurveTo(ox + W * 0.9, oy + L, ox + W * 0.6, oy + L);
  c.lineTo(ox - W * 0.6, oy + L);
  c.quadraticCurveTo(ox - W * 0.9, oy + L, ox - W * 0.93, oy + L * 0.86);
  c.bezierCurveTo(ox - W, oy + L * 0.62, ox - W * 1.03, oy + L * 0.3, ox - W, oy - L * 0.15);
  c.bezierCurveTo(ox - W, oy - L * 0.55, ox - W * 0.72, oy - L, ox + 0, oy - L);
  c.closePath();
}

// Wortmarke: echte Oblique-Transformation, Stroke-Layering fuer Black-Weight,
// Chrome-Verlauf, harte Schlagschatten-Ebene.
function wordmark(c, text, cx, cy, size, opt) {
  const tracking = opt.tracking === undefined ? 0.02 : opt.tracking;
  c.save();
  c.translate(cx, cy);
  c.transform(1, 0, -0.18, 1, 0, 0); // Oblique
  c.font = '700 ' + size + 'px "Liberation Sans", "DejaVu Sans", sans-serif';
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  const chars = [...text];
  const widths = chars.map((ch) => c.measureText(ch).width + size * tracking);
  const total = widths.reduce((a, b) => a + b, 0);
  let x = -total / 2;

  const draw = (dx, dy, mode, style, lw) => {
    let cx2 = x;
    for (let i = 0; i < chars.length; i++) {
      if (mode === 'stroke') {
        c.lineWidth = lw;
        c.lineJoin = 'round';
        c.strokeStyle = style;
        c.strokeText(chars[i], cx2 + dx, dy);
      } else {
        c.fillStyle = style;
        c.fillText(chars[i], cx2 + dx, dy);
      }
      cx2 += widths[i];
    }
  };

  // Schlagschatten-Ebene (versetzt, gestapelt fuer 3D-Tiefe)
  const depth = opt.depth === undefined ? size * 0.09 : opt.depth;
  for (let d = depth; d > 0; d -= Math.max(1, depth / 8)) {
    draw(d * 0.6, d, 'stroke', opt.shadow, size * 0.20);
    draw(d * 0.6, d, 'fill', opt.shadow);
  }
  // Outline
  draw(0, 0, 'stroke', opt.outline, size * 0.26);
  // Fuellung mit Chrome-Verlauf
  const g = c.createLinearGradient(0, -size * 0.6, 0, size * 0.6);
  const stops = opt.stops || [[0, '#fff6c9'], [0.45, opt.fill], [0.55, opt.fill2 || opt.fill], [1, '#c9761f']];
  for (const s of stops) g.addColorStop(s[0], s[1]);
  draw(0, 0, 'fill', g);
  draw(0, 0, 'stroke', g, size * 0.06);
  c.restore();
}

function sunsetSky(c, W, H, horizon) {
  const hy = horizon === undefined ? H : horizon;
  const sky = c.createLinearGradient(0, 0, 0, hy);
  sky.addColorStop(0, '#241250');
  sky.addColorStop(0.34, '#5e2a6b');
  sky.addColorStop(0.62, '#b8437a');
  sky.addColorStop(0.84, '#ff8c42');
  sky.addColorStop(1, '#ffd23f');
  c.fillStyle = sky;
  c.fillRect(0, 0, W, hy);
}

// Bodenebene + perspektivische Strasse: verhindert die "Berg"-Silhouette,
// die ein freistehender Keil erzeugt.
function ground(c, W, H, horizonY, roadHalfTop, roadHalfBottom) {
  const g = c.createLinearGradient(0, horizonY, 0, H);
  g.addColorStop(0, '#6a4d7a');
  g.addColorStop(1, '#3d2a52');
  c.fillStyle = g;
  c.fillRect(0, horizonY, W, H - horizonY);
  const road = c.createLinearGradient(0, horizonY, 0, H);
  road.addColorStop(0, '#4a3570');
  road.addColorStop(1, '#2e2050');
  c.fillStyle = road;
  c.beginPath();
  c.moveTo(W / 2 - roadHalfTop, horizonY);
  c.lineTo(W / 2 + roadHalfTop, horizonY);
  c.lineTo(W / 2 + roadHalfBottom, H);
  c.lineTo(W / 2 - roadHalfBottom, H);
  c.closePath();
  c.fill();
  // Mittelstreifen
  c.fillStyle = '#FFC145';
  const n = 6;
  for (let i = 0; i < n; i++) {
    const t = i / n, t2 = t * t;
    const y = horizonY + t2 * (H - horizonY);
    const w = 6 + t2 * 46;
    const h = 14 + t2 * 90;
    c.fillRect(W / 2 - w / 2, y, w, h);
  }
  // Seitenlinien
  c.strokeStyle = 'rgba(255,246,230,0.35)';
  c.lineWidth = 5;
  c.beginPath();
  c.moveTo(W / 2 - roadHalfTop, horizonY); c.lineTo(W / 2 - roadHalfBottom, H);
  c.moveTo(W / 2 + roadHalfTop, horizonY); c.lineTo(W / 2 + roadHalfBottom, H);
  c.stroke();
}

function sunDisc(c, cx, cy, r) {
  const sun = c.createLinearGradient(0, cy - r, 0, cy + r);
  sun.addColorStop(0, '#fff3c4');
  sun.addColorStop(0.55, '#ffb15c');
  sun.addColorStop(1, '#ff5e7a');
  c.fillStyle = sun;
  c.beginPath();
  c.arc(cx, cy, r, 0, TAU);
  c.fill();
  c.save();
  c.beginPath();
  c.arc(cx, cy, r, 0, TAU);
  c.clip();
  c.fillStyle = 'rgba(36,18,80,0.92)';
  for (let i = 0; i < 7; i++) {
    c.fillRect(cx - r, cy + r * 0.04 + i * r * 0.15, r * 2, r * 0.035 + i * r * 0.014);
  }
  c.restore();
}

function palm(c, px, py, s, flip) {
  c.save();
  c.translate(px, py);
  c.scale(flip * s, s);
  c.fillStyle = '#1d0f38';
  c.beginPath();
  c.moveTo(-7, 0);
  c.quadraticCurveTo(12, -150, 52, -290);
  c.lineTo(70, -283);
  c.quadraticCurveTo(32, -150, 13, 0);
  c.closePath();
  c.fill();
  c.save();
  c.translate(58, -290);
  for (let i = 0; i < 7; i++) {
    const a = -0.85 + i * 0.32;
    c.save();
    c.rotate(a);
    c.beginPath();
    c.moveTo(0, 0);
    c.quadraticCurveTo(58, -22, 118, 6);
    c.quadraticCurveTo(58, 6, 0, 13);
    c.closePath();
    c.fill();
    c.restore();
  }
  c.restore();
  c.restore();
}

function driftTrail(c, pts, width, color) {
  c.save();
  c.strokeStyle = color;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.lineWidth = width;
  c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) {
    const xc = (pts[i][0] + pts[i + 1][0]) / 2;
    const yc = (pts[i][1] + pts[i + 1][1]) / 2;
    c.quadraticCurveTo(pts[i][0], pts[i][1], xc, yc);
  }
  c.stroke();
  c.restore();
}
`;

const ICON = `
(() => {
  const S = 512, c = document.createElement('canvas');
  c.width = S; c.height = S; document.body.appendChild(c);
  const x = c.getContext('2d');
  ${LIB}
  const r = S * 0.19;
  x.beginPath();
  x.moveTo(r, 0); x.arcTo(S, 0, S, S, r); x.arcTo(S, S, 0, S, r);
  x.arcTo(0, S, 0, 0, r); x.arcTo(0, 0, S, 0, r); x.closePath();
  x.clip();

  const HZ = S * 0.55;
  sunsetSky(x, S, S, HZ);
  sunDisc(x, S / 2, S * 0.44, S * 0.26);
  ground(x, S, S, HZ, S * 0.14, S * 0.62);

  driftTrail(x, [[S*0.02, S*1.05], [S*0.22, S*0.94], [S*0.30, S*0.82], [S*0.42, S*0.78]], 17, 'rgba(255,79,160,0.9)');

  // Auto dominiert das Icon (bei ~120px Anzeigegroesse zaehlt nur die Silhouette)
  sportsCar(x, S * 0.53, S * 0.68, -0.34, 2.55, {
    body: '#FF5E5B', bodyLight: '#ff9280', bodyDark: '#c22f3c',
    accent: '#fff3d6', rim: '#FFC145', glow: 'rgba(255,79,160,0.85)',
  });

  // Sterne oben
  x.fillStyle = '#FFC145';
  x.strokeStyle = '#2b1a45';
  x.lineWidth = 6;
  for (let i = 0; i < 3; i++) {
    const sx = S * 0.5 + (i - 1) * S * 0.185, sy = S * 0.13, rad = S * 0.082;
    x.beginPath();
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + (k * TAU) / 5;
      const a2 = a + TAU / 10;
      x.lineTo(sx + Math.cos(a) * rad, sy + Math.sin(a) * rad);
      x.lineTo(sx + Math.cos(a2) * rad * 0.46, sy + Math.sin(a2) * rad * 0.46);
    }
    x.closePath(); x.stroke(); x.fill();
  }
  return c.toDataURL('image/png');
})()
`;

const THUMB = (v) => `
(() => {
  const W = 1920, H = 1080, c = document.createElement('canvas');
  c.width = W; c.height = H; document.body.appendChild(c);
  const x = c.getContext('2d');
  const V = ${JSON.stringify(v)};
  ${LIB}

  const HZ = H * 0.54;
  sunsetSky(x, W, H, HZ);
  sunDisc(x, W / 2, H * 0.44, 300);
  ground(x, W, H, HZ, 210, 1500);

  palm(x, 150, H * 0.86, 1.15, 1);
  palm(x, W - 130, H * 0.92, 1.4, -1);

  if (V.id === 'tips') {
    driftTrail(x, [[W*0.14, H*1.06], [W*0.32, H*0.94], [W*0.38, H*0.82], [W*0.50, H*0.78]], 30, 'rgba(255,79,160,0.9)');
    sportsCar(x, W * 0.5, H * 0.74, -0.34, 5.1, {
      body: '#FF5E5B', bodyLight: '#ff9280', bodyDark: '#c22f3c',
      accent: '#fff3d6', rim: '#FFC145', glow: 'rgba(255,79,160,0.9)',
    });
    // Fuenf Sterne
    x.fillStyle = '#FFC145'; x.strokeStyle = '#2b1a45'; x.lineWidth = 9;
    for (let i = 0; i < 5; i++) {
      const sx = W / 2 + (i - 2) * 128, sy = 432, rad = 44;
      x.beginPath();
      for (let k = 0; k < 5; k++) {
        const a = -Math.PI / 2 + (k * TAU) / 5, a2 = a + TAU / 10;
        x.lineTo(sx + Math.cos(a) * rad, sy + Math.sin(a) * rad);
        x.lineTo(sx + Math.cos(a2) * rad * 0.46, sy + Math.sin(a2) * rad * 0.46);
      }
      x.closePath(); x.stroke(); x.fill();
    }
  } else if (V.id === 'busted') {
    sportsCar(x, W * 0.5, H * 0.76, 0.10, 4.6, {
      body: '#FF5E5B', bodyLight: '#ff9280', bodyDark: '#c22f3c',
      accent: '#fff3d6', rim: '#FFC145',
    });
    sportsCar(x, W * 0.155, H * 0.80, 0.72, 3.4, {
      body: '#f2f0ff', bodyLight: '#ffffff', bodyDark: '#b9c3e8',
      accent: '#4EA8FF', rim: '#cfd8ff', glow: 'rgba(78,168,255,0.95)',
    });
    sportsCar(x, W * 0.845, H * 0.83, -0.72, 3.4, {
      body: '#f2f0ff', bodyLight: '#ffffff', bodyDark: '#b9c3e8',
      accent: '#ff3b5c', rim: '#cfd8ff', glow: 'rgba(255,60,60,0.9)',
    });
  } else {
    // Waschanlagen-Portal (vollstaendig im Bild, steht hinter dem Auto)
    const px0 = W * 0.60, pw = W * 0.34, pil = 46;
    x.fillStyle = '#5fd97a';
    rr(x, px0, H * 0.34, pil, H * 0.62, 12); x.fill();
    rr(x, px0 + pw - pil, H * 0.34, pil, H * 0.62, 12); x.fill();
    x.fillStyle = '#7dde8b';
    rr(x, px0 - 10, H * 0.27, pw + 20, 78, 14); x.fill();
    x.fillStyle = '#123a1e';
    x.font = '700 52px "Liberation Sans", sans-serif';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('CAR WASH', px0 + pw / 2, H * 0.27 + 39);
    // Waschbuersten-Andeutung
    x.fillStyle = 'rgba(125,222,139,0.35)';
    for (let i = 1; i < 5; i++) rr(x, px0 + pil + i * ((pw - pil * 2) / 5), H * 0.36, 14, H * 0.5, 7), x.fill();

    driftTrail(x, [[W*0.02, H*1.04], [W*0.16, H*0.94], [W*0.22, H*0.84], [W*0.30, H*0.80]], 28, 'rgba(255,79,160,0.85)');
    sportsCar(x, W * 0.33, H * 0.76, -0.20, 4.4, {
      body: '#FF5E5B', bodyLight: '#ff9280', bodyDark: '#c22f3c',
      accent: '#fff3d6', rim: '#FFC145', glow: 'rgba(255,193,69,0.85)',
    });
    // Trinkgeld-Symbole: Bogen ueber dem Auto Richtung Waschanlage
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.strokeStyle = '#2b1a45'; x.lineWidth = 10;
    [[W*0.30, H*0.36, 116], [W*0.40, H*0.28, 96], [W*0.50, H*0.33, 80]].forEach(p => {
      x.font = '700 ' + p[2] + 'px "Liberation Sans", sans-serif';
      x.strokeText('$', p[0], p[1]);
      x.fillStyle = '#FFC145';
      x.fillText('$', p[0], p[1]);
    });
  }

  // Headline
  wordmark(x, V.text, W / 2, V.textY, V.size, {
    fill: V.fill, fill2: V.fill2, outline: '#2b1a45', shadow: '#1a0d33', depth: V.size * 0.1,
  });

  // Logo-Lockup unten links (kollidiert nicht mit dem Fahrzeug in der Mitte)
  wordmark(x, 'TURBO SIESTA', 340, H - 54, 52, {
    fill: '#FFC145', fill2: '#ffb02e', outline: '#2b1a45', shadow: '#1a0d33', depth: 4, tracking: 0.07,
  });
  return c.toDataURL('image/png');
})()
`;

(async () => {
  const outDir = process.argv[2];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  await page.setContent('<body style="margin:0;background:#111"></body>');

  const iconUrl = await page.evaluate(ICON);
  fs.writeFileSync(path.join(outDir, 'roblox-icon-512.png'), Buffer.from(iconUrl.split(',')[1], 'base64'));
  console.log('roblox-icon-512.png');

  const variants = [
    { id: 'tips', file: 'thumb-1-x5-tips.png', text: '×5 TIPS!', fill: '#FFC145', fill2: '#ffb02e', textY: 210, size: 168 },
    { id: 'busted', file: 'thumb-2-busted.png', text: 'BUSTED!', fill: '#FF6B6B', fill2: '#ff4d5e', textY: 250, size: 178 },
    { id: 'bank', file: 'thumb-3-bank-it.png', text: 'BANK IT!', fill: '#8ff0a0', fill2: '#5fd97a', textY: 200, size: 168 },
  ];
  for (const v of variants) {
    const url = await page.evaluate(THUMB(v));
    fs.writeFileSync(path.join(outDir, v.file), Buffer.from(url.split(',')[1], 'base64'));
    console.log(v.file);
  }
  await browser.close();
})();
