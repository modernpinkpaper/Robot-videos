# Makes work/timeline.json (every event with its time) and work/audio.wav (voice + soft music + sound effects).
# Voice: Piper "amy" (the MICA voice), slowed for a child. Single letter sounds are made straight from phonemes (no "uh" added).
# Needs: pip install piper-tts numpy ; the voice file en_US-amy-medium.onnx (formats/podcast/setup.sh downloads it, or set PIPER_DIR).
import sys, os, json, wave, subprocess, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE)); sys.path.insert(0, HERE)
from piper import PiperVoice, SynthesisConfig
import plan
WORK = HERE + '/work'; os.makedirs(WORK, exist_ok=True); SR = 44100
for d in [os.environ.get('PIPER_DIR', ''), ROOT + '/formats/podcast/voices']:
    if d and os.path.exists(d + '/en_US-amy-medium.onnx'): VOICE = PiperVoice.load(d + '/en_US-amy-medium.onnx'); break
else: sys.exit('Voice file not found. Run formats/podcast/setup.sh or set PIPER_DIR.')
PSR = VOICE.config.sample_rate
def up(x): return np.interp(np.arange(int(len(x) * SR / PSR)) / SR * PSR, np.arange(len(x)), x).astype(np.float32)
def trim(x, thr=0.025, pad=0.02):
    idx = np.where(np.abs(x) > thr * np.abs(x).max())[0]; a = max(0, idx[0] - int(pad * SR)); b = min(len(x), idx[-1] + int(pad * SR)); return x[a:b]
def fade(x, a=0.01, b=0.03):
    x = x.copy(); n1, n2 = int(a * SR), int(b * SR); x[:n1] *= np.linspace(0, 1, n1); x[-n2:] *= np.linspace(1, 0, n2); return x
def level(x, rms=0.11):
    act = x[np.abs(x) > 0.05 * np.abs(x).max()]; g = rms / max(1e-6, np.sqrt((act ** 2).mean())); return np.tanh(x * g * 0.9) / 0.9 * 0.85
def stretch(x, dur):  # make a steady sound longer without changing pitch (ffmpeg atempo)
    d = len(x) / SR
    if d >= dur: return x
    f = d / dur; chain = []
    while f < 0.5: chain.append('atempo=0.5'); f /= 0.5
    chain.append('atempo=%.4f' % f)
    p = WORK + '/_s.wav'; write(p, x)
    r = subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', p, '-af', ','.join(chain), '-ar', str(SR), '-ac', '1', '-f', 'f32le', '-'], capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype='<f4').copy()
def write(path, x):
    with wave.open(path, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())
LS = {'happy': 1.12, 'excited': 1.04, 'calm': 1.22}
def speak(text, emo):
    ch = [c.audio_float_array for c in VOICE.synthesize(text, SynthesisConfig(length_scale=LS.get(emo, 1.12)))]
    return level(fade(trim(up(np.concatenate(ch)))))
def ph_ids(ph): return VOICE.phonemes_to_ids(ph if isinstance(ph, list) else [ph])
STOPS = set('ptdkbg'); FRIC = set('sfzʃv')
def sound(ph, dur=0.9, rms=0.13):
    a = up(np.asarray(VOICE.phoneme_ids_to_audio(ph_ids(ph), SynthesisConfig()), dtype=np.float32)); a = trim(a, 0.04, 0.0)
    if ph in STOPS: a = fade(a[:int(0.22 * SR)], 0.003, 0.05)               # a quick pop, never "puh"
    else: a = fade(stretch(a, dur)[:int((dur + 0.1) * SR)], 0.03, 0.08)     # a long steady sound you can hear and copy
    return level(a, rms)
def join(phs, hold=0.55, xf=0.1):  # the sounds flowing into each other: "lllaaammmp"
    parts = [sound(p, hold, 0.11) for p in phs]; out = parts[0]
    for p in parts[1:]:
        n = min(int(xf * SR), len(out), len(p)); out = np.concatenate([out[:-n], out[-n:] * np.linspace(1, 0, n) + p[:n] * np.linspace(0, 1, n), p[n:]])
    return level(fade(out, 0.02, 0.06), 0.11)
def blend(word):  # the word said slowly and stretched (text path, length 1.6: clearest in speech-recognition checks)
    ch = [c.audio_float_array for c in VOICE.synthesize(word + '.', SynthesisConfig(length_scale=1.6))]
    return level(fade(trim(up(np.concatenate(ch)))), 0.11)
