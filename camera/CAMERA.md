# Camera style (every video in this repo)

This is the camera look from "What if nobody lied?". Dalia loves it, so all videos must use it.
Code: `camera.js` (the engine) and `shots.js` (ready-made shots). Real example: `videos/no_lies/` (see its `shots.js` and `plan.py`).

## Rules
1. **The camera always moves.** Every shot has a start and an end position, a look-at, and a zoom (fov). No static shots.
2. **Cut often.** A new shot every 1.5 to 3 seconds, and on every new line of dialogue or beat. Use 3 to 5 different shots per scene.
3. **Mix the shot types.** In one scene use a wide, a push in, a close-up, and one special move (orbit, crane, low angle, pan, dolly zoom).
4. **Every cut gets a small "punch-in"** (the zoom nudges in for a moment). It is built into `evalCam`.
5. **Between scenes use the whip-pan** (fast turn, blur, tiny flash): `whipPan()`.
6. **Phone calls and two places at once:** use the split screen: `renderSplit()`.
7. **Big moments:** one dolly zoom, one crane or pull back to end. Do not overuse the dolly zoom (once per video).
8. **Add handheld shake and a tiny tilt (roll)** on action or emotion shots. Keep it small.
9. **Open with an aerial or wide move, close with a pull back.**
10. Easing: `io` (smooth) for most moves, `out` for settling close-ups, `in` for zooms that accelerate, `lin` for dolly zoom.

## How to plan a video
For each scene write the lines and a list of shots with start times, like in `videos/no_lies/plan.py`:
`shots=[('aerial', 0), ('closeUp', 'L0'), ('zoomLens', 'L1'), ('wide', 'E-1.0')]`
(`L1` = when line 1 starts, `E-1.0` = one second before the scene ends). Then render every frame at 24 fps.

## Shot vocabulary (`shots.js`)
pushIn, closeUp, zoomLens, lowAngle, orbit, dolly, pan, crane, aerial, dollyZoom, wide, pullBack.
Aim them at a character's head `[x, y, z]`. Need a different move? Write a new shot object in the same format; do not invent a new camera system.
