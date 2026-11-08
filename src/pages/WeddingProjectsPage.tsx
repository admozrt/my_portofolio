import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Calendar, MapPin, Moon, Sun } from 'lucide-react';
import { ThemeProvider } from '../components/providers/Theme';
import { SEOHead } from '../components/ui/SEOHead';
import { useTheme } from '../hooks/useTheme';
import { useLang } from '../hooks/useLang';
import { Monogram } from '../components/ui/Monogram';
import { runTransition } from '../components/v2/viewTransition';
import '../components/v2/v2.css';

/**
 * Daftar undangan pernikahan digital, dengan gaya portofolio utama
 * ("blueprint di kertas", kelas v2-).
 *
 * Tiap kartu adalah ponsel yang "mengintip": layarnya menggulir sendiri dari
 * foto sampul ke isi undangan — saat disorot kursor di desktop, atau saat
 * kartu melewati tengah layar di HP. Bagian bawah layar disusun dari data
 * kartu (tanggal, kota, warna aksen), bukan tangkapan layar asli.
 */

interface WeddingEntry {
  id: string;
  names: string;
  date: Date;
  dateLabel: string;
  location: string;
  cover: string;
  href: string;
  accent: string;
  theme: string;
}

const weddings: WeddingEntry[] = [
  {
    id: 'ajie-alya',
    names: 'Ajie & Alya',
    date: new Date('2026-06-07T09:00:00+08:00'),
    dateLabel: '7 Juni 2026',
    location: 'Tapin, Kalimantan Selatan',
    cover: '/ajie/MAL08420-1.jpg',
    href: '/ajie-alya',
    accent: '#D4A574',
    theme: 'Gold Klasik',
  },
  {
    id: 'ilmi-zahra',
    names: 'Ilmi & Zahra',
    date: new Date('2026-07-05T07:30:00+08:00'),
    dateLabel: '5 Juli 2026',
    location: 'Kertak Hanyar, Kalimantan Selatan',
    cover: '/ilmi/cover.jpeg',
    href: '/ilmi-zahra',
    accent: '#D5BB74',
    theme: 'Hitam & Emas',
  },
  {
    id: 'anggi-rezza',
    names: 'Anggi & Rezza',
    date: new Date('2026-07-12T07:00:00+08:00'),
    dateLabel: '12 Juli 2026',
    location: 'Banjarbaru, Kalimantan Selatan',
    cover: '/anggi/IMG_9748.jpeg',
    href: '/anggi-rezza',
    accent: '#2c5ead',
    theme: 'Biru Ivory',
  },
  {
    id: 'tito-wina',
    names: 'Tito & Wina',
    date: new Date('2026-09-13T00:00:00+08:00'),
    dateLabel: '13 September 2026',
    location: 'Banjarbaru, Kalimantan Selatan',
    cover: '/tito/preview.jpg',
    href: '/tito-wina',
    accent: '#6F5C59',
    theme: 'Mauve Gelap',
  },
  {
    id: 'saufi-afifah',
    names: 'Saufi & Afifah',
    date: new Date('2026-09-10T06:30:00+08:00'),
    dateLabel: '10 September 2026',
    location: 'Martapura, Kalimantan Selatan',
    cover: '/saufi/cover.jpg',
    href: '/saufi-afifah',
    accent: '#3E5470',
    theme: 'Negeri Awan',
  },
  {
    id: 'nayla-dawi',
    names: 'Nayla & Dawi',
    date: new Date('2026-11-22T07:00:00+08:00'),
    dateLabel: '22 November 2026',
    location: 'Martapura, Kalimantan Selatan',
    cover: '/nayla/cover.webp',
    href: '/nayla-dawi',
    accent: '#1f45c9',
    theme: 'Biru Putih',
  },
  {
    id: 'dimas-laila',
    names: 'Dimas & Laila',
    date: new Date('2026-12-12T08:00:00+07:00'),
    dateLabel: '12 Desember 2026',
    location: 'Jakarta',
    cover: '/dimas/preview.svg',
    href: '/dimas-laila',
    accent: '#4F46E5',
    theme: 'Smartphone Simulation',
  },
  {
    id: 'arya-sekar',
    names: 'Arya & Sekar',
    date: new Date('2027-05-15T08:00:00+07:00'),
    dateLabel: '15 Mei 2027',
    location: 'Yogyakarta',
    cover: '/arya/preview.svg',
    href: '/arya-sekar',
    accent: '#C9A24B',
    theme: 'Elegan & Personal',
  },
  {
    id: 'reza-kirana',
    names: 'Reza & Kirana',
    date: new Date('2027-08-21T09:00:00+07:00'),
    dateLabel: '21 Agustus 2027',
    location: 'Bandung',
    cover: '/reza/preview.svg',
    href: '/reza-kirana',
    accent: '#FF0000',
    theme: 'Duo Content Creator',
  },
  {
    id: 'bagas-nadira',
    names: 'Bagas & Nadira',
    date: new Date('2027-11-06T09:00:00+07:00'),
    dateLabel: '6 November 2027',
    location: 'Surabaya',
    cover: '/bagas/preview.svg',
    href: '/bagas-nadira',
    accent: '#B8A98A',
    theme: 'Digital Heirloom',
  },
  {
    id: 'wisnu-ratih',
    names: 'Wisnu & Ratih',
    date: new Date('2027-07-24T08:00:00+07:00'),
    dateLabel: '24 Juli 2027',
    location: 'Yogyakarta',
    cover: '/wisnu/preview.svg',
    href: '/wisnu-ratih',
    accent: '#8A7048',
    theme: 'Kidung Jawi',
  },
];

