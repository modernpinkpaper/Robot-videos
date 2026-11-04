# Rule audit: "Small change starts inside" (series episode 4)
- Answer first: header "3 easy ways to change a habit" with chips PICK / PAIR / ASK on frame 0; Amina says "Change starts inside you" in line 2 (about 7 s).
- Quran only, no hadith, no music. Arabic copied from the Uthmani text (api.alquran.cloud): 13:11 (the middle part, marked "part of the verse") and 1:5. Every Arabic word explained from scratch.
- Lint gate: 0 errors, 0 warnings (one long-line warning fixed first).
- Rules applied: cards do not hide faces (face visible in every card frame on the fit sheet); no `thinking` or eye-roll face; no 1-2 word English sentences for the cloned voices.
- Lines check (`tools/lines_check.py`): all English lines match the script. 7 Arabic-word lines read oddly to the English recognizer (expected). Line 21 may have a small pause in the middle ("a big one, you drop"): listen.
- Arabic scores (best of 6 tries): Amina 0.86 to 1.00, Dalia 0.75 (qawm) to 1.00, the dua 0.98. Weakest: Dalia's "qawm" 0.75.
- Audio check passes. Movement report passes (Dalia longest still 3.8 s).
- Fit sheet looked at: faces and poses fit the words.
- NOT checked: how the voices SOUND (nobody here can hear) and Arabic pronunciation (computer voices, not tajweed): a person must listen.
