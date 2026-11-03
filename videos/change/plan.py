# SMALL CHANGE STARTS INSIDE: "3 easy ways to change a habit" (PICK, PAIR, ASK). Answer first, then why. Surah Ar-Ra'd 13:11 (the middle of the verse), Al-Fatihah 1:5.
# Amina teaches (comforting voice), Dalia learns (regular Dalia voice). Quran only, no hadith. Format: menu/formats/religious_teaching.md
# Each scene: lines (who, text, emotion, gap-before[, spoken-text-if-different]), shots (camera name, start), cards (card id, start, end).
# Arabic words are written {ar:...} in the spoken text (5th field): spoken in Arabic by the same character voice (see voices/README.md).
# Lines for the cloned voices are never 1 or 2 word sentences (they come out garbled): see voices/README.md.
# shot/card time: number = seconds from scene start | 'L1' = when line 1 starts | 'L1+0.5' | 'E-1.0' = 1s before scene end | 'E' = scene end
TOTAL = None
SCENES = [
 dict(id='open', set='room', pre=0.12, post=0.4, lines=[
   ('DALIA', 'I keep saying I will change. Then nothing changes.', 'sad', 0),
   ('AMINA', "Change starts inside you. Three small ways to begin. Pick. Pair. Ask.", 'sweet', 0.35),
   ('DALIA', 'Wait, so it starts with me?', 'neutral', 0.45),
   ('AMINA', 'The Quran tells us. Listen.', 'sweet', 0.4)],
  shots=[('daliaHook', 0), ('aminaCuS', 'L1'), ('daliaCu2', 'L2'), ('pushAminaS', 'L3')], cards=[]),
 dict(id='verse', set='room', pre=0.5, post=3.4, lines=[
   ('AMINA', "Ar-Ra'd. Verse eleven.", 'neutral', 0, '{ar:سُورَةُ الرَّعْدِ}. Verse eleven.'),
   ('AMINA', 'Truly, Allah does not change the condition of a people.', 'sweet', 0.4),
   ('AMINA', 'Not until they change what is inside themselves.', 'sweet', 0.5),
   ('DALIA', 'So the first step is mine.', 'sad', 0.8),
   ('AMINA', "So here's the whole lesson. Change starts inside you. Start small.", 'sweet', 0.6),
   ('AMINA', 'Try it with me. One slow breath. Then think of one small thing you want to change.', 'sweet', 0.7)],
  shots=[('lowAmina', 0), ('verseZoom', 'L1'), ('aminaCu', 'L1+2.0'), ('orbitTwo', 'L2'), ('daliaCu2', 'L3-0.1'), ('aminaLow', 'L4'), ('twoShot', 'L5')], cards=[('v1311', 0.2, 'L4'), ('refrain', 'L4', 'L5'), ('breathe', 'L5+0.3', 'E')]),
 dict(id='words', set='room', pre=0.5, post=0.4, lines=[
   ('AMINA', "Three words to know. Say them with me. First: yughayyiru.", 'neutral', 0, 'Three words to know. Say them with me. First: {ar:يُغَيِّرُ}.'),
   ('DALIA', "Yughayyiru.", 'neutral', 0.35, '{ar:يُغَيِّرُ}.'),
   ('AMINA', 'It means changes.', 'sweet', 0.3),
   ('AMINA', "Second: qawm.", 'neutral', 0.5, 'Second: {ar:قَوْمٍ}.'),
   ('DALIA', 'Qawm.', 'neutral', 0.35, '{ar:قَوْمٍ}.'),
   ('AMINA', 'It means a people, a group.', 'sweet', 0.3),
   ('AMINA', "Third: anfusihim.", 'neutral', 0.5, 'Third: {ar:أَنفُسِهِمْ}.'),
   ('DALIA', "Anfusihim.", 'neutral', 0.35, '{ar:أَنفُسِهِمْ}.'),
   ('AMINA', 'It means themselves, what is inside them.', 'sweet', 0.3),
   ('DALIA', 'So the change begins in my own heart?', 'happy', 0.6)],
  shots=[('pushAmina', 0), ('daliaCu', 'L1-0.1'), ('aminaLow', 'L2'), ('wordZoom', 'L3-0.1'), ('daliaCu2', 'L4-0.1'), ('aminaCu', 'L5'), ('pushAmina', 'L6-0.1'), ('daliaCu', 'L7-0.1'), ('aminaLow', 'L8'), ('daliaMed', 'L9-0.2')],
  cards=[('w_yugh', 'L0+2.4', 'L3-0.2'), ('w_qawm', 'L3-0.1', 'L6-0.2'), ('w_anf', 'L6-0.1', 'L9-0.2')]),
 dict(id='habit', set='room', pre=0.5, post=0.4, lines=[
   ('DALIA', "But I always quit after two days.", 'worried', 0),
   ('AMINA', "That is okay. A tiny step you keep is better than a big one you drop.", 'sweet', 0.5),
   ('DALIA', 'Okay. So how do I actually do it?', 'neutral', 0.7)],
  shots=[('daliaMed', 0), ('aminaLow', 'L1'), ('pushAmina', 'L1+2.2'), ('daliaCu2', 'L2')], cards=[]),
 dict(id='act1', set='park', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'One: PICK. Choose one tiny thing, so small it feels almost silly.', 'neutral', 0),
   ('AMINA', "Read one verse. Say one dua. Put your phone down ten minutes before bed.", 'sweet', 0.4)],
  shots=[('parkTrack', 0), ('parkLook', 'L1'), ('parkSky', 'L1+1.8'), ('parkSide', 'L1+3.8'), ('parkCu2', 'L1+5.6')], cards=[('step1', 0.4, 'E')]),
 dict(id='act2', set='mat', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'Two: PAIR. Stick the tiny thing to something you already do.', 'neutral', 0),
   ('AMINA', 'After you pray, read one verse. After you brush your teeth, say one dua.', 'sweet', 0.4),
   ('DALIA', 'Like putting a sticky note on a habit I already have.', 'happy', 0.5),
   ('AMINA', 'Yes. The old habit reminds you of the new one.', 'sweet', 0.5)],
  shots=[('matPush', 0), ('matCu', 'L1'), ('matDalia', 'L2'), ('matPull', 'L3')], cards=[('step2', 0.4, 'E')]),
 dict(id='act3', set='room', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'Three: ASK. Change is hard, so ask Allah for help.', 'neutral', 0),
   ('AMINA', 'You alone we worship, and You alone we ask for help. Say it with me.', 'sweet', 0.4, '{ar:إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ}. You alone we worship, and You alone we ask for help. Say it with me.'),
   ('DALIA', "Iyyaka na'budu wa iyyaka nasta'in.", 'neutral', 0.5, '{ar:إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ}.'),
   ('AMINA', 'You just asked for help in the Quran\'s own words.', 'sweet', 0.5)],
  shots=[('daliaMed', 0), ('aminaCu', 'L1'), ('daliaCu', 'L2'), ('twoShot', 'L3')], cards=[('step3', 0.3, 'L1'), ('v15', 'L1+0.3', 'E')]),
 dict(id='close', set='room', pre=0.7, post=1.8, lines=[
   ('AMINA', 'Quick check. Can you name the three?', 'sweet', 0),
   ('DALIA', 'First pick it, then pair it, then ask.', 'happy', 2.2),
   ('AMINA', 'And where does change start?', 'sweet', 0.45),
   ('DALIA', 'Inside me. With one small step.', 'happy', 0.6),
   ('AMINA', 'Try it for seven days. One tiny thing a day.', 'sweet', 0.55),
   ('DALIA', "Okay. I'll start tonight.", 'sweet', 0.6)],
  shots=[('aminaCu', 0), ('daliaMed', 'L1-0.2'), ('twoShot', 'L2'), ('daliaCu2', 'L3-0.1'), ('aminaCu', 'L4'), ('daliaCu', 'L5-0.1'), ('finalPull', 'L5+1.6')], cards=[('recap', 'L5-0.4', 'E')]),
]
