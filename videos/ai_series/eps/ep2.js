// EP 2: THE MESSY LIST. The mock screen shows Mica sorting a messy to-do list, asking a question, making labels + code, and a typo check.
import { cams, D, M } from './common.js';
import { app, bubble, chip, check, circle, typed, clamp, pop, rr } from '../screenkit.js';
export const title = ['The', 'messy', 'list'], tag = 'MICA AT WORK · EP 2';
export const card = { l1: 'Which task would you', l2: 'hand off first?', h: 'tell me below ♡' };
export const steps = [['dump', 0, 'Tip 1'], ['ask', 0, 'Tip 2'], ['check', 0, 'Tip 3']];
const stand = (who, x, ry, emo) => ({ kf: [[0, x, 6.5]], ry, emo });
const arrive = [[0, 19, 6.5, 0, -1.57], [0.9, 5, 6.5, 0, -0.5]];
export const SC = {
  mess: { cast: { DALIA: stand('D', -5, 0.4, 'worried') }, act: () => ({}) },
  dump: { cast: { DALIA: stand('D', -5, 0.5, 'worried'), MICA: { kf: arrive, ry: -0.5, emo: 'excited' } }, act: (w, lt, c) => w === 'DALIA' && lt > c.L(2) ? { emo: 'excited', hop: true } : {} },
  ask: { cast: { DALIA: stand('D', -5, 0.5, 'happy'), MICA: stand('M', 5, -0.5, 'happy') }, act: (w, lt, c) => w === 'DALIA' && lt > c.L(2) ? { emo: 'happy', hop: true } : {} },
  do: { cast: { DALIA: stand('D', -5, 0.5, 'excited'), MICA: stand('M', 5, -0.5, 'smug') }, act: (w, lt, c) => w === 'DALIA' && lt > c.L(2) ? { hop: true } : {} },
  check: { cast: { DALIA: stand('D', -5, 0.5, 'happy'), MICA: stand('M', 5, -0.5, 'stern') }, act: () => ({}) },
  end: { cast: { DALIA: stand('D', -3.6, 0.25, 'happy'), MICA: stand('M', 3.6, -0.25, 'happy') }, act: (w, lt, c) => lt > c.L(1) ? { emo: 'excited', hop: true, wave: w === 'MICA' } : {} },
};
export const CAMS = {
  messDolly: cams.dollyWide, messClose: cams.closeD, messZoom: cams.zoomD,
  dumpLow: cams.lowM, dumpClose: cams.closeD2, dumpScreen: cams.screenPush,
  askOrbit: cams.orbit, askScreen: cams.screenSide, askClose: cams.closeD,
  doDolly: cams.dollyWide, doScreen: cams.screenPush, doDz: cams.dz,
  checkLow: cams.lowD, checkScreen: cams.screenSide, checkClose: cams.closeM,
  endOrbit: cams.endOrbit, endPull: cams.endPull,
};
export function build(TL, ln) {
  const L = (s, i) => ln(s, i), T = { u: L('dump', 0).v0 + 0.2, sorted: L('dump', 2).v1 - 0.3, q: L('ask', 1).v0, a: L('ask', 2).v0, labels: L('do', 1).v0 + 0.2, code: L('do', 1).v0 + 2.2, chk: L('check', 1).v0, fix: L('check', 1).v0 + 1.6, end: L('end', 0).v0 };
  const COLORS = [['Pink', '#ff6fae'], ['Gold', '#ffd23f'], ['Blue', '#4a8bff'], ['Green', '#56c85a'], ['Plum', '#a07af0'], ['Peach', '#ff9a5a'], ['Teal', '#2fd6d6'], ['Rose', '#ff8fb8'], ['Navy', '#3d3a6a'], ['Sky', '#9ac8ff'], ['Lime', '#b8e986'], ['Fuschia', '#d61f8a']];
  function labels(x, t, t0, typo) { COLORS.forEach(([n, c], i) => { const gx = 24 + (i % 3) * 200, gy = 110 + Math.floor(i / 3) * 84, u = clamp((t - t0 - i * 0.12) / 0.3); if (u <= 0) return;
      const bad = typo && i === 11, name = bad && t > T.fix ? 'Fuchsia' : n; chip(x, gx, gy, 184, 66, c, name, t, t0 + i * 0.12, '#fff', 26); if (bad) { circle(x, gx + 92, gy + 33, 100, 42, t, T.chk + 0.4); if (t > T.fix) check(x, gx + 168, gy + 14, 14, t, T.fix); } }); }
  function screenDraw(x, t) {
    if (t < T.sorted) { app(x, 'Mica · AI helper'); let y = 100; y = bubble(x, y, "Hi! What's on your list?", 'ai', t, 0.5);
      y = bubble(x, y, "Here it is: 46 messy things. fix listing, labels?, sticky photo, reply to that email, ...", 'me', t, T.u, 34); if (t > T.u + 3.2) { x.fillStyle = '#8a7aa8'; x.font = 'bold 24px Liberation Sans, sans-serif'; x.fillText('Mica is sorting' + '.'.repeat(1 + Math.floor(t * 3) % 3), 24, y + 12); } return; }
    if (t < T.q - 0.3) { app(x, 'Mica · AI helper', 'Sorted into 3 piles'); [['Urgent', 6, '#ff6f8e'], ['Today', 12, '#ffb02e'], ['Later', 28, '#8fb8ff']].forEach(([n, k, c], i) => { const a = 24 + i * 204; chip(x, a, 110, 188, 56, c, n + '  ' + k, t, T.sorted + i * 0.3, '#fff', 30);
        for (let j = 0; j < Math.min(6, k); j++) chip(x, a, 184 + j * 52, 188, 42, '#fff', ['fix listing', 'reply', 'photo', 'labels', 'order check', 'ads'][j], t, T.sorted + 0.6 + i * 0.3 + j * 0.1, '#6a5a88', 20); }); return; }
    if (t < T.labels - 0.2) { app(x, 'Mica · AI helper'); let y = 100; y = bubble(x, y, "Task 46 says: fix the listing. Which listing?", 'ai', t, T.q, 40); y = bubble(x, y, 'The hydrangea notepad.', 'me', t, T.a, 30); y = bubble(x, y, 'Got it! Fixing the title and photos now.', 'ai', t, T.a + 1.4, 40); return; }
    if (t < T.chk) { app(x, 'Mica · AI helper', 'Template color labels'); labels(x, t, T.labels, false); if (t > T.code) { x.fillStyle = '#241d3a'; rr(x, 24, 392, 592, 72, 14); x.fill(); x.fillStyle = '#bff7f2'; x.font = '22px Liberation Mono, monospace'; x.fillText(typed('.photo { position: sticky; top: 20px; }', t, T.code, 30), 40, 412); x.fillStyle = '#ff9fc8'; x.fillText(typed('// photo stays while you scroll', t, T.code + 1.3, 30), 40, 440); } return; }
    if (t < T.end) { app(x, 'Mica · AI helper', 'You check my work'); labels(x, t, -99, true); return; }
    app(x, 'My task list'); const u = clamp((t - T.end) / 4); x.fillStyle = '#ffe3f0'; rr(x, 24, 150, 592, 54, 27); x.fill(); const g = x.createLinearGradient(24, 0, 616, 0); g.addColorStop(0, '#ff8fc8'); g.addColorStop(1, '#a98bff'); x.fillStyle = g; rr(x, 24, 150, 40 + 552 * (0.1 + 0.9 * u), 54, 27); x.fill();
    x.fillStyle = '#2a2147'; x.font = 'bold 92px Liberation Sans, sans-serif'; x.textAlign = 'center'; x.fillText(String(Math.round(46 - 40 * u)), 320, 300); x.font = 'bold 30px Liberation Sans, sans-serif'; x.fillText('tasks left', 320, 372); x.textAlign = 'left'; }
  return { screenDraw, notesIn: t => clamp((t - 0.3) / (L('mess', 0).v1 - 0.3)), notesOutT: i => i < 6 ? 1e9 : T.sorted + 0.3 + (i - 6) / 40 * (T.end + 4 - T.sorted) };
}
