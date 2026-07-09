# Setup Backend Google Sheets (RSVP & Ucapan) — Dimas & Laila

Undangan ini menyimpan **RSVP** dan **Ucapan** ke Google Sheets lewat **Google Apps Script Web App**
(tanpa server sendiri). Ikuti langkah berikut, lalu tempel URL-nya ke `SHEETS_ENDPOINT`
di `src/pages/wedding/WeddingPageDimasLaila.tsx`.

## Langkah

1. Buat **Google Sheet** baru. Buat **2 tab (sheet)**:
   - Tab bernama `RSVP` dengan header baris pertama: `Timestamp | Nama | Kehadiran | Jumlah | Pesan`
   - Tab bernama `Ucapan` dengan header baris pertama: `Timestamp | Nama | Pesan`
2. Menu **Extensions → Apps Script**.
3. Hapus isi default, **tempel kode di bawah**, lalu Save.
4. **Deploy → New deployment → Type: Web app**.
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
5. Klik **Deploy**, izinkan akses, lalu **salin URL Web App** (berakhiran `/exec`).
6. Buka `src/pages/wedding/WeddingPageDimasLaila.tsx`, isi:
   ```ts
   const SHEETS_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
   ```
7. Selesai. Kalau `SHEETS_ENDPOINT` dibiarkan kosong, form tetap berfungsi tapi data hanya
   tersimpan sementara di layar (mode demo/fallback lokal).

> Setiap kali kode Apps Script diubah, buat **deployment baru** (atau "Manage deployments → Edit → New version").

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
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Mengembalikan daftar ucapan (untuk ditampilkan sebagai chat bubble)
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ucapan');
  var values = sheet.getDataRange().getValues();
  values.shift(); // buang header
  var out = values
    .filter(function (r) { return r[1] || r[2]; })
    .map(function (r) {
      return { time: r[0], nama: r[1], pesan: r[2] };
    });
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, ucapan: out }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Catatan CORS
Frontend mengirim `POST` dengan `Content-Type: text/plain` agar tidak memicu CORS preflight
ke Apps Script. Payload tetap berupa JSON string. Ini pola standar untuk Apps Script Web App.
