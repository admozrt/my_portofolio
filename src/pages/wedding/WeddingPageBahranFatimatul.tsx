import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import "./WeddingPageBahranFatimatul.css";

// ─── CONFIG ────────────────────────────────────────────────────────
const WEDDING_DATE = new Date("2026-08-15T10:00:00+08:00");
const GROOM_FIRST = "Ilmi";
const BRIDE_FIRST = "Zahro";
const DATE_LABEL = "Minggu, 5 Juli 2026";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Gedung%20Pesona%20Modern%20232%20Kertak%20Hanyar&t=&z=16&ie=UTF8&iwloc=&output=embed";
const MAP_LINK =
  "https://maps.app.goo.gl/opaXVvA2HyQKL6H49";

const COVER_PHOTO    = "/ilmi/cover.jpeg";
const HERO_PHOTO     = "/ilmi/hero.jpeg";
const BRIDE_PHOTO    = "/ilmi/bride.jpg";
const GROOM_PHOTO    = "/ilmi/groom.jpg";
const OURSTORY_PHOTO = "/ilmi/ourstory.jpeg";

// Foto yang ditunggu (preload) sebelum halaman tampil
const PRELOAD_PHOTOS = [COVER_PHOTO, HERO_PHOTO, BRIDE_PHOTO, GROOM_PHOTO];

// Ornamen bunga (PNG dari zip) — posisi sesuai nama file
const FLOWER_TL      = "/ilmi/flower-left.png";   // cover atas-kiri
const FLOWER_TR      = "/ilmi/flower-right.png";  // cover atas-kanan
const FLOWER_BR      = "/ilmi/flower-br.png";     // cover bawah-kanan
const FLOWER_DIVIDER = "/ilmi/flower-divider.png"; // ornamen bunga
const MONOGRAM       = "/ilmi/monogram.png";   // icon "I | Z" (cover)
const LOGO_HERO      = "/ilmi/logo-full.png";  // Ilmi (2): I|Z + "Ilmi & Zahra" (hero)
const LOGO_CLOSING   = "/ilmi/logo-text.png";  // Ilmi (1): "Ilmi & Zahra" (penutup)

const GALLERY_PHOTOS = [
  "/ilmi/g1.jpeg",
  "/ilmi/g2.jpeg",
  "/ilmi/g3.jpeg",
  "/ilmi/g4.jpeg",
];

// Cerita Kami / Our Story (teks dari zip)
const STORY: { title: string; body: string }[] = [
  {
    title: "The Beginning",
    body: "Berawal dari pesan Instagram yang ternyata menjadi awal cerita ini dimulai. Kami percaya bahwa setiap detik perjalanan ini adalah bagian dari takdir indah yang telah Tuhan gariskan.",
  },
  {
    title: "Growing Together",
    body: "Sejak hari itu, kami belajar untuk saling mendewasakan dan kami tumbuh bukan hanya dengan rasa, tapi juga dalam doa serta keyakinan.",
  },
  {
    title: "The Promise",
    body: "Hingga akhirnya kami sadar, perjalanan ini harus terus berjalan berdampingan, menyatukan perbedaan menjadi satu tujuan yang pasti.",
  },
  {
    title: "The Beginning Of Forever",
    body: "Dengan penuh rasa syukur dan bahagia, kami menyempurnakan perjalanan ini dengan ikatan janji suci. Doakan agar langkah kami selalu diliputi lembutnya takdir dan keberkahan. Aamiin Yaa Rabb.",
  },
];

// Turut Mengundang — TODO: ganti dengan nama asli keluarga
// const INVITERS: { pria: string[]; wanita: string[] } = {
//   pria: [
//     "Bapak/Ibu (Nama Keluarga)",
//     "Bapak/Ibu (Nama Keluarga)",
//     "Bapak/Ibu (Nama Keluarga)",
//     "Bapak/Ibu (Nama Keluarga)",
//   ],
//   wanita: [
//     "Bapak/Ibu (Nama Keluarga)",
//     "Bapak/Ibu (Nama Keluarga)",
//     "Bapak/Ibu (Nama Keluarga)",
//     "Bapak/Ibu (Nama Keluarga)",
//   ],
// };

