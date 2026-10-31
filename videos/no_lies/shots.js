// Scenes (who stands where, what they feel) and camera shots for "What if nobody lied?"
// kf = [time-in-scene, x, z, y, ry]   cameras: p = position start/end, l = look-at start/end, f = field of view, r = roll (deg)
const PI = Math.PI;
export const LIGHTS = {
  day:    { bg: ['#9cc2f0', '#e8f2ff'], fog: [0xdbe8fa, 90, 260], hemi: [0xfff0ff, 0xb59fd8, 1.0], sun: [0xfff2e6, 1.7], pk: [0xff8fc8, 26], bl: [0x8fb8ff, 26], warm: 0 },
  room:   { bg: ['#fbe6ee', '#fbe6ee'], fog: null, hemi: [0xfff0ff, 0xb59fd8, 1.05], sun: [0xfff2e6, 1.5], pk: [0xff8fc8, 26], bl: [0x8fb8ff, 26], warm: 0 },
  shop:   { bg: ['#d6f2e4', '#d6f2e4'], fog: null, hemi: [0xfff6f0, 0xb59fd8, 1.05], sun: [0xfff2e6, 1.5], pk: [0xff8fc8, 24], bl: [0x8fb8ff, 24], warm: 0 },
  bed:    { bg: ['#cfe0ff', '#cfe0ff'], fog: null, hemi: [0xdde6ff, 0xa99fd8, 0.95], sun: [0xe6ecff, 1.1], pk: [0xff8fc8, 20], bl: [0x8fb8ff, 30], warm: 0 },
  sunset: { bg: ['#a58de6', '#ffd7b0'], fog: [0xf3c9d6, 90, 260], hemi: [0xffe3d6, 0xa890d0, 0.95], sun: [0xffc08a, 1.4], pk: [0xff8fc8, 34], bl: [0x9a8fff, 20], warm: 1 },
  night:  { bg: ['#241d5e', '#6a56b0'], fog: [0x4a3f8a, 70, 240], hemi: [0x9fa8ff, 0x4a3f7a, 0.5], sun: [0xaab8ff, 0.4], pk: [0xff8fc8, 30], bl: [0x8fb8ff, 28], warm: 1 },
};
// one extra light for the dusk/night mood
export const WARM_POS = { sunset: [0, 8, 14], night: [0, 7, 15] };

