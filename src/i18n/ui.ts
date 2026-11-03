/**
 * Teks antarmuka halaman portofolio (`/`) dan solusi digital (`/solusi-digital`).
 *
 * Kamus English diberi tipe `typeof id`, jadi TypeScript menolak build kalau ada
 * kunci yang lupa diterjemahkan — tidak ketahuan belakangan sebagai teks
 * Indonesia yang tercecer di mode English.
 *
 * Isi data (deskripsi projek, pengalaman, mitra, dst.) tidak ada di sini;
 * terjemahannya di `src/data/en/`.
 */

const id = {
  common: {
    langLabel: 'Bahasa',
    toLight: 'Ganti ke mode terang',
    toDark: 'Ganti ke mode gelap',
    themeLabel: 'Ganti tema',
    backToPortfolio: 'Kembali ke Portofolio',
    back: 'Kembali',
  },

  nav: {
    projek: 'Projek',
    skill: 'Skill',
    softskill: 'Cara Kerja',
    pengalaman: 'Pengalaman',
    mitra: 'Mitra',
    kontak: 'Kontak',
    solusi: 'Solusi Digital',
    toTop: 'Ke atas halaman',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
  },

  hero: {
    titleBefore: 'Rancang, bangun, dan rawat ',
    titleAccent: 'produk digital',
    titleAfter: ' Anda.',
    lead:
      'Enam tahun mengerjakan sistem untuk perusahaan, layanan publik, kesehatan, UMKM, dan keperluan pribadi. Semuanya masih berjalan sampai sekarang.',
    statYears: 'Tahun pengalaman',
    statProjects: 'Projek dikerjakan',
    statTech: 'Teknologi dipakai',
  },

  projects: {
    heading: 'Projek',
    intro: 'Berikut beberapa projek yang sudah berjalan.Geser dan Ketuk kartu untuk lihat detail.',
    featured: 'Projek utama',
    other: 'Projek lain',
    slideLeft: (label: string) => `Geser ${label} ke kiri`,
    slideRight: (label: string) => `Geser ${label} ke kanan`,
    viewDetail: (title: string) => `Lihat detail ${title}`,
    status: {
      selesai: 'Selesai',
      sedang_berjalan: 'Berjalan',
      direncanakan: 'Direncanakan',
    },
    closeDetail: 'Tutup detail',
    numbers: 'Angka',
    activity: 'Aktivitas',
    technology: 'Teknologi',
    visit: 'Kunjungi',
  },

  skills: {
    heading: 'Skill / Keahlian',
    levelAria: (name: string, level: number) => `${name}, tingkat ${level} dari 100`,
  },

  softSkills: {
    heading: 'Cara Saya Bekerja',
    intro: 'Yang tidak kelihatan dari daftar teknologi di atas.',
  },

  experience: {
    heading: 'Pengalaman',
  },

  solution: {
    title: 'Mewakili instansi pemerintah, kesehatan, atau perusahaan?',
    body: 'Ada halaman khusus: cara kerjanya, standar keamanan, dan proyek yang sudah berjalan.',
    cta: 'Lihat Solusi Khusus',
  },

  partners: {
    heading: 'Mitra & Klien',
    intro: 'Instansi dan perusahaan yang sistemnya saya kerjakan.',
  },

  contact: {
    heading: 'Kontak',
    body:
      'Punya sistem yang perlu dibangun atau dibenahi? Kirim pesan lewat salah satu kontak di samping. Biasanya saya balas dalam sehari.',
  },

  footer: {
    tagline:
      'Rancang, bangun, dan rawat sistem untuk perusahaan, layanan publik, kesehatan, UMKM, dan keperluan pribadi.',
    navigation: 'Navigasi',
    technology: 'Teknologi',
  },

  institutional: {
    before: 'Sebelum',
    beforeText: 'Proses manual, catatan kertas, laporan yang lambat direkap.',
    after: 'Sesudah',
    afterText: 'Sistem digital yang terpantau, terukur, dan bisa dipertanggungjawabkan.',
    heroTitle:
      'Saya membangun sistem yang mengubah proses manual jadi digital, dan bisa dipertanggungjawabkan.',
    caseStudy: 'Studi Kasus',
    bridge:
      'Tapi hasil yang bagus saja tidak cukup. Untuk produk digital, semuanya harus bisa dipertanggungjawabkan.',
    complianceEyebrow: 'Dokumen Kompetensi',
    complianceIntro:
      'Kredibilitas, keamanan, dan kepatuhan bukan klaim kosong — ini yang benar-benar diterapkan.',
    technicalDetail: 'Detail teknis',
    referenceEyebrow: 'Lampiran Referensi',
    referenceTitle: 'Instansi & Mitra Kerja Sama',
    referenceVerified: '— kerja sama terverifikasi',
    proposalEyebrow: 'Ajukan Kerja Sama',
    proposalTitle: 'Ajukan Diskusi Proyek',
    proposalEta: 'Estimasi respon: 1x24 jam',
    fieldName: 'Nama',
    fieldInstitution: 'Instansi',
    fieldNeed: 'Kebutuhan Proyek',
    submit: 'Kirim melalui Email',
    mailSubject: (institution: string) => `Diskusi Proyek — ${institution || 'Instansi'}`,
    mailBody: (name: string, institution: string, need: string) =>
      `Nama: ${name}\nInstansi: ${institution}\n\nKebutuhan Proyek:\n${need}`,
  },

  v2: {
    role: "Adi Rakhmatullah Ma'arif - Software Engineer",
    titleA: 'Rancang, bangun, dan rawat',
    titleB: 'produk digital Anda.',
    lead:
      'Enam tahun mengerjakan sistem untuk perusahaan, layanan publik, kesehatan, UMKM, dan keperluan pribadi. Semuanya masih berjalan sampai sekarang.',
    contactCta: 'Ceritakan projek Anda',
    seeProjects: 'Lihat projek',
    phase: { rancang: 'Rancang', bangun: 'Bangun', rawat: 'Rawat' },
    phaseHint: {
      rancang: 'Memetakan alur kerja dan kebutuhan sebelum satu baris kode ditulis.',
      bangun: 'Menyusun antarmuka dan sistemnya, dikirim bertahap supaya bisa dicoba sejak awal.',
      rawat: 'Memantau, memperbaiki, dan mengembangkan sistem setelah dipakai sehari-hari.',
    },
    revealHintMouse: 'Arahkan kursor ke panel untuk melihat rancangannya',
    revealHintTouch: 'Seret jari di panel untuk melihat rancangannya',
    pickPhase: 'Pilih fase',
    projectsIntro:
      'Tiap projek bisa dilihat dari rancangannya sampai sistemnya berjalan. Geser penanda fase, atau gulir pelan dan lihat lapisannya terurai.',
    layer: { rancang: 'Kerangka & alur', bangun: 'Antarmuka', rawat: 'Status' },
    live: 'Berjalan',
    lastActivity: 'Aktivitas terakhir',
    openProject: 'Lihat detail',
    closeProject: 'Tutup detail',
    otherProjects: 'Projek lain',
    howIntro: 'Kebiasaan kerja yang menentukan hasil, dikelompokkan per fase.',
    toolboxHeading: 'Kotak perkakas',
    toolboxIntro: 'Alat yang dipakai di tiap fase. Ketuk satu alat untuk melihat projek yang memakainya.',
    usedIn: (n: number) => (n ? `Dipakai di ${n} projek` : 'Belum tercatat di projek yang ditampilkan'),
    clearTool: 'Tutup',
    logHeading: 'Log rilis',
    logIntro: 'Pengalaman',
    current: 'Berjalan',
    notes: 'Catatan rilis',
    statusHeading: 'Papan status',
    statusIntro: 'Instansi dan perusahaan yang sistemnya saya kerjakan.',
    running: 'Sistem berjalan',
    contactHeading: 'Mulai fase rancang Anda',
    contactIntro:
      'Ceritakan sistem yang ingin dibangun atau dibenahi. Biasanya saya membalas dalam sehari.',
    placeholder: 'Contoh: pendaftaran pasien kami masih pakai kertas, ingin dibuat online…',
    send: 'Kirim lewat email',
    mailSubject: 'Diskusi projek',
    orReach: 'Atau hubungi lewat',
    portraitLabel: 'Yang akan mengerjakan projek Anda',
    sketchCaption: 'Rancangan awal projek Anda tergambar di sini saat Anda menulis.',
    progress: 'Bagian halaman',
    footer: 'Dirancang, dibangun, dan dirawat sendiri.',
  },

  seo: {
    homeTitle: "Adi Rakhmatullah Ma'arif - Software Engineer",
    homeDescription:
      'Rancang, bangun, dan rawat sistem untuk perusahaan, layanan publik, kesehatan, UMKM, dan keperluan pribadi. Enam tahun mengerjakan sistem yang semuanya masih berjalan.',
    homeKeywords: [
      'Software Engineer',
      'Full Stack Developer',
      'Pengembangan Web',
      'Portofolio',
      'Laravel',
      'React',
      'Indonesia',
      'Banjarbaru',
      'Kalimantan Selatan',
    ],
    solutionsTitle: "Solusi Digital Institusional — Adi Rakhmatullah Ma'arif",
    solutionsDescription:
      'Sistem digital yang terukur, aman, dan dapat dipertanggungjawabkan untuk instansi pemerintah, layanan kesehatan, dan logistik. Dibangun dengan Laravel, React, dan teknologi modern.',
    solutionsKeywords: [
      'Solusi Digital',
      'Sistem Informasi Pemerintahan',
      'Sistem Informasi Kesehatan',
      'Sistem Manajemen Logistik',
      'Software Custom',
      'Pengembangan Sistem',
      'Laravel',
      'React',
      'Software Engineer Indonesia',
      'Digital Transformation',
    ],
  },
};

