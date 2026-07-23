import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./WeddingPageWisnuRatih.css";

// ─── CONFIG ────────────────────────────────────────────────────────
// Semua data undangan ada di sini. Ganti nilai placeholder dengan data asli.
const WEDDING_DATE = new Date("2027-07-24T08:00:00+07:00");
const GROOM_FIRST = "Wisnu";
const BRIDE_FIRST = "Ratih";
const DATE_LABEL = "Sabtu, 24 Juli 2027";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Yogyakarta&t=&z=14&ie=UTF8&iwloc=&output=embed";
const MAP_LINK = "https://maps.app.goo.gl/";

// Video dokumenter YouTube di Hero — ganti dengan ID video asli (idealnya di-set Unlisted).
// Placeholder di bawah adalah video contoh resmi Google (aman ditonton).
const YOUTUBE_VIDEO_ID = "M7lc1UVf-VE";

// Endpoint Google Apps Script Web App untuk RSVP & Ucapan.
// Kosongkan ("") untuk mode demo. Cara setup: lihat public/wisnu/README-google-sheets.md
const SHEETS_ENDPOINT = "";

const GAPURA_PHOTO = "/wisnu/silhouette.svg";
const GAPURA_DOOR = "/wisnu/gapura-door.svg";
const HERO_MAIN_PHOTO = "/wisnu/hero-main.svg";
const HERO_PHOTO = "/wisnu/silhouette.svg";
const CLOSING_PHOTO = "/wisnu/silhouette.svg";
const OPENING_LINE = "Dengan penuh syukur, kami mengundang Anda untuk turut merayakan hari bahagia kami.";
const INVITATION_PARAGRAPH =
  "Dengan penuh rasa syukur, kami bermaksud menyelenggarakan pernikahan putra-putri kami. Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.";

const GROOM = {
  name: "Wisnu Adiguna Pratama",
  order: "Putra pertama",
  parents: "Bapak Suryanto & Ibu Wulandari",
  desc: "Tenang dan sederhana, memaknai cinta sebagai perjalanan yang dijalani dengan sabar.",
  ig: "wisnu.ap",
  photo: "/wisnu/groom.svg",
};

const BRIDE = {
  name: "Ratih Kusuma Ningrum",
  order: "Putri kedua",
  parents: "Bapak Hidayat & Ibu Kartika",
  desc: "Anggun dan teguh, memandang rumah bukan sebagai tempat, melainkan seseorang.",
  ig: "ratih.kn",
  photo: "/wisnu/bride.svg",
};

const STORY: { title: string; body: string; photo: string }[] = [
  { title: "Pertemuan Pertama", body: "Di antara riuh sebuah acara keluarga, dua pandang bertemu tanpa rencana — dan sejak itu, langkah terasa berbeda arah.", photo: "/wisnu/s1.svg" },
  { title: "Jadian", body: "Perlahan, kepercayaan tumbuh menjadi janji untuk saling menemani, dalam diam maupun dalam kata.", photo: "/wisnu/s2.svg" },
  { title: "Lamaran", body: "Dengan restu yang menyertai, sebuah janji kecil diucapkan sebagai awal dari janji seumur hidup.", photo: "/wisnu/s3.svg" },
  { title: "Menuju Halal", body: "Kini, dua keluarga besar bersiap menyatukan dua jiwa dalam ikatan yang telah lama dinantikan.", photo: "/wisnu/s4.svg" },
];

const EVENTS = [
  { title: "Akad Nikah", time: "08.00 – 10.00 WIB", venue: "Pendopo Agung", address: "Jl. Placeholder No. 1, Yogyakarta" },
  { title: "Resepsi", time: "11.00 WIB – Selesai", venue: "Pendopo Agung", address: "Jl. Placeholder No. 1, Yogyakarta" },
];

const GIFTS = [
  { type: "Transfer Bank", name: "Bank BNI", number: "1234567890", holder: "Ratih Kusuma Ningrum" },
  { type: "E-Wallet", name: "ShopeePay", number: "081234567890", holder: "Wisnu Adiguna Pratama" },
];

const SHIPPING_ADDRESS = "Wisnu Adiguna Pratama — Jl. Placeholder No. 1, Yogyakarta, 55111 (0812-3456-7890)";

const UCAPAN_SEED: UcapanItem[] = [
  { nama: "Keluarga Besar", pesan: "Selamat menempuh hidup baru, semoga menjadi keluarga sakinah, mawaddah, warahmah.", time: Date.now() - 1000 * 60 * 25 },
  { nama: "Sahabat Kuliah", pesan: "Bahagia selalu untuk kalian berdua. Doa terbaik menyertai perjalanan kalian.", time: Date.now() - 1000 * 60 * 80 },
];

