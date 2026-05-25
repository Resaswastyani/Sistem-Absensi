"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Search, Download, Calendar, Filter } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface Employee {
  id: number;
  name: string;
  nip: string;
}

interface AttendanceRecord {
  id: number;
  user_id: number;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  faceMatch: number | null;
  notes: string | null;
}

export default function AttendanceHistoryPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(
    new Set(),
  );

  // Fetch employees from API
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch("/api/employees", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setEmployees(
          data.employees.map((emp: any) => ({
            id: emp.id,
            name: emp.name,
            nip: emp.nip,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  }, []);

  // Fetch attendance from API
  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/api/attendance";
      const params = new URLSearchParams();

      if (startDate && endDate) {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        // Map API response to component format
        const mappedAttendance = data.attendance.map((record: any) => ({
          id: record.id,
          user_id: record.user_id,
          employeeId: String(record.user_id),
          employeeName: record.employee_name,
          date: record.date,
          checkInTime: record.check_in_time || "",
          checkOutTime: record.check_out_time || "",
          status: record.status,
          faceMatch: record.face_match,
          notes: record.notes,
        }));
        setAttendance(mappedAttendance);
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [fetchEmployees, fetchAttendance]);

  // Filter attendance records
  const filteredRecords = attendance.filter((record) => {
    const matchSearch =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(record.id).includes(searchTerm);

    const matchEmployee =
      filterEmployee === "all" || record.employeeId === filterEmployee;
    const matchStatus =
      filterStatus === "all" || record.status === filterStatus;

    let matchDateRange = true;
    if (startDate && endDate) {
      matchDateRange = record.date >= startDate && record.date <= endDate;
    } else if (startDate) {
      matchDateRange = record.date >= startDate;
    } else if (endDate) {
      matchDateRange = record.date <= endDate;
    }

    return matchSearch && matchEmployee && matchStatus && matchDateRange;
  });

  // Calculate statistics
  const stats = {
    total: filteredRecords.length,
    hadir: filteredRecords.filter((r) => r.status === "hadir").length,
    izin: filteredRecords.filter((r) => r.status === "izin").length,
    sakit: filteredRecords.filter((r) => r.status === "sakit").length,
    libur: filteredRecords.filter((r) => r.status === "libur").length,
    belumAbsen: filteredRecords.filter((r) => r.status === "belum_absen")
      .length,
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, "success" | "info" | "warning" | "danger"> =
      {
        hadir: "success",
        izin: "info",
        sakit: "warning",
        libur: "info",
        belum_absen: "danger",
      };
    return statusMap[status] || "info";
  };

  const getStatusLabel = (status: string) => {
    const labelMap: Record<string, string> = {
      hadir: "Hadir",
      izin: "Izin",
      sakit: "Sakit",
      libur: "Libur",
      belum_absen: "Belum Absen",
    };
    return labelMap[status] || status;
  };

  const exportToCSV = () => {
    const headers = [
      "Tanggal",
      "Nama Pegawai",
      "NIP",
      "Jam Masuk",
      "Jam Keluar",
      "Status",
      "Confidence",
      "Catatan",
    ];

    const rows = filteredRecords.map((record) => [
      record.date,
      record.employeeName,
      employees.find((e) => String(e.id) === record.employeeId)?.nip || "-",
      record.checkInTime,
      record.checkOutTime || "-",
      getStatusLabel(record.status),
      record.faceMatch ? `${Math.round(record.faceMatch * 100)}%` : "-",
      record.notes || "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <Sidebar userRole="admin" currentPage="attendance" />

      <div className="flex-1">
        <Topbar />

        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2">
                Riwayat Absensi
              </h1>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Lihat dan kelola data absensi pegawai
              </p>
            </div>
            <DarkButton
              variant="primary"
              onClick={exportToCSV}
              disabled={filteredRecords.length === 0}
              className="flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Export CSV
            </DarkButton>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: stats.total,
                color: "bg-blue-50 dark:bg-blue-900/20",
              },
              {
                label: "Hadir",
                value: stats.hadir,
                color: "bg-accent/10 dark:bg-accent/20",
              },
              {
                label: "Izin",
                value: stats.izin,
                color: "bg-blue-50 dark:bg-blue-900/20",
              },
              {
                label: "Sakit",
                value: stats.sakit,
                color: "bg-yellow-50 dark:bg-yellow-900/20",
              },
              {
                label: "Libur",
                value: stats.libur,
                color: "bg-purple-50 dark:bg-purple-900/20",
              },
              {
                label: "Belum Absen",
                value: stats.belumAbsen,
                color: "bg-red-50 dark:bg-red-900/20",
              },
            ].map((stat) => (
              <DarkCard
                key={stat.label}
                className={`${stat.color} text-center`}
              >
                <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground dark:text-foreground">
                  {stat.value}
                </p>
              </DarkCard>
            ))}
          </div>

          {/* Filters */}
          <DarkCard className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <DarkInput
                  type="text"
                  placeholder="Cari nama atau ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <DarkSelect
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
              >
                <option value="all">Semua Pegawai</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={String(emp.id)}>
                    {emp.name}
                  </option>
                ))}
              </DarkSelect>

              <DarkSelect
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="hadir">Hadir</option>
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="libur">Libur</option>
                <option value="belum_absen">Belum Absen</option>
              </DarkSelect>

              <DarkInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Dari tanggal"
              />

              <DarkInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Sampai tanggal"
              />
            </div>
          </DarkCard>

          {/* Table */}
          <DarkCard>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground dark:text-muted-foreground">
                    Loading data absensi...
                  </p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground dark:text-muted-foreground">
                    Tidak ada data absensi
                  </p>
                </div>
              ) : (
                <DarkTable>
                  <DarkTableHead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                        Nama Pegawai
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                        Jam Masuk
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                        Jam Keluar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                        Catatan
                      </th>
                    </tr>
                  </DarkTableHead>
                  <DarkTableBody>
                    {filteredRecords
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime(),
                      )
                      .map((record) => (
                        <DarkTableRow key={record.id}>
                          <td className="px-6 py-4 text-sm text-foreground dark:text-foreground">
                            {new Date(record.date).toLocaleDateString("id-ID", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-foreground dark:text-foreground">
                            {record.employeeName}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground dark:text-muted-foreground">
                            {record.checkInTime || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground dark:text-muted-foreground">
                            {record.checkOutTime || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <DarkBadge status={getStatusColor(record.status)}>
                              {getStatusLabel(record.status)}
                            </DarkBadge>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground dark:text-muted-foreground">
                            {record.faceMatch
                              ? `${Math.round(record.faceMatch * 100)}%`
                              : "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground dark:text-muted-foreground max-w-xs truncate">
                            {record.notes || "-"}
                          </td>
                        </DarkTableRow>
                      ))}
                  </DarkTableBody>
                </DarkTable>
              )}
            </div>
          </DarkCard>

          {/* Summary by Employee */}
          {filterEmployee === "all" && filteredRecords.length > 0 && (
            <DarkCard className="mt-6">
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-4">
                Ringkasan Per Pegawai
              </h3>
              <div className="overflow-x-auto">
                <DarkTable>
                  <DarkTableHead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                        Pegawai
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-secondary-foreground uppercase">
                        Hadir
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-secondary-foreground uppercase">
                        Izin
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-secondary-foreground uppercase">
                        Sakit
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-secondary-foreground uppercase">
                        Total
                      </th>
                    </tr>
                  </DarkTableHead>
                  <DarkTableBody>
                    {Object.entries(
                      filteredRecords.reduce(
                        (acc, record) => {
                          if (!acc[record.employeeId]) {
                            acc[record.employeeId] = {
                              name: record.employeeName,
                              hadir: 0,
                              izin: 0,
                              sakit: 0,
                              total: 0,
                            };
                          }
                          acc[record.employeeId].total++;
                          if (record.status === "hadir")
                            acc[record.employeeId].hadir++;
                          if (record.status === "izin")
                            acc[record.employeeId].izin++;
                          if (record.status === "sakit")
                            acc[record.employeeId].sakit++;
                          return acc;
                        },
                        {} as Record<
                          string,
                          {
                            name: string;
                            hadir: number;
                            izin: number;
                            sakit: number;
                            total: number;
                          }
                        >,
                      ),
                    ).map(([empId, summary]) => (
                      <DarkTableRow key={empId}>
                        <td className="px-6 py-4 text-sm font-medium text-foreground dark:text-foreground">
                          {summary.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-accent dark:text-accent font-medium">
                          {summary.hadir}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-blue-600 dark:text-blue-400">
                          {summary.izin}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-yellow-600 dark:text-yellow-400">
                          {summary.sakit}
                        </td>
                        <td className="px-6 py-4 text-sm text-center font-semibold text-foreground dark:text-foreground">
                          {summary.total}
                        </td>
                      </DarkTableRow>
                    ))}
                  </DarkTableBody>
                </DarkTable>
              </div>
            </DarkCard>
          )}
        </main>
      </div>
    </div>
  );
}
