# MICA AT WORK, EP 2: THE MESSY LIST (idea from a real work day: a to-do list partner chat, a clarifying question, labels + page code)
TOTAL = 56.5
SCENES = [
 dict(id='mess', pre=1.2, post=0.4, lines=[
   ('DALIA', 'Forty-six tasks on my list. And my brain is soup.', 'worried', 0),
   ('DALIA', 'Where do I even start?', 'tired', 0.35)],
  shots=[('messDolly', 0), ('messClose', 'L0+1.2'), ('messZoom', 'L1')]),
 dict(id='dump', pre=1.0, post=0.4, lines=[
   ('MICA', 'Tip one. Dump the whole messy list on me.', 'excited', 0),
   ('DALIA', 'Even the half-written ones?', 'sweet', 0.3),
   ('MICA', 'Especially those. Watch.', 'smug', 0.3)],
  shots=[('dumpLow', 0), ('dumpClose', 'L1'), ('dumpScreen', 'L2')]),
 dict(id='ask', pre=0.6, post=0.4, lines=[
   ('MICA', 'Tip two. Let the AI ask questions before it guesses.', 'happy', 0),
   ('MICA', 'Task forty-six says, fix the listing. Which listing?', 'worried', 0.4),
   ('DALIA', 'Oh! The hydrangea notepad. Thanks for asking!', 'happy', 0.5)],
  shots=[('askOrbit', 0), ('askScreen', 'L1'), ('askClose', 'L2')]),
 dict(id='do', pre=0.6, post=0.4, lines=[
   ('DALIA', 'Now do the boring part. Color labels for the template.', 'excited', 0),
   ('MICA', 'Twelve labels. Done. Want the sticky photo code too?', 'smug', 0.4),
   ('DALIA', 'Yes please!', 'happy', 0.4)],
  shots=[('doDolly', 0), ('doScreen', 'L1'), ('doDz', 'L2')]),
 dict(id='check', pre=0.6, post=0.4, lines=[
   ('MICA', "Tip three. Always check my work. You're the boss.", 'stern', 0),
   ('DALIA', 'Found one typo. Fixed it!', 'smug', 0.4),
   ('MICA', "That's the team. You and me.", 'sweet', 0.4)],
  shots=[('checkLow', 0), ('checkScreen', 'L1'), ('checkClose', 'L2')]),
 dict(id='end', pre=0.5, post=1.6, lines=[
   ('DALIA', "AI doesn't replace my list. It helps me finish it.", 'happy', 0),
   ('DALIA', 'Which task would you hand off first? Tell me below!', 'excited', 0.4)],
  shots=[('endOrbit', 0), ('endPull', 'L1')]),
]
