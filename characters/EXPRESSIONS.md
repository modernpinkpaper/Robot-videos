# Expressive characters (DRAFT: waiting for Dalia to approve)

A second kind of character, made for REACTION videos. Same soft pastel toy look as the robots, but the face is real:
big eyes with whites and pupils, eyelids, thick eyebrows, nose, cheeks, a mouth with teeth and tongue. Inspired by the "Claim Line" character (the one that rolls his eyes).
The robots and `robots.js` are NOT changed. Everything lives in `characters/expressive/`.

## Look at the pictures first (`characters/expressive/preview/`)
- `01_hero_mara.png` full body + close up of the hero (Mara)
- `02_hero_turnaround.png` front, three-quarter, side, back
- `03_cast.png` the 5 starter characters (different skin tones, hair, ages, glasses, a kid)
- `04_poses.png` 9 body poses (idle, hips, shrug, facepalm, wave, armsUp, crossed, point, think), all with the new noodle arms
- `faces_1_calm.png` ... `faces_7_shy_and_awkward.png` all 50 faces, grouped
- `parts_1_eyes.png`, `parts_2_brows.png`, `parts_3_mouths.png`, `parts_4_nose_cheeks_extras.png` each part on its own
- `mix_and_match.png` parts taken from different feelings ("Fine." = sad eyes + big smile)
- `05_motion_demo.mp4` Mara cycling through feelings, including an animated eye roll

## How the body is built (matches the Claim Line people)
- ONE soft egg-shaped torso, wider at the bottom. No neck: the head sits right on the torso and its chin overlaps it.
- Arms are single smooth tubes that start inside the side of the torso and bend like noodles, ending in a round mitten. No joints, no gaps.
- Short stubby legs ending in big round shoes.
- Poses are written as where the elbow and the hand go (`POSES` in `body.js`), so a new pose is just two points per arm.

## How a face works (`faces.js`)
A face is a set of numbers. Each part of the face has its own numbers, so a character can mix parts.
| Part | What it controls |
|---|---|
| eyes | open (0 closed to 1.25 wide), lower lid squint, lid slant (angry or sad), where the pupils look, pupil size, shine (sparkle, stars, hearts), tears, closed-eye curve |
| brows | height, angle, arch, pull toward the middle. Each brow separately, so one can go up |
| nose | scrunch (wrinkles on the bridge), nostril flare |
| mouth (and jaw) | open (jaw drop), width, round "O", smile per corner (smirk), snarl per side, top teeth, bottom teeth, tongue (1 to 2 = stuck out), shift sideways, chin dimple |
| cheeks | blush, puffed cheeks, smile apples |
| extras | sweat drop, anger mark, red flush |

Honest limit: the head is one solid shape, so the "jaw" is drawn (mouth opens, lips stretch, chin dimple). The skull does not move.

## Using it in code
```js
import { EXPR, mix, lerpFace, eyeRoll } from './characters/expressive/faces.js';
import { createExpressiveKit } from './characters/expressive/body.js';
const xk = createExpressiveKit(THREE, RoundedBoxGeometry, kit);   // kit = createRobotKit(...) from robots.js
const c  = xk.mkExpressive({ parent: scene, ...xk.PEOPLE_X[0] });  // mara, theo, priya, june, kai
// every frame (t = seconds):
xk.animateExpressive(c, t, { face: EXPR['smirk'], pose: 'hips', talk: 0.6 });
```
- `EXPR['name']` gives a ready face. Names are listed in `EXPR_GROUPS`.
- Mix parts: `mix({ base: 'neutral', eyes: 'shocked', brows: 'angry', mouth: 'smirk' })`.
- Blend two faces over time: `lerpFace(EXPR.neutral, EXPR.angry, k)` (k from 0 to 1, about 0.3 s feels natural).
- Eye roll: `const r = eyeRoll(u)` for u from 0 to 1, then set `lookX`, `lookY` on the face.
- `animateExpressive` options: `pose` (name, or `[a, b, k]` to blend), `talk` (mouth moves for speech, 0 to 1), `laugh`, `shake` (rage), `quiver` (crying), `slump`, `lean`, `tilt`, `nod`, `turn`, `alive:false` (turn off automatic blinking).
- Blinks and tiny eye movement are automatic.

## Remake the pictures
```
python3 -m http.server 8766        # from the repo root, leave it running
node characters/expressive/make_previews.js faces     # the face sheets
node characters/expressive/make_previews.js stills    # hero, turnaround, cast, poses
node characters/expressive/make_previews.js video     # the motion clip (slow)
```
`sheet.html` (2D faces) and `stage.html` (3D stage) are the pages those scripts open.

## Next steps (after Dalia approves)
1. Build out the rest of the cast with all faces (the engine already takes skin, hair and eye color).
2. Add voices and lip sync (`talk`) using the piper pipeline.
3. Add a "reaction" example video and mark it in `examples/INDEX.md`.
