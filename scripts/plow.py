"""The plow panel pair: one plowed driveway, one buried, made by Codex as an edit of
the plowed picture (see _source/gen/prompts/plow-*.txt). The edit moves nothing, but it
redraws every pixel slightly, so this keeps the plowed picture's own pixels everywhere
the two do not really differ. Dragging then changes the driveway and its snowbanks and
nothing else.

    python3 scripts/plow.py   ->  src/assets/panel/plow-after.jpg, plow-before.jpg
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
GEN = ROOT / '_source/gen/out'
OUT = ROOT / 'src/assets/panel'

after = np.asarray(Image.open(GEN / 'plow-after-a.png').convert('RGB')).astype(np.float32)
before = np.asarray(Image.open(GEN / 'plow-before-a.png').convert('RGB')).astype(np.float32)

# where the pictures really differ: compare blurred copies so redrawn fine texture
# (branches, siding, snow grain) cancels out and only the driveway, the walk and the
# snowbanks remain; then grow and feather it so the seam falls in smooth snow
soft = lambda x: np.asarray(Image.fromarray(x.astype(np.uint8)).filter(ImageFilter.GaussianBlur(8))).astype(np.float32)
diff = np.abs(soft(after) - soft(before)).mean(axis=2)
m = (diff > 8).astype(np.uint8) * 255
m = Image.fromarray(m).filter(ImageFilter.MaxFilter(25)).filter(ImageFilter.GaussianBlur(12))
w = np.asarray(m).astype(np.float32) / 255.0
# the house, shrubs and trees never change: the edit only nudged their light, so keep the
# plowed picture's pixels above the foot of the garage, blending in over 30 rows
rows = np.clip((np.arange(w.shape[0]) - 462) / 30, 0, 1)[:, None]
w = (w * rows)[..., None]

mixed = after * (1 - w) + before * w
print(f'changed area: {w.mean() * 100:.1f}% of the picture')

Image.fromarray(after.astype(np.uint8)).save(OUT / 'plow-after.jpg', quality=90, subsampling=0)
Image.fromarray(np.clip(mixed, 0, 255).astype(np.uint8)).save(OUT / 'plow-before.jpg', quality=90, subsampling=0)
Image.fromarray((w[..., 0] * 255).astype(np.uint8)).save(GEN / 'plow-mask.png')
