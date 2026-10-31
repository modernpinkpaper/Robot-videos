# The robot look (characters only)

This is the look of the characters, separate from any podcast set. Use it for ANY video.

## Files
- `robots.js`  builds the characters (`mkBot`), draws their faces, animates body language (`animateBot`).
- `demo.html`  a minimal page: 3 characters on a plain stage with the standard light rig. Copy it to start any new video.
- `three.module.js`, `RoundedBoxGeometry.js`  libraries (do not edit).

## What makes it "the look" (do not change)
- Rounded white bodies and big rounded-box heads (round 0.55), small colored ear-pods, antenna with a glowing tip.
- A dark glossy screen face with scanlines. Eyes are glowing rounded ovals in the character's own light color. Pink blush cheeks. A pink open mouth when talking.
- Emotions through the eyes and brows: happy (arcs), excited (stars), deadpan/stern/tired (lids), shock, worried, smug, laugh.
- Each character has an accent color and a prop (Mica: headband; Kraft: envelope stack and hat; Lefty: leaf and #3; Dymo: label roll; Status: "STATUS INQUIRY" sign; Dalia: human version with pink top, dark hair, no screen).
- Soft pastel, toy-like 3D: three.js, ACES tone mapping, soft shadows, hemisphere + pink and blue point lights (see demo.html for the exact rig).
- Vertical 9:16 (576x1024, 24 fps).

## Cast (see POOL in robots.js)
MICA, HOOKY, CHARGEY, DRAFTY, LISTER, LOGBOT (robots) / LEFTY, KRAFT, DUSTY, DYMO, STATUS (printer robots) / DALIA (human).
New characters: copy a POOL entry (acc, eye, col, s) and add a prop block in mkBot. Keep the same proportions.

## You choose the world
The set, story, props and camera are free: a street, a courtroom, a kitchen, anything.
Only the characters have to look like this. Build the set with simple rounded boxes in soft pastel colors so it matches.

## Humans, pets and props (added)
Same toy look, so any story can have a full cast. See `people.html` for a showcase of all of them.
- `kit.mkHuman({ skin, hair, hairStyle, top, bottom, kid, glasses, beard, hijab, legs })` makes a cute person.
  hairStyle: long, short, bob, bun, curly, ponytail, bald, hijab. `kit.PEOPLE` has 8 ready-made people of different skin tones and ages (kids and a grandpa included).
  Animate with `kit.animateBot(person, t, { speaking, amp, emo, wave, walk })` (same as robots).
- `kit.mkPet('dog'|'cat'|'bunny'|'cow'|'sheep'|'chicken'|'bird'|'pig', { x, z, scale, color })`. Animate with `kit.animatePet(pet, t, { walk, happy, sniff })`.
- `kit.mkProp(name, { x, y, z, scale, color, text })`. Names: tree bush flower bench table chair sofa bed mug laptop phone books balloon gift cake lamp ball heart star sign house car cloud sun bone fish door window mailbox fence.
- Need something that is not listed? Build it from rounded boxes and balls in soft pastel colors, same as the existing ones, and add it as a new entry. Do not use a different art style.

## Full bodies
Every character (robots and humans) now has legs and shoes. Walk with `animateBot(c, t, { walk: true })`, sit with `{ sit: true }`. For a torso-only look behind a desk pass `{ legs: false }`.
