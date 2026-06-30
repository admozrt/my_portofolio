import { useRef } from 'react';
import {
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';

interface MagneticResult {
  ref: React.RefObject<HTMLButtonElement | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

/**
 * Magnetic hover: the element is gently pulled toward the cursor.
 * Built on Motion values + spring (never useState for continuous input).
 * Disabled under reduced-motion and on coarse (touch) pointers.
 *
 * @param strength fraction of the cursor offset to follow (0.1–0.5 feels good)
 */
export const useMagnetic = (strength = 0.3): MagneticResult => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(rawY, { stiffness: 150, damping: 15, mass: 0.1 });

  const isCoarse =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(pointer: coarse)').matches;

  const onMouseMove = (e: React.MouseEvent) => {
    if (reduce || isCoarse || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    rawX.set(offsetX * strength);
    rawY.set(offsetY * strength);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, x, y, onMouseMove, onMouseLeave };
};
