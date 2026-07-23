import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./WeddingPageAryaSekar.css";

// ─── CONFIG ────────────────────────────────────────────────────────
// Semua data undangan ada di sini. Ganti nilai placeholder dengan data asli.
const WEDDING_DATE = new Date("2027-05-15T08:00:00+07:00");
const GROOM_FIRST = "Arya";
const BRIDE_FIRST = "Sekar";
const DATE_LABEL = "Sabtu, 15 Mei 2027";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Yogyakarta&t=&z=14&ie=UTF8&iwloc=&output=embed";
const MAP_LINK = "https://maps.app.goo.gl/";

// Musik latar (placeholder — taruh file di /public/arya/music.mp3)
const BG_AUDIO = "/arya/music.mp3";

// Endpoint Google Apps Script Web App untuk RSVP & Ucapan.
// Kosongkan ("") untuk mode demo. Cara setup: lihat public/arya/README-google-sheets.md
const SHEETS_ENDPOINT = "";

const DRESS_CODE = { note: "Semi-formal, nuansa earth tone", swatches: ["#e6d3ab", "#c9a24b", "#8a6d2f", "#f4ead6"] };

// Foto (placeholder SVG di /public/arya/ — timpa dengan foto asli, nama sama)
const GROOM = {
  name: "Arya Wicaksana",
  nick: "Arya",
  tagline: "Putra pertama dari Bapak Suryanto & Ibu Wulandari",
  desc: "Seorang yang tenang dan penuh perhatian. Menyukai kopi pagi, buku, dan perjalanan panjang. Baginya, rumah bukanlah tempat — melainkan seseorang.",
  parents: "Bapak Suryanto & Ibu Wulandari",
  ig: "arya.wck",
  photo: "/arya/groom.svg",
};

const BRIDE = {
  name: "Sekar Ayu Pramesti",
  nick: "Sekar",
  tagline: "Putri kedua dari Bapak Hidayat & Ibu Kartika",
  desc: "Hangat, ceria, dan mencintai hal-hal kecil yang sederhana. Senang menulis, memasak, dan tertawa lepas. Ia percaya bahwa cinta tumbuh dari kesabaran.",
  parents: "Bapak Hidayat & Ibu Kartika",
  ig: "sekar.ayu",
  photo: "/arya/bride.svg",
};

// Our Story ala Spotify Wrapped — satu momen satu layar, warna solid lembut
const STORY: { title: string; caption: string; photo: string; bg: string; ink: string }[] = [
  {
    title: "Pertemuan Pertama",
    caption: "Sebuah sapa sederhana di tengah kesibukan — yang ternyata menjadi awal dari segalanya.",
    photo: "/arya/s1.svg",
    bg: "#efe3cd",
    ink: "#5b4a2c",
  },
  {
    title: "Momen Jadian",
    caption: "Dua hati memutuskan untuk berjalan searah, saling menguatkan dalam diam maupun tawa.",
    photo: "/arya/s2.svg",
    bg: "#e7d8bd",
    ink: "#54432770",
  },
  {
    title: "Lamaran",
    caption: "Dengan restu keluarga, sebuah janji kecil diucapkan menuju janji yang lebih besar.",
    photo: "/arya/s3.svg",
    bg: "#eaddc6",
    ink: "#5b4a2c",
  },
  {
    title: "Babak Berikutnya",
    caption: "Dan sekarang, kami siap melangkah bersama ke babak baru — sebagai satu keluarga.",
    photo: "/arya/s4.svg",
    bg: "#e3d2ae",
    ink: "#4d3d20",
  },
];

const EVENTS = [
  { title: "Akad Nikah", time: "08.00 – 10.00 WIB", venue: "Pendopo Kesuma", address: "Jl. Placeholder No. 1, Yogyakarta" },
  { title: "Resepsi", time: "11.00 WIB – Selesai", venue: "Pendopo Kesuma", address: "Jl. Placeholder No. 1, Yogyakarta" },
];

