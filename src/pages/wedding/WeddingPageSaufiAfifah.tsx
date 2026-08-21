import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, CalendarPlus, Instagram, Send, Sparkles } from 'lucide-react';
import { SEOHead } from '../../components/ui/SEOHead';
import './WeddingPageSaufiAfifah.css';

/* ─── CONFIG ──────────────────────────────────────────────────────── */

/* Akad 06:30 WITA. Kalimantan Selatan itu UTC+8, bukan +7 seperti Jawa;
   salah satu jam kalau ditulis WIB. */
const WEDDING_DATE = new Date('2026-09-10T06:30:00+08:00');

const GROOM_FIRST = 'Saufi';
const BRIDE_FIRST = 'Afifah';
const GROOM_FULL = 'Ahmad Saufi Anwar';
const BRIDE_FULL = 'Siti Nur Afifah';
const DATE_LABEL = 'Kamis, 10 September 2026';
const DATE_SHORT = '10 . 09 . 2026';

const GROOM_IG = 'a.noire_s';
const BRIDE_IG = 'afifahzern.anwar';

/* Akad dan resepsi di alamat yang sama, jadi alamatnya ditulis sekali di atas
   dan kedua blok acara cukup memuat nama acara serta jamnya. */
const VENUE_NAME = 'Kediaman Mempelai Wanita';
const VENUE_ADDRESS =
  'Jln. Sekumpul Gg. Taufik No. 39A, depan gerbang Kubah Guru Sekumpul (Cilmall Snack), Martapura, Kab. Banjar, Kalimantan Selatan.';
const MAP_LINK = 'https://maps.app.goo.gl/WQfgeDbNKDB9vSE19';
/* Tautan yang diberikan bentuknya tautan pendek, dan tautan pendek tidak bisa
   dipakai sebagai src iframe. Embed-nya dibangun dari alamatnya sendiri; cara
   ini tidak butuh kunci API. */
const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=' +
  encodeURIComponent('Jln. Sekumpul Gg. Taufik No. 39A, Martapura, Kabupaten Banjar, Kalimantan Selatan') +
  '&output=embed';
/* 06:30 WITA = 22:30 UTC hari sebelumnya. Jam berakhir dipatok 12:00 WITA
   karena resepsi "sampai selesai" tidak punya jam pasti, sedangkan acara di
   kalender wajib punya. */
const CALENDAR_LINK =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Saufi+%26+Afifah&dates=20260909T223000Z/20260910T040000Z&location=' +
  encodeURIComponent('Jln. Sekumpul Gg. Taufik No. 39A, Martapura, Kalimantan Selatan');

/* `number` yang dikelompokkan hanya untuk dibaca mata; yang disalin ke papan
   klip adalah `raw`, tanpa spasi, supaya bisa langsung ditempel di aplikasi
   bank tanpa perlu dibersihkan dulu. */
const BANK = { label: 'Bank BNI', number: '1622 910 813', raw: '1622910813', holder: '' };
const GIFT_ADDRESS = '';
const GIFT_RECIPIENT = '';

/* Foto mempelai. Bingkai berornamen menumpuk di atas slot ini; kosongkan
   string untuk memakai inisial sebagai penggantinya. */
const BRIDE_PHOTO = '';
const GROOM_PHOTO = '';

const STATION_LABELS = ['Cover', 'Pembukaan', 'Tanggal', 'Lokasi', 'Profil', 'RSVP', 'Gift', 'Penutup'];

/* Aset dirujuk dari sini, bukan dari CSS: webpack mencoba me-resolve
   url(/saufi/...) di dalam berkas CSS sebagai modul dan gagal, sedangkan
   string di TSX diteruskan apa adanya ke folder public. */
/*
  Awan sungguhan dipakai untuk massa besar (foto WebP), sedangkan bentuk yang
  butuh lubang tembus pandang di tengah tetap SVG: gerbang lengkung, bingkai
  foto, dan bingkai peta. Foto tidak bisa punya lubang bersih tanpa masking,
  dan masking mahal di layer yang di-repaint tiap frame scroll.
*/
const ART = {
  frame: 'url(/saufi/cloud-frame.svg)',
  mapFrame: 'url(/saufi/map-frame.svg)',
} as const;

/*
  Gerbang punya dua ukuran. Rasio slotnya = 0.525 x (lebar viewport / tinggi
  viewport), jadi di ponsel tegak ia jauh lebih ramping (0.24) daripada di
  layar lebar (0.84). Satu berkas tidak bisa melayani keduanya: dengan
  `cover`, aset 760x1560 kehilangan separuh lebarnya di ponsel — termasuk tepi
  bergelombang di tengah yang justru bikin dua awan terbaca menyatu.

  Kedua URL dititipkan sebagai custom property, lalu CSS yang memilih lewat
  media query. Gaya inline selalu mengalahkan media query, jadi menulis
  `backgroundImage` langsung dari sini tidak bisa ditukar per lebar layar.
  Nilai custom property yang tidak terpakai tidak pernah diunduh browser.
*/
const GATE = {
  l: { '--gate-sm': 'url(/saufi/cloud-gate-left-sm.webp)', '--gate-lg': 'url(/saufi/cloud-gate-left-lg.webp)' },
  r: { '--gate-sm': 'url(/saufi/cloud-gate-right-sm.webp)', '--gate-lg': 'url(/saufi/cloud-gate-right-lg.webp)' },
} as const;


