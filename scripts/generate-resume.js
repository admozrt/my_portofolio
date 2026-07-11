/*
 * Generates a one/two-page CV/resume PDF from the portfolio's own content
 * (src/data/*, public/my.png). Values below are copied from those source
 * files rather than imported, since they are TypeScript/JSX modules.
 *
 * Usage: node scripts/generate-resume.js
 */

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUT_DIR = path.join(__dirname, '..', 'resume');
const OUT_FILE = path.join(OUT_DIR, 'Adi-Rakhmatullah-Maarif-CV.pdf');
const PHOTO_FILE = path.join(__dirname, '..', 'public', 'my.png');

const COLORS = {
  ink: '#1E2A38',
  subtle: '#5B6B7C',
  faint: '#8A97A5',
  accent: '#2563EB',
  accentSoft: '#EFF4FE',
  line: '#D7DEE6',
};

const profile = {
  name: "Adi Rakhmatullah Ma'arif, S.Kom",
  title: 'Software Engineer',
  tagline: 'Menerjemahkan masalah bisnis jadi solusi digital yang benar-benar terpakai',
  bio: [
    'Lebih dari 6 tahun saya bekerja sebagai Software Engineer, membantu tim dan klien mengubah masalah teknis maupun kebutuhan bisnis menjadi solusi digital yang benar-benar jalan.',
    'Saya tidak terpaku pada satu tools tertentu — fokus saya adalah memilih pendekatan yang paling masuk akal untuk setiap masalah, lalu membangunnya dengan kode yang rapi dan mudah dirawat dalam jangka panjang.',
  ],
  stats: [
    { value: '6+', label: 'Tahun Pengalaman' },
    { value: '20+', label: 'Projek Diselesaikan' },
    { value: '8+', label: 'Klien' },
    { value: '98%', label: 'Tingkat Keberhasilan' },
  ],
};

const contact = [
  { label: 'Email', text: 'adrakhmat996@gmail.com' },
  { label: 'WhatsApp', text: '+62 895-3622-60101' },
  { label: 'LinkedIn', text: 'linkedin.com/in/adi-rakhmatullah-ma-arif-145b3723b' },
  { label: 'GitHub', text: 'github.com/admozrt' },
];

