// THE CAMERA STYLE (from "What if nobody lied?"). Use it for EVERY video in this repo.
// A shot is a plain object:
//   { p:[[x,y,z],[x,y,z]]  camera position start/end        (or orbit:{ c:[x,y,z], r:[r0,r1], a:[deg0,deg1], h:[y0,y1] })
//     l:[[x,y,z],[x,y,z]]  look-at start/end                  f:[fov0,fov1]   field of view (zoom)
//     r:[deg0,deg1]        roll (tilt, optional)              ease:'io'|'in'|'out'|'lin'    shake:0.04 (handheld, optional) }
// Every shot MOVES from its start to its end over its own duration. Nothing sits still.
export const lerp = (a, b, t) => a + (b - a) * t, clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
export const EASE = { lin: u => u, io: smooth, in: u => u * u, out: u => 1 - (1 - u) * (1 - u) };
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

// Work out the camera for a shot. u = 0..1 progress through the shot, t = global time, tShot = shot start time, first = is this the first shot of the video
export function evalCam(cd, u, t, tShot, first) {
  const e = EASE[cd.ease || 'io'](clamp(u)); let p;
  if (cd.orbit) { const o = cd.orbit, a = lerp(o.a[0], o.a[1], e) * Math.PI / 180, r = lerp(o.r[0], o.r[1], e); p = [o.c[0] + Math.sin(a) * r, lerp(o.h[0], o.h[1], e), o.c[2] + Math.cos(a) * r]; } else p = lerp3(cd.p[0], cd.p[1], e);
  const l = lerp3(cd.l[0], cd.l[1], e); let fov = lerp(cd.f[0], cd.f[1], e); const roll = cd.r ? lerp(cd.r[0], cd.r[1], e) : 0;
  const sh = cd.shake || 0; if (sh) { p[0] += Math.sin(t * 11.3) * sh + Math.sin(t * 5.1) * sh; p[1] += Math.sin(t * 9.7 + 1) * sh; l[0] += Math.sin(t * 7.9) * sh * 1.5; l[1] += Math.cos(t * 6.3) * sh * 1.5; }
  if (!first) fov *= 1 - 0.07 * Math.exp(-(t - tShot) * 16);   // small "punch-in" on every cut
  return { p, l, fov, roll };
}
// Put a three.js camera where evalCam says. yaw is used by the whip-pan between scenes.
export function applyCam(camera, c, aspect, yaw = 0) {
  camera.aspect = aspect; camera.fov = c.fov; camera.updateProjectionMatrix(); camera.position.set(...c.p);
  let dx = c.l[0] - c.p[0], dz = c.l[2] - c.p[2]; if (yaw) { const cs = Math.cos(yaw), sn = Math.sin(yaw); [dx, dz] = [dx * cs + dz * sn, -dx * sn + dz * cs]; }
  camera.up.set(0, 1, 0); camera.lookAt(c.p[0] + dx, c.l[1], c.p[2] + dz); if (c.roll) camera.rotateZ(c.roll * Math.PI / 180);
}
// Which shot of a scene is playing now. scene = { end, shots:[{ name, t }] } (t = absolute start time of each shot)
export function shotAt(S, t) { let i = 0; for (let k = 0; k < S.shots.length; k++) if (t >= S.shots[k].t - 1e-6) i = k; const st = S.shots[i].t, en = i + 1 < S.shots.length ? S.shots[i + 1].t : S.end; return { i, st, en, name: S.shots[i].name, u: (t - st) / (en - st) }; }

// Whip-pan between scenes: a fast turn + blur + a tiny flash around each scene cut (tb = cut time, k = scene number).
// Returns { yaw, blur, flash }: pass yaw to applyCam, set canvas.style.filter = `blur(${blur}px)`, and use flash as a white overlay opacity.
export function whipPan(t, cuts) {
  let yaw = 0, blur = 0, flash = 0;
  cuts.forEach((tb, k) => { const d = t - tb, dir = (k + 1) % 2 ? 1 : -1; if (d > -0.2 && d < 0.2) { const u = d < 0 ? (d + 0.2) / 0.2 : 1 - d / 0.2; const sgn = d < 0 ? 1 : -1; yaw = sgn * dir * 0.9 * u * u; blur = 20 * Math.pow(u, 1.2); flash = 0.22 * u; } });
  return { yaw, blur, flash };
}
// Split screen (for phone calls etc.): two cameras, top and bottom. k = 0..1 slide-in progress (use smooth(localTime/0.55)).
// renderPanel(key, viewportY, height) must set up that half's sets/cast/camera and call renderer.render(). Panels: 'top' and 'bot'.
export function renderSplit(renderer, W, H, k, renderPanel) {
  const gap = 12 * k, topH = Math.round(lerp(H, (H - 12) / 2, k)), botH = H - topH - Math.round(gap);
  renderer.setScissorTest(false); renderer.setClearColor(0x1d1730, 1); renderer.setViewport(0, 0, W, H); renderer.clear(); renderer.setScissorTest(true);
  for (const [key, y0, h] of [['top', 0, topH], ['bot', topH + Math.round(gap), botH]]) { if (h < 4) continue; const yb = H - y0 - h; renderer.setViewport(0, yb, W, h); renderer.setScissor(0, yb, W, h); renderPanel(key, h); }
  renderer.setScissorTest(false);
}
