# Makes the voices (voices/speak.py: Chatterbox for these two), the timeline (work/timeline.json) and the audio (work/audio.wav).
#   python3 build_audio.py            voices + timeline + audio      |   --notts: reuse the voice files already in work/
# NO MUSIC on purpose (Quran lesson): only the voices, very soft whooshes between scenes, and a quiet room / outdoor air.
import sys, os, re, wave, json, subprocess, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, ROOT + '/voices'); sys.path.insert(0, HERE)
from human_tts import trim_main_utterance, add_room
from plan import SCENES
WORK = HERE + '/work'; os.makedirs(WORK, exist_ok=True); SR = 44100
flat = [(si, li, l) for si, s in enumerate(SCENES) for li, l in enumerate(s['lines'])]
# A spoken line may contain Arabic words written as {ar:...} (with vowel marks). Those are spoken in Arabic by the SAME character voice
# (voices/human_tts.py, lang "ar", several tries, best one kept by speech recognition); the English parts are spoken as before; then they are joined.
AR = re.compile(r'\{ar:([^}]*)\}')
def segments(say):
    out = []; pos = 0
    for m in AR.finditer(say):
        pre = say[pos:m.start()].strip(' ,.:;?!')
        if pre: out.append(('en', pre + ('.' if not re.search(r'[:?]$', pre) else '')))
        out.append(('ar', m.group(1).strip())); pos = m.end()
    post = say[pos:].strip(' ,.:;')
    if post: out.append(('en', post))
    return out
def read_wav(p):
    w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
if '--notts' not in sys.argv:
    from speak import synth_lines
    os.environ.setdefault('VIDEO_FORMAT', 'story'); os.environ['SKIP_LINT'] = '1'   # the whole lines were checked with tools/lint_dialogue.py plan.py (pieces of a line would give false alarms)
    rows = []; joins = []
    for i, (si, li, l) in enumerate(flat):
        fin = f'{WORK}/l{i:02d}.wav'
        if os.path.exists(fin) and '--redo' not in sys.argv: continue
        say = l[4] if len(l) > 4 else l[1]
        if AR.search(say):
            segs = segments(say); parts = []
            for k, (lang, t) in enumerate(segs):
                o = f'{WORK}/s{i:02d}_{k}.wav'; parts.append(o)
                rows.append(dict(who=l[0], text=t, emo=l[2], out=o, **(dict(lang='ar', verify=t, tries=int(os.environ.get('AR_TRIES', '4'))) if lang == 'ar' else {})))
            joins.append((fin, parts, [lang for lang, _ in segs]))
        else: rows.append(dict(who=l[0], text=say, emo=l[2], out=fin))
    if rows: synth_lines(rows)
    if True:   # ALWAYS rebuild the joined lines from the pieces (cheap): the Arabic babble is trimmed here and room sound is added for Dalia exactly once
        joins = []
        for i, (si, li, l) in enumerate(flat):
            say = l[4] if len(l) > 4 else l[1]
            if AR.search(say):
                segs = segments(say); parts = [f'{WORK}/s{i:02d}_{k}.wav' for k in range(len(segs))]
                if all(os.path.exists(p) for p in parts): joins.append((f'{WORK}/l{i:02d}.wav', parts, [lang for lang, _ in segs]))
    AR_TEMPO = float(os.environ.get('AR_TEMPO', '1.3'))   # the Arabic words come out slowly; at 1.3x they stay just as clear (checked with speech recognition) and sound like normal speech
    for fin, parts, langs in joins:   # join the English and Arabic pieces of one line (a short natural pause around the Arabic)
        sil = lambda sec: (np.random.default_rng(3).standard_normal(int(sec * SR)) * 10 ** (-58 / 20)).astype(np.float32); chunks = []   # a gap is quiet room sound, never digital silence
        for k, (p, lang) in enumerate(zip(parts, langs)):
            if lang == 'ar':
                x = trim_main_utterance(read_wav(p), SR)   # keep the word, cut the faint babble the Arabic voice makes after it
                tmp = p.replace('.wav', '_fast.wav')
                with wave.open(tmp.replace('_fast', '_trim'), 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
                add_room(tmp.replace('_fast', '_trim'), 0.13)   # the cut removed the word's natural tail: put a soft room decay back
                if AR_TEMPO != 1.0: subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp.replace('_fast', '_trim'), '-af', f'atempo={AR_TEMPO}', '-ar', str(SR), '-ac', '1', tmp], check=True); x = read_wav(tmp)
                else: x = read_wav(tmp.replace('_fast', '_trim'))
            else: x = read_wav(p)
            idx = np.where(np.abs(x) > 0.01)[0]; x = x[max(0, idx[0] - int(0.05 * SR)):] if len(idx) else x   # trim only the start; English pieces keep their natural decay (cutting it sounds like a hard stop)
            if k:   # the end of each piece already decays naturally, so only a tiny gap (a bit more around Arabic words), and a short crossfade so nothing clicks
                gap = int((0.14 if 'ar' in (lang, langs[k - 1]) else 0.06) * SR); chunks.append(sil(gap / SR))
            fade = int(0.012 * SR); x = x.copy(); x[:fade] *= np.linspace(0, 1, fade); chunks.append(x)
        y = np.concatenate(chunks); y = y / max(1.0, np.abs(y).max() / 0.95)
        with wave.open(fin, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype('<i2').tobytes())
