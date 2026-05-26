// hooks/useSettings.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface OfficeLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  address: string;
  start_time: string;
  end_time: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<OfficeLocation | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings", { credentials: "include" });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Failed to fetch settings:", res.status, errData);
        setSettings(null);
        return;
      }

      const data = await res.json();
      const settingsData = data.settings || data.setting || null;
      setSettings(settingsData);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = async (data: Partial<OfficeLocation>) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(
        errData.error || `Failed to update settings (${res.status})`,
      );
    }

    const result = await res.json();
    const settingsData = result.settings || result.setting || null;
    setSettings(settingsData);
    return settingsData;
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, updateSettings, refresh: fetchSettings };
}
