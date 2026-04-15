# 🕒 Pantau Kerja - WFH Attendance Management

Pantau Kerja adalah aplikasi Full-Stack berbasis **NestJS** (Backend) dan **React + Vite** (Frontend) yang dirancang khusus untuk memonitor absensi karyawan yang sedang berkerja secara remote (Work From Home). Aplikasi ini mendokumentasikan log absensi secara *real-time* berserta lampiran foto dan detail karyawan terkait.

## 🚀 Fitur Utama
- **Sistem Autentikasi**: Berbasis Role (Admin dan Karyawan) dengan JWT.
- **Kamera Terintegrasi**: Fitur *Clock In* dan *Clock Out* wajib menyertakan bukti lampiran foto bagi karyawan.
- **Microservice/Monolithic Architecture Ready**: Struktur API backend yang ter-modularisasi memastikan skalabilitas di masa mendatang.
- **Manajemen Karyawan Master (CRUD)**: Pembuatan, pengecekan riwayat absensi, pembaharuan, dan penonaktifan akun karyawan oleh admin.
- **Monitoring Data Dashboard**: Perekaman history absensi yang solid dengan fitur filter *By Date*, *Position*, *Department*, dsb.

## 🖥️ Tech Stack

### Frontend
- **Framework**: React.js 19 (via Vite)
- **Styling**: TailwindCSS v4 (implementasi Glassmorphism Design UI)
- **Form Handling**: React Hook Form
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios dengan Interceptor
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS (TypeScript)
- **ORM**: TypeORM
- **Database**: MySQL Server (via Docker Compose)
- **Authentication**: Passport-JWT & Bcrypt untuk proteksi Password.
- **Validation**: Class-Validator & Class-Transformer.
- **Documentation**: Swagger UI (`@nestjs/swagger`)

---

## ⚙️ Cara Instalasi & Menjalankan Aplikasi

### 1. Persyaratan Sistem
Pastikan perangkat Anda telah ter-instal:
- [Node.js](https://nodejs.org/en/) (Versi >= 18)
- [Git](https://git-scm.com/)
- [Docker & Docker Compose](https://www.docker.com/)

### 2. Inisiasi Database (Docker)
Langkah ini krusial untuk menjalankan container MySQL lokal.
```bash
# Buka terminal di root project
docker compose up -d
```
*Port default MySQL (3306) akan dipublikasikan. Password default adalah `password`.*

### 3. Konfigurasi Backend
Mempersiapkan server API Backend.
```bash
# Pindah ke direktori backend
cd backend

# Install dependencies
npm install

# (Opsional) Sesuaikan .env. File .env secara default mungkin tidak tersinkronisasi di git. 
# Jika diperlukan, buat file `.env` dan setting koneksi DB dan JWT_SECRET.
```

Sebelum menjalankan, jalankan *Database Seeder* terlebih dahulu untuk menginjeksi peran Admin Master:
```bash
npm run seed
```

Jalankan Server Backend (API terbuka di http://localhost:3000):
```bash
npm run start:dev
```

### 4. Konfigurasi Frontend
Di tab terminal baru, mari jalankan User Interface-nya:
```bash
# Kembali ke root, kemudian masuk ke direktori frontend
cd frontend

# Install dependencies
npm install

# Jalankan Vite server (UI terbuka di http://localhost:5173)
npm run dev
```

---

## 🔀 User Flow

### A. Role: Administrator Master
> Kredensial default: \
> **Username**: `admin` \
> **Password**: `admin123`

1. Masuk (*Sign-in*) dengan kredensial di atas.
2. Dialihkan ke **Monitoring Dashboard**: Di sini, Admin dapat memantau history absensi karyawan yang check in/out menggunakan filter nama, dan rentang tanggal. Admin bisa melihat lampiran foto dari masing-masing log.
3. Menuju Tab **Management Employees**: Admin dapat mendaftarkan karyawan baru. Saat didaftarkan, karyawan otomatis akan mendapatkan username & password untuk login.
4. Pada kolom **Employee Akses**, Admin juga bisa mencari detail histori absensi karyawan tertentu dengan detail, atau pun mengedit *Role* hingga melakukan Pemecatan / Deaktivasi.

### B. Role: Employee (Karyawan WFH)
> Kredensial: *(Diperoleh setelah Admin mendaftarkan data di Menu Management)*

1. Masuk menggunakan *Username* dan *Password* yang diberikan Admin.
2. Dialihkan ke **Dashboard Absensi Karyawan**. 
3. **Mulai Kerja (Clock In)**: Karyawan membidik kamera (menggunakan file browser / webcam bawaan *Mobile*), melampirkan foto beserta dengan *Catatan Shift*, kemudian Submit.
4. Label Status Harian karyawan pada Dashboard akan berubah menjadi Hijau (sudah absen masuk).
5. **Selesai Kerja (Clock Out)**: Di penghujung hari, langkah kerja persis sama diulang untuk mensubmit Absensi Pulang. Bar Clock-Out akan berubah berstatus completed (Biru).
6. Menuju Tab **My History**: Karyawan dapat memilah dan me-review secara mandiri total kedisiplinannya berdasarkan waktu dan foto.

---

## 💡 Dokumentasi API Tambahan
Dokumentasi Endpoints menggunakan API Swagger UI telah disediakan. Saat server API sedang berjalan, cek skema Endpoint secara interaktif via url browser: \
[http://localhost:3000/api/docs](http://localhost:3000/api/docs)