// ─── TYPES ─────────────────────────────────────────────────────────
interface UcapanItem { nama: string; pesan: string; time: number; }
type Kehadiran = "Hadir" | "Tidak Hadir" | "Masih Ragu";

declare global {
  interface Window {
    YT?: {
      Player: new (elId: string, opts: Record<string, unknown>) => YTPlayer;
      PlayerState: { ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
interface YTPlayer {
  mute(): void;
  unMute(): void;
  playVideo(): void;
  stopVideo(): void;
  destroy(): void;
}

// ─── HELPERS ───────────────────────────────────────────────────────
function downloadIcs(title: string, location: string): void {
  const fmt = (d: Date) => d.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const start = WEDDING_DATE;
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//WeddingWisnuRatih//EN", "BEGIN:VEVENT",
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
const IconVolumeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="m23 9-6 6M17 9l6 6" />
  </svg>
);
const IconVolumeOn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);
const IconCornerOrnament = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
    <path d="M2 9 V4 Q2 2 4 2 H9" />
    <path d="M2 14 Q9 14 9 21" opacity="0.75" />
    <circle cx="9" cy="21" r="1.3" fill="currentColor" stroke="none" opacity="0.85" />
  </svg>
);

// ─── REVEAL ────────────────────────────────────────────────────────
const Reveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [ref, visible] = useInView(0.15);
  return <div ref={ref} className={`wrwed-reveal ${visible ? "in" : ""} ${className || ""}`}>{children}</div>;
};

// ─── OPENING GAPURA ────────────────────────────────────────────────
const OpeningGapura: React.FC<{ guest: string; reduced: boolean; onEnter: () => void }> = ({ guest, reduced, onEnter }) => {
  const [opened, setOpened] = useState(false);
  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(onEnter, reduced ? 300 : 1900);
  };
  return (
    <motion.div className="wrwed-opening" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <div className="wrwed-opening-bg" style={{ backgroundImage: `url(${GAPURA_PHOTO})` }} />
      <motion.div className="wrwed-gapura-panel left" animate={opened ? { x: "-100%" } : { x: 0 }} transition={{ duration: reduced ? 0.3 : 1.8, ease: [0.65, 0, 0.35, 1] }}>
        <img src={GAPURA_DOOR} className="wrwed-gapura-door" alt="" aria-hidden="true" />
      </motion.div>
      <motion.div className="wrwed-gapura-panel right" animate={opened ? { x: "100%" } : { x: 0 }} transition={{ duration: reduced ? 0.3 : 1.8, ease: [0.65, 0, 0.35, 1] }}>
        <img src={GAPURA_DOOR} className="wrwed-gapura-door mirror" alt="" aria-hidden="true" />
      </motion.div>

      <div className="wrwed-opening-content">
        <p className="wrwed-opening-mono">{GROOM_FIRST[0]} &amp; {BRIDE_FIRST[0]} · The Wedding Invitation</p>

        <AnimatePresence>
          {/* {opened && ( */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0.1 : 0.9, duration: 0.9 }}>
              <p className="wrwed-opening-guest">Kepada Yth. {guest}</p>
              <h1 className="wrwed-opening-names">{GROOM_FIRST} <span className="wrwed-amp">&amp;</span> {BRIDE_FIRST}</h1>
              <motion.p
                className="wrwed-opening-savedate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0.15 : 1.3, duration: 0.7 }}
              >
                Save the Date · {DATE_LABEL}
              </motion.p>
            </motion.div>
          {/* )} */}
        </AnimatePresence>
        {!opened && (
          <button className="wrwed-gapura-btn" onClick={handleOpen}>
            <span className="wrwed-gapura-btn-pattern" style={{ backgroundImage: `url(${GAPURA_DOOR})` }} aria-hidden="true" />
            <span className="wrwed-gapura-btn-corner tl"><IconCornerOrnament /></span>
            <span className="wrwed-gapura-btn-corner tr"><IconCornerOrnament /></span>
            <span className="wrwed-gapura-btn-corner bl"><IconCornerOrnament /></span>
            <span className="wrwed-gapura-btn-corner br"><IconCornerOrnament /></span>
            <span className="wrwed-gapura-btn-label">Buka Undangan</span>
          </button>
        )}
      </div>
      {opened && (
        <div className="wrwed-opening-credit">
          <a href="https://dirakhmat.app" target="_blank" rel="noopener noreferrer">
            by <u>Dirakhmat</u>
          </a>
        </div>
      )}
    </motion.div>
  );
};

