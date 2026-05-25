// Employee Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  jabatan: string; // Job title
  departemen: string;
  nip: string; // Employee ID
  alamat: string; // Home address
  createdAt: string;
  updatedAt: string;
  status: 'aktif' | 'nonaktif'; // Active or inactive
  photoUrl?: string; // Profile photo
}

// Attendance Types
export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD format
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
  status: 'hadir' | 'izin' | 'sakit' | 'libur' | 'belum_absen'; // Attendance status
  faceMatch?: number; // Face detection confidence (0-1)
  notes?: string;
  approvedBy?: string; // Admin who manually approved
  createdAt: string;
  updatedAt: string;
}

// Leave Request Types
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'izin' | 'sakit' | 'cuti'; // Leave type
  startDate: string;
  endDate: string;
  reason: string;
  attachmentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Location/Office Settings
export interface OfficeLocation {
  id: string;
  name: string; // Office name
  latitude: number;
  longitude: number;
  radius: number; // Verification radius in meters
  address: string;
  workingHours: {
    startTime: string; // HH:MM
    endTime: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Attendance Summary
export interface AttendanceSummary {
  employeeId: string;
  employeeName: string;
  totalHari: number;
  hadir: number;
  izin: number;
  sakit: number;
  libur: number;
  belumAbsen: number;
}

// User Session
export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  employeeId?: string; // For non-admin users
}
