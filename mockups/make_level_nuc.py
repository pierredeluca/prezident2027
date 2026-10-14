#!/usr/bin/env python3
"""Five 320x200 stills for the Nucléaire level, KGB VGA manner.

Photo: Remi Jouan, File:Edouard Philippe (2).JPG, CC BY 4.0, Wikimedia Commons.
The portrait is cropped, contrast-lit, sepia-tinted, downscaled and dithered.
UI pixels are drawn crisp, in the same limited palette.
"""

import urllib.request
from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parent
W, H = 320, 200
PHOTO_URL = "https://upload.wikimedia.org/wikipedia/commons/7/75/Edouard_Philippe_%282%29.JPG"
PHOTO_CACHE = Path("/tmp/srcphotos/philippe.jpg")

def C(r, g, b):
    return (max(0, min(63, r)) * 4, max(0, min(63, g)) * 4, max(0, min(63, b)) * 4)

BLK = C(0, 0, 0)
WHITE = C(58, 56, 50)
INK = C(46, 40, 30)
RED = C(46, 8, 6)
AMBER = C(54, 36, 10)
BR0 = C(10, 6, 2)
BR1 = C(18, 10, 4)
BR2 = C(28, 16, 6)
BR3 = C(40, 24, 10)
BR4 = C(52, 34, 14)
CREAM = C(50, 42, 28)
PAPER = C(48, 42, 30)
DARK = C(4, 3, 2)

BAYER = (
    (0, 8, 2, 10),
    (12, 4, 14, 6),
    (3, 11, 1, 9),
    (15, 7, 13, 5),
)

px = None

def pset(x, y, c):
    if c is None:
        return
    x, y = int(x), int(y)
    if 0 <= x < W and 0 <= y < H:
        px[x, y] = c

def getp(x, y):
    x, y = int(x), int(y)
    if 0 <= x < W and 0 <= y < H:
        return px[x, y]
    return BLK

def rect(x, y, w, h, c):
    for yy in range(int(y), int(y + h)):
        for xx in range(int(x), int(x + w)):
            pset(xx, yy, c)

def hline(x, y, w, c):
    for xx in range(int(x), int(x + w)):
        pset(xx, y, c)

def vline(x, y, h, c):
    for yy in range(int(y), int(y + h)):
        pset(x, yy, c)

def mix(x, y, a, b, t):
    if t <= 0:
        return a
    if t >= 1:
        return b
    return b if (BAYER[int(y) & 3][int(x) & 3] < t * 16) else a

def lerp(a, b, t):
    return a + (b - a) * t

def bevel(x, y, w, h, fill, lit, dark, inset=False):
    rect(x, y, w, h, fill)
    a, b = (dark, lit) if inset else (lit, dark)
    hline(x, y, w, a)
    vline(x, y, h, a)
    if h > 1:
        hline(x, y + h - 1, w, b)
    if w > 1:
        vline(x + w - 1, y, h, b)

