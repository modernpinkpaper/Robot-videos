// Makes every preview picture in characters/expressive/preview/. Run:  node characters/expressive/make_previews.js [stills|faces|video]
// Needs the repo served on port 8766:  python3 -m http.server 8766   (from the repo root)
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const OUT = path.resolve(__dirname, 'preview'); fs.mkdirSync(OUT, { recursive: true });
const what = process.argv[2] || 'all';
const GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const URL = 'http://localhost:8766/characters/expressive/';

async function faces() {
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1300, height: 900 } });
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto(URL + 'sheet.html'); await p.waitForFunction(() => window.ready);
  const save = async (name, items, o) => {
    const size = await p.evaluate(([items, o]) => { const { EXPR, mix } = window.api; return window.renderSheet(items.map(i => ({ label: i.label, p: i.mix ? mix(i.mix) : EXPR[i.expr] })), o); }, [items, o]);
    await p.setViewportSize({ width: size[0], height: size[1] }); await p.locator('canvas').screenshot({ path: path.join(OUT, name) }); console.log('saved', name);
  };
  const groups = await p.evaluate(() => window.api.EXPR_GROUPS); let n = 1;
  for (const [g, names] of Object.entries(groups)) await save(`faces_${n++}_${g.toLowerCase().replace(/ /g, '_')}.png`, names.map(e => ({ label: e, expr: e })), { cols: 3, title: g });
  // parts: change ONE part of the face at a time (everything else stays neutral)
  const part = (part, names) => names.map(e => ({ label: e, mix: { base: 'neutral', [part]: e } }));
  await save('parts_1_eyes.png', part('eyes', ['neutral', 'deadpan', 'tired', 'happy', 'laugh', 'excited', 'in love', 'eye roll', 'side eye', 'smug', 'annoyed', 'angry', 'disgusted', 'surprised', 'shocked', 'scared', 'sad', 'crying', 'wink', 'embarrassed']), { cols: 4, title: 'Eyes only (the rest of the face stays neutral)', cell: 300 });
  await save('parts_2_brows.png', part('brows', ['neutral', 'happy', 'excited', 'surprised', 'shocked', 'skeptical', 'smirk', 'confused', 'annoyed', 'angry', 'furious', 'worried', 'sad', 'hurt', 'cringe', 'determined']), { cols: 4, title: 'Eyebrows only', cell: 300 });
  await save('parts_3_mouths.png', part('mouth', ['neutral', 'happy', 'big smile', 'laugh', 'tongue out', 'smirk', 'pout', 'eye roll', 'annoyed', 'angry', 'furious', 'disgusted', 'cringe', 'surprised', 'gasp', 'scared', 'sad', 'crying', 'sobbing', 'yawn', 'nervous smile', 'thinking', 'confused', 'embarrassed']), { cols: 4, title: 'Mouth only (jaw, teeth, tongue, lips)', cell: 300 });
  await save('parts_4_nose_cheeks_extras.png', [
    { label: 'nose: normal', mix: { base: 'neutral' } }, { label: 'nose: scrunch', mix: { base: 'neutral', nose: 'furious' } }, { label: 'nose: flare', mix: { base: 'neutral', nose: 'annoyed' } },
    { label: 'cheeks: blush', mix: { base: 'neutral', cheeks: 'in love' } }, { label: 'cheeks: puffed', mix: { base: 'neutral', cheeks: 'pout' } }, { label: 'cheeks: smile apples', mix: { base: 'neutral', cheeks: 'laugh' } },
    { label: 'extra: sweat drop', mix: { base: 'neutral', extras: 'scared' } }, { label: 'extra: anger mark + red face', mix: { base: 'neutral', extras: 'furious' } }, { label: 'extra: tears', mix: { base: 'neutral', eyes: 'crying' } },
  ], { cols: 3, title: 'Nose, cheeks and extras' });
  // mix and match: take each part from a different feeling
  const M = (label, eyes, brows, nose, mouth, cheeks, extras) => ({ label, mix: { base: 'neutral', eyes, brows, nose, mouth, cheeks, extras } });
  await save('mix_and_match.png', [
    M('"Fine." (sad eyes + big smile)', 'sad', 'worried', 'neutral', 'nervous smile', 'embarrassed', 'scared'),
    M('Polite but furious', 'annoyed', 'angry', 'furious', 'happy', 'happy', 'furious'),
    M('Evil joy', 'plotting', 'angry', 'neutral', 'big smile', 'happy', 'neutral'),
    M('Ugh, gross, but amused', 'disgusted', 'smirk', 'disgusted', 'smirk', 'smirk', 'neutral'),
    M('Shock, then a smirk', 'shocked', 'surprised', 'neutral', 'smirk', 'neutral', 'neutral'),
    M('Crying and laughing', 'crying', 'worried', 'neutral', 'laugh', 'laugh', 'neutral'),
  ], { cols: 3, title: 'Mix and match: parts from different feelings' });
  await br.close();
}

