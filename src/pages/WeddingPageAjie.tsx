import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// ─── CONFIG ────────────────────────────────────────────────────────
const WEDDING_DATE = new Date("2026-06-07T09:00:00+08:00");
const GROOM = "Ajie";
const BRIDE = "Alya";
const VENUE_NAME = "Rumah Mempelai Wanita";
const VENUE_ADDRESS = "Jl. Kalaka Sirang RT. 013 RW. 003 Kelurahan Kupang Kecamatan Tapin Utara Kabupaten Tapin";
const MAP_LAT = -2.9464181;
const MAP_LNG = 115.1427701;
const MAP_EMBED_URL = `https://www.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=16&output=embed`;

const COVER_PHOTO = "/ajie/MAL08420.jpg";
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

// ─── STYLES ────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

:root {
  --cream-50: #FFFDF9;
  --cream-100: #FFF8F0;
  --cream-200: #F5E6D3;
  --cream-300: #E8D5BC;
  --brown-300: #C4A77D;
  --brown-400: #A68B5B;
  --brown-500: #8B6F47;
  --brown-600: #6B4E31;
  --brown-800: #3E2723;
  --gold: #D4A574;
  --gold-light: #E8C9A0;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Cormorant Garamond', Georgia, serif;
  background: var(--cream-50);
  color: var(--brown-800);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.wedding-root {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

/* ── Cover ─────────────────────────────────────── */
.cover-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #1a0f0a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 0.8s ease, transform 0.8s ease;
  overflow: hidden;
}
.cover-overlay.hidden {
  opacity: 0;
  pointer-events: none;
  transform: scale(1.05);
}

/* Cover background photo */
.cover-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  opacity: 0;
  transition: opacity 1.4s ease;
  will-change: opacity;
  z-index: 0;
}
.cover-bg-img.loaded {
  opacity: 1;
}
@media (min-width: 768px) {
  .cover-bg-img {
    object-position: center center;
  }
}

/* Dark gradient overlay on photo */
.cover-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(20, 10, 6, 0.35) 0%,
    rgba(20, 10, 6, 0.45) 40%,
    rgba(20, 10, 6, 0.75) 80%,
    rgba(20, 10, 6, 0.90) 100%
  );
  z-index: 1;
}

/* Loading shimmer when photo not yet loaded */
.cover-loading-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    #1a0f0a 0%,
    #2d1a10 30%,
    #1a0f0a 60%,
    #2d1a10 100%
  );
  background-size: 400% 400%;
  animation: shimmer 2.5s ease-in-out infinite;
  z-index: 0;
  opacity: 1;
  transition: opacity 0.6s ease;
}
.cover-loading-shimmer.hidden {
  opacity: 0;
  pointer-events: none;
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Loading indicator dots */
.cover-loading-dots {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  transition: opacity 0.4s ease;
}
.cover-loading-dots.hidden {
  opacity: 0;
}
.cover-loading-dot {
  width: 5px;
  height: 5px;
  background: rgba(196, 167, 125, 0.6);
  border-radius: 50%;
  animation: dotPulse 1.2s ease-in-out infinite;
}
.cover-loading-dot:nth-child(2) { animation-delay: 0.2s; }
.cover-loading-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes dotPulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
}

/* Cover content sits above photo */
.cover-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 24px;
  width: 100%;
}

.cover-ornament {
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(196,167,125,0.8), transparent);
  margin: 16px 0;
}

.cover-title {
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: rgba(232, 201, 160, 0.9);
  margin-bottom: 8px;
}

.cover-names {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(46px, 11vw, 78px);
  color: #fff;
  line-height: 1.2;
  text-align: center;
  text-shadow: 0 2px 24px rgba(0,0,0,0.4);
}

.cover-to {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(232, 201, 160, 0.85);
  margin-top: 24px;
}

.cover-visitor {
  font-family: 'Playfair Display', serif;
  font-size: clamp(20px, 5vw, 28px);
  color: #fff;
  margin-top: 6px;
  font-weight: 500;
  text-shadow: 0 2px 12px rgba(0,0,0,0.3);
}

