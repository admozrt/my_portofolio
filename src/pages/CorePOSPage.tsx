import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Boxes,
  ShoppingCart,
  LayoutDashboard,
  SlidersHorizontal,
  Receipt,
  Palette,
  KeyRound,
  Package,
  ChevronDown,
  Check,
  History,
  FileBarChart,
  Smartphone,
  X,
  Copy,
  User,
  Mail,
  Phone,
  Linkedin,
  Github,
} from 'lucide-react';
import { SEOHead } from '../components/ui/SEOHead';

/**
 * Landing page produk "Core POS" — diadaptasi dari halaman marketing asli
 * (apps/web/src/pages/Landing.tsx pada repo pos-kasirku). Palet, copy, dan
 * struktur konten dipertahankan; bagian yang bergantung pada auth/dashboard
 * produk (login, register, "Buka Dashboard") dilepas karena portofolio ini
 * tidak punya backend produk — CTA di sini selalu membuka modal kontak.
 */
const BRAND = {
  name: 'Core POS by Dirakhmat',
  tagline: 'Sistem Kasir Dinamis Multi-Sektor',
};

const CONTACT = [
  { icon: <Mail className="h-4 w-4" />, label: 'Email', value: 'adrakhmat996@gmail.com', href: 'mailto:adrakhmat996@gmail.com' },
  { icon: <Phone className="h-4 w-4" />, label: 'WhatsApp', value: '+62 895-3622-60101', href: 'https://wa.me/6289536226101' },
  { icon: <Linkedin className="h-4 w-4" />, label: 'LinkedIn', value: "Adi Rakhmatullah Ma'arif", href: 'https://linkedin.com/in/adi-rakhmatullah-ma-arif-145b3723b' },
  { icon: <Github className="h-4 w-4" />, label: 'GitHub', value: 'admozart', href: 'https://github.com/admozart' },
];

function LogoMark({ boxClass }: { boxClass: string }) {
  return (
    <div className={`${boxClass} overflow-hidden p-0`}>
      <img src="/corepos/icon.png" alt={BRAND.name} className="h-full w-full object-contain" />
    </div>
  );
}

/* Scroll-reveal murni via IntersectionObserver, tanpa dependency animasi tambahan. */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const FEATURES = [
  { icon: KeyRound, title: 'RBAC Granular', desc: '6 peran bawaan — super-admin, owner, manajer, kasir, dapur, pelanggan — dengan izin per-modul, bukan sekadar admin/user.' },
  { icon: Package, title: 'Dynamic Product Engine', desc: 'Satu produk bisa berupa racikan, barang fisik, paket, atau jasa — lengkap varian, modifier, dan custom field.' },
  { icon: SlidersHorizontal, title: 'Template Sektor', desc: 'Pilih Retail, F&B, Jasa, Apotek, atau Koperasi — field produk & alur transaksi menyesuaikan otomatis, tanpa kode.' },
  { icon: ShoppingCart, title: 'Kasir/POS Secepat Kilat', desc: 'Grid menu, keranjang real-time, mode Dine-in/Take Away/Delivery, dan pajak PB1 yang bisa dinyalakan/dimatikan kapan saja.' },
  { icon: Boxes, title: 'Stok & FEFO', desc: 'Lacak batch dan kedaluwarsa — sistem otomatis mendahulukan stok yang paling dekat kedaluwarsa saat terjual.' },
  { icon: LayoutDashboard, title: 'Dashboard Real-time', desc: 'Omzet per jam, menu terlaris, dan transaksi terakhir — dihitung langsung dari data transaksi, bukan mock.' },
  { icon: Receipt, title: 'Struk Digital', desc: 'Setiap transaksi punya tautan struk publik yang bisa dicetak atau dikirim langsung ke nomor WhatsApp pelanggan.' },
  { icon: Palette, title: 'White-label Penuh', desc: 'Ganti nama brand, logo, dan 9 warna tema — seluruh tampilan ikut berubah dalam hitungan detik.' },
  { icon: ShieldCheck, title: 'Sesi Aman 2 Jam', desc: 'Validasi ulang otomatis tiap 2 jam dengan peringatan sebelum berakhir, plus konfirmasi untuk setiap aksi vital.' },
  { icon: History, title: 'Riwayat & Open Bill', desc: 'Buka bill tanpa bayar dulu, tambah pesanan kapan saja, lalu finalisasi dari Riwayat Transaksi — lengkap filter status dan periode.' },
  { icon: FileBarChart, title: 'Laporan & Ekspor', desc: 'Omzet, metode pembayaran, dan produk terlaris per periode — unduh langsung sebagai CSV atau PDF untuk pembukuan.' },
  { icon: Smartphone, title: 'Mobile-First & Responsif', desc: 'Kasir, laporan, hingga riwayat transaksi nyaman dipakai dari HP atau tablet — bukan cuma desktop.' },
];

