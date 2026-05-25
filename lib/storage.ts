// localStorage Service untuk CRUD operations
import { Employee, Attendance, LeaveRequest, OfficeLocation } from './types';

const STORAGE_KEYS = {
  EMPLOYEES: 'stmik_employees',
  ATTENDANCE: 'stmik_attendance',
  LEAVE_REQUESTS: 'stmik_leave_requests',
  OFFICE_LOCATION: 'stmik_office_location',
};

// Initialize mock data jika belum ada
export function initializeStorage() {
  if (!isBrowser()) return;

  // Initialize employees
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
    const mockEmployees: Employee[] = [
      {
        id: 'emp_001',
        name: 'Dr. Ahmad Wijaya',
        email: 'ahmad.wijaya@stmik.ac.id',
        phone: '081234567890',
        jabatan: 'Dosen Tetap',
        departemen: 'Teknik Informatika',
        nip: '19701015199203001',
        alamat: 'Jalan Kaliurang KM 10, Yogyakarta',
        status: 'aktif',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'emp_002',
        name: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@stmik.ac.id',
        phone: '081234567891',
        jabatan: 'Dosen Tetap',
        departemen: 'Sistem Informasi',
        nip: '19750520199303002',
        alamat: 'Jalan Colombo No. 45, Yogyakarta',
        status: 'aktif',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'emp_003',
        name: 'Budi Santoso',
        email: 'budi.santoso@stmik.ac.id',
        phone: '081234567892',
        jabatan: 'Staf Akademik',
        departemen: 'Akademik',
        nip: '19800310199403003',
        alamat: 'Jalan Cik Di Tiro No. 12, Yogyakarta',
        status: 'aktif',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'emp_004',
        name: 'Rini Wijayanti',
        email: 'rini.wijayanti@stmik.ac.id',
        phone: '081234567893',
        jabatan: 'Staf Administrasi',
        departemen: 'Administrasi',
        nip: '19850715199503004',
        alamat: 'Jalan Affandi No. 88, Yogyakarta',
        status: 'aktif',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(mockEmployees));
  }

  // Initialize office location
  if (!localStorage.getItem(STORAGE_KEYS.OFFICE_LOCATION)) {
    const mockLocation: OfficeLocation = {
      id: 'loc_001',
      name: 'Kampus STMIK El Rahma',
      latitude: -7.7956,
      longitude: 110.4038,
      radius: 100, // 100 meters
      address: 'Jalan Kaliurang KM 10, Yogyakarta',
      workingHours: {
        startTime: '07:30',
        endTime: '16:00',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.OFFICE_LOCATION, JSON.stringify(mockLocation));
  }

  // Initialize attendance
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    const mockAttendance: Attendance[] = [
      {
        id: 'att_001',
        employeeId: 'emp_001',
        employeeName: 'Dr. Ahmad Wijaya',
        date: new Date().toISOString().split('T')[0],
        checkInTime: '08:15',
        checkOutTime: '17:30',
        status: 'hadir',
        faceMatch: 0.95,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(mockAttendance));
  }

  // Initialize leave requests
  if (!localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify([]));
  }
}

function isBrowser() {
  return typeof window !== 'undefined';
}

// Employee CRUD
export const employeeService = {
  getAll: (): Employee[] => {
    if (!isBrowser()) return [];
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Employee | null => {
    const employees = employeeService.getAll();
    return employees.find(emp => emp.id === id) || null;
  },

  create: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Employee => {
    if (!isBrowser()) throw new Error('Browser only');
    const newEmployee: Employee = {
      ...employee,
      id: `emp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const employees = employeeService.getAll();
    employees.push(newEmployee);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    return newEmployee;
  },

  update: (id: string, updates: Partial<Employee>): Employee => {
    if (!isBrowser()) throw new Error('Browser only');
    const employees = employeeService.getAll();
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) throw new Error('Employee not found');
    
    employees[index] = {
      ...employees[index],
      ...updates,
      id: employees[index].id,
      createdAt: employees[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    return employees[index];
  },

  delete: (id: string): void => {
    if (!isBrowser()) throw new Error('Browser only');
    const employees = employeeService.getAll();
    const filtered = employees.filter(emp => emp.id !== id);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(filtered));
  },

  search: (query: string): Employee[] => {
    const employees = employeeService.getAll();
    const lowerQuery = query.toLowerCase();
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(lowerQuery) ||
      emp.email.toLowerCase().includes(lowerQuery) ||
      emp.nip.includes(query)
    );
  },
};

// Attendance CRUD
export const attendanceService = {
  getAll: (): Attendance[] => {
    if (!isBrowser()) return [];
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },

  getByDate: (date: string): Attendance[] => {
    const attendance = attendanceService.getAll();
    return attendance.filter(att => att.date === date);
  },

  getByEmployee: (employeeId: string, startDate?: string, endDate?: string): Attendance[] => {
    const attendance = attendanceService.getAll();
    let filtered = attendance.filter(att => att.employeeId === employeeId);

    if (startDate && endDate) {
      filtered = filtered.filter(att => att.date >= startDate && att.date <= endDate);
    }
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  create: (attendance: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Attendance => {
    if (!isBrowser()) throw new Error('Browser only');
    const newAttendance: Attendance = {
      ...attendance,
      id: `att_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const all = attendanceService.getAll();
    all.push(newAttendance);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));
    return newAttendance;
  },

  update: (id: string, updates: Partial<Attendance>): Attendance => {
    if (!isBrowser()) throw new Error('Browser only');
    const all = attendanceService.getAll();
    const index = all.findIndex(att => att.id === id);
    if (index === -1) throw new Error('Attendance not found');

    all[index] = {
      ...all[index],
      ...updates,
      id: all[index].id,
      createdAt: all[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(all));
    return all[index];
  },

  delete: (id: string): void => {
    if (!isBrowser()) throw new Error('Browser only');
    const all = attendanceService.getAll();
    const filtered = all.filter(att => att.id !== id);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(filtered));
  },

  getTodayByEmployee: (employeeId: string): Attendance | null => {
    const today = new Date().toISOString().split('T')[0];
    const records = attendanceService.getByEmployee(employeeId);
    return records.find(att => att.date === today) || null;
  },
};

