// Tiny drawing helpers for the mock computer screen (everything is drawn fresh each frame from the time t).
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const pop = u => { u = clamp(u); const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
export const typed = (text, t, t0, cps = 38) => text.slice(0, Math.floor(Math.max(0, t - t0) * cps));
export const rr = (x, a, b, w, h, r) => { x.beginPath(); x.roundRect(a, b, w, h, r); };
export function wrap(x, text, maxW) { const words = text.split(' '), lines = []; let cur = ''; for (const w of words) { const t = cur ? cur + ' ' + w : w; if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; }
export function app(x, title, sub) {   // window background + header bar
  x.fillStyle = '#fff6ee'; x.fillRect(0, 0, 640, 480); const g = x.createLinearGradient(0, 0, 640, 0); g.addColorStop(0, '#ff8fc8'); g.addColorStop(1, '#a98bff'); x.fillStyle = g; x.fillRect(0, 0, 640, 64);
  for (let i = 0; i < 3; i++) { x.fillStyle = ['#fff', '#ffe36a', '#bff7f2'][i]; x.beginPath(); x.arc(30 + i * 26, 32, 8, 0, 7); x.fill(); }
  x.fillStyle = '#fff'; x.font = 'bold 28px Liberation Sans, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(title, 330, 32); x.textAlign = 'left';
  if (sub) { x.fillStyle = '#8a7aa8'; x.font = 'bold 20px Liberation Sans, sans-serif'; x.fillText(sub, 24, 86); } }
// a chat bubble. side 'me' (right, pink) or 'ai' (left, white). returns the bottom y so the next one can stack.
export function bubble(x, y, text, side, t, t0, cps = 40) {
  if (t < t0) return y; x.font = 'bold 27px Liberation Sans, sans-serif'; const lines = wrap(x, text, 400), w = Math.max(...lines.map(l => x.measureText(l).width)) + 36, h = lines.length * 34 + 22, bx = side === 'me' ? 616 - w : 24;
  const sc = pop((t - t0) / 0.25); x.save(); x.translate(bx + (side === 'me' ? w : 0), y + h); x.scale(sc, sc); x.translate(-(bx + (side === 'me' ? w : 0)), -(y + h));
  x.fillStyle = side === 'me' ? '#ff9fc8' : '#ffffff'; x.shadowColor = 'rgba(80,40,120,.25)'; x.shadowBlur = 8; rr(x, bx, y, w, h, 22); x.fill(); x.shadowBlur = 0;
  x.fillStyle = side === 'me' ? '#fff' : '#2a2147'; x.textBaseline = 'top'; let n = Math.floor((t - t0) * cps); for (let i = 0; i < lines.length; i++) { x.fillText(lines[i].slice(0, Math.max(0, n)), bx + 18, y + 12 + i * 34); n -= lines[i].length + 1; } x.restore(); return y + h + 14; }
export function chip(x, a, b, w, h, fill, text, t, t0, col = '#2a2147', size = 22) { if (t < t0) return; const s = pop((t - t0) / 0.3); x.save(); x.translate(a + w / 2, b + h / 2); x.scale(s, s); x.fillStyle = fill; rr(x, -w / 2, -h / 2, w, h, 14); x.fill(); x.fillStyle = col; x.font = `bold ${size}px Liberation Sans, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 0, 2); x.restore(); x.textAlign = 'left'; }
export function check(x, cx, cy, r, t, t0) { if (t < t0) return; const u = clamp((t - t0) / 0.3); x.strokeStyle = '#2fb56a'; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx - r, cy); x.lineTo(cx - r * 0.3, cy + r * 0.7 * Math.min(1, u * 2)); if (u > 0.5) x.lineTo(cx - r * 0.3 + (r * 1.5) * (u - 0.5) * 2, cy + r * 0.7 - r * 1.5 * (u - 0.5) * 2); x.stroke(); }
export function circle(x, cx, cy, rx, ry, t, t0, col = '#e83a4a') { if (t < t0) return; const u = clamp((t - t0) / 0.35); x.strokeStyle = col; x.lineWidth = 6; x.beginPath(); x.ellipse(cx, cy, rx, ry, -0.1, 0, Math.PI * 2 * u); x.stroke(); }