ROOM_FOR = {'DALIA': 0.10}   # Dalia's lines have pure digital silence between sentences (only Amina's style added room sound). Fill it with the same soft room, once.
os.makedirs(WORK + '/raw', exist_ok=True)
for i, (si, li, l) in enumerate(flat):
    say = l[4] if len(l) > 4 else l[1]; wet = ROOM_FOR.get(l[0])   # Dalia's lines (her pieces carry no room sound); Amina's pieces already have it
    if not wet: continue
    fin = f'{WORK}/l{i:02d}.wav'
    if not AR.search(say):
        raw = f'{WORK}/raw/l{i:02d}.wav'
        if not os.path.exists(raw): import shutil; shutil.copy(fin, raw)
        import shutil; shutil.copy(raw, fin)
    add_room(fin, wet)
def load(i):
    w = wave.open(f'{WORK}/l{i:02d}.wav'); return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
# ---- timeline
cursor = 0.0; lines = []; clips = []; scenes = []; k = 0
for si, s in enumerate(SCENES):
    st = cursor; cur = st + s['pre']; sl = []
    for li, l in enumerate(s['lines']):
        who, text, emo, gap = l[:4]
        x = load(k); idx = np.where(np.abs(x) > 0.02)[0]
        cut = max(0, idx[0] - int(0.06 * SR)); x = x[cut:]; idx = idx - cut   # leading silence trimmed to 60 ms (a long lead made the first line start before time 0)
        lead = idx[0] / SR; tail = idx[-1] / SR
        onset = cur + gap; start = onset - lead; v1 = start + tail
        hop = SR // 48; n = len(x) // hop
        env = np.array([np.sqrt((x[j*hop:(j+1)*hop] ** 2).mean()) for j in range(n)])
        ref = np.percentile(env[env > 0.01], 90) if (env > 0.01).any() else 1
        env = np.clip(env / ref, 0, 1); env = np.convolve(env, [0.25, 0.5, 0.25], 'same')
        d = dict(i=k, scene=si, li=li, who=who, text=text, emo=emo, start=round(start, 3), v0=round(onset, 3), v1=round(v1, 3), env=[round(float(e), 2) for e in env])
        lines.append(d); sl.append(d); clips.append((start, x)); cur = v1; k += 1
    end = cur + s['post']
    scenes.append(dict(id=s['id'], set=s['set'], vo=bool(s.get('vo')), start=round(st, 3), end=round(end, 3), lines=[d['i'] for d in sl])); cursor = end
