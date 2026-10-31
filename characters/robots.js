// THE ROBOT LOOK (characters only, no podcast set). Do not restyle: reuse as is.
// Usage: const kit = createRobotKit(THREE, RoundedBoxGeometry);
//   const bot = kit.mkBot('MICA', { parent: scene, x: 0, y: 0, z: 0, scale: 1 });
//   every frame: kit.animateBot(bot, t, { speaking, amp, emo });   // emo: happy excited deadpan sweet stern tired dramatic worried shock smug laugh neutral
//   (add a light rig and a camera; see demo.html)
export function createRobotKit(THREE, RoundedBoxGeometry) {
const lerp = (a, b, t) => a + (b - a) * t, clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); }, seg = (t, a, b) => clamp((t - a) / (b - a));
const matCache = {};
const mat = (c, o = {}) => { const k = c + JSON.stringify(o); return matCache[k] || (matCache[k] = new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.55, metalness: 0.05 }, o))); };
function box(g, w, h, d, c, x = 0, y = 0, z = 0, o = {}) {
  const geo = o.round ? new RoundedBoxGeometry(w, h, d, 4, Math.min(o.round, Math.min(w, h, d) / 2.05)) : new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(geo, o.mat || mat(c, o.m)); m.position.set(x, y, z); m.castShadow = !o.noShadow; m.receiveShadow = true; g.add(m); return m;
}
function cyl(g, r, h, c, x = 0, y = 0, z = 0, o = {}) { const m = new THREE.Mesh(new THREE.CylinderGeometry(o.r2 ?? r, r, h, o.seg || 20), o.mat || mat(c, o.m)); m.position.set(x, y, z); m.castShadow = !o.noShadow; m.receiveShadow = true; g.add(m); return m; }
function ball(g, r, c, x = 0, y = 0, z = 0, o = {}) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), o.mat || mat(c, o.m)); m.position.set(x, y, z); m.castShadow = !o.noShadow; m.receiveShadow = true; g.add(m); return m; }
function textPlane(g, text, w, h, bg, fg, font, x, y, z, ry = 0, glow = false) {
  const c = document.createElement('canvas'); c.width = 512; c.height = Math.round(512 * h / w); const x2 = c.getContext('2d');
  if (bg) { x2.fillStyle = bg; x2.fillRect(0, 0, c.width, c.height); }
  x2.font = font; x2.textAlign = 'center'; x2.textBaseline = 'middle'; x2.fillStyle = fg; x2.fillText(text, c.width / 2, c.height / 2 + 2);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glow || !bg ? new THREE.MeshBasicMaterial({ map: t, transparent: !bg }) : new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 }));
  m.position.set(x, y, z); m.rotation.y = ry; g.add(m); return m;
}
const POOL = {
  MICA:    { kind: 'robot',   acc: 0x2fd6d6, eye: '#bff7f2', col: '#1fbfbf', s: 1.0 },
  HOOKY:   { kind: 'robot',   acc: 0xffb02e, eye: '#ffe3a8', col: '#f09a10', s: 1.0 },
  CHARGEY: { kind: 'robot',   acc: 0x4a8bff, eye: '#bcd6ff', col: '#3d7bf0', s: 1.0 },
  DRAFTY:  { kind: 'robot',   acc: 0xff7ab8, eye: '#ffd1ea', col: '#ff6fae', s: 1.0 },
  LISTER:  { kind: 'robot',   acc: 0x56c85a, eye: '#cdf5c8', col: '#3fb145', s: 1.0 },
  LOGBOT:  { kind: 'robot',   acc: 0x8f96b0, eye: '#d5e0ff', col: '#7a82a0', s: 1.0 },
  LEFTY:   { kind: 'printer', acc: 0x56c85a, eye: '#cdf5c8', col: '#3fb145', s: 1.0 },
  KRAFT:   { kind: 'printer', acc: 0xc8853a, eye: '#ffd9a8', col: '#b8741f', s: 1.0 },
  DUSTY:   { kind: 'printer', acc: 0x8f96b0, eye: '#d5e0ff', col: '#7a82a0', s: 1.0 },
  DYMO:    { kind: 'printer', acc: 0x2fb0d0, eye: '#b8f0ff', col: '#1f98b8', s: 0.8 },
  STATUS:  { kind: 'printer', acc: 0xa07af0, eye: '#e6d8ff', col: '#8a62e0', s: 1.0 },
  DALIA:   { kind: 'human',   acc: 0xf2a0c0, eye: '#2a1a14', col: '#e0689a', s: 1.0 },
};
function mkBot(key, opts = {}) {
  const cfg = Object.assign({ x: 0, y: 0, z: 0, ry: 0 }, POOL[key], opts); const g = new THREE.Group(); g.position.set(cfg.x, cfg.y, cfg.z); g.rotation.y = cfg.ry; g.scale.setScalar(cfg.s * (opts.scale || 1)); if (opts.parent) opts.parent.add(g);
  const human = cfg.kind === 'human', printer = cfg.kind === 'printer';
  const white = key === 'STATUS' ? 0xe8e0ff : (key === 'DUSTY' ? 0xe6e2ee : 0xf8f5fc); const skin = 0xe3b88d;
  const body = new THREE.Group(); g.add(body);
  if (printer) {
    box(body, 2.5, 1.7, 1.45, white, 0, 3.1, 0, { round: 0.3, m: key === 'STATUS' ? { transparent: true, opacity: 0.78 } : undefined }); box(body, 1.8, 0.14, 0.1, 0x2a2438, 0, 3.15, 0.74, { noShadow: true });
    box(body, 1.4, 0.04, 0.9, 0xffffff, 0, 3.15, 1.1, { noShadow: true }); box(body, 1.7, 0.08, 0.7, 0xd8d0e8, 0, 3.97, 0.1, { noShadow: true });
    body.userData.bulb = ball(body, 0.12, 0xffffff, 0.8, 2.7, 0.76, { noShadow: true, mat: new THREE.MeshBasicMaterial({ color: 0xffffff }) });
  } else if (human) {
    box(body, 2.0, 1.8, 1.25, 0xf2a0c0, 0, 3.15, 0, { round: 0.4 }); box(body, 0.9, 0.5, 0.06, 0xffffff, 0, 2.85, 0.64, { round: 0.06, noShadow: true });
    body.userData.bulb = ball(body, 0.01, 0xffffff, 0, 0, 0, { noShadow: true });
  } else {
    box(body, 2.0, 1.8, 1.25, white, 0, 3.15, 0, { round: 0.4 }); box(body, 1.1, 0.5, 0.08, cfg.acc, 0, 3.05, 0.64, { round: 0.06, noShadow: true });
    body.userData.bulb = ball(body, 0.12, 0xffffff, 0.35, 3.05, 0.7, { noShadow: true, mat: new THREE.MeshBasicMaterial({ color: 0xffffff }) });
  }
  const bulb = body.userData.bulb;
  cyl(body, 0.35, 0.35, human ? skin : 0xd8d0e8, 0, 4.1, 0, { seg: 14 });
  const head = new THREE.Group(); head.position.set(0, 5.05, 0); body.add(head);
  if (human) {
    box(head, 2.4, 2.1, 1.7, skin, 0, 0, 0, { round: 0.55 });
    box(head, 2.5, 0.7, 1.8, 0x2a1c14, 0, 0.95, -0.05, { round: 0.3, noShadow: true }); box(head, 2.5, 2.6, 0.5, 0x2a1c14, 0, -0.5, -0.78, { round: 0.2, noShadow: true });
    for (const s of [-1, 1]) { box(head, 0.35, 1.9, 1.5, 0x2a1c14, s * 1.2, -0.25, -0.05, { round: 0.15, noShadow: true }); const ear = cyl(head, 0.5, 0.4, 0xf2a0c0, s * 1.38, 0.05, 0, { seg: 24 }); ear.rotation.z = Math.PI / 2; }
    const band = cyl(head, 1.42, 0.12, 0xf2a0c0, 0, 1.35, 0, { seg: 30, noShadow: true }); band.scale.z = 0.7; band.scale.x = 0.88;
  } else {
    box(head, 2.65, 2.05, 1.65, white, 0, 0, 0, { round: 0.55, m: key === 'STATUS' ? { transparent: true, opacity: 0.82 } : undefined });
    box(head, 2.2, 1.6, 0.14, 0x1d1730, 0, 0, 0.8, { round: 0.2, noShadow: true });
  }
  const fc = document.createElement('canvas'); fc.width = 512; fc.height = 384; const fx = fc.getContext('2d'); const ft = new THREE.CanvasTexture(fc); ft.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(human ? 1.9 : 2.05, human ? 1.4 : 1.5), new THREE.MeshBasicMaterial({ map: ft })); face.position.set(0, human ? -0.05 : 0, human ? 0.86 : 0.875); head.add(face);
  let ant = ball(head, 0.01, 0xffffff, 0, 0, 0, { noShadow: true });
  if (!human) {
    for (const s of [-1, 1]) { const ear = cyl(head, 0.5, 0.4, cfg.acc, s * 1.42, 0, 0, { seg: 24 }); ear.rotation.z = Math.PI / 2; box(head, 0.12, 0.9, 0.9, white, s * 1.25, 0, 0, { round: 0.05, noShadow: true }); }
    cyl(head, 0.06, 0.8, 0xc8c0d8, 0, 1.4, 0, { seg: 8 }); ant = ball(head, 0.2, cfg.acc, 0, 1.9, 0, { m: { emissive: cfg.acc, emissiveIntensity: 0.5 } });
  }
  const arms = [-1, 1].map(s => { const a = new THREE.Group(); a.position.set(s * (printer ? 1.4 : 1.2), 3.75, 0.1); body.add(a); box(a, 0.5, 1.3, 0.5, human ? 0xf2a0c0 : white, 0, -0.55, 0, { round: 0.2 }); ball(a, 0.34, human ? skin : cfg.acc, 0, -1.3, 0, {}); return a; });
  // ---- accessories (each character keeps its own look)
  if (key === 'MICA') { const band = cyl(head, 1.45, 0.14, 0x2fd6d6, 0, 0.9, 0, { seg: 30, noShadow: true }); band.scale.z = 0.72; band.scale.x = 0.9; }
  if (key === 'DRAFTY') { box(body, 0.9, 0.62, 0.06, 0xffffff, -0.45, 2.55, 0.66, { round: 0.04, noShadow: true }); const fl = box(body, 0.9, 0.04, 0.5, 0xffb6d6, -0.45, 2.82, 0.66, { noShadow: true }); fl.rotation.x = 0.7; for (const s of [-1, 1]) { const b = box(head, 0.5, 0.35, 0.2, 0xff7ab8, s * 0.35, 1.25, 0.2, { round: 0.1 }); b.rotation.z = s * 0.5; } }
  if (key === 'CHARGEY') { box(body, 0.45, 0.9, 0.06, 0xe83a4a, 0, 2.55, 0.66, { round: 0.04, noShadow: true }); box(body, 0.2, 0.7, 0.2, 0x7a4a2a, 1.3, 2.9, 0.8, { round: 0.05 }); box(body, 0.9, 0.4, 0.4, 0x7a4a2a, 1.3, 3.3, 0.8, { round: 0.1 }); box(head, 2.7, 0.2, 1.7, 0x4a8bff, 0, 0.95, 0, { round: 0.1, noShadow: true }); }
  if (key === 'LISTER') { box(body, 1.1, 1.4, 0.1, 0xf0e6c8, 1.6, 2.7, 0.9, { round: 0.05 }); for (let i = 0; i < 4; i++) box(body, 0.7, 0.07, 0.04, i < 3 ? 0x56c85a : 0xaaaaaa, 1.6, 3.15 - i * 0.28, 0.97, { noShadow: true }); const lf = box(head, 0.7, 0.14, 0.4, 0x56c85a, 0.5, 1.8, 0, { noShadow: true }); lf.rotation.z = -0.5; }
  if (key === 'HOOKY') { const ring = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.12, 12, 40), new THREE.MeshBasicMaterial({ color: 0xfff6d8 })); ring.position.set(0, 5.1, -1.0); g.add(ring); box(head, 0.6, 0.18, 0.5, 0xffb02e, 0.7, 1.5, 0.15, { round: 0.06, noShadow: true }); textPlane(head, '♪', 0.9, 0.9, null, '#ffb02e', 'bold 140px Liberation Sans, sans-serif', -0.7, 1.75, 0.2, 0, true); }
  if (key === 'LOGBOT') { const mg = new THREE.Group(); mg.position.set(1.6, 2.9, 0.9); g.add(mg); mg.add(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.09, 10, 28), mat(0x555a72))); mg.add(new THREE.Mesh(new THREE.CircleGeometry(0.46, 24), new THREE.MeshStandardMaterial({ color: 0xaad8ff, transparent: true, opacity: 0.5 }))); box(mg, 0.12, 0.8, 0.12, 0x555a72, 0.4, -0.7, 0, { noShadow: true }).rotation.z = 0.7; const dish = cyl(head, 0.6, 0.2, 0xc8c0d8, 0.0, 2.0, 0, { seg: 20, r2: 0.2 }); dish.rotation.x = -0.5; }
  if (key === 'LEFTY') { textPlane(body, '#3', 1.1, 0.8, '#56c85a', '#fff', 'bold 90px Liberation Sans, sans-serif', -0.7, 3.55, 0.78); const lf = box(head, 0.7, 0.14, 0.4, 0x56c85a, 0.5, 1.8, 0, { noShadow: true }); lf.rotation.z = -0.5; }
  if (key === 'KRAFT') { box(body, 1.3, 0.85, 0.06, 0xc8853a, -0.5, 2.7, 0.78, { round: 0.03, noShadow: true }); const fl = box(body, 1.3, 0.04, 0.5, 0xb87430, -0.5, 3.1, 0.82, { noShadow: true }); fl.rotation.x = 0.5; for (let i = 0; i < 3; i++) box(g, 1.3, 0.12, 0.9, 0xc8853a, -0.6, 2.82 + i * 0.13, 1.5, { round: 0.02, noShadow: true }); box(head, 2.7, 0.18, 1.7, 0x8a5a22, 0, 0.95, 0, { round: 0.1, noShadow: true }); }
  if (key === 'DUSTY') { for (let i = 0; i < 4; i++) ball(body, 0.2 + (i % 2) * 0.08, 0xc8c8d2, -1.0 + i * 0.7, 4.0 + (i % 2) * 0.1, -0.1 + (i % 2) * 0.4, { noShadow: true }); box(body, 0.5, 0.5, 0.04, 0xfff08a, 0.7, 2.8, 0.76, { noShadow: true }).rotation.z = 0.15; box(body, 0.5, 0.5, 0.04, 0xffb6d6, 0.95, 3.35, 0.76, { noShadow: true }).rotation.z = -0.1; box(head, 0.7, 0.2, 0.08, 0xf2c8a0, -0.6, 0.8, 0.85, { noShadow: true }).rotation.z = 0.5; box(head, 0.7, 0.2, 0.08, 0xf2c8a0, -0.6, 0.8, 0.86, { noShadow: true }).rotation.z = -0.5; cyl(g, 0.28, 0.4, 0xffffff, -1.2, 2.95, 1.4, { seg: 14 }); }
  if (key === 'DYMO') { const roll = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.22, 12, 28), mat(0x2fb0d0)); roll.position.set(0, 2.15, 0); roll.rotation.x = Math.PI / 2 - 0.3; head.add(roll); box(g, 1.2, 0.5, 0.04, 0xffffff, 0.2, 2.5, 1.0, { noShadow: true }); textPlane(g, 'SHIPPED', 1.1, 0.4, null, '#1f98b8', 'bold 70px Liberation Sans, sans-serif', 0.2, 2.5, 1.03); }
  if (key === 'STATUS') { box(head, 2.0, 0.55, 0.04, 0xffffff, 0, 2.55, 0.4, { noShadow: true }); textPlane(head, 'STATUS INQUIRY', 1.9, 0.5, null, '#8a62e0', 'bold 56px Liberation Sans, sans-serif', 0, 2.55, 0.43); }
  return { key, cfg, g, body, head, arms, fx, ft, ant, bulb, blinkPhase: Math.random() * 6 };
}
const rr = (x, a, b, c, d, r) => { x.beginPath(); x.roundRect(a, b, c, d, r); };
function drawFace(b, s) {
  const x = b.fx, Wc = 512, Hc = 384; x.clearRect(0, 0, Wc, Hc); const human = b.cfg.kind === 'human';
  if (human) { x.fillStyle = (b.cfg.skinHex || '#e3b88d'); x.fillRect(0, 0, Wc, Hc); } else { const g = x.createLinearGradient(0, 0, 0, Hc); g.addColorStop(0, '#2a2147'); g.addColorStop(1, '#171229'); x.fillStyle = g; x.fillRect(0, 0, Wc, Hc);
  x.fillStyle = 'rgba(255,255,255,0.04)'; for (let y = 0; y < Hc; y += 6) x.fillRect(0, y, Wc, 2); }
  const emo = s.emo, col = b.cfg.eye, mo = s.mouth;
  const ex = [Wc * 0.31, Wc * 0.69], ey = Hc * 0.40; let ew = 62, eh = 92;
  const bl = s.blink; const sx = s.look[0] * 14, sy = s.look[1] * 10;
  x.lineCap = 'round'; x.lineJoin = 'round';
  for (let i = 0; i < 2; i++) {
    const cx = ex[i] + sx, cy = ey + sy;
    let kind = 'oval';
    if (emo === 'happy' || emo === 'laugh') kind = 'arc'; else if (emo === 'shock' || emo === 'dramatic') { ew = 74; eh = 108; } else if (emo === 'excited') { ew = 70; eh = 100; kind = 'star'; } else if (emo === 'deadpan' || emo === 'stern' || emo === 'tired') kind = 'lid'; else if (emo === 'smug') kind = 'halflid'; else if (emo === 'worried') { ew = 56; eh = 84; } else if (emo === 'sweet') { ew = 68; eh = 100; }
    if (kind === 'arc') { x.strokeStyle = col; x.lineWidth = 18; x.beginPath(); x.arc(cx, cy + 22, 42, Math.PI * 1.12, Math.PI * 1.88); x.stroke(); }
    else {
      x.fillStyle = col; const h = eh * (1 - 0.9 * bl); x.shadowColor = col; x.shadowBlur = human ? 0 : 24;
      if (kind === 'lid') { rr(x, cx - ew / 2, cy - h / 2, ew, h, 26); x.fill(); x.shadowBlur = 0; x.fillStyle = human ? (b.cfg.skinHex || '#e3b88d') : '#1d1730'; x.fillRect(cx - ew, cy - h / 2 - 2, ew * 2, h * 0.42); }
      else if (kind === 'halflid') { rr(x, cx - ew / 2, cy - h / 2, ew, h, 26); x.fill(); x.shadowBlur = 0; x.fillStyle = human ? (b.cfg.skinHex || '#e3b88d') : '#1d1730'; x.beginPath(); x.moveTo(cx - ew, cy - h / 2 - 2); x.lineTo(cx + ew, cy - h / 2 - 2); x.lineTo(cx + ew, cy - h * (i ? 0.02 : 0.2)); x.lineTo(cx - ew, cy - h * (i ? 0.2 : 0.02)); x.fill(); }
      else if (kind === 'star') { x.shadowBlur = 30; x.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 22 : 50; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * (1 - 0.8 * bl)); } x.closePath(); x.fill(); }
      else { rr(x, cx - ew / 2, cy - h / 2, ew, h, ew * 0.48); x.fill(); x.shadowBlur = 0; x.fillStyle = 'rgba(255,255,255,0.85)'; x.beginPath(); x.ellipse(cx - ew * 0.14, cy - h * 0.22, ew * 0.16, h * 0.13, 0, 0, 7); x.fill(); }
    }
    x.shadowBlur = 0;
    // brows
    x.strokeStyle = col; x.lineWidth = 11; const bx = ex[i] + sx, by = ey - 76 + sy;
    if (emo === 'worried') { x.beginPath(); x.moveTo(bx - 34 * (i ? -1 : 1) * -1 + (i ? 0 : 0), by + 6); x.moveTo(bx + (i ? 34 : -34), by + 14); x.lineTo(bx + (i ? -30 : 30), by - 10); x.stroke(); }
    else if (emo === 'stern') { x.beginPath(); x.moveTo(bx + (i ? 36 : -36), by - 8); x.lineTo(bx + (i ? -32 : 32), by + 18); x.stroke(); }
    else if (emo === 'smug' && i === 0) { x.beginPath(); x.moveTo(bx - 30, by + 10); x.lineTo(bx + 30, by - 6); x.stroke(); }
    else if (emo === 'dramatic' && i === 1) { x.beginPath(); x.moveTo(bx - 30, by - 4); x.quadraticCurveTo(bx, by - 26, bx + 30, by - 2); x.stroke(); }
  }
  // cheeks
  x.fillStyle = human ? 'rgba(255,110,140,0.35)' : 'rgba(255,120,170,0.55)'; for (const cx of [Wc * 0.15, Wc * 0.85]) { x.beginPath(); x.ellipse(cx, Hc * 0.66, 26, 15, 0, 0, 7); x.fill(); }
  // mouth
  const mx = Wc / 2 + s.look[0] * 8, my = Hc * 0.74; x.strokeStyle = human ? '#9a3a46' : col; x.fillStyle = human ? '#b8404e' : '#ff7aa8'; x.lineWidth = 13;
  if (mo > 0.08) { const w = 40 + 38 * mo + (emo === 'laugh' ? 20 : 0), h = 10 + 74 * mo; x.beginPath(); x.ellipse(mx, my + h * 0.2, w, h, 0, 0, 7); x.fill(); x.strokeStyle = '#2a1030'; x.lineWidth = 7; x.stroke(); x.fillStyle = '#ff4a7a'; x.beginPath(); x.ellipse(mx, my + h * 0.55, w * 0.5, h * 0.35, 0, 0, 7); x.fill(); }
  else { x.beginPath(); if (emo === 'worried') { x.arc(mx, my + 30, 36, Math.PI * 1.15, Math.PI * 1.85); } else if (emo === 'deadpan' || emo === 'stern' || emo === 'tired') { x.moveTo(mx - 34, my + 4); x.lineTo(mx + 34, my + (emo === 'tired' ? 12 : 4)); } else if (emo === 'smug') { x.moveTo(mx - 36, my + 6); x.quadraticCurveTo(mx + 10, my + 22, mx + 40, my - 6); } else { x.arc(mx, my - 14, 40, Math.PI * 0.15, Math.PI * 0.85); } x.stroke(); }
  b.ft.needsUpdate = true;
}

