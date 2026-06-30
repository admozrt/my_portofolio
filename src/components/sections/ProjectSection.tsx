import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '../../data/project';
import { ProjectCard } from '../ui/ProjectCard';
import { ProjectModal } from '../ui/ProjectModal';
import { Project } from '../../types';

const filterProjects = (filter: string): Project[] => {
  if (filter === 'semua') return projects;
  if (filter === 'unggulan') return projects.filter((p) => p.featured);
  return projects.filter((p) => p.status === filter);
};

const filterButtons = [
  { key: 'semua', label: 'Semua', count: projects.length },
  { key: 'unggulan', label: 'Unggulan', count: projects.filter((p) => p.featured).length },
  { key: 'selesai', label: 'Selesai', count: projects.filter((p) => p.status === 'selesai').length },
  { key: 'sedang_berjalan', label: 'Berjalan', count: projects.filter((p) => p.status === 'sedang_berjalan').length },
];

const getCardsPerPage = () => {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? '-100%' : '100%', opacity: 0 }),
};

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState('semua');
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    const update = () => setCardsPerPage(getCardsPerPage());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const filteredProjects = filterProjects(filter);
  const totalPages = Math.ceil(filteredProjects.length / cardsPerPage);
  const currentCards = filteredProjects.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
    setDirection(1);
  }, [filter]);

  useEffect(() => {
    if (totalPages > 0 && currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  const goNext = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((p) => p - 1);
    }
  };

  const goTo = (page: number) => {
    if (page === currentPage) return;
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 60) goNext();
    else if (diff < -60) goPrev();
  };

  const gridClass =
    cardsPerPage === 1 ? 'grid-cols-1' : cardsPerPage === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <section id="projek" className="py-20 md:py-28 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Left-aligned header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              Projek Terpilih
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Sistem yang saya rancang dan bangun untuk klien dan instansi.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === btn.key
                    ? 'bg-accent-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {btn.label}
                <span className={`ml-1 ${filter === btn.key ? 'opacity-80' : 'opacity-50'}`}>
                  {btn.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={goPrev}
            disabled={currentPage === 0}
            aria-label="Sebelumnya"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-accent-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>

          <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={`${filter}-${currentPage}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className={`grid ${gridClass} gap-4 items-stretch`}
              >
                {currentCards.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={goNext}
            disabled={currentPage >= totalPages - 1}
            aria-label="Berikutnya"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-accent-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>
        </div>

        {/* Dots + counter */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Halaman ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentPage
                    ? 'bg-accent-600 w-6'
                    : 'bg-zinc-300 dark:bg-zinc-700 w-2 hover:bg-zinc-400 dark:hover:bg-zinc-600'
                }`}
              />
            ))}
            <span className="ml-3 text-xs font-mono text-zinc-400 dark:text-zinc-500">
              {String(currentPage + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};
