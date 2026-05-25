// 'use client';

// import { useEffect, useState } from 'react';
// import { Sidebar } from '@/components/sidebar';
// import { Topbar } from '@/components/topbar';
// import { EmployeeForm } from '@/components/employee-form';
// import { DarkCard, DarkButton, DarkInput, DarkSelect, DarkTable, DarkTableHead, DarkTableBody, DarkTableRow, DarkBadge } from '@/components/dark-mode-wrapper';
// import { Search, Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';
// import { useEmployees } from '@/hooks/useEmployees';
// import { Employee } from '@/lib/types';
// // import { initializeStorage } from '@/lib/storage';

// // export default function Page() {
// //   useEffect(() => {
// //     initializeStorage();
// //   }, []);

//   const { employees, loading, addEmployee, updateEmployee, deleteEmployee, searchEmployees } = useEmployees();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterDepartemen, setFilterDepartemen] = useState('all');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//   const filteredEmployees = searchTerm
//     ? searchEmployees(searchTerm)
//     : employees.filter(emp => {
//         const matchDep = filterDepartemen === 'all' || emp.departemen === filterDepartemen;
//         const matchStatus = filterStatus === 'all' || emp.status === filterStatus;
//         return matchDep && matchStatus;
//       });

//   const handleAddEmployee = (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
//     addEmployee(data);
//     setIsFormOpen(false);
//   };

//   const handleEditEmployee = (employee: Employee) => {
//     setEditingEmployee(employee);
//     setIsFormOpen(true);
//     setOpenDropdown(null);
//   };

//   const handleUpdateEmployee = (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
//     if (editingEmployee) {
//       updateEmployee(editingEmployee.id, data);
//       setEditingEmployee(null);
//       setIsFormOpen(false);
//     }
//   };

//   const handleDeleteEmployee = (id: string) => {
//     if (confirm('Apakah Anda yakin ingin menghapus pegawai ini?')) {
//       deleteEmployee(id);
//       setOpenDropdown(null);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-background dark:bg-background">
//       <Sidebar userRole="admin" currentPage="employees" />

//       <div className="flex-1">
//         <Topbar userName="Admin Absensi" userRole="Administrator" />

//         <main className="p-4 md:p-6 max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Data Pegawai</h1>
//               <p className="text-muted-foreground dark:text-muted-foreground">Kelola data semua pegawai institusi</p>
//             </div>
//             <DarkButton
//               variant="primary"
//               onClick={() => {
//                 setEditingEmployee(null);
//                 setIsFormOpen(true);
//               }}
//               className="flex items-center justify-center gap-2"
//             >
//               <Plus size={20} />
//               Tambah Pegawai
//             </DarkButton>
//           </div>

//           {/* Filters */}
//           <DarkCard className="mb-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//                 <DarkInput
//                   type="text"
//                   placeholder="Cari nama atau email..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <DarkSelect
//                 value={filterDepartemen}
//                 onChange={(e) => setFilterDepartemen(e.target.value)}
//               >
//                 <option value="all">Semua Departemen</option>
//                 <option value="Teknik Informatika">Teknik Informatika</option>
//                 <option value="Sistem Informasi">Sistem Informasi</option>
//                 <option value="Akademik">Akademik</option>
//                 <option value="Administrasi">Administrasi</option>
//               </DarkSelect>
//               <DarkSelect
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//               >
//                 <option value="all">Semua Status</option>
//                 <option value="aktif">Aktif</option>
//                 <option value="nonaktif">Nonaktif</option>
//               </DarkSelect>
//             </div>
//           </DarkCard>

//           {/* Table */}
//           <DarkCard>
//             <DarkTable>
//               <DarkTableHead>
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">Nama</th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">Email</th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">NIP</th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">Jabatan</th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">Departemen</th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">Aksi</th>
//                 </tr>
//               </DarkTableHead>
//               <DarkTableBody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : filteredEmployees.length === 0 ? (
//                   <tr>
//                     <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
//                       Tidak ada data pegawai
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredEmployees.map((emp) => (
//                     <DarkTableRow key={emp.id}>
//                       <td className="px-6 py-4 text-sm font-medium text-foreground">{emp.name}</td>
//                       <td className="px-6 py-4 text-sm text-muted-foreground">{emp.email}</td>
//                       <td className="px-6 py-4 text-sm text-muted-foreground">{emp.nip}</td>
//                       <td className="px-6 py-4 text-sm text-foreground">{emp.jabatan}</td>
//                       <td className="px-6 py-4 text-sm text-foreground">{emp.departemen}</td>
//                       <td className="px-6 py-4 text-sm">
//                         <DarkBadge status={emp.status === 'aktif' ? 'success' : 'warning'}>
//                           {emp.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
//                         </DarkBadge>
//                       </td>
//                       <td className="px-6 py-4 text-sm relative">
//                         <button
//                           onClick={() => setOpenDropdown(openDropdown === emp.id ? null : emp.id)}
//                           className="p-2 hover:bg-secondary dark:hover:bg-secondary/50 rounded-lg transition-colors"
//                         >
//                           <ChevronDown size={18} className="text-muted-foreground" />
//                         </button>
//                         {openDropdown === emp.id && (
//                           <div className="absolute right-0 top-full mt-1 bg-card dark:bg-card border border-border dark:border-border/50 rounded-lg shadow-lg overflow-hidden z-10">
//                             <button
//                               onClick={() => handleEditEmployee(emp)}
//                               className="w-full text-left px-4 py-2 text-sm text-foreground dark:text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors flex items-center gap-2"
//                             >
//                               <Edit2 size={16} />
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDeleteEmployee(emp.id)}
//                               className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
//                             >
//                               <Trash2 size={16} />
//                               Hapus
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                     </DarkTableRow>
//                   ))
//                 )}
//               </DarkTableBody>
//             </DarkTable>
//           </DarkCard>
//         </main>
//       </div>

//       {/* Employee Form Modal */}
//       <EmployeeForm
//         initialData={editingEmployee || undefined}
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setEditingEmployee(null);
//         }}
//         onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
//       />
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { EmployeeForm, EmployeeFormData } from "@/components/employee-form";
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
import { Search, Plus, Edit2, Trash2, ChevronDown } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  email: string;
  nip: string;
  phone: string;
  jabatan: string;
  departemen: string;
  alamat: string;
  status: "aktif" | "nonaktif";
  role: "admin" | "user";
  created_at?: string;
}

