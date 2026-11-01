# THE BEST THING YOU CAN DO FOR YOUR BRAIN. One character (Finn) talks to camera, with a friendly brain character for cutaways.
# Idea from Dr. Wendy Suzuki's TED talk on how exercise changes the brain. The script is our own words.
# Emotional robots style (characters/expressive). Emotions are face names from EXPR (faces.js). Shots cut on lines (same syntax as no_lies/plan.py).
TOTAL = 40.5
SCENES = [
 dict(id='talk', pre=1.5, post=2.2, lines=[
   ('FINN', "Want to know the best thing you can do for your brain today?", 'excited', 0),
   ('FINN', "It's not a puzzle. It's not coffee. It's moving your body.", 'smug', 0.35),
   ('FINN', "Number one. It works right away.", 'happy', 0.55),
   ('FINN', "One workout gives your brain a boost of feel-good chemicals, like dopamine and serotonin.", 'excited', 0.3),
   ('FINN', "You focus better, and your reactions get quicker.", 'big smile', 0.3),
   ('FINN', "And the boost can last for hours.", 'proud', 0.3),
   ('FINN', "Number two. It builds your brain over time.", 'happy', 0.6),
   ('FINN', "Your memory center is called the hippocampus. Regular exercise can make it bigger.", 'excited', 0.3),
   ('FINN', "That helps you learn, remember, and protect your brain as you get older.", 'happy', 0.3),
   ('FINN', "So think of your brain like a muscle.", 'smug', 0.55),
   ('FINN', "The more you move, the stronger it gets.", 'big smile', 0.3),
   ('FINN', "Go for a walk today. Your brain will thank you.", 'proud', 0.5),
   ('FINN', "What's your favorite way to move?", 'wink', 0.5)],
  shots=[('dollyWide', 0), ('close1', 'L0+1.6'), ('low', 'L1'), ('push', 'L2'), ('brainClose', 'L3'), ('close2', 'L4+0.2'), ('zoom', 'L5'),
         ('push2', 'L6'), ('brainOrbit', 'L7'), ('dollySide', 'L8'), ('brainFlex', 'L9'), ('low2', 'L10+0.4'), ('pull', 'L11'), ('close3', 'L12-0.2')]),
]
