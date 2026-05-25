# Quick Start Guide - Smart Attendance System

Panduan cepat untuk menggunakan semua fitur baru yang telah diimplementasikan.

## 🎯 Akses Menu Admin

Setelah aplikasi berjalan, akses halaman admin melalui:
- **Admin Dashboard:** http://localhost:3000/admin

## 📌 Menu Admin yang Tersedia

### 1. Data Pegawai (`/admin/employees`)
Kelola database pegawai institusi.

**Apa yang bisa dilakukan:**
- ➕ **Tambah Pegawai** - Click tombol "Tambah Pegawai"
  - Isi nama, email, NIP, jabatan, departemen, alamat
  - Set status (Aktif/Nonaktif)
  - Submit form

- 🔍 **Cari Pegawai** - Gunakan search box
  - Search by nama, email, atau NIP
  - Real-time filtering

- 🏷️ **Filter Pegawai** - Gunakan dropdown filter
  - Filter by departemen (Teknik Informatika, Sistem Informasi, Akademik, Administrasi)
  - Filter by status (Aktif/Nonaktif)

- ✏️ **Edit Pegawai** - Click menu (⋮) → Edit
  - Update semua data pegawai
  - Save changes

- 🗑️ **Hapus Pegawai** - Click menu (⋮) → Hapus
  - Konfirmasi sebelum delete
  - Data akan dihapus dari sistem

**Mock Data yang Tersedia:**
- Dr. Ahmad Wijaya (Dosen Tetap, Teknik Informatika)
- Siti Nurhaliza (Dosen Tetap, Sistem Informasi)
- Budi Santoso (Staf Akademik, Akademik)
- Rini Wijayanti (Staf Administrasi, Administrasi)

---

### 2. Pengaturan Lokasi (`/admin/settings`)
Konfigurasi lokasi kantor dan radius verifikasi GPS.

**Apa yang bisa dilakukan:**
- 📍 **Dapatkan Lokasi Saat Ini** - Click tombol
  - Automatic fill latitude/longitude dari GPS device Anda
  - Perlu allow permission akses lokasi browser

- ⚙️ **Konfigurasi Lokasi**
  - **Nama Kantor** - Identitas kantor (mis: "Kampus STMIK El Rahma")
  - **Latitude/Longitude** - Koordinat GPS
  - **Radius Verifikasi** - Jarak dalam meter (default 100m)
    - Pegawai harus dalam radius ini untuk absen sukses
    - Recommended: 100-500 meter
  - **Alamat Kantor** - Alamat lengkap
  - **Jam Kerja** - Start time dan end time

- 💾 **Simpan Pengaturan** - Click tombol
  - All settings saved ke localStorage
  - Lihat info lokasi saat ini di bawah

**Current Defaults:**
- Lokasi: Kampus STMIK El Rahma (Yogyakarta)
- Latitude: -7.7956
- Longitude: 110.4038
- Radius: 100m
- Jam Kerja: 07:30 - 16:00

---

### 3. Absensi Manual (`/admin/manual-attendance`)
Input absensi pegawai secara manual - per pegawai atau bulk import.

#### Mode 1: Input Per Pegawai
Ideal untuk input absensi 1-2 pegawai atau absensi lampau.

**Steps:**
1. Stay di tab "Input Per Pegawai" (default)
2. **Pilih Pegawai** - Select dari dropdown
3. **Tanggal** - Select date (default: hari ini)
4. **Status** - Pilih status:
   - Hadir (require jam masuk)
   - Izin (optional notes)
   - Sakit (optional notes)
   - Libur
5. **Jam Masuk** (jika Hadir) - Input waktu format HH:MM
6. **Jam Keluar** (optional) - Input waktu format HH:MM
7. **Catatan** - Add notes (optional)
8. Click **"Simpan Absensi"** - Done!

#### Mode 2: Bulk Import CSV
Ideal untuk import banyak data absensi sekaligus.

**Steps:**
1. Click tab **"Import CSV"**
2. **Download Template** - Click tombol untuk download template
3. **Fill Template** dengan data:
   ```
   nip,email,date,checkInTime,checkOutTime,status,notes
   19701015199203001,ahmad.wijaya@stmik.ac.id,2026-05-25,08:15,17:30,hadir,
   19750520199303002,siti.nurhaliza@stmik.ac.id,2026-05-25,08:30,,hadir,
   ```
4. **Drag-drop atau click** area upload untuk upload file
5. Sistem akan process dan show hasil (success/fail count)

**Format CSV:**
| Field | Format | Contoh | Required? |
|-------|--------|--------|-----------|
| nip | Numeric | 19701015199203001 | ✓ |
| email | Email | ahmad.wijaya@stmik.ac.id | ✓ |
| date | YYYY-MM-DD | 2026-05-25 | ✓ |
| checkInTime | HH:MM | 08:15 | Untuk status hadir |
| checkOutTime | HH:MM | 17:30 | Optional |
| status | hadir/izin/sakit/libur | hadir | ✓ |
| notes | Text | Optional notes | Optional |

---

### 4. Riwayat Absensi (`/admin/attendance-history`)
Lihat, filter, dan export data absensi pegawai.

