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
  if (human) { x.fillStyle = '#e3b88d'; x.fillRect(0, 0, Wc, Hc); } else { const g = x.createLinearGradient(0, 0, 0, Hc); g.addColorStop(0, '#2a2147'); g.addColorStop(1, '#171229'); x.fillStyle = g; x.fillRect(0, 0, Wc, Hc);
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
      if (kind === 'lid') { rr(x, cx - ew / 2, cy - h / 2, ew, h, 26); x.fill(); x.shadowBlur = 0; x.fillStyle = human ? '#e3b88d' : '#1d1730'; x.fillRect(cx - ew, cy - h / 2 - 2, ew * 2, h * 0.42); }
      else if (kind === 'halflid') { rr(x, cx - ew / 2, cy - h / 2, ew, h, 26); x.fill(); x.shadowBlur = 0; x.fillStyle = human ? '#e3b88d' : '#1d1730'; x.beginPath(); x.moveTo(cx - ew, cy - h / 2 - 2); x.lineTo(cx + ew, cy - h / 2 - 2); x.lineTo(cx + ew, cy - h * (i ? 0.02 : 0.2)); x.lineTo(cx - ew, cy - h * (i ? 0.2 : 0.02)); x.fill(); }
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

return { POOL, mkBot, drawFace, animateBot, mat, box, cyl, ball, textPlane, lerp, clamp, smooth, seg };
}
