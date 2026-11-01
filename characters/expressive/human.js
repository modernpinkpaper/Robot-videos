// HUMAN MOTION for the emotional robots: a real walk, weight shifts, breathing and smooth hand gestures.
// Use it when a character should move like a person (walk onto a stage, walk to something and point, talk with their hands).
// Nothing here keeps state between frames, so frames can be rendered in any order or in parallel.
//
//   import { createHumanKit } from './human.js';
//   const hk = createHumanKit(THREE, xk);                       // xk = createExpressiveKit(...)
//   // every frame (t = seconds):
//   hk.animateHuman(c, t, {
//     face,                       // a face object (EXPR[...] or lerpFace(...))
//     talk,                       // 0..1 mouth movement from the voice loudness
//     gesture,                    // a pose name, or [nameA, nameB, k] to blend, or a pose object from hk.mixPose
//     beat,                       // 0..1 pulse for a small emphasis gesture (use it on the important word)
//     s, speed,                   // how far the character has walked so far (path length) and how fast it is moving now (units per second)
//     nod, turn, slump, tilt,     // head nod (+ = down), head turn (+ = toward the viewer's right), forward lean, head tilt
//   });
//   Then you set the position and turn of the whole character yourself: c.g.position.set(x, 0, z); c.g.rotation.y = yaw.
// The feet follow the path length `s`, so the steps match how far the character really moves (no ice skating).
// Poses used here (swingF, swingB, open, openR, count1, beatUp, pointSide) are in body.js POSES.
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, t) => a + (b - a) * t, sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };

export const STRIDE = 2.4;   // distance covered by one step

export function createHumanKit(THREE, xk) {
  // a pose name -> a full pose object with both arms
  const full = name => {
    const P = xk.POSES[name] || xk.POSES.idle, R = P.R, L = P.L || { e: [-R.e[0], R.e[1], R.e[2]], h: [-R.h[0], R.h[1], R.h[2]] };
    return { R: { e: R.e.slice(), h: R.h.slice() }, L: { e: L.e.slice(), h: L.h.slice() }, lift: P.lift || 0 };
  };
  const resolve = p => (typeof p === 'string' ? full(p) : Array.isArray(p) ? mixPose(p[0], p[1], p[2]) : p);
  function mixPose(a, b, k) {
    const A = resolve(a), B = resolve(b), m = (u, v) => u.map((x, i) => lerp(x, v[i], k));
    return { R: { e: m(A.R.e, B.R.e), h: m(A.R.h, B.R.h) }, L: { e: m(A.L.e, B.L.e), h: m(A.L.h, B.L.h) }, lift: lerp(A.lift, B.lift, k) };
  }

  function animateHuman(c, t, st = {}) {
    const wk = sm((st.speed || 0) / 1.0), ph = Math.PI * (st.s || 0) / STRIDE;
    // arms: the gesture, plus a pinch of emphasis on the beat, then blended into the walking arm swing while moving
    let pose = resolve(st.gesture || 'idle');
    if (st.beat) pose = mixPose(pose, 'beatUp', clamp(st.beat) * 0.85);
    if (wk > 0.001) pose = mixPose(pose, mixPose('swingB', 'swingF', 0.5 + 0.5 * Math.sin(ph)), wk);
    const p = xk.animateExpressive(c, t, { face: st.face, pose, talk: st.talk, nod: (st.nod || 0) - 0.05 * wk, turn: st.turn || 0, slump: (st.slump || 0) + 0.05 * wk, tilt: st.tilt, lean: st.lean, laugh: st.laugh, alive: st.alive });
    // the body of a walking person: it bobs up on each step, rolls and twists a little with the stride, leans forward, keeps the head level
    c.bodyG.position.y += Math.abs(Math.cos(ph)) * 0.11 * wk;
    c.bodyG.rotation.y += Math.sin(ph) * 0.09 * wk; c.head.rotation.y -= Math.sin(ph) * 0.06 * wk;
    c.bodyG.rotation.z += Math.cos(ph) * 0.03 * wk;
    // a standing person is never still: breathing and slow shifts of weight
    const w = Math.sin(t * 0.5 + c.seed), still = 1 - wk;
    c.bodyG.scale.y = 1 + 0.007 * Math.sin(t * 1.9 + c.seed);
    c.bodyG.position.x += w * 0.1 * still; c.bodyG.rotation.z += w * 0.02 * still;
    // legs: swing opposite to each other, lift the foot while it swings forward
    c.legs.forEach((l, i) => {
      const f = ph + i * Math.PI;
      l.rotation.x = -Math.sin(f) * 0.62 * wk;
      l.position.y = c.hipY + Math.max(0, Math.cos(f)) * 0.24 * wk;
      l.rotation.z = (i ? -1 : 1) * 0.03 * w * still;
    });
    return p;
  }
  return { animateHuman, mixPose, resolve, STRIDE };
}
