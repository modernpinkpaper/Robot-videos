// ACTOR: the drop-in way to use the EMOTIONAL ROBOTS (expressive characters) in ANY video format.
// It has the same shape as the old `kit.mkHuman(...)` + `kit.animateBot(...)`, so every pipeline (story, skit, talk to camera,
// reaction, podcast, explainer) can swap the cast with two small changes and keep its camera, sets, shots, voices and render.js.
//
//   import { createRobotKit } from '../robots.js';
//   import { createExpressiveKit } from './body.js';
//   import { createActorKit } from './actor.js';
//   const kit = createRobotKit(THREE, RoundedBoxGeometry), xk = createExpressiveKit(THREE, RoundedBoxGeometry, kit), ak = createActorKit(THREE, xk);
//   const dalia = ak.mkActor('dalia', { parent: scene, x: -3, ry: 0.3 });          // any of the 12 ROSTER names, same options as mkExpressive
//   // every frame (t = seconds), same options as kit.animateBot:
//   ak.animateActor(dalia, t, { speaking: true, amp: 0.6, emo: 'shock', look: [0, 0] });
//
// Nothing in here keeps state between frames, so frames can be rendered in any order and in parallel (the render scripts do that).
import { EXPR, lerpFace } from './faces.js';

// The words used in scripts (plan.py / script.json) -> a face. Any of the 50 EXPR names also works ('eye roll', 'side eye', 'cringe'...).
export const EMO_FACE = {
  neutral: 'neutral', happy: 'happy', excited: 'excited', sweet: 'happy', deadpan: 'deadpan', stern: 'annoyed', tired: 'tired',
  dramatic: 'shocked', shock: 'shocked', worried: 'worried', smug: 'smug', laugh: 'laugh', sad: 'sad', angry: 'angry', proud: 'proud',
};

export function createActorKit(THREE, xk) {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const names = xk.ROSTER.map(p => p.name);

  // emo can be: a script word ('shock'), an EXPR name ('eye roll'), a face object, or [from, to, k] to blend (k 0..1) for a smooth change.
  function faceFor(emo) {
    if (Array.isArray(emo)) return lerpFace(faceFor(emo[0]), faceFor(emo[1]), sm(emo[2]));
    if (emo && typeof emo === 'object') return emo;
    const key = String(emo || 'neutral').toLowerCase();
    return EXPR[EMO_FACE[key] || key] || EXPR.neutral;
  }

  function mkActor(name, opts = {}) {
    const base = xk.ROSTER.find(p => p.name === String(name).toLowerCase());
    if (!base) throw new Error(`No emotional robot called "${name}". Choose one of: ${names.join(', ')}`);
    const c = xk.mkExpressive(Object.assign({}, base, opts));
    c.idx = opts.idx || 0; c.blinkPhase = 0;   // so code written for the old characters keeps working
    return c;
  }

  // st: speaking, amp (0..1 voice loudness), emo, look [x, y], walk, sit, wave, pose, turn (head left/right),
  //     act ('nod' 'shake' 'gasp' 'laugh' 'facepalm' 'lean' 'hop') + actU (0..1 progress through the act)
  function animateActor(c, t, st = {}) {
    const amp = st.amp || 0, sp = !!st.speaking, e = Math.sin(clamp(st.actU ?? 0.5) * Math.PI);
    let face = Object.assign({}, faceFor(st.emo));
    if (st.look) { face.lookX = clamp(face.lookX + st.look[0] * 0.8, -1, 1); face.lookY = clamp(face.lookY + st.look[1] * 0.8, -1, 1); }
    // body language: talking hands drift between two poses; the voice loudness makes them bigger
    let pose = st.pose || 'idle';
    if (!st.pose && sp) pose = ['idle', 'hips', clamp(0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 2.2 + c.seed)) * (0.5 + amp))];
    if (st.wave) pose = 'wave';
    const o = { face, pose, talk: sp ? amp : 0, turn: st.turn || 0, nod: st.nod || 0, lean: st.lean || 0, laugh: 0, shake: 0, slump: st.slump || 0, wave: !!st.wave };
    if (!st.pose && sp && !st.wave) o.nod += 0.02 + amp * 0.04;
    if (st.emo === 'laugh' || st.emo === 'giggle') o.laugh = 0.6;
    const act = st.act;
    if (act === 'nod') o.nod += Math.sin(t * 9) * 0.12 * e;
    if (act === 'shake') o.turn += Math.sin(t * 11) * 0.18 * e;
    if (act === 'gasp') { o.pose = ['idle', 'armsUp', e * 0.8]; o.slump = -0.08 * e; o.nod -= 0.1 * e; }
    if (act === 'laugh') { o.laugh = Math.max(o.laugh, e); o.nod -= 0.12 * e; }
    if (act === 'facepalm') { o.pose = ['idle', 'facepalm', e]; o.nod += 0.25 * e; }
    if (act === 'lean') { o.lean += 0.12 * e; o.turn -= 0.1 * e; }
    const p = xk.animateExpressive(c, t, o);
    if (act === 'hop') c.bodyG.position.y += Math.abs(Math.sin((st.actU ?? 0) * Math.PI * 2)) * 0.35 * e;
    // walking and sitting use the legs (the old characters had the same options)
    if (st.walk) c.bodyG.position.y += Math.abs(Math.sin(t * 7)) * 0.15;
    c.legs.forEach((l, i) => { l.rotation.x = st.walk ? Math.sin(t * 7 + i * Math.PI) * 0.7 : (st.sit ? -1.4 : 0); });
    return p;
  }

  return { mkActor, animateActor, faceFor, names, EMO_FACE };
}
