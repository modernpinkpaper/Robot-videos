# REMEMBER ME (short formula): PROBLEM acted out, VERSE, ONE EASY WAY. Surah Al-Baqarah 2:152 (first part) and the Quran phrase SubhanAllah.
# Amina teaches (comforting voice), Dalia learns (regular Dalia voice). Quran only, no hadith. Format: menu/formats/religious_teaching.md (SHORT FORMULA)
# Each scene: lines (who, text, emotion, gap-before[, spoken-text-if-different]), shots (camera name, start), cards (card id, start, end), pops (emoji, x, y, start, end).
# Arabic words are written {ar:...} in the spoken text (5th field). No 1 or 2 word English sentences for the cloned voices.
TOTAL = None
SCENES = [
 dict(id='open', set='room', pre=0.12, post=0.4, lines=[
   ('DALIA', "It's midnight. I scrolled all day. I didn't think of Allah once.", 'sad', 0),
   ('AMINA', "That happens to everyone. Here is one tiny fix.", 'sweet', 0.35),
   ('DALIA', "Okay. What's the fix?", 'neutral', 0.45),
   ('AMINA', 'The Quran tells us. Listen.', 'sweet', 0.4)],
  shots=[('daliaHook', 0), ('aminaCuS', 'L1'), ('daliaCu2', 'L2'), ('pushAminaS', 'L3')], cards=[],
  pops=[('📱', 372, 215, 0.3, 'L0+2.6'), ('🕛', 48, 250, 'L0+1.2', 'L1')]),
 dict(id='verse', set='room', pre=0.5, post=1.6, lines=[
   ('AMINA', 'Al-Baqarah. Verse one fifty-two.', 'neutral', 0, '{ar:سُورَةُ الْبَقَرَةِ}. Verse one fifty-two.'),
   ('AMINA', 'Remember Me, and I will remember you.', 'sweet', 0.4),
   ('DALIA', 'So Allah thinks of me too?', 'sad', 0.8),
   ('AMINA', 'Yes, every time. And remembering Him can be tiny.', 'sweet', 0.6)],
  shots=[('lowAmina', 0), ('verseZoom', 'L1'), ('daliaCu2', 'L2-0.1'), ('aminaLow', 'L3'), ('twoShot', 'L3+1.6')], cards=[('v2152', 0.2, 'L3')], pops=[]),
 dict(id='habit', set='room', pre=0.5, post=0.5, lines=[
   ('AMINA', "Here's your one easy way. Before you open an app, say: SubhanAllah.", 'sweet', 0, "Here's your one easy way. Before you open an app, say: {ar:سُبْحَانَ ٱللَّهِ}."),
   ('AMINA', 'It means: Glory to Allah. It takes two seconds.', 'sweet', 0.4),
   ('DALIA', 'SubhanAllah.', 'neutral', 0.6, '{ar:سُبْحَانَ ٱللَّهِ}.'),
   ('DALIA', 'That felt small. And kind of nice.', 'happy', 0.6)],
  shots=[('daliaMed', 0), ('aminaLow', 'L1'), ('daliaCu', 'L2-0.1'), ('daliaCu2', 'L3'), ('aminaCu', 'L3+1.6')], cards=[('copy', 'L0+1.2', 'L3')],
  pops=[('📱', 372, 215, 'L2-1.2', 'L2+0.1')]),
 dict(id='close', set='room', pre=0.7, post=1.6, lines=[
   ('AMINA', 'Try it for seven days. Every time you reach for your phone.', 'sweet', 0),
   ('DALIA', "Okay. I'll start right now.", 'sweet', 0.6)],
  shots=[('aminaCu', 0), ('daliaMed', 'L1-0.2'), ('finalPull', 'L1+0.7')], cards=[('recap', 0.3, 'E')], pops=[]),
]
