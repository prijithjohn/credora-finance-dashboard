import type { ReactNode } from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
}

export function ErrorState({ title = 'Something went wrong', message, action }: ErrorStateProps) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center rounded-[var(--radius-xl)] border border-[rgba(193,68,82,0.18)] bg-[rgba(193,68,82,0.08)] px-5 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(193,68,82,0.18)] bg-[var(--surface)] text-lg font-semibold text-[var(--danger)]">
        !
      </div>
      <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
      {message ? <p className="mt-2 max-w-md text-sm text-[var(--danger)]">{message}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
