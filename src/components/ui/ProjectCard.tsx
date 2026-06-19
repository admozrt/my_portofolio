import { Code, ExternalLink, Github, Star } from 'lucide-react';
import React, { useState } from 'react';
import { Project } from '../../types';
import { motion } from 'framer-motion';

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

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden cursor-pointer group select-none"
      whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.14)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {/* Gradient header */}
      <div className={`h-32 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />

        {/* "Lihat Detail" overlay on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm font-semibold gap-1"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Lihat Detail ↗
        </motion.div>

        {/* Badges */}
        <div className="absolute top-2 right-2 z-10">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(project.status)}`}>
            {getStatusText(project.status)}
          </span>
        </div>

        {project.featured && (
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5" />
              Unggulan
            </span>
          </div>
        )}

        {/* Logo / icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {project.logo && !logoError ? (
            <div className="w-16 h-16 bg-white/15 rounded-xl flex items-center justify-center p-2">
              <img
                src={project.logo}
                alt={project.title}
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : project.icon ? (
            <i className={`${project.icon} text-4xl text-white opacity-80`} />
          ) : (
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="px-4 pt-3 pb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
      </div>

      {/* Links row */}
      <div
        className="px-4 pb-3 flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {project.link !== '#' ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Kunjungi
          </a>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500">Privat</span>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-medium transition-colors"
          >
            <Github className="w-3 h-3" />
            GitHub
          </a>
        )}
      </div>
    </motion.div>
  );
};
