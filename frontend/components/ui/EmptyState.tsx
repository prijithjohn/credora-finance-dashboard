import type { ReactNode } from 'react';

import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-lg text-[var(--text-secondary)]">
        •
      </div>
      <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
