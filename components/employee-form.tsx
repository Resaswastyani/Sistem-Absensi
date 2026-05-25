"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { DarkInput, DarkButton, DarkSelect } from "./dark-mode-wrapper";

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  jabatan: string;
  departemen: string;
  nip: string;
  alamat: string;
  status: "aktif" | "nonaktif";
  role: "admin" | "user";
  password?: string;
}

interface EmployeeFormProps {
  initialData?: EmployeeFormData & { id?: number };
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  isLoading?: boolean;
}

export function EmployeeForm({
  initialData,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    phone: "",
    jabatan: "",
    departemen: "",
    nip: "",
    alamat: "",
    status: "aktif",
    role: "user",
    password: "",
  });

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        jabatan: initialData.jabatan || "",
        departemen: initialData.departemen || "",
        nip: initialData.nip || "",
        alamat: initialData.alamat || "",
        status: initialData.status || "aktif",
        role: initialData.role || "user",
        password: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        jabatan: "",
        departemen: "",
        nip: "",
        alamat: "",
        status: "aktif",
        role: "user",
        password: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove password if empty (for edit mode)
    const submitData = { ...formData };
    if (!submitData.password) {
      delete submitData.password;
    }
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 transition-colors">
      <div className="bg-card dark:bg-card rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-border dark:border-border/50 transition-colors">
        {/* Header */}
        <div className="sticky top-0 bg-card dark:bg-card border-b border-border dark:border-border/50 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground dark:text-foreground">
            {initialData ? "Edit Pegawai" : "Tambah Pegawai"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary dark:hover:bg-secondary/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-foreground dark:text-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
              Nama Lengkap *
            </label>
            <DarkInput
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
              Email *
            </label>
            <DarkInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@stmik.ac.id"
              required
            />
          </div>

          {/* Password (only for new employee) */}
          {!initialData && (
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
                Password *
              </label>
              <DarkInput
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                placeholder="••••••••"
                required={!initialData}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default: user123
              </p>
            </div>
          )}

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
              No. Telepon *
            </label>
            <DarkInput
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>

          {/* NIP */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
              NIP *
            </label>
            <DarkInput
              type="text"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              placeholder="19xxxxxxxxxx"
              required
            />
          </div>

          {/* Jabatan */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
              Jabatan *
            </label>
            <DarkSelect
              name="jabatan"
              value={formData.jabatan}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Jabatan</option>
              <option value="Dosen Tetap">Dosen Tetap</option>
              <option value="Dosen Tidak Tetap">Dosen Tidak Tetap</option>
              <option value="Staf Akademik">Staf Akademik</option>
              <option value="Staf Administrasi">Staf Administrasi</option>
              <option value="Staf Teknis">Staf Teknis</option>
            </DarkSelect>
          </div>

          {/* Departemen */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
              Departemen *
            </label>
            <DarkSelect
              name="departemen"
              value={formData.departemen}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Departemen</option>
              <option value="Teknik Informatika">Teknik Informatika</option>
              <option value="Sistem Informasi">Sistem Informasi</option>
              <option value="Akademik">Akademik</option>
              <option value="Administrasi">Administrasi</option>
              <option value="Keuangan">Keuangan</option>
            </DarkSelect>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
              Role *
            </label>
            <DarkSelect
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">User (Pegawai)</option>
              <option value="admin">Admin</option>
            </DarkSelect>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
              Alamat *
            </label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              placeholder="Masukkan alamat lengkap"
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-border dark:border-border/50 bg-background dark:bg-background text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-transparent transition-colors resize-none"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
              Status
            </label>
            <DarkSelect
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </DarkSelect>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border dark:border-border/50 text-foreground dark:text-foreground hover:bg-secondary dark:hover:bg-secondary/50 font-medium transition-colors"
            >
              Batal
            </button>
            <DarkButton
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </DarkButton>
          </div>
        </form>
      </div>
    </div>
  );
}