const GROOM = {
  label: "Mempelai Pria",
  name: "Bahran Ilmi",
  order: "Putra Kedua",
  father: "Yuseran",
  mother: "Khadijah",
  address: "Jl. Gubernur Soebarjo, Kec. Liang Anggang, Banjarbaru",
  ig: "@bhrnilmi",
  photo: GROOM_PHOTO,
};

const BRIDE = {
  label: "Mempelai Wanita",
  name: "Fatimatul Zahro",
  order: "Putri Pertama",
  father: "Rahmatullah",
  mother: "Erna",
  address: "Komp. Montesa Permai, Manarap Tengah",
  ig: "@fatimatuzzaahra",
  photo: BRIDE_PHOTO,
};

const EVENTS = [
  {
    tag: "Akad Nikah",
    title: "Akad Nikah",
    day: "Sabtu",
    date: DATE_LABEL,
    time: "08.00 WITA – Selesai",
    venue: "Gedung Pesona Modern 232",
    address: "Komplek Pesona Modern Jl. Ahmad Yani Km. 11, Mekar Raya, Kec. Kertak Hanyar, Kab. Banjar, Provinsi Kalimantan Selatan",
  },
  {
    tag: "Resepsi",
    title: "Walimatul 'Ursy",
    day: "Sabtu",
    date: DATE_LABEL,
    time: "09.00 WITA – Selsai",
    venue: "Gedung Pesona Modern 232",
    address: "Komplek Pesona Modern Jl. Ahmad Yani Km. 11, Mekar Raya, Kec. Kertak Hanyar, Kab. Banjar, Provinsi Kalimantan Selatan",
  },
];

const GIFTS = [
  {
    id: "bca",
    type: "Transfer Bank",
    name: "Bank BCA",
    logo: "BCA",
    number: "1234 5678 90",
    holder: "Fatimatul Zahro",
    bg: "linear-gradient(135deg, #2196F3, #1976D2)",
  },
  {
    id: "dana",
    type: "E-Wallet",
    name: "DANA",
    logo: "D",
    number: "0812 3456 7890",
    holder: "Bahran Ilmi",
    bg: "linear-gradient(135deg, #118EEA, #0A6CB8)",
  },
];

const GIFT_ADDRESS =
  "Komp. Montesa Permai, Manarap Tengah, Banjarmasin";

const NAV_SECTIONS = [
  { id: "bf-hero",     label: "Pembuka"  },
  { id: "bf-date",     label: "Tanggal"  },
  { id: "bf-mempelai", label: "Mempelai" },
  { id: "bf-cerita",   label: "Cerita"   },
  { id: "bf-galeri",   label: "Galeri"   },
  { id: "bf-hadiah",   label: "Hadiah"   },
  { id: "bf-turut",    label: "Turut"    },
  { id: "bf-penutup",  label: "Penutup"  },
];

