import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./WeddingPageDimasLaila.css";

// ─── CONFIG ────────────────────────────────────────────────────────
// Semua data undangan ada di sini. Ganti nilai placeholder dengan data asli.
const WEDDING_DATE = new Date("2026-12-12T08:00:00+07:00");
const GROOM_FIRST = "Dimas";
const BRIDE_FIRST = "Laila";
const DATE_LABEL = "Sabtu, 12 Desember 2026";

// Google Maps
const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Jakarta&t=&z=14&ie=UTF8&iwloc=&output=embed";
const MAP_LINK = "https://maps.app.goo.gl/";

// Kontak (dipakai dock "Kontak" → buka WhatsApp)
// const CONTACT_WA = "https://wa.me/6281234567890";

// Spotify playlist embed (placeholder — ganti dengan link playlist kalian)
const SPOTIFY_EMBED_URL =
  "https://open.spotify.com/embed/playlist/37i9dQZF1DX50QitC6Oqtn?utm_source=generator&theme=0";

// Endpoint Google Apps Script Web App untuk RSVP & Ucapan.
// Kosongkan ("") untuk mode demo (data hanya tersimpan sementara di layar).
// Cara setup: lihat public/dimas/README-google-sheets.md
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbw76CR5CISuHFtEghwabEWubYgMgaE4vOLhFpUs-Q66o4SkE8l3xPueVg0ZvaNNeJGi/exec";

// Foto (placeholder SVG di /public/dimas/ — timpa dengan foto/.webp asli, nama sama)
const COVER_PHOTO = "/dimas/cover.svg";
const HERO_PHOTO = "/dimas/hero.svg";
const BRIDE_PHOTO = "/dimas/bride.svg";
const GROOM_PHOTO = "/dimas/groom.svg";
const STORY_VIDEO = { src: "/dimas/story.mp4", poster: "/dimas/story-poster.svg" };

const PRELOAD_PHOTOS = [COVER_PHOTO, HERO_PHOTO, BRIDE_PHOTO, GROOM_PHOTO];

const GALLERY_PHOTOS = [
  "/dimas/g1.svg",
  "/dimas/g2.svg",
  "/dimas/g3.svg",
  "/dimas/g4.svg",
  "/dimas/g5.svg",
  "/dimas/cover.svg",
];

// Cerita Kami / Our Story — draf generik, silakan sunting
const STORY: { title: string; body: string; photo: string }[] = [
  {
    title: "Pertemuan Pertama",
    body: "Semua berawal dari pertemuan sederhana yang tak pernah kami sangka akan membawa pada babak baru. Sebuah obrolan singkat yang ternyata menjadi awal dari segalanya.",
    photo: "/dimas/s1.svg",
  },
  {
    title: "Jadian",
    body: "Seiring waktu berjalan, kami memutuskan untuk menjalani hari bersama. Belajar saling memahami, saling menguatkan, dan tumbuh berdua dalam suka maupun duka.",
    photo: "/dimas/s2.svg",
  },
  {
    title: "Lamaran",
    body: "Dengan restu kedua keluarga, kami memantapkan langkah ke jenjang yang lebih serius. Sebuah janji kecil menuju janji yang lebih besar.",
    photo: "/dimas/s3.svg",
  },
  {
    title: "Menuju Halal",
    body: "Dengan penuh rasa syukur, kami menyempurnakan perjalanan ini dengan ikatan suci. Mohon doa restu agar langkah kami senantiasa diliputi keberkahan.",
    photo: "/dimas/s4.svg",
  },
];

const GROOM = {
  label: "Mempelai Pria",
  name: "Dimas Ari Harnadi",
  order: "Putra Pertama",
  father: "Bapak Suryanto",
  mother: "Ibu Wulandari",
  address: "Jakarta",
  ig: "@dimas",
  photo: GROOM_PHOTO,
};

const BRIDE = {
  label: "Mempelai Wanita",
  name: "Laila Ramadhani",
  order: "Putri Kedua",
  father: "Bapak Hidayat",
  mother: "Ibu Kartika",
  address: "Jakarta",
  ig: "@laila",
  photo: BRIDE_PHOTO,
};