.cover-btn {
  margin-top: 40px;
  padding: 14px 48px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  border: 1.5px solid rgba(196,167,125,0.8);
  background: transparent;
  color: rgba(232, 201, 160, 0.95);
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
  transition: opacity 0.5s ease, transform 0.5s ease, background 0.4s ease, color 0.4s ease, border-color 0.4s ease;
}
.cover-btn.ready {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.cover-btn::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 0;
  background: rgba(196, 167, 125, 0.3);
  transition: height 0.4s ease;
  z-index: -1;
}
.cover-btn:hover::before { height: 100%; }
.cover-btn:hover {
  color: #fff;
  border-color: rgba(232,201,160,1);
}

/* ── Hero ──────────────────────────────────────── */
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.hero-img-wrap {
  position: absolute;
  inset: 0;
  will-change: transform;
  transition: transform 0.05s linear;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(63,39,35,0.15) 0%,
    rgba(63,39,35,0.0) 30%,
    rgba(63,39,35,0.0) 50%,
    rgba(255,248,240,0.6) 80%,
    rgba(255,253,249,1) 100%
  );
  pointer-events: none;
}

.hero-visitor-badge {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  animation: fadeSlideDown 1.2s ease 0.3s both;
}

.hero-visitor-label {
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.8);
  margin-bottom: 4px;
  text-shadow: 0 1px 8px rgba(0,0,0,0.3);
}

.hero-visitor-name {
  font-family: 'Playfair Display', serif;
  font-size: clamp(18px, 4vw, 26px);
  color: #fff;
  font-weight: 500;
  text-shadow: 0 2px 16px rgba(0,0,0,0.4);
}

.hero-names-bottom {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  animation: fadeSlideUp 1.2s ease 0.6s both;
}

.hero-names-script {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(48px, 12vw, 80px);
  color: var(--brown-800);
  line-height: 1;
}

.hero-names-ampersand {
  font-family: 'Playfair Display', serif;
  font-size: clamp(24px, 5vw, 36px);
  color: var(--brown-400);
  margin: 0 12px;
  font-style: italic;
}

.hero-date-line {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(13px, 2.5vw, 16px);
  letter-spacing: 6px;
  text-transform: uppercase;
  color: var(--brown-500);
  margin-top: 12px;
}

/* Side photo widgets */
.hero-side-photos {
  position: absolute;
  right: 20px;
  bottom: 20%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
  animation: fadeSlideLeft 1s ease 1s both;
}

.hero-side-photo {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.6);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  transition: transform 0.3s ease;
}
.hero-side-photo:hover { transform: scale(1.15); }
.hero-side-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 768px) {
  .hero-side-photos {
    right: 40px;
    gap: 12px;
  }
  .hero-side-photo {
    width: 80px;
    height: 80px;
    border-radius: 12px;
  }
}

