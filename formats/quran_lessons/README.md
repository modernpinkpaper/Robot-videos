# Quran lessons (role play style)  -- Dalia's 4th look
Look from her reference videos (`muslimx_type` style): flat, faceless, thin-outline 2D girls in hijab on a white page with one ground line,
word-by-word captions in black boxes, a hand holding a phone that shows the real ayah (translation highlighted in yellow), handwritten "Share for Sadaqah Jariya" end card.
Use it ONLY when she asks for a Quran / Islamic lesson or says "the role play style".

## The formula (updated: same teaching formula as `menu/formats/religious_teaching.md`, drawn in the flat style)
Read `menu/formats/religious_teaching.md` first. Its content rules apply here too: **Quran only, no hadith**, Arabic copied from the Uthmani text (api.alquran.cloud), simple English meanings, 5th grade English, no music, a person checks the Arabic.
Dalia learns, Amina teaches (voices DALIA and AMINA; no names on screen).
| Time | What |
|---|---|
| 0 to 3 s | **Frame 0 = the promise:** big header "3 EASY WAYS TO <TOPIC>" with the three step names. It shrinks to a slim bar that stays all video; the chip of the current step lights up. Dalia says her honest problem in one line. |
| 3 to 12 s | Amina says the answer first (the three names), then "Listen." |
| next | **ONE verse** on the phone (Arabic + simple English, highlighted as it is read), with surah and number, then one plain sentence of meaning. |
| next | **ONE or TWO Arabic words** on a card (Arabic, English letters, meaning, tip). Amina says it, Dalia repeats it. |
| steps | **Three easy steps, each acted out** as a tiny role play in its own scene, with a step card (1, 2, 3). Each step is one short name and one action. |
| hope | If the topic is about a wrong, end with Quran hope (e.g. Allah accepts us back) so the viewer does not feel shamed. |
| close | Recap card, quick check "Can you name the three?", "Try it for 7 days", handwritten "Share for Sadaqah Jariya". |
Cards sit at the top of the screen. Camera shots keep faces BELOW the cards (never hide a face). First example: `videos/quran_stop_gossip/` (the older `videos/quran_gossip/` was the first draft without the formula).

## Craft (from the anidoodle skill, applied to the flat look)
Hand-inked outlines (thick-thin, tiny boil at 8 fps), interior contour lines (hijab folds, abaya seam, hem, cuffs), tapered sleeves, hands with five fingers, contact shadow, doodles DRAWN ON (never faded in). Never use 1 to 3 word spoken sentences for DALIA or AMINA: the voice garbles them (`tools/lines_check.py` catches it; run it with `voices/cbenv/bin/python`).

## Rules for religious content (do not skip)
- Only use ayat and hadith you are SURE of. Copy the English from a standard translation (Sahih International) word for word, and the Arabic exactly. Say in your reply which ayah you used so Dalia can check it against a mushaf. Never invent or paraphrase an ayah; paraphrase only the explanation.
- Do not draw any prophet, companion or angel. Faceless characters only. No music with instruments over a recitation. No recitation audio is generated (a TTS voice must not recite Quran): the ayah is shown as text and its translation is read.
- Do not give rulings (fatwa) beyond what the ayah/hadith says. Keep it to "here is what it says and what it means for us".
- No real names on screen. Characters are just two friends.

## Files
- `engine.js`: draws everything (girls, speech doodles, phone, captions, end card). Do not copy it: a video page sets `window.LESSON` (see `videos/quran_gossip/index.html`) and calls `QL.start()`.
- `build_audio.py <videoDir>`: voices + timeline + audio. Arabic words are written `{ar:...}` in a line's 5th field and spoken in Arabic by the same voice (see `menu/formats/religious_teaching.md`). `render.js <videoDir> <outDir> <from> <to>`: frames. Then `ffmpeg` joins frames + `work/audio.wav`.
- `fonts/`: Montserrat 800 (captions), Caveat (handwriting), Amiri (Arabic). Open font licence (OFL).
- A new lesson = a new `videos/quran_<name>/` with `plan.py` (script + shots), `index.html` (cast, camera shots, ayah, doodles), `BRIEF.md`.
