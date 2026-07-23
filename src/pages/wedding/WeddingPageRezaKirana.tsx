import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./WeddingPageRezaKirana.css";

// ─── CONFIG ────────────────────────────────────────────────────────
// Semua data undangan ada di sini. Ganti nilai placeholder dengan data asli.
const WEDDING_DATE = new Date("2027-08-21T09:00:00+07:00");
const GROOM_FIRST = "Reza";
const BRIDE_FIRST = "Kirana";
const DATE_LABEL = "Sabtu, 21 Agustus 2027";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Bandung&t=&z=14&ie=UTF8&iwloc=&output=embed";
const MAP_LINK = "https://maps.app.goo.gl/";

// Endpoint Google Apps Script Web App untuk RSVP & Ucapan (kolom komentar).
// Kosongkan ("") untuk mode demo. Cara setup: lihat public/reza/README-google-sheets.md
const SHEETS_ENDPOINT = "";

const THUMBNAIL_COVER = "/reza/thumbnail-cover.svg";
const BANNER_PHOTO = "/reza/banner.svg";
const AVATAR_PHOTO = "/reza/avatar.svg";

const FAKE_SUBSCRIBER = "500rb+ Orang Baik yang Support Kami 🙌 (bercanda, tapi doamu beneran dibutuhin)";
const VIDEO_TITLE = "KAMI RESMI MENIKAH!! 😍 (Prepare Nangis)";

const GROOM = {
  name: "Reza Pratama",
  nick: "Reza",
  funFact: "Did You Know: dia bisa menghabiskan 3 jam nonton video kucing sebelum akhirnya beneran nembak.",
  parents: "Bapak Suryanto & Ibu Wulandari",
  ig: "reza.ptm",
  photo: "/reza/groom.svg",
};

const BRIDE = {
  name: "Kirana Ayudya",
  nick: "Kirana",
  funFact: "Did You Know: dia yang bikin caption chat jam 2 pagi jadi alasan Reza susah move on.",
  parents: "Bapak Hidayat & Ibu Kartika",
  ig: "kirana.ayd",
  photo: "/reza/bride.svg",
};

// Playlist "Behind The Scenes" — judul clickbait-playful + views/durasi palsu
const STORY: { title: string; duration: string; views: string; thumb: string; body: string }[] = [
  {
    title: "Waktu Pertama Ketemu (Awkward Banget)",
    duration: "3:14",
    views: "12rb x ditonton ulang",
    thumb: "/reza/s1.svg",
    body: "Ketemu di acara temen, salah panggil nama, terus canggung sepanjang acara. Siapa sangka itu jadi awal dari segalanya.",
  },
  {
    title: "Momen Ditembak — Gagal 3x Baru Berhasil 😂",
    duration: "5:02",
    views: "8,4rb x ditonton ulang",
    thumb: "/reza/s2.svg",
    body: "Percobaan pertama gagal karena tiba-tiba hujan. Kedua gagal karena keduluan telepon kerjaan. Ketiga baru berhasil — dan itu pun grogi setengah mati.",
  },
  {
    title: "LAMARAN MENDADAK NANGIS",
    duration: "7:41",
    views: "21rb x ditonton ulang",
    thumb: "/reza/s3.svg",
    body: "Rencana lamaran yang awalnya mau santai, endingnya dua-duanya nangis di depan keluarga. Restu didapat, air mata bahagia tumpah.",
  },
  {
    title: "MENUJU HARI-H — Sub-Series Terakhir",
    duration: "∞",
    views: "Coming Soon",
    thumb: "/reza/s4.svg",
    body: "Episode terakhir dari series ini akan tayang LIVE di hari pernikahan kami. Jangan sampai ketinggalan ya!",
  },
];

const EVENTS = [
  { title: "Akad Nikah", time: "09.00 – 11.00 WIB", venue: "Gedung Merah Putih", address: "Jl. Placeholder No. 1, Bandung" },
  { title: "Resepsi", time: "12.00 WIB – Selesai", venue: "Gedung Merah Putih", address: "Jl. Placeholder No. 1, Bandung" },
];

const GIFTS = [
  { type: "Transfer Bank", name: "Bank BCA", number: "1234567890", holder: "Kirana Ayudya" },
  { type: "E-Wallet", name: "GoPay", number: "081234567890", holder: "Reza Pratama" },
];

const SHIPPING_ADDRESS = "Reza Pratama — Jl. Placeholder No. 1, Bandung, 40123 (0812-3456-7890)";

