// EXPRESSIVE CHARACTERS: full-body 3D people with the expressive face system (DRAFT, waiting for Dalia's approval).
// Same soft pastel toy look as robots.js, but with real eyes, brows, nose, mouth and teeth (see faces.js).
//
//   import { createExpressiveKit } from './body.js';
//   const kit = createRobotKit(THREE, RoundedBoxGeometry);          // from ../robots.js (for the shared helpers)
//   const xk  = createExpressiveKit(THREE, RoundedBoxGeometry, kit);
//   const c = xk.mkExpressive({ parent: scene, x: 0, skin: '#e3b88d', hair: '#3a2c3e', hairStyle: 'bun', top: '#5a5f9c' });
//   every frame:  xk.animateExpressive(c, t, { face: EXPR['smirk'], pose: 'hips', talk: 0.6 });
//
// hairStyle: bun, short, bob, long, curly, ponytail, bald     pose: idle hips shrug facepalm wave armsUp crossed point think
import { drawFace, EXPR, life, lerpFace, DEF } from './faces.js';

export function createExpressiveKit(THREE, RoundedBoxGeometry, kit) {
  const { box, cyl, ball, mat } = kit;
  const hexn = c => (typeof c === 'string' ? parseInt(c.slice(1), 16) : c);
  const D2R = Math.PI / 180, lerp = (a, b, t) => a + (b - a) * t, clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const SMOOTH = t => { t = clamp(t); return t * t * (3 - 2 * t); };

  // a rounded "squircle" blob (boxy sphere) so the head looks like a soft toy
  const N = 3;
  function blob(rx, ry, rz, o = {}) {
    const g = new THREE.SphereGeometry(1, o.ws || 56, o.hs || 40, o.phiStart || 0, o.phiLen ?? Math.PI * 2, o.thStart || 0, o.thLen ?? Math.PI);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const k = 1 / Math.pow(Math.pow(Math.abs(x), N) + Math.pow(Math.abs(y), N) + Math.pow(Math.abs(z), N), 1 / N) || 1;
      pos.setXYZ(i, x * k * rx, y * k * ry, z * k * rz);
    }
    g.computeVertexNormals(); return g;
  }
  // a soft egg for the torso: wide at the bottom, narrower at the top (sx, sy, sz = radii at the widest part)
  function egg(sx, sy, sz) {
    const g = new THREE.SphereGeometry(1, 48, 36), pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const w = 1 - 0.34 * smooth01((y + 0.15) / 1.15);            // narrower toward the top
      pos.setXYZ(i, x * sx * w, y * sy, z * sz * w);
    }
    g.computeVertexNormals(); return g;
  }
  const smooth01 = t => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
  // z of the front surface of the egg at (x, y) in body space (used to stick the badge strap on the front)
  function eggZ(x, y) { const yy = (y - 2.95) / 1.55, w = 1 - 0.34 * smooth01((yy + 0.15) / 1.15), rx = 1.28 * w, rz = 0.98 * w; const q = 1 - (x / rx) ** 2 - yy * yy; return rz * Math.sqrt(Math.max(0.02, q)); }
  const HEAD = { rx: 1.5, ry: 1.3, rz: 1.2 };
  // the face decal: same blob, slightly bigger, UV mapped straight from the front so the 2D face fits exactly
  function facePatch() {
    const g = blob(HEAD.rx * 1.012, HEAD.ry * 1.012, HEAD.rz * 1.012, { ws: 64, hs: 48 }), pos = g.attributes.position, uv = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      if (z < 0.05) { uv[i * 2] = -10; uv[i * 2 + 1] = -10; continue; }
      uv[i * 2] = (512 + x * 300) / 1024; uv[i * 2 + 1] = 1 - (450 - y * 296.15) / 860;
    }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g;
  }
  const FACE_GEO = facePatch();

  // Poses: where the ELBOW (e) and HAND (h) go, [x, y, z], for the right arm. The left arm uses the same numbers mirrored,
  // unless a pose gives its own `L`. The arm is one smooth tube that bends through those points (like noodle arms).
  const SHOULDER = [0.55, 3.8, 0.0];
  const POSES = {
    idle:     { R: { e: [1.75, 3.05, 0.15], h: [1.95, 2.1, 0.3] } },
    hips:     { R: { e: [2.55, 3.15, -0.15], h: [1.5, 2.45, 0.4] } },
    shrug:    { R: { e: [2.25, 3.6, 0.25], h: [3.0, 4.15, 0.95] }, lift: 0.3 },
    facepalm: { R: { e: [2.1, 4.2, 1.05], h: [0.3, 5.45, 2.0] }, L: { e: [-1.75, 3.05, 0.15], h: [-1.95, 2.1, 0.3] } },
    wave:     { R: { e: [2.55, 4.7, 0.45], h: [3.0, 6.3, 0.5] }, L: { e: [-1.75, 3.05, 0.15], h: [-1.95, 2.1, 0.3] } },
    armsUp:   { R: { e: [2.7, 5.0, 0.2], h: [2.5, 6.9, 0.3] } },
    crossed:  { R: { e: [1.9, 2.95, 1.05], h: [-0.9, 3.45, 1.55] }, L: { e: [-1.9, 2.8, 0.85], h: [0.9, 3.15, 1.35] } },
    point:    { R: { e: [1.95, 3.6, 1.0], h: [2.5, 4.05, 2.7] }, L: { e: [-1.75, 3.05, 0.15], h: [-1.95, 2.1, 0.3] } },
    think:    { R: { e: [1.7, 3.6, 0.95], h: [0.55, 4.45, 1.85] }, L: { e: [-1.9, 2.8, 0.85], h: [0.9, 3.1, 1.35] } },
  };

  function mkExpressive(o = {}) {
    const O = Object.assign({ x: 0, y: 0, z: 0, ry: 0, scale: 1, skin: '#e3b88d', hair: '#3a2c3e', hairStyle: 'bun', top: '#5a5f9c', bottom: '#3c4a78', shoe: '#f8f5fc', glasses: false, kid: false, brow: null, eye: '#5a3a30', lanyard: null, headset: false }, o);
    const skin = hexn(O.skin), hair = hexn(O.hair), top = hexn(O.top), bottom = hexn(O.bottom);
    const g = new THREE.Group(); g.position.set(O.x, O.y, O.z); g.rotation.y = O.ry; g.scale.setScalar((O.kid ? 0.74 : 1) * O.scale); if (O.parent) O.parent.add(g);
    const body = new THREE.Group(); g.add(body);
    const bodyG = new THREE.Group(); body.add(bodyG);   // torso and everything above the hips (leans and bounces)
    // legs: short stubby tubes ending in big round shoes (like the Claim Line people)
    const shoeC = hexn(O.shoe);
    const legs = [-1, 1].map(s => {
      const l = new THREE.Group(); l.position.set(s * 0.55, 1.5, 0); g.add(l);
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.36, 0.75, 6, 14), mat(bottom)); leg.position.set(0, -0.55, 0); leg.castShadow = true; l.add(leg);
      const shoe = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), mat(shoeC, { roughness: 0.45 })); shoe.scale.set(0.58, 0.46, 0.82); shoe.position.set(0, -1.1, 0.2); shoe.castShadow = true; l.add(shoe);
      return l;
    });
    // torso: ONE soft egg shape, wider at the bottom, no neck. The head sits right on top of it.
    const torso = new THREE.Mesh(egg(1.28, 1.55, 0.98), mat(top, { roughness: 0.6 })); torso.position.set(0, 2.95, 0); torso.castShadow = true; torso.receiveShadow = true; bodyG.add(torso);
    if (O.lanyard) {   // a thin strap that follows the front of the egg, with a small badge
      const pts = []; for (let i = 0; i <= 10; i++) { const u = i / 10, x = (1 - Math.abs(u * 2 - 1)) * 0 + (u < 0.5 ? -1 : 1) * (0.5 - Math.abs(u - 0.5)) * 1.0; const yy = 4.35 - Math.sin(Math.min(u, 1 - u) * Math.PI) * 1.05; pts.push([x, yy]); }
      const curve = new THREE.CatmullRomCurve3([[-0.62, 4.42], [-0.38, 3.9], [0, 3.35], [0.38, 3.9], [0.62, 4.42]].map(([x, y]) => new THREE.Vector3(x, y, eggZ(x, y) + 0.03)));
      const lan = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.07, 6, false), new THREE.MeshBasicMaterial({ color: hexn(O.lanyard) })); bodyG.add(lan);
      const badge = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.62, 0.08, 3, 0.08), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })); badge.position.set(0, 3.1, eggZ(0, 3.1) + 0.06); badge.rotation.x = -0.12; bodyG.add(badge);
    }
    // head (its chin overlaps the top of the torso)
    const head = new THREE.Group(); head.position.set(0, 5.5, 0); bodyG.add(head);
    const hm = new THREE.Mesh(blob(HEAD.rx, HEAD.ry, HEAD.rz), mat(skin, { roughness: 0.62 })); hm.castShadow = true; hm.receiveShadow = true; head.add(hm);
    for (const s of [-1, 1]) { const e = ball(head, 0.36, skin, s * 1.5, -0.15, 0, { noShadow: true }); e.scale.set(0.5, 1.2, 1); }
    // face (canvas texture drawn by faces.js)
    const fc = document.createElement('canvas'); fc.width = 1024; fc.height = 860; const fx = fc.getContext('2d');
    const ft = new THREE.CanvasTexture(fc); ft.colorSpace = THREE.SRGBColorSpace; ft.wrapS = ft.wrapT = THREE.ClampToEdgeWrapping; ft.anisotropy = 4; ft.generateMipmaps = false; ft.minFilter = THREE.LinearFilter;
    const face = new THREE.Mesh(FACE_GEO, new THREE.MeshBasicMaterial({ map: ft, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, toneMapped: false })); face.renderOrder = 2; head.add(face);
    // hair
    const hmat = mat(hair, { roughness: 0.5 }), st = O.hairStyle;
    const shell = (s, thL, tilt, extra = {}) => { const m = new THREE.Mesh(blob(HEAD.rx * s, HEAD.ry * s, HEAD.rz * s, Object.assign({ thLen: thL }, extra)), hmat); m.rotation.x = -tilt; m.castShadow = true; head.add(m); return m; };
    if (st !== 'bald') {
      shell(1.07, 76 * D2R, 29 * D2R);
      if (st === 'bun') ball(head, 0.72, hair, 0, 1.75, -0.35, { m: { roughness: 0.5 } });
      if (st === 'ponytail') { const pt = box(head, 0.7, 2.0, 0.7, hair, 0, 0.2, -1.5, { round: 0.3 }); pt.rotation.x = 0.35; }
      if (st === 'bob' || st === 'long') {
        const dropY = st === 'long' ? -1.9 : -0.85, h = st === 'long' ? 3.3 : 2.3;
        box(head, 3.2, h, 0.9, hair, 0, dropY + 0.5, -0.85, { round: 0.45 });
        for (const s of [-1, 1]) box(head, 0.55, h * 0.75, 1.5, hair, s * 1.48, dropY + 0.85, -0.25, { round: 0.25 });
      }
      if (st === 'curly') for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ball(head, 0.68, hair, Math.cos(a) * 1.52, 0.35 + Math.sin(a) * 1.05, -0.25, { m: { roughness: 0.5 } }); }
      if (st === 'short') for (const s of [-1, 1]) box(head, 0.4, 1.0, 1.7, hair, s * 1.44, 0.35, -0.2, { round: 0.18 });
    }
    if (O.glasses) for (const s of [-1, 1]) { const rg = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 10, 28), new THREE.MeshBasicMaterial({ color: 0x3a2f4a })); rg.position.set(s * 0.607, 0.09, 1.15); head.add(rg); }
    if (O.glasses) { const br = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.06, 0.06), new THREE.MeshBasicMaterial({ color: 0x3a2f4a })); br.position.set(0, 0.13, 1.17); head.add(br); }
    // arms: ONE smooth tube each, coming out of the side of the torso, bending like a noodle, ending in a round mitten
    const sleeve = mat(top, { roughness: 0.6 });
    const arms = [-1, 1].map(s => {
      const grp = new THREE.Group(); bodyG.add(grp);
      const tube = new THREE.Mesh(new THREE.BufferGeometry(), sleeve); tube.castShadow = true; grp.add(tube);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.43, 18, 14), mat(skin)); hand.castShadow = true; grp.add(hand);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.37, 14, 12), sleeve); grp.add(cap);   // rounded shoulder end, hidden inside the torso
      return { grp, tube, hand, cap, side: s, e: new THREE.Vector3(), h: new THREE.Vector3() };
    });
    // shadow blob under the feet is left to the scene (soft shadows already handle it)
    const c = { g, body, bodyG, head, face, fx, ft, arms, legs, O, blink: Math.random() * 6, pose: Object.assign({}, POSES.idle), seed: Math.random() * 10 };
    drawFace(fx, EXPR.neutral, { skin: O.skin, brow: O.brow || shadeBrow(O.hair), iris: O.eye }); ft.needsUpdate = true;
    return c;
  }
  const shadeBrow = hex => { const n = parseInt(hex.slice(1), 16); const f = 0.8; return `rgb(${((n >> 16) & 255) * f | 0},${((n >> 8) & 255) * f | 0},${(n & 255) * f | 0})`; };

  // poseName: a name from POSES, or [nameA, nameB, k] to blend. t = seconds.
  const V3 = (a, mx = 1) => new THREE.Vector3(a[0] * mx, a[1], a[2]);
  function armPoints(P, side) {
    const sp = P[side < 0 ? 'L' : 'R'] || (P.R && { e: [-P.R.e[0], P.R.e[1], P.R.e[2]], h: [-P.R.h[0], P.R.h[1], P.R.h[2]] });
    return sp;
  }
  function applyPose(c, name, t, extra = {}) {
    const get = n => POSES[n] || POSES.idle;
    let A, B, k = 0; if (Array.isArray(name)) { A = get(name[0]); B = get(name[1]); k = SMOOTH(name[2]); } else { A = get(name); B = A; }
    const lift = lerp(A.lift || 0, B.lift || 0, k);
    c.arms.forEach((a, i) => {
      const pa = armPoints(A, a.side), pb = armPoints(B, a.side);
      const e = V3(pa.e).lerp(V3(pb.e), k), h = V3(pa.h).lerp(V3(pb.h), k);
      const br = Math.sin(t * 1.6 + i) * 0.04; h.y += br; e.y += br * 0.5;
      if (extra.wave && a.side > 0) { h.x += Math.sin(t * 9) * 0.45; e.x += Math.sin(t * 9 + 0.6) * 0.12; }
      e.y += lift * 0.5; h.y += lift;
      const S = new THREE.Vector3(a.side * SHOULDER[0], SHOULDER[1] + lift * 0.4, SHOULDER[2]);
      const C = e.clone().multiplyScalar(2).sub(S.clone().add(h).multiplyScalar(0.5));       // control point so the curve passes by the elbow
      const curve = new THREE.QuadraticBezierCurve3(S, C, h);
      a.tube.geometry.dispose(); a.tube.geometry = new THREE.TubeGeometry(curve, 18, 0.34, 14, false);
      a.hand.position.copy(h); a.cap.position.copy(S);
    });
  }

  // face: a params object from EXPR / mix(); pose: name or [a,b,k]; talk: 0..1 mouth movement; extra body motion options
  function animateExpressive(c, t, st = {}) {
    let p = st.face || EXPR.neutral;
    if (st.alive !== false) p = life(p, t, c.seed, 1);
    if (st.talk) { const a = clamp(st.talk) * (0.5 + 0.5 * Math.sin(t * 13 + c.seed)) ; p = Object.assign({}, p, { mOpen: Math.max(p.mOpen, a * 0.75), teethT: Math.max(p.teethT, a * 0.5) }); }
    if (st.quiver) p = Object.assign({}, p, { mY: p.mY + Math.sin(t * 38) * 0.05 * st.quiver, mW: p.mW * (1 + Math.sin(t * 30) * 0.03 * st.quiver) });
    drawFace(c.fx, p, { skin: c.O.skin, brow: c.O.brow || shadeBrow(c.O.hair), iris: c.O.eye }); c.ft.needsUpdate = true;
    applyPose(c, st.pose || 'idle', t, st);
    // head and body language from the face: tilt for doubt/sadness, lift for pride, shake for rage, bounce for laughing
    const sad = clamp(-(p.sL + p.sR) / 2), joy = clamp((p.sL + p.sR) / 2), angry = clamp((p.lSlant + p.rSlant) / 2), up = clamp(p.lBy + p.rBy - 0.6, 0, 1);
    const tilt = (st.tilt ?? ((p.lBy - p.rBy) * -0.1 + sad * 0.05)) + Math.sin(t * 1.1 + c.seed) * 0.015;
    c.head.rotation.set((st.nod || 0) + sad * 0.08 - up * 0.04 + Math.sin(t * 0.8 + c.seed) * 0.01, (st.turn || 0), tilt);
    const laugh = st.laugh || 0, shake = st.shake || 0;
    c.bodyG.position.y = Math.abs(Math.sin(t * 13)) * 0.09 * laugh + Math.sin(t * 1.6 + c.seed) * 0.02;
    c.bodyG.position.x = Math.sin(t * 48) * 0.035 * shake;
    c.bodyG.rotation.z = (st.lean || 0) + Math.sin(t * 22) * 0.012 * laugh;
    c.bodyG.rotation.x = (st.slump || 0);
    return p;
  }

  const PEOPLE_X = [   // the starter cast: a mix of skin tones, hair and outfits (more can be added the same way)
    { name: 'mara', skin: '#e3b88d', hair: '#3a2c3e', hairStyle: 'bun', top: '#5a5f9c', lanyard: '#46b98a' },
    { name: 'theo', skin: '#7a4a2e', hair: '#1b1416', hairStyle: 'short', top: '#f0b84a', bottom: '#46507a' },
    { name: 'priya', skin: '#c98f64', hair: '#1e1520', hairStyle: 'bob', top: '#e8708f', bottom: '#4a3c6a' },
    { name: 'june', skin: '#f1cfae', hair: '#c9c4d4', hairStyle: 'bun', top: '#6bb7a0', glasses: true, bottom: '#5a5470' },
    { name: 'kai', skin: '#b07a52', hair: '#2a1c14', hairStyle: 'curly', top: '#7ec8f0', kid: true, bottom: '#e8a05a' },
  ];
  return { mkExpressive, animateExpressive, POSES, PEOPLE_X, blob, HEAD };
}
