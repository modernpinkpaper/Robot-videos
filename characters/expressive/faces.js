// EXPRESSIVE FACES (DRAFT, waiting for Dalia's approval).
// A face is a small set of numbers. Every part of the face has its own numbers, so any character can mix parts:
//   eyes (open, lower lid, lid slant, look direction, pupil size, shine, tears)
//   brows (height, angle, arch, pull-in)  nose (scrunch, flare)
//   mouth (open, width, smile per side, snarl per side, teeth, tongue, round "O", shift)  cheeks (blush, puff, apple)
//   extras (sweat, anger vein, red flush)
// Draw it with drawFace(ctx, params, look). Make params with E({...}) or take a preset from EXPR.
// Mix parts from different presets with mix({ eyes:'shocked', brows:'angry', mouth:'smirk' }).
// Blend two faces with lerpFace(a, b, k). Add blinks and tiny eye movement with life(params, t).

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;

// ---------- parameters ----------
export const DEF = {
  // eyes: l = viewer's left eye, r = viewer's right eye
  lOpen: 0.92, rOpen: 0.92,      // 0 closed .. 1 open .. 1.25 wide
  lLow: 0, rLow: 0,              // lower lid pushed up (smile squint / disgust), 0..1
  lSlant: 0, rSlant: 0,          // upper lid angle: + inner end down (angry/annoyed), - inner end up (sad)
  lookX: 0, lookY: 0,            // where the pupils look: x -1 left .. 1 right, y -1 up .. 1 down
  pupil: 1, eyeSize: 1,          // pupil size (shock = small, love = big), eye size
  shine: 0,                      // 0 normal, 1 big shine, 2 star eyes, 3 heart eyes
  curve: 0.6,                    // shape of CLOSED eyes: + happy arc (^), - relaxed (u)
  tear: 0,                       // 0..1 tears
  // brows
  lBy: 0, rBy: 0,                // height -1 low .. 1 high
  lBa: 0, rBa: 0,                // angle: + inner end down (angry), - inner end up (sad/worried)
  lBc: 0.25, rBc: 0.25,          // arch
  lBx: 0, rBx: 0,                // pulled toward the middle
  // nose
  scrunch: 0, flare: 0,
  // mouth
  mOpen: 0, mW: 1, round: 0,     // open 0..1, width, round "O" shape 0..1
  sL: 0, sR: 0,                  // smile per corner: + up, - down (smirk = one side only)
  uL: 0, uR: 0,                  // upper lip pulled up per side (snarl, disgust)
  teethT: 0, teethB: 0, tongue: 0, // top teeth, bottom teeth, tongue (above 1 = stuck out)
  mX: 0, mY: 0,                  // mouth shift sideways / down
  chin: 0,                       // chin dimple (pout, crying)
  // cheeks and extras
  blush: 0.25, puff: 0, apple: 0,
  sweat: 0, vein: 0, flush: 0,
};

// helper: a number applies to both sides, [left, right] sets each side
const two = (v, d) => (Array.isArray(v) ? v : [v ?? d, v ?? d]);
export function E(o = {}) {
  const p = Object.assign({}, DEF);
  const e = o.eyes || {}, b = o.brows || {}, n = o.nose || {}, m = o.mouth || {}, c = o.cheeks || {}, x = o.extras || {};
  if ('open' in e) [p.lOpen, p.rOpen] = two(e.open);
  if ('low' in e) [p.lLow, p.rLow] = two(e.low);
  if ('slant' in e) [p.lSlant, p.rSlant] = two(e.slant);
  for (const k of ['lookX', 'lookY', 'pupil', 'eyeSize', 'shine', 'curve', 'tear']) if (k in e) p[k] = e[k];
  if ('y' in b) [p.lBy, p.rBy] = two(b.y);
  if ('angle' in b) [p.lBa, p.rBa] = two(b.angle);
  if ('arch' in b) [p.lBc, p.rBc] = two(b.arch);
  if ('in' in b) [p.lBx, p.rBx] = two(b.in);
  for (const k of ['scrunch', 'flare']) if (k in n) p[k] = n[k];
  if ('smile' in m) [p.sL, p.sR] = two(m.smile);
  if ('snarl' in m) [p.uL, p.uR] = two(m.snarl);
  for (const k of ['mOpen', 'mW', 'round', 'teethT', 'teethB', 'tongue', 'mX', 'mY', 'chin']) if (k in m) p[k] = m[k];
  if ('open' in m) p.mOpen = m.open; if ('width' in m) p.mW = m.width; if ('teeth' in m) p.teethT = p.teethB = m.teeth;
  for (const k of ['blush', 'puff', 'apple']) if (k in c) p[k] = c[k];
  for (const k of ['sweat', 'vein', 'flush']) if (k in x) p[k] = x[k];
  return p;
}

// ---------- the expression library ----------
// Each one is a recipe of the numbers above. Names are plain words.
export const EXPR = {};
const add = (name, o) => (EXPR[name] = E(o));

// calm and neutral
add('neutral', { eyes: { open: 0.92 }, brows: { y: 0 }, mouth: { smile: 0.05, width: 0.9 } });
add('deadpan', { eyes: { open: 0.55 }, brows: { y: -0.05, arch: 0.05 }, mouth: { smile: 0, width: 0.8 }, cheeks: { blush: 0.15 } });
add('bored', { eyes: { open: 0.38, lookY: 0.25 }, brows: { y: -0.2, angle: -0.1 }, mouth: { smile: -0.1, width: 0.7 } });
add('tired', { eyes: { open: 0.3, lookY: 0.4, low: 0.15 }, brows: { y: -0.35, angle: -0.35 }, mouth: { smile: -0.15, width: 0.75, open: 0.08 }, cheeks: { blush: 0.1 } });
add('yawn', { eyes: { open: 0.04, curve: -0.35 }, brows: { y: 0.15, angle: -0.2 }, mouth: { open: 0.95, width: 0.9, round: 0.55, teethT: 0.3, tongue: 0.8 }, cheeks: { blush: 0.2 } });
add('sleepy', { eyes: { open: 0.04, curve: -0.7 }, brows: { y: -0.1, angle: -0.2 }, mouth: { smile: 0.1, width: 0.6, open: 0.07, round: 0.6 }, cheeks: { blush: 0.4 } });

