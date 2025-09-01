export const theme = {
  colors: {
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
    accent: {
      gold: '#c9a36a',
      lightGold: '#d4b173',
      darkGold: '#b8915b',
    },
    background: {
      primary: '#1a120b',
      secondary: '#2a1d13',
      card: '#201b17',
      overlay: 'rgba(26, 18, 11, 0.95)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d6d3d1',
      muted: '#a8a29e',
      accent: '#c9a36a',
    },
    border: {
      primary: 'rgba(201, 163, 106, 0.2)',
      secondary: 'rgba(201, 163, 106, 0.1)',
    },
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  gradients: {
    primary: ['#c9a36a', '#d4b173'],
    background: ['#1a120b', '#2a1d13'],
    card: ['rgba(26, 18, 11, 0.95)', 'rgba(42, 29, 19, 0.95)'],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    serif: 'serif',
  },
} as const;
