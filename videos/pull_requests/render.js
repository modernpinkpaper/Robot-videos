// usage: node render.js frames <from> <to> <outDir>     (renders frames to jpg)
//        node render.js times <outDir> t1 t2 t3 ...      (renders test stills at those seconds)
const { chromium } = require('playwright');
const [mode, ...rest] = process.argv.slice(2);
(async () => {
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await br.newPage({ viewport: { width: 576, height: 1024 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto('http://localhost:8767/videos/pull_requests/index.html');
  await p.waitForFunction(() => window.ready, null, { timeout: 180000 });
  if (mode === 'times') { const out = rest[0]; for (const t of rest.slice(1).map(Number)) { await p.evaluate(x => window.renderFrame(x), t); await p.screenshot({ path: `${out}/t_${String(t).padStart(6, '0')}.jpg`, type: 'jpeg', quality: 88 }); } }
  else { const [a, b, out] = [Number(rest[0]), Number(rest[1]), rest[2]]; for (let i = a; i < b; i++) { await p.evaluate(t => window.renderFrame(t), i / 24); await p.screenshot({ path: `${out}/f_${String(i).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 90 }); } console.log(`[${a}-${b}] done`); }
  await br.close();
})();