FONT = {
    " ": ["000", "000", "000", "000", "000", "000", "000"],
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "B": ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
    "C": ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
    "D": ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
    "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    "F": ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
    "G": ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
    "H": ["10001", "10001", "11111", "10001", "10001", "10001", "10001"],
    "I": ["111", "010", "010", "010", "010", "010", "111"],
    "J": ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
    "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    "M": ["10001", "11011", "10101", "10001", "10001", "10001", "10001"],
    "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    "P": ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
    "Q": ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
    "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
    "V": ["10001", "10001", "10001", "10001", "01010", "01010", "00100"],
    "a": ["00000", "00000", "01110", "00001", "01111", "10001", "01111"],
    "b": ["10000", "10000", "11110", "10001", "10001", "10001", "11110"],
    "c": ["00000", "00000", "01110", "10000", "10000", "10001", "01110"],
    "d": ["00001", "00001", "01111", "10001", "10001", "10001", "01111"],
    "e": ["00000", "00000", "01110", "10001", "11111", "10000", "01110"],
    "f": ["00110", "01001", "01000", "11100", "01000", "01000", "01000"],
    "g": ["00000", "00000", "01111", "10001", "01111", "00001", "01110"],
    "h": ["10000", "10000", "11110", "10001", "10001", "10001", "10001"],
    "i": ["010", "000", "110", "010", "010", "010", "111"],
    "j": ["001", "000", "011", "001", "001", "101", "010"],
    "l": ["110", "010", "010", "010", "010", "010", "111"],
    "m": ["00000", "00000", "11010", "10101", "10101", "10101", "10001"],
    "n": ["00000", "00000", "11110", "10001", "10001", "10001", "10001"],
    "o": ["00000", "00000", "01110", "10001", "10001", "10001", "01110"],
    "p": ["00000", "00000", "11110", "10001", "11110", "10000", "10000"],
    "q": ["00000", "00000", "01111", "10001", "10001", "01111", "00001"],
    "r": ["0000", "0000", "1011", "1100", "1000", "1000", "1000"],
    "s": ["00000", "00000", "01111", "10000", "01110", "00001", "11110"],
    "t": ["0100", "0100", "1110", "0100", "0100", "0101", "0010"],
    "u": ["00000", "00000", "10001", "10001", "10001", "10001", "01111"],
    "v": ["00000", "00000", "10001", "10001", "10001", "01010", "00100"],
    "x": ["00000", "00000", "10001", "01010", "00100", "01010", "10001"],
    "y": ["00000", "00000", "10001", "10001", "01111", "00001", "01110"],
    "z": ["00000", "00000", "11111", "00010", "00100", "01000", "11111"],
    "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
    "1": ["0010", "0110", "0010", "0010", "0010", "0010", "0111"],
    "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
    "3": ["01110", "10001", "00001", "00110", "00001", "10001", "01110"],
    "4": ["00100", "01100", "10100", "10100", "11111", "00100", "00100"],
    "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
    "6": ["01110", "10000", "11110", "10001", "10001", "10001", "01110"],
    "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
    "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
    "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
    ".": ["0", "0", "0", "0", "0", "0", "1"],
    ",": ["00", "00", "00", "00", "00", "01", "10"],
    "'": ["10", "10", "01", "00", "00", "00", "00"],
    '"': ["11", "11", "11", "00", "00", "00", "00"],
    "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
    ":": ["010", "010", "000", "000", "000", "010", "010"],
    "!": ["1", "1", "1", "1", "1", "0", "1"],
    "?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"],
    ">": ["100", "110", "111", "110", "100", "000", "000"],
    "é": ["00100", "00010", "01110", "10001", "11111", "10000", "01110"],
    "è": ["00100", "01000", "01110", "10001", "11111", "10000", "01110"],
    "ê": ["00100", "01010", "01110", "10001", "11111", "10000", "01110"],
    "à": ["00100", "01000", "01110", "00001", "01111", "10001", "01111"],
    "â": ["00100", "01010", "01110", "00001", "01111", "10001", "01111"],
    "ç": ["00000", "00000", "01110", "10000", "10000", "01110", "00100"],
    "€": ["01111", "10000", "11110", "10000", "01111", "00000", "00000"],
}

def text(x, y, s, color, limit=319):
    cx = x
    for ch in s:
        glyph = FONT.get(ch)
        if glyph is None:
            raise SystemExit(f"missing glyph {ch!r} in {s!r}")
        gw = len(glyph[0])
        if cx + gw > limit:
            raise SystemExit(f"overflow at {cx}+{gw}: {s!r}")
        for row, bits in enumerate(glyph):
            for col, bit in enumerate(bits):
                if bit == "1":
                    pset(cx + col, y + row, color)
        cx += gw + 1
    return cx

def lines(x, y, rows, color, step=9, limit=319):
    for i, s in enumerate(rows):
        text(x, y + i * step, s, color, limit)

