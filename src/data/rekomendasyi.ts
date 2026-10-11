/**
 * Isi halaman /rekomendasyi. Kerangka dan teks halaman berasal dari desain
 * Claude Design "Rekomendasyi Portfolio"; daftar video adalah konten asli
 * @rekomendasyi di TikTok dan Instagram.
 *
 * MENAMBAH VIDEO: tambahkan satu entri di `VIDEOS` dan judul Indonesianya di
 * `ID_VID`. `embed` menerima tautan apa adanya:
 *   TikTok    https://www.tiktok.com/@akun/video/ID · https://www.tiktok.com/embed/v2/ID
 *   Instagram https://www.instagram.com/reel/KODE/ (boleh dengan /embed di belakang)
 *   YouTube   https://youtu.be/ID · https://youtube.com/shorts/ID
 * Tautan yang tidak dikenali jatuh ke pemutar placeholder (pola garis).
 *
 * Thumbnail: YouTube diambil otomatis. TikTok/Instagram tidak menyediakannya
 * tanpa API, jadi pakai `thumb` (mis. '/rekomendasyi/ig-fore.jpg' di
 * `public/`); kosong = pola garis dengan warna `hue`.
 *
 * Field `format`, `secs`, `notes`, `why`, `items` opsional. Panel detail hanya
 * menampilkan bagian yang terisi; tidak ada yang dikarang.
 */

export type CatId = 'food' | 'makeup' | 'travel' | 'sport' | 'products';
export type FilterId = 'all' | CatId;

export interface Video {
  id: string;
  cat: CatId;
  /** Judul English. Judul Indonesia di `ID_VID`. */
  title: string;
  /** Tautan TikTok / Instagram / YouTube. */
  embed: string;
  /** Jumlah tayangan seperti tertulis di platform, mis. '418.6K'. */
  views?: string;
  /** Tanggal unggah, format YYYY-MM-DD. */
  date?: string;
  /** Disematkan di profil — ditaruh paling depan. */
  pinned?: boolean;
  /** Warna pola garis pengganti thumbnail. */
  hue: number;
  thumb?: string;
  thumbLabel?: string;
  format?: 'Tutorial' | 'Picks';
  /** Durasi dalam detik. */
  secs?: number;
  notes?: string;
  why?: string;
  /** [detik mulai, label] untuk daftar bab / pilihan di panel detail. */
  items?: [number, string][];
}

/** Tautan video showreel di hero. Kosong = placeholder. */
export const REEL_EMBED = '';

