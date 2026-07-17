import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const DEAD_MONITORS = Array.from({ length: 6 });

export const ControlRoomHero: React.FC = () => {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), reduce ? 200 : 900);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <section
      id="beranda"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-6"
    >
      {/* Dead monitor wall backdrop */}
      <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-3 gap-3 p-6 opacity-40 pointer-events-none">
        {DEAD_MONITORS.map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60"
            style={{ aspectRatio: '4 / 3' }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/40 via-zinc-50/70 to-zinc-50 dark:from-zinc-950/40 dark:via-zinc-950/70 dark:to-zinc-950 pointer-events-none" />

      <div className="relative z-10 max-w-2xl text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-ops-600 dark:text-ops-500 mb-4"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-ops-600 dark:bg-ops-500 mr-2 animate-pulse align-middle" />
          Sistem sedang siaga
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="font-sans text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white"
        >
          Semua terkendali.
          <br />
          Mari saya tunjukkan.
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          className="mt-5 font-mono text-sm text-zinc-600 dark:text-zinc-400"
        >
          Adi Rakhmatullah Ma'arif — Software Engineer.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-500"
      >
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.div>
    </section>
  );
};