// happy
add('happy', { eyes: { open: 0.95, low: 0.3 }, brows: { y: 0.2, arch: 0.35 }, mouth: { smile: 0.8, width: 1.05 }, cheeks: { blush: 0.35, apple: 0.5 } });
add('big smile', { eyes: { open: 0.9, low: 0.5 }, brows: { y: 0.35, arch: 0.4 }, mouth: { smile: 1, width: 1.2, open: 0.3, teethT: 1, tongue: 0.2 }, cheeks: { blush: 0.5, apple: 0.8 } });
add('laugh', { eyes: { open: 0.03, curve: 1 }, brows: { y: 0.55, arch: 0.5 }, mouth: { smile: 1, width: 1.3, open: 0.8, teethT: 1, tongue: 0.7 }, cheeks: { blush: 0.6, apple: 1 }, nose: { scrunch: 0.25 } });
add('giggle', { eyes: { open: 0.03, curve: 1 }, brows: { y: 0.4, arch: 0.5 }, mouth: { smile: 0.9, width: 0.95, open: 0.2, teethT: 0.7 }, cheeks: { blush: 0.7, apple: 0.7 } });
add('excited', { eyes: { open: 1.12, shine: 2, pupil: 1.1 }, brows: { y: 0.75, arch: 0.55 }, mouth: { smile: 1, width: 1.15, open: 0.6, teethT: 1, tongue: 0.5 }, cheeks: { blush: 0.55, apple: 0.7 } });
add('in love', { eyes: { open: 1, shine: 3, low: 0.15 }, brows: { y: 0.4, arch: 0.4, angle: -0.15 }, mouth: { smile: 0.85, width: 0.95, open: 0.15 }, cheeks: { blush: 1, apple: 0.6 } });
add('proud', { eyes: { open: 0.4, lookY: 0.2, low: 0.2 }, brows: { y: 0.45, arch: 0.4 }, mouth: { smile: 0.7, width: 1 }, cheeks: { blush: 0.4, apple: 0.5 } });
add('relieved', { eyes: { open: 0.04, curve: -0.6 }, brows: { y: 0.3, angle: -0.4 }, mouth: { smile: 0.5, width: 0.95, open: 0.35, round: 0.5, teethT: 0 }, cheeks: { blush: 0.35 } });

// cheeky and playful
add('wink', { eyes: { open: [0.95, 0.03], curve: 1, low: [0.25, 0] }, brows: { y: [0.2, 0.4], arch: 0.4 }, mouth: { smile: [0.9, 1], width: 1.05, open: 0.25, teethT: 0.8, tongue: 0.2, mX: 0.05 }, cheeks: { blush: 0.45, apple: 0.6 } });
add('tongue out', { eyes: { open: [0.95, 0.03], curve: 1 }, brows: { y: [0.2, 0.4], arch: 0.4 }, mouth: { smile: 0.9, width: 0.95, open: 0.3, teethT: 0.5, tongue: 1.9, mX: 0.04 }, cheeks: { blush: 0.55, apple: 0.6 } });
add('smirk', { eyes: { open: [0.7, 0.85], low: [0.2, 0.1] }, brows: { y: [0.65, 0.05], angle: [-0.1, 0.25] }, mouth: { smile: [0.05, 0.95], width: 0.95, mX: 0.08 }, cheeks: { blush: 0.3, apple: 0.35 } });
add('smug', { eyes: { open: 0.55, lookX: 0.5, lookY: 0.1, low: 0.15 }, brows: { y: 0.3, arch: 0.3 }, mouth: { smile: [0.3, 0.6], width: 0.9 }, cheeks: { blush: 0.3, apple: 0.3 } });
add('flirty', { eyes: { open: 0.6, lookX: 0.35, low: 0.15, shine: 1 }, brows: { y: [0.55, 0.15], arch: 0.4 }, mouth: { smile: [0.55, 0.45], width: 0.9, open: 0.08 }, cheeks: { blush: 0.75, apple: 0.3 } });
add('plotting', { eyes: { open: 0.7, slant: 0.45, lookX: 0.4 }, brows: { y: -0.1, angle: 0.5, arch: 0.15 }, mouth: { smile: 0.95, width: 1.35, open: 0.28, teethT: 1, teethB: 0.8 }, cheeks: { blush: 0.3, apple: 0.5 } });
add('pout', { eyes: { open: 0.8, lookY: 0.3, slant: -0.3 }, brows: { y: 0, angle: -0.3 }, mouth: { smile: -0.35, width: 0.55, round: 0.35, open: 0.06 }, cheeks: { blush: 0.55, puff: 1 }, });