const SECTORS: { glyph: string; name: string; desc: string; tint: string; ink: string }[] = [
  { glyph: 'R', name: 'Retail / Minimarket', desc: 'Barcode, stok varian, multi-unit', tint: '#e2e6ec', ink: '#4e6079' },
  { glyph: 'F', name: 'F&B / Café / Resto', desc: 'Meja, open bill, dapur, modifier', tint: '#f1e4d3', ink: '#b4703b' },
  { glyph: 'J', name: 'Jasa', desc: 'Antrian servis, estimasi selesai', tint: '#efe1de', ink: '#a85c55' },
  { glyph: 'A', name: 'Apotek / Klinik', desc: 'Resep, batch/expired (FEFO)', tint: '#e6ebdd', ink: '#5e7346' },
  { glyph: 'K', name: 'Koperasi', desc: 'Anggota, simpan-pinjam, saldo', tint: '#f3e8d6', ink: '#9a7b3e' },
];

const STEPS = [
  { n: '01', title: 'Pilih Sektor', desc: 'Tentukan jenis usaha — field & alur transaksi otomatis menyesuaikan.' },
  { n: '02', title: 'Atur Produk', desc: 'Tambahkan menu, varian, modifier, atau layanan dalam hitungan menit.' },
  { n: '03', title: 'Mulai Transaksi', desc: 'Kasir langsung siap pakai — cepat, akurat, dengan struk digital.' },
  { n: '04', title: 'Pantau Dashboard', desc: 'Lihat omzet, produk terlaris, dan stok secara real-time.' },
];

const FAQ = [
  { q: 'Apakah data tersimpan di server saya sendiri?', a: 'Ya. Core POS diinstal on-premise per klien — data sepenuhnya berada di infrastruktur Anda, bukan cloud multi-tenant pihak ketiga.' },
  { q: 'Bisa dipakai untuk lebih dari satu cabang?', a: 'Fondasi multi-cabang sudah dirancang dalam arsitektur sistem dan akan terus dikembangkan pada rilis berikutnya.' },
  { q: 'Apakah mendukung printer struk thermal?', a: 'Struk digital sudah tersedia (cetak browser atau bagikan via WhatsApp); integrasi ESC/POS langsung ada di roadmap.' },
  { q: 'Bagaimana keamanan akun & data transaksi?', a: 'Otentikasi berbasis sesi dengan validasi ulang otomatis tiap 2 jam, kontrol akses granular per peran, dan pencatatan aktivitas (audit trail) untuk perubahan sensitif.' },
];

