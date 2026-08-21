"""
Gambar preview OG: cover halaman, bukan hiasan awan generik.

Isinya sama dengan yang dilihat tamu waktu undangan pertama dibuka. Dibangun
dari PNG sumber, bukan dari berkas gerbang yang sudah jadi: gerbang itu
dikompresi berat dan kanal alfanya terkuantisasi sampai membentuk cincin
kontur yang langsung kelihatan begitu diperbesar.

1200x630 karena itu rasio kartu besar. JPEG, bukan WebP: sebagian crawler
tidak membaca WebP untuk og:image.
"""
import random
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

sys.path.insert(0, 'design-src')
from cloudlib import sources  # noqa: E402

FONTS = 'C:/Windows/Fonts/'

# Dua keluaran dari komposisi yang sama:
#   preview.jpg  1200x630 melintang, untuk og:image (rasio kartu besar)
#   cover.jpg     720x900 tegak, untuk kartu di halaman daftar undangan yang
#                 memangkas ke 4:5 — kalau yang melintang dipakai di sana,
#                 crop tengahnya memotong nama mempelai jadi "ufi & Afif".
W = H = 0


def gradient():
    """Latar panggung, gradien yang sama dengan .saufiwed-stage."""
    im = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(im)
    stops = [(0.0, (250, 251, 253)), (0.44, (233, 239, 246)), (1.0, (214, 224, 236))]
    for y in range(H):
        t = y / (H - 1)
        for i in range(len(stops) - 1):
            a, ca = stops[i]
            b, cb = stops[i + 1]
            if a <= t <= b:
                k = (t - a) / (b - a)
                d.line([(0, y), (W, y)], fill=tuple(int(ca[j] + (cb[j] - ca[j]) * k) for j in range(3)))
                break
    return im


def clouds(bg, seed=7):
    """Satu hamparan menerus, bukan dua gerbang ditempel berdampingan: dua
    gerbang saling menindih di tengah dan tindihannya terbaca sebagai kotak
    yang lebih terang."""
    rnd = random.Random(seed)
    srcs = sources()
    cols, rows = 5, 4
    for row in range(rows):
        for col in range(cols):
            s = srcs[rnd.randrange(len(srcs))].copy()
            if rnd.random() < 0.5:
                s = s.transpose(Image.FLIP_LEFT_RIGHT)
            pw = int(W * rnd.uniform(0.22, 0.34))
            ph = max(1, int(pw * s.height / s.width))
            s = s.resize((pw, ph), Image.LANCZOS)

            cx = int((col + 0.5) / cols * W + rnd.uniform(-0.10, 0.10) * W)
            cy = int((row + 0.5) / rows * H + rnd.uniform(-0.6, 0.6) * H / rows)

            layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            layer.paste(s, (cx - pw // 2, cy - ph // 2), s)
            bg.paste(Image.alpha_composite(bg.convert('RGBA'), layer).convert('RGB'), (0, 0))

    # Sedikit blur dan nilai gelapnya diangkat. Sumbernya foto awan hasil
    # guntingan, dan pada ukuran sekecil ini sisa tepi gelapnya terbaca sebagai
    # cipratan, bukan awan. Preview ini juga selalu tampil kecil di linimasa,
    # jadi tidak ada detail yang benar-benar hilang.
    bg = bg.filter(ImageFilter.GaussianBlur(1.1))
    return bg.point(lambda v: int(118 + v * 0.54))


def fog(bg):
    """Kabut radial di belakang teks, habis sebelum tepi seperti di cover."""
    mask = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(mask)
    for i in range(90, 0, -1):
        k = i / 90
        rx, ry = int(W * 0.42 * k), int(H * 0.48 * k)
        d.ellipse([W // 2 - rx, H // 2 - ry, W // 2 + rx, H // 2 + ry], fill=int(242 * (1 - k) ** 1.4))
    bg.paste(Image.new('RGB', (W, H), (250, 252, 255)), (0, 0), mask)
    return bg


def text(bg, scale):
    d = ImageDraw.Draw(bg)

    def f(name, size):
        return ImageFont.truetype(FONTS + name, max(9, int(size * scale)))

    def center(s, font, y, fill, spacing=0):
        if not spacing:
            d.text((W / 2, y), s, font=font, fill=fill, anchor='ma')
            return
        widths = [d.textlength(c, font=font) for c in s]
        x = (W - (sum(widths) + spacing * (len(s) - 1))) / 2
        for c, w in zip(s, widths):
            d.text((x, y), c, font=font, fill=fill)
            x += w + spacing

    # Cormorant Garamond tidak terpasang di mesin ini. Georgia memang sudah
    # tertulis sebagai fallback di stack font halamannya, jadi preview dan
    # halaman tetap sekeluarga.
    # Posisinya dihitung sebagai jarak dari titik tengah, lalu diskalakan —
    # bukan sebagai persen tinggi kanvas. Persen membuat blok teksnya ikut
    # melar begitu kanvasnya jadi tegak, dan jarak antara nama dan garis
    # pemisah menganga.
    mid = H / 2

    def y(offset):
        return mid + offset * scale

    center('UNDANGAN PERNIKAHAN', f('segoeui.ttf', 17), y(-139), (126, 140, 160), spacing=max(1, int(7 * scale)))
    center('Saufi & Afifah', f('georgia.ttf', 96), y(-83), (34, 49, 66))
    d.line([(W / 2 - 40 * scale, y(57)), (W / 2 + 40 * scale, y(57))], fill=(185, 198, 216), width=1)
    center('10 . 09 . 2026', f('segoeui.ttf', 19), y(83), (108, 124, 146), spacing=max(1, int(6 * scale)))
    center('MARTAPURA, KALIMANTAN SELATAN', f('segoeui.ttf', 15), y(125), (143, 166, 196), spacing=max(1, int(4 * scale)))
    return bg


def build(w, h, scale, out):
    global W, H
    W, H = w, h
    img = text(fog(clouds(gradient())), scale)
    img.save(out, 'JPEG', quality=88, optimize=True, progressive=True)
    print('saved', out, img.size)


build(1200, 630, 1.0, 'public/saufi/preview.jpg')
build(720, 900, 0.62, 'public/saufi/cover.jpg')
