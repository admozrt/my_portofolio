import React from 'react';
import { motion } from 'framer-motion';
import { contactInfo } from '../../data/contact';

export const Footer: React.FC = () => {
  const quickLinks = [
    { label: 'Tentang', id: 'tentang' },
    { label: 'Pengalaman', id: 'pengalaman' },
    { label: 'Proyek', id: 'proyek' },
    { label: 'Mitra', id: 'mitra' },
  ];

  const techs = ['Laravel', 'React', 'PHP', 'JavaScript', 'MySQL', 'Docker'];

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Adi Rakhmatullah Ma'arif
            </h3>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              Pengembang Full Stack yang bersemangat menciptakan solusi web inovatif dengan teknologi
              modern.
            </p>
            <div className="flex gap-3">
              {contactInfo.map((contact, index) => (
                <motion.a
                  key={index}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                  whileHover={{
                    y: -4,
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.35)',
                    backgroundColor: '#1d4ed8',
                    color: '#fff',
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {contact.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Tautan Cepat
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <motion.button
                    onClick={() =>
                      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Teknologi
            </h4>
            <div className="flex flex-wrap gap-2">
              {techs.map((tech) => (
                <motion.span
                  key={tech}
                  className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400"
                  whileHover={{ scale: 1.05, color: '#93c5fd', borderColor: '#3b82f6' }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Adi Rakhmatullah Ma'arif, S.Kom</p>
        </div>
      </div>
    </footer>
  );
};
