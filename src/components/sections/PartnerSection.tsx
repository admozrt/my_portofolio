import React from 'react';
import { partners } from '../../data/partner';
import { motion } from 'framer-motion';

export const PartnersSection: React.FC = () => (
  <section id="mitra" className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="container mx-auto px-6 max-w-7xl">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Mitra & Klien</h2>
        <p className="text-gray-600 dark:text-gray-300">Klien dan mitra yang telah mempercayai saya</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {partners.map((partner, index) => (
          <motion.div
            key={partner.id}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg cursor-default"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {partner.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {partner.relationship}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
