#!/usr/bin/env node
/**
 * Mengunduh thumbnail konten /rekomendasyi (TikTok & Instagram) ke
 * `public/rekomendasyi/<id>.<ext>`, lalu menulis daftar thumbnail yang ada ke
 * `src/data/rekomendasyiThumbs.ts`.
 *
 *   npm run thumbs:rekomendasyi            unduh yang belum ada
 *   npm run thumbs:rekomendasyi -- --force unduh ulang semuanya
 *   npm run thumbs:rekomendasyi -- --scan  tidak mengunduh, hanya membaca folder
 *                                            (gambar yang terlalu besar tetap diperkecil)
 *
 * Gambar MANUAL: taruh `<id>.jpg` (atau .jpeg/.png/.webp) di
 * `public/rekomendasyi/`, dengan `<id>` sama seperti di `src/data/rekomendasyi.ts`
 * (mis. `ig-fore.jpg`), lalu jalankan skrip ini (cukup `--scan`). File yang
 * sudah ada tidak pernah ditimpa kecuali dengan `--force`.
 *
 * Kenapa diunduh, bukan ditautkan: link gambar dari TikTok dan Instagram
 * bertanda tangan dan kedaluwarsa dalam hitungan hari.
 *
 * Ukuran: TikTok memberi thumbnail 2160x3840 (sampai ±500 KB). Semua gambar
 * diperkecil ke lebar maks 720px, JPEG kualitas 82, memakai Python + Pillow
 * (`pip install pillow`). Tanpa Pillow, gambar disimpan apa adanya.
 *
 * Sumber gambar:
 *   TikTok    oEmbed publik (https://www.tiktok.com/oembed), tanpa kunci API.
 *             TikTok membatasi request beruntun, jadi ada jeda dan coba ulang.
 *   Instagram meta og:image di halaman Reel, diminta sebagai crawler pratinjau
 *             tautan. Cara tidak resmi: kalau gagal, isi gambar itu manual.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'src/data/rekomendasyi.ts');
const OUT_DIR = join(ROOT, 'public/rekomendasyi');
const MAP_FILE = join(ROOT, 'src/data/rekomendasyiThumbs.ts');
const EXTS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_WIDTH = 720;

/** Perkecil gambar yang lebih lebar dari MAX_WIDTH. Gambar kecil tidak disentuh,
 *  jadi aman dijalankan berulang dan untuk gambar yang ditaruh manual. */
const PY_RESIZE = `
import os, sys
from PIL import Image, ImageOps
max_w = int(sys.argv[1])
for path in sys.argv[2:]:
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    if im.width <= max_w:
        continue
    h = round(im.height * max_w / im.width)
    im = im.convert('RGB') if path.lower().endswith(('.jpg', '.jpeg')) else im
    im.resize((max_w, h), Image.LANCZOS).save(path, quality=82, optimize=True, progressive=True)
    print('  kecilkan', os.path.basename(path), f'-> {max_w}x{h}')
`;

let pillowWarned = false;
function shrink(files) {
  if (!files.length) return;
  for (const py of ['python', 'python3', 'py']) {
    const r = spawnSync(py, ['-c', PY_RESIZE, String(MAX_WIDTH), ...files], { encoding: 'utf8' });
    if (r.error) continue; // interpreter ini tidak ada, coba berikutnya
    if (r.status === 0) {
      if (r.stdout.trim()) console.log(r.stdout.trimEnd());
      return;
    }
    if (/No module named 'PIL'/.test(r.stderr)) break;
    console.log(`  perkecil gagal: ${r.stderr.trim().split(/\r?\n/).pop()}`);
    return;
  }
  if (!pillowWarned) {
    pillowWarned = true;
    console.log('  (Pillow tidak ditemukan — gambar disimpan dengan ukuran asli. Jalankan: pip install pillow)');
  }
}

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const SCAN_ONLY = args.has('--scan');

const UA_BROWSER =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const UA_PREVIEW = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Ambil pasangan id + embed dari berkas data tanpa menjalankan TypeScript. */
const readVideos = () => {
  const src = readFileSync(DATA, 'utf8');
  const out = [];
  const re = /\{\s*id:'([\w-]+)'[\s\S]*?embed:'([^']+)'/g;
  let m;
  while ((m = re.exec(src))) out.push({ id: m[1], embed: m[2] });
  return out;
};

const existing = (id) => EXTS.map((e) => join(OUT_DIR, `${id}.${e}`)).find((p) => existsSync(p));