const experiences = [
  {
    title: 'Software Developer',
    company: 'RSJ Sambang Lihum - Prov. Kalimantan Selatan',
    location: 'Kalimantan Selatan, Indonesia',
    period: 'Januari 2024 - Sekarang',
    description: 'Pengembangan Sistem Informasi Manajemen Rumah Sakit (SIMRSGOS)',
    technologies: ['Laminas', 'Laravel', 'Ext.js', 'MySQL', 'Redis', 'Docker'],
    achievements: [
      'Mengimplementasikan sistem manajemen data pasien yang aman',
      'Mengoptimalkan query database yang meningkatkan waktu respon',
      'Memberikan solusi untuk meningkatkan pelayanan kesehatan di rumah sakit',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Mandiri - Freelance',
    location: 'Remote',
    period: 'Februari 2020 - Sekarang',
    description: 'Mengembangkan aplikasi web kustom untuk berbagai klien di berbagai industri',
    technologies: ['PHP', 'Laravel', 'Golang', 'React', 'MySQL', 'Postgree', 'JavaScript', 'TailwindCSS', 'Bootstrap'],
    achievements: [
      'Berhasil menyelesaikan 18+ projek tepat waktu',
      'Mempertahankan tingkat kepuasan klien 98%',
      'Membangun solusi yang melayani 10k+ pengguna',
    ],
  },
];

const projects = [
  {
    title: 'Sinergi Health Baimbai - RME',
    domain: 'Kesehatan',
    link: 'sinergi.dinara-sanur.biz.id',
    description: 'Sistem rekam medis elektronik lintas platform (web, mobile, desktop) untuk klinik dan puskesmas: pendaftaran, pemeriksaan, diagnosa, resep, dan pelaporan.',
    technologies: ['Laravel', 'React', 'React Native', 'MySQL', 'Redis', 'Satu Sehat', 'BPJS', 'PACS'],
  },
  {
    title: 'TMU Ferry - Platform Tiket Kapal',
    domain: 'Perusahaan Pelayaran Kapal',
    link: 'timurmilautama.co.id',
    description: 'Platform tiket kapal dengan penjadwalan real-time, gateway pembayaran terintegrasi, dan antarmuka mobile untuk PT. Timur Mila Utama.',
    technologies: ['Laravel', 'React', 'React Native', 'MySQL', 'Redis', 'Gateway Pembayaran'],
  },
  {
    title: 'SIPARBA - Sistem Informasi Pariwisata Banjarbaru',
    domain: 'Pariwisata & Pemerintahan',
    link: 'siparba.banjarbarukota.go.id',
    description: 'Sistem informasi pariwisata untuk Kota Banjarbaru: data destinasi, acara budaya, dan promosi potensi pariwisata daerah.',
    technologies: ['Laravel', 'React', 'React Native', 'Inertia.js', 'MySQL'],
  },
  {
    title: 'Sistem Manajemen Indikator Mutu & Insiden Keselamatan Pasien',
    domain: 'Kesehatan',
    link: null,
    description: 'Pencatatan Indikator Mutu (IM) & Insiden Keselamatan Pasien (IKP) per unit, dengan realisasi harian yang otomatis terangkum jadi capaian bulanan.',
    technologies: ['Laravel', 'Inertia.js', 'TypeScript', 'TailwindCSS', 'MySQL'],
  },
  {
    title: 'Undangan Pernikahan Digital',
    domain: 'Kreatif & Personal',
    link: null,
    description: 'Kumpulan microsite undangan pernikahan dengan tema visual, animasi, dan interaksi (countdown, galeri, e-gift) yang dirancang khusus per pasangan.',
    technologies: ['React', 'TypeScript', 'Framer Motion', 'CSS Kustom'],
  },
];

const skillGroups = [
  { category: 'Backend', items: ['PHP', 'Laravel', 'Laminas', 'CodeIgniter', 'Golang', 'Goravel'] },
  { category: 'Frontend', items: ['React', 'React Native', 'TypeScript', 'JavaScript', 'JQuery', 'HTML5', 'CSS3', 'TailwindCSS', 'Bootstrap'] },
  { category: 'Database', items: ['MySQL', 'Oracle'] },
  { category: 'Tools', items: ['Docker', 'Git', 'GitHub', 'NPM', 'Expo'] },
];

const education = {
  degree: 'Bachelor of Computer Science',
  school: 'Universitas Kalimantan',
  period: '2017 - 2021',
};

// ---------------------------------------------------------------------------

const PAGE_MARGIN = 40;
const CONTENT_WIDTH = 595.28 - PAGE_MARGIN * 2;

function ensureSpace(doc, neededHeight) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + neededHeight > bottom) {
    doc.addPage();
  }
}

function divider(doc, y) {
  doc
    .moveTo(PAGE_MARGIN, y)
    .lineTo(PAGE_MARGIN + CONTENT_WIDTH, y)
    .lineWidth(0.75)
    .strokeColor(COLORS.line)
    .stroke();
}

function sectionHeading(doc, title) {
  ensureSpace(doc, 30);
  doc.moveDown(0.6);
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(COLORS.accent)
    .text(title.toUpperCase(), PAGE_MARGIN, doc.y, { characterSpacing: 0.6 });
  divider(doc, doc.y + 4);
  doc.moveDown(0.8);
}

function drawPhoto(doc, x, y, width, height) {
  if (!fs.existsSync(PHOTO_FILE)) return;

  doc.save();
  doc.rect(x, y, width, height).clip();
  doc.image(PHOTO_FILE, x, y, { width, height });
  doc.restore();

  doc
    .rect(x, y, width, height)
    .lineWidth(1.5)
    .strokeColor(COLORS.accent)
    .stroke();
}

