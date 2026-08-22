import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import { ThemeProvider } from '../components/providers/Theme';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import { Monogram } from '../components/ui/Monogram';
import { ZineFooter } from '../components/newport/ZineFooter';
import { LIFT } from '../components/newport/motion';
import { SEOHead } from '../components/ui/SEOHead';
import './NewPortPage.css';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
    names: "Ajie & Alya",
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

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function getStatus(date: Date): { label: string; upcoming: boolean } {
  const upcoming = date.getTime() > Date.now();
  return { label: upcoming ? 'Akan Datang' : 'Sudah Berlangsung', upcoming };
}

/** Fixed per position so the wall looks pinned up by hand, not auto-arranged. */
const TILT = [-2, 1.5, -1.2, 1.8, -1.6, 1.1, -0.9, 2, -1.4];

const WeddingCard: React.FC<{ entry: WeddingEntry; index: number }> = ({ entry, index }) => {
  const status = getStatus(entry.date);
  const reduce = useReducedMotion();

  return (
    <motion.div variants={itemVariants} className="h-full">
      <motion.a
        href={entry.href}
        target="_blank"
        rel="noopener noreferrer"
        animate={{ rotate: reduce ? 0 : TILT[index % TILT.length] }}
        whileHover={reduce ? undefined : { rotate: 0, scale: 1.03 }}
        transition={LIFT}
        className="relative flex h-full flex-col border border-zine-rule bg-zine-card px-2.5 pb-3 pt-4 no-underline shadow-[0_3px_0_rgba(31,30,28,0.06)] transition-shadow duration-500 hover:shadow-[0_14px_28px_-16px_rgba(31,30,28,0.55)] dark:border-zine-rule-dark dark:bg-zine-card-dark dark:shadow-[0_3px_0_rgba(0,0,0,0.25)]"
      >
        <span className={`np-tape ${index % 2 === 1 ? 'np-tape--cool' : ''}`} aria-hidden="true" />
        {index % 3 === 0 && <span className="np-pin" aria-hidden="true" />}

        <span className="block overflow-hidden">
          <img
            src={entry.cover}
            alt={`Undangan ${entry.names}`}
            loading="lazy"
            draggable={false}
            className="block aspect-[4/5] w-full object-cover"
          />
        </span>

        <span className="np-hand mt-2.5 block text-[17px] text-zine-ink dark:text-zine-ink-dark sm:text-[19px]">
          {entry.names}
        </span>

        <span className="mt-1 flex items-center gap-1.5">
          <span
            className="h-2 w-2 shrink-0 ring-1 ring-black/10"
            style={{ backgroundColor: entry.accent }}
            aria-hidden="true"
          />
          <span className="truncate text-[11.5px] text-zine-ink-soft dark:text-zine-ink-soft-dark">
            {entry.theme}
          </span>
        </span>

        <span className="mt-2 block space-y-1 text-[11.5px] text-zine-ink-soft dark:text-zine-ink-soft-dark">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 shrink-0" />
            {entry.dateLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{entry.location}</span>
          </span>
        </span>

        <span className="mt-auto flex items-center justify-between border-t border-dashed border-zine-rule pt-2.5 dark:border-zine-rule-dark">
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-zine-ink-soft dark:text-zine-ink-soft-dark">
            {status.label}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-zine-pen dark:text-zine-pen-dark" />
        </span>
      </motion.a>
    </motion.div>
  );
};

export const WeddingProjectsPage: React.FC = () => {
  return (
    <ThemeProvider>
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

      <div className="np-paper min-h-[100dvh] overflow-x-hidden bg-zine-paper font-sans text-zine-ink transition-colors duration-200 dark:bg-zine-paper-dark dark:text-zine-ink-dark">
        <header className="sticky top-0 z-40 border-b border-zine-rule/70 bg-zine-paper/85 backdrop-blur-md dark:border-zine-rule-dark/70 dark:bg-zine-paper-dark/85">
          <div className="flex h-14 items-center justify-between px-5 sm:h-16 sm:px-8 lg:px-12">
            <Link to="/" className="flex items-center gap-2.5">
              <Monogram size={30} strokeClassName="stroke-zine-paper dark:stroke-zine-paper-dark" />
              <span className="hidden text-[13px] font-medium sm:block">Adi R. Ma'arif</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zine-ink-soft transition-colors hover:text-zine-pen dark:text-zine-ink-soft-dark dark:hover:text-zine-pen-dark"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Kembali ke Portofolio</span>
                <span className="sm:hidden">Kembali</span>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="px-5 py-12 sm:px-8 sm:py-20 lg:px-12">
          <motion.div
            className="mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h1 className="np-hand text-[30px] leading-tight text-zine-ink dark:text-zine-ink-dark sm:text-[44px]">
              Undangan Pernikahan Digital
            </h1>
            <p className="mt-3 text-[13.5px] leading-relaxed text-zine-ink-soft dark:text-zine-ink-soft-dark sm:text-[14.5px]">
              Setiap pasangan mendapat microsite dengan tema, warna, dan interaksi yang dirancang
              khusus untuk cerita mereka sendiri, bukan template yang dipakai ulang.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {weddings.map((entry, i) => (
              <WeddingCard key={entry.id} entry={entry} index={i} />
            ))}
          </motion.div>
        </main>

        <ZineFooter />
      </div>
    </ThemeProvider>
  );
};