const COMMENT_SEED: CommentItem[] = [
  { nama: "Sahabat Kuliah", pesan: "GAK SABAR NUNGGU HARI-H INI 😭🎉 SELAMAT REZA KIRANA!!", time: Date.now() - 1000 * 60 * 20, reacts: { "❤️": 12, "😂": 2, "🎉": 8 } },
  { nama: "Keluarga Besar", pesan: "Barakallahu lakuma, semoga sakinah mawaddah warahmah 🤍", time: Date.now() - 1000 * 60 * 90, reacts: { "❤️": 20, "😂": 0, "🎉": 5 } },
];

// ─── TYPES ─────────────────────────────────────────────────────────
type Kehadiran = "Hadir" | "Tidak Hadir";
interface CommentItem {
  nama: string;
  pesan: string;
  time: number;
  reacts: Record<string, number>;
}

// ─── HELPERS ───────────────────────────────────────────────────────
function downloadIcs(title: string, location: string): void {
  const fmt = (d: Date) => d.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const start = WEDDING_DATE;
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//WeddingRezaKirana//EN", "BEGIN:VEVENT",
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

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("");
}

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

async function fetchUcapan(): Promise<CommentItem[] | null> {
  if (!SHEETS_ENDPOINT) return null;
  try {
    const res = await fetch(SHEETS_ENDPOINT, { method: "GET" });
    const data = await res.json();
    if (!data || !Array.isArray(data.ucapan)) return null;
    return data.ucapan.map((u: { nama: string; pesan: string; time: string }) => ({
      nama: u.nama, pesan: u.pesan, time: new Date(u.time).getTime() || Date.now(),
      reacts: { "❤️": 0, "😂": 0, "🎉": 0 },
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

async function shareInvite(): Promise<"shared" | "copied" | "failed"> {
  const url = window.location.href;
  const text = `Yuk hadir di pernikahan ${GROOM_FIRST} & ${BRIDE_FIRST}! 💕`;
  if (navigator.share) {
    try {
      await navigator.share({ title: VIDEO_TITLE, text, url });
      return "shared";
    } catch { /* user cancelled or unsupported, fall through to copy */ }
  }
  const ok = await copyText(url);
  return ok ? "copied" : "failed";
}

// ─── SVG ICONS ─────────────────────────────────────────────────────
const IconPlay = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7Z" /></svg>
);
const IconBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9Z" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);
const IconMap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconInstagram = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconCopy = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconShare = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" />
  </svg>
);
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M18 6 6 18M6 6l12 12" /></svg>
);

// ─── REVEAL ────────────────────────────────────────────────────────
const Reveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [ref, visible] = useInView(0.15);
  return <div ref={ref} className={`rkwed-reveal ${visible ? "in" : ""} ${className || ""}`}>{children}</div>;
};

// ─── OPENING THUMBNAIL ─────────────────────────────────────────────
const OpeningThumbnail: React.FC<{ onPlay: () => void }> = ({ onPlay }) => {
  const [buffering, setBuffering] = useState(false);
  const handlePlay = () => {
    setBuffering(true);
    setTimeout(onPlay, 750);
  };
  return (
    <motion.div className="rkwed-opening" exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.4 }}>
      <div className="rkwed-thumb" style={{ backgroundImage: `url(${THUMBNAIL_COVER})` }}>
        <span className="rkwed-badge-new">BARU</span>
        <span className="rkwed-thumb-duration">23:59</span>
        <button className="rkwed-play" onClick={handlePlay} aria-label="Putar">
          <IconPlay />
        </button>
        {buffering && <div className="rkwed-buffer"><span /></div>}
      </div>
      <h1 className="rkwed-video-title">{VIDEO_TITLE}</h1>
      <p className="rkwed-video-sub">{GROOM_FIRST} &amp; {BRIDE_FIRST} Official · Video Spesial</p>
    </motion.div>
  );
};

// ─── CHANNEL HEADER ────────────────────────────────────────────────
const ChannelHeader: React.FC<{ onConfirm: () => void }> = ({ onConfirm }) => (
  <header className="rkwed-channel">
    <div className="rkwed-banner" style={{ backgroundImage: `url(${BANNER_PHOTO})` }} />
    <div className="rkwed-channel-info">
      <img className="rkwed-avatar" src={AVATAR_PHOTO} alt={`${GROOM_FIRST} & ${BRIDE_FIRST}`} />
      <div className="rkwed-channel-meta">
        <h2 className="rkwed-channel-name">{GROOM_FIRST} &amp; {BRIDE_FIRST} Official</h2>
        <p className="rkwed-channel-sub">{FAKE_SUBSCRIBER}</p>
      </div>
      <button className="rkwed-subscribe" onClick={onConfirm}>Konfirmasi Hadir</button>
    </div>
    <nav className="rkwed-tabs" aria-label="Navigasi channel">
      <a href="#rkwed-hero">Beranda</a>
      <a href="#rkwed-story">Cerita</a>
      <a href="#rkwed-comments">Ucapan</a>
    </nav>
  </header>
);

