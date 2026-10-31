# THE 1-MINUTE MACHINE. A story: Dalia does 19 product photos by hand, Mica teaches "do it 3 times, build a tool", they build a photo machine.
# Idea from a real day (19 mockups saved in one minute). Shots cut on lines, same syntax as videos/no_lies/plan.py.
TOTAL = 44.0
SCENES = [
 dict(id='hand', pre=1.2, post=0.4, lines=[
   ('DALIA', 'Nineteen envelope colors. One photo each. By hand.', 'tired', 0),
   ('DALIA', "That's my whole afternoon.", 'worried', 0.35)],
  shots=[('handDolly', 0), ('handClose', 'L0+1.0'), ('handPile', 'L1')]),
 dict(id='idea', pre=1.6, post=0.4, lines=[
   ('MICA', 'Dalia! Quick rule. Do it once, fine. Twice, annoying. Three times? Build a tool.', 'excited', 0),
   ('DALIA', 'A tool? Okay. Show me.', 'sweet', 0.35)],
  shots=[('ideaPan', 0), ('ideaLow', 'L0'), ('ideaClose', 'L1')]),
 dict(id='build', pre=0.6, post=0.4, lines=[
   ('MICA', 'Step one. Write down the boring steps.', 'happy', 0),
   ('MICA', 'Step two. Teach a computer to do them.', 'happy', 0.5)],
  shots=[('buildOrbit', 0), ('buildClose', 'L0+1.0'), ('buildPush', 'L1'), ('buildDolly', 'L1+1.9')]),
 dict(id='run', pre=0.5, post=0.5, lines=[
   ('MICA', 'Step three. Press the button.', 'smug', 0),
   ('DALIA', 'Nineteen photos. One minute?!', 'shock', 3.4),
   ('MICA', 'One minute.', 'smug', 0.4)],
  shots=[('runBtn', 0), ('runDolly', 'L0+1.7'), ('runCounter', 'L1-1.2'), ('runDz', 'L1'), ('runClose', 'L2')]),
 dict(id='end', pre=0.5, post=1.6, lines=[
   ('DALIA', 'I just got my afternoon back.', 'happy', 0),
   ('MICA', 'Now go do the fun part.', 'sweet', 0.35),
   ('DALIA', 'What do you do over and over? Tell me below!', 'excited', 0.4)],
  shots=[('endLow', 0), ('endOrbit', 'L1'), ('endPull', 'L2')]),
]
