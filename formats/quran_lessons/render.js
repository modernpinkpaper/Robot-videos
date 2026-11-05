// usage: node formats/quran_lessons/render.js <videoDir> <outDir> <from> <to> [step]   (24 fps; needs `python3 -m http.server 8766` in the repo root)
const { chromium } = require('playwright'); const fs = require('fs');
const [vd, out, a, b, step] = [process.argv[2], process.argv[3], +process.argv[4], +process.argv[5], +(process.argv[6] || 1)];
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 576, height: 1024 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto(`http://localhost:8766/${vd}/index.html`); await p.waitForFunction(() => window.ready, null, { timeout: 60000 });
  for (let i = a; i < b; i += step) { await p.evaluate(t => window.renderFrame(t), i / 24); await p.screenshot({ path: `${out}/f_${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 }); }
  await br.close(); console.log('done');
})();