def letters(word):
    ph = [p for p in VOICE.phonemize(word)[0] if p not in 'ˈˌː']; assert len(ph) == len(word), (word, ph); return ph
# ---------------- timeline
cur = 0.5; events = []; lines = []; clips = []; word = None; PH = {}; cache = {}
def cached(k, f):
    if k not in cache: cache[k] = f()
    return cache[k]
def put(x, kind, gap):
    global cur
    n = len(x) / SR; lines.append(dict(t0=round(cur, 3), t1=round(cur + n, 3), kind=kind)); clips.append((cur, x))
    hop = SR // 48; m = len(x) // hop; env = np.array([np.sqrt((x[j * hop:(j + 1) * hop] ** 2).mean()) for j in range(m)])
    env = np.clip(env / (np.percentile(env, 92) + 1e-6), 0, 1); lines[-1]['env'] = [round(float(e), 2) for e in np.convolve(env, [.25, .5, .25], 'same')]
    t0 = cur; cur += n + gap; return t0, n
def last(typ):
    for e in reversed(events):
        if e['type'] == typ: return e
for it in plan.SEQ:
    k = it[0]
    if k == 'ev':
        e = dict(t=round(cur, 3), type=it[1], **it[2]); events.append(e)
        if it[1] == 'scatter': word = e['w']; PH[word] = cached('L' + word, lambda: letters(word))
    elif k == 'say':
        put(cached(('s', it[1], it[2]), lambda: speak(it[1], it[2])), 'say', 0.1)
    elif k == 'snd':   # one letter sound, said it[2] times (default 1)
        ph = PH[word][it[1]]; st0 = cur
        for r in range(it[2] if len(it) > 2 else 1): put(cached(('p', ph), lambda: sound(ph)), 'sound', 0.2)
        last('sound')['d'] = round(cur - st0 - 0.1, 3)
    elif k == 'partaudio':   # the first n sounds flowing together: "la", "lam"
        t0, n = put(cached(('j', word, it[1]), lambda: join(PH[word][:it[1]])), 'sound', 0.25); last('part')['d'] = round(n, 3)
    elif k == 'slow':   # the whole word sounded out slowly
        t0, n = put(cached(('j', word, 9), lambda: join(PH[word], 0.6, 0.12)), 'blend', 0.3); last('blend')['d'] = round(n, 3)
    elif k == 'blend':
        t0, n = put(cached(('b', it[1]), lambda: blend(it[1])), 'blend', 0.15); last('blend')['d'] = round(n, 3)
    elif k == 'wait': cur += it[1]
TOTAL = round(cur + 0.8, 2)
json.dump(dict(total=TOTAL, lines=lines, events=events, words=PH), open(WORK + '/timeline.json', 'w'))
print('total %.1fs, %d lines, %d events' % (TOTAL, len(lines), len(events)))
# a sampler to listen to BEFORE the long render: every single sound, then the slow words
samp = []; gap = np.zeros(int(0.5 * SR), dtype=np.float32)
for w, ph in PH.items():
    for p in ph:
        if ('p', p) in cache and ('sampled', p) not in cache: cache[('sampled', p)] = 1; samp += [cache[('p', p)], gap]
if not samp: samp = [gap]
write(WORK + '/sound_sampler.wav', np.concatenate(samp))
# ---------------- audio mix
N = int(TOTAL * SR); t = np.arange(N) / SR; voices = np.zeros(N, dtype=np.float32)
for s, x in clips:
    a = int(s * SR); b = min(N, a + len(x)); voices[a:b] += x[:b - a]
def follow(sig, win=0.15): n = int(win * SR); return np.convolve(np.abs(sig), np.ones(n) / n, 'same')
duck = 1 - 0.62 * np.clip(follow(voices) * 12, 0, 1)
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
def tone(m, dur, att=0.005, dec=3.0, g=0.05, w=(1, .3, .1)):
    tt = np.arange(int(dur * SR)) / SR; f = midi(m); return sum(a * np.sin(2 * np.pi * f * (j + 1) * tt) for j, a in enumerate(w)) * np.minimum(tt / att, 1) * np.exp(-tt * dec) * g
def add(buf, a, s):
    a = int(a * SR)
    if a >= N: return
    b = min(N, a + len(s)); buf[a:b] += s[:b - a]
