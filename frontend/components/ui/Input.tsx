import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-') || undefined;

  return (
    <div className="w-full min-w-0">
      {label ? (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn(
          'w-full min-w-0 rounded-xl border bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] shadow-[0_1px_0_rgba(15,23,42,0.02)] outline-none transition-colors duration-150 placeholder:text-[var(--text-muted)]',
          error
            ? 'border-[rgba(193,68,82,0.4)] focus:border-[var(--danger)] focus:ring-2 focus:ring-[rgba(193,68,82,0.14)]'
            : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-subtle)]',
          className
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-2 text-xs font-medium text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
