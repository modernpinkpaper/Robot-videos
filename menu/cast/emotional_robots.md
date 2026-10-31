# Cast: EMOTIONAL ROBOTS style (approved by Dalia)
Say it like: "use the emotional robots", "emotional robot style", "make it with the expressive characters".
Soft toy people with REAL faces: big eyes with whites and pupils, eyelids, thick eyebrows, nose, cheeks, a mouth with teeth and tongue. Best for reaction videos, skits and talking-to-camera, where the feeling must show on the face.
Everything lives in `characters/expressive/`. Full guide: `characters/EXPRESSIONS.md`. Pictures of every character and face: `characters/expressive/preview/`.
Do not use the old dot-eyed people (`mkHuman`) or the robots in an emotional-robots video unless she asks for a mix.

## The 12 characters (ROSTER in `characters/expressive/body.js`)
Each character has a REAL voice name in `voices/` (Chatterbox, natural, with pace, emotion and tone per line). Use the character's name as `who` in the script (`MARA`, `THEO`, ...). **Mix and match:** any line can carry `"voice": "AMINA"` to speak with another character's voice (any voice from `menu/voices/VOICES.md`).
| Name | Look | Voice (`who`) | Sounds like |
|---|---|---|---|
| mara | calm, hair bun, work badge, navy cardigan | MARA | clear, calm woman |
| theo | broad head, buzz cut, trimmed beard, yellow hoodie | THEO | deep, friendly man |
| priya | slim, long straight hair, long lashes, pink top | PRIYA | bright young woman |
| june | grandma, silver bun, gold round glasses, teal cardigan | JUNE | slow, warm older woman |
| kai | kid, curly hair, freckles, overalls | KAI | boy |
| gus | round, bald, big mustache, bushy brows, red top + overalls | GUS | slow, deep older man |
| zoe | big sparkly eyes, lavender space buns, polka-dot top | ZOE | higher, bubbly young woman |
| finn | tall, ginger spikes, square glasses, striped top | FINN | lighter young man |
| hana | soft face, black bob with bangs, coral top | HANA | soft, gentle woman |
| dalia | long dark hair, bold brows, big smile, navy ribbed top. Dalia herself. | DALIA | warm woman |
| nina | 6 years old, curly pigtails, floral dress | NINA | little girl |
| amina | brown hijab, cream cardigan, freckles, big smile | AMINA | calm, warm woman |
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

## ANY FORMAT: story, skit, talk to camera, reaction, explainer (the emotional robots are not only for reactions)
Use the helper `characters/expressive/actor.js`. It has the same shape as the old characters, so a pipeline copied from `videos/no_lies/` or `videos/disagree/` only changes two lines and keeps its camera, sets, shots, voices and render.js.
```js
import { createExpressiveKit } from '../../characters/expressive/body.js';
import { createActorKit } from '../../characters/expressive/actor.js';
const xk = createExpressiveKit(THREE, RoundedBoxGeometry, kit), ak = createActorKit(THREE, xk);
//  was: kit.mkHuman(...) / kit.mkBot('MICA', ...)      now: ak.mkActor('dalia', { parent: scene, x, y, z, ry, scale })
//  was: kit.animateBot(b, t, { speaking, amp, emo, walk, wave })      now: ak.animateActor(b, t, { speaking, amp, emo, walk, wave })
```
- Same options as before: `speaking`, `amp` (voice loudness), `emo` (the script words, or any of the 50 face names like `'eye roll'`), `look [x,y]`, `walk`, `sit`, `wave`, `b.g` (position and turn).
- Extras: `act` (`nod shake gasp laugh facepalm lean hop`) with `actU` (0 to 1 progress), `pose` (any body pose), `turn` (head left or right).
- Smooth face change: `emo: [fromEmo, toEmo, k]` with k from 0 to 1 (about 0.25 s). It keeps no state, so parallel rendering is safe.
- Working example to copy: `characters/expressive/actor_demo.html`.
- Per format: story and skit = several actors on a set with the usual camera. Talk to camera = one actor, close-ups. Explainer = one actor plus info cards. Reaction = the reaction tool already uses them by default (see `formats/reaction/README.md`).
- Voices do not change: use `voices/speak.py` with the character's own name (MARA, THEO, ...).
- **Podcast is the one exception for now.** `formats/podcast/anim/index_pod3.html` has its own separate robot studio code and its own old voice step. Do the emotional-robots podcast as its own job (it needs a swap in that page and in `pod/mk.py`).

## Furniture rule: the body must sit BEHIND a desk or counter, not inside it
The emotional robots are deep: the torso reaches about 1 unit in front of the character's middle, and the hands reach out further. Any desk, table or counter must start IN FRONT of that (its back edge at least 1.3 units in front of the character), or push the character back by the same amount. If a desk top cuts through the torso, the body looks cut off or merged into the desk. Reaction tool: this is set for you (`desk.z`, default 1.5 for this style). In your own sets: look at one frame before rendering. The desk edge should be a clean straight line in front of the body, with nothing of the torso showing in front of it.
