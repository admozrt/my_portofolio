import type { Transition } from 'framer-motion';

/**
 * Shared motion vocabulary for the /newport zine concept.
 *
 * The goal is "smooth and settling", never snappy: springs are critically damped
 * (no leftover wobble) with a long-ish response, so they read as weight rather
 * than as a jolt. Springs also animate from whatever value is on screen right
 * now, which is what makes them safe to interrupt mid-flight.
 */

/** Same curve the rest of the repo uses, so scroll reveals share one rhythm. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Hover lift. No overshoot: nothing gave it momentum, so a bounce would jar. */
export const LIFT: Transition = { type: 'spring', bounce: 0, duration: 0.5 };

/** Scroll reveal. */
export const REVEAL: Transition = { duration: 0.7, ease: EASE };

/** Modal enter. Same critically damped feel, a touch longer so it reads as arriving. */
export const SHEET: Transition = { type: 'spring', bounce: 0, duration: 0.55 };
