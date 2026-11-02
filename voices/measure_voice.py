# Measures how a voice behaves: pitch (level, variety, range), breathiness (harmonics-to-noise), pauses. Uses only the Praat library (parselmouth).
import sys, numpy as np, parselmouth
from parselmouth.praat import call
def stats(path):
    snd = parselmouth.Sound(path); pit = snd.to_pitch(time_step=0.01, pitch_floor=75, pitch_ceiling=450)
    f0 = pit.selected_array['frequency']; v = f0[f0 > 0]; st = 12 * np.log2(v / np.median(v))
    hnr = call(snd.to_harmonicity_cc(), 'Get mean', 0, 0); iv = snd.to_intensity().values[0]; sil = (iv < iv.max() - 30).mean()
    return dict(sec=snd.duration, f0_hz=float(np.median(v)), pitch_sd_st=float(st.std()), pitch_range_st=float(np.percentile(st, 95) - np.percentile(st, 5)), voiced=float(len(v) / len(f0)), hnr_db=float(hnr), pause_ratio=float(sil))
if __name__ == '__main__':
    print(f"{'file':32s} {'sec':>5s} {'f0Hz':>5s} {'pitchSD':>7s} {'range':>6s} {'voiced':>6s} {'HNR':>5s} {'pause':>5s}")
    for p in sys.argv[1:]:
        s = stats(p); print(f"{p.split('/')[-1][:32]:32s} {s['sec']:5.1f} {s['f0_hz']:5.0f} {s['pitch_sd_st']:7.2f} {s['pitch_range_st']:6.1f} {s['voiced']:6.2f} {s['hnr_db']:5.1f} {s['pause_ratio']:5.2f}")
