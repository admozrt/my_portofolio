import React, { useState } from 'react';
import { Search, Menu, X, Users, Briefcase, Code, Award } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import type { NavigationProps } from '../../types';

export const Navigation: React.FC<NavigationProps> = ({ searchTerm, onSearchChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'tentang', label: 'Tentang', icon: <Users className="w-4 h-4" /> },
    { id: 'pengalaman', label: 'Pengalaman', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'proyek', label: 'Proyek', icon: <Code className="w-4 h-4" /> },
    { id: 'mitra', label: 'Mitra', icon: <Award className="w-4 h-4" /> }
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-900 dark:text-white shadow-lg fixed w-full z-50 top-0 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center max-w-8xl">
        <button 
          onClick={() => scrollToSection('tentang')}
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
          aria-label="Kembali ke bagian tentang"
        >
          AM
        </button>

        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 group"
                aria-label={`Navigasi ke ${item.label}`}
              >
                <span className="text-gray-500 group-hover:text-blue-500 transition-colors">
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cari..." 
                className="px-4 py-2 pr-10 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-64 transition-all"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Pencarian konten"
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-2 px-4 py-4">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-left flex items-center gap-3"
                aria-label={`Navigasi ke ${item.label}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <div className="flex items-center gap-3 px-4 py-2">
              <input 
                type="text" 
                placeholder="Cari..." 
                className="flex-1 px-4 py-2 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 rounded-lg"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Pencarian konten mobile"
              />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};