# Developer Guide - Smart Attendance System

Dokumentasi teknis untuk developer yang ingin extend atau integrate sistem ini.

## 📦 Architecture Overview

```
┌─────────────────────────────────────────────┐
│         Next.js App Router                  │
│  (app/admin/, app/user/, app/staff/)       │
└──────────────┬──────────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
┌─────v──────┐  ┌──────v──────┐
│   Pages    │  │ Components  │
│            │  │             │
└─────┬──────┘  └──────┬──────┘
      │                │
      └────────┬───────┘
               │
      ┌────────v──────────┐
      │   React Hooks     │
      │ useEmployees()    │
      │ useAttendance()   │
      └────────┬──────────┘
               │
      ┌────────v──────────┐
      │ Storage Services  │
      │ employeeService   │
      │ attendanceService │
      │ locationService   │
      └────────┬──────────┘
               │
      ┌────────v──────────┐
      │   localStorage    │
      │   (browser)       │
      └───────────────────┘
```

## 🔌 Storage Services

### Employee Service

```typescript
import { employeeService } from '@/lib/storage';
import { Employee } from '@/lib/types';

// Get all employees
const employees = employeeService.getAll();

// Get single employee
const employee = employeeService.getById('emp_001');

// Create employee
const newEmployee = employeeService.create({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '08xxxxxxxxxx',
  jabatan: 'Dosen Tetap',
  departemen: 'Teknik Informatika',
  nip: '19701015199203001',
  alamat: 'Jalan Kaliurang KM 10',
  status: 'aktif',
});

// Update employee
const updated = employeeService.update('emp_001', {
  name: 'Jane Doe',
  status: 'nonaktif',
});

// Delete employee
employeeService.delete('emp_001');

// Search employees
const results = employeeService.search('john');
```

### Attendance Service

```typescript
import { attendanceService } from '@/lib/storage';
import { Attendance } from '@/lib/types';

// Get all attendance records
const all = attendanceService.getAll();

// Get by date
const records = attendanceService.getByDate('2026-05-25');

// Get by employee
const empRecords = attendanceService.getByEmployee('emp_001');

// Get by date range
const rangeRecords = attendanceService.getByEmployee(
  'emp_001',
  '2026-05-01',
  '2026-05-31'
);

// Get today's attendance for employee
const todayRecord = attendanceService.getTodayByEmployee('emp_001');

// Create attendance
const record = attendanceService.create({
  employeeId: 'emp_001',
  employeeName: 'John Doe',
  date: '2026-05-25',
  checkInTime: '08:15',
  checkOutTime: '17:30',
  status: 'hadir',
  faceMatch: 0.95,
  notes: 'Optional notes',
});

// Update attendance
const updated = attendanceService.update('att_001', {
  checkOutTime: '17:45',
  notes: 'Updated notes',
});

// Delete attendance
attendanceService.delete('att_001');
```

### Location Service

```typescript
import { locationService } from '@/lib/storage';
import { OfficeLocation } from '@/lib/types';

// Get current location settings
const location = locationService.get();
// Returns: {
//   id: 'loc_001',
//   name: 'Kampus STMIK El Rahma',
//   latitude: -7.7956,
//   longitude: 110.4038,
//   radius: 100,
//   address: '...',
//   workingHours: { startTime: '07:30', endTime: '16:00' }
// }

// Update location
const updated = locationService.update({
  latitude: -7.8,
  longitude: 110.41,
  radius: 150,
});

// Calculate distance (Haversine formula)
const distance = locationService.calculateDistance(
  -7.7956, // lat1
  110.4038, // lon1
  -7.7957, // lat2
  110.4039  // lon2
); // returns meters

// Check if within radius
const isWithin = locationService.isWithinRadius(-7.7956, 110.4038);
// Returns: boolean
```

### Leave Request Service

```typescript
import { leaveRequestService } from '@/lib/storage';
import { LeaveRequest } from '@/lib/types';

// Get all requests
const all = leaveRequestService.getAll();

// Get by employee
const empRequests = leaveRequestService.getByEmployee('emp_001');

// Create request
const request = leaveRequestService.create({
  employeeId: 'emp_001',
  employeeName: 'John Doe',
  type: 'sakit',
  startDate: '2026-05-25',
  endDate: '2026-05-26',
  reason: 'Sakit demam',
  status: 'pending',
});

// Update request
const updated = leaveRequestService.update('leave_001', {
  status: 'approved',
  approvedBy: 'admin_001',
});

// Approve request
const approved = leaveRequestService.approve('leave_001', 'admin_001');

// Reject request
const rejected = leaveRequestService.reject(
  'leave_001',
  'admin_001',
  'Request tidak valid'
);
```

