import React from 'react';
import { partners } from '../../data/partner';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const PartnersSection: React.FC = () => (
  <section id="mitra" className="py-20 md:py-28 bg-zinc-50 dark:bg-zinc-900">
    <div className="container mx-auto px-6 max-w-7xl">
      <motion.div
        className="mb-10 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Klien &amp; Mitra
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Instansi dan perusahaan yang telah mempercayai saya.
        </p>
      </motion.div>

      <div className="border-t border-zinc-200 dark:border-zinc-800">
        {partners.map((partner, index) => {
          const hasSite = partner.website && partner.website !== '#';
          const Wrapper: React.ElementType = hasSite ? 'a' : 'div';
          return (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: EASE }}
              className="border-b border-zinc-200 dark:border-zinc-800"
            >
              <Wrapper
                {...(hasSite
                  ? { href: partner.website, target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="group grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-6 py-5"
              >
                <div className="sm:col-span-4 flex items-center gap-3">
                  <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                    {partner.name}
                  </h3>
                </div>
                <p className="sm:col-span-7 text-sm text-zinc-600 dark:text-zinc-400 pl-8 sm:pl-0">
                  {partner.relationship}
                </p>
                <div className="hidden sm:flex sm:col-span-1 justify-end">
                  {hasSite && (
                    <ArrowUpRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-accent-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  )}
                </div>
              </Wrapper>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
