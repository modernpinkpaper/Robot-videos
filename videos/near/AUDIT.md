# Rule audit: He is near (`menu/QUALITY.md` step 6)
YES = done and checked. NO = not met. CANNOT CHECK = the tools cannot tell, a person must.

| Rule | Result | Evidence |
|---|---|---|
| Dialogue gate (`lint_dialogue.py --format story`) | YES | 0 errors. One accepted warning (a 15-word line). 40 lines, 295 words. |
| Short, specific, natural lines; no hype | YES | Gate passed. |
| Answer first; promise on frame 0 | YES | Header "3 EASY WAYS TO TALK TO ALLAH" with ASK, QUOTE, ACT on frame 0; the three names are said by 8 s; then the verse explains why. |
| One refrain, say it with me, breathe moment, recall question, show the example | YES | "Allah is near. Call on Him." 3 times; qarib, ujibu, da'ani and the dua repeated by Dalia; breathe 3.4 s; recall at the end; a 4 s picture of a child calling and her mom coming. |
| Every line has a face beat AND a body beat | YES | Hand-written beats in `perform.js` for every scene plus the automatic layer. |
| Listeners are alive; poses and faces vary | YES | Movement report: Dalia alive 98% of the time she listens, Amina 99%; longest still stretch 4.0 s (Dalia) and 3.0 s (Amina); Dalia 9 poses and 12 faces, Amina 5 poses and 9 faces. |
| Posture arc | YES | Dalia's slump 0.15 at the hook down to 0 at the end. |
| Fit sheet looked at | YES | `fit_sheet.jpg`, 28 moments, every scene. I found no mismatches this time. |
| Audio check (`tools/audio_check.py`) | YES | No stray sound, no hard stops, no digital silence; Dalia -21 dB and Amina -19 dB. Loudest leftover 0.7 s after a last word is -47 dB (room sound about -57 dB, speech about -25 dB): the room tail after Dalia's one-word Arabic lines. |
| Quran only, no hadith; Arabic from a Quran text source | YES | 2:186 (first part and the end) and 20:114 (the end) copied from the Uthmani text. No hadith. |
| Arabic pronounced correctly in the characters' voices | CANNOT CHECK | Best-take speech-recognition scores: surah name 1.00; qarib 0.89 (both voices); ujibu 0.89 (both); da'ani 0.86 (Amina) and 1.00 (Dalia); the dua 0.96 (Amina) and 1.00 (Dalia). The cut that removes the babble after each word was applied. I cannot hear it. The dua "Rabbi zidni ilma" is a Quran phrase spoken by a computer voice: a person who knows Arabic must listen. |
| Our simple meanings and claims are right | CANNOT CHECK | "I am near. I answer the call of the one who calls Me", "let them respond to Me", "da'ani has the same root as dua", and our reading that the verse names no special words for calling. A person who knows must check these. |
| Dalia's voice = the regular Dalia voice | YES | Same sample and settings as Heart Calm. |
| Voices natural, comforting, no hard stops | CANNOT CHECK | Measured only. Dalia must listen. |
| Length about 2 minutes | PARTLY | 2:28 (aimed 2:15). Shorter than Heart Calm (2:43). |
| Is it funny, moving, does a gesture really fit | CANNOT CHECK | Only a person can tell. |

## Fix after Dalia's question about 0:28 (voice defect)
- Found: Dalia's line at 0:27 to 0:30 ("Near. Not far at all.") was garbled ("Here, it can be pressed"). Other short lines had the same flaw (words "Near." and "I answer.", "Ask. Quote. Act.", "Near. And He answers.").
- Why missed: the earlier checks looked for clicks, silence and babble, and only transcribed some lines. Nothing compared every line to the script.
- Fix: lines rewritten as longer sentences ("Allah is near, not far at all.", "It means near.", "It means: I answer.", "First ask, then borrow words, then act.", "Allah is near, and He answers."). Old cached takes in work/raw were deleted. `human_tts.py` now keeps the best take. New tool `tools/lines_check.py`.
- Re-checked: lines_check (all English lines match; only Arabic-word lines read oddly, as expected), audio_check passes, movement report passes, fit sheet looked at. NOT checked: how the voices sound, and the Arabic itself (a person must listen).
