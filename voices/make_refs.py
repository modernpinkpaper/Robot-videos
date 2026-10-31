# Makes the reference clips Chatterbox copies each human's voice from (voices/refs/<name>.wav, about 12 seconds each).
# They are built from the Piper voices in formats/podcast/pod/voices_cfg.py, so each person keeps a different voice.
#   python3 voices/make_refs.py          (needs piper-tts, ffmpeg, and formats/podcast/setup.sh already run)
# To use a REAL voice instead (with the person's permission): put a clean 10 to 20 second mono wav at voices/refs/<name>.wav.
import sys, os, wave, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
VOICES_DIR = os.environ.get('VOICES_DIR', ROOT + '/formats/podcast/voices/')
sys.path.insert(0, ROOT + '/formats/podcast/pod')
from piper import PiperVoice
try: from piper import SynthesisConfig
except ImportError: SynthesisConfig = None
from voices_cfg import VOICE
TEXT = "Honestly, I did not expect today to go this way. But you know what? We figured it out, we laughed about it, and we kept going. That is how it usually works for me."
os.makedirs(HERE + '/refs', exist_ok=True)
for who in ['DALIA', 'AMINA', 'MARCUS', 'LILY', 'SOFIA', 'GRANDPA', 'KID_BOY', 'KID_GIRL', 'NARRATOR']:
    vn, pitch, ls = VOICE[who]; v = PiperVoice.load(VOICES_DIR + vn + '.onnx'); raw = f'{HERE}/_r.wav'
    with wave.open(raw, 'wb') as w:
        if SynthesisConfig: v.synthesize_wav(TEXT, w, syn_config=SynthesisConfig(length_scale=ls))
        else: v.synthesize_wav(TEXT, w)
    sr = v.config.sample_rate
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', f'asetrate={int(sr*pitch)},aresample=24000,atempo={1/pitch:.4f},highpass=f=90,loudnorm=I=-20:TP=-2', '-ar', '24000', '-ac', '1', f'{HERE}/refs/{who.lower()}.wav'], check=True)
    os.remove(raw); print('ref', who)