// Bangun link Google Calendar (acara 3 jam dari tanggal pernikahan)
function buildCalendarUrl(title: string, location: string): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = WEDDING_DATE;
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${title} — ${GROOM_FIRST} & ${BRIDE_FIRST}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    location,
    details: `Undangan pernikahan ${GROOM_FIRST} & ${BRIDE_FIRST}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ─── HELPERS ───────────────────────────────────────────────────────

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

function useInView(
  threshold = 0.12
): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCountdown(target: number) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

function useImagePreload(src: string): boolean {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true);
    img.src = src;
  }, [src]);
  return loaded;
}

// Preload sekumpulan foto; true bila semua selesai dimuat (atau gagal)
function useImagesReady(srcs: string[]): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (srcs.length === 0) {
      setReady(true);
      return;
    }
    let done = 0;
    let cancelled = false;
    const check = () => {
      done += 1;
      if (!cancelled && done >= srcs.length) setReady(true);
    };
    const imgs = srcs.map((s) => {
      const img = new Image();
      img.onload = check;
      img.onerror = check;
      img.src = s;
      return img;
    });
    return () => {
      cancelled = true;
      imgs.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [srcs]);
  return ready;
}

function useParallax(speed = 0.08) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${-center * speed}px, 0)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);
  return ref;
}

// ─── SVG COMPONENTS ────────────────────────────────────────────────

function OrnDivider({ width = 280 }: { width?: number }) {
  return (
    <svg
      className="bfwed-orn-divider"
      width={width}
      height="22"
      viewBox="0 0 280 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
    >
      <path d="M0 11 L110 11" />
      <path d="M170 11 L280 11" />
      <path d="M125 11 Q140 4 155 11 Q140 18 125 11 Z" />
      <circle cx="140" cy="11" r="1.6" fill="currentColor" />
      <path d="M118 11 L113 8 M118 11 L113 14" />
      <path d="M162 11 L167 8 M162 11 L167 14" />
    </svg>
  );
}

function IconArrow({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function IconMap({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6">
      <path d="M12 22s-7-7.5-7-13a7 7 0 0114 0c0 5.5-7 13-7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function IconCalendar({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  );
}

function IconInstagram({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

// Diamond markers at corners of rail sections
function RailMarks({ offset = 56 }: { offset?: number }) {
  const m: React.CSSProperties = {
    position: "absolute",
    width: 7,
    height: 7,
    background: "var(--bf-cream)",
    border: "1px solid var(--bf-sage)",
    zIndex: 3,
    pointerEvents: "none",
  };
  const railX = "var(--bf-rail-x, 14px)";
  return (
    <>
      <span className="bfwed-rail-mark" style={{ ...m, top: offset, left: railX, transform: "translateX(-50%) rotate(45deg)" }} />
      <span className="bfwed-rail-mark" style={{ ...m, bottom: offset, left: railX, transform: "translateX(-50%) rotate(45deg)" }} />
      <span className="bfwed-rail-mark" style={{ ...m, top: offset, right: railX, transform: "translateX(50%) rotate(45deg)" }} />
      <span className="bfwed-rail-mark" style={{ ...m, bottom: offset, right: railX, transform: "translateX(50%) rotate(45deg)" }} />
    </>
  );
}

// 3D tilt wrapper — mengikuti posisi kursor (dimatikan saat layar sentuh kecil)
function TiltBox({
  className = "",
  style,
  max = 10,
  glare = false,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  max?: number;
  glare?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * max).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
    if (glare) {
      el.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(1)}%`);
    }
  };
  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  return (
    <div
      ref={ref}
      className={`bfwed-tilt${glare ? " glare" : ""} ${className}`}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

// Ornamen bunga statis di pojok cover (PNG dari zip)
function CoverFlowers() {
  return (
    <div aria-hidden="true">
      <div className="bfwed-flower tl"><img src={FLOWER_TL} alt="" /></div>
      <div className="bfwed-flower tr"><img src={FLOWER_TR} alt="" /></div>
      <div className="bfwed-flower br"><img src={FLOWER_BR} alt="" /></div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────

interface WeddingPageBahranFatimatulProps {
  /** Nama ayah mempelai wanita — beda per route (ilmi-zahro vs zahro-ilmi) */
  brideFather?: string;
}

export const WeddingPageBahranFatimatul: React.FC<WeddingPageBahranFatimatulProps> = ({
  brideFather = BRIDE.father,
}) => {
  const [searchParams] = useSearchParams();
  const visitorName = searchParams.get("to") || "Tamu Undangan";

  // Mempelai wanita dengan nama ayah sesuai route
  const bride = { ...BRIDE, father: brideFather };

  const [isOpen, setIsOpen]       = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedId, setCopiedId]   = useState<string | null>(null);
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const scrollY   = useScrollY();
  const countdown = useCountdown(WEDDING_DATE.getTime());

  const coverImageLoaded = useImagePreload(COVER_PHOTO);
  const photosReady = useImagesReady(PRELOAD_PHOTOS);
  const [btnReady, setBtnReady] = useState(false);
  useEffect(() => {
    if (!coverImageLoaded) return;
    const t = setTimeout(() => setBtnReady(true), 300);
    return () => clearTimeout(t);
  }, [coverImageLoaded]);

  // Scroll lock while cover is visible
  useEffect(() => {
    document.body.style.overflow = isOpen ? "auto" : "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  // Floating section nav active index
  const [activeNav, setActiveNav] = useState(0);
  useEffect(() => {
    if (!isOpen) return;
    const compute = () => {
      const mid = window.scrollY + window.innerHeight * 0.4;
      let best = 0;
      NAV_SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= mid) best = i;
      });
      setActiveNav(best);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [isOpen]);

  // Parallax for hero background
  const heroBgRef = useParallax(0.08);

  // Reveal refs
  const [heroRef,    heroVisible]    = useInView(0.1);
  const [dateRef,    dateVisible]    = useInView(0.1);
  const [profileRef, profileVisible] = useInView(0.1);
  const [storyRef,   storyVisible]   = useInView(0.1);
  const [galleryRef, galleryVisible] = useInView(0.1);
  const [giftRef,    giftVisible]    = useInView(0.1);
  const [inviteRef,  inviteVisible]  = useInView(0.1);
  const [closingRef, closingVisible] = useInView(0.1);

  const heroScale   = Math.max(1, 1.1 - (scrollY / 600) * 0.1);
  const heroOpacity = Math.max(0, 1 - scrollY / 900);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, []);

  const toggleMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      a.pause();
      setIsPlaying(false);
    }
  }, []);

  const copyNumber = useCallback((id: string, value: string) => {
    const clean = value.replace(/\s+/g, "");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(clean).catch(() => {});
    } else {
      const ta = document.createElement("textarea");
      ta.value = clean;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1800);
  }, []);

  const gotoSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 12, behavior: "smooth" });
  };

  const navFillPct =
    NAV_SECTIONS.length > 1
      ? (activeNav / (NAV_SECTIONS.length - 1)) * 100
      : 0;

  return (
    <div className="bfwed-root">
      {/* ── Loading (preload foto) ── */}
      {!photosReady && (
        <div className="bfwed-loader" role="status" aria-label="Memuat">
          <span className="bfwed-loader-spin" />
        </div>
      )}

      {/* ── Background Music ── */}
      <audio ref={audioRef} src="/ilmi/muara.mp3" loop preload="auto" />

      {/* ── Music Toggle ── */}
      <button
        className={`bfwed-music-btn${isOpen ? " show" : ""}${isPlaying ? " playing" : ""}`}
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause musik" : "Putar musik"}
      >
        <div className="bfwed-music-eq">
          <div className="bfwed-music-eq-bar" style={{ height: 8 }} />
          <div className="bfwed-music-eq-bar" style={{ height: 14 }} />
          <div className="bfwed-music-eq-bar" style={{ height: 6 }} />
        </div>
      </button>

      {/* ── Section Nav (left floating) ── */}
      {isOpen && (
        <nav className="bfwed-section-nav" aria-label="Navigasi Bagian">
          <div className="bfwed-nav-track" />
          <div
            className="bfwed-nav-track-fill"
            style={{ height: `calc(${navFillPct}% + 1px)` }}
          />
          {NAV_SECTIONS.map((s, i) => (
            <button
              key={s.id}
              className={`bfwed-nav-dot${activeNav === i ? " active" : ""}${i < activeNav ? " past" : ""}`}
              onClick={() => gotoSection(s.id)}
              aria-label={s.label}
              title={s.label}
            >
              <span className="bfwed-nav-dot-circle" />
              <span className="bfwed-nav-label">{s.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* ══════════════════════════════════════════════════════════════
          COVER
      ══════════════════════════════════════════════════════════════ */}
      <div className={`bfwed-cover${isOpen ? " slide-up" : ""}`}>
        {/* Background photo */}
        <div className="bfwed-cover-photo">
          <img src={COVER_PHOTO} alt="" aria-hidden="true" />
          <div className="bfwed-cover-photo-overlay" />
        </div>

        {/* Ornamen bunga di pojok cover */}
        <CoverFlowers />

        {/* Diamond corner markers */}
        <RailMarks offset={32} />

        {/* Cover content */}
        <div className="bfwed-cover-inner">
          <img className="bfwed-flower-divider top" src={FLOWER_DIVIDER} alt="" aria-hidden="true" />
          <img className="bfwed-monogram" src={MONOGRAM} alt="Ilmi & Zahra" />
          <div className="bfwed-cover-eyebrow">The Wedding Invitation</div>

          <p className="bfwed-cover-names-h1" style={{ marginTop: 10 }}>
            {GROOM_FIRST}
          </p>
          <span className="bfwed-cover-amp">&amp;</span>
          <p className="bfwed-cover-names-h1" style={{ marginBottom: 0 }}>
            {BRIDE_FIRST}
          </p>

          <div className="bfwed-cover-date-label" style={{ marginTop: 24 }}>
            Save the Date
          </div>
          <div className="bfwed-cover-date">{DATE_LABEL}</div>

          <div className="bfwed-cover-guest-wrap">
            <div className="bfwed-cover-guest-eyebrow">Kepada Yth.</div>
            <div className="bfwed-cover-guest-name">{visitorName}</div>
          </div>

          <button
            className="bfwed-btn-open"
            onClick={handleOpen}
            disabled={!btnReady}
            style={{ opacity: btnReady ? 1 : 0.5 }}
          >
            <span>Buka Undangan</span>
            <IconArrow size={12} />
          </button>
        </div>

        {/* Made by credit (centered bottom) */}
        <div className="bfwed-cover-credit">
          <a href="https://admoz.pages.dev" target="_blank" rel="noopener noreferrer">
            Crafted by <u> Dirakhmat </u>
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════════ */}
      <main className={`bfwed-main${isOpen ? " revealed" : ""}`}>

        {/* ── 1. Hero ── */}
        <section
          id="bf-hero"
          className="bfwed-section bfwed-hero"
          ref={heroRef as React.RefObject<HTMLElement>}
        >
          {/* Full-bleed background with parallax */}
          <div className="bfwed-hero-bg" ref={heroBgRef}
            style={{ transform: `scale(${heroScale})`, opacity: heroOpacity }}>
            <img src={HERO_PHOTO} alt="" aria-hidden="true" loading="eager" />
          </div>

          <RailMarks />

          {/* Bismillah + verse */}
          <div className={`bfwed-hero-content bfwed-reveal${heroVisible ? " in" : ""}`}
            style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <div className="bfwed-eyebrow">◆ Bismillāhirraḥmānirraḥīm ◆</div>
            <div className="bfwed-bismillah-ar">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <p className="bfwed-verse">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
              istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa
              tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."
            </p>
            <div className="bfwed-eyebrow" style={{ marginTop: 12 }}>QS. Ar-Rūm : 21</div>
          </div>

          {/* Names */}
          <div
            className={`bfwed-hero-content bfwed-hero-names bfwed-reveal${heroVisible ? " in" : ""}`}
            style={{ textAlign: "center", transitionDelay: "0.2s" }}
          >
            <img className="bfwed-hero-logo" src={LOGO_HERO} alt="Ilmi & Zahra" />
            <div className="bfwed-hero-wedding-of">The Wedding of</div>
            <h1 className="bfwed-hero-name-big" style={{ marginTop: 18 }}>
              {GROOM_FIRST}
            </h1>
            <span className="bfwed-hero-amp">&amp;</span>
            <h1 className="bfwed-hero-name-big">{BRIDE_FIRST}</h1>
            {/* <img className="bfwed-flower-divider" src={FLOWER_DIVIDER} alt="" aria-hidden="true" /> */}
            <div className="bfwed-hero-wedding-of" style={{ marginTop: 24 }}>
              {DATE_LABEL}
            </div>
          </div>

          {/* Invitation text */}
          <div
            className={`bfwed-hero-content bfwed-hero-invitation bfwed-reveal${heroVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.4s" }}
          >
            <p>Assalāmu'alaikum Warahmatullāhi Wabarakātuh</p>
            <p>
              Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan
              pernikahan putra-putri kami. Suatu kehormatan dan kebahagiaan bagi kami
              apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
            </p>
          </div>
        </section>

        {/* ── 2. Save the Date / Countdown / Location ── */}
        <section
          id="bf-date"
          className="bfwed-section bfwed-date-section"
          ref={dateRef as React.RefObject<HTMLElement>}
        >
          <RailMarks />

          <div className={`bfwed-reveal${dateVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <div className="bfwed-eyebrow">◆ Save the Date ◆</div>
            <h2 className="bfwed-section-heading">Hari Bahagia Kami</h2>
            <div style={{ fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase",
              color: "var(--bf-ink-2)", marginBottom: 48 }}>
              {DATE_LABEL}
            </div>
          </div>

          {/* Countdown */}
          <div className={`bfwed-countdown-grid bfwed-reveal${dateVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.15s" }}>
            {[
              { n: countdown.days,    l: "Hari"  },
              { n: countdown.hours,   l: "Jam"   },
              { n: countdown.minutes, l: "Menit" },
              { n: countdown.seconds, l: "Detik" },
            ].map((c) => (
              <div key={c.l} className="bfwed-cd-cell">
                <div className="bfwed-cd-num">{String(c.n).padStart(2, "0")}</div>
                <div className="bfwed-cd-lbl">{c.l}</div>
              </div>
            ))}
          </div>

          {/* Event cards */}
          <div
            className={`bfwed-events-grid bfwed-reveal${dateVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.3s" }}
          >
            {EVENTS.map((ev, i) => (
              <div key={i} className="bfwed-event-card">
                <div className="bfwed-event-tag">{ev.tag}</div>
                <h3 className="bfwed-event-title">{ev.title}</h3>
                <OrnDivider width={140} />
                <div className="bfwed-event-info" style={{ marginTop: 18 }}>
                  <div className="strong">{ev.day}</div>
                  <div>{ev.date}</div>
                  <div>{ev.time}</div>
                  <div className="italic" style={{ marginTop: 14 }}>{ev.venue}</div>
                  <div>{ev.address}</div>
                </div>
                <div className="bfwed-event-actions">
                  <a
                    href={MAP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bfwed-btn-sm solid"
                  >
                    <IconMap size={13} /> Buka Maps
                  </a>
                  <a
                    href={buildCalendarUrl(ev.title, ev.venue)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bfwed-btn-sm"
                  >
                    <IconCalendar size={13} /> Kalender
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className={`bfwed-reveal${dateVisible ? " in" : ""}`}
            style={{ textAlign: "center", transitionDelay: "0.45s" }}>
            <div className="bfwed-eyebrow">◆ Lokasi Acara ◆</div>
            <h3 className="bfwed-section-heading" style={{ fontSize: "clamp(28px,4vw,36px)" }}>
              Petunjuk Arah
            </h3>
            <div className="bfwed-map-frame">
              <iframe
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Acara"
                allowFullScreen
              />
            </div>
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bfwed-btn-ghost"
            >
              <IconMap /> Buka di Google Maps
            </a>
          </div>
        </section>

        {/* ── 3. Profile Mempelai ── */}
        <section
          id="bf-mempelai"
          className="bfwed-section bfwed-profile-section"
          ref={profileRef as React.RefObject<HTMLElement>}
        >
          <RailMarks />

          <div className={`bfwed-reveal${profileVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <div className="bfwed-eyebrow">◆ Mempelai ◆</div>
            <h2 className="bfwed-section-heading">Kedua Mempelai</h2>
            <p style={{ fontSize: 14, color: "var(--bf-ink-2)", maxWidth: 480,
              margin: "0 auto 64px", lineHeight: 1.8 }}>
              Dengan segala kerendahan hati dan rasa syukur, izinkanlah kami memperkenalkan
              kedua calon mempelai.
            </p>
          </div>

          <div className="bfwed-profile-grid">
            {[GROOM, bride].map((person, idx) => (
              <div
                key={person.name}
                className={`bfwed-profile-card bfwed-reveal${profileVisible ? " in" : ""}`}
                style={{ transitionDelay: `${idx * 0.2}s` }}
              >
                <div className="bfwed-profile-photo-wrap">
                  <TiltBox className="bfwed-profile-photo" max={9} glare>
                    <img src={person.photo} alt={person.name} loading="lazy" />
                  </TiltBox>
                </div>
                <div className="bfwed-profile-label">{person.label}</div>
                <h3 className="bfwed-profile-name">{person.name}</h3>
                <div className="bfwed-profile-order">{person.order}</div>
                <OrnDivider width={160} />
                <div style={{ marginTop: 22 }}>
                  <div className="bfwed-profile-parents-label">Putra/Putri dari</div>
                  <div className="bfwed-profile-parents">
                    Bapak {person.father}<br />&amp;<br />Ibu {person.mother}
                  </div>
                </div>
                <div className="bfwed-profile-address">{person.address}</div>
                <a
                  className="bfwed-ig-link"
                  href={`https://instagram.com/${person.ig.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconInstagram /> {person.ig}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Cerita Kami / Our Story ── */}
        <section
          id="bf-cerita"
          className="bfwed-section bfwed-story-section"
          ref={storyRef as React.RefObject<HTMLElement>}
        >
          <RailMarks />

          <div className={`bfwed-reveal${storyVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <div className="bfwed-eyebrow">◆ Our Story ◆</div>
            <h2 className="bfwed-section-heading">Cerita Kami</h2>
          </div>

          <div className={`bfwed-story-photo bfwed-reveal${storyVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.1s" }}>
            <img src={OURSTORY_PHOTO} alt="Cerita kami" loading="lazy" />
          </div>

          <div className={`bfwed-story-timeline bfwed-reveal${storyVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.2s" }}>
            {STORY.map((s) => (
              <div key={s.title} className="bfwed-story-item">
                <h3 className="bfwed-story-item-title">{s.title}</h3>
                <p className="bfwed-story-item-body">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. Gallery ── */}
        <section
          id="bf-galeri"
          className="bfwed-section bfwed-gallery-section"
          ref={galleryRef as React.RefObject<HTMLElement>}
        >
          <RailMarks />

          <div className={`bfwed-reveal${galleryVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <div className="bfwed-eyebrow">◆ Our Story ◆</div>
            <h2 className="bfwed-section-heading">Galeri Momen</h2>
            <p style={{ fontSize: 14, color: "var(--bf-ink-2)",
              maxWidth: 460, margin: "0 auto 56px", lineHeight: 1.8 }}>
              Setiap senyum, setiap langkah — kami abadikan menjelang hari yang
              telah lama kami nantikan.
            </p>
          </div>

          <div className={`bfwed-gallery bfwed-reveal${galleryVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.15s" }}>
            {GALLERY_PHOTOS.map((src, i) => (
              <TiltBox key={i} className={`g g${i + 1}`} max={7} glare>
                <img src={src} alt={`Galeri ${i + 1}`} loading="lazy" />
              </TiltBox>
            ))}
          </div>

          <div className={`bfwed-reveal${galleryVisible ? " in" : ""}`}
            style={{ textAlign: "center", transitionDelay: "0.3s" }}>
            <p className="bfwed-gallery-quote">
              "Cinta yang berlandaskan iman adalah cinta yang abadi —
              tumbuh dalam doa, dirawat oleh kesabaran."
            </p>
          </div>
        </section>

        {/* ── 5. Wedding Gift ── */}
        <section
          id="bf-hadiah"
          className="bfwed-section bfwed-gift-section"
          ref={giftRef as React.RefObject<HTMLElement>}
        >
          <RailMarks />

          <div className={`bfwed-reveal${giftVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <div className="bfwed-eyebrow">◆ Wedding Gift ◆</div>
            <h2 className="bfwed-section-heading">Tanda Kasih</h2>
            <p className="bfwed-gift-intro">
              Doa restu adalah hadiah terindah bagi kami. Namun jika Bapak/Ibu/Saudara/i
              berkenan memberikan tanda kasih, dapat dikirimkan melalui kanal berikut:
            </p>
          </div>

          <div className={`bfwed-gift-cards bfwed-reveal${giftVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.15s" }}>
            {GIFTS.map((g) => (
              <div key={g.id} className="bfwed-gift-card">
                <div className="bfwed-gift-logo" style={{ background: g.bg }}>
                  {g.logo}
                </div>
                <div className="bfwed-gift-type">{g.type}</div>
                <div className="bfwed-gift-name">{g.name}</div>
                <OrnDivider width={120} />
                <div className="bfwed-gift-num">{g.number}</div>
                <div className="bfwed-gift-holder">a.n. {g.holder}</div>
                <button
                  className={`bfwed-gift-copy-btn${copiedId === g.id ? " copied" : ""}`}
                  onClick={() => copyNumber(g.id, g.number)}
                >
                  {copiedId === g.id ? "✓ Tersalin" : "Salin Nomor"}
                </button>
              </div>
            ))}
          </div>

          {GIFT_ADDRESS && (
            <div className={`bfwed-gift-address-wrap bfwed-reveal${giftVisible ? " in" : ""}`}
              style={{ transitionDelay: "0.3s" }}>
              <div className="bfwed-eyebrow">◆ Alamat Kirim Hadiah ◆</div>
              <div className="bfwed-gift-address-text">{GIFT_ADDRESS}</div>
            </div>
          )}

          <p
            className={`bfwed-reveal${giftVisible ? " in" : ""}`}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 18, fontStyle: "italic",
              color: "var(--bf-ink-2)",
              maxWidth: 480, margin: "56px auto 0",
              lineHeight: 1.6, textAlign: "center",
              transitionDelay: "0.45s",
            }}
          >
            "Terima kasih atas kemurahan hati dan doa baik dari Bapak/Ibu/Saudara/i."
          </p>
        </section>

        {/* ── 7. Turut Mengundang ── */}
        {/* <section
          id="bf-turut"
          className="bfwed-section bfwed-invite-section"
          ref={inviteRef as React.RefObject<HTMLElement>}
        >
          <RailMarks />

          <div className={`bfwed-reveal${inviteVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <div className="bfwed-eyebrow">◆ Turut Mengundang ◆</div>
            <h2 className="bfwed-section-heading">Turut Mengundang</h2>
            <p style={{ fontSize: 14, color: "var(--bf-ink-2)", maxWidth: 480,
              margin: "0 auto 56px", lineHeight: 1.8 }}>
              Kami yang berbahagia, beserta seluruh keluarga besar yang turut mengundang.
            </p>
          </div>

          <div className={`bfwed-invite-grid bfwed-reveal${inviteVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.15s" }}>
            <div className="bfwed-invite-col">
              <h3 className="bfwed-invite-col-title">Kel. Mempelai Pria</h3>
              <ol className="bfwed-invite-list">
                {INVITERS.pria.map((nm, i) => (
                  <li key={i}>{nm}</li>
                ))}
              </ol>
            </div>
            <div className="bfwed-invite-col">
              <h3 className="bfwed-invite-col-title">Kel. Mempelai Wanita</h3>
              <ol className="bfwed-invite-list">
                {INVITERS.wanita.map((nm, i) => (
                  <li key={i}>{nm}</li>
                ))}
              </ol>
            </div>
          </div>
        </section> */}

        {/* ── 8. Closing ── */}
        <section
          id="bf-penutup"
          className="bfwed-section bfwed-closing-section"
          ref={closingRef as React.RefObject<HTMLElement>}
        >
          <RailMarks />

          <div className={`bfwed-reveal${closingVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <img className="bfwed-closing-logo" src={LOGO_CLOSING} alt="Ilmi & Zahra" />

            <p className="bfwed-closing-body">
              Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila
              Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada
              kedua mempelai.
            </p>

            <div className="bfwed-closing-divider">
              <span style={{ fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}>
                Terima Kasih
              </span>
            </div>

            <p style={{ fontSize: 14, color: "var(--bf-ink-2)", marginBottom: 8 }}>
              Wassalāmu'alaikum Warahmatullāhi Wabarakātuh
            </p>

            <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
              color: "var(--bf-ink-2)", marginTop: 48, marginBottom: 24 }}>
              Kami yang berbahagia,
            </div>

            <div className="bfwed-closing-names">
              {GROOM_FIRST}
              <span className="script-amp">&amp;</span>
              {BRIDE_FIRST}
            </div>
            <div className="bfwed-closing-family">beserta keluarga besar</div>
          </div>

          {/* Footer */}
          <div className="bfwed-footer">
            <div className="bfwed-footer-copy">
              © {new Date().getFullYear()} · Bahran &amp; Fatimatul
            </div>
            <a
              href="https://admoz.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="bfwed-footer-credit"
            >
              Crafted by <u> Dirakhmat </u>
            </a>
          </div>
        </section>

      </main>
    </div>
  );
};
