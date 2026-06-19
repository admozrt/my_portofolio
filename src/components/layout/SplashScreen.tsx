import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 700);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          }}
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(96,165,250,0.3) 0%, transparent 70%)',
            }}
          />

          <div className="text-center px-4 relative z-10">
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-9xl font-black mb-6 leading-none"
              style={{
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AM
            </motion.div>

            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-white text-2xl font-semibold tracking-wide mb-2"
            >
              Adi Rakhmatullah Ma'arif
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="text-blue-300 text-sm tracking-widest uppercase font-medium"
            >
              Full Stack Developer
            </motion.p>

            <motion.div
              className="mt-8 mx-auto h-px rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, #60a5fa, #a78bfa, transparent)',
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              transition={{ duration: 1.3, delay: 0.25, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
