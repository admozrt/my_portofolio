"""
Pengolahan awan yang dipakai bersama oleh pembangun gerbang dan pembangun
gambar preview. Ditaruh terpisah supaya keduanya tidak pernah berbeda
perlakuan: kalau chroma-key atau tint-nya digeser, keduanya ikut bergeser.
"""
from PIL import Image, ImageChops, ImageFilter

SRC = 'design-src/saufi-clouds/'

# Tiga sumber terbersih. clouds6 kelabu keruh saat didesaturasi dari merah muda
# matahari terbenam, clouds9 tepinya berbercak coklat, clouds8 terlalu tipis
# setelah langit birunya dibuang.
PUFFS = ['clouds2.png', 'clouds3.png', 'clouds4.png']


def prep(name):
    """Satu gumpalan: langit birunya dibuang, warnanya didinginkan."""
    im = Image.open(SRC + name).convert('RGBA')
    r, g, b, a = im.split()

    # Piksel yang birunya jauh lebih kuat daripada merahnya adalah langit,
    # bukan awan.
    sky = ImageChops.subtract(b, r).point(lambda v: 0 if v > 26 else 255)
    a = ImageChops.multiply(a, sky.filter(ImageFilter.GaussianBlur(2.4)))

    # Desaturasi lalu tint dingin, supaya sumber yang warnanya berbeda-beda
    # mendarat di palet dusty blue yang sama.
    gray = Image.merge('RGB', (r, g, b)).convert('L')
    out = Image.merge('RGB', (
        gray.point(lambda v: min(255, int(v * 0.94 + 12))),
        gray.point(lambda v: min(255, int(v * 0.96 + 14))),
        gray.point(lambda v: min(255, int(v * 1.00 + 20))),
    )).convert('RGBA')
    out.putalpha(a)
    return out.crop(out.getbbox() or (0, 0, im.width, im.height))


def feather(im, soft=0.16):
    """Tepi memudar ke luar. Tanpa ini gumpalannya bertepi keras dan tumpukan
    beberapa gumpalan terbaca sebagai tempelan, bukan massa awan."""
    w, h = im.size
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
            px[x, y] = int(255 * sx * (ty * ty * (3 - 2 * ty)))
    im.putalpha(ImageChops.multiply(im.getchannel('A'), mask))
    return im


def sources():
    return [feather(prep(n)) for n in PUFFS]
