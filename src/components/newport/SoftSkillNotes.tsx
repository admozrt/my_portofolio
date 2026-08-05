import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { softSkills } from '../../data/softSkill';
import { LIFT, REVEAL } from './motion';

/** Alternating tilt so the notes look stuck on by hand, not laid out on a grid. */
const TILT = [-1.6, 1.2, -0.9, 1.8, -1.3, 1];

/**
 * Working habits, kept visually distinct from the technical tags above: index
 * cards with a sentence each, because a soft skill means nothing as a bare
 * label with a progress bar next to it.
 */
export const SoftSkillNotes: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <section id="softskill" className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={REVEAL}
        className="mb-8 flex flex-wrap items-baseline justify-between gap-3"
      >
        <h2 className="np-hand text-[28px] text-zine-ink dark:text-zine-ink-dark sm:text-[36px]">
          Cara Saya Bekerja
        </h2>
        <p className="max-w-[38ch] text-[13.5px] leading-relaxed text-zine-ink-soft dark:text-zine-ink-soft-dark">
          Kebiasaan kerja di luar urusan teknologi.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {softSkills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ ...REVEAL, delay: (i % 3) * 0.08 }}
          >
            <motion.div
              animate={{ rotate: reduce ? 0 : TILT[i % TILT.length] }}
              whileHover={reduce ? undefined : { rotate: 0, scale: 1.02 }}
              transition={LIFT}
              className="relative h-full border border-zine-rule bg-zine-card px-4 pb-4 pt-5 shadow-[0_3px_0_rgba(31,30,28,0.06)] dark:border-zine-rule-dark dark:bg-zine-card-dark dark:shadow-[0_3px_0_rgba(0,0,0,0.25)]"
            >
              <span
                className={`np-tape ${i % 2 === 1 ? 'np-tape--cool' : ''}`}
                aria-hidden="true"
              />

              <h3 className="np-hand text-[17px] text-zine-ink dark:text-zine-ink-dark sm:text-[18.5px]">
                {skill.name}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zine-ink-soft dark:text-zine-ink-soft-dark">
                {skill.description}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
