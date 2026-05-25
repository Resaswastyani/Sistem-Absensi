# Component Documentation - Sistem Absensi STMIK El Rahma

## Overview

Dokumentasi lengkap untuk semua reusable components dalam sistem absensi.

---

## 📦 Components

### 1. Sidebar Navigation

**File:** `components/sidebar.tsx`

**Props:**
```typescript
interface SidebarProps {
  userRole?: 'admin' | 'user';      // Default: 'admin'
  currentPage?: string;              // Current active page
}
```

**Usage:**
```tsx
<Sidebar userRole="admin" currentPage="dashboard" />
```

**Features:**
- Logo dengan institusi info
- Role-based menu items
- Active page highlighting
- Mobile hamburger menu
- Logout button
- Click outside overlay untuk close mobile menu

**Menu Items:**
- User Menu: Dashboard, Absensi, Pengajuan
- Admin Menu: Dashboard, Data Pegawai, Data Absensi, Pengajuan Izin, Laporan

**Customization:**
```tsx
// Untuk menambah menu item, edit array menuItems:
const adminMenu = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', page: 'dashboard' },
  // Tambahkan menu baru di sini
];
```

---

### 2. Topbar Header

**File:** `components/topbar.tsx`

**Props:**
```typescript
interface TopbarProps {
  userName?: string;     // Default: 'Dr. Ahmad Wijaya'
  userRole?: string;     // Default: 'Dosen'
}
```

**Usage:**
```tsx
<Topbar userName="Dr. Ahmad Wijaya" userRole="Dosen" />
```

**Features:**
- User greeting (Selamat Pagi/Siang/Malam)
- Notification bell dengan indicator
- Profile dropdown menu
- User avatar dengan initials
- Hidden on mobile (responsive)

**Dropdown Menu Items:**
- Profile
- Pengaturan (Settings)
- Logout

**Customization:**
```tsx
// Untuk mengubah greeting logic:
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat Pagi';
  if (hour < 18) return 'Selamat Siang';
  return 'Selamat Malam';
};
```

---

### 3. Login Page

**File:** `components/login-page.tsx`

**Props:** None

**Usage:**
```tsx
import { LoginPage } from '@/components/login-page';

export default function Page() {
  return <LoginPage />;
}
```

**Features:**
- Email & password input fields
- Show/hide password toggle
- Remember me checkbox
- Forgot password link
- Gradient background
- Loading state on submit
- Professional card layout

**Form State:**
```tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
```

**Customization:**
```tsx
// Untuk mengubah placeholder
placeholder="nama@stmik.ac.id"

// Untuk mengubah logo
<div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80">
  {/* Change logo here */}
</div>

// Untuk mengubah institusi nama
<h1 className="text-2xl font-bold text-foreground">
  NAMA INSTITUSI ANDA
</h1>
```

---

### 4. User Dashboard

**File:** `components/user-dashboard.tsx`

**Props:** None

**Usage:**
```tsx
import { UserDashboard } from '@/components/user-dashboard';

export default function Page() {
  return <UserDashboard />;
}
```

**Features:**
- 3 stat cards (Status, Jam Masuk, Jam Keluar)
- Action buttons (Absen Masuk/Keluar, Izin/Sakit)
- Attendance history table
- Status badges dengan color coding
- Responsive grid layout

**Stat Cards:**
```tsx
{
  title: 'Status Hari Ini',
  value: 'Hadir',
  icon: CheckCircle,
  color: 'accent'
}
```

**Customization:**
```tsx
// Mengubah stat data
const stats = [
  { title: 'Status', value: 'Hadir', ... },
  // Edit sesuai kebutuhan
];

// Mengubah riwayat absensi
const requests = [
  { date: '25 Mei 2026', in: '08:45', out: '-', status: 'Hadir' },
  // Edit sesuai kebutuhan
];
```

---

### 5. Admin Dashboard

**File:** `components/admin-dashboard.tsx`

**Props:** None

