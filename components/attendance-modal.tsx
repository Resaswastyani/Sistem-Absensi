"use client";

import { useState, useRef } from "react";
import { MapPin, Camera, X, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "in" | "out";
}

export function AttendanceModal({
  isOpen,
  onClose,
  type = "in",
}: AttendanceModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"camera" | "location" | "confirm">("camera");
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [location, setLocation] = useState("Memuat lokasi...");
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Tidak dapat mengakses kamera:", err);
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );
        setPhoto(canvasRef.current.toDataURL("image/jpeg"));
        setStep("location");
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setStep("confirm");
        },
        (error) => {
          setLocation("Jl. Sisingamangaraja No.76, Yogyakarta");
          setStep("confirm");
        },
      );
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const dateString = now.toISOString().split("T")[0];
      const hour = now.getHours();
      const isLate = hour > 8;

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          date: dateString,
          check_in_time: type === "in" ? timeString : undefined,
          check_out_time: type === "out" ? timeString : undefined,
          status:
            type === "in" ? (isLate ? "terlambat" : "tepat_waktu") : undefined,
          location: coords
            ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
            : location,
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal menyimpan absensi");
    } catch (error) {
      console.error("Attendance save error:", error);
    } finally {
      setLoading(false);
      onClose();
      // Reset state
      setStep("camera");
      setPhoto(null);
      setLocation("Memuat lokasi...");
      setCoords(null);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
    setStep("camera");
    setPhoto(null);
    setLocation("Memuat lokasi...");
    setCoords(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            Absen {type === "in" ? "Masuk" : "Keluar"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "camera" && (
            <div className="space-y-4">
              <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  onLoadedMetadata={startCamera}
                  className="w-full h-full object-cover"
                />
              </div>
              <canvas
                ref={canvasRef}
                className="hidden"
                width={640}
                height={480}
              />
              <p className="text-sm text-muted-foreground text-center">
                Pastikan wajah Anda terlihat jelas dalam frame
              </p>
              <button
                onClick={capturePhoto}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                Ambil Foto
              </button>
            </div>
          )}

          {step === "location" && (
            <div className="space-y-4">
              <div className="bg-secondary rounded-lg p-6 text-center">
                <Camera size={48} className="mx-auto text-foreground/40 mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Foto telah diambil
                </p>
                <p className="text-lg font-semibold text-foreground mb-6">
                  Langkah 2: Verifikasi Lokasi
                </p>

                {photo && (
                  <img
                    src={photo}
                    alt="Captured"
                    className="rounded-lg mb-6 max-h-48 mx-auto"
                  />
                )}

                <button
                  onClick={getLocation}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin size={20} />
                  Konfirmasi Lokasi
                </button>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-6">
              <div className="space-y-4">
                {/* Photo */}
                {photo && (
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Foto
                    </p>
                    <img
                      src={photo}
                      alt="Captured"
                      className="rounded-lg w-full max-h-64 object-cover"
                    />
                  </div>
                )}

                {/* Location */}
                <div className="bg-secondary rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={20}
                      className="text-primary flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Lokasi
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {location}
                      </p>
                      <p className="text-xs text-foreground/60 mt-2">
                        Jl. Sisingamangaraja No.76, Brontokusuman, Kec.
                        Mergangsan, Kota Yogyakarta
                      </p>
                    </div>
                  </div>
                </div>

                {/* Time */}
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Waktu
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {new Date().toLocaleTimeString("id-ID")}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <AlertCircle
                    size={20}
                    className="text-accent flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-accent">
                      Verifikasi Diperlukan
                    </p>
                    <p className="text-xs text-foreground/60">
                      Admin akan memvalidasi absensi Anda
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("camera")}
                  className="flex-1 border border-border hover:bg-secondary text-foreground font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Ambil Ulang
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  {loading ? "Sedang Proses..." : "Konfirmasi"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