export const VIDEOS: Video[] = [
  // ---- Disematkan
  { id:'tt-karaoke', cat:'travel', pinned:true, views:'418.6K', hue:330,
    title:'Family- and bestie-friendly karaoke in Banjarbaru',
    embed:'https://www.tiktok.com/embed/v2/7435134224971123975' },
  { id:'tt-anti-uv', cat:'products', pinned:true, views:'231.1K', hue:200,
    title:'Anti-UV gear: after a day at Timezone, ready to beat the Kalimantan heat',
    embed:'https://www.tiktok.com/embed/v2/7494982051859582226' },
  { id:'tt-mask-gloves', cat:'products', pinned:true, views:'124.6K', hue:170,
    title:'Mask and gloves to beat the sun’s heat',
    embed:'https://www.tiktok.com/embed/v2/7495311053295979794' },
  { id:'ig-fore', cat:'food', pinned:true, date:'2025-05-28', hue:140,
    title:'Fore 50% discount',
    embed:'https://www.instagram.com/reel/DKOWictT_xV/embed' },
  { id:'ig-karaoke-vvip', cat:'travel', pinned:true, date:'2024-11-08', hue:300,
    title:'VVIP karaoke',
    embed:'https://www.instagram.com/reel/DCIzcmFAPOE/embed' },
  // TODO: judul & kategori asli belum ada (thumbnail polos).
  { id:'ig-2024-09-26', cat:'products', pinned:true, date:'2024-09-26', hue:250,
    title:'Latest pick',
    embed:'https://www.instagram.com/reel/DAYENRcAzvo/embed' },

  // ---- TikTok, urut tayangan
  // TODO: judul & kategori asli belum ada (caption tidak terbaca).
  { id:'tt-7532703701', cat:'products', views:'7.8K', hue:20,
    title:'Latest pick',
    embed:'https://www.tiktok.com/embed/v2/7532703701228817671' },
  { id:'tt-jetski', cat:'sport', views:'2.3K', hue:190,
    title:'Jet ski at Kampung Putra Bulu (Banjarbaru tourist spot)',
    embed:'https://www.tiktok.com/embed/v2/7588071152648490248' },
  { id:'tt-braces', cat:'products', views:'1.4K', hue:280,
    title:'Braces care: choosing the right toothbrush',
    embed:'https://www.tiktok.com/embed/v2/7617055265698974983' },
  { id:'tt-sora-cafe', cat:'food', views:'926', hue:40,
    title:'Sora Cafe (Banjarbaru culinary)',
    embed:'https://www.tiktok.com/embed/v2/7591058013696527624' },

  // ---- Instagram, urut tanggal terbaru
  { id:'ig-new-cafe', cat:'food', date:'2025-07-16', hue:60,
    title:'New café in Banjarbaru',
    embed:'https://www.instagram.com/reel/DMMYo1jzgg4/embed' },
  { id:'ig-topokki', cat:'food', date:'2025-07-09', hue:10,
    title:'Wonhae Topokki snack review',
    embed:'https://www.instagram.com/reel/DL6ZpiiTK5x/embed' },
  { id:'ig-tote', cat:'products', date:'2025-07-08', hue:220,
    title:'Clear tote bag',
    embed:'https://www.instagram.com/reel/DL33I-2zHw9/embed' },
  { id:'ig-fruit-crisp', cat:'food', date:'2025-07-07', hue:110,
    title:'Mixed fruit crisp snack',
    embed:'https://www.instagram.com/reel/DL1QuxbTDAy/embed' },
  { id:'ig-poncho', cat:'products', date:'2025-07-01', hue:240,
    title:'Pants-style raincoat poncho',
    embed:'https://www.instagram.com/reel/DLb2fgkzJBW/embed' },
  { id:'ig-melon', cat:'food', date:'2025-06-30', hue:130,
    title:'Unboxing a melon-style treat',
    embed:'https://www.instagram.com/reel/DLeFixAzeyU/embed' },
  { id:'ig-lychee', cat:'products', date:'2025-06-27', hue:320,
    title:'Lychee product unboxing',
    embed:'https://www.instagram.com/reel/DLbi-g5zpAl/embed' },
  { id:'ig-best-wok', cat:'food', date:'2025-06-26', hue:30,
    title:'Best Wok fried noodles review',
    embed:'https://www.instagram.com/reel/DLZL35bzn6i/embed' },
  { id:'ig-dimsum', cat:'food', date:'2025-05-29', hue:50,
    title:'Dumplings on noodles',
    embed:'https://www.instagram.com/reel/DKQzW8ITP4Q/embed' },
];

/** Sorotan di carousel "Under a minute": yang paling banyak ditonton dan
 *  yang disematkan. Merujuk id di `VIDEOS`, bukan salinan data. */
export const SHORT_IDS = [
  'tt-karaoke', 'tt-anti-uv', 'tt-mask-gloves', 'ig-fore',
  'ig-karaoke-vvip', 'ig-new-cafe', 'tt-jetski', 'ig-topokki',
];

export const CATS: { id: FilterId; label: string }[] = [
  { id:'all', label:'All' }, { id:'food', label:'Food' }, { id:'makeup', label:'Makeup' },
  { id:'travel', label:'Travel' }, { id:'sport', label:'Sport' }, { id:'products', label:'Must-try products' },
];

