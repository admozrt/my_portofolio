"""
Bangun ulang gerbang awan dalam dua ukuran.

Aturan yang menentukan ukurannya: rasio slot di halaman = 0.525 x (lebar
viewport / tinggi viewport), jadi 0.242 di 375x812 dan 0.84 di 1440x900.
Karena `background-size: cover`, rasio aset harus selalu <= rasio slot
tersempit di rentangnya supaya yang terpangkas hanya atas-bawah dan tepi
bergelombang di sisi dalam tidak pernah tersentuh.
"""
import random, math
from PIL import Image, ImageFilter, ImageChops

SRC = 'design-src/saufi-clouds/'
# Tiga sumber terbersih. clouds6 kelabu keruh saat didesaturasi, clouds9
# tepinya berbercak coklat, clouds8 terlalu tipis setelah langit birunya
# dibuang.
PUFFS = ['clouds2.png', 'clouds3.png', 'clouds4.png']


def prep(name):
    """Satu gumpalan: langit birunya dibuang, warnanya didinginkan, tepinya
    dilembutkan supaya tidak terlihat seperti guntingan."""
    im = Image.open(SRC + name).convert('RGBA')
    r, g, b, a = im.split()
    # chroma-key biru: piksel yang birunya jauh lebih kuat daripada merahnya
    # adalah langit, bukan awan.
    diff = ImageChops.subtract(b, r)
    sky = diff.point(lambda v: 0 if v > 26 else 255)
    sky = sky.filter(ImageFilter.GaussianBlur(2.4))
    a = ImageChops.multiply(a, sky)

    # desaturasi sebagian lalu tint dingin, supaya semua sumber yang warnanya
    # berbeda-beda mendarat di palet dusty blue yang sama.
    gray = Image.merge('RGB', (r, g, b)).convert('L')
    tinted = Image.merge('RGB', (
        gray.point(lambda v: min(255, int(v * 0.94 + 12))),
        gray.point(lambda v: min(255, int(v * 0.96 + 14))),
        gray.point(lambda v: min(255, int(v * 1.00 + 20))),
    ))
    out = tinted.convert('RGBA')
    out.putalpha(a)
    return out.crop(out.getbbox() or (0, 0, im.width, im.height))


def feather(im, soft=0.16):
    """Tepi memudar ke luar. Tanpa ini gumpalannya bertepi keras dan tumpukan
    beberapa gumpalan terbaca sebagai tempelan, bukan massa awan."""
    w, h = im.size
    a = im.getchannel('A')
    mask = Image.new('L', (w, h), 0)
    px = mask.load()
    fx, fy = max(1, int(w * soft)), max(1, int(h * soft))
    for x in range(w):
        tx = min(1.0, min(x, w - 1 - x) / fx)
        # smoothstep, bukan linear: linear meninggalkan garis pinggir yang
        # masih terbaca sebagai batas kotak.
        sx = tx * tx * (3 - 2 * tx)
        for y in range(h):
            ty = min(1.0, min(y, h - 1 - y) / fy)
            sy = ty * ty * (3 - 2 * ty)
            px[x, y] = int(255 * sx * sy)
    im.putalpha(ImageChops.multiply(a, mask))
    return im


def build(w, h, seed, inner):
    """inner: 'right' untuk gerbang kiri (tepi dalamnya di kanan), 'left'
    untuk gerbang kanan."""
    rnd = random.Random(seed)
    canvas = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    srcs = [feather(prep(n)) for n in PUFFS]

    # Tiga kolom dengan goyangan, bukan grid rapi: grid lurus langsung
    # terbaca sebagai pola.
    cols, rows = 3, 16
    for row in range(rows):
        for col in range(cols):
            s = srcs[rnd.randrange(len(srcs))].copy()
            if rnd.random() < 0.5:
                s = s.transpose(Image.FLIP_LEFT_RIGHT)
            pw = int(w * rnd.uniform(0.46, 0.72))
            ph = max(1, int(pw * s.height / s.width))
            s = s.resize((pw, ph), Image.LANCZOS)

            cx = int((col + 0.5) / cols * w + rnd.uniform(-0.16, 0.16) * w)
            cy = int((row + 0.5) / rows * h + rnd.uniform(-0.5, 0.5) * h / rows)

            # Tepi dalam dibuat bergelombang supaya pertemuan kedua gerbang
            # terbaca sebagai awan, bukan sebagai potongan lurus.
            wave = math.sin(row / rows * math.pi * 5 + seed) * 0.05 * w
            if inner == 'right':
                limit = w - int(wave)
                cx = min(cx, limit)
            else:
                limit = int(wave)
                cx = max(cx, limit)

            layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
            layer.paste(s, (cx - pw // 2, cy - ph // 2), s)
            canvas = Image.alpha_composite(canvas, layer)

    # Sisi luar dibiarkan pekat, sisi dalam sedikit lebih tipis supaya kedua
    # gerbang membaur waktu bertemu.
    return canvas


def save(im, path, q, blur):
    """Gerbang ini massa awan buram yang berada paling jauh di belakang dan
    cepat dilewati, jadi tidak ada detail tajam yang perlu dipertahankan.
    Sedikit blur sebelum encode memangkas ukuran berkas jauh lebih banyak
    daripada yang terlihat hilang. Alpha ikut diturunkan karena justru kanal
    alpha yang paling mahal di sini."""
    im.filter(ImageFilter.GaussianBlur(blur)).save(
        path, 'WEBP', quality=q, alpha_quality=42, method=6
    )


for tag, (w, h) in {'sm': (420, 1750), 'lg': (900, 3060)}.items():
    for side, inner, seed in (('left', 'right', 11), ('right', 'left', 29)):
        img = build(w, h, seed, inner)
        p = f'public/saufi/cloud-gate-{side}-{tag}.webp'
        save(img, p, 42 if tag == 'sm' else 40, 1.0 if tag == 'sm' else 1.8)
        print(p, img.size)
