'use client';

import type { ReactNode } from 'react';

import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

interface PageShellProps {
  title: string;
  description: string;
  eyebrow?: string;
  children: ReactNode;
}

export function PageShell({ title, description, eyebrow, children }: PageShellProps) {
  const sectionLabel = eyebrow ?? title.toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5 lg:px-6">
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-6">
          <DashboardSidebar />

          <main className="min-w-0 space-y-6">
            <header className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">{sectionLabel}</p>
              <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-3xl">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
            </header>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
