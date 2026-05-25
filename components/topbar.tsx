'use client';

import { Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ThemeToggle } from './theme-toggle';

interface TopbarProps {
  userName?: string;
  userRole?: string;
}

export function Topbar({ userName = 'Dr. Ahmad Wijaya', userRole = 'Dosen' }: TopbarProps) {
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const displayName = user?.name || userName;
  const displayRole = user?.role === 'admin' ? 'Admin' : user?.role === 'manager' ? 'Manager' : userRole;

  const handleLogout = () => {
    logout();
    router.push('/');
    setShowProfile(false);
  };

  return (
    <header className="bg-card dark:bg-card border-b border-border dark:border-border/50 sticky top-0 z-20 hidden md:block transition-colors">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-sm text-muted-foreground">Selamat Pagi</h2>
          <p className="text-lg font-semibold text-foreground">{displayName}</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-secondary dark:hover:bg-secondary/50 rounded-lg transition-colors">
            <Bell size={20} className="text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-secondary dark:hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                {displayName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{displayRole}</p>
              </div>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>

            {/* Dropdown Menu */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-card dark:bg-card rounded-lg shadow-lg border border-border dark:border-border/50 overflow-hidden transition-colors">
                <button className="w-full text-left px-4 py-2 hover:bg-secondary dark:hover:bg-secondary/50 text-foreground transition-colors">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-secondary dark:hover:bg-secondary/50 text-foreground transition-colors">
                  Pengaturan
                </button>
                <hr className="border-border dark:border-border/50" />
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-secondary dark:hover:bg-secondary/50 text-destructive font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