async function stills() {
  const br = await chromium.launch({ args: GL }); const p = await br.newPage({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto(URL + 'stage.html'); await p.waitForFunction(() => window.ready, null, { timeout: 120000 });
  const shot = async (name, W, H, build, views, states, t = 1) => { await p.setViewportSize({ width: W, height: H }); await p.evaluate(b => window.build(b), build); await p.evaluate(([W, H, v, s, t]) => window.draw(W, H, v, t, s), [W, H, views, states, t]); await p.screenshot({ path: path.join(OUT, name) }); console.log('saved', name); };
  const V = (x, y, w, h, pos, look, fov = 35) => ({ x, y, w, h, cam: { pos, look, fov } });
  // 1 meet the hero: full body + close up
  await shot('01_hero_mara.png', 1000, 900, [{ person: 'mara' }], [V(0, 0, 500, 900, [0, 4.4, 22], [0, 3.7, 0]), V(500, 0, 500, 900, [0, 5.9, 10], [0, 5.7, 0])], [{ face: 'smirk', pose: 'hips' }]);
  // 2 turnaround
  await shot('02_hero_turnaround.png', 1200, 560, [{ person: 'mara' }], [0, 1, 2, 3].map(i => { const a = [0, 40, 90, 180][i] * Math.PI / 180; return V(i * 300, 0, 300, 560, [Math.sin(a) * 20, 4.0, Math.cos(a) * 20], [0, 3.6, 0], 36); }), [{ face: 'happy', pose: 'idle', alive: false }]);
  // 4 poses
  const poses = ['idle', 'hips', 'shrug', 'facepalm', 'wave', 'armsUp', 'crossed', 'point', 'think'], pf = ['neutral', 'smirk', 'speechless', 'cringe', 'happy', 'excited', 'unimpressed', 'determined', 'thinking'];
  const pv = []; poses.forEach((n, i) => pv.push(V((i % 3) * 330, Math.floor(i / 3) * 520, 330, 520, [0, 4.2, 19], [0, 3.7, 0], 36)));
  for (let i = 0; i < 9; i++) { /* one character, drawn nine times with different states */ }
  await p.setViewportSize({ width: 990, height: 1560 });
  for (let i = 0; i < 9; i++) { await p.evaluate(b => window.build(b), [{ person: 'mara' }]); await p.evaluate(([i, pose, face, v]) => window.draw(990, 1560, [v], 1, [{ pose, face, alive: false }]), [i, poses[i], pf[i], pv[i]]); await p.screenshot({ path: path.join(OUT, `_pose${i}.png`), clip: { x: pv[i].x, y: pv[i].y, width: 330, height: 520 } }); }
  await br.close();
  // stitch poses with a tiny page
  const b2 = await chromium.launch(); const q = await b2.newPage({ viewport: { width: 990, height: 1620 } });
  const imgs = poses.map((n, i) => 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, `_pose${i}.png`)).toString('base64'));
  await q.setContent(`<body style="margin:0;background:#dde4f6;font:bold 30px Arial;color:#3a2c4e"><div style="display:grid;grid-template-columns:repeat(3,330px)">${imgs.map((s, i) => `<div style="position:relative"><img src="${s}"><div style="position:absolute;left:0;right:0;bottom:6px;text-align:center">${poses[i]}</div></div>`).join('')}</div></body>`);
  await q.setViewportSize({ width: 990, height: 1560 }); await q.screenshot({ path: path.join(OUT, '04_poses.png') }); console.log('saved 04_poses.png'); await b2.close();
  poses.forEach((n, i) => fs.unlinkSync(path.join(OUT, `_pose${i}.png`)));
}