// Body language. state: { speaking:bool, amp:0..1, emo:'happy'|..., look:[x,y], blink:0..1, wave:bool, walk:bool }
function animateBot(b, t, st = {}) {
  const idx = b.idx || 0, amp = st.amp || 0, isSp = !!st.speaking, emo = st.emo || 'neutral';
  const ph = (t * 0.28 + b.blinkPhase) % 1; const blink = ph > 0.965 ? Math.sin(seg(ph, 0.965, 1.0) * Math.PI) : 0;
  const look = st.look || [Math.sin(t * 0.7 + idx * 2) * 0.5, Math.cos(t * 0.5 + idx) * 0.3];
  drawFace(b, { emo, mouth: isSp ? clamp(amp * 1.05) : 0, blink, look });
  const sway = Math.sin(t * 1.3 + idx) * 0.02;
  b.head.rotation.z = sway + (isSp ? Math.sin(t * 3.1) * 0.05 * amp : 0) + (emo === 'worried' ? 0.08 : 0) + (emo === 'smug' ? -0.1 : 0);
  b.head.rotation.x = isSp ? -0.02 + amp * 0.04 : 0.03; b.head.rotation.y = Math.sin(t * 0.6 + idx) * 0.06;
  b.head.position.y = 5.05 + (isSp ? 0.06 * amp : 0) + (emo === 'laugh' ? Math.abs(Math.sin(t * 14 + idx)) * 0.1 : 0);
  b.body.position.y = Math.sin(t * 1.6 + idx) * 0.02 + (st.walk ? Math.abs(Math.sin(t * 7)) * 0.15 : 0);
  const g1 = isSp ? (0.8 + 0.7 * amp) : 0.12;
  b.arms[0].rotation.x = isSp ? -0.5 - 1.0 * (0.5 + 0.5 * Math.sin(t * 4.5 + idx)) * g1 : -0.3 + sway; b.arms[1].rotation.x = isSp ? -0.3 - 0.9 * (0.5 + 0.5 * Math.sin(t * 4.1 + 1.7)) * g1 : -0.3 - sway;
  b.arms[0].rotation.z = isSp ? 0.25 + 0.3 * amp : 0.05; b.arms[1].rotation.z = isSp ? -0.25 - 0.3 * amp : -0.05;
  if (st.wave) { b.arms[1].rotation.z = -2.4 + Math.sin(t * 9) * 0.35; b.arms[1].rotation.x = 0; }
  if (st.walk) { b.arms[0].rotation.x = Math.sin(t * 7) * 0.6; b.arms[1].rotation.x = -Math.sin(t * 7) * 0.6; }
  b.bulb.material.color.setHex(isSp ? 0xff4d6d : 0x66ff99); b.ant.scale.setScalar(1 + (isSp ? 0.25 * amp : 0));
}