const EVENTS = [
  {
    title: "Akad Nikah",
    date: DATE_LABEL,
    time: "08.00 – 10.00 WIB",
    venue: "Masjid Agung",
    address: "Jl. Placeholder No. 1, Jakarta",
  },
  {
    title: "Resepsi",
    date: DATE_LABEL,
    time: "11.00 WIB – Selesai",
    venue: "Gedung Serbaguna",
    address: "Jl. Placeholder No. 1, Jakarta",
  },
];

// const GIFTS = [
//   {
//     id: "bank",
//     type: "Transfer Bank",
//     name: "Bank BCA",
//     number: "1234567890",
//     holder: "Laila Ramadhani",
//   },
//   {
//     id: "ewallet",
//     type: "E-Wallet",
//     name: "DANA",
//     number: "081234567890",
//     holder: "Laila Ramadhani",
//   },
// ];

// Notifikasi yang muncul di lock screen (nama tamu disisipkan saat runtime)
const NOTIFICATIONS = [
  { app: "Undangan", icon: "💌", title: "Undangan baru", body: `Dari ${GROOM_FIRST} & ${BRIDE_FIRST}` },
  { app: "Kalender", icon: "📅", title: "Reminder", body: "Pernikahan kami sebentar lagi!" },
  { app: "Pesan", icon: "💬", title: `${BRIDE_FIRST}`, body: "Kami menantikan kehadiranmu 🤍" },
];

type AppId = "cerita" | "acara" | "rsvp" | "galeri" | "ucapan" | "playlist";

const APPS: { id: AppId; label: string; icon: string; badge?: number; grad: string }[] = [
  { id: "cerita", label: "Cerita Kami", icon: "📖", grad: "linear-gradient(135deg,#6366f1,#4338ca)" },
  { id: "acara", label: "Acara & Lokasi", icon: "📅", grad: "linear-gradient(135deg,#8b5cf6,#6d28d9)" },
  { id: "rsvp", label: "RSVP", icon: "✅", grad: "linear-gradient(135deg,#22c55e,#15803d)" },
  { id: "galeri", label: "Galeri", icon: "🖼️", grad: "linear-gradient(135deg,#ec4899,#be185d)" },
  { id: "ucapan", label: "Ucapan", icon: "💬", badge: 2, grad: "linear-gradient(135deg,#0ea5e9,#0369a1)" },
  { id: "playlist", label: "Playlist Kami", icon: "🎵", grad: "linear-gradient(135deg,#f59e0b,#b45309)" },
];

const UCAPAN_SEED: UcapanItem[] = [
  { nama: "Keluarga Besar", pesan: "Selamat menempuh hidup baru, semoga sakinah mawaddah warahmah!", time: Date.now() - 1000 * 60 * 8 },
  { nama: "Sahabat", pesan: "Bahagia terus ya kalian berdua 🤍", time: Date.now() - 1000 * 60 * 42 },
];

// ─── TYPES ─────────────────────────────────────────────────────────
interface UcapanItem {
  nama: string;
  pesan: string;
  time: number;
}

