import React from 'react';
import { motion } from 'framer-motion';
import { partners } from '../../data/partner';

export const ReferenceAttachment: React.FC = () => {
  return (
    <section className="relative bg-white dark:bg-stone-950 py-20 px-6 border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 mb-2">
            Lampiran Referensi
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-800 dark:text-stone-100">
            Instansi &amp; Mitra Kerja Sama
          </h2>
        </div>

        <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-md">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-4"
            >
              <div>
                <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">{partner.name}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">{partner.relationship}</p>
              </div>
              <div className="font-serif italic text-stone-400 dark:text-stone-500 text-xs border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-stone-700 pt-2 sm:pt-0 sm:pl-4">
                — kerja sama terverifikasi
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
