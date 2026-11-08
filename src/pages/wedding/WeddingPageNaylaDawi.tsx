import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import "./WeddingPageNaylaDawi.css";

/*
 * Undangan Nayla & Dawi — konsep sama dengan /anggi-rezza (WeddingPageAnggi),
 * palet sage + emas.
 *
 * Foto dan musik belum ada. Taruh file di /public/nayla/ lalu isi path di
 * bagian CONFIG; selama masih kosong:
 *   - foto mempelai tampil sebagai kotak placeholder,
 *   - cover / hero / penutup memakai gradasi warna saja,
 *   - section galeri tidak dirender,
 *   - tombol musik tidak dirender.
 */

// ─── CONFIG ────────────────────────────────────────────────────────
const WEDDING_DATE = new Date("2026-11-22T07:00:00+08:00");
const DATE_LABEL = "Minggu, 22 November 2026";
const HIJRI_LABEL = "Ahad, 12 Jumadil Akhir 1448 H";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Jl.%20SMP%203%20Gg.%20Sidodadi%20Indrasari%20Martapura&t=&z=15&ie=UTF8&iwloc=&output=embed";
const MAP_LINK = "https://maps.app.goo.gl/owipS3NdUunXcwwA8";

// Musik latar — isi mis. "/nayla/bg.mp3" bila file sudah tersedia.
const AUDIO_SRC = "";

// Foto — isi path di /public/nayla/ bila sudah tersedia.
const BRIDE_PHOTO = "";
const GROOM_PHOTO = "";
const GALLERY_PHOTOS: string[] = [];

// Foto background section (di-set sebagai CSS variable lewat inline style)
const COVER_PHOTO = "";
const HERO_PHOTO = "";
const CLOSING_PHOTO = "";

// Foto yang ditunggu (preload) sebelum halaman tampil — yang kosong dilewati
const PRELOAD_PHOTOS = [COVER_PHOTO, HERO_PHOTO, BRIDE_PHOTO, GROOM_PHOTO].filter(Boolean);

const cssPhoto = (src: string) => (src ? `url(${src})` : "none");

const BRIDE = {
  name: "Nor Nayla Rizqi",
  order: "Putri Bungsu",
  parents: ["Putri bungsu dari tiga bersaudara", "Bapak Muhammad Sholhan", "& Ibu Nor Anita"],
  home: "Jl. SMP 3 Gg. Sidodadi",
  ig: "https://www.instagram.com/nylaaa.riz",
  igHandle: "@nylaaa.riz",
  photo: BRIDE_PHOTO,
  placeholder: "Foto Nayla",
};
const GROOM = {
  name: "Ahmad Badawi, S.Pd",
  order: "Putra Ketiga",
  parents: ["Putra ketiga dari tiga bersaudara", "Bapak H. Husin Kaderi (Alm)", "& Ibu Sabariah"],
  home: "Jl. SMA 2 Mtp, Komplek Arwana 5",
  ig: "https://www.instagram.com/by_dawi",
  igHandle: "@by_dawi",
  photo: GROOM_PHOTO,
  placeholder: "Foto Dawi",
};

const VENUE_ADDRESS = [
  "Jl. SMP 3 Gg. Sidodadi",
  "Indrasari, Martapura",
  "Kabupaten Banjar, Kalimantan Selatan",
];

const GIFTS = [
  { bank: "BCA — a.n. Nor Nayla Rizqi", number: "7218025550" },
  { bank: "Bank Kalsel — a.n. Ahmad Badawi", number: "2003590968" },
];

// ─── HOOKS ─────────────────────────────────────────────────────────
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

