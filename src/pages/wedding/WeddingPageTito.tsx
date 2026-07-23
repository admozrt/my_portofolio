import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import "./WeddingPageTito.css";

// ─── CONFIG ────────────────────────────────────────────────────────
const WEDDING_DATE = new Date("2026-09-13T00:00:00+08:00");
const GROOM_FIRST = "Tito";
const BRIDE_FIRST = "Wina";
const DATE_LABEL = "Minggu, 13 September 2026";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Masjid%20Hajjah%20Nuriyah%20Loktabat&t=&z=16&ie=UTF8&iwloc=&output=embed";
const MAP_LINK = "https://maps.app.goo.gl/Jp7UaCJ8strw4Ciz6?g_st=ic";

const COVER_PHOTO    = "/tito/NGS_3748.webp";
const HERO_PHOTO     = "/tito/NGS_3765.webp";
const BRIDE_PHOTO    = "/tito/NGS_4305.webp";
const GROOM_PHOTO    = "/tito/NGS_6041.webp";
const OURSTORY_PHOTO = "/tito/NGS_4137.webp";
const FLOWER_PHOTO   = "/tito/flower1.png";
const CLOSER_PHOTO    = "/tito/NGS_3923.webp";
const BG_AUDIO        = "/tito/Gunslinger.mp3";

const PRELOAD_PHOTOS = [COVER_PHOTO, HERO_PHOTO, BRIDE_PHOTO, GROOM_PHOTO, FLOWER_PHOTO];

const GALLERY_PHOTOS = [
  "/tito/NGS_4144.webp",
  "/tito/NGS_3923.webp",
  "/tito/NGS_4190.webp",
  "/tito/NGS_3754.webp",
  "/tito/NGS_3780.webp",
];

// Cerita Kami / Our Story — draf generik, silakan sunting sesuai cerita asli
const STORY: { title: string; body: string }[] = [
  {
    title: "The Beginning",
    body: "Semua berawal dari pertemuan sederhana yang tak pernah disangka akan membawa pada babak baru. Kami percaya bahwa setiap langkah kecil itu adalah bagian dari rencana indah yang telah Allah gariskan.",
  },
  {
    title: "Growing Together",
    body: "Seiring waktu berjalan, kami belajar saling memahami dan mendewasakan satu sama lain — tumbuh bukan hanya dalam rasa, tapi juga dalam doa dan keyakinan.",
  },
  {
    title: "The Promise",
    body: "Hingga akhirnya kami menyadari, perjalanan ini harus dilanjutkan berdampingan, menyatukan perbedaan menjadi satu tujuan yang pasti.",
  },
  {
    title: "The Beginning Of Forever",
    body: "Dengan penuh rasa syukur, kami menyempurnakan perjalanan ini dengan ikatan janji suci. Doakan agar langkah kami senantiasa diliputi keberkahan. Aamiin Yaa Rabb.",
  },
];

const GROOM = {
  label: "Mempelai Pria",
  name: "Ahmad Tito Elpijar, A.Md.RMIK",
  order: "Putra Pertama",
  father: "Yudiwan Atmiko",
  mother: "Indri Cindar Sari",
  address: "Jl. Tanah Abang Komp. Cahaya Lorihua No. 13, Sungai Ulin, Banjarbaru",
  ig: "@ahmdtto",
  photo: GROOM_PHOTO,
};

const BRIDE = {
  label: "Mempelai Wanita",
  name: "Wina Azizah Nur Awalin, A.Md.A.B",
  order: "Putri Pertama",
  father: "Sri Wiyanto",
  mother: "Nining S.N",
  address: "Jl. Sempati Komp. Asabri RT/RW 045/009",
  ig: "@winaaawln__",
  photo: BRIDE_PHOTO,
};

const EVENTS = [
  {
    title: "Akad Nikah",
    date: DATE_LABEL,
    time: "07.30 – 09.30 WITA",
    venue: "Masjid Hajjah Nuriyah Loktabat",
    address: "Masjid Hajjah Nuriyah Loktabat",
  },
  {
    title: "Resepsi",
    date: DATE_LABEL,
    time: "09.30 WITA – Selesai",
    venue: "Masjid Hajjah Nuriyah Loktabat",
    address: "Masjid Hajjah Nuriyah Loktabat",
  },
];