const tiktokId = (url) => url.match(/(?:video|embed(?:\/v2)?)\/(\d+)/)?.[1];
const instagramPage = (url) => {
  const m = url.match(/instagram\.com\/(p|reels?)\/([\w-]+)/);
  if (!m) return null;
  return `https://www.instagram.com/${m[1] === 'reels' ? 'reel' : m[1]}/${m[2]}/`;
};

async function tiktokThumb(id) {
  const page = `https://www.tiktok.com/@rekomendasyi/video/${id}`;
  const api = `https://www.tiktok.com/oembed?url=${encodeURIComponent(page)}`;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(api, { headers: { 'User-Agent': UA_BROWSER } });
    const text = await res.text();
    if (res.ok && text.trim().startsWith('{')) {
      const url = JSON.parse(text).thumbnail_url;
      if (url) return url;
      throw new Error('oEmbed tidak berisi thumbnail_url');
    }
    // "overload-protect triggered": tunggu makin lama lalu coba lagi.
    const wait = 8000 * attempt;
    console.log(`    TikTok membatasi request, tunggu ${wait / 1000} detik (percobaan ${attempt}/5)`);
    await sleep(wait);
  }
  throw new Error('TikTok terus menolak (overload-protect)');
}

async function instagramThumb(pageUrl) {
  const res = await fetch(pageUrl, { headers: { 'User-Agent': UA_PREVIEW } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const m = html.match(/<meta property="og:image" content="([^"]+)"/);
  if (!m) throw new Error('og:image tidak ditemukan (mungkin diminta login)');
  return m[1].replace(/&amp;/g, '&');
}

async function download(url, id) {
  const res = await fetch(url, { headers: { 'User-Agent': UA_BROWSER } });
  if (!res.ok) throw new Error(`unduh gambar gagal: HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) throw new Error(`gambar terlalu kecil (${buf.length} byte), kemungkinan bukan thumbnail`);
  // Hapus versi lama dengan ekstensi lain supaya tidak ada dua thumbnail untuk satu id.
  for (const e of EXTS) {
    const old = join(OUT_DIR, `${id}.${e}`);
    if (e !== ext && existsSync(old)) unlinkSync(old);
  }
  const file = join(OUT_DIR, `${id}.${ext}`);
  writeFileSync(file, buf);
  return { file, kb: Math.round(buf.length / 1024) };
}

function writeMap(videos) {
  const ids = new Set(videos.map((v) => v.id));
  const found = readdirSync(OUT_DIR)
    .map((f) => f.match(/^([\w-]+)\.(jpe?g|png|webp)$/i))
    .filter((m) => m && ids.has(m[1]))
    .map((m) => [m[1], `/rekomendasyi/${m[0]}`])
    .sort(([a], [b]) => a.localeCompare(b));
  const body = found.map(([id, path]) => `  '${id}': '${path}',`).join('\n');
  writeFileSync(
    MAP_FILE,
    `// DIBUAT OTOMATIS oleh scripts/fetch-rekomendasyi-thumbs.mjs — jangan diedit manual.\n` +
      `// Isinya mencerminkan gambar yang ada di public/rekomendasyi/.\n\n` +
      `export const THUMBS: Record<string, string> = {\n${body}${body ? '\n' : ''}};\n`
  );
  return found.length;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const videos = readVideos();
  const failed = [];

  if (!SCAN_ONLY) {
    let lastWasTikTok = false;
    for (const v of videos) {
      if (!FORCE && existing(v.id)) {
        console.log(`  lewati  ${v.id} (sudah ada)`);
        continue;
      }
      try {
        let url;
        const tt = tiktokId(v.embed);
        const ig = instagramPage(v.embed);
        if (tt) {
          if (lastWasTikTok) await sleep(3000);
          url = await tiktokThumb(tt);
          lastWasTikTok = true;
        } else if (ig) {
          url = await instagramThumb(ig);
          lastWasTikTok = false;
          await sleep(1200);
        } else {
          console.log(`  lewati  ${v.id} (bukan TikTok/Instagram)`);
          continue;
        }
        const { kb } = await download(url, v.id);
        console.log(`  simpan  ${v.id} (${kb} KB)`);
      } catch (e) {
        failed.push(v.id);
        console.log(`  GAGAL   ${v.id}: ${e.message}`);
      }
    }
  }

  shrink(
    readdirSync(OUT_DIR)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .map((f) => join(OUT_DIR, f))
  );

  const n = writeMap(videos);
  console.log(`\n${n}/${videos.length} konten punya thumbnail -> src/data/rekomendasyiThumbs.ts`);
  if (failed.length) {
    console.log(`Gagal: ${failed.join(', ')}`);
    console.log('Jalankan lagi nanti, atau taruh gambarnya manual di public/rekomendasyi/<id>.jpg lalu jalankan dengan --scan.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