// ─── STORY PLAYLIST ────────────────────────────────────────────────
const StoryPlaylist: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="rkwed-story" className="rkwed-section" aria-label="Behind the scenes">
      <Reveal>
        <p className="rkwed-eyebrow">📺 Playlist</p>
        <h2 className="rkwed-title">Behind The Scenes</h2>
        <div className="rkwed-playlist">
          {STORY.map((s, i) => (
            <button key={i} className="rkwed-thumb-card" onClick={() => setOpen(i)}>
              <div className="rkwed-thumb-card-img" style={{ backgroundImage: `url(${s.thumb})` }}>
                <span className="rkwed-thumb-card-duration">{s.duration}</span>
              </div>
              <div className="rkwed-thumb-card-title">{s.title}</div>
              <div className="rkwed-thumb-card-views">{s.views}</div>
            </button>
          ))}
        </div>
      </Reveal>

      <AnimatePresence>
        {open !== null && (
          <motion.div className="rkwed-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div className="rkwed-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <button className="rkwed-modal-close" onClick={() => setOpen(null)} aria-label="Tutup"><IconClose /></button>
              <img className="rkwed-modal-img" src={STORY[open].thumb} alt={STORY[open].title} />
              <h3>{STORY[open].title}</h3>
              <p>{STORY[open].body}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ─── COUPLE PROFILE ────────────────────────────────────────────────
const ProfileCard: React.FC<{ p: typeof GROOM }> = ({ p }) => (
  <Reveal className="rkwed-creator-card">
    <div className="rkwed-creator-photo"><img src={p.photo} alt={p.name} loading="lazy" /></div>
    <h3 className="rkwed-creator-name">{p.name}</h3>
    <p className="rkwed-creator-nick">@{p.nick.toLowerCase()}</p>
    <p className="rkwed-creator-fact">{p.funFact}</p>
    <p className="rkwed-creator-parents">Anak dari {p.parents}</p>
    {p.ig && (
      <a className="rkwed-ig" href={`https://instagram.com/${p.ig}`} target="_blank" rel="noreferrer">
        <IconInstagram /> @{p.ig}
      </a>
    )}
  </Reveal>
);

const CoupleProfile: React.FC = () => (
  <section className="rkwed-section" aria-label="Meet the creators">
    <Reveal><p className="rkwed-eyebrow center">Meet The Creators</p></Reveal>
    <div className="rkwed-creator-grid">
      <ProfileCard p={GROOM} />
      <ProfileCard p={BRIDE} />
    </div>
  </section>
);

// ─── FLIP DIGIT ────────────────────────────────────────────────────
const FlipDigit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="rkwed-flip">
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        className="rkwed-flip-value"
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        exit={{ rotateX: 90, opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        {pad(value)}
      </motion.span>
    </AnimatePresence>
    <span className="rkwed-flip-label">{label}</span>
  </div>
);

// ─── EVENT SCHEDULE ────────────────────────────────────────────────
const EventSchedule: React.FC = () => {
  const c = useCountdown(WEDDING_DATE.getTime());
  return (
    <section className="rkwed-section rkwed-schedule" aria-label="Jadwal tayang">
      <Reveal>
        <p className="rkwed-eyebrow center">🔴 LIVE</p>
        <h2 className="rkwed-title center">{DATE_LABEL} — Jangan Sampai Ketinggalan!</h2>

        <div className="rkwed-flip-row">
          <FlipDigit value={c.days} label="Hari" />
          <FlipDigit value={c.hours} label="Jam" />
          <FlipDigit value={c.minutes} label="Menit" />
          <FlipDigit value={c.seconds} label="Detik" />
        </div>

        {EVENTS.map((e) => (
          <div key={e.title} className="rkwed-event-card">
            <h4>{e.title}</h4>
            <p><b>{DATE_LABEL}</b> · {e.time}</p>
            <p>{e.venue} — {e.address}</p>
          </div>
        ))}

        <div className="rkwed-schedule-actions">
          <button className="rkwed-btn primary" onClick={() => downloadIcs("Pernikahan", EVENTS[0].venue)}>
            <IconBell /> Set Reminder
          </button>
          <a className="rkwed-btn ghost" href={MAP_LINK} target="_blank" rel="noreferrer">
            <IconMap /> Buka di Maps
          </a>
        </div>

        <div className="rkwed-map"><iframe title="Lokasi acara" src={MAP_EMBED_URL} loading="lazy" /></div>
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
    <div className="rkwed-gift-card">
      <div className="rkwed-gift-type">{g.type}</div>
      <div className="rkwed-gift-name">{g.name}</div>
      <div className="rkwed-gift-number">{g.number}</div>
      <div className="rkwed-gift-holder">a.n. {g.holder}</div>
      <button className={`rkwed-copy ${copied ? "done" : ""}`} onClick={onCopy}>
        {copied ? "Tersalin ✓" : <><IconCopy /> Salin</>}
      </button>
    </div>
  );
};

const GiftSection: React.FC = () => {
  const [showAddr, setShowAddr] = useState(false);
  return (
    <section className="rkwed-section" aria-label="Support creator">
      <Reveal>
        <p className="rkwed-eyebrow center">💸 Support Creator</p>
        <p className="rkwed-gift-intro">
          Kalau mau &quot;traktir&quot; kami merayakan next chapter, boleh banget lewat sini 👇
        </p>
        <div className="rkwed-gift-list">{GIFTS.map((g) => <GiftCard key={g.name} g={g} />)}</div>
        <button className="rkwed-gift-shiplink" onClick={() => setShowAddr((v) => !v)}>
          Mau kirim kado fisik? Klik sini
        </button>
        <AnimatePresence>
          {showAddr && (
            <motion.div className="rkwed-gift-addr" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <p>{SHIPPING_ADDRESS}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
};

// ─── COMMENT SECTION ───────────────────────────────────────────────
const REACTIONS = ["❤️", "😂", "🎉"];

const CommentCard: React.FC<{ c: CommentItem; onReact: (emoji: string) => void }> = ({ c, onReact }) => (
  <div className="rkwed-comment">
    <div className="rkwed-comment-avatar">{initials(c.nama)}</div>
    <div className="rkwed-comment-body">
      <div className="rkwed-comment-head">
        <span className="rkwed-comment-name">{c.nama}</span>
        <span className="rkwed-comment-time">{relativeTime(c.time)}</span>
      </div>
      <p className="rkwed-comment-text">{c.pesan}</p>
      <div className="rkwed-comment-reacts">
        {REACTIONS.map((emoji) => (
          <button key={emoji} className="rkwed-react" onClick={() => onReact(emoji)}>
            {emoji} <span>{c.reacts[emoji] || 0}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const CommentSection: React.FC<{ guest: string; list: CommentItem[]; onAdd: (c: CommentItem) => void; onReact: (idx: number, emoji: string) => void }> = ({ guest, list, onAdd, onReact }) => {
  const [nama, setNama] = useState(guest === "Tamu Undangan" ? "" : guest);
  const [kehadiran, setKehadiran] = useState<Kehadiran>("Hadir");
  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");
  const [sending, setSending] = useState(false);
  const [sort, setSort] = useState<"terbaru" | "disukai">("terbaru");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !pesan.trim()) return;
    setSending(true);
    const item: CommentItem = { nama: nama.trim(), pesan: pesan.trim(), time: Date.now(), reacts: { "❤️": 0, "😂": 0, "🎉": 0 } };
    onAdd(item);
    await Promise.all([
      submitToSheet({ type: "rsvp", nama: item.nama, kehadiran, jumlah: String(jumlah), pesan: item.pesan }),
      submitToSheet({ type: "ucapan", nama: item.nama, pesan: item.pesan }),
    ]);
    setPesan("");
    setSending(false);
  };

  const sorted = [...list].sort((a, b) => {
    if (sort === "terbaru") return b.time - a.time;
    const totalA = Object.values(a.reacts).reduce((s, n) => s + n, 0);
    const totalB = Object.values(b.reacts).reduce((s, n) => s + n, 0);
    return totalB - totalA;
  });

  return (
    <section id="rkwed-comments" className="rkwed-section" aria-label="Kolom komentar">
      <Reveal>
        <p className="rkwed-eyebrow center">💬 Kolom Komentar</p>
        <h2 className="rkwed-title center">RSVP &amp; Ucapan</h2>

        <form className="rkwed-form" onSubmit={submit}>
          <label className="rkwed-field">
            <span>Nama</span>
            <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama kamu" required />
          </label>
          <div className="rkwed-field">
            <span>Kehadiran</span>
            <div className="rkwed-choices">
              {(["Hadir", "Tidak Hadir"] as Kehadiran[]).map((k) => (
                <button type="button" key={k} className={kehadiran === k ? "on" : ""} onClick={() => setKehadiran(k)}>{k}</button>
              ))}
            </div>
          </div>
          {kehadiran === "Hadir" && (
            <label className="rkwed-field">
              <span>Jumlah Tamu</span>
              <div className="rkwed-stepper">
                <button type="button" onClick={() => setJumlah((n) => Math.max(1, n - 1))}>−</button>
                <b>{jumlah}</b>
                <button type="button" onClick={() => setJumlah((n) => Math.min(10, n + 1))}>+</button>
              </div>
            </label>
          )}
          <label className="rkwed-field">
            <span>Komentar</span>
            <textarea value={pesan} onChange={(e) => setPesan(e.target.value)} rows={2} placeholder="Tulis komentar kamu..." required />
          </label>
          <button className="rkwed-btn primary block" type="submit" disabled={sending}>
            {sending ? "Mengirim..." : "Kirim Komentar"}
          </button>
        </form>

        <div className="rkwed-sort">
          <button className={sort === "terbaru" ? "on" : ""} onClick={() => setSort("terbaru")}>Terbaru</button>
          <button className={sort === "disukai" ? "on" : ""} onClick={() => setSort("disukai")}>Paling Disukai</button>
        </div>

        <div className="rkwed-comment-list">
          {sorted.map((c) => {
            const idx = list.indexOf(c);
            return <CommentCard key={`${c.nama}-${c.time}`} c={c} onReact={(emoji) => onReact(idx, emoji)} />;
          })}
        </div>
      </Reveal>
    </section>
  );
};

// ─── CLOSING OUTRO ─────────────────────────────────────────────────
const ClosingOutro: React.FC = () => {
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied">("idle");
  const handleShare = async () => {
    const result = await shareInvite();
    if (result === "shared" || result === "copied") {
      setShareState(result);
      setTimeout(() => setShareState("idle"), 2500);
    }
  };
  return (
    <section className="rkwed-section rkwed-outro" aria-label="Penutup">
      <Reveal>
        <p className="rkwed-outro-text">
          Makasih udah baca sampai sini! Jangan lupa hadir ya, like &amp; share kebahagiaan kami 💕
        </p>
        <button className="rkwed-btn primary" onClick={handleShare}>
          <IconShare /> {shareState === "shared" ? "Terbagikan ✓" : shareState === "copied" ? "Link disalin ✓" : "Share Undangan Ini"}
        </button>
        <footer className="rkwed-footer">
          <div>© {new Date().getFullYear()} · {GROOM_FIRST} &amp; {BRIDE_FIRST} Official</div>
          <a className="rkwed-footer-credit" href="https://dirakhmat.app" target="_blank" rel="noopener noreferrer">
            by <u>Dirakhmat</u>
          </a>
        </footer>
      </Reveal>
    </section>
  );
};

// ─── ROOT ──────────────────────────────────────────────────────────
export const WeddingPageRezaKirana: React.FC = () => {
  const [searchParams] = useSearchParams();
  const guest = searchParams.get("to") || "Tamu Undangan";
  const [opened, setOpened] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>(COMMENT_SEED);
  const confirmRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    fetchUcapan().then((d) => { if (alive && d && d.length) setComments(d); });
    return () => { alive = false; };
  }, []);

  const scrollToComments = useCallback(() => {
    document.getElementById("rkwed-comments")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleReact = useCallback((idx: number, emoji: string) => {
    setComments((prev) => prev.map((c, i) => i === idx ? { ...c, reacts: { ...c.reacts, [emoji]: (c.reacts[emoji] || 0) + 1 } } : c));
  }, []);

  return (
    <div className="rkwed-root" ref={confirmRef}>
      <AnimatePresence>
        {!opened && <OpeningThumbnail key="opening" onPlay={() => setOpened(true)} />}
      </AnimatePresence>

      {opened && (
        <motion.main className="rkwed-content" id="rkwed-hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <ChannelHeader onConfirm={scrollToComments} />
          <StoryPlaylist />
          <CoupleProfile />
          <EventSchedule />
          <GiftSection />
          <CommentSection guest={guest} list={comments} onAdd={(c) => setComments((p) => [c, ...p])} onReact={handleReact} />
          <ClosingOutro />
        </motion.main>
      )}
    </div>
  );
};

export default WeddingPageRezaKirana;
