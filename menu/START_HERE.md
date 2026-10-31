# The menu: pick what you want, say it in plain words

Dalia can ask for a video by mixing choices from four lists. Claude reads this menu, follows the recipe files, and builds it.
**First read `BRIEF.md` (same folder): it lists the 8 things you must know before building, and how to ask Dalia for only the ones that are missing. Do not ask for anything she already said, or for things that are fixed (camera, size).**

## 1. CAST  (who is on screen)  -> `cast/`
| Say | Meaning | File |
|---|---|---|
| "humans only" / "people" | cute humans only, no robots | `cast/humans.md` |
| "robots only" | the robot characters only | `cast/robots.md` |
| "both" / "humans and robots" | mixed cast | `cast/mixed.md` |
| "animals", "pets" | add pets (any cast) | `cast/pets.md` |
| "emotional robots" / "expressive characters" | the real-face characters (12 named people) | `cast/emotional_robots.md` |
Default: humans for stories about people or work or life, robots for business tool or tech topics.

## 2. FORMAT  (how it is told)  -> `formats/`
| Say | Meaning | File |
|---|---|---|
| "story" / "storyline" | scenes with a plot, narrator optional | `formats/story.md` |
| "skit" / "sketch" | funny scene with 2 to 3 people, setup then punchline | `formats/skit.md` |
| "talking to the camera" / "direct to camera" | one character talks straight at the viewer | `formats/talk_to_camera.md` |
| "reaction" / "reaction video" | a character watches something and reacts | `formats/reaction.md` |
| "podcast" / "episode" | the Robot Print Room studio format | `../formats/podcast/README.md` |
| "explainer" / "how to" | a teacher character plus info cards | `formats/explainer.md` |
Default: story.

## 3. VOICES  -> `voices/VOICES.md`
Each character has a voice. She can say "deeper", "kid voices", "make the coworker sound grumpy", "narrator".

## 4. LOOK AND FEEL (already fixed, do not ask)
- Characters: `characters/STYLE.md` (always)
- Camera: `camera/CAMERA.md` (always)
- Length: default 60 seconds for a skit or story, 30 to 45 for talk-to-camera or reaction, 2 to 3 minutes for podcast or explainer. She can override.
- Size: vertical 9:16, 576x1024, 24 fps.

## Examples of what she might say
- "Make an animation using humans only in a skit style about a hard day at work with a coworker."
  -> cast `humans`, format `skit`, default 60s.
- "Robots in a podcast about how to handle angry customers." -> `robots` + `podcast`.
- "A human character talks to the camera about why mornings are hard." -> `humans` + `talk_to_camera`.
- "Both: a robot and a human react to a bad product review." -> `mixed` + `reaction`.
- "Story, humans and pets, a day when everything goes right." -> `humans` + `pets` + `story`.

## Steps every time
(Quality rules for ALL formats: `QUALITY.md`. Gate before rendering, fit sheet after.)
-1. Run the brief (`BRIEF.md`): confirm the 8 required things, save them as `videos/<name>/BRIEF.md`.
0. Open `examples/INDEX.md`: find the reference video, camera reel and voice samples for the choices, and match them.
1. Parse her request into cast + format + voices + topic (use defaults for what she did not say).
2. Read the cast file, the format file, `characters/STYLE.md`, `camera/CAMERA.md`.
3. Write the script as lines `(WHO, text, emotion, pause)` and a shot plan using the format file's shot recipe.
4. Voices: use `formats/podcast/pod/voices_cfg.py` names (see `voices/VOICES.md`). Copy the pipeline from `videos/no_lies/` (plan.py, build_audio.py, index.html, shots.js, render.js).
5. Render in the background, look at 4+ frames, tell her honestly what you checked and could not (audio).
6. Put the new video in `videos/<short_name>/`. Do not touch other videos.
