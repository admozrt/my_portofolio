import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { LIFT, REVEAL } from './motion';

/**
 * Pointer to the institutional-solutions page. Deliberately a single pinned
 * note rather than a full section: it serves one specific audience and should
 * not compete with the project board for weight.
 */
export const SolutionNote: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <section id="solusi" className="px-5 sm:px-8 lg:px-12 py-6 sm:py-10">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={REVEAL}
      >
        <motion.div
          animate={{ rotate: reduce ? 0 : -0.8 }}
          whileHover={reduce ? undefined : { rotate: 0, scale: 1.01 }}
          transition={LIFT}
          className="relative max-w-2xl border border-zine-rule bg-zine-card px-5 py-6 shadow-[0_3px_0_rgba(31,30,28,0.06)] dark:border-zine-rule-dark dark:bg-zine-card-dark dark:shadow-[0_3px_0_rgba(0,0,0,0.25)] sm:px-8 sm:py-7"
        >
          <span className="np-tape np-tape--cool" aria-hidden="true" />
          <span className="np-pin" aria-hidden="true" />

          <p className="np-hand text-[19px] text-zine-ink dark:text-zine-ink-dark sm:text-[22px]">
            Mewakili instansi pemerintah, kesehatan, atau perusahaan?
          </p>
          <p className="mt-2 max-w-[48ch] text-[13.5px] leading-relaxed text-zine-ink-soft dark:text-zine-ink-soft-dark">
            Ada halaman khusus: cara kerjanya, standar keamanan, dan proyek yang sudah berjalan.
          </p>

          <Link
            to="/solusi-digital"
            className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-zine-pen transition-colors hover:text-zine-ink dark:text-zine-pen-dark dark:hover:text-zine-ink-dark"
          >
            Lihat Solusi Khusus
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};