**Usage:**
```tsx
import { AdminDashboard } from '@/components/admin-dashboard';

export default function Page() {
  return <AdminDashboard />;
}
```

**Features:**
- 4 stat cards (Total Pegawai, Hadir, Izin/Sakit, Kehadiran %)
- Employee attendance table dengan search & filter
- 3 summary cards (Pengajuan Pending, Belum Absen, Lembur)
- Status color coding
- Hover effects pada rows

**Search & Filter:**
```tsx
const [searchTerm, setSearchTerm] = useState('');
const [filterStatus, setFilterStatus] = useState('all');

const filteredData = attendanceData.filter(item => {
  const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchFilter = filterStatus === 'all' || item.status === filterStatus;
  return matchSearch && matchFilter;
});
```

**Customization:**
```tsx
// Mengubah stat cards
const stats = [
  { icon: Users, label: 'Total Pegawai', value: '248', color: 'primary' },
  // Edit sesuai kebutuhan
];

// Mengubah attendance data
const attendanceData = [
  { name: 'Dr. Ahmad Wijaya', role: 'Dosen', ... },
  // Edit sesuai kebutuhan
];
```

---

### 6. Attendance Modal

**File:** `components/attendance-modal.tsx`

**Props:**
```typescript
interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'in' | 'out';  // Default: 'in'
}
```

**Usage:**
```tsx
const [showModal, setShowModal] = useState(false);
const [type, setType] = useState<'in' | 'out'>('in');

<AttendanceModal 
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  type={type}
/>
```

**Features:**
- 3-step process:
  1. Camera capture
  2. Location verification
  3. Confirmation review
- Video preview dari webcam
- Photo capture dengan canvas
- Location detection (GPS)
- Fallback ke address jika GPS tidak available
- Retake photo option
- Submit dengan loading state

**Step State:**
```tsx
const [step, setStep] = useState<'camera' | 'location' | 'confirm'>('camera');
const [photo, setPhoto] = useState<string | null>(null);
const [location, setLocation] = useState('Memuat lokasi...');
```

**Camera Functions:**
```tsx
// Start camera
const startCamera = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: 'user' } 
  });
  if (videoRef.current) {
    videoRef.current.srcObject = stream;
  }
};

// Capture photo
const capturePhoto = () => {
  if (canvasRef.current && videoRef.current) {
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      setPhoto(canvasRef.current.toDataURL('image/jpeg'));
    }
  }
};
```

**Location Functions:**
```tsx
// Get location
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      },
      (error) => {
        // Fallback ke predefined location
        setLocation('Jl. Sisingamangaraja No.76, Yogyakarta');
      }
    );
  }
};
```

**Customization:**
```tsx
// Mengubah address default
setLocation('Jl. Sisingamangaraja No.76, Yogyakarta');

// Mengubah canvas size untuk capture
canvasRef.current.width = 640;   // Width
canvasRef.current.height = 480;  // Height

// Mengubah judul modal
<h2 className="text-xl font-bold text-foreground">
  Absen {type === 'in' ? 'Masuk' : 'Keluar'}
</h2>
```

---

## 🔄 Data Flow

### User Dashboard Flow
```
LoginPage → Dashboard
           ├── UserDashboard component
           ├── Sidebar (user mode)
           ├── Topbar
           └── AttendanceModal (on button click)
```

### Admin Dashboard Flow
```
LoginPage → AdminDashboard
           ├── AdminDashboard component
           ├── Sidebar (admin mode)
           ├── Topbar
           └── Search/Filter functionality
```

### Attendance Submission Flow
```
Click "Absen Masuk" Button
        ↓
AttendanceModal Opens (step: camera)
        ↓
User captures photo
        ↓
Modal moves to location step
        ↓
User confirms location
        ↓
Modal moves to confirmation step
        ↓
User reviews data and submits
        ↓
API call (to be implemented)
        ↓
Modal closes, success message
```

---

## 🎨 Styling Customization

### Tailwind Classes Used

