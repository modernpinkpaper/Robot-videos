// usage: node render.js <outDir> <from> <to> [step]   renders frames [from,to) of the video as jpg (24 fps)
const { chromium } = require('playwright');
const [out, a, b, step] = [process.argv[2], +process.argv[3], +process.argv[4], +(process.argv[5] || 1)];
(async () => {
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await br.newPage({ viewport: { width: 576, height: 1024 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto('http://localhost:8766/videos/disagree/index.html');
  await p.waitForFunction(() => window.ready, null, { timeout: 180000 });
  for (let i = a; i < b; i += step) {
    const fp = `${out}/f_${String(i).padStart(4, '0')}.jpg`; if (require('fs').existsSync(fp) && require('fs').statSync(fp).size > 5000 && i < b - 1) continue;
    await p.evaluate(t => window.renderFrame(t), i / 24);
    await p.screenshot({ path: `${out}/f_${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 90 });
  }
  await br.close(); console.log(`[${a}-${b}] done`);
})();
