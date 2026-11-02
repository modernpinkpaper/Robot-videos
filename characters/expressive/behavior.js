// AUTOMATIC PERFORMANCE for any story, skit, talk or explainer video with the emotional robots (same human rules as formats/reaction/BEHAVIOR.md).
// Listeners are alive: they look at the speaker, nod at the end of a sentence, tilt the head at a question, lean in when it is warm,
// and sometimes look away for a moment while thinking. Hand-written beats (see `applyCues`) always win over these automatic ones.
//
//   const auto = autoListener(lines, 'DALIA', { side: +1 });          // lines = the scene's timeline lines: { who, text, emo, v0, v1 }; side = which way the speaker is (+1 right, -1 left)
//   const patch = auto(t);                                             // t in seconds (video time). Returns { look, nod, tilt, lean, emo?, ... } to merge into the character's state
//
// Rules used: react 0.2 to 0.45 s AFTER the end of a sentence; never the same reaction twice in a row; at least 2.8 s between reactions;
// serious or sad lines get a still, soft face and a slow nod (never a smirk); questions get a head tilt.
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const bump = (u) => Math.sin(clamp(u) * Math.PI);                    // 0 -> 1 -> 0

export function sentenceEnds(line) {
  // approximate times of the sentence ends inside a spoken line (by character position)
  const text = line.text, n = text.length, out = []; let pos = 0;
  for (const m of text.matchAll(/[.!?]+(\s|$)/g)) { pos = m.index + m[0].trim().length; out.push({ t: line.v0 + (line.v1 - line.v0) * clamp(pos / n), q: /\?$/.test(m[0].trim()) }); }
  if (!out.length) out.push({ t: line.v1, q: /\?$/.test(text.trim()) });
  return out;
}

export function autoListener(lines, who, opts = {}) {
  const side = opts.side ?? 1, minGap = opts.minGap ?? 2.8, ev = []; let last = -99, lastKind = '';
  const others = lines.filter(l => l.who !== who).sort((a, b) => a.v0 - b.v0);
  for (const l of others) {
    const serious = ['sad', 'worried', 'tired'].includes(l.emo), warm = ['sweet', 'happy', 'laugh', 'excited'].includes(l.emo);
    sentenceEnds(l).forEach((s, k) => {
      const t0 = s.t + 0.3, kind = s.q ? 'tilt' : (serious ? 'slownod' : (warm && k % 2 ? 'smile' : 'nod'));
      let kk = kind; if (t0 - last < minGap) return; if (kk === lastKind) kk = kk === 'nod' ? 'lean' : 'nod';
      ev.push({ t0, d: kk === 'slownod' ? 1.5 : 0.95, kind: kk, emo: l.emo }); last = t0; lastKind = kk;
    });
    // a short look away while thinking, in the middle of a long line (rarely)
    if (l.v1 - l.v0 > 4.2) { const t0 = l.v0 + (l.v1 - l.v0) * 0.55; if (t0 - last > minGap) { ev.push({ t0, d: 0.9, kind: 'away', emo: l.emo }); last = t0; lastKind = 'away'; } }
  }
  ev.sort((a, b) => a.t0 - b.t0);
  return t => {
    const cur = others.find(l => t >= l.v0 - 0.15 && t <= l.v1 + 0.5), p = { look: cur ? [0.55 * side, 0.05] : undefined };
    if (cur && ['sweet'].includes(cur.emo)) p.lean = 0.03 * side;                        // leans toward a warm speaker
    for (const e of ev) {
      if (t < e.t0 || t > e.t0 + e.d) continue; const u = (t - e.t0) / e.d, w = bump(u);
      if (e.kind === 'nod' || e.kind === 'smile') { p.nod = (p.nod || 0) + Math.sin(u * Math.PI * 2) * 0.1 * w; if (e.kind === 'smile') p.smile = w; }
      if (e.kind === 'slownod') p.nod = (p.nod || 0) + Math.sin(u * Math.PI) * 0.12;
      if (e.kind === 'tilt') p.tilt = 0.16 * w * side;
      if (e.kind === 'lean') p.lean = (p.lean || 0) + 0.05 * w * side;
      if (e.kind === 'away') p.look = [-0.2 * side, -0.55 * w];
    }
    return p;
  };
}


