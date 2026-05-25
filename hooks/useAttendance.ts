// 'use client';

// import { useState, useCallback, useEffect } from 'react';
// import { Attendance } from '@/lib/types';
// import { attendanceService } from '@/lib/storage';

// export function useAttendance() {
//   const [attendance, setAttendance] = useState<Attendance[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadAttendance();
//   }, []);

//   const loadAttendance = useCallback(() => {
//     setLoading(true);
//     try {
//       const data = attendanceService.getAll();
//       setAttendance(data);
//     } catch (error) {
//       console.error('Error loading attendance:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const addAttendance = useCallback((data: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>) => {
//     try {
//       const newRecord = attendanceService.create(data);
//       setAttendance(prev => [...prev, newRecord]);
//       return newRecord;
//     } catch (error) {
//       console.error('Error creating attendance:', error);
//       throw error;
//     }
//   }, []);

//   const updateAttendance = useCallback((id: string, data: Partial<Attendance>) => {
//     try {
//       const updated = attendanceService.update(id, data);
//       setAttendance(prev => prev.map(att => (att.id === id ? updated : att)));
//       return updated;
//     } catch (error) {
//       console.error('Error updating attendance:', error);
//       throw error;
//     }
//   }, []);

//   const getByEmployee = useCallback((employeeId: string, startDate?: string, endDate?: string) => {
//     return attendanceService.getByEmployee(employeeId, startDate, endDate);
//   }, []);

//   const getByDate = useCallback((date: string) => {
//     return attendanceService.getByDate(date);
//   }, []);

//   const getTodayByEmployee = useCallback((employeeId: string) => {
//     return attendanceService.getTodayByEmployee(employeeId);
//   }, []);

//   return {
//     attendance,
//     loading,
//     loadAttendance,
//     addAttendance,
//     updateAttendance,
//     getByEmployee,
//     getByDate,
//     getTodayByEmployee,
//   };
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";

export interface Attendance {
  id: number;
  user_id: number;
  employee_name?: string;
  employee_email?: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  status: string;
  location?: string;
  face_match?: number;
  notes?: string;
}

export function useAttendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(
    async (params?: Record<string, string>) => {
      try {
        const query = params ? new URLSearchParams(params).toString() : "";
        const res = await fetch(`/api/attendance?${query}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setAttendance(data.attendance);
        }
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchToday = useCallback(async () => {
    const res = await fetch("/api/attendance/today", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setTodayAttendance(data.attendance);
    }
  }, []);

  const addAttendance = async (data: Partial<Attendance>) => {
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (res.ok) {
      fetchAttendance();
      fetchToday();
    }
    return res.ok;
  };

  return {
    attendance,
    todayAttendance,
    loading,
    fetchAttendance,
    fetchToday,
    addAttendance,
  };
}
