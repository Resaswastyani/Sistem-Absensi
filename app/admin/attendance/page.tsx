"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import {
  DarkCard,
  DarkButton,
  DarkInput,
  DarkSelect,
  DarkTable,
  DarkTableHead,
  DarkTableBody,
  DarkTableRow,
  DarkBadge,
} from "@/components/dark-mode-wrapper";
import { Search, Download, Calendar } from "lucide-react";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, [filterDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?date=${filterDate}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setAttendanceData(
          data.attendance.map((a: any) => ({
            id: a.id,
            employeeName: a.employee_name,
            employeeEmail: a.employee_email,
            checkInTime: a.check_in_time,
            checkOutTime: a.check_out_time,
            status: a.status,
            location: a.location,
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
    const matchSearch = item.employeeName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: attendanceData.length,
    hadir: attendanceData.filter((d) => d.status === "hadir").length,
    izin: attendanceData.filter((d) => d.status === "izin").length,
    sakit: attendanceData.filter((d) => d.status === "sakit").length,
    belumAbsen: attendanceData.filter((d) => !d.checkInTime).length,
  };

  const handleExport = () => {
    const csv = [
      ["Nama", "Email", "Jam Masuk", "Jam Keluar", "Status", "Lokasi"],
      ...filteredData.map((d) => [
        d.employeeName,
        d.employeeEmail,
        d.checkInTime || "-",
        d.checkOutTime || "-",
        d.status,
        d.location || "-",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${filterDate}.csv`;
    a.click();
  };

  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <Sidebar userRole="admin" currentPage="attendance" />
      <div className="flex-1">
        <Topbar userName="Admin Absensi" userRole="Administrator" />
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground dark:text-foreground">
              Riwayat Absensi
            </h1>
            <p className="text-muted-foreground dark:text-muted-foreground">
              Monitoring absensi pegawai realtime
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: stats.total,
                color:
                  "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
              },
              {
                label: "Hadir",
                value: stats.hadir,
                color:
                  "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
              },
              {
                label: "Izin",
                value: stats.izin,
                color:
                  "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
              },
              {
                label: "Sakit",
                value: stats.sakit,
                color:
                  "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
              },
              {
                label: "Belum Absen",
                value: stats.belumAbsen,
                color:
                  "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
              },
            ].map((stat) => (
              <DarkCard key={stat.label} className={`${stat.color} p-4`}>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </DarkCard>
            ))}
          </div>

          <DarkCard className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border dark:border-border/50 bg-background dark:bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <DarkInput
                  type="text"
                  placeholder="Cari nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DarkSelect
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="hadir">Hadir</option>
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
              </DarkSelect>
              <DarkButton
                onClick={handleExport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download size={18} /> Export
              </DarkButton>
            </div>
          </DarkCard>

          <DarkCard>
            <DarkTable>
              <DarkTableHead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Jam Masuk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Jam Keluar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Lokasi
                  </th>
                </tr>
              </DarkTableHead>
              <DarkTableBody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <DarkTableRow key={item.id}>
                      <td className="px-6 py-4 text-sm font-medium">
                        {item.employeeName}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.employeeEmail}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.checkInTime || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.checkOutTime || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <DarkBadge
                          status={
                            item.status === "hadir"
                              ? "success"
                              : item.status === "izin"
                                ? "info"
                                : "warning"
                          }
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </DarkBadge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {item.location || "-"}
                      </td>
                    </DarkTableRow>
                  ))
                )}
              </DarkTableBody>
            </DarkTable>
          </DarkCard>
        </main>
      </div>
    </div>
  );
}
