"""LINES CHECK: listen to EVERY spoken line and compare it to the script.
Run:  voices/cbenv/bin/python -I tools/lines_check.py videos/<name>
It transcribes work/l00.wav, l01.wav ... with faster-whisper and compares them to the text in plan.py.
Lines with {ar:...} words are compared without the Arabic part. A line under 0.8 match is listed: LISTEN to it (short 1 to 2 word sentences are the usual culprit).
audio_check.py finds clicks and silence; this finds garbled or wrong words."""
import sys, re, wave, difflib, importlib.util, numpy as np
d = sys.argv[1].rstrip('/')
spec = importlib.util.spec_from_file_location('plan', f'{d}/plan.py'); plan = importlib.util.module_from_spec(spec); sys.path.insert(0, d); spec.loader.exec_module(plan)
from faster_whisper import WhisperModel
m = WhisperModel('small', compute_type='int8')
norm = lambda t: re.sub(r"[^a-z' ]", '', t.lower().replace('-', ' ')).split()
AR = re.compile(r'\{ar:[^}]*\}'); bad = []
flat = [l for s in plan.SCENES for l in s['lines']]
for i, l in enumerate(flat):
    w = wave.open(f'{d}/work/l{i:02d}.wav'); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
    a16 = np.interp(np.arange(0, len(x), sr / 16000), np.arange(len(x)), x).astype('float32')
    segs, _ = m.transcribe(a16, language='en', beam_size=5); heard = ' '.join(s.text for s in segs).strip()
    spoken = l[4] if len(l) > 4 else l[1]; want = AR.sub(' ', spoken)
    r = difflib.SequenceMatcher(None, norm(want), norm(heard)).ratio(); flag = '  <-- LISTEN' if r < 0.8 else ''
    print(f'{i:02d} {l[0]:6s} {r:.2f} | {heard[:70]}{flag}')
    if r < 0.8: bad.append(i)
print('lines to listen to:', bad or 'none')
