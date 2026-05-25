"use client";

import { useEffect, useState } from "react";
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
import { Check, X, Eye, Search } from "lucide-react";
import { useRequests } from "@/hooks/useRequests";

export default function Page() {
  const { requests, loading, fetchRequests, updateRequest } = useRequests();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = requests.filter((req) => {
    const matchSearch = req.employee_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || req.status === filterStatus;
    const matchType = filterType === "all" || req.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const handleApprove = async (id: number) => {
    await updateRequest(id, "approved");
  };

  const handleReject = async (id: number) => {
    await updateRequest(id, "rejected");
  };

  const stats = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <Sidebar userRole="admin" currentPage="pengajuan" />
      <div className="flex-1">
        <Topbar userName="Admin Absensi" userRole="Administrator" />
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Pengajuan Absensi
            </h1>
            <p className="text-muted-foreground">
              Kelola pengajuan izin, sakit, dan cuti pegawai
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <DarkCard className="bg-yellow-50 dark:bg-yellow-900/20 p-4">
              <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                Menunggu
              </p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-2">
                {stats.pending}
              </p>
            </DarkCard>
            <DarkCard className="bg-green-50 dark:bg-green-900/20 p-4">
              <p className="text-xs font-medium text-green-600 dark:text-green-400">
                Disetujui
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-2">
                {stats.approved}
              </p>
            </DarkCard>
            <DarkCard className="bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                Ditolak
              </p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300 mt-2">
                {stats.rejected}
              </p>
            </DarkCard>
          </div>

          <DarkCard className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Cari nama pegawai..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border dark:border-border/50 bg-background text-foreground text-sm"
                />
              </div>
              <DarkSelect
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Semua Jenis</option>
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="cuti">Cuti</option>
              </DarkSelect>
              <DarkSelect
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </DarkSelect>
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
                    Jenis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Alasan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Aksi
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
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      Tidak ada pengajuan
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <DarkTableRow key={req.id}>
                      <td className="px-6 py-4 text-sm font-medium">
                        {req.employee_name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                          {req.type.charAt(0).toUpperCase() + req.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {req.start_date} s/d {req.end_date}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {req.reason?.substring(0, 30)}...
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <DarkBadge
                          status={
                            req.status === "approved"
                              ? "success"
                              : req.status === "rejected"
                                ? "error"
                                : "warning"
                          }
                        >
                          {req.status === "pending"
                            ? "Menunggu"
                            : req.status === "approved"
                              ? "Disetujui"
                              : "Ditolak"}
                        </DarkBadge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {req.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50"
                              title="Setujui"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                              title="Tolak"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                            title="Lihat Detail"
                          >
                            <Eye size={16} />
                          </button>
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

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <DarkCard className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Detail Pengajuan
              </h2>
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground">Nama Pegawai</p>
                  <p className="font-medium text-foreground">
                    {selectedRequest.employee_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Jenis</p>
                  <p className="font-medium text-foreground">
                    {selectedRequest.type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Periode</p>
                  <p className="font-medium text-foreground">
                    {selectedRequest.start_date} s/d {selectedRequest.end_date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Alasan</p>
                  <p className="text-foreground">{selectedRequest.reason}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-medium text-foreground capitalize">
                    {selectedRequest.status}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-full px-4 py-2 rounded-lg border border-border dark:border-border/50 text-foreground hover:bg-secondary dark:hover:bg-secondary/50 transition-colors"
              >
                Tutup
              </button>
            </div>
          </DarkCard>
        </div>
      )}
    </div>
  );
}