// ---- Cute humans in the same look. Variety through options.
// mkHuman({ parent, x, y, z, ry, scale, skin:'#e3b88d', hair:'#2a1c14', hairStyle:'long'|'short'|'bob'|'bun'|'curly'|'ponytail'|'bald'|'hijab',
//           top:'#f2a0c0', bottom:'#3c4a78', kid:false, glasses:false, beard:false, legs:true, eye:'#2a1a14' })
const hexn = c => (typeof c === 'string' ? parseInt(c.slice(1), 16) : c);
function mkHuman(o = {}) {
  const O = Object.assign({ x: 0, y: 0, z: 0, ry: 0, scale: 1, skin: '#e3b88d', hair: '#2a1c14', hairStyle: 'long', top: '#f2a0c0', bottom: '#3c4a78', kid: false, glasses: false, beard: false, legs: true, eye: '#2a1a14' }, o);
  const skin = hexn(O.skin), hair = hexn(O.hair), top = hexn(O.top), bottom = hexn(O.bottom);
  const g = new THREE.Group(); g.position.set(O.x, O.y, O.z); g.rotation.y = O.ry; g.scale.setScalar((O.kid ? 0.72 : 1) * O.scale); if (O.parent) O.parent.add(g);
  const cfg = { kind: 'human', skinHex: O.skin, eye: O.eye, acc: top, s: 1 };
  const body = new THREE.Group(); g.add(body);
  box(body, 2.0, 1.8, 1.25, top, 0, 3.15, 0, { round: 0.4 }); box(body, 0.9, 0.5, 0.06, 0xffffff, 0, 2.85, 0.64, { round: 0.06, noShadow: true });
  if (O.legs) for (const s of [-1, 1]) { box(g, 0.8, 2.0, 0.9, bottom, s * 0.5, 1.25, 0, { round: 0.25 }); box(g, 0.95, 0.35, 1.2, 0xf8f5fc, s * 0.5, 0.18, 0.15, { round: 0.12 }); }
  const bulb = ball(body, 0.01, 0xffffff, 0, 0, 0, { noShadow: true, mat: new THREE.MeshBasicMaterial({ color: 0xffffff }) });
  cyl(body, 0.35, 0.35, skin, 0, 4.1, 0, { seg: 14 });
  const head = new THREE.Group(); head.position.set(0, 5.05, 0); body.add(head);
  head.scale.setScalar(O.kid ? 1.15 : 1);
  box(head, 2.4, 2.1, 1.7, skin, 0, 0, 0, { round: 0.55 });
  const H = (w, h, d, x, y, z, r = 0.2) => box(head, w, h, d, hair, x, y, z, { round: r, noShadow: true });
  const st = O.hairStyle;
  if (st === 'hijab') { const sc = hexn(O.hijab || O.top); box(head, 2.75, 2.7, 1.5, sc, 0, 0.1, -0.45, { round: 0.6 }); box(head, 2.6, 0.55, 0.9, sc, 0, 1.0, 0.25, { round: 0.25, noShadow: true }); }
  else if (st !== 'bald') {
    H(2.5, 0.7, 1.8, 0, 0.95, -0.05, 0.3);
    if (st === 'long') { H(2.5, 2.6, 0.5, 0, -0.5, -0.78); for (const s of [-1, 1]) H(0.35, 1.9, 1.5, s * 1.2, -0.25, -0.05, 0.15); }
    if (st === 'short') { for (const s of [-1, 1]) H(0.3, 0.9, 1.4, s * 1.2, 0.35, -0.05, 0.12); H(2.4, 1.6, 0.4, 0, 0.2, -0.8); }
    if (st === 'bob') { H(2.6, 1.8, 0.5, 0, -0.1, -0.78); for (const s of [-1, 1]) H(0.4, 1.4, 1.5, s * 1.2, -0.1, -0.05, 0.15); }
    if (st === 'bun') { H(2.4, 1.4, 0.4, 0, 0.3, -0.8); ball(head, 0.65, hair, 0, 1.75, -0.2, { noShadow: true }); }
    if (st === 'ponytail') { H(2.4, 1.4, 0.4, 0, 0.3, -0.8); const pt = box(head, 0.55, 1.9, 0.55, hair, 0.0, -0.6, -1.2, { round: 0.25, noShadow: true }); pt.rotation.x = 0.25; }
    if (st === 'curly') { for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; ball(head, 0.62, hair, Math.cos(a) * 1.15, 0.6 + Math.sin(a) * 0.9, -0.15, { noShadow: true }); } ball(head, 0.8, hair, 0, 1.15, -0.1, { noShadow: true }); }
  }
  if (O.glasses) for (const s of [-1, 1]) { const rg = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.05, 8, 20), new THREE.MeshBasicMaterial({ color: 0x3a2f4a })); rg.position.set(s * 0.56, 0.02, 0.9); head.add(rg); }
  if (O.beard) box(head, 2.1, 0.8, 0.5, hair, 0, -0.75, 0.62, { round: 0.3, noShadow: true });
  const fc = document.createElement('canvas'); fc.width = 512; fc.height = 384; const fx = fc.getContext('2d'); const ft = new THREE.CanvasTexture(fc); ft.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.4), new THREE.MeshBasicMaterial({ map: ft })); face.position.set(0, -0.05, 0.86); head.add(face);
  const ant = ball(head, 0.01, 0xffffff, 0, 0, 0, { noShadow: true });
  const arms = [-1, 1].map(s => { const a = new THREE.Group(); a.position.set(s * 1.2, 3.75, 0.1); body.add(a); box(a, 0.5, 1.3, 0.5, top, 0, -0.55, 0, { round: 0.2 }); ball(a, 0.34, skin, 0, -1.3, 0, {}); return a; });
  return { key: 'HUMAN', cfg, g, body, head, arms, fx, ft, ant, bulb, blinkPhase: Math.random() * 6 };
}
// Ready-made variety (skin tones, hair, outfits). Use: kit.PEOPLE.map(p => kit.mkHuman(Object.assign({}, p, { parent, x })))
const PEOPLE = [
  { name: 'dalia',   skin: '#e3b88d', hair: '#2a1c14', hairStyle: 'long',     top: '#f2a0c0' },
  { name: 'amina',   skin: '#c98f64', hair: '#2a1c14', hairStyle: 'hijab',    top: '#9a6ad0', hijab: '#e8a0c8' },
  { name: 'marcus',  skin: '#7a4a2e', hair: '#17110e', hairStyle: 'short',    top: '#4880d8', beard: true },
  { name: 'lily',    skin: '#f6d2b0', hair: '#d8a040', hairStyle: 'ponytail', top: '#56c85a' },
  { name: 'sofia',   skin: '#b87850', hair: '#3a2418', hairStyle: 'curly',    top: '#f8d048', glasses: true },
  { name: 'grandpa', skin: '#e8c4a0', hair: '#d8d8e0', hairStyle: 'bald',     top: '#8a8fa0', glasses: true, beard: true },
  { name: 'kid_boy', skin: '#d9a679', hair: '#2a1c14', hairStyle: 'short',    top: '#f8d048', kid: true },
  { name: 'kid_girl',skin: '#a8714a', hair: '#17110e', hairStyle: 'bun',      top: '#ff7aa8', kid: true },
];

