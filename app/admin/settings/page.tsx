"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import {
  DarkCard,
  DarkButton,
  DarkInput,
} from "@/components/dark-mode-wrapper";
import { MapPin, Save, AlertCircle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export default function SettingsPage() {
  const { settings, loading, updateSettings } = useSettings();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    latitude: 0,
    longitude: 0,
    radius: 100,
    address: "",
    start_time: "07:30",
    end_time: "16:00",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name,
        latitude: settings.latitude,
        longitude: settings.longitude,
        radius: settings.radius,
        address: settings.address,
        start_time: settings.start_time,
        end_time: settings.end_time,
      });
    }
  }, [settings]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "radius" || name === "latitude" || name === "longitude"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          alert(
            "Gagal mendapatkan lokasi. Pastikan permission lokasi sudah diberikan.",
          );
        },
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background dark:bg-background">
        <Sidebar userRole="admin" currentPage="settings" />
        <div className="flex-1">
          <Topbar />
          <main className="p-6">
            <p className="text-muted-foreground">Loading...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <Sidebar userRole="admin" currentPage="settings" />
      <div className="flex-1">
        <Topbar />
        <main className="p-4 md:p-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2">
              Pengaturan Lokasi Kantor
            </h1>
            <p className="text-muted-foreground dark:text-muted-foreground">
              Atur koordinat lokasi kantor dan radius verifikasi absensi GPS
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-accent/10 dark:bg-accent/20 border border-accent/30 dark:border-accent/50 rounded-lg text-accent dark:text-accent">
              Pengaturan lokasi berhasil disimpan
            </div>
          )}

          <DarkCard className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50">
            <div className="flex gap-3">
              <AlertCircle
                className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                size={20}
              />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                  Panduan Pengaturan Lokasi
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Pegawai harus berada dalam radius yang ditentukan untuk
                  berhasil melakukan absensi.
                </p>
              </div>
            </div>
          </DarkCard>

          <DarkCard>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                  Nama Kantor
                </label>
                <DarkInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Kampus STMIK El Rahma"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                    Latitude
                  </label>
                  <DarkInput
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    step="0.00000001"
                    placeholder="-7.7956"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                    Longitude
                  </label>
                  <DarkInput
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    step="0.00000001"
                    placeholder="110.4038"
                  />
                </div>
              </div>

              <DarkButton
                variant="secondary"
                onClick={getCurrentLocation}
                className="w-full flex items-center justify-center gap-2"
              >
                <MapPin size={18} /> Dapatkan Lokasi Saat Ini
              </DarkButton>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                  Radius Verifikasi (meter)
                </label>
                <DarkInput
                  type="number"
                  name="radius"
                  value={formData.radius}
                  onChange={handleChange}
                  step="10"
                  min="10"
                  placeholder="100"
                />
                <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">
                  Pegawai harus berada dalam {formData.radius}m dari koordinat
                  lokasi
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                  Alamat Kantor
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Jalan Kaliurang KM 10, Yogyakarta"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-border dark:border-border/50 bg-background dark:bg-background text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-transparent transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                    Jam Kerja Mulai
                  </label>
                  <DarkInput
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                    Jam Kerja Selesai
                  </label>
                  <DarkInput
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border dark:border-border/50">
                <DarkButton
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center justify-center gap-2"
                >
                  <Save size={18} />{" "}
                  {saving ? "Menyimpan..." : "Simpan Pengaturan"}
                </DarkButton>
              </div>
            </div>
          </DarkCard>

          {settings && (
            <DarkCard className="mt-6">
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-4">
                Informasi Lokasi Saat Ini
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    Latitude
                  </p>
                  <p className="text-lg font-mono font-semibold text-foreground dark:text-foreground">
                    {settings.latitude.toFixed(7)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    Longitude
                  </p>
                  <p className="text-lg font-mono font-semibold text-foreground dark:text-foreground">
                    {settings.longitude.toFixed(7)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    Radius
                  </p>
                  <p className="text-lg font-mono font-semibold text-foreground dark:text-foreground">
                    {settings.radius}m
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    Status
                  </p>
                  <p className="text-lg font-semibold text-accent dark:text-accent">
                    Sudah Diatur
                  </p>
                </div>
              </div>
            </DarkCard>
          )}
        </main>
      </div>
    </div>
  );
}