// Preload sekumpulan foto; true bila semua selesai dimuat (atau gagal)
function useImagesReady(srcs: string[]): boolean {
  const [ready, setReady] = useState(srcs.length === 0);
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

function useInView<T extends HTMLElement>(
  threshold = 0.15
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── SMALL COMPONENTS ──────────────────────────────────────────────

const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  d?: 1 | 2 | 3 | 4;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
}> = ({ children, className = "", d, as = "div", style }) => {
  const [ref, visible] = useInView<HTMLElement>(0.15);
  const cls = ["reveal", d ? `d${d}` : "", visible ? "in" : "", className]
    .filter(Boolean)
    .join(" ");
  return React.createElement(as, { ref, className: cls, style }, children);
};

const Ornament: React.FC<{ diamonds?: boolean }> = ({ diamonds }) => (
  <div className="ornament">
    <i />
    {diamonds && <s />}
    <b />
    {diamonds && <s />}
    <i />
  </div>
);

const Corner: React.FC<{ pos: "tl" | "tr" | "bl" | "br" }> = ({ pos }) => (
  <span className={`corner ${pos}`}>
    <span className="l1" />
    <span className="l2" />
    <span className="d" />
  </span>
);

// Warna kelopak bunga hias: emas, emas tua, sage muda
const PC_GOLD = "rgba(217,191,127,.55)";
const PC_GOLD_DEEP = "rgba(184,150,74,.55)";
const PC_SAGE = "rgba(183,201,168,.65)";

const Bloom: React.FC<{
  cls: string;
  s?: number;
  op?: number;
  rot?: number;
  pc?: string;
}> = ({ cls, s = 1, op = 0.8, rot = 0, pc }) => {
  const [ref, visible] = useInView<HTMLSpanElement>(0.1);
  return (
    <span
      ref={ref}
      className={`bloom ${cls}${visible ? " in" : ""}`}
      style={
        {
          "--s": s,
          "--op": op,
          "--rot": `${rot}deg`,
        } as React.CSSProperties
      }
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="petal"
          style={
            { "--a": `${i * 72}deg`, ...(pc ? { background: pc } : {}) } as React.CSSProperties
          }
        />
      ))}
      <span className="core" />
    </span>
  );
};

const IgIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const ImageSlot: React.FC<{
  src?: string;
  alt?: string;
  className?: string;
  placeholder?: string;
  style?: React.CSSProperties;
}> = ({ src, alt = "", className = "", placeholder = "Foto", style }) => (
  <div className={`img-slot ${className}`} style={style}>
    {src ? <img src={src} alt={alt} loading="lazy" /> : <span>{placeholder}</span>}
  </div>
);

type Person = typeof BRIDE;

const CoupleCard: React.FC<{ p: Person; d: 2 | 3 }> = ({ p, d }) => (
  <Reveal className="couple-card" d={d}>
    <div className="photo-wrap">
      <ImageSlot src={p.photo} alt={p.name} className="portrait" placeholder={p.placeholder} />
    </div>
    <div className="nm">{p.name}</div>
    <div className="order">{p.order}</div>
    <p className="parent">
      {p.parents.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < p.parents.length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
    <p className="home">{p.home}</p>
    <a className="ig" href={p.ig} target="_blank" rel="noopener noreferrer">
      <IgIcon />
      {p.igHandle}
    </a>
  </Reveal>
);

const GiftCard: React.FC<{ bank: string; number: string }> = ({ bank, number }) => {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard?.writeText(number).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [number]);
  return (
    <Reveal
      className="gift-card"
      d={2}
      style={{ background: "var(--green)", borderColor: "rgba(217,191,127,.4)" }}
    >
      <span className="bank">{bank}</span>
      <span className="no">{number}</span>
      <span className="an">No. Rekening</span>
      <button className="copy-btn" onClick={copy}>
        {copied ? "Tersalin ✓" : "Salin"}
      </button>
    </Reveal>
  );
};