def noise(d, seed): return np.random.default_rng(seed).standard_normal(int(d * SR))
music = np.zeros(N); bpm = 112; beat = 60 / bpm; bar = 4 * beat
CH = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]]; PENT = [72, 74, 76, 79, 81, 84, 86]
def kick(ts):
    tt = np.arange(int(0.25 * SR)) / SR; add(music, ts, np.sin(2 * np.pi * (50 + 110 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 12) * 0.5)
def clap(ts):
    n = int(0.12 * SR); tt = np.arange(n) / SR; add(music, ts, np.convolve(noise(0.12, int(ts * 31)), np.ones(3) / 3, 'same') * np.exp(-tt * 38) * 0.22)
def hat(ts, g=0.07):
    n = int(0.04 * SR); tt = np.arange(n) / SR; r = noise(0.04, int(ts * 53)); add(music, ts, (r - np.convolve(r, np.ones(8) / 8, 'same')) * np.exp(-tt * 90) * g)
for b in range(int(TOTAL / bar) + 2):
    t0 = b * bar; ch = CH[b % 4]; r = np.random.default_rng(b)
    for q in range(4):
        tq = t0 + q * beat
        if q in (0, 2): kick(tq)
        if q in (1, 3): clap(tq)
        hat(tq, 0.05); hat(tq + beat / 2, 0.09)
        add(music, tq + beat / 2, tone(ch[0] - 12 + (7 if q % 2 else 0), beat * 0.45, 0.005, 6, 0.2, (1, .3, 0)))      # bouncy bass on the off-beat
        for m in ch[1:3]: add(music, tq + beat / 2, tone(m, beat * 0.3, 0.004, 9, 0.05))                              # chord stabs
    for q in range(8):
        if r.random() < .75: add(music, t0 + q * beat / 2, tone(int(r.choice(PENT)), 0.35, 0.004, 7, 0.045))        # sparkly tune
music *= np.clip(np.minimum(t / 1.0, (TOTAL - t) / 2.0), 0, 1)
sfx = np.zeros(N)
def _unused(): pass
def noise(d, seed): return np.random.default_rng(seed).standard_normal(int(d * SR))
def click(ts):
    n = int(0.09 * SR); tt = np.arange(n) / SR; add(sfx, ts, (np.sin(2 * np.pi * 180 * tt) * np.exp(-tt * 60) * 0.5 + np.convolve(noise(0.09, int(ts * 100)), np.ones(6) / 6, 'same') * np.exp(-tt * 90) * 0.5) * 0.35)
def pop(ts):
    tt = np.arange(int(0.12 * SR)) / SR; add(sfx, ts, np.sin(2 * np.pi * (300 + 700 * tt * 8) * tt) * np.exp(-tt * 28) * 0.18)
def whoosh(ts, d=0.35, g=0.1):
    n = int(d * SR); u = np.arange(n) / n; r = noise(d, int(ts * 77)); sm = np.convolve(r, np.ones(40) / 40, 'same') - np.convolve(r, np.ones(400) / 400, 'same'); add(sfx, ts, sm * np.sin(np.pi * u) ** 2 * g * 3)
def tada(ts, g=0.1):
    for j, f in enumerate([523, 659, 784, 1047]): tt = np.arange(int(0.9 * SR)) / SR; add(sfx, ts + j * 0.07, (np.sin(2 * np.pi * f * tt) + .35 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 5) * g)
def sparkle(ts):
    for j, f in enumerate([1568, 2093, 1760, 2349]): tt = np.arange(int(0.5 * SR)) / SR; add(sfx, ts + 0.06 * j, np.sin(2 * np.pi * f * tt) * np.exp(-tt * 9) * 0.05)
def tick(ts): tt = np.arange(int(0.05 * SR)) / SR; add(sfx, ts, np.sin(2 * np.pi * 900 * tt) * np.exp(-tt * 70) * 0.05)
for e in events:
    T = e['t']
    if e['type'] == 'scatter': [pop(T + 0.08 * i) for i in range(len(PH[e['w']]))]
    elif e['type'] == 'snap': click(T + 0.28)
    elif e['type'] == 'reveal': tada(T + 0.2)
    elif e['type'] == 'cheer': sparkle(T)
    elif e['type'] == 'part': pop(T)
    elif e['type'] in ('exit', 'banner'): whoosh(T, 0.3, 0.05)
    elif e['type'] == 'turn':
        for j in range(int(e['d'])): tick(T + 0.3 + j * 1.0)
mix = voices * 1.0 + music * duck * 0.8 + sfx * (0.6 + 0.4 * duck)
mix *= np.clip(np.minimum(t / 0.2, (TOTAL - t) / 1.2), 0, 1); mix = np.tanh(mix * 0.9); mix = mix / np.abs(mix).max() * 0.9
write(WORK + '/audio.wav', mix); write(WORK + '/voice.wav', voices); print('audio ok')
