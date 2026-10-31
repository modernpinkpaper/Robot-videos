# Robot videos repo

Owner: Dalia (modern pink paper). Reply to her in **simple English**. She likes "just do it".

## Two separate pieces. Keep them separate.
1. **The animation style = the characters.** Folder `characters/`. Read `characters/STYLE.md`.
   Use this for EVERY video she asks for, whatever the topic ("what if nobody lied", "a day in the life of...").
   Reuse `characters/robots.js` and copy `characters/demo.html` (robots) or `characters/people.html` (humans, pets, props) as a starting page.
   If she asks for cute humans, a variety of people, pets or props, use `mkHuman`, `PEOPLE`, `mkPet`, `mkProp` (see STYLE.md). Robots are optional; use people when the story is about people. Never redesign the
   robots or invent a new style. You are free to build any world, story, set and camera around them,
   in the same soft pastel toy look.
2. **The podcast format.** Folder `formats/podcast/`. ONLY use this if she says "podcast" or "episode".
   Otherwise do not use the studio set, the bleacher desks, the ON AIR sign, info cards, or the
   podcast voice pipeline.

If she shares another creator's video as a reference: copy its structure, pacing and story style,
but draw it with these characters.

## Rules
- Do not edit `characters/robots.js` unless she asks. If something must change, add an option.
- Keep staff names, kids' names, exact money, medical details and passwords off screen.
- Voices: piper TTS pipeline is in `formats/podcast/pod/mk.py` (needs `formats/podcast/setup.sh`). Reuse it for any video that needs spoken lines.
- Before sending a video: look at at least 4 frames, then say honestly what you checked and what you could not (you cannot hear audio).
- Rendering is slow. Run it in the background and tell her.