const en: typeof id = {
  common: {
    langLabel: 'Language',
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
    themeLabel: 'Toggle theme',
    backToPortfolio: 'Back to Portfolio',
    back: 'Back',
  },

  nav: {
    projek: 'Projects',
    skill: 'Skills',
    softskill: 'How I Work',
    pengalaman: 'Experience',
    mitra: 'Partners',
    kontak: 'Contact',
    solusi: 'Digital Solutions',
    toTop: 'Back to top',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  hero: {
    titleBefore: 'Design, build, and maintain ',
    titleAccent: 'your digital product',
    titleAfter: '.',
    lead:
      'Six years building systems for companies, public services, healthcare, small businesses, and personal use. Every one of them is still running today.',
    statYears: 'Years of experience',
    statProjects: 'Projects delivered',
    statTech: 'Technologies used',
  },

  projects: {
    heading: 'Projects',
    intro: 'A few projects that are already running. Slide and Tap a card to see the details.',
    featured: 'Featured projects',
    other: 'Other projects',
    slideLeft: (label: string) => `Scroll ${label} left`,
    slideRight: (label: string) => `Scroll ${label} right`,
    viewDetail: (title: string) => `View details for ${title}`,
    status: {
      selesai: 'Completed',
      sedang_berjalan: 'Ongoing',
      direncanakan: 'Planned',
    },
    closeDetail: 'Close details',
    numbers: 'Numbers',
    activity: 'Activity',
    technology: 'Technology',
    visit: 'Visit',
  },

  skills: {
    heading: 'Skills',
    levelAria: (name: string, level: number) => `${name}, level ${level} of 100`,
  },

  softSkills: {
    heading: 'How I Work',
    intro: 'What the technology list above does not show.',
  },

  experience: {
    heading: 'Experience',
  },

  solution: {
    title: 'Representing a government agency, healthcare provider, or company?',
    body: 'There is a dedicated page: how I work, the security standards I apply, and projects already running.',
    cta: 'See Institutional Solutions',
  },

  partners: {
    heading: 'Partners & Clients',
    intro: 'Institutions and companies whose systems I have built.',
  },

  contact: {
    heading: 'Contact',
    body:
      'Have a system that needs building or fixing? Send a message through any of the contacts alongside. I usually reply within a day.',
  },

  footer: {
    tagline:
      'Design, build, and maintain systems for companies, public services, healthcare, small businesses, and personal use.',
    navigation: 'Navigation',
    technology: 'Technology',
  },

  institutional: {
    before: 'Before',
    beforeText: 'Manual processes, paper records, reports that take days to compile.',
    after: 'After',
    afterText: 'Digital systems that are monitored, measurable, and accountable.',
    heroTitle: 'I build systems that turn manual processes digital, and keep them accountable.',
    caseStudy: 'Case Study',
    bridge:
      'But good results alone are not enough. For a digital product, everything has to be accountable.',
    complianceEyebrow: 'Competency Dossier',
    complianceIntro:
      'Credibility, security, and compliance are not empty claims — this is what is actually in place.',
    technicalDetail: 'Technical details',
    referenceEyebrow: 'Reference Appendix',
    referenceTitle: 'Institutions & Partners',
    referenceVerified: '— verified engagement',
    proposalEyebrow: 'Propose a Collaboration',
    proposalTitle: 'Request a Project Discussion',
    proposalEta: 'Typical response: within 24 hours',
    fieldName: 'Name',
    fieldInstitution: 'Institution',
    fieldNeed: 'Project Needs',
    submit: 'Send via Email',
    mailSubject: (institution: string) => `Project Discussion — ${institution || 'Institution'}`,
    mailBody: (name: string, institution: string, need: string) =>
      `Name: ${name}\nInstitution: ${institution}\n\nProject Needs:\n${need}`,
  },

  v2: {
    role: "Adi Rakhmatullah Ma'arif - Software Engineer",
    titleA: 'Design, build, and maintain',
    titleB: 'your digital product.',
    lead:
      'Six years building systems for companies, public services, healthcare, small businesses, and personal use. Every one of them is still running today.',
    contactCta: 'Tell me about your project',
    seeProjects: 'See projects',
    phase: { rancang: 'Design', bangun: 'Build', rawat: 'Maintain' },
    phaseHint: {
      rancang: 'Mapping the workflow and requirements before a single line of code.',
      bangun: 'Building the interface and the system, shipped in stages so it can be tried early.',
      rawat: 'Monitoring, fixing, and growing the system once it is in daily use.',
    },
    revealHintMouse: 'Move your cursor over the panel to see the blueprint',
    revealHintTouch: 'Drag a finger across the panel to see the blueprint',
    pickPhase: 'Pick a phase',
    projectsIntro:
      'Each project can be seen from its blueprint to the running system. Move the phase marker, or scroll slowly and watch the layers come apart.',
    layer: { rancang: 'Structure & flow', bangun: 'Interface', rawat: 'Status' },
    live: 'Running',
    lastActivity: 'Latest activity',
    openProject: 'View details',
    closeProject: 'Close details',
    otherProjects: 'Other projects',
    howIntro: 'The working habits that shape the result, grouped by phase.',
    toolboxHeading: 'Toolbox',
    toolboxIntro: 'The tools used in each phase. Tap one to see the projects that use it.',
    usedIn: (n: number) => (n ? `Used in ${n} ${n === 1 ? 'project' : 'projects'}` : 'Not listed in the projects shown'),
    clearTool: 'Close',
    logHeading: 'Release log',
    logIntro: 'Experience',
    current: 'Ongoing',
    notes: 'Release notes',
    statusHeading: 'Status board',
    statusIntro: 'Institutions and companies whose systems I have built.',
    running: 'System running',
    contactHeading: 'Start your design phase',
    contactIntro:
      'Tell me about the system you want built or fixed. I usually reply within a day.',
    placeholder: 'For example: our patient registration is still on paper and we want it online…',
    send: 'Send by email',
    mailSubject: 'Project discussion',
    orReach: 'Or reach me on',
    portraitLabel: 'The one who will build your project',
    sketchCaption: 'A first sketch of your project draws itself here as you write.',
    progress: 'Page sections',
    footer: 'Designed, built, and maintained by me.',
  },

  seo: {
    homeTitle: "Adi Rakhmatullah Ma'arif - Software Engineer",
    homeDescription:
      'Design, build, and maintain systems for companies, public services, healthcare, small businesses, and personal use. Six years of systems that are all still running.',
    homeKeywords: [
      'Software Engineer',
      'Full Stack Developer',
      'Web Development',
      'Portfolio',
      'Laravel',
      'React',
      'Indonesia',
      'Banjarbaru',
      'South Kalimantan',
    ],
    solutionsTitle: "Institutional Digital Solutions — Adi Rakhmatullah Ma'arif",
    solutionsDescription:
      'Measurable, secure, and accountable digital systems for government agencies, healthcare services, and logistics. Built with Laravel, React, and modern technology.',
    solutionsKeywords: [
      'Digital Solutions',
      'Government Information Systems',
      'Healthcare Information Systems',
      'Logistics Management Systems',
      'Custom Software',
      'System Development',
      'Laravel',
      'React',
      'Software Engineer Indonesia',
      'Digital Transformation',
    ],
  },
};

export const ui = { id, en };
