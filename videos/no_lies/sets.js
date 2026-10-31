// Sets for "What if nobody lied?" Soft pastel toy world made of rounded boxes (same look as the robots).
export function buildSets(THREE, kit, scene, RBG) {
  const { textPlane, mat } = kit;
  const geoCache = {};
  const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const rnd = mulberry(11);
  const pick = a => a[Math.floor(rnd() * a.length)];
  function B(g, w, h, d, c, x = 0, y = 0, z = 0, o = {}) {
    const key = [w, h, d, o.round || 0].join('_');
    const geo = geoCache[key] || (geoCache[key] = o.round ? new RBG(w, h, d, 3, Math.min(o.round, Math.min(w, h, d) / 2.05)) : new THREE.BoxGeometry(w, h, d));
    const m = new THREE.Mesh(geo, o.mat || mat(c, o.m)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true;
    if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; g.add(m); return m;
  }
  function C(g, r, h, c, x = 0, y = 0, z = 0, o = {}) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(o.r2 ?? r, r, h, o.seg || 20), o.mat || mat(c, o.m)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; g.add(m); return m;
  }
  function S(g, r, c, x = 0, y = 0, z = 0, o = {}) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), o.mat || mat(c, o.m)); m.position.set(x, y, z); m.scale.set(o.sx || 1, o.sy || 1, o.sz || 1); m.castShadow = o.cast !== false; m.receiveShadow = true; g.add(m); return m;
  }
  const grp = () => { const g = new THREE.Group(); g.visible = false; scene.add(g); return g; };
  const basic = c => new THREE.MeshBasicMaterial({ color: c });
  const glow = (c, i) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: 0.5 });
  const sets = {};
  const winMat = new THREE.MeshStandardMaterial({ color: 0xfff6dc, emissive: 0xffd88a, emissiveIntensity: 0.1, roughness: 0.4 });
  const PASTEL = [0xffd6e0, 0xfff1b8, 0xcfe8ff, 0xe2d4ff, 0xd4f5e0, 0xffe0c2];
  const ROOFS = [0xff9fb8, 0xffc48a, 0x9ec8ff, 0xc3a8f5, 0x8fdcae, 0xffb0a0];

  // ------------------------------------------------------------------ TOWN
  const town = grp(); sets.town = { g: town };
  {
    const g = town;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(320, 240), mat(0xcfeedd, { roughness: 0.9 })); ground.rotation.x = -Math.PI / 2; ground.position.z = -40; ground.receiveShadow = true; g.add(ground);
    B(g, 320, 0.12, 9.5, 0xdcd6ee, 0, 0.06, 8.5, { cast: false });                 // road
    B(g, 320, 0.2, 3.2, 0xf4eefb, 0, 0.1, 2.4, { cast: false }); B(g, 320, 0.2, 3.6, 0xf4eefb, 0, 0.1, 15, { cast: false });  // sidewalks
    for (let x = -150; x < 150; x += 8) B(g, 3.2, 0.14, 0.45, 0xfff6ee, x, 0.14, 8.5, { cast: false });  // road dashes
    function house(x, z, w, h, d, wall, roof, nice) {
      B(g, w, h, d, wall, x, h / 2, z, { round: nice ? 0.6 : 0 });
      const hh = h * 0.42, rg = new THREE.Group(); rg.position.set(x, h + hh / 2 - 0.2, z); rg.scale.set(1, 1, d / w); g.add(rg);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(w * 0.84, hh, 4), mat(roof)); cone.rotation.y = Math.PI / 4; cone.castShadow = true; cone.receiveShadow = true; rg.add(cone);
      if (!nice) return;
      B(g, 2.2, 3.6, 0.3, 0xffffff, x - w * 0.18, 1.8, z + d / 2 + 0.05, { round: 0.1, cast: false }); B(g, 1.8, 3.2, 0.3, pick(ROOFS), x - w * 0.18, 1.6, z + d / 2 + 0.2, { round: 0.15, cast: false });
      S(g, 0.16, 0xfff1b8, x - w * 0.18 + 0.55, 1.6, z + d / 2 + 0.45, { cast: false });
      for (const wx of [w * 0.22, -w * 0.38]) if (wx !== 0) { B(g, 2.6, 2.6, 0.2, 0xffffff, x + wx, h * 0.55, z + d / 2 + 0.05, { round: 0.1, cast: false }); B(g, 2.1, 2.1, 0.3, 0, x + wx, h * 0.55, z + d / 2 + 0.12, { mat: winMat, cast: false }); }
      B(g, 1.1, 2.2, 1.1, 0xffffff, x + w * 0.3, h + hh * 0.5, z - d * 0.2, { cast: false });
    }
    for (let i = -7; i <= 7; i++) { const w = 9 + rnd() * 4, h = 8 + rnd() * 5; house(i * 14.5 + (rnd() - 0.5) * 2, -7, w, h, 8, pick(PASTEL), pick(ROOFS), true); }
    for (let i = -8; i <= 8; i++) house(i * 17, -24, 12 + rnd() * 3, 11 + rnd() * 7, 10, pick(PASTEL), pick(ROOFS), false);
    for (const [x, s, c] of [[-90, 1.7, 0xb8e6c8], [-30, 1.4, 0xc6ecd6], [40, 1.9, 0xbfe3d0], [100, 1.6, 0xb6e2cc]]) S(g, 30, c, x, -8, -70, { sx: s, sy: 0.75, cast: false });
    function tree(x, z, s = 1, c = 0xa8e0b0) { C(g, 0.6 * s, 3 * s, 0xc9a27a, x, 1.5 * s, z, { seg: 10 }); S(g, 2.7 * s, c, x, 5 * s, z, { sy: 0.92 }); S(g, 1.9 * s, 0xb6ebbf, x + 1.7 * s, 4.1 * s, z + 0.7 * s); S(g, 1.8 * s, c, x - 1.7 * s, 4.3 * s, z - 0.3 * s); }
    for (let x = -120; x <= 120; x += 21) { if (Math.abs(x) < 12) continue; tree(x + 2, 1.4, 1 + rnd() * 0.3, pick([0xa8e0b0, 0xb5e8a8, 0x9fdcc0])); }
    function lamp(x, z) { C(g, 0.18, 7, 0x9a90b8, x, 3.5, z, { seg: 8 }); S(g, 0.7, 0xfff2c8, x, 7.3, z, { mat: basic(0xfff2c8), cast: false }); }
    for (let x = -120; x <= 120; x += 21) if (Math.abs(x + 10) > 16) lamp(x + 10, 13.8);
    for (let x = -120; x <= 120; x += 9) { if (rnd() < 0.5) { S(g, 1.1 + rnd() * 0.5, pick([0xffd1e8, 0xfff1a8, 0xd9c8ff, 0xbfe9d0]), x, 0.9, 16.5, { sy: 0.8, cast: false }); } }
    // clouds
    const clouds = []; for (let i = 0; i < 9; i++) { const cg = new THREE.Group(); const cm = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.3, roughness: 1 });
      for (let j = 0; j < 4; j++) S(cg, 3.4 - j * 0.3, 0xffffff, (j - 1.5) * 3.2, (j % 2) * 0.7, 0, { mat: cm, sy: 0.75, cast: false }); cg.position.set(-100 + i * 26, 38 + (i % 3) * 7, -50 - (i % 2) * 15); g.add(cg); clouds.push(cg); }
    sets.town.upd = t => { clouds.forEach((c, i) => { c.position.x = ((-110 + i * 26 + t * 0.8 + 120) % 240) - 120; }); };
    sets.town.winMat = winMat;
  }
  // sign "HONEST TOWN"
  const sign = grp(); sets.sign = { g: sign };
  { const g = sign;
    for (const s of [-3.6, 3.6]) B(g, 0.9, 8.2, 0.9, 0xffffff, s, 4.1, 0, { round: 0.3 });
    B(g, 10.6, 6.4, 0.9, 0xffb3d1, 0, 11.3, 0, { round: 0.7 }); B(g, 9.6, 5.4, 0.2, 0xfff6ee, 0, 11.3, 0.5, { round: 0.5, cast: false });
    textPlane(g, 'HONEST', 8.4, 2.6, null, '#ff6fae', 'bold 112px Liberation Sans, sans-serif', 0, 12.5, 0.66);
    textPlane(g, 'TOWN', 8.4, 2.6, null, '#3d7bf0', 'bold 122px Liberation Sans, sans-serif', -0.7, 10.1, 0.66);
    S(g, 0.55, 0xff6fae, 3.1, 9.9, 0.66, { sz: 0.25, mat: basic(0xff6fae), cast: false });
    for (let i = 0; i < 5; i++) B(g, 0.9, 0.9, 0.2, [0xffd1e8, 0xfff1a8, 0xbfe9d0, 0xcfe8ff, 0xe2d4ff][i], -4.2 + i * 2.1, 14.8 + (i % 2) * 0.2, 0.1, { round: 0.2, rz: 0.3 * (i % 2 ? 1 : -1), cast: false });
    sign.scale.setScalar(0.82);
  }
  // election stage
  const stage = grp(); sets.stage = { g: stage };
  { const g = stage;
    B(g, 24, 1.6, 9, 0xffc2dc, 0, 0.8, -1, { round: 0.5 }); B(g, 25, 0.4, 9.6, 0xffffff, 0, 1.7, -1, { round: 0.2 });
    B(g, 3.4, 3.4, 1.8, 0xcfe8ff, 0, 3.6, 0.6, { round: 0.4 }); B(g, 3.8, 0.4, 2.2, 0xffffff, 0, 5.4, 0.6, { round: 0.2 });
    C(g, 0.09, 1.4, 0x8f96b0, 0, 6.2, 0.7, { seg: 8 }); S(g, 0.3, 0x8f96b0, 0, 7.0, 0.7);
    B(g, 14, 5.2, 0.5, 0xfff6ee, 0, 11.5, -4.4, { round: 0.4 });
    textPlane(g, 'VOTE', 12, 3.4, null, '#ff6fae', 'bold 175px Liberation Sans, sans-serif', 0, 12.2, -4.1);
    textPlane(g, 'FOR THE TRUTH', 12, 1.2, null, '#3d7bf0', 'bold 58px Liberation Sans, sans-serif', 0, 9.9, -4.1);
    for (const s of [-1, 1]) B(g, 0.6, 7.5, 0.6, 0xffffff, s * 7.6, 5.7, -4.4, { round: 0.2 });
    for (let i = 0; i < 17; i++) { const u = i / 16, x = -13 + u * 26, y = 15.5 - Math.sin(u * Math.PI) * 2.6; B(g, 1, 1.3, 0.12, [0xff9fb8, 0xfff1a8, 0x9ec8ff, 0xb5e8a8][i % 4], x, y, -3.6, { rz: Math.PI / 4, round: 0.05, cast: false }); }
  }
  // confetti (used by party + vote)
  function makeConfetti(n, seed) {
    const r = mulberry(seed), g = grp(); const ps = [];
    for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.2), new THREE.MeshBasicMaterial({ color: pick([0xff6fae, 0xffd23f, 0x4a8bff, 0x2fd6d6, 0x56c85a, 0xa07af0]) })); m.visible = false; g.add(m);
      ps.push({ m, vx: (r() - 0.5) * 22, vy: 14 + r() * 14, vz: (r() - 0.2) * 12, sp: (r() - 0.5) * 14, ph: r() * 6, dl: r() * 0.25 }); }
    return { g, upd(tau, ox, oy, oz) { g.visible = tau > 0; ps.forEach(p => { const s = tau - p.dl; if (s < 0) { p.m.visible = false; return; } const y = oy + p.vy * s - 9 * s * s; p.m.visible = true;
      p.m.position.set(ox + p.vx * s + Math.sin(s * 3 + p.ph) * 0.8, Math.max(0.12, y), oz + p.vz * s); const spin = y > 0.15 ? s * p.sp : 0.4; p.m.rotation.set(spin, spin * 0.7 + p.ph, spin * 0.5); }); } };
  }
  sets.confP = makeConfetti(90, 3); sets.confV = makeConfetti(110, 9);

  // ------------------------------------------------------------------ PARTY ROOM
  const party = grp(); sets.party = { g: party };
  { const g = party;
    B(g, 90, 0.5, 60, 0xfdf0dc, 0, -0.25, 6, { cast: false });
    const rug = C(g, 12.5, 0.12, 0xffd1e0, 0, 0.04, 3, { seg: 40, cast: false }); C(g, 9, 0.14, 0xfff6ee, 0, 0.06, 3, { seg: 40, cast: false });
    B(g, 90, 26, 1, 0xfff0b8, 0, 13, -9, { cast: false }); B(g, 90, 6.5, 1.3, 0xffc9a3, 0, 3.25, -8.8, { cast: false }); B(g, 90, 0.5, 1.5, 0xffffff, 0, 6.6, -8.6, { cast: false });
    B(g, 1, 26, 60, 0xfff0b8, -28, 13, 6, { cast: false }); B(g, 1, 26, 60, 0xfff0b8, 28, 13, 6, { cast: false });
    B(g, 10.4, 10.4, 0.6, 0xffffff, -13, 13, -8.4, { round: 0.3 }); B(g, 9.2, 9.2, 0.4, 0, -13, 13, -8.1, { mat: basic(0xc2e3ff), cast: false });
    S(g, 1.5, 0xffffff, -15, 14, -7.9, { mat: basic(0xffffff), sy: 0.6, cast: false }); S(g, 1.2, 0xffffff, -13.2, 13.7, -7.9, { mat: basic(0xffffff), sy: 0.6, cast: false });
    B(g, 0.4, 9.2, 0.45, 0xffffff, -13, 13, -8, { cast: false }); B(g, 9.2, 0.4, 0.45, 0xffffff, -13, 13, -8, { cast: false });
    B(g, 8, 7, 0.5, 0xffffff, 13, 13, -8.4, { round: 0.3 }); B(g, 7, 6, 0.3, 0xfff1b8, 13, 13, -8.1, { round: 0.2, cast: false }); S(g, 1.3, 0xff9fb8, 13, 13, -7.9, { sz: 0.2, cast: false });
    B(g, 14.5, 3.2, 0.3, 0xffb3d1, 0, 19.8, -8.3, { round: 0.5, cast: false });
    textPlane(g, 'HAPPY BIRTHDAY', 14, 2.6, null, '#ffffff', 'bold 58px Liberation Sans, sans-serif', 0, 19.8, -8.1);
    for (let i = 0; i < 15; i++) { const u = i / 14, x = -22 + u * 44, y = 23.2 - Math.sin(u * Math.PI) * 3.2; B(g, 1.3, 1.7, 0.12, [0xff9fb8, 0xfff1a8, 0x9ec8ff, 0xb5e8a8, 0xc3a8f5][i % 5], x, y, -8.2, { rz: Math.PI / 4, round: 0.05, cast: false }); }
    // table + cake
    C(g, 5.2, 0.5, 0xffffff, 0, 3.2, 3, { seg: 40 }); C(g, 5.4, 0.28, 0xcfe8ff, 0, 3.0, 3, { seg: 40 }); C(g, 0.9, 3, 0xe8e0f8, 0, 1.5, 3); C(g, 2.4, 0.3, 0xe8e0f8, 0, 0.15, 3);
    C(g, 2.6, 0.28, 0xffffff, 0, 3.55, 3); C(g, 1.9, 1.3, 0xffb3d1, 0, 4.3, 3, { seg: 32 }); C(g, 2.0, 0.22, 0xffffff, 0, 4.95, 3, { seg: 32 }); C(g, 1.3, 1.0, 0xfff4e0, 0, 5.55, 3, { seg: 32 }); C(g, 1.4, 0.2, 0xffb3d1, 0, 6.1, 3, { seg: 32 });
    for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; S(g, 0.16, 0xffffff, Math.cos(a) * 1.9, 4.95, 3 + Math.sin(a) * 1.9, { cast: false }); }
    S(g, 0.28, 0xe83a4a, 0, 6.4, 3); const flames = [];
    for (const [cx, cz, c] of [[-0.6, 0.2, 0x4a8bff], [0.6, -0.1, 0xffd23f], [0, -0.55, 0x56c85a]]) { C(g, 0.09, 0.75, c, cx, 6.5, 3 + cz, { seg: 8, cast: false }); const f = S(g, 0.15, 0xffb02e, cx, 7.0, 3 + cz, { mat: basic(0xffcf5a), sy: 1.5, cast: false }); flames.push(f); }
    for (const [x, z, c] of [[-4.2, 6.8, 0xffd1e8], [4.2, 7.3, 0xbfe9d0]]) { C(g, 0.9, 0.12, 0xffffff, x, 3.52, z); S(g, 0.3, c, x + 0.2, 3.8, z, { cast: false }); }
    // gifts + balloons
    for (const [x, z, c, s, rb] of [[-14, 8, 0x9ec8ff, 3, 0xff6fae], [-17.5, 5, 0xffd6a5, 2.4, 0x4a8bff], [15, 9, 0xd4f5e0, 3.2, 0xffb02e], [18, 5, 0xe2d4ff, 2.2, 0x2fd6d6]]) { B(g, s, s, s, c, x, s / 2, z, { round: 0.2 }); B(g, s + 0.1, s + 0.1, 0.4, rb, x, s / 2, z, { cast: false }); B(g, 0.4, s + 0.1, s + 0.1, rb, x, s / 2, z, { cast: false }); S(g, 0.5, rb, x, s + 0.3, z, { sy: 0.7, cast: false }); }
    const balloons = [];
    for (const [bx, bz] of [[-22, -1], [22, -1], [-23, 8], [23, 8]]) for (let i = 0; i < 4; i++) { const bg = new THREE.Group(); bg.position.set(bx + (i - 1.5) * 1.6, 0, bz + (i % 2) * 1.4); const h = 13 + (i % 3) * 2.4;
      C(bg, 0.025, h, 0xffffff, 0, h / 2, 0, { seg: 4, cast: false }); S(bg, 1.5, [0xff9fb8, 0xfff1a8, 0x9ec8ff, 0xb5e8a8][(i + (bx > 0 ? 1 : 0)) % 4], 0, h + 1.5, 0, { sy: 1.2, m: { roughness: 0.25 } }); g.add(bg); balloons.push(bg); }
    sets.party.upd = (t, cue) => { flames.forEach((f, i) => { f.scale.set(1 + Math.sin(t * 17 + i) * 0.1, 1.5 + Math.sin(t * 23 + i * 2) * 0.25, 1); f.visible = !(cue && t > cue); });
      balloons.forEach((b, i) => { b.rotation.z = Math.sin(t * 1.3 + i) * 0.05; b.rotation.x = Math.cos(t * 1.1 + i * 2) * 0.04; }); };
  }

  // ------------------------------------------------------------------ SHOP
  const shop = grp(); sets.shop = { g: shop };
  { const g = shop;
    for (let i = -8; i < 8; i++) for (let j = -3; j < 7; j++) B(g, 4.8, 0.3, 4.8, (i + j) % 2 ? 0xfff4e6 : 0xf3dfc9, i * 4.8 + 2.4, -0.15, j * 4.8 + 2.4, { cast: false });
    B(g, 90, 26, 1, 0xd6f2e4, 0, 13, -9, { cast: false }); B(g, 90, 6, 1.3, 0xb5e6d0, 0, 3, -8.8, { cast: false });
    B(g, 1, 26, 60, 0xd6f2e4, -28, 13, 6, { cast: false }); B(g, 1, 26, 60, 0xd6f2e4, 28, 13, 6, { cast: false });
    for (const y of [8, 12.4, 16.8]) { B(g, 34, 0.5, 2.4, 0xffffff, 0, y, -7.5, { round: 0.15 }); for (let i = 0; i < 10; i++) { const x = -15 + i * 3.35 + rnd() * 0.8, k = Math.floor(rnd() * 3), c = pick(PASTEL.concat(ROOFS)); if (k === 0) B(g, 1.6 + rnd(), 1.5 + rnd() * 1.2, 1.4, c, x, y + 1.3, -7.5, { round: 0.25, cast: false }); else if (k === 1) S(g, 1 + rnd() * 0.4, c, x, y + 1.4, -7.5, { cast: false }); else C(g, 0.8, 2 + rnd(), c, x, y + 1.6, -7.5, { cast: false }); } }
    B(g, 13, 3.4, 0.4, 0xffb3d1, 0, 21.5, -8.2, { round: 0.6, cast: false }); textPlane(g, 'ROBO SHOP', 12, 2.6, null, '#ffffff', 'bold 78px Liberation Sans, sans-serif', 0, 21.5, -7.95);
    // counter (front face toward camera)
    B(g, 28, 3.4, 3.4, 0xcdb8f0, 0, 1.7, 0.4, { round: 0.5 }); B(g, 29, 0.5, 4.2, 0xfff6ee, 0, 3.5, 0.4, { round: 0.2 });
    for (let i = -5; i <= 5; i++) B(g, 1.7, 2.2, 0.2, 0xb59fe8, i * 2.4, 1.7, 2.15, { round: 0.1, cast: false });
    // register + bell
    B(g, 2.6, 1.8, 2, 0xd4f5e0, 9, 4.7, 0.3, { round: 0.3 }); B(g, 1.9, 1.1, 0.12, 0x1d1730, 9, 5.1, 1.34, { cast: false }); textPlane(g, '$$', 1.4, 0.7, null, '#bff7f2', 'bold 90px Liberation Sans, sans-serif', 9, 5.1, 1.41);
    C(g, 0.6, 0.35, 0xffd23f, 13, 3.9, 0.8, { r2: 0.3 }); S(g, 0.18, 0xffd23f, 13, 4.15, 0.8);
    // the awful vacuum
    const vac = new THREE.Group(); vac.position.set(-1.8, 3.75, 0.5); g.add(vac); sets.shop.vac = vac;
    B(vac, 3.2, 1.6, 2.4, 0xff9fb8, 0, 0.9, 0, { round: 0.6 }); B(vac, 3.3, 0.35, 2.5, 0xffffff, 0, 0.4, 0, { round: 0.15, cast: false });
    for (const s of [-1, 1]) { C(vac, 0.45, 0.4, 0x555a72, s * 1.2, 0.35, 0.9).rotation.z = Math.PI / 2; }
    C(vac, 0.12, 2.6, 0xc8c0d8, 0.9, 2.5, -0.4, { seg: 8, cast: false }); B(vac, 1.1, 0.25, 0.4, 0x555a72, 0.9, 3.8, -0.4, { round: 0.1, cast: false });
    const hose = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.2, 8, 20, Math.PI), mat(0x9a90b8)); hose.position.set(-1.9, 1.0, 0.3); hose.rotation.z = Math.PI * 0.5; vac.add(hose);
    B(vac, 1.5, 0.4, 0.9, 0xff9fb8, -1.9, 0.2, 1.3, { round: 0.15, cast: false });
    B(vac, 0.5, 0.5, 0.12, 0xffd23f, 0.2, 1.1, 1.22, { cast: false, rz: 0.3 });   // wobbly sticker
    const puffs = []; const pm = new THREE.MeshStandardMaterial({ color: 0xdedaea, roughness: 1, transparent: true, opacity: 0.85 });
    for (let i = 0; i < 7; i++) { const p = S(vac, 0.55, 0xdedaea, 0, 2, 0, { mat: pm, cast: false }); p.visible = false; puffs.push(p); }
    B(g, 4.4, 1.6, 0.2, 0xfff1a8, 6, 5.2, 1.6, { round: 0.1, cast: false, rz: -0.08 }); textPlane(g, 'SALE', 3.8, 1.1, null, '#e83a4a', 'bold 90px Liberation Sans, sans-serif', 6, 5.2, 1.72).rotation.z = -0.08;
    // plant + lamp
    C(g, 1.1, 1.6, 0xffb3a0, -21, 0.8, 1, { r2: 0.9 }); for (let i = 0; i < 6; i++) S(g, 1.1, 0x8fdcae, -21 + Math.cos(i) * 1.1, 2.6 + (i % 3) * 0.8, 1 + Math.sin(i) * 0.9, { sy: 1.3, cast: false });
    sets.shop.upd = (t, cue) => {
      const k = cue ? t - cue : -1;
      vac.rotation.z = k > 0 && k < 2.4 ? Math.sin(k * 40) * 0.05 * Math.exp(-k * 1.2) : 0; vac.position.y = 3.75 + (k > 0 && k < 2.4 ? Math.abs(Math.sin(k * 22)) * 0.2 * Math.exp(-k * 1.4) : 0);
      puffs.forEach((p, i) => { const s = k - i * 0.22; p.visible = s > 0 && s < 1.7; if (p.visible) { p.position.set(Math.sin(i * 2.1) * 0.9 + s * 0.4 * Math.sin(i), 1.8 + s * 2.4, Math.cos(i * 1.7) * 0.6); p.scale.setScalar(0.5 + s * 1.1); pm.opacity = 0.85; } });
    };
  }

  // ------------------------------------------------------------------ PARK (sunset)
  const park = grp(); sets.park = { g: park };
  { const g = park;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(320, 240), mat(0xa6d9b0, { roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.position.z = -40; ground.receiveShadow = true; g.add(ground);
    const path = new THREE.Mesh(new THREE.CircleGeometry(15, 40), mat(0xf6e8d8)); path.rotation.x = -Math.PI / 2; path.position.set(0, 0.04, 6); path.receiveShadow = true; g.add(path);
    B(g, 9, 0.5, 2.6, 0xffb3a0, 0, 0.9, 0, { round: 0.2 }); B(g, 9, 2.4, 0.5, 0xffb3a0, 0, 2.3, -1.3, { round: 0.2 }); for (const s of [-1, 1]) { B(g, 0.6, 1.7, 2.6, 0xffffff, s * 4.2, 0.85, 0, { round: 0.15 }); B(g, 0.6, 0.6, 2.6, 0xffffff, s * 4.5, 2.2, 0, { round: 0.15 }); }
    // blossom tree
    C(g, 1.3, 11, 0xc9a27a, 12, 5.5, -6, { seg: 12, r2: 0.9 });
    for (const [x, y, z, r, c] of [[12, 14, -6, 6.5, 0xffc8dc], [7.5, 12, -5, 4.6, 0xffb6d0], [16.5, 12.6, -7, 5, 0xffd2e4], [12, 17.5, -7, 4.2, 0xffc2d8], [9, 10, -3, 3.4, 0xffd9e8]]) S(g, r, c, x, y, z, { sy: 0.88 });
    C(g, 0.9, 7, 0xc9a27a, -17, 3.5, -10, { seg: 10, r2: 0.6 }); S(g, 4.8, 0xffb6d0, -17, 9.5, -10); S(g, 3.6, 0xffc8dc, -13.5, 8.5, -9); S(g, 3.4, 0xffd2e4, -20.5, 8.8, -11);
    for (let i = 0; i < 26; i++) S(g, 0.6 + rnd() * 0.3, pick([0xfff1a8, 0xffd1e8, 0xd9c8ff, 0xffffff]), -26 + rnd() * 52, 0.4, -4 + rnd() * 30, { sy: 0.6, cast: false });
    C(g, 0.18, 7, 0x9a90b8, -9, 3.5, -3, { seg: 8 }); S(g, 0.8, 0xfff2c8, -9, 7.4, -3, { mat: basic(0xffe9b0), cast: false });
    for (const [x, s, c] of [[-60, 1.6, 0xc9b8f0], [-5, 1.9, 0xd6b8ee], [60, 1.7, 0xc2b0ec]]) S(g, 30, c, x, -8, -75, { sx: s, sy: 0.7, cast: false });
    const sun = S(g, 11, 0xffe0a0, -26, 14, -90, { mat: basic(0xffd89a), cast: false });
    const petals = []; for (let i = 0; i < 46; i++) { const p = B(g, 0.38, 0.05, 0.26, pick([0xffc2d8, 0xffd9e8, 0xffb0cc]), 0, 0, 0, { cast: false }); petals.push({ p, x: -10 + rnd() * 30, z: -8 + rnd() * 24, h: 12 + rnd() * 6, sp: 0.8 + rnd() * 0.8, ph: rnd() * 6 }); }
    sets.park.upd = t => { petals.forEach(q => { const y = q.h - ((t * q.sp + q.ph * 3) % q.h); q.p.position.set(q.x + Math.sin(t * 1.2 + q.ph) * 2 + t * 0.6 % 6, y, q.z); q.p.rotation.set(t * 2 + q.ph, t * 1.5, t); }); };
  }

  // ------------------------------------------------------------------ NIGHT extras (on top of the town)
  const night = grp(); sets.night = { g: night };
  { const g = night;
    const stars = []; for (let i = 0; i < 150; i++) { const a = rnd() * Math.PI * 2, e = 0.12 + rnd() * 1.0, r = 170; const s = S(g, 0.5 + rnd() * 0.6, 0xffffff, Math.cos(a) * Math.cos(e) * r, 28 + Math.sin(e) * r * 0.8, -Math.abs(Math.sin(a)) * Math.cos(e) * r - 20, { mat: basic(0xfff6e0), cast: false }); stars.push(s); }
    S(g, 9, 0xfff4d6, -55, 62, -130, { mat: basic(0xfff1c8), cast: false });
    const lan = []; function string(x0, x1, y, z, n) { for (let i = 0; i <= n; i++) { const u = i / n; const m = S(g, 0.4, 0xffd58a, x0 + (x1 - x0) * u, y - Math.sin(u * Math.PI) * 2, z, { mat: basic(pick([0xffd58a, 0xffb0cc, 0xb8d8ff, 0xcfffd8])), cast: false }); lan.push(m); } }
    for (let k = -3; k <= 3; k++) string(k * 21 - 11, k * 21 + 10, 15.5, 13.8, 9);
    for (let k = -3; k <= 3; k++) string(k * 21 - 11, k * 21 + 10, 17.5, 1.4, 9);
    const flies = []; for (let i = 0; i < 30; i++) flies.push({ m: S(g, 0.16, 0xfff08a, 0, 0, 0, { mat: basic(0xfff08a), cast: false }), x: -22 + rnd() * 44, y: 1.5 + rnd() * 10, z: 2 + rnd() * 20, ph: rnd() * 6 });
    sets.night.upd = t => { stars.forEach((s, i) => s.scale.setScalar(0.8 + 0.4 * Math.sin(t * 2 + i))); lan.forEach((l, i) => l.scale.setScalar(1 + 0.08 * Math.sin(t * 3 + i)));
      flies.forEach(f => { f.m.position.set(f.x + Math.sin(t * 0.7 + f.ph) * 3, f.y + Math.sin(t * 1.1 + f.ph * 2) * 1.2, f.z + Math.cos(t * 0.6 + f.ph) * 3); f.m.scale.setScalar(0.7 + 0.5 * Math.sin(t * 4 + f.ph)); }); };
  }
  // ------------------------------------------------------------------ BEDROOM (split screen call)
  const bed = grp(); sets.bedroom = { g: bed };
  { const g = bed;
    B(g, 70, 0.5, 50, 0xe8d8f0, 0, -0.25, 4, { cast: false }); C(g, 9, 0.12, 0xcfe0ff, 0, 0.04, 8, { seg: 36, cast: false });
    B(g, 70, 26, 1, 0xcfe0ff, 0, 13, -9, { cast: false }); B(g, 70, 5, 1.3, 0xb4cdf5, 0, 2.5, -8.8, { cast: false });
    B(g, 1, 26, 50, 0xcfe0ff, -22, 13, 4, { cast: false }); B(g, 1, 26, 50, 0xcfe0ff, 22, 13, 4, { cast: false });
    for (let i = 0; i < 16; i++) { const x = -26 + i * 3.4 + (i % 3), y = 9 + ((i * 7) % 12); S(g, 0.32, 0xfff1a8, x, y, -8.3, { mat: basic(0xfff1a8), sz: 0.3, cast: false }); }
    B(g, 8.6, 8.6, 0.5, 0xffffff, 12.5, 13, -8.4, { round: 0.3 }); B(g, 7.4, 7.4, 0.3, 0x2a2a6a, 12.5, 13, -8.1, { mat: basic(0x3a3a86), cast: false }); S(g, 2.0, 0xfff1c8, 12.5, 13.6, -8.0, { mat: basic(0xfff1c8), sz: 0.3, cast: false }); S(g, 1.6, 0x3a3a86, 13.4, 14.2, -7.9, { mat: basic(0x3a3a86), sz: 0.3, cast: false });
    C(g, 2.6, 0.5, 0xffffff, -14, 11.5, -8.3, { seg: 32 }).rotation.x = Math.PI / 2; C(g, 2.2, 0.2, 0xfffaf0, -14, 11.5, -8.0, { seg: 32 }).rotation.x = Math.PI / 2;
    B(g, 0.2, 1.6, 0.1, 0x555a72, -14, 12.2, -7.8, { cast: false }); B(g, 1.1, 0.2, 0.1, 0x555a72, -13.5, 11.5, -7.8, { cast: false });
    B(g, 13, 1.8, 15.5, 0xffffff, 0, 0.9, -0.2, { round: 0.5 }); B(g, 12.2, 1.6, 14.7, 0xcfe0ff, 0, 2.2, -0.2, { round: 0.6 });
    B(g, 13.4, 9, 1, 0xffb3d1, 0, 4.5, -8, { round: 0.5 }); B(g, 7, 1.3, 3.4, 0xffffff, 0, 3.4, -5.6, { round: 0.5 });
    B(g, 12.4, 1.9, 7.4, 0xffb3d1, 0, 3.2, 2.6, { round: 0.5 }); for (let i = 0; i < 4; i++) B(g, 12.5, 0.45, 1.1, 0xfff6ee, 0, 4.15, -0.4 + i * 1.7, { round: 0.2, cast: false });
    B(g, 3, 3, 3, 0xffffff, -9.5, 1.5, -6, { round: 0.3 }); C(g, 0.5, 1.4, 0xffd23f, -9.5, 3.7, -6, { r2: 0.2, cast: false }); S(g, 1.0, 0xfff1c8, -9.5, 4.8, -6, { mat: basic(0xfff1c8), cast: false });
    B(g, 5, 1.2, 3, 0xe2d4ff, 9, 0.6, 4, { round: 0.4 });  // slippers box
  }
  sets.addPhone = bot => { const p = new THREE.Group(); p.visible = false; bot.head.add(p); B(p, 0.34, 1.0, 0.16, 0x4a8bff, 1.72, -0.1, 0.08, { round: 0.07, cast: false }); B(p, 0.24, 0.8, 0.04, 0x1d1730, 1.72, -0.1, 0.17, { cast: false }); p.rotation.z = -0.15; return p; };
  sets.addCap = bot => { const p = new THREE.Group(); p.visible = false; p.position.set(0, 1.0, 0); bot.head.add(p); const c = new THREE.Mesh(new THREE.ConeGeometry(1.15, 2.2, 20), mat(0x9ec8ff)); c.position.set(0.5, 1.0, 0); c.rotation.z = -0.55; c.castShadow = true; p.add(c); C(p, 1.2, 0.35, 0xffffff, 0, 0.1, 0, { seg: 24 }).scale.z = 0.85; S(p, 0.35, 0xffffff, 1.5, 1.85, 0); return p; };
  // a hat for Drafty (a prop, the robot itself is unchanged)
  sets.addHat = bot => { const h = new THREE.Group(); h.visible = false; h.position.y = 0.98; bot.head.add(h);
    C(h, 1.55, 0.14, 0xb8e986, 0, 0.05, 0, { seg: 28 }).scale.z = 0.82; C(h, 0.95, 0.9, 0xb8e986, 0, 0.5, 0, { seg: 24, r2: 0.82 }); C(h, 0.97, 0.18, 0xff6fae, 0, 0.2, 0, { seg: 24, r2: 0.97 });
    for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; S(h, 0.22, 0xffb02e, Math.cos(a) * 0.38 - 0.55, 0.62 + Math.sin(a) * 0.38, 0.85, { sz: 0.5, cast: false }); } S(h, 0.2, 0xff6fae, -0.55, 0.62, 0.9, { sz: 0.6, cast: false });
    B(h, 0.14, 1.0, 0.1, 0xffffff, 0.75, 1.0, 0.1, { rz: -0.5, round: 0.04, cast: false }); return h; };
  return sets;
}
