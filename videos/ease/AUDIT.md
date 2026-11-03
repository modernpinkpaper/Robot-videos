# Rule audit: "With hardship comes ease" (series episode 3)
- Answer first: header "3 easy ways to find ease" with chips SPOT / SAY / STEP on frame 0; Amina says the answer in line 2 (about 7 s).
- Quran only, no hadith, no music. Arabic copied from the Uthmani text (api.alquran.cloud): 94:5-6 and 20:25-26. Every Arabic word explained from scratch (ma'a, al-usr, yusra, Musa's dua, "open my chest").
- Lint gate: 0 errors, 0 warnings (two echo warnings fixed first).
- NEW rule applied: cards do not hide faces (camera shifts below the card). Fit sheet checked: a face is visible in every card frame.
- Lines check (`tools/lines_check.py`): all 33 English lines match the script. 7 Arabic-word lines read oddly to the English recognizer (expected).
- Arabic scores (Arabic recognizer, best of N tries): Dalia ma'a 0.80, al-usr 0.73 (remade with 10 tries; first try was 0.40 and 0.62), Amina's words 0.67 to 0.98, the dua 0.98. The weakest are the short single words (ma'a, al-usr): a person must listen and check.
- Audio check: passes (3 whooshes at scene changes are fine). Movement report: passes (two stills over 4 s were fixed with beats, then only those frames re-rendered).
- Fit sheet looked at: faces and poses fit the words.
- NOT checked: how the voices SOUND (nobody here can hear), Arabic pronunciation (computer voices, not tajweed): Dalia or a person must listen.
