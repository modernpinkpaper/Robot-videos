# WHAT IF NOBODY LIED?  60 second story. Each scene: lines (who, text, emotion, gap-before), shots (camera name, start).
# shot start: number = seconds from scene start | 'L1' = when line 1 starts | 'L1+0.5' | 'E-1.0' = 1s before scene end
TOTAL = 60.0
SCENES = [
 dict(id='intro', pre=0.7, post=0.3, lines=[
   ('MICA', 'What if nobody could ever lie?', 'excited', 0),
   ('MICA', 'Welcome to Honest Town!', 'happy', 0.3)],
  shots=[('aerial', 0), ('micaWave', 'L1')]),
 dict(id='street', pre=1.6, post=0.5, lines=[
   ('CHARGEY', 'Good morning, Drafty! Your new hat looks silly.', 'happy', 0),
   ('DRAFTY', 'I know. I paid too much, and I hate it!', 'laugh', 0.3)],
  shots=[('track', 0), ('chargeyCu', 'L0'), ('hatZoom', 'L0+1.4'), ('draftyCu', 'L1'), ('streetEnd', 'E-1.0')]),
 dict(id='party', pre=1.5, post=0.4, lines=[
   ('HOOKY', 'I baked you a cake!', 'excited', 0),
   ('KRAFT', 'It tastes like a wet sock.', 'deadpan', 0.35),
   ('HOOKY', 'I know! But I tried so hard!', 'worried', 0.3),
   ('KRAFT', 'That part is lovely. Thank you!', 'laugh', 0.3)],
  shots=[('partyOrbit', 0), ('cakeZoom', 'L0'), ('kraftCu', 'L1'), ('hookyLow', 'L2'), ('partyWide', 'L3')]),
 dict(id='shop', pre=0.6, post=0.5, lines=[
   ('LISTER', 'This vacuum is awful. It breaks every week.', 'stern', 0),
   ('DYMO', 'Thank you for the truth! I will take two!', 'sweet', 0.3)],
  shots=[('shopDolly', 0), ('vacCu', 'L0+1.7'), ('dymoLow', 'L1'), ('shopWide', 'E-1.3')]),
 dict(id='call', pre=0.9, post=0.6, lines=[
   ('HOOKY', 'Where are you? You are late!', 'worried', 0),
   ('CHARGEY', "I'm still in bed. Sorry, I forgot.", 'tired', 0.3),
   ('HOOKY', "Thanks for being honest! I'll save you a slice.", 'happy', 0.3)],
  shots=[('splitCall', 0), ('splitCall2', 'L2')]),
 dict(id='vote', pre=0.5, post=1.2, lines=[
   ('LOGBOT', 'Vote for me! I will try to fix the roads. I might fail.', 'dramatic', 0),
   ('DRAFTY', 'Finally, a real answer!', 'excited', 0.3)],
  shots=[('podiumLow', 0), ('dollyZoom', 'L0+1.7'), ('crowdPan', 'L1'), ('cheerOrbit', 'L1+1.2')]),
 dict(id='bench', pre=0.8, post=0.6, lines=[
   ('MICA', "I'm sad today.", 'tired', 0),
   ('HOOKY', "Me too. Let's sit together.", 'sweet', 0.6)],
  shots=[('benchPush', 0), ('micaSad', 'L0-0.1'), ('benchTwo', 'L1'), ('benchCrane', 'E-1.3')]),
 dict(id='finale', pre=0.7, post=0.4, lines=[
   ('MICA', 'No lies means no fake smiles.', 'happy', 0),
   ('MICA', 'It can sting a little.', 'worried', 0.4),
   ('MICA', 'But every smile you see is real.', 'sweet', 0.4)],
  shots=[('nightPush', 0), ('nightMica', 'L1-0.2'), ('finalPull', 'L2+0.0')]),
]
