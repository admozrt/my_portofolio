import type { Experience } from '../types';

export const experiences: Experience[] = [
  {
    id: 1,
    title: 'Pengembang Full Stack',
    company: 'RSJ Sambang Lihum',
    location: 'Kalimantan Selatan, Indonesia',
    period: 'Januari 2024 - Sekarang',
    description: 'Memimpin pengembangan Sistem Informasi Manajemen Rumah Sakit (SIMRS) yang komprehensif',
    technologies: ['Laravel', 'Vue.js', 'MySQL', 'Redis', 'Docker', 'AWS'],
    achievements: [
      'Mengurangi waktu registrasi pasien hingga 60%',
      'Mengimplementasikan sistem manajemen data pasien yang aman',
      'Mengoptimalkan query database yang meningkatkan waktu respon hingga 40%'
    ]
  },
  {
    id: 2,
    title: 'Rekayasa Perangkat Lunak Freelance',
    company: 'Mandiri',
    location: 'Remote',
    period: 'Februari 2020 - Sekarang',
    description: 'Mengembangkan aplikasi web kustom untuk berbagai klien di berbagai industri',
    technologies: ['Laravel', 'React', 'PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
    achievements: [
      'Berhasil menyelesaikan 15+ proyek tepat waktu',
      'Mempertahankan tingkat kepuasan klien 98%',
      'Membangun solusi scalable yang melayani 10k+ pengguna'
    ]
  }
];