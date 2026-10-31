# THE QUALITY GATE for dialogue and reactions, for EVERY format. Catches corny, stiff or mismatched lines BEFORE anything is rendered.
#   python3 tools/lint_dialogue.py <file> [--format reaction|skit|story|talk|podcast|explainer] [--clip clip.mp4]
# <file> can be: a reaction script.json, a video's plan.py (scenes with lines), or a podcast script (pod/eps/eN.py).
# ERRORS must be fixed (rendering is blocked). WARNINGS must be looked at and either fixed or accepted on purpose.
# It checks the WORDS and the logic of reactions (rules below). It cannot judge whether something is funny: Dalia (and the fit sheet) do that.
import sys, os, re, json, importlib.util, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)

EMOTIONS = {'neutral', 'happy', 'excited', 'sweet', 'laugh', 'deadpan', 'stern', 'tired', 'sad', 'worried', 'shock', 'smug', 'dramatic'}
BANNED = ['good point', 'great point', 'i love that', "that is so true", "that's so true", 'so true', 'wow, amazing', 'amazing!', 'interesting!', "that's interesting", 'that is interesting',
          'great question', "let's dive", 'dive in', 'you guys', 'folks', 'game changer', 'game-changer', 'at the end of the day', "in today's video", 'smash that', 'hit that like', 'welcome back',
          'stay tuned', 'buckle up', 'without further ado', 'it goes without saying', 'needless to say', 'i could not agree more', "i couldn't agree more", 'absolutely love']
SIGNOFF_OK = ['thanks for watching', 'like and subscribe', 'subscribe']      # allowed only in the podcast format
FORMAL = ['furthermore', 'moreover', 'in conclusion', 'it is important to', 'it is worth noting', 'one must', 'shall we', 'thus,', 'hence,', 'in addition,']
UNCONTRACTED = re.compile(r"\b(do not|does not|did not|can not|cannot|is not|are not|was not|were not|will not|would not|should not|have not|has not|I am|you are|we are|they are|it is|that is|there is|what is|let us)\b", re.I)
CONTRACTED = re.compile(r"\b\w+'(s|re|ve|ll|d|m|t)\b", re.I)
MAXW = {'reaction': 14, 'skit': 16, 'story': 18, 'talk': 28, 'explainer': 34, 'podcast': 40, 'default': 22}
HUMANS = {'DALIA', 'AMINA', 'MARCUS', 'LILY', 'SOFIA', 'GRANDPA', 'KID_BOY', 'KID_GIRL', 'NARRATOR', 'MARA', 'THEO', 'PRIYA', 'JUNE', 'KAI', 'GUS', 'ZOE', 'FINN', 'HANA', 'NINA'}
# word lists (same idea as formats/reaction/analyze_clip.py)
SAD = ['sad', 'cry', 'crying', 'cried', 'hurt', 'lonely', 'lost my', 'heartbroken', 'struggling', 'afraid', 'exhausted', 'tears', 'died', 'passed away', 'funeral', 'grief', 'sorry for your loss', 'sick', 'cancer', 'scared']
FUNNY = ['haha', 'lol', 'funny', 'joke', 'hilarious', 'giggle', 'cracking up', 'dying', 'ridiculous', 'silly']
SHOCK = ['whoa', 'wow', 'oh my god', 'oh my gosh', 'omg', 'what the', 'are you kidding', 'no way', 'unbelievable', 'cannot believe', "can't believe", 'shocked', 'arrested', 'screaming']
ABSURD = ['never', 'crazy', 'insane', 'ridiculous', 'worst', 'kicked', 'fired', 'stupid', 'wrong', 'nonsense', 'scam', 'terrible', 'awful', 'impossible', 'seriously', 'excuse', 'makes no sense', 'lied', 'lying', 'liar', 'cheat', 'rude', 'disrespect']
AGREE = ['exactly', "that's right", 'you are right', "you're right", 'true', 'correct', 'i agree', 'makes sense', 'of course', 'obviously', 'absolutely', 'definitely', "that's why", 'facts']
has = lambda t, ws: any(w in t for w in ws)
words = lambda t: re.findall(r"[a-z']+", t.lower())
def shingles(ws, n): return {' '.join(ws[i:i + n]) for i in range(len(ws) - n + 1)}

