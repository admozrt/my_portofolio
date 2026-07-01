import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  wrap,
} from 'framer-motion';

// The stack, de-duplicated to the names worth showing as social proof.
const techs = [
  'PHP',
  'Golang',
  'Laravel',
  'React',
  'React Native',
  'TypeScript',
  'MySQL',
  'Postgree',
  'TailwindCSS',
  'Inertia.js',
  'Docker',
  'Redis',
  'Laminas',
  'CodeIgniter',
];

const BASE_SPEED = -28; // px per second, baseline drift

/**
 * Single page marquee (signature). A continuous tech-stack strip whose speed
 * reacts to scroll velocity — drifts slowly at rest, speeds up while scrolling.
 * Reduced-motion: renders a static, non-looping row.
 */
export const TechMarquee: React.FC = () => {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  // Map scroll speed to an extra velocity factor for the strip.
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  const directionRef = useRef(1);
  // One repeated block is 50% of the doubled track; wrap within [-50, 0]%.
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = directionRef.current * (BASE_SPEED / 1000) * (delta / 16.7);
    const factor = velocityFactor.get();
    // Scroll direction biases the strip direction; scrolling adds speed.
    directionRef.current = factor < 0 ? -1 : 1;
    moveBy += directionRef.current * Math.abs(factor) * (delta / 1000) * 4;
    baseX.set(baseX.get() + moveBy);
  });

  const items = [...techs, ...techs];

  if (reduce) {
    return (
      <div className="border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-5 overflow-hidden">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 px-6 max-w-7xl mx-auto">
          {techs.map((t) => (
            <span key={t} className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
              {t}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-5 overflow-hidden">
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {items.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="flex items-center text-sm font-mono uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
          >
            {tech}
            <span className="mx-6 text-accent-500" aria-hidden>
              /
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};
