import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./WeddingPageBagasNadira.css";

gsap.registerPlugin(ScrollTrigger);

// ─── CONFIG ────────────────────────────────────────────────────────
// Semua data undangan ada di sini. Ganti nilai placeholder dengan data asli.
const WEDDING_DATE = new Date("2027-11-06T09:00:00+07:00");
const GROOM_FIRST = "Bagas";
const BRIDE_FIRST = "Nadira";
const DATE_LABEL = "Sabtu, 6 November 2027";
const POETRY_LINE = "Dua jiwa, satu cahaya yang sama.";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Surabaya&t=&z=14&ie=UTF8&iwloc=&output=embed";
const MAP_LINK = "https://maps.app.goo.gl/";

// Endpoint Google Apps Script Web App untuk RSVP & Ucapan (Constellation Wall).
// Kosongkan ("") untuk mode demo. Cara setup: lihat public/bagas/README-google-sheets.md
const SHEETS_ENDPOINT = "";

const GROOM = {
  name: "Bagas Aditya Wibowo",
  nick: "Bagas",
  desc: "Tenang, penuh perhatian, dan percaya bahwa hal-hal berharga tumbuh dari kesabaran.",
  parents: "Bapak Suryanto & Ibu Wulandari",
  ig: "bagas.aw",
  photo: "/bagas/groom.svg",
};

const BRIDE = {
  name: "Nadira Kusuma Putri",
  nick: "Nadira",
  desc: "Lembut namun teguh, ia memandang cinta sebagai sesuatu yang dijaga, bukan sekadar dirasakan.",
  parents: "Bapak Hidayat & Ibu Kartika",
  ig: "nadira.kp",
  photo: "/bagas/bride.svg",
};

const STORY: { title: string; body: string; photo: string }[] = [
  {
    title: "Pertemuan Pertama",
    body: "Di sebuah sore yang sederhana, dua langkah bertemu tanpa rencana — dan sejak itu, waktu terasa berjalan berbeda.",
    photo: "/bagas/s1.svg",
  },
  {
    title: "Jadian",
    body: "Perlahan, kepercayaan tumbuh menjadi janji untuk saling menemani — dalam diam maupun dalam kata.",
    photo: "/bagas/s2.svg",
  },
  {
    title: "Lamaran",
    body: "Dengan restu yang menyertai, sebuah janji kecil diucapkan sebagai awal dari janji seumur hidup.",
    photo: "/bagas/s3.svg",
  },
  {
    title: "Menuju Halal",
    body: "Kini, dua cahaya itu bersiap menyatu — melangkah bersama menuju babak yang telah lama dinanti.",
    photo: "/bagas/s4.svg",
  },
];

const EVENTS = [
  { title: "Akad Nikah", time: "09.00 – 11.00 WIB", venue: "The Grand Pavilion", address: "Jl. Placeholder No. 1, Surabaya" },
  { title: "Resepsi", time: "12.00 WIB – Selesai", venue: "The Grand Pavilion", address: "Jl. Placeholder No. 1, Surabaya" },
];

const GIFTS = [
  { type: "Transfer Bank", name: "Bank Mandiri", number: "1234567890", holder: "Nadira Kusuma Putri" },
  { type: "E-Wallet", name: "OVO", number: "081234567890", holder: "Bagas Aditya Wibowo" },
];

const SHIPPING_ADDRESS = "Bagas Aditya Wibowo — Jl. Placeholder No. 1, Surabaya, 60111 (0812-3456-7890)";

const UCAPAN_SEED: UcapanItem[] = [
  { nama: "Keluarga Besar", pesan: "Selamat menempuh hidup baru, semoga menjadi keluarga yang penuh cahaya dan kedamaian.", time: Date.now() - 1000 * 60 * 15 },
  { nama: "Sahabat", pesan: "Bahagia selalu untuk kalian berdua. Doa terbaik menyertai.", time: Date.now() - 1000 * 60 * 70 },
  { nama: "Rekan Kerja", pesan: "Semoga sakinah, mawaddah, warahmah. Selamat menempuh hidup baru!", time: Date.now() - 1000 * 60 * 130 },
];

// ─── TYPES ─────────────────────────────────────────────────────────
interface UcapanItem { nama: string; pesan: string; time: number; }
type Kehadiran = "Hadir" | "Tidak Hadir" | "Masih Ragu";
type PerfTier = "low" | "high";

