// A SHOT LIBRARY you can aim at any character or spot. Each function returns a shot object for camera.js.
// target = [x, y, z] (use the character's head: x, 5.05*scale + y, z). Combine 3 to 5 of these per scene.
const T = (t, dy = 0) => [t[0], t[1] + dy, t[2]];
export const SHOTS = {
  // slow push in toward a face or object
  pushIn: (t, d0 = 22, d1 = 15, o = {}) => ({ p: [[t[0] + (o.side || 0), t[1] + 0.4, t[2] + d0], [t[0] + (o.side || 0) * 0.3, t[1] + 0.3, t[2] + d1]], l: [T(t), T(t, 0.1)], f: [36, 28], ease: 'io' }),
  // tight close-up with a tiny settle (use for a reaction or the punchline)
  closeUp: (t, d = 17, o = {}) => ({ p: [[t[0] + 2, t[1] + 0.5, t[2] + d + 2], [t[0] - 0.2, t[1] + 0.4, t[2] + d]], l: [T(t), T(t)], f: [30, 25], r: [o.roll || 0, 0], ease: 'out' }),
  // zoom with the lens only (fov shrinks), camera barely moves
  zoomLens: (t, d = 20, f1 = 18) => ({ p: [[t[0] + 0.6, t[1] + 1.2, t[2] + d], [t[0] + 0.4, t[1] + 1.1, t[2] + d - 3]], l: [T(t), T(t)], f: [38, f1], ease: 'in' }),
  // low hero angle looking up, slight tilt
  lowAngle: (t, d = 16) => ({ p: [[t[0] - 2, 1.8, t[2] + d], [t[0] - 3, 2.6, t[2] + d - 1.5]], l: [T(t), T(t, 0.2)], f: [34, 28], r: [4, -2], ease: 'io' }),
  // circle around the action
  orbit: (c, r0 = 25, r1 = 21, a0 = -55, a1 = -6) => ({ orbit: { c, r: [r0, r1], a: [a0, a1], h: [c[1] + 6, c[1] + 4] }, l: [c, c], f: [42, 40], ease: 'io' }),
  // sideways tracking move (camera slides, keeps looking at the action)
  dolly: (from, to, look0, look1) => ({ p: [from, to], l: [look0, look1], f: [44, 38], ease: 'io' }),
  // pan the camera across a crowd or a row of characters without moving it
  pan: (pos, look0, look1) => ({ p: [pos, [pos[0] + 2, pos[1] - 0.3, pos[2] - 2]], l: [look0, look1], f: [40, 30], ease: 'io' }),
  // crane: rise up and pull back to reveal the whole scene (great for endings)
  crane: (t, d0 = 15, d1 = 33, h1 = 24) => ({ p: [[t[0], 4, t[2] + d0], [t[0] + 5, h1, t[2] + d1]], l: [T(t), [t[0] - 2, 10, t[2] - 4]], f: [36, 44], ease: 'io' }),
  // aerial opening that swoops down into the scene
  aerial: (c) => ({ p: [[c[0] - 34, 52, c[2] + 80], [c[0] + 2, 13, c[2] + 36]], l: [[c[0], 6, c[2]], [c[0], 8.2, c[2] + 3]], f: [50, 42], ease: 'io' }),
  // dolly zoom ("Vertigo"): camera backs away while the lens zooms in, the background stretches. Use once, for a big moment.
  dollyZoom: (t, d0 = 17, d1 = 43) => ({ p: [[t[0], 9, t[2] + d0], [t[0], 9, t[2] + d1]], l: [T(t), T(t)], f: [44, 44 * d0 / d1], ease: 'lin' }),
  // wide establishing/closing shot with a little handheld shake
  wide: (c, d = 40) => ({ p: [[c[0], 8, c[2] + d], [c[0], 10, c[2] + d + 5]], l: [c, c], f: [48, 48], ease: 'io', shake: 0.05 }),
  // pull back from a close subject to a wide (ending)
  pullBack: (t, d0 = 26, d1 = 62) => ({ p: [[t[0], 5.2, t[2] + d0], [t[0] + 8, 22, t[2] + d1]], l: [T(t), [t[0], 8.5, t[2] - 4]], f: [34, 48], ease: 'io' }),
};
