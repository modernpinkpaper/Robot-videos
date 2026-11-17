// usage: node render.js <outDir> <from> <to> [step]   renders frames [from,to) as jpg (24 fps), sharp 720x1280 (scale 1.25)
const { chromium } = require('playwright'); const fs = require('fs');
const [out, a, b, step] = [process.argv[2], +process.argv[3], +process.argv[4], +(process.argv[5] || 1)];
(async () => {
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 576, height: 1024 }, deviceScaleFactor: 1.25 });
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto('http://localhost:8766/videos/letter_puzzles/index.html'); await p.waitForFunction(() => window.ready, null, { timeout: 60000 });
  for (let i = a; i < b; i += step) { const fp = `${out}/f_${String(i).padStart(5, '0')}.jpg`; if (fs.existsSync(fp) && fs.statSync(fp).size > 5000) continue;
    await p.evaluate(t => window.renderFrame(t), i / 24); await p.screenshot({ path: fp, type: 'jpeg', quality: 90 }); }
  await br.close(); console.log(`[${a}-${b}] done`);
})();
