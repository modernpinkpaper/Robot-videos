// Sets for "Heart Calm": a cozy living room, a morning bedroom, a park, a prayer-mat corner.
// Same soft pastel toy look as the characters (rounded boxes, soft colors). Characters face +z, camera looks toward -z. Back wall at z = -9.
export function buildSets(THREE, kit, scene, RBG) {
  const { mat } = kit;
  const geoCache = {};
  function B(g, w, h, d, c, x = 0, y = 0, z = 0, o = {}) {
    const key = [w, h, d, o.round || 0].join('_');
    const geo = geoCache[key] || (geoCache[key] = o.round ? new RBG(w, h, d, 3, Math.min(o.round, Math.min(w, h, d) / 2.05)) : new THREE.BoxGeometry(w, h, d));
    const m = new THREE.Mesh(geo, o.mat || mat(c, o.m)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true;
    if (o.rx) m.rotation.x = o.rx; if (o.ry) m.rotation.y = o.ry; if (o.rz) m.rotation.z = o.rz; g.add(m); return m;
  }
  function C(g, r, h, c, x = 0, y = 0, z = 0, o = {}) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(o.r2 ?? r, r, h, o.seg || 24), o.mat || mat(c, o.m)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; g.add(m); return m;
  }
  function S(g, r, c, x = 0, y = 0, z = 0, o = {}) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), o.mat || mat(c, o.m)); m.position.set(x, y, z); m.scale.set(o.sx || 1, o.sy || 1, o.sz || 1); m.castShadow = o.cast !== false; m.receiveShadow = true; g.add(m); return m;
  }
  const grp = () => { const g = new THREE.Group(); g.visible = false; scene.add(g); return g; };
  const glow = (c, i) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: 0.5 });
  const sets = {};
  const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const rnd = mulberry(7);

  // an eight-pointed star (two squares) in a frame: a simple Islamic geometric pattern for the wall. No writing on it.
  function starFrame(g, x, y, z, s = 1) {
    B(g, 4.4 * s, 4.4 * s, 0.3, 0xffffff, x, y, z, { round: 0.2 });
    B(g, 3.8 * s, 3.8 * s, 0.34, 0x2f7f86, x, y, z + 0.02, { round: 0.15, cast: false });
    B(g, 2.3 * s, 2.3 * s, 0.4, 0xf3d58a, x, y, z + 0.06, { cast: false });
    B(g, 2.3 * s, 2.3 * s, 0.4, 0xf3d58a, x, y, z + 0.08, { cast: false, ry: 0, rz: Math.PI / 4 });
    B(g, 1.0 * s, 1.0 * s, 0.46, 0x2f7f86, x, y, z + 0.1, { cast: false, rz: Math.PI / 8 });
  }
  function windowAt(g, x, y, z, w, h, color, inten) {
    B(g, w + 0.8, h + 0.8, 0.4, 0xffffff, x, y, z, { round: 0.2, cast: false });
    B(g, w, h, 0.5, 0, x, y, z + 0.05, { mat: glow(color, inten), cast: false });
    B(g, 0.22, h, 0.55, 0xffffff, x, y, z + 0.1, { cast: false }); B(g, w, 0.22, 0.55, 0xffffff, x, y, z + 0.1, { cast: false });
    B(g, w + 1.4, 0.35, 0.9, 0xffffff, x, y - h / 2 - 0.4, z + 0.35, { round: 0.12 });
  }
  function plant(g, x, z, s = 1) {
    C(g, 0.9 * s, 1.5 * s, 0xf0a38e, x, 0.75 * s, z, { r2: 1.15 * s });
    for (const [dx, dy, dz, r] of [[0, 2.7, 0, 1.3], [0.9, 2.3, 0.3, 0.9], [-0.9, 2.2, -0.2, 0.95], [0.2, 3.6, 0.1, 0.8]]) S(g, r * s, 0x8fd3a0, x + dx * s, dy * s, z + dz * s);
  }
  function mug(g, x, y, z, c = 0xffffff, s = 1) { C(g, 0.38 * s, 0.6 * s, c, x, y + 0.3 * s, z, { seg: 18 }); const h = new THREE.Mesh(new THREE.TorusGeometry(0.2 * s, 0.06 * s, 8, 14), mat(c)); h.position.set(x + 0.42 * s, y + 0.32 * s, z); g.add(h); }

  // ------------------------------------------------------------------ ROOM (evening, warm)
  const room = grp(); sets.room = { g: room };
  {
    const g = room;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 80), mat(0xf0d6bb, { roughness: 0.85 })); floor.rotation.x = -Math.PI / 2; floor.position.z = 10; floor.receiveShadow = true; g.add(floor);
    B(g, 44, 18, 0.6, 0xf8e4ec, 0, 9, -9.3, { cast: false });                                   // back wall
    B(g, 0.6, 18, 30, 0xf3dbe6, -22, 9, 5, { cast: false }); B(g, 0.6, 18, 30, 0xf3dbe6, 22, 9, 5, { cast: false });   // side walls
    B(g, 44, 0.9, 0.7, 0xffffff, 0, 0.45, -8.9, { cast: false });                              // baseboard
    windowAt(g, -7.5, 9.2, -8.7, 6.4, 7.4, 0xffc78a, 0.85);                                      // window with the evening sun
    starFrame(g, 7.5, 10.2, -8.8, 1.3);
    B(g, 22, 0.08, 12, 0xfbf1e2, 0, 0.05, -1.6, { cast: false }); B(g, 22.6, 0.07, 12.6, 0xe7a6be, 0, 0.04, -1.6, { cast: false });   // rug
    // couch (Dalia): seat top at y = 2.1
    const cx = -5, cz = -4.2, couch = 0x7fc4b8, couchD = 0x68b0a4;
    B(g, 10.4, 1.9, 4.2, couchD, cx, 0.95, cz, { round: 0.5 });
    B(g, 10.4, 3.6, 1.2, couch, cx, 3.0, cz - 1.7, { round: 0.55 });
    B(g, 1.3, 2.9, 4.2, couch, cx - 4.7, 2.2, cz, { round: 0.5 }); B(g, 1.3, 2.9, 4.2, couch, cx + 4.7, 2.2, cz, { round: 0.5 });
    B(g, 3.8, 0.7, 3.2, couch, cx - 2.2, 2.25, cz + 0.2, { round: 0.3 }); B(g, 3.8, 0.7, 3.2, couch, cx + 2.2, 2.25, cz + 0.2, { round: 0.3 });
    B(g, 1.7, 1.7, 0.7, 0xffd98a, cx + 3.5, 3.4, cz - 0.4, { round: 0.3, rz: 0.3 });             // pillow
    // armchair (Amina): seat top at y = 2.0
    const ax = 6.8, az = -3.4, arm = 0xc9a6e8, armD = 0xb48ddb;
    B(g, 5.2, 1.8, 4.4, armD, ax, 0.9, az, { round: 0.5, ry: -0.35 });
    B(g, 5.2, 3.6, 1.1, arm, ax + 0.75, 3.0, az - 1.55, { round: 0.5, ry: -0.35 });
    B(g, 3.6, 0.7, 3.2, arm, ax, 2.15, az, { round: 0.3, ry: -0.35 });
    // coffee table with tea
    C(g, 2.9, 1.0, 0xfff1d8, 0.8, 1.0, 1.4, { seg: 32, m: { roughness: 0.5 } }); C(g, 0.55, 1.0, 0xe9c9a0, 0.8, 0.5, 1.4);
    C(g, 0.5, 0.7, 0xffffff, 1.4, 1.85, 1.2); mug(g, -0.4, 1.5, 1.7, 0xffffff, 0.9); mug(g, 0.2, 1.5, 2.3, 0xfdd6e5, 0.9);
    // bookshelf (closed books only)
    B(g, 1.4, 11, 6.4, 0xffffff, 18.2, 5.5, -3, { round: 0.2 });
    const cols = [0xf08fae, 0x8fb8f0, 0xf3d58a, 0x8fd3a0, 0xc3a8f5, 0xffb98f];
    for (let r = 0; r < 4; r++) { B(g, 1.6, 0.3, 6.2, 0xe9d3b5, 18.1, 1.4 + r * 2.5, -3, { cast: false }); let z = -5.7; for (let k = 0; k < 7; k++) { const w = 0.45 + rnd() * 0.35; B(g, 1.0, 1.7 + rnd() * 0.5, w, cols[(k + r * 2) % 6], 18.1, 2.4 + r * 2.5, z + w / 2, { round: 0.06 }); z += w + 0.25; } }
    plant(g, -17, -6.2, 1.5); plant(g, 12.5, -7, 0.9);
    // floor lamp with a warm shade
    C(g, 0.18, 7, 0xe9c9a0, -13.2, 3.5, -6.2, { seg: 10 }); C(g, 1.5, 1.8, 0xfff0c8, -13.2, 7.4, -6.2, { r2: 1.1, mat: glow(0xffe2a0, 0.7) });
  }

  // ------------------------------------------------------------------ BED (morning)
  const bed = grp(); sets.bed = { g: bed };
  {
    const g = bed;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 80), mat(0xe7d9f5, { roughness: 0.85 })); floor.rotation.x = -Math.PI / 2; floor.position.z = 10; floor.receiveShadow = true; g.add(floor);
    B(g, 44, 18, 0.6, 0xdfeaff, 0, 9, -9.3, { cast: false }); B(g, 0.6, 18, 30, 0xd6e2fb, -22, 9, 5, { cast: false }); B(g, 0.6, 18, 30, 0xd6e2fb, 22, 9, 5, { cast: false });
    B(g, 44, 0.9, 0.7, 0xffffff, 0, 0.45, -8.9, { cast: false });
    windowAt(g, -1, 9.5, -8.7, 8.5, 7.8, 0xffe3a8, 1.0);                                        // sunrise
    B(g, 20, 0.08, 12, 0xfff3e6, 0, 0.05, 0, { cast: false });
    // bed: Dalia sits in it, mattress top at y = 2.3
    B(g, 11, 1.6, 8.6, 0xffffff, 0, 0.8, -4.6, { round: 0.4 });
    B(g, 10.4, 1.3, 8.0, 0xf4f0ff, 0, 2.0, -4.6, { round: 0.5 });                              // mattress
    B(g, 11.2, 5.6, 0.9, 0xd7b8f0, 0, 3.4, -8.6, { round: 0.4 });                              // headboard
    B(g, 10.6, 1.5, 4.6, 0xffc2d6, 0, 2.8, -2.7, { round: 0.6 });                              // blanket across her lap
    B(g, 4.0, 1.2, 2.2, 0xffffff, -2.8, 3.1, -7.4, { round: 0.5, rx: -0.35 }); B(g, 4.0, 1.2, 2.2, 0xfff0b8, 2.8, 3.1, -7.4, { round: 0.5, rx: -0.35 });
    // nightstand with phone and coffee
    B(g, 3.8, 3.2, 3.2, 0xf3d9b8, 8.6, 1.6, -5.4, { round: 0.3 }); B(g, 4.2, 0.3, 3.6, 0xffffff, 8.6, 3.3, -5.4, { round: 0.12 });
    const phone = B(g, 1.1, 0.14, 2.0, 0x2d2748, 7.7, 3.55, -5.0, { round: 0.06 }); B(g, 0.9, 0.05, 1.7, 0, 7.7, 3.64, -5.0, { mat: glow(0x9fd0ff, 0.9), cast: false });
    mug(g, 9.2, 3.45, -5.8, 0xffffff, 1.2);
    const steam = []; for (let i = 0; i < 4; i++) { const s = S(g, 0.28, 0xffffff, 9.2, 4.6, -5.8, { cast: false, mat: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }) }); steam.push(s); }
    plant(g, -14, -6.5, 1.3);
    B(g, 3.5, 0.2, 3.5, 0xfff0b8, 0, 0.1, 6, { cast: false, mat: glow(0xfff0b8, 0.2) });
    sets.bed.upd = t => steam.forEach((s, i) => { const u = ((t * 0.45 + i / 4) % 1); s.position.set(9.2 + Math.sin(u * 8 + i) * 0.25, 4.0 + u * 2.6, -5.8); s.scale.setScalar(0.6 + u * 1.2); s.material.opacity = 0.5 * (1 - u); });
  }

  // ------------------------------------------------------------------ PARK (daytime)
  const park = grp(); sets.park = { g: park };
  {
    const g = park;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 300), mat(0xbfe8b8, { roughness: 0.95 })); ground.rotation.x = -Math.PI / 2; ground.position.z = -60; ground.receiveShadow = true; g.add(ground);
    B(g, 9, 0.12, 120, 0xf3e4d0, 0, 0.07, -20, { cast: false }); B(g, 9.8, 0.1, 120, 0xe6d3bd, 0, 0.05, -20, { cast: false });   // path
    for (const [x, s, c] of [[-60, 1.8, 0xa6dca8], [10, 1.5, 0xb5e6b0], [75, 2.0, 0xa0d8a8]]) S(g, 32, c, x, -9, -90, { sx: s, sy: 0.7, cast: false });
    function tree(x, z, s = 1, c = 0xa8e0b0) { C(g, 0.7 * s, 3.4 * s, 0xc9a27a, x, 1.7 * s, z, { seg: 10 }); S(g, 3 * s, c, x, 5.6 * s, z, { sy: 0.92 }); S(g, 2.1 * s, 0xb6ebbf, x + 1.9 * s, 4.7 * s, z + 0.7 * s); S(g, 2.0 * s, c, x - 1.9 * s, 4.6 * s, z - 0.5 * s); S(g, 1.8 * s, 0xc4efc8, x + 0.4 * s, 7.6 * s, z + 0.4 * s); }
    tree(-11, -9, 1.5); tree(12, -14, 1.7, 0xb5e8a8); tree(-26, -22, 1.8, 0x9fdcc0); tree(26, -26, 1.8); tree(-6, -34, 1.6, 0xb5e8a8); tree(18, -4, 1.1, 0x9fdcc0);
    for (let i = 0; i < 60; i++) { const x = (rnd() - 0.5) * 70, z = -30 + rnd() * 50; if (Math.abs(x) < 6) continue; S(g, 0.28, [0xffd1e3, 0xfff1a8, 0xffffff, 0xd9c8ff][i % 4], x, 0.3, z, { cast: false }); }
    // a bench
    B(g, 6, 0.5, 2, 0xe9b98b, -9.5, 1.6, 2.5, { round: 0.15 }); B(g, 6, 2, 0.4, 0xe9b98b, -9.5, 2.9, 1.6, { round: 0.15 }); B(g, 0.5, 1.6, 1.8, 0x7a6a8a, -12.3, 0.8, 2.5); B(g, 0.5, 1.6, 1.8, 0x7a6a8a, -6.7, 0.8, 2.5);
    // clouds + sun
    const clouds = []; for (let i = 0; i < 7; i++) { const c = new THREE.Group(); const w = 5 + rnd() * 5; for (let k = 0; k < 4; k++) S(c, w * (0.22 + rnd() * 0.12), 0xffffff, (k - 1.5) * w * 0.28, rnd() * 0.8, 0, { sy: 0.65, cast: false, mat: new THREE.MeshBasicMaterial({ color: 0xffffff }) }); c.position.set(-60 + i * 22 + rnd() * 6, 34 + rnd() * 18, -40 - rnd() * 40); g.add(c); clouds.push(c); }
    S(g, 5, 0xfff3b0, 26, 44, -75, { cast: false, mat: new THREE.MeshBasicMaterial({ color: 0xfff3b0 }) });
    sets.park.upd = t => clouds.forEach((c, i) => { c.position.x = ((c.position.x + 70 + t * (0.5 + 0.15 * i)) % 160) - 70 + 0 * i; });
    sets.park.cloudBase = clouds.map(c => c.position.x);
    sets.park.upd = t => clouds.forEach((c, i) => { c.position.x = ((sets.park.cloudBase[i] + 70 + t * (0.45 + 0.12 * i)) % 160) - 70; });
  }

  // ------------------------------------------------------------------ MAT (quiet corner, after prayer)
  const mat_ = grp(); sets.mat = { g: mat_ };
  {
    const g = mat_;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 80), mat(0xf3e6d2, { roughness: 0.85 })); floor.rotation.x = -Math.PI / 2; floor.position.z = 10; floor.receiveShadow = true; g.add(floor);
    B(g, 44, 18, 0.6, 0xe6f2ee, 0, 9, -9.3, { cast: false }); B(g, 0.6, 18, 30, 0xdcece7, -22, 9, 5, { cast: false }); B(g, 0.6, 18, 30, 0xdcece7, 22, 9, 5, { cast: false });
    B(g, 44, 0.9, 0.7, 0xffffff, 0, 0.45, -8.9, { cast: false });
    windowAt(g, 4.5, 9.2, -8.7, 6.2, 7.6, 0xfff0c8, 0.8);
    starFrame(g, -8, 10.2, -8.8, 1.2);
    // the prayer mat: a soft rectangle with a border and an arch shape (plain pattern, no writing)
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 384; const x = cv.getContext('2d');
    x.fillStyle = '#2f7f86'; x.fillRect(0, 0, 256, 384); x.strokeStyle = '#f3d58a'; x.lineWidth = 8; x.strokeRect(14, 14, 228, 356); x.lineWidth = 3; x.strokeRect(30, 30, 196, 324);
    x.fillStyle = '#3d9aa0'; x.beginPath(); x.moveTo(60, 340); x.lineTo(60, 170); x.quadraticCurveTo(60, 70, 128, 50); x.quadraticCurveTo(196, 70, 196, 170); x.lineTo(196, 340); x.closePath(); x.fill();
    x.strokeStyle = '#f3d58a'; x.lineWidth = 4; x.stroke(); x.fillStyle = '#f3d58a'; for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(128, 110 + i * 14, 3, 0, 7); x.fill(); }
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new RBG(8.4, 0.22, 12.6, 3, 0.1), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 })); m.position.set(0, 0.12, -1.5); m.receiveShadow = true; g.add(m);
    plant(g, -15, -6.5, 1.5); plant(g, 14, -6.8, 1.0);
    C(g, 0.9, 1.1, 0xf3d58a, 11.5, 0.55, -3, { r2: 0.7, seg: 10 }); C(g, 0.35, 0.6, 0xfff0c8, 11.5, 1.4, -3, { mat: glow(0xffe2a0, 0.9) });
  }
  return sets;
}
