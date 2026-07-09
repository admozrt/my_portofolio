import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { skills } from '../../data/skill';

export const TechControlPanel: React.FC = () => {
  return (
    <section id="stack" className="relative bg-white dark:bg-zinc-900 py-20 px-6 border-y border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ops-600 dark:text-ops-500 mb-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ops-600 dark:bg-ops-500 mr-2 animate-pulse align-middle" />
            Panel Kontrol
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white">Tech Stack Aktif</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
              className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 px-2.5 py-2 hover:border-ops-600 transition-colors"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                {skill.icon && (
                  <span className={`text-xs shrink-0 ${skill.color || 'text-zinc-500 dark:text-zinc-400'}`}>
                    {typeof skill.icon === 'object' && 'iconName' in (skill.icon as any) ? (
                      <FontAwesomeIcon icon={skill.icon as any} />
                    ) : (
                      (skill.icon as React.ReactNode)
                    )}
                  </span>
                )}
                <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-200 truncate flex-1 min-w-0">
                  {skill.name}
                </span>
                <span className="font-mono text-[10px] font-semibold text-ops-600 dark:text-ops-400 shrink-0">
                  {skill.level}%
                </span>
              </div>
              <div className="h-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-ops-600 dark:bg-ops-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: Math.min(i * 0.02, 0.4), ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
