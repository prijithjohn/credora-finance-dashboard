'use client';

import { useMemo } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Transaction } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

interface TransactionsTableProps {
  transactions: Transaction[];
  loading: boolean;
  error?: string;
  onRetry: () => void;
}

const statusVariant = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === 'success') return 'success';
  if (normalized === 'failed') return 'danger';
  if (normalized === 'pending') return 'warning';
  return 'neutral';
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export function TransactionsTable({ transactions, loading, error, onRetry }: TransactionsTableProps) {
  const totalAmount = useMemo(
    () => transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0),
    [transactions]
  );

  return (
    <Card className="rounded-[var(--radius-xl)] border-[var(--border)]">
      <CardHeader className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Transactions</div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">Transaction history</h2>
        </div>
        <div className="text-sm text-[var(--text-secondary)]">Total loaded: {transactions.length}</div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                <Skeleton rows={3} />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Unable to load transactions" message={error} action={<button type="button" className="mt-4 inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-elevated)]" onClick={onRetry}>Retry</button>} />
        ) : transactions.length === 0 ? (
          <EmptyState title="No transactions found" description="Try changing the filter criteria to load additional results." />
        ) : (
          <div className="overflow-hidden rounded-[1.75rem] border border-[var(--border)]">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="bg-[var(--surface-elevated)] text-left text-[var(--text-secondary)]">
                    <th className="px-4 py-4 font-medium">Date</th>
                    <th className="px-4 py-4 font-medium">Merchant</th>
                    <th className="px-4 py-4 font-medium">Category</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-[var(--border)] last:border-b-0">
                      <td className="px-4 py-4 text-[var(--text-secondary)]">{formatDate(transaction.transaction_date)}</td>
                      <td className="px-4 py-4 text-[var(--text)]">{transaction.merchant || 'Unknown'}</td>
                      <td className="px-4 py-4 text-[var(--text-secondary)]">{transaction.category || 'Other'}</td>
                      <td className="px-4 py-4">
                        <Badge variant={statusVariant(transaction.status)}>{transaction.status}</Badge>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-[var(--text)]">
                        {formatCurrency(Number(transaction.amount), 2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-4 text-sm text-[var(--text-secondary)]">
              Total amount shown: {formatCurrency(totalAmount, 2)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
