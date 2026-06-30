import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X, ExternalLink, Github, Star, Code } from 'lucide-react';
import { Project } from '../../types';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'selesai': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10';
    case 'sedang_berjalan': return 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-500/10';
    case 'direncanakan': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10';
    default: return 'text-zinc-500 bg-zinc-100';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'selesai': return 'Selesai';
    case 'sedang_berjalan': return 'Sedang Berjalan';
    case 'direncanakan': return 'Direncanakan';
    default: return status;
  }
};

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [logoError, setLogoError] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const enter = reduce
    ? { scale: 1, opacity: 1, y: 0 }
    : { scale: 1, opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 350 } };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: 'rgba(9,9,11,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-card overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800"
        initial={reduce ? false : { scale: 0.7, opacity: 0, y: 30 }}
        animate={enter}
        exit={reduce ? { opacity: 0 } : { scale: 0.7, opacity: 0, y: 30, transition: { duration: 0.18, ease: 'easeIn' } }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neutral header with logo */}
        <div className="relative h-44 bg-zinc-100 dark:bg-zinc-800/60 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 bg-white/70 dark:bg-zinc-900/70 hover:bg-white dark:hover:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-300 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          {project.featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 text-xs font-medium text-accent-600 dark:text-accent-400">
              <Star className="w-3 h-3 fill-current" />
              Unggulan
            </div>
          )}

          {project.logo && !logoError ? (
            <div className="w-24 h-24 flex items-center justify-center p-2">
              <img
                src={project.logo}
                alt={project.title}
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : project.icon ? (
            <i className={`${project.icon} text-6xl text-zinc-400 dark:text-zinc-500`} />
          ) : (
            <Code className="w-12 h-12 text-zinc-400 dark:text-zinc-500" />
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[55vh]">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white leading-snug">
              {project.title}
            </h2>
            <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </span>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-5">
            {project.description}
          </p>

          <div className="mb-5">
            <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Teknologi</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {(project.link !== '#' || project.github) && (
            <div className="flex gap-3 flex-wrap">
              {project.link !== '#' && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Kunjungi Situs
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-sm font-medium transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Lihat Kode
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
