// Quran lessons: flat, faceless, thin-outline 2D role-play style (see formats/quran_lessons/README.md).
// A video page sets  window.LESSON = {timeline, chars, shots, events, ayah, card}  then calls QL.start(). Frames: window.renderFrame(t).
const QL = (() => {
  const W = 576, H = 1024, GY = 720, INK = '#4a3b3b';
  const cv = document.getElementById('c'), c = cv.getContext('2d');
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, k) => a + (b - a) * k;
  const ease = k => k * k * (3 - 2 * k), eout = k => 1 - Math.pow(1 - k, 3), eback = k => { const s = 1.5; k -= 1; return k * k * ((s + 1) * k + s) + 1; };
  let TL, L;
  const lineAt = (t) => TL.lines.find(l => t >= l.v0 - 0.05 && t <= l.v1 + 0.15);
  const env = (l, t) => { if (!l) return 0; const i = Math.floor((t - l.start) * 48); return l.env[clamp(i, 0, l.env.length - 1)] || 0; };

  // ---------- drawing helpers (all lines use the same ink colour and a thin stroke)
  function stroke(w = 2) { c.lineWidth = w; c.strokeStyle = INK; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); }
  // ---- hand-inked line work (anidoodle craft bar): a point list is smoothed into a curve, every point is nudged by a tiny wobble that "boils" at 8 fps
  // like hand-drawn animation, and the outline is drawn as a thick stroke plus a thin second pass, so the line is thick-thin and not one even tube.
  let BOIL = 0; const hash = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7 + BOIL * 17.3) * 43758.5453; return v - Math.floor(v); };
  function inkPts(pts, closed, amp = 0.7) { return pts.map(([x, y], i) => [x + (hash(x, y) - .5) * 2 * amp, y + (hash(y, x + i) - .5) * 2 * amp]); }
  function smooth(pts, closed) {
    const n = pts.length; c.moveTo((pts[0][0] + pts[n - 1][0]) / 2 * (closed ? 1 : 0) + (closed ? 0 : pts[0][0]), (pts[0][1] + pts[n - 1][1]) / 2 * (closed ? 1 : 0) + (closed ? 0 : pts[0][1]));
    for (let i = 0; i < (closed ? n : n - 2); i++) { const p = pts[(i + (closed ? 0 : 1)) % n], q = pts[(i + (closed ? 1 : 2)) % n]; c.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
    if (!closed) c.lineTo(pts[n - 1][0], pts[n - 1][1]);
  }
  function ink(pts, o = {}) {   // o: fill, w (line weight), closed, amp
    const P = inkPts(pts, o.closed !== false, o.amp ?? 0.7); c.beginPath(); smooth(P, o.closed !== false); if (o.closed !== false) c.closePath();
    if (o.fill) { c.fillStyle = o.fill; c.fill(); }
    if (o.w !== 0) { c.lineWidth = o.w ?? 2.2; c.strokeStyle = INK; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); const Q = inkPts(pts, o.closed !== false, (o.amp ?? 0.7) * 1.4); c.beginPath(); smooth(Q, o.closed !== false); if (o.closed !== false) c.closePath(); c.lineWidth = (o.w ?? 2.2) * 0.45; c.strokeStyle = 'rgba(74,59,59,.7)'; c.stroke(); }
  }
  const line = (pts, w = 1.3, al = 1) => { c.save(); c.globalAlpha = al; ink(pts, { closed: false, w, amp: 0.5 }); c.restore(); };
  const ell = (cx, cy, rx, ry, rot = 0, n = 14) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2, x = Math.cos(a) * rx, y = Math.sin(a) * ry; return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]; });
  function sleeve(sx, sy, ex, ey, w0, w1, col) {   // a tapered sleeve from (sx,sy) to (ex,ey), width w0 -> w1, with a seam
    const dx = ex - sx, dy = ey - sy, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    const A = [[sx + nx * w0 / 2, sy + ny * w0 / 2], [(sx + ex) / 2 + nx * (w0 + w1) / 4.2, (sy + ey) / 2 + ny * (w0 + w1) / 4.2], [ex + nx * w1 / 2, ey + ny * w1 / 2], [ex - nx * w1 / 2, ey - ny * w1 / 2], [(sx + ex) / 2 - nx * (w0 + w1) / 4.2, (sy + ey) / 2 - ny * (w0 + w1) / 4.2], [sx - nx * w0 / 2, sy - ny * w0 / 2]];
    ink(A, { fill: col }); return { nx, ny, dx: dx / l, dy: dy / l };
  }
  function hand(hx, hy, dx, dy, skin, curl = 0.3) {   // palm, a thumb and three separated fingers, each finger an outlined skin-coloured stroke
    const nx = -dy, ny = dx, px = hx + dx * 7, py = hy + dy * 7, finger = (x0, y0, x1, y1, w) => { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.lineCap = 'round'; c.lineWidth = w + 2.4; c.strokeStyle = INK; c.stroke(); c.lineWidth = w; c.strokeStyle = skin; c.stroke(); };
    for (let i = -1; i <= 1; i++) { const a = i * 0.30 + (i === 0 ? 0 : curl * 0.1 * i), fx = dx * Math.cos(a) - dy * Math.sin(a), fy = dx * Math.sin(a) + dy * Math.cos(a), L = 9 + (i === 0 ? 2.5 : 0) - curl * 3; finger(px + nx * i * 3.6 + dx * 3, py + ny * i * 3.6 + dy * 3, px + nx * i * 4.2 + fx * L + dx * 3, py + ny * i * 4.2 + fy * L + dy * 3, 3.6); }
    finger(px - nx * 5, py - ny * 5, px - nx * 10 + dx * 6, py - ny * 10 + dy * 6, 4);   // thumb
    ink(ell(px, py, 7.2, 8.6, Math.atan2(dy, dx) + Math.PI / 2, 10), { fill: skin, w: 1.8 });
  }
  function arm(side, sx, sy, a1, a2, o) {   // a1,a2 in radians from pointing straight down, positive = outward
    const L1 = 58, L2 = 52, d = side;
    const ex = sx + d * Math.sin(a1) * L1, ey = sy + Math.cos(a1) * L1;
    const hx = ex + d * Math.sin(a1 + a2) * L2, hy = ey + Math.cos(a1 + a2) * L2;
    sleeve(sx, sy, ex, ey, 25, 21, o.dress); const f = sleeve(ex, ey, hx, hy, 21, 17, o.dress);   // abaya sleeves: a shoulder, an elbow, a cuff
    line([[ex - 6, ey - 1], [ex + 5, ey + 2]], 1.1, .45); line([[hx - f.nx * 6.5 - f.dx * 5, hy - f.ny * 6.5 - f.dy * 5], [hx + f.nx * 6.5 - f.dx * 5, hy + f.ny * 6.5 - f.dy * 5]], 1.3, .8);   // an elbow fold and the cuff line
    hand(hx, hy, f.dx, f.dy, o.skin, 0.4);
    return [hx, hy];
  }
  function girl(o) {   // o: x, face (1 = faces right, -1 left), s, hijab, dress, shoes, skin, tilt, bob, lean, armR:[a1,a2], armL:[a1,a2], bow
    c.save(); c.translate(o.x, GY); c.scale(o.s * o.face, o.s);
    c.beginPath(); c.ellipse(0, 2, 62, 8, 0, 0, 7); c.fillStyle = 'rgba(74,59,59,.10)'; c.fill();   // contact shadow: weight on the ground
    c.rotate(o.lean || 0);
    // abaya: widest at the hem, a front seam, hem folds, a waist drape
    ink([[-30, -250], [-33, -200], [-38, -140], [-46, -82], [-57, -16], [-30, -7], [0, -12], [30, -7], [57, -16], [46, -82], [38, -140], [33, -200], [30, -250], [0, -258]], { fill: o.dress });
    line([[3, -236], [2, -180], [4, -120], [3, -60], [5, -14]], 1.2, .55); line([[-40, -120], [-18, -108], [8, -112], [34, -122]], 1.1, .4); line([[-52, -42], [-40, -22]], 1.1, .5); line([[50, -44], [38, -22]], 1.1, .5);
    for (const sx of [-24, 24]) { ink([[sx - 15, -6], [sx - 12, -13], [sx + 6, -14], [sx + 17, -9], [sx + 15, -2], [sx - 8, 1]], { fill: o.shoes, w: 1.8 }); line([[sx + 6, -12], [sx + 12, -4]], 1, .5); }   // shoes with a toe line
    const hands = {};
    hands.L = arm(-1, -27, -238, o.armL[0], o.armL[1], o);
    // head: pivots at the neck. The head follows the body a moment late (overlap)
    c.save(); c.translate(0, -262 + (o.bob || 0)); c.rotate((o.tilt || 0) + (o.bow || 0) * 0.18); c.translate(0, 262);
    const H = o.hijab;
    ink([[-39, -288], [-33, -327], [-4, -349], [28, -337], [41, -296], [47, -252], [45, -226], [30, -212], [0, -207], [-30, -212], [-45, -226], [-47, -252]], { fill: H });   // hijab: dome and drape
    c.save(); c.beginPath(); smooth(inkPts([[-39, -288], [-33, -327], [-4, -349], [28, -337], [41, -296], [47, -252], [45, -226], [30, -212], [0, -207], [-30, -212], [-45, -226], [-47, -252]], true, 0), true); c.clip();
    c.fillStyle = 'rgba(74,59,59,.10)'; c.beginPath(); c.moveTo(-60, -230); c.quadraticCurveTo(-20, -240, -8, -200); c.lineTo(-60, -200); c.fill();   // soft shadow under the dome, on the far side
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-12, -330, 14, 6, -0.4, 0, 7); c.fill(); c.restore();   // a light accent on top
    ink([[-22, -284], [-21, -310], [-8, -327], [10, -326], [24, -308], [24, -280], [14, -264], [2, -259], [-12, -262]], { fill: o.skin, w: 2 });   // face opening (no features, as in the reference)
    line([[-26, -280], [-27, -306], [-12, -334]], 1.4, .5); line([[-24, -252], [-30, -228]], 1.2, .55); line([[10, -246], [16, -218]], 1.2, .5); line([[-8, -240], [-4, -214]], 1.1, .4);   // hijab folds
    ink(ell(22, -262, 2.6, 2.6, 0, 8), { fill: '#fff', w: 1.2 });   // pin
    c.restore();
    hands.R = arm(1, 27, -238, o.armR[0], o.armR[1], o);
    c.restore(); return hands;
  }
  // doodles are DRAWN ON (a pen makes the marks), never faded or scaled in. p = progress 0..1
  const scribble = (x, y, w, n = 3, p = 1) => { c.save(); c.beginPath(); c.rect(x - 4, y - 12, (w + 8) * p, n * 14); c.clip(); c.beginPath(); for (let i = 0; i < n; i++) { const yy = y + i * 9; c.moveTo(x, yy); for (let k = 1; k <= 6; k++) c.lineTo(x + w * k / 6, yy + (k % 2 ? -3 : 3)); } stroke(2); c.restore(); };
  function bubble(x, y, w, h, tailX, tailY, a = 1, p = 1) {
    c.save(); c.globalAlpha = a; const L = 2 * (w + h) + 60; c.beginPath(); c.roundRect(x, y, w, h, 18);
    if (p > 0.55) { c.fillStyle = `rgba(255,255,255,${clamp((p - 0.55) / 0.3)})`; c.fill(); }
    c.setLineDash([L, L]); c.lineDashOffset = L * (1 - clamp(p / 0.8)); stroke(2); c.setLineDash([]);
    if (p > 0.8) { const q = clamp((p - 0.8) / 0.2); c.globalAlpha = a * q; c.beginPath(); c.moveTo(x + w * .3, y + h - 1); c.lineTo(tailX, tailY); c.lineTo(x + w * .5, y + h - 1); c.fillStyle = '#fff'; c.fill(); stroke(2); c.beginPath(); c.moveTo(x + w * .3 + 2, y + h - 1); c.lineTo(x + w * .5 - 2, y + h - 1); c.strokeStyle = '#fff'; c.lineWidth = 4; c.stroke(); }
    c.restore();
  }
  function heart(x, y, s, a = 1, col = '#e23b4e', p = 1) {
    c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(0, 8); c.bezierCurveTo(-26, -10, -16, -34, 0, -18); c.bezierCurveTo(16, -34, 26, -10, 0, 8);
    if (p > 0.7) { c.fillStyle = col; c.globalAlpha = a * clamp((p - 0.7) / 0.3); c.fill(); c.globalAlpha = a; }
    c.setLineDash([90, 90]); c.lineDashOffset = 90 * (1 - clamp(p / 0.75)); stroke(2 / s); c.restore();
  }
  function spark(x, y, s, a = 1) { c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate(Math.sin(x + BOIL * 0.5) * 0.12); c.scale(s, s); c.beginPath(); c.moveTo(0, -20); c.quadraticCurveTo(3, -3, 20, 0); c.quadraticCurveTo(3, 3, 0, 20); c.quadraticCurveTo(-3, 3, -20, 0); c.quadraticCurveTo(-3, -3, 0, -20); c.fillStyle = '#ffd23c'; c.fill(); stroke(2 / s); c.restore(); }
  function qmark(x, y, s, a = 1, p = 1) { c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s); c.font = '700 44px Caveat'; c.textAlign = 'center'; c.strokeStyle = INK; c.lineWidth = 2.2; c.setLineDash([70, 70]); c.lineDashOffset = 70 * (1 - clamp(p / 0.85)); c.strokeText('?', 0, 0); c.setLineDash([]); if (p > 0.85) { c.fillStyle = INK; c.globalAlpha = a * clamp((p - 0.85) / 0.15); c.fillText('?', 0, 0); } c.restore(); }

  // ---------- scenery (very light, same thin line)
  function scenery(cam) {
    c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.moveTo(-1500, GY); c.lineTo(2000, GY); c.stroke();
    if (L.scenery === 'street') {   // lamp post + tree + bench, drawn very lightly
      c.save(); c.globalAlpha = .75;
      c.beginPath(); c.moveTo(60, GY); c.lineTo(60, GY - 330); c.quadraticCurveTo(60, GY - 360, 88, GY - 360); c.lineTo(104, GY - 360); stroke(2.2);
      c.beginPath(); c.roundRect(98, GY - 366, 26, 14, 5); c.fillStyle = '#ffe9a8'; c.fill(); stroke(2);
      c.beginPath(); c.moveTo(500, GY); c.lineTo(500, GY - 150); stroke(2.2);
      c.beginPath(); c.arc(500, GY - 230, 82, 0, 7); c.fillStyle = '#cfe9cf'; c.fill(); stroke(2);
      c.beginPath(); c.arc(448, GY - 190, 46, 0, 7); c.fillStyle = '#cfe9cf'; c.fill(); stroke(2);
      c.beginPath(); c.arc(550, GY - 188, 44, 0, 7); c.fillStyle = '#cfe9cf'; c.fill(); stroke(2);
      c.restore();
    }
  }

  // ---------- characters: pose logic from the timeline
  function pose(name, t) {
    const ch = L.chars[name], l = lineAt(t), mine = l && l.who === name, e = mine ? env(l, t) : 0;
    const p = { ...ch, bob: 0, tilt: 0, lean: 0, bow: 0, armR: [0.18, 0.15], armL: [0.18, 0.15] };
    const br = Math.sin(t * 2.1 + ch.x) * 1.2; p.bob = br;
    if (mine) {
      p.bob += -e * 3.5; p.tilt = Math.sin(t * 3) * 0.02 + e * 0.025;
      const g = clamp((t - l.v0) / 0.35) * (0.45 + 0.55 * Math.sin((t - l.v0) * 2.2) ** 2);   // gesture builds while speaking
      const amp = ({ deadpan: .35, stern: .4, tired: .3, neutral: .5, sweet: .5, sad: .3 })[l.emo] ?? .75; p.armR = [0.25 + 0.95 * amp * e * g, 1.1 * amp * e * g + 0.15]; p.armL = [0.2, 0.2];
    } else { p.tilt = Math.sin(t * 1.3 + ch.x) * 0.012; if (l) p.tilt += 0.02; }
    for (const ev of (L.events || [])) if (ev.who === name && t >= ev.t0 && t <= ev.t1) ev.fn(p, t, (t - ev.t0) / (ev.t1 - ev.t0));
    return p;
  }

  // ---------- phone close-up
  function phone(t, tin, dur, A) {
    const k = clamp((t - tin) / 0.55), pop = eback(k);
    c.save(); c.fillStyle = '#fdfdfd'; c.fillRect(0, 0, W, H);
    const read = A.readFrom != null ? clamp((t - A.readFrom) / (A.readTo - A.readFrom)) : clamp((t - tin - 0.9) / Math.max(dur - 1.2, 1)); const z = 1 + 0.2 * ease(clamp((t - tin) / dur));
    c.translate(288, 560 + (1 - pop) * 700); c.rotate(-0.1 + 0.03 * Math.sin(t * 1.2)); c.scale(z, z);
    // phone body
    c.beginPath(); c.roundRect(-190, -420, 380, 800, 38); c.fillStyle = '#111'; c.fill(); stroke(2);
    c.beginPath(); c.roundRect(-176, -406, 352, 772, 28); c.fillStyle = '#fff'; c.fill();
    c.fillStyle = '#111'; c.beginPath(); c.roundRect(-44, -400, 88, 22, 11); c.fill();
    c.fillStyle = '#6b6b6b'; c.font = '600 15px Montserrat'; c.textAlign = 'left'; c.fillText('9:41', -158, -380);
    c.fillStyle = '#e8f3f1'; c.beginPath(); c.roundRect(-176, -362, 352, 44, 0); c.fill();
    c.fillStyle = '#222'; c.font = '800 17px Montserrat'; c.fillText('Quran', -158, -334);
    c.fillStyle = '#8a8a8a'; c.font = '600 13px Montserrat'; c.textAlign = 'right'; c.fillText(A.where, 160, -334);
    // tabs
    c.textAlign = 'center'; c.fillStyle = '#f1f1f1'; c.beginPath(); c.roundRect(-150, -300, 140, 30, 8); c.fill(); c.beginPath(); c.roundRect(10, -300, 140, 30, 8); c.fill();
    c.fillStyle = '#777'; c.font = '600 13px Montserrat'; c.fillText('Translation', -80, -280); c.fillText('Reading', 80, -280);
    // arabic
    c.direction = 'rtl'; c.textAlign = 'center'; c.fillStyle = '#1a1a1a'; c.font = '36px Amiri';
    A.arabic.forEach((ln, i) => c.fillText(ln, 0, -210 + i * 62));
    c.direction = 'ltr';
    // translation with highlight sweep
    c.font = '600 19px Montserrat'; c.textAlign = 'left'; const lines = A.english, y0 = 20, lh = 32; const total = lines.reduce((s, x) => s + x.length, 0); let done = read * total;
    lines.forEach((ln, i) => {
      const w = c.measureText(ln).width, frac = clamp(done / ln.length); done -= ln.length;
      if (frac > 0) { c.fillStyle = 'rgba(255,214,0,.75)'; c.fillRect(-150, y0 + i * lh - 22, w * frac + 4, 30); }
      c.fillStyle = '#6a6a6a'; c.fillText(ln, -150, y0 + i * lh);
    });
    c.fillStyle = '#9a9a9a'; c.font = '600 14px Montserrat'; c.fillText(A.cite, -150, y0 + lines.length * lh + 24);
    // fingers on right edge + thumb on left
    for (let i = 0; i < 4; i++) { c.beginPath(); c.roundRect(165 + (i % 2) * 5, -170 + i * 78, 78, 62, 30); c.fillStyle = '#e3a77a'; c.fill(); stroke(3); }
    c.beginPath(); c.roundRect(-232, 120, 78, 90, 34); c.fillStyle = '#e3a77a'; c.fill(); stroke(3);
    c.restore();
  }

  // ---------- captions (word by word, black box)
  function chunks(l) {
    const ws = l.text.replace(/\.\.\./g, '…').split(/\s+/), n = ws.reduce((s, w) => s + w.length + 1, 0), span = l.v1 - l.v0 + 0.1; let acc = 0; const out = []; let cur = null;
    for (const w of ws) {
      const t0 = l.v0 + span * acc / n; acc += w.length + 1;
      if (cur && cur.text.length + w.length < 14 && cur.n < 2) { cur.text += ' ' + w; cur.n++; cur.t1 = l.v0 + span * acc / n; } else { cur = { text: w, n: 1, t0, t1: l.v0 + span * acc / n }; out.push(cur); }
    }
    out.forEach((o, i) => o.t1 = i + 1 < out.length ? out[i + 1].t0 : l.v1 + 0.25); return out;
  }
  function caption(t) {
    for (const l of TL.lines) {
      if (t < l.v0 - 0.02 || t > l.v1 + 0.3) continue;
      if (!l._ch) l._ch = chunks(l);
      const ch = l._ch.find(o => t >= o.t0 && t < o.t1); if (!ch) return;
      const txt = ch.text.replace(/[.,]+$/, '').toUpperCase(); c.font = '800 31px Montserrat'; const w = c.measureText(txt).width + 36, a = clamp((t - ch.t0) / 0.08);
      c.save(); c.globalAlpha = a; c.translate(288, 935); c.scale(0.92 + 0.08 * a, 0.92 + 0.08 * a); c.beginPath(); c.roundRect(-w / 2, -30, w, 58, 14); c.fillStyle = '#111'; c.fill();
      c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 0, 0); c.restore(); return;
    }
  }


  // ---------- header (frame 0 carries the promise) and cards (step / word / recap). Cards sit at the top; shots keep faces below them.
  function wrap(txt, w) { const ws = txt.split(' '), out = []; let cur = ''; for (const x of ws) { const tt = cur ? cur + ' ' + x : x; if (c.measureText(tt).width > w && cur) { out.push(cur); cur = x; } else cur = tt; } if (cur) out.push(cur); return out; }
  function panel(x, y, w, h, a = 1) { c.save(); c.globalAlpha = a; c.shadowColor = 'rgba(60,40,60,.18)'; c.shadowBlur = 18; c.shadowOffsetY = 6; c.beginPath(); c.roundRect(x, y, w, h, 22); c.fillStyle = '#fff'; c.fill(); c.shadowColor = 'transparent'; stroke(2); c.restore(); }
  function chipRow(cx, y, active, scale = 1, a = 1) {
    const H = L.header; c.save(); c.globalAlpha = a; c.font = `800 ${Math.round(15 * scale)}px Montserrat`; c.textBaseline = 'middle'; c.textAlign = 'center';
    const ws = H.chips.map((t, i) => c.measureText(`${i + 1} ${t}`).width + 26 * scale); const gap = 8 * scale; let x = cx - (ws.reduce((p, q) => p + q, 0) + gap * (ws.length - 1)) / 2;
    H.chips.forEach((t, i) => { const on = active === 'all' || active === i; c.beginPath(); c.roundRect(x, y - 14 * scale, ws[i], 28 * scale, 14 * scale); c.fillStyle = on ? '#ff6fae' : '#f1ecef'; c.fill(); c.fillStyle = on ? '#fff' : '#8a7f86'; c.fillText(`${i + 1} ${t}`, x + ws[i] / 2, y + 1); x += ws[i] + gap; });
    c.restore();
  }
  function activeChip(t) { const sc = TL.scenes.find(s => t >= s.start && t < s.end); if (!sc) return -1; const m = /^step(\d)$/.exec(sc.id); if (m) return +m[1] - 1; return sc.id === 'close' ? 'all' : -1; }
  function header(t) {
    const H = L.header; if (!H) return; const k = ease(clamp((t - 3.4) / 0.6)), hh = lerp(176, 56, k), a = clamp(t / 0.15);
    panel(24, 10, 528, hh, a); c.save(); c.globalAlpha = a; c.textAlign = 'center';
    if (k < 1) { c.globalAlpha = a * (1 - k); c.fillStyle = '#8a7f86'; c.font = '700 14px Montserrat'; c.fillText(H.kicker, 288, 38); c.fillStyle = INK; c.font = '800 42px Montserrat'; H.title.forEach((ln, i) => c.fillText(ln, 288, 86 + i * 46)); }
    if (k > 0) { c.globalAlpha = a * k; c.fillStyle = INK; c.font = '800 17px Montserrat'; c.textAlign = 'left'; c.fillText(H.short, 44, 44); }
    c.restore();
    if (k < 1) chipRow(288, 160, k < 0.5 ? 'all' : -1, 1.1, a * (1 - k)); if (k > 0) chipRow(374, 38, activeChip(t), 0.72, a * k);
  }
  function cards(t) {
    for (const cd of TL.scenes.flatMap(s => s.cards || [])) {
      if (t < cd.t0 || t > cd.t1 + 0.3) continue; const D = L.cards[cd.id]; if (!D) continue;
      const kin = clamp((t - cd.t0) / 0.4), kout = clamp((t - cd.t1) / 0.3), y0 = 78, off = (1 - eback(kin)) * -240 + eout(kout) * -260;
      c.save(); c.translate(0, off); c.textAlign = 'center';
      if (D.type === 'step') { panel(34, y0, 508, 148); c.beginPath(); c.arc(86, y0 + 52, 30, 0, 7); c.fillStyle = '#ff6fae'; c.fill(); c.fillStyle = '#fff'; c.font = '800 34px Montserrat'; c.textBaseline = 'middle'; c.fillText(D.n, 86, y0 + 54); c.textBaseline = 'alphabetic';
        c.textAlign = 'left'; c.fillStyle = INK; c.font = '800 38px Montserrat'; c.fillText(D.name, 134, y0 + 64); c.fillStyle = '#6a6a6a'; c.font = '600 20px Montserrat'; wrap(D.body, 380).forEach((ln, i) => c.fillText(ln, 134, y0 + 96 + i * 26)); }
      if (D.type === 'word') { panel(34, y0, 508, 214); c.fillStyle = '#ff6fae'; c.font = '800 14px Montserrat'; c.fillText(D.label, 288, y0 + 24); c.direction = 'rtl'; c.fillStyle = '#1a1a1a'; c.font = '58px Amiri'; c.fillText(D.ar, 288, y0 + 96); c.direction = 'ltr';
        c.fillStyle = INK; c.font = '800 30px Montserrat'; c.fillText(D.tr + '  =  ' + D.mean, 288, y0 + 156); c.fillStyle = '#8a8a8a'; c.font = '600 17px Montserrat'; c.fillText(D.tip, 288, y0 + 188); }
      if (D.type === 'recap') { panel(34, y0, 508, 206); c.fillStyle = '#8a7f86'; c.font = '800 14px Montserrat'; c.fillText('THE LESSON', 288, y0 + 28); D.items.forEach((it, i) => { const x = 110 + i * 178; c.beginPath(); c.arc(x, y0 + 82, 24, 0, 7); c.fillStyle = '#ff6fae'; c.fill(); c.fillStyle = '#fff'; c.font = '800 26px Montserrat'; c.textBaseline = 'middle'; c.fillText(i + 1, x, y0 + 84); c.textBaseline = 'alphabetic'; c.fillStyle = INK; c.font = '800 20px Montserrat'; c.fillText(it, x, y0 + 134); });
        c.fillStyle = '#ff6fae'; c.font = '800 18px Montserrat'; c.fillText(D.note, 288, y0 + 182); }
      c.restore();
    }
  }

  // ---------- end card
  function card(t, t0) {
    c.fillStyle = '#fdfdfd'; c.fillRect(0, 0, W, H); const k = clamp((t - t0) / 0.7), e = eback(k); const C = L.card;
    c.save(); c.translate(288, 470); c.rotate(-0.07); c.scale(e, e); c.fillStyle = INK; c.font = '700 96px Caveat'; c.textAlign = 'center';
    C.lines.forEach((s, i) => { const a = clamp((t - t0 - i * 0.25) / 0.4); c.globalAlpha = a; c.fillText(s, 0, i * 92 - 90 + (1 - a) * 14); }); c.restore();
    c.globalAlpha = 1; const s = clamp((t - t0 - 0.3) / 0.5); spark(110, 360, eout(s) * 1.3, s); spark(470, 560, eout(clamp((t - t0 - 0.5) / 0.5)) * 1.6, 1); spark(140, 640, eout(clamp((t - t0 - 0.7) / 0.5)) * 1.0, 1);
    if (C.note) { c.globalAlpha = clamp((t - t0 - 0.8) / 0.5); c.font = '800 20px Montserrat'; c.fillStyle = '#8a7f7f'; c.textAlign = 'center'; c.fillText(C.note, 288, 800); c.globalAlpha = 1; }
  }

  // ---------- camera
  function shot(t) { const sh = TL.allShots; let cur = sh[0]; for (const s of sh) if (t >= s.t) cur = s; const nxt = sh[sh.indexOf(cur) + 1]; return { s: cur, k: clamp((t - cur.t) / Math.max(0.5, (nxt ? nxt.t : TL.total) - cur.t)), dt: t - cur.t }; }
  function renderFrame(t) {
    BOIL = Math.floor(t * 8);
    const { s, k, dt } = shot(t), def = L.shots[s.name];
    c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#fdfdfd'; c.fillRect(0, 0, W, H);
    if (def.phone) { phone(t, def.from ? TL.allShots.find(x => x.name === def.from).t : s.t, def.dur, L.ayahs ? L.ayahs[def.ayah] : L.ayah); header(t); caption(t); fadeIn(dt); return; }
    if (def.card) { card(t, s.t); return; }
    const z = lerp(def.z[0], def.z[1], ease(k)), cx = lerp(def.cx[0], def.cx[1], ease(k)), cy = lerp(def.cy[0], def.cy[1], ease(k)), rot = (def.rot || 0) * (1 - k) + Math.sin(t * 0.7) * 0.004;
    c.save(); c.translate(W / 2, H / 2); c.rotate(rot); c.scale(z, z); c.translate(-cx, -cy);
    scenery();
    const order = Object.keys(L.chars); const hand = {};
    for (const n of order) hand[n] = girl(pose(n, t));
    L.doodles && L.doodles(c, t, { bubble, scribble, heart, spark, qmark, hand, stroke, ink: INK, lineAt, ease, eout, eback, clamp });
    c.restore(); header(t); cards(t); caption(t); fadeIn(dt);
  }
  function fadeIn(dt) { if (dt < 0.1) { c.fillStyle = `rgba(253,253,253,${0.55 * (1 - dt / 0.1)})`; c.fillRect(0, 0, W, H); } }

  async function start() {
    const fonts = [['Montserrat', '800', 'fonts/montserrat-latin-800-normal.woff2'], ['Montserrat', '500', 'fonts/montserrat-latin-800-normal.woff2'], ['Caveat', '700', 'fonts/caveat-latin-700-normal.woff2'], ['Amiri', '400', 'fonts/amiri-arabic-400-normal.woff2']];
    for (const [f, w, u] of fonts) { const ff = new FontFace(f, `url(/formats/quran_lessons/${u})`, { weight: w }); await ff.load(); document.fonts.add(ff); }
    L = window.LESSON; TL = L.timeline; TL.allShots = TL.scenes.flatMap(s => s.shots).sort((a, b) => a.t - b.t);
    window.renderFrame = renderFrame; window.ready = true; if (new URLSearchParams(location.search).get('t')) renderFrame(+new URLSearchParams(location.search).get('t'));
  }
  return { start, renderFrame };
})();
