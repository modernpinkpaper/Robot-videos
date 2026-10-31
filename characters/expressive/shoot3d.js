// usage: node shoot3d.js <job.json>   job: { out, W, H, build:[...], views:[...], t, states:[...] }  (or a JS module exporting the same)
const { chromium } = require('playwright'); const fs = require('fs');
const job = require(require('path').resolve(process.argv[2]));
(async () => {
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await br.newPage({ viewport: { width: job.W, height: job.H }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto('http://localhost:8766/characters/expressive/stage.html'); await p.waitForFunction(() => window.ready, null, { timeout: 120000 });
  await p.evaluate(j => { window.build(j.build); }, job);
  const shots = job.shots || [{ out: job.out, t: job.t || 0, states: job.states, views: job.views }];
  for (const s of shots) { await p.evaluate(([W, H, s]) => window.draw(W, H, s.views, s.t || 0, s.states), [job.W, job.H, s]); await p.screenshot(s.out.endsWith('.jpg') ? { path: s.out, type: 'jpeg', quality: 92 } : { path: s.out }); console.log('saved', s.out); }
  await br.close();
})();
