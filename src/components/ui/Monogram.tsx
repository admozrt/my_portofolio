import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MonogramProps {
  /** Pixel size of the square mark. */
  size?: number;
  /** Play the self-draw animation on mount (used by the splash). */
  draw?: boolean;
  className?: string;
  /** Stroke color; defaults to the accent via currentColor. */
  title?: string;
  /** Tailwind class controlling the stroke color; defaults to the site accent (blue). */
  strokeClassName?: string;
}

/**
 * Signature "AM" monogram — geometric A + M strokes inside a rounded tile.
 * Reused across nav, splash, and footer as the brand signature.
 * When `draw` is true it line-draws itself (pathLength 0 -> 1), respecting
 * reduced-motion (renders fully drawn, no animation).
 */
export const Monogram: React.FC<MonogramProps> = ({
  size = 36,
  draw = false,
  className = '',
  title = 'Adi Rakhmatullah Maarif',
  strokeClassName = 'stroke-accent-500',
}) => {
  const reduce = useReducedMotion();
  const shouldDraw = draw && !reduce;

  const strokeProps = shouldDraw
    ? {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
      }
    : { initial: false as const, animate: { pathLength: 1, opacity: 1 } };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      {/* Tile */}
      <motion.rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="10"
        className="fill-zinc-900 dark:fill-zinc-100"
        initial={shouldDraw ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'center' }}
      />
      {/* Strokes drawn in the accent so the mark reads on the dark/light tile */}
      <g
        className={strokeClassName}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* A */}
        <motion.path
          d="M8 29 L13 12 L18 29"
          {...strokeProps}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
        <motion.path
          d="M9.8 23 H16.2"
          {...strokeProps}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
        />
        {/* M */}
        <motion.path
          d="M22 29 V12 L27 21 L32 12 V29"
          {...strokeProps}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
      </g>
    </svg>
  );
};
