# TaskFlow Pro 🚀

TaskFlow Pro adalah aplikasi manajemen tugas modern yang dibangun dengan fokus pada kecepatan, efisiensi, dan antarmuka pengguna yang indah.

## ✨ Fitur Utama

- **Manajemen Tugas**: Buat, perbarui, dan hapus tugas dengan mudah.
- **Kategori**: Organisir tugas Anda berdasarkan kategori yang dapat disesuaikan.
- **Prioritas**: Atur tingkat kepentingan tugas (Low, Medium, High).
- **Notifikasi**: Dapatkan informasi real-time tentang tugas yang jatuh tempo atau pembaruan terbaru.
- **Mode Gelap/Terang**: Dukungan penuh untuk mode gelap yang nyaman di mata.
- **Autentikasi**: Sistem login dan registrasi yang aman menggunakan NextAuth.js.

## 🛠️ Teknologi yang Digunakan

- **Framework**: Next.js 15 (App Router)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS & Framer Motion (Animasi)
- **Database**: MySQL (mysql2)
- **Autentikasi**: NextAuth.js & BCrypt
- **Icons**: Lucide React

## 🚀 Memulai

### Prasyarat

- Node.js versi terbaru
- Database MySQL (misalnya menggunakan Laragon atau XAMPP)

### Instalasi

1. **Clone repositori**:

   ```bash
   git clone https://github.com/KevinAuliaReynaldi/taskflow-pro.git
   cd taskflow-pro
   ```

2. **Instal dependensi**:

   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Salin file `.env.example` (jika ada) atau buat file `.env.local` dengan variabel berikut:

   ```env
   DATABASE_HOST=localhost
   DATABASE_NAME=taskflow_db
   DATABASE_USER=root
   DATABASE_PASSWORD=
   NEXTAUTH_SECRET=rahasia_anda_di_sini
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Jalankan aplikasi**:

   ```bash
   npm run dev
   ```

5. **Akses aplikasi**:
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📝 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan portofolio oleh **Kevin Aulia Reynaldi**.
