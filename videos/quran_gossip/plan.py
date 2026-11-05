# QURAN LESSON 1: gossip (backbiting). Role play, then the explanation, then the ayah (49:12). Flat faceless hijabi style.
# Each scene: lines (who, text, emotion, gap-before-in-seconds), shots (camera name, start).
# shot start: number = seconds from scene start | 'L1' = when line 1 starts | 'L1+0.5' | 'E-1.0' = 1s before scene end
TOTAL = 0
SCENES = [
 dict(id='street', pre=0.8, post=0.5, lines=[
   ('LILY', "Okay, don't tell anyone, but she's been so annoying lately.", 'smug', 0),
   ('AMINA', "Who? She's not even here.", 'deadpan', 0.35),
   ('LILY', "Exactly. That's why I can say it.", 'smug', 0.3),
   ('AMINA', 'Would you say it to her face?', 'stern', 0.5),
   ('LILY', '...No.', 'tired', 0.7)],
  shots=[('wide', 0), ('lilyCu', 'L0+0.3'), ('aminaCu', 'L1'), ('two', 'L2'), ('aminaLow', 'L3'), ('lilyDown', 'L4-0.2')]),
 dict(id='ayah', pre=0.6, post=0.7, lines=[
   ('AMINA', "That's backbiting. Saying something about someone that she'd hate to hear. Even if it's true.", 'neutral', 0),
   ('AMINA', 'And Allah gave us a picture of it.', 'sweet', 0.4),
   ('AMINA', 'Would one of you like to eat the flesh of his brother when dead? You would detest it.', 'dramatic', 0.5)],
  shots=[('two2', 0), ('phoneIn', 'L1'), ('phoneRead', 'L2+0.2')]),
 dict(id='end', pre=0.6, post=2.8, lines=[
   ('LILY', "Okay. That's a lot.", 'shock', 0),
   ('AMINA', 'Next time, say something good about her. Or say nothing.', 'sweet', 0.5),
   ('LILY', "Okay. She's actually really kind.", 'sweet', 0.6)],
  shots=[('two3', 0), ('lilyCu2', 'L0'), ('aminaCu2', 'L1'), ('lilyHeart', 'L2'), ('card', 'E-2.6')]),
]