# ---------- photo ----------
def ensure_photo():
    if PHOTO_CACHE.exists() and PHOTO_CACHE.stat().st_size > 100000:
        return
    PHOTO_CACHE.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(PHOTO_URL, headers={"User-Agent": "prezident2027-mockup/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        PHOTO_CACHE.write_bytes(r.read())

def make_face(size):
    """Crop head and shoulders, side-light, sepia, downscale, Floyd-Steinberg."""
    src = Image.open(PHOTO_CACHE).convert("RGB")
    # Shoulders-up, a little below eye line so the head looms. No mesh warp.
    face = src.crop((180, 40, 1420, 1180))
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
            # key light from the upper left, shadow on the right cheek
            light = 1.22 - t * 0.72 - max(0, v - 0.55) * 0.25
            mx, mn = max(r, g, b), min(r, g, b)
            if mx - mn < 28 and 70 < mx < 210:
                light *= 0.28  # grey studio backdrop falls into the room
            r = min(255, max(0, int(r * light * 1.12 + 18)))
            g = min(255, max(0, int(g * light * 0.86 + 8)))
            b = min(255, max(0, int(b * light * 0.58)))
            fp[x, y] = (r, g, b)
    face = face.resize(size, Image.Resampling.BOX)
    q = face.quantize(colors=36, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
    return q.convert("RGB")

def blit(im, x0, y0, fade_right=0):
    w, h = im.size
    ip = im.load()
    for y in range(h):
        for x in range(w):
            c = ip[x, y]
            if fade_right and x > w - fade_right:
                k = (x - (w - fade_right)) / fade_right
                c = mix(x0 + x, y0 + y, c, DARK, k)
            pset(x0 + x, y0 + y, c)

# ---------- bronze bar ----------
def icon_eye(x, y):
    c = BR4
    for i, row in enumerate(("0011100", "0110010", "1101011", "0110010", "0011100")):
        for j, bit in enumerate(row):
            if bit == "1":
                pset(x + j, y + i, c)

def icon_hand(x, y):
    c = BR4
    rect(x + 2, y + 4, 6, 4, c)
    rect(x + 3, y + 1, 2, 4, c)
    rect(x + 5, y, 2, 5, c)

def icon_mouth(x, y):
    hline(x + 1, y + 2, 7, BR4)
    hline(x, y + 3, 9, CREAM)
    hline(x + 1, y + 4, 7, RED)

def icon_key(x, y):
    rect(x, y + 1, 4, 4, BR4)
    rect(x + 1, y + 2, 2, 2, BR0)
    hline(x + 4, y + 3, 5, BR4)
    pset(x + 7, y + 4, BR4)

def icon_door(x, y):
    rect(x + 1, y, 7, 9, BR4)
    rect(x + 2, y + 1, 3, 6, BR0)
    pset(x + 6, y + 5, AMBER)

def draw_bar(caption, clock, icons=True):
    bevel(0, 160, 320, 40, BR1, BR3, BR0)
    hline(1, 161, 318, BR2)
    bevel(4, 166, 92, 28, BR0, BR0, BR3, inset=True)
    if icons:
        for i, fn in enumerate((icon_eye, icon_hand, icon_mouth, icon_key, icon_door)):
            fn(8 + i * 18, 174)
    # location, red, like the reference caption
    text(102, 176, caption, RED, 250)
    bevel(252, 168, 62, 22, BR0, BR0, BR3, inset=True)
    text(258, 174, clock, CREAM, 312)

def hotspot(x0, y0, x1, y1):
    hot = AMBER
    def corner(x, y, dx, dy):
        for i in range(5):
            pset(x + dx * i, y, hot)
            pset(x, y + dy * i, hot)
    corner(x0, y0, 1, 1)
    corner(x1, y0, -1, 1)
    corner(x0, y1, 1, -1)
    corner(x1, y1, -1, -1)

def cursor(x, y):
    arrow = (
        "1.......",
        "11......",
        "121.....",
        "1221....",
        "12221...",
        "122221..",
        "1221221.",
        "121.122.",
        "11..121.",
        "1....11.",
        "......1.",
    )
    for row, bits in enumerate(arrow):
        for col, bit in enumerate(bits):
            if bit == "1":
                pset(x + col, y + row, BLK)
            elif bit == "2":
                pset(x + col, y + row, WHITE)

def dark_room():
    for y in range(160):
        for x in range(320):
            t = y / 160
            side = abs(x - 150) / 180
            pset(x, y, mix(x, y, DARK, BR0, 0.25 + t * 0.35 + side * 0.2))

# ---------- screens ----------
def screen_select():
    dark_room()
    # a pool of lamplight behind the list
    for y in range(18, 150):
        for x in range(28, 292):
            pset(x, y, mix(x, y, getp(x, y), BR1, 0.35))
    bevel(36, 16, 248, 136, BR0, BR0, BR3, inset=True)
    rect(40, 20, 240, 128, C(8, 4, 2))
    text(48, 26, "Choisir un sujet", AMBER, 280)
    hline(48, 36, 120, BR2)
    rows = (
        (48, "L'euro"),
        (60, "L'école"),
        (72, "Le nucléaire"),
        (84, "L'Europe"),
        (96, "Les dépenses"),
    )
    for y, label in rows:
        if label == "Le nucléaire":
            rect(46, y - 2, 220, 11, BR2)
            text(52, y, "> " + label, C(8, 4, 2), 270)
        else:
            text(64, y, label, INK, 270)
    text(48, 118, "Entrée : ouvrir", CREAM, 270)
    draw_bar("Les dossiers", "20:40")

def screen_room():
    # one-point dark office
    vpx, vpy = 168, 52
    for y in range(8, 156):
        for x in range(4, 316):
            if y < vpy:
                z = (vpy - y) / vpy
                col = mix(x, y, C(2, 2, 3), C(8, 6, 5), 0.2 + (1 - z) * 0.3)
            else:
                z = (y - vpy) / (156 - vpy)
                boards = int((x - vpx) / max(4, 6 + z * 14)) & 1
                base = C(8, 5, 3) if boards else C(5, 3, 2)
                col = mix(x, y, DARK, base, 0.35 + z * 0.5)
            # walls outside the floor trapezoid
            xl = int(lerp(8, vpx, 0 if y <= vpy else (y - vpy) / (156 - vpy)))
            xr = int(lerp(312, vpx, 0 if y <= vpy else (y - vpy) / (156 - vpy)))
            if y > vpy and (x < xl or x > xr):
                col = mix(x, y, C(6, 4, 3), C(14, 8, 5), (y - vpy) / 100)
            if y < vpy and abs(x - vpx) > lerp(20, 140, (vpy - y) / vpy):
                col = mix(x, y, C(4, 3, 3), C(10, 6, 4), 0.4)
            pset(x, y, col)
    # back window, night
    rect(vpx - 28, 18, 56, 36, C(2, 3, 6))
    rect(vpx - 22, 22, 44, 26, C(4, 6, 12))
    # desk lamp
    vline(250, 40, 50, BR2)
    rect(236, 36, 22, 8, BR3)
    rect(238, 38, 18, 4, AMBER)
    for y in range(44, 120):
        for x in range(180, 310):
            pset(x, y, mix(x, y, getp(x, y), BR2, 0.18))
    # desk
    rect(40, 108, 240, 10, BR2)
    hline(40, 108, 240, BR3)
    rect(50, 118, 220, 36, BR1)
    # newspaper
    rect(78, 112, 92, 36, PAPER)
    hline(78, 112, 92, WHITE)
    vline(78, 112, 36, WHITE)
    text(84, 116, "FESSENHEIM", C(8, 4, 2), 170)
    text(84, 126, "Le réacteur", C(20, 8, 6), 170)
    text(84, 136, "s'arrête.", C(20, 8, 6), 170)
    hotspot(76, 110, 172, 150)
    cursor(120, 124)
    # frame
    hline(0, 0, 320, BR2)
    hline(0, 159, 320, BLK)
    draw_bar("Bureau de Philippe", "21:05")

def screen_inventory(face):
    dark_room()
    bevel(12, 8, 296, 146, BR2, BR3, BR0)
    rect(16, 12, 288, 138, C(12, 8, 4))
    # video well
    bevel(22, 18, 118, 86, BLK, BR0, BR3, inset=True)
    small = face.resize((110, 78), Image.Resampling.NEAREST)
    blit(small, 26, 22)
    # play triangle, centred on the still
    for i in range(7):
        hline(68, 50 + i, 2 + i, WHITE)
        hline(68, 62 - i, 2 + i, WHITE)
    text(28, 92, "15 jan 2020", AMBER, 140)
    # quote, his words of 15 Jan 2020, shortened
    lines(148, 22, (
        "Il dit, en 2020 :",
        '"Arrêt du premier',
        'réacteur."',
        "",
        "Ce que ça prouve",
        "La centrale",
        "s'arrête.",
    ), CREAM, step=12, limit=300)
    # fix empty line: lines() still draws "" fine
    draw_bar("Les preuves", "21:20")
    # mark the open card on the bar by a small paper icon over slot area
    rect(8, 172, 10, 12, PAPER)
    hline(8, 172, 10, WHITE)

def screen_face(face):
    dark_room()
    # big face, about two thirds of the width, shoulders up
    blit(face, 0, 2, fade_right=28)
    # claim, right column
    lines(214, 8, (
        "Il dit :",
        '"Le nucléaire',
        'est vital."',
    ), WHITE, step=10, limit=316)
    # clue being used
    bevel(206, 48, 108, 62, PAPER, WHITE, BR1)
    rect(208, 50, 104, 58, C(42, 34, 22))
    lines(212, 54, (
        "Preuve",
        "15 jan 2020",
        '"Arrêt du',
        'réacteur."',
    ), C(16, 6, 4), step=10, limit=312)
    # argument gauge
    text(214, 118, "La preuve", CREAM, 316)
    bevel(214, 130, 96, 12, BR0, BR0, BR3, inset=True)
    rect(216, 132, 70, 8, RED)
    rect(286, 132, 22, 8, BR1)
    draw_bar("Face à Philippe", "21:40")

def screen_defeat():
    for y in range(160):
        for x in range(320):
            pset(x, y, BLK if (x + y) % 17 else C(2, 1, 1))
    # candle
    vline(54, 78, 28, CREAM)
    rect(48, 104, 14, 6, BR2)
    # flame
    for dy, col in ((0, WHITE), (1, AMBER), (2, AMBER), (3, RED), (4, RED)):
        pset(54, 70 + dy, col)
        pset(53, 72 + dy, AMBER)
        pset(55, 72 + dy, AMBER)
    # warm pool
    for y in range(60, 150):
        for x in range(20, 120):
            d = abs(x - 54) / 70 + abs(y - 90) / 80
            if d < 1:
                pset(x, y, mix(x, y, getp(x, y), BR2, 0.45 * (1 - d)))
    # giant bill
    bevel(110, 18, 150, 120, PAPER, WHITE, BR1)
    rect(114, 22, 142, 112, C(52, 46, 32))
    text(124, 30, "FACTURE", C(20, 6, 4), 250)
    hline(124, 40, 80, C(20, 6, 4))
    text(124, 50, "Lumière", C(16, 8, 4), 250)
    text(124, 66, "9 999 €", C(28, 6, 4), 250)
    text(124, 84, "à payer", C(16, 8, 4), 250)
    text(124, 108, "tout de suite", C(16, 8, 4), 250)
    # little round fellow, slapstick, not a portrait
    rect(70, 112, 16, 18, BR2)
    for yy in range(100, 112):
        for xx in range(72, 86):
            if (xx - 78) ** 2 + (yy - 106) ** 2 < 36:
                pset(xx, yy, C(48, 32, 22))
    pset(75, 105, BLK)
    pset(81, 105, BLK)
    hline(75, 109, 6, BLK)
    # wax drip
    pset(56, 108, CREAM)
    pset(56, 110, CREAM)
    lines(16, 18, ("Tu y as cru.",), WHITE, limit=100)
    draw_bar("Dans le noir", "--:--", icons=True)

def main():
    global px
    ensure_photo()
    face = make_face((208, 156))
    screens = (
        ("01", screen_select),
        ("02", screen_room),
        ("03", lambda: screen_inventory(face)),
        ("04", lambda: screen_face(face)),
        ("05", screen_defeat),
    )
    for num, fn in screens:
        img = Image.new("RGB", (W, H), BLK)
        px = img.load()
        fn()
        colours = {px[x, y] for y in range(H) for x in range(W)}
        if len(colours) > 256:
            raise SystemExit(f"{num} uses {len(colours)} colours")
        big = img.resize((1280, 800), Image.Resampling.NEAREST)
        out = ROOT / f"level_nuc_{num}_1280x800.png"
        big.save(out)
        print(num, "colours", len(colours), out.name)

if __name__ == "__main__":
    main()