// Info hadiah — PLACEHOLDER, tolong ganti dengan rekening/e-wallet asli sebelum dipublikasikan
const GIFTS = [
  {
    id: "bank",
    type: "Transfer Bank",
    name: "Bank BNI",
    logo: "BNI",
    number: "0692853563",
    holder: "Wina Azizah Nur Awalin",
    bg: "linear-gradient(135deg, #8d7873, #6F5C59)",
  },
  {
    id: "ewallet",
    type: "E-Wallet",
    name: "DANA",
    logo: "DANA",
    number: "083159501624",
    holder: "Wina Azizah Nur Awalin",
    bg: "linear-gradient(135deg, #8d7873, #6F5C59)",
  },
];

const GIFT_ADDRESS = "Jl. Sempati Komp. Asabri RT/RW 045/009";

function downloadIcs(title: string, location: string, nameA: string, nameB: string): void {
  const fmt = (d: Date) => d.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const start = WEDDING_DATE;
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WeddingTitoWina//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title} — ${nameA} & ${nameB}`,
    `LOCATION:${location}`,
    `DESCRIPTION:Undangan pernikahan ${nameA} & ${nameB}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nameA}_${nameB}_wedding.ics`;
  a.click();
  URL.revokeObjectURL(url);
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

function useInView(threshold = 0.12): [React.RefObject<HTMLElement | null>, boolean] {
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
      className="titowed-orn-divider"
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

function CornerFlowers({ corners }: { corners: Array<"tl" | "tr" | "br"> }) {
  return (
    <div aria-hidden="true">
      {corners.map((corner) => (
        <div key={corner} className={`titowed-flower ${corner}`}>
          <img src={FLOWER_PHOTO} alt="" loading="lazy" />
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────

export const WeddingPageTito: React.FC = () => {
  const [searchParams] = useSearchParams();
  const visitorName = searchParams.get("to") || "Tamu Undangan";

  const nameA = GROOM_FIRST;
  const nameB = BRIDE_FIRST;
  const persons = [GROOM, BRIDE];

  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [storyStep, setStoryStep] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [giftTab, setGiftTab] = useState<"angpao" | "gift">("angpao");
  const scrollY = useScrollY();
  const countdown = useCountdown(WEDDING_DATE.getTime());
  const showStickyHeader = isOpen && scrollY > 480;

  const coverImageLoaded = useImagePreload(COVER_PHOTO);
  const photosReady = useImagesReady(PRELOAD_PHOTOS);
  const [btnReady, setBtnReady] = useState(false);
  useEffect(() => {
    if (!coverImageLoaded) return;
    const t = setTimeout(() => setBtnReady(true), 300);
    return () => clearTimeout(t);
  }, [coverImageLoaded]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "auto" : "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const heroBgRef = useParallax(0.08);

  const [heroRef,    heroVisible]    = useInView(0.1);
  const [dateRef,    dateVisible]    = useInView(0.1);
  const [profileRef, profileVisible] = useInView(0.1);
  const [storyRef,   storyVisible]   = useInView(0.1);
  const [galleryRef, galleryVisible] = useInView(0.1);
  const [giftRef,    giftVisible]    = useInView(0.1);
  const [closingRef, closingVisible] = useInView(0.1);

  const heroScale   = Math.max(1, 1.1 - (scrollY / 600) * 0.1);
  const heroOpacity = Math.max(0, 1 - scrollY / 900);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    const audio = audioRef.current;
    if (audio) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
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

  const touchStartX = useRef<number | null>(null);
  const onStoryTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onStoryTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) setStoryStep((s) => Math.min(s + 1, STORY.length - 1));
    else setStoryStep((s) => Math.max(s - 1, 0));
  };

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const nextLightbox = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % GALLERY_PHOTOS.length)),
    []
  );
  const prevLightbox = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length)),
    []
  );
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, nextLightbox, prevLightbox]);

  const gotoSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 12, behavior: "smooth" });
  };

  return (
    <div className="titowed-root">
      <audio ref={audioRef} src={BG_AUDIO} loop preload="none" />

      <div className={`titowed-loader${photosReady ? " fade-out" : ""}`} role="status" aria-label="Memuat">
        <div className="titowed-loader-logo">{nameA[0]} &amp; {nameB[0]}</div>
        <span className="titowed-loader-spin" />
      </div>

      {isOpen && (
        <button
          className={`titowed-music-btn${isPlaying ? " playing" : ""}`}
          onClick={toggleMusic}
          aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
          title={isPlaying ? "Jeda musik" : "Putar musik"}
        >
          <span className="titowed-music-bar" />
          <span className="titowed-music-bar" />
          <span className="titowed-music-bar" />
        </button>
      )}

      <header className={`titowed-sticky-header${showStickyHeader ? " show" : ""}`}>
        <span className="titowed-sticky-header-mono">{nameA[0]} &amp; {nameB[0]}</span>
        <nav className="titowed-sticky-header-links">
          <button onClick={() => gotoSection("tw-lokasi")}>Lokasi</button>
          <button onClick={() => gotoSection("tw-hadiah")}>Hadiah</button>
          <button onClick={() => gotoSection("tw-penutup")}>Penutup</button>
        </nav>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          COVER
      ══════════════════════════════════════════════════════════════ */}
      <div className={`titowed-cover${isOpen ? " slide-up" : ""}`}>
        <div className="titowed-cover-photo">
          <img src={COVER_PHOTO} alt="" aria-hidden="true" />
          {/* <div className="titowed-cover-photo-overlay" /> */}
        </div>

        <CornerFlowers corners={["tl", "tr", "br"]} />

        <div className="titowed-cover-inner">
          <div className="titowed-mini-mono">{nameA[0]} &amp; {nameB[0]}</div>
          <div className="titowed-cover-eyebrow">The Wedding Invitation</div>

          <p className="titowed-cover-names-h1" style={{ marginTop: 10 }}>
            {nameA}
          </p>
          <span className="titowed-cover-amp">&amp;</span>
          <p className="titowed-cover-names-h1" style={{ marginBottom: 0 }}>
            {nameB}
          </p>

          <div className="titowed-cover-date-label" style={{ marginTop: 24 }}>
            Save the Date
          </div>
          <div className="titowed-cover-date">{DATE_LABEL}</div>

          <div className="titowed-cover-guest-wrap">
            <div className="titowed-cover-guest-eyebrow">Kepada Yth.</div>
            <div className="titowed-cover-guest-name">{visitorName}</div>
          </div>

          <button
            className="titowed-btn-open"
            onClick={handleOpen}
            disabled={!btnReady}
            style={{ opacity: btnReady ? 1 : 0.5 }}
          >
            <span>Buka Undangan</span>
            <IconArrow size={12} />
          </button>
        </div>

        <div className="titowed-cover-credit">
          <a href="https://dirakhmat.app" target="_blank" rel="noopener noreferrer">
            by <u> Dirakhmat </u>
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════════ */}
      <main className={`titowed-main${isOpen ? " revealed" : ""}`}>

        {/* ── 1. Hero ── */}
        <section
          id="tw-hero"
          className="titowed-section titowed-hero"
          ref={heroRef as React.RefObject<HTMLElement>}
        >
          <div className="titowed-hero-bg" ref={heroBgRef}
            style={{ transform: `scale(${heroScale})`, opacity: heroOpacity }}>
            <img src={HERO_PHOTO} alt="" aria-hidden="true" loading="eager" />
          </div>

          <CornerFlowers corners={["tl", "tr"]} />


          <div className={`titowed-hero-content titowed-reveal${heroVisible ? " in" : ""}`}
            style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <div className="titowed-eyebrow">◆ Bismillāhirraḥmānirraḥīm ◆</div>
            <div className="titowed-bismillah-ar">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <p className="titowed-verse">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
              istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa
              tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."
            </p>
            <div className="titowed-eyebrow" style={{ marginTop: 12 }}>QS. Ar-Rūm : 21</div>
          </div>

          <div
            className={`titowed-hero-content titowed-hero-names titowed-reveal${heroVisible ? " in" : ""}`}
            style={{ textAlign: "center", transitionDelay: "0.2s" }}
          >
            <div className="titowed-hero-mono">{nameA[0]} &amp; {nameB[0]}</div>
            <div className="titowed-hero-wedding-of">The Wedding of</div>
            <h1 className="titowed-hero-name-big" style={{ marginTop: 18 }}>
              {nameA}
            </h1>
            <span className="titowed-hero-amp">&amp;</span>
            <h1 className="titowed-hero-name-big">{nameB}</h1>
            <div className="titowed-hero-wedding-of" style={{ marginTop: 24 }}>
              {DATE_LABEL}
            </div>
          </div>

          <div
            className={`titowed-hero-content titowed-hero-invitation titowed-reveal${heroVisible ? " in" : ""}`}
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
          id="tw-date"
          className="titowed-section titowed-date-section"
          ref={dateRef as React.RefObject<HTMLElement>}
        >

          <div className={`titowed-reveal${dateVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <div className="titowed-eyebrow">◆ Save the Date ◆</div>
            <h2 className="titowed-section-heading">Hari Bahagia Kami</h2>
            <div style={{ fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase",
              color: "var(--tw-ink-2)", marginBottom: 48 }}>
              {DATE_LABEL}
            </div>
          </div>

          <div className={`titowed-countdown-grid titowed-reveal${dateVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.15s" }}>
            {[
              { n: countdown.days,    l: "Hari"  },
              { n: countdown.hours,   l: "Jam"   },
              { n: countdown.minutes, l: "Menit" },
              { n: countdown.seconds, l: "Detik" },
            ].map((c) => (
              <div key={c.l} className="titowed-cd-cell">
                <div className="titowed-cd-num">{String(c.n).padStart(2, "0")}</div>
                <div className="titowed-cd-lbl">{c.l}</div>
              </div>
            ))}
          </div>

          <div className="titowed-event-venue-block">
            <div
              className={`titowed-events-grid titowed-reveal${dateVisible ? " in" : ""}`}
              style={{ transitionDelay: "0.3s" }}
            >
              {EVENTS.map((ev, i) => (
                <div key={i} className="titowed-event-card">
                  <h3 className="titowed-event-title">{ev.title}</h3>
                  <OrnDivider width={140} />
                  <div className="titowed-event-info" style={{ marginTop: 18 }}>
                    <div>{ev.date}</div>
                    <div>{ev.time}</div>
                    <div className="italic" style={{ marginTop: 14 }}>{ev.venue}</div>
                    <div>{ev.address}</div>
                  </div>
                  <div className="titowed-event-actions">
                    <a
                      href={MAP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="titowed-btn-sm solid"
                    >
                      <IconMap size={13} /> Buka Maps
                    </a>
                    <button
                      type="button"
                      onClick={() => downloadIcs(ev.title, ev.venue, nameA, nameB)}
                      className="titowed-btn-sm"
                    >
                      <IconCalendar size={13} /> Kalender
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div id="tw-lokasi" className={`titowed-reveal${dateVisible ? " in" : ""}`}
              style={{ textAlign: "center", transitionDelay: "0.45s" }}>
              <div className="titowed-eyebrow">◆ Lokasi Acara ◆</div>
              <h3 className="titowed-section-heading" style={{ fontSize: "clamp(28px,4vw,36px)" }}>
                Petunjuk Arah
              </h3>
              <div className="titowed-map-frame">
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
                className="titowed-btn-ghost"
              >
                <IconMap /> Buka di Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* ── 3. Profile Mempelai ── */}
        <section
          id="tw-mempelai"
          className="titowed-section titowed-profile-section"
          ref={profileRef as React.RefObject<HTMLElement>}
        >

          <div className={`titowed-reveal${profileVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <div className="titowed-eyebrow">◆ Mempelai ◆</div>
            <h2 className="titowed-section-heading">Groom & Bride</h2>
            <p style={{ fontSize: 14, color: "var(--tw-ink-2)", maxWidth: 480,
              margin: "0 auto 64px", lineHeight: 1.8 }}>
              Dengan segala kerendahan hati dan rasa syukur, izinkanlah kami memperkenalkan
              kedua calon mempelai.
            </p>
          </div>

          <div className="titowed-profile-stack">
            {persons.map((person, idx) => {
              const isSon = person.label === "Mempelai Pria";
              return (
                <div
                  key={person.name}
                  className={`titowed-profile-block titowed-reveal${profileVisible ? " in" : ""}`}
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  <img src={person.photo} alt={person.name} loading="lazy" />
                  <div className={`titowed-profile-block-overlay${idx === 1 ? " top" : ""}`} />
                  <div className={`titowed-profile-block-content${idx === 1 ? " top right" : ""}`}>
                    <a
                      className={`titowed-profile-ig-row${idx === 1 ? " reverse" : ""}`}
                      href={`https://instagram.com/${person.ig.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="titowed-profile-ig-icon"><IconInstagram size={16} /></span>
                      {person.ig}
                    </a>
                    <h3 className="titowed-profile-overlay-name">{person.name}</h3>
                    <p className="titowed-profile-overlay-parents">
                      {isSon ? "Putra" : "Putri"} dari {person.father} &amp; {person.mother}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="titowed-profile-amp-badge">&amp;</div>
          </div>
        </section>

        {/* ── 4. Cerita Kami / Our Story ── */}
        <section
          id="tw-cerita"
          className="titowed-section titowed-story-section"
          ref={storyRef as React.RefObject<HTMLElement>}
        >

          <div className={`titowed-reveal${storyVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <div className="titowed-eyebrow">◆ Our Story ◆</div>
            <h2 className="titowed-section-heading">Cerita Kami</h2>
          </div>

          <div className={`titowed-story-photo titowed-reveal${storyVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.1s" }}>
            <img src={OURSTORY_PHOTO} alt="Cerita kami" loading="lazy" />
          </div>

          <div
            className={`titowed-story-carousel titowed-reveal${storyVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.2s" }}
            onTouchStart={onStoryTouchStart}
            onTouchEnd={onStoryTouchEnd}
          >
            <button
              type="button"
              className="titowed-story-arrow prev"
              onClick={() => setStoryStep((s) => Math.max(s - 1, 0))}
              disabled={storyStep === 0}
              aria-label="Cerita sebelumnya"
            >
              <IconArrow size={14} />
            </button>

            <div className="titowed-story-track">
              {STORY.map((s, i) => (
                <div
                  key={s.title}
                  className={`titowed-story-slide${i === storyStep ? " active" : ""}`}
                  aria-hidden={i !== storyStep}
                >
                  <h3 className="titowed-story-item-title">{s.title}</h3>
                  <p className="titowed-story-item-body">{s.body}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="titowed-story-arrow next"
              onClick={() => setStoryStep((s) => Math.min(s + 1, STORY.length - 1))}
              disabled={storyStep === STORY.length - 1}
              aria-label="Cerita berikutnya"
            >
              <IconArrow size={14} />
            </button>
          </div>

          <div className={`titowed-story-badges titowed-reveal${storyVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.3s" }}>
            {STORY.map((s, i) => (
              <button
                key={s.title}
                type="button"
                className={`titowed-story-badge${i === storyStep ? " active" : ""}`}
                onClick={() => setStoryStep(i)}
                aria-label={`Cerita ${i + 1}: ${s.title}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </section>

        {/* ── 5. Gallery ── */}
        <section
          id="tw-galeri"
          className="titowed-section titowed-gallery-section"
          ref={galleryRef as React.RefObject<HTMLElement>}
        >

          <div className={`titowed-reveal${galleryVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <div className="titowed-eyebrow">◆ Gallery ◆</div>
            <h2 className="titowed-section-heading">Galeri Momen</h2>
            <p style={{ fontSize: 14, color: "var(--tw-ink-2)",
              maxWidth: 460, margin: "0 auto 56px", lineHeight: 1.8 }}>
              Setiap senyum, setiap langkah — kami abadikan menjelang hari yang
              telah lama kami nantikan.
            </p>
          </div>

          <div className={`titowed-gallery titowed-reveal${galleryVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.15s" }}>
            {GALLERY_PHOTOS.map((src, i) => (
              <button
                key={i}
                type="button"
                className={`g g${i + 1}`}
                onClick={() => openLightbox(i)}
                aria-label={`Buka foto galeri ${i + 1}`}
              >
                <img src={src} alt={`Galeri ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>

          <div className={`titowed-reveal${galleryVisible ? " in" : ""}`}
            style={{ textAlign: "center", transitionDelay: "0.3s" }}>
            <p className="titowed-gallery-quote">
              "Cinta yang berlandaskan iman adalah cinta yang abadi —
              tumbuh dalam doa, dirawat oleh kesabaran."
            </p>
          </div>
        </section>

        {/* ── 6. Wedding Gift ── */}
        <section
          id="tw-hadiah"
          className="titowed-section titowed-gift-section"
          ref={giftRef as React.RefObject<HTMLElement>}
        >

          <div className={`titowed-reveal${giftVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <div className="titowed-eyebrow">◆ Wedding Gift ◆</div>
            <h2 className="titowed-section-heading">Tanda Kasih</h2>
            <p className="titowed-gift-intro">
              Doa restu adalah hadiah terindah bagi kami. Namun jika Bapak/Ibu/Saudara/i
              berkenan memberikan tanda kasih, dapat dikirimkan melalui kanal berikut:
            </p>
          </div>

          <div className={`titowed-gift-toggle titowed-reveal${giftVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.1s" }}>
            <button
              type="button"
              className={giftTab === "angpao" ? "active" : ""}
              onClick={() => setGiftTab("angpao")}
            >
              E-Angpao
            </button>
            <button
              type="button"
              className={giftTab === "gift" ? "active" : ""}
              onClick={() => setGiftTab("gift")}
            >
              E-Gift
            </button>
          </div>

          <div className={`titowed-gift-cards titowed-reveal${giftVisible ? " in" : ""}`}
            style={{ transitionDelay: "0.15s" }}>
            {GIFTS.filter((g) => (giftTab === "angpao" ? g.id === "bank" : g.id === "ewallet")).map((g) => (
              <div key={g.id} className="titowed-gift-card">
                <div className="titowed-gift-logo" style={{ background: g.bg }}>
                  {g.logo}
                </div>
                <div className="titowed-gift-type">{g.type}</div>
                <div className="titowed-gift-name">{g.name}</div>
                <OrnDivider width={120} />
                <div className="titowed-gift-num">{g.number}</div>
                <div className="titowed-gift-holder">a.n. {g.holder}</div>
                <button
                  className={`titowed-gift-copy-btn${copiedId === g.id ? " copied" : ""}`}
                  onClick={() => copyNumber(g.id, g.number)}
                >
                  {copiedId === g.id ? "✓ Tersalin" : "Salin Nomor"}
                </button>
              </div>
            ))}
          </div>

          {GIFT_ADDRESS && (
            <div className={`titowed-gift-address-wrap titowed-reveal${giftVisible ? " in" : ""}`}
              style={{ transitionDelay: "0.3s" }}>
              <div className="titowed-eyebrow">◆ Alamat Kirim Hadiah ◆</div>
              <div className="titowed-gift-address-text">{GIFT_ADDRESS}</div>
            </div>
          )}

          <p
            className={`titowed-reveal${giftVisible ? " in" : ""}`}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 18, fontStyle: "italic",
              color: "var(--tw-ink-2)",
              maxWidth: 480, margin: "56px auto 0",
              lineHeight: 1.6, textAlign: "center",
              transitionDelay: "0.45s",
            }}
          >
            "Terima kasih atas kemurahan hati dan doa baik dari Bapak/Ibu/Saudara/i."
          </p>
        </section>

        {/* ── 7. Closing ── */}
        <section
          id="tw-penutup"
          className="titowed-section titowed-closing-section"
          ref={closingRef as React.RefObject<HTMLElement>}
        >
          <div className="titowed-closing-bg" aria-hidden="true">
            <img src={CLOSER_PHOTO} alt="" loading="lazy" />
          </div>


          <div className={`titowed-reveal${closingVisible ? " in" : ""}`} style={{ textAlign: "center" }}>
            <p className="titowed-closing-body">
              Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila
              Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada
              kedua mempelai.
            </p>

            <div className="titowed-closing-divider">
              <span style={{ fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}>
                Terima Kasih
              </span>
            </div>

            <p style={{ fontSize: 14, color: "var(--tw-ink-2)", marginBottom: 8 }}>
              Wassalāmu'alaikum Warahmatullāhi Wabarakātuh
            </p>

            <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
              color: "var(--tw-ink-2)", marginTop: 48, marginBottom: 24 }}>
              Kami yang berbahagia,
            </div>

            <div className="titowed-closing-names">
              {nameA}
              <span className="script-amp">&amp;</span>
              {nameB}
            </div>
            <div className="titowed-closing-family">beserta keluarga besar</div>
          </div>

          <div className="titowed-footer">
            <div className="titowed-footer-copy">
              © {new Date().getFullYear()} · {nameA} &amp; {nameB}
            </div>
            <a
              href="https://dirakhmat.app"
              target="_blank"
              rel="noopener noreferrer"
              className="titowed-footer-credit"
            >
              by <u> Dirakhmat </u>
            </a>
          </div>
        </section>

      </main>

      {lightboxIndex !== null && (
        <div className="titowed-lightbox" role="dialog" aria-modal="true" aria-label="Galeri foto">
          <button className="titowed-lightbox-close" onClick={closeLightbox} aria-label="Tutup">
            ✕
          </button>
          <button className="titowed-lightbox-arrow prev" onClick={prevLightbox} aria-label="Foto sebelumnya">
            <IconArrow size={18} />
          </button>
          <img src={GALLERY_PHOTOS[lightboxIndex]} alt={`Galeri ${lightboxIndex + 1}`} />
          <button className="titowed-lightbox-arrow next" onClick={nextLightbox} aria-label="Foto berikutnya">
            <IconArrow size={18} />
          </button>
          <div className="titowed-lightbox-index">{lightboxIndex + 1} / {GALLERY_PHOTOS.length}</div>
        </div>
      )}
    </div>
  );
};