function twoColumnRow(doc, leftText, rightText, y, options = {}) {
  const leftWidth = options.leftWidth || CONTENT_WIDTH * 0.68;
  const rightWidth = CONTENT_WIDTH - leftWidth;
  const rightX = PAGE_MARGIN + leftWidth;

  doc.font(options.leftFont || 'Helvetica-Bold').fontSize(options.leftSize || 10);
  const leftHeight = doc.heightOfString(leftText, { width: leftWidth });
  doc.fillColor(options.leftColor || COLORS.ink).text(leftText, PAGE_MARGIN, y, { width: leftWidth });

  doc.font(options.rightFont || 'Helvetica').fontSize(options.rightSize || 8.5);
  const rightHeight = doc.heightOfString(rightText, { width: rightWidth });
  doc.fillColor(options.rightColor || COLORS.faint).text(rightText, rightX, y, { width: rightWidth, align: 'right' });

  return y + Math.max(leftHeight, rightHeight);
}

function tagRow(doc, items, x, y, options = {}) {
  const fontSize = options.fontSize || 8;
  const paddingX = 6;
  const paddingY = 3;
  const gap = 5;
  const maxWidth = options.maxWidth || CONTENT_WIDTH;
  doc.font('Helvetica').fontSize(fontSize);

  let cursorX = x;
  let cursorY = y;
  const rowHeight = fontSize + paddingY * 2;

  items.forEach((item) => {
    const w = doc.widthOfString(item) + paddingX * 2;
    if (cursorX + w > x + maxWidth) {
      cursorX = x;
      cursorY += rowHeight + 4;
    }
    doc
      .roundedRect(cursorX, cursorY, w, rowHeight, 3)
      .fillColor(COLORS.accentSoft)
      .fill();
    doc
      .fillColor(COLORS.subtle)
      .text(item, cursorX + paddingX, cursorY + paddingY, { lineBreak: false });
    cursorX += w + gap;
  });

  return cursorY + rowHeight;
}

