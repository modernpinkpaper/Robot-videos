# Robot videos repo

## FIRST: read `menu/START_HERE.md`, then `examples/INDEX.md`
Every format, camera move and voice has a REFERENCE in `examples/INDEX.md` (real videos, a camera reel, voice samples). Open the reference for each choice, read its source files, extract a few frames, and match it. Never guess how something should look or sound.

Dalia picks a CAST (humans / robots / both / pets), a FORMAT (story / skit / talking to the camera / reaction / podcast / explainer) and voices in plain words.
Example: "Make an animation using humans only in a skit style about a hard day at work with a coworker."
Parse it, then follow **`menu/BRIEF.md`**: BEFORE building, make sure you know the 8 required things (topic, look, characters, format, voices, length, the clip for a reaction video, anything to include or leave out). If any are missing, ask ONE short message listing only the missing ones with your suggested picks (she can reply "yes"). Do not ask for what she already said or for what is fixed (camera, size, look of the toy world). If she says "just do it" or "you pick", use your picks and tell her what you chose. Then follow the matching files in `menu/`.

Owner: Dalia (modern pink paper). Reply to her in **simple English**. She likes "just do it".

## Character styles. Keep them separate.
There are 3 looks: the robots/people (piece 1), the podcast format (piece 2), and **EMOTIONAL ROBOTS** (piece 3, below). Dalia picks the look by name. If she says "emotional robots" (or "emotional robot style", "expressive characters"), read `menu/cast/emotional_robots.md` and use `characters/expressive/`. Otherwise use the default robots/people.

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
- Voices: ALWAYS use `voices/speak.py`. Humans (DALIA, AMINA, MARCUS, LILY, SOFIA, GRANDPA, KID_BOY, KID_GIRL, NARRATOR, and the Emotional Robots characters MARA, THEO, PRIYA, JUNE, KAI, GUS, ZOE, FINN, HANA, NINA) use Chatterbox with pace, emotion and tone set per line; robots use Piper. Read `voices/README.md`. Do not use Piper for a human. Mix and match is allowed: a line can carry `"voice": "AMINA"` to use another character's voice.
- Reaction videos: use `formats/reaction/` (top-right reactor, bottom-left clip). Do not rebuild it. BEFORE writing anything read `formats/reaction/REACTOR_VOICE.md`: read the clip's transcript first, write cues by meaning, keep spoken lines short and specific to the clip, never generic praise or repeating the clip's words.
- Before sending a video: look at at least 4 frames, then say honestly what you checked and what you could not (you cannot hear audio).
- Rendering is slow. Run it in the background and tell her.

## 3. Emotional robots style (approved)
Folder `characters/expressive/`. 12 named characters with real faces (eyes, brows, nose, mouth, teeth) and 50 facial expressions, made for reaction videos. Only use it when she asks for "emotional robots". Read `menu/cast/emotional_robots.md` and `characters/EXPRESSIONS.md`; look at the pictures in `characters/expressive/preview/` first. Do not edit the character files unless she asks; to change a look, change that character's entry in `ROSTER` (`body.js`). Dalia, Amina and Nina are based on her family: never show real names of family or kids on screen.
