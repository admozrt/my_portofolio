import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import {
  CATS,
  CAT_ID,
  ID_VID,
  LANG,
  REEL_EMBED,
  SHORT_IDS,
  VIDEOS,
  type FilterId,
  type Lang,
  type Video,
} from '../data/rekomendasyi';
import { THUMBS } from '../data/rekomendasyiThumbs';
import { parseEmbed, seekYouTube, type Embed } from '../utils/videoEmbed';
import './RekomendasyiPage.css';

/**
 * Portofolio kreator "Rekomendasyi" — diterjemahkan dari desain Claude Design
 * "Rekomendasyi Portfolio" ke React. Halaman berdiri sendiri, tidak memakai
 * gaya atau bahasa portofolio utama.
 *
 * Bahasa disimpan di state lokal (bawaan English seperti desainnya), bukan di
 * alamat `/en` — halaman ini memang tidak punya versi English terpisah.
 *
 * Video diputar lewat iframe platformnya (TikTok / Instagram / YouTube),
 * dimuat baru setelah pengunjung menekan play. Entri tanpa tautan yang valid
 * jatuh ke pemutar simulasi dari desain: pola garis dan timer 100ms.
 *
 * Panel detail hanya menampilkan data yang ada (catatan, alasan, bab bersifat
 * opsional), supaya tidak ada isi yang dikarang untuk konten asli.
 */

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Hanken+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
const EMAIL = 'pratiwi.syifa@gmail.com';
/** Jendela tulis Gmail web. Dipakai sebagai ganti `mailto:`, yang diam saja
 *  di perangkat tanpa aplikasi email bawaan (umum di laptop Windows). */
const gmailUrl = (to: string, subject: string, body: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}` +
  `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
const SOCIALS = [
  { name: 'Instagram', handle: '@rekomendasyi', href: 'https://www.instagram.com/rekomendasyi' },
  { name: 'TikTok', handle: '@rekomendasyi', href: 'https://www.tiktok.com/@rekomendasyi' },
  { name: 'YouTube', handle: '@rekomendasyi', href: 'https://www.youtube.com/@rekomendasyi' },
];
const REEL_SECS = 45;
const EASE_DRAWER = 'cubic-bezier(.32,.72,0,1)';
const EASE_OUT = 'cubic-bezier(.23,1,.32,1)';
const HEADER_OFFSET = 56;

const VID: Record<string, Video> = Object.fromEntries(VIDEOS.map((v) => [v.id, v]));
const VIDEO_NO: Record<string, string> = Object.fromEntries(
  VIDEOS.map((v, i) => [v.id, String(i + 1).padStart(2, '0')])
);
const CAT_EN = Object.fromEntries(CATS.map((c) => [c.id, c.label])) as Record<FilterId, string>;

const stripes = (h: number) =>
  `repeating-linear-gradient(135deg, oklch(89% 0.042 ${h}) 0 12px, oklch(86% 0.05 ${h}) 12px 24px)`;
