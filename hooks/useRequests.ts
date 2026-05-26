// hooks/useRequests.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface RequestItem {
  id: number;
  user_id: number;
  employee_name?: string;
  type: "izin" | "sakit" | "cuti";
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  attachment_url?: string;
  created_at?: string;
}

export function useRequests() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async (params?: Record<string, string>) => {
    try {
      setLoading(true);
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      const res = await fetch(`/api/requests${query}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRequest = async (
    data: Omit<RequestItem, "id" | "created_at">,
  ) => {
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (res.ok) fetchRequests();
    return res.ok;
  };

  const updateRequest = async (id: number, status: "approved" | "rejected") => {
    const res = await fetch(`/api/requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include",
    });
    if (res.ok) fetchRequests();
    return res.ok;
  };

  return { requests, loading, fetchRequests, createRequest, updateRequest };
}