// annoyed and angry
add('eye roll', { eyes: { open: 0.8, lookX: 0.3, lookY: -0.85, low: 0.05 }, brows: { y: [0.5, 0.35], angle: -0.05, arch: 0.45 }, mouth: { smile: [-0.1, -0.45], width: 0.85, mX: 0.05 }, cheeks: { blush: 0.3 } });
add('side eye', { eyes: { open: 0.6, lookX: 1, lookY: 0.05 }, brows: { y: [0.05, 0.45], angle: [0.15, -0.05] }, mouth: { smile: [-0.2, -0.05], width: 0.75 }, cheeks: { blush: 0.2 } });
add('unimpressed', { eyes: { open: 0.5, lookY: 0.2 }, brows: { y: -0.1, angle: [0.2, 0.1] }, mouth: { smile: [-0.25, -0.2], width: 0.8 }, cheeks: { blush: 0.15 } });
add('skeptical', { eyes: { open: [0.95, 0.65], low: [0, 0.25] }, brows: { y: [0.85, -0.2], angle: [-0.25, 0.4], arch: [0.6, 0.1] }, mouth: { smile: [-0.3, 0.25], width: 0.85, mX: 0.1 }, cheeks: { blush: 0.2 } });
add('annoyed', { eyes: { open: 0.62, slant: 0.5, low: 0.1 }, brows: { y: -0.2, angle: 0.55, arch: 0.1 }, mouth: { smile: -0.4, width: 0.9 }, cheeks: { blush: 0.2 }, nose: { flare: 0.3 } });
add('angry', { eyes: { open: 0.78, slant: 0.9, low: 0.3, pupil: 0.85 }, brows: { y: -0.45, angle: 0.95, arch: -0.05, in: 0.4 }, nose: { scrunch: 0.5, flare: 0.6 }, mouth: { smile: -0.45, width: 1.05, open: 0.3, teethT: 1, teethB: 1, snarl: 0.4 }, cheeks: { blush: 0.2 }, extras: { vein: 1, flush: 0.5 } });
add('furious', { eyes: { open: 0.82, slant: 1, low: 0.35, pupil: 0.7 }, brows: { y: -0.6, angle: 1, arch: -0.15, in: 0.6 }, nose: { scrunch: 1, flare: 1 }, mouth: { smile: -0.35, width: 1.25, open: 0.62, teethT: 1, teethB: 1, tongue: 0.15, snarl: 0.8 }, cheeks: { blush: 0.1 }, extras: { vein: 1, flush: 1 } });
add('disgusted', { eyes: { open: 0.55, low: 0.45, slant: 0.2 }, brows: { y: -0.1, angle: 0.45, in: 0.3 }, nose: { scrunch: 1, flare: 0.4 }, mouth: { smile: -0.55, width: 0.9, open: 0.25, teethT: 0.9, snarl: [0.9, 0.9] }, cheeks: { blush: 0.1 } });
add('cringe', { eyes: { open: 0.04, curve: -0.12 }, brows: { y: 0.2, angle: -0.45, in: 0.35 }, nose: { scrunch: 0.45 }, mouth: { smile: -0.1, width: 1.3, open: 0.32, teethT: 1, teethB: 1 }, cheeks: { blush: 0.3 } });

// surprise and fear
add('surprised', { eyes: { open: 1.18, pupil: 0.8, eyeSize: 1.05 }, brows: { y: 0.9, arch: 0.55 }, mouth: { open: 0.55, width: 0.75, round: 0.8, smile: 0 }, cheeks: { blush: 0.2 } });
add('shocked', { eyes: { open: 1.25, pupil: 0.5, eyeSize: 1.1 }, brows: { y: 1, arch: 0.65 }, mouth: { open: 0.9, width: 0.85, round: 0.5, smile: -0.1, teethT: 0.4 }, cheeks: { blush: 0.1 } });
add('gasp', { eyes: { open: 1.2, pupil: 0.65 }, brows: { y: 0.85, arch: 0.6, angle: -0.15 }, mouth: { open: 0.45, width: 0.5, round: 1, smile: 0 }, cheeks: { blush: 0.2 } });
add('scared', { eyes: { open: 1.2, pupil: 0.55 }, brows: { y: 0.8, angle: -0.6, arch: 0.3, in: 0.2 }, mouth: { smile: -0.3, width: 1.15, open: 0.4, teethT: 0.7, teethB: 0.7 }, cheeks: { blush: 0.05 }, extras: { sweat: 1 } });
add('worried', { eyes: { open: 1, slant: -0.5, lookY: 0.1 }, brows: { y: 0.3, angle: -0.85, arch: 0.2, in: 0.2 }, mouth: { smile: -0.35, width: 0.8 }, cheeks: { blush: 0.2 }, extras: { sweat: 0.6 } });
add('confused', { eyes: { open: [0.95, 0.8], lookX: -0.4, lookY: -0.4 }, brows: { y: [0.75, -0.15], angle: [-0.3, 0.3], arch: [0.6, 0.1] }, mouth: { smile: [0.3, -0.35], width: 0.8, open: 0.1, mX: 0.12 }, cheeks: { blush: 0.2 } });
add('thinking', { eyes: { open: 0.85, lookX: -0.7, lookY: -0.75 }, brows: { y: [0.6, 0.1], angle: [-0.1, 0.15] }, mouth: { width: 0.6, smile: [-0.05, 0.15], mX: -0.35 }, cheeks: { blush: 0.2 } });

// sad and sensitive
add('sad', { eyes: { open: 0.75, slant: -0.7, lookY: 0.55, shine: 1 }, brows: { y: 0.1, angle: -0.85, arch: 0.15, in: 0.1 }, mouth: { smile: -0.75, width: 0.85 }, cheeks: { blush: 0.2 }, mouth_: {} });
EXPR['sad'].chin = 0.4;
add('hurt', { eyes: { open: 0.85, slant: -0.8, shine: 1, tear: 0.5, lookY: 0.2 }, brows: { y: 0.25, angle: -1, in: 0.15 }, mouth: { smile: -0.6, width: 0.75, open: 0.1 }, cheeks: { blush: 0.3 } });
EXPR['hurt'].chin = 0.6;
add('crying', { eyes: { open: 0.55, slant: -0.85, tear: 1, shine: 1 }, brows: { y: 0.2, angle: -1, in: 0.15 }, mouth: { smile: -0.85, width: 1.1, open: 0.5, teethT: 0.3, tongue: 0.6, round: 0.15 }, cheeks: { blush: 0.7 } });
EXPR['crying'].chin = 0.9;
add('sobbing', { eyes: { open: 0.05, curve: -0.2, tear: 1 }, brows: { y: 0.1, angle: -1, in: 0.4 }, mouth: { smile: -0.95, width: 1.3, open: 0.92, teethT: 1, tongue: 0.8 }, cheeks: { blush: 0.9 } });
EXPR['sobbing'].chin = 1;
add('lonely', { eyes: { open: 0.5, lookY: 0.7, lookX: -0.25, slant: -0.4 }, brows: { y: -0.1, angle: -0.6 }, mouth: { smile: -0.4, width: 0.65, mX: -0.05 }, cheeks: { blush: 0.15 } });

