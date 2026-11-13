# MICA AT WORK, EP 3: THE SECOND PAIR OF EYES (idea from a real work day: a preflight test log, a check-before-printing file, a return-address decision tree)
TOTAL = 46.5
SCENES = [
 dict(id='oops', pre=1.2, post=0.4, lines=[
   ('DALIA', 'Last month I printed five hundred cards with a typo.', 'worried', 0),
   ('DALIA', 'Never again.', 'stern', 0.35)],
  shots=[('oopsDolly', 0), ('oopsClose', 'L0+1.4'), ('oopsZoom', 'L1')]),
 dict(id='list', pre=1.0, post=0.4, lines=[
   ('MICA', 'Tip one. Write your checklist. Size, spelling, return address.', 'excited', 0),
   ('DALIA', 'I have a messy one in a spreadsheet.', 'sweet', 0.3),
   ('MICA', 'Perfect. Show me.', 'smug', 0.3)],
  shots=[('listLow', 0), ('listClose', 'L1'), ('listScreen', 'L2')]),
 dict(id='catch', pre=0.6, post=0.4, lines=[
   ('MICA', 'Tip two. Let me read it like a stranger would.', 'happy', 0),
   ('MICA', 'Found a typo. And the return address is missing.', 'worried', 0.5),
   ('DALIA', 'Phew! That would have cost me.', 'shock', 0.4)],
  shots=[('catchOrbit', 0), ('catchScreen', 'L1'), ('catchDz', 'L2')]),
 dict(id='rules', pre=0.6, post=0.4, lines=[
   ('MICA', 'Tip three. Teach me your rules.', 'stern', 0),
   ('DALIA', "If the box is damaged, we refund. If it's late, we check tracking.", 'happy', 0.4),
   ('MICA', "That's a decision tree. Now anyone can follow it.", 'smug', 0.4)],
  shots=[('rulesDolly', 0), ('rulesScreen', 'L1'), ('rulesClose', 'L2')]),
 dict(id='end', pre=0.5, post=1.6, lines=[
   ('DALIA', 'Now my team checks before they print, not after.', 'happy', 0),
   ('DALIA', "What's one mistake you'd catch early? Tell me below!", 'excited', 0.4)],
  shots=[('endOrbit', 0), ('endPull', 'L1')]),
]
