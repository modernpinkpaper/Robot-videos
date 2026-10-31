// EXPRESSIVE CHARACTERS: full-body 3D people with the expressive face system (DRAFT, waiting for Dalia's approval).
// Same soft pastel toy look as robots.js, but with real eyes, brows, nose, mouth and teeth (see faces.js).
//
//   import { createExpressiveKit } from './body.js';
//   const kit = createRobotKit(THREE, RoundedBoxGeometry);          // from ../robots.js (for the shared helpers)
//   const xk  = createExpressiveKit(THREE, RoundedBoxGeometry, kit);
//   const c = xk.mkExpressive({ parent: scene, x: 0, ...xk.ROSTER.find(p => p.name === 'theo') });
//   every frame:  xk.animateExpressive(c, t, { face: EXPR['smirk'], pose: 'hips', talk: 0.6 });
//
// The body (like the Claim Line people): ONE soft egg torso, no neck (the head sits on it), noodle-tube arms that come out of the
// sides of the torso and end in round mitts, short stubby legs with big round shoes.
// Each character is a recipe (see ROSTER): head shape, build, hair, face design (eye size, lashes, freckles, mustache, beard...), clothes.
import { drawFace, EXPR, life } from './faces.js';

export function createExpressiveKit(THREE, RoundedBoxGeometry, kit) {
  const { box, ball, mat } = kit;
  const hexn = c => (typeof c === 'string' ? parseInt(c.slice(1), 16) : c);
  const D2R = Math.PI / 180, lerp = (a, b, t) => a + (b - a) * t, clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const SMOOTH = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const smooth01 = SMOOTH;

  // ---------- shapes ----------
  // a boxy sphere ("squircle") so heads look like soft toys. n = how boxy (2 = sphere, 3 = soft box, 4 = squarer)
  function blob(rx, ry, rz, o = {}) {
    const n = o.n || 3;
    const g = new THREE.SphereGeometry(1, o.ws || 56, o.hs || 40, o.phiStart || 0, o.phiLen ?? Math.PI * 2, o.thStart || 0, o.thLen ?? Math.PI), pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const k = 1 / Math.pow(Math.pow(Math.abs(x), n) + Math.pow(Math.abs(y), n) + Math.pow(Math.abs(z), n), 1 / n) || 1;
      pos.setXYZ(i, x * k * rx, y * k * ry, z * k * rz);
    }
    g.computeVertexNormals(); return g;
  }
  const HEAD = { rx: 1.5, ry: 1.3, rz: 1.2, n: 3 };
  // the torso: a soft egg, wider at the bottom, narrower at the top. dims = radii at the widest part.
  function egg(sx, sy, sz, o = {}) {
    const g = new THREE.SphereGeometry(1, 48, 36, o.phiStart || 0, o.phiLen ?? Math.PI * 2, o.thStart || 0, o.thLen ?? Math.PI), pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), w = 1 - 0.34 * smooth01((y + 0.15) / 1.15); pos.setXYZ(i, x * sx * w, y * sy, z * sz * w); }
    g.computeVertexNormals(); return g;
  }
  // z of the front surface of the egg at body position (x, y)
  function eggZ(x, y, d) { const yy = (y - d.yc) / d.sy, w = 1 - 0.34 * smooth01((yy + 0.15) / 1.15), rx = d.sx * w, rz = d.sz * w, q = 1 - (x / rx) ** 2 - yy * yy; return rz * Math.sqrt(Math.max(0.02, q)); }
  // the face decal: same blob, slightly bigger, UV mapped straight from the front so the 2D face fits exactly
  const faceGeoCache = {};
  function facePatch(h) {
    const key = [h.rx, h.ry, h.rz, h.n].join(','); if (faceGeoCache[key]) return faceGeoCache[key];
    const g = blob(h.rx * 1.012, h.ry * 1.012, h.rz * 1.012, { ws: 64, hs: 48, n: h.n }), pos = g.attributes.position, uv = new Float32Array(pos.count * 2);
    const sx = 900 / (2 * h.rx), sy = 770 / (2 * h.ry);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      if (z < 0.05) { uv[i * 2] = -10; uv[i * 2 + 1] = -10; continue; }
      uv[i * 2] = (512 + x * sx) / 1024; uv[i * 2 + 1] = 1 - (450 - y * sy) / 860;
    }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return (faceGeoCache[key] = g);
  }
  // simple fabric patterns for tops
  function patternTex(type, c1, c2) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d'); x.fillStyle = c1; x.fillRect(0, 0, 128, 128); x.fillStyle = c2;
    if (type === 'stripes') for (let i = 0; i < 128; i += 32) x.fillRect(0, i, 128, 16);
    if (type === 'weave') { for (let i = 0; i < 128; i += 16) { x.fillRect(0, i, 128, 3); x.fillRect(i, 0, 3, 128); } }
    if (type === 'dots') for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { x.beginPath(); x.arc(16 + i * 32 + (j % 2) * 16, 16 + j * 32, 7, 0, 7); x.fill(); }
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(type === 'stripes' ? 1 : 3, type === 'stripes' ? 4 : 3); return t;
  }
  // a flat rectangular glasses frame (rounded corners, hollow in the middle)
  function frameGeo(w, h, d) {
    const rr = (p, x0, y0, W, H, r) => { p.moveTo(x0 + r, y0); p.lineTo(x0 + W - r, y0); p.quadraticCurveTo(x0 + W, y0, x0 + W, y0 + r); p.lineTo(x0 + W, y0 + H - r); p.quadraticCurveTo(x0 + W, y0 + H, x0 + W - r, y0 + H); p.lineTo(x0 + r, y0 + H); p.quadraticCurveTo(x0, y0 + H, x0, y0 + H - r); p.lineTo(x0, y0 + r); p.quadraticCurveTo(x0, y0, x0 + r, y0); return p; };
    const sh = rr(new THREE.Shape(), -w / 2, -h / 2, w, h, 0.14), hole = rr(new THREE.Path(), -w / 2 + 0.08, -h / 2 + 0.08, w - 0.16, h - 0.16, 0.08);
    sh.holes.push(hole); return new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false });
  }

  // ---------- poses ----------
  // Where the ELBOW (e) and HAND (h) go, [x, y, z], for the right arm. The left arm mirrors it unless a pose gives its own L.
  // Each arm is ONE smooth tube that bends through those points. Arms have a fixed length (ARM_LEN): if a pose asks for a longer reach
  // the hand is pulled in. hy:true = the hand goes to the FACE, so it follows the head height instead of the torso.
  const ARM_LEN = 2.05;
  const IDLE_L = { e: [-1.75, 3.05, 0.15], h: [-1.95, 2.1, 0.3] };
  const POSES = {
    idle:     { R: { e: [1.75, 3.05, 0.15], h: [1.95, 2.1, 0.3] } },
    hips:     { R: { e: [2.5, 3.2, -0.15], h: [1.45, 2.45, 0.4] } },
    shrug:    { R: { e: [2.2, 3.6, 0.25], h: [2.5, 4.1, 0.9] }, lift: 0.3 },
    facepalm: { R: { e: [2.0, 4.3, 1.0], h: [0.8, 4.85, 1.55], hy: true }, L: IDLE_L },
    wave:     { R: { e: [2.3, 4.6, 0.4], h: [2.3, 5.9, 0.4] }, L: IDLE_L },
    armsUp:   { R: { e: [2.5, 4.8, 0.2], h: [2.2, 6.2, 0.3] } },
    crossed:  { R: { e: [1.9, 2.95, 1.05], h: [-0.35, 3.3, 1.5] }, L: { e: [-1.9, 2.8, 0.85], h: [0.35, 3.05, 1.35] } },
    point:    { R: { e: [1.7, 3.6, 0.9], h: [1.9, 4.0, 2.0] }, L: IDLE_L },
    think:    { R: { e: [1.5, 3.7, 0.8], h: [0.55, 4.2, 1.45], hy: true }, L: { e: [-1.9, 2.8, 0.85], h: [0.35, 3.05, 1.35] } },
  };

  // ---------- one character ----------
  function mkExpressive(o = {}) {
    const O = Object.assign({ x: 0, y: 0, z: 0, ry: 0, scale: 1, skin: '#e3b88d', hair: '#3a2c3e', hairStyle: 'bun', top: '#5a5f9c', bottom: '#3c4a78', shoe: '#f8f5fc', glasses: null, glassesColor: '#3a2f4a', eye: '#5a3a30', lanyard: null, hood: false, overalls: null, pattern: null, kid: false }, o);
    const B = Object.assign({ w: 1, h: 1, leg: 1, head: 1, arm: 1 }, O.build), HD = Object.assign({}, HEAD, O.head);
    const skin = hexn(O.skin), hair = hexn(O.hair), top = hexn(O.top), bottom = hexn(O.bottom);
    const g = new THREE.Group(); g.position.set(O.x, O.y, O.z); g.rotation.y = O.ry; g.scale.setScalar((O.kid ? 0.8 : 1) * O.scale); if (O.parent) O.parent.add(g);
    const body = new THREE.Group(); g.add(body);
    const bodyG = new THREE.Group(); body.add(bodyG);   // torso, arms and head (leans and bounces)
    // measurements
    const hipY = 0.4 + 1.1 * B.leg, tc = hipY - 0.1 + 1.55 * B.h, topY = tc + 1.55 * B.h, headY = topY - 0.3 + HD.ry * B.head;
    const D = { sx: 1.28 * B.w, sy: 1.55 * B.h, sz: 0.98 * B.w, yc: tc };
    // legs: short stubby tubes ending in big round shoes
    const legs = [-1, 1].map(s => {
      const l = new THREE.Group(); l.position.set(s * 0.55 * B.w, hipY, 0); g.add(l);
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.36, 0.75 * B.leg, 6, 14), mat(bottom)); leg.position.set(0, -0.55 * B.leg, 0); leg.castShadow = true; l.add(leg);
      const shoe = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), mat(hexn(O.shoe), { roughness: 0.45 })); shoe.scale.set(0.58, 0.46, 0.82); shoe.position.set(0, -1.1 * B.leg, 0.2); shoe.castShadow = true; l.add(shoe);
      return l;
    });
    // torso: ONE soft egg, no neck
    const tmat = O.pattern ? new THREE.MeshStandardMaterial({ map: patternTex(O.pattern.type, O.top, O.pattern.color2), roughness: 0.6, metalness: 0.05 }) : mat(top, { roughness: 0.6 });
    const torso = new THREE.Mesh(egg(D.sx, D.sy, D.sz), tmat); torso.position.set(0, tc, 0); torso.castShadow = true; torso.receiveShadow = true; bodyG.add(torso);
    if (O.hood) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.78 * B.w, 0.3, 14, 32), mat(hexn(O.hood), { roughness: 0.65 })); ring.rotation.x = Math.PI / 2; ring.scale.set(1.05, 0.9, 1); ring.position.set(0, topY - 0.22, -0.05); ring.castShadow = true; bodyG.add(ring); }
    if (O.overalls) {   // a bib on the front of the egg, two straps and two buttons
      const ob = mat(hexn(O.overalls), { roughness: 0.65 });
      const bib = new THREE.Mesh(egg(D.sx * 1.03, D.sy * 1.02, D.sz * 1.04, { thStart: 1.0, thLen: Math.PI - 1.0, phiStart: 0.22 * Math.PI, phiLen: 0.56 * Math.PI }), ob); bib.position.set(0, tc, 0); bib.castShadow = true; bodyG.add(bib);
      const yb = tc + 1.55 * B.h * Math.cos(1.0);
      for (const s of [-1, 1]) {
        const pts = [[s * 0.42, yb], [s * 0.42, yb + 0.5 * B.h], [s * 0.36, yb + 0.95 * B.h]].map(([x, y]) => new THREE.Vector3(x, y, eggZ(x, y, D) + 0.05));
        bodyG.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 10, 0.1, 8, false), ob));
        const bt = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), new THREE.MeshStandardMaterial({ color: 0xf6d36a })); bt.position.set(s * 0.42, yb + 0.02, eggZ(s * 0.42, yb, D) + 0.1); bodyG.add(bt);
      }
    }
    if (O.lanyard) {   // a thin strap that follows the front of the egg, with a small badge
      const y0 = topY - 0.1, pts = [[-0.62, y0], [-0.38, y0 - 0.5], [0, y0 - 1.05], [0.38, y0 - 0.5], [0.62, y0]].map(([x, y]) => new THREE.Vector3(x, y, eggZ(x, y, D) + 0.03));
      bodyG.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.07, 6, false), new THREE.MeshBasicMaterial({ color: hexn(O.lanyard) })));
      const badge = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.62, 0.08, 3, 0.08), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })); badge.position.set(0, y0 - 1.35, eggZ(0, y0 - 1.35, D) + 0.06); badge.rotation.x = -0.12; bodyG.add(badge);
    }
    if (O.buttons) {   // a row of buttons down the middle of the front
      for (let i = 0; i < 4; i++) { const y = topY - 1.25 - i * 0.62 * B.h; const bt = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), new THREE.MeshStandardMaterial({ color: hexn(O.buttons), roughness: 0.3, metalness: 0.5 })); bt.scale.z = 0.6; bt.position.set(0, y, eggZ(0, y, D) + 0.04); bodyG.add(bt); }
    }
    // head (its chin overlaps the top of the torso)
    const head = new THREE.Group(); head.position.set(0, headY, 0); head.scale.setScalar(B.head); bodyG.add(head);
    const hm = new THREE.Mesh(blob(HD.rx, HD.ry, HD.rz, { n: HD.n }), mat(skin, { roughness: 0.62 })); hm.castShadow = true; hm.receiveShadow = true; head.add(hm);
    for (const s of [-1, 1]) { const e = ball(head, 0.36, skin, s * HD.rx * 0.99, -0.15, 0, { noShadow: true }); e.scale.set(0.5, 1.2, 1); }
    // face (canvas texture drawn by faces.js)
    const fc = document.createElement('canvas'); fc.width = 1024; fc.height = 860; const fx = fc.getContext('2d');
    const ft = new THREE.CanvasTexture(fc); ft.colorSpace = THREE.SRGBColorSpace; ft.wrapS = ft.wrapT = THREE.ClampToEdgeWrapping; ft.anisotropy = 4; ft.generateMipmaps = false; ft.minFilter = THREE.LinearFilter;
    const face = new THREE.Mesh(facePatch(HD), new THREE.MeshBasicMaterial({ map: ft, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, toneMapped: false })); face.renderOrder = 2; head.add(face);
    // hair
    const hmat = mat(hair, { roughness: 0.5 }), st = O.hairStyle, rx = HD.rx, ry = HD.ry, rz = HD.rz;
    const shell = (s, thL, tilt, extra = {}) => { const m = new THREE.Mesh(blob(rx * s, ry * s, rz * s, Object.assign({ thLen: thL, n: HD.n }, extra)), hmat); m.rotation.x = -tilt; m.castShadow = true; head.add(m); return m; };
    const cap = (s = 1.07) => shell(s, 76 * D2R, 29 * D2R);
    const hb = (w, h, d, x, y, z, r = 0.25) => box(head, w, h, d, hair, x, y, z, { round: r });
    if (st === 'bun') { cap(); ball(head, 0.72, hair, 0, ry * 1.35, -0.35, { m: { roughness: 0.5 } }); }
    else if (st === 'buzz') shell(1.03, 74 * D2R, 26 * D2R);
    else if (st === 'short') { cap(); for (const s of [-1, 1]) hb(0.4, 1.0, 1.7, s * rx * 0.96, 0.35, -0.2, 0.18); }
    else if (st === 'bob' || st === 'bangs') {
      cap(); hb(rx * 2.15, 2.3, 0.9, 0, -0.35, -rz * 0.7, 0.45); for (const s of [-1, 1]) hb(0.55, 1.75, 1.5, s * rx * 0.98, 0.0, -0.25);
      if (st === 'bangs') hb(rx * 1.7, 0.34, 0.55, 0, ry * 0.76, rz * 0.7, 0.16);
    }
    else if (st === 'long') { cap(); hb(rx * 2.15, 3.3, 0.9, 0, -1.4, -rz * 0.7, 0.45); for (const s of [-1, 1]) hb(0.55, 2.5, 1.5, s * rx * 0.98, -0.6, -0.25); }
    else if (st === 'ponytail') { cap(); const pt = box(head, 0.7, 2.0, 0.7, hair, 0, 0.2, -rz * 1.25, { round: 0.3 }); pt.rotation.x = 0.35; }
    else if (st === 'curly') { cap(1.05); for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ball(head, 0.66, hair, Math.cos(a) * rx * 1.02, 0.35 + Math.sin(a) * ry * 0.8, -0.25, { m: { roughness: 0.5 } }); } }
    else if (st === 'afro') { cap(1.05); const b = ball(head, 1.9, hair, 0, 0.55, -0.85, { m: { roughness: 0.5 } }); b.scale.set(1.22, 1.02, 1); }
    else if (st === 'spikes') {
      cap(); const rnd = i => { const v = Math.sin(i * 91.7) * 43758.5; return v - Math.floor(v); };
      for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, rr = i % 3 === 0 ? 0 : 0.55 + 0.5 * rnd(i); const cone = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.9 + 0.5 * rnd(i + 3), 12), hmat); cone.position.set(Math.cos(a) * rr * rx * 0.7, ry * 0.95 + 0.25, Math.sin(a) * rr * rz * 0.55 - 0.2); cone.rotation.set(Math.sin(a) * 0.5 * rr, 0, -Math.cos(a) * 0.55 * rr); cone.castShadow = true; head.add(cone); }
    }
    else if (st === 'spacebuns') { cap(); for (const s of [-1, 1]) ball(head, 0.62, hair, s * 1.0, ry * 1.2, -0.25, { m: { roughness: 0.5 } }); }
    else if (st === 'balding') { for (const s of [-1, 1]) { const t = ball(head, 0.62, hair, s * rx * 0.93, 0.15, -0.35, { m: { roughness: 0.55 } }); t.scale.set(0.55, 1.2, 1.1); } const bk = ball(head, 0.9, hair, 0, -0.05, -rz * 0.92, { m: { roughness: 0.55 } }); bk.scale.set(1.5, 0.55, 0.45); }
    else if (st === 'hijab') {
      const sh = new THREE.Mesh(blob(rx * 1.13, ry * 1.13, rz * 1.15, { thLen: 126 * D2R, n: HD.n }), hmat); sh.rotation.x = -(Math.PI / 2 - 0.26); sh.castShadow = true; head.add(sh);   // the opening faces the front
      const dr = ball(head, 1.2, hair, 0, -ry * 0.8, -0.45, { m: { roughness: 0.5 } }); dr.scale.set(1.25, 1.05, 0.95);
      if (O.hijabDrape) {   // the scarf hangs down the front in two soft panels (one long, one folded across)
        const soft = (w, h, x, y, rz, tiltX) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), hmat); m.scale.set(w, h, 0.17); m.position.set(x, y, eggZ(x, y, D) + 0.1); m.rotation.set(tiltX, 0, rz); m.castShadow = true; bodyG.add(m); return m; };
        soft(0.5, 1.5, 0.78, topY - 1.5, -0.06, 0.12);      // the long panel down the front
        soft(0.46, 1.05, -0.72, topY - 1.0, 0.55, 0.1);     // the folded panel across the chest
      }
      if (O.pin) ball(head, 0.13, hexn(O.pin), rx * 1.1, -0.55, 0.5, { noShadow: true, m: { roughness: 0.25 } });
    }
    // glasses (sized from the character's eye size and spacing)
    if (O.glasses) {
      const lk = O.look || {}, es = lk.eyeScale || 1, eg = lk.eyeGap || 1, ex = 182 * eg * 2 * rx / 900, ey = 30 * 2 * ry / 770, r = 122 * es * 2 * rx / 900 * 1.2;
      const zz = rz * Math.pow(Math.max(0.05, 1 - Math.pow(ex / rx, HD.n) - Math.pow(ey / ry, HD.n)), 1 / HD.n) + 0.1, gm = new THREE.MeshBasicMaterial({ color: hexn(O.glassesColor) });
      for (const s of [-1, 1]) {
        let ring;
        if (O.glasses === 'square') { ring = new THREE.Mesh(frameGeo(r * 2.0, r * 1.7, 0.1), gm); ring.position.set(s * ex, ey, zz - 0.05); }
        else { ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.06, 10, 28), gm); ring.position.set(s * ex, ey, zz); }
        head.add(ring);
      }
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.1, 2 * ex - 2 * r), 0.06, 0.06), gm); bridge.position.set(0, ey + r * 0.3, zz + 0.01); head.add(bridge);
    }
    // arms: ONE smooth tube each, coming out of the side of the torso, bending like a noodle, ending in a round mitten
    const sleeve = mat(top, { roughness: 0.6 });
    const arms = [-1, 1].map(s => {
      const grp = new THREE.Group(); bodyG.add(grp);
      const tube = new THREE.Mesh(new THREE.BufferGeometry(), sleeve); tube.castShadow = true; grp.add(tube);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.43, 18, 14), mat(skin)); hand.castShadow = true; grp.add(hand);
      const capm = new THREE.Mesh(new THREE.SphereGeometry(0.37, 14, 12), sleeve); grp.add(capm);   // rounded shoulder end, hidden inside the torso
      return { grp, tube, hand, cap: capm, side: s };
    });
    const look = Object.assign({ skin: O.skin, brow: O.browColor || shadeBrow(O.hair), iris: O.eye }, O.look);
    const c = { g, body, bodyG, head, face, fx, ft, arms, legs, O, B, look, tc, headY, topY, hipY, height: headY + HD.ry * B.head + (['bun', 'spacebuns', 'spikes', 'afro'].includes(st) ? 1.2 : 0.3), seed: Math.random() * 10 };
    drawFace(fx, EXPR.neutral, look); ft.needsUpdate = true;
    return c;
  }
  const shadeBrow = hex => { const n = parseInt(hex.slice(1), 16), f = 0.78; return `rgb(${((n >> 16) & 255) * f | 0},${((n >> 8) & 255) * f | 0},${(n & 255) * f | 0})`; };

  // poseName: a name from POSES, or [nameA, nameB, k] to blend. t = seconds.
  function bezLen(S, C, H) { let L = 0; const prev = S.clone(), q = new THREE.Vector3(); for (let i = 1; i <= 14; i++) { const u = i / 14, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), cc = u * u; q.set(a * S.x + b * C.x + cc * H.x, a * S.y + b * C.y + cc * H.y, a * S.z + b * C.z + cc * H.z); L += q.distanceTo(prev); prev.copy(q); } return L; }
  function applyPose(c, name, t, extra = {}) {
    const get = n => POSES[n] || POSES.idle, B = c.B;
    let A, Bp, k = 0; if (Array.isArray(name)) { A = get(name[0]); Bp = get(name[1]); k = SMOOTH(name[2]); } else { A = get(name); Bp = A; }
    const lift = lerp(A.lift || 0, Bp.lift || 0, k), dyT = c.tc - 2.95, dyH = c.headY - 5.5;
    const side = (P, s) => P[s < 0 ? 'L' : 'R'] || (() => { const r = P.R; return { e: [-r.e[0], r.e[1], r.e[2]], h: [-r.h[0], r.h[1], r.h[2]], hy: r.hy }; })();
    const place = (p, hy) => new THREE.Vector3(hy ? p[0] : p[0] * B.w, p[1] + (hy ? dyH : dyT), p[2]);
    c.arms.forEach((a, i) => {
      const pa = side(A, a.side), pb = side(Bp, a.side);
      let e = place(pa.e, pa.hy).lerp(place(pb.e, pb.hy), k), h = place(pa.h, pa.hy).lerp(place(pb.h, pb.hy), k);
      const br = Math.sin(t * 1.6 + i) * 0.04; h.y += br; e.y += br * 0.5;
      if (extra.wave && a.side > 0) { h.x += Math.sin(t * 9) * 0.4; e.x += Math.sin(t * 9 + 0.6) * 0.1; }
      e.y += lift * 0.5; h.y += lift;
      const S = new THREE.Vector3(a.side * 0.55 * B.w, c.tc + 0.85 * B.h + lift * 0.4, 0);
      // arms have a fixed length: pull the elbow and hand toward the shoulder if the pose reaches too far
      const maxL = ARM_LEN * B.arm; let C;
      for (let it = 0; it < 4; it++) {
        C = e.clone().multiplyScalar(2).sub(S.clone().add(h).multiplyScalar(0.5)); const L = bezLen(S, C, h); if (L <= maxL) break;
        const f = maxL / L; e = S.clone().add(e.clone().sub(S).multiplyScalar(f)); h = S.clone().add(h.clone().sub(S).multiplyScalar(f));
      }
      C = e.clone().multiplyScalar(2).sub(S.clone().add(h).multiplyScalar(0.5));
      a.tube.geometry.dispose(); a.tube.geometry = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(S, C, h), 18, 0.34, 14, false);
      a.hand.position.copy(h); a.cap.position.copy(S);
    });
  }

  // face: a params object from EXPR / mix(); pose: name or [a,b,k]; talk: 0..1 mouth movement; extra body motion options
  function animateExpressive(c, t, st = {}) {
    let p = st.face || EXPR.neutral;
    if (st.alive !== false) p = life(p, t, c.seed, 1);
    if (st.talk) { const a = clamp(st.talk) * (0.5 + 0.5 * Math.sin(t * 13 + c.seed)); p = Object.assign({}, p, { mOpen: Math.max(p.mOpen, a * 0.75), teethT: Math.max(p.teethT, a * 0.5) }); }
    if (st.quiver) p = Object.assign({}, p, { mY: p.mY + Math.sin(t * 38) * 0.05 * st.quiver, mW: p.mW * (1 + Math.sin(t * 30) * 0.03 * st.quiver) });
    drawFace(c.fx, p, c.look); c.ft.needsUpdate = true;
    applyPose(c, st.pose || 'idle', t, st);
    // head and body language from the face: tilt for doubt/sadness, lift for pride, shake for rage, bounce for laughing
    const sad = clamp(-(p.sL + p.sR) / 2), up = clamp(p.lBy + p.rBy - 0.6, 0, 1);
    const tilt = (st.tilt ?? ((p.lBy - p.rBy) * -0.1 + sad * 0.05)) + Math.sin(t * 1.1 + c.seed) * 0.015;
    c.head.rotation.set((st.nod || 0) + sad * 0.08 - up * 0.04 + Math.sin(t * 0.8 + c.seed) * 0.01, (st.turn || 0), tilt);
    const laugh = st.laugh || 0, shake = st.shake || 0;
    c.bodyG.position.y = Math.abs(Math.sin(t * 13)) * 0.09 * laugh + Math.sin(t * 1.6 + c.seed) * 0.02;
    c.bodyG.position.x = Math.sin(t * 48) * 0.035 * shake;
    c.bodyG.rotation.z = (st.lean || 0) + Math.sin(t * 22) * 0.012 * laugh;
    c.bodyG.rotation.x = (st.slump || 0);
    return p;
  }

  // ---------- the cast ----------
  // Each character has ONE look (clothes stay the same). build: w = body width, h = torso height, leg = leg length, head = head size, arm = arm length.
  // head: rx, ry, rz = head size, n = how boxy (2 = round, 4 = square). look: face design (see faces.js LOOK).
  const ROSTER = [
    { name: 'mara', tags: 'Average build · hair bun · work badge · calm brows', bio: 'Calm and dry. The call-center pro who has heard everything.', skin: '#e3b88d', hair: '#2e2236', hairStyle: 'bun', top: '#5a5f9c', bottom: '#3c4a78', lanyard: '#46b98a', eye: '#5a3a30',
      look: {} },
    { name: 'theo', tags: 'Broad boxy head · buzz cut + trimmed beard · thick brows · hoodie', bio: 'Warm and steady. Big laugh, big heart, always has a snack.', skin: '#7a4a2e', hair: '#17110e', hairStyle: 'buzz', top: '#f0b84a', hood: '#d9992e', bottom: '#46507a', eye: '#3a2218',
      build: { w: 1.12, h: 1.04, arm: 1.05 }, head: { rx: 1.6, ry: 1.28, rz: 1.2, n: 3.6 }, browColor: '#17110e',
      look: { beard: { color: '#17110e', style: 'full' }, mustache: { color: '#17110e', size: 0.95, style: 'classic' }, browThick: 1.25, eyeScale: 1.05, noseSize: 1.25 } },
    { name: 'priya', tags: 'Slim, long legs · long straight hair · long lashes · pink lips', bio: 'Sharp and stylish. Says the quiet part out loud, sweetly.', skin: '#b9835a', hair: '#1e1520', hairStyle: 'long', top: '#e8708f', bottom: '#4a3c6a', eye: '#3a2a22',
      build: { w: 0.92, h: 1.0, leg: 1.1, arm: 0.95 }, head: { rx: 1.42, ry: 1.3, rz: 1.18, n: 2.5 },
      look: { lashes: 1, lipColor: '#b8405e', noseSize: 0.8, eyeScale: 1.08, browThick: 0.8 } },
    { name: 'june', tags: 'Small and round · silver bun · gold round glasses · smile lines', bio: 'Gentle grandma energy. Sees through everyone, loves them anyway.', skin: '#f4dcc3', hair: '#cfcbdb', hairStyle: 'bun', top: '#6bb7a0', bottom: '#5a5470', glasses: 'round', glassesColor: '#c9953c', eye: '#5b7aa0',
      build: { w: 1.05, h: 0.9, leg: 0.85, head: 0.96, arm: 0.95 }, head: { rx: 1.46, ry: 1.25, rz: 1.18, n: 2.7 }, browColor: '#a6a0b4',
      look: { wrinkles: 1, eyeScale: 0.86, noseSize: 1.1, browThick: 0.75, lipColor: '#b0586c' } },
    { name: 'kai', tags: 'Kid: big head, small body · curly hair · freckles · overalls', bio: 'Curious kid. Asks the question nobody else dares to.', skin: '#a8714a', hair: '#2a1c14', hairStyle: 'curly', top: '#7ec8f0', bottom: '#e8a05a', overalls: '#e8a05a', eye: '#3a2218', kid: true,
      build: { w: 0.95, h: 0.82, leg: 0.8, head: 1.18, arm: 0.9 }, head: { rx: 1.5, ry: 1.3, rz: 1.2, n: 2.6 },
      look: { eyeScale: 1.18, eyeGap: 1.04, noseSize: 0.7, freckles: 0.5 } },
    { name: 'gus', tags: 'Round and wide · bald with side tufts · big mustache · bushy brows · overalls', bio: 'Loud, loveable, round. Has a strong opinion about parking.', skin: '#e9b595', hair: '#9a948e', hairStyle: 'balding', top: '#d9534a', bottom: '#3d5a80', overalls: '#3d5a80', eye: '#4a3a2c',
      build: { w: 1.26, h: 1.02, leg: 0.9, head: 1.05, arm: 1.0 }, head: { rx: 1.64, ry: 1.26, rz: 1.24, n: 2.35 }, browColor: '#8a847e',
      look: { mustache: { color: '#7d7771', size: 1.3, style: 'handlebar' }, browThick: 1.5, eyeScale: 0.95, noseSize: 1.5, wrinkles: 0.35 } },
    { name: 'zoe', tags: 'Big sparkly eyes · lavender space buns · freckles · polka-dot top', bio: 'Bubbly and dramatic. Everything is either the best or the worst.', skin: '#f6d2b0', hair: '#b79af0', hairStyle: 'spacebuns', top: '#8fdcc0', pattern: { type: 'dots', color2: '#ffffff' }, bottom: '#6a58b0', eye: '#7a4fd0',
      build: { w: 0.94, h: 0.95, leg: 1.0, head: 1.08, arm: 0.95 }, head: { rx: 1.5, ry: 1.28, rz: 1.18, n: 2.5 }, browColor: '#7e63bd',
      look: { eyeScale: 1.2, eyeGap: 1.03, lashes: 0.7, freckles: 0.7, noseSize: 0.65, browThick: 0.8 } },
    { name: 'finn', tags: 'Tall and lanky · ginger spikes · square glasses · freckles · striped top', bio: 'Tall, lanky, overthinks everything. Secretly the funniest one.', skin: '#f7dcc8', hair: '#d4763a', hairStyle: 'spikes', top: '#f2e6c8', pattern: { type: 'stripes', color2: '#5aa6a8' }, bottom: '#4b4a63', glasses: 'square', glassesColor: '#2f4a5e', eye: '#4f7c5a',
      build: { w: 0.86, h: 1.14, leg: 1.3, head: 0.98, arm: 1.12 }, head: { rx: 1.36, ry: 1.42, rz: 1.15, n: 3.2 }, browColor: '#b9602a',
      look: { freckles: 1, eyeScale: 0.95, eyeGap: 0.96, noseSize: 1.2, browThick: 0.9 } },
    { name: 'hana', tags: 'Soft round face · black bob with bangs · small eyes · coral top', bio: 'Quiet and observant. Her one raised eyebrow says it all.', skin: '#f3d0b0', hair: '#15121a', hairStyle: 'bangs', top: '#ff9b7a', bottom: '#4a4466', eye: '#2a1c14',
      build: { w: 0.95, h: 0.98, leg: 1.0, arm: 0.95 }, head: { rx: 1.46, ry: 1.24, rz: 1.2, n: 2.4 },
      look: { eyeScale: 0.92, eyeGap: 1.02, noseSize: 0.65, lipColor: '#c0485f', browThick: 0.85 } },
    { name: 'amina', tags: 'Dark chocolate hijab draped down the front · cream cardigan with gold buttons · freckles · thick brows · long lashes · big smile', bio: 'Warm, bright-eyed, with a smile that lights up the room.', skin: '#e8bc98', hair: '#4a2a1e', hairStyle: 'hijab', hijabDrape: true, pin: '#fffaf0', top: '#efe6d2', pattern: { type: 'weave', color2: '#ddd0b4' }, buttons: '#e0b24a', bottom: '#3f3350', eye: '#3a2218', browColor: '#2a1c16',
      build: { w: 1.0, h: 1.0, arm: 0.98 }, head: { rx: 1.44, ry: 1.28, rz: 1.18, n: 2.6 },
      look: { lashes: 1, freckles: 0.9, eyeScale: 1.06, noseSize: 0.8, lipColor: '#c4677b', browThick: 1.2 } },
  ];
  const PEOPLE_X = ROSTER;
  return { mkExpressive, animateExpressive, POSES, ROSTER, PEOPLE_X, blob, HEAD, ARM_LEN };
}
