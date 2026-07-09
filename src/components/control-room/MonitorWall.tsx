import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '../../data/project';
import { MonitorCard } from './MonitorCard';

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 6;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const MonitorWall: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const domains = useMemo(
    () => Array.from(new Set(projects.map((p) => p.domain))),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q);
      const matchesDomain = !domain || p.domain === domain;
      return matchesSearch && matchesDomain;
    });
  }, [search, domain]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const clampedPage = Math.min(page, totalPages - 1);
  const pageItems = filtered.slice(clampedPage * ITEMS_PER_PAGE, clampedPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

  const goToPage = (next: number) => {
    if (next < 0 || next > totalPages - 1) return;
    setDirection(next > clampedPage ? 1 : -1);
    setPage(next);
  };

  const resetToFirstPage = () => {
    setDirection(-1);
    setPage(0);
  };

  // One-time "wall power on" flicker when the section first scrolls into view.
  useEffect(() => {
    if (!sectionRef.current) return;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.set(sectionRef.current, { opacity: 0 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(sectionRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: 'steps(6)',
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <section id="monitor" ref={sectionRef} className="relative bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ops-600 dark:text-ops-500 mb-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ops-600 dark:bg-ops-500 mr-2 animate-pulse align-middle" />
            Ruang Monitor
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white">
            Sistem yang saya bangun, dan terus dipantau
          </h2>
        </div>

        {/* Search + filter */}
        <div className="mb-8 flex flex-col gap-3">
          <div className="relative max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetToFirstPage();
              }}
              placeholder="Cari sistem..."
              className="w-full pl-9 pr-3 py-2 font-mono text-xs text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-ops-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              aria-label="Cari sistem"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 pointer-events-none" />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setDomain(null);
                resetToFirstPage();
              }}
              className={`font-mono text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-full border transition-colors ${
                domain === null
                  ? 'bg-ops-600 dark:bg-ops-500 border-ops-600 dark:border-ops-500 text-white dark:text-zinc-950'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-ops-600'
              }`}
            >
              Semua
            </button>
            {domains.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDomain(domain === d ? null : d);
                  resetToFirstPage();
                }}
                className={`font-mono text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-full border transition-colors ${
                  domain === d
                    ? 'bg-ops-600 dark:bg-ops-500 border-ops-600 dark:border-ops-500 text-white dark:text-zinc-950'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-ops-600'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Slide */}
        {filtered.length === 0 ? (
          <p className="font-mono text-sm text-zinc-500 py-10 text-center">
            Tidak ada sistem yang cocok dengan pencarian.
          </p>
        ) : (
          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={`${clampedPage}-${search}-${domain}`}
                  custom={direction}
                  variants={reduce ? undefined : slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: EASE }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {pageItems.map((project, i) => (
                    <MonitorCard key={project.id} project={project} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => goToPage(clampedPage - 1)}
                  disabled={clampedPage === 0}
                  className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-ops-600 hover:text-ops-600 dark:hover:text-ops-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goToPage(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === clampedPage ? 'w-5 bg-ops-600 dark:bg-ops-500' : 'w-1.5 bg-zinc-300 dark:bg-zinc-700'
                      }`}
                      aria-label={`Ke halaman ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goToPage(clampedPage + 1)}
                  disabled={clampedPage === totalPages - 1}
                  className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-ops-600 hover:text-ops-600 dark:hover:text-ops-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
