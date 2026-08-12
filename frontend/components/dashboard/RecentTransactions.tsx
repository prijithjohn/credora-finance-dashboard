import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Transaction } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading: boolean;
  error?: string;
  onRetry: () => void;
}

const statusVariant = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === 'success') return 'success';
  if (normalized === 'failed' || normalized === 'failed') return 'danger';
  if (normalized === 'pending') return 'warning';
  return 'neutral';
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value));
}

export function RecentTransactions({ transactions, loading, error, onRetry }: RecentTransactionsProps) {
  return (
    <Card className="rounded-[var(--radius-xl)] border-[var(--border)]">
      <CardHeader className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Recent activity</div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">Recent transactions</h2>
        </div>
        <Link href="/transactions" className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-elevated)]">
          View all transactions
        </Link>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                <Skeleton rows={2} />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Unable to load transactions" message={error} action={<Button variant="secondary" size="sm" onClick={onRetry}>Retry</Button>} />
        ) : transactions.length === 0 ? (
          <EmptyState title="No recent transactions" description="There are no transactions available to display right now." />
        ) : (
          <div className="overflow-hidden rounded-[1.75rem] border border-[var(--border)]">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="bg-[var(--surface-elevated)] text-left text-[var(--text-secondary)]">
                    <th className="px-4 py-4 font-medium">Merchant</th>
                    <th className="px-4 py-4 font-medium">Category</th>
                    <th className="px-4 py-4 font-medium">Date</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-[var(--border)] last:border-b-0">
                      <td className="px-4 py-4 text-[var(--text)]">{transaction.merchant || 'Unknown'}</td>
                      <td className="px-4 py-4 text-[var(--text-secondary)]">{transaction.category || 'Other'}</td>
                      <td className="px-4 py-4 text-[var(--text-secondary)]">{formatDate(transaction.transaction_date)}</td>
                      <td className="px-4 py-4">
                        <Badge variant={statusVariant(transaction.status)}>{transaction.status}</Badge>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-[var(--text)]">{formatCurrency(Number(transaction.amount), 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