/* ── Profile Mempelai ───────────────────────────── */
.profile-section {
  padding: 80px 20px;
  background: linear-gradient(180deg, var(--cream-50) 0%, var(--cream-100) 50%, var(--cream-50) 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.profile-grid {
  display: flex;
  flex-direction: column;
  gap: 48px;
  max-width: 800px;
  margin: 0 auto;
  align-items: center;
}

@media (min-width: 768px) {
  .profile-grid {
    flex-direction: row;
    gap: 32px;
    align-items: flex-start;
    justify-content: center;
  }
}

.profile-card {
  flex: 1;
  max-width: 340px;
  opacity: 0;
  transform: translateY(32px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.profile-card.visible {
  opacity: 1;
  transform: translateY(0);
}
.profile-card:nth-child(2).visible { transition-delay: 0.2s; }

.profile-ampersand-row {
  display: none;
}
@media (min-width: 768px) {
  .profile-ampersand-row {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 80px;
    flex-shrink: 0;
  }
}

.profile-ampersand {
  font-family: 'Great Vibes', cursive;
  font-size: 48px;
  color: var(--brown-300);
  line-height: 1;
}

.profile-ampersand-mobile {
  display: block;
  font-family: 'Great Vibes', cursive;
  font-size: 40px;
  color: var(--brown-300);
  margin: -16px 0;
}
@media (min-width: 768px) {
  .profile-ampersand-mobile { display: none; }
}

.profile-photo {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  margin: 0 auto 20px;
  overflow: hidden;
  border: 3px solid var(--cream-300);
  box-shadow: 0 8px 32px rgba(62,39,35,0.15);
}
@media (min-width: 768px) {
  .profile-photo {
    width: 180px;
    height: 180px;
  }
}
.profile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.profile-label {
  font-size: 11px;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: var(--brown-300);
  margin-bottom: 8px;
}

.profile-name {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(28px, 6vw, 36px);
  color: var(--brown-600);
  line-height: 1.2;
  margin-bottom: 4px;
}

.profile-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--brown-500);
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.profile-divider {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--brown-300), transparent);
  margin: 0 auto 12px;
}

.profile-parents {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(13px, 3vw, 15px);
  color: var(--brown-400);
  line-height: 1.7;
}

/* ── Quote + Stacking Photos ──────────────────── */
.quote-section {
  position: relative;
  padding: 80px 24px;
  background: var(--cream-50);
  text-align: center;
  overflow: hidden;
}

.quote-ornament-top {
  display: block;
  margin: 0 auto 32px;
  width: 60px;
  height: auto;
  opacity: 0.5;
}

.quote-text {
  font-family: 'Playfair Display', serif;
  font-size: clamp(20px, 4.5vw, 32px);
  font-weight: 400;
  font-style: italic;
  color: var(--brown-600);
  line-height: 1.6;
  max-width: 640px;
  margin: 0 auto 12px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
}
.quote-text.visible {
  opacity: 1;
  transform: translateY(0);
}

.quote-source {
  font-size: 14px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--brown-400);
  opacity: 0;
  transform: translateY(20px);
  transition: all 1s ease 0.3s;
}
.quote-source.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stacking photos + Love Story — scroll-driven */
.stack-scroll-area {
  position: relative;
  background: var(--cream-50);
}

.stack-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 16px;
}

/* Mobile-first: vertical layout */
.stack-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 1100px;
  padding: 0 8px;
}

.stack-photo-col {
  position: relative;
  width: min(58vw, 240px);
  aspect-ratio: 3/4;
  flex-shrink: 0;
}

.stack-story-col {
  position: relative;
  width: 100%;
  max-width: 320px;
  min-height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}

/* Desktop: side-by-side */
@media (min-width: 768px) {
  .stack-layout {
    flex-direction: row;
    justify-content: center;
    gap: 48px;
    padding: 0;
  }
  .stack-photo-col {
    width: min(38vw, 380px);
  }
  .stack-story-col {
    max-width: 380px;
    min-height: 200px;
    padding: 0;
  }
}

@media (min-width: 1024px) {
  .stack-layout { gap: 72px; }
  .stack-photo-col { width: min(32vw, 420px); }
  .stack-story-col { max-width: 420px; }
}

.stack-counter {
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  letter-spacing: 3px;
  color: var(--brown-400);
  white-space: nowrap;
  /* hidden on mobile — use stack-counter-row instead */
  display: none;
}
@media (min-width: 768px) {
  .stack-counter { display: block; }
}

/* Counter row between photo and story on mobile */
.stack-counter-row {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  letter-spacing: 3px;
  color: var(--brown-400);
  text-align: center;
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .stack-counter-row { display: none; }
}

.stack-photo {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 12px 48px rgba(62,39,35,0.18);
  opacity: 0;
  transform: translateY(80px) scale(0.88);
  transition: opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1),
              transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
  will-change: transform, opacity;
}
.stack-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.stack-photo.entered { opacity: 1; }
.stack-photo:nth-child(1).entered { transform: translateY(0) rotate(-3.5deg) scale(0.93); }
.stack-photo:nth-child(2).entered { transform: translateY(-6px) rotate(2.5deg) scale(0.95); }
.stack-photo:nth-child(3).entered { transform: translateY(-12px) rotate(-2deg) scale(0.97); }
.stack-photo:nth-child(4).entered { transform: translateY(-18px) rotate(1.2deg) scale(0.98); }
.stack-photo:nth-child(5).entered { transform: translateY(-24px) rotate(0deg) scale(1); }

