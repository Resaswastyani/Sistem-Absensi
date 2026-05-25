"use client";

import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import {
  DarkCard,
  DarkButton,
  DarkInput,
  DarkSelect,
} from "@/components/dark-mode-wrapper";
import { Upload, Plus, Save } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface Employee {
  id: number;
  name: string;
  nip: string;
  jabatan: string;
}

interface ManualAttendanceForm {
  employeeId: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: "hadir" | "izin" | "sakit" | "libur";
  notes: string;
}

export default function ManualAttendancePage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [formData, setFormData] = useState<ManualAttendanceForm>({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    checkInTime: "",
    checkOutTime: "",
    status: "hadir",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            jabatan: emp.jabatan,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (!formData.employeeId) {
        throw new Error("Pilih pegawai terlebih dahulu");
      }

      const employee = employees.find(
        (emp) => String(emp.id) === formData.employeeId,
      );
      if (!employee) throw new Error("Pegawai tidak ditemukan");

      if (formData.status === "hadir" && !formData.checkInTime) {
        throw new Error("Jam masuk harus diisi untuk status Hadir");
      }

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(formData.employeeId),
          date: formData.date,
          check_in_time:
            formData.status === "hadir"
              ? formData.checkInTime || "08:00"
              : null,
          check_out_time: formData.checkOutTime || null,
          status: formData.status,
          notes: formData.notes,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan absensi");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Reset form
      setFormData({
        employeeId: "",
        date: new Date().toISOString().split("T")[0],
        checkInTime: "",
        checkOutTime: "",
        status: "hadir",
        notes: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());
        const headers = lines[0].split(",").map((h) => h.trim());

        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim());
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => {
            row[h] = values[idx] || "";
          });

          try {
            // Find employee by NIP or email
            const employee = employees.find(
              (emp) => emp.nip === row.nip || emp.nip === row.NIP,
            );

            if (!employee) {
              errorCount++;
              errors.push(
                `Baris ${i}: Pegawai dengan NIP ${row.nip || row.NIP} tidak ditemukan`,
              );
              continue;
            }

            const res = await fetch("/api/attendance", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: employee.id,
                date:
                  row.date ||
                  row.Date ||
                  new Date().toISOString().split("T")[0],
                check_in_time: row.checkInTime || row.check_in_time || "08:00",
                check_out_time: row.checkOutTime || row.check_out_time || null,
                status: row.status || row.Status || "hadir",
                notes: row.notes || row.Notes || "",
              }),
              credentials: "include",
            });

            if (res.ok) {
              successCount++;
            } else {
              errorCount++;
              errors.push(`Baris ${i}: Gagal menyimpan`);
            }
          } catch (err) {
            errorCount++;
            errors.push(
              `Baris ${i}: ${err instanceof Error ? err.message : "Error"}`,
            );
          }
        }

        setSuccess(true);
        if (errorCount > 0) {
          setError(
            `Berhasil: ${successCount} data | Gagal: ${errorCount} data. ${errors.slice(0, 3).join("; ")}`,
          );
        } else {
          setError(
            `Berhasil: ${successCount} data | Gagal: ${errorCount} data`,
          );
        }

        setTimeout(() => {
          setSuccess(false);
          setError(null);
        }, 5000);

        // Reset input
        e.target.value = "";
      } catch (err) {
        setError("Terjadi kesalahan saat memproses file CSV");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <Sidebar userRole="admin" currentPage="attendance" />

      <div className="flex-1">
        <Topbar />

        <main className="p-4 md:p-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2">
              Absensi Manual
            </h1>
            <p className="text-muted-foreground dark:text-muted-foreground">
              Input absensi pegawai secara manual - per pegawai atau bulk import
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-accent/10 dark:bg-accent/20 border border-accent/30 dark:border-accent/50 rounded-lg text-accent dark:text-accent">
              Absensi berhasil disimpan
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border dark:border-border/50">
            <button
              onClick={() => setActiveTab("single")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "single"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Plus size={18} className="inline mr-2" />
              Input Per Pegawai
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "bulk"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Upload size={18} className="inline mr-2" />
              Import CSV
            </button>
          </div>

          {/* Single Input Tab */}
          {activeTab === "single" && (
            <DarkCard>
              <form onSubmit={handleSingleSubmit} className="space-y-5">
                {/* Employee Select */}
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                    Pilih Pegawai *
                  </label>
                  <DarkSelect
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Pilih Pegawai --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={String(emp.id)}>
                        {emp.name} ({emp.jabatan})
                      </option>
                    ))}
                  </DarkSelect>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                    Tanggal *
                  </label>
                  <DarkInput
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                    Status *
                  </label>
                  <DarkSelect
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="hadir">Hadir</option>
                    <option value="izin">Izin</option>
                    <option value="sakit">Sakit</option>
                    <option value="libur">Libur</option>
                  </DarkSelect>
                </div>

                {/* Check-in Time (for Hadir only) */}
                {formData.status === "hadir" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                        Jam Masuk *
                      </label>
                      <DarkInput
                        type="time"
                        name="checkInTime"
                        value={formData.checkInTime}
                        onChange={handleInputChange}
                        required={formData.status === "hadir"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                        Jam Keluar
                      </label>
                      <DarkInput
                        type="time"
                        name="checkOutTime"
                        value={formData.checkOutTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                    Catatan
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Keterangan tambahan (opsional)"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-border dark:border-border/50 bg-background dark:bg-background text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-transparent transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4 border-t border-border dark:border-border/50">
                  <DarkButton
                    type="submit"
                    variant="primary"
                    disabled={saving}
                    className="flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {saving ? "Menyimpan..." : "Simpan Absensi"}
                  </DarkButton>
                </div>
              </form>
            </DarkCard>
          )}

          {/* Bulk Import Tab */}
          {activeTab === "bulk" && (
            <DarkCard>
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-4">
                    Import Data Absensi dari CSV
                  </h3>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/50">
                  <p className="text-sm text-blue-900 dark:text-blue-300 mb-3">
                    <span className="font-medium">
                      Format CSV yang diperlukan:
                    </span>
                  </p>
                  <code className="text-xs bg-white dark:bg-background p-3 rounded block overflow-x-auto font-mono text-foreground dark:text-foreground">
                    nip,date,checkInTime,checkOutTime,status,notes
                    <br />
                    19701015199203001,2026-05-25,08:15,17:30,hadir,
                    <br />
                    19750520199303002,2026-05-25,08:30,,hadir,
                  </code>
                  <p className="text-xs text-blue-800 dark:text-blue-400 mt-3">
                    Status: hadir, izin, sakit, libur | Format waktu: HH:MM |
                    Format tanggal: YYYY-MM-DD
                  </p>
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-border dark:border-border/50 rounded-lg p-8 text-center hover:bg-secondary dark:hover:bg-secondary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleBulkImport}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer block">
                    <Upload
                      className="mx-auto mb-3 text-muted-foreground"
                      size={32}
                    />
                    <p className="text-sm font-medium text-foreground dark:text-foreground mb-1">
                      Pilih file CSV atau drag-drop di sini
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                      File CSV max 10MB
                    </p>
                  </label>
                </div>

                {/* Download Template */}
                <DarkButton
                  variant="secondary"
                  onClick={() => {
                    const template =
                      "nip,date,checkInTime,checkOutTime,status,notes\n19701015199203001,2026-05-25,08:15,17:30,hadir,";
                    const blob = new Blob([template], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "template-absensi.csv";
                    a.click();
                  }}
                  className="w-full"
                >
                  Download Template CSV
                </DarkButton>
              </div>
            </DarkCard>
          )}
        </main>
      </div>
    </div>
  );
}
