import { useState, useRef } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const useCountUp = (target: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  const start = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Reduced motion: jump straight to the final value, no animation.
    if (prefersReducedMotion()) {
      setCount(target);
      return;
    }

    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  };

  return { count, start };
};