const isUpcoming = (d: Date) => d.getTime() > Date.now();

/* ─── Kartu: ponsel mengintip ────────────────────────────────────── */

const WeddingCard: React.FC<{ entry: WeddingEntry; index: number }> = ({ entry, index }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [peek, setPeek] = useState(false);
  const [shown, setShown] = useState(false);
  const upcoming = isUpcoming(entry.date);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    // Masuk saat pertama terlihat.
    const appear = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          appear.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    appear.observe(el);

    // Layar sentuh: mengintip sendiri saat kartu ada di pita tengah layar.
    let center: IntersectionObserver | null = null;
    if (coarse && !reduce) {
      center = new IntersectionObserver(([e]) => setPeek(e.isIntersecting), {
        rootMargin: '-38% 0px -38% 0px',
      });
      center.observe(el);
    }
    return () => {
      appear.disconnect();
      center?.disconnect();
    };
  }, []);

  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPeek(true);
  };

  return (
    <a
      ref={cardRef}
      href={entry.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`v2-wed${shown ? ' is-shown' : ''}${peek ? ' is-peek' : ''}`}
      style={{ transitionDelay: `${(index % 4) * 70}ms`, ['--wed-accent' as string]: entry.accent }}
      onPointerEnter={onEnter}
      onPointerLeave={() => setPeek(false)}
      aria-label={`Buka undangan ${entry.names}`}
    >
      <div className="v2-wed__sheet">
        <span className="v2-wed__spec" aria-hidden="true">
          9:16 · microsite
        </span>
        <div className="v2-wed__phone" aria-hidden="true">
          <span className="v2-wed__notch" />
          <div className="v2-wed__screen">
            <div className="v2-wed__scroll">
              <div className="v2-wed__cover">
                <img src={entry.cover} alt="" loading="lazy" draggable={false} />
                <span className="v2-wed__cover-names">{entry.names}</span>
              </div>
              <div className="v2-wed__block">
                <span className="v2-wed__label">Akad & Resepsi</span>
                <b>{entry.dateLabel}</b>
                <span>{entry.location}</span>
              </div>
              <div className="v2-wed__block v2-wed__block--tint">
                <span className="v2-wed__label">RSVP</span>
                <i />
                <i />
                <span className="v2-wed__btn">Kirim</span>
              </div>
              <div className="v2-wed__block">
                <span className="v2-wed__label">Ucapan & doa</span>
                <i />
                <i className="is-short" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="v2-wed__meta">
        <div className="v2-wed__top">
          <b className="v2-wed__names">{entry.names}</b>
          <ArrowUpRight size={15} aria-hidden="true" />
        </div>
        <span className="v2-wed__theme">
          <i style={{ background: entry.accent }} aria-hidden="true" />
          {entry.theme}
        </span>
        <span className="v2-wed__row">
          <Calendar size={13} aria-hidden="true" />
          {entry.dateLabel}
        </span>
        <span className="v2-wed__row">
          <MapPin size={13} aria-hidden="true" />
          <span className="v2-wed__trunc">{entry.location}</span>
        </span>
        {upcoming ? (
          <span className="v2-wed__status v2-wed__status--soon">Akan datang</span>
        ) : (
          <span className="v2-live v2-wed__status">
            <i />
            Berjalan
          </span>
        )}
      </div>
    </a>
  );
};