// shy and awkward
add('embarrassed', { eyes: { open: 0.78, lookX: -0.7, lookY: 0.55 }, brows: { y: 0.2, angle: -0.5, arch: 0.2 }, mouth: { smile: [0.3, 0.1], width: 0.75, open: 0.1, mX: -0.06 }, cheeks: { blush: 1 }, extras: { sweat: 1, flush: 0.35 } });
add('shy', { eyes: { open: 0.7, lookX: -0.6, lookY: 0.65 }, brows: { y: 0.1, angle: -0.35 }, mouth: { smile: 0.35, width: 0.6 }, cheeks: { blush: 0.9, apple: 0.3 } });
add('nervous smile', { eyes: { open: 1.05, pupil: 0.75, lookX: 0.2 }, brows: { y: 0.35, angle: -0.5, arch: 0.3 }, mouth: { smile: 0.6, width: 1.3, open: 0.18, teethT: 1, teethB: 1 }, cheeks: { blush: 0.3 }, extras: { sweat: 1 } });
add('awkward', { eyes: { open: 0.8, lookX: 0.9, lookY: 0.1 }, brows: { y: 0.3, angle: [-0.3, -0.1] }, mouth: { smile: [0.25, -0.1], width: 1.1, open: 0.1, teethT: 0.8, teethB: 0.8 }, cheeks: { blush: 0.4 }, extras: { sweat: 0.7 } });
add('speechless', { eyes: { open: 1.0, pupil: 0.8 }, brows: { y: 0.5, angle: -0.2 }, mouth: { smile: 0, width: 0.8, open: 0.28, round: 0.2 }, cheeks: { blush: 0.1 } });
add('determined', { eyes: { open: 0.8, slant: 0.5, pupil: 1.05 }, brows: { y: -0.2, angle: 0.6, arch: 0.05 }, mouth: { smile: 0.15, width: 0.9 }, cheeks: { blush: 0.25 } });

export const EXPR_GROUPS = {
  'Calm': ['neutral', 'deadpan', 'bored', 'tired', 'yawn', 'sleepy'],
  'Happy': ['happy', 'big smile', 'laugh', 'giggle', 'excited', 'in love', 'proud', 'relieved'],
  'Cheeky': ['wink', 'tongue out', 'smirk', 'smug', 'flirty', 'plotting', 'pout'],
  'Annoyed and angry': ['eye roll', 'side eye', 'unimpressed', 'skeptical', 'annoyed', 'angry', 'furious', 'disgusted', 'cringe'],
  'Surprise and fear': ['surprised', 'shocked', 'gasp', 'scared', 'worried', 'confused', 'thinking'],
  'Sad': ['sad', 'hurt', 'crying', 'sobbing', 'lonely'],
  'Shy and awkward': ['embarrassed', 'shy', 'nervous smile', 'awkward', 'speechless', 'determined'],
};

// ---------- mix and blend ----------
const PART_KEYS = {
  eyes: ['lOpen', 'rOpen', 'lLow', 'rLow', 'lSlant', 'rSlant', 'lookX', 'lookY', 'pupil', 'eyeSize', 'shine', 'curve', 'tear'],
  brows: ['lBy', 'rBy', 'lBa', 'rBa', 'lBc', 'rBc', 'lBx', 'rBx'],
  nose: ['scrunch', 'flare'],
  mouth: ['mOpen', 'mW', 'round', 'sL', 'sR', 'uL', 'uR', 'teethT', 'teethB', 'tongue', 'mX', 'mY', 'chin'],
  cheeks: ['blush', 'puff', 'apple'],
  extras: ['sweat', 'vein', 'flush'],
};
export const PARTS = Object.keys(PART_KEYS);
// mix({ eyes:'shocked', brows:'angry', mouth:'smirk', base:'neutral' }) -> takes each part from a different preset
export function mix(spec) {
  const out = Object.assign({}, EXPR[spec.base || 'neutral'] || DEF);
  for (const part of PARTS) if (spec[part]) { const src = typeof spec[part] === 'string' ? EXPR[spec[part]] : spec[part]; for (const k of PART_KEYS[part]) out[k] = src[k]; }
  return out;
}
export function lerpFace(a, b, k) { const o = {}; for (const key in DEF) o[key] = lerp(a[key], b[key], k); return o; }

// Eye roll animation: the pupils travel around the eye. u goes 0..1. Returns look x,y.
export function eyeRoll(u, dir = 1) {
  const a = lerp(Math.PI * 0.95, Math.PI * 0.05, clamp(u)) ; // from the lower left, up over the top, to the lower right
  return { lookX: Math.cos(a) * 0.85 * dir, lookY: -Math.sin(a) * 0.95 + 0.2 };
}
// Makes a face feel alive: blinks and tiny eye movement. t = seconds, seed makes each character different.
export function life(p, t, seed = 0, amt = 1) {
  const o = Object.assign({}, p);
  const ph = (t + seed * 1.7) % 4.2, bl = ph < 0.16 ? Math.sin((ph / 0.16) * Math.PI) : 0;
  const k = 1 - bl * 0.92; o.lOpen *= k; o.rOpen *= k;
  o.lookX += (Math.sin(t * 1.3 + seed) * 0.06 + Math.sin(t * 3.7 + seed * 2) * 0.03) * amt;
  o.lookY += (Math.sin(t * 1.9 + seed * 3) * 0.05) * amt;
  return o;
}

// ---------- drawing ----------
export const LOOK = {
  W: 1024, H: 860,
  skin: '#e3b88d', brow: '#4a3b52', iris: '#5a3a30', rim: '#bba5cc', mouthLine: '#5e2438',
};
const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const r = clamp(((n >> 16) & 255) * f, 0, 255) | 0, g = clamp(((n >> 8) & 255) * f, 0, 255) | 0, b = clamp((n & 255) * f, 0, 255) | 0; return `rgb(${r},${g},${b})`; };
export const CX = 512, CY = 420, EX = 182, RX = 122, RY = 128, MY = 665;

function heart(x, cx, cy, s, col) { x.fillStyle = col; x.beginPath(); x.moveTo(cx, cy + s * 0.9); x.bezierCurveTo(cx - s * 1.5, cy - s * 0.1, cx - s * 0.7, cy - s * 1.1, cx, cy - s * 0.35); x.bezierCurveTo(cx + s * 0.7, cy - s * 1.1, cx + s * 1.5, cy - s * 0.1, cx, cy + s * 0.9); x.fill(); }
function star(x, cx, cy, r, col) { x.fillStyle = col; x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fill(); }

