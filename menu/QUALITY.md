# Quality: realistic, never corny, and everything fits (EVERY format)

Applies to story, skit, talking to the camera, reaction, podcast and explainer. Dalia's rule: nothing may feel fake, cheesy, or out of place.

## The 6 steps (always, in this order)
1. **Know the material.** If there is a clip, read its transcript first (`formats/reaction/transcribe.py`). If it is an original story, write the beats before the lines.
2. **Write for a real person** (rules below). Reactions and gestures are written by MEANING, per moment.
3. **Run the gate BEFORE rendering:** `python3 tools/lint_dialogue.py <script> --format <skit|story|talk|reaction|podcast|explainer>`.
   It blocks corny phrases, stiff wording, too-long lines, echoing, shouting, sad words with a happy delivery, and (for reactions) cues that do not fit the clip. Fix every ERROR; look at every WARNING and fix it or keep it on purpose. `voices/speak.py` and `make_reaction.py` run it automatically and stop on errors.
4. **Render, then make the fit sheet:** `python3 tools/fit_sheet.py <video.mp4> <timeline.json> <sheet.jpg>` and LOOK at it. Every cell must pass: does the face, head direction and body fit the words and the moment? Fix and re-render anything that does not. Timeline: reactions `formats/reaction/work/reaction.json`, other videos `work/timeline.json`, podcast `anim/epN.json`.
5. **Run the audio check AND the movement report.**
   - Audio: `python3 tools/audio_check.py videos/<name>`. It finds what the speech recognizer cannot hear: stray sound while nobody speaks (for example the faint babble the Arabic voice makes AFTER a word, found by Dalia at 1:22 in Heart Calm), lines that stop dead with no natural decay, pure digital silence, and uneven loudness between characters. Fix every WARNING. It cannot say how a voice SOUNDS: a person must listen.
   - Every line heard: `voices/cbenv/bin/python -I tools/lines_check.py videos/<name>`. It transcribes EVERY line (`work/l*.wav`) and compares it to the script. Found in "He is near": Dalia said garbled words at 0:28 ("Near. Not far at all." came out as "Here, it can be pressed") and the checks had not caught it. Listen to every line it marks LISTEN (Arabic words are expected to read oddly). Rules from that: do not write 1 or 2 word sentences for the clone voices (join them: "It means near."); avoid words the clone slurs ("He's" at the start, "quote"); when you change a line, delete its `work/l*.wav` AND `work/raw/l*.wav`, or the old audio comes back.
   - Movement: (any video with people): `node tools/movement_report.js videos/<name>` (needs `python3 -m http.server 8766` from the repo root). It measures whether the characters are alive: listeners changing at least every ~3 s, enough poses and faces, no long still stretch. Fix every WARN.
6. **Rule audit, then tell Dalia honestly.** Go through THIS file line by line and mark each rule YES, NO or CANNOT CHECK with one line of evidence (save it as `videos/<name>/AUDIT.md`). Tell Dalia what passed, what failed, and what the tools cannot check (funny or not, how the voice sounds, whether a gesture fits). Never say "it passes" without saying what was NOT checked.

## Dialogue rules (all formats)
- Short. Most lines 3 to 12 words. One idea per line. Fragments are fine.
- Talk like texting a friend: contractions ("I'm", "don't"), trailing off, interrupting yourself, small fillers (rarely "bro", "wait").
- Specific, not generic. Every line says something only THIS moment could say. If a line would fit any video, cut it.
- Have a point of view: disbelief, a dry joke, a confession, a challenge, agreement with a catch. Not praise.
- Answer, do not echo: never repeat the other person's words back ("so you're saying..."), never summarize what was just said.
- Build: start small and dry, the strongest line comes last. Mix short and long lines. Do not start 3 lines the same way.
- No hype: at most one "!" in a line and not in every line. Never "good point", "I love that", "so true", "amazing", "let's dive in", "you guys".
- Emotion tag must match the words (a sad line is not `excited`). Humans use contractions; robots may sound stiffer on purpose.

## The MUSTS (a minimum, so doing nothing never counts as following the rules)
The rules below mostly say what NOT to do ("nothing moves without a reason"). That is not a reason to stay still. Every video with people must have:
- **Every line has a face beat AND a body beat** where it matters (hand on heart, open palms, shrug, point, lean, nod, tilt). Hand-written beats for the important words, automatic ones for the rest.
- **Every listener is alive:** something changes at least every ~3 s (look at the speaker, nod at a sentence end, tilt at a question, lean in). Use `characters/expressive/behavior.js` (`autoListener`, `autoSpeaker`) so this is not hand-coded; add hand-written beats on top (`applyCues`).
- **A posture arc:** how a character carries the body changes with the story (heavy at the start, light at the end) through `slump`, `lean`, `tilt`.
- **The face fits the moment** (table in `formats/reaction/REACTOR_VOICE.md`) and **the listener reacts a beat AFTER** (0.2 to 0.45 s), never the same reaction twice in a row, at least 2.8 s between automatic reactions (`formats/reaction/BEHAVIOR.md`). READ BOTH FILES for any video with people, not only reaction videos.
- **Poses to use:** idle, hips, shrug, facepalm, wave, armsUp, crossed, point, think, plus chest (hand on heart), open (palms open), lap (hands together), reach. Hands are mitts without fingers, so gestures are big and simple.

## Movement and reaction rules (all formats)
- **Nothing moves without a reason.** Every gesture, look, nod or face change is tied to a word, a beat or what another character did. No random wiggling.
- **Listeners are alive.** While someone speaks, the others look at the speaker, blink, give tiny nods, and react to emotional lines with a fitting face a beat AFTER the line (0.2 to 0.4 s), not on it. Not everyone reacts the same way or at the same time.
- **Speakers use their body on the important word only** (a point, a shrug, a head tilt), not on every sentence.
- **Face must match the moment:** sad or serious = still, soft face, no smirks or jokes. True = slow nod. Wrong or rude = head shake or cringe. Funny = laugh. Real surprise = gasp, lean back. A look to the camera means "are you seeing this?" and comes right AFTER something absurd or too true.
- **Direction of attention:** people look at who or what they are talking about or reacting to (the clip, the other person), and at the camera only to address the viewer or give a look.
- **Rhythm:** leave beats of silence. React to a joke after it lands. Never talk over a sentence unless the character is rude on purpose.
- **Camera follows the feeling:** close-up on the face for the beat that matters; wide when the group reacts (see `camera/CAMERA.md`).

## What the tools can and cannot do
- The gate checks words and rules (see `tools/lint_dialogue.py`). It cannot tell if a line is funny, if the voice sounds natural, or if a pose looks right. That is what the fit sheet (you) and Dalia are for.
- If Dalia says a line or reaction feels off, find WHY, then add a rule to this file or to `tools/lint_dialogue.py` so it never happens again.
