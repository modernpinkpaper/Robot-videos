#!/bin/bash
# Renders the whole video:  ./run.sh   (needs: python3 mk.py first). Output: github_basics.mp4
cd "$(dirname "$0")"; ROOT="$(cd ../.. && pwd)"
(cd "$ROOT" && python3 -m http.server 8766 >/dev/null 2>&1 &); sleep 1
TOT=$(python3 -c "import json;print(int(json.load(open('build/timeline.json'))['total']*24))")
rm -rf build/frames; mkdir -p build/frames; Q=$(( (TOT+3)/4 ))
for i in 0 1 2 3; do a=$((i*Q)); b=$(( (i+1)*Q )); [ $b -gt $TOT ] && b=$TOT; node render.js frames $a $b build/frames > build/r_$i.log 2>&1 & done
wait
DUR=$(python3 -c "import json;print(json.load(open('build/timeline.json'))['total'])")
ffmpeg -v error -y -framerate 24 -i build/frames/f_%05d.jpg -i build/audio.wav -t $DUR -c:v libx264 -pix_fmt yuv420p -crf 21 -c:a aac -b:a 160k -shortest github_basics.mp4
echo "done: github_basics.mp4"
