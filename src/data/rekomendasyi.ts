/**
 * Isi halaman /rekomendasyi, disalin apa adanya dari desain Claude Design
 * "Rekomendasyi Portfolio", dengan kategori dan contoh video yang sudah
 * disesuaikan (kuliner, makeup, jalan-jalan, olahraga, produk). Kecuali short
 * pertama, semua masih placeholder sampai data asli tersedia.
 *
 * `secs` = durasi dalam detik, `hue` = warna pola garis pengganti thumbnail,
 * `items` = [detik mulai, label] untuk daftar bab / pilihan di panel detail.
 *
 * MEMASANG VIDEO ASLI: isi `embed` dengan tautan yang disalin dari tombol
 * "Bagikan" di aplikasinya, apa adanya:
 *   YouTube   https://youtu.be/ID · https://www.youtube.com/watch?v=ID · https://youtube.com/shorts/ID
 *   Instagram https://www.instagram.com/reel/KODE/ · https://www.instagram.com/p/KODE/
 *   TikTok    https://www.tiktok.com/@akun/video/1234567890
 * Selama kosong (atau tautannya tidak dikenali), placeholder pola garis yang
 * dipakai. Thumbnail YouTube diambil otomatis; untuk Instagram/TikTok isi
 * `thumb` dengan gambar sendiri (mis. '/rekomendasyi/v01.jpg' di `public/`).
 * `secs` tetap diisi manual: durasi asli tidak bisa dibaca tanpa API platform.
 */

export type CatId = 'food' | 'makeup' | 'travel' | 'sport' | 'products';
export type FilterId = 'all' | CatId;

export interface Video {
  id: string;
  cat: CatId;
  format: 'Tutorial' | 'Picks';
  title: string;
  secs: number;
  hue: number;
  thumbLabel: string;
  notes: string;
  why: string;
  items: [number, string][];
  /** Tautan YouTube / Instagram / TikTok. Kosong = placeholder. */
  embed?: string;
  /** Gambar thumbnail sendiri; YouTube tidak perlu (diambil otomatis). */
  thumb?: string;
}

export interface Short {
  title: string;
  platform: 'Reels' | 'TikTok' | 'Shorts';
  secs: number;
  hue: number;
  embed?: string;
  thumb?: string;
}

/** Tautan video showreel di hero. Kosong = placeholder. */
export const REEL_EMBED = '';

