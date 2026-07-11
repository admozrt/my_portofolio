export interface ComplianceCard {
  title: string;
  stampLabel: 'IMPLEMENTED' | 'COMPLIANT' | 'SECURED';
  shortDescription: string;
  detailDescription: string;
  referenceNumber: string;
}

export const complianceCards: ComplianceCard[] = [
  {
    title: 'RBAC & Keamanan Data',
    stampLabel: 'IMPLEMENTED',
    shortDescription:
      'Kontrol akses berbasis peran memastikan setiap pengguna hanya bisa mengakses data sesuai kewenangannya.',
    detailDescription:
      'Setiap sistem yang dibangun menerapkan pemisahan peran (mis. admin, staf, pasien/pengguna) dengan validasi otorisasi di level backend, bukan hanya disembunyikan di antarmuka.',
    referenceNumber: 'DOC-2026-01',
  },
  {
    title: 'Integrasi Standar (SATUSEHAT/HL7 FHIR)',
    stampLabel: 'COMPLIANT',
    shortDescription:
      'Sistem kesehatan yang dibangun terintegrasi dengan standar interoperabilitas nasional.',
    detailDescription:
      'Pada proyek Sinergi Health Baimbai - RME, sistem terhubung dengan Satu Sehat dan BPJS mengikuti kebutuhan integrasi standar kesehatan nasional yang berlaku.',
    referenceNumber: 'DOC-2026-02',
  },
  {
    title: 'Manajemen Server Aman',
    stampLabel: 'SECURED',
    shortDescription:
      'Infrastruktur server dikelola dengan praktik keamanan jaringan yang tidak mengekspos akses langsung ke publik.',
    detailDescription:
      'Akses administratif ke server menggunakan jalur privat (mis. VPN/Tailscale), bukan expose port publik langsung, untuk mengurangi permukaan serangan.',
    referenceNumber: 'DOC-2026-03',
  },
  {
    title: 'Integrasi Payment Gateway',
    stampLabel: 'IMPLEMENTED',
    shortDescription:
      'Transaksi pembayaran diproses melalui payment gateway berlisensi, bukan penanganan dana secara manual.',
    detailDescription:
      'Pada proyek TMU Ferry (PT. Timur Mila Utama), pembayaran tiket kapal terintegrasi dengan Midtrans, Xendit, dan Bank BCA. Pada proyek BPPRD Kota Banjarbaru, pembayaran pajak/retribusi daerah terintegrasi dengan Bank Kalsel.',
    referenceNumber: 'DOC-2026-04',
  },
];
