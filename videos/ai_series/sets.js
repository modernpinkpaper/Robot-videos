// Shared set for MICA AT WORK: a cozy paper office, a big floating mock computer screen, and sticky notes.
export function buildSets(THREE, kit, scene, RBG) {
  const { textPlane, mat } = kit; const geo = {};
  const B = (g, w, h, d, c, x = 0, y = 0, z = 0, o = {}) => { const k = [w, h, d, o.round || 0].join('_'); const ge = geo[k] || (geo[k] = o.round ? new RBG(w, h, d, 3, Math.min(o.round, Math.min(w, h, d) / 2.05)) : new THREE.BoxGeometry(w, h, d));
    const m = new THREE.Mesh(ge, o.mat || mat(c)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; g.add(m); return m; };
  const C = (g, r, h, c, x = 0, y = 0, z = 0, o = {}) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(o.r2 ?? r, r, h, o.seg || 24), mat(c)); m.position.set(x, y, z); m.castShadow = o.cast !== false; m.receiveShadow = true; g.add(m); return m; };
  const S = (g, r, c, x = 0, y = 0, z = 0, o = {}) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), o.mat || mat(c)); m.position.set(x, y, z); m.castShadow = o.cast !== false; g.add(m); return m; };
  const basic = c => new THREE.MeshBasicMaterial({ color: c });
  const room = new THREE.Group(); scene.add(room);
  B(room, 90, 0.5, 60, 0xf6dfc6, 0, -0.25, 6, { cast: false }); C(room, 13, 0.12, 0xffd1e0, 0, 0.05, 6, { seg: 40, cast: false });
  B(room, 90, 28, 1, 0xfff1d6, 0, 14, -9, { cast: false }); B(room, 90, 6, 1.3, 0xffc9d9, 0, 3, -8.8, { cast: false });
  B(room, 1, 28, 60, 0xfff1d6, -26, 14, 6, { cast: false }); B(room, 1, 28, 60, 0xfff1d6, 26, 14, 6, { cast: false });
  B(room, 9, 9, 0.5, 0xffffff, -19, 14, -8.4, { round: 0.3 }); B(room, 7.8, 7.8, 0.3, 0xcfe8ff, -19, 14, -8.1, { mat: basic(0xcfe8ff), cast: false });
  B(room, 0.3, 7.8, 0.3, 0xffffff, -19, 14, -7.9, { cast: false }); B(room, 7.8, 0.3, 0.3, 0xffffff, -19, 14, -7.9, { cast: false });
  B(room, 12, 2.6, 0.3, 0xff9fc4, 19, 17.5, -8.3, { round: 0.5, cast: false }); textPlane(room, 'MICA AT WORK', 11.4, 2.2, null, '#ffffff', 'bold 62px Liberation Sans, sans-serif', 19, 17.5, -8.0);
  C(room, 1.1, 1.8, 0xffb3a0, -22, 0.9, -5); for (let i = 0; i < 6; i++) S(room, 1.0, 0x8fdcae, -22 + Math.cos(i * 1.1), 3 + (i % 3) * 0.9, -5 + Math.sin(i * 1.1) * 0.8, { cast: false }).scale.y = 1.3;
  B(room, 28, 2.8, 4.6, 0xcdb8f0, 0, 1.4, -2, { round: 0.4 }); B(room, 28.6, 0.35, 5.2, 0xfff6ee, 0, 2.95, -2, { round: 0.15 });
  for (let i = -6; i <= 6; i++) B(room, 1.8, 2.0, 0.2, 0xb59fe8, i * 2.2, 1.5, 0.35, { round: 0.1, cast: false });
  // ---- the big floating mock computer screen (a canvas the episode draws on every frame)
  const sg = new THREE.Group(); sg.position.set(0, 10.4, -3.2); room.add(sg);
  B(sg, 13.2, 10.2, 0.7, 0x3a3350, 0, 0, 0, { round: 0.5 }); B(sg, 12.6, 9.6, 0.1, 0x241d3a, 0, 0, 0.36, { round: 0.3, cast: false });
  C(sg, 0.5, 2.6, 0x9a90b8, 0, -6.2, -0.2); B(sg, 4.2, 0.4, 2.4, 0x9a90b8, 0, -7.6, -0.2, { round: 0.2 });
  const cv = document.createElement('canvas'); cv.width = 640; cv.height = 480; const cx = cv.getContext('2d'); const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(12.2, 9.15), new THREE.MeshBasicMaterial({ map: tex })); scr.position.set(0, 0, 0.43); sg.add(scr);
  // ---- sticky notes (the "to-do list" on the walls)
  const rnd = (() => { let a = 7; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();
  const COL = [0xfff1a8, 0xffd1e8, 0xbfe9d0, 0xcfe8ff, 0xffe0c2, 0xe2d4ff];
  const notes = []; for (let i = 0; i < 46; i++) { const side = i % 2 ? 1 : -1, g = new THREE.Group(); g.position.set(side * (9 + rnd() * 14), 4 + rnd() * 14, -8.2); g.rotation.z = (rnd() - 0.5) * 0.5;
    B(g, 1.9, 1.9, 0.08, COL[i % 6], 0, 0, 0, { cast: false }); for (let k = 0; k < 3; k++) B(g, 1.1 - k * 0.15, 0.07, 0.02, 0x8a7aa8, -0.1, 0.4 - k * 0.4, 0.06, { cast: false }); room.add(g); notes.push(g); }
  const pop = u => { const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
  // ep gives: screenDraw(ctx, t), notesAlive(t) -> how many of the 46 notes are still up, notesIn(t) -> 0..1 how many have appeared
  const upd = (t, ep) => { if (ep.screenDraw) { ep.screenDraw(cx, t); tex.needsUpdate = true; }
    const appeared = ep.notesIn ? ep.notesIn(t) : 0;
    notes.forEach((g, i) => { const inU = Math.max(0, Math.min(1, (appeared * 46 - i) / 1.2)), ot = ep.notesOutT ? ep.notesOutT(i) : 1e9, gone = Math.max(0, 1 - Math.max(0, t - ot) * 4); g.visible = inU > 0 && gone > 0.01; g.scale.setScalar(Math.max(0.01, (0.2 + 0.8 * pop(inU)) * gone)); }); };
  return { room, upd };
}
