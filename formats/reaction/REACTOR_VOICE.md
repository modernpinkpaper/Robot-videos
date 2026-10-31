# What the reactor says and does (so it never sounds corny)

Read this BEFORE writing a reaction script. Most of a real reaction video is silence and faces. The words are the small part.

## The process (always)
1. **Read the clip first.** Run `python3 formats/reaction/transcribe.py clip.mp4` and look at frames. You need the real words and the times.
2. **Write the cues** (silent reactions) by MEANING, one per moment that deserves one: what a real person would do at that exact line.
3. **Write the few spoken lines.** Every line must point at something SPECIFIC the clip just said or did.
4. Read the lines out loud in your head. If you would not text it to a friend, rewrite it.

## Words: do
- **Short.** Mostly 3 to 10 words. Rarely 15. At most one spoken line per 8 to 10 seconds of clip. More silence than talking.
- **Sound like texting a friend:** contractions, fragments, trailing off, interrupting yourself ("No, wait... okay but—"), small fillers ("uh", "honestly", "like"). "Bro" and "wait" only sometimes.
- **Have a real thought, not praise.** Good kinds: disbelief ("Hold on. Hold on."), a dry joke, a self-roast ("Yeah. I'm not great at that one."), a small honest confession, a challenge ("Mm. Not sure about that."), agreement with a catch ("Okay, that's annoyingly right."), an unfinished thought, a question to the clip ("Wait, who told them that?").
- **Build.** Start dry and small. The strongest reaction or line comes last.
- **Leave a beat** before speaking and let lines trail off.

## Words: never
"Good point", "I love that", "that is so true", "wow, amazing", "interesting!", "great question", "let's dive in", "you guys", "folks". Never repeat the clip's own words back like a quiz ("so you're saying I should listen first?"). Never summarize what the clip just said. No hype with lots of exclamation marks. No generic lines that would fit any clip.

## Faces and moves: they must FIT what is happening
| In the clip | The reactor |
|---|---|
| a cliche, a hot take, someone full of themselves | eye roll or skeptical look to the camera |
| something wrong, rude or ridiculous | head shake, cringe or disgust, then often a look at the camera |
| something true | slow nod (a small smile at most) |
| something truly funny, or her own silly confession | laugh (never fake laughter at nothing) |
| a real surprise | gasp, lean back |
| a question | head tilt, thinking face |
| something sad or serious | sympathy: still, soft face, "yeah..." or nothing. NEVER a smirk or a joke |
| a long boring stretch | small nods, a flat deadpan look |
A look at the camera means "are you seeing this?": use it right AFTER something absurd, cringe or too true, not at random.

## How cues are written (in script.json)
`"cues": [ { "at": 4.4, "kind": "glance", "face": "skeptical" }, { "at": 16.6, "kind": "nod" } ]`
`at` = second in the clip. `kind`: nod, shake, laugh, gasp, tilt, sympathy, facepalm, lean, glance. `face` (optional): any name from the 50-face library (`characters/expressive/faces.js`), e.g. skeptical, eye roll, side eye, deadpan, smirk, unimpressed, cringe, worried, confused.
When cues are given, the word-list guesses are OFF (they only guess from keywords). Random silent looks at the camera are still added between cues, but rarely.

## Example (a clip of someone saying "The smartest people are the ones who can disagree and stay kind")
Bad: "That's a really good point!"   Good: (skeptical look at the camera, no words) ... then later: "Okay, rude. But true."
Bad: "So you're telling me I should listen first?"   Good: "Yeah. I'm... not great at that one."
Bad: "Wow, that is so interesting!"   Good: "Okay, that's annoyingly right."
