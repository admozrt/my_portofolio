import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { experiences } from '../../data/experience';
import { REVEAL } from './motion';

/**
 * Experience rendered as a ruled notebook page: entries stack down the left,
 * achievements sit in the right column so the section never turns into one
 * long bulleted list.
 */
export const NotebookExperience: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <section id="pengalaman" className="px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={REVEAL}
        className="np-hand mb-10 text-[30px] text-zine-ink dark:text-zine-ink-dark sm:text-[36px]"
      >
        Pengalaman
      </motion.h2>

      <div className="np-margin-rule border border-zine-rule bg-zine-card px-5 py-7 dark:border-zine-rule-dark dark:bg-zine-card-dark sm:py-10 sm:pl-16 sm:pr-8">
        <div className="space-y-10">
          {experiences.map((exp, i) => (
            <motion.article
              key={exp.id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...REVEAL, delay: i * 0.1 }}
              className="grid grid-cols-1 gap-x-10 gap-y-4 lg:grid-cols-[1fr_1fr]"
            >
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-zine-pen dark:text-zine-pen-dark">
                  {exp.period}
                </p>
                <h3 className="np-hand mt-1.5 text-[22px] text-zine-ink dark:text-zine-ink-dark">
                  {exp.title}
                </h3>
                <p className="mt-1 text-[13.5px] text-zine-ink-soft dark:text-zine-ink-soft-dark">
                  {exp.company}
                </p>
                <p className="mt-3 max-w-[42ch] text-[13.5px] leading-relaxed text-zine-ink-soft dark:text-zine-ink-soft-dark">
                  {exp.description}
                </p>
              </div>

              <ul className="space-y-2.5">
                {exp.achievements.map((achievement) => (
                  <li
                    key={achievement}
                    className="flex gap-2.5 text-[13.5px] leading-relaxed text-zine-ink dark:text-zine-ink-dark"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-px w-3 flex-none bg-zine-pen dark:bg-zine-pen-dark"
                    />
                    {achievement}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
