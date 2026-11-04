# STOP A RUMOR (short formula + phone close-ups): PROBLEM acted out on a phone, VERSE on a phone, ONE EASY WAY. Surah Al-Hujurat 49:6.
# Amina teaches (comforting voice), Dalia learns (regular Dalia voice). Quran only, no hadith. Format: menu/formats/religious_teaching.md (SHORT FORMULA)
# Each scene: lines (who, text, emotion, gap-before[, spoken-text-if-different]), shots (camera name, start), cards (card id, start, end), phones (phone screen id, start, end): a full-frame close-up of a hand holding a phone.
# Arabic words are written {ar:...} in the spoken text (5th field). No 1 or 2 word English sentences for the cloned voices.
TOTAL = None
SCENES = [
 dict(id='open', set='room', pre=0.12, post=0.4, lines=[
   ('DALIA', "Wait, what? Layla got fired for stealing?", 'worried', 0),
   ('DALIA', "Everyone needs to know. I'm sending it to all my chats.", 'happy', 0.5),
   ('DALIA', "Oh no. She says it isn't true.", 'sad', 0.7),
   ('AMINA', "That happens a lot. Here's one tiny fix.", 'sweet', 0.4),
   ('AMINA', 'The Quran tells us. Listen.', 'sweet', 0.4)],
  shots=[('daliaHook', 0), ('daliaCu2', 'L1'), ('daliaCu', 'L2'), ('aminaCuS', 'L3'), ('pushAminaS', 'L4')], cards=[], pops=[],
  phones=[('post', 0.0, 'L0+3.6'), ('sent', 'L1+0.4', 'L2+0.5')]),
 dict(id='verse', set='room', pre=0.5, post=1.6, lines=[
   ('AMINA', 'Al-Hujurat. This is verse number six.', 'neutral', 0, '{ar:سُورَةُ الْحُجُرَاتِ}. This is verse number six.'),
   ('AMINA', "If a wrongdoer brings you news, check it first. Or you might hurt people without knowing, and regret it.", 'sweet', 0.4),
   ('AMINA', "So when news comes from someone you can't trust, slow down.", 'sweet', 0.5),
   ('DALIA', 'So I pause before I post.', 'happy', 0.6)],
  shots=[('lowAmina', 0), ('verseZoom', 'L1'), ('aminaLow', 'L2'), ('daliaCu2', 'L3-0.1'), ('twoShot', 'L3+1.4')], cards=[], pops=[],
  phones=[('quran', 'L1-0.1', 'L2+0.2')]),
 dict(id='habit', set='room', pre=0.5, post=0.5, lines=[
   ('AMINA', "Here's your one easy way. Before you share, say: fa-tabayyanu.", 'sweet', 0, "Here's your one easy way. Before you share, say: {ar:فَتَبَيَّنُوا}."),
   ('AMINA', "It means: check it first. Who said it, and is it true? It takes ten seconds.", 'sweet', 0.4),
   ('DALIA', 'Fa-tabayyanu.', 'neutral', 0.6, '{ar:فَتَبَيَّنُوا}.'),
   ('DALIA', "I just asked Layla. She's fine, and she said thank you.", 'happy', 0.6)],
  shots=[('daliaMed', 0), ('aminaLow', 'L1'), ('daliaCu', 'L2-0.1'), ('daliaCu2', 'L3'), ('aminaCu', 'L3+1.8')], cards=[('copy', 'L0+1.4', 'L2')], pops=[],
  phones=[('check', 'L2+0.5', 'L3+3.0')]),
 dict(id='close', set='room', pre=0.7, post=1.6, lines=[
   ('AMINA', 'Try it for seven days. Every time you want to forward something.', 'sweet', 0),
   ('DALIA', "Okay. I'll check first.", 'sweet', 0.6)],
  shots=[('aminaCu', 0), ('daliaMed', 'L1-0.2'), ('finalPull', 'L1+0.7')], cards=[('recap', 0.3, 'E')], pops=[], phones=[]),
]
