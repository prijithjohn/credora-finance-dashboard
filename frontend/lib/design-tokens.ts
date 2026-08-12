export const designTokens = {
  colors: {
    background: '#f5f7fb',
    foreground: '#0f172a',
    foregroundMuted: '#475569',
    surface: '#ffffff',
    surfaceMuted: '#f8fafc',
    border: '#dfe7f1',
    primary: {
      50: '#edf4ff',
      100: '#dfeeff',
      500: '#1d5bd6',
      600: '#184db5',
      700: '#133f8d'
    },
    success: {
      50: '#ecfdf5',
      500: '#12a56b'
    },
    warning: {
      50: '#fff8eb',
      500: '#d97706'
    },
    danger: {
      50: '#fff1f2',
      500: '#e11d48'
    },
    neutral: {
      100: '#e2e8f0',
      200: '#cbd5e1',
      300: '#94a3b8'
    }
  },
  typography: {
    display: 'clamp(2rem, 4vw, 3rem)',
    h1: 'clamp(1.75rem, 2.5vw, 2.5rem)',
    h2: 'clamp(1.3rem, 2vw, 1.75rem)',
    body: '0.95rem',
    bodySm: '0.8rem',
    label: '0.75rem',
    tracking: '0.14em'
  },
  spacing: {
    xxs: '0.25rem',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  radii: {
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem'
  },
  shadows: {
    sm: '0 8px 20px rgba(15, 23, 42, 0.05)',
    md: '0 12px 30px rgba(15, 23, 42, 0.08)',
    lg: '0 18px 42px rgba(15, 23, 42, 0.12)'
  },
  transitions: {
    base: '150ms ease',
    fast: '120ms ease',
    slow: '220ms ease'
  }
} as const;
