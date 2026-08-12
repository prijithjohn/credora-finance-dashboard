'use client';

import { PageShell } from '@/components/dashboard/PageShell';
import { AnalyticsSummary } from '@/components/dashboard/AnalyticsSummary';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { useEffect, useState } from 'react';
import { getTransactions } from '@/lib/api';
import type { Transaction } from '@/lib/api';

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const result = await getTransactions({ page_size: 20, sort_by: 'date', sort_order: 'desc' });
        setTransactions(result.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <PageShell
      title="Analytics"
      description="View transaction trends, spend distribution, and performance across your account."
    >
      <div className="space-y-6">
        {error ? (
          <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
            <AnalyticsSummary transactions={transactions} loading={loading} />
            <AnalyticsChart transactions={transactions} loading={loading} />
          </div>
        )}
      </div>
    </PageShell>
  );
}
