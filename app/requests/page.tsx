'use client';

import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { Plus, FileText, Calendar, Upload, X } from 'lucide-react';
import { useState } from 'react';

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [requestType, setRequestType] = useState('izin');
  const [formData, setFormData] = useState({
    type: 'izin',
    startDate: '',
    endDate: '',
    description: '',
  });

  const requests = [
    { id: 1, type: 'Sakit', startDate: '20 Mei 2026', endDate: '20 Mei 2026', status: 'Disetujui', reason: 'Demam tinggi' },
    { id: 2, type: 'Izin', startDate: '15 Mei 2026', endDate: '16 Mei 2026', status: 'Disetujui', reason: 'Acara keluarga' },
    { id: 3, type: 'Sakit', startDate: '10 Mei 2026', endDate: '10 Mei 2026', status: 'Menunggu', reason: 'Pusing' },
  ];

  return (
    <html className="bg-background">
      <body>
        <div className="flex min-h-screen bg-background">
          <Sidebar userRole="user" currentPage="requests" />
          
          <div className="flex-1 md:ml-0">
            <Topbar userName="Dr. Ahmad Wijaya" userRole="Dosen" />
            
            <main className="p-4 md:p-6 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Pengajuan Izin/Sakit/Cuti</h1>
                  <p className="text-muted-foreground">Kelola pengajuan ketidakhadiran Anda</p>
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
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">Jenis</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">Tanggal Mulai</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">Tanggal Akhir</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">Alasan</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-foreground uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-secondary transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">{req.type}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{req.startDate}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{req.endDate}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{req.reason}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                              req.status === 'Disetujui'
                                ? 'bg-accent/10 text-accent'
                                : 'bg-yellow-50 text-yellow-600'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
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
                <h2 className="text-xl font-bold text-foreground">Ajukan Pengajuan</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="p-6 space-y-6">
                {/* Request Type */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Jenis Pengajuan</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'izin', label: 'Izin' },
                      { value: 'sakit', label: 'Sakit' },
                      { value: 'cuti', label: 'Cuti' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setRequestType(type.value)}
                        className={`p-3 rounded-lg border-2 transition-colors font-medium ${
                          requestType === type.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-foreground hover:border-primary'
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
                    <label className="block text-sm font-semibold text-foreground mb-2">Tanggal Mulai</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Tanggal Akhir</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Alasan</label>
                  <textarea
                    rows={4}
                    placeholder="Jelaskan alasan pengajuan Anda..."
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                {/* File Upload */}
                {(requestType === 'sakit' || requestType === 'cuti') && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      {requestType === 'sakit' ? 'Surat Dokter' : 'Dokumen Pendukung'}
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-foreground">Klik untuk upload</p>
                      <p className="text-xs text-muted-foreground">atau drag & drop</p>
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
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg transition-colors"
                  >
                    Ajukan
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