// ---- Cute pets and animals in the same toy look.
// mkPet('dog'|'cat'|'bunny'|'cow'|'sheep'|'chicken'|'bird'|'pig', { parent, x, y, z, ry, scale, color, spot })
const PETS = {
  dog:     { body: 0xd9a066, belly: 0xf6e2c4, ear: 0x8a5a30, len: 1.9, ears: 'floppy', tail: 'up' },
  cat:     { body: 0xf0a060, belly: 0xfff0e0, ear: 0xf0a060, len: 1.6, ears: 'point', tail: 'long' },
  bunny:   { body: 0xf4f0f8, belly: 0xffffff, ear: 0xffc8dc, len: 1.5, ears: 'long', tail: 'puff' },
  cow:     { body: 0xffffff, belly: 0xf4f0f8, ear: 0x2a2438, len: 2.6, ears: 'side', tail: 'long', spots: 0x2a2438, horns: true, snout: 0xffc0cc },
  sheep:   { body: 0xfaf6ff, belly: 0xfaf6ff, ear: 0x3a3046, len: 2.2, ears: 'side', tail: 'puff', wool: true, face: 0x3a3046 },
  chicken: { body: 0xffffff, belly: 0xffffff, ear: 0xff4a5a, len: 1.4, ears: 'comb', tail: 'puff', beak: 0xffb02e },
  bird:    { body: 0x6ab8ff, belly: 0xe8f4ff, ear: 0x6ab8ff, len: 1.0, ears: 'none', tail: 'puff', beak: 0xffb02e },
  pig:     { body: 0xffb6cc, belly: 0xffb6cc, ear: 0xff8fb0, len: 2.0, ears: 'floppy', tail: 'curl', snout: 0xff8fb0 },
};
function mkPet(kind = 'dog', o = {}) {
  const C = Object.assign({}, PETS[kind] || PETS.dog); const O = Object.assign({ x: 0, y: 0, z: 0, ry: 0, scale: 1 }, o); if (O.color) C.body = hexn(O.color);
  const g = new THREE.Group(); g.position.set(O.x, O.y, O.z); g.rotation.y = O.ry; g.scale.setScalar(O.scale); if (O.parent) O.parent.add(g);
  const L = C.len, big = kind === 'cow' || kind === 'pig' || kind === 'sheep';
  const bodyG = new THREE.Group(); g.add(bodyG);
  const bh = big ? 1.7 : 1.2, legH = big ? 1.1 : 0.6;
  if (C.wool) { for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; ball(bodyG, 0.8, C.body, Math.cos(a) * L * 0.38, legH + bh / 2 + Math.sin(a) * 0.55, (i % 3 - 1) * 0.35, {}); } }
  box(bodyG, 1.3, bh, L, C.body, 0, legH + bh / 2, 0, { round: 0.5 });
  box(bodyG, 1.0, 0.4, L * 0.7, C.belly, 0, legH + 0.25, 0, { round: 0.18, noShadow: true });
  if (C.spots) { box(bodyG, 1.34, 0.7, 0.8, C.spots, 0, legH + bh * 0.62, -L * 0.15, { round: 0.3, noShadow: true }); box(bodyG, 1.34, 0.5, 0.6, C.spots, 0, legH + bh * 0.5, L * 0.25, { round: 0.25, noShadow: true }); }
  const legs = []; for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const lg = new THREE.Group(); lg.position.set(sx * 0.45, legH, sz * (L / 2 - 0.35)); bodyG.add(lg); box(lg, 0.4, legH, 0.4, C.body === 0xffffff ? 0xf4f0f8 : C.body, 0, -legH / 2, 0, { round: 0.15 }); box(lg, 0.46, 0.18, 0.5, C.ear === 0x2a2438 ? 0x2a2438 : 0xfff0f6, 0, -legH + 0.09, 0.05, { round: 0.08, noShadow: true }); legs.push(lg); }
  const head = new THREE.Group(); head.position.set(0, legH + bh + 0.35, L / 2 + 0.2); bodyG.add(head);
  const hw = big ? 1.4 : 1.25; box(head, hw, hw * 0.9, hw, C.face || C.body, 0, 0, 0, { round: 0.45 });
  for (const s of [-1, 1]) { ball(head, 0.14, 0x1d1730, s * 0.32, 0.12, hw / 2 - 0.02, { noShadow: true }); ball(head, 0.05, 0xffffff, s * 0.32 + 0.04, 0.17, hw / 2 + 0.08, { noShadow: true, mat: new THREE.MeshBasicMaterial({ color: 0xffffff }) }); const ch = ball(head, 0.13, 0xff8fb0, s * 0.5, -0.12, hw / 2 - 0.05, { noShadow: true }); ch.scale.set(1.2, 0.6, 0.4); }
  ball(head, 0.1, 0xff6a90, 0, -0.04, hw / 2 + 0.04, { noShadow: true });
  if (C.snout) { const sn = box(head, 0.7, 0.4, 0.3, C.snout, 0, -0.25, hw / 2 + 0.05, { round: 0.15, noShadow: true }); }
  if (C.beak) { box(head, 0.3, 0.2, 0.35, C.beak, 0, -0.05, hw / 2 + 0.15, { round: 0.08, noShadow: true }); }
  for (const s of [-1, 1]) {
    if (C.ears === 'floppy') { const e = box(head, 0.4, 0.8, 0.25, C.ear, s * (hw / 2 + 0.05), 0.1, -0.05, { round: 0.12 }); e.rotation.z = s * 0.25; }
    if (C.ears === 'point') { const e = box(head, 0.4, 0.5, 0.2, C.ear, s * 0.4, hw * 0.55, -0.05, { round: 0.1 }); e.rotation.z = s * -0.25; }
    if (C.ears === 'long') { const e = box(head, 0.3, 1.2, 0.18, C.ear, s * 0.3, hw * 0.55 + 0.5, -0.05, { round: 0.14 }); e.rotation.z = s * -0.12; }
    if (C.ears === 'side') { const e = box(head, 0.6, 0.28, 0.25, C.ear, s * (hw / 2 + 0.2), 0.2, -0.05, { round: 0.12 }); e.rotation.z = s * 0.3; }
  }
  if (C.horns) for (const s of [-1, 1]) { const h = cyl(head, 0.1, 0.4, 0xf4e4c0, s * 0.45, hw * 0.55 + 0.15, 0, { seg: 8, r2: 0.04 }); h.rotation.z = s * -0.4; }
  if (C.ears === 'comb') box(head, 0.25, 0.35, 0.5, C.ear, 0, hw * 0.55, 0, { round: 0.1, noShadow: true });
  let tail = new THREE.Group(); tail.position.set(0, legH + bh * 0.75, -L / 2); bodyG.add(tail);
  if (C.tail === 'puff') ball(tail, 0.28, C.kind === 'bird' ? C.body : 0xffffff, 0, 0, -0.1, { noShadow: true }); else box(tail, 0.2, 0.2, 0.9, C.body, 0, 0.1, -0.4, { round: 0.1, noShadow: true });
  if (C.tail === 'up') tail.rotation.x = 0.8; if (C.tail === 'curl') ball(tail, 0.18, C.ear, 0, 0.1, -0.2, { noShadow: true });
  if (kind === 'bird') { for (const s of [-1, 1]) { const w = box(bodyG, 0.12, 0.7, 0.9, 0x4a98e8, s * 0.75, legH + 0.7, 0, { round: 0.1, noShadow: true }); w.rotation.z = s * 0.2; } }
  return { kind, g, bodyG, head, tail, legs, hw, blinkPhase: Math.random() * 6 };
}
function animatePet(p, t, st = {}) { const sp = st.walk ? 8 : 2; p.bodyG.position.y = Math.abs(Math.sin(t * sp)) * (st.walk ? 0.12 : 0.03); p.head.rotation.z = Math.sin(t * 1.3 + p.blinkPhase) * 0.06; p.head.rotation.x = st.sniff ? 0.35 + Math.sin(t * 6) * 0.08 : 0; p.tail.rotation.y = Math.sin(t * (st.happy ? 14 : 4)) * 0.5; p.legs.forEach((l, i) => { l.rotation.x = st.walk ? Math.sin(t * 8 + (i % 3 === 0 ? 0 : Math.PI)) * 0.5 : 0; }); }

