# Quality: realistic, never corny, and everything fits (EVERY format)

Applies to story, skit, talking to the camera, reaction, podcast and explainer. Dalia's rule: nothing may feel fake, cheesy, or out of place.

## The 5 steps (always, in this order)
1. **Know the material.** If there is a clip, read its transcript first (`formats/reaction/transcribe.py`). If it is an original story, write the beats before the lines.
2. **Write for a real person** (rules below). Reactions and gestures are written by MEANING, per moment.
3. **Run the gate BEFORE rendering:** `python3 tools/lint_dialogue.py <script> --format <skit|story|talk|reaction|podcast|explainer>`.
   It blocks corny phrases, stiff wording, too-long lines, echoing, shouting, sad words with a happy delivery, and (for reactions) cues that do not fit the clip. Fix every ERROR; look at every WARNING and fix it or keep it on purpose. `voices/speak.py` and `make_reaction.py` run it automatically and stop on errors.
4. **Render, then make the fit sheet:** `python3 tools/fit_sheet.py <video.mp4> <timeline.json> <sheet.jpg>` and LOOK at it. Every cell must pass: does the face, head direction and body fit the words and the moment? Fix and re-render anything that does not. Timeline: reactions `formats/reaction/work/reaction.json`, other videos `work/timeline.json`, podcast `anim/epN.json`.
5. **Tell Dalia honestly** what the gate and sheet checked, and what they cannot (funny or not, how the voice sounds).

## Dialogue rules (all formats)
- Short. Most lines 3 to 12 words. One idea per line. Fragments are fine.
- Talk like texting a friend: contractions ("I'm", "don't"), trailing off, interrupting yourself, small fillers (rarely "bro", "wait").
- Specific, not generic. Every line says something only THIS moment could say. If a line would fit any video, cut it.
- Have a point of view: disbelief, a dry joke, a confession, a challenge, agreement with a catch. Not praise.
- Answer, do not echo: never repeat the other person's words back ("so you're saying..."), never summarize what was just said.
- Build: start small and dry, the strongest line comes last. Mix short and long lines. Do not start 3 lines the same way.
- No hype: at most one "!" in a line and not in every line. Never "good point", "I love that", "so true", "amazing", "let's dive in", "you guys".
- Emotion tag must match the words (a sad line is not `excited`). Humans use contractions; robots may sound stiffer on purpose.

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
