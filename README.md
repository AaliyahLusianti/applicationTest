# Everyday Store - aplikasi sederhana dengan bug

Toko mini untuk latihan pengujian aplikasi. Hanya katalog, pencarian, jumlah barang, promo, dan checkout. Tidak ada dashboard, pelaporan QA, AI, login, backend, penyimpanan pesanan, atau transaksi nyata.

## Menjalankan

```sh
npm install
npm run dev
```

Buka URL yang ditampilkan Vite. Pemeriksaan: `npm test` dan `npm run build`.

## Daftar bug untuk pengujian

Semua bug sengaja aktif pada aplikasi. Error proses di bawah benar-benar dilempar oleh JavaScript (`throw`), lalu ditangkap agar pesan merah muncul tanpa membuat halaman blank. Error juga tercatat di console browser. Ini simulasi lokal, bukan kegagalan backend atau respons HTTP sungguhan.

## Error saat klik atau menjalankan proses

| Aksi           | Cara reproduksi                                   | Error yang muncul                                            |
| -------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| Terapkan promo | Isi `HEMAT10`, klik **Terapkan**                  | `PROMO_PROCESS_FAILED`: gagal membaca data persentase diskon |
| Buat pesanan   | Isi email `qa@example.com`, klik **Buat pesanan** | `ORDER_CREATE_FAILED`: proses penyimpanan pesanan gagal      |

Promo tidak diterapkan dan pesanan tidak dibuat setelah kegagalan. Checkout dengan email kosong menampilkan `EMAIL_INVALID`; ini validasi biasa, bukan bug penyimpanan. Klik ikon reset untuk membersihkan pesan dan mengulang proses.

## Bug tambahan

| Bug                       | Cara reproduksi                          | Hasil aktual                            | Hasil yang diharapkan         |
| ------------------------- | ---------------------------------------- | --------------------------------------- | ----------------------------- |
| Pencarian peka kapital    | Cari `canvas`                            | Produk tidak ditemukan                  | Canvas Tote ditemukan         |
| Jumlah negatif diterima   | Isi jumlah `-2`                          | Subtotal negatif                        | Jumlah ditolak atau minimal 1 |
| Batas gratis ongkir salah | Pilih Canvas Tote, jumlah 2, tanpa promo | Ongkir Rp15.000 pada subtotal Rp200.000 | Gratis ongkir mulai Rp200.000 |

Klik ikon reset pesanan untuk mengulang pengujian. Refresh halaman juga mengembalikan kondisi awal.

Logika bug berada di `src/domain.js`, dengan pengaktifan di `src/main.js`. Unit test memeriksa perilaku buggy yang disengaja dan membandingkannya dengan perilaku normal.

Foto produk dari Unsplash dan font dari Google Fonts memerlukan internet. Semua logika toko berjalan lokal. Gunakan data email fiktif untuk pengujian.
