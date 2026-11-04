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

## What makes a voice sound human and comforting (the dimensions, and the knob for each)
Researched for the Heart Calm video (sources at the end). A human voice is more than the words: it has these parts, and a flat voice is usually missing one or more of them.
| Dimension | What it is | Robotic when | Knob here |
|---|---|---|---|
| **Pace** (rate) | words per second, speeding up and slowing down | always the same speed | `pace` (1 = normal), style `speed_mul`. Comforting = about 0.94 |
| **Pitch** (tone, level) | how high or low the voice sits (measured in Hz) | too low or too high for the person | `tone` in semitones, style `pitch_add`. A woman's usual speaking pitch is about 165 to 255 Hz |
| **Pitch variety** (intonation, melody) | the rise and fall inside a sentence (up for a question, down to finish) | flat melody. We measure it: under about 3 semitones sounds flat | `energy` or emotion tag (exaggeration), style `exag_add` |
| **Loudness and stress** | which words are pushed | every word the same | a WORD in CAPS, `!`, `?` (see above) |
| **Pauses and rhythm** | breath between phrases and sentences | no breathing room, or pauses all the same | style `pause_scale` (comforting = 1.5), `...` in the text |
| **Deliberateness** | how carefully each word is shaped | rushed or slurred | `cfg_add` (lower = slower and more careful) |
| **Timbre** (warmth, softness, breathiness) | the "colour" of the voice | thin, harsh, buzzy | style `eq` (warm low end, softer top, gentle compression), and the voice sample itself |
| **Clarity** | every word understood | slurred | the self-check (speech recognition) keeps this |
| **Emotion** | the feeling behind it | the same feeling for every line | the emotion tag per line |
**The most important part is the voice sample** (`voices/refs/<name>.wav`). Chatterbox copies it. If the sample is a robot voice (the old samples were made with Piper), every line copies that flat, robotic delivery. Use a natural, expressive recording.
**Styles** (`STYLES` in `human_tts.py`): `comforting` (a little slower, slightly lower, more pauses, warm and soft sound) and `bright`. Give a person a default with `PEOPLE[..]['style']`, or set `"style": "comforting"` on any line, and override single knobs per line (`speed_mul`, `pitch_add`, `exag_add`, `cfg_add`, `pause_scale`, `eq`). A line can also use a different sample with `"ref": "/path/sample.wav"` (to audition voices).
**Measure a voice** (no guessing): `python3 voices/measure_voice.py a.wav b.wav` prints pitch level, pitch variety, range, breathiness and pause share. Listening is still the final test.
Sources: [Parloa on prosody](https://www.parloa.com/knowledge-hub/what-does-prosody-mean/), [Camb.ai on pitch, pace and stress](https://www.camb.ai/blog-post/prosody-in-speech-ai-voices-pitch-pace-stress), [Surrey speech tutorial](https://ph-vssp-www.eps.surrey.ac.uk/tutorials/speech/chapter15.pdf), [Soft-voice cues (Johns Hopkins Muse)](https://muse.jhu.edu/article/683220?ref=rc), [Why we like some voices](https://www.theswaddle.com/why-we-like-some-peoples-voices-more-than-others).

## Arabic (and other languages): the babble after a word
The multilingual voice says the word and then often keeps making a faint babble or hiss for 1 to 2 seconds. The speech recognizer ignores it, so the score still says 1.00, but you can HEAR it. `human_tts.py` now cuts it (`trim_main_utterance`: keeps the loudest word or words, drops the rest) and `videos/quran_calm/build_audio.py` puts a soft room tail back on the word. Always run `python3 tools/audio_check.py videos/<name>` and listen to every Arabic word.

## How to choose a voice (make a natural voice sample for a character)
Learned on Heart Calm. Do this whenever a voice sounds robotic or a new character needs a voice. **Dalia listens and picks: never choose a voice for her.**
1. **One-time setup:** `./voices/setup_natural_refs.sh` (after `setup_chatterbox.sh`). It adds Kokoro (a small, free, natural voice model) and the measuring tool.
2. **Make 3 or 4 candidate samples** (do NOT replace the real sample yet):
   `voices/cbenv/bin/python voices/make_natural_ref.py <name> <kokoro_voice> --out /tmp/<name>_<voice>.wav`
   Kokoro voices: `af_heart` (warm, bright), `af_sarah` (most expressive), `af_bella` (higher, lively), `af_sky` (deeper, calm), `af_nicole`, `bf_emma`, `bf_isabella` (British). Use the `expressive` reading unless the character is calm.
3. **Measure them** with `python3 voices/measure_voice.py a.wav b.wav`. A woman's usual speaking pitch is about 165 to 255 Hz; a melody variety under about 3 semitones sounds flat; more than 3.5 is lively. (The old Piper samples sat near 140 Hz and about 2.5, which is why they sounded robotic.)
4. **Make the same 4 real lines of the character with each candidate** through `human_tts.py` (a row can carry `"ref": "/path/sample.wav"` and `"style": "natural"` or `"comforting"`), join them into one mp3 per candidate, add the CURRENT voice as sample A, and send them to Dalia. She listens and picks (and says what to change: slower, lower, softer, more upbeat).
5. **Apply her pick:** copy the chosen sample to `voices/refs/<name>.wav`, set the style in `PEOPLE` (`human_tts.py`), remake that character's lines (delete their `work/l*.wav`, run `build_audio.py`), then run `python3 tools/audio_check.py videos/<name>` and ask Dalia to listen to the finished video.
**Styles:** `comforting` (teacher or comforting voice), `natural` (normal conversation), `bright`. **Never** use a real person's voice without their permission.
**Why the old voices were robotic:** (1) the sample was made by Piper, (2) sentences were made one by one and glued with dead silence, (3) no room sound, so every sentence stopped dead. All three are fixed (whole-line speech, room sound, natural samples).

## A REAL person's voice (Dalia's own voice): keep it PRIVATE
This repository is **public**. A recording of a real person's voice (and any sample made from it) must NEVER be committed: it is private (these recordings may talk about personal or medical things) and a public voice sample can be used by anyone to clone the voice.
- Put the cleaned sample at `voices/refs/private/<name>.wav`. That folder is git-ignored. `human_tts.py` uses it automatically instead of `voices/refs/<name>.wav`, on this computer only. Without it (a fresh checkout) the public synthetic sample is used.
- Clean the recording first (noise gets copied into the voice): `ffmpeg -i in.wav -af "highpass=f=70,afftdn=nr=18:nf=-38:tn=1,lowpass=f=11500,acompressor=threshold=0.08:ratio=2:attack=15:release=250:makeup=1.5,loudnorm=I=-20:TP=-2" -ar 24000 -ac 1 clean.wav`. Pick a calm or warm tone; avoid clips with background sound.
- Check how close the clone is with Resemblyzer (a voice similarity score from 0 to 1, installed by `setup_natural_refs.sh`); a clone above about 0.75 against the real recordings sounds clearly like her. Always ask the person to listen.
- Only with the person's own permission.

## Short sentences and bad takes
Very short sentences (1 to 2 words, like "Near.") often come out garbled with the cloned voices. Write them as a longer sentence ("It means near."). `human_tts.py` now makes up to 5 tries for short lines and keeps the BEST take (not the last). Always run `voices/cbenv/bin/python -I tools/lines_check.py videos/<name>` after making the voices: it compares every line with the script. If you edit a line, delete `work/l<NN>.wav` and `work/raw/l<NN>.wav` before running `build_audio.py` again.