// ─── HELPERS ───────────────────────────────────────────────────────
function downloadIcs(title: string, location: string): void {
  const fmt = (d: Date) => d.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const start = WEDDING_DATE;
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//WeddingBagasNadira//EN", "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
    `SUMMARY:${title} — ${GROOM_FIRST} & ${BRIDE_FIRST}`,
    `LOCATION:${location}`, `DESCRIPTION:Undangan pernikahan ${GROOM_FIRST} & ${BRIDE_FIRST}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${GROOM_FIRST}_${BRIDE_FIRST}_wedding.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function useInView(threshold = 0.2): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function usePerfTier(): PerfTier {
  const reduced = useReducedMotion();
  const [tier, setTier] = useState<PerfTier>("high");
  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4;
    setTier(cores <= 4 ? "low" : "high");
  }, []);
  return reduced ? "low" : tier;
}

function useCountdown(target: number) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
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

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "baru saja";
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  return `${Math.floor(hr / 24)} hari lalu`;
}

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

async function submitToSheet(payload: Record<string, string>): Promise<boolean> {
  if (!SHEETS_ENDPOINT) return true;
  try {
    await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return true;
  } catch { return false; }
}

async function fetchUcapan(): Promise<UcapanItem[] | null> {
  if (!SHEETS_ENDPOINT) return null;
  try {
    const res = await fetch(SHEETS_ENDPOINT, { method: "GET" });
    const data = await res.json();
    if (!data || !Array.isArray(data.ucapan)) return null;
    return data.ucapan.map((u: { nama: string; pesan: string; time: string }) => ({
      nama: u.nama, pesan: u.pesan, time: new Date(u.time).getTime() || Date.now(),
    }));
  } catch { return null; }
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fallback below */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch { return false; }
}

// ─── 3D TILT HOOK ──────────────────────────────────────────────────
function useTilt3D(maxDeg = 12, reduced = false) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [gyroEnabled, setGyroEnabled] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ rx: -py * maxDeg * 2, ry: px * maxDeg * 2 });
    };
    const onLeave = () => setTilt({ rx: 0, ry: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [maxDeg, reduced]);

  useEffect(() => {
    if (!gyroEnabled || reduced) return;
    const onOrient = (e: DeviceOrientationEvent) => {
      const beta = Math.max(-30, Math.min(30, e.beta || 0));
      const gamma = Math.max(-30, Math.min(30, e.gamma || 0));
      setTilt({ rx: -(beta / 30) * maxDeg, ry: (gamma / 30) * maxDeg });
    };
    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, [gyroEnabled, maxDeg, reduced]);

  // Aktifkan efek gyroscope otomatis (tanpa tombol). Di iOS 13+, requestPermission()
  // hanya bisa dikabulkan lewat user gesture — jika browser mewajibkannya, panggilan
  // otomatis ini akan gagal diam-diam dan tilt tetap jalan lewat mouse (desktop).
  useEffect(() => {
    if (reduced) return;
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<"granted" | "denied"> };
    if (DOE && typeof DOE.requestPermission === "function") {
      DOE.requestPermission().then((res) => { if (res === "granted") setGyroEnabled(true); }).catch(() => {});
    } else if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      setGyroEnabled(true);
    }
  }, [reduced]);

  return { ref, tilt, gyroEnabled };
}

// ─── SVG ICONS ─────────────────────────────────────────────────────
const IconMap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconInstagram = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconCopy = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M18 6 6 18M6 6l12 12" /></svg>
);

// ─── REVEAL ────────────────────────────────────────────────────────
const Reveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [ref, visible] = useInView(0.15);
  return <div ref={ref} className={`bnwed-reveal ${visible ? "in" : ""} ${className || ""}`}>{children}</div>;
};

// ─── PARTICLE CANVAS (lightweight, used by Opening & Constellation bg) ──
const ParticleCanvas: React.FC<{ count: number; color: string; className?: string }> = ({ count, color, className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0, h = 0;
    const dots = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.4,
    }));
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = canvas.width = rect.width * devicePixelRatio;
      h = canvas.height = rect.height * devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);
    const start = performance.now();
    const draw = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const d of dots) {
        const opacity = 0.35 + 0.35 * Math.sin(t * d.speed + d.phase);
        ctx.globalAlpha = Math.max(0.08, opacity);
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [count, color]);
  return <canvas ref={canvasRef} className={className} aria-hidden />;
};

// ─── OPENING LIGHT ─────────────────────────────────────────────────
const OpeningLight: React.FC<{ perfTier: PerfTier; onEnter: () => void }> = ({ perfTier, onEnter }) => {
  const [revealed, setRevealed] = useState(false);
  const handleEnter = () => {
    if (revealed) return;
    setRevealed(true);
    setTimeout(onEnter, 1500);
  };
  return (
    <motion.div
      className="bnwed-opening"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onClick={handleEnter}
      role="button"
      tabIndex={0}
      aria-label="Buka undangan"
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleEnter(); }}
    >
      <ParticleCanvas count={perfTier === "low" ? 18 : 48} color="#e8e2d3" className="bnwed-opening-particles" />
      <motion.div
        className="bnwed-light-dot"
        animate={revealed ? { scale: 40, opacity: 0.06 } : { scale: [1, 1.15, 1] }}
        transition={revealed ? { duration: 1.4, ease: "easeOut" } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <AnimatePresence>
        {revealed && (
          <motion.div className="bnwed-opening-names" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
            <span className="bnwed-opening-name">{GROOM_FIRST}</span>
            <span className="bnwed-opening-amp">&amp;</span>
            <span className="bnwed-opening-name">{BRIDE_FIRST}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {!revealed && <p className="bnwed-opening-hint">Ketuk untuk membuka</p>}
    </motion.div>
  );
};

// ─── HERO GLASS CARD ───────────────────────────────────────────────
const HeroGlassCard: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const { ref, tilt } = useTilt3D(10, reduced);
  return (
    <section className="bnwed-hero">
      <div className="bnwed-hero-gradient" />
      <div
        ref={ref}
        className="bnwed-glass bnwed-hero-card"
        style={{ transform: reduced ? undefined : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
      >
        <p className="bnwed-eyebrow center">The Wedding Of</p>
        <h1 className="bnwed-hero-names">{GROOM_FIRST} <span className="bnwed-amp">&amp;</span> {BRIDE_FIRST}</h1>
        <p className="bnwed-hero-date">{DATE_LABEL}</p>
        <p className="bnwed-hero-poetry">&ldquo;{POETRY_LINE}&rdquo;</p>
      </div>
    </section>
  );
};

// ─── OUR STORY SCROLL (GSAP ScrollTrigger) ────────────────────────
const OurStoryScroll: React.FC<{ perfTier: PerfTier; reduced: boolean }> = ({ perfTier, reduced }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced || !containerRef.current) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".bnwed-story-item");
      items.forEach((item) => {
        const photo = item.querySelector<HTMLElement>(".bnwed-story-photo");
        const text = item.querySelector<HTMLElement>(".bnwed-story-text");
        const deco = item.querySelector<HTMLElement>(".bnwed-story-deco");

        if (photo) {
          gsap.fromTo(
            photo,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              ease: "none",
              scrollTrigger: { trigger: item, start: "top 80%", end: "top 30%", scrub: true },
            }
          );
        }
        if (text) {
          gsap.fromTo(
            text,
            { opacity: 0, filter: "blur(14px)", y: 24 },
            {
              opacity: 1, filter: "blur(0px)", y: 0,
              scrollTrigger: { trigger: item, start: "top 75%", end: "top 40%", scrub: true },
            }
          );
        }
        if (deco && perfTier === "high") {
          gsap.to(deco, {
            yPercent: -30, ease: "none",
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
        if (photo && perfTier === "high") {
          gsap.to(photo, {
            yPercent: -8, ease: "none",
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      });
    }, containerRef);

    return () => { ctx.revert(); };
  }, [perfTier, reduced]);

  return (
    <section className="bnwed-section bnwed-story-wrap" ref={containerRef} aria-label="Cerita kami">
      <Reveal><p className="bnwed-eyebrow center">Our Story</p></Reveal>
      {STORY.map((s, i) => (
        <div key={i} className={`bnwed-story-item ${reduced ? "bnwed-static" : ""}`}>
          <span className="bnwed-story-deco" aria-hidden />
          <div className="bnwed-story-photo" style={{ backgroundImage: `url(${s.photo})` }} />
          <div className="bnwed-story-text">
            <span className="bnwed-story-num">{pad(i + 1)}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

// ─── COUPLE PROFILE GLASS ──────────────────────────────────────────
const ProfileGlassCard: React.FC<{ p: typeof GROOM; hovered: boolean; onHover: (v: boolean) => void }> = ({ p, hovered, onHover }) => {
  const [ref, visible] = useInView(0.2);
  return (
    <motion.div
      ref={ref}
      className="bnwed-glass bnwed-profile"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      animate={{ scale: hovered ? 0.96 : 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={`bnwed-profile-photo ${visible ? "in" : ""}`}>
        <img src={p.photo} alt={p.name} loading="lazy" />
      </div>
      <h3 className="bnwed-profile-name">{p.name}</h3>
      <p className="bnwed-profile-nick">{p.nick}</p>
      <p className="bnwed-profile-desc">{p.desc}</p>
      <p className="bnwed-profile-parents">Anak dari {p.parents}</p>
      {p.ig && (
        <a className="bnwed-ig" href={`https://instagram.com/${p.ig}`} target="_blank" rel="noreferrer">
          <IconInstagram /> @{p.ig}
        </a>
      )}
    </motion.div>
  );
};

