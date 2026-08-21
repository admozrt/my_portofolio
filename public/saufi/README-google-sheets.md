# Setup Backend Google Sheets (RSVP & Ucapan) — Saufi & Afifah

Undangan ini menyimpan **RSVP** dan **Ucapan** ke Google Sheets lewat **Google Apps Script
Web App** (tanpa server sendiri). Buat endpoint **milik pasangan ini sendiri** — jangan pakai
endpoint undangan lain, agar data tidak tercampur.

> **Selama `SHEETS_ENDPOINT` masih kosong, form tetap bisa dipakai tetapi data TIDAK tersimpan
> permanen** — ucapan hanya muncul di layar tamu itu sendiri dan hilang saat halaman di-refresh.
> Pastikan langkah di bawah selesai sebelum undangan disebar.

## Langkah

1. Buat **Google Sheet** baru. Buat **2 tab (sheet)**:
   - Tab `RSVP` — header baris 1: `Timestamp | Nama | Kehadiran | Jumlah | Pesan`
   - Tab `Ucapan` — header baris 1: `Timestamp | Nama | Pesan`
2. Menu **Extensions → Apps Script**.
3. Hapus isi default, **tempel kode di bawah**, lalu Save.
4. **Deploy → New deployment → Type: Web app**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
5. Klik **Deploy**, izinkan akses, lalu salin **URL Web App** (berakhiran `/exec`).
6. Buka `src/pages/wedding/WeddingPageSaufiAfifah.tsx`, isi:
   ```ts
   const SHEETS_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
   ```
7. Selesai. Deploy ulang situsnya agar perubahan aktif.

> Setiap kali kode Apps Script diubah, buat **deployment baru** (Manage deployments → Edit →
> New version). URL `/exec` tetap sama.

## Kode Apps Script

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var now = new Date();
    if (data.type === 'rsvp') {
      ss.getSheetByName('RSVP').appendRow([
        now, data.nama || '', data.kehadiran || '', data.jumlah || '', data.pesan || ''
      ]);
    } else if (data.type === 'ucapan') {
      ss.getSheetByName('Ucapan').appendRow([now, data.nama || '', data.pesan || '']);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ucapan');
  var values = sheet.getDataRange().getValues();
  values.shift(); // buang header
  var out = values
    .filter(function (r) { return r[1] || r[2]; })
    .map(function (r) { return { time: r[0], nama: r[1], pesan: r[2] }; });
  out.reverse(); // terbaru di atas
  return ContentService.createTextOutput(JSON.stringify({ ok: true, ucapan: out }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Kolom Kehadiran
Nilai yang mungkin muncul di kolom `Kehadiran` tab RSVP:
- `Hadir`
- `Tidak Hadir` — kolom `Jumlah` otomatis diisi `0`
- `Masih Ragu`

## Catatan CORS
Frontend mengirim `POST` dengan `Content-Type: text/plain` + `mode: "no-cors"` agar tidak memicu
CORS preflight ke Apps Script. Payload tetap JSON string dan dibaca lewat
`JSON.parse(e.postData.contents)`. Karena `no-cors`, respons tidak bisa dibaca oleh frontend
(fire-and-forget) — tapi datanya tetap masuk ke Sheet.

## Musik latar

Letakkan berkas musiknya di `public/saufi/backsound.mp3` — nama itu persis, karena
jalurnya sudah dipatok di `BG_AUDIO` pada `src/pages/wedding/WeddingPageSaufiAfifah.tsx`.

Tombol pemutarnya baru muncul setelah berkas itu ada. Selama belum ada, tombolnya
sengaja disembunyikan supaya tamu tidak menemukan kontrol yang tidak berfungsi.

Musik tidak selalu bisa langsung berbunyi. Peramban melarang audio berbunyi tanpa
gestur pengguna, dan gulir dengan roda mouse **tidak** dihitung sebagai gestur oleh
Chrome. Karena itu percobaan pemutaran ditempelkan pada gerakan pertama tamu, dan
kalau ditolak tombolnya tetap tersedia untuk dinyalakan manual.
