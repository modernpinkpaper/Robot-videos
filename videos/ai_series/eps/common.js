import { SHOTS } from '../../../camera/shots.js';
export const D = [-5, 5.05, 6.5], M = [5, 5.05, 6.5], SCR = [0, 10.4, -3.2];
// camera shots shared by the episodes (all from the shared camera toolkit, aimed at Dalia / Mica / the big screen)
export const cams = {
  dollyWide: SHOTS.dolly([-22, 6, 32], [-8, 6, 27], [-4, 5.5, 2], [-1, 6.5, 0]),
  closeD: SHOTS.closeUp(D, 12), closeD2: SHOTS.closeUp(D, 11, { roll: -3 }), closeM: SHOTS.closeUp(M, 12),
  zoomD: SHOTS.zoomLens(D, 18, 17), lowM: SHOTS.lowAngle(M, 15), lowD: SHOTS.lowAngle(D, 15),
  screenPush: { p: [[0, 9.8, 35], [0, 10.2, 29]], l: [SCR, SCR], f: [34, 34], ease: 'io' },
  screenSide: { p: [[-12, 10, 31], [10, 10, 29]], l: [[-1.5, 10, -3], [1.5, 10, -3]], f: [36, 34], ease: 'io' },
  orbit: { orbit: { c: [0, 5, 2], r: [30, 24], a: [-45, 35], h: [10, 8] }, l: [[0, 6, 0], [0, 6.5, 0]], f: [42, 40], ease: 'io' },
  dz: SHOTS.dollyZoom(M, 14, 34),
  endOrbit: { orbit: { c: [0, 4.6, 5], r: [20, 17], a: [-45, 40], h: [6, 7] }, l: [[0, 5, 5], [0, 5.3, 5]], f: [40, 38], ease: 'io', shake: 0.03 },
  endPull: SHOTS.pullBack([0, 5.05, 6.5], 15, 40),
};
