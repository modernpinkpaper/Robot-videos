# HE IS NEAR: "3 easy ways to talk to Allah" (ASK, QUOTE, ACT). Answer first, then why. Surah Al-Baqarah 2:186 (first part and the end), Ta-Ha 20:114 (the end).
# Amina teaches (comforting voice), Dalia learns (regular Dalia voice). Quran only, no hadith. Format: menu/formats/religious_teaching.md
# Each scene: lines (who, text, emotion, gap-before[, spoken-text-if-different]), shots (camera name, start), cards (card id, start, end).
# Arabic words are written {ar:...} in the spoken text (5th field): spoken in Arabic by the same character voice (see voices/README.md).
# shot/card time: number = seconds from scene start | 'L1' = when line 1 starts | 'L1+0.5' | 'E-1.0' = 1s before scene end | 'E' = scene end
TOTAL = None
SCENES = [
 dict(id='open', set='room', pre=0.12, post=0.4, lines=[
   ('DALIA', 'I know I should talk to Allah. But I never know what to say.', 'sad', 0),
   ('AMINA', "He's closer than you think. Three small ways to start. Ask. Quote. Act.", 'sweet', 0.35),
   ('DALIA', 'Closer? How close?', 'neutral', 0.45),
   ('AMINA', 'The Quran tells us. Listen.', 'sweet', 0.4)],
  shots=[('daliaHook', 0), ('aminaCuS', 'L1'), ('daliaCu2', 'L2'), ('pushAminaS', 'L3')], cards=[]),
 dict(id='verse', set='room', pre=0.5, post=3.4, lines=[
   ('AMINA', 'Al-Baqarah. Verse one eighty-six.', 'neutral', 0, '{ar:سُورَةُ الْبَقَرَةِ}. Verse one eighty-six.'),
   ('AMINA', 'When My servants ask you about Me: I am near.', 'sweet', 0.4),
   ('AMINA', 'I answer the call of the one who calls Me.', 'sweet', 0.5),
   ('DALIA', 'Allah is near, not far at all.', 'sad', 0.8),
   ('AMINA', "So here's the whole lesson. Allah is near. Call on Him.", 'sweet', 0.6),
   ('AMINA', 'Try it with me. One slow breath. Then tell Him one thing, in your head.', 'sweet', 0.7)],
  shots=[('lowAmina', 0), ('verseZoom', 'L1'), ('aminaCu', 'L1+2.0'), ('orbitTwo', 'L2'), ('daliaCu2', 'L3-0.1'), ('aminaLow', 'L4'), ('twoShot', 'L5')], cards=[('v2186', 0.2, 'L4'), ('refrain', 'L4', 'L5'), ('breathe', 'L5+0.3', 'E')]),
 dict(id='words', set='room', pre=0.5, post=0.4, lines=[
   ('AMINA', 'Three words to know. Say them with me. First: qarib.', 'neutral', 0, 'Three words to know. Say them with me. First: {ar:قَرِيبٌ}.'),
   ('DALIA', 'Qarib.', 'neutral', 0.35, '{ar:قَرِيبٌ}.'),
   ('AMINA', 'It means near.', 'sweet', 0.3),
   ('AMINA', "Second: ujibu.", 'neutral', 0.5, 'Second: {ar:أُجِيبُ}.'),
   ('DALIA', 'Ujibu.', 'neutral', 0.35, '{ar:أُجِيبُ}.'),
   ('AMINA', 'It means: I answer.', 'sweet', 0.3),
   ('AMINA', "Third: da'ani.", 'neutral', 0.5, 'Third: {ar:دَعَانِ}.'),
   ('DALIA', "Da'ani.", 'neutral', 0.35, '{ar:دَعَانِ}.'),
   ('AMINA', 'He calls Me.', 'sweet', 0.3),
   ('DALIA', 'Like calling my mom, and she just comes?', 'happy', 0.6)],
  shots=[('pushAmina', 0), ('daliaCu', 'L1-0.1'), ('aminaLow', 'L2'), ('wordZoom', 'L3-0.1'), ('daliaCu2', 'L4-0.1'), ('aminaCu', 'L5'), ('pushAmina', 'L6-0.1'), ('daliaCu', 'L7-0.1'), ('aminaLow', 'L8'), ('daliaMed', 'L9-0.2')],
  cards=[('w_qarib', 'L0+2.4', 'L3-0.2'), ('w_ujibu', 'L3-0.1', 'L6-0.2'), ('w_daani', 'L6-0.1', 'L9-0.2')]),
 dict(id='night', set='bed', light='night', vo=True, pre=0.4, post=0.9, lines=[
   ('AMINA', "Exactly. No appointment. You just call.", 'sweet', 0.2)],
  shots=[('nightWide', 0), ('nightNina', 0.9), ('nightMom', 2.2), ('nightHug', 3.5)], cards=[]),
 dict(id='habit', set='room', pre=0.5, post=0.4, lines=[
   ('DALIA', "But what do I even say? I'm not good at this.", 'worried', 0),
   ('AMINA', "The verse asks for no special words. It says: when he calls Me.", 'sweet', 0.5),
   ('DALIA', 'Okay. So how do I actually do it?', 'neutral', 0.7)],
  shots=[('daliaMed', 0), ('aminaLow', 'L1'), ('pushAmina', 'L1+2.2'), ('daliaCu2', 'L2')], cards=[]),
 dict(id='act1', set='park', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'One: ASK. When something is on your mind, tell Him. Right then.', 'neutral', 0),
   ('AMINA', "In your own words. Like: I'm nervous about tomorrow. Please help me.", 'sweet', 0.4)],
  shots=[('parkTrack', 0), ('parkLook', 'L1'), ('parkSky', 'L1+1.8'), ('parkSide', 'L1+3.8'), ('parkCu2', 'L1+5.6')], cards=[('step1', 0.4, 'E')]),
 dict(id='act2', set='mat', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'Two: QUOTE. Borrow words from the Quran. Start with a short one.', 'neutral', 0),
   ('AMINA', 'My Lord, increase me in knowledge. Say it with me.', 'sweet', 0.4, '{ar:رَبِّ زِدْنِي عِلْمًا}. My Lord, increase me in knowledge. Say it with me.'),
   ('DALIA', 'Rabbi zidni ilma.', 'neutral', 0.5, '{ar:رَبِّ زِدْنِي عِلْمًا}.'),
   ('AMINA', 'You just quoted the Quran. Say it before you read, or learn something.', 'sweet', 0.5)],
  shots=[('matPush', 0), ('matCu', 'L1'), ('matDalia', 'L2'), ('matPull', 'L3')], cards=[('step2', 0.4, 'L1'), ('v20114', 'L1+0.3', 'E')]),
 dict(id='act3', set='room', vo=True, pre=0.6, post=0.5, lines=[
   ('AMINA', 'Three: ACT. The verse says: let them respond to Me.', 'neutral', 0),
   ('AMINA', 'After you ask, do one small thing that fits it.', 'sweet', 0.4),
   ('AMINA', 'Asked for patience? Take three slow breaths. Asked for help studying? Open the book.', 'sweet', 0.4),
   ('DALIA', 'So I ask, and then I move.', 'happy', 0.5)],
  shots=[('daliaMed', 0), ('aminaCu', 'L1'), ('daliaCu', 'L2'), ('twoShot', 'L3')], cards=[('v2186b', 0.3, 'L1'), ('step3', 'L1', 'E')]),
 dict(id='close', set='room', pre=0.7, post=1.8, lines=[
   ('AMINA', 'Quick check. Can you name the three?', 'sweet', 0),
   ('DALIA', 'First ask, then borrow words, then act.', 'happy', 2.2),
   ('AMINA', 'And how close is He?', 'sweet', 0.45),
   ('DALIA', 'Allah is near, and He answers.', 'happy', 0.6),
   ('AMINA', 'Try it for seven days. One ask a day.', 'sweet', 0.55),
   ('DALIA', "Okay. I'll call.", 'sweet', 0.6)],
  shots=[('aminaCu', 0), ('daliaMed', 'L1-0.2'), ('twoShot', 'L2'), ('daliaCu2', 'L3-0.1'), ('aminaCu', 'L4'), ('daliaCu', 'L5-0.1'), ('finalPull', 'L5+1.6')], cards=[('recap', 'L5-0.4', 'E')]),
]