TOTAL = round(cursor, 2)
def at(spec, sc, sl):
    if spec == 'E': return sc['end']
    m = re.match(r'^(L|E)(\d*)([+-][\d.]+)?$', str(spec)) if isinstance(spec, str) else None
    if not m: return sc['start'] + float(spec)
    off = float(m.group(3) or 0)
    if m.group(1) == 'L': return sl[int(m.group(2))]['v0'] - 0.12 + off + (0.12 if off else 0)
    return sc['end'] + off
for s, sc in zip(SCENES, scenes):
    sl = [lines[i] for i in sc['lines']]
    sc['shots'] = [dict(name=n, t=round(at(a, sc, sl), 3)) for n, a in s['shots']]
    sc['cards'] = [dict(id=c, t0=round(at(a, sc, sl), 3), t1=round(at(b, sc, sl), 3)) for c, a, b in s.get('cards', [])]
    sc['pops'] = [dict(e=e, x=x, y=y, t0=round(at(a, sc, sl), 3), t1=round(at(b, sc, sl), 3)) for e, x, y, a, b in s.get('pops', [])]
    sc['phones'] = [dict(id=p, t0=round(at(a, sc, sl), 3), t1=round(at(b, sc, sl), 3)) for p, a, b in s.get('phones', [])]
json.dump(dict(scenes=scenes, lines=lines, total=TOTAL), open(WORK + '/timeline.json', 'w'))
for sc in scenes: print(f"{sc['id']:6s} {sc['start']:6.2f} - {sc['end']:6.2f}  shots " + ' '.join(f"{x['name']}@{x['t']:.1f}" for x in sc['shots']))
print('TOTAL %.2f s' % TOTAL)
# ---- audio
N = int(TOTAL * SR); t = np.arange(N) / SR; voices = np.zeros(N, dtype=np.float32)
for start, x in clips:
    a = int(start * SR); b = min(N, a + len(x)); voices[a:b] += x[:b-a] * 0.95
sfx = np.zeros(N)
def put(buf, a, s):
    if a >= N: return
    b = min(N, a + len(s)); buf[a:b] += s[:b-a]
def whoosh(ts, d=0.4, g=0.14):
    n = int(d * SR); r = np.random.default_rng(int(ts * 100)).standard_normal(n); u = np.arange(n) / n
    sm = np.convolve(r, np.ones(30) / 30, 'same') - np.convolve(r, np.ones(300) / 300, 'same')
    put(sfx, max(0, int(ts * SR)), sm * np.sin(np.pi * u) ** 2 * g * 3)
for sc in scenes[1:]: whoosh(sc['start'] - 0.2, 0.4, 0.04)
for sc in scenes:
    for sh in sc['shots'][1:]: whoosh(sh['t'] - 0.06, 0.14, 0.025)
# quiet air: soft filtered noise (room tone), a little brighter outdoors (park scene)
r = np.random.default_rng(3).standard_normal(N)
air = np.convolve(r, np.ones(400) / 400, 'same') * 0.018
for park in [s for s in scenes if s['set'] == 'park'][:1]:   # a bit brighter air outdoors, only if the video has a park scene
    air *= 1 + 0.9 * np.clip(1 - np.abs(t - (park['start'] + park['end']) / 2) / ((park['end'] - park['start']) / 2 + 0.3), 0, 1)
air *= np.clip(np.minimum(t / 1.0, (TOTAL - t) / 1.5), 0, 1)
mix = voices + sfx + air
mix *= np.clip(np.minimum(t / 0.2, (TOTAL - t) / 1.2), 0, 1); mix = np.tanh(mix * 0.9); mix = mix / np.abs(mix).max() * 0.9
with wave.open(WORK + '/audio.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('audio ok')
