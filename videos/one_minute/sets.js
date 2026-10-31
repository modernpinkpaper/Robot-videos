// The paper workshop + the 1-minute photo machine (soft pastel toy look, rounded boxes).
export const SP = 0.13, PASS = 0.4545, SPEED = 22;   // same numbers as build_audio.py
export function buildSets(THREE, kit, scene, RBG) {
  const { textPlane, mat } = kit; const geo = {};
  const B = (g, w, h, d, c, x = 0, y = 0, z = 0, o = {}) => { const k = [w, h, d, o.round || 0].join('_'); const ge = geo[k] || (geo[k] = o.round ? new RBG(w, h, d, 3, Math.min(o.round, Math.min(w, h, d) / 2.05)) : new THREE.BoxGeometry(w, h, d));
    const m = new THREE.Mesh(ge, o.mat || mat(c, o.m)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; if (o.rz) m.rotation.z = o.rz; if (o.rx) m.rotation.x = o.rx; g.add(m); return m; };
  const C = (g, r, h, c, x = 0, y = 0, z = 0, o = {}) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(o.r2 ?? r, r, h, o.seg || 24), o.mat || mat(c)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; g.add(m); return m; };
  const S = (g, r, c, x = 0, y = 0, z = 0, o = {}) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), o.mat || mat(c)); m.position.set(x, y, z); m.castShadow = o.cast !== false; g.add(m); return m; };
  const basic = c => new THREE.MeshBasicMaterial({ color: c });
  const backOut = u => { const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const room = new THREE.Group(); scene.add(room);
  // ---- room
  B(room, 90, 0.5, 60, 0xf6dfc6, 0, -0.25, 6, { cast: false }); C(room, 13, 0.12, 0xffd1e0, 0, 0.05, 6, { seg: 40, cast: false });
  B(room, 90, 28, 1, 0xfff1d6, 0, 14, -9, { cast: false }); B(room, 90, 6, 1.3, 0xffc9d9, 0, 3, -8.8, { cast: false });
  B(room, 1, 28, 60, 0xfff1d6, -26, 14, 6, { cast: false }); B(room, 1, 28, 60, 0xfff1d6, 26, 14, 6, { cast: false });
  B(room, 9, 9, 0.5, 0xffffff, -17, 13, -8.4, { round: 0.3 }); B(room, 7.8, 7.8, 0.3, 0xcfe8ff, -17, 13, -8.1, { mat: basic(0xcfe8ff), cast: false });
  B(room, 0.3, 7.8, 0.3, 0xffffff, -17, 13, -7.9, { cast: false }); B(room, 7.8, 0.3, 0.3, 0xffffff, -17, 13, -7.9, { cast: false });
  B(room, 14, 3.2, 0.3, 0xff9fc4, 0, 18.5, -8.3, { round: 0.5, cast: false }); textPlane(room, 'ENVELOPE LAB', 13, 2.6, null, '#ffffff', 'bold 66px Liberation Sans, sans-serif', 0, 18.5, -8.0);
  for (let i = 0; i < 4; i++) { B(room, 8, 0.4, 1.6, 0xffffff, -17 + i * 0 + 0, 4 + i * 0, -8, { cast: false }); break; }
  // shelf with mock envelopes (decor) on the right wall area
  B(room, 14, 0.4, 1.6, 0xffffff, 17, 9, -8, { round: 0.1 }); [0xff6fae, 0xffd23f, 0x4a8bff, 0x56c85a, 0xa07af0, 0xff9a5a].forEach((c, i) => B(room, 1.8, 2.2, 0.5, c, 12 + i * 2.1, 10.3, -8, { round: 0.1, cast: false }));
  C(room, 1.1, 1.8, 0xffb3a0, -22, 0.9, -5); for (let i = 0; i < 6; i++) S(room, 1.0, 0x8fdcae, -22 + Math.cos(i * 1.1), 3 + (i % 3) * 0.9, -5 + Math.sin(i * 1.1) * 0.8, { cast: false }).scale.y = 1.3;
  // workbench
  B(room, 28, 2.8, 4.6, 0xcdb8f0, 0, 1.4, -2, { round: 0.4 }); B(room, 28.6, 0.35, 5.2, 0xfff6ee, 0, 2.95, -2, { round: 0.15 });
  for (let i = -6; i <= 6; i++) B(room, 1.8, 2.0, 0.2, 0xb59fe8, i * 2.2, 1.5, 0.35, { round: 0.1, cast: false });
  // pile of envelopes (the "by hand" pile)
  const pile = new THREE.Group(); room.add(pile); [0xff6fae, 0xffd23f, 0x4a8bff, 0x56c85a, 0xa07af0, 0xff9a5a, 0x2fd6d6, 0xff8fb8].forEach((c, i) => B(pile, 3.0, 0.22, 2.0, c, -8 + (i % 3) * 0.12, 3.25 + i * 0.23, -1.4 + (i % 2) * 0.1, { round: 0.06, cast: false }));
  // ---- the machine (parts pop in while Mica explains)
  const mach = new THREE.Group(); room.add(mach);
  const belt = new THREE.Group(); mach.add(belt); B(belt, 22, 0.6, 3.6, 0x4a4560, 0, 3.5, -2, { round: 0.2 });
  const stripes = []; for (let i = 0; i < 11; i++) stripes.push(B(belt, 1.0, 0.64, 3.4, 0x6a6490, 0, 3.5, -2, { cast: false }));
  const arch = new THREE.Group(); mach.add(arch); for (const z of [-4.1, 0.1]) B(arch, 0.8, 6.4, 0.8, 0xffffff, 0, 6.5, z, { round: 0.25 }); B(arch, 0.9, 0.9, 5.2, 0xffb3d1, 0, 9.5, -2, { round: 0.3 });
  B(arch, 2.2, 1.8, 1.8, 0x3a3350, 0, 8.3, -2, { round: 0.4 }); C(arch, 0.6, 0.6, 0x9ec8ff, 0, 7.3, -2, { seg: 20 });
  const flash = S(mach, 1.2, 0xffffff, 0, 6.4, -2, { mat: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 }), cast: false });
  const hopper = new THREE.Group(); mach.add(hopper); B(hopper, 3.4, 3.2, 3.8, 0xffd23f, -11.5, 4.6, -2, { round: 0.4 }); textPlane(hopper, 'IN', 2, 1, null, '#ffffff', 'bold 120px Liberation Sans, sans-serif', -11.5, 4.7, -0.05);
  const display = new THREE.Group(); mach.add(display); B(display, 3.8, 3.8, 3.8, 0x3a3350, 12.4, 4.8, -2, { round: 0.4 });
  const cc = document.createElement('canvas'); cc.width = 256; cc.height = 256; const cx = cc.getContext('2d'), ct = new THREE.CanvasTexture(cc); ct.colorSpace = THREE.SRGBColorSpace;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.0), new THREE.MeshBasicMaterial({ map: ct })); scr.position.set(12.4, 4.9, -0.07); display.add(scr);
  let lastN = -1; const drawN = n => { if (n === lastN) return; lastN = n; cx.fillStyle = '#171229'; cx.fillRect(0, 0, 256, 256); cx.fillStyle = '#bff7f2'; cx.font = 'bold 150px Liberation Sans, sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(String(n), 128, 120); cx.font = 'bold 34px Liberation Sans, sans-serif'; cx.fillStyle = '#ff9fc4'; cx.fillText('PHOTOS', 128, 218); ct.needsUpdate = true; };
  // slots shelf along the back wall: the finished photos stand here
  const shelf = new THREE.Group(); mach.add(shelf); B(shelf, 22, 0.4, 1.4, 0xffffff, 0, 8.4, -6.2, { round: 0.1 });
  // big red button on a stand (Mica presses it)
  const btn = new THREE.Group(); mach.add(btn); B(btn, 2.6, 3.0, 2.6, 0xffffff, 8, 1.5, 6, { round: 0.4 }); const cap = C(btn, 0.95, 0.5, 0xe83a4a, 8, 3.25, 6, { seg: 28 });
  // the 19 envelopes
  const COLORS = [0xff6fae, 0xffd23f, 0x4a8bff, 0x56c85a, 0xa07af0, 0xff9a5a, 0x2fd6d6, 0xff8fb8, 0xc8853a, 0x7a82a0, 0xf2e86a, 0x9ad9ae, 0xe83a4a, 0x3d3a6a, 0xbfe0ff, 0xd9a8ff, 0xffb3a0, 0x8ed4a8, 0xfff6ee];
  const envs = COLORS.map(c => { const g = new THREE.Group(); B(g, 2.2, 1.5, 0.16, c, 0, 0, 0, { round: 0.1 }); const f = B(g, 2.2, 0.05, 0.9, 0xffffff, 0, 0.32, 0.1, { cast: false }); f.rotation.x = 0.7; g.visible = false; mach.add(g); return g; });
  const pop = (g, t0, t) => { const u = clamp((t - t0) / 0.35); g.visible = u > 0; g.scale.setScalar(Math.max(0.01, 0.2 + 0.8 * backOut(u))); };
  // cue = { belt, arch, hopper, run } absolute times
  const upd = (t, cue) => {
    pop(belt, cue.belt, t); pop(arch, cue.arch, t); pop(hopper, cue.hopper, t); pop(display, cue.hopper + 0.1, t); pop(shelf, cue.hopper + 0.2, t); pop(btn, cue.hopper + 0.3, t);
    pile.visible = t < cue.run; stripes.forEach((s, i) => { s.position.x = (((i * 2 + t * SPEED * 0.9) % 22) + 22) % 22 - 11; s.visible = Math.abs(s.position.x) < 10.8; });
    cap.position.y = 3.25 - (t > cue.run - 0.2 && t < cue.run + 0.15 ? 0.3 : 0);
    let n = 0, fl = 0;
    envs.forEach((g, i) => { const s = cue.run + i * SP, d = t - s; if (d < 0) { g.visible = false; return; } g.visible = true;
      const tb = 21 / SPEED; if (d < tb) { g.position.set(-10.5 + SPEED * d, 4.5, -2); g.rotation.set(-0.0, 0, 0); g.scale.setScalar(1); }
      else { const u = clamp((d - tb) / 0.4), sx = 10.5, ex = -9 + i * 1.0; g.position.set(sx + (ex - sx) * u, 4.5 + (9.5 - 4.5) * u + Math.sin(u * Math.PI) * 4, -2 + (-6.2 + 2) * u); g.rotation.z = (1 - u) * 0.3 * (i % 2 ? 1 : -1); g.scale.setScalar(1); }
      if (d >= PASS) { n++; fl = Math.max(fl, Math.exp(-(d - PASS) * 28)); } });
    flash.material.opacity = 0.9 * fl; flash.scale.setScalar(0.6 + fl); drawN(n);
  };
  return { room, upd };
}
