// Cast positions, feelings and camera shots for "Heart Calm".
// Camera shots come from the shared library (camera/shots.js) aimed at the heads below. Every shot moves (see camera/CAMERA.md).
import { SHOTS as K } from '../../camera/shots.js';
const PI = Math.PI;
export const LIGHTS = {
  evening: { bg: ['#f6d6dd', '#fbe6ee'], fog: null, hemi: [0xfff0f4, 0xc9a6d8, 1.0], sun: [0xffe2c0, 1.45], pk: [0xff8fc8, 22], bl: [0x8fb8ff, 18], warm: 1 },
  morning: { bg: ['#cfe0ff', '#fff2d8'], fog: null, hemi: [0xfff6e6, 0xb9b0e0, 1.0], sun: [0xfff0d0, 1.5], pk: [0xffb0c8, 20], bl: [0x9fc8ff, 24], warm: 0 },
  day:     { bg: ['#8fc0f2', '#e6f3ff'], fog: [0xdbe8fa, 90, 260], hemi: [0xfff0ff, 0xb59fd8, 1.0], sun: [0xfff2e6, 1.7], pk: [0xff8fc8, 24], bl: [0x8fb8ff, 24], warm: 0 },
  night:   { bg: ['#262063', '#4a3f8a'], fog: null, hemi: [0xb0b8ff, 0x4a3f7a, 0.62], sun: [0xaab8ff, 0.55], pk: [0xff8fc8, 16], bl: [0x8fb8ff, 24], warm: 1 },
  calm:    { bg: ['#dcefe9', '#f3efe0'], fog: null, hemi: [0xfffaf0, 0xb9c8d8, 1.0], sun: [0xfff2d8, 1.5], pk: [0xffb0c8, 20], bl: [0x9fd0ff, 22], warm: 1 },
};
export const WARM_POS = { evening: [-13, 9, -2], calm: [10, 8, 3], night: [6, 7, 2] };   // one extra warm light (lamp / sun patch)

// head targets [x, y, z] (aim the camera here)
export const HD = {
  dalia: [-2.4, 5.9, -3.2],      // Dalia on the couch
  amina: [5.0, 6.2, -2.4],       // Amina in the armchair
  mid: [1.3, 5.4, -3.0],
  bed: [0, 6.5, -4.4],           // Dalia in bed
  park: [0, 5.8, 3.5],           // Dalia standing in the park
  mat: [0, 4.2, -1.6],           // Dalia sitting on the prayer mat
};

// where everybody stands. kf = [time-in-scene, x, z, y, ry]. sit = legs forward (on couch, chair, bed, mat).
// posture = how heavy or light a character carries the body in this scene (slump: + = heavy, 0 = easy). Dalia starts heavy and ends light.
// The acting itself (faces, hands, nods, leans) is in perform.js (hand-written beats) and characters/expressive/behavior.js (automatic listening).
const DAL = (y = -0.02) => ({ kf: [[0, -2.4, -3.2, y, 0.75]], sit: 1 });
const AMI = { kf: [[0, 5.0, -2.4, 0.8, -0.85]], sit: 1 };
export const SC = {
  open:  { set: 'room', light: 'evening', shadow: 'room', side: { DALIA: 1, AMINA: -1 }, posture: { DALIA: 0.15 },
           cast: { DALIA: Object.assign(DAL(), { emo: 'sad' }), AMINA: { kf: [[0, 5.6, -0.6, 0, -1.2]], emo: 'worried' } } },
  verse: { set: 'room', light: 'evening', shadow: 'room', side: { DALIA: 1, AMINA: -1 }, posture: { DALIA: 0.11 },
           cast: { DALIA: Object.assign(DAL(), { emo: 'neutral' }), AMINA: Object.assign({}, AMI, { emo: 'sweet' }) } },
  words: { set: 'room', light: 'evening', shadow: 'room', side: { DALIA: 1, AMINA: -1 }, posture: { DALIA: 0.05 },
           cast: { DALIA: Object.assign(DAL(), { emo: 'neutral' }), AMINA: Object.assign({}, AMI, { emo: 'sweet' }) } },
  night: { set: 'bed', light: 'night', shadow: 'room', side: { NINA: 1, MARA: -1 },
           cast: { NINA: { kf: [[0, 0, -5.6, 1.9, 0]], sit: 1, emo: 'scared' }, MARA: { kf: [[0, 18, -1.0, 0, -1.57], [1.4, 18, -1.0, 0, -1.57], [3.3, 4.6, -2.4, 0, -1.2]], emo: 'happy' } } },
  habit: { set: 'room', light: 'evening', shadow: 'room', side: { DALIA: 1, AMINA: -1 }, posture: { DALIA: 0.09 },
           cast: { DALIA: Object.assign(DAL(), { emo: 'worried' }), AMINA: Object.assign({}, AMI, { emo: 'sweet' }) } },
  act1:  { set: 'park', light: 'day', shadow: 'wide', posture: { DALIA: 0.08 },
           cast: { DALIA: { kf: [[0, 0, -12, 0, 0], [3.8, 0, 3.5, 0, 0]], emo: 'worried' } } },
  act2:  { set: 'mat', light: 'calm', shadow: 'room', posture: { DALIA: 0.04 },
           cast: { DALIA: { kf: [[0, 0, -2.2, -1.52, 0]], sit: 1, emo: 'neutral' } } },
  act3:  { set: 'room', light: 'evening', shadow: 'room', posture: { DALIA: 0.03 },
           cast: { DALIA: Object.assign(DAL(), { emo: 'neutral' }) } },
  close: { set: 'room', light: 'evening', shadow: 'room', side: { DALIA: 1, AMINA: -1 }, posture: { DALIA: 0.0 },
           cast: { DALIA: Object.assign(DAL(), { emo: 'happy' }), AMINA: Object.assign({}, AMI, { emo: 'sweet' }) } },
};

