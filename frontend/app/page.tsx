'use client';

import { PageShell } from '@/components/dashboard/PageShell';
import { Card } from '@/components/ui/Card';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { RewardsSummary } from '@/components/dashboard/RewardsSummary';
import { SpendingOverview } from '@/components/dashboard/SpendingOverview';
import { useDashboardData } from '@/components/dashboard/useDashboardData';
import { formatCurrency } from '@/lib/format';

const fallbackCategories = [
  { label: 'Groceries', value: 28, tone: 'bg-[var(--primary)]' },
  { label: 'Shopping', value: 22, tone: 'bg-[var(--success)]' },
  { label: 'Food', value: 18, tone: 'bg-[rgba(99,198,155,0.16)]' },
  { label: 'Transportation', value: 12, tone: 'bg-[var(--text-muted)]' },
  { label: 'Bills', value: 12, tone: 'bg-[var(--border)]' },
  { label: 'Other', value: 8, tone: 'bg-[var(--surface-elevated)]' },
];

export default function HomePage() {
  const {
    transactions,
    rewardSummary,
    loadingTransactions,
    loadingRewards,
    errorTransactions,
    errorRewards,
    loadTransactions,
    loadRewards,
    recentSpend,
  } = useDashboardData();

  const categoryData = transactions?.items.length
    ? Object.entries(
        transactions.items.reduce<Record<string, number>>((acc, item) => {
          const category = item.category || 'Other';
          acc[category] = (acc[category] ?? 0) + 1;
          return acc;
        }, {})
      )
        .sort(([, a], [, b]) => b - a)
        .map(([label, value], index) => ({
          label,
          value,
          tone:
            index === 0
              ? 'bg-[var(--primary)]'
              : index === 1
              ? 'bg-[var(--success)]'
              : index === 2
              ? 'bg-[rgba(99,198,155,0.16)]'
              : index === 3
              ? 'bg-[var(--text-muted)]'
              : index === 4
              ? 'bg-[var(--border)]'
              : 'bg-[var(--surface-elevated)]',
        }))
    : fallbackCategories;

  const metrics = [
    {
      label: 'Total balance',
      value: '—',
      detail: 'Balance is not exposed by the API yet',
      tone: 'bg-[rgba(99,198,155,0.12)] text-[var(--text)]',
    },
    {
      label: 'Total spent',
      value: formatCurrency(recentSpend),
      detail: 'Based on the latest transactions',
      tone: 'bg-[rgba(31,143,107,0.12)] text-[var(--success)]',
    },
    {
      label: 'Transactions',
      value: transactions?.total.toLocaleString() ?? '—',
      detail: 'Total items loaded from API',
      tone: 'bg-[rgba(99,198,155,0.08)] text-[var(--text)]',
    },
    {
      label: 'Reward coins',
      value: rewardSummary?.current_balance.toLocaleString() ?? '—',
      detail: 'Available in rewards marketplace',
      tone: 'bg-[rgba(31,143,107,0.12)] text-[var(--success)]',
    },
  ];

  return (
    <PageShell title="Overview" description="Your latest activity, balances, and rewards are presented here with focus and clarity." eyebrow="Overview">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="rounded-[var(--radius-xl)] border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{metric.label}</p>
                <p className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-3xl">{metric.value}</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] text-lg font-semibold text-[var(--text)]">
                •
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">{metric.detail}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_0.95fr]">
        <SpendingOverview transactions={transactions?.items ?? []} loading={loadingTransactions} />
        <CategoryBreakdown categories={categoryData} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_0.95fr]">
        <RecentTransactions
          transactions={transactions?.items ?? []}
          loading={loadingTransactions}
          error={errorTransactions}
          onRetry={loadTransactions}
        />
        <RewardsSummary
          balance={rewardSummary?.current_balance}
          loading={loadingRewards}
          error={errorRewards}
          onRetry={loadRewards}
        />
      </section>
    </PageShell>
  );
}
