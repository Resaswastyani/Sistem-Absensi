"use client";

import { useState } from "react";
import {
  DarkButton,
  DarkInput,
  DarkSelect,
  DarkCard,
} from "./dark-mode-wrapper";
import { X, Clock, User } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  nip: string;
}

interface AdminQuickAttendanceProps {
  employees: Employee[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    employeeId: number;
    employeeName: string;
    date: string;
    checkInTime: string;
    checkOutTime?: string;
    status: string;
  }) => void;
}

export function AdminQuickAttendance({
  employees,
  isOpen,
  onClose,
  onSubmit,
}: AdminQuickAttendanceProps) {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [checkInTime, setCheckInTime] = useState("08:00");
  const [checkOutTime, setCheckOutTime] = useState("17:00");
  const [status, setStatus] = useState("hadir");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const employee = employees.find(
      (emp) => String(emp.id) === selectedEmployee,
    );
    if (!employee) {
      setLoading(false);
      return;
    }

    onSubmit({
      employeeId: employee.id,
      employeeName: employee.name,
      date,
      checkInTime,
      checkOutTime: status === "hadir" ? checkOutTime : undefined,
      status,
    });

    // Reset form
    setSelectedEmployee("");
    setDate(new Date().toISOString().split("T")[0]);
    setCheckInTime("08:00");
    setCheckOutTime("17:00");
    setStatus("hadir");
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <DarkCard className="w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-border/50">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Clock size={24} />
            Absen Manual
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary dark:hover:bg-secondary/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Employee Select */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Pilih Pegawai
            </label>
            <DarkSelect
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <option value="">-- Pilih Pegawai --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={String(emp.id)}>
                  {emp.name} ({emp.nip})
                </option>
              ))}
            </DarkSelect>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tanggal
            </label>
            <DarkInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <DarkSelect
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="libur">Libur</option>
            </DarkSelect>
          </div>

          {/* Check In Time */}
          {status === "hadir" && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Jam Masuk
                </label>
                <DarkInput
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                />
              </div>

              {/* Check Out Time */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Jam Keluar (Opsional)
                </label>
                <DarkInput
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <DarkButton
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </DarkButton>
            <DarkButton
              type="submit"
              variant="primary"
              disabled={loading || !selectedEmployee}
              className="flex-1"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </DarkButton>
          </div>
        </form>
      </DarkCard>
    </div>
  );
}
