import React from 'react';
import { motion } from 'framer-motion';
import { FileText, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useLang } from '../../hooks/useLang';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const SplitHero: React.FC = () => {
  const { t } = useLang();
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-zinc-100 dark:bg-zinc-950">
      <div className="grid min-h-[100dvh] grid-cols-1 md:grid-cols-2">
        {/* Left — dull / manual */}
        <div className="relative flex flex-col items-center justify-center gap-4 bg-zinc-200 dark:bg-zinc-900 px-8 py-16 text-center opacity-70">
          <FileText className="h-10 w-10 text-zinc-500 dark:text-zinc-600" />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-600">{t.institutional.before}</p>
          <p className="max-w-xs text-sm text-zinc-600 dark:text-zinc-500">
            {t.institutional.beforeText}
          </p>
        </div>

        {/* Right — bright / digital */}
        <div className="relative flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-amber-50 to-white px-8 py-16 text-center">
          <LayoutDashboard className="h-10 w-10 text-amber-600" />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-700">{t.institutional.after}</p>
          <p className="max-w-xs text-sm text-stone-600">
            {t.institutional.afterText}
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="max-w-xl rounded-lg bg-black/60 px-6 py-8 text-center backdrop-blur-sm"
        >
          <h1 className="text-xl font-semibold leading-snug text-white sm:text-3xl">
            {t.institutional.heroTitle}
          </h1>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500"
      >
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </motion.div>
    </section>
  );
};
