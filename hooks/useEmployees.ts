// 'use client';

// import { useState, useCallback, useEffect } from 'react';
// import { Employee } from '@/lib/types';
// import { employeeService } from '@/lib/storage';

// export function useEmployees() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Load employees on mount
//   useEffect(() => {
//     loadEmployees();
//   }, []);

//   const loadEmployees = useCallback(() => {
//     setLoading(true);
//     try {
//       const data = employeeService.getAll();
//       setEmployees(data);
//     } catch (error) {
//       console.error('Error loading employees:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const addEmployee = useCallback((data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
//     try {
//       const newEmployee = employeeService.create(data);
//       setEmployees(prev => [...prev, newEmployee]);
//       return newEmployee;
//     } catch (error) {
//       console.error('Error creating employee:', error);
//       throw error;
//     }
//   }, []);

//   const updateEmployee = useCallback((id: string, data: Partial<Employee>) => {
//     try {
//       const updated = employeeService.update(id, data);
//       setEmployees(prev => prev.map(emp => (emp.id === id ? updated : emp)));
//       return updated;
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       throw error;
//     }
//   }, []);

//   const deleteEmployee = useCallback((id: string) => {
//     try {
//       employeeService.delete(id);
//       setEmployees(prev => prev.filter(emp => emp.id !== id));
//     } catch (error) {
//       console.error('Error deleting employee:', error);
//       throw error;
//     }
//   }, []);

//   const searchEmployees = useCallback((query: string) => {
//     return employeeService.search(query);
//   }, []);

//   return {
//     employees,
//     loading,
//     loadEmployees,
//     addEmployee,
//     updateEmployee,
//     deleteEmployee,
//     searchEmployees,
//   };
// }

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
      const res = await fetch("/api/employees", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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
