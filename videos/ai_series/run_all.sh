#!/bin/bash
# renders episode N in 4 parallel workers, then encodes it: ./run_all.sh 2 3
cd "$(dirname "$0")"
for EPN in "$@"; do
  TOT=$(python3 -c "import json;print(int(round(json.load(open('work/ep$EPN/timeline.json'))['total']*24)))")
  rm -rf work/ep$EPN/frames; mkdir -p work/ep$EPN/frames; Q=$(( (TOT+3)/4 ))
  for i in 0 1 2 3; do a=$((i*Q)); b=$(( (i+1)*Q )); [ $b -gt $TOT ] && b=$TOT; node render.js $EPN $a $b > work/ep$EPN/r$i.log 2>&1 & done
  wait
  DUR=$(python3 -c "import json;print(json.load(open('work/ep$EPN/timeline.json'))['total'])")
  ffmpeg -v error -y -framerate 24 -i work/ep$EPN/frames/f_%04d.jpg -i work/ep$EPN/audio.wav -t $DUR -c:v libx264 -pix_fmt yuv420p -crf 21 -c:a aac -b:a 160k -shortest ep$EPN.mp4
  echo "done ep$EPN" >> work/progress.log
done
