'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

interface SidebarProps {
  userRole?: 'admin' | 'user' | 'manager';
  currentPage?: string;
}

export function Sidebar({ userRole = 'admin', currentPage = 'dashboard' }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const adminMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', page: 'dashboard' },
    { icon: Users, label: 'Data Pegawai', href: '/admin/employees', page: 'employees' },
    { icon: ClipboardList, label: 'Riwayat Absensi', href: '/admin/attendance', page: 'attendance' },
    { icon: FileText, label: 'Pengajuan', href: '/admin/pengajuan', page: 'pengajuan' },
    { icon: BarChart3, label: 'Laporan', href: '/admin/laporan', page: 'laporan' },
    { icon: Settings, label: 'Pengaturan', href: '/admin/settings', page: 'settings' },
  ];

  const userMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', page: 'dashboard' },
    { icon: ClipboardList, label: 'Absensi', href: '/attendance', page: 'attendance' },
    { icon: FileText, label: 'Pengajuan', href: '/requests', page: 'requests' },
  ];

  const menuItems = userRole === 'admin' ? adminMenu : userMenu;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed md:hidden top-4 right-4 z-40 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 transform md:transform-none z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-sidebar-primary-foreground">SR</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">STMIK El Rahma</h1>
              <p className="text-xs text-sidebar-foreground/70">Sistem Absensi</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <Link
                key={item.page}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar/50">
          {user && (
            <div className="mb-3 pb-3 border-b border-sidebar-border">
              <p className="text-sm font-semibold text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
              <span className="inline-block mt-2 text-xs font-mono bg-sidebar-primary/20 px-2 py-1 rounded text-sidebar-primary">
                {user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Manager' : 'Pengguna'}
              </span>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
