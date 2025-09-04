import React, { useEffect, useState } from 'react';
import { projects } from "../../data/project";
import { ProjectCard } from '../ui/ProjectCard';

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState('semua');
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    if (filter === 'semua') {
      setFilteredProjects(projects);
    } else if (filter === 'unggulan') {
      setFilteredProjects(projects.filter(p => p.featured));
    } else {
      setFilteredProjects(projects.filter(p => p.status === filter));
    }
  }, [filter]);

  const filterButtons = [
    { key: 'semua', label: 'Semua Proyek', count: projects.length },
    { key: 'unggulan', label: 'Unggulan', count: projects.filter(p => p.featured).length },
    { key: 'selesai', label: 'Selesai', count: projects.filter(p => p.status === 'selesai').length },
    { key: 'sedang_berjalan', label: 'Sedang Berjalan', count: projects.filter(p => p.status === 'sedang_berjalan').length }
  ];

  return (
    <section id="proyek" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 max-w-8xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Projek</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Showcase terbaru dan kontribusi saya
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {filterButtons.map((button) => (
              <button
                key={button.key}
                onClick={() => setFilter(button.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === button.key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {button.label} ({button.count})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};