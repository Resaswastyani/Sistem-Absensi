'use client';

import { useEffect, useState } from 'react';
import { MapPin, Cloud, Clock, AlertCircle } from 'lucide-react';

interface MobileAttendanceProps {
  userName: string;
  status: 'hadir' | 'izin' | 'sakit' | 'belum';
  checkInTime?: string;
  checkOutTime?: string;
  temperature?: number;
  location?: string;
  distance?: number;
}

export function MobileAttendanceView({
  userName,
  status,
  checkInTime,
  checkOutTime,
  temperature = 28,
  location = 'STMIK El Rahma',
  distance = 50,
}: MobileAttendanceProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'hadir':
        return 'bg-emerald-600 dark:bg-emerald-700';
      case 'izin':
        return 'bg-blue-600 dark:bg-blue-700';
      case 'sakit':
        return 'bg-amber-600 dark:bg-amber-700';
      default:
        return 'bg-red-600 dark:bg-red-700';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'hadir':
        return 'Hadir';
      case 'izin':
        return 'Izin';
      case 'sakit':
        return 'Sakit';
      default:
        return 'Belum Absen';
    }
  };

  if (!isMobile) return null;

  return (
    <div className="md:hidden min-h-screen w-full bg-gradient-to-b from-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700 overflow-y-auto flex flex-col">
      {/* Banner with Background Image */}
      <div 
        className="relative h-48 bg-cover bg-center bg-no-repeat rounded-b-3xl shadow-lg overflow-hidden"
        style={{
          backgroundImage: 'url(/images/attendance-banner.jpg)',
          backgroundColor: '#2563eb'
        }}
      >
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        <div className="relative h-full flex flex-col justify-end p-6 text-white">
          <p className="text-sm opacity-90">Selamat Pagi</p>
          <h1 className="text-3xl font-bold mb-1">{userName}</h1>
          <p className="text-sm opacity-75">Check-in Status</p>
        </div>
      </div>

      {/* Time Display Card */}
      <div className="mx-4 my-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Status Bar */}
        <div className={`${getStatusColor()} text-white p-4 text-center`}>
          <p className="text-sm opacity-90 mb-1">Status Hari Ini</p>
          <p className="text-2xl font-bold">{getStatusLabel()}</p>
        </div>

        {/* Clock and Weather */}
        <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
          {/* Big Clock */}
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-slate-900 dark:text-white tracking-wider mb-2">
              {currentTime.split(':')[0]}:{currentTime.split(':')[1]}
            </div>
            <div className="text-3xl font-light text-slate-600 dark:text-slate-300">
              {currentTime.split(':')[2]}
            </div>
          </div>

          {/* Weather / Status Info */}
          <div className="flex items-center justify-center gap-2 mb-6 text-slate-600 dark:text-slate-300">
            <Cloud size={20} />
            <span className="text-lg">{temperature}°C</span>
          </div>

          {/* Check In / Out Times */}
          {status === 'hadir' && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {checkInTime && (
                <div className="bg-white dark:bg-slate-600 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Masuk</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {checkInTime}
                  </p>
                </div>
              )}
              {checkOutTime && (
                <div className="bg-white dark:bg-slate-600 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Keluar</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {checkOutTime}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Location Card */}
      <div className="mx-4 mb-6 bg-white dark:bg-slate-800 rounded-xl shadow-md p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <MapPin size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Lokasi Absensi
            </p>
            <p className="font-semibold text-slate-900 dark:text-white mb-1">{location}</p>
            {distance !== undefined && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Jarak: {distance}m ({distance <= 100 ? 'Dalam radius ✓' : 'Di luar radius ✗'})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notes / Warnings */}
      {status !== 'hadir' && (
        <div className="mx-4 mb-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-2">
          <AlertCircle size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Status kamu hari ini adalah <strong>{getStatusLabel()}</strong>
          </p>
        </div>
      )}

      {/* Action Buttons - for reference, can be filled later */}
      <div className="mx-4 mb-8 space-y-2">
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white font-semibold py-3 rounded-lg transition-colors">
          Absen Masuk
        </button>
        <button className="w-full bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors">
          Absen Keluar
        </button>
      </div>
    </div>
  );
}