/*
  Awan yang menempel pada kartu. Karena ikut di dalam pembungkus stasiun, ia
  bergerak, memudar, dan menyusut persis bersama kartunya, jadi tidak mungkin
  melayang menutupi teks seperti waktu masih jadi layer bebas.

  Rasio tiap berkas ikut didaftarkan di sini. Sebelumnya semua awan dipaksa
  masuk kotak 3:2 dengan `background-size: contain`, padahal rasio aslinya
  1.667, 1.442, dan 2.222 — `cloud-drift` jadi menyisakan 32.5% ruang kosong,
  16% di atas dan 16% di bawah, sehingga awan yang ditulis "menempel sudut"
  sebenarnya mengambang jauh dari sudut itu.
*/
const CLOUD = {
  bank: { art: 'url(/saufi/cloud-bank.webp)', ar: 980 / 588 },
  column: { art: 'url(/saufi/cloud-column.webp)', ar: 900 / 624 },
  drift: { art: 'url(/saufi/cloud-drift.webp)', ar: 1200 / 540 },
} as const;

interface CardCloud {
  src: keyof typeof CLOUD;
  /** Sudut tempat awan menyembul dari balik kartu. */
  spot: 'tl' | 'tc' | 'tr' | 'bl' | 'br';
  /** Lebar, dalam persen lebar kartu. Tingginya mengikuti rasio aslinya. */
  size: string;
  flip?: boolean;
}

/*
  Hanya tiga sumber terbersih yang dipakai. Tiga lainnya dibuang setelah dilihat
  hasil render-nya: clouds6 aslinya merah muda matahari terbenam dan berubah
  kelabu keruh saat didesaturasi, clouds9 tepinya berbercak coklat, clouds8
  terlalu tipis setelah langit birunya dibuang. Variasi kalah penting daripada
  awan yang benar-benar terbaca sebagai awan.

  Ukurannya lebih kecil daripada sebelumnya karena letterbox-nya sudah hilang:
  angka yang sama sekarang menghasilkan awan yang benar-benar selebar itu.
*/
const CARD_CLOUDS: Record<number, CardCloud[]> = {
  1: [{ src: 'bank', spot: 'tl', size: '46%' }],
  2: [
    { src: 'column', spot: 'tr', size: '44%' },
    { src: 'bank', spot: 'bl', size: '42%', flip: true },
  ],
  3: [{ src: 'drift', spot: 'tc', size: '58%' }],
  4: [
    { src: 'bank', spot: 'tl', size: '40%', flip: true },
    { src: 'column', spot: 'tr', size: '42%' },
  ],
  5: [{ src: 'bank', spot: 'tr', size: '42%' }],
  6: [{ src: 'drift', spot: 'tr', size: '48%' }],
  7: [
    { src: 'column', spot: 'tl', size: '40%', flip: true },
    { src: 'bank', spot: 'br', size: '44%' },
  ],
};

/* Batas kamera. Layer yang melewati NEAR_FADE mulai memudar saat dilewati,
   yang lebih jauh dari FAR_IN belum muncul sama sekali. */
const NEAR_FADE = 300;
const NEAR_MAX = 420;
const FAR_IN = -1500;
const FAR_FULL = -800;

/*
  Perpindahan antar section. Satu gerakan = satu langkah, dianimasikan sendiri;
  halamannya sendiri tidak menggulir sama sekali.
*/
const SLIDE_MS = 720;
/* Ekor inersia trackpad masih berdatangan setelah animasi selesai. Tanpa jeda
   ini, satu usapan melompati beberapa section sekaligus. */
const SLIDE_COOLDOWN = 120;
const WHEEL_MIN = 4;
const SWIPE_MIN = 45;

/* easeInOutCubic. Ease-out cocok untuk gerak yang MENGIKUTI jari; lompatan yang
   dipicu satu gerakan harus berangkat pelan juga, kalau tidak terasa tersentak. */
const EASE = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const CONFETTI_PALETTE = ['#FFFFFF', '#DCE6F2', '#8FA6C4', '#C9D6E6', '#EFE3D8', '#B9C6D8'];

/* ─── TIPE ────────────────────────────────────────────────────────── */

interface Countdown {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

interface Wish {
  name: string;
  text: string;
}

interface Layer {
  el: HTMLElement;
  z: number;
  /** Transform awal tanpa translateZ, dipasang ulang tiap frame. */
  base: string;
  station: number | null;
}

interface Tilt {
  el: HTMLElement;
  rx: number;
  ry: number;
  tx: number;
  ty: number;
  lift: number;
  tLift: number;
}

interface Bit {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  col: string;
  life: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Satu stasiun: pembungkus yang dikuasai kamera, awan yang menempel di
 * sudut-sudutnya, lalu kartunya sendiri.
 *
 * Awan ditaruh sebagai saudara kartu, bukan anak kartu. Kartu punya latar
 * sendiri, jadi anak dengan z-index negatif justru tetap tergambar di atas
 * latar itu dan akan menutupi teks. Sebagai saudara yang berada lebih dulu di
 * DOM, awannya dijamin selalu di belakang.
 */
const Station: React.FC<{
  index: number;
  z: number;
  width: string;
  dark?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ index, z, width, dark, style, children }) => (
  <div
    className="saufiwed-screen"
    data-station={index}
    data-z={z}
    style={{ width, transform: 'translate(-50%, -50%) translateZ(0)' }}
  >
    {(CARD_CLOUDS[index] ?? []).map((c, i) => (
      <span
        key={i}
        aria-hidden="true"
        className={`saufiwed-cardcloud saufiwed-cardcloud--${c.spot}`}
        style={
          {
            backgroundImage: CLOUD[c.src].art,
            width: c.size,
            /* Kotaknya dibuat serasio berkasnya, jadi gambarnya mengisi penuh
               tanpa menyisakan ruang transparan yang menggeser posisinya. */
            '--ar': String(CLOUD[c.src].ar),
            /* Pembalikan lewat `scale`, bukan `transform`, karena `transform`
               sudah dikuasai animasi hanyutnya. Ketiganya properti terpisah
               yang dikomposisi berurutan, jadi tidak saling menimpa. */
            scale: c.flip ? '-1 1' : undefined,
            '--dur': `${18 + i * 7}s`,
            '--delay': `${i * -5}s`,
          } as React.CSSProperties
        }
      />
    ))}
    <div className={`saufiwed-card${dark ? ' saufiwed-card--dark' : ''}`} style={style}>
      {children}
    </div>
  </div>
);

/**
 * Kredit pembuat, sama seperti undangan lain. Dipakai di dua tempat: cover dan
 * kartu penutup. Halaman ini satu panggung sticky setinggi layar, jadi tidak
 * punya "bawah halaman" tempat footer biasa berdiri — ia ikut di dalam kartu.
 */
const Credit: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <footer className="saufiwed-footer">
    {/* Di cover cukup kreditnya saja. Baris "Dibuat dengan" milik penutup,
        tempat ucapan terima kasih memang pada tempatnya. */}
    {!compact && (
      <div>
        Dibuat dengan &hearts; &middot; {GROOM_FIRST} &amp; {BRIDE_FIRST}
      </div>
    )}
    <a
      className="saufiwed-footer__credit"
      href="https://dirakhmat.app"
      target="_blank"
      rel="noopener noreferrer"
    >
      by <u>Dirakhmat</u>
    </a>
  </footer>
);

