import React from 'react';
import { motion } from 'framer-motion';
import { systemLog } from '../../data/systemLog';

const levelColor: Record<string, string> = {
  SUCCESS: 'text-ops-600 dark:text-ops-400',
  WARNING: 'text-amber-600 dark:text-amber-400',
  INFO: 'text-zinc-500 dark:text-zinc-400',
};

export const SystemLogFeed: React.FC = () => {
  return (
    <section id="log" className="relative bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ops-600 dark:text-ops-500 mb-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ops-600 dark:bg-ops-500 mr-2 animate-pulse align-middle" />
            Log Riwayat
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white">Riwayat Operasional</h2>
        </div>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 font-mono text-xs sm:text-sm divide-y divide-zinc-200 dark:divide-zinc-800">
          {systemLog.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="px-4 py-2.5 flex flex-wrap items-baseline gap-x-2 text-zinc-700 dark:text-zinc-300"
            >
              <span className="text-zinc-400 dark:text-zinc-600">[{entry.year}]</span>
              <span className={`${levelColor[entry.level]} font-semibold`}>{entry.level}:</span>
              <span>{entry.message}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
