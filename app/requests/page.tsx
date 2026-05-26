// app/requests/page.tsx
"use client";

import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { Plus, Upload, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRequests } from "@/hooks/useRequests";

export default function Page() {
  const { user } = useAuth();
  const { requests, loading, fetchRequests, createRequest } = useRequests();
  const [showModal, setShowModal] = useState(false);
  const [requestType, setRequestType] = useState("izin");
  const [formData, setFormData] = useState({
    type: "izin" as "izin" | "sakit" | "cuti",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRequests({ userId: String(user.id) });
    }
  }, [user, fetchRequests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      await createRequest({
        user_id: user.id,
        type: formData.type,
        start_date: formData.startDate,
        end_date: formData.endDate,
        reason: formData.reason,
        status: "pending",
      });
      setShowModal(false);
      setFormData({ type: "izin", startDate: "", endDate: "", reason: "" });
    } catch (error) {
      console.error("Failed to create request:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "approved" || status === "Disetujui") {
      return "bg-accent/10 text-accent";
    }
    if (status === "rejected") {
      return "bg-red-50 text-red-600";
    }
    return "bg-yellow-50 text-yellow-600";
  };

  const getStatusLabel = (status: string) => {
    if (status === "approved") return "Disetujui";
    if (status === "rejected") return "Ditolak";
    if (status === "pending") return "Menunggu";
    return status;
  };

  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      izin: "Izin",
      sakit: "Sakit",
      cuti: "Cuti",
    };
    return map[type] || type;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <html className="bg-background">
      <body>
        <div className="flex min-h-screen bg-background">
          <Sidebar userRole="user" currentPage="requests" />

          <div className="flex-1 md:ml-0">
            <Topbar
              userName={user?.name || "Pengguna"}
              userRole={user?.role === "admin" ? "Admin" : "Dosen"}
            />

            <main className="p-4 md:p-6 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Pengajuan Izin/Sakit/Cuti
                  </h1>
                  <p className="text-muted-foreground">
                    Kelola pengajuan ketidakhadiran Anda
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Ajukan Baru
                </button>
              </div>

              {/* Requests Table */}
              <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                          Jenis
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                          Tanggal Mulai
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                          Tanggal Akhir
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                          Alasan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {loading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-8 text-center text-muted-foreground"
                          >
                            Memuat data...
                          </td>
                        </tr>
                      ) : requests.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-8 text-center text-muted-foreground"
                          >
                            Belum ada pengajuan. Klik "Ajukan Baru" untuk
                            membuat pengajuan.
                          </td>
                        </tr>
                      ) : (
                        requests.map((req) => (
                          <tr
                            key={req.id}
                            className="hover:bg-secondary transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-foreground">
                              {getTypeLabel(req.type)}
                            </td>
                            <td className="px-6 py-4 text-sm text-foreground">
                              {formatDate(req.start_date)}
                            </td>
                            <td className="px-6 py-4 text-sm text-foreground">
                              {formatDate(req.end_date)}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {req.reason}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${getStatusBadge(req.status)}`}
                              >
                                {getStatusLabel(req.status)}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  Ajukan Pengajuan
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Request Type */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Jenis Pengajuan
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "izin", label: "Izin" },
                      { value: "sakit", label: "Sakit" },
                      { value: "cuti", label: "Cuti" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setRequestType(type.value);
                          setFormData((prev) => ({
                            ...prev,
                            type: type.value as "izin" | "sakit" | "cuti",
                          }));
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors font-medium ${
                          requestType === type.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-foreground hover:border-primary"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Tanggal Akhir
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Alasan
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    placeholder="Jelaskan alasan pengajuan Anda..."
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                {/* File Upload */}
                {(requestType === "sakit" || requestType === "cuti") && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      {requestType === "sakit"
                        ? "Surat Dokter"
                        : "Dokumen Pendukung"}
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload
                        size={32}
                        className="mx-auto text-muted-foreground mb-2"
                      />
                      <p className="text-sm font-medium text-foreground">
                        Klik untuk upload
                      </p>
                      <p className="text-xs text-muted-foreground">
                        atau drag & drop
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-border hover:bg-secondary text-foreground font-semibold py-2.5 px-4 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition-colors"
                  >
                    {submitting ? "Mengajukan..." : "Ajukan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