const GIFTS = [
  { type: "Transfer Bank", name: "Bank BCA", number: "1234567890", holder: "Sekar Ayu Pramesti" },
  { type: "E-Wallet", name: "DANA", number: "081234567890", holder: "Arya Wicaksana" },
];

const SHIPPING_ADDRESS = "Sekar Ayu Pramesti — Jl. Placeholder No. 1, Yogyakarta, 55281 (0812-3456-7890)";

const UCAPAN_SEED: UcapanItem[] = [
  { nama: "Keluarga Besar", pesan: "Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah, mawaddah, warahmah.", time: Date.now() - 1000 * 60 * 12 },
  { nama: "Sahabat", pesan: "Turut berbahagia untuk kalian berdua. Bahagia selalu, ya!", time: Date.now() - 1000 * 60 * 55 },
];

// ─── TYPES ─────────────────────────────────────────────────────────
interface UcapanItem { nama: string; pesan: string; time: number; }
type Kehadiran = "Hadir" | "Tidak Hadir" | "Masih Ragu";

// ─── HELPERS ───────────────────────────────────────────────────────
function downloadIcs(title: string, location: string): void {
  const fmt = (d: Date) => d.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const start = WEDDING_DATE;
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//WeddingAryaSekar//EN", "BEGIN:VEVENT",
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

// ─── SVG ICONS (minimalis, outline) ────────────────────────────────
const IconInstagram = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
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
const IconVolumeOn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
  </svg>
);
const IconVolumeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="m23 9-6 6M17 9l6 6" />
  </svg>
);
const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 21s-7.5-4.9-10-9.2C.4 8.8 2 5.5 5.2 5.5c1.9 0 3.2 1.1 3.8 2.1.6-1 1.9-2.1 3.8-2.1 3.2 0 4.8 3.3 3.2 6.3C19.5 16.1 12 21 12 21Z" />
  </svg>
);
const IconCopy = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// ─── DIVIDER ───────────────────────────────────────────────────────
const Divider: React.FC = () => (
  <div className="aswed-divider" aria-hidden>
    <span className="aswed-divider-line" />
    <IconHeart />
    <span className="aswed-divider-line" />
  </div>
);

// ─── SECTION WRAPPER (fade-in) ─────────────────────────────────────
const Reveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [ref, visible] = useInView(0.18);
  return (
    <div ref={ref} className={`aswed-reveal ${visible ? "in" : ""} ${className || ""}`}>
      {children}
    </div>
  );
};

// ─── OPENING ENVELOPE ──────────────────────────────────────────────
const OpeningEnvelope: React.FC<{ guest: string; onOpen: () => void }> = ({ guest, onOpen }) => (
  <motion.div className="aswed-envelope" exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }}>
    <div className="aswed-env-card">
      <div className="aswed-env-flap" />
      <div className="aswed-env-seal"><IconHeart /></div>
      <p className="aswed-env-eyebrow">The Wedding of</p>
      <h1 className="aswed-env-names">{GROOM_FIRST} &amp; {BRIDE_FIRST}</h1>
      <div className="aswed-env-to">
        <span>Kepada Yth. Bapak/Ibu/Saudara/i</span>
        <strong className="aswed-script">{guest}</strong>
        <span className="aswed-env-love">dengan penuh cinta, kami mengundang Anda</span>
      </div>
      <button className="aswed-btn solid" onClick={onOpen}>Buka Undangan</button>
    </div>
  </motion.div>
);