function drawEye(x, p, side, o) {
  const L = side === 0, sgn = L ? -1 : 1;           // -1 = viewer's left
  const open = clamp(L ? p.lOpen : p.rOpen, 0, 1.3), low = clamp(L ? p.lLow : p.rLow), slant = L ? p.lSlant : p.rSlant;
  const sz = p.eyeSize, rx = RX * sz * (1 + Math.max(0, open - 1) * 0.25), ry = RY * sz * (1 + Math.max(0, open - 1) * 0.55);
  const cx = CX + sgn * EX, cy = CY;
  const lidCol = shade(o.skin, 0.975), crease = shade(o.skin, 0.55);
  if (open < 0.1) {   // closed eye: a soft curved line
    const c = p.curve, w = rx * 0.95, y0 = cy + 8;
    x.strokeStyle = o.brow; x.lineWidth = 16; x.lineCap = 'round'; x.beginPath();
    x.moveTo(cx - w, y0); x.quadraticCurveTo(cx, y0 - c * 100, cx + w, y0); x.stroke();
    if (p.tear > 0.05) { x.fillStyle = 'rgba(150,205,255,0.7)'; x.beginPath(); x.ellipse(cx, y0 + 6, w * 0.8, 10 + 12 * p.tear, 0, 0, 7); x.fill(); }
    return { cx, cy, rx, ry, closed: true, tearX: cx - sgn * w * 0.5, tearY: y0 };
  }
  // lid edges (computed first, used for the lids and for the rim)
  const cover = (1 - Math.min(open, 1)) * (ry * 2.05), edgeY = cy - ry + cover;
  const inner = -sgn, tilt = slant * ry * 0.55;     // + slant: inner end lower
  const yO = edgeY - tilt, yI = edgeY + tilt, xo = cx - inner * (rx + 16), xi = cx + inner * (rx + 16);
  const bulge = ry * 0.22 * Math.min(1, cover / ry + 0.15), ctrlU = (yO + yI) / 2 + bulge * 2;
  const yl = cy + ry - low * ry * 0.95, bulgeL = ry * (0.25 + 0.4 * low) * (low > 0.02 ? 1 : 0);
  const upperEdge = () => { x.moveTo(xo, yO); x.quadraticCurveTo(cx, ctrlU, xi, yI); };
  // eye white + pupil + tears, clipped to the eye shape
  x.save(); x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 7); x.clip();
  x.fillStyle = '#fffcf8'; x.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
  const g = x.createLinearGradient(0, cy - ry, 0, cy + ry); g.addColorStop(0, 'rgba(120,90,140,0.2)'); g.addColorStop(0.4, 'rgba(120,90,140,0)'); x.fillStyle = g; x.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
  const pr = 47 * p.pupil * sz, maxX = rx - pr * 0.5, maxY = ry - pr * 0.5;
  let px = cx + p.lookX * maxX * 0.92, py = cy + p.lookY * maxY * 0.92 + 4;
  const dx = (px - cx) / (rx - pr * 0.3), dy = (py - cy) / (ry - pr * 0.3), dd = Math.hypot(dx, dy); if (dd > 1) { px = cx + (px - cx) / dd; py = cy + (py - cy) / dd; }
  if (p.shine === 3) { heart(x, px, py - 2, pr * 1.2, '#ff5c88'); x.fillStyle = 'rgba(255,255,255,0.85)'; x.beginPath(); x.arc(px - pr * 0.45, py - pr * 0.6, pr * 0.2, 0, 7); x.fill(); }
  else {
    x.fillStyle = o.iris; x.beginPath(); x.arc(px, py, pr, 0, 7); x.fill();
    x.fillStyle = '#241628'; x.beginPath(); x.arc(px, py, pr * 0.68, 0, 7); x.fill();
    if (p.shine === 2) { star(x, px - pr * 0.25, py - pr * 0.3, pr * 0.62, '#fff8d6'); star(x, px + pr * 0.4, py + pr * 0.35, pr * 0.28, '#ffffff'); }
    else { const big = p.shine === 1 ? 1.35 : 1; x.fillStyle = '#fff'; x.beginPath(); x.arc(px - pr * 0.36, py - pr * 0.4, pr * 0.3 * big, 0, 7); x.fill(); x.beginPath(); x.arc(px + pr * 0.38, py + pr * 0.38, pr * 0.14 * big, 0, 7); x.fill(); if (p.shine === 1) { x.beginPath(); x.arc(px + pr * 0.1, py + pr * 0.62, pr * 0.1, 0, 7); x.fill(); } }
  }
  if (p.tear > 0.05) { const th = ry * (0.2 + 0.5 * p.tear); x.fillStyle = 'rgba(150,208,255,0.65)'; x.beginPath(); x.moveTo(cx - rx, cy + ry); x.quadraticCurveTo(cx, cy + ry - th * 2.1, cx + rx, cy + ry); x.fill(); x.strokeStyle = 'rgba(255,255,255,0.85)'; x.lineWidth = 5; x.beginPath(); x.moveTo(cx - rx * 0.5, cy + ry - th * 0.8); x.quadraticCurveTo(cx - rx * 0.1, cy + ry - th * 1.25, cx + rx * 0.35, cy + ry - th * 0.85); x.stroke(); }
  // upper lid (skin colored), lower lid (skin colored), both stay inside the eye shape
  x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000';
  if (cover > 1 || Math.abs(slant) > 0.02) { x.beginPath(); x.moveTo(xo, cy - ry - 40); x.lineTo(xi, cy - ry - 40); x.lineTo(xi, yI); x.quadraticCurveTo(cx, ctrlU, xo, yO); x.closePath(); x.fill(); }
  if (low > 0.02) { x.beginPath(); x.moveTo(cx - rx - 16, yl + 6); x.quadraticCurveTo(cx, yl - bulgeL, cx + rx + 16, yl + 6); x.lineTo(cx + rx + 16, cy + ry + 40); x.lineTo(cx - rx - 16, cy + ry + 40); x.closePath(); x.fill(); }
  x.globalCompositeOperation = 'source-over';
  x.restore();
  // rim of the eye: only where the eye is open (clip to the opening between the lids)
  x.save(); x.beginPath(); x.moveTo(xo, yO); x.quadraticCurveTo(cx, ctrlU, xi, yI);
  if (low > 0.02) { x.lineTo(cx + rx + 16, yl + 6); x.quadraticCurveTo(cx, yl - bulgeL, cx - rx - 16, yl + 6); } else { x.lineTo(cx + rx + 16, cy + ry + 40); x.lineTo(cx - rx - 16, cy + ry + 40); }
  x.closePath(); x.clip();
  x.strokeStyle = o.rim; x.lineWidth = 9; x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 7); x.stroke(); x.restore();
  // crease lines on the lid edges
  x.strokeStyle = crease; x.lineCap = 'round'; x.lineWidth = 7;
  if (cover > 1 || Math.abs(slant) > 0.02) { x.save(); x.beginPath(); x.ellipse(cx, cy, rx + 4, ry + 4, 0, 0, 7); x.clip(); x.beginPath(); upperEdge(); x.stroke(); x.restore(); }
  if (low > 0.02) { x.save(); x.beginPath(); x.ellipse(cx, cy, rx + 4, ry + 4, 0, 0, 7); x.clip(); x.lineWidth = 6; x.beginPath(); x.moveTo(cx - rx - 16, yl + 6); x.quadraticCurveTo(cx, yl - bulgeL, cx + rx + 16, yl + 6); x.stroke(); x.restore(); }
  return { cx, cy, rx, ry, tearX: cx - sgn * rx * 0.45, tearY: cy + ry - 4 };
}

