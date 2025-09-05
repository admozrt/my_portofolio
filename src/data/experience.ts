import type { Experience } from '../types';

export const experiences: Experience[] = [
  {
    id: 1,
    title: 'Pengembang Full Stack',
    company: 'RSJ Sambang Lihum',
    location: 'Kalimantan Selatan, Indonesia',
    period: 'Januari 2024 - Sekarang',
    description: 'Pengembangan Sistem Informasi Manajemen Rumah Sakit (SIMRS) yang komprehensif',
    technologies: ['Laminas','Laravel', 'Ext.js', 'MySQL', 'Redis', 'Docker', 'AWS'],
    achievements: [
      'Mengimplementasikan sistem manajemen data pasien yang aman',
      'Mengoptimalkan query database yang meningkatkan waktu respon',
      'Memberikan solusi untuk meningkatkan pelayanan kesehatan di rumah sakit'
    ]
  },
  {
    id: 2,
    title: 'Rekayasa Perangkat Lunak Freelance',
    company: 'Mandiri',
    location: 'Remote',
    period: 'Februari 2020 - Sekarang',
    description: 'Mengembangkan aplikasi web kustom untuk berbagai klien di berbagai industri',
    technologies: ['Laravel', 'React', 'PHP', 'MySQL', 'JavaScript','TailwindCSS', 'Bootstrap'],
    achievements: [
      'Berhasil menyelesaikan 18+ proyek tepat waktu',
      'Mempertahankan tingkat kepuasan klien 98%',
      'Membangun solusi scalable yang melayani 10k+ pengguna'
    ]
  }
];