// ─── OUR STORY (Wrapped) ───────────────────────────────────────────
const OurStory: React.FC = () => (
  <section className="aswed-story" aria-label="Cerita kami">
    <div className="aswed-story-intro" style={{ background: "#f7efe0" }}>
      <Reveal>
        <p className="aswed-eyebrow">Our Story</p>
        <h2 className="aswed-serif-title">Perjalanan Kami</h2>
        <p className="aswed-story-hint">Geser / scroll ke bawah untuk menyusuri kisah kami ↓</p>
      </Reveal>
    </div>
    {STORY.map((s, i) => (
      <article key={i} className="aswed-story-slide" style={{ background: s.bg, color: s.ink }}>
        <div className="aswed-story-inner">
          <span className="aswed-story-num">{pad(i + 1)}</span>
          <div className="aswed-story-frame">
            <img src={s.photo} alt={s.title} loading="lazy" />
          </div>
          <h3 className="aswed-story-title">{s.title}</h3>
          <p className="aswed-story-caption">{s.caption}</p>
        </div>
      </article>
    ))}
  </section>
);

// ─── COUPLE PROFILE ────────────────────────────────────────────────
const ProfileCard: React.FC<{ p: typeof GROOM; delay?: number }> = ({ p, delay = 0 }) => (
  <Reveal className="aswed-profile" >
    <div style={{ transitionDelay: `${delay}ms` }} className="aswed-profile-inner">
      <div className="aswed-profile-photo">
        <img src={p.photo} alt={p.name} loading="lazy" />
      </div>
      <h3 className="aswed-profile-name">{p.name}</h3>
      <p className="aswed-script aswed-profile-nick">{p.nick}</p>
      <p className="aswed-profile-tagline">{p.tagline}</p>
      <p className="aswed-profile-desc">{p.desc}</p>
      {p.ig && (
        <a className="aswed-ig" href={`https://instagram.com/${p.ig}`} target="_blank" rel="noreferrer">
          <IconInstagram /> @{p.ig}
        </a>
      )}
    </div>
  </Reveal>
);

const CoupleProfile: React.FC = () => (
  <section className="aswed-section aswed-couple" aria-label="Kedua mempelai">
    <Reveal><p className="aswed-eyebrow center">Kedua Mempelai</p></Reveal>
    <div className="aswed-couple-grid">
      <ProfileCard p={GROOM} />
      <div className="aswed-couple-amp"><span className="aswed-script">&amp;</span></div>
      <ProfileCard p={BRIDE} delay={120} />
    </div>
  </section>
);

// ─── EVENT DETAIL ──────────────────────────────────────────────────
const EventDetail: React.FC = () => {
  const c = useCountdown(WEDDING_DATE.getTime());
  return (
    <section className="aswed-section aswed-event" aria-label="Detail acara">
      <Reveal className="aswed-invite-card">
        <div className="aswed-invite-inner">
          <p className="aswed-eyebrow center">Save The Date</p>
          <div className="aswed-invite-date">{DATE_LABEL}</div>
          <Divider />

          <div className="aswed-countdown">
            {[["Hari", c.days], ["Jam", c.hours], ["Menit", c.minutes], ["Detik", c.seconds]].map(([l, v]) => (
              <div key={l as string}><b>{pad(v as number)}</b><span>{l as string}</span></div>
            ))}
          </div>

          {EVENTS.map((e) => (
            <div key={e.title} className="aswed-event-block">
              <h3 className="aswed-serif-title sm">{e.title}</h3>
              <p className="aswed-event-time">{DATE_LABEL}</p>
              <p className="aswed-event-time">{e.time}</p>
              <p className="aswed-event-venue">{e.venue}</p>
              <p className="aswed-event-addr">{e.address}</p>
            </div>
          ))}

          <div className="aswed-dress">
            <span className="aswed-dress-label">Dress Code</span>
            <div className="aswed-swatches">
              {DRESS_CODE.swatches.map((c2) => <span key={c2} style={{ background: c2 }} />)}
            </div>
            <span className="aswed-dress-note">{DRESS_CODE.note}</span>
          </div>

          <div className="aswed-event-actions">
            <a className="aswed-btn outline" href={MAP_LINK} target="_blank" rel="noreferrer"><IconMap /> Buka di Maps</a>
            <button className="aswed-btn outline" onClick={() => downloadIcs("Pernikahan", EVENTS[0].venue)}><IconCalendar /> Tambah ke Kalender</button>
          </div>
        </div>
      </Reveal>

      <Reveal className="aswed-map">
        <iframe title="Lokasi acara" src={MAP_EMBED_URL} loading="lazy" />
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
    <div className="aswed-gift-card">
      <div className="aswed-gift-type">{g.type}</div>
      <div className="aswed-gift-name">{g.name}</div>
      <div className="aswed-gift-number">{g.number}</div>
      <div className="aswed-gift-holder">a.n. {g.holder}</div>
      <button className={`aswed-copy ${copied ? "done" : ""}`} onClick={onCopy}>
        {copied ? "Tersalin ✓" : <><IconCopy /> Salin</>}
      </button>
    </div>
  );
};