// SPEAKERS are alive too: every sentence has a small head movement (a tilt toward the listener, a small nod as it ends, a clear tilt for a question)
// and the face is not frozen: a warm line cycles through warm faces (happy, proud, relieved...), a plain line through neutral and a small smile.
const PALETTE = { sweet: ['happy', 'proud', 'happy', 'relieved'], neutral: ['neutral', 'happy', 'neutral'], happy: ['happy', 'excited', 'happy'] };
export function autoSpeaker(lines, who, opts = {}) {
  const side = opts.side ?? 1, seg = []; let k = 0;
  for (const l of lines.filter(x => x.who === who)) { let prev = l.v0; for (const e of sentenceEnds(l)) { seg.push({ t0: prev, t1: Math.max(e.t, prev + 0.3), emo: l.emo, q: e.q, i: k++ }); prev = e.t; } }
  return t => {
    const g = seg.find(x => t >= x.t0 && t < x.t1); if (!g) return {};
    const u = (t - g.t0) / (g.t1 - g.t0), p = {}, pal = PALETTE[g.emo];
    p.tilt = (g.q ? 0.13 : (g.i % 2 ? 0.06 : -0.04)) * side * bump(u);
    p.nod = 0.07 * Math.exp(-Math.pow((u - 0.9) * 6, 2)) * (g.q ? 0 : 1);
    if (pal) p.emo = pal[g.i % pal.length];
    return p;
  };
}

// HAND-WRITTEN BEATS. cues = [{ who, t: ['L', 1, 0.8], d: 1.4, face, pose, nod, tilt, lean, slump, turn, look, breath }]
//   t can be a number (seconds from the scene start), ['L', i, offset] (when line i starts), ['LE', i, offset] (when line i ends) or ['E', offset] (scene end)
//   until: instead of d, the time the beat ends (same forms as t).   Each beat eases in and out (0.25 s). pose and face blend from what the character was doing; the numbers blend from zero.
//   breath: period in seconds, a slow breathing cycle (shoulders and head rise and fall) for "breathe with me" moments.
export function resolveTime(spec, c) {
  if (typeof spec === 'number') return spec;
  if (spec[0] === 'L') return c.L(spec[1]) + (spec[2] || 0);
  if (spec[0] === 'LE') return c.LE(spec[1]) + (spec[2] || 0);
  if (spec[0] === 'E') return c.E + (spec[1] || 0);
  return 0;
}
export function applyCues(base, cues, who, lt, c) {
  const out = Object.assign({}, base);
  for (const q of cues || []) {
    if (q.who !== who) continue;
    const t0 = resolveTime(q.t, c), d = q.until ? Math.max(0.3, resolveTime(q.until, c) - t0) : (q.d ?? 1.2), ramp = Math.min(0.25, d / 2);
    if (lt < t0 || lt > t0 + d) continue;
    const w = sm(Math.min((lt - t0) / ramp, (t0 + d - lt) / ramp));
    if (q.pose) out.pose = [Array.isArray(base.pose) ? base.pose[1] : (base.pose || 'idle'), q.pose, w];
    if (q.face) out.emo = [base.emo || 'neutral', q.face, w];
    for (const k of ['nod', 'tilt', 'lean', 'slump', 'turn']) if (q[k] !== undefined) out[k] = (base[k] || 0) + (q[k] - (base[k] || 0)) * w;
    if (q.look) out.look = [q.look[0] * w + (base.look ? base.look[0] * (1 - w) : 0), q.look[1] * w + (base.look ? base.look[1] * (1 - w) : 0)];
    if (q.breath) { const ph = Math.sin(((lt - t0) / q.breath) * Math.PI * 2); out.slump = (out.slump || 0) - 0.05 * ph * w; out.nod = (out.nod || 0) + 0.05 * ph * w; }
    if (q.act) { out.act = q.act; out.actU = clamp((lt - t0) / d); }
  }
  return out;
}
