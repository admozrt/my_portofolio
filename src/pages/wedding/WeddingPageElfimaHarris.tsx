import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import './WeddingPageElfimaHarris.css';

/*
  Undangan Elfima & Harris — diterjemahkan dari desain Claude Design
  "Undangan Pernikahan". Desain aslinya hanya kolom ponsel (maks 440px);
  di sini dibuat mobile-first lalu melebar:

    < 768px   persis desain: satu kolom penuh layar, gulir per section.
    768-1199  kolom 640px di tengah di atas latar pemandangan buram; blok
              mempelai, acara, dan ucapan berdampingan.
    >= 1200   layar dibagi: panel pemandangan tetap di kiri (nama, tanggal,
              hitung mundur), undangan bergulir di kanan.

  Sampul selalu layar penuh. Semua aset di public/elfima/.
*/

/* ─── CONFIG ──────────────────────────────────────────────────────── */

/* Kudus = WIB (UTC+7). */
const WEDDING_DATE = new Date('2026-12-12T09:00:00+07:00');

const BRIDE_FIRST = 'Elfima';
const GROOM_FIRST = 'Harris';
const BRIDE_FULL = 'dr. Elfima Aditya Utami';
const GROOM_FULL = 'Muhammad Harris, S.H';
const BRIDE_PARENTS = ['Putri kedua dari', 'Bapak Drs. Supriyadi M.Pd (alm)', '& Dra. Sri Mulyati'];
const GROOM_PARENTS = ['Putra kedua dari', 'Bapak & Ibu Hj. Siti Aminah', 'Sembiring, S.Pd.I'];

/* Isi tanpa "@". Kosong = tombol Instagram disembunyikan; desain aslinya
   masih menautkan ke instagram.com, yang tidak berguna bagi tamu. */
const BRIDE_IG = '';
const GROOM_IG = '';

const DATE_LABEL = 'Sabtu, 12 Desember 2026';
const DATE_SHORT = '12 · 12 · 2026';

const VENUE_NAME = 'Griphta Hotel';
const VENUE_ADDRESS = ['Jl. AKBP R. Agil Kusumadya No. 100,', 'Jatimakmur Jati Wetan, Kec. Jati, Kudus'];
const MAP_LINK = 'https://maps.google.com/?q=Griphta+Hotel+Kudus';
const MAP_EMBED_URL = 'https://maps.google.com/maps?q=Griphta%20Hotel%20Kudus&z=15&output=embed';

const EVENTS = [
  {
    name: 'Akad Nikah',
    time: 'Pukul 09.00 WIB – selesai',
    /* 09.00–11.00 WIB = 02.00–04.00 UTC; kalender wajib punya jam selesai. */
    calendar:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Akad%20Nikah%20Elfima%20%26%20Harris&dates=20261212T020000Z/20261212T040000Z&location=Griphta%20Hotel%20Kudus',
  },
  {
    name: 'Resepsi',
    time: 'Pukul 11.00 – 14.00 WIB',
    calendar:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Resepsi%20Elfima%20%26%20Harris&dates=20261212T040000Z/20261212T070000Z&location=Griphta%20Hotel%20Kudus',
  },
];

const FAMILY = [
  { side: 'Pihak Laki-laki', names: ['Dimas Vidiawan (Kakek)', 'Rizky Davidianto (Paman)', 'Fahri Ovidianto (Paman)', 'Reza Vidiano (Abang)'] },
  {
    side: 'Pihak Wanita',
    names: ['Arif Ovidianto (Abang)', 'Inviana Adinda (Kakak)', 'Inviani Rahayu (Kakak)', 'Ratna Invinara Desi (Tante)', 'Ani Invika Utari (Bunde)'],
  },
];

/*
  Backend RSVP dan ucapan: Google Apps Script Web App, pola yang sama dengan
  WeddingPageSaufiAfifah.tsx. Kosong = mode demo: form tetap jalan, ucapan
  hanya tampil di layar tamu itu dan hilang saat halaman dimuat ulang.

  WAJIB endpoint milik pasangan ini sendiri — memakai endpoint undangan lain
  mencampur data dua pernikahan ke satu spreadsheet.
*/
const SHEETS_ENDPOINT = '';

