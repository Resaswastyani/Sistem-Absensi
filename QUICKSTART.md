# Quick Start Guide - Sistem Absensi STMIK El Rahma

## 🚀 Memulai Dalam 3 Langkah

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Jalankan Development Server
```bash
pnpm dev
```

### 3. Buka di Browser
```
http://localhost:3000
```

---

## 📱 Mengakses Halaman

### Halaman User
- **Login:** `http://localhost:3000`
- **Dashboard:** `http://localhost:3000/dashboard`
- **Pengajuan Izin/Sakit/Cuti:** `http://localhost:3000/requests`

### Halaman Admin
- **Admin Dashboard:** `http://localhost:3000/admin`
- **Data Pegawai:** `http://localhost:3000/admin/employees`

---

## 🎯 Demo Features

### Login Page
- Username: (silakan masukkan email institusi)
- Password: (silakan masukkan password)
- Klik "Masuk" untuk login

### User Dashboard
1. **Status Kehadiran:** Lihat status hari ini (Hadir/Izin/Sakit)
2. **Tombol Absensi:** Klik "Absen Masuk" atau "Absen Keluar"
3. **Riwayat Absensi:** Scroll ke bawah untuk melihat riwayat
4. **Pengajuan:** Klik menu "Pengajuan" di sidebar

### Attendance Modal
1. Klik tombol "Absen Masuk"
2. **Langkah 1:** Ambil foto dengan kamera
3. **Langkah 2:** Verifikasi lokasi
4. **Langkah 3:** Review data dan konfirmasi

### Admin Dashboard
1. Lihat statistik overview (Total Pegawai, Hadir, Izin/Sakit)
2. Monitor tabel Data Absensi Hari Ini
3. Gunakan search & filter untuk mencari pegawai
4. Lihat summary cards untuk metrics tambahan

### Data Pegawai
1. Lihat daftar semua pegawai
2. Search berdasarkan nama atau email
3. Filter berdasarkan jabatan (Dosen/Karyawan/Tendik)
4. Klik menu tiga titik untuk aksi tambahan

---

## 🛠️ Struktur Project

```
v0-project/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Login page
│   ├── globals.css                # Global styles & themes
│   ├── dashboard/
│   │   └── page.tsx              # User dashboard
│   ├── requests/
│   │   └── page.tsx              # Requests/izin page
│   └── admin/
│       ├── page.tsx              # Admin dashboard
│       └── employees/
│           └── page.tsx          # Employee management
│
├── components/
│   ├── sidebar.tsx               # Navigation sidebar
│   ├── topbar.tsx                # Header/topbar
│   ├── login-page.tsx            # Login form
│   ├── user-dashboard.tsx        # Dashboard content
│   ├── admin-dashboard.tsx       # Admin dashboard content
│   └── attendance-modal.tsx      # Attendance modal
│
├── README.md                      # Full documentation
├── PROJECT_SUMMARY.md             # Project details
└── QUICKSTART.md                  # This file
```

---

## 🎨 Customization Guide

### Mengubah Warna
Edit `/app/globals.css` di bagian `:root`:
```css
:root {
  --primary: oklch(0.5 0.16 260);      /* Warna biru utama */
  --accent: oklch(0.55 0.15 130);      /* Warna hijau aksen */
  --background: oklch(0.98 0.002 210); /* Warna background */
  /* ... */
}
```

### Mengubah Nama Institusi
1. Edit `components/sidebar.tsx` - ganti "STMIK El Rahma"
2. Edit `components/login-page.tsx` - ganti di logo section
3. Edit `app/layout.tsx` - ganti title & description

### Mengubah Data Sample
Edit file berikut dengan data yang diinginkan:
- `components/user-dashboard.tsx` - riwayat absensi user
- `components/admin-dashboard.tsx` - data pegawai admin
- `app/requests/page.tsx` - riwayat pengajuan
- `app/admin/employees/page.tsx` - daftar pegawai

---

## 📝 Catatan Penting

### Fitur yang Memerlukan Backend
Beberapa fitur ini masih UI mockup dan memerlukan backend implementation:
- ✅ Login form (UI ready, backend needed)
- ✅ Foto capture kamera (UI ready, API needed)
- ✅ Location tracking (UI ready, geolocation API ready)
- ✅ Attendance submission (UI ready, API needed)
- ✅ Request submission (UI ready, API needed)
- ✅ Data persistence (UI ready, database needed)

### Browser Compatibility
- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

### Performance Tips
- Gunakan Chrome DevTools untuk monitoring
- Check console untuk errors
- Use `pnpm build` untuk production build
- Monitor bundle size dengan `pnpm build`

---

## 🔧 Development Tips

### Hot Reload
Setiap kali Anda mengubah file, browser akan otomatis refresh.

### Debugging
1. Buka Chrome DevTools (F12)
2. Check tab "Elements" untuk HTML structure
3. Check tab "Console" untuk JavaScript errors
4. Check tab "Network" untuk API calls

### Mobile Testing
```bash
# Set viewport untuk mobile
# Buka DevTools > Device Toolbar (Ctrl+Shift+M)
# Select device (iPhone 14, Pixel 5, dll)
```

---

## 📱 Responsive Breakpoints

- **Mobile:** 375px (default)
- **Tablet:** 768px (md breakpoint)
- **Desktop:** 1024px+ (lg breakpoint)

---

## 🎓 Learning Resources

### Teknologi yang Digunakan
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Component Libraries Referenced
- [Lucide React Icons](https://lucide.dev)
- [Leaflet Maps](https://leafletjs.com)

---

## 🚀 Deploy ke Vercel

### Menggunakan Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Menggunakan GitHub
1. Push code ke GitHub repository
2. Connect repository ke Vercel
3. Vercel otomatis deploy setiap push

---

## ❓ Troubleshooting

### Port 3000 sudah terpakai
```bash
# Gunakan port lain
pnpm dev -p 3001
```

### Error: Module not found
```bash
# Clear node_modules dan reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### CSS tidak load
```bash
# Restart development server
# Ctrl+C untuk stop, kemudian pnpm dev untuk start ulang
```

---

## 📞 Support

Untuk masalah teknis atau pertanyaan:
1. Check README.md untuk dokumentasi lengkap
2. Check PROJECT_SUMMARY.md untuk detail project
3. Lihat file components/ untuk implementasi specific features

---

## ✨ Next Steps

Setelah familiar dengan UI:
1. **Setup Backend:** Database, authentication, API endpoints
2. **Connect API:** Replace mock data dengan API calls
3. **Testing:** Unit tests, integration tests
4. **Deployment:** Deploy ke production server
5. **Monitoring:** Setup error tracking dan analytics

---

Selamat menggunakan Sistem Absensi STMIK El Rahma! 🎉
