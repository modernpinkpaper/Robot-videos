# HEART CALM v3: "3 easy ways to remember Allah" (PAUSE, NOTICE, TALK). Answer first, then why. Amina teaches, Dalia learns. Surah Ar-Ra'd 13:28. Arabic Quran only, no hadith.
# Each scene: lines (who, text, emotion, gap-before[, spoken-text-if-different]), shots (camera name, start), cards (card id, start, end).
# Arabic words are written {ar:...} in the spoken text (5th field): spoken in Arabic by the same character voice (see voices/README.md).
# shot/card time: number = seconds from scene start | 'L1' = when line 1 starts | 'L1+0.5' | 'E-1.0' = 1s before scene end | 'E' = scene end
TOTAL = None
SCENES = [
 dict(id='open', set='room', pre=0.12, post=0.4, lines=[
   ('DALIA', "I grew up Muslim. So why does my heart feel like it's on mute?", 'sad', 0),
   ('AMINA', "Your heart isn't broken. Three small habits can help. Pause. Notice. Talk.", 'sweet', 0.35),
   ('DALIA', 'Three? That is it?', 'neutral', 0.45),
   ('AMINA', "That's it. Small is the point. And the Quran tells us why.", 'sweet', 0.4)],
  shots=[('daliaHook', 0), ('aminaCuS', 'L1'), ('daliaCu2', 'L2'), ('pushAminaS', 'L3')], cards=[]),
 dict(id='verse', set='room', pre=0.5, post=3.6, lines=[
   ('AMINA', "Surah Ar-Ra'd. Verse twenty-eight.", 'neutral', 0, '{ar:سُورَةُ الرَّعْدِ}. Verse twenty-eight.'),
   ('AMINA', 'Those who believe, and whose hearts find calm in remembering Allah.', 'sweet', 0.4),
   ('AMINA', 'Truly, in remembering Allah, hearts find calm.', 'sweet', 0.5),
   ('DALIA', "Calm. That's the word I've been missing.", 'sad', 0.8),
   ('AMINA', "So here's the whole lesson. Remember Allah, and your heart finds calm.", 'sweet', 0.6),
   ('AMINA', 'Try it with me. One slow breath. In... and out.', 'sweet', 0.7)],
  shots=[('lowAmina', 0), ('verseZoom', 'L1'), ('aminaCu', 'L1+2.0'), ('orbitTwo', 'L2'), ('daliaCu2', 'L3-0.1'), ('aminaLow', 'L4'), ('twoShot', 'L5')], cards=[('v1328', 0.2, 'L4'), ('refrain', 'L4', 'L5'), ('breathe', 'L5+0.3', 'E')]),
 dict(id='words', set='room', pre=0.5, post=0.4, lines=[
   ('AMINA', 'Three words to know. Say them with me. First: dhikr.', 'neutral', 0, 'Three words to know. Say them with me. First: {ar:ذِكْر}.'),
   ('DALIA', 'Dhikr.', 'neutral', 0.35, '{ar:ذِكْر}.'),
   ('AMINA', 'Remembering.', 'sweet', 0.3),
   ('AMINA', 'Second: qulub.', 'neutral', 0.5, 'Second: {ar:قُلُوب}.'),
   ('DALIA', 'Qulub.', 'neutral', 0.35, '{ar:قُلُوب}.'),
   ('AMINA', 'Hearts.', 'sweet', 0.3),
   ("AMINA", "Third: tatma'inn.", 'neutral', 0.5, 'Third: {ar:تَطْمَئِنُّ}.'),
   ('DALIA', "Tatma'inn.", 'neutral', 0.35, '{ar:تَطْمَئِنُّ}.'),
   ('AMINA', 'Calm. Settled. Safe.', 'sweet', 0.3),
   ('DALIA', 'Like a little kid who finds her mom in a store?', 'happy', 0.6)],
  shots=[('pushAmina', 0), ('daliaCu', 'L1-0.1'), ('aminaLow', 'L2'), ('wordZoom', 'L3-0.1'), ('daliaCu2', 'L4-0.1'), ('aminaCu', 'L5'), ('pushAmina', 'L6-0.1'), ('daliaCu', 'L7-0.1'), ('aminaLow', 'L8'), ('daliaMed', 'L9-0.2')],
  cards=[('w_dhikr', 'L0+2.2', 'L3-0.2'), ('w_qulub', 'L3-0.1', 'L6-0.2'), ('w_tatmain', 'L6-0.1', 'L9-0.2')]),
 dict(id='store', set='store', vo=True, pre=0.4, post=0.9, lines=[
   ('AMINA', 'Exactly like that. The panic drops, and your whole body exhales.', 'sweet', 0.2)],
  shots=[('storeWide', 0), ('storeNina', 0.9), ('storeMom', 2.2), ('storeHug', 3.5)], cards=[]),
 dict(id='habit', set='room', pre=0.5, post=0.4, lines=[
   ('DALIA', "But I say Alhamdulillah all day. It's just habit.", 'worried', 0, "But I say {ar:الْحَمْدُ لِلَّهِ} all day. It's just habit."),
   ('AMINA', 'Habit is a good door. Remembering is walking through it.', 'sweet', 0.5),
   ('AMINA', 'In Al-Baqarah, Allah says: remember Me, and I will remember you.', 'neutral', 0.5, 'In {ar:سُورَةُ الْبَقَرَةِ}, Allah says: remember Me, and I will remember you.'),
   ('DALIA', 'Okay. So how do I actually do it?', 'neutral', 0.6)],
  shots=[('daliaMed', 0), ('aminaLow', 'L1'), ('pushAmina', 'L1+2.2'), ('cardZoom', 'L2'), ('daliaCu2', 'L3')], cards=[('v2152', 'L2+0.3', 'L3')]),
 dict(id='act1', set='bed', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'One: PAUSE. When you reach for your phone in the morning, wait ten seconds.', 'neutral', 0),
   ('AMINA', 'Say Alhamdulillah, and name one real thing.', 'sweet', 0.4, 'Say {ar:الْحَمْدُ لِلَّهِ}, and name one real thing.'),
   ('DALIA', 'Coffee. Okay. Coffee is real.', 'laugh', 0.5),
   ('AMINA', 'Ten seconds of remembering. That is all.', 'sweet', 0.5)],
  shots=[('bedPush', 0), ('bedPhone', 'L0+2.2'), ('bedCu', 'L1'), ('bedWide', 'L2'), ('bedCu', 'L3')], cards=[('step1', 0.4, 'L2')]),
 dict(id='act2', set='park', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', "Two: NOTICE. When you're walking or waiting, look up.", 'neutral', 0),
   ('AMINA', 'See something, and say SubhanAllah. Mean it.', 'sweet', 0.4, 'See something, and say {ar:سُبْحَانَ اللَّهِ}. Mean it.'),
   ('AMINA', 'The Quran says wise people remember Allah standing, sitting, lying down. Anywhere.', 'neutral', 0.5)],
  shots=[('parkTrack', 0), ('parkLook', 'L1'), ('parkSky', 'L1+1.6'), ('parkSide', 'L2-0.1'), ('parkCu2', 'L2+3.0'), ('parkWide', 'L2+5.2')], cards=[('step2', 0.4, 'L1+0.2'), ('v3191', 'L2+0.2', 'E')]),
 dict(id='act3', set='mat', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'Three: TALK. After you pray, stay seated for one minute.', 'neutral', 0),
   ('AMINA', 'Tell Allah about your day, in your own words.', 'sweet', 0.4),
   ('DALIA', 'Even if it comes out messy?', 'worried', 0.5),
   ('AMINA', 'Especially then.', 'sweet', 0.4)],
  shots=[('matPush', 0), ('matCu', 'L1'), ('matDalia', 'L2'), ('matPull', 'L3')], cards=[('step3', 0.4, 'L2')]),
 dict(id='close', set='room', pre=0.7, post=1.8, lines=[
   ('AMINA', 'Quick check. Can you name the three?', 'sweet', 0),
   ('DALIA', 'Pause. Notice. Talk.', 'happy', 2.2),
   ('AMINA', 'And why do they work?', 'sweet', 0.45),
   ('DALIA', 'Because remembering Allah calms the heart.', 'happy', 0.6),
   ('AMINA', 'Try them for seven days.', 'sweet', 0.55),
   ('DALIA', "Okay. I'm listening.", 'sweet', 0.6)],
  shots=[('aminaCu', 0), ('daliaMed', 'L1-0.2'), ('twoShot', 'L2'), ('daliaCu2', 'L3-0.1'), ('aminaCu', 'L4'), ('daliaCu', 'L5-0.1'), ('finalPull', 'L5+1.6')], cards=[('recap', 'L5-0.4', 'E')]),
]