// ─── MAIN ──────────────────────────────────────────────────────────
export const WeddingPageNaylaDawi: React.FC = () => {
  const [searchParams] = useSearchParams();
  const visitorName = searchParams.get("to") || searchParams.get("kepada") || "Tamu Undangan";

  const [isOpen, setIsOpen] = useState(false);
  const [coverGone, setCoverGone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const photosReady = useImagesReady(PRELOAD_PHOTOS);

  const countdown = useCountdown(WEDDING_DATE.getTime());

  // Daun jatuh di cover (dihitung sekali) — aset daun dipakai bersama /anggi
  const leaves = useMemo(() => {
    const imgs = ["/anggi/leaf-a.png", "/anggi/leaf-b.png"];
    const N = typeof window !== "undefined" && window.innerWidth < 600 ? 16 : 26;
    return Array.from({ length: N }, () => {
      const dur = 7 + Math.random() * 10;
      const r = Math.random();
      const sz = r < 0.5 ? 16 + Math.random() * 12 : r < 0.82 ? 30 + Math.random() * 16 : 48 + Math.random() * 22;
      return {
        left: `${Math.random() * 100}%`,
        duration: `${dur}s`,
        delay: `${-Math.random() * dur}s`,
        size: `${sz}px`,
        sway: `${2.6 + Math.random() * 3}s`,
        innerDelay: `${-Math.random() * 3}s`,
        op: (0.78 + Math.random() * 0.22).toFixed(2),
        img: imgs[Math.floor(Math.random() * imgs.length)],
      };
    });
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = "auto";
    window.scrollTo(0, 0);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
    setTimeout(() => setCoverGone(true), 1100);
  }, []);

  const toggleMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      a.pause();
      setIsPlaying(false);
    }
  }, []);

  // Kunci scroll body sebelum undangan dibuka
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  const Names = (
    <>
      Nayla<span className="amp">&amp;</span>Dawi
    </>
  );

  return (
    <div
      className="nayla-wedding"
      style={
        {
          "--cover-photo": cssPhoto(COVER_PHOTO),
          "--hero-photo": cssPhoto(HERO_PHOTO),
          "--closing-photo": cssPhoto(CLOSING_PHOTO),
        } as React.CSSProperties
      }
    >
      {/* ============ LOADING (preload foto) ============ */}
      {!photosReady && (
        <div className="loader" role="status" aria-label="Memuat">
          <span className="loader-spin" />
        </div>
      )}

      {/* ============ COVER ============ */}
      {!coverGone && (
        <div className={`cover${isOpen ? " lift" : ""}`}>
          <div className="cover-frame" />
          <div className="leaves">
            {leaves.map((l, i) => (
              <span
                key={i}
                className="leaf"
                style={
                  {
                    left: l.left,
                    animationDuration: l.duration,
                    animationDelay: l.delay,
                    "--sz": l.size,
                    "--sway": l.sway,
                  } as React.CSSProperties
                }
              >
                <i
                  style={
                    { "--op": l.op, animationDelay: l.innerDelay } as React.CSSProperties
                  }
                >
                  <img src={l.img} alt="" />
                </i>
              </span>
            ))}
          </div>
          <div className="cover-inner">
            <div className="label reveal in">The Wedding Of</div>
            <h1 className="names reveal in d1">{Names}</h1>
            <div className="reveal in d2">
              <Ornament />
            </div>
            <div className="guest-box reveal in d2">
              <div className="to">Kepada Yth.</div>
              <div className="guest-name">{visitorName}</div>
            </div>
            <button className="btn-open reveal in d3" onClick={handleOpen}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 8l9 6 9-6" />
                <rect x="3" y="5" width="18" height="14" rx="1" />
              </svg>
              Buka Undangan
            </button>
            <a
              className="crafted reveal in d4"
              href="https://dirakhmat.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              by <u> Dirakhmat </u>
            </a>
          </div>
        </div>
      )}

      {/* ============ PAGE ============ */}
      <main className="page">
        {/* OPENING / HERO */}
        <section id="opening" className="band bg-green">
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
          <div className="inner">
            <Reveal as="p" className="bismillah">
              Bismillāhirraḥmānirraḥīm
            </Reveal>
            <Reveal className="label" d={1}>
              The Wedding Of
            </Reveal>
            <Reveal as="h2" className="hero-names" d={1}>
              {Names}
            </Reveal>
            <Reveal d={2}>
              <Ornament />
            </Reveal>
            <Reveal as="p" className="hero-date" d={2}>
              {DATE_LABEL}
            </Reveal>
            <Reveal as="p" className="hijri" d={2}>
              {HIJRI_LABEL}
            </Reveal>
            <Reveal className="countdown" d={3}>
              {[
                { val: countdown.days, unit: "Hari", pad: false },
                { val: countdown.hours, unit: "Jam", pad: true },
                { val: countdown.minutes, unit: "Menit", pad: true },
                { val: countdown.seconds, unit: "Detik", pad: true },
              ].map((c, i) => (
                <div className="cd" key={i}>
                  <b>{c.pad ? String(c.val).padStart(2, "0") : c.val}</b>
                  <span>{c.unit}</span>
                </div>
              ))}
            </Reveal>
            <Reveal d={4}>
              <a className="btn btn-outline" href="#acara">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M3 9h18M8 2v4M16 2v4" />
                </svg>
                Save The Date
              </a>
            </Reveal>
          </div>
          <Bloom cls="b-tl" s={1} rot={-12} pc={PC_GOLD} />
          <Bloom cls="b-br" s={0.7} rot={20} pc={PC_GOLD_DEEP} />
        </section>

        {/* GREETING + QUOTE */}
        <section className="band bg-ivory">
          <div className="inner">
            <Reveal className="label">Assalamu'alaikum Wr. Wb.</Reveal>
            <Reveal d={1}>
              <Ornament diamonds />
            </Reveal>
            <Reveal as="p" className="body-text" d={1}>
              Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud
              menyelenggarakan acara pernikahan putra-putri kami. Suatu kebahagiaan dan
              kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan
              doa restu.
            </Reveal>
            <Reveal d={2} style={{ marginTop: "1rem" }}>
              <p className="h-serif" style={{ fontStyle: "italic", color: "var(--green)" }}>
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan
                hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya,
                dan dijadikan-Nya di antaramu rasa kasih dan sayang."
              </p>
              <p className="label" style={{ marginTop: "1.1rem" }}>
                QS. Ar-Rum : 21
              </p>
            </Reveal>
          </div>
          <Bloom cls="b-tr" s={0.85} rot={14} pc={PC_SAGE} />
          <Bloom cls="b-bl" s={1.05} rot={-8} pc={PC_GOLD} />
        </section>

        {/* COUPLE */}
        <section className="band bg-green">
          <Corner pos="tl" />
          <Corner pos="br" />
          <div className="inner">
            <Reveal className="label">Mempelai</Reveal>
            <Reveal as="h2" className="h-script" d={1}>
              Bride &amp; Groom
            </Reveal>
            <Reveal d={1}>
              <Ornament />
            </Reveal>

            <div className="couple-row" style={{ marginTop: "1rem" }}>
              <CoupleCard p={BRIDE} d={2} />
              <Reveal className="amp-big" d={2}>
                &amp;
              </Reveal>
              <CoupleCard p={GROOM} d={3} />
            </div>
          </div>
          <Bloom cls="b-bl" s={0.75} rot={24} pc={PC_GOLD_DEEP} />
          <Bloom cls="b-tr" s={1} rot={-16} pc={PC_SAGE} />
        </section>

        {/* ACARA */}
        <section id="acara" className="band bg-ivory">
          <div className="inner">
            <Reveal className="label">Waktu &amp; Tempat</Reveal>
            <Reveal as="h2" className="h-script" d={1} style={{ color: "var(--gold)" }}>
              Save The Date
            </Reveal>
            <Reveal className="date-hero" d={1}>
              <div className="col">
                <span>Minggu</span>
                <span>November</span>
              </div>
              <div className="dd">22</div>
              <div className="col">
                <span>2026</span>
                <span>WITA</span>
              </div>
            </Reveal>
            <Reveal as="p" className="hijri" d={1}>
              {HIJRI_LABEL}
            </Reveal>
            <Reveal d={1}>
              <Ornament diamonds />
            </Reveal>

            <div className="events" style={{ marginTop: "1rem" }}>
              <Reveal className="event-card" d={2}>
                <h3>Akad Nikah</h3>
                <p className="when">{DATE_LABEL}</p>
                <p className="time">Pukul 07.00 — 09.00 WITA</p>
              </Reveal>
              <Reveal className="event-card" d={3}>
                <h3>Resepsi</h3>
                <p className="when">{DATE_LABEL}</p>
                <p className="time">Pukul 09.00 WITA — Selesai</p>
              </Reveal>
            </div>

            <Reveal as="p" className="addr" d={3} style={{ marginTop: "1.4rem" }}>
              {VENUE_ADDRESS.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < VENUE_ADDRESS.length - 1 && <br />}
                </React.Fragment>
              ))}
            </Reveal>
          </div>
          <Bloom cls="b-tl" s={1} rot={-12} pc={PC_GOLD} />
          <Bloom cls="b-br" s={0.7} rot={20} pc={PC_GOLD_DEEP} />
        </section>

        {/* LOCATION */}
        <section className="band bg-green">
          <div className="inner">
            <Reveal className="label">Lokasi Acara</Reveal>
            <Reveal as="h2" className="h-script" d={1}>
              Our Location
            </Reveal>
            <Reveal d={1}>
              <Ornament />
            </Reveal>
            <Reveal className="map-frame" d={2}>
              <iframe
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={MAP_EMBED_URL}
                title="Lokasi Acara"
              />
            </Reveal>
            <Reveal d={3}>
              <a className="btn btn-gold" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                Buka Google Maps
              </a>
            </Reveal>
          </div>
          <Bloom cls="b-tr" s={0.85} rot={14} pc={PC_SAGE} />
          <Bloom cls="b-bl" s={1.05} rot={-8} pc={PC_GOLD} />
        </section>

        {/* GALLERY — hanya bila foto sudah diisi */}
        {GALLERY_PHOTOS.length > 0 && (
          <section className="band bg-ivory-2">
            <div className="inner">
              <Reveal className="label">Galeri</Reveal>
              <Reveal as="h2" className="h-script" d={1} style={{ color: "var(--gold)" }}>
                Our Moments
              </Reveal>
              <Reveal d={1}>
                <Ornament diamonds />
              </Reveal>
              <Reveal className="gallery" d={2}>
                {GALLERY_PHOTOS.map((src, i) => (
                  <ImageSlot
                    key={i}
                    src={src}
                    alt={`Galeri ${i + 1}`}
                    className={i === 0 || i === GALLERY_PHOTOS.length - 1 ? "tall" : ""}
                  />
                ))}
              </Reveal>
            </div>
            <Bloom cls="b-bl" s={0.75} rot={24} pc={PC_GOLD_DEEP} />
            <Bloom cls="b-tr" s={1} rot={-16} pc={PC_SAGE} />
          </section>
        )}

        {/* GIFT */}
        <section className="band bg-ivory">
          <div className="inner">
            <Reveal className="label">Tanda Kasih</Reveal>
            <Reveal as="h2" className="h-script" d={1} style={{ color: "var(--gold)" }}>
              Wedding Gift
            </Reveal>
            <Reveal d={1}>
              <Ornament diamonds />
            </Reveal>
            <Reveal as="p" className="body-text" d={1}>
              Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi
              adalah ungkapan tanda kasih, Anda dapat memberikannya secara cashless.
            </Reveal>
            {GIFTS.map((g) => (
              <GiftCard key={g.number} bank={g.bank} number={g.number} />
            ))}
          </div>
          <Bloom cls="b-tl" s={1} rot={-12} pc={PC_GOLD} />
          <Bloom cls="b-br" s={0.7} rot={20} pc={PC_GOLD_DEEP} />
        </section>

        {/* CLOSING */}
        <section id="closing" className="band bg-green">
          <Corner pos="tl" />
          <Corner pos="br" />
          <div className="inner">
            <Reveal as="p" className="thanks">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila
              Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
            </Reveal>
            <Reveal d={1}>
              <Ornament />
            </Reveal>
            <Reveal className="label" d={1}>
              Wassalamu'alaikum Wr. Wb.
            </Reveal>
            <Reveal className="label" d={2} style={{ marginTop: "1.4rem" }}>
              Kami yang berbahagia
            </Reveal>
            <Reveal as="h2" className="hero-names" d={2} style={{ fontSize: "clamp(3rem,13vw,5rem)" }}>
              {Names}
            </Reveal>
            <Reveal as="p" className="body-text" d={3}>
              Beserta keluarga besar
              <br />
              kedua mempelai
            </Reveal>
          </div>
          <Bloom cls="b-tr" s={0.85} rot={14} pc={PC_SAGE} />
          <Bloom cls="b-bl" s={1.05} rot={-8} pc={PC_GOLD} />
        </section>

        <p className="credit">
          Nayla &amp; Dawi · 22 November 2026 · Martapura
          <br />
          <a
            href="https://dirakhmat.app"
            target="_blank"
            rel="noopener noreferrer"
            className="crafted-foot"
          >
            by <u> Dirakhmat </u>
          </a>
        </p>
      </main>

      {/* music — dirender setelah AUDIO_SRC diisi */}
      {AUDIO_SRC && (
        <>
          <audio ref={audioRef} src={AUDIO_SRC} loop preload="none" />
          <button
            className={`music${isOpen ? " show" : ""}${isPlaying ? " playing" : ""}`}
            aria-label="Toggle music"
            onClick={toggleMusic}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 18a3 3 0 11-2-2.83V5l11-2v10.17A3 3 0 1116 16V7.2L9 8.6V18z" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};
