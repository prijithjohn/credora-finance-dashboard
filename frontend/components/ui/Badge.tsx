import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'neutral' | 'danger';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'border border-[var(--primary-subtle)] bg-[var(--primary-subtle)] text-[var(--primary)]',
  success: 'border border-[rgba(31,143,107,0.18)] bg-[rgba(31,143,107,0.12)] text-[var(--success)]',
  warning: 'border border-[rgba(183,109,29,0.16)] bg-[rgba(183,109,29,0.12)] text-[var(--warning)]',
  neutral: 'border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]',
  danger: 'border border-[rgba(193,68,82,0.16)] bg-[rgba(193,68,82,0.1)] text-[var(--danger)]'
};

export function Badge({ children, className, variant = 'primary', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
