'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import type { Transaction } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

interface AnalyticsSummaryProps {
  transactions: Transaction[];
  loading: boolean;
}

export function AnalyticsSummary({ transactions, loading }: AnalyticsSummaryProps) {
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, item) => sum + Number(item.amount), 0);
  const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
  const successRate = transactions.length
    ? Math.round((transactions.filter((item) => item.status.toLowerCase() === 'success').length / transactions.length) * 100)
    : 0;

  return (
    <Card className="rounded-[var(--radius-xl)] border-[var(--border)]">
      <CardHeader className="p-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Analytics</div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">Transaction insights</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-16 rounded-[1.5rem] bg-[var(--surface-elevated)]" />
            <div className="h-16 rounded-[1.5rem] bg-[var(--surface-elevated)]" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
              <p className="text-sm text-[var(--text-secondary)]">Transaction volume</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{totalTransactions}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
              <p className="text-sm text-[var(--text-secondary)]">Total amount</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
              <p className="text-sm text-[var(--text-secondary)]">Success rate</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{successRate}%</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
