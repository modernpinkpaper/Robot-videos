# Voices

- **Humans** (DALIA, AMINA, MARCUS, LILY, SOFIA, GRANDPA, KID_BOY, KID_GIRL, NARRATOR, and the Emotional Robots characters MARA, THEO, PRIYA, JUNE, KAI, GUS, ZOE, FINN, HANA, NINA) use **Chatterbox**: natural speech with real breaths and rhythm.
- **Robots** use **Piper**: they are meant to sound like robots.
- Always call `voices/speak.py` (`synth_lines`). It picks the engine for each character.

## Setup (once)
`./voices/setup_chatterbox.sh` then `export CHATTERBOX_PY=".../voices/cbenv/bin/python"`. The model is about 3 GB. On a computer without a graphics card it runs about 10 times slower than real time (a 3 second line takes about 30 seconds). Plan for that when making longer videos.
`python3 voices/make_refs.py` makes the reference clip that each human's voice is copied from (`voices/refs/`). To give a character a different or real voice, replace its file with a clean 10 to 20 second recording (only with that person's permission).

## Pace, emotion and tone are chosen for every line
From the **emotion tag** (`happy`, `shock`, `tired`...) and from **what the words say**:
| What the line has | What changes |
|---|---|
| `!` | more energy and a little higher |
| `?` | brighter ending, slightly slower |
| `...` | slower and softer |
| a WORD in CAPS | extra emphasis |
| very short line | a touch slower (lets it land) |
| long line | a touch faster |
| commas and full stops | natural pauses between sentences |
Override any line with `"pace"` (1 = normal), `"tone"` (semitones) or `"energy"` (0 to 1).
The full table of emotions is in `voices/human_tts.py` (`EMO`).
Each person also has their own base pitch and speed so they sound different.

## Clear words come first (self-check)
Chatterbox can slur or rush words when the emotion is pushed too high. So after each sentence it **listens to itself** (speech recognition, `faster-whisper`): if the words are not recognised, or are spoken too fast (over about 3.9 words a second), it retries calmer, up to 4 times. A pace governor also keeps the final speed under about 3.3 words a second. Emotion is carried mostly by pace, pitch and sentence energy; the emotion level itself is capped (0.75).
This check hears whether words are CLEAR, not whether the voice sounds nice. Always have Dalia listen to a sample before a long video.

## Mix and match (any character, any voice)
A line has a `who` (the character on screen) and may have a `voice` (whose voice to use). Without `voice`, the character uses its own.
`{"who": "THEO", "voice": "AMINA", "text": "...", "emo": "happy", "out": "l00.wav"}` -> Theo speaks with Amina's voice.
So the Emotional Robots, the cute people and the robots can all share the same voices. Samples of every voice: `examples/voices/`.
