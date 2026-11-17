# PUZZLE WORDS: kindergarten blending lesson. SEQ is the whole lesson, in order. build_audio.py turns it into audio + timeline.
# items: ('say', text, emo)  Mica speaks | ('snd', phoneme) one single letter sound | ('blend', word) slow stretched word
#        ('wait', sec) silence | ('turn', sec, label) the child's turn (bubble + countdown) | ('ev', type, {...}) a visual event
WORDS = {  # word: (emoji picture or None, sentence or None)
 'lamp': ('lamp', 'I turn on the lamp.'), 'nest': ('🪺', 'The bird sits in the nest.'), 'milk': ('🥛', 'I drink my milk.'),
 'runs': ('🏃', None), 'list': ('📝', None), 'film': ('🎬', None), 'self': ('🪞', None), 'soft': ('🧸', None),
 'past': ('🚌', None), 'send': ('✉️', None), 'mist': ('🌫️', None), 'must': (None, None), 'lump': (None, None)}
SEQ = []
def say(t, emo='happy'): SEQ.append(('say', t, emo))
def ev(k, **kw): SEQ.append(('ev', k, kw))
def snd(i, reps=1): SEQ.append(('snd', i, reps))
def part(n): ev('part', n=n); SEQ.append(('partaudio', n)); wait(0.05)
def slow(w): ev('blend'); SEQ.append(('slow', w))
def wait(s): SEQ.append(('wait', s))
def turn(s, label='Say it!'): SEQ.append(('turn', s, label))
def scatter(w): pic, sen = WORDS[w]; ev('scatter', w=w, pic=pic)
# ---- hook + intro
ev('banner', text='Puzzle Words', icon='🧩'); ev('wave', d=2.2)
say("Hi, friend! I'm Mica.", 'happy')
say("Can you read a word that's all in pieces? Let's find out.", 'excited')
ev('steps', n=1); say("One. Snap the pieces.", 'happy')
ev('steps', n=2); say("Two. Say the sounds.", 'happy')
ev('steps', n=3); say("Three. Read the word!", 'excited')
ev('steps', n=0); say("First, watch me.", 'happy')

# ---- I do: lamp
w = 'lamp'
ev('banner', text='Watch me', icon='👀'); scatter(w)
say("Here are the pieces. They're all mixed up.", 'happy')
ev('snap', i=0); say("We start on the left. This piece says...", 'calm'); ev('sound', i=0); snd(0, 2)
ev('snap', i=1); say("Next.", 'calm'); ev('sound', i=1); snd(1, 2); part(2)
ev('snap', i=2); say("Next.", 'calm'); ev('sound', i=2); snd(2, 2); part(3)
ev('snap', i=3); say("Last one.", 'calm'); ev('sound', i=3); snd(3, 2)
say("Now we sound it out. Nice and slow.", 'happy'); slow(w); wait(0.25)
ev('reveal'); ev('cheer'); say("Lamp!", 'excited'); wait(0.2)
ev('sentence', text='I turn on the lamp.', hi='lamp'); say("I turn on the lamp.", 'happy'); wait(0.7); ev('exit')

# ---- we do: nest
w = 'nest'
ev('banner', text='Do it with me', icon='🙌'); scatter(w)
say("New word. Snap each piece, then say the sound with me.", 'happy')
for i in range(4):
    ev('snap', i=i); ev('sound', i=i); snd(i, 2); ev('turn', d=1.5, label='Say it!'); wait(1.5)
    if 0 < i < 3: part(i + 1)
say("Sound it out slowly. Say it with me.", 'happy'); slow(w); ev('turn', d=2.0, label='Say it!'); wait(2.0)
ev('reveal'); ev('cheer'); say("Nest!", 'excited'); wait(0.2)
ev('sentence', text='The bird sits in the nest.', hi='nest'); say("The bird sits in the nest.", 'happy'); wait(0.7); ev('exit')

# ---- you do: milk
w = 'milk'
ev('banner', text='Your turn!', icon='⭐'); scatter(w)
say("Now you try. I'll snap the pieces. You say the sounds first.", 'happy')
for i in range(4):
    ev('snap', i=i); ev('turn', d=1.9, label='What sound?'); wait(1.9); ev('sound', i=i); snd(i, 1); wait(0.1)
say("Now sound it out slowly. You go first.", 'happy'); ev('blend', quiet=1, d=3.4); ev('turn', d=3.4, label='Sound it out!'); wait(3.4)
slow(w); ev('turn', d=2.2, label='Read it!'); wait(2.2)
ev('reveal'); ev('cheer'); say("Milk!", 'excited'); wait(0.2)
ev('sentence', text='I drink my milk.', hi='milk'); say("I drink my milk.", 'happy'); wait(0.7); ev('exit')

# ---- word train
ev('banner', text='Word train!', icon='🚂'); ev('hide'); ev('trainstart')
say("Now let's go fast. Word train!", 'excited')
TRAIN = ['runs', 'list', 'film', 'self', 'soft', 'past', 'send', 'mist', 'must', 'lump']
for n, w in enumerate(TRAIN):
    if w == 'must': say("Swap the i for a u. New word!", 'excited')
    if w == 'lump': ev('banner', text='Boss word!', icon='👑'); say("Boss word. Ready?", 'excited')
    scatter(w); wait(0.3)
    for i in range(4):
        ev('snap', i=i); wait(0.1); ev('sound', i=i); snd(i, 1)
        if w == 'runs' and i == 3: say("Sometimes s says zzz.", 'calm')
    slow(w); ev('turn', d=1.5, label='Read it!'); wait(1.5)
    ev('reveal'); ev('cheer', small=1); say(w.capitalize() + '.', 'happy'); wait(0.6); ev('exit'); wait(0.1)
    if n == 3: say("You're on a roll!", 'happy')
    if n == 6: say("Three more.", 'happy')

# ---- wrap up
ev('banner', text='You did it!', icon='🎉'); ev('cheer')
say("You did it. You built ten words, and a boss word!", 'excited')
ev('steps', n=1); say("Snap the pieces.", 'happy')
ev('steps', n=2); say("Say the sounds.", 'happy')
ev('steps', n=3); say("Read the word.", 'happy')
ev('wave', d=3.0); say("Come back soon. New words are waiting!", 'happy'); wait(1.0)

# for tools/lint_dialogue.py
SCENES = [dict(id='lesson', pre=0, post=0, lines=[('MICA', s[1], s[2] if s[2] in ('happy', 'excited') else 'sweet', 0) for s in SEQ if s[0] == 'say'])]
TOTAL = 0
