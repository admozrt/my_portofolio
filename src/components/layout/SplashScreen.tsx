import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Monogram } from '../ui/Monogram';

interface SplashScreenProps {
  onComplete: () => void;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    // Shorter hold under reduced motion.
    const hold = reduce ? 600 : 1900;
    const exit = reduce ? 100 : 650;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, exit);
    }, hold);
    return () => clearTimeout(timer);
  }, [onComplete, reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="font-sans fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950"
          initial={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: '-100%' }}
          transition={{ duration: reduce ? 0.2 : 0.65, ease: EASE }}
        >
          {/* Subtle accent wash, not a purple mesh. */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(22,163,74,0.18) 0%, transparent 65%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <Monogram size={84} draw strokeClassName="stroke-ops-600 dark:stroke-ops-500" />

            <motion.h2
              initial={reduce ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: reduce ? 0 : 0.6, ease: EASE }}
              className="mt-6 text-zinc-900 dark:text-white text-xl font-semibold tracking-tight"
            >
              Adi Rakhmatullah Ma'arif
            </motion.h2>

            <motion.p
              initial={reduce ? false : { y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: reduce ? 0 : 0.75, ease: EASE }}
              className="mt-1.5 text-ops-600 dark:text-ops-400 text-xs font-mono tracking-[0.25em] uppercase"
            >
              Software Engineer
            </motion.p>

            <motion.div
              className="mt-7 h-px bg-ops-600/70 dark:bg-ops-500/70"
              initial={reduce ? { width: 180 } : { width: 0 }}
              animate={{ width: 180 }}
              transition={{ duration: 1, delay: reduce ? 0 : 0.4, ease: EASE }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