const GiftSection: React.FC = () => {
  const [showAddr, setShowAddr] = useState(false);
  return (
    <section className="aswed-section aswed-gift" aria-label="Hadiah">
      <Reveal>
        <p className="aswed-eyebrow center">Tanda Kasih</p>
        <p className="aswed-gift-intro">
          Doa dan kehadiran Anda adalah hadiah terbesar bagi kami. Namun jika Anda ingin memberi
          tanda kasih tambahan, kami dengan senang hati menerimanya melalui:
        </p>
        <div className="aswed-gift-list">
          {GIFTS.map((g) => <GiftCard key={g.name} g={g} />)}
        </div>

        <button className="aswed-gift-shiplink" onClick={() => setShowAddr((v) => !v)}>
          Ingin mengirim kado secara langsung?
        </button>
        <AnimatePresence>
          {showAddr && (
            <motion.div className="aswed-gift-addr" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <p>{SHIPPING_ADDRESS}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="aswed-gift-outro">
          Terima kasih atas kebaikan dan doa restu Anda. Kehadiran Anda di hari bahagia kami sudah
          lebih dari cukup.
        </p>
      </Reveal>
    </section>
  );
};

// ─── GUEST BOOK ────────────────────────────────────────────────────
const GuestBook: React.FC<{ guest: string; list: UcapanItem[]; onAdd: (u: UcapanItem) => void }> = ({ guest, list, onAdd }) => {
  const [nama, setNama] = useState(guest === "Tamu Undangan" ? "" : guest);
  const [kehadiran, setKehadiran] = useState<Kehadiran>("Hadir");
  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section className="aswed-section aswed-guestbook" aria-label="RSVP dan ucapan">
      <Reveal>
        <p className="aswed-eyebrow center">Buku Tamu</p>
        <h2 className="aswed-serif-title center">RSVP &amp; Ucapan</h2>

        <form className="aswed-gb-form" onSubmit={submit}>
          <label className="aswed-gb-field">
            <span>Nama</span>
            <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Anda" required />
          </label>

          <div className="aswed-gb-field">
            <span>Konfirmasi Kehadiran</span>
            <div className="aswed-gb-choices">
              {(["Hadir", "Tidak Hadir", "Masih Ragu"] as Kehadiran[]).map((k) => (
                <button type="button" key={k} className={kehadiran === k ? "on" : ""} onClick={() => setKehadiran(k)}>{k}</button>
              ))}
            </div>
          </div>

          {kehadiran !== "Tidak Hadir" && (
            <label className="aswed-gb-field">
              <span>Jumlah Tamu</span>
              <div className="aswed-stepper">
                <button type="button" onClick={() => setJumlah((n) => Math.max(1, n - 1))}>−</button>
                <b>{jumlah}</b>
                <button type="button" onClick={() => setJumlah((n) => Math.min(10, n + 1))}>+</button>
              </div>
            </label>
          )}

          <label className="aswed-gb-field">
            <span>Ucapan &amp; Doa</span>
            <textarea value={pesan} onChange={(e) => setPesan(e.target.value)} rows={3} placeholder="Tuliskan ucapan & doa untuk kami..." required />
          </label>

          <button className="aswed-btn solid block" type="submit" disabled={sending}>
            {sending ? "Mengirim..." : sent ? "Terkirim, terima kasih ♥" : "Kirim"}
          </button>
        </form>

        <div className="aswed-gb-book">
          {list.map((u, i) => (
            <div key={i} className="aswed-gb-entry">
              <p className="aswed-script aswed-gb-msg">“{u.pesan}”</p>
              <div className="aswed-gb-meta">— {u.nama} · {relativeTime(u.time)}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

// ─── CLOSING ───────────────────────────────────────────────────────
const Closing: React.FC = () => (
  <section className="aswed-section aswed-closing" aria-label="Penutup">
    <Reveal>
      <IconHeart />
      <p className="aswed-closing-text">
        Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan
        hadir dan memberikan doa restu.
      </p>
      <p className="aswed-closing-thanks">Sampai jumpa di hari bahagia kami.</p>
      <div className="aswed-signature aswed-script">{GROOM_FIRST} &amp; {BRIDE_FIRST}</div>
    </Reveal>
  </section>
);

// ─── MUSIC TOGGLE ──────────────────────────────────────────────────
const MusicToggle: React.FC<{ playing: boolean; onToggle: () => void }> = ({ playing, onToggle }) => (
  <button className="aswed-music" onClick={onToggle} aria-label={playing ? "Matikan musik" : "Nyalakan musik"}>
    <span className={`aswed-music-ring ${playing ? "spin" : ""}`} />
    {playing ? <IconVolumeOn /> : <IconVolumeOff />}
  </button>
);

// ─── ROOT ──────────────────────────────────────────────────────────
export const WeddingPageAryaSekar: React.FC = () => {
  const [searchParams] = useSearchParams();
  const guest = searchParams.get("to") || "Tamu Undangan";
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ucapan, setUcapan] = useState<UcapanItem[]>(UCAPAN_SEED);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let alive = true;
    fetchUcapan().then((d) => { if (alive && d && d.length) setUcapan(d); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (opened) document.body.classList.add("aswed-body");
    return () => { document.body.classList.remove("aswed-body"); };
  }, [opened]);

  const startMusic = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.4;
    el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const toggleMusic = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
  }, [playing]);

  const handleOpen = () => { setOpened(true); startMusic(); };

  return (
    <div className="aswed-root">
      <audio ref={audioRef} src={BG_AUDIO} loop preload="none" />

      <AnimatePresence>
        {!opened && <OpeningEnvelope key="env" guest={guest} onOpen={handleOpen} />}
      </AnimatePresence>

      {opened && (
        <motion.main className="aswed-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
          <header className="aswed-hero">
            <p className="aswed-eyebrow">The Wedding of</p>
            <h1 className="aswed-hero-names">{GROOM_FIRST} <span className="aswed-script">&amp;</span> {BRIDE_FIRST}</h1>
            <p className="aswed-hero-date">{DATE_LABEL}</p>
          </header>
          <OurStory />
          <CoupleProfile />
          <EventDetail />
          <GiftSection />
          <GuestBook guest={guest} list={ucapan} onAdd={(u) => setUcapan((p) => [u, ...p])} />
          <Closing />
          <footer className="aswed-footer">
            <div>Dibuat dengan ♥ · {GROOM_FIRST} &amp; {BRIDE_FIRST}</div>
            <a className="aswed-footer-credit" href="https://dirakhmat.app" target="_blank" rel="noopener noreferrer">
              by <u>Dirakhmat</u>
            </a>
          </footer>
          <MusicToggle playing={playing} onToggle={toggleMusic} />
        </motion.main>
      )}
    </div>
  );
};

export default WeddingPageAryaSekar;
