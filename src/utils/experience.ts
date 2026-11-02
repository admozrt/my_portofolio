/** Mulai bekerja: Februari 2020 (lihat data/experience.ts, posisi freelance). */
export const CAREER_START = new Date(2020, 1, 1);

/** Jumlah tahun penuh sejak CAREER_START sampai hari ini — 6 sampai Januari
 *  2027, lalu 7 mulai Februari 2027, dan seterusnya tanpa perlu diubah tangan. */
export const yearsOfExperience = (now: Date = new Date()) => {
  let years = now.getFullYear() - CAREER_START.getFullYear();
  if (now.getMonth() < CAREER_START.getMonth()) years -= 1;
  return Math.max(0, years);
};
