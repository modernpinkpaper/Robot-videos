# Robot videos repo

## FIRST: read `menu/START_HERE.md`, then `examples/INDEX.md`
Every format, camera move and voice has a REFERENCE in `examples/INDEX.md` (real videos, a camera reel, voice samples). Open the reference for each choice, read its source files, extract a few frames, and match it. Never guess how something should look or sound.

Dalia picks a CAST (humans / robots / both / pets), a FORMAT (story / skit / talking to the camera / reaction / podcast / explainer) and voices in plain words.
Example: "Make an animation using humans only in a skit style about a hard day at work with a coworker."
Parse it, then follow **`menu/BRIEF.md`**: BEFORE building, make sure you know the 8 required things (topic, look, characters, format, voices, length, the clip for a reaction video, anything to include or leave out). If any are missing, ask ONE short message listing only the missing ones with your suggested picks (she can reply "yes"). Do not ask for what she already said or for what is fixed (camera, size, look of the toy world). If she says "just do it" or "you pick", use your picks and tell her what you chose. Then follow the matching files in `menu/`.

Owner: Dalia (modern pink paper). Reply to her in **simple English**. She likes "just do it".

## Character styles. Keep them separate.
There are 4 looks (the 4th is the Quran role play style below): the robots/people (piece 1), the podcast format (piece 2), and **EMOTIONAL ROBOTS** (piece 3, below). Dalia picks the look by name. If she says "emotional robots" (or "emotional robot style", "expressive characters"), read `menu/cast/emotional_robots.md` and use `characters/expressive/`. Otherwise use the default robots/people.

## 4. Quran lessons, role play style (new)
Folder `formats/quran_lessons/` (read its `README.md`). Flat faceless hijabi girls, role play + explanation + the ayah on a phone. Use it ONLY when she asks for a Quran or Islamic lesson, or says "the role play style". Strict rules for religious content are in that README (only ayat you are sure of, exact text, no recitation voice, no prophets drawn). Example: `videos/quran_gossip/`.

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
- QUALITY (every format): read `menu/QUALITY.md` (it has the MUSTS and the rule audit). For any video with people also read `formats/reaction/BEHAVIOR.md` and `formats/reaction/REACTOR_VOICE.md` and use `characters/expressive/behavior.js`; run `node tools/movement_report.js videos/<name>` and do the rule audit before sending. Run `tools/lint_dialogue.py` on the script BEFORE rendering (it also runs inside `voices/speak.py` and `make_reaction.py` and stops on errors) and make a fit sheet with `tools/fit_sheet.py` AFTER rendering and LOOK at it. Dialogue must be short, specific, natural, never corny; every reaction, look and gesture must fit the words and the moment.
- Religious teaching videos (Quran lessons, faith reminders): follow `menu/formats/religious_teaching.md` (Quran only, no hadith, answer first, Arabic copied from a Quran text source, no music, ask a person to check the Arabic). Reference video: `videos/quran_calm/`.
- Voices, more: each voice has a style (`voices/README.md`: Amina is `comforting`), Arabic words are written `{ar:...}` in a line's spoken text and spoken in the same character's voice, and ALWAYS run `python3 tools/audio_check.py videos/<name>` (it finds babble, hard stops and dead silence the speech recognizer cannot hear). Nobody can judge a voice without listening: ask Dalia to listen.
- Before sending a video: look at at least 4 frames, then say honestly what you checked and what you could not (you cannot hear audio).
- Rendering is slow. Run it in the background and tell her.

## 3. Emotional robots style (approved)
Folder `characters/expressive/`. 12 named characters with real faces (eyes, brows, nose, mouth, teeth) and 50 facial expressions, made for reaction videos. Only use it when she asks for "emotional robots", but it works in ANY format (story, skit, talk to camera, reaction, explainer): use the helper `characters/expressive/actor.js` (recipe at the end of `menu/cast/emotional_robots.md`). The reaction tool already uses them by default. Podcast is not done yet for this style. Read `menu/cast/emotional_robots.md` and `characters/EXPRESSIONS.md`; look at the pictures in `characters/expressive/preview/` first. Do not edit the character files unless she asks; to change a look, change that character's entry in `ROSTER` (`body.js`). Dalia, Amina and Nina are based on her family: never show real names of family or kids on screen.
