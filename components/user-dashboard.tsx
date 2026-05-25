"use client";

import {
  MapPin,
  Clock,
  LogIn,
  LogOut,
  FileText,
  CheckCircle,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

interface TodayAttendance {
  check_in_time: string | null;
  check_out_time: string | null;
  status: string;
  date: string;
}

interface HistoryItem {
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: string;
}

export function UserDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [todayAttendance, setTodayAttendance] =
    useState<TodayAttendance | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayAttendance = useCallback(async () => {
    try {
      const res = await fetch("/api/attendance/today", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setTodayAttendance(data.attendance);
      }
    } catch (error) {
      console.error("Failed to fetch today attendance:", error);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/attendance?userId=${user.id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.attendance.slice(0, 10).map((record: any) => ({
          date: new Date(record.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          check_in_time: record.check_in_time,
          check_out_time: record.check_out_time,
          status:
            record.status === "hadir" ||
            record.status === "tepat_waktu" ||
            record.status === "terlambat"
              ? "Hadir"
              : record.status === "izin"
                ? "Izin"
                : record.status === "sakit"
                  ? "Sakit"
                  : record.status,
        }));
        setHistory(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTodayAttendance();
    fetchHistory();
  }, [fetchTodayAttendance, fetchHistory]);

  const handleCheckIn = () => {
    router.push("/attendance?action=checkin");
  };

  const handleCheckOut = () => {
    router.push("/attendance?action=checkout");
  };

  const handleLeaveRequest = () => {
    router.push("/requests?type=leave");
  };

  const getStatusDisplay = () => {
    if (!todayAttendance) return { status: "Belum Absen", detail: "-" };
    if (todayAttendance.status === "tepat_waktu")
      return { status: "Hadir", detail: "Tepat Waktu" };
    if (todayAttendance.status === "terlambat")
      return { status: "Hadir", detail: "Terlambat" };
    if (todayAttendance.status === "hadir")
      return { status: "Hadir", detail: "Tepat Waktu" };
    if (todayAttendance.status === "izin")
      return { status: "Izin", detail: "-" };
    if (todayAttendance.status === "sakit")
      return { status: "Sakit", detail: "-" };
    return { status: "Belum Absen", detail: "-" };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Kehadiran */}
        <div className="bg-card dark:bg-card rounded-lg border border-border dark:border-border/50 p-6 shadow-sm hover:shadow-md transition-all dark:hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Status Hari Ini
              </p>
              <p className="text-2xl font-bold text-foreground">
                {statusDisplay.status}
              </p>
              <p className="text-xs text-accent mt-2">{statusDisplay.detail}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 dark:bg-accent/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-accent" size={24} />
            </div>
          </div>
        </div>

        {/* Jam Masuk */}
        <div className="bg-card dark:bg-card rounded-lg border border-border dark:border-border/50 p-6 shadow-sm hover:shadow-md transition-all dark:hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Jam Masuk</p>
              <p className="text-2xl font-bold text-foreground">
                {todayAttendance?.check_in_time || "-"}
              </p>
              <p className="text-xs text-foreground/60 mt-2">
                {todayAttendance?.date
                  ? new Date(todayAttendance.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
              <LogIn className="text-primary" size={24} />
            </div>
          </div>
        </div>

        {/* Jam Keluar */}
        <div className="bg-card dark:bg-card rounded-lg border border-border dark:border-border/50 p-6 shadow-sm hover:shadow-md transition-all dark:hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Jam Keluar</p>
              <p className="text-2xl font-bold text-foreground">
                {todayAttendance?.check_out_time || "-"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Belum absen keluar
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary dark:bg-secondary/50 rounded-lg flex items-center justify-center">
              <LogOut className="text-foreground/40" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          onClick={handleCheckIn}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <LogIn size={20} />
          <span>Absen Masuk</span>
        </button>
        <button
          onClick={handleCheckOut}
          className="bg-secondary dark:bg-secondary/50 hover:bg-secondary/80 dark:hover:bg-secondary/60 text-secondary-foreground font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          <span>Absen Keluar</span>
        </button>
        <button
          onClick={handleLeaveRequest}
          className="bg-border dark:bg-border/30 hover:bg-border/80 dark:hover:bg-border/50 text-foreground font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <FileText size={20} />
          <span>Izin/Sakit</span>
        </button>
      </div>

      {/* Attendance History */}
      <div className="bg-card dark:bg-card rounded-lg border border-border dark:border-border/50 overflow-hidden shadow-sm transition-colors">
        <div className="px-6 py-4 border-b border-border dark:border-border/50">
          <h3 className="font-bold text-foreground text-lg">Riwayat Absensi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary dark:bg-secondary/50 border-b border-border dark:border-border/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                  Masuk
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                  Keluar
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-border/50">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Loading...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Tidak ada data riwayat
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-6 py-3 text-sm text-foreground">
                      {item.date}
                    </td>
                    <td className="px-6 py-3 text-sm text-foreground font-medium">
                      {item.check_in_time || "-"}
                    </td>
                    <td className="px-6 py-3 text-sm text-foreground font-medium">
                      {item.check_out_time || "-"}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Hadir"
                            ? "bg-accent/10 dark:bg-accent/20 text-accent"
                            : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
