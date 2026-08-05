import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './motion';

/**
 * Opening note. Left aligned rather than centered so it reads as something
 * written on a page, and the stat row sits on a rule like a ledger line.
 */
export const ZineHero: React.FC<{ projectCount: number; skillCount: number }> = ({
  projectCount,
  skillCount,
}) => {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section className="mx-auto max-w-5xl px-5 pb-12 pt-12 sm:pb-20 sm:pt-24">
      <motion.p
        {...rise(0)}
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-zine-ink-soft dark:text-zine-ink-soft-dark"
      >
        Adi Rakhmatullah Ma'arif
      </motion.p>

      <motion.h1
        {...rise(0.1)}
        className="np-hand mt-4 max-w-[16ch] text-[38px] tracking-tight text-zine-ink dark:text-zine-ink-dark sm:text-[58px] lg:text-[68px]"
      >
        Saya membangun{' '}
        <span className="text-zine-pen dark:text-zine-pen-dark">produk digital</span> yang dipakai
        setiap hari.
      </motion.h1>

      <motion.p
        {...rise(0.2)}
        className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-zine-ink-soft dark:text-zine-ink-soft-dark"
      >
        Software engineer sejak 2020. Halaman ini mengumpulkan sistem yang sudah saya kerjakan,
        mulai dari web app sampai dengan mobile app sebagai solusi digital.
      </motion.p>

      <motion.dl
        {...rise(0.3)}
        className="mt-10 flex flex-wrap gap-x-12 gap-y-5 border-t border-zine-rule dark:border-zine-rule-dark pt-6"
      >
        {[
          { value: '6+', label: 'Tahun pengalaman' },
          { value: String(projectCount) + '+', label: 'Projek dikerjakan' },
          { value: String(skillCount) + '+', label: 'Skill dipakai rutin' },
        ].map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="np-hand block text-3xl text-zine-ink dark:text-zine-ink-dark">
                {stat.value}
              </span>
              <span className="mt-0.5 block font-mono text-[10.5px] uppercase tracking-[0.1em] text-zine-ink-soft dark:text-zine-ink-soft-dark">
                {stat.label}
              </span>
            </dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
};
