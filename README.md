# Sistem Absensi STMIK El Rahma

Sistem manajemen absensi berbasis web yang profesional, modern, dan responsif untuk institusi pendidikan STMIK El Rahma Yogyakarta.

## Fitur Utama

### 1. **Halaman Login**
- Form login dengan email dan password
- Desain modern dengan background gradient
- Opsi "Remember Me" dan "Forgot Password"
- Responsif di mobile dan desktop

### 2. **Dashboard User (Dosen/Karyawan/Tendik)**
- Status kehadiran harian dengan indikator visual
- Informasi jam masuk dan keluar
- Lokasi absensi
- Riwayat absensi bulanan
- Tombol akses cepat untuk absen masuk/keluar

### 3. **Fitur Absensi (Inti Sistem)**
- **Capture Foto:** Akses webcam dengan preview sebelum capture
- **Verifikasi Lokasi:** Integrasi lokasi realtime pengguna
- **Konfirmasi:** Review data sebelum submit
- Modal dialog yang user-friendly
- Validasi dan notifikasi status

### 4. **Halaman Pengajuan Izin/Sakit/Cuti**
- Form pengajuan dengan jenis: Izin, Sakit, Cuti
- Pemilihan tanggal mulai dan akhir
- Deskripsi alasan pengajuan
- Upload dokumen pendukung (khusus sakit/cuti)
- Riwayat pengajuan dengan status tracking

### 5. **Admin Dashboard**
- **Statistik Overview:**
  - Total Pegawai
  - Hadir Hari Ini
  - Izin/Sakit
  - Persentase Kehadiran Bulanan

- **Tabel Data Absensi:**
  - Informasi lengkap pegawai
  - Jam masuk/keluar
  - Lokasi absensi
  - Status (Hadir/Izin/Sakit)
  - Filter dan search

- **Summary Cards:**
  - Pengajuan pending
  - Belum absen
  - Lembur hari ini

### 6. **Data Management**
- **Data Pegawai:** Kelola semua pegawai institusi
- **Data Absensi:** Monitor absensi harian
- **Pengajuan:** Review dan validasi pengajuan izin/sakit/cuti
- **Laporan:** Statistik dan laporan kehadiran

## Struktur Teknologi

### Frontend
- **Next.js 16** - React framework dengan App Router
- **React 19** - UI components
- **Tailwind CSS** - Styling dan responsive design
- **Lucide React** - Icon library
- **Leaflet & React-Leaflet** - Map integration
- **TypeScript** - Type safety

### Design System
- **Professional Color Palette:**
  - Primary: Blue (#5770f7)
  - Accent: Green (#55b87f)
  - Neutrals: Gray scale
  
- **Modern Typography:**
  - Sans-serif default
  - Clean hierarchy
  - Readable font sizes

- **Components:**
  - Card-based UI
  - Modal dialogs
  - Data tables
  - Forms
  - Status badges
  - Navigation sidebar

## Struktur Folder

```
app/
├── layout.tsx              # Root layout
├── page.tsx               # Login page
├── dashboard/
│   └── page.tsx          # User dashboard
├── requests/
│   └── page.tsx          # Pengajuan izin/sakit/cuti
├── admin/
│   ├── page.tsx          # Admin dashboard
│   └── employees/
│       └── page.tsx      # Data pegawai
└── globals.css           # Global styles & design tokens

components/
├── sidebar.tsx           # Navigation sidebar
├── topbar.tsx           # Top header
├── login-page.tsx       # Login form
├── user-dashboard.tsx   # User dashboard content
├── admin-dashboard.tsx  # Admin dashboard content
└── attendance-modal.tsx # Attendance capture modal
```

## Fitur Responsif

### Desktop View (md+)
- Sidebar navigation tetap terlihat
- Topbar dengan user info
- Full content area
- Multi-column layouts

### Mobile View
- Collapsible sidebar dengan hamburger menu
- Bottom navigation button
- Single column layout
- Touch-friendly buttons
- Optimized spacing

## Tata Warna & Desain Tokens

- `--primary`: Blue profesional untuk aksi utama
- `--accent`: Green untuk status positif/valid
- `--secondary`: Light gray untuk area sekunder
- `--muted`: Muted gray untuk text tertiary
- `--border`: Border colors
- `--sidebar`: Sidebar background & colors

## Panduan Integrasi Backend

Sistem ini siap untuk dikembangkan ke backend dengan:

1. **Authentication:**
   - Integrate dengan sistem auth institusi
   - Session management dengan HTTP-only cookies
   - Role-based access control (user vs admin)

2. **Database:**
   - Store user credentials & profiles
   - Attendance records dengan timestamp & location
   - Request history (izin/sakit/cuti)
   - Employee master data

3. **API Endpoints:**
   - `/api/auth/login` - Login
   - `/api/auth/logout` - Logout
   - `/api/attendance` - Submit attendance
   - `/api/requests` - Submit & retrieve requests
   - `/api/admin/employees` - Manage employees
   - `/api/admin/reports` - Generate reports

4. **File Upload:**
   - Support untuk dokumen pendukung (surat dokter, dll)
   - Cloud storage integration (Vercel Blob, S3, dll)

## Development

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
```bash
pnpm dev
```

Server akan berjalan di `http://localhost:3000`

### Build untuk Production
```bash
pnpm build
pnpm start
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Accessibility

- Semantic HTML
- Proper ARIA labels
- Keyboard navigation
- Color contrast compliant
- Screen reader friendly

## Performance

- Optimized images
- Lazy loading
- CSS minimization
- Next.js built-in optimizations
- Responsive image serving

## Deployment

Dapat di-deploy ke:
- Vercel (recommended)
- Netlify
- AWS
- Docker container
- Traditional hosting

## Future Enhancements

- [ ] Real-time notifications
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced reporting & analytics
- [ ] Attendance statistics dashboard
- [ ] Geofencing validation
- [ ] Face recognition
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Multi-language support
- [ ] API documentation
- [ ] Test coverage

## Support

Untuk bantuan teknis, hubungi administrator sistem atau submit issue di repository.

---

Dibuat dengan ❤️ untuk STMIK El Rahma Yogyakarta