export const VIDEOS: Video[] = [
  { id:'v01', embed:'', cat:'food', format:'Picks', title:'Street food in Banjarbaru under IDR 25k', secs:742, hue:40, thumbLabel:'night market stalls',
    notes:'Seven stalls from the evening market to the roadside carts, each with what to order, the price, and when to come so you skip the queue.',
    why:'I paid for every plate myself and went back to each stall at least twice.',
    items:[[0,'How I picked them'],[95,'Savoury snacks'],[260,'Rice and noodles'],[480,'Something sweet'],[640,'Map and prices']] },
  { id:'v02', embed:'', cat:'makeup', format:'Tutorial', title:'Five-minute everyday makeup for humid weather', secs:618, hue:350, thumbLabel:'mirror, face close-up',
    notes:'A light routine that survives a hot commute: prep, base, brows, cheeks and lips, with drugstore products only.',
    why:'Tested on a 34°C day with a motorbike ride in between. It held.',
    items:[[0,'What you need'],[70,'Skin prep'],[190,'A base that does not slide'],[350,'Brows and cheeks'],[505,'Lips and setting']] },
  { id:'v03', embed:'', cat:'travel', format:'Tutorial', title:'Three days in Labuan Bajo on a budget', secs:964, hue:200, thumbLabel:'boat deck, islands',
    notes:'A full itinerary with the boat trip, where to stay, what to eat and what each day actually cost, down to the last rupiah.',
    why:'Built from my own receipts, not from a travel agent’s package.',
    items:[[0,'Total cost up front'],[120,'Day one: town and sunset'],[390,'Day two: the boat trip'],[700,'Day three: slow morning'],[860,'What I would skip']] },
  { id:'v04', embed:'', cat:'sport', format:'Tutorial', title:'A beginner home workout with no equipment', secs:812, hue:150, thumbLabel:'yoga mat, living room',
    notes:'Twenty minutes, four rounds, done in a small room. Each move has an easier and a harder version so you can grow into it.',
    why:'I did this three times a week for two months before filming it.',
    items:[[0,'Warm-up'],[150,'Round one: legs'],[330,'Round two: core'],[520,'Round three: upper body'],[700,'Cool-down and stretch']] },
  { id:'v05', embed:'', cat:'products', format:'Picks', title:'Skincare I repurchased this year', secs:668, hue:300, thumbLabel:'bottles on a shelf',
    notes:'Six products I finished and bought again, with what they did for my skin and who should skip them.',
    why:'Only empties count. If I did not finish it, it is not on this list.',
    items:[[0,'Intro'],[80,'Cleanser and toner'],[240,'Serum'],[400,'Moisturiser'],[540,'Sunscreen']] },
  { id:'v06', embed:'', cat:'food', format:'Tutorial', title:'Soto Banjar at home, the way my aunt makes it', secs:1045, hue:60, thumbLabel:'pot of broth, kitchen',
    notes:'Broth, chicken, perkedel and the lime-chilli sambal, cooked in one afternoon with ingredients from a regular market.',
    why:'Recipe checked twice with the person who taught it to me.',
    items:[[0,'Ingredients and shopping'],[160,'The spice paste'],[420,'Broth and chicken'],[700,'Perkedel'],[900,'Serving it right']] },
  { id:'v07', embed:'', cat:'makeup', format:'Picks', title:'Local lip tints under IDR 60k, swatched', secs:556, hue:10, thumbLabel:'lip swatches on arm',
    notes:'Ten local lip tints swatched on two skin tones, worn through a meal, and rated for colour, comfort and transfer.',
    why:'Bought with my own money. No brand has seen this video before you.',
    items:[[0,'How I tested'],[60,'Nudes'],[200,'Pinks and corals'],[340,'Reds'],[470,'My top three']] },
  { id:'v08', embed:'', cat:'travel', format:'Picks', title:'Weekend trips from Banjarmasin you can do by car', secs:710, hue:180, thumbLabel:'road, river view',
    notes:'Five places within four hours’ drive, from floating markets to the hills of Loksado, with road notes and where to stop.',
    why:'Every route driven by me, with the fuel and toll costs written down.',
    items:[[0,'Intro'],[70,'Floating market at dawn'],[230,'Loksado bamboo rafting'],[420,'Beaches in Tanah Laut'],[590,'Planning the drive']] },
  { id:'v09', embed:'', cat:'sport', format:'Picks', title:'Running shoes for beginners, tested for a month', secs:736, hue:120, thumbLabel:'shoes on track',
    notes:'Four pairs from budget to mid-range, worn for 30 days of easy runs, with notes on fit, comfort and wear.',
    why:'All four pairs were bought, not sent. I kept the one I still run in.',
    items:[[0,'Intro'],[90,'Budget pick'],[250,'Best cushioning'],[430,'Best for wide feet'],[600,'The one I kept']] },
  { id:'v10', embed:'', cat:'products', format:'Picks', title:'Kitchen gadgets that are actually worth it', secs:648, hue:80, thumbLabel:'counter, small appliances',
    notes:'Seven gadgets I use every week, and three popular ones that ended up in a drawer.',
    why:'Each one has been in my kitchen for at least six months.',
    items:[[0,'Intro'],[75,'Daily use'],[260,'Weekly use'],[450,'Not worth it'],[570,'Where to buy']] },
  { id:'v11', embed:'', cat:'food', format:'Picks', title:'Coffee shops in Banjarbaru worth the drive', secs:690, hue:30, thumbLabel:'latte on wooden table',
    notes:'Five coffee shops rated for the coffee itself, the food, seating and how busy they get on weekends.',
    why:'I ordered the same drink everywhere so the comparison is fair.',
    items:[[0,'How I rated them'],[80,'Best espresso'],[230,'Best manual brew'],[400,'Best for hanging out'],[560,'Prices and hours']] },
];

