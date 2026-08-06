import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useActiveSection } from '../../hooks/useActiveSection';
import { Monogram } from '../ui/Monogram';
import { LIFT } from './motion';

const navItems = [
  { id: 'projek', label: 'Projek' },
  { id: 'skill', label: 'Skill' },
  { id: 'softskill', label: 'Cara Kerja' },
  { id: 'pengalaman', label: 'Pengalaman' },
  { id: 'kontak', label: 'Kontak' },
];

const sectionIds = navItems.map((item) => item.id);

/**
 * Mirrors the structure of the main portfolio's Navigation (monogram, section
 * links with an active marker, scroll progress, mobile menu, theme toggle) but
 * dressed in this page's paper palette.
 *
 * The search field is deliberately not carried over: on the main portfolio it
 * feeds the Monitor Wall filter, and there is nothing here for it to filter.
 */
export const ZineHeader: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection(sectionIds);
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Header tucks away while scrolling down, and comes back the moment scrolling
  // stops or reverses, so it is always reachable when the reader pauses.
  //
  // The idle timer is rescheduled from a ref rather than from inside the scroll
  // callback's closure, so a re-render mid-scroll cannot drop the pending
  // "scrolling has stopped" reveal.
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const idleTimer = useRef<number | undefined>(undefined);
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  useMotionValueEvent(scrollY, 'change', (y) => {
    const goingDown = y > lastY.current + 2;
    const goingUp = y < lastY.current - 2;
    if (goingDown || goingUp) lastY.current = y;

    if (goingDown && y > 120 && !menuOpenRef.current) setHidden(true);
    if (goingUp || y <= 120) setHidden(false);

    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setHidden(false), 200);
  });

  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  return (
    <motion.header
      animate={{ y: hidden && !reduce ? '-100%' : '0%' }}
      transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
      // Fixed, not sticky: the page wrapper clips overflow on the x axis, which
      // makes a sticky child behave unpredictably.
      className="np-glass fixed inset-x-0 top-0 z-40 border-b border-zine-rule/60 dark:border-zine-rule-dark/60"
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 h-0.5 origin-left bg-zine-pen dark:bg-zine-pen-dark"
        style={{ scaleX }}
      />

      {/* Nav and controls share the right edge; only the wordmark stays left. */}
      <div className="flex h-14 items-center justify-between gap-4 px-5 sm:h-16 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
          className="flex items-center gap-2.5"
          aria-label="Ke atas halaman"
        >
          <Monogram size={30} strokeClassName="stroke-zine-paper dark:stroke-zine-paper-dark" />
          <span className="hidden text-[13px] font-medium text-zine-ink dark:text-zine-ink-dark sm:block">
            Adi R. Ma'arif
          </span>
        </button>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                className={`relative px-3 py-2 text-[12.5px] font-medium transition-colors ${
                  isActive
                    ? 'text-zine-pen dark:text-zine-pen-dark'
                    : 'text-zine-ink-soft hover:text-zine-ink dark:text-zine-ink-soft-dark dark:hover:text-zine-ink-dark'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="npActiveSection"
                    className="absolute bottom-1 left-3 right-3 h-px bg-zine-pen dark:bg-zine-pen-dark"
                    transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={LIFT}
            className="rounded-full border border-zine-rule p-2 text-zine-ink-soft transition-colors hover:text-zine-pen dark:border-zine-rule-dark dark:text-zine-ink-soft-dark dark:hover:text-zine-pen-dark"
            aria-label={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            whileTap={{ scale: 0.94 }}
            className="rounded-full border border-zine-rule p-2 text-zine-ink-soft dark:border-zine-rule-dark dark:text-zine-ink-soft-dark md:hidden"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="np-glass overflow-hidden border-t border-zine-rule dark:border-zine-rule-dark md:hidden"
          >
            <div className="flex flex-col px-5 py-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(item.id)}
                  className={`border-b border-zine-rule/60 py-3 text-left text-[14px] last:border-b-0 dark:border-zine-rule-dark/60 ${
                    activeSection === item.id
                      ? 'text-zine-pen dark:text-zine-pen-dark'
                      : 'text-zine-ink-soft dark:text-zine-ink-soft-dark'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
