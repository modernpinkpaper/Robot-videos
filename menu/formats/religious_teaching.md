# Format: religious teaching (a Quran lesson for someone who grew up with the faith)
Made with "Heart Calm" (`videos/quran_calm/`). Dalia is the learner, Amina is the kind teacher (emotional robots). About 2 to 2.5 minutes, vertical 9:16.
Use it when Dalia asks for a Quran lesson, a faith reminder or "religious teaching".

## Content rules (never break these)
1. **Quran only. No hadith.** Do not write "the Prophet said" or anything taken from a hadith. If she ever asks for hadith, ask her first.
2. **The Arabic comes from a Quran text source, never from memory.** Copy it from the Uthmani text (`https://api.alquran.cloud/v1/ayah/<surah>:<ayah>/quran-uthmani`) into `cards.js`, with the surah name and number. Show the whole verse, or a clearly marked part ("first part", "part of the verse").
3. **Our meanings are "simple English meanings", not translations.** Keep them close to the verse. Do not add what the verse does not say (example: it says "wise people", not "believers").
4. **Respect.** The hook may be honest, relatable and a bit provocative about a FEELING ("why does my heart feel on mute?"). Never mock, shame or doubt the Quran, never fear-monger, never use clickbait that implies the Quran is wrong or boring.
5. **5th grade English.** Short lines (most under 12 words), one idea per line, an everyday example for every idea, ending in an action she can do.
6. **No music.** Voices, soft whooshes and quiet room sound only.
7. **Ask a person to check it.** After building, tell Dalia the Arabic and meanings should be checked by someone she trusts. We are not scholars.
8. **No real family or kids' names on screen** (the character names are fine).

## ANSWER FIRST (learned from Dalia's feedback on Heart Calm)
- **Frame 0 carries the whole promise:** a header such as "3 EASY WAYS TO REMEMBER ALLAH" with the three short names (PAUSE, NOTICE, TALK). Many people watch muted, so the first caption is the pitch. The header stays as a slim, readable bar all video, and the chip of the habit being taught lights up.
- **Say the number and the names in the first 8 seconds, THEN explain why** (the verse). Never hide the answer behind a question.
- **One refrain** (say it 3 to 4 times): the core idea in one sentence ("Remember Allah, and your heart finds calm").
- **Make the viewer take part:** "say it with me" for each Arabic word (the teacher says it, the learner repeats it), one slow "breathe with me" moment, a recall question near the end ("Can you name the three?") with a pause.
- **Show, do not only tell:** a 3-second picture for the everyday example, and every habit acted out in its own scene.
- Give each habit ONE short name and a trigger: "When I reach for my phone, I pause."

## The formula (from our hook research, see below)
| Time | What | Why |
|---|---|---|
| 0 to 3 s | HOOK: a close-up face, moving camera, no fade-in, one honest line about a feeling. Speech starts within 0.2 s. | The first frame and first line decide if they stay. |
| 3 to 6 s | PROMISE: name what they will get ("One verse. Three words. Three small habits.") and show it on a title card. | A clear payoff keeps people watching. |
| verse | The Arabic card, the reference (surah and number), the simple meaning, said slowly. | Shows the source. |
| words | 3 to 4 key Arabic words, one card each: Arabic, spelling in English letters, meaning, a tip. Said correctly (see Arabic below). | Teaches and builds trust. |
| example | An everyday moment that makes the idea real (a lost kid finding mom, a phone battery). | Examples are what makes it stick. |
| actions | 3 small habits, each acted out in its own scene with a card ("TRY THIS 1/2/3"). | She asked: everything must be something she can do. |
| close | "Try it for 7 days" card, the verse again, one warm closing line. | Makes it easy to start. |
Also: a small surprise or question about every 15 to 20 seconds, a new camera angle every 3 to 4 seconds (`camera/CAMERA.md`).

### Hook options that worked in the brief (pick or write your own in this style)
- A (used): Dalia: "I grew up Muslim. So why does my heart feel like it's on mute?" Amina: "Your heart isn't broken. It's waiting for one thing."
- B: Amina to the camera: "Be honest. When did your heart last feel calm?"
- C: Dalia, deadpan: "I've said 'Alhamdulillah' a thousand times. And felt nothing."

## Arabic pronunciation (in the characters' own voices)
- Write Arabic words inside a spoken line as `{ar:ذِكْر}` in the line's spoken text (5th field of the line in `plan.py`), with full vowel marks. The caption stays in English letters.
- `build_audio.py` speaks the English parts as usual and the Arabic parts with Chatterbox multilingual (`lang: "ar"`) using THE SAME character's voice sample. It tries up to 4 times and keeps the take that speech recognition (`faster-whisper small`, Arabic) scores best. Look at the "best=" scores in the log; under 0.7 means listen and redo.
- This is a computer voice, so it cannot guarantee tajweed. Do NOT make a character recite a whole verse with it. Show the verse as text (or, if Dalia wants a recitation, use a real reciter, but first check the audio license: Quran.com audio comes from the Quran Foundation API and keeps its own terms).
- Proper names of surahs and short words and phrases (Alhamdulillah, SubhanAllah) are fine.

## Research behind the hook (2026, mostly marketing blogs, directional only)
First frame must already move; one short line in 1 to 3 s; name a feeling or open a question; promise the payoff; first caption counts because many watch muted; for teaching, give the answer or the number first then explain. Sources: opus.pro/blog/youtube-shorts-hook-formulas, dev.to/bulkdl (Hook Engineering), clipspeed.ai (viral hook formulas), eliro.pro (hook guide).

## Pipeline
Copy `videos/quran_calm/` (plan.py, build_audio.py, shots.js, sets.js, cards.js, index.html, render.js, make_video.sh). Brief first (`menu/BRIEF.md`), gate (`tools/lint_dialogue.py plan.py --format story`), voices, test frames, render in the background, fit sheet (`tools/fit_sheet.py`), then say honestly what was checked and what could not be (audio).
