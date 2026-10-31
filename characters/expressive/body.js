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

  const POSES = {   // per arm: [out, forward, elbowBend, forearmInward] in degrees; lift = shoulder raise
    idle:     { L: [9, 0, 10, 0],    R: [9, 0, 10, 0] },
    hips:     { L: [38, 0, 0, 82],   R: [38, 0, 0, 82] },
    shrug:    { L: [24, 0, 20, -55], R: [24, 0, 20, -55], lift: 0.28 },
    facepalm: { L: [9, 0, 10, 0],    R: [6, 96, 128, 52] },
    wave:     { L: [9, 0, 10, 0],    R: [150, 0, 30, 0] },
    armsUp:   { L: [165, 0, 10, 0],  R: [165, 0, 10, 0] },
    crossed:  { L: [12, 28, 95, 62], R: [12, 28, 95, 62] },
    point:    { L: [9, 0, 10, 0],    R: [8, 84, 6, 0] },
    think:    { L: [12, 30, 95, 62], R: [10, 70, 135, 28] },
  };

  function mkExpressive(o = {}) {
    const O = Object.assign({ x: 0, y: 0, z: 0, ry: 0, scale: 1, skin: '#e3b88d', hair: '#3a2c3e', hairStyle: 'bun', top: '#5a5f9c', bottom: '#3c4a78', shoe: '#f8f5fc', glasses: false, kid: false, brow: null, eye: '#5a3a30', lanyard: null, headset: false }, o);
    const skin = hexn(O.skin), hair = hexn(O.hair), top = hexn(O.top), bottom = hexn(O.bottom);
    const g = new THREE.Group(); g.position.set(O.x, O.y, O.z); g.rotation.y = O.ry; g.scale.setScalar((O.kid ? 0.74 : 1) * O.scale); if (O.parent) O.parent.add(g);
    const body = new THREE.Group(); g.add(body);
    const bodyG = new THREE.Group(); body.add(bodyG);   // torso and everything above the hips (leans and bounces)
    // legs and shoes
    const legs = [-1, 1].map(s => { const l = new THREE.Group(); l.position.set(s * 0.52, 2.62, 0); g.add(l); box(l, 0.9, 2.0, 0.95, bottom, 0, -1.05, 0, { round: 0.34 }); box(l, 1.0, 0.55, 1.45, hexn(O.shoe), 0, -2.3, 0.22, { round: 0.26 }); return l; });
    // torso
    box(bodyG, 2.2, 2.25, 1.4, top, 0, 3.82, 0, { round: 0.62 });
    box(bodyG, 1.0, 0.34, 0.1, 0xffffff, 0, 4.78, 0.62, { round: 0.1, noShadow: true });       // collar
    if (O.lanyard) { box(bodyG, 0.16, 1.2, 0.05, hexn(O.lanyard), 0, 4.15, 0.72, { round: 0.05, noShadow: true }); box(bodyG, 0.5, 0.65, 0.07, 0xffffff, 0, 3.25, 0.74, { round: 0.1, noShadow: true }); }
    cyl(bodyG, 0.36, 0.5, skin, 0, 5.05, 0, { seg: 16 });
    // head
    const head = new THREE.Group(); head.position.set(0, 6.5, 0); bodyG.add(head);
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
    // arms
    const arms = [-1, 1].map((s, i) => {
      const sh = new THREE.Group(); sh.position.set(s * 1.35, 4.55, 0); bodyG.add(sh);
      box(sh, 0.62, 1.35, 0.62, top, 0, -0.62, 0, { round: 0.26 });
      const el = new THREE.Group(); el.position.set(0, -1.22, 0); sh.add(el);
      box(el, 0.54, 1.15, 0.54, top, 0, -0.5, 0, { round: 0.24 });
      const hand = ball(el, 0.4, skin, 0, -1.18, 0, {}); const thumb = ball(el, 0.17, skin, -s * 0.3, -1.02, 0.18, { noShadow: true });
      return { sh, el, side: s };
    });
    // shadow blob under the feet is left to the scene (soft shadows already handle it)
    const c = { g, body, bodyG, head, face, fx, ft, arms, legs, O, blink: Math.random() * 6, pose: Object.assign({}, POSES.idle), seed: Math.random() * 10 };
    drawFace(fx, EXPR.neutral, { skin: O.skin, brow: O.brow || shadeBrow(O.hair), iris: O.eye }); ft.needsUpdate = true;
    return c;
  }
  const shadeBrow = hex => { const n = parseInt(hex.slice(1), 16); const f = 0.8; return `rgb(${((n >> 16) & 255) * f | 0},${((n >> 8) & 255) * f | 0},${(n & 255) * f | 0})`; };

  // poseName: a name from POSES, or [nameA, nameB, k] to blend. t = seconds.
  function applyPose(c, name, t, extra = {}) {
    const get = n => POSES[n] || POSES.idle;
    let A, B, k = 0; if (Array.isArray(name)) { A = get(name[0]); B = get(name[1]); k = SMOOTH(name[2]); } else { A = get(name); B = A; }
    const sw = extra.wave ? Math.sin(t * 9) * 16 : 0;
    c.arms.forEach((a, i) => {
      const key = a.side < 0 ? 'L' : 'R';
      const v = [0, 1, 2, 3].map(j => lerp(A[key][j], B[key][j], k)), lift = lerp(A.lift || 0, B.lift || 0, k);
      const breathe = Math.sin(t * 1.6 + i) * 1.2;
      a.sh.position.y = 4.55 + lift;
      const out = v[0] + breathe + (key === 'R' ? sw : 0);
      a.sh.rotation.set(-v[1] * D2R, 0, a.side * out * D2R);          // lift the arm: forward (x) and out to the side (z)
      a.el.rotation.set(-v[2] * D2R, 0, -a.side * v[3] * D2R);        // bend the elbow, turn the forearm toward the body
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
