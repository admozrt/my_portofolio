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
 * Logo "A" — sama dengan ikon tab browser (public/favicon.ico): ubin biru
 * dengan huruf A krem yang terbelah. Digambar ulang sebagai SVG (grid 48)
 * supaya tajam di semua ukuran. Dipakai di header, splash, dan footer.
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
      <rect width="48" height="48" rx="7" fill="#0055aa" />
      <polygon points="10,37.5 19.5,10 21,10 22.3,18 19.8,28 18.6,37.5" fill="#dfe4b9" />
      <polygon points="22.2,10 29,10 37.8,37.5 30.2,37.5 28.8,32.5 21.6,32.5 23.6,24.5 22.6,17" fill="#dfe4b9" />
    </motion.svg>
  );
};