## 🎣 React Hooks

### useEmployees Hook

```typescript
import { useEmployees } from '@/hooks/useEmployees';

function MyComponent() {
  const {
    employees,        // Employee[] - array of all employees
    loading,         // boolean - loading state
    loadEmployees,   // () => void - reload employees
    addEmployee,     // (data) => Employee - add new
    updateEmployee,  // (id, data) => Employee - update
    deleteEmployee,  // (id) => void - delete
    searchEmployees, // (query) => Employee[] - search
  } = useEmployees();

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {employees.map(emp => (
            <div key={emp.id}>{emp.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### useAttendance Hook

```typescript
import { useAttendance } from '@/hooks/useAttendance';

function MyComponent() {
  const {
    attendance,         // Attendance[] - all records
    loading,           // boolean - loading state
    loadAttendance,    // () => void - reload
    addAttendance,     // (data) => Attendance - add
    updateAttendance,  // (id, data) => Attendance - update
    getByEmployee,     // (empId, startDate?, endDate?) => Attendance[]
    getByDate,         // (date) => Attendance[]
    getTodayByEmployee,// (empId) => Attendance | null
  } = useAttendance();

  return (
    <div>
      {/* Your code */}
    </div>
  );
}
```

## 🎨 Dark Mode Components

### DarkCard Component

```typescript
import { DarkCard } from '@/components/dark-mode-wrapper';

<DarkCard className="optional-additional-classes">
  <h2>Card Title</h2>
  <p>Card content here</p>
</DarkCard>
```

### DarkButton Component

```typescript
import { DarkButton } from '@/components/dark-mode-wrapper';

// Primary button
<DarkButton variant="primary" onClick={handleClick}>
  Primary Button
</DarkButton>

// Secondary button
<DarkButton variant="secondary">
  Secondary Button
</DarkButton>

// Ghost button
<DarkButton variant="ghost">
  Ghost Button
</DarkButton>

// Danger button
<DarkButton variant="danger">
  Delete
</DarkButton>

// Disabled state
<DarkButton disabled>Disabled</DarkButton>
```

### DarkInput Component

```typescript
import { DarkInput } from '@/components/dark-mode-wrapper';

<DarkInput
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text..."
  className="optional-classes"
/>
```

### DarkSelect Component

```typescript
import { DarkSelect } from '@/components/dark-mode-wrapper';

<DarkSelect value={selected} onChange={(e) => setSelected(e.target.value)}>
  <option value="">Select option</option>
  <option value="opt1">Option 1</option>
  <option value="opt2">Option 2</option>
</DarkSelect>
```

### DarkTable Components

```typescript
import {
  DarkTable,
  DarkTableHead,
  DarkTableBody,
  DarkTableRow,
} from '@/components/dark-mode-wrapper';

<DarkTable>
  <DarkTableHead>
    <tr>
      <th className="px-6 py-3">Column 1</th>
      <th className="px-6 py-3">Column 2</th>
    </tr>
  </DarkTableHead>
  <DarkTableBody>
    {data.map((item) => (
      <DarkTableRow key={item.id}>
        <td className="px-6 py-4">{item.col1}</td>
        <td className="px-6 py-4">{item.col2}</td>
      </DarkTableRow>
    ))}
  </DarkTableBody>
</DarkTable>
```

### DarkBadge Component

```typescript
import { DarkBadge } from '@/components/dark-mode-wrapper';

// Success badge
<DarkBadge status="success">Hadir</DarkBadge>

// Info badge
<DarkBadge status="info">Izin</DarkBadge>

// Warning badge
<DarkBadge status="warning">Sakit</DarkBadge>

// Danger badge
<DarkBadge status="danger">Belum Absen</DarkBadge>
```

## 📸 Face Detection Camera Component

```typescript
import { FaceDetectionCamera } from '@/components/face-detection-camera';

<FaceDetectionCamera
  onCapture={(imageData, confidence) => {
    // imageData: base64 string of captured photo
    // confidence: number between 0-1 (face match confidence)
    
    // Save to attendance record
    attendanceService.create({
      employeeId: currentEmployee.id,
      employeeName: currentEmployee.name,
      date: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toLocaleTimeString('id-ID'),
      status: 'hadir',
      faceMatch: confidence,
      // You can save imageData if needed
    });
  }}
  isLoading={isSaving}
