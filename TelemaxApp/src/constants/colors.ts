// Color palette for Telemax Pipes app
export const colors = {
  // Primary tobacco theme
  primary: {
    50: '#fdf8f6',
    100: '#f2e8e5',
    200: '#eaddd7',
    300: '#e0cec7',
    400: '#d2bab0',
    500: '#bfa094',
    600: '#a18072',
    700: '#8B4513', // Main tobacco brown
    800: '#846358',
    900: '#43302b',
  },
  
  // Secondary colors
  secondary: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Accent colors
  accent: {
    gold: '#D4AF37',
    brass: '#B5651D',
    copper: '#B87333',
    silver: '#C0C0C0',
  },
  
  // Semantic colors
  success: {
    light: '#dcfce7',
    DEFAULT: '#16a34a',
    dark: '#15803d',
  },
  
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },
  
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
  
  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },
  
  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Text colors
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    muted: '#9ca3af',
    inverse: '#ffffff',
  },
  
  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    muted: '#f3f4f6',
    dark: '#111827',
  },
  
  // Border colors
  border: {
    light: '#e5e7eb',
    DEFAULT: '#d1d5db',
    dark: '#9ca3af',
  },
} as const;

// Simplified color exports for easy access
export const COLORS = {
  PRIMARY: colors.primary[700],
  SECONDARY: colors.secondary[500],
  BACKGROUND: colors.background.primary,
  TEXT: colors.text.primary,
  MUTED: colors.text.secondary,
  ACCENT: colors.accent.gold,
  SUCCESS: colors.success.DEFAULT,
  WARNING: colors.warning.DEFAULT,
  ERROR: colors.error.DEFAULT,
  BORDER: colors.border.DEFAULT,
} as const;