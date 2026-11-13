// EP 3: THE SECOND PAIR OF EYES. The mock screen shows a preflight checklist, a card with a typo and missing return address, and a decision tree.
import { cams, D, M } from './common.js';
import { app, bubble, chip, check, circle, typed, clamp, pop, rr } from '../screenkit.js';
export const title = ['The second', 'pair of', 'eyes'], tag = 'MICA AT WORK · EP 3';
export const card = { l1: 'What mistake would', l2: 'you catch early?', h: 'tell me below ♡' };
export const steps = [['list', 0, 'Tip 1'], ['catch', 0, 'Tip 2'], ['rules', 0, 'Tip 3']];
const stand = (x, ry, emo) => ({ kf: [[0, x, 6.5]], ry, emo });
const arrive = [[0, 19, 6.5, 0, -1.57], [0.9, 5, 6.5, 0, -0.5]];
export const SC = {
  oops: { cast: { DALIA: stand(-5, 0.4, 'worried') }, act: () => ({}) },
  list: { cast: { DALIA: stand(-5, 0.5, 'worried'), MICA: { kf: arrive, ry: -0.5, emo: 'excited' } }, act: () => ({}) },
  catch: { cast: { DALIA: stand(-5, 0.5, 'happy'), MICA: stand(5, -0.5, 'happy') }, act: (w, lt, c) => w === 'DALIA' && lt > c.L(2) ? { hop: true } : {} },
  rules: { cast: { DALIA: stand(-5, 0.5, 'happy'), MICA: stand(5, -0.5, 'stern') }, act: () => ({}) },
  end: { cast: { DALIA: stand(-3.6, 0.25, 'happy'), MICA: stand(3.6, -0.25, 'happy') }, act: (w, lt, c) => lt > c.L(1) ? { emo: 'excited', hop: true, wave: w === 'MICA' } : {} },
};
export const CAMS = {
  oopsDolly: cams.dollyWide, oopsClose: cams.closeD, oopsZoom: cams.zoomD,
  listLow: cams.lowM, listClose: cams.closeD2, listScreen: cams.screenPush,
  catchOrbit: cams.orbit, catchScreen: cams.screenSide, catchDz: cams.dz,
  rulesDolly: cams.dollyWide, rulesScreen: cams.screenPush, rulesClose: cams.closeM,
  endOrbit: cams.endOrbit, endPull: cams.endPull,
};
export function build(TL, ln) {
  const L = (s, i) => ln(s, i), T = { sheet: L('list', 2).v0, card: L('catch', 0).v0 + 0.5, typo: L('catch', 1).v0 + 0.2, ret: L('catch', 1).v0 + 1.8, ok: L('catch', 2).v0, tree: L('rules', 1).v0 - 0.3, end: L('end', 0).v0 };
  const ROWS = ['Card size 5 x 7', 'Spelling check', 'Return address', 'Colors match proof', 'Quantity correct'];
  function screenDraw(x, t) {
    if (t < T.sheet) { app(x, 'Mica · AI helper'); let y = 100; y = bubble(x, y, 'Send me your checklist!', 'ai', t, L('list', 0).v0 + 1.2, 40); return; }
    if (t < T.card - 0.2) { app(x, 'Preflight checklist', 'Before printing'); ROWS.forEach((r, i) => { chip(x, 24, 108 + i * 72, 440, 58, '#fff', r, t, T.sheet + i * 0.35, '#2a2147', 26); chip(x, 480, 108 + i * 72, 136, 58, '#e2d4ff', 'to do', t, T.sheet + i * 0.35 + 0.1, '#6a5a88', 24); }); return; }
    if (t < T.tree - 0.2) { app(x, 'Card proof', 'Mica is reading it'); x.fillStyle = '#fff'; x.shadowColor = 'rgba(80,40,120,.3)'; x.shadowBlur = 14; rr(x, 90, 110, 460, 330, 18); x.fill(); x.shadowBlur = 0; x.fillStyle = '#ff9fc4'; x.fillRect(90, 110, 460, 18);
      x.fillStyle = '#2a2147'; x.font = 'bold 38px Liberation Sans, sans-serif'; x.textAlign = 'center'; x.fillText('Welcome to the', 320, 210); x.fillText(t > T.typo + 1.4 ? 'garden' : 'gardan', 320, 262); x.font = '24px Liberation Sans, sans-serif'; x.fillStyle = '#8a7aa8'; x.fillText('Thank you for being here', 320, 318); x.textAlign = 'left';
      if (t > T.typo) { circle(x, 360, 252, 92, 34, t, T.typo); if (t > T.typo + 1.4) check(x, 478, 236, 14, t, T.typo + 1.4); }
      x.strokeStyle = '#b8a9d6'; x.setLineDash([8, 8]); x.lineWidth = 3; rr(x, 110, 372, 420, 52, 10); x.stroke(); x.setLineDash([]); x.fillStyle = '#b8a9d6'; x.font = 'bold 22px Liberation Sans, sans-serif'; x.fillText(t > T.ret + 1.2 ? 'Return address: added' : 'Return address: ???', 130, 398);
      if (t > T.ret) circle(x, 320, 398, 210, 32, t, T.ret); if (t > T.ret + 1.2) check(x, 506, 398, 14, t, T.ret + 1.2); return; }
    if (t < T.end) { app(x, 'Return rules', 'Decision tree'); const n = (a, b, w, txt, c, t0) => chip(x, a, b, w, 54, c, txt, t, t0, '#2a2147', 22);
      n(210, 100, 220, 'Order has a problem?', '#ffe3f0', T.tree); n(40, 220, 250, 'Box damaged? Refund', '#bff7f2', T.tree + 0.9); n(350, 220, 250, 'Late? Check tracking', '#fff1a8', T.tree + 1.5); n(40, 340, 250, 'Send a photo first', '#e2d4ff', T.tree + 2.2); n(350, 340, 250, 'Still lost? Resend', '#ffd9a8', T.tree + 2.8);
      x.strokeStyle = '#b8a9d6'; x.lineWidth = 4; [[320, 154, 165, 220], [320, 154, 475, 220], [165, 274, 165, 340], [475, 274, 475, 340]].forEach(([a, b, c, d], i) => { if (t > T.tree + 0.6 + i * 0.7) { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); } }); return; }
    app(x, 'Preflight checklist', 'All checked'); ROWS.forEach((r, i) => { chip(x, 24, 108 + i * 72, 440, 58, '#fff', r, t, -9, '#2a2147', 26); chip(x, 480, 108 + i * 72, 136, 58, '#bff7f2', 'done', t, -9, '#1a7a4a', 24); check(x, 440, 137 + i * 72, 14, t, T.end + i * 0.3); }); }
  return { screenDraw, notesIn: () => 0, notesOutT: () => 1e9 };
}