export const CorePOSPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const primaryCta = (className: string, withIcon = true) => (
    <button type="button" onClick={() => setContactOpen(true)} className={className}>
      Coba Gratis
      {withIcon && <ArrowRight className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-corepos-cream font-sans text-corepos-ink">
      <SEOHead
        data={{
          title: 'Core POS by Dirakhmat — Sistem Kasir Dinamis Multi-Sektor',
          description:
            'Satu platform kasir untuk Retail, F&B, Jasa, Apotek, dan Koperasi — dikonfigurasi bukan dibangun ulang. RBAC granular, stok FEFO, struk digital, dan dashboard real-time.',
          keywords: ['Core POS', 'Sistem Kasir', 'Aplikasi POS', 'Software Kasir Multi-Sektor', 'Dirakhmat'],
          author: "Adi Rakhmatullah Ma'arif",
          url: 'https://dirakhmat.app/corepos',
          image: 'https://dirakhmat.app/corepos/icon.png',
          type: 'website',
        }}
      />

      {/* ---------------- Nav ---------------- */}
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-300 ${
          scrolled ? 'border-corepos-line bg-corepos-cream/85 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex min-h-[60px] max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:h-[72px] sm:gap-0 sm:px-6 sm:py-0">
          <Link to="/" className="flex shrink-0 items-center gap-1.5">
            <ArrowLeft className="h-4 w-4 text-corepos-ink-soft" />
            <span className="hidden text-[13px] font-semibold text-corepos-ink-soft sm:block">Portofolio</span>
          </Link>
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <LogoMark boxClass="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] sm:h-10 sm:w-10" />
            <span className="hidden truncate font-serif text-lg tracking-tight sm:block">{BRAND.name}</span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <nav className="hidden items-center gap-6 md:flex">
              <a href="#fitur" className="text-[13.5px] font-semibold text-corepos-ink-soft transition-colors hover:text-corepos-ink">Fitur</a>
              <a href="#sektor" className="text-[13.5px] font-semibold text-corepos-ink-soft transition-colors hover:text-corepos-ink">Sektor</a>
              <a href="#faq" className="text-[13.5px] font-semibold text-corepos-ink-soft transition-colors hover:text-corepos-ink">FAQ</a>
            </nav>
            {primaryCta('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-corepos-ink px-3 py-1.5 text-[11.5px] font-semibold text-corepos-gold transition-transform hover:scale-105 sm:px-4 sm:py-2 sm:text-[13px]', false)}
          </div>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-corepos-ink pb-16 pt-24 text-corepos-cream sm:pb-28 sm:pt-40">
        <div aria-hidden className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-corepos-accent opacity-40 blur-[110px]" />
        <div aria-hidden className="pointer-events-none absolute -right-24 top-40 h-[360px] w-[360px] rounded-full bg-corepos-gold opacity-30 blur-[100px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6">
          <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2.5">
            <LogoMark boxClass="flex h-12 w-12 items-center justify-center sm:h-16 sm:w-16" />
            <span className="font-serif text-lg tracking-tight sm:text-2xl">{BRAND.name}</span>
          </div>

          <Reveal className="mt-6 inline-flex items-center gap-2 rounded-full border border-corepos-gold/20 bg-white/5 px-4 py-1.5 text-[12.5px] font-semibold text-corepos-gold/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-corepos-accent" />
            Satu platform, semua sektor usaha
          </Reveal>

          <Reveal delay={80} className="mt-2 max-w-4xl">
            <h1 className="font-serif text-[38px] leading-[1.1] tracking-tight sm:text-[52px] lg:text-[64px]">
              Sistem kasir yang <span className="italic text-corepos-gold">menyesuaikan bisnis Anda</span>, bukan sebaliknya.
            </h1>
          </Reveal>

          <Reveal delay={160} className="mt-6 max-w-xl">
            <p className="text-[16px] leading-relaxed text-corepos-gold/60 sm:text-[18px]">
              Retail, F&amp;B, jasa, apotek, hingga koperasi — satu platform kasir yang dikonfigurasi, bukan dibangun ulang.
              Siap pakai dalam hitungan menit.
            </p>
          </Reveal>

          <Reveal delay={240} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            {primaryCta('inline-flex items-center gap-2 rounded-full bg-corepos-gold px-7 py-3 text-[14px] font-bold text-corepos-ink transition-transform hover:scale-105')}
            <a
              href="#fitur"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-[14px] font-bold text-corepos-gold transition-colors hover:border-corepos-gold/40 hover:bg-white/5"
            >
              Lihat Fitur
            </a>
          </Reveal>

          <Reveal delay={340} className="mt-20 w-full">
            <PosMockup />
          </Reveal>
        </div>
      </section>

      {/* ---------------- Stat bar ---------------- */}
      <section className="border-b border-corepos-line bg-corepos-surface py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 sm:grid-cols-4">
          {[
            ['6', 'Peran akses granular'],
            ['5', 'Template sektor siap pakai'],
            ['4', 'Tipe produk dinamis'],
            ['100%', 'Konfigurasi tanpa kode'],
          ].map(([num, label]) => (
            <Reveal key={label} className="text-center">
              <div className="font-serif text-4xl text-corepos-accent sm:text-5xl">{num}</div>
              <div className="mt-1.5 text-[13px] font-semibold text-corepos-muted">{label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Katalog Publik ---------------- */}
      <section id="katalog" className="mx-auto max-w-7xl px-6 py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-corepos-accent">Katalog Publik</span>
          <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Menu digital yang langsung bisa dicoba
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-corepos-muted">
            Setiap instalasi otomatis punya halaman katalog publik — tanpa login, mengikuti nama, logo, dan warna brand
            Anda sendiri. Cocok dipasang sebagai menu QR di meja atau etalase.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-14">
          <CatalogShowcaseMockup />
        </Reveal>
      </section>

      {/* ---------------- Fitur ---------------- */}
      <section id="fitur" className="mx-auto max-w-7xl px-6 py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-corepos-accent">Fitur</span>
          <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Semua yang dibutuhkan kasir modern
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-corepos-muted">
            Bukan janji roadmap — setiap fitur di bawah ini sudah berjalan di dalam sistem.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <div className="group h-full rounded-2xl border border-corepos-line-soft bg-corepos-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-corepos-accent/25 hover:shadow-[0_20px_40px_-24px_rgba(43,32,25,0.25)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-corepos-accent/10 text-corepos-accent transition-colors group-hover:bg-corepos-accent group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-[16px] font-extrabold">{f.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-corepos-muted">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Sektor ---------------- */}
      <section id="sektor" className="bg-corepos-surface-2 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-corepos-accent">Business Type Template</span>
            <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Satu instalasi, lima sektor usaha
            </h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-corepos-muted">
              Pilih template saat setup — field produk, alur transaksi, dan preset pajak menyesuaikan otomatis.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SECTORS.map((s, i) => (
              <Reveal key={s.name} delay={i * 70}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-corepos-line-soft bg-corepos-surface p-5 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[13px] font-serif text-2xl" style={{ background: s.tint, color: s.ink }}>
                    {s.glyph}
                  </div>
                  <div>
                    <div className="text-[14.5px] font-extrabold leading-snug">{s.name}</div>
                    <div className="mt-1 text-[12.5px] leading-relaxed text-corepos-muted">{s.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Cara kerja ---------------- */}
      <section id="cara-kerja" className="mx-auto max-w-7xl px-6 py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-corepos-accent">Cara Kerja</span>
          <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">Siap pakai dalam 4 langkah</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90} className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-corepos-accent/40 font-serif text-2xl text-corepos-accent">
                {s.n}
              </div>
              <h3 className="mt-3 text-[16px] font-extrabold">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-corepos-muted">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="absolute right-[-16px] top-6 hidden text-corepos-line lg:block">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- CTA banner ---------------- */}
      <section className="relative overflow-hidden bg-corepos-ink py-24 text-corepos-cream">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-corepos-accent opacity-25 blur-[130px]" />
        <Reveal className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">Siap mengganti kasir lama Anda?</h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-corepos-gold/60">
            Mulai atur sektor usaha, produk, dan tim Anda hari ini — tanpa kartu kredit, tanpa instalasi rumit.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {primaryCta('inline-flex items-center gap-2 rounded-full bg-corepos-gold px-7 py-3 text-[14px] font-bold text-corepos-ink transition-transform hover:scale-105')}
          </div>
        </Reveal>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-28">
        <Reveal className="text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-corepos-accent">FAQ</span>
          <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">Pertanyaan umum</h2>
        </Reveal>

        <div className="mt-12 flex flex-col gap-3">
          {FAQ.map((item, i) => {
            const open = openFaq === i;
            return (
              <Reveal key={item.q} delay={i * 60}>
                <div className="overflow-hidden rounded-2xl border border-corepos-line-soft bg-corepos-surface">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[14.5px] font-bold">{item.q}</span>
                    <ChevronDown className={`h-4 w-4 flex-none text-corepos-muted transition-transform duration-300 ${open ? 'rotate-180 text-corepos-accent' : ''}`} />
                  </button>
                  <div className="grid transition-all duration-300" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-[13.5px] leading-relaxed text-corepos-muted">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-white/10 bg-corepos-ink py-14 text-corepos-gold/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <LogoMark boxClass="flex h-8 w-8 items-center justify-center rounded-[9px]" />
              <span className="font-serif text-xl text-corepos-gold">{BRAND.name}</span>
            </div>
            <p className="max-w-xs text-[13px] leading-relaxed">{BRAND.tagline} — dikonfigurasi bukan dibangun ulang.</p>
          </div>

          <div className="flex gap-10 sm:gap-14">
            <div className="flex flex-col gap-2.5 text-[13px]">
              <span className="font-bold text-corepos-gold">Produk</span>
              <a href="#katalog" className="hover:text-corepos-gold">Katalog Menu</a>
              <a href="#fitur" className="hover:text-corepos-gold">Fitur</a>
              <a href="#sektor" className="hover:text-corepos-gold">Sektor</a>
              <a href="#cara-kerja" className="hover:text-corepos-gold">Cara Kerja</a>
            </div>
            <div className="flex flex-col gap-2.5 text-[13px]">
              <span className="font-bold text-corepos-gold">Portofolio</span>
              <Link to="/" className="hover:text-corepos-gold">Kembali ke Beranda</Link>
              <Link to="/project-wedding" className="hover:text-corepos-gold">Proyek Lain</Link>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-2 border-t border-white/10 px-6 pt-6 text-[12px] text-corepos-gold/40">
          <span>© {new Date().getFullYear()} {BRAND.name}. {BRAND.tagline}.</span>
          <Link to="/" className="font-semibold transition-colors hover:text-corepos-gold">
            Sebuah proyek Adi Rakhmatullah Ma'arif
          </Link>
        </div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
};

/* Replika ringkas layar Kasir/POS — hero visual, statis (bukan aset). */
function PosMockup() {
  const items = [
    { name: 'Espresso', price: 'Rp22.000', glyph: 'E', tint: '#f1e4d3', ink: '#b4703b' },
    { name: 'Caffè Latte', price: 'Rp34.000', glyph: 'C', tint: '#e6ebdd', ink: '#5e7346' },
    { name: 'Kopi Susu Aren', price: 'Rp28.000', glyph: 'K', tint: '#efe1de', ink: '#a85c55' },
    { name: 'Butter Croissant', price: 'Rp28.000', glyph: 'B', tint: '#e2e6ec', ink: '#4e6079' },
  ];
  const cart = [
    { name: 'Caffè Latte', qty: 2, total: 'Rp68.000' },
    { name: 'Butter Croissant', qty: 1, total: 'Rp28.000' },
  ];

  return (
    <div className="mx-auto max-w-4xl rounded-[16px] border border-white/10 bg-white/[0.04] p-1.5 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.6)] backdrop-blur sm:rounded-[22px] sm:p-2.5">
      <div className="flex items-center gap-1.5 px-2 pb-2.5 pt-1">
        <span className="h-2.5 w-2.5 rounded-full bg-corepos-danger/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-corepos-gold/50" />
        <span className="h-2.5 w-2.5 rounded-full bg-corepos-success/60" />
      </div>
      <div className="grid grid-cols-1 overflow-hidden rounded-xl bg-corepos-cream-soft text-left sm:grid-cols-[1fr_260px] sm:rounded-2xl">
        <div className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[12px] font-extrabold text-corepos-ink">Espresso Based</span>
            <span className="text-[10.5px] font-semibold text-corepos-muted">Kasir · Rani</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {items.map((it) => (
              <div key={it.name} className="rounded-xl border border-corepos-line-soft bg-corepos-surface p-2.5">
                <div className="flex h-12 items-center justify-center rounded-lg font-serif text-lg" style={{ background: it.tint, color: it.ink }}>
                  {it.glyph}
                </div>
                <div className="mt-2 truncate text-[11px] font-bold text-corepos-ink">{it.name}</div>
                <div className="text-[10.5px] font-extrabold text-corepos-accent">{it.price}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col border-t border-corepos-line-soft bg-corepos-surface p-4 sm:border-l sm:border-t-0">
          <div className="text-[11px] font-extrabold text-corepos-ink">Open Bill #204</div>
          <div className="mt-3 flex-1 space-y-2.5">
            {cart.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-corepos-ink-soft">{c.qty}× {c.name}</span>
                <span className="font-bold text-corepos-ink">{c.total}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-dashed border-corepos-line pt-3">
            <div className="flex items-center justify-between text-[10.5px] text-corepos-muted">
              <span>Subtotal</span>
              <span className="font-semibold">Rp96.000</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10.5px] text-corepos-muted">
              <span>PB1 (10%)</span>
              <span className="font-semibold">Rp9.600</span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between border-t border-corepos-line pt-2.5">
              <span className="text-[12px] font-extrabold text-corepos-ink">Total</span>
              <span className="text-[16px] font-extrabold text-corepos-ink">Rp105.600</span>
            </div>
          </div>
          <div className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-corepos-ink text-[11px] font-bold text-corepos-gold">
            <Check className="h-3.5 w-3.5" /> Bayar Rp105.600
          </div>
        </div>
      </div>
    </div>
  );
}

/* Replika ringkas hero + reel /menu — cuplikan Katalog Menu Publik. */
function CatalogShowcaseMockup() {
  const featured = { name: 'Harfa Signature', price: 'Rp42.000', glyph: 'V', tint: '#f1e4d3', ink: '#b4703b', desc: 'Espresso ganda, susu creamy, karamel rumahan.' };
  const reel = [
    { name: 'Espresso', price: 'Rp22.000', glyph: 'E', tint: '#f1e4d3', ink: '#b4703b' },
    { name: 'Caffè Latte', price: 'Rp34.000', glyph: 'C', tint: '#e6ebdd', ink: '#5e7346' },
    { name: 'Kopi Susu Aren', price: 'Rp28.000', glyph: 'K', tint: '#efe1de', ink: '#a85c55' },
    { name: 'Matcha Latte', price: 'Rp35.000', glyph: 'M', tint: '#e2e6ec', ink: '#4e6079' },
  ];

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-[22px] border border-corepos-line-soft bg-corepos-surface shadow-[0_40px_90px_-40px_rgba(43,32,25,0.25)]">
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-2 p-6 sm:p-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-corepos-accent">Signature</span>
          <h3 className="font-serif text-2xl text-corepos-ink sm:text-3xl">{featured.name}</h3>
          <p className="max-w-xs text-[13px] text-corepos-muted">{featured.desc}</p>
          <span className="mt-1 text-xl font-extrabold text-corepos-ink">{featured.price}</span>
        </div>
        <div className="flex h-32 flex-none items-center justify-center sm:h-auto sm:w-[38%]" style={{ background: featured.tint }}>
          <span className="font-serif text-6xl" style={{ color: featured.ink }}>{featured.glyph}</span>
        </div>
      </div>
      <div className="flex gap-2.5 overflow-x-auto border-t border-corepos-line-soft bg-corepos-surface-2 p-4">
        {reel.map((it, i) => (
          <div key={it.name} className={`flex w-[100px] flex-none flex-col gap-1.5 rounded-xl border-2 p-2 ${i === 0 ? 'border-corepos-accent bg-corepos-accent/10' : 'border-transparent bg-corepos-surface'}`}>
            <div className="flex h-11 items-center justify-center rounded-lg" style={{ background: it.tint }}>
              <span className="font-serif text-base" style={{ color: it.ink }}>{it.glyph}</span>
            </div>
            <span className="truncate text-[10.5px] font-bold text-corepos-ink">{it.name}</span>
            <span className="text-[10px] font-semibold text-corepos-muted-soft">{it.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Modal kontak — pengganti alur registrasi self-service produk. */
function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-corepos-ink/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[22px] border border-corepos-line-soft bg-corepos-surface shadow-[0_40px_90px_-30px_rgba(43,32,25,0.5)]"
      >
        <div className="relative">
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-corepos-ink/40 text-corepos-cream backdrop-blur transition-colors hover:bg-corepos-ink/60"
          >
            <X className="h-4 w-4" />
          </button>

          {!photoError ? (
            <img src="/my.png" alt="Foto profil" onError={() => setPhotoError(true)} className="h-56 w-full object-cover" />
          ) : (
            <div className="flex h-56 w-full items-center justify-center bg-corepos-accent/10">
              <User className="h-16 w-16 text-corepos-accent/50" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-1.5 px-6 pb-2 pt-6 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-corepos-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-corepos-accent" />
            Kontak
          </span>
          <h2 className="font-serif text-3xl text-corepos-ink">Establish Connection</h2>
          <p className="text-[13.5px] text-corepos-muted">Ada sistem yang ingin dibangun atau dibenahi? Hubungi saya.</p>
          <span className="mt-1 text-[11.5px] text-corepos-muted-soft">Response Time: &lt; 24 hours</span>
        </div>

        <div className="mt-4 flex flex-col border-t border-corepos-line-soft">
          {CONTACT.map((c, i) => (
            <CopyRow key={c.label} {...c} last={i === CONTACT.length - 1} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function CopyRow({ label, value, href, last = false }: { label: string; value: string; href: string; last?: boolean }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard tidak tersedia — abaikan */
    }
  };

  return (
    <div className={`flex items-center justify-between gap-3 px-6 py-3.5 ${!last ? 'border-b border-corepos-line-soft' : ''}`}>
      <div className="min-w-0">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-corepos-accent">{label}</div>
        <div className="truncate text-[14px] font-semibold text-corepos-ink">{value}</div>
      </div>
      <div className="flex flex-none items-center gap-1.5">
        <button
          onClick={onCopy}
          title={`Salin ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-corepos-line text-corepos-ink-soft transition-colors hover:border-corepos-accent/35 hover:text-corepos-accent"
        >
          {copied ? <Check className="h-4 w-4 text-corepos-success" /> : <Copy className="h-4 w-4" />}
        </button>
        <a
          href={href}
          target={href.startsWith('mailto:') ? undefined : '_blank'}
          rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          title={`Buka ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-corepos-line text-corepos-ink-soft transition-colors hover:border-corepos-accent/35 hover:text-corepos-accent"
        >
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
