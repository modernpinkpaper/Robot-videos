# Makes one short sample per voice so Dalia can HEAR each character. Run from anywhere:
#   python3 examples/voices/make_samples.py   (needs piper-tts, ffmpeg, and the voices from formats/podcast/setup.sh)
import sys, os, wave, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
VOICES_DIR = os.environ.get('VOICES_DIR', ROOT + '/formats/podcast/voices/')
sys.path.insert(0, ROOT + '/formats/podcast/pod')
from piper import PiperVoice
try: from piper import SynthesisConfig
except ImportError: SynthesisConfig = None
from voices_cfg import VOICE, NAMES
LINES = {'default': 'Hi, I am {n}. This is how I sound when I talk. Nice to meet you!'}
for who, (vn, pitch, ls) in VOICE.items():
    v = PiperVoice.load(VOICES_DIR + vn + '.onnx'); raw = f'{HERE}/_r.wav'
    with wave.open(raw, 'wb') as w:
        text = LINES['default'].format(n=NAMES.get(who, who))
        if SynthesisConfig: v.synthesize_wav(text, w, syn_config=SynthesisConfig(length_scale=ls))
        else: v.synthesize_wav(text, w)
    sr = v.config.sample_rate
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', f'asetrate={int(sr*pitch)},aresample=44100,atempo={1/pitch:.4f},highpass=f=90,aecho=0.8:0.9:5:0.18,loudnorm=I=-18:TP=-2', '-ac', '1', '-b:a', '64k', f'{HERE}/{who.lower()}.mp3'], check=True)
    os.remove(raw); print('made', who)
