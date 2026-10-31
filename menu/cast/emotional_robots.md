# Cast: EMOTIONAL ROBOTS style (approved by Dalia)
Say it like: "use the emotional robots", "emotional robot style", "make it with the expressive characters".
Soft toy people with REAL faces: big eyes with whites and pupils, eyelids, thick eyebrows, nose, cheeks, a mouth with teeth and tongue. Best for reaction videos, skits and talking-to-camera, where the feeling must show on the face.
Everything lives in `characters/expressive/`. Full guide: `characters/EXPRESSIONS.md`. Pictures of every character and face: `characters/expressive/preview/`.
Do not use the old dot-eyed people (`mkHuman`) or the robots in an emotional-robots video unless she asks for a mix.

## The 12 characters (ROSTER in `characters/expressive/body.js`)
| Name | Look | Voice to use (voices_cfg.py) |
|---|---|---|
| mara | calm, hair bun, work badge, navy cardigan | SOFIA |
| theo | broad head, buzz cut, trimmed beard, yellow hoodie | MARCUS |
| priya | slim, long straight hair, long lashes, pink top | LILY |
| june | grandma, silver bun, gold round glasses, teal cardigan | GRANDPA, set pitch higher (no grandma voice yet) |
| kai | kid, curly hair, freckles, overalls | KID_BOY |
| gus | round, bald, big mustache, bushy brows, red top + overalls | GRANDPA |
| zoe | big sparkly eyes, lavender space buns, polka-dot top | LILY |
| finn | tall, ginger spikes, square glasses, striped top | MARCUS, set pitch higher |
| hana | soft face, black bob with bangs, coral top | SOFIA |
| dalia | long dark hair, bold brows, big smile, navy ribbed top. Dalia herself. | DALIA |
| nina | 6 years old, curly pigtails, floral dress | KID_GIRL |
| amina | brown hijab, cream cardigan, freckles, big smile | AMINA |
Dalia, Amina and Nina are based on Dalia's family. Never put real family or kids' names on screen; the character names are fine.
Pick the characters the story needs. If she names them ("Dalia and Nina"), use those. Otherwise choose at least 2 that look clearly different.

## How to use them in a video
1. Copy the pipeline from `videos/no_lies/` (plan.py, build_audio.py, index.html, shots.js, render.js) as usual. Camera: `camera/CAMERA.md` (moving shots, close-ups matter a lot here because the faces are the point).
2. In index.html build people like this (copy the imports from `characters/expressive/stage.html`):
```js
const kit = createRobotKit(THREE, RoundedBoxGeometry), xk = createExpressiveKit(THREE, RoundedBoxGeometry, kit);
const dalia = xk.mkExpressive({ parent: scene, x: -3, ...xk.ROSTER.find(p => p.name === 'dalia') });
// every frame (t = seconds):
xk.animateExpressive(dalia, t, { face: EXPR['smirk'], pose: 'hips', talk: ampOfVoice });
```
3. Script emotions map to faces: happy=happy, excited=excited, sweet=happy, deadpan=deadpan, stern=annoyed, tired=tired, dramatic=shocked, shock=shocked, worried=worried, smug=smug, laugh=laugh, neutral=neutral. You can use any of the 50 names in `EXPR` (eye roll, side eye, skeptical, cringe, embarrassed, crying, in love, ...). Blend between faces with `lerpFace(a, b, k)` over about 0.3 s. Eye roll: `eyeRoll(u)`.
4. Mouth: pass `talk` (0 to 1) from the voice loudness, like `amp` for the old people. Blinks and tiny eye movement are automatic.
5. Body: poses idle, hips, shrug, facepalm, wave, armsUp, crossed, point, think. Blend with `pose: [a, b, k]`. Extras: `laugh`, `shake` (rage), `quiver` (crying), `slump`, `lean`, `tilt`.
6. Show real feeling: use a close-up on the face for the beat that matters (eye roll, smirk, shock).
7. Sets and props: free, same soft pastel toy look (`kit.mkProp`, rounded boxes).
