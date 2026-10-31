// Scenes + camera shots for "The 1-Minute Machine". Cameras come from the shared toolkit (camera/shots.js).
import { SHOTS } from '../../camera/shots.js';
const PI = Math.PI;
const D = [-3.5, 5.05, 5.5], M = [4.8, 5.05, 5.5];   // heads: Dalia, Mica
export const SC = {
  hand: { cast: { DALIA: { kf: [[0, -3.5, 5.5]], ry: 0.3, emo: 'tired' } }, act: () => ({}) },
  idea: { cast: { DALIA: { kf: [[0, -3.5, 5.5]], ry: 0.45, emo: 'tired' }, MICA: { kf: [[0, 19, 5.5, 0, -1.57], [1.5, 4.8, 5.5, 0, -0.45]], ry: -0.45, emo: 'excited' } },
    act: (w, lt, c) => w === 'DALIA' && lt > c.L(1) ? { emo: 'sweet', hop: true } : {} },
  build: { cast: { DALIA: { kf: [[0, -4.5, 6]], ry: 0.5, emo: 'happy' }, MICA: { kf: [[0, 5.2, 6]], ry: -0.5, emo: 'happy' } },
    act: (w, lt, c) => w === 'DALIA' ? { emo: 'excited', hop: lt > c.L(1) + 1.0 } : {} },
  run: { cast: { DALIA: { kf: [[0, -4.5, 6.5]], ry: 0.5, emo: 'worried' }, MICA: { kf: [[0, 5.4, 6.5]], ry: -0.5, emo: 'smug' } },
    act: (w, lt, c) => w === 'DALIA' ? (lt > c.L(0) + 2.0 ? { emo: 'shock', hop: lt > c.L(1) + 0.1 } : { emo: 'worried' }) : (lt > c.L(1) ? { emo: 'smug' } : {}) },
  end: { cast: { DALIA: { kf: [[0, -3.6, 6.5]], ry: 0.25, emo: 'happy' }, MICA: { kf: [[0, 3.6, 6.5]], ry: -0.25, emo: 'happy' } },
    act: (w, lt, c) => lt > c.L(2) ? { emo: 'excited', hop: true, wave: w === 'MICA' } : {} },
};
export const CAMS = {
  // hand: dolly in, close-up on Dalia, zoom on the pile
  handDolly: SHOTS.dolly([-22, 6, 28], [-9, 5.5, 22], [-6, 4, 2], [-3.5, 4.6, 4]),
  handClose: SHOTS.closeUp(D, 12),
  handPile: SHOTS.zoomLens([-8, 3.8, -1.4], 20, 17),
  // idea: pan to Mica rolling in, low angle on Mica, close-up Dalia
  ideaPan: SHOTS.pan([2, 5.2, 26], [-3.5, 4.6, 5], [6, 4.6, 5]),
  ideaLow: SHOTS.lowAngle(M, 15),
  ideaClose: SHOTS.closeUp(D, 12, { roll: -3 }),
  // build: orbit the bench, close-up, push in on the machine, side dolly
  buildOrbit: { orbit: { c: [0, 4.5, 0], r: [30, 24], a: [-40, 5], h: [11, 8] }, l: [[0, 4.5, -2], [0, 5, -2]], f: [42, 40], ease: 'io' },
  buildClose: SHOTS.closeUp(M, 12),
  buildPush: { p: [[0, 8, 44], [0, 7, 34]], l: [[0, 5.5, -2], [0, 5.5, -2]], f: [48, 46], ease: 'io' },
  buildDolly: { p: [[-15, 7, 33], [12, 7, 31]], l: [[-6, 5, -2], [6, 5.5, -2]], f: [46, 44], ease: 'io' },
  // run: button close-up, fast dolly with the belt, counter, DOLLY ZOOM on Dalia's shock, close-up Mica
  runBtn: SHOTS.closeUp([8, 3.6, 6], 10),
  runDolly: { p: [[-16, 8, 40], [14, 8, 36]], l: [[-6, 5.5, -2], [6, 5.8, -2]], f: [50, 46], ease: 'lin', shake: 0.04 },
  runCounter: SHOTS.closeUp([12.4, 5, -2], 13),
  runDz: SHOTS.dollyZoom([-4.5, 5.05, 6.5], 14, 34),
  runClose: SHOTS.closeUp([5.4, 5.05, 6.5], 11),
  // end: low angle, orbit, pull back
  endLow: SHOTS.lowAngle([0, 5.05, 6.5], 17),
  endOrbit: { orbit: { c: [0, 4.6, 5], r: [20, 17], a: [-45, 40], h: [6, 7] }, l: [[0, 5, 5], [0, 5.3, 5]], f: [40, 38], ease: 'io', shake: 0.03 },
  endPull: SHOTS.pullBack([0, 5.05, 6.5], 15, 40),
};
