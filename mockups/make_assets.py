#!/usr/bin/env python3
"""Dithered portraits and room backgrounds for the Nucléaire loop.

Portraits are cropped, side-lit, warm-tinted and Floyd-Steinberg dithered.
No mesh warp. Room art is original pixel work in the same VGA palette.
"""

from pathlib import Path

from PIL import Image, ImageEnhance

import make_level_nuc as nuc

ROOT = Path(__file__).resolve().parents[1]
FACE_DIR = ROOT / "public" / "faces"
BG_DIR = ROOT / "public" / "bg"
SRC = Path("/tmp/srcphotos")

FACES = {
    "philippe": (SRC / "philippe.jpg", (180, 40, 1420, 1180)),
    "lepen": (SRC / "lepen.jpg", (200, 80, 1480, 1040)),
    "melenchon": (SRC / "jlm.jpg", (80, 0, 920, 630)),
    "lisnard": (SRC / "lisnard.jpg", (260, 80, 1360, 905)),
}


def make_face(path: Path, box, size=(208, 156)):
    src = Image.open(path).convert("RGB")
    face = src.crop(box)
    face = ImageEnhance.Contrast(face).enhance(1.55)
    face = ImageEnhance.Color(face).enhance(0.55)
    face = face.resize((size[0] * 2, size[1] * 2), Image.Resampling.BOX)
    w, h = face.size
    fp = face.load()
    for y in range(h):
        for x in range(w):
            r, g, b = fp[x, y]
            t = x / max(1, w - 1)
            v = y / max(1, h - 1)
            light = 1.22 - t * 0.72 - max(0, v - 0.55) * 0.25
            mx, mn = max(r, g, b), min(r, g, b)
            if mx - mn < 28 and 70 < mx < 210:
                light *= 0.28
            r = min(255, max(0, int(r * light * 1.12 + 18)))
            g = min(255, max(0, int(g * light * 0.86 + 8)))
            b = min(255, max(0, int(b * light * 0.58)))
            fp[x, y] = (r, g, b)
    face = face.resize(size, Image.Resampling.BOX)
    q = face.quantize(colors=36, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
    return q.convert("RGB")


def canvas():
    img = Image.new("RGB", (nuc.W, nuc.H), nuc.BLK)
    nuc.px = img.load()
    return img


def scene(img):
    return img.crop((0, 0, 320, 160))


def draw_bureau():
    img = canvas()
    vpx, vpy = 168, 52
    for y in range(8, 156):
        for x in range(4, 316):
            if y < vpy:
                z = (vpy - y) / vpy
                col = nuc.mix(x, y, nuc.C(2, 2, 3), nuc.C(8, 6, 5), 0.2 + (1 - z) * 0.3)
            else:
                z = (y - vpy) / (156 - vpy)
                boards = int((x - vpx) / max(4, 6 + z * 14)) & 1
                base = nuc.C(8, 5, 3) if boards else nuc.C(5, 3, 2)
                col = nuc.mix(x, y, nuc.DARK, base, 0.35 + z * 0.5)
            xl = int(nuc.lerp(8, vpx, 0 if y <= vpy else (y - vpy) / (156 - vpy)))
            xr = int(nuc.lerp(312, vpx, 0 if y <= vpy else (y - vpy) / (156 - vpy)))
            if y > vpy and (x < xl or x > xr):
                col = nuc.mix(x, y, nuc.C(6, 4, 3), nuc.C(14, 8, 5), (y - vpy) / 100)
            if y < vpy and abs(x - vpx) > nuc.lerp(20, 140, (vpy - y) / vpy):
                col = nuc.mix(x, y, nuc.C(4, 3, 3), nuc.C(10, 6, 4), 0.4)
            nuc.pset(x, y, col)
    nuc.rect(vpx - 28, 18, 56, 36, nuc.C(2, 3, 6))
    nuc.rect(vpx - 22, 22, 44, 26, nuc.C(4, 6, 12))
    nuc.vline(250, 40, 50, nuc.BR2)
    nuc.rect(236, 36, 22, 8, nuc.BR3)
    nuc.rect(238, 38, 18, 4, nuc.AMBER)
    for y in range(44, 120):
        for x in range(180, 310):
            nuc.pset(x, y, nuc.mix(x, y, nuc.getp(x, y), nuc.BR2, 0.18))
    # side doors
    nuc.bevel(4, 58, 30, 90, nuc.BR1, nuc.BR3, nuc.BR0)
    nuc.rect(10, 66, 16, 70, nuc.C(6, 3, 2))
    nuc.pset(22, 100, nuc.AMBER)
    nuc.text(6, 48, "ARCH.", nuc.CREAM, 40)
    nuc.bevel(286, 58, 30, 90, nuc.BR1, nuc.BR3, nuc.BR0)
    nuc.rect(292, 66, 16, 70, nuc.C(6, 3, 2))
    nuc.pset(304, 100, nuc.AMBER)
    nuc.text(286, 48, "REGIE", nuc.CREAM, 318)
    # desk
    nuc.rect(40, 108, 240, 10, nuc.BR2)
    nuc.hline(40, 108, 240, nuc.BR3)
    nuc.rect(50, 118, 220, 36, nuc.BR1)
    # 2017 clipping
    nuc.rect(78, 112, 96, 36, nuc.PAPER)
    nuc.hline(78, 112, 96, nuc.WHITE)
    nuc.vline(78, 112, 36, nuc.WHITE)
    nuc.text(82, 116, "JUIL 2017", nuc.C(8, 4, 2), 170)
    nuc.text(82, 126, "Des centrales", nuc.C(20, 8, 6), 172)
    nuc.text(82, 136, "fermeront.", nuc.C(20, 8, 6), 172)
    # flyer, decoy
    nuc.rect(16, 28, 40, 52, nuc.C(36, 8, 8))
    nuc.hline(16, 28, 40, nuc.WHITE)
    nuc.text(20, 36, "FIERTE", nuc.WHITE, 56)
    nuc.text(20, 48, "ATOME", nuc.C(58, 50, 20), 58)
    nuc.hline(0, 0, 320, nuc.BR2)
    nuc.hline(0, 159, 320, nuc.BLK)
    return scene(img)


def draw_archives():
    img = canvas()
    for y in range(160):
        for x in range(320):
            col = nuc.C(5, 3, 2) if (x // 16 + y // 20) % 2 == 0 else nuc.C(3, 2, 1)
            if y > 118:
                col = nuc.C(8, 5, 3) if (x // 10) % 2 == 0 else nuc.C(6, 3, 2)
            nuc.pset(x, y, col)
    # shelves
    for sy in (22, 58):
        nuc.rect(40, sy, 200, 32, nuc.C(12, 7, 3))
        nuc.hline(40, sy, 200, nuc.BR3)
        nuc.hline(40, sy + 31, 200, nuc.BR0)
    # booklet, blue
    nuc.rect(48, 78, 46, 34, nuc.C(6, 10, 28))
    nuc.hline(48, 78, 46, nuc.C(16, 22, 40))
    nuc.text(52, 84, "2050", nuc.WHITE, 96)
    nuc.text(52, 96, "UN DEFI", nuc.C(40, 46, 50), 96)
    # ASN folder
    nuc.rect(108, 82, 58, 30, nuc.C(28, 22, 12))
    nuc.text(112, 86, "ASN", nuc.C(10, 4, 2), 164)
    nuc.text(112, 96, "EDF", nuc.C(28, 8, 6), 164)
    # 2026 clipping
    nuc.rect(176, 80, 72, 34, nuc.PAPER)
    nuc.text(180, 84, "13 OCT", nuc.C(8, 4, 2), 246)
    nuc.text(180, 94, "IL LE", nuc.C(20, 8, 6), 248)
    nuc.text(180, 104, "DEFEND.", nuc.C(20, 8, 6), 248)
    # slogan poster
    nuc.rect(250, 18, 60, 48, nuc.C(10, 28, 16))
    nuc.text(254, 24, "PROPRE", nuc.WHITE, 312)
    nuc.text(256, 36, "POUR", nuc.C(50, 56, 30), 312)
    nuc.text(256, 48, "TOUS", nuc.C(50, 56, 30), 312)
    # door back
    nuc.bevel(4, 50, 28, 96, nuc.BR1, nuc.BR3, nuc.BR0)
    nuc.rect(10, 58, 14, 76, nuc.C(6, 3, 2))
    nuc.pset(20, 96, nuc.AMBER)
    nuc.text(4, 40, "BUREAU", nuc.CREAM, 40)
    # Marc, a clerk, not a portrait
    nuc.rect(268, 108, 28, 8, nuc.BR2)
    for yy in range(96, 112):
        for xx in range(274, 292):
            if (xx - 282) ** 2 + (yy - 104) ** 2 < 40:
                nuc.pset(xx, yy, nuc.C(48, 34, 24))
    nuc.rect(276, 112, 16, 22, nuc.C(8, 12, 22))
    nuc.pset(278, 102, nuc.BLK)
    nuc.pset(286, 102, nuc.BLK)
    nuc.hline(0, 0, 320, nuc.BR2)
    nuc.hline(0, 159, 320, nuc.BLK)
    return scene(img)


def draw_regie():
    img = canvas()
    for y in range(160):
        for x in range(320):
            col = nuc.C(2, 2, 4)
            if y > 120:
                col = nuc.C(4, 3, 3)
            nuc.pset(x, y, col)
    # cable run
    nuc.hline(40, 16, 240, nuc.BR0)
    # chart
    nuc.rect(36, 24, 70, 52, nuc.C(8, 10, 8))
    nuc.rect(44, 52, 8, 16, nuc.C(20, 36, 16))
    nuc.rect(56, 40, 8, 28, nuc.C(20, 36, 16))
    nuc.rect(68, 32, 8, 36, nuc.AMBER)
    nuc.rect(80, 44, 8, 24, nuc.C(20, 36, 16))
    nuc.text(40, 64, "2037", nuc.CREAM, 110)
    # RTE sheet
    nuc.rect(36, 84, 70, 32, nuc.PAPER)
    nuc.text(40, 88, "PLUS DE", nuc.C(8, 4, 2), 110)
    nuc.text(40, 100, "MOITIE", nuc.C(20, 8, 6), 110)
    # TV bezel, screen left dark for the still
    nuc.bevel(112, 22, 120, 86, nuc.BR1, nuc.BR3, nuc.BR0)
    nuc.rect(118, 28, 108, 68, nuc.BLK)
    nuc.rect(160, 98, 20, 6, nuc.RED)
    # Léa, a technician, not a portrait
    for yy in range(86, 102):
        for xx in range(232, 250):
            if (xx - 240) ** 2 + (yy - 94) ** 2 < 36:
                nuc.pset(xx, yy, nuc.C(52, 38, 28))
    nuc.rect(234, 102, 14, 24, nuc.C(18, 10, 16))
    nuc.hline(236, 90, 10, nuc.C(16, 8, 6))
    nuc.pset(236, 94, nuc.BLK)
    nuc.pset(244, 94, nuc.BLK)
    # doors
    nuc.bevel(4, 48, 26, 100, nuc.BR1, nuc.BR3, nuc.BR0)
    nuc.rect(8, 56, 14, 80, nuc.C(6, 3, 2))
    nuc.pset(18, 96, nuc.AMBER)
    nuc.text(6, 38, "DOS", nuc.CREAM, 36)
    nuc.bevel(286, 48, 28, 100, nuc.C(28, 8, 6), nuc.C(48, 16, 10), nuc.C(12, 2, 2))
    nuc.rect(292, 56, 14, 80, nuc.C(16, 4, 4))
    nuc.pset(302, 96, nuc.AMBER)
    nuc.text(286, 38, "FACE", nuc.RED, 318)
    nuc.hline(0, 0, 320, nuc.BR2)
    nuc.hline(0, 159, 320, nuc.BLK)
    return scene(img)


def draw_defeat_bill():
    img = canvas()
    for y in range(160):
        for x in range(320):
            nuc.pset(x, y, nuc.BLK if (x + y) % 17 else nuc.C(2, 1, 1))
    nuc.vline(54, 78, 28, nuc.CREAM)
    nuc.rect(48, 104, 14, 6, nuc.BR2)
    for dy, col in ((0, nuc.WHITE), (1, nuc.AMBER), (2, nuc.AMBER), (3, nuc.RED), (4, nuc.RED)):
        nuc.pset(54, 70 + dy, col)
        nuc.pset(53, 72 + dy, nuc.AMBER)
        nuc.pset(55, 72 + dy, nuc.AMBER)
    for y in range(60, 150):
        for x in range(20, 120):
            d = abs(x - 54) / 70 + abs(y - 90) / 80
            if d < 1:
                nuc.pset(x, y, nuc.mix(x, y, nuc.getp(x, y), nuc.BR2, 0.45 * (1 - d)))
    nuc.bevel(110, 18, 150, 120, nuc.PAPER, nuc.WHITE, nuc.BR1)
    nuc.rect(114, 22, 142, 112, nuc.C(52, 46, 32))
    nuc.text(124, 30, "FACTURE", nuc.C(20, 6, 4), 250)
    nuc.hline(124, 40, 80, nuc.C(20, 6, 4))
    nuc.text(124, 50, "Lumière", nuc.C(16, 8, 4), 250)
    nuc.text(124, 66, "9 999 €", nuc.C(28, 6, 4), 250)
    nuc.text(124, 84, "à payer", nuc.C(16, 8, 4), 250)
    nuc.text(124, 108, "tout de suite", nuc.C(16, 8, 4), 250)
    nuc.rect(70, 112, 16, 18, nuc.BR2)
    for yy in range(100, 112):
        for xx in range(72, 86):
            if (xx - 78) ** 2 + (yy - 106) ** 2 < 36:
                nuc.pset(xx, yy, nuc.C(48, 32, 22))
    nuc.pset(75, 105, nuc.BLK)
    nuc.pset(81, 105, nuc.BLK)
    nuc.hline(75, 109, 6, nuc.BLK)
    nuc.pset(56, 108, nuc.CREAM)
    nuc.pset(56, 110, nuc.CREAM)
    nuc.text(16, 18, "Tu y as cru.", nuc.WHITE, 110)
    return scene(img)


def draw_defeat_green():
    img = canvas()
    for y in range(160):
        for x in range(320):
            v = 0.15 + (1 - abs(x - 160) / 200) * 0.25
            nuc.pset(x, y, nuc.mix(x, y, nuc.BLK, nuc.C(4, 18, 6), v))
    # giant bulb
    cx, cy, rx, ry = 168, 70, 36, 44
    for y in range(cy - ry, cy + ry):
        for x in range(cx - rx, cx + rx):
            if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1:
                nuc.pset(x, y, nuc.C(16, 48, 18) if (x + y) % 3 else nuc.C(30, 58, 24))
    nuc.rect(156, 112, 24, 10, nuc.BR2)
    nuc.hline(158, 116, 20, nuc.BR0)
    # silly bulb face, an object, not a person
    nuc.pset(156, 66, nuc.BLK)
    nuc.pset(180, 66, nuc.BLK)
    nuc.hline(160, 80, 16, nuc.BLK)
    nuc.pset(160, 78, nuc.BLK)
    nuc.pset(175, 78, nuc.BLK)
    # tiny fellow with a candle, slapstick
    nuc.vline(70, 100, 16, nuc.CREAM)
    nuc.pset(70, 96, nuc.AMBER)
    nuc.pset(70, 94, nuc.WHITE)
    for yy in range(104, 116):
        for xx in range(78, 92):
            if (xx - 84) ** 2 + (yy - 110) ** 2 < 28:
                nuc.pset(xx, yy, nuc.C(48, 32, 22))
    nuc.rect(80, 116, 12, 16, nuc.BR2)
    nuc.pset(81, 110, nuc.BLK)
    nuc.pset(88, 110, nuc.BLK)
    nuc.hline(82, 114, 5, nuc.BLK)
    nuc.text(16, 16, "Tu y as cru.", nuc.C(40, 58, 30), 140)
    nuc.text(16, 132, "Même l'ampoule", nuc.C(20, 40, 16), 140)
    nuc.text(16, 142, "a compris.", nuc.C(20, 40, 16), 140)
    return scene(img)


def main():
    FACE_DIR.mkdir(parents=True, exist_ok=True)
    BG_DIR.mkdir(parents=True, exist_ok=True)
    sheet = Image.new("RGB", (208 * 4, 156), (0, 0, 0))
    for i, (name, (path, box)) in enumerate(FACES.items()):
        face = make_face(path, box)
        face.save(FACE_DIR / f"{name}.png")
        sheet.paste(face, (i * 208, 0))
        print(name, face.size, len(face.getcolors(maxcolors=256) or []))
    sheet.resize((208 * 4 * 2, 156 * 2), Image.Resampling.NEAREST).save("/tmp/faces_sheet.png")
    rooms = {
        "bureau": draw_bureau,
        "archives": draw_archives,
        "regie": draw_regie,
        "defeat": draw_defeat_bill,
        "defeat2": draw_defeat_green,
    }
    for name, fn in rooms.items():
        im = fn()
        im.save(BG_DIR / f"{name}.png")
        print(name, im.size, len(im.getcolors(maxcolors=512) or []))


if __name__ == "__main__":
    main()