const SEED_WISHES: Wish[] = [
  { nama: 'Nadia Putri', status: 'Hadir', pesan: 'Selamat menempuh hidup baru, semoga sakinah mawaddah warahmah.', time: 0 },
  { nama: 'Raka & Sinta', status: 'Hadir', pesan: 'Barakallahu lakuma. Bahagia selalu untuk kalian berdua.', time: 0 },
];

const ATTEND = ['Hadir', 'Tidak Hadir', 'Masih Ragu'] as const;
const ATTEND_SHORT = ['Hadir', 'Tidak Hadir', 'Ragu'];
const NAV = ['Pembuka', 'Mempelai', 'Acara', 'Waktu', 'Lokasi', 'Ucapan', 'Keluarga', 'Penutup'];

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@400;500&display=swap';

const EO = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EIO = 'cubic-bezier(0.77, 0, 0.175, 1)';
type Corner = 'tl' | 'tr' | 'bl' | 'br';
const CORNERS: Corner[] = ['tl', 'tr', 'bl', 'br'];
const DIRS: Record<Corner, [number, number]> = { tl: [-1, -1], tr: [1, -1], bl: [-1, 1], br: [1, 1] };

/* ─── DATA RSVP ───────────────────────────────────────────────────── */

interface Wish {
  nama: string;
  pesan: string;
  status: string;
  time: number;
}

/* no-cors + text/plain = "simple request", tanpa preflight yang tidak
   dijawab Apps Script. Jawabannya tidak bisa dibaca, jadi berhasil berarti
   "terkirim tanpa melempar". */
