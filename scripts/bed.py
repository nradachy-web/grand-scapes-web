"""Build the mulch picker frames from one real photo of Rob's work (IMG_2355, April
2022: a tree bed in a new gray block wall, finished in black mulch).

Only the mulch changes. A soft matte says how much of each pixel is black mulch,
from color alone (mulch is dark and neutral; the trunk, the statue, the stone and
the wall are not) inside a generous outline of the bed. The mulch keeps its own
light and texture: its lightness is lifted and given the hue of brown or red mulch
in Lab, so every chip and shadow is the photo's own.

Output: full frames in src/assets/panel (bed-black, bed-brown, bed-red), so the
picker can cross fade whole pictures that line up to the pixel.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps
from skimage import color

ROOT = Path(__file__).resolve().parent.parent
SRC = sorted((ROOT / "_source/drive/jpg").glob("*_1fWf3k_*.jpg"))[0]
OUT = ROOT / "src" / "assets" / "panel"
W = 1600
# the main bed, as fractions of the frame
BED = [(0.098, 0.392), (0.2, 0.358), (0.3, 0.333), (0.4, 0.318), (0.5, 0.302), (0.6, 0.306), (0.7, 0.302), (0.772, 0.302), (0.788, 0.335), (0.8, 0.4), (0.81, 0.47), (0.82, 0.53), (0.826, 0.565), (0.78, 0.588), (0.7, 0.606), (0.6, 0.62), (0.5, 0.626), (0.4, 0.588), (0.3, 0.548), (0.2, 0.494), (0.12, 0.418)]
# name: lightness lift, lightness gain, a*, b*
MATS = {"brown": (17, 1.05, 11, 19), "red": (16, 1.0, 30, 22)}


def smooth(x, lo, hi):
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


def main():
    im = ImageOps.exif_transpose(Image.open(SRC)).convert("RGB")
    im = im.resize((W, round(W * im.height / im.width)), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255
    lab = color.rgb2lab(a)
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    chroma = np.hypot(A, B)
    poly = Image.new("L", im.size, 0)
    ImageDraw.Draw(poly).polygon([(x * im.width, y * im.height) for x, y in BED], fill=255)
    poly = np.asarray(poly.filter(ImageFilter.GaussianBlur(6))).astype(np.float32) / 255
    # mulch: dark and neutral
    m = (1 - smooth(L, 18, 34)) * (1 - smooth(chroma, 9, 18)) * poly
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32) / 255
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / "bed-black.jpg", quality=88, optimize=True, progressive=True)
    for name, (lift, gain, ta, tb) in MATS.items():
        nL = lift + L * gain
        # chips that catch light take more color, deep gaps stay dark
        k = np.clip((nL - 8) / 30, 0.25, 1.2)
        nA, nB = ta * k, tb * k
        out = np.stack([L * (1 - m) + nL * m, A * (1 - m) + nA * m, B * (1 - m) + nB * m], -1)
        rgb = np.clip(color.lab2rgb(out), 0, 1)
        Image.fromarray((rgb * 255 + 0.5).astype(np.uint8)).save(OUT / f"bed-{name}.jpg", quality=88, optimize=True, progressive=True)
    print("bed frames", im.size)


if __name__ == "__main__":
    main()
