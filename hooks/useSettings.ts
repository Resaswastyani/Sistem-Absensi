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
      const res = await fetch("/api/settings", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.setting);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
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
    if (res.ok) fetchSettings();
    return res.ok;
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, updateSettings, refresh: fetchSettings };
}
