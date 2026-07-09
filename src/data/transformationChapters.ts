export interface TransformationMetric {
  label: string;
  value: number;
  suffix?: string;
}

export interface TransformationChapter {
  id: string;
  projectId: number;
  beforeProblem: string;
  beforeDescription: string;
  afterMetrics: TransformationMetric[];
  isConfidential: boolean;
}

// Illustrative, general estimates per project (not real client-internal data),
// per the concept doc's own privacy guidance.
export const transformationChapters: TransformationChapter[] = [
  {
    id: 'sinergi-health',
    projectId: 1,
    beforeProblem: 'Pencatatan rekam medis & antrian pasien masih manual di kertas',
    beforeDescription:
      'Petugas mencatat data pasien, riwayat berobat, dan resep secara manual di buku terpisah — rawan hilang, dan lambat direkap saat dibutuhkan kembali.',
    afterMetrics: [
      { label: 'Pengurangan Waktu Pencatatan', value: 80, suffix: '%' },
      { label: 'Modul Terintegrasi', value: 6 },
      { label: 'Fasilitas Terhubung', value: 3, suffix: '+' },
    ],
    isConfidential: false,
  },
  {
    id: 'tmu-ferry',
    projectId: 2,
    beforeProblem: 'Pemesanan tiket kapal masih manual lewat telepon/loket',
    beforeDescription:
      'Calon penumpang harus menelepon atau datang langsung ke loket untuk mengecek jadwal dan memesan tiket — rawan bentrok jadwal dan sulit dipantau secara real-time.',
    afterMetrics: [
      { label: 'Percepatan Proses Booking', value: 75, suffix: '%' },
      { label: 'Rute Aktif Terjadwal', value: 5, suffix: '+' },
      { label: 'Transaksi Harian', value: 200, suffix: '+' },
    ],
    isConfidential: false,
  },
  {
    id: 'siparba',
    projectId: 3,
    beforeProblem: 'Informasi pariwisata & budaya tersebar, sulit diakses wisatawan',
    beforeDescription:
      'Data destinasi dan agenda budaya tersimpan terpisah di berbagai instansi — tidak ada satu portal resmi yang mudah diakses publik.',
    afterMetrics: [
      { label: 'Destinasi Terdata Digital', value: 40, suffix: '+' },
      { label: 'Akses Informasi', value: 24, suffix: '/7' },
      { label: 'Peningkatan Jangkauan Promosi', value: 60, suffix: '%' },
    ],
    isConfidential: false,
  },
  {
    id: 'rsj-indikator-mutu',
    projectId: 4,
    beforeProblem: 'Indikator mutu & insiden keselamatan dicatat manual per unit',
    beforeDescription:
      'Setiap unit/instalasi mencatat capaian dan insiden secara terpisah — sulit direkap menjadi laporan bulanan yang konsisten dan tepat waktu.',
    afterMetrics: [
      { label: 'Percepatan Rekap Laporan Bulanan', value: 70, suffix: '%' },
      { label: 'Unit Terhubung', value: 12, suffix: '+' },
      { label: 'Laporan Otomatis / Bulan', value: 30, suffix: '+' },
    ],
    isConfidential: false,
  },
  {
    id: 'wedding-microsites',
    projectId: 9,
    beforeProblem: 'Undangan digital umumnya memakai template yang seragam',
    beforeDescription:
      'Kebanyakan platform undangan online menawarkan template yang sama untuk semua pasangan — minim ruang personalisasi cerita dan visual.',
    afterMetrics: [
      { label: 'Tema Kustom Dibangun dari Nol', value: 4 },
      { label: 'Interaksi Unik per Pasangan', value: 6, suffix: '+' },
      { label: 'Personalisasi Visual', value: 100, suffix: '%' },
    ],
    isConfidential: false,
  },
];
