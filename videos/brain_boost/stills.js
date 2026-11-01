// usage: node stills.js <outDir> <seconds> [<seconds> ...]   renders single frames at those times (jpg) to check a moment. Needs: python3 -m http.server 8766 in the repo root.
const { chromium } = require('playwright');
const [out, ...ts] = process.argv.slice(2);
(async () => {
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await br.newPage({ viewport: { width: 576, height: 1024 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto('http://localhost:8766/videos/brain_boost/index.html'); await p.waitForFunction(() => window.ready, null, { timeout: 180000 });
  for (const t of ts) { await p.evaluate(t => window.renderFrame(t), +t); await p.screenshot({ path: `${out}/t_${(+t).toFixed(1)}.jpg`, type: 'jpeg', quality: 88 }); }
  await br.close();
})();
