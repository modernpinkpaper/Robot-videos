// node examples/camera/render_reel.js   (serves the repo root on port 8770, renders frames, then run the ffmpeg line printed at the end)
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..'); const OUT = path.join(__dirname, 'frames'); fs.mkdirSync(OUT, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); } }); }).listen(8770);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 576, height: 1024 } }); p.on('pageerror', e => console.log('pageerror:', e.message));
  await p.goto('http://localhost:8770/examples/camera/reel.html'); await p.waitForFunction(() => window.ready, null, { timeout: 120000 });
  const total = await p.evaluate(() => window.TOTAL); const n = Math.round(total * 24); const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
  for (let i = 0; i < n; i++) { if (only && !only.includes(i)) continue; await p.evaluate(t => window.renderFrame(t), i / 24); await p.screenshot({ path: `${OUT}/f_${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 90 }); }
  console.log('frames', n, 'seconds', total); await b.close(); srv.close();
})();
