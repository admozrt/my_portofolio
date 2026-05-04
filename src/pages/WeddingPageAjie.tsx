import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import "./WeddingPageAjie.css";

// ─── CONFIG ────────────────────────────────────────────────────────
const WEDDING_DATE = new Date("2026-06-07T09:00:00+08:00");
const GROOM = "Ajie";
const BRIDE = "Alya";
const VENUE_NAME = "Rumah Mempelai Wanita";
const VENUE_ADDRESS = "Jl. Kalaka Sirang RT. 013 RW. 003 Kelurahan Kupang Kecamatan Tapin Utara Kabupaten Tapin";
const MAP_LAT = -2.9464181;
const MAP_LNG = 115.1427701;
const MAP_EMBED_URL = `https://www.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=16&output=embed`;

const COVER_PHOTO = "/ajie/MAL08420-1.jpg";
const BRIDE_PHOTO = "/ajie/CEWE_SENDIRI.jpg";
const GROOM_PHOTO = "/ajie/COWO_SENDIRI.jpg";
const LOCATION_BG_PHOTO = "/ajie/HZM06896_1.jpg";

const PHOTOS = [
  "/ajie/BOP_9294.jpg",
  "/ajie/HZM06806.jpg",
  "/ajie/HZM07032.jpg",
  "/ajie/MAL08133.jpg",
  "/ajie/MAL08632.jpg",
];

const HERO_PHOTO = "/ajie/MAL08270.jpg";

const SIDE_PHOTOS = [
  "/ajie/BOP_9306.jpg",
  "/ajie/HZM06896.jpg",
  "/ajie/BOP_9321.jpg",
];

const LOVE_STORIES = [
  {
    title: "Love Story",
    body: "",
    align: "right" as const,
  },
  {
    title: "Awal Pertemuan",
    body: "Tak ada yang kebetulan dalam hidup. Awalnya kami hanya dua orang asing yang dipertemukan pada sebuah kesempatan sederhana. Sapaan singkat itu ternyata menjadi awal dari cerita panjang yang tak pernah kami bayangkan.",
    align: "left" as const,
  },
  {
    title: "Lamaran",
    body: "Hingga tiba saatnya ia mengungkapkan keseriusannya. Dengan sederhana namun penuh makna, ia melamar dengan janji untuk selalu mendampingi di setiap suka dan duka.",
    align: "right" as const,
  },
  {
    title: "Hari Bahagia",
    body: "Dan kini, tibalah kami pada babak baru kehidupan. Dengan penuh syukur, kami mengundang keluarga dan sahabat, untuk menjadi saksi bersatunya dua hati dalam ikatan suci pernikahan.",
    align: "left" as const,
  },
];

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

function useInView(threshold = 0.15): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useScrollProgress(ref: React.RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handle = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elHeight = el.offsetHeight;
      const viewH = window.innerHeight;
      const scrollable = elHeight - viewH;
      if (scrollable <= 0) return;
      const scrolled = -rect.top;
      setProgress(Math.min(1, Math.max(0, scrolled / scrollable)));
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, [ref]);
  return progress;
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

// Preload a single image and return loaded state
function useImagePreload(src: string): boolean {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true); // fail gracefully
    img.src = src;
  }, [src]);
  return loaded;
}


// ─── COMPONENTS ────────────────────────────────────────────────────

function Petal({ style }: { style: React.CSSProperties }) {
  return <div className="petal" style={style} />;
}

function Petals() {
  const petals = Array.from({ length: 12 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    animationDuration: `${8 + Math.random() * 12}s`,
    animationDelay: `${Math.random() * 10}s`,
    width: `${8 + Math.random() * 10}px`,
    height: `${8 + Math.random() * 10}px`,
  }));
  return (
    <>
      {petals.map((s, i) => (
        <Petal key={i} style={s} />
      ))}
    </>
  );
}

