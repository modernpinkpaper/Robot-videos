# WITH HARDSHIP COMES EASE: "3 easy ways to find ease" (SPOT, SAY, STEP). Answer first, then why. Surah Ash-Sharh 94:5-6, Ta-Ha 20:25-26 (Musa's dua).
# Amina teaches (comforting voice), Dalia learns (regular Dalia voice). Quran only, no hadith. Format: menu/formats/religious_teaching.md
# Each scene: lines (who, text, emotion, gap-before[, spoken-text-if-different]), shots (camera name, start), cards (card id, start, end).
# Arabic words are written {ar:...} in the spoken text (5th field): spoken in Arabic by the same character voice (see voices/README.md).
# Lines for the cloned voices are never 1 or 2 word sentences (they come out garbled): see voices/README.md.
# shot/card time: number = seconds from scene start | 'L1' = when line 1 starts | 'L1+0.5' | 'E-1.0' = 1s before scene end | 'E' = scene end
TOTAL = None
SCENES = [
 dict(id='open', set='room', pre=0.12, post=0.4, lines=[
   ('DALIA', 'This week is so hard. I just want it to be over.', 'sad', 0),
   ('AMINA', "Allah promises ease with the hard part. Three small ways to find it. Spot. Say. Step.", 'sweet', 0.35),
   ('DALIA', 'Wait, so it is not saved for later?', 'neutral', 0.45),
   ('AMINA', 'The Quran tells us. Listen.', 'sweet', 0.4)],
  shots=[('daliaHook', 0), ('aminaCuS', 'L1'), ('daliaCu2', 'L2'), ('pushAminaS', 'L3')], cards=[]),
 dict(id='verse', set='room', pre=0.5, post=3.4, lines=[
   ('AMINA', 'Ash-Sharh. Verses five and six.', 'neutral', 0, '{ar:سُورَةُ الشَّرْحِ}. Verses five and six.'),
   ('AMINA', 'Truly, with every hardship comes ease.', 'sweet', 0.4),
   ('AMINA', 'Allah says it two times in a row, so you know it is a promise.', 'sweet', 0.5),
   ('DALIA', 'Not after the hardship. Right with it.', 'sad', 0.8),
   ('AMINA', "So here's the whole lesson. Ease comes with the hard part. Look for it.", 'sweet', 0.6),
   ('AMINA', 'Try it with me. One slow breath. Then think of one small ease you have right now.', 'sweet', 0.7)],
  shots=[('lowAmina', 0), ('verseZoom', 'L1'), ('aminaCu', 'L1+2.0'), ('orbitTwo', 'L2'), ('daliaCu2', 'L3-0.1'), ('aminaLow', 'L4'), ('twoShot', 'L5')], cards=[('v945', 0.2, 'L4'), ('refrain', 'L4', 'L5'), ('breathe', 'L5+0.3', 'E')]),
 dict(id='words', set='room', pre=0.5, post=0.4, lines=[
   ('AMINA', "Three words to know. Say them with me. First: ma'a.", 'neutral', 0, 'Three words to know. Say them with me. First: {ar:مَعَ}.'),
   ('DALIA', "Ma'a.", 'neutral', 0.35, '{ar:مَعَ}.'),
   ('AMINA', 'It means with.', 'sweet', 0.3),
   ('AMINA', "Second: al-usr.", 'neutral', 0.5, 'Second: {ar:ٱلْعُسْرِ}.'),
   ('DALIA', 'Al-usr.', 'neutral', 0.35, '{ar:ٱلْعُسْرِ}.'),
   ('AMINA', 'It means the hardship.', 'sweet', 0.3),
   ('AMINA', "Third: yusra.", 'neutral', 0.5, 'Third: {ar:يُسْرًا}.'),
   ('DALIA', "Yusra.", 'neutral', 0.35, '{ar:يُسْرًا}.'),
   ('AMINA', 'It means ease.', 'sweet', 0.3),
   ('DALIA', 'Like someone carrying the heavy box with me?', 'happy', 0.6)],
  shots=[('pushAmina', 0), ('daliaCu', 'L1-0.1'), ('aminaLow', 'L2'), ('wordZoom', 'L3-0.1'), ('daliaCu2', 'L4-0.1'), ('aminaCu', 'L5'), ('pushAmina', 'L6-0.1'), ('daliaCu', 'L7-0.1'), ('aminaLow', 'L8'), ('daliaMed', 'L9-0.2')],
  cards=[('w_maa', 'L0+2.4', 'L3-0.2'), ('w_usr', 'L3-0.1', 'L6-0.2'), ('w_yusra', 'L6-0.1', 'L9-0.2')]),
 dict(id='night', set='bed', light='night', vo=True, pre=0.4, post=0.9, lines=[
   ('AMINA', "Exactly. Like a mom who sits right next to you in the dark.", 'sweet', 0.2)],
  shots=[('nightWide', 0), ('nightNina', 0.9), ('nightMom', 2.2), ('nightHug', 3.5)], cards=[]),
 dict(id='habit', set='room', pre=0.5, post=0.4, lines=[
   ('DALIA', "But when I'm stressed, I can't see any ease at all.", 'worried', 0),
   ('AMINA', "That is okay. You do not need a big sign. Small ones count too.", 'sweet', 0.5),
   ('DALIA', 'Okay. So how do I actually do it?', 'neutral', 0.7)],
  shots=[('daliaMed', 0), ('aminaLow', 'L1'), ('pushAmina', 'L1+2.2'), ('daliaCu2', 'L2')], cards=[]),
 dict(id='act1', set='park', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'One: SPOT it. Find one small ease inside your hard day.', 'neutral', 0),
   ('AMINA', "A warm drink. A kind text. A cool breeze. Then say: thank You, Allah.", 'sweet', 0.4)],
  shots=[('parkTrack', 0), ('parkLook', 'L1'), ('parkSky', 'L1+1.8'), ('parkSide', 'L1+3.8'), ('parkCu2', 'L1+5.6')], cards=[('step1', 0.4, 'E')]),
 dict(id='act2', set='mat', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'Two: SAY. Musa said these Quran words when his job felt too big.', 'neutral', 0),
   ('AMINA', 'My Lord, open my chest, and make my task easy. Say it with me.', 'sweet', 0.4, '{ar:رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي}. My Lord, open my chest, and make my task easy. Say it with me.'),
   ('DALIA', 'Rabbi ishrah li sadri, wa yassir li amri.', 'neutral', 0.5, '{ar:رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي}.'),
   ('AMINA', 'You just quoted the Quran. Open my chest means: give me a calm, wide heart.', 'sweet', 0.5)],
  shots=[('matPush', 0), ('matCu', 'L1'), ('matDalia', 'L2'), ('matPull', 'L3')], cards=[('step2', 0.4, 'L1'), ('v2025', 'L1+0.3', 'E')]),
 dict(id='act3', set='room', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'Three: STEP. The promise is right here with you, so use it.', 'neutral', 0),
   ('AMINA', 'Do one small thing, right now.', 'sweet', 0.4),
   ('AMINA', 'Overwhelmed? Do the first tiny task. Tired? Wash your face. Stuck? Open the book.', 'sweet', 0.4),
   ('DALIA', 'So I spot it, I say it, and then I step.', 'happy', 0.5)],
  shots=[('daliaMed', 0), ('aminaCu', 'L1'), ('daliaCu', 'L2'), ('twoShot', 'L3')], cards=[('v945b', 0.3, 'L1'), ('step3', 'L1', 'E')]),
 dict(id='close', set='room', pre=0.7, post=1.8, lines=[
   ('AMINA', 'Quick check. Can you name the three?', 'sweet', 0),
   ('DALIA', 'First spot it, then say it, then step.', 'happy', 2.2),
   ('AMINA', 'And where is the ease?', 'sweet', 0.45),
   ('DALIA', 'Right with the hard part. Always with it.', 'happy', 0.6),
   ('AMINA', 'Try it for seven days. One small ease a day.', 'sweet', 0.55),
   ('DALIA', "Okay. I'll look for it.", 'sweet', 0.6)],
  shots=[('aminaCu', 0), ('daliaMed', 'L1-0.2'), ('twoShot', 'L2'), ('daliaCu2', 'L3-0.1'), ('aminaCu', 'L4'), ('daliaCu', 'L5-0.1'), ('finalPull', 'L5+1.6')], cards=[('recap', 'L5-0.4', 'E')]),
]