// One card per character: full body + 6 close-up expressions. Plus a lineup of everyone.
async function cast(only) {
  const br = await chromium.launch({ args: GL }); const p = await br.newPage({ viewport: { width: 460, height: 680 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto(URL + 'stage.html'); await p.waitForFunction(() => window.ready, null, { timeout: 120000 });
  const roster = await p.evaluate(() => window.roster());
  const SIG = { mara: ['smirk', 'hips'], theo: ['happy', 'idle'], priya: ['smug', 'hips'], june: ['happy', 'crossed'], kai: ['excited', 'wave'], gus: ['annoyed', 'hips'], zoe: ['giggle', 'shrug'], finn: ['nervous smile', 'think'], hana: ['unimpressed', 'idle'], amina: ['big smile', 'idle'] };
  const SIX = ['happy', 'laugh', 'smirk', 'annoyed', 'shocked', 'sad'];
  const tiles = {};
  const tile = async (W, H, build, view, state) => { await p.setViewportSize({ width: W, height: H }); await p.evaluate(b => window.build(b), build); await p.evaluate(([W, H, v, s]) => window.draw(W, H, [v], 1, [s]), [W, H, view, state]); return (await p.screenshot({ clip: { x: 0, y: 0, width: W, height: H } })).toString('base64'); };
  for (const r of roster) {
    if (only && r.name !== only) continue;
    await p.setViewportSize({ width: 460, height: 680 }); await p.evaluate(n => window.build([{ person: n }]), r.name);
    const inf = (await p.evaluate(() => window.info()))[0];
    const dist = (inf.height + 1.6) / 0.611, midY = inf.height * 0.5 + 0.1;
    const body = await tile(460, 680, [{ person: r.name }], { x: 0, y: 0, w: 460, h: 680, cam: { pos: [0, midY, dist], look: [0, midY, 0], fov: 34 } }, { face: SIG[r.name][0], pose: SIG[r.name][1], alive: false });
    const heads = []; const hd = 7.6 * inf.head, hy = inf.headY + 0.35 * inf.head;
    for (const e of SIX) heads.push(await tile(300, 300, [{ person: r.name }], { x: 0, y: 0, w: 300, h: 300, cam: { pos: [0, hy, hd], look: [0, hy, 0], fov: 34 } }, { face: e, pose: 'idle', alive: false }));
    tiles[r.name] = { body, heads, r };
    // the character card
    const q = await br.newPage({ viewport: { width: 1180, height: 1130 } });
    const img = b => `data:image/png;base64,${b}`;
    await q.setContent(`<body style="margin:0;background:#f3eefb;font-family:Arial,sans-serif;color:#3a2c4e"><div style="padding:26px 30px 10px"><div style="font:bold 54px Arial">${r.name[0].toUpperCase() + r.name.slice(1)}</div><div style="font-size:26px;margin-top:6px;color:#5d4d78">${r.bio}</div></div>
      <div style="display:flex;gap:18px;padding:10px 30px 30px"><div><div style="background:#dde4f6;border-radius:26px;overflow:hidden"><img src="${img(body)}" style="display:block"></div><div style="margin-top:14px;font-size:24px;line-height:1.35;color:#5d4d78;max-width:450px">${r.tags}</div></div>
      <div style="display:grid;grid-template-columns:repeat(2,300px);gap:14px;align-content:start">${heads.map((h, i) => `<div style="background:#dde4f6;border-radius:22px;overflow:hidden;position:relative"><img src="${img(h)}" style="display:block"><div style="position:absolute;left:0;right:0;bottom:8px;text-align:center;font:bold 24px Arial"><span style="background:#fff;border-radius:20px;padding:3px 16px">${SIX[i]}</span></div></div>`).join('')}</div></div></body>`);
    await q.setViewportSize({ width: 1180, height: 1130 });
    await q.screenshot({ path: path.join(OUT, `cast_${r.name}.png`), clip: { x: 0, y: 0, width: 1180, height: 1110 } }); await q.close(); console.log('saved cast_' + r.name + '.png');
  }
  if (!only) {   // lineup of everyone
    const q = await br.newPage({ viewport: { width: 2400, height: 1500 } });
    await q.setContent(`<body style="margin:0;background:#dde4f6;font-family:Arial,sans-serif;color:#3a2c4e"><div style="font:bold 48px Arial;padding:24px 30px">The cast (10 characters)</div><div style="display:grid;grid-template-columns:repeat(5,460px);gap:0 8px;padding:0 20px">${roster.map(r => `<div style="position:relative"><img style="display:block;width:460px" src="data:image/png;base64,${tiles[r.name].body}"><div style="position:absolute;left:0;right:0;bottom:12px;text-align:center;font:bold 36px Arial"><span style="background:#fff;border-radius:26px;padding:4px 22px">${r.name[0].toUpperCase() + r.name.slice(1)}</span></div></div>`).join('')}</div></body>`);
    await q.screenshot({ path: path.join(OUT, '03_cast_all.png'), clip: { x: 0, y: 0, width: 2400, height: 1480 } }); console.log('saved 03_cast_all.png');
  }
  await br.close();
}

async function video() {
  const FR = path.join(OUT, '_frames'); fs.mkdirSync(FR, { recursive: true });
  const br = await chromium.launch({ args: GL }); const p = await br.newPage({ viewport: { width: 576, height: 1024 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto(URL + 'stage.html'); await p.waitForFunction(() => window.ready, null, { timeout: 120000 });
  await p.evaluate(() => window.build([{ person: 'mara' }]));
  const total = await p.evaluate(() => {
    window.SEQ = [['neutral', 0.9, 'idle'], ['happy', 1.2, 'idle'], ['laugh', 1.5, 'idle', { laugh: 1 }], ['smirk', 1.2, 'hips'], ['eye roll', 1.7, 'crossed', { roll: 1 }], ['annoyed', 1.1, 'crossed'], ['angry', 1.5, 'hips', { shake: 1 }], ['disgusted', 1.2, 'idle'], ['shocked', 1.2, 'armsUp'], ['scared', 1.2, 'shrug'], ['sad', 1.3, 'idle', { slump: 0.12 }], ['crying', 1.7, 'idle', { quiver: 1, slump: 0.1 }], ['embarrassed', 1.3, 'think'], ['wink', 1.2, 'point'], ['neutral', 0.8, 'idle']];
    return window.SEQ.reduce((a, s) => a + s[1], 0);
  });
  const fps = 24, n = Math.ceil(total * fps); console.log('frames', n);
  for (let i = 0; i < n; i++) {
    await p.evaluate(([t]) => {
      const { EXPR, lerpFace, eyeRoll } = window.api; const S = window.SEQ; let a = 0, k = 0;
      while (k < S.length - 1 && t >= a + S[k][1]) { a += S[k][1]; k++; }
      const tl = t - a, cur = S[k], prev = S[Math.max(0, k - 1)], B = 0.35, sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
      const bl = k === 0 ? 1 : sm(tl / B);
      let face = lerpFace(EXPR[prev[0]], EXPR[cur[0]], bl);
      const o = cur[3] || {};
      if (o.roll) { const u = Math.min(1, Math.max(0, (tl - 0.3) / 1.2)), r = eyeRoll(u); face = Object.assign({}, face, { lookX: r.lookX * bl, lookY: r.lookY }); }
      const pose = k === 0 ? cur[2] : [prev[2], cur[2], bl];
      const state = { face, pose, laugh: o.laugh || 0, shake: o.shake || 0, quiver: o.quiver || 0, slump: o.slump || 0, tilt: o.roll ? 0.12 * Math.sin(Math.min(1, tl / 1.2) * Math.PI) : undefined };
      window.label(cur[0]);
      const ang = Math.sin(t * 0.35) * 0.28, R = 14.5;
      window.draw(576, 1024, [{ x: 0, y: 0, w: 576, h: 1024, cam: { pos: [Math.sin(ang) * R, 5.6 + Math.sin(t * 0.5) * 0.25, Math.cos(ang) * R], look: [0, 4.6, 0], fov: 34 } }], t, [state]);
    }, [i / fps]);
    await p.screenshot({ path: path.join(FR, `f_${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 90 });
    if (i % 60 === 0) console.log('frame', i);
  }
  await br.close();
  require('child_process').execSync(`ffmpeg -y -loglevel error -framerate ${fps} -i ${FR}/f_%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 20 ${path.join(OUT, '05_motion_demo.mp4')}`);
  fs.rmSync(FR, { recursive: true }); console.log('saved 05_motion_demo.mp4');
}

(async () => {
  if (what === 'video') await video();
  if (what === 'cast') await cast(process.argv[3]);
  if (what === 'all' || what === 'faces') await faces();
  if (what === 'all' || what === 'stills') await stills();
})();
