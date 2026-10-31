# Robot videos repo

## FIRST: read `menu/START_HERE.md`
Dalia picks a CAST (humans / robots / both / pets), a FORMAT (story / skit / talking to the camera / reaction / podcast / explainer) and voices in plain words.
Example: "Make an animation using humans only in a skit style about a hard day at work with a coworker."
Parse it, use defaults for anything she leaves out (say which), and follow the matching files in `menu/`. Do not ask her questions you can answer yourself.

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

## Camera (same for every video)
Use the camera style in `camera/` (read `camera/CAMERA.md`). It is the look of "What if nobody lied?" and Dalia loves it:
moving shots, cuts every 1.5 to 3 seconds, pans, zooms, orbits, close-ups, low angles, cranes, dolly zoom, whip-pan between scenes, split screen for calls.
Never use a static or single fixed camera. Never invent a different camera system.

## Rules
- Do not edit `characters/robots.js` unless she asks. If something must change, add an option.
- Keep staff names, kids' names, exact money, medical details and passwords off screen.
- Voices: piper TTS pipeline is in `formats/podcast/pod/mk.py` (needs `formats/podcast/setup.sh`). Reuse it for any video that needs spoken lines.
- Before sending a video: look at at least 4 frames, then say honestly what you checked and what you could not (you cannot hear audio).
- Rendering is slow. Run it in the background and tell her.
