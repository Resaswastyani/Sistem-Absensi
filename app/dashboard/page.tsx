'use client';

import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { UserDashboard } from '@/components/user-dashboard';
import { AttendanceModal } from '@/components/attendance-modal';
import { useState } from 'react';

export default function Page() {
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceType, setAttendanceType] = useState<'in' | 'out'>('in');

  const openModal = (type: 'in' | 'out') => {
    setAttendanceType(type);
    setShowAttendanceModal(true);
  };

  return (
    <html className="bg-background">
      <body>
        <div className="flex min-h-screen bg-background">
          <Sidebar userRole="user" currentPage="dashboard" />
          
          <div className="flex-1 md:ml-0">
            <Topbar userName="Dr. Ahmad Wijaya" userRole="Dosen" />
            
            <main className="p-4 md:p-6 max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Kelola absensi Anda dengan mudah</p>
              </div>

              <UserDashboard />
            </main>
          </div>
        </div>

        <AttendanceModal 
          isOpen={showAttendanceModal} 
          onClose={() => setShowAttendanceModal(false)}
          type={attendanceType}
        />
      </body>
    </html>
  );
}