**Spacing:**
- `p-*` = padding
- `m-*` = margin
- `gap-*` = gap between flex items
- Examples: `p-4`, `m-6`, `gap-3`

**Colors:**
- Primary: `bg-primary`, `text-primary`
- Accent: `bg-accent`, `text-accent`
- Background: `bg-background`
- Foreground: `text-foreground`
- Muted: `text-muted-foreground`
- Border: `border-border`

**Responsive:**
- `md:` = Medium screens (768px+)
- `lg:` = Large screens (1024px+)
- Examples: `md:flex`, `lg:grid-cols-3`

**States:**
- `hover:` = On hover
- `focus:` = On focus
- `disabled:` = When disabled
- `active:` = When active

---

## 🔌 Integration Points

### APIs to Implement

1. **Login API**
   ```typescript
   POST /api/auth/login
   Body: { email: string, password: string }
   Response: { token: string, user: User }
   ```

2. **Attendance Submission**
   ```typescript
   POST /api/attendance
   Body: { 
     type: 'in' | 'out',
     photo: File,
     location: string,
     timestamp: string
   }
   Response: { success: boolean, message: string }
   ```

3. **Requests API**
   ```typescript
   POST /api/requests
   Body: {
     type: 'izin' | 'sakit' | 'cuti',
     startDate: string,
     endDate: string,
     reason: string,
     document?: File
   }
   ```

4. **Get Employee Data**
   ```typescript
   GET /api/employees
   Response: Employee[]
   ```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Sidebar becomes hamburger menu
- Topbar hidden (optional)
- Single column layouts
- Larger touch targets
- Full width tables with scroll

### Tablet (768px - 1023px)
- Sidebar visible in collapsed state
- Two column layouts where applicable
- Moderate spacing

### Desktop (≥ 1024px)
- Full sidebar visible
- Multi-column layouts
- Optimal spacing
- All features accessible

---

## ♿ Accessibility Features

### Already Implemented
- Semantic HTML elements
- Proper form labels
- Color contrast compliance
- Focus states on interactive elements
- Button and link roles

### Recommendations
- Add ARIA labels for complex sections
- Add screen reader text for icon-only buttons
- Test with keyboard navigation
- Use appropriate heading hierarchy

---

## 🐛 Common Issues & Solutions

### Camera Not Working
```
Issue: Camera popup tidak muncul
Solution:
1. Check browser permissions (Allow camera)
2. Use HTTPS (camera requires secure context)
3. Check if getUserMedia is supported
4. Verify camera hardware exists
```

### Location Not Detected
```
Issue: Lokasi tidak terdeteksi
Solution:
1. Check GPS/location permissions
2. Use HTTPS (geolocation requires secure context)
3. Check browser geolocation support
4. Fallback ke manual address input
```

### Form Validation
```
Issue: Form tidak submit
Solution:
1. Check all required fields filled
2. Check input format (email format)
3. Check file upload size if applicable
4. Check browser console for errors
```

---

## 📚 Best Practices

1. **Always use TypeScript types** untuk props
2. **Keep components small and focused** - single responsibility
3. **Use composition** untuk complex UIs
4. **Extract magic strings** ke constants
5. **Proper state management** - useState/useContext
6. **Memoization** untuk performance - useMemo/useCallback
7. **Accessibility first** - semantic HTML, ARIA labels
8. **Mobile first** - mobile styles then enhance untuk desktop

---

## 🚀 Performance Tips

1. **Image Optimization:**
   - Compress photos sebelum upload
   - Use WebP format jika supported
   - Lazy load images di lists

2. **Code Splitting:**
   - Modal dialogs already code-split
   - Use dynamic imports untuk heavy components

3. **State Management:**
   - Minimize re-renders dengan proper dependencies
   - Use useCallback untuk event handlers
   - Avoid inline objects/arrays di props

4. **Bundle Size:**
   - Tree-shake unused utilities
   - Use CSS-in-JS efficiently
   - Lazy load non-critical features

---

Untuk pertanyaan atau clarifications tentang components, silakan refer ke source code atau README.md!
