import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Monogram } from '../ui/Monogram';
import { EASE } from './motion';

interface ZineSplashProps {
  onComplete: () => void;
}

/**
 * Load sequence for the zine page, parallel to the main portfolio's splash but
 * told in this page's own language: a sheet of paper, the personal mark taped
 * on, the name written, then the sheet lifted away like turning a page.
 */
export const ZineSplash: React.FC<ZineSplashProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    const hold = reduce ? 500 : 1800;
    const exit = reduce ? 100 : 700;
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
          className="np-paper fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-zine-paper px-6 dark:bg-zine-paper-dark"
          initial={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: '-102%', rotate: -1.5 }}
          transition={{ duration: reduce ? 0.2 : 0.7, ease: EASE }}
        >
          <div className="relative flex flex-col items-center text-center">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -14, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: -2.5 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.75 }}
              className="relative border border-zine-rule bg-zine-card p-2 shadow-[0_4px_0_rgba(31,30,28,0.07)] dark:border-zine-rule-dark dark:bg-zine-card-dark dark:shadow-[0_4px_0_rgba(0,0,0,0.3)]"
            >
              <span className="np-tape" aria-hidden="true" />
              <Monogram
                size={64}
                draw
                strokeClassName="stroke-zine-paper dark:stroke-zine-paper-dark"
              />
            </motion.div>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: reduce ? 0 : 0.45, ease: EASE }}
              className="np-hand mt-6 text-[24px] text-zine-ink dark:text-zine-ink-dark sm:text-[30px]"
            >
              Adi Rakhmatullah Ma'arif
            </motion.p>

            <motion.span
              className="mt-3 block h-px bg-zine-pen dark:bg-zine-pen-dark"
              initial={reduce ? { width: 150 } : { width: 0 }}
              animate={{ width: 150 }}
              transition={{ duration: 0.9, delay: reduce ? 0 : 0.5, ease: EASE }}
            />

            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: reduce ? 0 : 0.75, ease: EASE }}
              className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-zine-ink-soft dark:text-zine-ink-soft-dark"
            >
              Software Engineer
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
