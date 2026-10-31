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
