import React, { useState, useEffect } from 'react';
import { Code, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

const stats = [
  { value: 4, suffix: '+', label: 'Tahun Pengalaman', color: 'text-blue-600 dark:text-blue-400' },
  { value: 20, suffix: '+', label: 'Projek Diselesaikan', color: 'text-green-600 dark:text-green-400' },
  { value: 6, suffix: '', label: 'Klien Senang', color: 'text-orange-600 dark:text-orange-400' },
  { value: 98, suffix: '%', label: 'Tingkat Keberhasilan', color: 'text-red-500 dark:text-red-400' },
];

const StatCard: React.FC<{ stat: (typeof stats)[0]; delay: number }> = ({ stat, delay }) => {
  const { count, start } = useCountUp(stat.value, 1500);

  return (
    <motion.div
      className="text-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      onViewportEnter={start}
      whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(59,130,246,0.15)' }}
    >
      <div className={`text-3xl font-bold ${stat.color} mb-1`}>
        {count}{stat.suffix}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
    </motion.div>
  );
};

const roles = [
  'Pengembang Full Stack',
  'Spesialis Laravel',
  'Pengembang React',
  'Software Engineer',
  'IT Konsultan',
];

export const HeroSection: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Main hero content */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-14">
          {/* Profile image */}
          <motion.div
            className="flex-shrink-0 mx-auto md:mx-0"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-44 h-52 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
                <div className="w-full h-full rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                  <img
                    src="/my.png"
                    alt="Adi Rakhmatullah"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Text content */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Adi Rakhmatullah
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Ma'arif</span>
            </h1>

            <div className="h-9 mb-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentRole}
                  className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 justify-center md:justify-start"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {roles[currentRole]}
                  <span className="animate-blink-cursor text-blue-400 dark:text-blue-500">|</span>
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed">
              Menghadirkan solusi inovatif dengan teknologi terkini. Berfokus pada pengembangan
              aplikasi yang efisien dan mudah digunakan untuk mendukung pertumbuhan bisnis Anda.
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(59,130,246,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document.getElementById('projek')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="px-7 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium flex items-center gap-2 shadow-lg"
              >
                <Code className="w-4 h-4" />
                Projek
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="px-7 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full font-medium flex items-center gap-2 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                Hubungi
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};
