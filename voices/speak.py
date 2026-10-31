# ONE entry point for every video's voices.
#   humans -> Chatterbox (natural, with pace, emotion and tone chosen per line)   robots -> Piper (robot voices)
# Use from a video's build_audio.py:
#   from speak import synth_lines
#   synth_lines([ {"who":"DALIA","text":"...","emo":"happy","out":"work/l00.wav"}, ... ])
# Needs: CHATTERBOX_PY (see voices/setup_chatterbox.sh) for humans, piper + formats/podcast/setup.sh for robots.
import sys, os, json, wave, subprocess, tempfile
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE); sys.path.insert(0, ROOT + '/formats/podcast/pod')
HUMANS = {'DALIA', 'AMINA', 'MARCUS', 'LILY', 'SOFIA', 'GRANDPA', 'KID_BOY', 'KID_GIRL', 'NARRATOR'}

def _piper(rows):
    from piper import PiperVoice
    try: from piper import SynthesisConfig
    except ImportError: SynthesisConfig = None
    from voices_cfg import VOICE
    vd = os.environ.get('VOICES_DIR', ROOT + '/formats/podcast/voices/'); cache = {}
    for r in rows:
        vn, pitch, ls = VOICE[r['who'].upper()]
        if vn not in cache: cache[vn] = PiperVoice.load(vd + vn + '.onnx')
        v = cache[vn]; raw = tempfile.mktemp(suffix='.wav')
        with wave.open(raw, 'wb') as w:
            if SynthesisConfig: v.synthesize_wav(r['text'], w, syn_config=SynthesisConfig(length_scale=ls))
            else: v.synthesize_wav(r['text'], w)
        sr = v.config.sample_rate
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', f'asetrate={int(sr*pitch)},aresample=44100,atempo={1/pitch:.4f},highpass=f=90,aecho=0.8:0.9:5:0.18,loudnorm=I=-18:TP=-2', '-ar', '44100', '-ac', '1', r['out']], check=True); os.remove(raw)

def synth_lines(rows):
    humans = [r for r in rows if r['who'].upper() in HUMANS]; robots = [r for r in rows if r['who'].upper() not in HUMANS]
    if robots: _piper(robots)
    if humans:
        py = os.environ.get('CHATTERBOX_PY')
        if not py or not os.path.exists(py):
            print('WARNING: CHATTERBOX_PY is not set, so human voices fall back to Piper (less natural). Run voices/setup_chatterbox.sh.', file=sys.stderr); _piper(humans); return
        jf = tempfile.mktemp(suffix='.json'); json.dump(humans, open(jf, 'w'))
        subprocess.run([py, HERE + '/human_tts.py', jf], check=True, env={k: v for k, v in os.environ.items() if k not in ('PYTHONPATH', 'PYTHONHOME')})   # the venv has its own packages; os.remove(jf)

if __name__ == '__main__':
    synth_lines(json.load(open(sys.argv[1])))
