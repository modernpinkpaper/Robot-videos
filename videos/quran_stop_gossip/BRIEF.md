1. Topic: "3 easy ways to stop gossip": PAUSE, PICTURE, PRAISE. Dalia gossiped about a friend; Amina teaches from the Quran.
2. Look: Quran lessons flat style (formats/quran_lessons).
3. Characters: Dalia (learns, cream hijab) and Amina (teaches, pink hijab). No names on screen.
4. Format: religious teaching formula (menu/formats/religious_teaching.md): answer first, one verse, one word, 3 acted steps, hope, recap, 7 days.
5. Voices: DALIA and AMINA (Chatterbox, their own voices). Arabic words spoken in Arabic by the same voices.
6. Length: about 105 seconds, vertical.
7. n/a
8. Quran only, no hadith. Verses: Al-Hujurat 49:12 (part shown), Al-Isra 17:53 (first part shown). Words: yaghtab, tawwab. Arabic from api.alquran.cloud (Uthmani). No music. A person must check the Arabic and the spoken Arabic words.
Audit: lint 0 errors, 2 warnings (long lines kept on purpose: the verse). Arabic word scores: surah name 0.87, yaghtab (Amina) 0.67 (low: listen), yaghtab (Dalia) 1.00, tawwab 0.80. The Arabic recogniser could not load for some tries (network), so those words were kept by the first successful score only.
Not checked: how the voices sound; spoken Arabic pronunciation (computer voice, not tajweed).

Update 2 (anidoodle craft pass): hand-inked line (thick-thin, 8 fps boil), hijab folds and shading, tapered sleeves, hands with fingers, ground shadow, doodles drawn on (not faded in).
Update 2 (voice fix, found by tools/lines_check.py): two of Dalia's lines were heard as nonsense (very short fragments); rewritten as full sentences and remade: 'It would really hurt her, honestly.' and 'I pause, I picture it, and then I praise.' Remaining 'LISTEN' lines are the two Arabic-word lines (the English recogniser cannot read Arabic).
Not run: tools/movement_report.js (needs window.statesAt, which the flat engine does not have yet).
