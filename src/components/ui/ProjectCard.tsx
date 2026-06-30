import { Code, ExternalLink, Github, Star } from 'lucide-react';
import React, { useState } from 'react';
import { Project } from '../../types';
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from 'framer-motion';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'selesai': return 'text-emerald-600 dark:text-emerald-400';
    case 'sedang_berjalan': return 'text-accent-600 dark:text-accent-400';
    case 'direncanakan': return 'text-amber-600 dark:text-amber-400';
    default: return 'text-zinc-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'selesai': return 'Selesai';
    case 'sedang_berjalan': return 'Berjalan';
    case 'direncanakan': return 'Direncanakan';
    default: return status;
  }
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [logoError, setLogoError] = useState(false);
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spotlight highlight that follows the cursor (signature). Disabled for reduced motion.
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(37,99,235,0.12), transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      className="group relative h-full bg-white dark:bg-zinc-900 rounded-card border border-zinc-200 dark:border-zinc-800 overflow-hidden cursor-pointer select-none transition-colors hover:border-accent-500/60"
      whileHover={reduce ? undefined : { y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
    >
      {/* Cursor spotlight overlay */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: spotlight }}
        />
      )}

      {/* Neutral header with prominent logo */}
      <div className="relative h-32 bg-zinc-100 dark:bg-zinc-800/60 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
        {project.featured && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-xs font-medium text-accent-600 dark:text-accent-400">
            <Star className="w-3 h-3 fill-current" />
            Unggulan
          </div>
        )}
        <div className="absolute top-2.5 right-2.5 text-xs font-medium">
          <span className={getStatusColor(project.status)}>{getStatusText(project.status)}</span>
        </div>

        {project.logo && !logoError ? (
          <div className="w-16 h-16 flex items-center justify-center p-1.5">
            <img
              src={project.logo}
              alt={project.title}
              className="w-full h-full object-contain"
              onError={() => setLogoError(true)}
            />
          </div>
        ) : project.icon ? (
          <i className={`${project.icon} text-4xl text-zinc-400 dark:text-zinc-500`} />
        ) : (
          <Code className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
        )}
      </div>

      {/* Title */}
      <div className="relative px-4 pt-3 pb-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white truncate group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
          {project.title}
        </h3>
      </div>

      {/* Links */}
      <div className="relative px-4 pb-4 flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
        {project.link !== '#' ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Kunjungi
          </a>
        ) : (
          <span className="text-xs text-zinc-400 dark:text-zinc-500">Privat</span>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 text-xs font-medium transition-colors"
          >
            <Github className="w-3 h-3" />
            GitHub
          </a>
        )}
      </div>
    </motion.div>
  );
};