/* ─── Halaman ────────────────────────────────────────────────────── */

const WeddingProjectsContent: React.FC = () => {
  const { t } = useLang();
  const { isDark, toggleTheme } = useTheme();
  const upcoming = weddings.filter((w) => isUpcoming(w.date)).length;
  const cities = new Set(weddings.map((w) => w.location.split(',')[0])).size;

  return (
    <div className="v2-root v2-root--nopen">
      <SEOHead
        data={{
          title: "Undangan Pernikahan Digital - Proyek Adi Rakhmatullah Ma'arif",
          description:
            'Kumpulan microsite undangan pernikahan digital yang dibangun sebagai proyek portofolio, masing-masing dengan tema dan interaksi tersendiri.',
          keywords: ['Undangan Pernikahan Digital', 'Wedding Invitation', 'React', 'Portofolio'],
          author: "Adi Rakhmatullah Ma'arif",
          url: 'https://dirakhmat.app/project-wedding',
          image: 'https://dirakhmat.app/tito/preview.jpg',
          type: 'website',
        }}
      />

      <header className="v2-header">
        <Link to="/" className="v2-header__logo" aria-label="Adi Rakhmatullah Ma'arif">
          <Monogram size={30} />
        </Link>
        <div className="v2-header__tools">
          <Link to="/#projek" className="v2-link-btn">
            <ArrowLeft size={14} aria-hidden="true" /> {t.common.backToPortfolio}
          </Link>
          <button
            type="button"
            className="v2-icon-btn"
            aria-label={isDark ? t.common.toLight : t.common.toDark}
            onClick={(e) =>
              runTransition(
                'theme',
                () => {
                  document.documentElement.classList.toggle('dark', !isDark);
                  toggleTheme();
                },
                { x: e.clientX, y: e.clientY }
              )
            }
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <main className="v2-main">
        <section className="v2-sec v2-wed-head">
          <header className="v2-head">
            <span className="v2-badge v2-badge--bangun">Projek · Undangan digital</span>
            <h1 className="v2-head__title">Undangan Pernikahan Digital</h1>
            <p className="v2-head__intro">
              Setiap pasangan mendapat microsite dengan tema, warna, dan interaksi yang dirancang khusus untuk
              cerita mereka sendiri, bukan template yang dipakai ulang.
            </p>
          </header>
          <dl className="v2-hero__stats v2-wed-stats">
            {[
              [String(weddings.length), 'Undangan'],
              [String(upcoming), 'Akan datang'],
              [String(cities), 'Kota'],
            ].map(([v, l]) => (
              <div key={l}>
                <dd>{v}</dd>
                <dt>{l}</dt>
              </div>
            ))}
          </dl>
          <p className="v2-wed-hint">Arahkan kursor ke ponsel, atau gulir pelan di HP, untuk mengintip isi undangannya.</p>
        </section>

        <div className="v2-wed-grid">
          {weddings.map((entry, i) => (
            <WeddingCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </main>

      <footer className="v2-footer">
        <span>© {new Date().getFullYear()} Adi Rakhmatullah Ma'arif</span>
        <span>{t.v2.footer}</span>
      </footer>
    </div>
  );
};

export const WeddingProjectsPage: React.FC = () => (
  <ThemeProvider>
    <WeddingProjectsContent />
  </ThemeProvider>
);