/>
```

## 🔄 Workflow Examples

### Complete Attendance Check-in Workflow

```typescript
import { locationService, attendanceService } from '@/lib/storage';
import { FaceDetectionCamera } from '@/components/face-detection-camera';
import { useAttendance } from '@/hooks/useAttendance';

export function AttendanceCheckIn() {
  const { addAttendance } = useAttendance();
  const [step, setStep] = useState<'location' | 'camera' | 'done'>('location');

  // Step 1: Check GPS location
  const checkLocation = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const isValid = locationService.isWithinRadius(
            position.coords.latitude,
            position.coords.longitude
          );
          
          if (isValid) {
            setStep('camera');
            resolve(position.coords);
          } else {
            reject(new Error('Outside office radius'));
          }
        },
        (error) => reject(error)
      );
    });
  };

  // Step 2: Capture face photo
  const handleCapture = (imageData: string, confidence: number) => {
    const location = locationService.get();
    
    addAttendance({
      employeeId: currentEmployee.id,
      employeeName: currentEmployee.name,
      date: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toLocaleTimeString('HH:MM'),
      status: 'hadir',
      faceMatch: confidence,
      checkInLocation: {
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        address: location.address,
      },
    });

    setStep('done');
  };

  return (
    <div>
      {step === 'location' && (
        <button onClick={checkLocation}>Check Location</button>
      )}
      {step === 'camera' && (
        <FaceDetectionCamera onCapture={handleCapture} />
      )}
      {step === 'done' && <p>Attendance recorded successfully!</p>}
    </div>
  );
}
```

### Employee CRUD with Modal

```typescript
'use client';

import { useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeForm } from '@/components/employee-form';
import { DarkButton } from '@/components/dark-mode-wrapper';
import { Employee } from '@/lib/types';

export function EmployeeManager() {
  const { employees, addEmployee, updateEmployee } = useEmployees();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const handleSubmit = (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editing) {
      updateEmployee(editing.id, data);
    } else {
      addEmployee(data);
    }
    setIsOpen(false);
    setEditing(null);
  };

  return (
    <>
      <DarkButton
        onClick={() => {
          setEditing(null);
          setIsOpen(true);
        }}
      >
        Add Employee
      </DarkButton>

      <table>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>
                <button
                  onClick={() => {
                    setEditing(emp);
                    setIsOpen(true);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EmployeeForm
        initialData={editing || undefined}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
```

## 🧪 Testing with Mock Data

```typescript
import { initializeStorage } from '@/lib/storage';

// In your useEffect or test setup:
useEffect(() => {
  // Initialize with mock data
  initializeStorage();
  
  // Load data
  const employees = employeeService.getAll();
  const attendance = attendanceService.getAll();
  
  console.log('Mock employees:', employees);
  console.log('Mock attendance:', attendance);
}, []);
```

## 📊 Type Definitions

```typescript
// Employee
interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  jabatan: string;
  departemen: string;
  nip: string;
  alamat: string;
  createdAt: string;
  updatedAt: string;
  status: 'aktif' | 'nonaktif';
  photoUrl?: string;
}

// Attendance
interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM:SS
  checkOutTime?: string;
  checkInLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  checkOutLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'hadir' | 'izin' | 'sakit' | 'libur' | 'belum_absen';
  faceMatch?: number; // 0-1
  notes?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Location
interface OfficeLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // meters
  address: string;
  workingHours: {
    startTime: string; // HH:MM
    endTime: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

## 🚀 Common Tasks

### Add New Page with Dark Mode

```typescript
'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { DarkCard, DarkButton } from '@/components/dark-mode-wrapper';
import { initializeStorage } from '@/lib/storage';

export default function NewPage() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <Sidebar userRole="admin" currentPage="page-name" />
      
      <div className="flex-1">
        <Topbar />
        
        <main className="p-6">
          <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-6">
            Page Title
          </h1>

          <DarkCard>
            <h2 className="text-lg font-semibold text-foreground dark:text-foreground mb-4">
              Card Title
            </h2>
            <p className="text-muted-foreground dark:text-muted-foreground">
              Card content
            </p>
          </DarkCard>
        </main>
      </div>
    </div>
  );
}
```

### Export Data to CSV

```typescript
function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => `"${row[h]}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}

// Usage
const attendance = attendanceService.getAll();
exportToCSV(attendance, 'attendance.csv');
```

---

## 📚 Additional Resources

- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- face-api.js: https://github.com/vladmandic/face-api
- PapaParse: https://www.papaparse.com

---

Happy coding! 🚀
