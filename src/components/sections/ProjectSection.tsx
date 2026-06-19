import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../../data/project';
import { ProjectCard } from '../ui/ProjectCard';

const filterProjects = (filter: string) => {
  if (filter === 'semua') return projects;
  if (filter === 'unggulan') return projects.filter((p) => p.featured);
  return projects.filter((p) => p.status === filter);
};

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState('semua');
  const filteredProjects = filterProjects(filter);

  const filterButtons = [
    { key: 'semua', label: 'Semua', count: projects.length },
    { key: 'unggulan', label: 'Unggulan', count: projects.filter((p) => p.featured).length },
    { key: 'selesai', label: 'Selesai', count: projects.filter((p) => p.status === 'selesai').length },
    {
      key: 'sedang_berjalan',
      label: 'Berjalan',
      count: projects.filter((p) => p.status === 'sedang_berjalan').length,
    },
  ];

  return (
    <section id="proyek" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Projek</h2>

          <div className="flex flex-wrap justify-center gap-2">
            {filterButtons.map((button) => (
              <motion.button
                key={button.key}
                onClick={() => setFilter(button.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === button.key
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {button.label}{' '}
                <span className={`ml-1 ${filter === button.key ? 'opacity-80' : 'opacity-60'}`}>
                  ({button.count})
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
