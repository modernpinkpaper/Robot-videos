# HEART CALM: story with a teacher (Amina) and a student (Dalia). Surah Ar-Ra'd 13:28 and 3 daily actions. Arabic Quran only, no hadith.
# Each scene: lines (who, text, emotion, gap-before[, spoken-text-if-different]), shots (camera name, start), cards (card id, start, end).
# shot/card time: number = seconds from scene start | 'L1' = when line 1 starts | 'L1+0.5' | 'E-1.0' = 1s before scene end | 'E' = scene end
TOTAL = None   # not fixed: the video ends when the last scene ends (see build_audio.py)
SCENES = [
 dict(id='open', set='room', pre=0.9, post=0.4, lines=[
   ('DALIA', 'I grew up Muslim. I know all the words.', 'tired', 0),
   ('DALIA', 'So why does it feel like background noise?', 'sad', 0.4),
   ('AMINA', "That feeling is more common than you'd think.", 'sweet', 0.5),
   ('AMINA', 'Can I show you one verse?', 'sweet', 0.35)],
  shots=[('aerial', 0), ('daliaCu', 'L1-0.1'), ('twoShot', 'L1+1.3'), ('aminaCuS', 'L2'), ('pushAminaS', 'L3')], cards=[('title', 0.25, 'L0+2.2')]),
 dict(id='verse', set='room', pre=0.6, post=0.5, lines=[
   ('AMINA', 'Chapter thirteen. Verse twenty-eight.', 'neutral', 0),
   ('AMINA', 'Those who believe, and whose hearts find calm in remembering Allah.', 'sweet', 0.4),
   ('AMINA', 'Truly, in remembering Allah, hearts find calm.', 'sweet', 0.5),
   ('DALIA', "Calm. That's the word I've been missing.", 'sad', 0.8)],
  shots=[('lowAmina', 0), ('verseZoom', 'L1'), ('aminaCu', 'L1+2.0'), ('orbitTwo', 'L2'), ('daliaCu2', 'L3-0.1'), ('daliaMed', 'L3+2.2')], cards=[('v1328', 0.2, 'L3')]),
 dict(id='words', set='room', pre=0.5, post=0.5, lines=[
   ('AMINA', 'Three words. First: dhikr. It means remembering.', 'neutral', 0, 'Three words. First: zikr. It means remembering.'),
   ('AMINA', 'Keeping Allah in your mind, and on your tongue.', 'sweet', 0.35),
   ('AMINA', 'Second: qulub. Hearts.', 'neutral', 0.5, 'Second: kuloob. Hearts.'),
   ('AMINA', 'Third: tatma-inn. To settle. To feel safe and still.', 'neutral', 0.5, 'Third: tat-ma-een. To settle. To feel safe and still.'),
   ('DALIA', 'Like a little kid who finds her mom in a store?', 'happy', 0.5),
   ('AMINA', 'That. The panic drops, and your whole body exhales.', 'laugh', 0.3),
   ('AMINA', "And that little word, ala? It means: listen up. This one matters.", 'sweet', 0.6, "And that little word, ah-la? It means: listen up. This one matters.")],
  shots=[('pushAmina', 0), ('aminaLow', 'L1'), ('wordZoom', 'L2-0.2'), ('aminaCu', 'L3'), ('twoShot', 'L3+2.6'), ('daliaCu', 'L4-0.1'), ('aminaLow', 'L5'), ('twoLow', 'L5+2.4'), ('daliaMed', 'L6-0.2'), ('orbitTwo', 'L6+2.6'), ('aminaCu', 'L6+4.6')],
  cards=[('w_dhikr', 'L0+1.4', 'L2-0.3'), ('w_qulub', 'L2-0.2', 'L3-0.2'), ('w_tatmain', 'L3-0.1', 'L4-0.2'), ('w_ala', 'L6+0.1', 'E')]),
 dict(id='habit', set='room', pre=0.6, post=0.4, lines=[
   ('DALIA', 'But I say Alhamdulillah all day. It\'s just habit.', 'worried', 0, "But I say Alham-du-lil-lah all day. It's just habit."),
   ('AMINA', 'Habit is a good door. The verse asks you to walk through it.', 'sweet', 0.5),
   ('AMINA', "Say it slowly. Think about what you're thankful for.", 'neutral', 0.4),
   ('DALIA', 'Huh. Like the difference between texting thanks, and calling.', 'happy', 0.6),
   ('AMINA', 'Another verse says it too. Al-Baqarah, one fifty-two.', 'neutral', 0.5),
   ('AMINA', 'Remember Me, and I will remember you.', 'sweet', 0.5)],
  shots=[('daliaMed', 0), ('aminaLow', 'L1'), ('pushAmina', 'L1+2.2'), ('twoDolly', 'L2'), ('daliaCu2', 'L3'), ('twoShot', 'L3+2.3'), ('cardZoom', 'L4'), ('aminaCu', 'L5')], cards=[('v2152', 'L4+0.3', 'E')]),
 dict(id='how', set='room', pre=0.5, post=0.5, lines=[
   ('DALIA', 'Okay. But what do I actually do tomorrow?', 'neutral', 0),
   ('AMINA', 'Think of your heart like a phone battery. Small charges all day keep it alive.', 'sweet', 0.4)],
  shots=[('daliaCu', 0), ('dollyZoom', 'L1+0.4'), ('craneRoom', 'L1+3.4')], cards=[('battery', 'L1+0.2', 'E-0.2')]),
 dict(id='act1', set='bed', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'One. Before you touch your phone, pause for ten seconds.', 'neutral', 0),
   ('AMINA', 'Say Alhamdulillah, and name one real thing.', 'sweet', 0.4, 'Say Alham-du-lil-lah, and name one real thing.'),
   ('DALIA', 'Coffee. Okay. Coffee is real.', 'laugh', 0.5)],
  shots=[('bedPush', 0), ('bedPhone', 'L0+1.6'), ('bedCu', 'L1'), ('bedWide', 'L2')], cards=[('step1', 0.4, 'L1+0.2')]),
 dict(id='act2', set='park', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'Two. Pick one moment a day, like walking or waiting.', 'neutral', 0),
   ('AMINA', 'Look up. Notice something. Say SubhanAllah, and mean it.', 'sweet', 0.4, 'Say Sub-han-Allah, and mean it. Look up. Notice something.'),
   ('AMINA', 'Chapter three, verse one ninety-one. Wise people remember Allah. Standing, sitting, lying down. Anywhere.', 'neutral', 0.5)],
  shots=[('parkTrack', 0), ('parkLook', 'L1'), ('parkSky', 'L1+1.8'), ('parkSide', 'L2-0.1'), ('parkCu2', 'L2+3.2'), ('parkWide', 'L2+5.6')], cards=[('step2', 0.4, 'L1+0.2'), ('v3191', 'L2+0.2', 'E')]),
 dict(id='act3', set='mat', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'Three. After you pray, stay seated for one minute.', 'neutral', 0),
   ('AMINA', 'Tell Allah about your day, in your own words.', 'sweet', 0.4),
   ('DALIA', 'Even if it comes out messy?', 'worried', 0.5),
   ('AMINA', 'Especially then.', 'sweet', 0.4)],
  shots=[('matPush', 0), ('matCu', 'L1'), ('matDalia', 'L2'), ('matPull', 'L3')], cards=[('step3', 0.4, 'L1+0.2')]),
 dict(id='close', set='room', pre=0.7, post=1.6, lines=[
   ('DALIA', 'Three things. One week. I can do that.', 'happy', 0),
   ('AMINA', 'Start small. And when you forget, just come back. That is the point.', 'sweet', 0.5),
   ('DALIA', "Okay. I'm listening.", 'sweet', 0.6)],
  shots=[('daliaMed', 0), ('twoShot', 'L1'), ('aminaCu', 'L1+2.0'), ('twoLow', 'L1+3.8'), ('daliaCu2', 'L2-0.1'), ('finalPull', 'L2+1.5')], cards=[('recap', 'L2-0.3', 'E')]),
]
