/**
 * Mobile optimization utilities for responsive design
 */

export const mobileBreakpoints = {
  xs: 320,
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/**
 * Get responsive grid columns for mobile-first design
 */
export const getResponsiveGridCols = (baseLayout: 'single' | 'double' | 'triple' = 'double') => {
  const layouts = {
    single: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
    double: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2',
    triple: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  };
  return layouts[baseLayout];
};

/**
 * Get responsive padding for different screen sizes
 */
export const getResponsivePadding = (base: 'sm' | 'md' | 'lg' = 'md') => {
  const paddings = {
    sm: 'p-2 sm:p-3 md:p-4',
    md: 'p-3 sm:p-4 md:p-6',
    lg: 'p-4 sm:p-6 md:p-8',
  };
  return paddings[base];
};

/**
 * Mobile safe area for notch devices
 */
export const mobileSafeArea = {
  top: 'pt-safe',
  bottom: 'pb-safe',
  horizontal: 'px-safe',
  full: 'inset-safe',
};

/**
 * Check if viewport is mobile
 */
export const isMobileViewport = (width?: number): boolean => {
  if (typeof window === 'undefined' && !width) return false;
  const screenWidth = width || window.innerWidth;
  return screenWidth < mobileBreakpoints.md;
};

/**
 * Get responsive font size
 */
export const getResponsiveFontSize = (size: 'sm' | 'base' | 'lg' | 'xl' | '2xl' = 'base') => {
  const sizes = {
    sm: 'text-xs sm:text-sm md:text-sm',
    base: 'text-sm sm:text-base md:text-base',
    lg: 'text-base sm:text-lg md:text-lg',
    xl: 'text-lg sm:text-xl md:text-xl',
    '2xl': 'text-xl sm:text-2xl md:text-2xl',
  };
  return sizes[size];
};

/**
 * Get responsive gap for flex/grid
 */
export const getResponsiveGap = (base: 'sm' | 'md' | 'lg' = 'md') => {
  const gaps = {
    sm: 'gap-2 sm:gap-3 md:gap-4',
    md: 'gap-3 sm:gap-4 md:gap-6',
    lg: 'gap-4 sm:gap-6 md:gap-8',
  };
  return gaps[base];
};