.stack-photo.active {
  box-shadow: 0 16px 56px rgba(62,39,35,0.25);
}

/* Love Story text */
.story-item {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  pointer-events: none;
}
.story-item.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.story-step {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: var(--brown-300);
  margin-bottom: 8px;
}

.story-title {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(28px, 7vw, 42px);
  color: var(--brown-600);
  line-height: 1.2;
  margin-bottom: 16px;
}

.story-title.hero-title {
  font-size: clamp(36px, 9vw, 56px);
  margin-bottom: 8px;
}

.story-divider {
  width: 48px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--brown-300), transparent);
  margin: 0 auto 16px;
}

.story-body {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(14px, 3.2vw, 17px);
  color: var(--brown-500);
  line-height: 1.8;
  font-style: italic;
}

/* Desktop: alternate text alignment */
@media (min-width: 768px) {
  .story-item { text-align: left; }
  .story-item .story-divider { margin-left: 0; }
  .story-item[data-align="right"] { text-align: right; }
  .story-item[data-align="right"] .story-divider { margin-left: auto; margin-right: 0; }
}

/* ── Wedding Gift ──────────────────────────────── */
.gift-section {
  padding: 80px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.gift-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}
.gift-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 248, 240, 0.93) 0%,
    rgba(255, 253, 249, 0.91) 50%,
    rgba(255, 248, 240, 0.93) 100%
  );
  z-index: 1;
}
.gift-content {
  position: relative;
  z-index: 2;
}

.gift-intro {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(14px, 3vw, 17px);
  color: var(--brown-500);
  line-height: 1.8;
  max-width: 520px;
  margin: 0 auto 36px;
}

.gift-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 420px;
  margin: 0 auto 32px;
}

.gift-card {
  background: white;
  border: 1px solid var(--cream-300);
  border-radius: 16px;
  padding: 24px 20px;
  text-align: left;
  box-shadow: 0 4px 24px rgba(62,39,35,0.06);
  transition: transform 0.3s ease;
}
.gift-card:hover { transform: translateY(-3px); }

.gift-bank {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.gift-bank-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}
.gift-bank-logo.bri { background: linear-gradient(135deg, #003d79, #0066cc); }
.gift-bank-logo.bca { background: linear-gradient(135deg, #003399, #0055bb); }

.gift-bank-name {
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--brown-800);
}

.gift-account-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--brown-800);
  letter-spacing: 1.5px;
  margin-bottom: 4px;
}

.gift-account-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  color: var(--brown-400);
}

.gift-copy-btn {
  margin-top: 12px;
  padding: 8px 20px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: 1px solid var(--cream-300);
  background: var(--cream-100);
  color: var(--brown-500);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}
.gift-copy-btn:hover {
  background: var(--brown-500);
  color: var(--cream-100);
  border-color: var(--brown-500);
}
.gift-copy-btn.copied {
  background: #2d6a4f;
  color: white;
  border-color: #2d6a4f;
}

.gift-address {
  max-width: 420px;
  margin: 0 auto;
  background: white;
  border: 1px solid var(--cream-300);
  border-radius: 16px;
  padding: 24px 20px;
  text-align: left;
  box-shadow: 0 4px 24px rgba(62,39,35,0.06);
}

.gift-address-label {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--brown-800);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.gift-address-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px;
  color: var(--brown-500);
  line-height: 1.7;
}

/* ── Countdown ─────────────────────────────────── */
.countdown-section {
  padding: 80px 24px;
  background: linear-gradient(180deg, var(--cream-50) 0%, var(--cream-200) 100%);
  text-align: center;
}

.section-label {
  font-size: 12px;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: var(--brown-400);
  margin-bottom: 8px;
}

.section-heading {
  font-family: 'Playfair Display', serif;
  font-size: clamp(28px, 6vw, 42px);
  color: var(--brown-800);
  font-weight: 500;
  margin-bottom: 40px;
}

.countdown-grid {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  max-width: 500px;
  margin: 0 auto;
}

