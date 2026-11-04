# Quran lessons (role play style)  -- Dalia's 4th look
Look from her reference videos (`muslimx_type` style): flat, faceless, thin-outline 2D girls in hijab on a white page with one ground line,
word-by-word captions in black boxes, a hand holding a phone that shows the real ayah (translation highlighted in yellow), handwritten "Share for Sadaqah Jariya" end card.
Use it ONLY when she asks for a Quran / Islamic lesson or says "the role play style".

## How a lesson is told (always)
1. **Role play first (10 to 15 s):** two friends in a real-life moment where one does the wrong thing (gossip, checking horoscopes, judging, lying...). Short, natural lines.
2. **One friend explains** what is wrong and why, in simple words (no lecture, no "you must").
3. **The ayah on the phone (8 to 10 s):** Arabic + the English translation, highlighted as it is read aloud. Say the SURAH AND AYAH NUMBER on screen.
4. **A kind ending:** what to do instead, and the other friend takes it well. Then the end card.
Length 35 to 45 s, vertical 576x1024, 24 fps. Voices: Chatterbox (`voices/speak.py`), two women, realistic. No narrator.

## Rules for religious content (do not skip)
- Only use ayat and hadith you are SURE of. Copy the English from a standard translation (Sahih International) word for word, and the Arabic exactly. Say in your reply which ayah you used so Dalia can check it against a mushaf. Never invent or paraphrase an ayah; paraphrase only the explanation.
- Do not draw any prophet, companion or angel. Faceless characters only. No music with instruments over a recitation. No recitation audio is generated (a TTS voice must not recite Quran): the ayah is shown as text and its translation is read.
- Do not give rulings (fatwa) beyond what the ayah/hadith says. Keep it to "here is what it says and what it means for us".
- No real names on screen. Characters are just two friends.

## Files
- `engine.js`: draws everything (girls, speech doodles, phone, captions, end card). Do not copy it: a video page sets `window.LESSON` (see `videos/quran_gossip/index.html`) and calls `QL.start()`.
- `build_audio.py <videoDir>`: voices + timeline + audio. `render.js <videoDir> <outDir> <from> <to>`: frames. Then `ffmpeg` joins frames + `work/audio.wav`.
- `fonts/`: Montserrat 800 (captions), Caveat (handwriting), Amiri (Arabic). Open font licence (OFL).
- A new lesson = a new `videos/quran_<name>/` with `plan.py` (script + shots), `index.html` (cast, camera shots, ayah, doodles), `BRIEF.md`.