function generate() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: PAGE_MARGIN, bottom: PAGE_MARGIN, left: PAGE_MARGIN, right: PAGE_MARGIN },
    info: {
      Title: `CV - ${profile.name}`,
      Author: profile.name,
      Subject: 'Curriculum Vitae',
    },
  });

  doc.pipe(fs.createWriteStream(OUT_FILE));

  // ---------- Header ----------
  const photoWidth = 90;
  const photoHeight = photoWidth * (1120 / 846); // matches source aspect ratio, no cropping
  drawPhoto(doc, PAGE_MARGIN, PAGE_MARGIN, photoWidth, photoHeight);

  const textX = PAGE_MARGIN + photoWidth + 22;
  const textWidth = CONTENT_WIDTH - (photoWidth + 22);

  doc
    .font('Helvetica-Bold')
    .fontSize(20)
    .fillColor(COLORS.ink)
    .text(profile.name, textX, PAGE_MARGIN - 2, { width: textWidth });

  doc
    .font('Helvetica-Bold')
    .fontSize(12.5)
    .fillColor(COLORS.accent)
    .text(profile.title, textX, doc.y + 2, { width: textWidth });

  doc
    .font('Helvetica-Oblique')
    .fontSize(9.5)
    .fillColor(COLORS.subtle)
    .text(profile.tagline, textX, doc.y + 3, { width: textWidth });

  doc.font('Helvetica').fontSize(9).fillColor(COLORS.ink);
  const contactLine = contact.map((c) => `${c.label}: ${c.text}`).join('    |    ');
  doc.text(contactLine, textX, doc.y + 8, { width: textWidth });

  doc.y = Math.max(doc.y, PAGE_MARGIN + photoHeight) + 10;
  divider(doc, doc.y);
  doc.moveDown(1);

  // ---------- Profile summary ----------
  sectionHeading(doc, 'Ringkasan Profil');
  doc.font('Helvetica').fontSize(9.5).fillColor(COLORS.ink);
  profile.bio.forEach((paragraph, i) => {
    doc.text(paragraph, PAGE_MARGIN, doc.y, { width: CONTENT_WIDTH, align: 'justify' });
    if (i < profile.bio.length - 1) doc.moveDown(0.5);
  });
  doc.moveDown(0.8);

  const statBoxWidth = CONTENT_WIDTH / profile.stats.length;
  const statsY = doc.y;
  profile.stats.forEach((stat, i) => {
    const x = PAGE_MARGIN + i * statBoxWidth;
    doc
      .font('Helvetica-Bold')
      .fontSize(15)
      .fillColor(COLORS.accent)
      .text(stat.value, x, statsY, { width: statBoxWidth, align: 'center' });
    doc
      .font('Helvetica')
      .fontSize(7.5)
      .fillColor(COLORS.subtle)
      .text(stat.label, x, doc.y, { width: statBoxWidth, align: 'center' });
  });
  doc.y = doc.y + 6;

  // ---------- Experience ----------
  sectionHeading(doc, 'Pengalaman Kerja');
  experiences.forEach((exp, idx) => {
    ensureSpace(doc, 70);
    const rowY = doc.y;
    const afterHeaderY = twoColumnRow(doc, `${exp.title} — ${exp.company}`, exp.period, rowY, {
      leftSize: 10.5,
      rightSize: 8.5,
    });

    doc
      .font('Helvetica-Oblique')
      .fontSize(8.5)
      .fillColor(COLORS.subtle)
      .text(exp.location, PAGE_MARGIN, afterHeaderY + 1, { width: CONTENT_WIDTH });

    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor(COLORS.ink)
      .text(exp.description, PAGE_MARGIN, doc.y + 3, { width: CONTENT_WIDTH });

    doc.moveDown(0.3);
    exp.achievements.forEach((a) => {
      ensureSpace(doc, 14);
      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(COLORS.ink)
        .text(`•  ${a}`, PAGE_MARGIN + 4, doc.y, { width: CONTENT_WIDTH - 4 });
    });

    doc.moveDown(0.4);
    doc
      .font('Helvetica-Oblique')
      .fontSize(8)
      .fillColor(COLORS.faint)
      .text(exp.technologies.join(' · '), PAGE_MARGIN, doc.y, { width: CONTENT_WIDTH });

    if (idx < experiences.length - 1) doc.moveDown(0.7);
  });

  // ---------- Projects ----------
  sectionHeading(doc, 'Proyek Unggulan');
  projects.forEach((proj, idx) => {
    ensureSpace(doc, 55);
    const rowY = doc.y;
    const afterHeaderY = twoColumnRow(doc, proj.title, proj.domain, rowY, {
      leftSize: 10,
      rightSize: 8,
    });

    doc
      .font('Helvetica')
      .fontSize(8.5)
      .fillColor(COLORS.ink)
      .text(proj.description, PAGE_MARGIN, afterHeaderY + 2, { width: CONTENT_WIDTH });

    const techLine = proj.technologies.join(' · ') + (proj.link ? `    —    ${proj.link}` : '');
    doc
      .font('Helvetica-Oblique')
      .fontSize(8)
      .fillColor(COLORS.subtle)
      .text(techLine, PAGE_MARGIN, doc.y + 3, { width: CONTENT_WIDTH });

    if (idx < projects.length - 1) doc.moveDown(0.6);
  });

  // ---------- Skills ----------
  sectionHeading(doc, 'Keahlian');
  skillGroups.forEach((group) => {
    ensureSpace(doc, 30);
    doc
      .font('Helvetica-Bold')
      .fontSize(9)
      .fillColor(COLORS.ink)
      .text(group.category, PAGE_MARGIN, doc.y);
    const endY = tagRow(doc, group.items, PAGE_MARGIN, doc.y + 3);
    doc.y = endY + 6;
  });

  // ---------- Education ----------
  sectionHeading(doc, 'Pendidikan');
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(COLORS.ink)
    .text(education.degree, PAGE_MARGIN, doc.y);
  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(COLORS.subtle)
    .text(`${education.school}    •    ${education.period}`, PAGE_MARGIN, doc.y + 1);

  doc.end();

  return OUT_FILE;
}

const outputFile = generate();
console.log(`Resume generated: ${outputFile}`);
