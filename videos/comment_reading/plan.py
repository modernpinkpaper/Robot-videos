# READING THE COMMENTS. Dalia (emotional robots) reads 10 TikTok comments and reacts. One scene, cards on screen.
# card = which comment card is on screen. face = one or two face names (two = changes halfway through the line). cap = show captions (reaction lines).
TOTAL = 90.0
CARDS = [
 dict(likes='5.4K', text="promoted a 19 year old fresh out of high school no experience over people that had been there for 3 years with 4 year degrees we all bounced"),
 dict(likes='428', text="She stole our tips and was routinely rude and mean to us. I just gave a one day notice and left. They didn’t even deserve two weeks lol"),
 dict(likes='231', text="My store director told me he f*cking hated me😇"),
 dict(likes='172', text="walked out the other day beavuse i’m 15 weeks pregnant and he wants me to put myself in the middle of pitbull fights"),
 dict(likes='280', text="I didn’t quit, I got fired for feeding the homeless. They made me work my shift and waited for me to finish then fired me. Honestly, I was hurt but thankful I was able to help those who were in need and I’ll continue to do it"),
 dict(likes='947', text="I walked because they praised the bully"),
 dict(likes='8.7K', text="Told me to “ get under his desk and make myself useful “. Quit on the spot"),
 dict(likes='166', text="Got sexually harassed by a asst manager, told the manager, and on the spot she said “we don’t want you to feel uncomfortable at work, so we’re going to let you go”"),
 dict(likes='8.5K', text="my husband died in a severely traumatic way… I was out of work for 2 weeks after… i got lectured about giving the team second hand trauma and i was the reason the team was in shambles - in front of everyone."),
 dict(likes='7.1K', text="My co-worker put BLEACH in my water and laughed while I drank it because I turned him down and the owner defended him"),
]
# (card, text, emo, gap, face, cap)
L = [
 (0, "Promoted a nineteen year old, no experience, over people with four year degrees.", 'deadpan', 0, ['skeptical'], 0),
 (0, "And everyone acts shocked when the whole team quits.", 'stern', 0.3, ['eye roll', 'unimpressed'], 1),
 (1, "Their boss stole the tips. So they left with one day's notice.", 'stern', 0.55, ['disgusted'], 0),
 (1, "Stealing tips from people who already work for tips. Wow.", 'stern', 0.3, ['unimpressed', 'disgusted'], 1),
 (2, "My store director told me he hated me. Little smiley face.", 'deadpan', 0.55, ['deadpan', 'side eye'], 0),
 (2, "No warning. No speech. Just that.", 'deadpan', 0.35, ['side eye', 'smirk'], 1),
 (3, "Fifteen weeks pregnant, and he wanted her in the middle of pitbull fights.", 'shock', 0.55, ['shocked'], 0),
 (3, "Absolutely not. I'd have walked too.", 'stern', 0.3, ['angry'], 1),
 (4, "This person got fired. For feeding the homeless.", 'shock', 0.55, ['hurt', 'shocked'], 0),
 (4, "They made them finish the whole shift first, then fired them.", 'stern', 0.3, ['angry'], 0),
 (4, "And they'd still do it again. That's who I want next to me.", 'sweet', 0.4, ['hurt', 'proud'], 1),
 (5, "Next one. I walked because they praised the bully.", 'deadpan', 0.55, ['neutral', 'unimpressed'], 0),
 (5, "Yup. Not the pay. Watching the bully win.", 'stern', 0.3, ['unimpressed'], 1),
 (6, "The top one, eight thousand likes. Told me to get under his desk and make myself useful.", 'worried', 0.55, ['disgusted'], 0),
 (6, "I'd have quit before he finished that sentence.", 'stern', 0.35, ['angry', 'furious'], 1),
 (7, "Harassed by an assistant manager. Told the manager.", 'stern', 0.55, ['worried'], 0),
 (7, "And she said, we don't want you to feel uncomfortable, so we're going to let you go.", 'shock', 0.3, ['shocked'], 0),
 (7, "The person who reported it is the one who leaves?", 'stern', 0.4, ['confused', 'angry'], 1),
 (8, "Their husband died. They took two weeks off.", 'sad', 0.6, ['sad'], 0),
 (8, "Then HR lectured them about giving the team second hand trauma.", 'shock', 0.3, ['hurt', 'shocked'], 0),
 (8, "That's not a work problem. That's just cruel.", 'sad', 0.5, ['hurt', 'angry'], 1),
 (9, "Last one. My co-worker put bleach in my water and laughed while I drank it.", 'shock', 0.6, ['shocked'], 0),
 (9, "Because they turned him down. And the owner took his side.", 'stern', 0.3, ['angry'], 0),
 (9, "That's not drama. That's a crime. I'm done.", 'stern', 0.45, ['furious', 'speechless'], 1),
]
SCENES = [dict(id='read', pre=0.35, post=2.2, lines=[(l[0] and 'DALIA' or 'DALIA', l[1], l[2], l[3]) for l in L])]