// Office Location CRUD
export const locationService = {
  get: (): OfficeLocation => {
    if (!isBrowser()) throw new Error('Browser only');
    const data = localStorage.getItem(STORAGE_KEYS.OFFICE_LOCATION);
    if (!data) throw new Error('Office location not found');
    return JSON.parse(data);
  },

  update: (updates: Partial<OfficeLocation>): OfficeLocation => {
    if (!isBrowser()) throw new Error('Browser only');
    const current = locationService.get();
    const updated: OfficeLocation = {
      ...current,
      ...updates,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.OFFICE_LOCATION, JSON.stringify(updated));
    return updated;
  },

  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  },

  isWithinRadius: (latitude: number, longitude: number): boolean => {
    const location = locationService.get();
    const distance = locationService.calculateDistance(
      latitude,
      longitude,
      location.latitude,
      location.longitude
    );
    return distance <= location.radius;
  },
};

// Leave Request CRUD
export const leaveRequestService = {
  getAll: (): LeaveRequest[] => {
    if (!isBrowser()) return [];
    const data = localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS);
    return data ? JSON.parse(data) : [];
  },

  getByEmployee: (employeeId: string): LeaveRequest[] => {
    const requests = leaveRequestService.getAll();
    return requests.filter(req => req.employeeId === employeeId);
  },

  create: (request: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>): LeaveRequest => {
    if (!isBrowser()) throw new Error('Browser only');
    const newRequest: LeaveRequest = {
      ...request,
      id: `leave_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const all = leaveRequestService.getAll();
    all.push(newRequest);
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(all));
    return newRequest;
  },

  update: (id: string, updates: Partial<LeaveRequest>): LeaveRequest => {
    if (!isBrowser()) throw new Error('Browser only');
    const all = leaveRequestService.getAll();
    const index = all.findIndex(req => req.id === id);
    if (index === -1) throw new Error('Leave request not found');

    all[index] = {
      ...all[index],
      ...updates,
      id: all[index].id,
      createdAt: all[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(all));
    return all[index];
  },

  approve: (id: string, approvedBy: string): LeaveRequest => {
    return leaveRequestService.update(id, {
      status: 'approved',
      approvedBy,
    });
  },

  reject: (id: string, approvedBy: string, notes?: string): LeaveRequest => {
    return leaveRequestService.update(id, {
      status: 'rejected',
      approvedBy,
      approvalNotes: notes,
    });
  },
};

// Export wrapper functions for easier use
export function getRequests(): LeaveRequest[] {
  return leaveRequestService.getAll();
}

export function updateRequest(id: string, updates: Partial<LeaveRequest>): LeaveRequest {
  return leaveRequestService.update(id, updates);
}

export function recordAttendance(data: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Attendance {
  return attendanceService.create(data);
}

export function getAttendanceByDate(date: string): Attendance[] {
  return attendanceService.getAll().filter(att => att.date === date);
}

export function getEmployeeLocation(): OfficeLocation {
  try {
    return locationService.get();
  } catch {
    return {
      id: 'loc_default',
      name: 'STMIK El Rahma',
      latitude: -7.7956,
      longitude: 110.4038,
      radius: 100,
      address: 'Jalan Kaliurang KM 10, Yogyakarta',
      workingHours: { startTime: '07:30', endTime: '16:00' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export function getAllAttendance(): Attendance[] {
  return attendanceService.getAll();
}

export function getEmployees(): Employee[] {
  return employeeService.getAll();
}