// ---- Props in the same toy look. mkProp(name, { parent, x, y, z, ry, scale, color, text })
// names: tree, bush, flower, bench, table, chair, sofa, bed, mug, laptop, phone, books, balloon, gift, cake, lamp, ball, heart, star, sign, house, car, cloud, sun, bone, fish, door, window, mailbox, fence
const PROPS = {
  tree(g, o) { cyl(g, 0.5, 3, 0x9a6a3e, 0, 1.5, 0, { seg: 10 }); for (const [x, y, z, r] of [[0, 4, 0, 1.9], [-1.2, 3.4, 0.3, 1.3], [1.2, 3.5, -0.2, 1.4], [0.2, 5.2, 0.1, 1.2]]) ball(g, r, hexn(o.color || '#5cc07a'), x, y, z, {}); },
  bush(g, o) { for (const [x, r] of [[-0.8, 0.8], [0, 1.05], [0.8, 0.8]]) ball(g, r, hexn(o.color || '#58b878'), x, r * 0.8, 0, {}); },
  flower(g, o) { cyl(g, 0.06, 1.1, 0x4faf7a, 0, 0.55, 0, { seg: 6 }); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; ball(g, 0.2, hexn(o.color || '#ff8fc8'), Math.cos(a) * 0.3, 1.15 + Math.sin(a) * 0.3, 0, { noShadow: true }); } ball(g, 0.18, 0xffe14a, 0, 1.15, 0.05, { noShadow: true }); },
  bench(g, o) { box(g, 3, 0.25, 1, 0xc8905a, 0, 1, 0, { round: 0.08 }); box(g, 3, 0.9, 0.2, 0xb88050, 0, 1.6, -0.4, { round: 0.08 }); for (const s of [-1, 1]) box(g, 0.2, 1, 0.8, 0x8a5a38, s * 1.3, 0.5, 0, { round: 0.05 }); },
  table(g, o) { box(g, 3.2, 0.3, 2, hexn(o.color || '#e8b878'), 0, 2, 0, { round: 0.1 }); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.25, 2, 0.25, 0xb88050, sx * 1.4, 1, sz * 0.8, { round: 0.05 }); },
  chair(g, o) { box(g, 1.2, 0.2, 1.2, hexn(o.color || '#f2a0c0'), 0, 1.2, 0, { round: 0.08 }); box(g, 1.2, 1.3, 0.2, hexn(o.color || '#f2a0c0'), 0, 1.9, -0.5, { round: 0.08 }); for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.14, 1.2, 0.14, 0xb88050, sx * 0.5, 0.6, sz * 0.5, { round: 0.03 }); },
  sofa(g, o) { const c = hexn(o.color || '#9a86d6'); box(g, 4, 1, 1.8, c, 0, 0.8, 0, { round: 0.3 }); box(g, 4, 1.4, 0.5, c, 0, 1.6, -0.7, { round: 0.25 }); for (const s of [-1, 1]) box(g, 0.5, 1.4, 1.8, c, s * 1.9, 1.1, 0, { round: 0.2 }); },
  bed(g, o) { box(g, 3.2, 0.7, 4.4, 0xc8905a, 0, 0.5, 0, { round: 0.1 }); box(g, 3, 0.5, 4, 0xffffff, 0, 1, 0.1, { round: 0.2 }); box(g, 3, 0.55, 2.8, hexn(o.color || '#ff9ac8'), 0, 1.2, 0.7, { round: 0.2 }); box(g, 1.2, 0.35, 0.8, 0xffffff, 0, 1.4, -1.5, { round: 0.15 }); },
  mug(g, o) { cyl(g, 0.4, 0.7, hexn(o.color || '#ffffff'), 0, 0.35, 0, { seg: 16 }); const h = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.06, 8, 14), mat(0xffffff)); h.position.set(0.45, 0.35, 0); g.add(h); },
  laptop(g, o) { box(g, 1.6, 0.1, 1.1, 0xd8d0e8, 0, 0.05, 0, { round: 0.04 }); const sc = box(g, 1.6, 1.0, 0.08, 0xd8d0e8, 0, 0.6, -0.5, { round: 0.04 }); sc.rotation.x = -0.15; box(g, 1.4, 0.85, 0.02, 0x2a2147, 0, 0.62, -0.45, { noShadow: true }); },
  phone(g, o) { box(g, 0.5, 0.9, 0.08, 0x2a2438, 0, 0.45, 0, { round: 0.08 }); box(g, 0.42, 0.78, 0.02, hexn(o.color || '#8fd8ff'), 0, 0.45, 0.05, { noShadow: true }); },
  books(g, o) { [0xff8fb0, 0x6ab8ff, 0xffd34a].forEach((c, i) => box(g, 1.4 - i * 0.1, 0.25, 1, c, i * 0.05, 0.13 + i * 0.26, 0, { round: 0.05 })); },
  balloon(g, o) { const b = ball(g, 0.7, hexn(o.color || '#ff6a9a'), 0, 3, 0, {}); b.scale.y = 1.2; ball(g, 0.18, 0xffffff, -0.25, 3.35, 0.55, { noShadow: true }); cyl(g, 0.02, 2.2, 0xdddddd, 0, 1.2, 0, { seg: 4, noShadow: true }); },
  gift(g, o) { const c = hexn(o.color || '#ff8fb0'); box(g, 1.2, 1, 1.2, c, 0, 0.5, 0, { round: 0.05 }); box(g, 1.25, 1.05, 0.2, 0xffe14a, 0, 0.5, 0, { noShadow: true }); box(g, 0.2, 1.05, 1.25, 0xffe14a, 0, 0.5, 0, { noShadow: true }); ball(g, 0.25, 0xffe14a, 0, 1.15, 0, { noShadow: true }); },
  cake(g, o) { cyl(g, 1.1, 0.8, 0xfff0e0, 0, 0.4, 0, { seg: 24 }); cyl(g, 0.8, 0.6, hexn(o.color || '#ffb6d0'), 0, 1.1, 0, { seg: 24 }); for (const x of [-0.3, 0, 0.3]) { cyl(g, 0.04, 0.4, 0xffe14a, x, 1.6, 0, { seg: 6, noShadow: true }); ball(g, 0.07, 0xff9a30, x, 1.85, 0, { noShadow: true }); } },
  lamp(g, o) { cyl(g, 0.5, 0.15, 0xb8a8d8, 0, 0.08, 0, { seg: 16 }); cyl(g, 0.06, 3, 0xb8a8d8, 0, 1.6, 0, { seg: 8 }); cyl(g, 0.8, 0.8, 0xffe8a8, 0, 3.3, 0, { seg: 16, r2: 0.4 }); },
  ball(g, o) { ball(g, 0.6, hexn(o.color || '#ff6a6a'), 0, 0.6, 0, {}); const st = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.05, 6, 24), mat(0xffffff)); st.position.y = 0.6; g.add(st); },
  heart(g, o) { const c = hexn(o.color || '#ff4a7a'); for (const s of [-1, 1]) { const l = box(g, 0.5, 1.0, 0.4, c, s * 0.28, 1.1, 0, { round: 0.2, noShadow: true }); l.rotation.z = s * -0.6; } },
  star(g, o) { const c = hexn(o.color || '#ffe14a'); for (let i = 0; i < 5; i++) { const b = box(g, 0.45, 1.3, 0.35, c, 0, 0, 0, { round: 0.15, noShadow: true }); b.rotation.z = i * 1.2566; b.position.set(Math.sin(i * 1.2566) * 0.5, 1 + Math.cos(i * 1.2566) * 0.5, 0); } },
  sign(g, o) { cyl(g, 0.08, 2.2, 0x9a6a3e, 0, 1.1, 0, { seg: 8 }); box(g, 2.6, 1.3, 0.15, 0xfff4d8, 0, 2.6, 0, { round: 0.1 }); textPlane(g, o.text || 'HELLO', 2.4, 1.1, null, '#5a3a8a', 'bold 150px Liberation Sans, sans-serif', 0, 2.6, 0.1); },
  house(g, o) { box(g, 4, 2.6, 3, hexn(o.color || '#ffd6e4'), 0, 1.3, 0, { round: 0.15 }); const r = box(g, 4.6, 0.5, 3.6, 0xc87878, 0, 3, 0, { round: 0.1 }); box(g, 3.6, 0.5, 3.2, 0xc87878, 0, 3.4, 0, { round: 0.1 }); box(g, 0.9, 1.6, 0.1, 0xb88050, 0.5, 0.8, 1.55, { round: 0.05 }); box(g, 0.9, 0.9, 0.1, 0x9ae0f0, -1.1, 1.6, 1.55, { round: 0.05, noShadow: true }); },
  car(g, o) { const c = hexn(o.color || '#ff8fb0'); box(g, 3.6, 0.9, 1.7, c, 0, 0.9, 0, { round: 0.3 }); box(g, 2, 0.8, 1.5, c, -0.2, 1.7, 0, { round: 0.3 }); box(g, 1.7, 0.55, 1.52, 0x9ae0f0, -0.2, 1.7, 0, { round: 0.2, noShadow: true }); for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const w = cyl(g, 0.4, 0.3, 0x2a2438, sx * 1.2, 0.45, sz * 0.8, { seg: 14 }); w.rotation.x = Math.PI / 2; } },
  cloud(g, o) { for (const [x, y, r] of [[-1, 0, 0.8], [0, 0.3, 1.1], [1.1, 0, 0.8], [0.3, -0.2, 0.9]]) ball(g, r, 0xffffff, x, y, 0, { noShadow: true }); },
  sun(g, o) { ball(g, 1.2, 0xffd870, 0, 0, 0, { noShadow: true, mat: new THREE.MeshBasicMaterial({ color: 0xffd870 }) }); for (let i = 0; i < 8; i++) { const r = box(g, 0.25, 0.6, 0.1, 0xffd870, 0, 0, 0, { noShadow: true, mat: new THREE.MeshBasicMaterial({ color: 0xffd870 }) }); r.position.set(Math.cos(i * 0.785) * 1.8, Math.sin(i * 0.785) * 1.8, 0); r.rotation.z = i * 0.785 - 1.57; } },
  bone(g, o) { box(g, 1.2, 0.25, 0.25, 0xfff4e0, 0, 0.2, 0, { round: 0.1 }); for (const [x, z] of [[-0.6, 0.1], [-0.6, -0.1], [0.6, 0.1], [0.6, -0.1]]) ball(g, 0.16, 0xfff4e0, x, 0.2, z, { noShadow: true }); },
  fish(g, o) { const b = ball(g, 0.5, hexn(o.color || '#ff9a4a'), 0, 0.5, 0, {}); b.scale.x = 1.5; box(g, 0.1, 0.6, 0.5, hexn(o.color || '#ff9a4a'), -0.9, 0.5, 0, { noShadow: true }); ball(g, 0.08, 0x1d1730, 0.45, 0.62, 0.35, { noShadow: true }); },
  door(g, o) { box(g, 1.8, 3.2, 0.2, hexn(o.color || '#c8905a'), 0, 1.6, 0, { round: 0.06 }); ball(g, 0.1, 0xffe14a, 0.6, 1.5, 0.15, { noShadow: true }); },
  window(g, o) { box(g, 2.2, 2.2, 0.2, 0xffffff, 0, 2, 0, { round: 0.05 }); box(g, 1.9, 1.9, 0.1, 0xaee4ff, 0, 2, 0.08, { noShadow: true }); box(g, 0.1, 1.9, 0.12, 0xffffff, 0, 2, 0.1, { noShadow: true }); box(g, 1.9, 0.1, 0.12, 0xffffff, 0, 2, 0.1, { noShadow: true }); },
  mailbox(g, o) { cyl(g, 0.08, 2, 0x9a6a3e, 0, 1, 0, { seg: 8 }); box(g, 1, 0.8, 1.2, hexn(o.color || '#6ab8ff'), 0, 2.2, 0, { round: 0.3 }); box(g, 0.1, 0.5, 0.1, 0xff4a5a, 0.55, 2.5, 0, { noShadow: true }); },
  fence(g, o) { for (let i = 0; i < 5; i++) box(g, 0.35, 1.5, 0.15, 0xffffff, (i - 2) * 0.6, 0.75, 0, { round: 0.06 }); box(g, 3, 0.2, 0.12, 0xf4eef8, 0, 1.1, 0.08, { noShadow: true }); box(g, 3, 0.2, 0.12, 0xf4eef8, 0, 0.45, 0.08, { noShadow: true }); },
};
function mkProp(name, o = {}) { const O = Object.assign({ x: 0, y: 0, z: 0, ry: 0, scale: 1 }, o); const g = new THREE.Group(); g.position.set(O.x, O.y, O.z); g.rotation.y = O.ry; g.scale.setScalar(O.scale); if (O.parent) O.parent.add(g); (PROPS[name] || PROPS.ball)(g, O); return g; }

return { PEOPLE, mkHuman, PETS, mkPet, animatePet, PROPS, mkProp, POOL, mkBot, drawFace, animateBot, mat, box, cyl, ball, textPlane, lerp, clamp, smooth, seg };
}