const fmt = (secs: number) => {
  const s = Math.max(0, Math.floor(secs));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
/** Tarikan karet di luar batas carousel: makin jauh, makin berat. */
const rubber = (o: number, d: number, c = 0.55) => (o * d * c) / (d + c * Math.abs(o));
const EMBED: Record<string, Embed | null> = Object.fromEntries(VIDEOS.map((v) => [v.id, parseEmbed(v.embed)]));
const SHORT_VIDEOS = SHORT_IDS.map((id) => VID[id]).filter(Boolean);
const PLATFORM: Record<Embed['provider'], string> = { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube' };
const REEL = parseEmbed(REEL_EMBED);

/** Latar thumbnail: `thumb` di data, lalu gambar di public/rekomendasyi/
 *  (hasil skrip atau taruh manual), lalu thumbnail YouTube, lalu pola garis. */
const posterOf = (v: Video, embed: Embed | null) => v.thumb || THUMBS[v.id] || embed?.poster;
/** Rekap di hero: satu konten per kategori, yang pertama di `VIDEOS` (jadi
 *  yang disematkan didahulukan) dan punya thumbnail. Kategori kosong terlewati. */
const RECAP = CATS.filter((c) => c.id !== 'all')
  .map((c) => VIDEOS.find((v) => v.cat === c.id && posterOf(v, EMBED[v.id])))
  .filter((v): v is Video => Boolean(v));
const SLIDE_SECS = 3;
const RECAP_SECS = RECAP.length * SLIDE_SECS;

const thumbBg = (hue: number, poster?: string) =>
  poster ? `center / cover no-repeat url("${poster}"), ${stripes(hue)}` : stripes(hue);

const filtered = (f: FilterId) => (f === 'all' ? VIDEOS : VIDEOS.filter((v) => v.cat === f));

/** Iframe pemutar platform. Dipasang hanya setelah play ditekan. */
const EmbedFrame = React.forwardRef<HTMLIFrameElement, { embed: Embed; title: string; start?: number }>(
  ({ embed, title, start }, ref) => (
    <iframe
      ref={ref}
      className="rk-embed"
      src={embed.provider === 'youtube' && start ? `${embed.src}&start=${Math.floor(start)}` : embed.src}
      title={title}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  )
);
EmbedFrame.displayName = 'EmbedFrame';

const PlayIcon = () => <span className="rk-play" />;
const PauseIcon = () => (
  <div className="rk-pause">
    <span />
    <span />
  </div>
);

const FlagEN = () => (
  <svg width="20" height="12" viewBox="0 0 60 36" preserveAspectRatio="none" aria-hidden="true">
    <rect width="60" height="36" fill="#FFFFFF" />
    <rect x="25" width="10" height="36" fill="#CE1124" />
    <rect y="13" width="60" height="10" fill="#CE1124" />
  </svg>
);
const FlagID = () => (
  <svg width="20" height="12" viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden="true">
    <rect width="3" height="2" fill="#FFFFFF" />
    <rect width="3" height="1" fill="#CE1126" />
  </svg>
);

interface Drag {
  id: number;
  sx: number;
  sy: number;
  x0: number;
  axis: 'x' | 'y' | null;
  idx: number;
  hist: { x: number; t: number }[];
}

export const RekomendasyiPage: React.FC = () => {
  const [lang, setLang] = useState<Lang>('en');
  const [filter, setFilterState] = useState<FilterId>('all');
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [reelPlaying, setReelPlaying] = useState(false);
  const [reelT, setReelT] = useState(0);
  const [playingShort, setPlayingShort] = useState(-1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  // Pemutar embed: iframe panel detail sudah dimuat?, detik mulai, bab terakhir diklik.
  const [embedOn, setEmbedOn] = useState(false);
  const [embedStart, setEmbedStart] = useState(0);
  const [embedChapter, setEmbedChapter] = useState(-1);
  const [reelEmbedOn, setReelEmbedOn] = useState(false);
  // Rekap hero: waktu berjalan, dijeda pengguna, sedang di-hover, terlihat di layar.
  const [recapT, setRecapT] = useState(0);
  const [recapPaused, setRecapPaused] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [recapHover, setRecapHover] = useState(false);
  const [recapVisible, setRecapVisible] = useState(false);
  const [docVisible, setDocVisible] = useState(true);

  const L = LANG[lang];
  const isId = lang === 'id';

  const reduceRef = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const vpRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const xRef = useRef(0);
  const rafRef = useRef(0);
  const dragRef = useRef<Drag | null>(null);
  const animsRef = useRef<Animation[]>([]);
  const panelAnimRef = useRef<Animation | null>(null);
  const hoverTimer = useRef<number>();
  const copyTimer = useRef<number>();
  const originEl = useRef<HTMLElement | null>(null);
  const originRect = useRef<DOMRect | null>(null);
  const closingRef = useRef(false);
  const scrubbingRef = useRef(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const recapRef = useRef<HTMLDivElement>(null);
  const recapFrameRef = useRef<HTMLDivElement>(null);

  // ---------- Halaman: font, bahasa dokumen, scroll halus ----------

  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    document.head.appendChild(link);

    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    if (!reduceRef.current) root.style.scrollBehavior = 'smooth';

    return () => {
      link.remove();
      root.style.scrollBehavior = prevBehavior;
      root.lang = 'id';
      document.body.style.overflow = '';
      cancelAnimationFrame(rafRef.current);
      clearTimeout(hoverTimer.current);
      clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // ---------- Header: menyusut setelah digulir, sembunyi saat turun ----------

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      // Ambang 6px supaya getaran kecil saat jari berhenti tidak membuat
      // header berkedip muncul-hilang.
      if (Math.abs(y - lastY) > 6) {
        setHeaderHidden(y > lastY && y > 140);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    // Menu hanya untuk layar sempit: kalau layar dilebarkan, tutup.
    const mq = window.matchMedia('(min-width: 721px)');
    const onMq = () => mq.matches && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [menuOpen]);

  // ---------- Pil filter ----------

  const placeInd = useCallback((animate: boolean) => {
    const wrap = pillsRef.current;
    const ind = indRef.current;
    if (!wrap || !ind) return;
    const btn = wrap.querySelector<HTMLElement>(`[data-cat="${filter}"]`);
    if (!btn) return;
    const d = 340;
    ind.style.transition =
      animate && !reduceRef.current
        ? `transform ${d}ms ${EASE_DRAWER}, width ${d}ms ${EASE_DRAWER}, height ${d}ms ${EASE_DRAWER}`
        : 'none';
    ind.style.width = `${btn.offsetWidth}px`;
    ind.style.height = `${btn.offsetHeight}px`;
    ind.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
  }, [filter]);

  // Pindah filter atau bahasa mengubah lebar tombol: indikator digeser ikut.
  const firstPlace = useRef(true);
  useLayoutEffect(() => {
    placeInd(!firstPlace.current);
    firstPlace.current = false;
  }, [placeInd, lang]);

  useEffect(() => {
    // Ukuran tombol baru pasti setelah font web selesai dimuat.
    document.fonts?.ready.then(() => placeInd(false));
  }, [placeInd]);

  const pendingFlip = useRef<Map<string, DOMRect> | null>(null);

  const flip = useCallback((rects: Map<string, DOMRect>) => {
    const grid = gridRef.current;
    if (!grid) return;
    animsRef.current.forEach((a) => a.cancel());
    animsRef.current = [];
    let n = 0;
    grid.querySelectorAll<HTMLElement>('[data-id]').forEach((c) => {
      if (reduceRef.current) {
        animsRef.current.push(c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180 }));
        return;
      }
      const r = c.getBoundingClientRect();
      const p = rects.get(c.dataset.id!);
      if (p) {
        const dx = p.left - r.left;
        const dy = p.top - r.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          animsRef.current.push(
            c.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
              duration: 440,
              easing: EASE_DRAWER,
            })
          );
        }
      } else {
        animsRef.current.push(
          c.animate(
            [{ opacity: 0, transform: 'translateY(10px) scale(.97)' }, { opacity: 1, transform: 'none' }],
            { duration: 340, delay: n++ * 40, easing: EASE_OUT, fill: 'backwards' }
          )
        );
      }
    });
  }, []);

  useLayoutEffect(() => {
    if (!pendingFlip.current) return;
    const rects = pendingFlip.current;
    pendingFlip.current = null;
    flip(rects);
  }, [filter, flip]);

  const setFilter = (id: FilterId) => {
    if (id === filter) return;
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-id]'));
    const rects = new Map(cards.map((c) => [c.dataset.id!, c.getBoundingClientRect()]));
    animsRef.current.forEach((a) => a.cancel());
    animsRef.current = [];
    const keep = new Set(filtered(id).map((v) => v.id));
    const leaving = cards.filter((c) => !keep.has(c.dataset.id!));

    const go = () => {
      pendingFlip.current = rects;
      clearTimeout(hoverTimer.current);
      setHoverId(null);
      setPreviewId(null);
      setFilterState(id);
    };
    if (!leaving.length || reduceRef.current) {
      go();
      return;
    }
    leaving.forEach((c) =>
      animsRef.current.push(
        c.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.96)' }], {
          duration: 150,
          easing: 'ease-out',
          fill: 'forwards',
        })
      )
    );
    animsRef.current[animsRef.current.length - 1].onfinish = go;
  };

  // ---------- Pratinjau saat hover (mouse saja) ----------

  const enter = (id: string, e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(hoverTimer.current);
    setHoverId(id);
    hoverTimer.current = window.setTimeout(() => setPreviewId(id), 260);
  };
  const leave = () => {
    clearTimeout(hoverTimer.current);
    setHoverId(null);
    setPreviewId(null);
  };

  // ---------- Timer pemutar simulasi ----------

  const ticking = (playing && !!openId) || reelPlaying;
  useEffect(() => {
    if (!ticking) return;
    const iv = window.setInterval(() => {
      if (playing && openId) {
        const secs = VID[openId].secs ?? 0;
        setT((prev) => {
          const next = prev + 0.1;
          if (next >= secs) {
            setPlaying(false);
            return secs;
          }
          return next;
        });
      }
      if (reelPlaying) {
        setReelT((prev) => {
          const next = prev + 0.1;
          if (next >= REEL_SECS) {
            setReelPlaying(false);
            return 0;
          }
          return next;
        });
      }
    }, 100);
    return () => clearInterval(iv);
  }, [ticking, playing, openId, reelPlaying]);

  // ---------- Rekap hero ----------

  // Hanya berjalan saat terlihat, tab aktif, tidak di-hover, tidak dijeda, dan
  // panel detail tertutup — timer tidak jalan sia-sia di latar belakang.
  const recapRunning = RECAP.length > 0 && !recapPaused && !recapHover && recapVisible && docVisible && !openId;

  useEffect(() => {
    const el = recapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setRecapVisible(entry.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    const onVis = () => setDocVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    if (!recapRunning) return;
    const iv = window.setInterval(() => setRecapT((prev) => (prev + 0.1) % RECAP_SECS), 100);
    return () => clearInterval(iv);
  }, [recapRunning]);

  const recapIndex = Math.min(RECAP.length - 1, Math.floor(recapT / SLIDE_SECS));
  const recapFrac = (recapT - recapIndex * SLIDE_SECS) / SLIDE_SECS;

  // ---------- Panel detail: mengembang dari thumbnail ----------

  const openDetail = (id: string, e: React.SyntheticEvent<HTMLElement>, origin?: HTMLElement | null) => {
    if (openId) return;
    clearTimeout(hoverTimer.current);
    document.body.style.overflow = 'hidden';
    originEl.current = origin ?? e.currentTarget.querySelector<HTMLElement>('[data-thumb]');
    originRect.current = originEl.current?.getBoundingClientRect() ?? null;
    closingRef.current = false;
    setT(0);
    setPlaying(false);
    setEmbedOn(false);
    setEmbedStart(0);
    setEmbedChapter(-1);
    setPreviewId(null);
    setHoverId(null);
    setOpenId(id);
  };

  const wasOpen = useRef(false);
  useLayoutEffect(() => {
    const isOpen = !!openId;
    if (isOpen && !wasOpen.current) {
      const p = panelRef.current;
      const s = scrimRef.current;
      if (p) {
        s?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: 'ease-out' });
        const o = originRect.current;
        if (reduceRef.current || !o) {
          p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
        } else {
          const pr = p.getBoundingClientRect();
          const sc = o.width / pr.width;
          panelAnimRef.current = p.animate(
            [
              {
                transform: `translate(${o.left - pr.left}px, ${o.top - pr.top}px) scale(${sc})`,
                borderRadius: `${20 / sc}px`,
              },
              { transform: 'none', borderRadius: '28px' },
            ],
            { duration: 560, easing: EASE_DRAWER }
          );
          p.querySelector('[data-body]')?.animate(
            [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
            { duration: 360, delay: 140, easing: EASE_OUT, fill: 'backwards' }
          );
        }
      }
    }
    wasOpen.current = isOpen;
  }, [openId]);

  const closeDetail = useCallback(
    (after?: () => void) => {
      if (closingRef.current || !openId) return;
      closingRef.current = true;
      const p = panelRef.current;
      const s = scrimRef.current;
      const finish = () => {
        document.body.style.overflow = '';
        setOpenId(null);
        setPlaying(false);
        closingRef.current = false;
        if (after) requestAnimationFrame(after);
      };
      if (!p) {
        finish();
        return;
      }
      if (s) {
        s.animate([{ opacity: getComputedStyle(s).opacity }, { opacity: 0 }], {
          duration: 300,
          easing: 'ease-out',
          fill: 'forwards',
        });
      }
      if (reduceRef.current) {
        p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' }).onfinish = finish;
        return;
      }
      const cur = getComputedStyle(p).transform;
      panelAnimRef.current?.cancel();
      const o =
        originEl.current && originEl.current.isConnected
          ? originEl.current.getBoundingClientRect()
          : originRect.current;
      if (!o) {
        finish();
        return;
      }
      const pr = p.getBoundingClientRect();
      const sc = o.width / pr.width;
      p.querySelector('[data-body]')?.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 140,
        easing: 'ease-out',
        fill: 'forwards',
      });
      p.animate(
        [
          { transform: cur === 'none' ? 'none' : cur },
          {
            transform: `translate(${o.left - pr.left}px, ${o.top - pr.top}px) scale(${sc})`,
            borderRadius: `${20 / sc}px`,
          },
        ],
        { duration: 380, easing: EASE_DRAWER, fill: 'forwards' }
      ).onfinish = finish;
    },
    [openId]
  );

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDetail();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId, closeDetail]);

  const scrubTo = (e: React.PointerEvent) => {
    const el = scrubRef.current;
    if (!el || !openId) return;
    const r = el.getBoundingClientRect();
    setT(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * (VID[openId].secs ?? 0));
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!openId) return;
    const secs = VID[openId].secs ?? 0;
    setT((prev) => (prev >= secs ? 0 : prev));
    setPlaying((p) => !p);
  };

  const goCollab = (e: React.MouseEvent) => {
    e.preventDefault();
    closeDetail(() => {
      const el = document.getElementById('collab');
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
          behavior: reduceRef.current ? 'auto' : 'smooth',
        });
      }
    });
  };

  // ---------- Carousel shorts: drag 1:1, karet, momentum, snap pegas ----------

  const bounds = () => {
    const vp = vpRef.current;
    const tr = trackRef.current;
    if (!vp || !tr) return { min: 0, max: 0 };
    return { min: Math.min(0, vp.clientWidth - tr.scrollWidth), max: 0 };
  };
  const snaps = () => {
    const c = trackRef.current?.querySelector<HTMLElement>('[data-short]');
    const step = c ? c.offsetWidth + 16 : 240;
    const { min } = bounds();
    const out: number[] = [];
    for (let i = 0; i < SHORT_VIDEOS.length; i++) {
      const p = Math.max(min, -i * step);
      if (!out.includes(p)) out.push(p);
    }
    return out;
  };
  const nearest = (arr: number[], x: number) => {
    let bi = 0;
    arr.forEach((p, i) => {
      if (Math.abs(p - x) < Math.abs(arr[bi] - x)) bi = i;
    });
    return bi;
  };
  const setX = (x: number) => {
    xRef.current = x;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${x}px,0,0)`;
  };
  const settled = useCallback(() => {
    const vp = vpRef.current;
    const tr = trackRef.current;
    if (!vp || !tr) return;
    const min = Math.min(0, vp.clientWidth - tr.scrollWidth);
    setAtStart(xRef.current >= -1);
    setAtEnd(xRef.current <= min + 1);
  }, []);

  const springTo = (target: number, v0 = 0, zeta = 1) => {
    cancelAnimationFrame(rafRef.current);
    if (reduceRef.current) {
      setX(target);
      settled();
      return;
    }
    const resp = 0.42;
    const k = Math.pow((2 * Math.PI) / resp, 2);
    const c = (4 * Math.PI * zeta) / resp;
    let x = xRef.current;
    let v = v0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.064, (now - last) / 1000);
      last = now;
      const h = dt / 8;
      for (let i = 0; i < 8; i++) {
        const a = -k * (x - target) - c * v;
        v += a * h;
        x += v * h;
      }
      if (Math.abs(x - target) < 0.4 && Math.abs(v) < 8) {
        setX(target);
        settled();
        return;
      }
      setX(x);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const navShort = (dir: number) => {
    const sn = snaps();
    const i = Math.min(sn.length - 1, Math.max(0, nearest(sn, xRef.current) + dir));
    springTo(sn[i], 0, 1);
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    cancelAnimationFrame(rafRef.current);
    const card = (e.target as Element).closest<HTMLElement>('[data-short]');
    dragRef.current = {
      id: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      x0: xRef.current,
      axis: null,
      idx: card ? Number(card.dataset.short) : -1,
      hist: [{ x: e.clientX, t: performance.now() }],
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (d.axis === 'x' && vpRef.current) vpRef.current.style.cursor = 'grabbing';
    }
    if (d.axis !== 'x') return;
    const { min, max } = bounds();
    const w = vpRef.current?.clientWidth ?? 1;
    let x = d.x0 + dx;
    if (x > max) x = max + rubber(x - max, w);
    else if (x < min) x = min - rubber(min - x, w);
    setX(x);
    const now = performance.now();
    d.hist.push({ x: e.clientX, t: now });
    while (d.hist.length > 2 && now - d.hist[0].t > 100) d.hist.shift();
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id) return;
    dragRef.current = null;
    if (vpRef.current) vpRef.current.style.cursor = 'grab';
    if (d.axis !== 'x') {
      if (!d.axis && e.type === 'pointerup' && d.idx >= 0) {
        setPlayingShort((cur) => (cur === d.idx ? -1 : d.idx));
      }
      return;
    }
    const h = d.hist;
    const a = h[0];
    const b = h[h.length - 1];
    const dt = (b.t - a.t) / 1000;
    const v = dt > 0 && performance.now() - b.t < 80 ? (b.x - a.x) / dt : 0;
    // Proyeksi ke mana lemparan akan berhenti, lalu snap ke kartu terdekat dari situ.
    const projected = xRef.current + ((v / 1000) * 0.998) / (1 - 0.998);
    const sn = snaps();
    springTo(sn[nearest(sn, projected)], v, Math.abs(v) > 500 ? 0.82 : 1);
  };

  // Geser dua jari di trackpad / roda horizontal (atau Shift + roda mouse).
  // Track mengikuti jari 1:1, lalu snap ke kartu terdekat begitu gerakan berhenti.
  const wheelRef = useRef<(e: WheelEvent) => void>(() => {});
  const wheelIdle = useRef<number>();
  wheelRef.current = (e: WheelEvent) => {
    const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
    // Gerakan yang lebih banyak vertikal dibiarkan menggulir halaman.
    if (!dx || Math.abs(dx) < Math.abs(e.shiftKey ? 0 : e.deltaY)) return;
    e.preventDefault();
    if (dragRef.current) return;
    cancelAnimationFrame(rafRef.current);
    const { min, max } = bounds();
    const w = vpRef.current?.clientWidth ?? 1;
    const step = e.deltaMode === 1 ? dx * 16 : dx;
    let x = xRef.current - step;
    if (x > max) x = max + rubber(x - max, w, 0.3);
    else if (x < min) x = min - rubber(min - x, w, 0.3);
    setX(x);
    clearTimeout(wheelIdle.current);
    wheelIdle.current = window.setTimeout(() => {
      const sn = snaps();
      springTo(sn[nearest(sn, xRef.current)], 0, 1);
    }, 140);
  };
  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    // Listener asli, bukan onWheel React: React memasangnya pasif, jadi
    // preventDefault di sana tidak bisa menahan geser-balik halaman di browser.
    const onWheel = (e: WheelEvent) => wheelRef.current(e);
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      vp.removeEventListener('wheel', onWheel);
      clearTimeout(wheelIdle.current);
    };
  }, []);

  // Panah kiri/kanan saat carousel difokus.
  const onCarouselKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      navShort(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navShort(-1);
    }
  };

  // Lebar layar atau bahasa berubah: pastikan carousel tidak tertinggal di luar batas.
  useEffect(() => {
    const clampX = () => {
      const { min, max } = bounds();
      setX(Math.min(max, Math.max(min, xRef.current)));
      settled();
    };
    const onResize = () => {
      placeInd(false);
      clampX();
    };
    clampX();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // bounds/setX hanya membaca ref, aman dikecualikan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeInd, settled, lang]);

  // ---------- Turunan untuk render ----------

  const loc = useCallback(
    (v: Video): Video => {
      const tr = ID_VID[v.id];
      if (!isId || !tr) return v;
      return {
        ...v,
        title: tr.title,
        notes: tr.notes ?? v.notes,
        why: tr.why ?? v.why,
        items: v.items?.map((it, i) => [it[0], tr.items?.[i] ?? it[1]] as [number, string]),
      };
    },
    [isId]
  );
  const catL = (c: FilterId) => (isId ? CAT_ID[c] : CAT_EN[c]);
  const fmtL = (f: Video['format']) => (isId && f === 'Picks' ? 'Rekomendasi' : f);
  /** Platform untuk konten ber-embed, kalau tidak format (Tutorial/Picks). */
  const kindOf = (v: Video) => {
    const e = EMBED[v.id];
    return e ? PLATFORM[e.provider] : fmtL(v.format);
  };
  const dateL = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString(isId ? 'id-ID' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  /** Angka yang ada untuk konten ini: tayangan, tanggal, atau durasi. */
  const statOf = (v: Video) =>
    v.views ? `${v.views} ${L.views}` : v.date ? dateL(v.date) : v.secs ? fmt(v.secs) : '';

  const list = filtered(filter);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        CATS.map((c) => [c.id, c.id === 'all' ? VIDEOS.length : VIDEOS.filter((v) => v.cat === c.id).length])
      ) as Record<FilterId, number>,
    []
  );
  const countLabel = isId
    ? `${list.length} video`
    : `${list.length} ${list.length === 1 ? 'video' : 'videos'}`;

  const open = openId ? loc(VID[openId]) : null;
  const openEmbed = openId ? EMBED[openId] : null;

  const toggleReel = () => {
    if (REEL) setReelEmbedOn(true);
    else setReelPlaying((p) => !p);
  };

  const closeButton = (
    <button
      type="button"
      className="rk-close"
      aria-label="Close"
      autoFocus
      onClick={(e) => {
        e.stopPropagation();
        closeDetail();
      }}
    >
      <span />
      <span />
    </button>
  );
  const frac = open && open.secs ? Math.min(1, t / open.secs) : 0;

  // Template kerja sama sesuai bahasa aktif; jenisnya diambil dari tiga
  // penawaran di halaman supaya selalu sama dengan yang tertulis.
  const mailHref = gmailUrl(
    EMAIL,
    L.mailSubject,
    [
      L.mailHi,
      '',
      L.mailBrand,
      `${L.mailType} (${[L.o1, L.o2, L.o3].map((x) => x.toLowerCase()).join(' / ')}):`,
      L.mailLink,
      L.mailTimeline,
      '',
      L.mailThanks,
    ].join('\n')
  );

  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL).catch(() => {});
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="rk-page">
      <SEOHead
        data={{
          title: 'Rekomendasyi — Nursyifa Pratiwi',
          description: LANG.en.heroP,
          keywords: [
            'Rekomendasyi',
            'Nursyifa Pratiwi',
            'lifestyle creator',
            'kreator lifestyle',
            'review kuliner',
            'makeup',
            'travel',
            'olahraga',
            'rekomendasi produk',
            'Banjarbaru',
          ],
          author: 'Nursyifa Pratiwi',
          url: 'https://dirakhmat.app/rekomendasyi',
          image: 'https://dirakhmat.app/my.png',
          type: 'website',
          locale: 'en_GB',
        }}
      />

      <header
        className={`rk-header${scrolled ? ' is-scrolled' : ''}${headerHidden ? ' is-hidden' : ''}${
          menuOpen ? ' is-menu' : ''
        }`}
      >
        <div className="rk-wrap rk-header__inner">
          <a href="#top" className="rk-logo" onClick={closeMenu}>
            Rekomendasyi
          </a>
          <nav className="rk-nav" aria-label="Main">
            <a href="#shelf" className="rk-nav__link">
              {L.navShelf}
            </a>
            <a href="#shorts" className="rk-nav__link">
              {L.navShorts}
            </a>
            <div role="group" aria-label="Language" className="rk-lang">
              <span
                className="rk-lang__thumb"
                style={{ transform: isId ? 'translateX(100%)' : 'translateX(0)' }}
              />
              <button
                type="button"
                className="rk-lang__btn"
                aria-pressed={!isId}
                aria-label="English (England)"
                onClick={() => setLang('en')}
                style={{ color: isId ? '#6E625A' : '#2A2320' }}
              >
                <span className="rk-lang__flag">
                  <FlagEN />
                </span>
                <span className="rk-lang__code">ENG</span>
              </button>
              <button
                type="button"
                className="rk-lang__btn"
                aria-pressed={isId}
                aria-label="Bahasa Indonesia"
                onClick={() => setLang('id')}
                style={{ color: isId ? '#2A2320' : '#6E625A' }}
              >
                <span className="rk-lang__flag">
                  <FlagID />
                </span>
                <span className="rk-lang__code">ID</span>
              </button>
            </div>
            <a href="#collab" className="rk-btn-dark rk-press rk-nav__cta">
              {L.workWithMe}
            </a>
            <button
              type="button"
              className="rk-burger"
              aria-expanded={menuOpen}
              aria-controls="rk-menu"
              aria-label={menuOpen ? L.menuClose : L.menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </nav>
        </div>

        {/* Menu ponsel: turun dari bawah header, isinya muncul berurutan. */}
        <div id="rk-menu" className="rk-menu" inert={!menuOpen}>
          <div className="rk-menu__inner">
            <div className="rk-wrap rk-menu__body">
              {(
                [
                  ['#shelf', L.navShelf, L.kickerShelf],
                  ['#shorts', L.navShorts, 'Reels · TikTok · Shorts'],
                  ['#collab', L.collabBtn, 'Email · Instagram · TikTok'],
                ] as const
              ).map(([href, label, hint], i) => (
                <a
                  key={href}
                  href={href}
                  className="rk-menu__link"
                  style={{ transitionDelay: menuOpen ? `${60 + i * 45}ms` : '0ms' }}
                  onClick={closeMenu}
                >
                  <span className="rk-menu__no">0{i + 1}</span>
                  <span className="rk-menu__label">{label}</span>
                  <span className="rk-menu__hint">{hint}</span>
                </a>
              ))}
              <a
                href="#collab"
                className="rk-btn-dark rk-menu__cta"
                style={{ transitionDelay: menuOpen ? '200ms' : '0ms' }}
                onClick={closeMenu}
              >
                {L.workWithMe}
              </a>
            </div>
          </div>
        </div>
      </header>
      <div
        className={`rk-menu-scrim${menuOpen ? ' is-open' : ''}`}
        aria-hidden="true"
        onClick={closeMenu}
      />

      <main>
        <section id="top" className="rk-wrap rk-hero">
          <div className="rk-hero__copy">
            <div className="rk-byline">
              <div className="rk-avatar" aria-hidden="true">
                NP
              </div>
              <span>
                <strong>Nursyifa Pratiwi</strong> · {L.role}
              </span>
            </div>
            <h1 className="rk-h1">
              {L.h1a}
              <em>{L.h1b}</em>
              {L.h1c}
            </h1>
            <p className="rk-hero__p">{L.heroP}</p>
            <div className="rk-actions">
              <a href="#shelf" className="rk-btn-accent">
                {L.browse}
              </a>
              <a href="#collab" className="rk-btn-ghost">
                {L.collabBtn}
              </a>
            </div>
          </div>

          {REEL && reelEmbedOn ? (
            <div className="rk-reel rk-reel--embed">
              <EmbedFrame embed={REEL} title="Showreel 2026" />
            </div>
          ) : !REEL && RECAP.length ? (
            <div
              ref={recapRef}
              className={`rk-reel rk-recap${recapRunning ? '' : ' is-paused'}`}
              role="region"
              aria-roledescription="carousel"
              aria-label={`${L.recap} 2026`}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setRecapHover(true)}
              onPointerLeave={() => setRecapHover(false)}
            >
              {RECAP.map((v, i) => {
                const poster = posterOf(v, EMBED[v.id]);
                const active = i === recapIndex;
                return (
                  <div key={v.id} className={`rk-recap__slide rk-recap__slide--${i % 4}${active ? ' is-active' : ''}`} aria-hidden={!active}>
                    <div className="rk-recap__bg" style={{ backgroundImage: `url("${poster}")` }} />
                    <div ref={active ? recapFrameRef : undefined} className="rk-recap__frame">
                      <div className="rk-recap__img" style={{ backgroundImage: `url("${poster}")` }} />
                    </div>
                  </div>
                );
              })}

              <div className="rk-reel__chips">
                <span className="rk-chip">{L.recap} 2026</span>
                <span className="rk-chip rk-chip--accent">{fmt(RECAP_SECS)}</span>
              </div>

              {(() => {
                const v = loc(RECAP[recapIndex]);
                return (
                  <div key={v.id} className="rk-recap__text">
                    <span className="rk-chip rk-chip--accent">{catL(v.cat)}</span>
                    <span className="rk-recap__title">{v.title}</span>
                    <span className="rk-recap__meta">
                      {[kindOf(v), statOf(v)].filter(Boolean).join(' · ')}
                    </span>
                    <button
                      type="button"
                      className="rk-recap__watch"
                      onClick={(e) => openDetail(v.id, e, recapFrameRef.current)}
                    >
                      {L.watch} ↗
                    </button>
                  </div>
                );
              })()}

              <button
                type="button"
                className="rk-recap__toggle"
                aria-label={recapPaused ? L.play : L.pause}
                aria-pressed={!recapPaused}
                onClick={() => setRecapPaused((p) => !p)}
              >
                {recapPaused ? <PlayIcon /> : <PauseIcon />}
              </button>

              <div className="rk-recap__segments">
                {RECAP.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    className="rk-recap__seg"
                    aria-label={`${i + 1} / ${RECAP.length}: ${loc(v).title}`}
                    aria-current={i === recapIndex}
                    onClick={() => setRecapT(i * SLIDE_SECS)}
                  >
                    <span
                      style={{
                        transform: `scaleX(${i < recapIndex ? 1 : i === recapIndex ? recapFrac : 0})`,
                        transition: i === recapIndex && recapFrac > 0.04 ? 'transform 100ms linear' : 'none',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
          <div
            role="button"
            tabIndex={0}
            className="rk-reel"
            onClick={toggleReel}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleReel();
              }
            }}
            aria-label={reelPlaying ? 'Pause showreel' : 'Play showreel'}
            aria-pressed={reelPlaying}
            style={REEL?.poster ? { background: thumbBg(0, REEL.poster) } : undefined}
          >
            <div className="rk-reel__chips">
              <span className="rk-chip">Showreel 2026</span>
              <span className="rk-chip rk-chip--accent">0:45</span>
            </div>
            <div className="rk-reel__center">
              <div className="rk-reel__btn">{reelPlaying ? <PauseIcon /> : <PlayIcon />}</div>
            </div>
            {!REEL && <span className="rk-reel__label">{L.dropReel}</span>}
            {!REEL && (
              <div className="rk-progress rk-reel__bar">
                <div style={{ transform: `scaleX(${reelT / REEL_SECS})` }} />
              </div>
            )}
          </div>
          )}
        </section>

        <section id="shelf" className="rk-wrap rk-shelf">
          <div className="rk-section-head">
            <div className="rk-stack" style={{ maxWidth: 620 }}>
              <span className="rk-kicker">{L.kickerShelf}</span>
              <h2 className="rk-h2">{L.shelfTitle}</h2>
              <p className="rk-lead">{L.shelfP}</p>
            </div>
            <span className="rk-count">{countLabel}</span>
          </div>

          <div ref={pillsRef} className="rk-pills">
            <span ref={indRef} className="rk-pills__ind" />
            {CATS.map((c) => (
              <button
                key={c.id}
                type="button"
                data-cat={c.id}
                className="rk-pill"
                aria-pressed={c.id === filter}
                onClick={() => setFilter(c.id)}
                style={{ color: c.id === filter ? '#FFFBF5' : '#2A2320' }}
              >
                {catL(c.id)}
                <span>{counts[c.id]}</span>
              </button>
            ))}
          </div>

          <div ref={gridRef} className="rk-grid">
            {list.map((v) => {
              const lv = loc(v);
              const hov = hoverId === v.id;
              const prev = previewId === v.id;
              return (
                <article
                  key={v.id}
                  role="button"
                  tabIndex={0}
                  aria-label={lv.title}
                  data-id={v.id}
                  className="rk-card"
                  onClick={(e) => openDetail(v.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openDetail(v.id, e);
                    }
                  }}
                  onPointerEnter={(e) => enter(v.id, e)}
                  onPointerLeave={leave}
                >
                  <div
                    data-thumb="1"
                    className="rk-thumb"
                    style={{
                      background: thumbBg(v.hue, posterOf(v, EMBED[v.id])),
                      transform: hov && !reduceRef.current ? 'scale(1.015)' : 'scale(1)',
                      boxShadow: hov ? '0 22px 44px -22px rgba(42,35,32,.5)' : '0 1px 0 rgba(42,35,32,.04)',
                    }}
                  >
                    <div className="rk-thumb__tl">
                      <span className="rk-chip">No. {VIDEO_NO[v.id]}</span>
                      {v.pinned && <span className="rk-chip rk-chip--accent">{L.pinned}</span>}
                    </div>
                    {statOf(v) && <span className="rk-chip rk-chip--dark rk-thumb__dur">{statOf(v)}</span>}
                    {!posterOf(v, EMBED[v.id]) && (
                      <span className="rk-thumb__label">
                        {v.thumbLabel ? `thumbnail · ${v.thumbLabel}` : `${kindOf(v)} · 9:16`}
                      </span>
                    )}
                    {/* Pratinjau "tanpa suara" hanya untuk pemutar simulasi; konten
                        asli tidak punya pratinjau, jadi tidak dipura-purakan. */}
                    {!EMBED[v.id] && (
                      <>
                        <div className="rk-thumb__preview" style={{ opacity: prev ? 1 : 0 }}>
                          <span className="rk-chip">{L.previewing}</span>
                        </div>
                        <div className="rk-progress rk-thumb__bar" style={{ opacity: prev ? 1 : 0 }}>
                          <div
                            style={{
                              transform: prev ? 'scaleX(1)' : 'scaleX(0)',
                              transition: prev ? 'transform 10s linear' : 'transform 200ms ease-out',
                            }}
                          />
                        </div>
                      </>
                    )}
                    {EMBED[v.id] && (
                      <span className="rk-thumb__play" aria-hidden="true">
                        <PlayIcon />
                      </span>
                    )}
                  </div>
                  <div className="rk-card__meta">
                    <div className="rk-eyebrow">
                      {catL(v.cat)}
                      {kindOf(v) && <span>· {kindOf(v)}</span>}
                    </div>
                    <h3 className="rk-card__title">{lv.title}</h3>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="shorts" className="rk-shorts">
          <div className="rk-wrap rk-section-head">
            <div className="rk-stack" style={{ maxWidth: 560 }}>
              <span className="rk-kicker">Reels · TikTok · Shorts</span>
              <h2 className="rk-h2">{L.shortsTitle}</h2>
              <p className="rk-lead">{L.shortsP}</p>
            </div>
            <div className="rk-arrows">
              <button
                type="button"
                className="rk-arrow rk-arrow--prev"
                aria-label="Previous"
                onClick={() => navShort(-1)}
                style={{ opacity: atStart ? 0.4 : 1 }}
              >
                <span />
              </button>
              <button
                type="button"
                className="rk-arrow rk-arrow--next"
                aria-label="Next"
                onClick={() => navShort(1)}
                style={{ opacity: atEnd ? 0.4 : 1 }}
              >
                <span />
              </button>
            </div>
          </div>

          <div
            ref={vpRef}
            className="rk-viewport"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label={L.shortsTitle}
            onKeyDown={onCarouselKey}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <div ref={trackRef} className="rk-track">
              {SHORT_VIDEOS.map((s, i) => {
                const on = playingShort === i;
                const se = EMBED[s.id];
                const title = loc(s).title;
                if (se && on) {
                  return (
                    <div key={s.id} data-short={i} className="rk-short rk-short--embed">
                      <EmbedFrame embed={se} title={title} />
                      <button
                        type="button"
                        className="rk-short__stop"
                        aria-label={L.stop}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => setPlayingShort(-1)}
                      >
                        <span />
                        <span />
                      </button>
                    </div>
                  );
                }
                return (
                  <div
                    key={s.id}
                    data-short={i}
                    className="rk-short"
                    style={{ background: thumbBg(s.hue, posterOf(s, se)) }}
                  >
                    <span className="rk-chip rk-short__platform">{kindOf(s)}</span>
                    {!posterOf(s, se) && <span className="rk-short__hint">vertical clip 9:16</span>}
                    <div className="rk-short__icon" style={{ opacity: on ? 0.0001 : 1 }}>
                      <div>{on ? <PauseIcon /> : <PlayIcon />}</div>
                    </div>
                    <div className="rk-short__foot">
                      <span className="rk-short__title">{title}</span>
                      {statOf(s) && <span className="rk-short__dur">{statOf(s)}</span>}
                      {!se && (
                        <div className="rk-progress rk-short__bar">
                          <div
                            style={{
                              transform: on ? 'scaleX(1)' : 'scaleX(0)',
                              transition: on ? `transform ${s.secs ?? 30}s linear` : 'transform 200ms ease-out',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="collab" className="rk-wrap rk-collab">
          <div className="rk-collab__copy">
            <span className="rk-kicker">{L.collabKicker}</span>
            <h2 className="rk-h2">{L.collabTitle}</h2>
            <p className="rk-lead">{L.collabP}</p>
            <div className="rk-offers">
              {(
                [
                  [L.o1, L.o1d],
                  [L.o2, L.o2d],
                  [L.o3, L.o3d],
                ] as const
              ).map(([name, desc]) => (
                <div key={name} className="rk-offer">
                  <span className="rk-offer__name">{name}</span>
                  <span className="rk-offer__desc">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rk-contact">
            <div className="rk-stack" style={{ gap: 10 }}>
              <span className="rk-contact__label">Email</span>
              <a href={mailHref} target="_blank" rel="noopener noreferrer" className="rk-contact__email">
                {EMAIL}
              </a>
              <div className="rk-actions" style={{ gap: 10, marginTop: 6 }}>
                <a href={mailHref} target="_blank" rel="noopener noreferrer" className="rk-btn-accent rk-btn--sm">
                  {L.send}
                </a>
                <button type="button" className="rk-btn-ghost rk-btn--sm" onClick={copyEmail}>
                  {copied ? L.copied : L.copy}
                </button>
              </div>
              <span className="rk-contact__reply">{L.reply}</span>
            </div>
            <div className="rk-socials">
              {SOCIALS.map(({ name, handle, href }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="rk-social">
                  <span className="rk-social__name">{name}</span>
                  <span className="rk-social__handle">{handle}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="rk-footer">
        <div className="rk-wrap rk-footer__inner">
          <span>© 2026 Nursyifa Pratiwi · Rekomendasyi</span>
          <div className="rk-footer__links">
            {SOCIALS.map(({ name, href }) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {open && (
        <div className="rk-modal" onClick={() => closeDetail()}>
          <div ref={scrimRef} className="rk-scrim" />
          <div
            ref={panelRef}
            className="rk-panel"
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
            onClick={(e) => e.stopPropagation()}
          >
            {openEmbed ? (
              <div
                className={`rk-player rk-player--embed${openEmbed.vertical ? ' rk-player--vertical' : ''}`}
                style={{ background: thumbBg(open.hue, posterOf(open, openEmbed)) }}
              >
                {closeButton}
                <div className="rk-player__stage">
                  {embedOn ? (
                    <EmbedFrame ref={frameRef} embed={openEmbed} title={open.title} start={embedStart} />
                  ) : (
                    <button
                      type="button"
                      className="rk-player__load"
                      aria-label={`Play: ${open.title}`}
                      onClick={() => setEmbedOn(true)}
                    >
                      <span className="rk-player__bigbtn">
                        <PlayIcon />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
            <div className="rk-player" onClick={togglePlay} style={{ background: stripes(open.hue) }}>
              {open.thumbLabel && <span className="rk-player__label">video · {open.thumbLabel}</span>}
              {closeButton}
              <div className="rk-player__big" style={{ opacity: playing || t > 0 ? 0 : 1 }}>
                <div>
                  <PlayIcon />
                </div>
              </div>
              <div className="rk-controls" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="rk-controls__play"
                  aria-label="Play or pause"
                  onClick={togglePlay}
                >
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <div
                  ref={scrubRef}
                  className="rk-scrub"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.currentTarget.setPointerCapture(e.pointerId);
                    scrubbingRef.current = true;
                    scrubTo(e);
                  }}
                  onPointerMove={(e) => {
                    if (scrubbingRef.current) scrubTo(e);
                  }}
                  onPointerUp={() => {
                    scrubbingRef.current = false;
                  }}
                  onPointerCancel={() => {
                    scrubbingRef.current = false;
                  }}
                >
                  <div className="rk-scrub__track">
                    <div style={{ transform: `scaleX(${frac})` }} />
                  </div>
                  <span className="rk-scrub__knob" style={{ left: `${frac * 100}%` }} />
                </div>
                <span className="rk-controls__time">
                  {fmt(t)} / {fmt(open.secs ?? 0)}
                </span>
              </div>
            </div>
            )}

            <div data-body="1" className={`rk-detail${open.items?.length ? '' : ' rk-detail--single'}`}>
              <div className="rk-detail__main">
                <div className="rk-eyebrow">
                  {catL(open.cat)}
                  <span>
                    {kindOf(open) && `· ${kindOf(open)} `}· No. {VIDEO_NO[open.id]}
                  </span>
                </div>
                <h2 className="rk-detail__title">{open.title}</h2>
                {(statOf(open) || open.pinned) && (
                  <div className="rk-detail__stats">
                    {statOf(open) && <span>{statOf(open)}</span>}
                    {open.pinned && <span className="rk-chip rk-chip--accent">{L.pinned}</span>}
                  </div>
                )}
                {open.notes && <p className="rk-detail__notes">{open.notes}</p>}
                {open.why && (
                  <div className="rk-why">
                    <span className="rk-why__label">{L.why}</span>
                    <span className="rk-why__text">{open.why}</span>
                  </div>
                )}
                {openEmbed && (
                  <div className="rk-actions">
                    <a
                      href={openEmbed.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rk-btn-ghost rk-btn--sm"
                    >
                      {L.openOn} {PLATFORM[openEmbed.provider]} ↗
                    </a>
                  </div>
                )}
                <a href="#collab" className="rk-detail__cta" onClick={goCollab}>
                  {L.cta}
                </a>
              </div>
              {open.items?.length ? (
              <div className="rk-chapters">
                <span className="rk-contact__label">
                  {open.format === 'Tutorial' ? L.chapters : L.picks}
                </span>
                <div className="rk-chapters__list">
                  {open.items.map(([start, label], i) => {
                    // Instagram & TikTok tidak bisa diperintah loncat waktu: daftar isi biasa.
                    if (openEmbed && openEmbed.provider !== 'youtube') {
                      return (
                        <div key={start} className="rk-chapter rk-chapter--static">
                          <span className="rk-chapter__time">{fmt(start)}</span>
                          <span className="rk-chapter__label">{label}</span>
                        </div>
                      );
                    }
                    const next = open.items?.[i + 1];
                    const active = openEmbed ? embedChapter === i : t >= start && (!next || t < next[0]);
                    return (
                      <button
                        key={start}
                        type="button"
                        className={`rk-chapter${active ? ' is-active' : ''}`}
                        onClick={() => {
                          if (openEmbed) {
                            setEmbedChapter(i);
                            // Iframe belum ada: mulai langsung dari detik ini. Sudah ada: perintah seekTo.
                            if (embedOn) seekYouTube(frameRef.current, start);
                            else {
                              setEmbedStart(start);
                              setEmbedOn(true);
                            }
                            return;
                          }
                          setT(start);
                          setPlaying(true);
                        }}
                      >
                        <span className="rk-chapter__time">{fmt(start)}</span>
                        <span className="rk-chapter__label">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
