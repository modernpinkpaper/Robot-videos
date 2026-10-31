# Reaction video

A character sits in the **top right**, watches a clip in the **bottom left**, and reacts: nods, gasps, laughs, and talks about what they saw. Captions with a highlighted word sit between them. The clip can be:
- a **real video** (any .mp4), or
- **our own animation** (a reenactment made with the characters and camera in this repo).
Same tool for both.

## Make one
0. **Read `REACTOR_VOICE.md` first**: how to write reactions that fit and lines that do not sound corny.
1. Pick the clip. For a real clip run `python3 formats/reaction/transcribe.py clip.mp4` to see what is said and when.
2. Write `script.json` (copy `demo_script.json`): `cues` (silent reactions by meaning) and `beats` (the few spoken lines). Each beat is a moment in the clip (`at`, in seconds):
   - **talk beat**: `{ "at": 12.4, "say": "Wait. She said *WHAT*?!", "emo": "shock", "act": "gasp" }`
   - **silent reaction**: `{ "at": 20, "act": "laugh", "emo": "laugh", "dur": 1.5 }`
3. Run `python3 formats/reaction/make_reaction.py script.json out.mp4`

## It behaves like a person (automatic)
The reactor watches the clip with eyes down and to the left, looks UP at the camera now and then for a silent look, and reacts to what is in the clip: laughs at jokes, gasps at shocks, shakes the head at something absurd, nods at something true. Rules and limits: `BEHAVIOR.md`. Turn off with `"auto": false`.
The default reactor uses the REAL-FACE characters (Emotional Robots), for example Dalia.

## Modes
- `"mode": "pause"` (default): the clip freezes while the reactor talks, like real reaction videos.
- `"mode": "over"`: the clip keeps playing quietly and the reactor talks over it.

## Choices
- Reactor: any Emotional Robots character (`dalia mara theo priya june kai gus zoe finn hana nina amina`). With `"look": "old"` you can use the older people (`marcus lily sofia grandpa kid_boy kid_girl`) or a robot name (`MICA`...). Set `"voice_who"` to change the voice.
- Acts: `nod shake gasp laugh facepalm lean hop`. Emotions: `happy excited sweet laugh deadpan stern tired sad worried shock smug dramatic`.
- Per line you can also set `"pace"` (0.9 to 1.2), `"tone"` (-2 to +2 semitones) and `"energy"` (0 to 1) to override the automatic voice style.
- `"start"` / `"end"` use only part of the clip. `"frame"` adjusts where the reactor sits (`pos`, `look`, `fov`, `offx`, `offy`).

## How it works (so a session can fix things)
Tools: ffmpeg + numpy + Pillow (video and audio), the same three.js characters rendered with a transparent background (`reactor.html`), Piper/Chatterbox voices (`voices/speak.py`). No extra video library is needed; MoviePy would also work, but ffmpeg is faster here.
Layout (576x1024): clip window bottom left (max 300x420, rounded corners, white border), reactor top right, captions in the middle band, pastel background.

## The character has a full body (legs too)
The reactor sits at a little desk, so the frame shows face, shoulders and chest only. The legs are hidden behind the desk. Never leave a torso floating in empty space with its bottom edge visible. Change the desk with `"desk": {"top": 0xf6e6f2, "front": 0xd69bd0, "y": 2.5}` in `reaction.json` or the framing with `"frame"` in script.json.

## Making an animated clip to react to
Use the story or skit format with the camera in `camera/`, render it to an mp4, and use that as `source`.

## Real footage
Real clips belong to whoever made them. Use clips you own or have permission for, or short clips with real commentary, and check the platform's rules before posting.
