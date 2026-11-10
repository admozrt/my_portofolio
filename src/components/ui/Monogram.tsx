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
 * Logo "A" — sumber: public/logo.svg (juga dipakai untuk favicon dan
 * logo192/512). Ubin biru, huruf A krem dua potong (kaki
 * kiri tipis + blok kanan), ditelusuri dari file logo asli (grid 48). Dipakai di header, splash, dan footer.
 * `draw` = muncul dengan skala halus saat mount (menghormati reduced-motion).
 * `strokeClassName` dipertahankan untuk kompatibilitas pemanggil lama; tidak
 * lagi dipakai karena warna logo tetap.
 */
export const Monogram: React.FC<MonogramProps> = ({
  size = 36,
  draw = false,
  className = '',
  title = "Adi Rakhmatullah Ma'arif",
}) => {
  const reduce = useReducedMotion();
  const animate = draw && !reduce;
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
      initial={animate ? { opacity: 0, scale: 0.7, rotate: -10 } : false}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <title>{title}</title>
      <rect width="48" height="48" rx="3.6" fill="#0054a9" />
      <path fill="#efedba" d="M19.07 9.87 L19.63 9.87 L22.80 21.40 L17.93 38.22 L10.24 38.22 Z M21.59 9.87 L29.03 9.87 L37.72 38.22 L29.89 38.22 L28.42 33.24 L21.24 33.24 L23.41 26.80 L26.44 26.80 Z" />
    </motion.svg>
  );
};
