import type { Experience } from '../../types';

/** Terjemahan English untuk `src/data/experience.ts`, per `id`. */
export const experiencesEn: Partial<Record<number, Partial<Experience>>> = {
  1: {
    company: 'Independent - Freelance',
    period: 'February 2020 – Present',
    description: 'Building web and mobile applications for clients across many industries',
    achievements: [
      'Delivered 20+ projects on time',
      'Maintained a 96% client satisfaction rate',
      'Built solutions serving 100k+ users',
    ],
  },
  2: {
    company: 'RSJ Sambang Lihum - South Kalimantan Province',
    location: 'South Kalimantan, Indonesia',
    period: 'January 2024 – Present',
    description: 'Development of the Hospital Management Information System (SIMRSGOS)',
    achievements: [
      'Implemented a secure patient data management system',
      'Optimised database queries to improve response times',
      'Delivered solutions that improve healthcare services at the hospital',
    ],
  },
};
