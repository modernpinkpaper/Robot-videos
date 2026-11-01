import sys, glob
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 8; start = int(sys.argv[4]) if len(sys.argv) > 4 else 0; n = int(sys.argv[5]) if len(sys.argv) > 5 else 24
fs = sorted(glob.glob(d + '/f_*.jpg'))[start:start+n]; tw, th = 192, 341; rows = (len(fs) + cols - 1) // cols
im = Image.new('RGB', (cols * tw, rows * th), 'white'); dr = ImageDraw.Draw(im)
for i, f in enumerate(fs):
    t = Image.open(f).resize((tw, th)); im.paste(t, ((i % cols) * tw, (i // cols) * th)); dr.text(((i % cols) * tw + 4, (i // cols) * th + 4), '%.1fs' % (0), fill='white', stroke_width=2, stroke_fill='black')
im.save(out, quality=88)