const CoupleProfileGlass: React.FC = () => {
  const [hoveredA, setHoveredA] = useState(false);
  const [hoveredB, setHoveredB] = useState(false);
  return (
    <section className="bnwed-section" aria-label="Kedua mempelai">
      <Reveal><p className="bnwed-eyebrow center">Kedua Mempelai</p></Reveal>
      <div className="bnwed-profile-grid">
        <ProfileGlassCard p={GROOM} hovered={hoveredB} onHover={setHoveredA} />
        <ProfileGlassCard p={BRIDE} hovered={hoveredA} onHover={setHoveredB} />
      </div>
    </section>
  );
};

// ─── HOLOGRAM EVENT CARD ───────────────────────────────────────────
const HologramBorder: React.FC = () => {
  const [ref, visible] = useInView(0.3);
  return (
    <svg ref={ref as unknown as React.RefObject<SVGSVGElement>} className="bnwed-hologram-svg" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden>
      <rect x="2" y="2" width="296" height="196" rx="10" fill="none" stroke="currentColor" strokeWidth="1"
        pathLength={1} strokeDasharray={1} strokeDashoffset={visible ? 0 : 1}
        style={{ transition: "stroke-dashoffset 1.8s ease" }} />
    </svg>
  );
};

const BlurDigit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="bnwed-countdown-cell">
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        className="bnwed-countdown-value"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(8px)" }}
        transition={{ duration: 0.5 }}
      >
        {pad(value)}
      </motion.span>
    </AnimatePresence>
    <span className="bnwed-countdown-label">{label}</span>
  </div>
);

