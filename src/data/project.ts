import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: 'Sinergi Health Baimbai - RME',
    description: 'Sistem Rekam Medik yang memudahkan dokter dan perawat dalam mengelola pasien, rekam medis, dan administrasi klinik. dengan fitur-fitur seperti pendaftaran pasien, pemeriksaan, diagnosa, resep obat, dan pelaporan. Sistem yang dapat diakses melalui berbagai platform, termasuk web, mobile, dan desktop. dapat digunakan untuk klinik utama, klinik pratama, spesialis dan puskesmas',
    technologies: ['Laravel', 'React', 'React Native', 'MySQL', 'Redis', 'Integrasi API', 'Satu Sehat', 'BPJS', 'PACS'],
    link: 'https://sinergi.dinara-sanur.biz.id',
    gradient: 'from-green-500 via-green-600 to-emerald-400',
    logo: '/images/projects/logos/sinergi-health.png',
    featured: true,
    status: 'sedang_berjalan',
    domain: 'Kesehatan',
    monitorStatus: 'LIVE',
    metrics: [
      { label: 'Uptime', value: '99.9%' },
      { label: 'Fasilitas Terhubung', value: '3+' },
      { label: 'Modul Aktif', value: '6' }
    ],
    logEntries: [
      { timestamp: '08:12', message: 'Pendaftaran pasien baru tercatat' },
      { timestamp: '08:15', message: 'Rekam medis tersinkron' },
      { timestamp: '08:20', message: 'Resep obat diterbitkan' },
      { timestamp: '08:24', message: 'Klaim BPJS diverifikasi' }
    ]
  },
  {
    id: 2,
    title: 'TMU Ferry - Platform Tiket Kapal',
    description: 'Platform tiket kapal komprehensif dengan penjadwalan real-time, gateway pembayaran terintegrasi, dan antarmuka mobile responsif untuk optimisasi transportasi maritim pada PT.Timur Mila Utama.',
    technologies: ['Laravel', 'React', 'React Native', 'MySQL', 'Redis', 'Gateway Pembayaran', 'Integrasi API'],
    link: 'https://timurmilautama.co.id',
    gradient: 'from-blue-500 via-blue-600 to-cyan-600',
    logo: '/images/projects/logos/tmu-ferry.png',
    featured: true,
    status: 'sedang_berjalan',
    domain: 'Perusahaan Pelayaran Kapal',
    monitorStatus: 'LIVE',
    metrics: [
      { label: 'Uptime', value: '99.8%' },
      { label: 'Rute Aktif', value: '5+' },
      { label: 'Transaksi Harian', value: '200+' }
    ],
    logEntries: [
      { timestamp: '09:01', message: 'Tiket kapal dipesan' },
      { timestamp: '09:03', message: 'Jadwal keberangkatan diperbarui' },
      { timestamp: '09:07', message: 'Pembayaran gateway diterima' },
      { timestamp: '09:10', message: 'Manifest penumpang disinkron' }
    ]
  },
  {
    id: 3,
    title: 'SIPARBA - Sistem Informasi Pariwisata Banjarbaru',
    description: 'Sistem informasi pariwisata berbasis web yang menyediakan data destinasi komprehensif, acara budaya, dan promosi potensi pariwisata daerah Kota Banjarbaru.',
    technologies: ['Laravel', 'React', 'React Native', 'Inertia.js', 'MySQL'],
    link: 'https://siparba.banjarbarukota.go.id',
    gradient: 'from-orange-500 via-orange-600 to-red-600',
    logo: '/images/projects/logos/siparba.png',
    featured: true,
    status: 'selesai',
    domain: 'Pariwisata & Pemerintahan',
    monitorStatus: 'OPERATIONAL',
    metrics: [
      { label: 'Uptime', value: '99.5%' },
      { label: 'Destinasi Terdaftar', value: '40+' },
      { label: 'Pengunjung Bulanan', value: '5.000+' }
    ],
    logEntries: [
      { timestamp: '10:00', message: 'Data destinasi diperbarui' },
      { timestamp: '10:05', message: 'Event budaya dipublikasikan' },
      { timestamp: '10:12', message: 'Statistik kunjungan disinkron' }
    ]
  },
  {
    id: 4,
    title: 'Sistem Manajemen Indikator Mutu & Insiden Keselamatan Pasien',
    description: 'Aplikasi ini membantu pencatatan Indikator Mutu (IM) & Insiden Keselamatan Pasien (IKP) di setiap unit/instalasi. Data realisasi harian otomatis terangkum menjadi capaian bulanan untuk monitoring dan pelaporan.',
    technologies: ['Laravel', 'Inertia.js', 'Typescript', 'Tailwind', 'MySQL', 'Cetak PDF'],
    link: '#',
    gradient: 'from-orange-500 via-orange-600 to-yellow-400',
    icon: 'fas fa-shield-alt',
    logo: '/images/projects/logos/logo-rsj.png',
    status: 'selesai',
    domain: 'Kesehatan',
    monitorStatus: 'OPERATIONAL',
    metrics: [
      { label: 'Uptime', value: '99.6%' },
      { label: 'Unit Terhubung', value: '12+' },
      { label: 'Laporan Bulanan', value: '30+' }
    ],
    logEntries: [
      { timestamp: '07:45', message: 'Insiden baru dicatat' },
      { timestamp: '07:50', message: 'Indikator mutu direkap' },
      { timestamp: '08:00', message: 'Laporan bulanan digenerate' }
    ]
  },
  {
    id: 5,
    title: 'Undangan Pernikahan Digital',
    description: 'Kumpulan microsite undangan pernikahan yang dibangun sebagai proyek personal, masing-masing dengan tema visual, animasi, dan interaksi (countdown, galeri, e-gift) yang dirancang khusus per pasangan.',
    technologies: ['React', 'TypeScript', 'Framer Motion', 'CSS Kustom'],
    link: '/project-wedding',
    gradient: 'from-rose-500 via-pink-600 to-fuchsia-600',
    logo: '/tito/preview.jpg',
    featured: true,
    status: 'sedang_berjalan',
    domain: 'Kreatif & Personal',
    monitorStatus: 'LIVE',
    metrics: [
      { label: 'Undangan Aktif', value: '4' },
      { label: 'Uptime', value: '99.9%' },
      { label: 'Tamu Terlayani', value: '500+' }
    ],
    logEntries: [
      { timestamp: '11:00', message: 'Undangan baru dipublikasikan' },
      { timestamp: '11:05', message: 'RSVP tamu masuk' },
      { timestamp: '11:10', message: 'Ucapan dikirim' }
    ]
  },
  {
    id: 6,
    title: 'Sistem Penggajian Guru Militer',
    description: 'Sistem manajemen penggajian canggih untuk personel militer dengan kalkulasi otomatis, pelaporan keuangan, dan integrasi database kepegawaian.',
    technologies: ['Laravel', 'Bootstrap', 'MySQL', 'Cetak PDF'],
    link: '#',
    gradient: 'from-green-500 via-green-600 to-emerald-600',
    icon: 'fas fa-shield-alt',
    logo: '/images/projects/logos/sistem-penggajian.png',
    status: 'selesai',
    domain: 'Pemerintahan',
    monitorStatus: 'OPERATIONAL',
    metrics: [
      { label: 'Uptime', value: '99.7%' },
      { label: 'Personel Terdata', value: '300+' },
      { label: 'Slip Gaji/Bulan', value: '300+' }
    ],
    logEntries: [
      { timestamp: '06:30', message: 'Data kepegawaian disinkron' },
      { timestamp: '06:40', message: 'Perhitungan gaji selesai' },
      { timestamp: '06:50', message: 'Slip gaji diterbitkan' }
    ]
  },
  {
    id: 7,
    title: 'Sistem Manajemen Sekolah',
    description: 'Platform manajemen pendidikan terintegrasi yang mencakup administrasi akademik, manajemen siswa, penjadwalan, dan pelaporan komprehensif.',
    technologies: ['PHP', 'Bootstrap', 'MySQL', 'Chart.js'],
    link: '#',
    gradient: 'from-indigo-500 via-indigo-600 to-blue-600',
    icon: 'fas fa-graduation-cap',
    logo: '/images/projects/logos/manajemen-sekolah.png',
    status: 'selesai',
    domain: 'Pendidikan',
    monitorStatus: 'OPERATIONAL',
    metrics: [
      { label: 'Uptime', value: '99.4%' },
      { label: 'Siswa Terdata', value: '500+' },
      { label: 'Modul Akademik', value: '8' }
    ],
    logEntries: [
      { timestamp: '07:00', message: 'Jadwal kelas diperbarui' },
      { timestamp: '07:10', message: 'Nilai siswa direkap' },
      { timestamp: '07:20', message: 'Laporan akademik digenerate' }
    ]
  },
  {
    id: 8,
    title: 'Sistem Absensi Digital',
    description: 'Aplikasi absensi berbasis geolokasi dengan pelacakan real-time, validasi tempat kerja, dan pelaporan analitik untuk optimisasi HR.',
    technologies: ['CodeIgniter', 'JavaScript', 'Maps API', 'MySQL'],
    link: '#',
    gradient: 'from-purple-500 via-purple-600 to-violet-600',
    icon: 'fas fa-clock',
    logo: '/images/projects/logos/absensi-digital.png',
    status: 'selesai',
    domain: 'SDM & Operasional',
    monitorStatus: 'OPERATIONAL',
    metrics: [
      { label: 'Uptime', value: '99.3%' },
      { label: 'Titik Lokasi Aktif', value: '10+' },
      { label: 'Absensi Harian', value: '150+' }
    ],
    logEntries: [
      { timestamp: '06:55', message: 'Absensi masuk tercatat' },
      { timestamp: '07:00', message: 'Validasi lokasi berhasil' },
      { timestamp: '17:05', message: 'Absensi pulang tercatat' }
    ]
  },
  {
    id: 9,
    title: 'Manajemen Aset Universitas Borneo Lestari',
    description: 'Sistem manajemen aset digital dan arsip dengan kategorisasi otomatis, pencarian cerdas, peminjaman aset dengan scan QR dan backup terdistribusi untuk preservasi data jangka panjang.',
    technologies: ['CodeIgniter', 'Bootstrap', 'MySQL', 'Manajemen File','Scan QR'],
    link: '#',
    gradient: 'from-orange-500 via-orange-600 to-red-600',
    icon: 'fas fa-university',
    logo: '/images/projects/logos/aset-unborle.png',
    status: 'selesai',
    domain: 'Pendidikan',
    monitorStatus: 'OPERATIONAL',
    metrics: [
      { label: 'Uptime', value: '99.5%' },
      { label: 'Aset Terdata', value: '2.000+' },
      { label: 'Peminjaman/Bulan', value: '50+' }
    ],
    logEntries: [
      { timestamp: '08:30', message: 'Aset baru didaftarkan' },
      { timestamp: '08:40', message: 'QR aset dipindai' },
      { timestamp: '08:50', message: 'Peminjaman aset disetujui' }
    ]
  }
];