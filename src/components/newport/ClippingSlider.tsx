import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ClippingSliderProps {
  label: string;
  /** Tailwind widths for one slide, mobile first. */
  slideClassName: string;
  children: React.ReactNode;
}

/**
 * Horizontal slider built on native scroll snapping rather than page maths, so
 * it stays correct for any number of clippings and gets touch swiping for free.
 * Arrows are a desktop affordance only; on a phone the swipe is the control.
 */
export const ClippingSlider: React.FC<ClippingSliderProps> = ({
  label,
  slideClassName,
  children,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    // 1px of slack: sub-pixel widths mean scrollLeft rarely hits max exactly.
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync, children]);

  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * 0.9,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  const arrowClass =
    'rounded-full border border-zine-rule dark:border-zine-rule-dark p-1.5 text-zine-ink-soft dark:text-zine-ink-soft-dark transition-colors hover:text-zine-pen dark:hover:text-zine-pen-dark disabled:opacity-30 disabled:pointer-events-none';

  const showArrows = !(atStart && atEnd);

  return (
    <div>
      {showArrows && (
        <div className="mb-3 hidden justify-end gap-2 sm:flex">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={atStart}
            className={arrowClass}
            aria-label={`Geser ${label} ke kiri`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={atEnd}
            className={arrowClass}
            aria-label={`Geser ${label} ke kanan`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <div
        ref={trackRef}
        onScroll={sync}
        // Scroll state comes from this element, never a window scroll listener.
        className="np-track -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 pt-3"
        role="group"
        aria-label={label}
      >
        {React.Children.map(children, (child) => (
          <div className={`np-snap flex-none ${slideClassName}`}>{child}</div>
        ))}
      </div>
    </div>
  );
};