const EventHologramCard: React.FC = () => {
  const c = useCountdown(WEDDING_DATE.getTime());
  return (
    <section className="bnwed-section" aria-label="Detail acara">
      <Reveal>
        <p className="bnwed-eyebrow center">Save The Date</p>
        <div className="bnwed-countdown-row">
          <BlurDigit value={c.days} label="Hari" />
          <BlurDigit value={c.hours} label="Jam" />
          <BlurDigit value={c.minutes} label="Menit" />
          <BlurDigit value={c.seconds} label="Detik" />
        </div>

        {EVENTS.map((e) => (
          <div key={e.title} className="bnwed-hologram-card">
            <HologramBorder />
            <div className="bnwed-hologram-content">
              <h4>{e.title}</h4>
              <p><b>{DATE_LABEL}</b> · {e.time}</p>
              <p>{e.venue} — {e.address}</p>
            </div>
          </div>
        ))}

        <div className="bnwed-event-actions">
          <button className="bnwed-btn primary" onClick={() => downloadIcs("Pernikahan", EVENTS[0].venue)}>
            <IconCalendar /> Tambahkan ke Kalender
          </button>
          <a className="bnwed-btn ghost" href={MAP_LINK} target="_blank" rel="noreferrer">
            <IconMap /> Buka di Maps
          </a>
        </div>

        <div className="bnwed-map"><iframe title="Lokasi acara" src={MAP_EMBED_URL} loading="lazy" /></div>
      </Reveal>
    </section>
  );
};