.countdown-item {
  width: 90px;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(8px);
  border: 1px solid var(--cream-300);
  border-radius: 12px;
  padding: 20px 8px;
  transition: transform 0.3s ease;
}
.countdown-item:hover { transform: translateY(-4px); }

.countdown-number {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 600;
  color: var(--brown-600);
  line-height: 1;
}

.countdown-unit {
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--brown-400);
  margin-top: 8px;
}

@media (min-width: 768px) {
  .countdown-item { width: 110px; padding: 28px 12px; }
  .countdown-number { font-size: 44px; }
}

/* ── Location ──────────────────────────────────── */
.location-section {
  padding: 80px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Background photo for location section */
.location-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}
.location-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 248, 240, 0.88) 0%,
    rgba(255, 248, 240, 0.92) 50%,
    rgba(255, 248, 240, 0.88) 100%
  );
  z-index: 1;
}
.location-content {
  position: relative;
  z-index: 2;
}

.location-card {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 48px rgba(62,39,35,0.12);
  border: 1px solid var(--cream-300);
}

.location-map {
  width: 100%;
  height: 260px;
  border: none;
}
@media (min-width: 768px) {
  .location-map { height: 360px; }
}

.location-info {
  padding: 28px 24px;
}

.location-name {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  color: var(--brown-800);
  margin-bottom: 8px;
}

.location-addr {
  font-size: 15px;
  color: var(--brown-400);
  line-height: 1.6;
  margin-bottom: 20px;
}

.location-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: var(--brown-500);
  color: var(--cream-100);
  border: none;
  border-radius: 8px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}
.location-btn:hover {
  background: var(--brown-600);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(62,39,35,0.2);
}

/* ── Closing ───────────────────────────────────── */
.closing-section {
  padding: 100px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.closing-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  z-index: 0;
}
.closing-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(245, 230, 211, 0.90) 0%,
    rgba(232, 213, 188, 0.87) 50%,
    rgba(245, 230, 211, 0.90) 100%
  );
  z-index: 1;
}
.closing-content {
  position: relative;
  z-index: 2;
}

.closing-script {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(36px, 9vw, 56px);
  color: var(--brown-600);
  margin-bottom: 20px;
  line-height: 1.3;
}

.closing-body {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(16px, 3vw, 20px);
  color: var(--brown-500);
  line-height: 1.8;
  max-width: 520px;
  margin: 0 auto 32px;
}

.closing-names {
  font-family: 'Playfair Display', serif;
  font-size: clamp(18px, 4vw, 24px);
  color: var(--brown-800);
  font-weight: 500;
}

.closing-ornament {
  width: 160px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--brown-300), transparent);
  margin: 32px auto;
}

/* ── Footer ────────────────────────────────────── */
.wedding-footer {
  padding: 32px 24px;
  text-align: center;
  background: var(--brown-800);
  color: var(--cream-300);
  font-size: 13px;
  letter-spacing: 2px;
}

/* ── Animations ────────────────────────────────── */
@keyframes fadeSlideDown {
  from { opacity: 0; transform: translateX(-50%) translateY(-30px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(30px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes fadeSlideLeft {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes floatSlow {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-12px); }
}

.animate-fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.animate-fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Scroll-down indicator */
.scroll-indicator {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: floatSlow 2.5s ease-in-out infinite;
}
.scroll-indicator span {
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--brown-500);
}
.scroll-chevron {
  width: 20px;
  height: 20px;
  border-right: 1.5px solid var(--brown-400);
  border-bottom: 1.5px solid var(--brown-400);
  transform: rotate(45deg);
  animation: chevronPulse 2s ease infinite;
}
@keyframes chevronPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* Floating petals background */
.petal {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--gold-light);
  border-radius: 50% 0 50% 0;
  opacity: 0.15;
  animation: petalFall linear infinite;
  pointer-events: none;
}
@keyframes petalFall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.15; }
  90% { opacity: 0.15; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}

/* ── Music Button ──────────────────────────────── */
.music-btn {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9998;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid var(--brown-300);
  background: rgba(255,253,249,0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(62,39,35,0.12);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
}
.music-btn.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.music-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(62,39,35,0.2);
  border-color: var(--brown-400);
}
.music-btn:active { transform: scale(0.95); }

