import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Github, Star, Code } from 'lucide-react';
import { Project } from '../../types';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'selesai': return 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200';
    case 'sedang_berjalan': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200';
    case 'direncanakan': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200';
    default: return 'bg-gray-100 text-gray-800';
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

  return (
    /* Backdrop */
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }}
      onClick={onClose}
    >
      {/* Modal */}
      <motion.div
        className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          transition: { type: 'spring', damping: 25, stiffness: 350 },
        }}
        exit={{
          scale: 0.7,
          opacity: 0,
          y: 30,
          transition: { duration: 0.18, ease: 'easeIn' },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient header */}
        <div className={`h-52 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges */}
          {project.featured && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-2.5 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold flex items-center gap-1">
                <Star className="w-3 h-3" />
                Unggulan
              </span>
            </div>
          )}

          {/* Logo / icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {project.logo && !logoError ? (
              <div className="w-24 h-24 bg-white/15 rounded-2xl flex items-center justify-center p-3">
                <img
                  src={project.logo}
                  alt={project.title}
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : project.icon ? (
              <i className={`${project.icon} text-6xl text-white opacity-80`} />
            ) : (
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <Code className="w-10 h-10 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[55vh]">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
              {project.title}
            </h2>
            <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Teknologi
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {(project.link !== '#' || project.github) && (
            <div className="flex gap-3 flex-wrap">
              {project.link !== '#' && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
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
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
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
