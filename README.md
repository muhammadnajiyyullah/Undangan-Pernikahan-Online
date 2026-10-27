# Undangan Pernikahan Digital

HTML + CSS + JavaScript murni, tanpa build. Seluruh data ada di **`js/config.js`**.

## Struktur
```
index.html        – markup 20 section sesuai blueprint
css/style.css     – design system (palet, font, komponen, animasi, dark mode)
js/config.js      – SEMUA data undangan (edit di sini)
js/app.js         – logika (envelope, musik, countdown, gallery, RSVP, dll.)
assets/           – foto & media (sekarang masih placeholder .svg)
```

## Cara pakai
1. Edit `js/config.js` (nama, tanggal, lokasi, rekening, dll.).
2. Ganti aset di `assets/` lalu perbarui path di config:
   - `groom.webp`, `bride.webp`, `g1..g8.webp` (gunakan WebP), `cover`, `closing`, `video` (thumbnail)
   - `music.mp3` – musik latar (belum disertakan)
   - `qris.png` – QRIS asli (jangan di-crop/kompres)
   - Gambar `cover` dan `closing` diset di `js/app.js` (`assets/cover.svg`, `assets/closing.svg`) – ubah path-nya jika memakai file lain.
3. Jalankan lewat server (mis. Laragon: `http://localhost/Undangan%20Pernikahan/`).
4. Personalisasi tamu: `index.html?to=Nama+Tamu`.

## RSVP & Wishes
- Default: tersimpan di `localStorage` perangkat tamu + tombol konfirmasi WhatsApp.
- Permanen (Google Sheets): buat Apps Script, deploy sebagai Web App (akses: Anyone), tempel URL ke `endpoint` di config.

```js
// Apps Script – sheet bernama "Data" (kolom: type,name,attend,count,message,time)
function doPost(e){
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActive().getSheetByName('Data')
    .appendRow([d.type,d.name,d.attend||'',d.count||'',d.message||'',new Date(d.time)]);
  return ContentService.createTextOutput('ok');
}
function doGet(e){
  const rows = SpreadsheetApp.getActive().getSheetByName('Data').getDataRange().getValues().slice(1)
    .filter(r=>r[0]==='wish').map(r=>({name:r[1],message:r[4],time:new Date(r[5]).getTime()}));
  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}
```

## Catatan
- Musik dimulai saat tombol **BUKA UNDANGAN** diklik (autoplay diblokir browser).
- `prefers-reduced-motion` mematikan animasi berlebih; efek bunga otomatis mati di perangkat lemah dan bisa dimatikan lewat tombol.
- Dark mode & efek bunga tersimpan di preferensi browser.
