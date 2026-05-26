// app/attendance/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { FaceDetectionCamera } from "@/components/face-detection-camera";
import { MobileAttendanceView } from "@/components/mobile-attendance-view";
import { DarkCard, DarkButton } from "@/components/dark-mode-wrapper";
import { MapPin, Clock, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useAttendance } from "@/hooks/useAttendance";
import { useSettings } from "@/hooks/useSettings";

export default function Page() {
  const { user } = useAuth();
  const { todayAttendance, fetchToday, addAttendance } = useAttendance();
  const { settings, loading: settingsLoading } = useSettings();
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [locationError, setLocationError] = useState("");
  const [attendanceMode, setAttendanceMode] = useState<
    "checkin" | "checkout" | null
  >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchToday();
    }
  }, [user, fetchToday]);

  const getLocationDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  };

  const handleGetLocation = () => {
    setLoading(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation tidak didukung di browser Anda");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });

        // GUARD: pastikan settings sudah loaded dan valid
        if (!settings || settingsLoading) {
          setLocationError("Pengaturan lokasi belum dimuat, coba lagi");
          setLoading(false);
          return;
        }

        const officeLat = Number(settings.latitude);
        const officeLng = Number(settings.longitude);
        const officeRadius = Number(settings.radius);

        if (isNaN(officeLat) || isNaN(officeLng) || isNaN(officeRadius)) {
          setLocationError("Koordinat kantor tidak valid");
          setLoading(false);
          return;
        }

        const distance = getLocationDistance(
          latitude,
          longitude,
          officeLat,
          officeLng,
        );

        if (distance > officeRadius) {
          setLocationError(
            `Anda berada ${Math.round(distance)}m dari kantor. Radius: ${officeRadius}m`,
          );
          setLoading(false);
          return;
        }

        setShowCameraModal(true);
        setLoading(false);
      },
      (error) => {
        setLocationError("Gagal mendapatkan lokasi: " + error.message);
        setLoading(false);
      },
    );
  };

  const handleAttendanceSuccess = async (
    imageData: string,
    confidence: number,
  ) => {
    if (!currentLocation || !user) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const dateString = now.toISOString().split("T")[0];
    const hour = now.getHours();
    const isLate = hour > 8;

    await addAttendance({
      user_id: user.id,
      date: dateString,
      check_in_time: attendanceMode === "checkin" ? timeString : undefined,
      check_out_time: attendanceMode === "checkout" ? timeString : undefined,
      status:
        attendanceMode === "checkin"
          ? isLate
            ? "terlambat"
            : "tepat_waktu"
          : todayAttendance?.status,
      location: `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`,
      face_match: confidence,
    });

    setShowCameraModal(false);
    setCurrentLocation(null);
    fetchToday();
  };

  // Loading state saat auth atau settings belum siap
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <DarkCard>
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-yellow-600" size={48} />
            <p className="text-foreground font-medium">
              Silakan login terlebih dahulu
            </p>
          </div>
        </DarkCard>
      </div>
    );
  }

  return (
    <>
      <MobileAttendanceView
        userName={user.name}
        status={
          todayAttendance?.status === "hadir" ||
          todayAttendance?.status === "tepat_waktu" ||
          todayAttendance?.status === "terlambat"
            ? "hadir"
            : "belum"
        }
        checkInTime={todayAttendance?.check_in_time}
        checkOutTime={todayAttendance?.check_out_time}
      />

      <div className="hidden md:flex min-h-screen bg-background dark:bg-background">
        <Sidebar userRole="user" currentPage="absen" />
        <div className="flex-1">
          <Topbar
            userName={user.name}
            userRole={user.role === "admin" ? "Admin" : "Pengguna"}
          />
          <main className="p-4 md:p-6 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                Sistem Absensi
              </h1>
              <p className="text-muted-foreground">
                Absensi dengan deteksi wajah dan verifikasi lokasi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <DarkCard className="p-6">
                <h2 className="font-bold text-foreground mb-6 flex items-center gap-2">
                  <Clock size={20} /> Status Hari Ini
                </h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Jam Masuk
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Clock
                          size={24}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          {todayAttendance?.check_in_time || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {todayAttendance?.status === "terlambat"
                            ? "Terlambat"
                            : todayAttendance?.status === "tepat_waktu"
                              ? "Tepat Waktu"
                              : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Jam Keluar
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Clock
                          size={24}
                          className="text-green-600 dark:text-green-400"
                        />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          {todayAttendance?.check_out_time || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Belum Absen Keluar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {locationError && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm mb-6 flex gap-2">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />{" "}
                    {locationError}
                  </div>
                )}

                <div className="space-y-2">
                  {!todayAttendance?.check_in_time && (
                    <DarkButton
                      onClick={() => {
                        setAttendanceMode("checkin");
                        handleGetLocation();
                      }}
                      disabled={loading || settingsLoading}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Camera size={20} />{" "}
                      {loading ? "Mengambil Lokasi..." : "Absen Masuk"}
                    </DarkButton>
                  )}
                  {todayAttendance?.check_in_time &&
                    !todayAttendance?.check_out_time && (
                      <DarkButton
                        onClick={() => {
                          setAttendanceMode("checkout");
                          handleGetLocation();
                        }}
                        disabled={loading || settingsLoading}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Camera size={20} />{" "}
                        {loading ? "Mengambil Lokasi..." : "Absen Keluar"}
                      </DarkButton>
                    )}
                </div>
              </DarkCard>

              <DarkCard className="p-6">
                <h2 className="font-bold text-foreground mb-6 flex items-center gap-2">
                  <MapPin size={20} /> Informasi Lokasi
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-900/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Lokasi Kantor
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {settings?.name || "STMIK El Rahma"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Koordinat:{" "}
                      {settings
                        ? `${Number(settings.latitude || -7.7956).toFixed(4)}, ${Number(settings.longitude || 110.4038).toFixed(4)}`
                        : "Memuat..."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Radius:{" "}
                      {settings
                        ? `${Number(settings.radius || 100)}m`
                        : "Memuat..."}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-900/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Lokasi Anda
                    </p>
                    {currentLocation ? (
                      <>
                        <p className="text-sm font-medium text-foreground">
                          {currentLocation.latitude.toFixed(4)},{" "}
                          {currentLocation.longitude.toFixed(4)}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle size={16} />
                          <span className="text-xs">Dalam jangkauan</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Aktifkan lokasi untuk melihat posisi
                      </p>
                    )}
                  </div>
                </div>
              </DarkCard>
            </div>

            {showCameraModal && (
              <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
                <DarkCard className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Deteksi Wajah -{" "}
                      {attendanceMode === "checkin"
                        ? "Absen Masuk"
                        : "Absen Keluar"}
                    </h2>
                    <FaceDetectionCamera
                      onCapture={handleAttendanceSuccess}
                      onCancel={() => setShowCameraModal(false)}
                    />
                  </div>
                </DarkCard>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
