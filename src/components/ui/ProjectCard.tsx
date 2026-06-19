import { Code, ExternalLink, Github, Star } from 'lucide-react';
import React, { useState } from 'react';
import { Project } from '../../types';
import { motion } from 'framer-motion';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'selesai':
      return 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200';
    case 'sedang_berjalan':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200';
    case 'direncanakan':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden group h-full flex flex-col"
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className={`h-44 bg-gradient-to-br ${project.gradient} relative overflow-hidden flex-shrink-0`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(project.status)}`}
          >
            {getStatusText(project.status)}
          </span>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3" />
              Unggulan
            </span>
          </div>
        )}

        {/* Logo / icon */}
        <div className="w-full h-full flex items-center justify-center">
          {project.logo && !logoError ? (
            <motion.div
              className="w-28 h-28 bg-white/15 rounded-2xl flex items-center justify-center p-3"
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.25 }}
            >
              <img
                src={project.logo}
                alt={`${project.title} logo`}
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            </motion.div>
          ) : project.icon ? (
            <motion.i
              className={`${project.icon} text-5xl text-white opacity-80`}
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.25 }}
            />
          ) : (
            <motion.div
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center"
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.25 }}
            >
              <Code className="w-8 h-8 text-white" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.technologies.map((tech: string, idx: number) => (
            <motion.span
              key={idx}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(59,130,246,0.15)' }}
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 mt-auto">
          {project.link !== '#' && (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-sm font-medium"
              whileHover={{ x: 3 }}
            >
              <ExternalLink className="w-4 h-4" />
              Kunjungi
            </motion.a>
          )}
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors text-sm font-medium"
              whileHover={{ x: 3 }}
            >
              <Github className="w-4 h-4" />
              Kode
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