function drawBrow(x, p, side, o, e) {
  const L = side === 0, sgn = L ? -1 : 1, inner = -sgn;
  const by = L ? p.lBy : p.rBy, ba = L ? p.lBa : p.rBa, bc = L ? p.lBc : p.rBc, bx = L ? p.lBx : p.rBx;
  const len = 128, cx = e.cx + inner * (bx * 34), cy = Math.max(176, CY - e.ry - 36 - by * 40);
  const ang = ba * 0.5;               // radians; + inner end down
  const dir = { x: Math.cos(ang), y: Math.sin(ang) * (inner > 0 ? 1 : -1) };
  // the line runs from the outer end to the inner end
  const ox = cx - inner * len * Math.cos(ang), oy = cy - inner * (-Math.sin(ang) * 0) - len * Math.sin(ang) * -1 * 0;
  const innerEnd = { x: cx + inner * len * Math.cos(ang) * 0.9, y: cy + len * Math.sin(Math.abs(ang)) * Math.sign(ba) * 0.9 };
  const outerEnd = { x: cx - inner * len * Math.cos(ang) * 0.9, y: cy - len * Math.sin(Math.abs(ang)) * Math.sign(ba) * 0.9 };
  const mid = { x: cx, y: cy - bc * 34 };
  const ctrl = { x: mid.x * 2 - (innerEnd.x + outerEnd.x) / 2, y: mid.y * 2 - (innerEnd.y + outerEnd.y) / 2 };
  x.strokeStyle = o.brow; x.lineCap = 'round'; x.lineWidth = 31;
  x.beginPath(); x.moveTo(outerEnd.x, outerEnd.y); x.quadraticCurveTo(ctrl.x, ctrl.y, innerEnd.x, innerEnd.y); x.stroke();
}

function mouthPath(x, pts, close) {
  x.beginPath(); x.moveTo(pts.L.x, pts.L.y); x.bezierCurveTo(pts.t1.x, pts.t1.y, pts.t2.x, pts.t2.y, pts.R.x, pts.R.y);
  if (close) { x.bezierCurveTo(pts.b2.x, pts.b2.y, pts.b1.x, pts.b1.y, pts.L.x, pts.L.y); x.closePath(); }
}
function drawMouth(x, p, o) {
  const mcx = CX + p.mX * 90, my = MY + p.mY * 40;
  let hw = 82 * p.mW * (1 - 0.42 * p.round) + 0;
  const sL = p.sL, sR = p.sR, avg = (sL + sR) / 2;
  const L = { x: mcx - hw, y: my - sL * 36 }, R = { x: mcx + hw, y: my - sR * 36 };
  const H = p.mOpen * 170, a = 0.33 * (1 - p.round), cavg = (L.y + R.y) / 2;
  const upMid = my + avg * 14 - Math.max(p.uL, p.uR) * 22 - H * (0.05 + 0.45 * p.round);
  const lowMid = upMid + H + (H > 4 ? 0 : 0) + Math.max(0, avg) * 10 * (H > 4 ? 1 : 0);
  const cy = (mid, y0, y1) => (mid - 0.125 * (y0 + y1)) / 0.75;
  const tc = cy(upMid, L.y, R.y), bc = cy(lowMid, L.y, R.y);
  const pts = { L, R, t1: { x: L.x + (R.x - L.x) * a, y: tc }, t2: { x: R.x - (R.x - L.x) * a, y: tc }, b1: { x: L.x + (R.x - L.x) * a, y: bc }, b2: { x: R.x - (R.x - L.x) * a, y: bc } };
  // snarl: lift the upper lip on one side
  if (p.uL > 0) pts.t1.y -= p.uL * 28; if (p.uR > 0) pts.t2.y -= p.uR * 28;
  x.lineJoin = 'round'; x.lineCap = 'round';
  if (H < 5 && p.teethT < 0.05 && p.teethB < 0.05) { // closed mouth: one soft line
    x.strokeStyle = o.mouthLine; x.lineWidth = 13; mouthPath(x, pts, false); x.stroke();
    if (p.chin > 0.05) chinMark(x, mcx, my + 62, p, o);
    return;
  }
  const open = Math.max(H, 22 + 0 * p.teethT);
  if (H < 22) { // small gap with teeth: make a flat slot
    const m = (22 - H); pts.b1.y += m * 1.2; pts.b2.y += m * 1.2;
  }
  // inside of the mouth
  x.save(); mouthPath(x, pts, true); x.fillStyle = '#6a1d38'; x.fill(); x.clip();
  const top = upMid, bot = Math.max(lowMid, upMid + 22), mw = hw * 2.2;
  if (p.tongue > 0.02) { const tw = hw * 0.62, th = Math.max(26, (bot - top) * 0.55) * Math.min(1, p.tongue); x.fillStyle = '#f26a84'; x.beginPath(); x.ellipse(mcx, bot - th * 0.22, tw, th * 0.9, 0, 0, 7); x.fill(); x.strokeStyle = 'rgba(160,40,70,0.55)'; x.lineWidth = 6; x.beginPath(); x.moveTo(mcx, bot - th * 0.9); x.lineTo(mcx, bot - th * 0.3); x.stroke(); }
  if (p.teethT > 0.02) { const h = 18 + 58 * p.teethT; x.fillStyle = '#fffaf2'; x.beginPath(); x.roundRect(mcx - hw * 0.92, top - 50, hw * 1.84, 50 + h, [0, 0, 20, 20]); x.fill(); }
  if (p.teethB > 0.02) { const h = 16 + 48 * p.teethB; x.fillStyle = '#fffaf2'; x.beginPath(); x.roundRect(mcx - hw * 0.88, bot - h, hw * 1.76, h + 50, [20, 20, 0, 0]); x.fill(); }
  if (p.teethT > 0.02 && p.teethB > 0.02) { // gap line between top and bottom teeth, and tooth lines
    x.strokeStyle = 'rgba(150,90,110,0.55)'; x.lineWidth = 4; x.beginPath(); x.moveTo(mcx - hw * 0.9, (top + 18 + 58 * p.teethT + bot - 16 - 48 * p.teethB) / 2); x.lineTo(mcx + hw * 0.9, (top + 18 + 58 * p.teethT + bot - 16 - 48 * p.teethB) / 2); x.stroke();
  }
  x.restore();
  // tongue sticking out below the lip
  if (p.tongue > 1.05) { const ext = (p.tongue - 1) * 95; x.fillStyle = '#f26a84'; x.beginPath(); x.roundRect(mcx - 40 + 6, bot - 14, 80, ext + 18, [0, 0, 40, 40]); x.fill(); x.strokeStyle = o.mouthLine; x.lineWidth = 9; x.stroke(); x.strokeStyle = 'rgba(160,40,70,0.6)'; x.lineWidth = 6; x.beginPath(); x.moveTo(mcx + 6, bot); x.lineTo(mcx + 6, bot + ext * 0.7); x.stroke(); }
  x.strokeStyle = o.mouthLine; x.lineWidth = 12; mouthPath(x, pts, true); x.stroke();
  if (p.chin > 0.05) chinMark(x, mcx, bot + 52, p, o);
}
function chinMark(x, cx, y, p, o) { x.strokeStyle = shade(o.skin, 0.8); x.lineWidth = 8; x.lineCap = 'round'; const k = p.chin; x.beginPath(); x.moveTo(cx - 44 * k, y + 2); x.quadraticCurveTo(cx, y - 24 * k, cx + 44 * k, y + 2); x.stroke(); }

