import React, { useState } from 'react';
import { Search, Menu, X, Users, Briefcase, Code, Award } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import type { NavigationProps } from '../../types';

const navItems = [
  { id: 'tentang', label: 'Tentang', icon: <Users className="w-4 h-4" /> },
  { id: 'pengalaman', label: 'Pengalaman', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'proyek', label: 'Proyek', icon: <Code className="w-4 h-4" /> },
  { id: 'mitra', label: 'Mitra', icon: <Award className="w-4 h-4" /> },
];

const sectionIds = navItems.map((n) => n.id);

export const Navigation: React.FC<NavigationProps> = ({ searchTerm, onSearchChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection = useScrollSpy(sectionIds);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-900 dark:text-white shadow-sm fixed w-full z-50 top-0 border-b border-gray-200/60 dark:border-gray-700/60">
      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left z-10"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center max-w-7xl">
        <motion.button
          onClick={() => scrollToSection('tentang')}
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          aria-label="Kembali ke bagian tentang"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          AM
        </motion.button>

        {/* Mobile hamburger */}
        <motion.button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isMobileMenuOpen ? 'close' : 'menu'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  aria-label={`Navigasi ke ${item.label}`}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={isActive ? 'text-blue-500' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-500 rounded-full"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari..."
                className="px-4 py-2 pr-10 text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 transition-all"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Pencarian konten"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-1 px-4 py-3">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-3 rounded-lg text-left flex items-center gap-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                    aria-label={`Navigasi ke ${item.label}`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
              <div className="flex items-center gap-3 px-4 py-2 mt-1">
                <input
                  type="text"
                  placeholder="Cari..."
                  className="flex-1 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  aria-label="Pencarian konten mobile"
                />
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