export const SC = {
  intro: { sets: ['town', 'sign'], light: 'day', shadow: 'wide',
    cast: { MICA: { kf: [[0, 0, 9]], ry: 0.12, emo: 'happy' } },
    act: (w, lt, c) => ({ wave: lt > c.L(1) - 0.1 && lt < c.L(1) + 1.8, hop: lt > c.L(1) + 0.2 && lt < c.L(1) + 1.2 }) },

  street: { sets: ['town'], light: 'day', shadow: 'wide',
    cast: {
      CHARGEY: { kf: [[0, -14, 9, 0, 1.57], [1.55, -3.6, 9, 0, 0.85]], ry: 0.85, emo: 'happy' },
      DRAFTY: { kf: [[0, 3.6, 9]], ry: -0.85, emo: 'happy', hat: 1 } },
    act: (w, lt, c) => {
      if (w === 'DRAFTY') return c.line && c.line.li === 0 ? { emo: lt > c.L(0) + 1.3 ? 'shock' : 'happy' } : (c.line && c.line.li === 1 ? { hop: lt > c.L(1) + 1.6 } : {});
      if (w === 'CHARGEY' && lt > c.L(1) + 1.9) return { emo: 'laugh', hop: true }; return {}; } },

  party: { sets: ['party', 'confP'], light: 'room', shadow: 'room',
    cast: {
      HOOKY: { kf: [[0, -6.6, 3]], ry: 0.9, emo: 'happy' }, KRAFT: { kf: [[0, 6.6, 3]], ry: -0.9, emo: 'happy' },
      CHARGEY: { kf: [[0, -4.4, -3.8]], ry: 0.25, emo: 'happy' }, DRAFTY: { kf: [[0, 4.4, -3.8]], ry: -0.25, emo: 'happy', hat: 1 } },
    act: (w, lt, c) => {
      const l = c.line, k = l ? l.li : -1;
      if (w === 'HOOKY') return k === 1 ? { emo: 'shock' } : (k === 3 ? { emo: 'happy', hop: true } : {});
      if (w === 'KRAFT') return k === 2 ? { emo: 'tired' } : {};
      if (w === 'CHARGEY' || w === 'DRAFTY') return k >= 1 ? { emo: 'laugh', hop: k === 3 } : {}; return {}; } },

  shop: { sets: ['shop'], light: 'shop', shadow: 'room',
    cast: { LISTER: { kf: [[0, 4.5, -2.2, 1.2]], ry: -0.1, emo: 'smug' }, DYMO: { kf: [[0, -8, 6.5]], ry: 1.0, emo: 'happy' } },
    act: (w, lt, c) => {
      const k = c.line ? c.line.li : -1;
      if (w === 'DYMO') return k === 0 ? { emo: lt > c.L(0) + 1.7 ? 'shock' : 'worried' } : (k === 1 ? { hop: lt > c.L(1) + 1.4 } : {});
      if (w === 'LISTER') return k === 1 ? { emo: 'excited', hop: lt > c.L(1) + 1.4 } : {}; return {}; } },

  call: { split: true, light: 'room',
    top: { sets: ['bedroom'], light: 'bed', cast: ['CHARGEY'] }, bot: { sets: ['party'], light: 'room', cast: ['HOOKY'] },
    cast: { CHARGEY: { kf: [[0, 0, -2.4, 0.75]], ry: 0, emo: 'tired', cap: 1, phone: 1 }, HOOKY: { kf: [[0, -4.2, 9]], ry: 0.25, emo: 'worried', phone: 1 } },
    act: (w, lt, c) => {
      const k = c.line ? c.line.li : -1;
      if (w === 'HOOKY') return k === 1 ? { emo: 'shock' } : (k === 2 ? { emo: 'happy', hop: true } : {});
      if (w === 'CHARGEY') return k === 2 ? { emo: 'sweet' } : (k === 0 ? { emo: 'tired' } : {}); return {}; } },

  vote: { sets: ['town', 'stage', 'confV'], light: 'day', shadow: 'wide',
    cast: {
      LOGBOT: { kf: [[0, 0, 0.2, 1.9]], ry: 0, emo: 'dramatic' },
      CHARGEY: { kf: [[0, -9.2, 7.6]], ry: PI, emo: 'happy' }, HOOKY: { kf: [[0, -3.2, 7.4]], ry: PI, emo: 'happy' }, KRAFT: { kf: [[0, 3.2, 7.4]], ry: PI, emo: 'stern' }, MICA: { kf: [[0, 9.2, 7.6]], ry: PI, emo: 'happy' },
      DRAFTY: { kf: [[0, -5.6, 11.6]], ry: PI, emo: 'happy', hat: 1 }, LISTER: { kf: [[0, 0.2, 11.4]], ry: PI, emo: 'happy' }, DYMO: { kf: [[0, 6, 11.6]], ry: PI, emo: 'happy' } },
    act: (w, lt, c) => {
      const L1 = c.L(1), cheer = lt > L1 + 0.45;
      if (w === 'LOGBOT') return lt < L1 ? { emo: lt > c.L(0) + 2.6 ? 'worried' : 'dramatic' } : { emo: 'excited', hop: true, wave: lt > L1 + 0.5 };
      if (w === 'DRAFTY') { const a = Math.min(1, Math.max(0, (lt - (L1 - 0.35)) / 0.45)), s = a * a * (3 - 2 * a); return Object.assign({ ry: PI + (0.38 - PI) * s }, cheer ? { hop: true } : {}); }
      return cheer ? { speaking: true, amp: 0.55 + 0.45 * Math.sin(lt * 13 + w.length), emo: 'excited', hop: true } : {}; } },

  bench: { sets: ['park'], light: 'sunset', shadow: 'wide',
    cast: {
      MICA: { kf: [[0, -2, 0.35, -1.1]], ry: 0.3, emo: 'tired' },
      HOOKY: { kf: [[0, 17, 3.2, 0, -1.5], [1.7, 4.2, 3.2, 0, -1.5], [2.15, 2, 0.35, -1.1, -0.3]], ry: -0.3, emo: 'sweet' } },
    act: (w, lt, c) => w === 'MICA' && c.line && c.line.li === 1 ? { emo: 'sweet' } : {} },

  finale: { sets: ['town', 'night'], light: 'night', shadow: 'wide',
    cast: {
      MICA: { kf: [[0, 0, 9.6]], ry: 0, emo: 'happy' }, HOOKY: { kf: [[0, -3.9, 8.8]], ry: 0.2, emo: 'happy' }, KRAFT: { kf: [[0, 3.9, 8.8]], ry: -0.2, emo: 'happy' },
      DRAFTY: { kf: [[0, -5.9, 5.6]], ry: 0.3, emo: 'happy', hat: 1 }, CHARGEY: { kf: [[0, 5.9, 5.6]], ry: -0.3, emo: 'happy' },
      DYMO: { kf: [[0, -2.0, 5.4]], ry: 0.1, emo: 'happy' }, LISTER: { kf: [[0, 2.1, 5.2]], ry: -0.1, emo: 'happy' }, LOGBOT: { kf: [[0, 0, 2.2]], ry: 0, emo: 'happy' } },
    act: (w, lt, c) => {
      const k = c.line ? c.line.li : -1;
      if (w === 'MICA') return k === 1 ? { emo: 'worried' } : (k === 2 ? { emo: 'sweet' } : {});
      return lt > c.L(1) + 1.9 ? { emo: 'happy', hop: w.length % 2 === 0, wave: w.length % 3 === 0 } : (k === 1 ? { emo: 'sweet' } : {}); } },
};