// ─── GIFT SECTION (with ripple) ───────────────────────────────────
const GiftCard: React.FC<{ g: typeof GIFTS[number] }> = ({ g }) => {
  const [copied, setCopied] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const onCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
    const ok = await copyText(g.number);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  return (
    <div className="bnwed-glass bnwed-gift-card">
      <div className="bnwed-gift-type">{g.type}</div>
      <div className="bnwed-gift-name">{g.name}</div>
      <div className="bnwed-gift-number">{g.number}</div>
      <div className="bnwed-gift-holder">a.n. {g.holder}</div>
      <button className={`bnwed-copy ${copied ? "done" : ""}`} onClick={onCopy}>
        {ripples.map((r) => <span key={r.id} className="bnwed-ripple" style={{ left: r.x, top: r.y }} />)}
        {copied ? "Tersalin ✓" : <><IconCopy /> Salin</>}
      </button>
    </div>
  );
};

const GiftSection: React.FC = () => {
  const [showAddr, setShowAddr] = useState(false);
  return (
    <section className="bnwed-section" aria-label="Hadiah">
      <Reveal>
        <p className="bnwed-eyebrow center">Tanda Kasih</p>
        <p className="bnwed-gift-intro">
          Doa dan kehadiran Anda adalah hadiah terbesar bagi kami. Namun jika Anda ingin memberi
          tanda kasih tambahan, kami dengan senang hati menerimanya melalui:
        </p>
        <div className="bnwed-gift-list">{GIFTS.map((g) => <GiftCard key={g.name} g={g} />)}</div>
        <button className="bnwed-gift-shiplink" onClick={() => setShowAddr((v) => !v)}>
          Ingin mengirim kado secara langsung?
        </button>
        <AnimatePresence>
          {showAddr && (
            <motion.div className="bnwed-gift-addr" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <p>{SHIPPING_ADDRESS}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
};

// ─── CONSTELLATION WALL ────────────────────────────────────────────
function generatePositions(n: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  let attempts = 0;
  while (positions.length < n && attempts < n * 40) {
    attempts++;
    const candidate = { x: 6 + Math.random() * 88, y: 8 + Math.random() * 84 };
    const tooClose = positions.some((p) => Math.hypot(p.x - candidate.x, p.y - candidate.y) < 14);
    if (!tooClose) positions.push(candidate);
  }
  while (positions.length < n) positions.push({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 });
  return positions;
}

const ConstellationWall: React.FC<{ guest: string; list: UcapanItem[]; onAdd: (u: UcapanItem) => void; perfTier: PerfTier }> = ({ guest, list, onAdd, perfTier }) => {
  const positions = useMemo(() => generatePositions(list.length), [list.length]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [nama, setNama] = useState(guest === "Tamu Undangan" ? "" : guest);
  const [kehadiran, setKehadiran] = useState<Kehadiran>("Hadir");
  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !pesan.trim()) return;
    setSending(true);
    const item: UcapanItem = { nama: nama.trim(), pesan: pesan.trim(), time: Date.now() };
    onAdd(item);
    await Promise.all([
      submitToSheet({ type: "rsvp", nama: item.nama, kehadiran, jumlah: String(jumlah), pesan: item.pesan }),
      submitToSheet({ type: "ucapan", nama: item.nama, pesan: item.pesan }),
    ]);
    setPesan("");
    setSending(false);
  };

  return (
    <section className="bnwed-section bnwed-constellation-section" aria-label="Ucapan">
      <Reveal>
        <p className="bnwed-eyebrow center light">Constellation Wall</p>
        <p className="bnwed-constellation-hint">Tiap cahaya adalah doa dari orang-orang terkasih. Ketuk untuk membaca.</p>
      </Reveal>

      <div className="bnwed-constellation-canvas">
        <ParticleCanvas count={perfTier === "low" ? 0 : 12} color="#ffffff" className="bnwed-constellation-bg" />
        {list.map((u, i) => {
          const pos = positions[i] || { x: 50, y: 50 };
          return (
            <button
              key={`${u.nama}-${u.time}`}
              className="bnwed-star"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => setOpenIdx(i)}
              aria-label={`Ucapan dari ${u.nama}`}
            >
              <span className="bnwed-star-dot" />
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {openIdx !== null && list[openIdx] && (
          <motion.div className="bnwed-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenIdx(null)}>
            <motion.div className="bnwed-glass bnwed-star-modal" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <button className="bnwed-modal-close" onClick={() => setOpenIdx(null)} aria-label="Tutup"><IconClose /></button>
              <p className="bnwed-star-modal-msg">&ldquo;{list[openIdx].pesan}&rdquo;</p>
              <div className="bnwed-star-modal-meta">— {list[openIdx].nama} · {relativeTime(list[openIdx].time)}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <form className="bnwed-glass bnwed-form" onSubmit={submit}>
        <h3 className="bnwed-form-title">RSVP &amp; Ucapan</h3>
        <label className="bnwed-field">
          <span>Nama</span>
          <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Anda" required />
        </label>
        <div className="bnwed-field">
          <span>Konfirmasi Kehadiran</span>
          <div className="bnwed-choices">
            {(["Hadir", "Tidak Hadir", "Masih Ragu"] as Kehadiran[]).map((k) => (
              <button type="button" key={k} className={kehadiran === k ? "on" : ""} onClick={() => setKehadiran(k)}>{k}</button>
            ))}
          </div>
        </div>
        {kehadiran !== "Tidak Hadir" && (
          <label className="bnwed-field">
            <span>Jumlah Tamu</span>
            <div className="bnwed-stepper">
              <button type="button" onClick={() => setJumlah((n) => Math.max(1, n - 1))}>−</button>
              <b>{jumlah}</b>
              <button type="button" onClick={() => setJumlah((n) => Math.min(10, n + 1))}>+</button>
            </div>
          </label>
        )}
        <label className="bnwed-field">
          <span>Pesan</span>
          <textarea value={pesan} onChange={(e) => setPesan(e.target.value)} rows={3} placeholder="Tuliskan doa & ucapan Anda..." required />
        </label>
        <button className="bnwed-btn primary block" type="submit" disabled={sending}>
          {sending ? "Mengirim..." : "Kirim"}
        </button>
      </form>
    </section>
  );
};

// ─── CLOSING LIGHT ─────────────────────────────────────────────────
const ClosingLight: React.FC = () => (
  <section className="bnwed-closing" aria-label="Penutup">
    <Reveal>
      <motion.div className="bnwed-closing-dot" initial={{ scale: 40, opacity: 0.06 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: "easeOut" }} />
      <p className="bnwed-closing-text">
        Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan
        memberikan doa restu.
      </p>
      <div className="bnwed-signature">{GROOM_FIRST} &amp; {BRIDE_FIRST}</div>
      <footer className="bnwed-footer">
        <div>© {new Date().getFullYear()} · {GROOM_FIRST} &amp; {BRIDE_FIRST}</div>
        <a className="bnwed-footer-credit" href="https://dirakhmat.app" target="_blank" rel="noopener noreferrer">
          by <u>Dirakhmat</u>
        </a>
      </footer>
    </Reveal>
  </section>
);

// ─── ROOT ──────────────────────────────────────────────────────────
export const WeddingPageBagasNadira: React.FC = () => {
  const [searchParams] = useSearchParams();
  const guest = searchParams.get("to") || "Tamu Undangan";
  const [entered, setEntered] = useState(false);
  const [ucapan, setUcapan] = useState<UcapanItem[]>(UCAPAN_SEED);
  const reduced = useReducedMotion();
  const perfTier = usePerfTier();

  useEffect(() => {
    let alive = true;
    fetchUcapan().then((d) => { if (alive && d && d.length) setUcapan(d); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <div className="bnwed-root">
      <AnimatePresence>
        {!entered && <OpeningLight key="opening" perfTier={perfTier} onEnter={() => setEntered(true)} />}
      </AnimatePresence>

      {entered && (
        <motion.main className="bnwed-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <HeroGlassCard reduced={reduced} />
          <OurStoryScroll perfTier={perfTier} reduced={reduced} />
          <CoupleProfileGlass />
          <EventHologramCard />
          <GiftSection />
          <ConstellationWall guest={guest} list={ucapan} onAdd={(u) => setUcapan((p) => [u, ...p])} perfTier={perfTier} />
          <ClosingLight />
        </motion.main>
      )}
    </div>
  );
};

export default WeddingPageBagasNadira;
