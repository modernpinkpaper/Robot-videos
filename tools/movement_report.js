// MOVEMENT REPORT: measures how alive the characters are, from the acting layers of a story/skit/explainer video (no rendering, takes seconds).
//   cd <repo root> && python3 -m http.server 8766 &        then:   node tools/movement_report.js videos/quran_calm [timeline.json]
// The video's index.html must expose  window.statesAt(t) -> { scene, chars: { WHO: { speaking, emo, pose, nod, tilt, lean, slump, turn, act, look } } }
// Rules checked (from menu/QUALITY.md): listeners are alive (something changes at least every ~3 s), speakers use their body, faces and poses vary,
// nothing sits still for a long stretch. WARN lines say what to fix. It cannot say whether a gesture FITS the words: that is what the fit sheet is for.
const { chromium } = require('playwright');
const dir = process.argv[2], tl = process.argv[3] || 'timeline.json';
(async () => {
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await br.newPage({ viewport: { width: 200, height: 300 } });
  p.on('pageerror', e => console.log('pageerror:', e.message));
  await p.goto(`http://localhost:8766/${dir}/index.html?tl=${tl}`); await p.waitForFunction(() => window.ready, null, { timeout: 120000 });
  const total = await p.evaluate(() => window.TOTAL_FOR_REPORT || 0);
  const data = await p.evaluate(() => { const out = []; const T = window.TOTAL_FOR_REPORT; for (let t = 0; t < T; t += 0.25) out.push([t, window.statesAt(t)]); return out; });
  await br.close();
  const final = (v) => { try { const a = JSON.parse(v); if (!Array.isArray(a)) return String(a); const k = a[2] ?? 0; return final(JSON.stringify(k > 0.5 ? a[1] : a[0])); } catch (e) { return String(v); } };
  const dt = 0.25, chars = {};
  for (const [t, s] of data) for (const w in s.chars) { const c = s.chars[w]; (chars[w] ||= []).push({ t, scene: s.scene, speaking: c.speaking, pose: final(c.pose), emo: final(c.emo), nod: c.nod, tilt: c.tilt, lean: c.lean, slump: c.slump, turn: c.turn, act: c.act }); }
  const warns = []; console.log(`${'character'.padEnd(10)} ${'seen'.padStart(6)} ${'listening alive'.padStart(16)} ${'longest still'.padStart(14)} ${'poses'.padStart(6)} ${'faces'.padStart(6)} ${'pose changes/min'.padStart(17)}`);
  for (const w in chars) {
    const a = chars[w], ev = new Array(a.length).fill(false), poses = new Set(), faces = new Set(); let poseChanges = 0;
    for (let i = 1; i < a.length; i++) {
      const p0 = a[i - 1], p1 = a[i]; poses.add(p1.pose); faces.add(p1.emo);
      if (p0.scene !== p1.scene) continue;
      const pc = p0.pose !== p1.pose; if (pc) poseChanges++;
      ev[i] = pc || p0.emo !== p1.emo || Math.abs(p1.nod - p0.nod) > 0.03 || Math.abs(p1.tilt - p0.tilt) > 0.03 || Math.abs(p1.lean - p0.lean) > 0.015 || Math.abs(p1.slump - p0.slump) > 0.02 || Math.abs(p1.turn - p0.turn) > 0.06 || p1.act !== p0.act;
    }
    const w15 = Math.round(1.5 / dt), alive = a.map((_, i) => ev.slice(Math.max(0, i - w15), i + w15 + 1).some(Boolean));
    const listen = a.map((x, i) => !x.speaking ? i : -1).filter(i => i >= 0), listenAlive = listen.length ? listen.filter(i => alive[i]).length / listen.length : 1;
    let still = 0, longest = 0; const stills = []; for (let i = 0; i < a.length; i++) { still = ev[i] ? 0 : still + dt; longest = Math.max(longest, still); if (still > 4.0 && (i === a.length - 1 || ev[i + 1])) stills.push(`${a[i].scene} ${(a[i].t - still).toFixed(1)}s to ${a[i].t.toFixed(1)}s`); }
    if (stills.length) console.log(`   ${w} still stretches over 4 s: ${stills.join(' | ')}`);
    const mins = a.length * dt / 60, ppm = poseChanges / Math.max(0.2, mins);
    console.log(`${w.padEnd(10)} ${(a.length * dt).toFixed(0).padStart(5)}s ${(listenAlive * 100).toFixed(0).padStart(15)}% ${longest.toFixed(1).padStart(13)}s ${String(poses.size).padStart(6)} ${String(faces.size).padStart(6)} ${ppm.toFixed(1).padStart(17)}`);
    if (a.length * dt > 20) {   // only characters with a real role
      if (listenAlive < 0.7) warns.push(`${w}: listening but still too often (${(listenAlive * 100).toFixed(0)}% alive; want 70% or more). Add nods, tilts, leans or beats.`);
      if (longest > 4.5) warns.push(`${w}: nothing changes for ${longest.toFixed(1)} s at the longest. Add a small beat.`);
      if (poses.size < 5) warns.push(`${w}: only ${poses.size} different poses. Use more of the library (hand on heart, open palms, shrug, think, point...).`);
      if (faces.size < 8) warns.push(`${w}: only ${faces.size} different faces. Match the feeling of each moment.`);
      if (ppm < 4) warns.push(`${w}: only ${ppm.toFixed(1)} pose changes a minute. Use the body on the important words.`);
    }
  }
  console.log(warns.length ? '\nWARNINGS:\n - ' + warns.join('\n - ') : '\nAll movement checks pass.');
})();
