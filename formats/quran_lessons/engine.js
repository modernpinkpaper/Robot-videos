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
  function limb(x0, y0, x1, y1, w, col) { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.lineCap = 'round'; c.lineWidth = w + 4; c.strokeStyle = INK; c.stroke(); c.lineWidth = w; c.strokeStyle = col; c.stroke(); }
  function arm(side, sx, sy, a1, a2, o) {   // a1,a2 in radians from pointing straight down, positive = outward
    const L1 = 58, L2 = 52, d = side;
    const ex = sx + d * Math.sin(a1) * L1, ey = sy + Math.cos(a1) * L1;
    const hx = ex + d * Math.sin(a1 + a2) * L2, hy = ey + Math.cos(a1 + a2) * L2;
    limb(sx, sy, ex, ey, 22, o.dress); limb(ex, ey, hx, hy, 19, o.dress);
    c.beginPath(); c.ellipse(hx, hy + 4, 8, 10, 0, 0, 7); c.fillStyle = o.skin; c.fill(); stroke(1.6);
    return [hx, hy];
  }
  function girl(o) {   // o: x, face (1 = faces right, -1 left), s, hijab, dress, shoes, skin, tilt, bob, lean, armR:[a1,a2], armL:[a1,a2], bow
    c.save(); c.translate(o.x, GY); c.scale(o.s * o.face, o.s); c.rotate(o.lean || 0);
    // body
    c.beginPath(); c.moveTo(-30, -250); c.quadraticCurveTo(-36, -120, -56, -14); c.lineTo(56, -14); c.quadraticCurveTo(36, -120, 30, -250); c.closePath(); c.fillStyle = o.dress; c.fill(); stroke(2);
    c.beginPath(); c.moveTo(-56, -14); c.quadraticCurveTo(0, -6, 56, -14); stroke(1.4);
    for (const sx of [-24, 24]) { c.beginPath(); c.ellipse(sx, -5, 15, 7, 0, 0, 7); c.fillStyle = o.shoes; c.fill(); stroke(1.6); }
    // back arm (L) then head then front arm (R)
    const hands = {};
    hands.L = arm(-1, -28, -240, o.armL[0], o.armL[1], o);
    // head
    c.save(); c.translate(0, -262 + (o.bob || 0)); c.rotate(o.tilt || 0); c.translate(0, 262);
    const by = o.bow || 0; c.translate(0, -262); c.rotate(by * 0.18); c.translate(0, 262);
    c.beginPath(); c.moveTo(-40, -290); c.quadraticCurveTo(-52, -232, -38, -214); c.lineTo(38, -214); c.quadraticCurveTo(52, -232, 40, -290); c.closePath(); c.fillStyle = o.hijab; c.fill(); stroke(2);   // drape
    c.beginPath(); c.ellipse(0, -300, 40, 46, 0, 0, 7); c.fillStyle = o.hijab; c.fill(); stroke(2);
    c.beginPath(); c.ellipse(6, -298, 22, 29, 0, 0, 7); c.fillStyle = o.skin; c.fill(); stroke(1.6);
    c.beginPath(); c.moveTo(-14, -262); c.quadraticCurveTo(-4, -246, 22, -262); c.strokeStyle = 'rgba(74,59,59,.35)'; c.lineWidth = 1.2; c.stroke();
    c.restore();
    hands.R = arm(1, 28, -240, o.armR[0], o.armR[1], o);
    c.restore(); return hands;
  }
  const scribble = (x, y, w, n = 3) => { c.beginPath(); for (let i = 0; i < n; i++) { const yy = y + i * 9; c.moveTo(x, yy); for (let k = 1; k <= 6; k++) c.lineTo(x + w * k / 6, yy + (k % 2 ? -3 : 3)); } stroke(2); };
  function bubble(x, y, w, h, tailX, tailY, a = 1) {
    c.save(); c.globalAlpha = a; c.beginPath(); c.roundRect(x, y, w, h, 18); c.fillStyle = '#fff'; c.fill(); stroke(2);
    c.beginPath(); c.moveTo(x + w * .3, y + h - 1); c.lineTo(tailX, tailY); c.lineTo(x + w * .5, y + h - 1); c.fillStyle = '#fff'; c.fill(); stroke(2);
    c.beginPath(); c.moveTo(x + w * .3 + 2, y + h - 1); c.lineTo(x + w * .5 - 2, y + h - 1); c.strokeStyle = '#fff'; c.lineWidth = 4; c.stroke(); c.restore();
  }
  function heart(x, y, s, a = 1, col = '#e23b4e') {
    c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(0, 8); c.bezierCurveTo(-26, -10, -16, -34, 0, -18); c.bezierCurveTo(16, -34, 26, -10, 0, 8); c.fillStyle = col; c.fill(); stroke(2 / s); c.restore();
  }
  function spark(x, y, s, a = 1) { c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(0, -20); c.quadraticCurveTo(3, -3, 20, 0); c.quadraticCurveTo(3, 3, 0, 20); c.quadraticCurveTo(-3, 3, -20, 0); c.quadraticCurveTo(-3, -3, 0, -20); c.fillStyle = '#ffd23c'; c.fill(); stroke(2 / s); c.restore(); }
  function qmark(x, y, s, a = 1) { c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s); c.font = '700 44px Caveat'; c.fillStyle = INK; c.textAlign = 'center'; c.fillText('?', 0, 0); c.restore(); }

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
      p.armR = [0.35 + 0.95 * e * g, 1.1 * e * g + 0.15]; p.armL = [0.2, 0.2];
    } else { p.tilt = Math.sin(t * 1.3 + ch.x) * 0.012; if (l) p.tilt += 0.02; }
    for (const ev of (L.events || [])) if (ev.who === name && t >= ev.t0 && t <= ev.t1) ev.fn(p, t, (t - ev.t0) / (ev.t1 - ev.t0));
    return p;
  }

  // ---------- phone close-up
  function phone(t, tin, dur) {
    const k = clamp((t - tin) / 0.55), pop = eback(k), A = L.ayah;
    c.save(); c.fillStyle = '#fdfdfd'; c.fillRect(0, 0, W, H);
    const read = clamp((t - tin - 0.9) / Math.max(dur - 1.2, 1)); const z = 1 + 0.2 * ease(clamp((t - tin) / dur));
    c.translate(288, 520 + (1 - pop) * 700); c.rotate(-0.1 + 0.03 * Math.sin(t * 1.2)); c.scale(z, z);
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
    const { s, k, dt } = shot(t), def = L.shots[s.name];
    c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#fdfdfd'; c.fillRect(0, 0, W, H);
    if (def.phone) { phone(t, def.from ? TL.allShots.find(x => x.name === def.from).t : s.t, def.dur); caption(t); fadeIn(dt); return; }
    if (def.card) { card(t, s.t); return; }
    const z = lerp(def.z[0], def.z[1], ease(k)), cx = lerp(def.cx[0], def.cx[1], ease(k)), cy = lerp(def.cy[0], def.cy[1], ease(k)), rot = (def.rot || 0) * (1 - k) + Math.sin(t * 0.7) * 0.004;
    c.save(); c.translate(W / 2, H / 2); c.rotate(rot); c.scale(z, z); c.translate(-cx, -cy);
    scenery();
    const order = Object.keys(L.chars); const hand = {};
    for (const n of order) hand[n] = girl(pose(n, t));
    L.doodles && L.doodles(c, t, { bubble, scribble, heart, spark, qmark, hand, stroke, ink: INK, lineAt, ease, eout, eback, clamp });
    c.restore(); caption(t); fadeIn(dt);
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
