import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio, ExternalLink, ArrowRight } from 'lucide-react';
import { partners } from '../../data/partner';

export const TransmissionsPanel: React.FC = () => {
  return (
    <section id="transmisi" className="relative bg-white dark:bg-zinc-900 py-20 px-6 border-y border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ops-600 dark:text-ops-500 mb-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ops-600 dark:bg-ops-500 mr-2 animate-pulse align-middle" />
            Saluran Masuk
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white">Transmisi Diterima</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Instansi dan mitra yang pernah bekerja sama.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-4"
            >
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ops-600 dark:text-ops-500 mb-2">
                <Radio className="w-3.5 h-3.5" />
                Transmission from
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{partner.name}</h3>
              <p className="mt-1 text-xs text-zinc-500">{partner.relationship}</p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{partner.description}</p>
              {partner.website && partner.website !== '#' && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ops-600 dark:text-ops-400 hover:text-ops-700 dark:hover:text-ops-300"
                >
                  Kunjungi <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: partners.length * 0.05 }}
          className="mt-6 rounded-lg border border-dashed border-ops-600/40 dark:border-ops-500/40 bg-ops-50 dark:bg-ops-500/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Mewakili instansi pemerintah, kesehatan, atau perusahaan?
          </p>
          <Link
            to="/solusi-digital"
            className="inline-flex items-center gap-1.5 shrink-0 font-mono text-xs uppercase tracking-wide text-ops-600 dark:text-ops-400 hover:text-ops-700 dark:hover:text-ops-300 transition-colors"
          >
            Lihat Solusi Khusus
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
