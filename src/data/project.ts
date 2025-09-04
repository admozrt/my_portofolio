import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: 'PT. Timur Mila Utama',
    description: 'Platform tiket kapal komprehensif dengan penjadwalan real-time, gateway pembayaran terintegrasi, dan antarmuka mobile responsif untuk optimisasi transportasi maritim.',
    technologies: ['Laravel', 'React','React Native','MySQL', 'Redis', 'Gateway Pembayaran', 'Integrasi API'],
    link: 'https://timurmilautama.co.id',
    gradient: 'from-blue-500 via-blue-600 to-cyan-600',
    featured: true,
    status: 'selesai'
  },
  {
    id: 2,
    title: 'SIPARBA - Sistem Informasi Pariwisata',
    description: 'Sistem informasi pariwisata berbasis web yang menyediakan data destinasi komprehensif, acara budaya, dan promosi potensi pariwisata daerah.',
    technologies: ['Laravel', 'React', 'PostgreSQL', 'Integrasi API'],
    link: 'https://siparba.dinara-sanur.biz.id',
    gradient: 'from-purple-500 via-purple-600 to-pink-600',
    featured: true,
    status: 'selesai'
  },
  {
    id: 3,
    title: 'Sistem Penggajian Guru Militer',
    description: 'Sistem manajemen penggajian canggih untuk personel militer dengan kalkulasi otomatis, pelaporan keuangan, dan integrasi database kepegawaian.',
    technologies: ['Laravel', 'Bootstrap', 'MySQL', 'Generasi PDF'],
    link: '#',
    gradient: 'from-green-500 via-green-600 to-emerald-600',
    icon: 'fas fa-shield-alt',
    status: 'selesai'
  },
  {
    id: 4,
    title: 'Sistem Manajemen Sekolah',
    description: 'Platform manajemen pendidikan terintegrasi yang mencakup administrasi akademik, manajemen siswa, penjadwalan, dan pelaporan komprehensif.',
    technologies: ['PHP', 'Bootstrap', 'MySQL', 'Chart.js'],
    link: '#',
    gradient: 'from-indigo-500 via-indigo-600 to-blue-600',
    icon: 'fas fa-graduation-cap',
    status: 'selesai'
  },
  {
    id: 5,
    title: 'Sistem Absensi Digital',
    description: 'Aplikasi absensi berbasis geolokasi dengan pelacakan real-time, validasi tempat kerja, dan pelaporan analitik untuk optimisasi HR.',
    technologies: ['CodeIgniter', 'JavaScript', 'Maps API', 'MySQL'],
    link: '#',
    gradient: 'from-purple-500 via-purple-600 to-violet-600',
    icon: 'fas fa-clock',
    status: 'selesai'
  },
  {
    id: 6,
    title: 'Manajemen Aset Universitas',
    description: 'Sistem manajemen aset digital dan arsip dengan kategorisasi otomatis, pencarian cerdas, dan backup terdistribusi untuk preservasi data jangka panjang.',
    technologies: ['CodeIgniter', 'Bootstrap', 'MySQL', 'Manajemen File'],
    link: '#',
    gradient: 'from-orange-500 via-orange-600 to-red-600',
    icon: 'fas fa-university',
    status: 'selesai'
  }
];