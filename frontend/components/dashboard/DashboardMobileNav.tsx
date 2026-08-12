'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mobileNavItems = [
  { label: 'Overview', href: '/' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Rewards', href: '/rewards' },
  { label: 'Analytics', href: '/analytics' }
];

export function DashboardMobileNav() {
  const pathname = usePathname() || '/';

  return (
    <nav className="lg:hidden">
      <div className="scrollbar-hidden flex gap-2 overflow-x-auto pb-2">
        {mobileNavItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex min-w-[105px] items-center justify-center rounded-2xl border px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? 'border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text)]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
