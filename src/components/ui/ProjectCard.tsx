import { Code, ExternalLink, Github, Star } from "lucide-react";
import React from "react";
import { Project } from "../../types";

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selesai': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sedang_berjalan': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'direncanakan': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group ${project.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}>
      <div className={`h-64 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)} backdrop-blur-sm`}>
            {getStatusText(project.status)}
          </span>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          {project.icon ? (
            <i className={`${project.icon} text-6xl text-white opacity-80 group-hover:scale-110 transition-transform duration-300`}></i>
          ) : (
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Code className="w-10 h-10 text-white" />
            </div>
          )}
        </div>
        {project.featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3" />
              Unggulan
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          {project.description}
        </p>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {project.link !== '#' && (
              <a 
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Kunjungi Situs</span>
              </a>
            )}
            {project.github && (
              <a 
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm font-medium">Kode</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};