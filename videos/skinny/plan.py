# SKINNY IS NOT AN ACHIEVEMENT. One person (Dalia, emotional robot) talking to camera. Lines live in lines.json.
import json, os
LINES = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lines.json')))
GAPS = [0, 0.35, 0.45, 0.25, 0.55, 0.4, 0.5, 0.45, 0.5]     # silence before each line (seconds)
PRE, POST = 1.2, 1.8
SHOTS = [('dollyWide', 0), ('close1', 'L0+0.9'), ('low', 'L1'), ('push', 'L2'), ('close2', 'L4'), ('orbit', 'L5'), ('scaleCut', 'L6+1.8'), ('dollySide', 'L7'), ('pull', 'L8')]