function drawNose(x, p, o) {
  const s = p.scrunch, fl = p.flare, y = CY + 150 - s * 14, w = 30 + fl * 16 + s * 6;
  x.fillStyle = shade(o.skin, 0.9); x.beginPath(); x.ellipse(CX, y, w, 18 + s * 3, 0, 0, 7); x.fill();
  x.fillStyle = shade(o.skin, 1.08); x.beginPath(); x.ellipse(CX - 6, y - 7, w * 0.42, 7, -0.1, 0, 7); x.fill();
  x.strokeStyle = shade(o.skin, 0.7); x.lineWidth = 6; x.lineCap = 'round';
  if (fl > 0.05 || s > 0.05) for (const sg of [-1, 1]) { x.beginPath(); x.arc(CX + sg * (w + 4), y + 2, 12 + fl * 6, sg < 0 ? Math.PI * 0.45 : Math.PI * 1.05, sg < 0 ? Math.PI * 0.95 : Math.PI * 1.55 + 0.1); x.stroke(); }
  if (s > 0.2) { // wrinkles on the bridge of the nose
    x.strokeStyle = shade(o.skin, 0.68); x.lineWidth = 6;
    for (let i = 0; i < 3; i++) { const yy = CY + 22 + i * 24 - s * 10, ww = (44 - i * 7) * Math.min(1, s + 0.2); x.beginPath(); x.moveTo(CX - ww, yy + 6); x.quadraticCurveTo(CX, yy - 10, CX + ww, yy + 6); x.stroke(); }
  }
}
function drawCheeks(x, p, o) {
  const cy = CY + 128 + p.apple * -10;
  for (const sg of [-1, 1]) {
    const cx = CX + sg * 312, r = 74 + p.blush * 22 + p.puff * 18;
    if (p.puff > 0.05) { const pg = x.createRadialGradient(CX + sg * 255, MY - 30, 10, CX + sg * 255, MY - 10, 120 * p.puff); pg.addColorStop(0, 'rgba(255,255,255,0.35)'); pg.addColorStop(0.6, 'rgba(255,255,255,0.12)'); pg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = pg; x.beginPath(); x.arc(CX + sg * 255, MY - 10, 120 * p.puff, 0, 7); x.fill(); x.strokeStyle = shade(o.skin, 0.8); x.globalAlpha = 0.7; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.arc(CX + sg * 255, MY - 10, 100 * p.puff, sg < 0 ? Math.PI * 0.62 : Math.PI * 0.08, sg < 0 ? Math.PI * 0.92 : Math.PI * 0.38); x.stroke(); x.globalAlpha = 1; }
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); const a = clamp(0.2 + p.blush * 0.7, 0, 0.95); g.addColorStop(0, `rgba(255,100,130,${a})`); g.addColorStop(0.6, `rgba(255,110,140,${a * 0.65})`); g.addColorStop(1, 'rgba(255,120,150,0)');
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
    if (p.blush > 0.8) { x.strokeStyle = 'rgba(235,70,110,0.7)'; x.lineWidth = 6; x.lineCap = 'round'; for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(cx - 28 + i * 24, cy + 18); x.lineTo(cx - 14 + i * 24, cy - 8); x.stroke(); } }
    if (p.apple > 0.1) { x.strokeStyle = shade(o.skin, 0.72); x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.arc(CX + sg * (190 + (p.mW - 1) * 40), MY - 30, 62, sg < 0 ? Math.PI * 0.78 : Math.PI * 0.05, sg < 0 ? Math.PI * 0.95 : Math.PI * 0.22); x.globalAlpha = clamp(p.apple); x.stroke(); x.globalAlpha = 1; }
  }
  if (p.flush > 0.02) { const g = x.createRadialGradient(CX, CY + 60, 60, CX, CY + 60, 420); g.addColorStop(0, `rgba(255,70,70,${0.38 * p.flush})`); g.addColorStop(1, 'rgba(255,70,70,0)'); x.fillStyle = g; x.beginPath(); x.ellipse(CX, CY + 60, 420, 330, 0, 0, 7); x.fill(); }
}
function drawExtras(x, p) {
  if (p.sweat > 0.05) { const cx = CX + 358, cy = CY - 140, s = 30 * (0.7 + p.sweat * 0.4); x.fillStyle = 'rgba(135,200,255,0.9)'; x.strokeStyle = 'rgba(90,150,220,0.9)'; x.lineWidth = 5; x.beginPath(); x.moveTo(cx, cy - s * 1.9); x.bezierCurveTo(cx + s * 1.3, cy - s * 0.1, cx + s * 1.1, cy + s * 1.1, cx, cy + s * 1.1); x.bezierCurveTo(cx - s * 1.1, cy + s * 1.1, cx - s * 1.3, cy - s * 0.1, cx, cy - s * 1.9); x.fill(); x.stroke(); x.fillStyle = 'rgba(255,255,255,0.8)'; x.beginPath(); x.ellipse(cx - s * 0.4, cy + s * 0.1, s * 0.18, s * 0.38, 0.2, 0, 7); x.fill(); }
  if (p.vein > 0.05) { const cx = CX - 360, cy = CY - 205, r = 36; x.strokeStyle = '#e83a4a'; x.lineWidth = 11; x.lineCap = 'round'; for (let i = 0; i < 4; i++) { const sx = i < 2 ? -1 : 1, sy = i % 2 ? -1 : 1; x.beginPath(); x.arc(cx + sx * r, cy + sy * r, r * 0.95, sx < 0 ? (sy < 0 ? 0.0 : 1.57 * 3) : (sy < 0 ? 1.57 : 1.57 * 2), (sx < 0 ? (sy < 0 ? 1.57 : 1.57 * 4) : (sy < 0 ? 1.57 * 2 : 1.57 * 3)), false); x.stroke(); } }
}