// ─── HELPERS ───────────────────────────────────────────────────────
function downloadIcs(title: string, location: string): void {
  const fmt = (d: Date) => d.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const start = WEDDING_DATE;
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WeddingDimasLaila//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title} — ${GROOM_FIRST} & ${BRIDE_FIRST}`,
    `LOCATION:${location}`,
    `DESCRIPTION:Undangan pernikahan ${GROOM_FIRST} & ${BRIDE_FIRST}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${GROOM_FIRST}_${BRIDE_FIRST}_wedding.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
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

function useImagesReady(srcs: string[]): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (srcs.length === 0) { setReady(true); return; }
    let done = 0;
    let cancelled = false;
    const check = () => { done += 1; if (!cancelled && done >= srcs.length) setReady(true); };
    const imgs = srcs.map((s) => {
      const img = new Image();
      img.onload = check;
      img.onerror = check;
      img.src = s;
      return img;
    });
    return () => { cancelled = true; imgs.forEach((img) => { img.onload = null; img.onerror = null; }); };
  }, [srcs]);
  return ready;
}

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

function formatClock(d: Date) { return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }

function formatLockDate(d: Date) {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "baru saja";
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const day = Math.floor(hr / 24);
  return `${day} hari lalu`;
}

async function submitToSheet(payload: Record<string, string>): Promise<boolean> {
  if (!SHEETS_ENDPOINT) return true; // mode demo: anggap sukses
  try {
    await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return true;
  } catch {
    return false;
  }
}

async function fetchUcapan(): Promise<UcapanItem[] | null> {
  if (!SHEETS_ENDPOINT) return null; // mode demo → pakai seed
  try {
    const res = await fetch(SHEETS_ENDPOINT, { method: "GET" });
    const data = await res.json();
    if (!data || !Array.isArray(data.ucapan)) return null;
    return data.ucapan.map((u: { nama: string; pesan: string; time: string }) => ({
      nama: u.nama,
      pesan: u.pesan,
      time: new Date(u.time).getTime() || Date.now(),
    }));
  } catch {
    return null;
  }
}

// ─── SVG ICONS ─────────────────────────────────────────────────────
const IconSignal = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
    <rect x="0" y="8" width="3" height="4" rx="1" />
    <rect x="5" y="5" width="3" height="7" rx="1" />
    <rect x="10" y="2" width="3" height="10" rx="1" />
    <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.4" />
  </svg>
);
const IconWifi = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
    <path d="M8 11.5 5.8 9.3a3.1 3.1 0 0 1 4.4 0L8 11.5Z" />
    <path d="M8 6.2c1.7 0 3.3.7 4.5 1.9l1.4-1.4A8.3 8.3 0 0 0 8 4.2 8.3 8.3 0 0 0 2.1 6.7l1.4 1.4A6.3 6.3 0 0 1 8 6.2Z" opacity="0.9" />
    <path d="M8 1.5c2.9 0 5.6 1.2 7.6 3.1L14.2 6A9.6 9.6 0 0 0 8 3.7 9.6 9.6 0 0 0 1.8 6L.4 4.6A11 11 0 0 1 8 1.5Z" opacity="0.7" />
  </svg>
);
const IconBattery = () => (
  <svg width="26" height="13" viewBox="0 0 26 13" fill="none" aria-hidden>
    <rect x="0.5" y="0.5" width="21" height="12" rx="3" stroke="currentColor" opacity="0.5" />
    <rect x="2" y="2" width="16" height="9" rx="1.5" fill="currentColor" />
    <rect x="23" y="4" width="2" height="5" rx="1" fill="currentColor" opacity="0.5" />
  </svg>
);
const IconBack = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const IconMap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconSend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);
const IconCheck = () => (
  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// ─── STATUS BAR ────────────────────────────────────────────────────
const StatusBar: React.FC<{ now: Date; dark?: boolean }> = ({ now, dark }) => (
  <div className={`dlwed-statusbar ${dark ? "is-dark" : ""}`}>
    <span className="dlwed-sb-time">{formatClock(now)}</span>
    <div className="dlwed-sb-icons">
      <IconSignal />
      <IconWifi />
      <IconBattery />
    </div>
  </div>
);

// ─── LOCK SCREEN ───────────────────────────────────────────────────
const LockScreen: React.FC<{ now: Date; guest: string; onUnlock: () => void }> = ({ now, guest, onUnlock }) => {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const timers = NOTIFICATIONS.map((_, i) =>
      setTimeout(() => setShown((s) => Math.max(s, i + 1)), 700 + i * 900)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="dlwed-lock"
      style={{ backgroundImage: `url(${HERO_PHOTO})` }}
      onClick={onUnlock}
      role="button"
      tabIndex={0}
      aria-label="Buka undangan"
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onUnlock(); }}
    >
      <div className="dlwed-lock-scrim" />
      <div className="dlwed-lock-top">
        <div className="dlwed-lock-clock">{formatClock(now)}</div>
        <div className="dlwed-lock-date">{formatLockDate(now)}</div>
      </div>

      <div className="dlwed-notif-stack">
        {NOTIFICATIONS.map((n, i) => (
          <div key={i} className={`dlwed-notif ${i < shown ? "in" : ""}`}>
            <div className="dlwed-notif-icon">{n.icon}</div>
            <div className="dlwed-notif-body">
              <div className="dlwed-notif-head">
                <span className="dlwed-notif-app">{n.app}</span>
                <span className="dlwed-notif-time">sekarang</span>
              </div>
              <div className="dlwed-notif-title">{n.title}</div>
              <div className="dlwed-notif-text">{n.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dlwed-lock-bottom">
        <div className="dlwed-lock-guest">Kepada Yth.</div>
        <div className="dlwed-lock-guest-name">{guest}</div>
        <div className="dlwed-lock-hint">
          <span className="dlwed-lock-chevron">︿</span>
          Geser ke atas untuk membuka
        </div>
        <a
          className="dlwed-credit"
          href="https://dirakhmat.app"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          by <u>Dirakhmat</u>
        </a>
        <div className="dlwed-home-indicator" />
      </div>
    </div>
  );
};

// ─── HOME SCREEN ───────────────────────────────────────────────────
const HomeScreen: React.FC<{ onOpen: (id: AppId) => void; ucapanCount: number }> = ({ onOpen, ucapanCount }) => {
  const c = useCountdown(WEDDING_DATE.getTime());
  const dock: AppId[] = ["rsvp", "acara", "galeri", "ucapan"];
  const badgeFor = (id: AppId) => (id === "ucapan" ? ucapanCount : APPS.find((a) => a.id === id)?.badge);

  return (
    <div className="dlwed-home" style={{ backgroundImage: `url(${COVER_PHOTO})` }}>
      <div className="dlwed-home-scrim" />

      <div className="dlwed-widget">
        <div className="dlwed-widget-label">Menuju hari bahagia</div>
        <div className="dlwed-widget-count">
          <div><b>{c.days}</b><span>Hari</span></div>
          <div><b>{pad(c.hours)}</b><span>Jam</span></div>
          <div><b>{pad(c.minutes)}</b><span>Menit</span></div>
          <div><b>{pad(c.seconds)}</b><span>Detik</span></div>
        </div>
        <div className="dlwed-widget-date">{GROOM_FIRST} & {BRIDE_FIRST} · {DATE_LABEL}</div>
      </div>

      <div className="dlwed-grid">
        {APPS.map((app) => {
          const badge = badgeFor(app.id);
          return (
            <button key={app.id} className="dlwed-app" onClick={() => onOpen(app.id)}>
              <motion.span layoutId={`appicon-${app.id}`} className="dlwed-app-icon" style={{ background: app.grad }}>
                <span className="dlwed-app-emoji">{app.icon}</span>
                {!!badge && <span className="dlwed-app-badge">{badge}</span>}
              </motion.span>
              <span className="dlwed-app-label">{app.label}</span>
            </button>
          );
        })}
      </div>

      <div className="dlwed-dock">
        {dock.map((id) => {
          const app = APPS.find((a) => a.id === id)!;
          const badge = badgeFor(id);
          return (
            <button key={id} className="dlwed-dock-app" onClick={() => onOpen(id)} aria-label={app.label}>
              <span className="dlwed-app-icon dlwed-dock-icon" style={{ background: app.grad }}>
                <span className="dlwed-app-emoji">{app.icon}</span>
                {!!badge && <span className="dlwed-app-badge">{badge}</span>}
              </span>
            </button>
          );
        })}
      </div>
      <a className="dlwed-credit light" href="https://dirakhmat.app" target="_blank" rel="noopener noreferrer">
        by <u>Dirakhmat</u>
      </a>
      <div className="dlwed-home-indicator light" />
    </div>
  );
};

// ─── APP MODAL WRAPPER ─────────────────────────────────────────────
const AppModal: React.FC<{ app: (typeof APPS)[number]; onClose: () => void; children: React.ReactNode }> = ({ app, onClose, children }) => (
  <motion.div
    className="dlwed-appmodal"
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ type: "spring", stiffness: 320, damping: 32 }}
  >
    <div className="dlwed-appbar">
      <button className="dlwed-appbar-back" onClick={onClose} aria-label="Kembali">
        <IconBack />
      </button>
      <div className="dlwed-appbar-title">
        <motion.span layoutId={`appicon-${app.id}`} className="dlwed-appbar-icon" style={{ background: app.grad }}>
          <span className="dlwed-app-emoji">{app.icon}</span>
        </motion.span>
        {app.label}
      </div>
      <div className="dlwed-appbar-spacer" />
    </div>
    <div className="dlwed-appscroll">{children}</div>
    <button className="dlwed-home-indicator dark tappable" onClick={onClose} aria-label="Kembali ke home" />
  </motion.div>
);

// ─── APP: CERITA KAMI ──────────────────────────────────────────────
const CeritaKamiApp: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="dlwed-cerita">
      <div className="dlwed-hero-banner" style={{ backgroundImage: `url(${HERO_PHOTO})` }}>
        <div className="dlwed-hero-fade" />
        <div className="dlwed-hero-text">
          <span className="dlwed-hero-eyebrow">Original Series</span>
          <h2>{GROOM_FIRST} & {BRIDE_FIRST}</h2>
          <p>Kisah perjalanan dua hati menuju satu tujuan.</p>
        </div>
      </div>

      <section className="dlwed-row">
        <h3 className="dlwed-row-title">🎬 Trailer</h3>
        <div className="dlwed-video-wrap">
          <video className="dlwed-video" controls poster={STORY_VIDEO.poster} preload="none">
            <source src={STORY_VIDEO.src} type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="dlwed-row">
        <h3 className="dlwed-row-title">📺 Episodes</h3>
        <div className="dlwed-hscroll">
          {STORY.map((s, i) => (
            <button key={i} className="dlwed-epcard" onClick={() => setOpen(open === i ? null : i)}>
              <div className="dlwed-epcard-img" style={{ backgroundImage: `url(${s.photo})` }}>
                <span className="dlwed-epcard-num">{pad(i + 1)}</span>
              </div>
              <div className="dlwed-epcard-title">{s.title}</div>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {open !== null && (
          <motion.section
            className="dlwed-epdetail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <img src={STORY[open].photo} alt={STORY[open].title} className="dlwed-epdetail-img" />
            <h4>Episode {pad(open + 1)} · {STORY[open].title}</h4>
            <p>{STORY[open].body}</p>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── APP: ACARA & LOKASI ───────────────────────────────────────────
const AcaraLokasiApp: React.FC = () => (
  <div className="dlwed-acara">
    <div className="dlwed-detail-hero" style={{ backgroundImage: `url(${COVER_PHOTO})` }}>
      <div className="dlwed-hero-fade" />
      <div className="dlwed-detail-hero-text">
        <h2>Save The Date</h2>
        <p>{DATE_LABEL}</p>
      </div>
    </div>

    <div className="dlwed-couple-mini">
      {[GROOM, BRIDE].map((p) => (
        <div key={p.name} className="dlwed-couple-card">
          <img src={p.photo} alt={p.name} />
          <div className="dlwed-couple-name">{p.name}</div>
          <div className="dlwed-couple-role">{p.label}</div>
          <div className="dlwed-couple-parent">{p.order} dari<br />Bpk {p.father} & Ibu {p.mother}</div>
        </div>
      ))}
    </div>

    {EVENTS.map((e) => (
      <div key={e.title} className="dlwed-event">
        <div className="dlwed-event-head">
          <IconCalendar />
          <span>{e.title}</span>
        </div>
        <div className="dlwed-event-row"><b>Hari</b>{e.date}</div>
        <div className="dlwed-event-row"><b>Waktu</b>{e.time}</div>
        <div className="dlwed-event-row"><b>Tempat</b>{e.venue}</div>
        <div className="dlwed-event-row"><b>Alamat</b>{e.address}</div>
      </div>
    ))}

    <div className="dlwed-actions">
      <button className="dlwed-btn primary" onClick={() => downloadIcs("Pernikahan", EVENTS[0].venue)}>
        <IconCalendar /> Tambahkan ke Kalender
      </button>
      <a className="dlwed-btn ghost" href={MAP_LINK} target="_blank" rel="noreferrer">
        <IconMap /> Buka di Google Maps
      </a>
    </div>

    <div className="dlwed-map">
      <iframe title="Lokasi acara" src={MAP_EMBED_URL} loading="lazy" />
    </div>
  </div>
);

// ─── APP: RSVP ─────────────────────────────────────────────────────
const RSVPApp: React.FC<{ guest: string }> = ({ guest }) => {
  const [nama, setNama] = useState(guest === "Tamu Undangan" ? "" : guest);
  const [hadir, setHadir] = useState(true);
  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;
    setState("sending");
    await submitToSheet({
      type: "rsvp",
      nama: nama.trim(),
      kehadiran: hadir ? "Hadir" : "Tidak Hadir",
      jumlah: String(jumlah),
      pesan: pesan.trim(),
    });
    setState("done");
  };

  if (state === "done") {
    return (
      <div className="dlwed-rsvp-done">
        <motion.div className="dlwed-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
          <IconCheck />
        </motion.div>
        <h3>Terima kasih, {nama}!</h3>
        <p>{hadir ? "Kami menantikan kehadiranmu di hari bahagia kami. 🤍" : "Terima kasih atas doa dan konfirmasinya. 🤍"}</p>
        <button className="dlwed-btn ghost" onClick={() => setState("idle")}>Ubah Konfirmasi</button>
      </div>
    );
  }

  return (
    <form className="dlwed-form" onSubmit={submit}>
      <h3 className="dlwed-form-title">Konfirmasi Kehadiran</h3>
      <label className="dlwed-field">
        <span>Nama</span>
        <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama kamu" required />
      </label>

      <div className="dlwed-field">
        <span>Apakah kamu hadir?</span>
        <div className="dlwed-toggle" data-on={hadir}>
          <button type="button" className={hadir ? "on" : ""} onClick={() => setHadir(true)}>Hadir</button>
          <button type="button" className={!hadir ? "on" : ""} onClick={() => setHadir(false)}>Tidak</button>
        </div>
      </div>

      {hadir && (
        <label className="dlwed-field">
          <span>Jumlah tamu</span>
          <div className="dlwed-stepper">
            <button type="button" onClick={() => setJumlah((n) => Math.max(1, n - 1))}>−</button>
            <b>{jumlah}</b>
            <button type="button" onClick={() => setJumlah((n) => Math.min(10, n + 1))}>+</button>
          </div>
        </label>
      )}

      <label className="dlwed-field">
        <span>Ucapan singkat (opsional)</span>
        <textarea value={pesan} onChange={(e) => setPesan(e.target.value)} rows={3} placeholder="Tulis pesanmu..." />
      </label>

      <button className="dlwed-btn primary block" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Mengirim..." : "Kirim Konfirmasi"}
      </button>
    </form>
  );
};

// ─── APP: GALERI ───────────────────────────────────────────────────
const GaleriApp: React.FC = () => {
  const [idx, setIdx] = useState<number | null>(null);
  const close = useCallback(() => setIdx(null), []);
  const prev = useCallback(() => setIdx((i) => (i === null ? i : (i + GALLERY_PHOTOS.length - 1) % GALLERY_PHOTOS.length)), []);
  const next = useCallback(() => setIdx((i) => (i === null ? i : (i + 1) % GALLERY_PHOTOS.length)), []);

  useEffect(() => {
    if (idx === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [idx, close, prev, next]);

  return (
    <div className="dlwed-galeri">
      <div className="dlwed-gal-grid">
        {GALLERY_PHOTOS.map((src, i) => (
          <button key={i} className="dlwed-gal-item" onClick={() => setIdx(i)} style={{ backgroundImage: `url(${src})` }} aria-label={`Foto ${i + 1}`} />
        ))}
      </div>
      <AnimatePresence>
        {idx !== null && (
          <motion.div className="dlwed-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
            <button className="dlwed-lb-nav left" onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
            <img src={GALLERY_PHOTOS[idx]} alt={`Foto ${idx + 1}`} onClick={(e) => e.stopPropagation()} />
            <button className="dlwed-lb-nav right" onClick={(e) => { e.stopPropagation(); next(); }}>›</button>
            <button className="dlwed-lb-close" onClick={close} aria-label="Tutup">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── APP: UCAPAN ───────────────────────────────────────────────────
const UcapanApp: React.FC<{ guest: string; list: UcapanItem[]; onAdd: (u: UcapanItem) => void }> = ({ guest, list, onAdd }) => {
  const [nama, setNama] = useState(guest === "Tamu Undangan" ? "" : guest);
  const [pesan, setPesan] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [list.length]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !pesan.trim()) return;
    setSending(true);
    const item: UcapanItem = { nama: nama.trim(), pesan: pesan.trim(), time: Date.now() };
    onAdd(item);
    setPesan("");
    await submitToSheet({ type: "ucapan", nama: item.nama, pesan: item.pesan });
    setSending(false);
  };

  return (
    <div className="dlwed-ucapan">
      <div className="dlwed-chat">
        {list.map((u, i) => (
          <div key={i} className="dlwed-bubble">
            <div className="dlwed-bubble-name">{u.nama}</div>
            <div className="dlwed-bubble-text">{u.pesan}</div>
            <div className="dlwed-bubble-time">{relativeTime(u.time)}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form className="dlwed-chat-input" onSubmit={submit}>
        <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama" className="dlwed-chat-name" required />
        <div className="dlwed-chat-row">
          <input value={pesan} onChange={(e) => setPesan(e.target.value)} placeholder="Tulis ucapan & doa..." required />
          <button type="submit" disabled={sending} aria-label="Kirim"><IconSend /></button>
        </div>
      </form>
    </div>
  );
};

// ─── APP: PLAYLIST ─────────────────────────────────────────────────
const PlaylistApp: React.FC = () => (
  <div className="dlwed-playlist">
    <div className="dlwed-nowplaying">
      <div className="dlwed-np-art" style={{ backgroundImage: `url(${COVER_PHOTO})` }} />
      <div className="dlwed-np-meta">
        <div className="dlwed-np-title">Our Playlist</div>
        <div className="dlwed-np-sub">{GROOM_FIRST} & {BRIDE_FIRST}</div>
        <div className="dlwed-np-bar"><span /></div>
      </div>
    </div>
    <p className="dlwed-playlist-note">Lagu-lagu yang menemani perjalanan cinta kami 🎧</p>
    <div className="dlwed-spotify">
      <iframe title="Playlist Spotify" src={SPOTIFY_EMBED_URL} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
    </div>
  </div>
);

// ─── ROOT ──────────────────────────────────────────────────────────
export const WeddingPageDimasLaila: React.FC = () => {
  const [searchParams] = useSearchParams();
  const guest = searchParams.get("to") || "Tamu Undangan";
  const now = useClock();
  const ready = useImagesReady(PRELOAD_PHOTOS);

  const [screen, setScreen] = useState<"lock" | "home">("lock");
  const [openApp, setOpenApp] = useState<AppId | null>(null);
  const [ucapan, setUcapan] = useState<UcapanItem[]>(UCAPAN_SEED);

  // Ambil ucapan dari Google Sheets (jika endpoint diisi)
  useEffect(() => {
    let alive = true;
    fetchUcapan().then((data) => { if (alive && data && data.length) setUcapan(data); });
    return () => { alive = false; };
  }, []);

  // Kunci scroll body & set tema
  useEffect(() => {
    document.body.classList.add("dlwed-body");
    return () => { document.body.classList.remove("dlwed-body"); };
  }, []);

  const activeApp = openApp ? APPS.find((a) => a.id === openApp)! : null;

  const renderApp = (id: AppId) => {
    switch (id) {
      case "cerita": return <CeritaKamiApp />;
      case "acara": return <AcaraLokasiApp />;
      case "rsvp": return <RSVPApp guest={guest} />;
      case "galeri": return <GaleriApp />;
      case "ucapan": return <UcapanApp guest={guest} list={ucapan} onAdd={(u) => setUcapan((p) => [...p, u])} />;
      case "playlist": return <PlaylistApp />;
    }
  };

  return (
    <div className="dlwed-root">
      <div className="dlwed-phone">
        <StatusBar now={now} dark={screen === "home" || !!openApp} />

        <div className="dlwed-viewport">
          {!ready && <div className="dlwed-loader"><span /></div>}

          <AnimatePresence mode="wait">
            {screen === "lock" && (
              <motion.div key="lock" className="dlwed-screen" exit={{ opacity: 0, scale: 1.06 }} transition={{ duration: 0.5 }}>
                <LockScreen now={now} guest={guest} onUnlock={() => setScreen("home")} />
              </motion.div>
            )}
            {screen === "home" && (
              <motion.div key="home" className="dlwed-screen" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <HomeScreen onOpen={setOpenApp} ucapanCount={ucapan.length} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeApp && (
              <AppModal key={activeApp.id} app={activeApp} onClose={() => setOpenApp(null)}>
                {renderApp(activeApp.id)}
              </AppModal>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WeddingPageDimasLaila;