// ─── HERO SECTION (YouTube video + photo) ─────────────────────────
let ytApiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (window.YT) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prevCallback?.(); resolve(); };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

const HeroSection: React.FC = () => {
  const [containerRef, inView] = useInView(0.4);
  const playerRef = useRef<YTPlayer | null>(null);
  const startedRef = useRef(false);
  const [videoDone, setVideoDone] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const playerElId = "wrwed-yt-player";

  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT) return;
      playerRef.current = new window.YT.Player(playerElId, {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: { autoplay: 0, mute: 1, controls: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: (e: { data: number }) => {
            if (window.YT && e.data === window.YT.PlayerState.ENDED) setVideoDone(true);
          },
        },
      });
    });
    return () => { cancelled = true; playerRef.current?.destroy(); };
  }, []);

  useEffect(() => {
    if (!inView || !playerReady || startedRef.current || !playerRef.current) return;
    startedRef.current = true;
    const id = setTimeout(() => {
      playerRef.current?.mute();
      playerRef.current?.playVideo();
    }, 500);
    return () => clearTimeout(id);
  }, [inView, playerReady]);

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) { playerRef.current.unMute(); setMuted(false); }
    else { playerRef.current.mute(); setMuted(true); }
  };

  const skip = () => {
    playerRef.current?.stopVideo();
    setVideoDone(true);
  };

  return (
    <section className="wrwed-hero" ref={containerRef}>
      <Reveal className="wrwed-hero-intro">
        <p className="wrwed-hero-mono">{GROOM_FIRST[0]} &amp; {BRIDE_FIRST[0]} · The Wedding of</p>
        <h2 className="wrwed-hero-names">{GROOM_FIRST} <span className="wrwed-amp">&amp;</span> {BRIDE_FIRST}</h2>
        <p className="wrwed-hero-invitation">{INVITATION_PARAGRAPH}</p>
      </Reveal>

      <Reveal className="wrwed-hero-mainphoto">
        <img src={HERO_MAIN_PHOTO} alt={`${GROOM_FIRST} & ${BRIDE_FIRST}`} loading="eager" />
      </Reveal>

      {!videoDone && (
        <div className="wrwed-video-frame">
          <div className="wrwed-video-batik-border" aria-hidden />
          <div className="wrwed-video-box">
            <div id={playerElId} className="wrwed-video-iframe-host" />
          </div>
          <div className="wrwed-video-controls">
            <button className="wrwed-video-btn" onClick={toggleMute} aria-label={muted ? "Aktifkan suara" : "Matikan suara"}>
              {muted ? <IconVolumeOff /> : <IconVolumeOn />}
            </button>
            <button className="wrwed-video-btn wrwed-skip" onClick={skip}>Lewati Video</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {videoDone && (
          <motion.div className="wrwed-hero-photo-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <div className="wrwed-hero-photo" style={{ backgroundImage: `url(${HERO_PHOTO})` }} />
            <div className="wrwed-hero-text">
              <p className="wrwed-hero-line">{OPENING_LINE}</p>
              <p className="wrwed-hero-date">{DATE_LABEL}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ─── OUR STORY ─────────────────────────────────────────────────────
const storySlideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};
const storySlideVariantsReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const OurStory: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(STORY.length - 1, i));
    if (clamped === index) return;
    setDirection(clamped > index ? 1 : -1);
    setIndex(clamped);
  };

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) goTo(index + 1); else goTo(index - 1);
  };

  const s = STORY[index];

  return (
    <section className="wrwed-section" aria-label="Cerita kami">
      <Reveal><p className="wrwed-eyebrow center">Lembaran Perjalanan Kami</p></Reveal>

      <div className="wrwed-story-slider" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={index}
            className="wrwed-story-leaf"
            custom={direction}
            variants={reduced ? storySlideVariantsReduced : storySlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduced ? 0.2 : 0.45, ease: "easeOut" }}
          >
            <div className="wrwed-story-photo" style={{ backgroundImage: `url(${s.photo})` }} />
            <div className="wrwed-story-text">
              <span className="wrwed-story-num">{pad(index + 1)}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button className="wrwed-story-nav left" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Lembar sebelumnya">‹</button>
        <button className="wrwed-story-nav right" onClick={() => goTo(index + 1)} disabled={index === STORY.length - 1} aria-label="Lembar berikutnya">›</button>
      </div>

      <div className="wrwed-story-dots">
        {STORY.map((_, i) => (
          <button
            key={i}
            className={`wrwed-story-dot ${i === index ? "on" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Ke lembar ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

// ─── COUPLE PROFILE ────────────────────────────────────────────────
const ProfileCard: React.FC<{ p: typeof GROOM }> = ({ p }) => (
  <Reveal className="wrwed-profile">
    <div className="wrwed-profile-photo"><img src={p.photo} alt={p.name} loading="lazy" /></div>
    <h3 className="wrwed-profile-name">{p.name}</h3>
    <p className="wrwed-profile-order">{p.order} dari {p.parents}</p>
    <p className="wrwed-profile-desc">{p.desc}</p>
    {p.ig && (
      <a className="wrwed-ig" href={`https://instagram.com/${p.ig}`} target="_blank" rel="noreferrer">
        <IconInstagram /> @{p.ig}
      </a>
    )}
  </Reveal>
);

const CoupleProfile: React.FC = () => (
  <section className="wrwed-section" aria-label="Kedua mempelai">
    <Reveal><p className="wrwed-eyebrow center">Kedua Mempelai</p></Reveal>
    <div className="wrwed-profile-grid">
      <ProfileCard p={GROOM} />
      <ProfileCard p={BRIDE} />
    </div>
  </section>
);

// ─── EVENT DETAIL ──────────────────────────────────────────────────
const EventDetail: React.FC = () => {
  const c = useCountdown(WEDDING_DATE.getTime());
  return (
    <section className="wrwed-section" aria-label="Detail acara">
      <Reveal>
        <p className="wrwed-eyebrow center">Akad &amp; Resepsi</p>
        <div className="wrwed-countdown-row">
          <div><b>{c.days}</b><span>Hari</span></div>
          <div><b>{pad(c.hours)}</b><span>Jam</span></div>
          <div><b>{pad(c.minutes)}</b><span>Menit</span></div>
          <div><b>{pad(c.seconds)}</b><span>Detik</span></div>
        </div>

        {EVENTS.map((e) => (
          <div key={e.title} className="wrwed-event-card">
            <h4>{e.title}</h4>
            <p><b>{DATE_LABEL}</b> · {e.time}</p>
            <p>{e.venue} — {e.address}</p>
          </div>
        ))}

        <div className="wrwed-event-actions">
          <button className="wrwed-btn primary" onClick={() => downloadIcs("Pernikahan", EVENTS[0].venue)}>
            <IconCalendar /> Tambahkan ke Kalender
          </button>
        </div>

        <div className="wrwed-map"><iframe title="Lokasi acara" src={MAP_EMBED_URL} loading="lazy" /></div>
        <div className="wrwed-event-actions">
          <a className="wrwed-btn ghost" href={MAP_LINK} target="_blank" rel="noreferrer">
            <IconMap /> Buka di Maps
          </a>
        </div>
      </Reveal>
    </section>
  );
};

// ─── GIFT SECTION ──────────────────────────────────────────────────
const GiftCard: React.FC<{ g: typeof GIFTS[number] }> = ({ g }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    const ok = await copyText(g.number);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  return (
    <div className="wrwed-gift-card">
      <div className="wrwed-gift-type">{g.type}</div>
      <div className="wrwed-gift-name">{g.name}</div>
      <div className="wrwed-gift-number">{g.number}</div>
      <div className="wrwed-gift-holder">a.n. {g.holder}</div>
      <button className={`wrwed-copy ${copied ? "done" : ""}`} onClick={onCopy}>
        {copied ? "Tersalin ✓" : <><IconCopy /> Salin</>}
      </button>
    </div>
  );
};

const GiftSection: React.FC = () => {
  const [showAddr, setShowAddr] = useState(false);
  return (
    <section className="wrwed-section" aria-label="Hadiah">
      <Reveal>
        <p className="wrwed-eyebrow center">Tanda Kasih</p>
        <p className="wrwed-gift-intro">
          Doa restu Anda adalah karunia terbesar bagi kami. Namun apabila Anda berkenan
          memberikan tanda kasih, kami menyediakan:
        </p>
        <div className="wrwed-gift-list">{GIFTS.map((g) => <GiftCard key={g.name} g={g} />)}</div>
        <button className="wrwed-gift-shiplink" onClick={() => setShowAddr((v) => !v)}>
          Ingin mengirim kado secara langsung?
        </button>
        <AnimatePresence>
          {showAddr && (
            <motion.div className="wrwed-gift-addr" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <p>{SHIPPING_ADDRESS}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
};

// ─── GUEST BOOK (kartu kertas klasik) ──────────────────────────────
const GuestBook: React.FC<{ guest: string; list: UcapanItem[]; onAdd: (u: UcapanItem) => void }> = ({ guest, list, onAdd }) => {
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
    <section className="wrwed-section" aria-label="Doa dan ucapan">
      <Reveal>
        <p className="wrwed-eyebrow center">Doa &amp; Ucapan Tamu</p>

        <form className="wrwed-form" onSubmit={submit}>
          <label className="wrwed-field">
            <span>Nama</span>
            <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Anda" required />
          </label>
          <div className="wrwed-field">
            <span>Konfirmasi Kehadiran</span>
            <div className="wrwed-choices">
              {(["Hadir", "Tidak Hadir", "Masih Ragu"] as Kehadiran[]).map((k) => (
                <button type="button" key={k} className={kehadiran === k ? "on" : ""} onClick={() => setKehadiran(k)}>{k}</button>
              ))}
            </div>
          </div>
          {kehadiran !== "Tidak Hadir" && (
            <label className="wrwed-field">
              <span>Jumlah Tamu</span>
              <div className="wrwed-stepper">
                <button type="button" onClick={() => setJumlah((n) => Math.max(1, n - 1))}>−</button>
                <b>{jumlah}</b>
                <button type="button" onClick={() => setJumlah((n) => Math.min(10, n + 1))}>+</button>
              </div>
            </label>
          )}
          <label className="wrwed-field">
            <span>Ucapan / Doa</span>
            <textarea value={pesan} onChange={(e) => setPesan(e.target.value)} rows={3} placeholder="Tuliskan doa & ucapan Anda..." required />
          </label>
          <button className="wrwed-btn primary block" type="submit" disabled={sending}>
            {sending ? "Mengirim..." : "Kirim"}
          </button>
        </form>

        <div className="wrwed-paper-list">
          {list.map((u, i) => (
            <div key={`${u.nama}-${u.time}-${i}`} className="wrwed-paper-card">
              <p className="wrwed-paper-msg">&ldquo;{u.pesan}&rdquo;</p>
              <div className="wrwed-paper-meta">— {u.nama} · {relativeTime(u.time)}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

// ─── CLOSING GAPURA ────────────────────────────────────────────────
const ClosingGapura: React.FC = () => (
  <section className="wrwed-closing" aria-label="Penutup">
    <div className="wrwed-closing-bg" style={{ backgroundImage: `url(${CLOSING_PHOTO})` }} />
    <div className="wrwed-closing-scrim" />
    <Reveal className="wrwed-closing-content">
      <p className="wrwed-closing-text">
        Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan
        memberikan doa restu.
      </p>
      <div className="wrwed-signature">{GROOM_FIRST} &amp; {BRIDE_FIRST}</div>
      <footer className="wrwed-footer">
        <div>© {new Date().getFullYear()} · {GROOM_FIRST} &amp; {BRIDE_FIRST}</div>
        <a className="wrwed-footer-credit" href="https://dirakhmat.app" target="_blank" rel="noopener noreferrer">
          by <u>Dirakhmat</u>
        </a>
      </footer>
    </Reveal>
    <div className="wrwed-gapura-panel left closing">
      <img src={GAPURA_DOOR} className="wrwed-gapura-door" alt="" aria-hidden="true" />
    </div>
    <div className="wrwed-gapura-panel right closing">
      <img src={GAPURA_DOOR} className="wrwed-gapura-door mirror" alt="" aria-hidden="true" />
    </div>
  </section>
);

// ─── ROOT ──────────────────────────────────────────────────────────
export const WeddingPageWisnuRatih: React.FC = () => {
  const [searchParams] = useSearchParams();
  const guest = searchParams.get("to") || "Tamu Undangan";
  const [entered, setEntered] = useState(false);
  const [ucapan, setUcapan] = useState<UcapanItem[]>(UCAPAN_SEED);
  const reduced = useReducedMotion();

  useEffect(() => {
    let alive = true;
    fetchUcapan().then((d) => { if (alive && d && d.length) setUcapan(d); });
    return () => { alive = false; };
  }, []);

  const handleAdd = useCallback((u: UcapanItem) => setUcapan((p) => [u, ...p]), []);

  return (
    <div className="wrwed-root">
      <AnimatePresence>
        {!entered && <OpeningGapura key="opening" guest={guest} reduced={reduced} onEnter={() => setEntered(true)} />}
      </AnimatePresence>

      {entered && (
        <motion.main className="wrwed-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <HeroSection />
          <OurStory reduced={reduced} />
          <CoupleProfile />
          <EventDetail />
          <GiftSection />
          <GuestBook guest={guest} list={ucapan} onAdd={handleAdd} />
          <ClosingGapura />
        </motion.main>
      )}
    </div>
  );
};

export default WeddingPageWisnuRatih;
