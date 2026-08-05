export interface SoftSkill {
  name: string;
  description: string;
}

/**
 * Working habits rather than tools. Written as things that are demonstrable in
 * the projects listed elsewhere on the site, not as personality adjectives.
 */
export const softSkills: SoftSkill[] = [
  {
    name: 'Pemecahan masalah',
    description:
      'Membedah kebutuhan yang masih kabur jadi langkah teknis yang jelas sebelum menulis kode.',
  },
  {
    name: 'Komunikasi dengan pengguna non-teknis',
    description:
      'Terbiasa menggali kebutuhan langsung dari petugas rumah sakit, staf instansi, dan pemilik usaha.',
  },
  {
    name: 'Analisis kebutuhan',
    description:
      'Menerjemahkan alur kerja yang selama ini manual jadi rancangan sistem yang benar-benar dipakai.',
  },
  {
    name: 'Mandiri dan terstruktur',
    description:
      'Mengerjakan proyek dari perencanaan sampai rilis tanpa perlu diarahkan tiap langkah.',
  },
  {
    name: 'Kolaborasi tim',
    description:
      'Bekerja dengan tim internal instansi maupun klien lepas, termasuk serah terima dan dokumentasi.',
  },
  {
    name: 'Belajar hal baru',
    description:
      'Mengambil teknologi baru saat memang dibutuhkan proyek, bukan karena sedang ramai dibicarakan.',
  },
];
