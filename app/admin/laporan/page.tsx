"use client";

import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import {
  DarkCard,
  DarkButton,
  DarkSelect,
  DarkTable,
  DarkTableHead,
  DarkTableBody,
  DarkTableRow,
  DarkBadge,
} from "@/components/dark-mode-wrapper";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, Calendar } from "lucide-react";

interface AttendanceRecord {
  id: number;
  user_id: number;
  employee_name: string;
  date: string;
  status: string;
  check_in_time: string | null;
  check_out_time: string | null;
}

interface EmployeeSummary {
  name: string;
  total: number;
  hadir: number;
  izin: number;
  sakit: number;
  libur: number;
  belumAbsen: number;
}

export default function Page() {
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [reportType, setReportType] = useState("overview");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [summaryByEmployee, setSummaryByEmployee] = useState<EmployeeSummary[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  // Fetch reports from API
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/reports?startDate=${startDate}&endDate=${endDate}`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        const data = await res.json();
        setAttendanceData(data.attendance || []);

        // Build summary from API data
        const summaryMap: Record<number, EmployeeSummary> = {};
        data.attendance.forEach((record: any) => {
          const userId = record.user_id;
          if (!summaryMap[userId]) {
            summaryMap[userId] = {
              name: record.employee_name,
              total: 0,
              hadir: 0,
              izin: 0,
              sakit: 0,
              libur: 0,
              belumAbsen: 0,
            };
          }
          summaryMap[userId].total++;
          if (record.status === "hadir") summaryMap[userId].hadir++;
          else if (record.status === "izin") summaryMap[userId].izin++;
          else if (record.status === "sakit") summaryMap[userId].sakit++;
          else if (record.status === "libur") summaryMap[userId].libur++;
          else if (!record.check_in_time) summaryMap[userId].belumAbsen++;
        });

        setSummaryByEmployee(Object.values(summaryMap));
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredAttendance = attendanceData.filter((item) => {
    const date = item.date;
    return date >= startDate && date <= endDate;
  });

  const dailyStats: Record<string, any> = {};
  filteredAttendance.forEach((item) => {
    if (!dailyStats[item.date]) {
      dailyStats[item.date] = {
        date: item.date,
        hadir: 0,
        izin: 0,
        sakit: 0,
        libur: 0,
      };
    }
    dailyStats[item.date][item.status] =
      (dailyStats[item.date][item.status] || 0) + 1;
  });

  const chartData = Object.values(dailyStats).sort((a: any, b: any) =>
    a.date.localeCompare(b.date),
  );

  const statusSummary = [
    {
      name: "Hadir",
      value: filteredAttendance.filter((a) => a.status === "hadir").length,
      color: "#10b981",
    },
    {
      name: "Izin",
      value: filteredAttendance.filter((a) => a.status === "izin").length,
      color: "#f59e0b",
    },
    {
      name: "Sakit",
      value: filteredAttendance.filter((a) => a.status === "sakit").length,
      color: "#ef4444",
    },
    {
      name: "Libur",
      value: filteredAttendance.filter((a) => a.status === "libur").length,
      color: "#6366f1",
    },
  ];

  const handleExport = () => {
    const csv = [
      ["Laporan Absensi", startDate, "hingga", endDate],
      [""],
      ["Nama", "Total", "Hadir", "Izin", "Sakit", "Libur", "Belum Absen"],
      ...summaryByEmployee.map((emp) => [
        emp.name,
        emp.total,
        emp.hadir,
        emp.izin,
        emp.sakit,
        emp.libur,
        emp.belumAbsen,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-absensi-${startDate}-${endDate}.csv`;
    a.click();
  };

  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <Sidebar userRole="admin" currentPage="laporan" />

      <div className="flex-1">
        <Topbar userName="Admin Absensi" userRole="Administrator" />

        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Laporan Absensi
            </h1>
            <p className="text-muted-foreground">
              Analisis data absensi pegawai dalam periode waktu
            </p>
          </div>

          <DarkCard className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border dark:border-border/50 bg-background text-foreground text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border dark:border-border/50 bg-background text-foreground text-sm"
                />
              </div>
              <DarkSelect
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="overview">Overview</option>
                <option value="detail">Detail per Pegawai</option>
                <option value="trend">Trend Harian</option>
              </DarkSelect>
              <DarkButton
                onClick={handleExport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download size={18} />
                Export CSV
              </DarkButton>
            </div>
          </DarkCard>

          {loading ? (
            <DarkCard className="p-12 text-center">
              <p className="text-muted-foreground">Loading data laporan...</p>
            </DarkCard>
          ) : (
            reportType === "overview" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <DarkCard className="p-6">
                    <h3 className="font-bold text-foreground mb-4">
                      Status Absensi
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusSummary}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name} ${value}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusSummary.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </DarkCard>

                  <DarkCard className="p-6">
                    <h3 className="font-bold text-foreground mb-4">
                      Trend Harian
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="currentColor" />
                        <YAxis stroke="currentColor" />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="hadir"
                          stroke="#10b981"
                        />
                        <Line type="monotone" dataKey="izin" stroke="#f59e0b" />
                        <Line
                          type="monotone"
                          dataKey="sakit"
                          stroke="#ef4444"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </DarkCard>
                </div>

                <DarkCard>
                  <h3 className="font-bold text-foreground mb-4 px-6 pt-6">
                    Ringkasan per Pegawai
                  </h3>
                  <DarkTable>
                    <DarkTableHead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                          Hadir
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                          Izin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                          Sakit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                          Libur
                        </th>
                      </tr>
                    </DarkTableHead>
                    <DarkTableBody>
                      {summaryByEmployee.map((emp) => (
                        <DarkTableRow key={emp.name}>
                          <td className="px-6 py-4 text-sm font-medium">
                            {emp.name}
                          </td>
                          <td className="px-6 py-4 text-sm">{emp.total}</td>
                          <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400">
                            {emp.hadir}
                          </td>
                          <td className="px-6 py-4 text-sm text-yellow-600 dark:text-yellow-400">
                            {emp.izin}
                          </td>
                          <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400">
                            {emp.sakit}
                          </td>
                          <td className="px-6 py-4 text-sm text-indigo-600 dark:text-indigo-400">
                            {emp.libur}
                          </td>
                        </DarkTableRow>
                      ))}
                    </DarkTableBody>
                  </DarkTable>
                </DarkCard>
              </>
            )
          )}
        </main>
      </div>
    </div>
  );
}
