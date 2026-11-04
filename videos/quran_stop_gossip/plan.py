# "3 EASY WAYS TO STOP GOSSIP": PAUSE, PICTURE, PRAISE. Flat role-play style + the formula of menu/formats/religious_teaching.md (answer first, one verse, one word, 3 acted steps, recap, 7 days).
# Quran only, no hadith. Verses: Al-Hujurat 49:12 (backbiting, the picture, Allah is Tawwab) and Al-Isra 17:53 (say what is best). Arabic copied from api.alquran.cloud (Uthmani).
# Dalia learns, Amina teaches. Each scene: lines (who, text, emotion, gap[, spoken-text-with-{ar:...}]), shots (camera name, start), cards (card id, start, end).
# time: number = seconds from scene start | 'L1' = when line 1 starts | 'L1+0.5' | 'E-1.0' = 1s before scene end | 'E' = scene end
TOTAL = 0
SCENES = [
 dict(id='open', pre=0.12, post=0.4, lines=[
   ('DALIA', "I did it again. I talked about my friend when she wasn't there.", 'worried', 0),
   ('AMINA', 'It happens. The Quran gives us three easy ways to stop. Pause. Picture. Praise.', 'sweet', 0.35),
   ('DALIA', 'Wait. The Quran talks about this?', 'neutral', 0.45),
   ('AMINA', 'It does. Listen.', 'sweet', 0.4)],
  shots=[('dCuHook', 0), ('aCu', 'L1'), ('dCu', 'L2'), ('two', 'L3')], cards=[]),
 dict(id='verse', pre=0.5, post=0.5, lines=[
   ('AMINA', 'Al-Hujurat, verse twelve.', 'neutral', 0, '{ar:سُورَةُ الْحُجُرَاتِ}, verse twelve.'),
   ('AMINA', 'Do not backbite one another.', 'neutral', 0.4),
   ('AMINA', 'Would one of you like to eat the flesh of his dead brother? You would hate it.', 'dramatic', 0.5),
   ('DALIA', 'Okay. That is a strong picture.', 'shock', 0.8),
   ('AMINA', 'Backbiting means talking about someone who is not there to hear it.', 'neutral', 0.5)],
  shots=[('phoneIn', 0)], cards=[]),
 dict(id='word', pre=0.5, post=0.4, lines=[
   ('AMINA', 'One word to know. Say it with me. Yaghtab.', 'neutral', 0, 'One word to know. Say it with me. {ar:يَغْتَب}.'),
   ('DALIA', 'Yaghtab.', 'neutral', 0.35, '{ar:يَغْتَب}.'),
   ('AMINA', 'It means to backbite.', 'sweet', 0.3)],
  shots=[('two2', 0), ('dCu2', 'L1-0.1'), ('aLow', 'L2')], cards=[('w_yaghtab', 'L0+1.8', 'E')]),
 dict(id='step1', pre=0.5, post=0.4, lines=[
   ('AMINA', 'One: PAUSE. Watch what happens.', 'neutral', 0),
   ('DALIA', "Okay, don't tell anyone, but she's been so annoying lately.", 'smug', 0.5),
   ('AMINA', 'Pause. Would she hate to hear that?', 'stern', 0.5),
   ('DALIA', 'It would really hurt her, honestly.', 'tired', 0.7)],
  shots=[('wide', 0), ('dCu3', 'L1'), ('aLow', 'L2'), ('dDown', 'L3-0.2')], cards=[('step1', 0.3, 'E')]),
 dict(id='step2', pre=0.5, post=0.4, lines=[
   ('AMINA', 'Two: PICTURE it. Remember the verse. If the picture makes you cringe, stop.', 'neutral', 0),
   ('DALIA', 'That picture is hard to forget.', 'sad', 0.6)],
  shots=[('aCu2', 0), ('two3', 'L1')], cards=[('step2', 0.3, 'E')]),
 dict(id='step3', pre=0.5, post=0.5, lines=[
   ('AMINA', 'Three: PRAISE. Allah says: tell My servants to say what is best.', 'neutral', 0),
   ('DALIA', "So I say something kind instead. She's really generous, actually.", 'sweet', 0.7)],
  shots=[('phoneIn2', 0), ('dHeart', 'L1')], cards=[('step3', 'L1', 'E')]),
 dict(id='mercy', pre=0.5, post=0.4, lines=[
   ('DALIA', 'But what about what I already said?', 'worried', 0),
   ('AMINA', 'The same verse ends with hope. Allah is Tawwab. He accepts us back, and He is merciful.', 'sweet', 0.5, 'The same verse ends with hope. Allah is {ar:تَوَّابٌ}. He accepts us back, and He is merciful.')],
  shots=[('dCu4', 0), ('aCu3', 'L1'), ('two4', 'L1+3.5')], cards=[('w_tawwab', 'L1+1.9', 'E')]),
 dict(id='close', pre=0.6, post=3.0, lines=[
   ('AMINA', 'Quick check. Can you name the three?', 'sweet', 0),
   ('DALIA', 'I pause, I picture it, and then I praise.', 'happy', 2.0),
   ('AMINA', 'Try it for seven days. One pause a day.', 'sweet', 0.5),
   ('DALIA', "Okay. I'll start today.", 'sweet', 0.6)],
  shots=[('aCu4', 0), ('dCu5', 'L1-0.1'), ('two5', 'L2'), ('dCu5', 'L3-0.1'), ('card', 'E-2.6')], cards=[('recap', 'L1+0.6', 'L3-0.2')]),
]
