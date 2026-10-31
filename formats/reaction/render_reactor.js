// node render_reactor.js <a> <b> [port] : renders reactor frames a..b (24 fps) with a transparent background into work/frames/
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const [a, b, port = '8772'] = process.argv.slice(2); const OUT = path.join(__dirname, 'work/frames'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await br.newPage({ viewport: { width: 576, height: 1024 }, deviceScaleFactor: 1 }); p.on('pageerror', e => console.log('pageerror:', e.message));
  await p.goto(`http://localhost:${port}/formats/reaction/reactor.html`); await p.waitForFunction(() => window.ready, null, { timeout: 120000 });
  for (let i = +a; i < +b; i++) { await p.evaluate(t => window.renderFrame(t), i / 24); await p.screenshot({ path: `${OUT}/f_${String(i).padStart(4, '0')}.png`, omitBackground: true }); }
  await br.close(); console.log(`[${a}-${b}] done`);
})();