function OrnamentSVG({ width = 60, className = "" }) {
  return (
    <svg className={className} width={width} viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12 Q30 0 60 12 Q90 24 120 12" stroke="#C4A77D" strokeWidth="1" fill="none" opacity="0.6" />
      <circle cx="60" cy="12" r="3" fill="#C4A77D" opacity="0.5" />
      <circle cx="30" cy="6" r="1.5" fill="#C4A77D" opacity="0.3" />
      <circle cx="90" cy="18" r="1.5" fill="#C4A77D" opacity="0.3" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────

export const WeddingPageAjie: React.FC = () => {
  const [searchParams] = useSearchParams();
  const visitorName = searchParams.get("to") || "Tamu Undangan";
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollY = useScrollY();
  const countdown = useCountdown(WEDDING_DATE.getTime());

  const coverImageLoaded = useImagePreload(COVER_PHOTO);
  // Delay showing button until image is loaded, with minimum 800ms for graceful UX
  const [btnReady, setBtnReady] = useState(false);
  useEffect(() => {
    if (!coverImageLoaded) return;
    const timer = setTimeout(() => setBtnReady(true), 300);
    return () => clearTimeout(timer);
  }, [coverImageLoaded]);

  const [quoteRef, quoteVisible] = useInView(0.2);
  const [profileRef, profileVisible] = useInView(0.15);
  const [socialRef, socialVisible] = useInView(0.15);
  const stackAreaRef = useRef<HTMLDivElement | null>(null);
  const stackProgress = useScrollProgress(stackAreaRef);
  const [stackVisible, setStackVisible] = useState(false);
  useEffect(() => {
    const el = stackAreaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStackVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const [countdownRef, countdownVisible] = useInView(0.2);
  const [locationRef, locationVisible] = useInView(0.2);
  const [closingRef, closingVisible] = useInView(0.2);
  const [giftRef, giftVisible] = useInView(0.2);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const heroScale = Math.max(1, 1.15 - (scrollY / 600) * 0.15);
  const heroOpacity = Math.max(0, 1 - scrollY / 800);

  // Saat section pertama kali terlihat, langsung tampilkan story ke-0 dan foto ke-1
  const activeStoryIdx = stackVisible
    ? Math.min(
        LOVE_STORIES.length - 1,
        Math.max(0, Math.floor(stackProgress * (PHOTOS.length + 1)) - 1)
      )
    : -1;

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = "auto";
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  const copyToClipboard = useCallback((text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isOpen) document.body.style.overflow = "hidden";
  }, [isOpen]);

  const weddingDateStr = WEDDING_DATE.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="wedding-root">

        {/* ── Background Music ── */}
        <audio
          ref={audioRef}
          src="/audio/bgaudio.mp3"
          loop
          preload="auto"
        />

        {/* ── Floating Music Button ── */}
        <button
          className={`music-btn ${isOpen ? "show" : ""}`}
          onClick={toggleMusic}
          aria-label={isPlaying ? "Matikan musik" : "Putar musik"}
        >
          <div className={`music-eq ${isPlaying ? "playing" : ""}`}>
            <div className="music-eq-bar" style={{ height: 8 }} />
            <div className="music-eq-bar" style={{ height: 14 }} />
            <div className="music-eq-bar" style={{ height: 6 }} />
            <div className="music-eq-bar" style={{ height: 11 }} />
          </div>
          <span className="music-label">
            {isPlaying ? "Paul Aro, Andi Rianto — The Way You Look At Me" : "Putar Musik"}
          </span>
        </button>

        {/* ── Cover Book (split open animation) ── */}
        <div className={`cover-book ${isOpen ? "open" : ""}`}>

          {/* Left panel — shows left half of cover photo */}
          <div className="cover-panel cover-panel-left">
            <div className={`cover-loading-shimmer ${coverImageLoaded ? "hidden" : ""}`} />
            <img
              className={`cover-bg-img ${coverImageLoaded ? "loaded" : ""}`}
              src={COVER_PHOTO}
              alt=""
              aria-hidden="true"
            />
            <div className="cover-bg-overlay" />
          </div>

          {/* Right panel — shows right half of cover photo */}
          <div className="cover-panel cover-panel-right">
            <div className={`cover-loading-shimmer ${coverImageLoaded ? "hidden" : ""}`} />
            <img
              className={`cover-bg-img ${coverImageLoaded ? "loaded" : ""}`}
              src={COVER_PHOTO}
              alt=""
              aria-hidden="true"
            />
            <div className="cover-bg-overlay" />
          </div>

          {/* Center spine line */}
          <div className="cover-spine" />

          {/* Content — centered above both panels */}
          <div className="cover-content">
            <OrnamentSVG width={100} />
            <div className="cover-title" style={{ marginTop: 20 }}>The Wedding Of</div>
            <img
              src="/ajie/logo-bg.png"
              alt="Wedding Logo"
              className="cover-logo"
              aria-hidden="true"
            />
            <div className="cover-names">
              <h1>{GROOM} & {BRIDE}</h1>
            </div>
            <div className="cover-ornament" />
            <div className="cover-to">Kepada Yth.</div>
            <div className="cover-visitor">{visitorName}</div>

            <div className={`cover-loading-dots ${coverImageLoaded ? "hidden" : ""}`}>
              <div className="cover-loading-dot" />
              <div className="cover-loading-dot" />
              <div className="cover-loading-dot" />
            </div>

            <button
              className={`cover-btn ${btnReady ? "ready" : ""}`}
              onClick={handleOpen}
            >
              Buka Undangan
            </button>
          </div>

          <a className="cover-credit"
            href="https://admoz.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Made by <strong>Dirakhmat</strong>
          </a>
        </div>

        {/* ── Main Content (zoom-in reveal) ── */}
        <div className={`main-content ${isOpen ? "revealed" : ""}`}>

        {/* ── 1. Hero Section ── */}
        <section className="hero-section">
          <div
            className="hero-img-wrap"
            style={{
              transform: `scale(${heroScale})`,
              opacity: heroOpacity,
            }}
          >
            <img className="hero-img" src={HERO_PHOTO} alt="Wedding hero" loading="eager" />
            <div className="hero-gradient" />
          </div>

          <div className="hero-visitor-badge">
            <div className="hero-visitor-label">Dear</div>
            <div className="hero-visitor-name">{visitorName}</div>
          </div>

          <div className="hero-names-bottom">
            <div className="hero-names-script">
              {GROOM}
              <span className="hero-names-ampersand">&</span>
              {BRIDE}
            </div>
            <div className="hero-date-line">{weddingDateStr}</div>
          </div>

          <div className="hero-side-photos">
            {SIDE_PHOTOS.map((src, i) => (
              <div className="hero-side-photo" key={i}>
                <img src={src} alt={`Side ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
          

          <div className="scroll-indicator">
            <span>Scroll</span>
            <div className="scroll-chevron" />
          </div>
        </section>

        {/* ── 2. Quote Az-Dzariyyat (compact) ── */}
        <section className="quote-section" ref={quoteRef}>
          <div className="quote-bismillah-ar">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
          <OrnamentSVG width={50} className="quote-ornament-top" />
          <p className={`quote-text ${quoteVisible ? "visible" : ""}`}>
            "Dan segala sesuatu Kami ciptakan berpasang-pasangan, supaya kamu mengingat kebesaran Allah SWT."
          </p>
          <p className={`quote-source ${quoteVisible ? "visible" : ""}`}>
            — QS. Az-Dzariyyat : 49
          </p>
        </section>

        {/* ── 3. Profile Mempelai + Pengantar ── */}
        <section className="profile-section" ref={profileRef}>
          <div className="profile-salam">Assalamualaikum Wr Wb</div>
          <p className="profile-intro-text">
            Dengan segala kerendahan hati,<br />
            kami mengundang Bapak/Ibu/Saudara/i<br />
            untuk menghadiri pernikahan kami,
          </p>
          <OrnamentSVG width={70} className="quote-ornament-top" />

          <div className="profile-grid" style={{ marginTop: 36 }}>
            {/* Mempelai Pria */}
            <div className={`profile-card ${profileVisible ? "visible" : ""}`}>
              <div className="profile-photo">
                <img src={GROOM_PHOTO} alt="Ajie Perdana Putra" loading="lazy" />
              </div>
              <div className="profile-label">Mempelai Pria</div>
              <div className="profile-name">Ajie Perdana Putra</div>
              <div className="profile-title">S.Kom</div>
              <div className="profile-divider" />
              <div className="profile-parents">
                Putra Pertama dari<br />
                Bapak Rudiansyah<br />
                & Ibu Eko Adhie Sulistyaningsih
              </div>
            </div>
            
            {/* Ampersand desktop */}
            <div className="profile-ampersand-row">
              <span className="profile-ampersand">&</span>
            </div>

            {/* Ampersand mobile */}
            <div className="profile-ampersand-mobile">&</div>
            {/* Mempelai Wanita */}
            <div className={`profile-card ${profileVisible ? "visible" : ""}`}>
              <div className="profile-photo">
                <img src={BRIDE_PHOTO} alt="Alya Norhidayati" loading="lazy" />
              </div>
              <div className="profile-label">Mempelai Wanita</div>
              <div className="profile-name">Alya Norhidayati</div>
              <div className="profile-title">S.M</div>
              <div className="profile-divider" />
              <div className="profile-parents">
                Putri Bungsu dari<br />
                Bapak Riduansyah <em>(alm)</em><br />
                & Ibu Hj. Salasiah
              </div>
            </div>
          </div>
          <p className="profile-closing-text">
            Kami sangat berharap Bapak/Ibu/Saudara/i<br />
            dapat menghadiri acara tersebut
          </p>
        </section>

        {/* ── 5. Quote + Stacking Photos ── */}
        <div
          className="stack-scroll-area"
          ref={stackAreaRef}
          style={{ height: `${PHOTOS.length * 28 + 40}vh` }}
        >
          <div className="stack-sticky">
            <div className="stack-layout">
              {/* Photo Stack */}
              <div className="stack-photo-col">
                {PHOTOS.map((src, i) => {
                  const threshold = (i + 1) / (PHOTOS.length + 1);
                  const isEntered = stackVisible && (i === 0 || stackProgress >= threshold);
                  const isActive = isEntered && (i === PHOTOS.length - 1 || stackProgress < (i + 2) / (PHOTOS.length + 1));
                  return (
                    <div
                      className={`stack-photo${isEntered ? " entered" : ""}${isActive ? " active" : ""}`}
                      key={i}
                      style={{ zIndex: i + 1 }}
                    >
                      <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" />
                    </div>
                  );
                })}
                {/* Desktop counter — sits below photo */}
                <div className="stack-counter">
                  {stackVisible ? Math.min(PHOTOS.length, Math.max(1, Math.floor(stackProgress * (PHOTOS.length + 1)))) : 0} / {PHOTOS.length}
                </div>
              </div>

              {/* Mobile counter — between photo col and story col */}
              <div className="stack-counter-row">
                {stackVisible ? Math.min(PHOTOS.length, Math.max(1, Math.floor(stackProgress * (PHOTOS.length + 1)))) : 0} / {PHOTOS.length}
              </div>

              {/* Love Story Text */}
              <div className="stack-story-col">
                {LOVE_STORIES.map((story, i) => (
                  <div
                    className={`story-item${activeStoryIdx === i ? " active" : ""}`}
                    key={i}
                    data-align={story.align}
                  >
                    {i > 0 && <div className="story-step">Bab {i}</div>}
                    <div className={`story-title${i === 0 ? " hero-title" : ""}`}>
                      {story.title}
                    </div>
                    {story.body && (
                      <>
                        <div className="story-divider" />
                        <div className="story-body">"{story.body}"</div>
                      </>
                    )}
                    {i === 0 && (
                      <OrnamentSVG width={80} className="quote-ornament-top" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* ── 3. Countdown ── */}
        <section className="countdown-section" ref={countdownRef}>
          <div className={`animate-fade-in ${countdownVisible ? "visible" : ""}`}>
            <div className="section-label">Menghitung Hari</div>
            <div className="section-heading">Menuju Hari Bahagia</div>
            <OrnamentSVG width={80} className="quote-ornament-top" />
            <div className="countdown-grid" style={{ marginTop: 32 }}>
              {[
                { val: countdown.days, unit: "Hari" },
                { val: countdown.hours, unit: "Jam" },
                { val: countdown.minutes, unit: "Menit" },
                { val: countdown.seconds, unit: "Detik" },
              ].map((item, i) => (
                <div className="countdown-item" key={i}>
                  <div className="countdown-number">
                    {String(item.val).padStart(2, "0")}
                  </div>
                  <div className="countdown-unit">{item.unit}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Location ── */}
        <section className="location-section" ref={locationRef}>
          <img
            className="location-bg-img"
            src={LOCATION_BG_PHOTO}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
          <div className="location-bg-overlay" />
          <div
            className={`location-content animate-fade-in ${locationVisible ? "visible" : ""}`}
          >
            <div className="section-label">Lokasi Acara</div>
            <div className="section-heading">Peta & Alamat</div>
            <div className="location-card">
              <iframe
                className="location-map"
                src={MAP_EMBED_URL}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Wedding Location"
              />
              <div className="location-info">
                <div className="location-name">{VENUE_NAME}</div>
                <div className="location-addr">{VENUE_ADDRESS}</div>
                <a
                  className="location-btn"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_LAT},${MAP_LNG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPinIcon /> Buka Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Instagram / Social Media ── */}
        <section className="social-section" ref={socialRef}>
          <div className="section-label">Temukan Kami</div>
          <div className="section-heading">Media Sosial</div>
          <div className="social-grid">
            {/* Mempelai Pria */}
            <div className={`social-card ${socialVisible ? "visible" : ""}`}>
              <div className="social-avatar">
                <img src={GROOM_PHOTO} alt="Ajie" loading="lazy" />
              </div>
              <div className="social-name">Ajie Perdana Putra</div>
              <div className="social-role">Mempelai Pria</div>
              <a
                className="social-ig-btn"
                href="https://www.instagram.com/azypputra"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="social-handle">@azypputra</span>
              </a>
            </div>

            {/* Mempelai Wanita */}
            <div className={`social-card ${socialVisible ? "visible" : ""}`}>
              <div className="social-avatar">
                <img src={BRIDE_PHOTO} alt="Alya" loading="lazy" />
              </div>
              <div className="social-name">Alya Norhidayati</div>
              <div className="social-role">Mempelai Wanita</div>
              <a
                className="social-ig-btn"
                href="https://www.instagram.com/alyaanh___"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="social-handle">@alyaanh___</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── 5. Wedding Gift ── */}
        <section className="gift-section" ref={giftRef}>
          <img className="gift-bg-img" src="/ajie/HZM07032.jpg" alt="" aria-hidden="true" loading="lazy" />
          <div className="gift-bg-overlay" />
          <div className="gift-content">
          <div className={`animate-fade-in ${giftVisible ? "visible" : ""}`}>
            <div className="section-label">Hadiah Pernikahan</div>
            <div className="section-heading">Wedding Gift</div>
            <OrnamentSVG width={80} className="quote-ornament-top" />
            <p className="gift-intro">
              Doa Restu Anda merupakan karunia yang sangat berarti bagi kami.
              Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado melalui:
            </p>

            <div className="gift-cards">
              {/* BRI */}
              <div className="gift-card">
                <div className="gift-bank">
                  <div className="gift-bank-logo bri">BRI</div>
                  <div className="gift-bank-name">Bank BRI</div>
                </div>
                <div className="gift-account-num">021001040166502</div>
                <div className="gift-account-name">A/n Alya Nor Hidayati</div>
                <button
                  className={`gift-copy-btn ${copiedIdx === 0 ? "copied" : ""}`}
                  onClick={() => copyToClipboard("021001040166502", 0)}
                >
                  {copiedIdx === 0 ? "✓ Tersalin" : "Salin Nomor Rekening"}
                </button>
              </div>

              {/* BCA */}
              <div className="gift-card">
                <div className="gift-bank">
                  <div className="gift-bank-logo bca">BCA</div>
                  <div className="gift-bank-name">Bank BCA</div>
                </div>
                <div className="gift-account-num">7895720526</div>
                <div className="gift-account-name">A/n Ajie Perdana Putra</div>
                <button
                  className={`gift-copy-btn ${copiedIdx === 1 ? "copied" : ""}`}
                  onClick={() => copyToClipboard("7895720526", 1)}
                >
                  {copiedIdx === 1 ? "✓ Tersalin" : "Salin Nomor Rekening"}
                </button>
              </div>
            </div>

            {/* Alamat kirim */}
            <div className="gift-address">
              <div className="gift-address-label">
                <MapPinIcon /> Kirim Kado ke Alamat
              </div>
              <div className="gift-address-text">
                Jl. Kalaka Sirang RT. 013 RW. 003<br />
                Kelurahan Kupang, Kecamatan Tapin Utara<br />
                Kabupaten Tapin
              </div>
              <button
                className={`gift-copy-btn ${copiedIdx === 2 ? "copied" : ""}`}
                style={{ marginTop: 16 }}
                onClick={() => copyToClipboard("Jl. Kalaka Sirang RT. 013 RW. 003, Kelurahan Kupang, Kecamatan Tapin Utara, Kabupaten Tapin", 2)}
              >
                {copiedIdx === 2 ? "✓ Tersalin" : "Salin Alamat"}
              </button>
            </div>
          </div>
          </div>
        </section>

        {/* ── 6. Closing ── */}
        <section className="closing-section" ref={closingRef}>
          <img className="closing-bg-img" src="/ajie/MAL08632.jpg" alt="" aria-hidden="true" loading="lazy" />
          <div className="closing-bg-overlay" />
          <Petals />
          <div className="closing-content">
            <div className={`animate-fade-in ${closingVisible ? "visible" : ""}`}>
              <p className="closing-quote">
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya."
              </p>
              <span className="closing-quote-source">— QS. Ar-Rum : 21</span>
              <OrnamentSVG width={60} />
              <div className="closing-script" style={{ marginTop: 28 }}>Terima Kasih</div>
              <div className="closing-body">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
                kepada kami.
              </div>
              <div className="closing-ornament" />
              <div className="closing-body" style={{ marginTop: 0, fontSize: 15, fontStyle: "italic" }}>
                "Atas kehadiran dan doa restunya, kami mengucapkan terima kasih."
              </div>
              <div className="closing-names" style={{ marginTop: 24 }}>
                {GROOM} & {BRIDE}
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="wedding-footer">
          Made with ♥ by{" "}
            <a className="footer-link"
            href="https://admoz.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dirakhmat
          </a>
          {" "}for {GROOM} & {BRIDE}
        </footer>

        </div>{/* end main-content */}
      </div>
    </>
  );
}