// Draw the face features onto a canvas context (transparent background). Used on the 3D head and on the 2D sheets.
export function drawFace(x, p, opt = {}) {
  const o = Object.assign({}, LOOK, opt);
  x.save(); x.clearRect(0, 0, o.W, o.H);
  if (o.W !== 1024) x.scale(o.W / 1024, o.W / 1024);
  drawCheeks(x, p, o);
  drawNose(x, p, o);
  const e0 = drawEye(x, p, 0, o), e1 = drawEye(x, p, 1, o);
  drawMouth(x, p, o);
  drawBrow(x, p, 0, o, e0); drawBrow(x, p, 1, o, e1);
  if (p.tear > 0.3) for (const e of [e0, e1]) { const len = 150 * p.tear, sx = e.tearX, sy = e.tearY; x.strokeStyle = 'rgba(150,208,255,0.6)'; x.lineWidth = 26; x.lineCap = 'round'; x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo(sx + (sx < CX ? -10 : 10), sy + len * 0.5, sx + (sx < CX ? -6 : 6), sy + len); x.stroke(); x.fillStyle = 'rgba(190,230,255,0.9)'; x.beginPath(); x.arc(sx + (sx < CX ? -6 : 6), sy + len + 6, 17, 0, 7); x.fill(); }
  drawExtras(x, p);
  x.restore();
}

// A flat 2D head (egg shape, hair, ears) so the faces can be shown on a sheet without 3D.
export function drawHead2D(x, opt = {}) {
  const o = Object.assign({ skin: '#e3b88d', hair: '#3a2c3e', hairStyle: 'bun', bg: null }, LOOK, opt);
  x.save();
  if (o.bg) { x.fillStyle = o.bg; x.fillRect(0, 0, 1024, 860); }
  const cx = 512, cy = 450, rx = 450, ry = 385, n = 3;
  const squircle = (sx, sy, r = 1) => { x.beginPath(); for (let i = 0; i <= 120; i++) { const a = (i / 120) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); const k = 1 / Math.pow(Math.pow(Math.abs(c), n) + Math.pow(Math.abs(s), n), 1 / n); x.lineTo(cx + c * k * sx * r, cy + s * k * sy * r); } x.closePath(); };
  // ears
  for (const sg of [-1, 1]) { x.fillStyle = shade(o.skin, 0.93); x.beginPath(); x.ellipse(cx + sg * (rx + 6), cy + 40, 52, 70, 0, 0, 7); x.fill(); x.fillStyle = shade(o.skin, 0.8); x.beginPath(); x.ellipse(cx + sg * (rx + 8), cy + 44, 24, 38, 0, 0, 7); x.fill(); }
  // head
  squircle(rx, ry); const g = x.createRadialGradient(cx - 80, cy - 60, 40, cx, cy + 40, 560); g.addColorStop(0, shade(o.skin, 1.06)); g.addColorStop(0.7, shade(o.skin, 1)); g.addColorStop(1, shade(o.skin, 0.88)); x.fillStyle = g; x.fill();
  // hair cap over the top
  x.save(); squircle(rx, ry, 1.03); x.clip();
  if (o.hairStyle !== 'bald') { x.fillStyle = o.hair; x.beginPath(); x.moveTo(0, 0); x.lineTo(1024, 0); x.lineTo(1024, 190); x.bezierCurveTo(900, 232, 690, 104, 512, 124); x.bezierCurveTo(330, 104, 124, 232, 0, 190); x.closePath(); x.fill();
    const hg = x.createLinearGradient(0, 0, 0, 260); hg.addColorStop(0, 'rgba(255,255,255,0.18)'); hg.addColorStop(1, 'rgba(0,0,0,0.1)'); x.fillStyle = hg; x.fillRect(0, 0, 1024, 260); }
  x.restore();
  if (o.hairStyle === 'bun') { x.fillStyle = o.hair; x.beginPath(); x.arc(512, 104, 100, 0, 7); x.fill(); const bg = x.createRadialGradient(480, 70, 10, 512, 104, 110); bg.addColorStop(0, 'rgba(255,255,255,0.25)'); bg.addColorStop(1, 'rgba(0,0,0,0.1)'); x.fillStyle = bg; x.beginPath(); x.arc(512, 104, 100, 0, 7); x.fill(); }
  x.restore();
}
