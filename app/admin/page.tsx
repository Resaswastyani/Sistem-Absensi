"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { AdminDashboard } from "@/components/admin-dashboard";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="admin" currentPage="dashboard" />
      <div className="flex-1 md:ml-0">
        <Topbar userName="Admin Absensi" userRole="Administrator" />
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Pantau dan kelola data absensi institusi
            </p>
          </div>
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
}
