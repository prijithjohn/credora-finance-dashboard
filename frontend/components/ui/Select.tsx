import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ className, label, error, id, children, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-') || undefined;

  return (
    <div className="w-full min-w-0">
      {label ? (
        <label htmlFor={selectId} className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={cn(
          'w-full min-w-0 appearance-none rounded-xl border bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] shadow-[0_1px_0_rgba(15,23,42,0.02)] outline-none transition-colors duration-150 focus:ring-2 focus:ring-[var(--primary-subtle)]',
          error
            ? 'border-[rgba(193,68,82,0.4)] focus:border-[var(--danger)]'
            : 'border-[var(--border)] focus:border-[var(--primary)]',
          className
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={`${selectId}-error`} className="mt-2 text-xs font-medium text-[var(--danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
