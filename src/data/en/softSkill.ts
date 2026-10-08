import type { SoftSkill } from '../softSkill';

/**
 * Terjemahan English untuk `src/data/softSkill.ts`. Data aslinya tidak punya
 * `id`, jadi kuncinya nama dalam Bahasa Indonesia.
 */
export const softSkillsEn: Partial<Record<string, Partial<SoftSkill>>> = {
  'Pemecahan masalah': {
    name: 'Problem solving',
    description: 'Breaking vague requirements down into clear technical steps before writing any code.',
  },
  'Bicara dengan pengguna': {
    name: 'Talking to users',
    description: 'Gathering requirements first-hand from hospital staff, agency employees, and business owners.',
  },
  'Analisis kebutuhan': {
    name: 'Requirements analysis',
    description: 'Turning workflows that used to be manual into system designs people actually use.',
  },
  'Menjalankan projek secara terstruktur': {
    name: 'Running projects in a structured way',
    description: 'Taking a project from planning to release without needing direction at every step.',
  },
  'Kolaborasi tim': {
    name: 'Team collaboration',
    description: 'Working with in-house agency teams and freelance clients alike, including handover and documentation.',
  },
  'Memilih dan menggunakan teknologi sesuai keperluan': {
    name: 'Choosing technology for the job',
    description: 'Adopting new technology when a project genuinely needs it, not because it is fashionable.',
  },
};