export const CATS: { id: FilterId; label: string }[] = [
  { id:'all', label:'All' }, { id:'food', label:'Food' }, { id:'makeup', label:'Makeup' },
  { id:'travel', label:'Travel' }, { id:'sport', label:'Sport' }, { id:'products', label:'Must-try products' },
];

export const SHORTS: Short[] = [
  { embed:'https://www.tiktok.com/@rekomendasyi/video/7435134224971123975?is_from_webapp=1&sender_device=pc&web_id=7695006044183807495', title:'Karaoke VVIP at Banjarbaru', platform:'TikTok', secs:58, hue:170 },
  { embed:'', title:'One bowl of soto, one minute', platform:'Reels', secs:42, hue:50 },
  { embed:'', title:'A no-foundation base in 60 seconds', platform:'TikTok', secs:55, hue:350 },
  { embed:'', title:'The quietest sunrise spot in Loksado', platform:'Shorts', secs:35, hue:200 },
  { embed:'', title:'A 10-minute stretch after running', platform:'Reels', secs:59, hue:140 },
  { embed:'', title:'Sunscreen I finished three bottles of', platform:'TikTok', secs:31, hue:300 },
  { embed:'', title:'Night market haul under IDR 50k', platform:'Shorts', secs:47, hue:30 },
  { embed:'', title:'The travel pouch I never leave without', platform:'Reels', secs:44, hue:250 },
];

export const LANG = {
  en:{ navShelf:'The shelf', navShorts:'Shorts', workWithMe:'Work with me', role:'lifestyle creator',
    h1a:'Foods, looks and places worth your time, ', h1b:'tried and picked', h1c:' for you.',
    heroP:'I make honest reviews and easy how-tos on food, makeup, travel, sport and products worth buying, so you spend less time guessing.',
    browse:'Browse the shelf', collabBtn:'Collaborate', dropReel:'drop showreel video · 16:11',
    kickerShelf:"Editor's picks", shelfTitle:'The shelf', shelfP:'Every video here is a pick I stand behind. Filter by what you want to try next.',
    previewing:'Previewing · muted', shortsTitle:'Under a minute', shortsP:'Quick picks and tiny how-tos. Drag or flick through, tap one to play.',
    collabKicker:'Collaborate', collabTitle:"Let's make something people actually want to try.",
    collabP:'I work with food, beauty, travel, sport and everyday-product brands that fit what my audience already comes for.',
    o1:'Dedicated review', o1d:'A full video built around your product or place, 8 to 15 minutes.',
    o2:'Integrated pick', o2d:'Your product inside a recommendation list, with honest notes.',
    o3:'Short-form series', o3d:'Three to five vertical videos for Reels, TikTok and Shorts.',
    send:'Send an email', copy:'Copy address', copied:'Copied', reply:'I reply within two working days.',
    why:"Why it's on the shelf", cta:"Want your product in a video like this? Let's talk →", chapters:'Chapters', picks:'The picks', menuOpen:'Open menu', menuClose:'Close menu', stop:'Stop video' },
  id:{ navShelf:'Rak pilihan', navShorts:'Video pendek', workWithMe:'Ajak kerja sama', role:'kreator lifestyle',
    h1a:'Kuliner, makeup, dan tempat yang layak dicoba, ', h1b:'sudah kucoba dan kupilih', h1c:' untukmu.',
    heroP:'Aku membuat review jujur dan panduan singkat seputar kuliner, makeup, jalan-jalan, olahraga, dan produk yang layak dibeli, supaya kamu tidak perlu menebak-nebak.',
    browse:'Lihat rak pilihan', collabBtn:'Kerja sama', dropReel:'letakkan video showreel · 16:11',
    kickerShelf:'Pilihan editor', shelfTitle:'Rak pilihan', shelfP:'Semua video di sini benar-benar aku rekomendasikan. Saring sesuai yang ingin kamu coba berikutnya.',
    previewing:'Pratinjau · tanpa suara', shortsTitle:'Kurang dari semenit', shortsP:'Rekomendasi cepat dan panduan mini. Geser untuk menjelajah, ketuk untuk memutar.',
    collabKicker:'Kerja sama', collabTitle:'Yuk, bikin konten yang bikin orang benar-benar ingin mencoba.',
    collabP:'Aku bekerja sama dengan brand kuliner, kecantikan, travel, olahraga, dan produk sehari-hari yang sejalan dengan yang dicari penontonku',
    o1:'Review khusus', o1d:'Video lengkap yang dibangun di sekitar produk atau tempatmu, 8 sampai 15 menit.',
    o2:'Masuk daftar rekomendasi', o2d:'Produkmu tampil dalam daftar rekomendasi, dengan catatan yang jujur.',
    o3:'Seri video pendek', o3d:'Tiga sampai lima video vertikal untuk Reels, TikTok, dan Shorts.',
    send:'Kirim email', copy:'Salin alamat', copied:'Tersalin', reply:'Aku membalas dalam dua hari kerja.',
    why:'Kenapa ada di rak ini', cta:'Mau produkmu ada di video seperti ini? Yuk ngobrol →', chapters:'Bab', picks:'Daftar pilihan', menuOpen:'Buka menu', menuClose:'Tutup menu', stop:'Hentikan video' },
};