def lint_lines(rows, fmt='default', clip_sentences=None):
    """rows: [{who, text, emo}] in order. Returns (errors, warnings), each a list of strings."""
    E, W = [], []
    limit = MAXW.get(fmt, MAXW['default']); human_rows = [r for r in rows if r.get('who', '').upper() in HUMANS]
    unc = sum(len(UNCONTRACTED.findall(r['text'])) for r in human_rows); con = sum(len(CONTRACTED.findall(r['text'])) for r in human_rows)
    prev = None; same_start = 0; excl = 0
    for i, r in enumerate(rows):
        t = r['text']; low = t.lower(); who = r.get('who', '?'); tag = f'line {i + 1} ({who}): "{t[:60]}"'; w = words(t)
        for b in BANNED:
            if b in low: E.append(f'{tag} corny phrase "{b}". Say something specific instead.')
        if fmt != 'podcast':
            for b in SIGNOFF_OK:
                if b in low: E.append(f'{tag} sign-off phrase "{b}" is only for the podcast format.')
        for f in FORMAL:
            if f in low: E.append(f'{tag} stiff, formal wording "{f}". Talk like a person.')
        if re.search(r'!{2,}', t) or t.count('!') > 1: W.append(f'{tag} too much shouting (!). One at most, and only if she would really shout.')
        if len(w) > limit: E.append(f'{tag} {len(w)} words; the limit for {fmt} is {limit}. Cut it down.')
        elif len(w) > limit * 0.8: W.append(f'{tag} {len(w)} words, close to the limit ({limit}).')
        if r.get('emo') and r['emo'] not in EMOTIONS: E.append(f'{tag} unknown emotion "{r["emo"]}". Use: {", ".join(sorted(EMOTIONS))}.')
        emo = r.get('emo', 'neutral')
        if has(low, SAD) and emo in ('happy', 'excited', 'laugh', 'smug', 'sweet'): W.append(f'{tag} sad words but a {emo} delivery. Does that fit?')
        if t.count('!') >= 2 and emo in ('tired', 'sad', 'deadpan'): W.append(f'{tag} shouting punctuation but a {emo} delivery.')
        if prev:                                           # echoing the previous line
            if len(shingles(words(prev), 4) & shingles(w, 4)) > 0: W.append(f'{tag} repeats words from the line before it. People answer, they do not echo.')
        if clip_sentences:                                 # echoing the clip (reaction videos): "so you're saying..."
            clipw = [x for s in clip_sentences for x in [words(s['text'])]]
            for cw in clipw:
                if len(shingles(cw, 4) & shingles(w, 4)) > 0: E.append(f'{tag} repeats the clip\'s own words. React to it, do not repeat it.'); break
                if len(shingles(cw, 3) & shingles(w, 3)) > 0: W.append(f'{tag} reuses three words from the clip. Fine if it is a deliberate riff, not if it is an echo.'); break
        if re.search(r"^(so you'?re saying|so what you'?re saying|so you are saying|so you'?re telling me)", low): E.append(f'{tag} "so you are saying..." echoes the other person like a quiz.')
        first = w[0] if w else ''; same_start = same_start + 1 if prev is not None and first and first == (words(prev)[:1] or [''])[0] else 0
        if same_start >= 2: W.append(f'{tag} three lines in a row start with "{first}". Vary it.')
        excl += t.count('!'); prev = t
    if len(rows) >= 6 and excl / len(rows) > 0.4: W.append(f'too many exclamation marks overall ({excl} in {len(rows)} lines). Real people are flatter.')
    if len(human_rows) >= 6 and unc + con > 0 and unc / (unc + con) > 0.6: W.append('the human lines mostly avoid contractions ("I am", "do not"). People say "I\'m", "don\'t". Sounds stiff.')
    lens = [len(words(r['text'])) for r in rows]
    for i in range(len(lens) - 3):
        if max(lens[i:i + 4]) - min(lens[i:i + 4]) <= 1 and lens[i] > 3: W.append(f'lines {i + 1} to {i + 4} are all about the same length. Mix short and long.'); break
    return E, W

def sentence_at(sents, t):
    for s in sents:
        if s['start'] - 0.2 <= t <= s['end'] + 0.35: return s
    return None

