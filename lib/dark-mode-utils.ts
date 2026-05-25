// Dark mode utilities untuk konsistensi styling

export const darkModeClasses = {
  // Container backgrounds
  pageBg: 'bg-background dark:bg-background',
  cardBg: 'bg-card dark:bg-card',
  secondaryBg: 'bg-secondary dark:bg-secondary/50',
  sidebarBg: 'bg-sidebar dark:bg-sidebar',
  
  // Text colors
  textPrimary: 'text-foreground dark:text-foreground',
  textSecondary: 'text-muted-foreground dark:text-muted-foreground',
  textCard: 'text-card-foreground dark:text-card-foreground',
  
  // Borders
  border: 'border border-border dark:border-border/50',
  borderTop: 'border-t border-border dark:border-border/50',
  borderBottom: 'border-b border-border dark:border-border/50',
  divider: 'divide-border dark:divide-border/50',
  
  // Hover states
  hoverSecondary: 'hover:bg-secondary dark:hover:bg-secondary/50',
  hoverCard: 'hover:bg-card dark:hover:bg-card',
  
  // Buttons
  primaryBtn: 'bg-primary hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground',
  secondaryBtn: 'bg-secondary dark:bg-secondary/50 hover:bg-secondary/80 dark:hover:bg-secondary/60 text-secondary-foreground dark:text-secondary-foreground',
  ghostBtn: 'hover:bg-secondary dark:hover:bg-secondary/50 text-foreground dark:text-foreground',
  
  // Tables
  tableHeader: 'bg-secondary dark:bg-secondary/50 border-b border-border dark:border-border/50',
  tableRow: 'hover:bg-secondary dark:hover:bg-secondary/50 border-b border-border dark:border-border/50',
  
  // Status badges
  badgeSuccess: 'bg-accent/10 dark:bg-accent/20 text-accent dark:text-accent',
  badgeInfo: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  badgeWarning: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  badgeDanger: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  
  // Form inputs
  input: 'bg-background dark:bg-background border border-border dark:border-border/50 text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:ring-2 focus:ring-primary dark:focus:ring-primary',
  select: 'bg-background dark:bg-background border border-border dark:border-border/50 text-foreground dark:text-foreground focus:ring-2 focus:ring-primary dark:focus:ring-primary',
  
  // Transitions
  transition: 'transition-colors duration-200',
};

// Kombinasi class untuk common components
export const darkModeComponentClasses = {
  card: `${darkModeClasses.cardBg} ${darkModeClasses.border} rounded-lg shadow-sm`,
  
  section: `${darkModeClasses.cardBg} ${darkModeClasses.border} rounded-lg overflow-hidden`,
  
  header: `${darkModeClasses.cardBg} ${darkModeClasses.borderBottom} sticky top-0 z-20`,
  
  input: `w-full ${darkModeClasses.input} rounded-lg px-4 py-2.5 text-sm`,
  
  button: `px-4 py-2.5 rounded-lg font-medium ${darkModeClasses.transition} focus:outline-none focus:ring-2 focus:ring-offset-2`,
  
  primaryButton: `${darkModeClasses.primaryBtn} ${darkModeClasses.transition}`,
  
  secondaryButton: `${darkModeClasses.secondaryBtn} ${darkModeClasses.transition}`,
  
  ghostButton: `${darkModeClasses.ghostBtn} ${darkModeClasses.transition}`,
  
  table: `w-full text-sm`,
  tableHead: `${darkModeClasses.tableHeader}`,
  tableBody: `divide-y ${darkModeClasses.divider}`,
  tableRow: `${darkModeClasses.tableRow} ${darkModeClasses.transition}`,
  
  modal: `${darkModeClasses.cardBg} rounded-lg shadow-xl ${darkModeClasses.border}`,
  
  alert: `p-4 rounded-lg ${darkModeClasses.border} ${darkModeClasses.transition}`,
};

// Color utilities untuk status dan badges
export const statusColors = {
  hadir: darkModeClasses.badgeSuccess,
  izin: darkModeClasses.badgeInfo,
  sakit: darkModeClasses.badgeWarning,
  libur: darkModeClasses.badgeInfo,
  pending: darkModeClasses.badgeWarning,
  approved: darkModeClasses.badgeSuccess,
  rejected: darkModeClasses.badgeDanger,
  belum_absen: darkModeClasses.badgeDanger,
};

export function getStatusColor(status: string): string {
  return statusColors[status as keyof typeof statusColors] || darkModeClasses.badgeInfo;
}
