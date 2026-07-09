import React from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import { ThemeProvider } from '../components/providers/Theme';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import { Monogram } from '../components/ui/Monogram';
import { Footer } from '../components/layout/Footer';
import { SEOHead } from '../components/ui/SEOHead';

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

const WeddingCard: React.FC<{ entry: WeddingEntry; offset: boolean }> = ({ entry, offset }) => {
  const status = getStatus(entry.date);
  return (
    <motion.a
      href={entry.href}
      target="_blank"
      rel="noopener noreferrer"
      variants={itemVariants}
      className={`group relative block overflow-hidden rounded-card bg-zinc-100 dark:bg-zinc-900 ${offset ? 'md:mt-10' : ''}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="aspect-[4/5] w-full overflow-hidden">
        <img
          src={entry.cover}
          alt={`Foto undangan ${entry.names}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      </div>

      <span
        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-medium backdrop-blur-md ${
          status.upcoming
            ? 'bg-ops-600/90 dark:bg-ops-500/90 text-white'
            : 'bg-white/85 text-zinc-700 dark:bg-zinc-950/70 dark:text-zinc-200'
        }`}
      >
        {status.label}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full ring-1 ring-white/40"
            style={{ backgroundColor: entry.accent }}
            aria-hidden="true"
          />
          <span className="text-xs text-white/70">{entry.theme}</span>
        </div>
        <h3 className="text-xl font-semibold text-white">{entry.names}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {entry.dateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {entry.location}
          </span>
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white">
          Buka Undangan
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </motion.a>
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
          url: 'https://admoz.pages.dev/project-wedding',
          image: 'https://admoz.pages.dev/tito/preview.jpg',
          type: 'website',
        }}
      />

      <div className="min-h-screen bg-white font-sans text-zinc-900 transition-colors duration-200 dark:bg-zinc-950 dark:text-white">
        <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/80">
          <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link to="/" className="flex items-center gap-2.5">
              <Monogram size={32} strokeClassName="stroke-ops-600 dark:stroke-ops-500" />
              <span className="hidden font-mono text-sm font-semibold tracking-tight sm:block">
                Adi R. Ma'arif
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-ops-600 dark:text-zinc-300 dark:hover:text-ops-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Portofolio
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <motion.div
            className="mb-14 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-ops-600 dark:text-ops-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ops-600 dark:bg-ops-500 mr-2 align-middle" />
              Modul Terpisah
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Undangan Pernikahan Digital
            </h1>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Setiap pasangan mendapat microsite dengan tema, warna, dan interaksi yang dirancang
              khusus untuk cerita mereka sendiri, bukan template yang dipakai ulang.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {weddings.map((entry, i) => (
              <WeddingCard key={entry.id} entry={entry} offset={i % 2 === 1} />
            ))}
          </motion.div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
};