async function submitToSheet(payload: Record<string, string>): Promise<boolean> {
  if (!SHEETS_ENDPOINT) return true;
  try {
    await fetch(SHEETS_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return true;
  } catch {
    return false;
  }
}

async function fetchWishes(): Promise<Wish[] | null> {
  if (!SHEETS_ENDPOINT) return null;
  try {
    const res = await fetch(SHEETS_ENDPOINT, { method: 'GET' });
    const data = await res.json();
    if (!data || !Array.isArray(data.ucapan)) return null;
    return data.ucapan.map((u: { nama: string; pesan: string; kehadiran?: string; time: string }) => ({
      nama: u.nama,
      pesan: u.pesan,
      status: u.kehadiran || '',
      time: new Date(u.time).getTime() || Date.now(),
    }));
  } catch {
    return null;
  }
}

const pad = (n: number) => String(n).padStart(2, '0');

function countdown(now: number) {
  const left = Math.max(0, WEDDING_DATE.getTime() - now);
  return {
    d: pad(Math.floor(left / 864e5)),
    h: pad(Math.floor(left / 36e5) % 24),
    m: pad(Math.floor(left / 6e4) % 60),
    s: pad(Math.floor(left / 1e3) % 60),
  };
}

/* ─── POTONGAN KECIL ──────────────────────────────────────────────── */

const Credit: React.FC<{ className?: string }> = ({ className = '' }) => (
  <a className={`eh-credit ${className}`} href="https://dirakhmat.app" target="_blank" rel="noopener noreferrer">
    by <u>Dirakhmat</u>
  </a>
);

/* Bunga sudut. `data` membedakan sampul (cv), kolom undangan (mf), dan panel
   desktop (as) supaya animasinya bisa dipilih per kelompok. */
const Flowers: React.FC<{ group: 'cv' | 'mf' | 'as' }> = ({ group }) => (
  <>
    {CORNERS.map((k) => (
      <div key={k} className={`eh-fl eh-fl--${k} eh-fl--${group}`} data-fl={`${group}-${k}`} aria-hidden="true">
        <img data-sway={k} src={`/elfima/fl-${k}.png`} alt="" draggable={false} />
      </div>
    ))}
  </>
);

/* ─── KOMPONEN ────────────────────────────────────────────────────── */

export const WeddingPageElfimaHarris: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wishListRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef(false);
  const reduceRef = useRef(false);

  const [coverVisible, setCoverVisible] = useState(true);
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const [nama, setNama] = useState('');
  const [pesan, setPesan] = useState('');
  const [attend, setAttend] = useState(0);
  const [kirim, setKirim] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [wishes, setWishes] = useState<Wish[]>(SEED_WISHES);

  const guest = useMemo(() => {
    const p = new URLSearchParams(window.location.search).get('to');
    return p && p.trim() ? p.trim() : 'Bapak/Ibu/Saudara/i';
  }, []);

  const q = useCallback(
    <T extends HTMLElement = HTMLElement>(sel: string) =>
      Array.from(rootRef.current ? rootRef.current.querySelectorAll<T>(sel) : []),
    []
  );

  /* ── Font, hitung mundur, data ucapan ── */
  useEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONTS_HREF;
    document.head.appendChild(link);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    fetchWishes().then((list) => list && list.length && setWishes(list));
    return () => {
      link.remove();
      clearInterval(timer);
    };
  }, []);

  /* ── Animasi masuk ── */

  const sway = useCallback(() => {
    if (reduceRef.current) return;
    q<HTMLImageElement>('[data-sway]').forEach((el, i) => {
      if (el.dataset.swaying) return;
      el.dataset.swaying = '1';
      const [dx] = DIRS[el.dataset.sway as Corner];
      el.animate(
        [{ transform: 'rotate(0deg) scale(1)' }, { transform: `rotate(${dx * -1.8}deg) scale(1.025)` }],
        { duration: 5200 + (i % 4) * 900, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out', delay: -(i * 700) }
      );
    });
  }, [q]);

  const reveal = useCallback((el: HTMLElement, delay: number) => {
    if (reduceRef.current) {
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: Math.min(delay, 300), fill: 'both' });
      return;
    }
    if (el.dataset.r === 'write' || el.dataset.ct === 'write') {
      el.animate(
        [
          { clipPath: 'inset(-20% 100% -20% 0)', opacity: 0.3, filter: 'blur(2px)' },
          { clipPath: 'inset(-20% 0% -20% 0)', opacity: 1, filter: 'blur(0px)' },
        ],
        { duration: 1500, delay, easing: EIO, fill: 'both' }
      );
    } else {
      el.animate(
        [
          { opacity: 0, transform: 'translateY(14px)', filter: 'blur(6px)' },
          { opacity: 1, transform: 'none', filter: 'blur(0px)' },
        ],
        { duration: 900, delay, easing: EO, fill: 'both' }
      );
    }
  }, []);

  /* Sampul: pemandangan mendekat dari buram, bunga masuk dari luar layar,
     lalu teks muncul satu per satu. */
  useEffect(() => {
    const r = reduceRef.current;
    const raf = requestAnimationFrame(() => {
      sway();
      q('[data-cv="scene"]').forEach((el) =>
        el.animate(
          [
            { transform: 'scale(1.16)', filter: 'blur(10px)', opacity: 0.5 },
            { transform: 'scale(1)', filter: 'blur(0px)', opacity: 1 },
          ],
          { duration: r ? 400 : 2600, easing: EO, fill: 'both' }
        )
      );
      CORNERS.forEach((k, i) => {
        const [x, y] = DIRS[k];
        q(`[data-fl="cv-${k}"]`).forEach((el) =>
          el.animate(
            [
              { transform: `translate(${x * 28}%, ${y * 22}%) rotate(${x * y * 9}deg) scale(.92)`, opacity: 0, filter: 'blur(6px)' },
              { transform: 'none', opacity: 1, filter: 'blur(0px)' },
            ],
            { duration: r ? 300 : 1900, delay: r ? 0 : 350 + i * 150, easing: EO, fill: 'both' }
          )
        );
      });
      q('[data-ct]').forEach((el, i) => reveal(el, 1100 + i * 110));
    });
    return () => cancelAnimationFrame(raf);
  }, [q, reveal, sway]);

  /* Section undangan: tiap elemen [data-r] muncul saat section-nya masuk layar. */
  useEffect(() => {
    if (!opened) return;
    const sc = scrollRef.current;
    if (!sc) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const target = e.target as HTMLElement;
          if (!e.isIntersecting || target.dataset.revealed) return;
          target.dataset.revealed = '1';
          Array.from(target.querySelectorAll<HTMLElement>('[data-r]')).forEach((el, i) => reveal(el, 80 + i * 80));
        }),
      { root: sc, threshold: 0.25 }
    );
    q('[data-sec]').forEach((s) => io.observe(s));
    sway();
    return () => io.disconnect();
  }, [opened, q, reveal, sway]);

  const open = () => {
    if (openingRef.current) return;
    openingRef.current = true;
    const r = reduceRef.current;
    const D = r ? 400 : 1500;
    q('[data-cv="text"]').forEach((el) =>
      el.animate(
        [
          { opacity: 1, transform: 'none', filter: 'blur(0px)' },
          { opacity: 0, transform: 'translateY(-12px)', filter: 'blur(6px)' },
        ],
        { duration: 380, easing: EO, fill: 'forwards' }
      )
    );
    CORNERS.forEach((k) => {
      const [x, y] = DIRS[k];
      q(`[data-fl="cv-${k}"]`).forEach((el) =>
        el.animate(
          [{ transform: 'none' }, { transform: `translate(${x * 75}%, ${y * 55}%) rotate(${x * y * 14}deg) scale(1.15)` }],
          { duration: r ? 300 : 1300, easing: EIO, fill: 'forwards' }
        )
      );
    });
    q('[data-cv="scene"]').forEach((el) =>
      el.animate(
        [
          { transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' },
          { transform: 'scale(2.4)', opacity: 0, filter: 'blur(4px)' },
        ],
        { duration: r ? 300 : 1450, easing: EIO, fill: 'forwards' }
      )
    );
    q('[data-cv="root"]').forEach((el) =>
      el.animate(
        [
          { backgroundColor: '#f6e1db', opacity: 1 },
          { backgroundColor: 'rgba(251,243,239,0)', opacity: 1, offset: 0.7 },
          { backgroundColor: 'rgba(251,243,239,0)', opacity: 0 },
        ],
        { duration: D, easing: 'ease', fill: 'forwards' }
      )
    );
    /* Bunga di kolom undangan dan panel desktop masuk menggantikan bunga sampul. */
    CORNERS.forEach((k, i) => {
      const [x, y] = DIRS[k];
      q(`[data-fl="mf-${k}"], [data-fl="as-${k}"]`).forEach((el) =>
        el.animate(
          [
            { transform: `translate(${x * 30}%, ${y * 24}%) rotate(${x * y * 8}deg) scale(.9)`, opacity: 0 },
            { transform: 'none', opacity: 1 },
          ],
          { duration: r ? 300 : 1700, delay: r ? 0 : 650 + i * 120, easing: EO, fill: 'backwards' }
        )
      );
    });
    setOpened(true);
    window.setTimeout(() => setCoverVisible(false), D);
  };

  /* ── Navigasi section ── */

  const onScroll = () => {
    const sc = scrollRef.current;
    if (!sc) return;
    const mid = sc.scrollTop + sc.clientHeight * 0.45;
    let a = 0;
    q('[data-sec]').forEach((s, i) => {
      if (s.offsetTop <= mid) a = i;
    });
    if (a !== active) setActive(a);
  };

  const go = (i: number) => {
    const sc = scrollRef.current;
    const s = q('[data-sec]')[i];
    if (!sc || !s) return;
    sc.scrollTo({ top: s.offsetTop, behavior: reduceRef.current ? 'auto' : 'smooth' });
  };

  /* ── Ucapan & RSVP ── */

  const submitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !pesan.trim() || kirim === 'sending') return;
    setKirim('sending');
    const item: Wish = { nama: nama.trim(), pesan: pesan.trim(), status: ATTEND[attend], time: Date.now() };
    const results = await Promise.all([
      submitToSheet({ type: 'rsvp', nama: item.nama, kehadiran: item.status, jumlah: attend === 1 ? '0' : '1', pesan: item.pesan }),
      submitToSheet({ type: 'ucapan', nama: item.nama, pesan: item.pesan, kehadiran: item.status }),
    ]);
    if (!results.every(Boolean)) {
      setKirim('error');
      return;
    }
    setWishes((prev) => [item, ...prev]);
    setNama('');
    setPesan('');
    setKirim('done');
    requestAnimationFrame(() => {
      const list = wishListRef.current;
      if (!list) return;
      list.scrollTop = 0;
      list.firstElementChild?.animate(
        [
          { opacity: 0, transform: 'translateY(-8px) scale(.98)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 420, easing: EO }
      );
    });
  };

  /* Kelopak jatuh: posisi acak dibuat sekali, tidak berubah tiap render. */
  const petals = useMemo(() => {
    const cols = [
      ['#f6c4cd', '#d97a90'],
      ['#fbe2e2', '#e7a3b1'],
      ['#f1b3c0', '#c25f78'],
    ];
    return Array.from({ length: 16 }, (_, i) => {
      const s = 9 + Math.random() * 9;
      const c = cols[i % 3];
      const dur = 11 + Math.random() * 10;
      return {
        left: `${Math.random() * 100}%`,
        width: s,
        height: s * 1.25,
        background: `linear-gradient(135deg, ${c[0]}, ${c[1]})`,
        opacity: 0.55 + Math.random() * 0.3,
        '--dx': `${(Math.random() - 0.5) * 140}px`,
        animation: `eh-petal ${dur}s linear ${-Math.random() * dur}s infinite`,
      } as React.CSSProperties;
    });
  }, []);

  const cd = countdown(now);
  const cdItems: [string, string][] = [
    [cd.d, 'Hari'],
    [cd.h, 'Jam'],
    [cd.m, 'Menit'],
    [cd.s, 'Detik'],
  ];

  return (
    <>
      <SEOHead
        data={{
          title: `Undangan Pernikahan ${BRIDE_FIRST} & ${GROOM_FIRST}`,
          description: `Dengan memohon rahmat Allah, kami mengundang Anda di hari bahagia kami. ${DATE_LABEL}, ${VENUE_NAME}, Kudus.`,
          keywords: [
            'Undangan Pernikahan Digital',
            `${BRIDE_FULL} & ${GROOM_FULL}`,
            'Elfima Harris',
            'Pernikahan Kudus',
            'Griphta Hotel',
            '12 Desember 2026',
          ],
          author: "Adi Rakhmatullah Ma'arif",
          url: 'https://dirakhmat.app/elfima-harris',
          image: 'https://dirakhmat.app/elfima/preview.jpg',
          type: 'website',
          schemaType: 'Event',
          event: {
            startDate: '2026-12-12T09:00:00+07:00',
            endDate: '2026-12-12T14:00:00+07:00',
            locationName: VENUE_NAME,
            streetAddress: 'Jl. AKBP R. Agil Kusumadya No. 100, Jatimakmur Jati Wetan',
            locality: 'Kec. Jati, Kudus',
            region: 'Jawa Tengah',
            organizers: [BRIDE_FULL, GROOM_FULL],
          },
        }}
      />

      {/* Gambar dari public/ dialirkan lewat variabel CSS: url() absolut di
          berkas CSS akan dicoba di-bundle oleh webpack CRA dan gagal. */}
      <div
        ref={rootRef}
        className={`eh-root${opened ? ' is-open' : ''}`}
        style={{ '--eh-scene': "url('/elfima/scene.jpg')" } as React.CSSProperties}
      >
        {/* Latar pemandangan buram — terlihat di tablet & desktop di luar kolom. */}
        <div className="eh-backdrop" aria-hidden="true" />

        {/* ── Panel kiri desktop ── */}
        <aside className="eh-aside" aria-hidden={!opened}>
          {/* Bunga di dalam bingkai pemandangan supaya posisinya tepat menimpa
              bunga yang tergambar di pemandangan itu sendiri. */}
          <div className="eh-aside__scene">
            <Flowers group="as" />
          </div>
          <div className="eh-aside__text">
            <div className="eh-kicker">The Wedding of</div>
            <div className="eh-aside__names">
              {BRIDE_FIRST}
              <span>&amp;</span>
              {GROOM_FIRST}
            </div>
            <div className="eh-aside__date">{DATE_SHORT}</div>
            <div className="eh-aside__cd">
              {cdItems.map(([v, l]) => (
                <div key={l}>
                  <b>{v}</b>
                  <span>{l}</span>
                </div>
              ))}
            </div>
            <div className="eh-aside__guest">
              <span>Kepada Yth.</span>
              {guest}
            </div>
          </div>
        </aside>

        {/* ── Kolom undangan ── */}
        <main className="eh-col">
          <div className="eh-col__bg" aria-hidden="true" />
          <Flowers group="mf" />
          <div className="eh-col__veil" aria-hidden="true" />

          <div
            ref={scrollRef}
            className="eh-scroll"
            onScroll={onScroll}
            style={{ overflowY: opened ? 'auto' : 'hidden' }}
          >
            <section data-sec="0" className="eh-sec eh-sec--narrow" aria-label="Pembuka">
              <div data-r="" className="eh-kicker">Bismillahirrahmanirrahim</div>
              <div data-r="" className="eh-rule" />
              <p data-r="" className="eh-quote">
                “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu
                sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”
              </p>
              <div data-r="" className="eh-cite">QS. Ar-Rum : 21</div>
            </section>

            <section data-sec="1" className="eh-sec" aria-label="Mempelai">
              <div data-r="" className="eh-kicker">Bride &amp; Groom</div>
              <div className="eh-couple">
                <div className="eh-person">
                  <div data-r="write" className="eh-script eh-script--name">{BRIDE_FULL}</div>
                  <p data-r="" className="eh-small">
                    {BRIDE_PARENTS.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </p>
                  {BRIDE_IG && (
                    <a data-r="" className="eh-btn" href={`https://instagram.com/${BRIDE_IG}`} target="_blank" rel="noopener noreferrer">
                      @{BRIDE_IG}
                    </a>
                  )}
                </div>
                <div data-r="" className="eh-amp" aria-hidden="true">&amp;</div>
                <div className="eh-person">
                  <div data-r="write" className="eh-script eh-script--name">{GROOM_FULL}</div>
                  <p data-r="" className="eh-small">
                    {GROOM_PARENTS.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </p>
                  {GROOM_IG && (
                    <a data-r="" className="eh-btn" href={`https://instagram.com/${GROOM_IG}`} target="_blank" rel="noopener noreferrer">
                      @{GROOM_IG}
                    </a>
                  )}
                </div>
              </div>
            </section>

            <section data-sec="2" className="eh-sec" aria-label="Acara">
              <div className="eh-events">
                {EVENTS.map((ev, i) => (
                  <div key={ev.name} className="eh-event">
                    {i > 0 && <div data-r="" className="eh-rule eh-event__sep" />}
                    <div data-r="write" className="eh-script eh-script--title">{ev.name}</div>
                    <div data-r="" className="eh-event__info">
                      <div className="eh-event__date">{DATE_LABEL}</div>
                      <div>{ev.time}</div>
                      <div className="eh-muted">{VENUE_NAME}, Kudus</div>
                    </div>
                    <a data-r="" className="eh-btn eh-btn--ghost" href={ev.calendar} target="_blank" rel="noopener noreferrer">
                      Tambah ke Kalender
                    </a>
                  </div>
                ))}
              </div>
            </section>

            <section data-sec="3" className="eh-sec" aria-label="Hitung mundur">
              <div data-r="write" className="eh-script eh-script--title">Menghitung Hari</div>
              <div data-r="" className="eh-cd" role="timer" aria-live="off">
                {cdItems.map(([v, l]) => (
                  <div key={l} className="eh-cd__box">
                    <b>{v}</b>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
              <p data-r="" className="eh-quote eh-quote--sm">Menuju hari bahagia kami, {DATE_LABEL}.</p>
            </section>

            <section data-sec="4" className="eh-sec" aria-label="Lokasi">
              <div data-r="write" className="eh-script eh-script--title">Lokasi Acara</div>
              <div data-r="" className="eh-map">
                <iframe title="Peta lokasi Griphta Hotel Kudus" src={MAP_EMBED_URL} loading="lazy" />
              </div>
              <div data-r="" className="eh-venue">{VENUE_NAME}</div>
              <p data-r="" className="eh-small">
                {VENUE_ADDRESS.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </p>
              <a data-r="" className="eh-btn" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
                Petunjuk ke Lokasi
              </a>
            </section>

            <section data-sec="5" className="eh-sec" aria-label="Ucapan dan doa">
              <div data-r="write" className="eh-script eh-script--title">Ucapan &amp; Doa</div>
              <p data-r="" className="eh-small">Kirim ucapan untuk mempelai dan konfirmasi kehadiran.</p>
              <div className="eh-wish">
                <form data-r="" className="eh-form" onSubmit={submitWish}>
                  <input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Nama"
                    aria-label="Nama"
                    maxLength={60}
                    required
                  />
                  <textarea
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    placeholder="Ucapan & doa"
                    aria-label="Ucapan dan doa"
                    rows={3}
                    maxLength={500}
                    required
                  />
                  <div className="eh-attend" role="radiogroup" aria-label="Kehadiran">
                    {ATTEND_SHORT.map((label, i) => (
                      <button
                        key={label}
                        type="button"
                        role="radio"
                        aria-checked={attend === i}
                        className={attend === i ? 'is-on' : ''}
                        onClick={() => setAttend(i)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <button type="submit" className="eh-btn eh-btn--block" disabled={kirim === 'sending'}>
                    {kirim === 'sending' ? 'Mengirim…' : 'Kirim Ucapan'}
                  </button>
                  {kirim === 'done' && <div className="eh-note">Terima kasih, ucapan Anda sudah terkirim.</div>}
                  {kirim === 'error' && <div className="eh-note eh-note--err">Gagal terkirim. Periksa koneksi lalu coba lagi.</div>}
                </form>
                <div data-r="" ref={wishListRef} className="eh-wishes" aria-label="Daftar ucapan">
                  {wishes.map((w, i) => (
                    <div key={`${w.nama}-${w.time}-${i}`} className="eh-wishes__item">
                      <div className="eh-wishes__head">
                        <span>{w.nama}</span>
                        {w.status && <span className="eh-wishes__status">{w.status}</span>}
                      </div>
                      <div className="eh-wishes__msg">{w.pesan}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section data-sec="6" className="eh-sec" aria-label="Turut mengundang">
              <div data-r="write" className="eh-script eh-script--title">Turut Mengundang</div>
              <div className="eh-family">
                {FAMILY.map((f) => (
                  <div key={f.side} className="eh-family__col">
                    <div data-r="" className="eh-family__side">{f.side}</div>
                    <div data-r="" className="eh-family__names">
                      {f.names.map((n) => (
                        <div key={n}>{n}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section data-sec="7" className="eh-sec eh-sec--narrow" aria-label="Penutup">
              <p data-r="" className="eh-quote">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan
                memberikan doa restu.
              </p>
              <div data-r="" className="eh-cite">Kami yang berbahagia</div>
              <div data-r="write" className="eh-script eh-script--closing">
                {BRIDE_FIRST} &amp; {GROOM_FIRST}
              </div>
              <div data-r="" className="eh-kicker">Terima Kasih</div>
              <Credit className="eh-credit--end" />
            </section>
          </div>

          <nav className="eh-nav" aria-label="Bagian undangan">
            {NAV.map((label, i) => (
              <button
                key={label}
                type="button"
                className={i === active ? 'is-on' : ''}
                aria-current={i === active ? 'true' : undefined}
                onClick={() => go(i)}
              >
                <span className="eh-nav__dot" aria-hidden="true" />
                <span className="eh-nav__label">{label}</span>
              </button>
            ))}
          </nav>

          <div className="eh-petals" aria-hidden="true">
            {petals.map((style, i) => (
              <div key={i} className="eh-petal" style={style} />
            ))}
          </div>
        </main>

        {/* ── Sampul ── */}
        {coverVisible && (
          <div data-cv="root" className="eh-cover">
            <div className="eh-cover__backdrop" aria-hidden="true" />
            <div className="eh-cover__stage" aria-hidden="true">
              <img data-cv="scene" className="eh-cover__scene" src="/elfima/scene.jpg" alt="" draggable={false} />
              <Flowers group="cv" />
            </div>
            <div className="eh-cover__content">
              <div data-cv="text" className="eh-cover__block">
                <div className="eh-cover__glow" />
                <div data-ct="" className="eh-kicker">The Wedding of</div>
                <h1 className="eh-cover__names">
                  <span data-ct="write">{BRIDE_FIRST}</span>
                  <span data-ct="" className="eh-cover__amp">&amp;</span>
                  <span data-ct="write">{GROOM_FIRST}</span>
                </h1>
                <div data-ct="" className="eh-cover__date">{DATE_SHORT}</div>
              </div>
              <div data-cv="text" className="eh-cover__block eh-cover__block--guest">
                <div className="eh-cover__glow eh-cover__glow--sm" />
                <div data-ct="" className="eh-cover__to">Kepada Yth.</div>
                <div data-ct="" className="eh-cover__guest">{guest}</div>
                <button data-ct="" type="button" className="eh-btn eh-btn--cta" onClick={open}>
                  Buka Undangan
                </button>
              </div>
            </div>
            <Credit className="eh-credit--cover" />
          </div>
        )}
      </div>
    </>
  );
};

export default WeddingPageElfimaHarris;