def lint_reaction(S, clip_sentences, clip_dur):
    E, W = [], []
    rows = [dict(who=S.get('voice_who', S.get('reactor', 'dalia')).upper(), text=re.sub(r'\*', '', b['say']), emo=b.get('emo', 'neutral')) for b in S.get('beats', []) if b.get('say')]
    e, w = lint_lines(rows, 'reaction', clip_sentences); E += e; W += w
    spoken = len(rows)
    if clip_dur and spoken and clip_dur / spoken < 6: E.append(f'{spoken} spoken lines in {clip_dur:.0f}s of clip. Say less: about one line per 8 to 10 seconds.')
    elif clip_dur and spoken and clip_dur / spoken < 8: W.append(f'{spoken} spoken lines in {clip_dur:.0f}s of clip. That is a lot of talking.')
    if not S.get('cues'): W.append('no "cues": reactions will be guessed from keywords. Read the transcript and write cues by meaning (formats/reaction/REACTOR_VOICE.md).')
    kinds = [c['kind'] for c in S.get('cues', [])]
    for a, b in zip(kinds, kinds[1:]):
        if a == b and a != 'glance': W.append(f'two "{a}" cues in a row. Vary the reactions.')
    if clip_sentences:
        for b in S.get('beats', []):                      # does the reactor interrupt mid sentence?
            if not b.get('say'): continue
            last = max(s['end'] for s in clip_sentences)
            if b['at'] < last - 0.3 and not any(abs(s['end'] - b['at']) < 0.6 for s in clip_sentences) and S.get('mode', 'pause') == 'pause':
                W.append(f'beat at {b["at"]}s: not at the end of a sentence in the clip. A person would let them finish.')
        for c in S.get('cues', []):                       # does each cue FIT what is being said?
            s = sentence_at(clip_sentences, c['at']); tag = f'cue at {c["at"]}s ({c["kind"]}{":" + c["face"] if c.get("face") else ""})'
            if not s: W.append(f'{tag}: nothing is being said at that moment.'); continue
            low = s['text'].lower(); sad = has(low, SAD)
            face = c.get('face', '')
            if sad and (c['kind'] in ('laugh', 'hop') or face in ('smirk', 'smug', 'laugh', 'giggle', 'happy', 'excited', 'tongue out', 'wink', 'flirty')): E.append(f'{tag}: the clip says "{s["text"][:50]}" which is sad or serious. No jokes or smiles there. Use sympathy or stay still.')
            if c['kind'] == 'laugh' and not has(low, FUNNY): W.append(f'{tag}: nothing funny in "{s["text"][:50]}". Laugh only at something funny (or at herself).')
            if c['kind'] == 'gasp' and not (has(low, SHOCK) or '!' in s['text']): W.append(f'{tag}: "{s["text"][:50]}" is not a real surprise.')
            if c['kind'] == 'shake' and not has(low, ABSURD): W.append(f'{tag}: nothing wrong or absurd in "{s["text"][:50]}". Head shake means "no, that is wrong".')
            if c['kind'] == 'sympathy' and not sad: W.append(f'{tag}: "{s["text"][:50]}" is not sad.')
            if c['kind'] == 'nod' and s['text'].strip().endswith('?'): W.append(f'{tag}: nodding at a question. Tilt the head instead.')
            if c['kind'] == 'glance' and face in ('eye roll', 'side eye', 'skeptical') and has(low, AGREE) and not has(low, ABSURD): W.append(f'{tag}: a doubtful look while the clip says something true ("{s["text"][:40]}"). Intended?')
    return E, W

def load_rows(path):
    """Returns (kind, payload). kind: 'reaction' (script json) or 'rows' (list of dialogue rows) with format guess."""
    if path.endswith('.json'):
        S = json.load(open(path))
        if 'beats' in S or 'cues' in S or 'source' in S: return 'reaction', S
        if isinstance(S, list): return 'rows', S
    spec = importlib.util.spec_from_file_location('scriptmod', path); m = importlib.util.module_from_spec(spec)
    sys.path.insert(0, os.path.dirname(path)); spec.loader.exec_module(m)
    if hasattr(m, 'SCENES'): return 'rows', [dict(who=l[0], text=l[1], emo=l[2] if len(l) > 2 else 'neutral') for s in m.SCENES for l in s['lines']]
    if hasattr(m, 'L'): return 'rows', [dict(who=l[0], text=l[1], emo=l[2] if len(l) > 2 else 'neutral') for l in m.L]
    raise SystemExit(f'do not know how to read {path}')

def clip_sentences_for(src):
    py = os.environ.get('CHATTERBOX_PY') or sys.executable
    env = {k: v for k, v in os.environ.items() if k not in ('PYTHONPATH', 'PYTHONHOME')}
    try:
        r = subprocess.run([py, ROOT + '/formats/reaction/analyze_clip.py', src, '--sentences'], capture_output=True, text=True, env=env)
        return json.loads(r.stdout.strip().splitlines()[-1])
    except Exception: return None

def report(E, W, name=''):
    for e in E: print('ERROR  ', e)
    for w in W: print('WARNING', w)
    print(f'{name}: {len(E)} error(s), {len(W)} warning(s)' + ('  -> fix the errors before rendering.' if E else '  -> OK to render (look at the warnings).'))

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]; fmt = 'default'
    if '--format' in sys.argv: fmt = sys.argv[sys.argv.index('--format') + 1]; args = [a for a in args if a != fmt]
    path = args[0]; kind, data = load_rows(path)
    if kind == 'reaction':
        base = os.path.dirname(os.path.abspath(path)); src = data['source'] if os.path.isabs(data['source']) else os.path.join(base, data['source'])
        sents = clip_sentences_for(src); dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src]).decode().split()[0])
        if sents is None: print('note: no speech recognition available, cue-fit checks skipped')
        E, W = lint_reaction(data, sents, (data.get('end') or dur) - data.get('start', 0))
    else:
        E, W = lint_lines(data, fmt)
    report(E, W, os.path.basename(path)); sys.exit(1 if E else 0)
