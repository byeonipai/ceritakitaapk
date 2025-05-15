# Aplikasi Berbagi Cerita (Story App)

Aplikasi ceritakita ini memungkinkan pengguna untuk meng-upload cerita berupa gambar dan deskripsi, serta membagikan cerita mereka dengan teman-teman di sekitar lokasi mereka. Aplikasi ini mengadopsi arsitektur Single-Page Application (SPA) menggunakan JavaScript.

## Fitur
- Menampilkan daftar cerita yang diambil dari Dicoding Story API.
- Pengguna dapat menambahkan cerita baru, termasuk gambar dan deskripsi.
- Menambahkan lokasi pada cerita, dengan menggunakan peta interaktif.
- Aksesibilitas yang baik dengan teks alternatif pada gambar dan penggunaan elemen semantik.

## Fitur Tambahan
- Aplikasi dapat diinstal ke homescreen.
- Mendukung mode offline dengan IndexedDB dan Service Worker.
- Push notification untuk notifikasi cerita baru.

## Prasyarat
- Node.js
- npm (Node Package Manager)

## Langkah-Langkah Menjalankan Aplikasi
1. Clone atau Unduh Proyek Jika kamu belum mengunduh proyeknya, pastikan kamu mengunduhnya terlebih dahulu menggunakan : git clone <URL_REPOSITORY>

2. Instalasi Dependensi Setelah berhasil mengunduh proyek, buka terminal atau command prompt di dalam folder proyek. Kemudian, jalankan perintah berikut untuk menginstal semua dependensi yang diperlukan:

npm install

Perintah ini akan menginstal seluruh dependensi yang terdaftar di file package.json.

3. Menjalankan Aplikasi Setelah instalasi selesai, jalankan aplikasi dengan perintah:

npm start

Perintah ini akan menjalankan aplikasi di localhost pada port default (biasanya di http://localhost:3000).

4. Menginstal Library Tambahan Aplikasi ini membutuhkan beberapa pustaka tambahan seperti gsap dan sweetalert2. Untuk menginstalnya, jalankan perintah berikut:

npm install gsap
npm install sweetalert2
npm install idb
npm install --save-dev copy-webpack-plugin

gsap digunakan untuk animasi halus dalam aplikasi, sementara sweetalert2 digunakan untuk menampilkan popup notifikasi interaktif.

5. Verifikasi Aplikasi Setelah aplikasi berjalan, buka browser dan kunjungi http://localhost:3000 (atau sesuai dengan port yang ditentukan). Kamu akan melihat aplikasi berjalan dengan baik, menampilkan daftar cerita dengan animasi dan peta interaktif.

## Langkah-Langkah Menjalankan Push Notification
1. Pastikan browser mendukung Push API.
2. Berikan izin notifikasi saat diminta.
3. Pastikan Service Worker terdaftar dengan benar.