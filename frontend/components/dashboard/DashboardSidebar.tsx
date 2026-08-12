'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/Badge';
import { Drawer } from '@/components/ui/Drawer';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = [
  { label: 'Overview', href: '/' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Rewards', href: '/rewards' },
  { label: 'Analytics', href: '/analytics' },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'flex w-full items-center justify-between rounded-2xl bg-[var(--primary-subtle)] px-4 py-3 text-sm font-semibold text-[var(--primary)] transition-colors'
          : 'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--text)]'
      }
    >
      <span>{label}</span>
      {active ? <Badge variant="primary">Active</Badge> : null}
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname() || '/';
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-soft)] lg:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-subtle)] text-sm font-bold text-[var(--primary)]">
            C
          </div>
          <div className="min-w-0">
            <p className="truncate text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">Credora</p>
            <p className="truncate text-sm font-semibold text-[var(--text)]">Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-elevated)]"
            aria-label="Open navigation menu"
          >
            Menu
          </button>
        </div>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Navigation">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <div key={item.href}>
              <NavLink href={item.href} label={item.label} active={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))} />
            </div>
          ))}
        </nav>
        <div className="mt-6 border-t border-[var(--border)] pt-6">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Profile</p>
            <p className="mt-3 text-sm font-semibold text-[var(--text)]">Demo user</p>
            <p className="text-sm text-[var(--text-secondary)]">demo@credora.app</p>
          </div>
          <ThemeToggle />
        </div>
      </Drawer>

      <aside className="hidden min-h-screen w-full shrink-0 flex-col rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] px-4 py-5 shadow-[var(--shadow-soft)] lg:flex">
        <div className="mb-8 flex items-center gap-3 px-1">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-subtle)] text-lg font-bold text-[var(--primary)]">
            C
          </div>
          <div className="min-w-0">
            <p className="truncate text-[10px] uppercase tracking-[0.28em] text-[var(--text-muted)]">Credora</p>
            <p className="truncate text-sm font-semibold text-[var(--text)]">Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
            />
          ))}
        </nav>

        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <div className="mb-4 px-1">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Profile</p>
            <p className="mt-3 text-sm font-semibold text-[var(--text)]">Demo user</p>
            <p className="text-sm text-[var(--text-secondary)]">demo@credora.app</p>
          </div>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
