const { chromium } = require('playwright'); const fs = require('fs');
// Turntable preview: both characters side by side, the camera turns once around them, then pushes in on the faces. Needs the repo served on :8766.
//   node characters/expressive/turntable.js <frames-folder> [name1 name2]   then join the jpgs with ffmpeg (24 fps)
const OUT = process.argv[2], W = 1024, H = 576, FPS = 24, N = 240;
const sm = u => { u = Math.min(1, Math.max(0, u)); return u * u * (3 - 2 * u); };
(async () => {
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await br.newPage({ viewport: { width: W, height: H } });
  p.on('pageerror', e => console.log('pageerror:', e.message));
  await p.goto('http://localhost:8766/characters/expressive/stage.html'); await p.waitForFunction(() => window.ready);
  await p.evaluate(names => window.build([{ person: names[0], x: -2.7 }, { person: names[1], x: 2.7 }]), [process.argv[3] || 'dalia', process.argv[4] || 'amina']);
  for (let i = 0; i < N; i++) {
    const t = i / FPS;
    // 0-1s front, 1-8s one full turn, 8-10s push in on the two faces from the front
    const a = sm((t - 1) / 7) * Math.PI * 2, push = sm((t - 8) / 2);
    const r = 21 - 8 * push, h = 5.2 - 0.3 * push, ly = 3.9 + 1.2 * push, fov = 32 - 6 * push;
    const pos = [Math.sin(a) * r, h, Math.cos(a) * r];
    const st = [{ face: Math.sin(t * 0.9) > 0.2 ? 'big smile' : 'happy', pose: 'idle' }, { face: Math.sin(t * 0.9 + 1) > 0.2 ? 'big smile' : 'happy', pose: 'idle' }];
    await p.evaluate(([W, H, pos, ly, fov, t, st]) => window.draw(W, H, [{ x: 0, y: 0, w: W, h: H, cam: { pos, look: [0, ly, 0], fov } }], t, st), [W, H, pos, ly, fov, t, st]);
    await p.screenshot({ path: `${OUT}/f_${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  await br.close();
})();
