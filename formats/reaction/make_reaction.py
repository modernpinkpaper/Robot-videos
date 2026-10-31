# REACTION VIDEO MAKER. A character (top right) watches a clip (bottom left) and reacts, like a real reaction video.
#   python3 formats/reaction/make_reaction.py script.json out.mp4
# The clip can be a REAL video file or one of our own animated videos. Same tool for both.
#
# script.json
# { "source": "path/to/clip.mp4",          the clip being reacted to (any video with or without sound)
#   "reactor": "dalia",                     a name from characters/robots.js PEOPLE (dalia amina marcus lily sofia grandpa kid_boy kid_girl) or a robot (MICA ...)
#   "voice_who": "DALIA",                   voice for the reactor (default = reactor name uppercased)
#   "mode": "pause",                        "pause" = the clip freezes while the reactor talks (classic reaction video)
#                                           "over"  = the clip keeps playing quietly while the reactor talks over it
#   "start": 0, "end": null,                part of the clip to use (seconds)
#   "beats": [
#     { "at": 3.2, "say": "Wait. She did *WHAT*?", "emo": "shock", "act": "gasp" },     talk at source second 3.2 (*word* is highlighted)
#     { "at": 8.0, "act": "laugh", "emo": "laugh", "dur": 1.4 },                        silent reaction while the clip plays
#     ... ] }
# acts: nod shake gasp laugh facepalm lean hop   emotions: happy excited sweet laugh deadpan stern tired sad worried shock smug dramatic
import sys, os, re, json, wave, subprocess, shutil, time
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE)); WORK = HERE + '/work'
sys.path.insert(0, ROOT + '/voices'); sys.path.insert(0, HERE)
from behavior import plan_reactions, forced_from_script, cues_to_reacts
W, H, FPS, SR = 576, 1024, 24, 44100
BOX_W, BOX_H, MARGIN = 300, 420, 18          # the clip's window, bottom left

