import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';
import { useMagnetic } from '../../hooks/useMagnetic';

const stats = [
  { value: 4, suffix: '+', label: 'Tahun Pengalaman' },
  { value: 20, suffix: '+', label: 'Projek Diselesaikan' },
  { value: 6, suffix: '', label: 'Klien' },
  { value: 98, suffix: '%', label: 'Tingkat Keberhasilan' },
];

const roles = [
  'Pengembang Full Stack',
  'Spesialis Laravel',
  'Pengembang React',
  'Software Engineer',
  'Konsultan IT',
];

const SIGNATURE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Curtain reveal: each line clips its chars rising into place.
const lineParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
};
const charChild: Variants = {
  hidden: { y: '110%' },
  visible: { y: 0, transition: { duration: 0.7, ease: SIGNATURE_EASE } },
};

const KineticLine: React.FC<{ text: string; reduce: boolean }> = ({ text, reduce }) => {
  if (reduce) {
    return <span>{text}</span>;
  }
  return (
    <motion.span
      className="inline-block overflow-hidden align-bottom"
      variants={lineParent}
      style={{ paddingBottom: '0.08em' }}
    >
      {text.split('').map((ch, i) => (
        <motion.span key={i} className="inline-block" variants={charChild}>
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </motion.span>
  );
};

const StatItem: React.FC<{ stat: (typeof stats)[0]; index: number }> = ({ stat, index }) => {
  const { count, start } = useCountUp(stat.value, 1400);
  return (
    <motion.div
      className="px-5 py-1"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: SIGNATURE_EASE }}
      onViewportEnter={start}
    >
      <div className="font-mono text-3xl md:text-4xl font-semibold text-zinc-900 dark:text-white tabular-nums">
        {count}
        <span className="text-accent-600 dark:text-accent-400">{stat.suffix}</span>
      </div>
      <div className="mt-1 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {stat.label}
      </div>
    </motion.div>
  );
};

export const HeroSection: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const reduce = useReducedMotion();
  const magnet = useMagnetic(0.35);

  useEffect(() => {
    if (reduce) return;
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reduce]);

  return (
    <section
      id="beranda"
      className="relative bg-white dark:bg-zinc-950 overflow-hidden border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="container mx-auto px-6 max-w-7xl pt-28 pb-12 md:pt-32 md:pb-16">
        {/* Asymmetric split: wide text column, narrower portrait. */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-center">
          {/* Text */}
          <div className="md:col-span-7 lg:col-span-8 text-center md:text-left">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: SIGNATURE_EASE }}
              className="text-sm font-mono uppercase tracking-[0.2em] text-accent-600 dark:text-accent-400 mb-5"
            >
              Software Engineer
            </motion.p>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-zinc-900 dark:text-white"
              variants={lineParent}
              initial={reduce ? false : 'hidden'}
              animate="visible"
            >
              <span className="block">
                <KineticLine text="Adi Rakhmatullah" reduce={!!reduce} />
              </span>
              <span className="block">
                <KineticLine text="Ma'arif" reduce={!!reduce} />
              </span>
            </motion.h1>

            <div className="h-8 mt-5 mb-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentRole}
                  className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 font-medium flex items-center gap-1 justify-center md:justify-start"
                  initial={reduce ? false : { y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? undefined : { y: -18, opacity: 0 }}
                  transition={{ duration: 0.3, ease: SIGNATURE_EASE }}
                >
                  {roles[currentRole]}
                  <span className="animate-blink-cursor text-accent-500">|</span>
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed">
              Membangun aplikasi web yang efisien dan mudah digunakan, dengan fokus pada
              ekosistem Laravel dan React.
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {/* Magnetic primary CTA */}
              <motion.button
                ref={magnet.ref}
                onMouseMove={magnet.onMouseMove}
                onMouseLeave={magnet.onMouseLeave}
                style={{ x: magnet.x, y: magnet.y }}
                onClick={() =>
                  document.getElementById('projek')?.scrollIntoView({ behavior: 'smooth' })
                }
                whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center gap-2 px-7 py-3 bg-accent-600 hover:bg-accent-700 text-white rounded-xl font-medium transition-colors"
              >
                Lihat Projek
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </motion.button>

              <button
                onClick={() =>
                  document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="inline-flex items-center gap-2 px-7 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl font-medium hover:border-accent-500 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Hubungi
              </button>
            </div>
          </div>

          {/* Portrait — duotone, with an offset accent frame as signature. */}
          <motion.div
            className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-end"
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: SIGNATURE_EASE }}
          >
            <div className="relative w-56 h-72 sm:w-64 sm:h-80">
              {/* Offset accent frame */}
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-card border-2 border-accent-500/70" />
              {/* Photo */}
              <div className="relative w-full h-full rounded-card overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img
                  src="/my.png"
                  alt="Adi Rakhmatullah Ma'arif"
                  width={256}
                  height={320}
                  className="duotone-portrait w-full h-full object-cover"
                />
                {/* Accent duotone tint over the shadows */}
                <div className="absolute inset-0 bg-accent-600/25 mix-blend-multiply dark:mix-blend-screen" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats band — mono numbers, hairline dividers, no heavy cards. */}
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-200 dark:divide-zinc-800 py-6">
            {stats.map((stat, i) => (
              <StatItem key={i} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