.music-eq {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
}
.music-eq-bar {
  width: 3px;
  background: var(--brown-500);
  border-radius: 2px;
  transition: height 0.2s ease;
}
.music-eq.playing .music-eq-bar:nth-child(1) { animation: eqBounce 0.45s ease-in-out infinite alternate; }
.music-eq.playing .music-eq-bar:nth-child(2) { animation: eqBounce 0.55s ease-in-out infinite alternate 0.1s; }
.music-eq.playing .music-eq-bar:nth-child(3) { animation: eqBounce 0.4s ease-in-out infinite alternate 0.2s; }
.music-eq.playing .music-eq-bar:nth-child(4) { animation: eqBounce 0.5s ease-in-out infinite alternate 0.05s; }
.music-eq:not(.playing) .music-eq-bar { height: 3px !important; }

@keyframes eqBounce {
  0% { height: 4px; }
  100% { height: 16px; }
}

.music-label {
  position: absolute;
  right: 56px;
  white-space: nowrap;
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--brown-500);
  background: rgba(255,253,249,0.9);
  backdrop-filter: blur(8px);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--cream-300);
  box-shadow: 0 2px 12px rgba(62,39,35,0.08);
  opacity: 0;
  transform: translateX(8px);
  transition: all 0.3s ease;
  pointer-events: none;
}
.music-btn:hover .music-label {
  opacity: 1;
  transform: translateX(0);
}
`;

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
      <style>{css}</style>
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

        {/* ── Cover Overlay ── */}
        <div className={`cover-overlay ${isOpen ? "hidden" : ""}`}>
          {/* Shimmer while loading */}
          <div className={`cover-loading-shimmer ${coverImageLoaded ? "hidden" : ""}`} />

          {/* Background photo */}
          <img
            className={`cover-bg-img ${coverImageLoaded ? "loaded" : ""}`}
            src={COVER_PHOTO}
            alt=""
            aria-hidden="true"
          />

          {/* Dark gradient overlay */}
          <div className="cover-bg-overlay" />

          {/* Content */}
          <div className="cover-content">
            <OrnamentSVG width={100} />
            <div className="cover-title" style={{ marginTop: 20 }}>The Wedding Of</div>
            <div className="cover-names">
              <h1>{GROOM} & {BRIDE}</h1>
            </div>
            <div className="cover-ornament" />
            <div className="cover-to">Kepada Yth.</div>
            <div className="cover-visitor">{visitorName}</div>

            {/* Loading dots shown while image loading */}
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
        </div>

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

        {/* ── 2. Profile Mempelai ── */}
        <section className="profile-section" ref={profileRef}>
          <div className="section-label">Mempelai</div>
          <div className="section-heading">Insya Allah</div>
          <OrnamentSVG width={80} className="quote-ornament-top" />

          <div className="profile-grid" style={{ marginTop: 40 }}>
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

            {/* Ampersand desktop */}
            <div className="profile-ampersand-row">
              <span className="profile-ampersand">&</span>
            </div>

            {/* Ampersand mobile */}
            <div className="profile-ampersand-mobile">&</div>

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
          </div>
        </section>

        {/* ── 3. Quote + Stacking Photos ── */}
        <section className="quote-section" ref={quoteRef}>
          <Petals />
          <OrnamentSVG width={60} className="quote-ornament-top" />
          <p className={`quote-text ${quoteVisible ? "visible" : ""}`}>
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya."
          </p>
          <p className={`quote-source ${quoteVisible ? "visible" : ""}`}>
            — QS. Ar-Rum : 21
          </p>
        </section>

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
              <div className="closing-script">Terima Kasih</div>
              <div className="closing-body">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
                kepada kami.
              </div>
              <div className="closing-ornament" />
              <OrnamentSVG width={80} />
              <div className="closing-body" style={{ marginTop: 24, fontSize: 15, fontStyle: "italic" }}>
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
          Made with by Admoz for {GROOM} & {BRIDE}
        </footer>
      </div>
    </>
  );
}
