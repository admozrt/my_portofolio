import type { Skill } from '../types';

/**
 * Pemetaan isi portofolio ke tiga fase "Rancang → Bangun → Rawat" untuk
 * halaman /v2. Satu-satunya tempat yang memutuskan sesuatu masuk fase mana,
 * supaya section Cara kerja dan Kotak perkakas tidak menebak sendiri.
 */

export type Phase = 'rancang' | 'bangun' | 'rawat';
export const PHASES: Phase[] = ['rancang', 'bangun', 'rawat'];

/** Kunci = `name` soft skill versi Indonesia (data asli, bukan terjemahan). */
export const SOFT_SKILL_PHASE: Record<string, Phase> = {
  'Bicara dengan pengguna': 'rancang',
  'Analisis kebutuhan': 'rancang',
  'Menjalankan projek secara terstruktur': 'bangun',
  'Kolaborasi tim': 'bangun',
  'Memilih dan menggunakan teknologi sesuai keperluan': 'bangun',
  'Pemecahan masalah': 'rawat',
};

/** Database = pemodelan data saat merancang; Tools = deploy dan perawatan. */
export const SKILL_CATEGORY_PHASE: Record<Skill['category'], Phase> = {
  Database: 'rancang',
  Backend: 'bangun',
  Frontend: 'bangun',
  Tools: 'rawat',
};

/** Nama teknologi ditulis tidak seragam di data ("TailwindCSS" vs "Tailwind",
 *  "Postgre SQL" vs "PostgreSQL"); dibandingkan dalam bentuk ringkas ini. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\s.\-_/]/g, '')
    .replace(/css$/, '');

export const techMatches = (skillName: string, tech: string) => {
  const a = norm(skillName);
  const b = norm(tech);
  return a === b || (a.length > 3 && b.includes(a)) || (b.length > 3 && a.includes(b));
};

/** Alat yang dipakai lintas projek tapi sengaja tidak ditulis di daftar
 *  `technologies` tiap projek (supaya chip teknologi tidak penuh dengan alat
 *  yang sama di semua kartu). */
const IMPLICIT_TOOLS: Record<string, (techs: string[]) => boolean> = {
  // Semua projek dikelola dengan Git dan disimpan di GitHub.
  git: () => true,
  github: () => true,
  // Tailwind dipakai untuk antarmuka di semua projek.
  tailwindcss: () => true,
  // NPM dipakai di projek yang frontend-nya React / React Native / Inertia.
  npm: (techs) => techs.some((t) => /react|inertia/i.test(t)),
};

/** Apakah projek dengan daftar teknologi ini memakai skill tersebut. */
export const projectUses = (skillName: string, techs: string[]) => {
  const rule = IMPLICIT_TOOLS[skillName.toLowerCase()];
  if (rule) return rule(techs);
  return techs.some((tech) => techMatches(skillName, tech));
};