const D = HD.dalia, A = HD.amina, M = HD.mid, Bd = HD.bed, P = HD.park, Mt = HD.mat;
const up = (t, dy) => [t[0], t[1] + dy, t[2]];
const AS = [5.6, 5.7, -0.6];   // Amina standing (opening scene)
export const CAMS = {
  // ---- living room
  aerial: { p: [[-15, 32, 50], [-1.5, 9.5, 29]], l: [[0, 5, -3], [1, 5.6, -3]], f: [50, 40], ease: 'io' },
  daliaHook: Object.assign(K.pushIn(up(D, 0.0), 24, 16), { ease: 'out' }),
  daliaCu: K.closeUp(up(D, 0.0), 17.5),
  twoShot: { p: [[1.3, 8.5, 36], [1.3, 7.6, 31]], l: [M, M], f: [36, 34], ease: 'io', shake: 0.03 },
  aminaCuS: K.closeUp(AS, 17.5),
  pushAminaS: K.pushIn(AS, 26, 19),
  aminaCu: K.closeUp(up(A, 0.0), 17.5),
  pushAmina: K.pushIn(up(A, 0.0), 26, 19),
  lowAmina: K.lowAngle(up(A, -0.2), 21),
  verseZoom: K.zoomLens(up(A, -0.8), 30, 25),
  orbitTwo: K.orbit([M[0], M[1] - 0.6, M[2]], 30, 26, -42, -4),
  daliaCu2: K.closeUp(up(D, 0.0), 17, { roll: -3 }),
  wordZoom: K.zoomLens(up(A, -0.6), 26, 22),
  twoLow: { p: [[-8, 2.0, 30], [-4, 3.2, 28]], l: [M, M], f: [38, 34], r: [3, -1], ease: 'io' },
  daliaMed: K.pushIn(up(D, -0.4), 26, 19, { side: 2 }),
  aminaLow: K.lowAngle(up(A, -0.2), 20),
  twoDolly: K.dolly([-12, 7, 33], [10, 7, 31], [-3, 5.6, -3], [3, 5.6, -3]),
  cardZoom: K.zoomLens(up(A, -0.8), 30, 24),
  dollyZoom: K.dollyZoom(up(A, 0), 17, 40),
  craneRoom: K.crane(M, 22, 38, 20),
  finalPull: { p: [[-1, 6, 24], [4, 20, 52]], l: [M, [1.3, 6, -4]], f: [34, 44], ease: 'io' },
  // ---- night (a child calls, her mom comes)
  nightWide: { p: [[-3, 8, 34], [0, 6.5, 28]], l: [[0, 4.5, -4], [0, 4.5, -4]], f: [44, 40], ease: 'io', shake: 0.04 },
  nightNina: K.closeUp([0, 5.2, -4.9], 14),
  nightMom: { p: [[15, 5, 14], [9, 4.6, 10]], l: [[11, 4.2, -1.5], [5.5, 4.2, -3]], f: [38, 32], ease: 'io' },
  nightHug: K.zoomLens([2.4, 4.4, -4], 20, 14),
  // ---- bed
  bedPush: K.pushIn(Bd, 26, 20, { side: 3 }),
  bedPhone: { p: [[3.5, 6.4, 6.5], [6.4, 5.2, 4.2]], l: [[7.7, 3.6, -5], [7.7, 3.7, -5]], f: [34, 26], ease: 'io' },
  bedCu: K.closeUp(up(Bd, 0.0), 17),
  bedWide: K.wide([2, 5, -4], 34),
  // ---- park
  parkTrack: { p: [[-14, 5.5, 18], [-7, 5.5, 16]], l: [[0, 4.5, -10], [0, 5.2, 2]], f: [44, 38], ease: 'io', shake: 0.04 },
  parkLook: { p: [[11, 5.0, 14], [9, 5.6, 11.5]], l: [[0, 6.2, 3.5], [0, 6.8, 3.5]], f: [32, 27], ease: 'io' },
  parkSky: { p: [[1, 1.4, 11], [1, 2.2, 9.5]], l: [[0, 16, -10], [0, 34, -20]], f: [50, 58], ease: 'io', r: [0, -2] },
  parkSide: K.dolly([-13, 5.2, 13], [-7, 5.8, 10], [0, 5.6, 3.5], [0, 5.8, 3.5]),
  parkCu2: K.closeUp(up(P, 0.1), 17, { roll: 2 }),
  parkWide: K.crane(up(P, -1), 14, 36, 20),
  // ---- mat
  matPush: K.pushIn(Mt, 26, 20, { side: 3 }),
  matCu: K.closeUp(up(Mt, 0.0), 16),
  matDalia: K.zoomLens(Mt, 24, 19),
  matPull: K.crane(Mt, 14, 34, 18),
};
