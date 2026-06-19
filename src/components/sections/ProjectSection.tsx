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

  // Responsive resize
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

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(0);
    setDirection(1);
  }, [filter]);

  // Guard out-of-bounds page after resize
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
    <section id="proyek" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header + filter */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Projek</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {filterButtons.map((btn) => (
              <motion.button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === btn.key
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {btn.label}{' '}
                <span className={`ml-0.5 ${filter === btn.key ? 'opacity-80' : 'opacity-50'}`}>
                  ({btn.count})
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Prev button */}
          <motion.button
            onClick={goPrev}
            disabled={currentPage === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            whileHover={currentPage > 0 ? { scale: 1.1 } : {}}
            whileTap={currentPage > 0 ? { scale: 0.9 } : {}}
          >
            <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </motion.button>

          {/* Cards window */}
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={`${filter}-${currentPage}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', duration: 0.32, ease: 'easeInOut' }}
                className={`grid ${gridClass} gap-4`}
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

          {/* Next button */}
          <motion.button
            onClick={goNext}
            disabled={currentPage >= totalPages - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            whileHover={currentPage < totalPages - 1 ? { scale: 1.1 } : {}}
            whileTap={currentPage < totalPages - 1 ? { scale: 0.9 } : {}}
          >
            <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </motion.button>
        </div>

        {/* Dot indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentPage
                    ? 'bg-blue-600 w-6'
                    : 'bg-gray-300 dark:bg-gray-600 w-2 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        )}

        {/* Page counter */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
          {currentPage + 1} / {totalPages}
        </p>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
