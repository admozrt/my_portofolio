import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { skills } from '../../data/skill';
import type { Skill } from '../../types';
import { EASE, LIFT, REVEAL } from './motion';

const CATEGORIES: { key: Skill['category']; label: string }[] = [
  { key: 'Backend', label: 'Backend' },
  { key: 'Frontend', label: 'Frontend' },
  { key: 'Database', label: 'Database' },
  { key: 'Tools', label: 'Tools' },
];

const SkillIcon: React.FC<{ icon: Skill['icon'] }> = ({ icon }) => {
  if (!icon) return null;
  if (typeof icon === 'object' && 'iconName' in icon) {
    return <FontAwesomeIcon icon={icon} />;
  }
  return <>{icon}</>;
};

/**
 * Skills as luggage tags on a rail. A grid of 22 uniform chips would read as a
 * spec list; hanging them keeps the page in the same physical world as the
 * clipping board while still grouping by category.
 */
export const SkillTags: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <section id="skill" className="px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={REVEAL}
        className="np-hand mb-10 text-[30px] text-zine-ink dark:text-zine-ink-dark sm:text-[36px]"
      >
        Skill / Keahlian
      </motion.h2>

      <div className="space-y-9">
        {CATEGORIES.map((category, catIndex) => {
          const items = skills.filter((s) => s.category === category.key);
          if (items.length === 0) return null;

          return (
            <motion.div
              key={category.key}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...REVEAL, delay: catIndex * 0.08 }}
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-zine-ink-soft dark:text-zine-ink-soft-dark">
                  {category.label}
                </span>
                <span className="h-px flex-1 bg-zine-rule dark:bg-zine-rule-dark" />
              </div>

              {/*
                Grid rather than wrapping fixed widths: the tags then size
                themselves to the viewport, so three always fit on a phone
                instead of two plus a gap.
              */}
              <div className="grid grid-cols-3 gap-x-2.5 gap-y-5 text-zine-ink-soft dark:text-zine-ink-soft-dark sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {items.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.03 }}
                    className="h-full"
                  >
                    {/* Hover lives on its own layer so the spring never fights the reveal's easing. */}
                    <motion.div
                      whileHover={reduce ? undefined : { y: -3, rotate: i % 2 ? 1.5 : -1.5 }}
                      transition={LIFT}
                      className="np-tag h-full border border-zine-rule bg-zine-card px-2 pb-2 pt-4 dark:border-zine-rule-dark dark:bg-zine-card-dark sm:px-2.5 sm:pt-5"
                    >
                      {/* Reserved height keeps one-line and two-line names on the same baseline. */}
                      <span className="flex min-h-[2rem] items-start gap-1">
                        {skill.icon && (
                          <span className={`mt-px shrink-0 text-[12px] leading-none ${skill.color ?? ''}`}>
                            <SkillIcon icon={skill.icon} />
                          </span>
                        )}
                        <span className="min-w-0 flex-1 break-words text-[11px] font-medium leading-tight text-zine-ink dark:text-zine-ink-dark sm:text-[12px]">
                          {skill.name}
                        </span>
                      </span>
                      {/*
                        Level as an inked bar instead of a bare number: square
                        ends and a flat fill read as pen on paper, where a
                        rounded pill would read as a dashboard meter.
                      */}
                      <span
                        className="mt-1.5 block h-[3px] w-full bg-zine-rule dark:bg-zine-rule-dark"
                        role="img"
                        aria-label={`${skill.name}, tingkat ${skill.level} dari 100`}
                      >
                        <motion.span
                          className="block h-full bg-zine-pen dark:bg-zine-pen-dark"
                          initial={reduce ? { width: `${skill.level}%` } : { width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true, margin: '-40px' }}
                          transition={{ duration: 0.9, delay: i * 0.03, ease: EASE }}
                        />
                      </span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
