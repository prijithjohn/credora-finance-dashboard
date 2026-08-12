'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('credora-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : prefersDark ? 'dark' : 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const handleThemeChange = (nextTheme: 'light' | 'dark') => {
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.localStorage.setItem('credora-theme', nextTheme);
  };

  return (
    <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[0_1px_0_rgba(17,24,39,0.02)]">
      <button
        type="button"
        aria-label="Switch to light mode"
        onClick={() => handleThemeChange('light')}
        className={cn(
          'rounded-full px-3 py-2 text-xs font-medium transition-colors',
          theme === 'light'
            ? 'bg-[var(--bg)] text-[var(--text)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
        )}
      >
        Light
      </button>
      <button
        type="button"
        aria-label="Switch to dark mode"
        onClick={() => handleThemeChange('dark')}
        className={cn(
          'rounded-full px-3 py-2 text-xs font-medium transition-colors',
          theme === 'dark'
            ? 'bg-[var(--bg)] text-[var(--text)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
        )}
      >
        Dark
      </button>
    </div>
  );
}
