"""Build the site's photo sources from the originals in _source.

Two kinds of picture, kept apart on purpose (see src/data/photos.ts):
  real    Rob's own job photos: the full size originals he put in the shared Drive
          folder in 2023 and 2024 (_source/drive/jpg), and a few that only survive
          in the archived copy of his old site (_source/wayback/img, about 900 px).
  ai      made from a prompt for the illustration panels. Always captioned as an
          illustration, never used as proof of a job. Those live in src/assets/panel
          and are built by scripts/panel.py.

Output: src/assets/photos/<id>.jpg, EXIF-rotated, cropped where noted, long side capped.
Real photos get photokit.grade(): light and color only. Nothing is added or moved,
except house numbers, which are cloned out (CLONE). Astro makes the AVIF/WebP sizes
at build time. Originals are not committed. Crops are fractions (left, top, right,
bottom) of the rotated original.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter, ImageOps
from photokit import align, grade

ROOT = Path(__file__).resolve().parent.parent
S = ROOT / "_source"
OUT = ROOT / "src" / "assets" / "photos"
MAX = 2000
D = "drive/jpg/"
W = "wayback/img/"

def d(key):
    """A Drive original by the short id in its name."""
    hits = sorted((S / "drive/jpg").glob(f"*_{key}_*.jpg"))
    if not hits:
        raise SystemExit(f"no drive photo for {key}")
    return D + hits[0].name

REAL = {
    # lawns
    "mower-stripes": (d("1MTYEQ"), (0, 0.06, 1, 1)),
    "curve-stripes-colonial": (d("15ccsB"), (0, 0.08, 1, 1)),
    "crosscut-lawn": (d("1-EB_b"), (0, 0.1, 1, 1)),
    "cul-de-sac-stripes": (d("1YLYXa"), None),
    "ranch-stripes": (d("1TpI1-"), (0, 0.12, 1, 1)),
    "side-yard-stripes": (d("1HTYT3"), (0, 0.05, 1, 1)),
    "young-tree-stripes": (d("1UrEnc"), None),
    "deck-lawn": (d("1Cc_a5"), None),
    "curb-edge": (d("1oieyh"), (0, 0.12, 1, 0.92)),
    "walk-edge": (d("1jpNDL"), (0, 0.1, 1, 0.92)),
    "neighborhood-stripes": (d("1nAjIf"), None),
    "tree-line-stripes": (d("1osBCd"), None),
    "checker-close": (d("1BEWpf"), (0, 0.15, 1, 1)),
    "truck-trailer": (d("1Oxjyw"), (0, 0.08, 1, 0.94)),
    "fall-mowing": (d("1ew6Mz"), None),
    "fall-rider": (d("1zrff7"), (0, 0.12, 1, 0.95)),
    # beds, borders and walls
    "tree-bed-after": (d("1fWf3k"), None),
    "tree-bed-drive": (d("1fFbcF"), None),
    "block-bed-front": (d("1TMiy_"), None),
    "block-bed-colonial": (d("1qj-aO"), None),
    "block-bed-wide": (d("11-RBv"), None),
    "block-bed-corner": (d("1AUfUu"), None),
    "block-bed-trailer": (d("13F8Vv"), None),
    "block-bed-side": (d("1L5nsd"), (0, 0.1, 1, 0.95)),
    "block-bed-door": (d("18_X0s"), None),
    "stone-house-bed": (d("1J3Tjg"), None),
    "sign-bed": (d("1lFCs1"), (0.18, 0.1, 1, 1)),
    "mulch-colonial": (d("1TVxor"), None),
    "gazebo-hedges": (d("1nzZtI"), None),
    # ground work
    "deere-grading": (d("1Eznb5"), (0, 0.08, 1, 0.92)),
    "kubota-dig": (d("1VZ_MC"), (0, 0.05, 1, 0.9)),
    "straw-seed": (d("1grQVA"), (0, 0.1, 1, 0.95)),
    "boulder-wall": (d("1AULtS"), None),
    # leaves
    "leaves-before": (d("1A-DaQ"), (0, 0.1, 1, 0.92)),
    "leaf-vac": (d("1Eedol"), None),
    "leaf-trailer": (d("1OIW9v"), (0, 0.08, 1, 0.92)),
    "leaf-curb": (d("1W5bXp"), (0, 0.08, 1, 0.92)),
    "leaf-loader": (d("1NwLZv"), (0, 0.08, 1, 0.92)),
    "leaf-pile": (d("1BCuht"), (0, 0.1, 1, 0.9)),
    "leaf-windrow": (d("1cy_dG"), None),
    "leaf-tree": (d("1IsKvY"), None),
    "leaf-crew": (d("1tkPBh"), (0, 0.08, 1, 0.92)),
    "leaf-slope": (d("1RJpU2"), (0, 0.06, 1, 0.92)),
    # snow and ice
    "plow-fleet": (d("16V0ZA"), (0, 0.18, 1, 1)),
    "plow-fleet-2": (d("1Nufzj"), (0, 0.18, 1, 1)),
    "plow-drive": (d("1Ar6dS"), None),
    "plow-pair": (d("1CG_NJ"), None),
    "plow-lawn": (d("1USSft"), None),
    "drive-cleared": (d("1DSr6Y"), None),
    "salt-spreader": (d("1HDzMC"), (0, 0.12, 1, 0.92)),
    "walk-cleared": (d("1TyRub"), (0, 0.06, 1, 0.94)),
    # from the archived old site (smaller originals)
    "plow-deep": (W + "image23.jpg", None),
    "commercial-lot": (W + "gallery03_a156a2fd.jpg", None),
    "salted-drive": (W + "gallery02_ea38071a.jpg", None),
    "plow-push": (W + "gallery01_7bf46ada.jpg", None),
    "mulch-crew": (W + "gallery04_cfb45017.jpg", None),
    "rose-bed": (W + "gallery05_0a613ab9.jpg", None),
    "kubota-trailer": (W + "gallery05_8143a3f7.jpg", None),
    "sprinkler-lawn": (W + "gallery13_5d58dddf.jpg", None),
    "sprinkler-walk": (W + "gallery13_480afd1d.jpg", None),
    "sprinkler-trench": (W + "gallery14_6240dceb.jpg", None),
    "flower-urn": (W + "gallery13_29417164.jpg", None),
    "trailer-2023": (W + "image12.jpg", None),
}

# Per photo grade strength (1.0 is the default).
GRADE = {"plow-deep": 0.6, "commercial-lot": 0.7, "salted-drive": 0.6, "plow-push": 0.7, "walk-cleared": 0.7, "salt-spreader": 0.7, "drive-cleared": 0.7}

# House numbers and plates cloned out: (l, t, r, b, way) as fractions; way 0 = ring
# median, ±1 = copy from the box beside it, ±2 = from above or below, (dx, dy) = offset.
CLONE = {
    "block-bed-front": [(0.350, 0.110, 0.412, 0.172, -2)],
}
# The same, on a finished pair frame (fractions of the final 4:3 frame).
PAIR_CLONE = {
    "ba-front": [(0.383, 0.088, 0.450, 0.157, -2)],
}

# Real before and after pairs: same bed, Nov 2021 before, Nov 2021 or Apr 2022 after.
# The before is warped onto the after with SIFT + RANSAC (photokit.align) when the
# fixed parts of the scene (house, walk, tree) give enough matches.
PAIRS = {
    # "ba-tree" (example1 to IMG_2355) found only 21 matches and warped badly: not used.
    "ba-drive": (d("1hEVkO"), d("1fFbcF")),
    "ba-front": (d("1KK4d1"), d("1TMiy_")),
}


def clone(im, boxes):
    for l, t, r, b, way in boxes:
        w, h = im.size
        x0, y0, x1, y1 = round(l * w), round(t * h), round(r * w), round(b * h)
        bw, bh = x1 - x0, y1 - y0
        feather = max(3, round(min(bw, bh) * 0.1))
        if way == 0:
            ring = np.asarray(im.crop((x0 - bw // 2, y0 - bh // 4, x1 + bw // 2, y1 + bh // 4))).reshape(-1, 3)
            med, sd = np.median(ring, axis=0), ring.std(axis=0) * 0.35
            noise = np.random.default_rng(1).normal(0, 1, (bh, bw, 1)) * sd
            patch = Image.fromarray(np.clip(med + noise, 0, 255).astype(np.uint8))
        else:
            if isinstance(way, tuple):
                dx, dy = round(way[0] * bw), round(way[1] * bh)
            else:
                dx, dy = {2: (0, -bh), -2: (0, bh)}.get(way, (way * bw, 0))
            patch = im.crop((x0 + dx, y0 + dy, x1 + dx, y1 + dy))
        mask = Image.new("L", (bw, bh), 0)
        mask.paste(255, (feather, feather, bw - feather, bh - feather))
        im.paste(patch, (x0, y0), mask.filter(ImageFilter.GaussianBlur(feather * 0.6)))
    return im


def load(name, pid=None):
    im = ImageOps.exif_transpose(Image.open(S / name)).convert("RGB")
    return clone(im, CLONE.get(pid, []))


def crop_frac(im, box):
    w, h = im.size
    l, t, r, b = box
    return im.crop((round(l * w), round(t * h), round(r * w), round(b * h)))


def cap(im, limit=MAX):
    if max(im.size) > limit:
        im.thumbnail((limit, limit), Image.LANCZOS)
    return im


def center_ratio(im, ratio):
    w, h = im.size
    if w / h > ratio:
        nw = round(h * ratio)
        x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w / ratio)
    y = max(0, round((h - nh) * 0.42))
    return im.crop((0, y, w, y + nh))


def main(only=None):
    OUT.mkdir(parents=True, exist_ok=True)
    want = lambda pid: not only or any(pid.startswith(o) for o in only)
    for pid, (name, box) in REAL.items():
        if not want(pid):
            continue
        im = load(name, pid)
        if box:
            im = crop_frac(im, box)
        grade(cap(im), GRADE.get(pid, 1.0)).save(OUT / f"{pid}.jpg", quality=88, optimize=True, progressive=True)
    for pid, (before, after) in PAIRS.items():
        if not want(pid):
            continue
        a = load(after, f"{pid}-after")
        try:
            b, inliers, seen = align(load(before, f"{pid}-before"), a)
        except Exception as e:  # too few matches: keep both frames as shot
            print(pid, "no alignment:", e)
            b, inliers, seen = load(before, f"{pid}-before"), 0, (0, 0, a.width, a.height)
        print(pid, inliers, "matches, photo covers", seen, "of", a.size)
        for label, im in (("before", b), ("after", a)):
            im = cap(center_ratio(im.crop(seen), 4 / 3), 1600)
            im = clone(im, PAIR_CLONE.get(pid, []))
            grade(im, 0.9).save(OUT / f"{pid}-{label}.jpg", quality=86, optimize=True, progressive=True)
    print(len(list(OUT.glob("*.jpg"))), "photos")


if __name__ == "__main__":
    import sys
    main(sys.argv[1:])
