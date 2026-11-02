# Rule audit: Heart Calm v3 (`menu/QUALITY.md` step 6)
YES = done and checked. NO = not met. CANNOT CHECK = the tools cannot tell, a person must.

| Rule | Result | Evidence |
|---|---|---|
| Dialogue gate (`lint_dialogue.py --format story`) | YES | 0 errors, 0 warnings. 40 of 42 lines are 12 words or fewer, the longest is 14. |
| Short, specific, natural lines; no hype; no banned phrases | YES | Gate passed. |
| Emotion tag matches the words | YES | Gate passed (no sad words with a happy delivery). |
| Every line has a face beat AND a body beat | YES | 42 of 42 lines: hand-written beats in `perform.js` (the store line by time), plus the automatic layer for everything else. |
| Listeners are alive (something changes about every 3 s) | YES | Movement report: Dalia alive 98% of the time she listens, Amina 99%. Longest still stretch 4.0 s (Dalia) and 3.3 s (Amina). The first run found 7.5 s and 6.0 s stretches; I added beats and they pass now. |
| Enough variety of poses and faces | YES | Dalia 10 poses and 13 faces, Amina 6 poses and 9 faces. Uses chest, open, lap, point, think, shrug, reach, armsUp, hips, idle. |
| A posture arc | YES | Dalia's slump goes 0.16 (opening) to 0.12 to 0.05 to 0.09 to 0.07 to 0 to 0.04 to 0 (end), plus lighter and lighter beats. |
| Listener reacts a beat AFTER (0.2 to 0.45 s); never the same reaction twice in a row; 2.8 s or more apart | PARTLY | The automatic layer enforces all three in code (0.3 s after a sentence end, alternating kinds, 2.8 s gap). My hand-written beats are NOT measured for spacing. |
| Nothing moves without a reason | YES | Every beat is tied to a line or a word; no random movement (only the built-in blinking and breathing). |
| Speakers use the body on the important word only | PARTLY | Hand-written gestures are on key phrases. The automatic layer also adds a small head tilt or nod on every sentence, which is subtle but is not "only the important word". |
| The face fits the moment (serious = still and soft) | PARTLY | I looked at all 28 fit-sheet moments (every scene covered). Found and fixed 2 mismatches: the "determined" face read as angry on Dalia (now a nervous smile and a hopeful face), and the store camera showed an empty aisle (fixed). The verse and the "remember Me" lines are still and soft. I did not look at every frame. |
| Direction of attention (look at who they talk to) | YES | Automatic: listeners look at the speaker; the camera look-to-lens is never used. |
| Beats of silence | YES | "Breathe with me" 3.6 s, recall question 2.2 s. |
| Camera follows the feeling (close-up on the beat that matters) | YES | Close-ups on "on mute", "Calm.", the Arabic repeats and the final lines; wide for the group. |
| Fit sheet looked at | YES | `fit_sheet.jpg`, 28 moments, every scene. |
| Quran only, no hadith; Arabic from a Quran text source | YES | Verses 13:28, 2:152 (first part) and 3:191 (part) copied from the Uthmani text (api.alquran.cloud). No hadith. |
| Arabic pronounced correctly in the characters' voices | CANNOT CHECK | Speech-recognition scores of the best take per word: 0.86 to 1.00 (Ar-Ra'd 0.86, tatma'inn 0.91, the rest 1.00). I cannot hear it. A person who knows Arabic must listen. |
| Audio check (`tools/audio_check.py`): no stray sound, no hard stops, no digital silence, levels within 4 dB | YES | Passes: loudest leftover after any last word is -49 dB (room sound is about -57 dB, speech about -25 dB); Dalia -22 dB and Amina -19 dB median. Found and fixed the faint babble the Arabic voice made after each word (1.3 to 2.3 s, reported by Dalia at 1:22), and the dead silence in Dalia's lines. |
| Amina's voice is natural, comforting, no hard stops | CANNOT CHECK | Measured: sentence ends fade out over about 0.8 to 0.95 s, under 1% digital silence. How it sounds is for Dalia to judge. |
| Length about 2 minutes | NO | 2:43 (after removing the babble). The slower, comforting voice and the added participation moments (breathe, say it with me, recall) cost time. |
| Is it funny, moving, does a gesture really fit the words | CANNOT CHECK | Only a person can tell. |
