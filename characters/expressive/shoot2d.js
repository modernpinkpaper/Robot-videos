// usage: node shoot2d.js out.png <groupName|all|json-file> [cols]
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [out, what, cols] = [process.argv[2], process.argv[3], +(process.argv[4] || 3)];
(async () => {
  const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1300, height: 900 } });
  p.on('pageerror', e => console.log('pageerror:', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto('http://localhost:8766/characters/expressive/sheet.html'); await p.waitForFunction(() => window.ready);
  const size = await p.evaluate(([what, cols]) => {
    const { EXPR, EXPR_GROUPS } = window.api; let names, title;
    if (what === 'all') { names = Object.keys(EXPR); title = 'All faces'; } else { names = EXPR_GROUPS[what]; title = what; }
    return window.renderSheet(names.map(n => ({ label: n, p: EXPR[n] })), { cols, title });
  }, [what, cols]);
  await p.setViewportSize({ width: size[0], height: size[1] });
  await p.locator('canvas').screenshot({ path: out }); await br.close(); console.log('saved', out, size);
})();
