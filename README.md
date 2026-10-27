<div align="center">

# 🌍 AirAware — Real-Time Air Quality & Atmospheric Command Center

**Platform Pemantauan Kualitas Udara, Konsentrasi Polutan, dan Kondisi Atmosfer Berbasis Peta Radar Interaktif secara *Real-Time***

[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Fast_Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Modern_UI-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Open-Meteo API](https://img.shields.io/badge/API-Open--Meteo_Air_Quality-10B981?style=for-the-badge)](https://open-meteo.com/)
[![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)]()

</div>

---

## 📖 Tentang Proyek

**AirAware** adalah aplikasi web *dashboard* pemantauan kualitas udara modern yang dirancang dengan antarmuka **Command Center** bervisibilitas tinggi. Aplikasi ini secara otomatis melakukan sinkronisasi data polutan udara dan cuaca begitu halaman pertama kali dibuka tanpa memerlukan konfigurasi *API Key* berbayar.

Dilengkapi dengan kanvas peta radar interaktif, panel **Monitoring Station** berukuran besar yang mudah dibaca, kontrol navigasi peta yang ergonomis, serta panduan kesehatan dinamis, **AirAware** membantu masyarakat, peneliti, maupun instansi memantau kondisi udara di berbagai kota di Indonesia dan seluruh dunia secara *real-time*.

---

## ✨ Fitur Unggulan

### 1. 🔄 Sinkronisasi Otomatis *Real-Time* (*Zero-Config Live API*)
* Mengambil data langsung dari **Open-Meteo Air Quality API** dan **Weather Forecast API** saat aplikasi pertama kali dijalankan.
* Pembaruan data berkala otomatis (*auto-sync*) serta tombol **Sync** manual untuk memastikan keakuratan data setiap stasiun.
* Dilengkapi sistem *Smart Fallback* dan dukungan *endpoint* lokal (`/resources/airquality.json`) agar aplikasi tetap berjalan stabil tanpa kendala meskipun jaringan terputus.

### 2. 📊 Panel *Monitoring Station* Berukuran Besar & Komprehensif
* **Indikator AQI Ganda:** Menampilkan skor **US AQI** dan **European AQI** dengan grafik lingkaran (*radial gauge*) animasi yang berubah warna mengikuti tingkat bahaya polusi.
* **Pemantauan 6 Polutan Utama:** Menampilkan konsentrasi $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{O}_3$, $\text{SO}_2$ (dalam satuan $\mu\text{g/m}^3$), serta $\text{CO}$ (dalam satuan $\text{mg/m}^3$) lengkap dengan *progress bar* indikator ambang batas.
* **Telemetri Cuaca Atmosfer:** Memantau suhu udara ($^\circ\text{C}$), kelembapan relatif ($\%$), serta kecepatan dan arah angin ($\text{km/j}$).
* **Grafik Tren AQI:** Visualisasi diagram batang untuk memantau fluktuasi indeks kualitas udara dari waktu ke waktu.

### 3. 🗺️ Peta Radar Vektor Interaktif & Animasi Aliran Angin
* **Navigasi Peta Penuh:** Mendukung fitur *Drag/Pan* (geser peta) dan kontrol *Zoom In* ($+$) / *Zoom Out* ($-$) berukuran besar yang responsif.
* **Multi-Layer Mode:** Beralih antara mode tampilan **Radar Taktis** dan **Satelit** dengan satu klik.
* **Animasi Partikel Angin & Gelombang Radar:** Visualisasi aliran angin dinamis di latar peta serta efek *pulse ring* pada setiap titik stasiun pemantauan.

### 4. 🔍 Pencarian Kota Global & Deteksi Lokasi GPS (*Locate Me*)
* **Global City Search:** Terintegrasi dengan *Geocoding API* untuk mencari kota mana pun di Indonesia maupun dunia (misalnya: *Yogyakarta, Surabaya, Tokyo, London*) dan langsung menambahkan titik pantau baru ke atas peta.
* **GPS Geolocation:** Fitur satu klik untuk mendeteksi koordinat pengguna saat ini dan mengambil data kualitas udara tepat di titik lokasi pengguna.

### 5. 🩺 Panduan Medis & Rekomendasi Kesehatan Dinamis
* Memberikan peringatan dini dan saran tindakan perlindungan diri yang disesuaikan secara otomatis berdasarkan tingkat indeks AQI di stasiun yang sedang dipilih.

---

## 🎨 Standar Kategori Indeks Kualitas Udara (US AQI)

Aplikasi ini mengacu pada standar baku **US AQI** dengan pengodean warna visual sebagai berikut:

| Rentang AQI | Kategori Status | Kode Warna | Dampak & Rekomendasi Kesehatan |
| :--- | :--- | :--- | :--- |
| **$0 - 50$** | **Baik (*Good*)** | 🟢 Emerald (`#10b981`) | Kualitas udara sangat bersih dan aman untuk seluruh aktivitas luar ruangan. |
| **$51 - 100$** | **Sedang (*Moderate*)** | 🟡 Amber (`#f59e0b`) | Kualitas udara dapat diterima; kelompok sangat sensitif sebaiknya membatasi aktivitas fisik berat yang berkepanjangan. |
| **$101 - 150$** | **Tidak Sehat bagi Kelompok Sensitif** | 🟠 Orange (`#f97316`) | Anak-anak, lansia, dan penderita asma/alergi disarankan menggunakan masker saat beraktivitas di luar ruangan. |
| **$151 - 200$** | **Tidak Sehat (*Unhealthy*)** | 🔴 Red (`#ef4444`) | Masyarakat umum mulai terdampak; wajib menggunakan masker respirator (KN95/N95) dan kurangi kegiatan luar ruang. |
| **$201 - 300$** | **Sangat Tidak Sehat (*Very Unhealthy*)** | 🟣 Purple (`#a855f7`) | Peringatan kesehatan darurat; hindari seluruh aktivitas di luar ruangan dan nyalakan penyaring udara (*Air Purifier*). |
| **$> 300$** | **Berbahaya (*Hazardous*)** | 🟤 Rose (`#e11d48`) | Kondisi darurat toksik; tetap berada di dalam ruangan tertutup rapat. |

---

## 🛠️ Teknologi yang Digunakan

* **Frontend Framework:** [React.js](https://react.dev/) (Hooks, Memoization, State Management)
* **Build Tool & Bundler:** [Vite](https://vitejs.dev/)
* **Styling & Animasi:** [Tailwind CSS](https://tailwindcss.com/) + Custom Keyframe Animations (Radar Sweep, Pulse Ring, Wind Particle Flow)
* **Data & Layanan API:**
  * **Open-Meteo Air Quality API:** Data konsentrasi polutan ($\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, $\text{O}_3$, $\text{CO}$) & indeks AQI.
  * **Open-Meteo Weather Forecast API:** Data suhu, kelembapan, dan kecepatan angin.
  * **Open-Meteo Geocoding API:** Pencarian koordinat kota di seluruh dunia.
  * **Browser Geolocation API:** Pelacakan titik koordinat GPS pengguna.

---

## 📂 Struktur Direktori Proyek

```text
AirAware/
├── public/
│   └── resources/               # (Opsional) Menyimpan data fallback JSON lokal
├── src/
│   ├── services/
│   │   └── airQualityApi.js     # Modul integrasi API, konversi koordinat, & kalkulasi kategori AQI
│   ├── App.jsx                  # Komponen utama Command Center, Peta Interaktif, & Panel Monitoring
│   ├── index.css                # Konfigurasi Tailwind CSS, animasi radar/angin, & custom scrollbar
│   └── main.jsx                 # Entry point aplikasi React
├── index.html                   # Template HTML utama
├── package.json                 # Daftar dependensi dan script proyek
├── vite.config.js               # Konfigurasi bundler Vite
└── README.md                    # Dokumentasi proyek
```

---

## 🚀 Cara Instalasi & Menjalankan Proyek

Ikuti langkah-langkah berikut untuk menjalankan **AirAware** di komputer lokal Anda:

### 1. Prasyarat
Pastikan Anda telah menginstal **Node.js** (versi $18.0$ atau lebih baru) dan **npm**.

### 2. Masuk ke Direktori Proyek & Instal Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan (*Development Server*)
```bash
npm run dev
```
Buka browser dan akses alamat yang tertera di terminal (umumnya `http://localhost:5173`).

### 4. *Build* untuk Produksi (*Production Build*)
```bash
npm run build
npm run preview
```

---

## 🔌 Spesifikasi Integrasi API

Aplikasi ini terhubung secara langsung dengan tiga layanan publik tanpa memerlukan *API Key* tambahan:

1. **Air Quality Endpoint:**
   ```http
   GET https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=us_aqi,pm2_5&forecast_days=1
   ```
2. **Weather Telemetry Endpoint:**
   ```http
   GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m
   ```
3. **Global City Geocoding Endpoint:**
   ```http
   GET https://geocoding-api.open-meteo.com/v1/search?name={city_name}&count=5&language=id&format=json
   ```

---

## 💡 Panduan Penggunaan Singkat

1. **Memilih Stasiun:** Klik pin angka AQI pada peta atau buka tab **Daftar** di panel sebelah kiri untuk berpindah antar stasiun pemantauan.
2. **Mencari Kota Baru:** Ketik nama kota pada bilah pencarian di bagian atas layar, lalu klik tombol **+ Pantau AQI** pada hasil pencarian.
3. **Mengontrol Peta:**
   * Klik dan tahan (*drag*) pada area peta untuk menggeser tampilan.
   * Gunakan tombol **$+$** dan **$-$** berukuran besar di sebelah kanan untuk memperbesar atau memperkecil tampilan peta.
   * Klik **GPS** untuk memantau kualitas udara di lokasi Anda saat ini.
   * Klik **Sync** untuk memuat ulang data terbaru dari server API.
   * Klik **Layer** untuk mengganti tema peta dan **Angin** untuk menyalakan/mematikan animasi aliran udara.

---

<div align="center">
  <p>Dibangun dengan dedikasi untuk pemantauan lingkungan dan kesehatan udara yang lebih baik.</p>
  <p><strong>© 2026 AirAware Monitoring System</strong></p>
</div>