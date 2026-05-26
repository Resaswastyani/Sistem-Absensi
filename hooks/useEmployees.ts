// hooks/useEmployees.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";

export interface Employee {
  id: number;
  name: string;
  email: string;
  nip: string;
  phone?: string;
  jabatan: string;
  departemen: string;
  alamat?: string;
  status: "aktif" | "nonaktif";
  role: string;
  created_at?: string;
}

export function useEmployees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/employees", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.employees || []);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [user, fetchEmployees]);

  const addEmployee = async (data: Omit<Employee, "id" | "created_at">) => {
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, password: "user123" }),
      credentials: "include",
    });
    if (res.ok) fetchEmployees();
    return res.ok;
  };

  const updateEmployee = async (id: number, data: Partial<Employee>) => {
    const res = await fetch(`/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (res.ok) fetchEmployees();
    return res.ok;
  };

  const deleteEmployee = async (id: number) => {
    const res = await fetch(`/api/employees/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) fetchEmployees();
    return res.ok;
  };

  const searchEmployees = (term: string) => {
    if (!term) return employees;
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(term.toLowerCase()) ||
        e.email.toLowerCase().includes(term.toLowerCase()) ||
        e.nip.includes(term),
    );
  };

  return {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    refresh: fetchEmployees,
  };
}
