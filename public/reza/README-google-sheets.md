# Setup Backend Google Sheets (RSVP & Ucapan) — Reza & Kirana

Undangan ini menyimpan **RSVP** dan **Ucapan (kolom komentar)** ke Google Sheets lewat
**Google Apps Script Web App** (tanpa server sendiri). Buat endpoint **baru** (terpisah dari
undangan lain), lalu tempel URL-nya ke `SHEETS_ENDPOINT` di
`src/pages/wedding/WeddingPageRezaKirana.tsx`.

## Langkah

1. Buat **Google Sheet** baru. Buat **2 tab (sheet)**:
   - Tab `RSVP` — header baris 1: `Timestamp | Nama | Kehadiran | Jumlah | Pesan`
   - Tab `Ucapan` — header baris 1: `Timestamp | Nama | Pesan`
2. Menu **Extensions → Apps Script**.
3. Hapus isi default, **tempel kode di bawah**, Save.
4. **Deploy → New deployment → Type: Web app**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
5. **Deploy**, izinkan akses, salin **URL Web App** (berakhiran `/exec`).
6. Buka `src/pages/wedding/WeddingPageRezaKirana.tsx`, isi:
   ```ts
   const SHEETS_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
   ```
7. Selesai. Jika `SHEETS_ENDPOINT` kosong, form tetap jalan tapi data hanya tersimpan sementara
   di layar (mode demo).

> Catatan: reaction emoji (❤️😂🎉) di kolom komentar **tidak** dikirim ke Sheets — cukup counter
> lokal per sesi browser, sesuai desain undangan ini.

> Setiap kali kode Apps Script diubah, buat **deployment baru** (Manage deployments → Edit → New version).

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
  return ContentService.createTextOutput(JSON.stringify({ ok: true, ucapan: out }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Catatan CORS
Frontend mengirim `POST` dengan `Content-Type: text/plain` + `mode: "no-cors"` agar tidak memicu
CORS preflight ke Apps Script. Payload tetap JSON string dan dibaca `JSON.parse(e.postData.contents)`.
Karena `no-cors`, respons tidak bisa dibaca (fire-and-forget), tapi data tetap masuk ke Sheet.
