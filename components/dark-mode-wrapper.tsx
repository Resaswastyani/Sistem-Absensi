'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface DarkModeWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component untuk ensure dark mode stability
 * Handles hydration dan theme initialization
 */
export function DarkModeWrapper({ children, className = '' }: DarkModeWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div className={`${className} bg-background text-foreground transition-colors duration-200`}>
      {children}
    </div>
  );
}

/**
 * Card wrapper dengan dark mode support
 */
export function DarkCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-card dark:bg-card border border-border dark:border-border/50 rounded-lg p-6 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all ${className}`}>
      {children}
    </div>
  );
}

/**
 * Button wrapper dengan dark mode support
 */
export function DarkButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    secondary:
      'bg-secondary dark:bg-secondary/50 hover:bg-secondary/80 dark:hover:bg-secondary/60 text-secondary-foreground',
    ghost: 'hover:bg-secondary dark:hover:bg-secondary/50 text-foreground',
    danger: 'bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400',
  };

  return (
    <button
      className={`px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Table wrapper dengan dark mode support
 */
export function DarkTable({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

/**
 * Table header dengan dark mode support
 */
export function DarkTableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <thead className="bg-secondary dark:bg-secondary/50 border-b border-border dark:border-border/50">
      {children}
    </thead>
  );
}

/**
 * Table body dengan dark mode support
 */
export function DarkTableBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <tbody className="divide-y divide-border dark:divide-border/50">{children}</tbody>
  );
}

/**
 * Table row dengan dark mode support
 */
export function DarkTableRow({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={`hover:bg-secondary dark:hover:bg-secondary/50 transition-colors ${className}`}>
      {children}
    </tr>
  );
}

/**
 * Input field dengan dark mode support
 */
export function DarkInput({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-4 py-2.5 rounded-lg border border-border dark:border-border/50 bg-background dark:bg-background text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-transparent transition-colors ${className}`}
      {...props}
    />
  );
}

/**
 * Select field dengan dark mode support
 */
export function DarkSelect({
  children,
  className = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`px-4 py-2.5 rounded-lg border border-border dark:border-border/50 bg-background dark:bg-background text-foreground dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:border-transparent transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

/**
 * Status badge dengan dark mode support
 */
export function DarkBadge({
  children,
  status = 'default',
  className = '',
}: {
  children: React.ReactNode;
  status?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}) {
  const statusClasses = {
    success: 'bg-accent/10 dark:bg-accent/20 text-accent dark:text-accent',
    warning:
      'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    default: 'bg-secondary dark:bg-secondary/50 text-foreground dark:text-foreground',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold inline-block transition-colors ${statusClasses[status]} ${className}`}
    >
      {children}
    </span>
  );
}