/* ─── KOMPONEN ────────────────────────────────────────────────────── */

export const WeddingPageSaufiAfifah: React.FC = () => {
  const [searchParams] = useSearchParams();
  const guest = searchParams.get('to') || 'Tamu Undangan';

  const [cd, setCd] = useState<Countdown | null>(null);
  const [active, setActive] = useState(0);
  const [name, setName] = useState('');
  const [attend, setAttend] = useState<'' | 'yes' | 'no'>('');
  const [guests, setGuests] = useState('1');
  const [message, setMessage] = useState('');
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [sent, setSent] = useState(false);
  const [bcaCopied, setBcaCopied] = useState(false);
  const [addrCopied, setAddrCopied] = useState(false);

  const worldRef = useRef<HTMLDivElement | null>(null);
  const doorLRef = useRef<HTMLDivElement | null>(null);
  const doorRRef = useRef<HTMLDivElement | null>(null);
  const petalsRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  const layersRef = useRef<Layer[]>([]);
  const stopsRef = useRef<number[]>([]);
  const tiltsRef = useRef<Tilt[]>([]);
  /* Kamera tidak lagi diturunkan dari posisi scroll. Inilah sumber kebenarannya. */
  const camRef = useRef(0);
  /* Progres sibakan gerbang, 0 di cover dan 1 begitu meninggalkannya. */
  const gateRef = useRef(0);
  const idxRef = useRef(0);
  const tweenRaf = useRef(0);
  const lockRef = useRef(false);
  const unlockRef = useRef(0);
  const spinRaf = useRef(0);
  const confRaf = useRef(0);
  const bitsRef = useRef<Bit[]>([]);
  const dprRef = useRef(1);
  const firedRef = useRef<{ gate?: boolean; close?: boolean }>({});
  const activeRef = useRef(0);
  const reduceRef = useRef(false);

  /* ── Hitung mundur ── */
  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, WEDDING_DATE.getTime() - Date.now());
      setCd({
        days: Math.floor(d / 86400000),
        hours: Math.floor(d / 3600000) % 24,
        mins: Math.floor(d / 60000) % 60,
        secs: Math.floor(d / 1000) % 60,
      });
    };
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, []);

  /* ── Kanvas konfeti ── */
  const sizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = c.clientWidth * dpr;
    c.height = c.clientHeight * dpr;
    dprRef.current = dpr;
  }, []);

  const burst = useCallback(
    (nx: number, ny: number, count: number) => {
      if (reduceRef.current) return;
      const c = canvasRef.current;
      if (!c) return;
      sizeCanvas();
      const ctx = c.getContext('2d');
      if (!ctx) return;
      const w = c.clientWidth;
      const h = c.clientHeight;

      bitsRef.current = bitsRef.current.concat(
        Array.from({ length: count }, () => ({
          x: nx * w + (Math.random() - 0.5) * w * 0.34,
          y: ny * h + (Math.random() - 0.5) * h * 0.1,
          vx: (Math.random() - 0.5) * 4.4,
          vy: -Math.random() * 7 - 1.6,
          w: 4 + Math.random() * 6,
          h: 6 + Math.random() * 8,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.22,
          col: CONFETTI_PALETTE[(Math.random() * CONFETTI_PALETTE.length) | 0],
          life: 0,
        }))
      );

      if (confRaf.current) return;
      const step = () => {
        ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
        ctx.clearRect(0, 0, w, h);
        bitsRef.current = bitsRef.current.filter((b) => b.y < h + 60 && b.life < 460);
        bitsRef.current.forEach((b) => {
          b.life += 1;
          b.vy += 0.15;
          b.vx *= 0.996;
          b.x += b.vx;
          b.y += b.vy;
          b.rot += b.vr;
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(b.rot);
          ctx.globalAlpha = Math.max(0, 1 - b.life / 460);
          ctx.fillStyle = b.col;
          ctx.beginPath();
          ctx.ellipse(0, 0, b.w / 2, (b.h / 2) * (0.55 + 0.45 * Math.abs(Math.cos(b.rot))), 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        if (bitsRef.current.length) {
          confRaf.current = requestAnimationFrame(step);
        } else {
          ctx.clearRect(0, 0, w, h);
          confRaf.current = 0;
        }
      };
      confRaf.current = requestAnimationFrame(step);
    },
    [sizeCanvas]
  );

  /* ── Tilt kartu mempelai ── */
  const spin = useCallback(() => {
    if (spinRaf.current || !tiltsRef.current.length) return;
    const step = () => {
      let moving = false;
      tiltsRef.current.forEach((t) => {
        t.rx += (t.tx - t.rx) * 0.16;
        t.ry += (t.ty - t.ry) * 0.16;
        t.lift += (t.tLift - t.lift) * 0.16;
        if (
          Math.abs(t.tx - t.rx) > 0.02 ||
          Math.abs(t.ty - t.ry) > 0.02 ||
          Math.abs(t.tLift - t.lift) > 0.005
        ) {
          moving = true;
        }
        t.el.style.transform = `rotateX(${t.rx.toFixed(2)}deg) rotateY(${t.ry.toFixed(
          2
        )}deg) translateY(${(-t.lift * 5).toFixed(2)}px)`;
      });
      spinRaf.current = moving ? requestAnimationFrame(step) : 0;
    };
    spinRaf.current = requestAnimationFrame(step);
  }, []);

  /* ── Kamera ── */

  /*
    Dulu ini membaca posisi scroll tiap kali dipanggil. Sekarang murni menulis:
    `cam` dan `gate` sudah disiapkan oleh tween, jadi tidak ada satu pun
    pembacaan tata letak di sini — dan saat diam fungsi ini tidak dipanggil
    sama sekali.
  */
  const frame = useCallback(() => {
    const layers = layersRef.current;
    if (!layers.length) return;

    const cam = camRef.current;
    const gate = gateRef.current;

    let bestIdx = 0;
    let bestDist = Infinity;

    layers.forEach((l) => {
      const eff = l.z + cam;
      const z = Math.min(eff, NEAR_MAX);
      let op = 1;
      if (eff > NEAR_FADE) op = Math.max(0, 1 - (eff - NEAR_FADE) / (NEAR_MAX - NEAR_FADE));
      else if (eff < FAR_FULL) op = Math.max(0, (eff - FAR_IN) / (FAR_FULL - FAR_IN));
      l.el.style.transform = `${l.base ? `${l.base} ` : ''}translateZ(${z.toFixed(1)}px)`;
      l.el.style.opacity = op.toFixed(3);
      if (l.station !== null) {
        const dist = Math.abs(eff + 90);
        l.el.style.pointerEvents = dist < 200 ? 'auto' : 'none';
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = l.station;
        }
      }
    });

    /*
      Gerbang awan menyibak saat meninggalkan cover. Awan tidak punya engsel,
      jadi keduanya bergeser ke samping sambil sedikit membesar dan menipis,
      bukan berputar seperti daun pintu.
    */
    const open = 1 - Math.pow(1 - gate, 3);
    [doorLRef.current, doorRRef.current].forEach((el, i) => {
      if (!el) return;
      const eff = -620 + cam;
      const z = Math.min(eff, NEAR_MAX);
      let op = 1 - open * 0.85;
      if (eff > NEAR_FADE) {
        op = Math.min(op, Math.max(0, 1 - (eff - NEAR_FADE) / (NEAR_MAX - NEAR_FADE)));
      }
      const shift = (i === 0 ? -1 : 1) * 58 * open;
      const grow = 1 + 0.18 * open;
      el.style.transform = `translateZ(${z.toFixed(1)}px) translateX(${shift.toFixed(
        2
      )}%) scale(${grow.toFixed(3)})`;
      el.style.opacity = op.toFixed(3);
    });

    if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - gate * 4));

    if (gate > 0.55 && !firedRef.current.gate) {
      firedRef.current.gate = true;
      burst(0.5, 0.42, 90);
    }
    if (bestIdx === stopsRef.current.length - 1 && bestDist < 200 && !firedRef.current.close) {
      firedRef.current.close = true;
      burst(0.5, 0.32, 130);
    }
    if (bestIdx !== activeRef.current) {
      activeRef.current = bestIdx;
      setActive(bestIdx);
    }

    /* Tilt kartu mempelai TIDAK dipanggil dari sini. Ia digerakkan oleh
       pointermove-nya sendiri, dan memanggil spin() tiap frame kamera hanya
       melahirkan satu rAF yang langsung mati tanpa mengerjakan apa pun. */
  }, [burst]);

  /* Kunci dilepas setelah animasi plus jeda pendek, bukan tepat saat animasi
     selesai — lihat SLIDE_COOLDOWN. */
  const release = useCallback(() => {
    if (unlockRef.current) window.clearTimeout(unlockRef.current);
    unlockRef.current = window.setTimeout(() => {
      lockRef.current = false;
      unlockRef.current = 0;
    }, SLIDE_COOLDOWN);
  }, []);

  /** Geser kamera ke section ke-i dengan satu tween. Dipakai semua sumber input
   *  maupun titik navigasi, jadi gerakannya selalu sama. */
  const animateTo = useCallback(
    (i: number) => {
      const stops = stopsRef.current;
      if (!stops.length) return;
      const next = Math.min(stops.length - 1, Math.max(0, i));
      if (next === idxRef.current && !tweenRaf.current) return;

      lockRef.current = true;
      const from = camRef.current;
      const to = stops[next];
      const gFrom = gateRef.current;
      const gTo = next === 0 ? 0 : 1;
      idxRef.current = next;

      if (tweenRaf.current) cancelAnimationFrame(tweenRaf.current);

      if (reduceRef.current) {
        camRef.current = to;
        gateRef.current = gTo;
        frame();
        release();
        return;
      }

      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / SLIDE_MS);
        const e = EASE(k);
        camRef.current = from + (to - from) * e;
        gateRef.current = gFrom + (gTo - gFrom) * e;
        frame();
        if (k < 1) {
          tweenRaf.current = requestAnimationFrame(step);
        } else {
          tweenRaf.current = 0;
          release();
        }
      };
      tweenRaf.current = requestAnimationFrame(step);
    },
    [frame, release]
  );

  /** Kartu yang lebih tinggi dari layar dihabiskan dulu isinya. Mengembalikan
   *  true kalau gerakan ini seharusnya menggulir kartu, bukan pindah section. */
  const cardTakesScroll = useCallback((dir: number) => {
    const card = worldRef.current?.querySelector<HTMLElement>(
      `.saufiwed-screen[data-station="${idxRef.current}"] .saufiwed-card`
    );
    if (!card || card.scrollHeight <= card.clientHeight + 1) return false;
    return dir > 0
      ? card.scrollTop + card.clientHeight < card.scrollHeight - 1
      : card.scrollTop > 0;
  }, []);

  const advance = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      animateTo(idxRef.current + dir);
    },
    [animateTo]
  );

  /* ── Pemasangan mesin 3D ── */
  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const world = worldRef.current;
    if (world) {
      layersRef.current = Array.from(world.querySelectorAll<HTMLElement>('[data-z]')).map((el) => ({
        el,
        z: parseFloat(el.dataset.z || '0') || 0,
        base: (window.getComputedStyle(el).transform === 'none'
          ? ''
          : el.style.transform.replace(/translateZ\([^)]*\)/, '')
        ).trim(),
        station: el.dataset.station !== undefined ? parseInt(el.dataset.station, 10) : null,
      }));

      stopsRef.current = layersRef.current
        .filter((l) => l.station !== null)
        .sort((a, b) => (a.station as number) - (b.station as number))
        .map((l) => -l.z - 90);

      tiltsRef.current = Array.from(world.querySelectorAll<HTMLElement>('[data-tilt]')).map((el) => ({
        el,
        rx: 0,
        ry: 0,
        tx: 0,
        ty: 0,
        lift: 0,
        tLift: 0,
      }));
    }

    const cleanups: Array<() => void> = [];
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceRef.current) {
      tiltsRef.current.forEach((t) => {
        const onMove = (e: PointerEvent) => {
          const b = t.el.getBoundingClientRect();
          t.tx = -((e.clientY - b.top) / b.height - 0.5) * 10;
          t.ty = ((e.clientX - b.left) / b.width - 0.5) * 12;
          t.tLift = 1;
          spin();
        };
        const onLeave = () => {
          t.tx = 0;
          t.ty = 0;
          t.tLift = 0;
          spin();
        };
        t.el.addEventListener('pointermove', onMove);
        t.el.addEventListener('pointerleave', onLeave);
        cleanups.push(() => {
          t.el.removeEventListener('pointermove', onMove);
          t.el.removeEventListener('pointerleave', onLeave);
        });
      });
    }

    /*
      Halaman ini tidak menggulir, jadi tidak ada event `scroll` untuk didengar.
      Gerakan pengguna ditangkap langsung dan diterjemahkan jadi satu langkah.
    */
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_MIN) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      /* Kartu yang masih bisa digulir dibiarkan menggulir sendiri: tanpa
         preventDefault, peramban yang mengurusnya seperti biasa. */
      if (cardTakesScroll(dir)) return;
      e.preventDefault();
      advance(dir);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
      if (Math.abs(dy) < SWIPE_MIN) return;
      const dir = dy > 0 ? 1 : -1;
      if (cardTakesScroll(dir)) return;
      advance(dir);
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      /* Panah di dalam isian formulir milik isiannya, bukan milik kamera. */
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      let dir = 0;
      let target = -1;
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          dir = 1;
          break;
        case 'ArrowUp':
        case 'PageUp':
          dir = -1;
          break;
        case 'Home':
          target = 0;
          break;
        case 'End':
          target = stopsRef.current.length - 1;
          break;
        default:
          return;
      }
      if (dir && cardTakesScroll(dir)) return;
      e.preventDefault();
      if (target >= 0) animateTo(target);
      else advance(dir);
    };

    /* svh berubah saat bilah alamat peramban seluler muncul atau sembunyi, jadi
       satu frame ulang supaya kartunya tetap di tengah. */
    const onResize = () => {
      sizeCanvas();
      frame();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    sizeCanvas();
    camRef.current = stopsRef.current[0] ?? 0;
    gateRef.current = 0;
    idxRef.current = 0;
    frame();

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      cleanups.forEach((fn) => fn());
      [tweenRaf, spinRaf, confRaf].forEach((r) => {
        if (r.current) cancelAnimationFrame(r.current);
        r.current = 0;
      });
      if (unlockRef.current) window.clearTimeout(unlockRef.current);
    };
  }, [advance, animateTo, cardTakesScroll, frame, sizeCanvas, spin]);

  /* ── Kelopak melayang ── */
  useEffect(() => {
    if (reduceRef.current) return;
    const host = petalsRef.current;
    if (!host) return;
    const timers: number[] = [];
    const id = window.setInterval(() => {
      if (!host.isConnected || host.childElementCount > 26) return;
      const d = document.createElement('div');
      const size = 12 + Math.random() * 14;
      d.style.cssText = [
        'position:absolute',
        `left:${Math.random() * 100}%`,
        `bottom:${Math.random() * 18}%`,
        `width:${size}px`,
        `height:${size * 0.84}px`,
        "background:url('/saufi/puff.svg') no-repeat center / contain",
        `animation:saufiwedFloatUp ${5 + Math.random() * 4}s linear forwards`,
        `--drift:${((Math.random() - 0.5) * 90).toFixed(0)}px`,
        'will-change:transform,opacity',
      ].join(';');
      host.appendChild(d);
      timers.push(window.setTimeout(() => d.remove(), 9500));
    }, 560);
    return () => {
      window.clearInterval(id);
      timers.forEach((t) => window.clearTimeout(t));
      host.replaceChildren();
    };
  }, []);

  /* ── Aksi ── */
  const copy = (text: string, set: (v: boolean) => void) => {
    const done = () => {
      set(true);
      window.setTimeout(() => set(false), 1800);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  };

  const submitRsvp = () => {
    if (!name.trim()) return;
    if (message.trim()) setWishes((prev) => [{ name, text: message }, ...prev]);
    setSent(true);
    setMessage('');
    burst(0.5, 0.5, 70);
  };

  /* ── Render ── */
  return (
    <>
      <SEOHead
        data={{
          title: `Undangan Pernikahan ${GROOM_FIRST} & ${BRIDE_FIRST}`,
          description: `Dengan penuh syukur, kami mengundang Anda menjadi bagian dari hari bahagia kami. ${DATE_LABEL} di Martapura, Kalimantan Selatan.`,
          keywords: [
            'Undangan Pernikahan Digital',
            `${GROOM_FULL} & ${BRIDE_FULL}`,
            'Saufi Afifah',
            'Pernikahan Martapura',
            'Sekumpul',
            'Kabupaten Banjar',
            'Kalimantan Selatan',
            '10 September 2026',
          ],
          author: "Adi Rakhmatullah Ma'arif",
          url: 'https://dirakhmat.app/saufi-afifah',
          image: 'https://dirakhmat.app/saufi/preview.jpg',
          type: 'website',
          schemaType: 'Event',
          /* Tanpa ini mesin pencari membaca halaman undangan sebagai profil
             Person milik pembuatnya — itu bawaan SEOHead kalau schemaType
             tidak diisi, dan jelas bukan isi halaman ini. */
          event: {
            startDate: '2026-09-10T06:30:00+08:00',
            endDate: '2026-09-10T12:00:00+08:00',
            locationName: VENUE_NAME,
            streetAddress: 'Jln. Sekumpul Gg. Taufik No. 39A',
            locality: 'Martapura, Kabupaten Banjar',
            region: 'Kalimantan Selatan',
            organizers: [GROOM_FULL, BRIDE_FULL],
          },
        }}
      />

      <div className="saufiwed-root">
        <section className="saufiwed-rail">
          <div className="saufiwed-stage">
            <div className="saufiwed-world" ref={worldRef}>

              {/* Pintu gerbang */}
              <div className="saufiwed-cloudgate saufiwed-cloudgate--l" ref={doorLRef} data-z="-620" style={{ transform: 'translateZ(0)', ...GATE.l } as React.CSSProperties} />
              <div className="saufiwed-cloudgate saufiwed-cloudgate--r" ref={doorRRef} data-z="-620" style={{ transform: 'translateZ(0)', ...GATE.r } as React.CSSProperties} />

              {/* 01 Cover */}
              <div
                className="saufiwed-screen saufiwed-screen--cover"
                data-station="0"
                data-z="-80"
                style={{ transform: 'translate(-50%, -50%) translateZ(0)' }}
              >
                <div className="saufiwed-eyebrow" style={{ ['--ls' as string]: '0.34em', color: '#3E5470', fontSize: '12px' } as React.CSSProperties}>Kepada {guest}</div>
                <div className="saufiwed-display" style={{ fontSize: 'clamp(38px, 11vw, 64px)', lineHeight: 1.03, color: '#223142' }}>
                  {GROOM_FIRST} <span style={{ fontStyle: 'italic', color: '#3E5470' }}>&amp;</span> {BRIDE_FIRST}
                </div>
                <div className="saufiwed-rule" />
                <div className="saufiwed-eyebrow" style={{ ['--ls' as string]: '0.34em', color: '#6C7C92' } as React.CSSProperties}>{DATE_SHORT}</div>
                <Credit compact />
              </div>

              {/* 02 Pembukaan */}
              <Station
                index={1}
                z={-1500}
                width="min(560px, 88vw)"
                style={{ alignItems: 'center', gap: 13, textAlign: 'center' }}
              >
                  <div className="saufiwed-eyebrow">Bismillahirrahmanirrahim</div>
                  <p className="saufiwed-display" style={{ maxWidth: '26ch', margin: 0, fontSize: 'clamp(19px, 5vw, 27px)', lineHeight: 1.45, color: '#2C3B4C'}}>
                  Dengan penuh syukur, kami mengundang Anda menjadi bagian dari hari bahagia kami.
                </p>
                <div className="saufiwed-stem" />
                <div className="saufiwed-eyebrow" style={{ ['--ls' as string]: '0.28em', color: '#6C7C92' } as React.CSSProperties}>
                  {GROOM_FIRST} &amp; {BRIDE_FIRST}
                </div>
              </Station>

            {/* 03 Tanggal */}
            <Station
              index={2}
              z={-2900}
              width="min(600px, 90vw)"
              dark
              style={{ alignItems: 'center', gap: 14, textAlign: 'center' }}
            >
              <div className="saufiwed-eyebrow">Tanggal Acara</div>
              <div className="saufiwed-display" style={{ fontSize: 'clamp(24px, 6.6vw, 40px)', lineHeight: 1.06 }}>{DATE_LABEL}</div>

              <div className="saufiwed-countdown">
                {[
                  { v: cd ? String(cd.days) : '–', l: 'Hari' },
                  { v: cd ? pad(cd.hours) : '–', l: 'Jam' },
                  { v: cd ? pad(cd.mins) : '–', l: 'Menit' },
                  { v: cd ? pad(cd.secs) : '–', l: 'Detik' },
                ].map((c) => (
                  <div className="saufiwed-cdcell" key={c.l}>
                    <div className="saufiwed-cdnum">{c.v}</div>
                    <div className="saufiwed-cdlabel">{c.l}</div>
                  </div>
                ))}
              </div>

              {/* Akad dan resepsi di alamat yang sama, jadi tempatnya ditulis
                    sekali di bawah dan tiap blok cukup memuat nama acara serta jamnya. */}
              <dl className="saufiwed-events" style={{ margin: 0 }}>
                <div className="saufiwed-event">
                  <dt>Akad Nikah</dt>
                  <dd className="saufiwed-display" style={{ fontSize: 'clamp(19px, 5vw, 23px)' }}>06.30 - 09.00 WITA</dd>
                </div>
                <div className="saufiwed-event">
                  <dt>Resepsi</dt>
                  <dd className="saufiwed-display" style={{ fontSize: 'clamp(19px, 5vw, 23px)' }}>09.30 WITA - selesai</dd>
                </div>
              </dl>
              <div className="saufiwed-body" style={{ fontSize: 12.5 }}>Keduanya di alamat yang sama, Sekumpul, Martapura.</div>

              <a className="saufiwed-pill saufiwed-pill--ghost" href={CALENDAR_LINK} target="_blank" rel="noreferrer">
                Simpan ke Kalender
                <span className="saufiwed-pill__icon" aria-hidden="true">
                  <CalendarPlus />
                </span>
              </a>
            </Station>

            {/* 04 Lokasi */}
            <Station
              index={3}
              z={-4300}
              width="min(560px, 88vw)"
              style={{ gap: 11 }}
            >
              <div className="saufiwed-eyebrow">Lokasi</div>
              <div className="saufiwed-display" style={{ fontSize: 'clamp(24px, 6vw, 34px)', lineHeight: 1.12 }}>{VENUE_NAME}</div>
              <div className="saufiwed-body">{VENUE_ADDRESS}</div>
              {/* Bingkai awan menumpuk di atas peta dengan pointer-events none,
                    supaya petanya tetap bisa digeser dan di-zoom. */}
              <div className="saufiwed-map">
                {MAP_EMBED_URL ? (
                  <iframe
                    className="saufiwed-map__frame"
                    src={MAP_EMBED_URL}
                    title={`Peta lokasi ${VENUE_NAME}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <div className="saufiwed-map__empty">Peta menyusul</div>
                )}
                <span className="saufiwed-map__cloud" aria-hidden="true" style={{ backgroundImage: ART.mapFrame }} />
              </div>

              <a className="saufiwed-pill saufiwed-pill--on" href={MAP_LINK} target="_blank" rel="noreferrer" style={{ alignSelf: 'flex-start' }}>
                Buka Peta
                <span className="saufiwed-pill__icon" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
            </Station>

            {/* 05 Profil */}
            <Station
              index={4}
              z={-5700}
              width="min(620px, 90vw)"
              style={{ gap: 14 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, textAlign: 'center' }}>
                <div className="saufiwed-eyebrow">Mempelai</div>
                <div className="saufiwed-display" style={{ fontSize: 'clamp(20px, 5vw, 30px)' }}>Dua keluarga, satu doa</div>
              </div>

              <div className="saufiwed-people">
                {[
                  {
                    photo: GROOM_PHOTO,
                    initial: 'S',
                    full: GROOM_FULL,
                    role: 'Putra sulung dari 2 bersaudara',
                    parents: 'Putra dari Bapak Anwar Syadat & Ibu Nor Ainah.',
                    ig: GROOM_IG,
                  },
                  {
                    photo: BRIDE_PHOTO,
                    initial: 'A',
                    full: BRIDE_FULL,
                    role: 'Putri bungsu dari 5 bersaudara',
                    /* Ibunda mempelai wanita telah berpulang. Ditulis dengan
                       gelar almarhumah, bukan disamakan begitu saja dengan
                       orang tua yang masih ada. */
                    parents: 'Putri dari Bapak H. M. Jahrani & Almh. Hj. Fatimah.',
                    ig: BRIDE_IG,
                  },
                ].map((p) => (
                  <div className="saufiwed-person" data-tilt key={p.initial}>
                    <div className="saufiwed-portrait">
                      <div className="saufiwed-photo">
                        {p.photo ? (
                          <img src={p.photo} alt={p.full} />
                        ) : (
                          <span className="saufiwed-initial">{p.initial}</span>
                        )}
                      </div>
                      <span className="saufiwed-frame" aria-hidden="true" style={{ backgroundImage: ART.frame }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center', transform: 'translateZ(16px)' }}>
                      <div className="saufiwed-display" style={{ fontSize: 'clamp(18px, 4.6vw, 24px)', lineHeight: 1.1 }}>{p.full}</div>
                      <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#8FA6C4' }}>{p.role}</div>
                      <div className="saufiwed-body" style={{ fontSize: 12.5, lineHeight: 1.5 }}>{p.parents}</div>
                      <a
                        className="saufiwed-pill saufiwed-pill--mini"
                        href={`https://instagram.com/${p.ig}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        @{p.ig}
                        <span className="saufiwed-pill__icon" aria-hidden="true">
                          <Instagram />
                        </span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Station>

            {/* 06 RSVP */}
            <Station
              index={5}
              z={-7100}
              width="min(520px, 88vw)"
              /* Tanpa maxHeight/overflow di sini. Scroll di dalam kartu bersaing
                 dengan scroll halaman yang menggerakkan kamera, dan di layar
                 sentuh keduanya sama-sama gerak vertikal sehingga tidak bisa
                 dibedakan pengguna. Jaring pengamannya dipasang di CSS, hanya
                 untuk layar lebar. */
              style={{ gap: 10 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div className="saufiwed-eyebrow">RSVP</div>
                <div className="saufiwed-display" style={{ fontSize: 'clamp(21px, 5.4vw, 30px)' }}>Konfirmasi kehadiran</div>
                <div className="saufiwed-body" style={{ fontSize: 12.5 }}>Mohon konfirmasi sebelum 1 September 2026.</div>
              </div>

              <label className="saufiwed-field">
                Nama
                <input
                  className="saufiwed-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                />
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className="saufiwed-field">Kehadiran</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`saufiwed-pill${attend === 'yes' ? ' saufiwed-pill--on' : ''}`}
                    onClick={() => {
                      setAttend('yes');
                      burst(0.5, 0.55, 40);
                    }}
                  >
                    Hadir
                  </button>
                  <button
                    type="button"
                    className={`saufiwed-pill${attend === 'no' ? ' saufiwed-pill--on' : ''}`}
                    onClick={() => setAttend('no')}
                  >
                    Tidak hadir
                  </button>
                </div>
              </div>

              <label className="saufiwed-field">
                Jumlah tamu
                <select className="saufiwed-input" value={guests} onChange={(e) => setGuests(e.target.value)}>
                  <option value="1">1 orang</option>
                  <option value="2">2 orang</option>
                  <option value="3">3 orang</option>
                  <option value="4">4 orang</option>
                </select>
              </label>

              <label className="saufiwed-field">
                Ucapan &amp; doa
                <textarea
                  className="saufiwed-input saufiwed-input--area"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis pesan untuk mempelai"
                />
              </label>

              <button type="button" className="saufiwed-pill saufiwed-pill--solid" style={{ alignSelf: 'flex-start' }} onClick={submitRsvp}>
                {sent ? 'Terima kasih' : 'Kirim konfirmasi'}
                <span className="saufiwed-pill__icon" aria-hidden="true">
                  <Send />
                </span>
              </button>

            </Station>

            {/* 07 Wedding Gift */}
            <Station
              index={6}
              z={-8500}
              width="min(580px, 90vw)"
              style={{ gap: 13 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="saufiwed-eyebrow">Wedding Gift</div>
                <div className="saufiwed-display" style={{ fontSize: 'clamp(22px, 5.6vw, 31px)' }}>Tanda kasih</div>
                <div className="saufiwed-body" style={{ fontSize: 14 }}>
                  Kehadiran Anda adalah hadiah terbaik. Bila ingin memberi tanda kasih, kanalnya kami sampaikan menyusul.
                </div>
              </div>

              {BANK.number || GIFT_ADDRESS ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
                  {BANK.number && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 20, background: 'rgba(239,243,249,0.9)', border: '1px solid #DCE4EE' }}>
                      <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8FA6C4' }}>{BANK.label}</div>
                      <div className="saufiwed-display" style={{ fontSize: 24, fontVariantNumeric: 'tabular-nums' }}>{BANK.number}</div>
                      {/* Nama pemilik rekening belum ada. Barisnya dilewati
                            kalau kosong, bukan tampil sebagai baris hampa. */}
                      {BANK.holder && (
                        <div className="saufiwed-body" style={{ fontSize: 12.5 }}>{BANK.holder}</div>
                      )}
                      <button type="button" className="saufiwed-pill" onClick={() => copy(BANK.raw, setBcaCopied)}>
                        {bcaCopied ? 'Tersalin ✓' : 'Salin nomor'}
                      </button>
                    </div>
                  )}
                  {GIFT_ADDRESS && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 20, background: 'rgba(239,243,249,0.9)', border: '1px solid #DCE4EE' }}>
                      <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8FA6C4' }}>Kirim Kado</div>
                      <div style={{ fontSize: 15, lineHeight: 1.6, color: '#2C3B4C' }}>{GIFT_ADDRESS}</div>
                      <div className="saufiwed-body" style={{ fontSize: 13 }}>{GIFT_RECIPIENT}</div>
                      <button type="button" className="saufiwed-pill" onClick={() => copy(GIFT_ADDRESS, setAddrCopied)}>
                        {addrCopied ? 'Tersalin ✓' : 'Salin alamat'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Pola yang sama dengan slot peta: slot yang jujur bilang
                   menyusul, bukan nomor rekening contoh di undangan yang
                   sudah tersebar. */
                <div className="saufiwed-map__empty" style={{ padding: '34px 0' }}>Menyusul</div>
              )}
            </Station>

            {/* 08 Penutup */}
            <Station
              index={7}
              z={-9900}
              width="min(560px, 88vw)"
              dark
              style={{ alignItems: 'center', gap: 12, textAlign: 'center' }}
            >
              <div className="saufiwed-eyebrow">Terima kasih</div>
              <p className="saufiwed-display" style={{ maxWidth: '28ch', margin: 0, fontSize: 'clamp(18px, 4.8vw, 26px)', lineHeight: 1.45 }}>
                Merupakan kehormatan bagi kami apabila Anda berkenan hadir memberikan doa restu.
              </p>
              <div className="saufiwed-stem" />
              <div className="saufiwed-display" style={{ fontSize: 'clamp(25px, 6.6vw, 38px)' }}>
                {GROOM_FIRST} &amp; {BRIDE_FIRST}
              </div>
              <div className="saufiwed-eyebrow" style={{ ['--ls' as string]: '0.3em' } as React.CSSProperties}>Beserta keluarga</div>
              <button type="button" className="saufiwed-pill saufiwed-pill--ghost" style={{ marginTop: 4 }} onClick={() => burst(0.5, 0.35, 140)}>
                Tabur Awan
                <span className="saufiwed-pill__icon" aria-hidden="true">
                  <Sparkles />
                </span>
              </button>

              <Credit />
            </Station>
          </div>

          {/*
              Ucapan yang baru dikirim tampil sebagai lapisan sendiri di bawah
              kartu, bukan di dalamnya. Kalau ditumpuk di dalam kartu, kartunya
              melewati tinggi layar dan butuh scroll sendiri — dan scroll di
              dalam kartu bersaing dengan scroll halaman yang menggerakkan
              kamera. Hanya yang terbaru yang ditampilkan; RSVP ini belum punya
              penyimpanan, jadi isinya memang cuma gema dari yang barusan
              diketik pengunjung.
            */}
          {active === 5 && wishes.length > 0 && (
            <div className="saufiwed-wishlayer">
              <div className="saufiwed-wish">
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3E5470' }}>{wishes[0].name}</div>
                <div className="saufiwed-body" style={{ fontSize: 13, lineHeight: 1.55 }}>{wishes[0].text}</div>
              </div>
            </div>
          )}

          <div className="saufiwed-petals" ref={petalsRef} />
          <canvas className="saufiwed-canvas" ref={canvasRef} />

          <nav className="saufiwed-dots" aria-label="Navigasi bagian undangan">
            {STATION_LABELS.map((label, i) => (
              <button
                key={label}
                type="button"
                className={`saufiwed-dot${i === active ? ' saufiwed-dot--on' : ''}`}
                onClick={() => animateTo(i)}
                aria-label={label}
                aria-current={i === active}
              />
            ))}
          </nav>

          <div className="saufiwed-hint" ref={hintRef}>
            <span>Gulir untuk masuk</span>
            <i />
          </div>
      </div>
    </section >
      </div >
    </>
  );
};
