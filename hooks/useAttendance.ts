// hooks/useAttendance.ts
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
        setLoading(true);
        const query = params ? new URLSearchParams(params).toString() : "";
        const res = await fetch(`/api/attendance${query ? "?" + query : ""}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setAttendance(data.attendance || []);
        } else {
          setAttendance([]);
        }
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchToday = useCallback(async () => {
    try {
      // Coba /api/attendance/today dulu
      let res = await fetch("/api/attendance/today", {
        credentials: "include",
      });

      // Jika 404, fallback ke /api/attendance?today=true
      if (res.status === 404) {
        res = await fetch("/api/attendance?today=true", {
          credentials: "include",
        });
      }

      if (res.ok) {
        const data = await res.json();
        setTodayAttendance(data.attendance || null);
      } else {
        setTodayAttendance(null);
      }
    } catch (error) {
      console.error("Failed to fetch today attendance:", error);
      setTodayAttendance(null);
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