export default function Page() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartemen, setFilterDepartemen] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch employees from API
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employees", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = searchTerm
    ? employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.nip.includes(searchTerm),
      )
    : employees.filter((emp) => {
        const matchDep =
          filterDepartemen === "all" || emp.departemen === filterDepartemen;
        const matchStatus =
          filterStatus === "all" || emp.status === filterStatus;
        return matchDep && matchStatus;
      });

  const handleAddEmployee = async (data: EmployeeFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (res.ok) {
        await fetchEmployees();
        setIsFormOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menambah pegawai");
      }
    } catch (error) {
      console.error("Add employee error:", error);
      alert("Terjadi kesalahan saat menambah pegawai");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
    setOpenDropdown(null);
  };

  const handleUpdateEmployee = async (data: EmployeeFormData) => {
    if (!editingEmployee) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/employees/${editingEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (res.ok) {
        await fetchEmployees();
        setEditingEmployee(null);
        setIsFormOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "Gagal mengupdate pegawai");
      }
    } catch (error) {
      console.error("Update employee error:", error);
      alert("Terjadi kesalahan saat mengupdate pegawai");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pegawai ini?")) return;

    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        await fetchEmployees();
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menghapus pegawai");
      }
    } catch (error) {
      console.error("Delete employee error:", error);
      alert("Terjadi kesalahan saat menghapus pegawai");
    }
    setOpenDropdown(null);
  };

  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <Sidebar userRole="admin" currentPage="employees" />

      <div className="flex-1">
        <Topbar userName="Admin Absensi" userRole="Administrator" />

        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground dark:text-foreground">
                Data Pegawai
              </h1>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Kelola data semua pegawai institusi
              </p>
            </div>
            <DarkButton
              variant="primary"
              onClick={() => {
                setEditingEmployee(null);
                setIsFormOpen(true);
              }}
              className="flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Tambah Pegawai
            </DarkButton>
          </div>

          {/* Filters */}
          <DarkCard className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <DarkInput
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DarkSelect
                value={filterDepartemen}
                onChange={(e) => setFilterDepartemen(e.target.value)}
              >
                <option value="all">Semua Departemen</option>
                <option value="Teknik Informatika">Teknik Informatika</option>
                <option value="Sistem Informasi">Sistem Informasi</option>
                <option value="Akademik">Akademik</option>
                <option value="Administrasi">Administrasi</option>
              </DarkSelect>
              <DarkSelect
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </DarkSelect>
            </div>
          </DarkCard>

          {/* Table */}
          <DarkCard>
            <DarkTable>
              <DarkTableHead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                    NIP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                    Jabatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                    Departemen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                    Aksi
                  </th>
                </tr>
              </DarkTableHead>
              <DarkTableBody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      Tidak ada data pegawai
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <DarkTableRow key={emp.id}>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {emp.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {emp.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {emp.nip}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {emp.jabatan}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {emp.departemen}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            emp.role === "admin"
                              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          }`}
                        >
                          {emp.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <DarkBadge
                          status={
                            emp.status === "aktif" ? "success" : "warning"
                          }
                        >
                          {emp.status === "aktif" ? "Aktif" : "Nonaktif"}
                        </DarkBadge>
                      </td>
                      <td className="px-6 py-4 text-sm relative">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === String(emp.id)
                                ? null
                                : String(emp.id),
                            )
                          }
                          className="p-2 hover:bg-secondary dark:hover:bg-secondary/50 rounded-lg transition-colors"
                        >
                          <ChevronDown
                            size={18}
                            className="text-muted-foreground"
                          />
                        </button>
                        {openDropdown === String(emp.id) && (
                          <div className="absolute right-0 top-full mt-1 bg-card dark:bg-card border border-border dark:border-border/50 rounded-lg shadow-lg overflow-hidden z-10">
                            <button
                              onClick={() => handleEditEmployee(emp)}
                              className="w-full text-left px-4 py-2 text-sm text-foreground dark:text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors flex items-center gap-2"
                            >
                              <Edit2 size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(emp.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Hapus
                            </button>
                          </div>
                        )}
                      </td>
                    </DarkTableRow>
                  ))
                )}
              </DarkTableBody>
            </DarkTable>
          </DarkCard>
        </main>
      </div>

      {/* Employee Form Modal */}
      <EmployeeForm
        initialData={
          editingEmployee
            ? {
                name: editingEmployee.name,
                email: editingEmployee.email,
                phone: editingEmployee.phone,
                jabatan: editingEmployee.jabatan,
                departemen: editingEmployee.departemen,
                nip: editingEmployee.nip,
                alamat: editingEmployee.alamat,
                status: editingEmployee.status,
                role: editingEmployee.role,
              }
            : undefined
        }
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
        isLoading={submitting}
      />
    </div>
  );
}