def run(*a, **k): subprocess.run([str(x) for x in a], check=True, **k)
def probe(path, what):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', what, '-of', 'csv=p=0', path]).decode().split()[0])
def has_audio(path): return bool(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', path]).strip())
def read_wav(path):
    with wave.open(path) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
        return x.reshape(-1, w.getnchannels()).mean(1) if w.getnchannels() > 1 else x

def chunks(text, v0, v1):
    """Split a line into short caption pieces (about 6 words) timed across the line."""
    words = text.split(); out = []; i = 0
    while i < len(words):
        n = min(6, len(words) - i); out.append(' '.join(words[i:i + n])); i += n
    if len(out) > 1 and len(out[-1].split()) <= 2: last = out.pop(); out[-1] += ' ' + last
    tot = sum(len(c) for c in out); t = v0; res = []
    for c in out: d = (v1 - v0) * len(c) / tot; res.append(dict(t0=round(t, 3), t1=round(t + d, 3), text=c)); t += d
    return res

def main(script_path, out_path):
    S = json.load(open(script_path)); base = os.path.dirname(os.path.abspath(script_path))
    src = S['source'] if os.path.isabs(S['source']) else os.path.join(base, S['source'])
    reactor = S.get('reactor', 'dalia'); who = S.get('voice_who', reactor).upper(); mode = S.get('mode', 'pause')
    dur_src = probe(src, 'format=duration')
    if '--force' not in sys.argv:                                    # QUALITY GATE (tools/lint_dialogue.py): corny lines or reactions that do not fit stop the render
        sys.path.insert(0, ROOT + '/tools'); import lint_dialogue as LD
        E, W = LD.lint_reaction(S, LD.clip_sentences_for(src), (S.get('end') or dur_src) - S.get('start', 0)); LD.report(E, W, 'quality gate')
        if E: raise SystemExit('Fix the errors above (see formats/reaction/REACTOR_VOICE.md), then run again. (--force skips this check; do not.)'); s0 = S.get('start', 0); s1 = S.get('end') or dur_src
    shutil.rmtree(WORK, ignore_errors=True); os.makedirs(WORK + '/frames'); os.makedirs(WORK + '/seg')
    beats = sorted(S['beats'], key=lambda b: b['at'])
    # ---- 1. the reactor's voice (humans: Chatterbox with pace, emotion and tone per line; robots: Piper)
    rows = [dict(who=who, text=re.sub(r'\*', '', b['say']), emo=b.get('emo', 'neutral'), out=f"{WORK}/say{i:02d}.wav", **({k: b[k] for k in ('pace', 'tone', 'energy') if k in b})) for i, b in enumerate(beats) if b.get('say')]
    if rows:
        from speak import synth_lines
        synth_lines(rows)
    wavs = {r['out']: read_wav(r['out']) for r in rows}
    # ---- 2. the timeline: play, freeze (reactor talks), play ...
    segs = []; out_t = 0.0; cur = s0; talks = []; reacts = []; caps = []; mix = []  # mix = (out_time, samples)
    for i, b in enumerate(beats):
        at = min(max(b['at'], s0), s1)
        if at > cur: segs.append(('play', cur, at, out_t)); out_t += at - cur; cur = at
        if b.get('say'):
            r = f"{WORK}/say{i:02d}.wav"; x = wavs[r]; idx = np.where(np.abs(x) > 0.02)[0]; lead = idx[0] / SR if len(idx) else 0; tail = idx[-1] / SR if len(idx) else len(x) / SR
            line = len(x) / SR
            if mode == 'pause':
                pad = 0.25; segs.append(('freeze', cur, line + pad + 0.15, out_t)); start = out_t + 0.1; out_t += line + pad + 0.15
            else: start = out_t
            v0, v1 = start + lead, start + tail
            hop = SR // 48; n = len(x) // hop; env = np.array([np.sqrt((x[k * hop:(k + 1) * hop] ** 2).mean()) for k in range(n)])
            ref = np.percentile(env[env > 0.01], 90) if (env > 0.01).any() else 1; env = np.convolve(np.clip(env / ref, 0, 1), [0.25, 0.5, 0.25], 'same')
            talks.append(dict(start=round(start, 3), v0=round(v0, 3), v1=round(v1, 3), emo=b.get('emo', 'neutral'), env=[round(float(e), 2) for e in env]))
            caps += chunks(b['say'], v0, v1); mix.append((start, x))
            if b.get('act'): reacts.append(forced_from_script(b['act'], b.get('emo', 'neutral'), start - 0.15, min(1.4, line)))
        else:
            d = b.get('dur', 1.2); reacts.append(forced_from_script(b.get('act', 'nod'), b.get('emo', 'neutral'), out_t, d))
    if s1 > cur: segs.append(('play', cur, s1, out_t)); out_t += s1 - cur
    total = out_t + 1.0
    # ---- 2b. automatic human behavior: reactions found in the clip, looks at the camera (formats/reaction/behavior.py)
    if S.get('cues'): reacts = reacts + cues_to_reacts(S['cues'], segs)           # written by the director from the transcript: they fit the meaning
    if S.get('auto', True):
        events = []
        if not S.get('cues') or S.get('auto_words'):                              # word-list guesses are only a fallback when there are no cues
            try:
                py = os.environ.get('CHATTERBOX_PY') if (os.environ.get('CHATTERBOX_PY') and os.path.exists(os.environ.get('CHATTERBOX_PY'))) else sys.executable
                env = {k: v for k, v in os.environ.items() if k not in ('PYTHONPATH', 'PYTHONHOME')}
                cmd = [py, HERE + '/analyze_clip.py', src, str(s0), str(s1)] + (['--sound'] if S.get('sound_reactions') else [])
                res = subprocess.run(cmd, capture_output=True, text=True, env=env)
                events = json.loads(res.stdout.strip().splitlines()[-1]) if res.stdout.strip() else []
                if res.stderr.strip(): print(res.stderr.strip()[-300:], file=sys.stderr)
            except Exception as ex: print('clip analysis skipped:', ex, file=sys.stderr)
        auto = plan_reactions(events, segs, talks, reacts, total, seed=S.get('seed', 7), glances=S.get('glances', True))
        print(f'clip events: {len(events)}; cues: {len(S.get("cues", []))}; automatic reactions: {sum(1 for a in auto if a["kind"] != "glance")}; silent looks at the camera: {sum(1 for a in auto if a["kind"] == "glance")}')
        reacts = reacts + auto
    # ---- 3. the clip's video (fit in the bottom-left window) and its audio
    sw = min(BOX_W, int(BOX_H * (probe(src, 'stream=width') / probe(src, 'stream=height')))); sh = int(round(sw * probe(src, 'stream=height') / probe(src, 'stream=width')))
    if sh > BOX_H: sh = BOX_H; sw = int(round(sh * probe(src, 'stream=width') / probe(src, 'stream=height')))
    sw -= sw % 2; sh -= sh % 2
    clips = []; audio = np.zeros(int(total * SR) + SR, dtype=np.float32); src_audio = has_audio(src)
    for k, (kind, a, b, ot) in enumerate(segs):
        f = f'{WORK}/seg/s{k:03d}.mp4'
        if kind == 'play':
            run('ffmpeg', '-v', 'error', '-y', '-ss', a, '-t', b - a, '-i', src, '-vf', f'scale={sw}:{sh},fps={FPS},format=yuv420p', '-an', '-c:v', 'libx264', '-crf', 17, f)
            if src_audio:
                wv = f'{WORK}/seg/a{k:03d}.wav'; run('ffmpeg', '-v', 'error', '-y', '-ss', a, '-t', b - a, '-i', src, '-ac', 1, '-ar', SR, wv); x = read_wav(wv); o = int(ot * SR); audio[o:o + len(x)] += x[:len(audio) - o]
        else:
            run('ffmpeg', '-v', 'error', '-y', '-ss', a, '-i', src, '-frames:v', 1, '-vf', f'scale={sw}:{sh},format=yuv420p', f'{WORK}/seg/p{k:03d}.png')
            run('ffmpeg', '-v', 'error', '-y', '-loop', 1, '-framerate', FPS, '-t', b, '-i', f'{WORK}/seg/p{k:03d}.png', '-vf', 'format=yuv420p', '-c:v', 'libx264', '-crf', 17, f)
        clips.append(f)
    open(WORK + '/list.txt', 'w').write(''.join(f"file '{c}'\n" for c in clips))
    run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', 0, '-i', WORK + '/list.txt', '-c', 'copy', WORK + '/inset.mp4')
    # reactor voice on top; in "over" mode the clip's sound ducks while the reactor talks
    voice = np.zeros_like(audio)
    for start, x in mix: o = int(start * SR); voice[o:o + len(x)] += x[:len(voice) - o]
    if mode == 'over':
        k = int(0.12 * SR); env = np.convolve(np.abs(voice), np.ones(k) / k, 'same'); audio *= 1 - 0.75 * np.clip(env * 14, 0, 1)
    final = audio * 0.9 + voice * 1.0; final = np.clip(final / max(1.0, np.abs(final).max() / 0.95), -1, 1)
    with wave.open(WORK + '/audio.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((final * 32767).astype('<i2').tobytes())
    # ---- 4. the reactor layer (transparent frames with captions)
    json.dump(dict(reactor=dict(who=reactor), look=S.get('look', 'emotional'), talks=talks, reacts=reacts, caps=caps, total=round(total, 3), frame=S.get('frame')), open(WORK + '/reaction.json', 'w'))
    nfr = int(total * FPS); Q = (nfr + 3) // 4; port = '8772'
    srv = subprocess.Popen(['python3', '-m', 'http.server', port, '--directory', ROOT], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1.5)
    try:
        procs = [subprocess.Popen(['node', HERE + '/render_reactor.js', str(i * Q), str(min(nfr, (i + 1) * Q)), port]) for i in range(4)]
        for p in procs: p.wait()
    finally: srv.terminate()
    # ---- 5. compose: background, reactor, clip window (rounded corners + white border)
    from PIL import Image, ImageDraw, ImageFilter
    bg = Image.new('RGB', (W, H)); px = bg.load()
    for y in range(H):
        t = y / H; c = (int(238 - 30 * t), int(228 - 40 * t), int(252 - 10 * t))
        for x in range(W): px[x, y] = c
    d = ImageDraw.Draw(bg, 'RGBA')
    for cx, cy, r, a in [(90, 120, 150, 70), (520, 330, 120, 60), (460, 840, 190, 55), (40, 640, 100, 50)]: d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 200, 230, a))
    bg = bg.filter(ImageFilter.GaussianBlur(14)); bg.save(WORK + '/bg.png')
    R = 18; m = Image.new('L', (sw, sh), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, sw - 1, sh - 1), R, fill=255); m.save(WORK + '/mask.png')
    fr = Image.new('RGBA', (sw + 24, sh + 24), (0, 0, 0, 0)); sh_ = Image.new('RGBA', fr.size, (0, 0, 0, 0)); ImageDraw.Draw(sh_).rounded_rectangle((8, 12, sw + 16, sh + 18), R + 4, fill=(40, 20, 80, 90)); fr = Image.alpha_composite(fr, sh_.filter(ImageFilter.GaussianBlur(7)))
    ImageDraw.Draw(fr).rounded_rectangle((8, 8, sw + 15, sh + 15), R + 3, outline=(255, 255, 255, 255), width=5); fr.save(WORK + '/frame.png')
    X, Y = MARGIN, H - MARGIN - sh
    run('ffmpeg', '-v', 'error', '-y', '-loop', 1, '-framerate', FPS, '-i', WORK + '/bg.png', '-framerate', FPS, '-i', WORK + '/frames/f_%04d.png', '-i', WORK + '/inset.mp4', '-loop', 1, '-i', WORK + '/mask.png', '-loop', 1, '-i', WORK + '/frame.png', '-i', WORK + '/audio.wav',
        '-filter_complex', f'[2:v][3:v]alphamerge[ins];[0:v][1:v]overlay=0:0:format=auto[a];[a][4:v]overlay={X - 12}:{Y - 12}[b];[b][ins]overlay={X}:{Y}[c]',
        '-map', '[c]', '-map', '5:a', '-t', round(total, 3), '-r', FPS, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', 19, '-c:a', 'aac', '-b:a', '160k', out_path)
    shutil.rmtree(WORK + '/frames', ignore_errors=True); shutil.rmtree(WORK + '/seg', ignore_errors=True)
    print('made', out_path, f'{total:.1f}s')

if __name__ == '__main__': main(*[a for a in sys.argv[1:] if not a.startswith('--')][:2])
