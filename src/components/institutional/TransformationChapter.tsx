import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { projects } from '../../data/project';
import type { TransformationChapter as ChapterData, TransformationMetric } from '../../data/transformationChapters';
import { useCountUp } from '../../hooks/useCountUp';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const MetricItem: React.FC<{ metric: TransformationMetric; delay: number }> = ({ metric, delay }) => {
  const { count, start } = useCountUp(metric.value, 1200);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      onViewportEnter={start}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="min-w-0"
    >
      <div className="font-mono text-lg sm:text-2xl font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
        {count}
        {metric.suffix}
      </div>
      <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 leading-snug break-words">
        {metric.label}
      </div>
    </motion.div>
  );
};

export const TransformationChapter: React.FC<{ chapter: ChapterData; index: number }> = ({ chapter, index }) => {
  const project = projects.find((p) => p.id === chapter.projectId);
  if (!project) return null;

  return (
    <section className="relative bg-zinc-50 dark:bg-zinc-950 py-16 px-6 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">
          Studi Kasus {String(index + 1).padStart(2, '0')} &middot; {project.domain}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Before panel */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 p-6 opacity-80 dark:opacity-70"
          >
            <div className="flex items-center gap-2 mb-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              <AlertCircle className="h-3.5 w-3.5" />
              Sebelum
            </div>
            <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-200 mb-2">{chapter.beforeProblem}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{chapter.beforeDescription}</p>
          </motion.div>

          {/* After panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-white dark:from-stone-900 dark:to-stone-800 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              {project.logo && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  className={`h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl bg-gradient-to-br ${project.gradient} p-0.5 shadow-md`}
                >
                  <div className="h-full w-full rounded-[10px] bg-white dark:bg-stone-800 flex items-center justify-center overflow-hidden">
                    <img src={project.logo} alt="" className="h-full w-full object-contain p-1.5" />
                  </div>
                </motion.div>
              )}
              <h3 className="text-base font-semibold text-stone-800 dark:text-stone-100">{project.title}</h3>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {chapter.afterMetrics.map((m, i) => (
                <MetricItem key={m.label} metric={m} delay={0.1 * i} />
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-2.5 py-0.5 font-mono text-[10px] text-stone-600 dark:text-stone-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
