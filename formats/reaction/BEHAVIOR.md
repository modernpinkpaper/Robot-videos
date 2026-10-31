# How the reactor behaves

**Two layers.** (1) **Cues** and spoken lines, written by the director AFTER reading the clip's transcript so they fit the meaning (guide: `REACTOR_VOICE.md`, read it first). (2) **Automatic rules** below: baseline watching, rare silent looks at the camera, timing and variety. The word-list guesses in the table are only a FALLBACK when no cues are written (they judge by keywords, so they can miss the mood). Sudden-sound reactions are OFF by default (music and effects caused false gasps): `"sound_reactions": true` turns them on.

The reactor now acts like a person watching a clip. Most of it happens by itself. The script only adds what you want to SAY or force.
The rules live in `behavior.py` (plain words at the top). The clip is listened to by `analyze_clip.py`.

## What happens automatically
| Moment | What the reactor does |
|---|---|
| All the time | Eyes and head on the clip (down and to the left). Blinks and tiny eye movements. |
| Every 9 to 17 seconds | Looks UP at the camera for about a second, says nothing, gives a LOOK: side eye, skeptical, deadpan, smirk, unimpressed or eye roll. The face fits the mood of what just happened. |
| After a big moment | Often a quick look at the camera ("did you see that?"). |
| A joke or laughter in the clip | Laughs (shoulders bounce, eyes squeeze shut). |
| A shock, "wow", "no way", shouting | Gasp: face of shock, leans back, hands up a little. |
| A sudden loud sound | Startle: jumps a little, then often looks at the camera. |
| Something absurd or negative ("never", "kicked", "ridiculous"...) | Shakes the head with a cringe, disgust or unimpressed face. |
| Something true ("exactly", "makes sense") or a long statement | Nods (proud or happy face). |
| A question in the clip | Tilts the head, thinking or skeptical face. |
| Something sad | Sympathy: sad face, slow nod, head tilt. |
| A hard cut in the video | Now and then a tiny surprised flinch. |

## Timing and variety rules
- Reacts 0.2 to 0.45 seconds AFTER the thing, at the end of a sentence, like a real person.
- Never the same reaction twice in a row. At least 2.8 seconds between reactions.
- If the same mood repeats within 20 seconds, the reaction is a little bigger.
- No automatic reactions while the reactor is talking or within 1.2 seconds of a reaction you wrote in the script.
- When the reactor talks, the head turns to the camera first.

## Faces used (from the 50-face library in `characters/expressive/faces.js`)
Reactions: proud, happy, cringe, disgusted, unimpressed, worried, laugh, giggle, gasp, shocked, surprised, confused, thinking, skeptical, sad, hurt.
Camera looks: side eye, skeptical, eye roll, deadpan, smirk, unimpressed, shocked, sad.

## Controls (in script.json)
- `"cues": [ { "at": 4.4, "kind": "glance", "face": "skeptical" } ]` meaning-aware reactions (see `REACTOR_VOICE.md`). With cues, the word-list guesses are off (`"auto_words": true` brings them back).
- `"sound_reactions": true` also reacts to sudden loud sounds (off by default).
- `"auto": false` turns all automatic behavior off (only the script's reactions happen).
- `"glances": false` keeps the reactions but removes the silent looks at the camera.
- `"seed": 7` changes the random choices (a different "personality" of timing). Same seed = same result.
- `"look": "emotional"` (default, real faces) or `"old"` (the older dot-eyed people).
- Script beats still work and always win: `{ "at": 12, "act": "laugh", "emo": "laugh", "dur": 1.5 }`.

## Limits (honest)
- The clip is understood from its WORDS (speech recognition + word lists, English only), loud sounds and video cuts. It can miss sarcasm, tone of voice, or humor that has no keyword. A person should still check the result and add script beats where a reaction matters.
- A clip with no speech only gets sound and cut reactions.
- To change what counts as funny, shocking or absurd, edit the word lists at the top of `analyze_clip.py`.