export const LANG = {
  en:{ navShelf:'The shelf', navShorts:'Shorts', workWithMe:'Work with me', role:'lifestyle creator',
    h1a:'Foods, looks and places worth your time, ', h1b:'tried and picked', h1c:' for you.',
    heroP:'I make honest reviews and easy how-tos on food, makeup, travel, sport and products worth buying, so you spend less time guessing.',
    browse:'Browse the shelf', collabBtn:'Collaborate', dropReel:'drop showreel video · 16:11',
    kickerShelf:"Editor's picks", shelfTitle:'The shelf', shelfP:'Every video here is a pick I stand behind. Filter by what you want to try next.',
    previewing:'Previewing · muted', shortsTitle:'Under a minute', shortsP:'The most-watched and pinned picks. Drag or flick through, tap one to play.',
    collabKicker:'Collaborate', collabTitle:"Let's make something people actually want to try.",
    collabP:'I work with food, beauty, travel, sport and everyday-product brands that fit what my audience already comes for.',
    o1:'Dedicated review', o1d:'A full video built around your product or place, 8 to 15 minutes.',
    o2:'Integrated pick', o2d:'Your product inside a recommendation list, with honest notes.',
    o3:'Short-form series', o3d:'Three to five vertical videos for Reels, TikTok and Shorts.',
    send:'Send an email', copy:'Copy address', copied:'Copied', reply:'I reply within two working days.',
    why:"Why it's on the shelf", cta:"Want your product in a video like this? Let's talk →", chapters:'Chapters', picks:'The picks', menuOpen:'Open menu', menuClose:'Close menu', stop:'Stop video', openOn:'Open on', pinned:'Pinned', views:'views' },
  id:{ navShelf:'Rak pilihan', navShorts:'Video pendek', workWithMe:'Ajak kerja sama', role:'kreator lifestyle',
    h1a:'Kuliner, makeup, dan tempat yang layak dicoba, ', h1b:'sudah kucoba dan kupilih', h1c:' untukmu.',
    heroP:'Aku membuat review jujur dan panduan singkat seputar kuliner, makeup, jalan-jalan, olahraga, dan produk yang layak dibeli, supaya kamu tidak perlu menebak-nebak.',
    browse:'Lihat rak pilihan', collabBtn:'Kerja sama', dropReel:'letakkan video showreel · 16:11',
    kickerShelf:'Pilihan editor', shelfTitle:'Rak pilihan', shelfP:'Semua video di sini benar-benar aku rekomendasikan. Saring sesuai yang ingin kamu coba berikutnya.',
    previewing:'Pratinjau · tanpa suara', shortsTitle:'Kurang dari semenit', shortsP:'Yang paling banyak ditonton dan disematkan. Geser untuk menjelajah, ketuk untuk memutar.',
    collabKicker:'Kerja sama', collabTitle:'Yuk, bikin konten yang bikin orang benar-benar ingin mencoba.',
    collabP:'Aku bekerja sama dengan brand kuliner, kecantikan, travel, olahraga, dan produk sehari-hari yang sejalan dengan yang dicari penontonku',
    o1:'Review khusus', o1d:'Video lengkap yang dibangun di sekitar produk atau tempatmu, 8 sampai 15 menit.',
    o2:'Masuk daftar rekomendasi', o2d:'Produkmu tampil dalam daftar rekomendasi, dengan catatan yang jujur.',
    o3:'Seri video pendek', o3d:'Tiga sampai lima video vertikal untuk Reels, TikTok, dan Shorts.',
    send:'Kirim email', copy:'Salin alamat', copied:'Tersalin', reply:'Aku membalas dalam dua hari kerja.',
    why:'Kenapa ada di rak ini', cta:'Mau produkmu ada di video seperti ini? Yuk ngobrol →', chapters:'Bab', picks:'Daftar pilihan', menuOpen:'Buka menu', menuClose:'Tutup menu', stop:'Hentikan video', openOn:'Buka di', pinned:'Disematkan', views:'x ditonton' },
};

export type Lang = keyof typeof LANG;

export const CAT_ID: Record<FilterId, string> = { all:'Semua', food:'Kuliner', makeup:'Makeup', travel:'Jalan-jalan', sport:'Olahraga', products:'Wajib coba' };

export const ID_VID: Record<string, { title: string; notes?: string; why?: string; items?: string[] }> = {
  'tt-karaoke':{ title:'Karaoke family & bestie friendly di Banjarbaru' },
  'tt-anti-uv':{ title:'Perlengkapan anti-UV: habis main di Timezone, siap lawan panas Kalimantan' },
  'tt-mask-gloves':{ title:'Masker dan sarung tangan untuk melawan panas matahari' },
  'ig-fore':{ title:'Diskon 50% Fore' },
  'ig-karaoke-vvip':{ title:'Karaoke VVIP' },
  'ig-2024-09-26':{ title:'Rekomendasi terbaru' },
  'tt-7532703701':{ title:'Rekomendasi terbaru' },
  'tt-jetski':{ title:'Jetski di Kampung Putra Bulu (wisata Banjarbaru)' },
  'tt-braces':{ title:'Perawatan behel: memilih sikat gigi yang tepat' },
  'tt-sora-cafe':{ title:'Sora Cafe (kuliner Banjarbaru)' },
  'ig-new-cafe':{ title:'Kafe baru di Banjarbaru' },
  'ig-topokki':{ title:'Review camilan Wonhae Topokki' },
  'ig-tote':{ title:'Tas tote transparan' },
  'ig-fruit-crisp':{ title:'Camilan Mix Fruit Crisp' },
  'ig-poncho':{ title:'Ponco celana (jas hujan)' },
  'ig-melon':{ title:'Buka bungkus camilan ala melon' },
  'ig-lychee':{ title:'Unboxing produk lychee Cellfresh' },
  'ig-best-wok':{ title:'Review Mi Goreng Best Wok' },
  'ig-dimsum':{ title:'Dimsum di atas mi' },
};
