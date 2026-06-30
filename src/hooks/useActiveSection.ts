import { useState, useEffect, useRef } from 'react';

/**
 * Tracks the section currently in view using IntersectionObserver.
 * Replaces the banned `window.addEventListener('scroll')` approach —
 * no per-frame scroll work, observer-batched instead.
 */
export const useActiveSection = (sectionIds: string[]): string => {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || '');
  // Track intersection ratios so the most-visible section wins.
  const ratios = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.current.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best = '';
        let bestRatio = 0;
        for (const id of sectionIds) {
          const r = ratios.current.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        }
        if (best) setActiveSection(best);
      },
      {
        // Bias the active band toward the upper-middle of the viewport.
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
};
