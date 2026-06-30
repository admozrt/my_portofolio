import React, { useState } from 'react';
import { Search, Menu, X, Users, Briefcase, Code, Award } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Monogram } from '../ui/Monogram';
import { useActiveSection } from '../../hooks/useActiveSection';
import type { NavigationProps } from '../../types';

const navItems = [
  { id: 'tentang', label: 'Tentang', icon: <Users className="w-4 h-4" /> },
  { id: 'pengalaman', label: 'Pengalaman', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'projek', label: 'Projek', icon: <Code className="w-4 h-4" /> },
  { id: 'mitra', label: 'Mitra', icon: <Award className="w-4 h-4" /> },
];

const sectionIds = navItems.map((n) => n.id);

export const Navigation: React.FC<NavigationProps> = ({ searchTerm, onSearchChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection(sectionIds);
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
    <nav className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md text-zinc-900 dark:text-white fixed w-full z-50 top-0 border-b border-zinc-200/70 dark:border-zinc-800/70">
      {/* Scroll progress */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-accent-500 z-10"
        style={{ scaleX }}
      />

      <div className="container mx-auto px-4 sm:px-6 h-16 flex justify-between items-center max-w-7xl">
        <button
          onClick={() => scrollToSection('beranda')}
          className="flex items-center gap-2.5"
          aria-label="Ke beranda"
        >
          <Monogram size={34} />
          <span className="hidden sm:block text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
            Adi R. Ma'arif
          </span>
        </button>

        {/* Mobile hamburger */}
        <motion.button
          className="md:hidden p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait" initial={false}>
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
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'text-accent-600 dark:text-accent-400'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  aria-label={`Navigasi ke ${item.label}`}
                >
                  <span className={isActive ? 'text-accent-500' : 'text-zinc-400'}>{item.icon}</span>
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent-500 rounded-full"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari..."
                className="px-4 py-2 pr-10 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 w-40 transition-all placeholder:text-zinc-400"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Pencarian konten"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 overflow-hidden"
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
                    className={`px-4 py-3 rounded-xl text-left flex items-center gap-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
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
                  className="flex-1 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 rounded-xl placeholder:text-zinc-400"
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