**Statistics Dashboard:**
- **Total** - Total records yang match filter
- **Hadir** - Jumlah hadir
- **Izin** - Jumlah izin
- **Sakit** - Jumlah sakit
- **Libur** - Jumlah libur
- **Belum Absen** - Jumlah belum absen

**Filter & Search:**
- 🔍 **Search** - By employee name atau attendance ID
- 👤 **Filter Pegawai** - Select employee tertentu atau "Semua Pegawai"
- 📊 **Filter Status** - Select status atau "Semua Status"
- 📅 **Dari Tanggal** - Start date filter
- 📅 **Sampai Tanggal** - End date filter

**Main Table Columns:**
- Tanggal - Format: Thu, May 25, 2026
- Nama Pegawai
- Jam Masuk
- Jam Keluar
- Status - Dengan color badge (Hadir=green, Izin=blue, Sakit=yellow, dll)
- Confidence - Face detection confidence (jika ada)
- Catatan

**Export Feature:**
- Click **"Export CSV"** button
- Akan download file dengan semua filtered records
- Filename: attendance_YYYY-MM-DD.csv

**Per-Employee Summary (jika filter "Semua Pegawai"):**
- Breakdown per employee: Hadir | Izin | Sakit | Total
- Untuk quick overview of performance

---

## 🌙 Dark Mode

Fitur dark mode sudah implemented dan stable di semua halaman!

**Features:**
- Auto-detects system preference (light/dark)
- Toggle di topbar (jika ada)
- Smooth transitions antara mode
- Consistent colors di semua pages
- Status badges dengan proper contrast

---

## 📸 Face Detection Camera (Future Integration)

Komponen face detection sudah ready di:
- `components/face-detection-camera.tsx`

**Apa yang bisa dilakukan:**
- Realtime camera preview
- Face detection dengan TensorFlow.js
- Confidence score visualization
- Photo capture button (active only saat face detected)
- Minimum 70% confidence requirement

**Cara mengintegrasikan ke attendance check-in:**
```tsx
import { FaceDetectionCamera } from '@/components/face-detection-camera';

<FaceDetectionCamera 
  onCapture={(imageData, confidence) => {
    // Save imageData dan confidence ke attendance record
  }}
/>
```

---

## 🔧 Technical Details

### Data Storage
Semua data disimpan di **browser localStorage**:
- Tidak perlu server/database untuk development
- Persisten sampai user clear browser data
- Automatic mock data initialization

### Initialization
Setiap page admin automatically call `initializeStorage()`:
```tsx
useEffect(() => {
  initializeStorage();
}, []);
```

### Available Services
- `employeeService` - Employee CRUD
- `attendanceService` - Attendance CRUD
- `locationService` - Location settings + GPS calculation
- `leaveRequestService` - Leave request management

---

## 🎨 UI Components

Semua component sudah support dark mode:
- `DarkCard` - Card container
- `DarkButton` - Buttons (primary/secondary/ghost/danger)
- `DarkInput` - Input fields
- `DarkSelect` - Select dropdowns
- `DarkTable` - Tables dengan styling
- `DarkBadge` - Status badges dengan colors

---

## 📱 Browser Requirements

- Modern browser dengan support:
  - **Geolocation API** - Untuk GPS location
  - **Camera Access** - Untuk face detection
  - **localStorage** - Untuk data persistence
  - **Canvas API** - Untuk photo capture

**Recommended:**
- Chrome/Edge v90+
- Firefox v88+
- Safari v15+

---

## ⚠️ Important Notes

1. **Permission Request**
   - Camera: Required untuk face detection
   - Location: Required untuk GPS verification
   - Allow saat browser minta permission

2. **Data Persistence**
   - Data tersimpan di localStorage (browser-specific)
   - Clear cache/cookies akan delete semua data
   - Backup penting data jika diperlukan!

3. **File Upload**
   - CSV max file size: ~10MB
   - Format harus sesuai template
   - Invalid rows akan skip dengan error message

4. **Date Format**
   - Gunakan format: YYYY-MM-DD
   - Time format: HH:MM (24-hour)

---

## 🚀 Next Steps

1. **Test Semua Fitur**
   - Add beberapa employee
   - Set location settings
   - Input beberapa attendance records
   - Check history dan filter

2. **Backend Integration** (Future)
   - Replace localStorage dengan REST API
   - Setup database (PostgreSQL/MongoDB)
   - Implement authentication

3. **Optimization**
   - Implement face recognition (match dengan registered photo)
   - Real-time notifications
   - Mobile responsive improvements

---

## 💡 Tips & Tricks

- **Bulk Data:** Untuk bulk import, download template CSV terlebih dahulu
- **Filters:** Combine multiple filters untuk hasil yang lebih spesifik
- **Export:** Export regularly untuk backup data
- **Search:** Search case-insensitive dan real-time
- **Dark Mode:** Automatic switch based on system preference

---

## 🆘 Troubleshooting

**Q: Face detection tidak jalan**
- A: Pastikan camera permission sudah allow, browser modern, model loading

**Q: GPS location tidak detect**
- A: Ensure location permission, HTTPS pada production, valid coordinates

**Q: CSV import error**
- A: Check format sesuai template, valid email/NIP, date format correct

**Q: Dark mode tidak appear**
- A: Clear cache, check localStorage, restart browser

---

Selamat menggunakan Smart Attendance System! 🎉
