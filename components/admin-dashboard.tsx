"use client";

import {
  Users,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { AdminQuickAttendance } from "./admin-quick-attendance";

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showQuickAttendance, setShowQuickAttendance] = useState(false);
  const { employees } = useEmployees();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    hadirToday: 0,
    izinSakitToday: 0,
    kehadiranRate: 0,
    pendingRequests: 0,
    belumAbsen: 0,
  });
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchTodayAttendance();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`/api/attendance?date=${today}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setAttendanceData(
          data.attendance.map((a: any) => ({
            name: a.employee_name,
            role:
              employees.find((e) => e.id === a.user_id)?.jabatan || "Pegawai",
            checkIn: a.check_in_time || "-",
            checkOut: a.check_out_time || "-",
            status:
              a.status === "hadir"
                ? "Hadir"
                : a.status === "izin"
                  ? "Izin"
                  : a.status === "sakit"
                    ? "Sakit"
                    : "Belum",
            location: a.location || "-",
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = attendanceData.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const statCards = [
    {
      icon: Users,
      label: "Total Pegawai",
      value: String(stats.totalEmployees),
      color: "primary",
    },
    {
      icon: CheckCircle,
      label: "Hadir Hari Ini",
      value: String(stats.hadirToday),
      color: "accent",
    },
    {
      icon: AlertCircle,
      label: "Izin/Sakit",
      value: String(stats.izinSakitToday),
      color: "blue",
    },
    {
      icon: ClipboardList,
      label: "Kehadiran Rate",
      value: `${stats.kehadiranRate}%`,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          const colorClass =
            stat.color === "primary"
              ? "bg-primary/10 text-primary"
              : stat.color === "accent"
                ? "bg-accent/10 text-accent"
                : stat.color === "blue"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-purple-50 text-purple-600";
          const darkColorClass =
            stat.color === "primary"
              ? "dark:bg-primary/20 dark:text-primary"
              : stat.color === "accent"
                ? "dark:bg-accent/20 dark:text-accent"
                : stat.color === "blue"
                  ? "dark:bg-blue-900/30 dark:text-blue-400"
                  : "dark:bg-purple-900/30 dark:text-purple-400";

          return (
            <div
              key={idx}
              className="bg-card dark:bg-card rounded-lg border border-border dark:border-border/50 p-6 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass} ${darkColorClass}`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance Table */}
      <div className="bg-card dark:bg-card rounded-lg border border-border dark:border-border/50 overflow-hidden shadow-sm transition-colors">
        <div className="px-6 py-4 border-b border-border dark:border-border/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h3 className="font-bold text-foreground text-lg">
              Data Absensi Hari Ini
            </h3>
            <button
              onClick={() => setShowQuickAttendance(true)}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Plus size={18} />
              Absen Manual
            </button>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Cari nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border dark:border-border/50 bg-background dark:bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border dark:border-border/50 bg-background dark:bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
              <option value="all">Semua Status</option>
              <option value="Hadir">Hadir</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary dark:bg-secondary/50 border-b border-border dark:border-border/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                  Nama & Jabatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                  Masuk
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                  Keluar
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                  Lokasi
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
                    colSpan={5}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Tidak ada data absensi
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.role}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {item.checkIn}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {item.checkOut}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                          item.status === "Hadir"
                            ? "bg-accent/10 dark:bg-accent/20 text-accent"
                            : item.status === "Izin"
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Pengajuan Pending",
            value: String(stats.pendingRequests),
            bgColor: "bg-yellow-50",
            darkBg: "dark:bg-yellow-900/20",
            textColor: "text-yellow-600",
            darkText: "dark:text-yellow-400",
          },
          {
            title: "Belum Absen",
            value: String(stats.belumAbsen),
            bgColor: "bg-red-50",
            darkBg: "dark:bg-red-900/20",
            textColor: "text-red-600",
            darkText: "dark:text-red-400",
          },
          {
            title: "Kehadiran Rate",
            value: `${stats.kehadiranRate}%`,
            bgColor: "bg-blue-50",
            darkBg: "dark:bg-blue-900/20",
            textColor: "text-blue-600",
            darkText: "dark:text-blue-400",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`${card.bgColor} ${card.darkBg} rounded-lg border border-border dark:border-border/50 p-6 shadow-sm transition-colors`}
          >
            <p className="text-sm font-medium text-foreground/70 mb-1">
              {card.title}
            </p>
            <p
              className={`text-3xl font-bold ${card.textColor} ${card.darkText}`}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <AdminQuickAttendance
        employees={employees}
        isOpen={showQuickAttendance}
        onClose={() => setShowQuickAttendance(false)}
        onSubmit={async (data) => {
          await fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: data.employeeId,
              date: data.date,
              check_in_time: data.checkInTime,
              check_out_time: data.checkOutTime,
              status: data.status,
            }),
            credentials: "include",
          });
          fetchTodayAttendance();
          setShowQuickAttendance(false);
        }}
      />
    </div>
  );
}
