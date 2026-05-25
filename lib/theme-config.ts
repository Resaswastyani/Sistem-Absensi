/**
 * Theme Configuration
 * Centralized configuration untuk dark mode dan colors
 */

export const THEME_CONFIG = {
  // Theme options
  themes: ['light', 'dark'],
  defaultTheme: 'light',
  enableSystem: true, // Use system preference as fallback

  // Attribute untuk check theme
  attribute: 'class',
  
  // Fallback ketika JS disabled
  storageKey: 'theme',

  // Colors untuk light mode
  lightColors: {
    background: '#faf8f6',
    foreground: '#2a2a2a',
    card: '#ffffff',
    primary: '#4a5bcc',
    accent: '#3fa76a',
    secondary: '#f2f2f2',
    muted: '#e8e8e8',
    border: '#e5e5e5',
    destructive: '#c45d55',
  },

  // Colors untuk dark mode
  darkColors: {
    background: '#1e1e23',
    foreground: '#f2f2f2',
    card: '#2d2d35',
    primary: '#6b7ddb',
    accent: '#5cb77e',
    secondary: '#3a3a45',
    muted: '#4a4a55',
    border: '#4a4a55',
    destructive: '#d97168',
  },
};

/**
 * Demo accounts untuk login
 */
export const DEMO_ACCOUNTS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@stmik.ac.id',
    password: 'admin123',
    role: 'admin' as const,
    description: 'Administrator - Akses penuh ke semua fitur',
    initials: 'AD',
  },
  {
    id: '2',
    name: 'Dosen Yogyakarta',
    email: 'dosen@stmik.ac.id',
    password: 'dosen123',
    role: 'user' as const,
    description: 'Dosen - Pengajuan izin/sakit/cuti',
    initials: 'DO',
  },
  {
    id: '3',
    name: 'Staf Akademik',
    email: 'staf@stmik.ac.id',
    password: 'staf123',
    role: 'manager' as const,
    description: 'Manager - Monitoring absensi tim',
    initials: 'ST',
  },
];

/**
 * Role-based access control
 */
export const ROLE_CONFIG = {
  admin: {
    label: 'Administrator',
    color: 'bg-red-500',
    dashboardRoute: '/admin',
    permissions: ['view_all', 'manage_users', 'manage_attendance', 'view_reports'],
  },
  user: {
    label: 'Pengguna',
    color: 'bg-blue-500',
    dashboardRoute: '/dashboard',
    permissions: ['view_own', 'submit_request'],
  },
  manager: {
    label: 'Manager',
    color: 'bg-yellow-500',
    dashboardRoute: '/dashboard',
    permissions: ['view_team', 'view_reports', 'manage_requests'],
  },
};

/**
 * Navigate berdasarkan role
 */
export function getRedirectRoute(role: string): string {
  const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG];
  return config?.dashboardRoute || '/dashboard';
}

/**
 * Get display name untuk role
 */
export function getRoleLabel(role: string): string {
  const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG];
  return config?.label || 'User';
}