// ---- cameras
export const CAMS = {
  // intro: crane down over the town to the sign, then a low hero shot of Mica
  aerial: { p: [[-34, 52, 80], [2, 13, 36]], l: [[0, 6, 0], [0, 8.2, 3]], f: [50, 42], ease: 'io' },
  micaWave: { p: [[-5, 3.4, 29], [1.6, 6.2, 25.5]], l: [[0.4, 6.4, 9], [0.2, 8.0, 9]], f: [44, 40], r: [-4, 0], ease: 'io' },
  // street: side tracking dolly, close-ups, zoom on the hat, wide
  track: { p: [[-22, 6, 35], [-6, 6.5, 32]], l: [[-10, 4.5, 9], [0, 5, 9]], f: [46, 44], ease: 'io' },
  chargeyCu: { p: [[1.5, 5.5, 20], [-0.2, 5.4, 17.5]], l: [[-3.5, 5.1, 9], [-3.5, 5.2, 9]], f: [30, 26], ease: 'out' },
  hatZoom: { p: [[4.2, 7.6, 23], [3.9, 7.5, 15]], l: [[3.6, 6.2, 9], [3.5, 6.6, 9]], f: [36, 19], ease: 'in' },
  draftyCu: { p: [[-1.5, 5.5, 20.5], [0.2, 5.4, 17.8]], l: [[3.6, 5.2, 9], [3.6, 5.2, 9]], f: [30, 26], r: [-3, 2], ease: 'out' },
  streetEnd: { p: [[0, 6.5, 34], [0, 10, 41]], l: [[0, 5, 9], [0, 5, 9]], f: [38, 38], ease: 'io', shake: 0.04 },
  // party: orbit around the table, push on the cake, close-ups, wide with confetti
  partyOrbit: { orbit: { c: [0, 5, 3], r: [25, 21], a: [-55, -6], h: [12, 8] }, l: [[0, 5, 3], [0, 5, 3]], f: [42, 40], ease: 'io' },
  cakeZoom: { p: [[2.6, 8.5, 17], [0.4, 7.5, 12]], l: [[0, 5.6, 3], [0, 5.8, 3]], f: [36, 26], ease: 'io' },
  kraftCu: { p: [[2.4, 5.4, 15.5], [4.2, 5.4, 13.4]], l: [[6.6, 5.2, 3], [6.6, 5.2, 3]], f: [30, 26], r: [2, -1], ease: 'out' },
  hookyLow: { p: [[-2.6, 1.6, 14.5], [-3.8, 2.4, 13]], l: [[-6.6, 5.6, 3], [-6.6, 5.4, 3]], f: [34, 28], r: [5, -2], ease: 'io' },
  partyWide: { p: [[0, 9, 40], [0, 11, 45]], l: [[0, 6.5, 3], [0, 7, 3]], f: [46, 46], ease: 'io', shake: 0.05 },
  // shop: lateral dolly, close on the vacuum, low angle, wide
  shopDolly: { p: [[-15, 6, 22], [2, 6.5, 19]], l: [[-5, 5, 2], [3, 5.5, 0]], f: [44, 38], ease: 'io' },
  vacCu: { p: [[-5.5, 6.3, 10.5], [-3.4, 5.8, 8]], l: [[-1.8, 5, 0.5], [-1.8, 5.4, 0.5]], f: [34, 28], r: [0, 3], ease: 'in', shake: 0.03 },
  dymoLow: { p: [[-3, 1.8, 19], [-5, 2.4, 17.5]], l: [[-8, 4.4, 6.5], [-8, 4.7, 6.5]], f: [34, 28], r: [-4, 2], ease: 'io' },
  shopWide: { p: [[0, 8, 40], [0, 9.5, 44]], l: [[0, 5, 1], [0, 5, 1]], f: [50, 50], ease: 'io' },
  // split screen phone call (two cameras, top and bottom)
  splitCall: { top: { p: [[3.8, 6.4, 9.5], [2.6, 5.9, 7.2]], l: [[0, 5.6, -2.4], [0, 5.6, -2.4]], f: [36, 28], ease: 'io' }, bot: { p: [[-0.5, 5, 21], [-2.2, 5.2, 17]], l: [[-4, 5, 9], [-4, 5.2, 9]], f: [38, 30], ease: 'io' } },
  splitCall2: { top: { p: [[2.6, 5.3, 8.5], [1.4, 5.3, 6.8]], l: [[0, 5.5, -2.4], [0, 5.5, -2.4]], f: [30, 26], r: [2, -2], ease: 'out' }, bot: { p: [[-10, 3.0, 20], [-7.6, 3.8, 17]], l: [[-4.2, 5.3, 9], [-4.2, 5.4, 9]], f: [36, 30], r: [-3, 3], ease: 'io' } },
  // election: low hero shot, dolly zoom on Logbot, pan across crowd, orbit with confetti
  podiumLow: { p: [[-19, 3.0, 9], [-13.5, 3.8, 7.5]], l: [[0, 6.2, 0.2], [0, 6.6, 0.2]], f: [40, 34], r: [4, -1], ease: 'io' },
  dollyZoom: { p: [[0, 9, 17], [0, 9, 43]], l: [[0, 7.2, 0.3], [0, 7.2, 0.3]], f: [44, 17.6], ease: 'lin' },
  crowdPan: { p: [[-11, 6.5, 24], [-8.6, 6.2, 22]], l: [[9, 6, 9], [-5.6, 5.6, 11.6]], f: [40, 30], ease: 'io' },
  cheerOrbit: { orbit: { c: [0, 5, 10], r: [22, 17], a: [38, -34], h: [6, 8] }, l: [[0, 5.6, 8], [0, 6.4, 6]], f: [42, 42], ease: 'lin', shake: 0.06 },
  // bench: sunset
  benchPush: { p: [[-8, 6, 38], [-4, 4.8, 22]], l: [[2, 3.5, 0], [-1.5, 4, 0.4]], f: [40, 34], ease: 'io' },
  micaSad: { p: [[2.6, 3.9, 12.5], [1.4, 3.95, 10.8]], l: [[-2, 4, 0.4], [-2, 4, 0.4]], f: [30, 25], r: [0, -2], ease: 'io' },
  benchTwo: { p: [[0.5, 3.2, 21], [0, 3.7, 18.5]], l: [[0, 4.1, 0.4], [0, 4.2, 0.4]], f: [42, 38], ease: 'out' },
  benchCrane: { p: [[0, 4, 15], [5, 24, 33]], l: [[0, 4.2, 0.4], [-2, 10, -4]], f: [36, 44], ease: 'io' },
  // finale: push, close-up, big pull back
  nightPush: { p: [[0, 3.6, 46], [0, 3.8, 32]], l: [[0, 4.4, 8], [0, 4.8, 8]], f: [44, 42], ease: 'io' },
  nightMica: { p: [[1.8, 5.4, 21], [0.8, 5.3, 17.5]], l: [[0, 5.1, 9.6], [0, 5.1, 9.6]], f: [30, 24], ease: 'io' },
  finalPull: { p: [[0, 5.2, 26], [8, 22, 62]], l: [[0, 5.6, 10], [0, 8.5, 6]], f: [34, 48], ease: 'io' },
};