export type Lang = keyof typeof LANG;

export const CAT_ID: Record<FilterId, string> = { all:'Semua', food:'Kuliner', makeup:'Makeup', travel:'Jalan-jalan', sport:'Olahraga', products:'Wajib coba' };

export const ID_VID: Record<string, { title: string; notes: string; why: string; items: string[] }> = {
  v01:{ title:'Jajanan kaki lima di Banjarbaru di bawah Rp25 ribu', notes:'Tujuh lapak dari pasar malam sampai gerobak pinggir jalan, lengkap dengan menu yang wajib dipesan, harganya, dan jam datang supaya tidak antre.', why:'Semua kubayar sendiri dan tiap lapak kudatangi minimal dua kali.', items:['Cara aku memilih','Camilan gurih','Nasi dan mi','Yang manis-manis','Peta dan harga'] },
  v02:{ title:'Makeup harian lima menit untuk cuaca lembap', notes:'Rutinitas ringan yang tahan perjalanan panas: persiapan kulit, base, alis, pipi, dan bibir, semuanya produk drugstore.', why:'Diuji di hari 34°C dengan naik motor di tengahnya. Tetap awet.', items:['Yang kamu perlukan','Persiapan kulit','Base yang tidak luntur','Alis dan pipi','Bibir dan setting'] },
  v03:{ title:'Tiga hari di Labuan Bajo dengan budget hemat', notes:'Itinerary lengkap dengan trip kapal, tempat menginap, tempat makan, dan rincian biaya tiap hari sampai rupiah terakhir.', why:'Disusun dari struk belanjaku sendiri, bukan dari paket agen travel.', items:['Total biaya di awal','Hari pertama: kota dan sunset','Hari kedua: trip kapal','Hari ketiga: pagi santai','Yang sebaiknya dilewati'] },
  v04:{ title:'Olahraga di rumah untuk pemula tanpa alat', notes:'Dua puluh menit, empat ronde, cukup di ruangan kecil. Setiap gerakan punya versi lebih mudah dan lebih berat supaya bisa naik bertahap.', why:'Aku menjalaninya tiga kali seminggu selama dua bulan sebelum merekamnya.', items:['Pemanasan','Ronde satu: kaki','Ronde dua: perut','Ronde tiga: tubuh atas','Pendinginan dan peregangan'] },
  v05:{ title:'Skincare yang kubeli ulang tahun ini', notes:'Enam produk yang sudah kuhabiskan lalu kubeli lagi, lengkap dengan efeknya di kulitku dan siapa yang sebaiknya tidak memakainya.', why:'Hanya produk yang sudah habis yang masuk. Kalau belum habis, tidak ada di daftar ini.', items:['Pembuka','Pembersih dan toner','Serum','Pelembap','Sunscreen'] },
  v06:{ title:'Soto Banjar di rumah, resep ala bibiku', notes:'Kuah, ayam, perkedel, dan sambal jeruk, dimasak dalam satu sore dengan bahan dari pasar biasa.', why:'Resepnya kucek dua kali dengan orang yang mengajarkannya padaku.', items:['Bahan dan belanja','Bumbu halus','Kuah dan ayam','Perkedel','Cara menyajikan'] },
  v07:{ title:'Lip tint lokal di bawah Rp60 ribu, lengkap dengan swatch', notes:'Sepuluh lip tint lokal di-swatch di dua warna kulit, dipakai saat makan, lalu dinilai dari warna, kenyamanan, dan seberapa mudah menempel.', why:'Dibeli pakai uangku sendiri. Belum ada brand yang melihat video ini sebelum kamu.', items:['Cara aku menguji','Warna nude','Pink dan coral','Merah','Tiga favoritku'] },
  v08:{ title:'Liburan akhir pekan dari Banjarmasin naik mobil', notes:'Lima tempat dalam jarak empat jam berkendara, dari pasar terapung sampai perbukitan Loksado, dengan catatan jalan dan tempat singgah.', why:'Setiap rute kukendarai sendiri, lengkap dengan biaya bensin dan tolnya.', items:['Pembuka','Pasar terapung saat subuh','Bamboo rafting Loksado','Pantai di Tanah Laut','Merencanakan perjalanan'] },
  v09:{ title:'Sepatu lari untuk pemula, diuji selama sebulan', notes:'Empat pasang dari kelas hemat sampai menengah, dipakai 30 hari lari santai, dengan catatan ukuran, kenyamanan, dan keausan.', why:'Keempatnya kubeli sendiri, bukan kiriman. Yang masih kupakai lari sampai sekarang kusimpan.', items:['Pembuka','Pilihan hemat','Bantalan terbaik','Terbaik untuk kaki lebar','Yang akhirnya kupakai'] },
  v10:{ title:'Alat dapur yang benar-benar layak dibeli', notes:'Tujuh alat yang kupakai tiap minggu, dan tiga yang lagi ramai tapi akhirnya cuma masuk laci.', why:'Semuanya sudah minimal enam bulan ada di dapurku.', items:['Pembuka','Dipakai tiap hari','Dipakai tiap minggu','Tidak sepadan','Tempat membeli'] },
  v11:{ title:'Kedai kopi di Banjarbaru yang layak didatangi', notes:'Lima kedai kopi dinilai dari kopinya, makanannya, tempat duduk, dan seberapa ramai di akhir pekan.', why:'Aku memesan minuman yang sama di setiap tempat supaya perbandingannya adil.', items:['Cara aku menilai','Espresso terbaik','Manual brew terbaik','Terbaik untuk nongkrong','Harga dan jam buka'] },
};

export const SHORTS_ID = ['Karaoke VVIP di Banjarbaru','Satu mangkuk soto, satu menit','Base tanpa foundation dalam 60 detik','Spot sunrise paling sepi di Loksado','Peregangan 10 menit setelah lari','Sunscreen yang sudah habis tiga botol','Belanja pasar malam di bawah Rp50 ribu','Pouch travel yang selalu kubawa'];
