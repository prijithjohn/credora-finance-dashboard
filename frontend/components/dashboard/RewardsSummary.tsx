import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';

interface RewardsSummaryProps {
  balance?: number;
  loading: boolean;
  error?: string;
  onRetry: () => void;
}

export function RewardsSummary({ balance, loading, error, onRetry }: RewardsSummaryProps) {
  return (
    <Card className="rounded-[var(--radius-xl)] border-[var(--border)]">
      <CardHeader className="p-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Rewards</div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">Reward summary</h2>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <Skeleton rows={4} />
        ) : error ? (
          <ErrorState
            title="Unable to load rewards"
            message={error}
            action={<Button variant="secondary" size="sm" onClick={onRetry}>Retry</Button>}
          />
        ) : balance === undefined ? (
          <EmptyState title="No rewards available" description="The reward balance endpoint did not return data." />
        ) : (
          <div className="space-y-6">
            <div className="rounded-[1.75rem] bg-[var(--surface-elevated)] px-6 py-8 text-center">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">Coin balance</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--text)]">{balance.toLocaleString()}</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">Available for redemption in the rewards marketplace.</p>
            </div>
            <div className="space-y-3 text-sm text-[var(--text-secondary)]">
              <p className="font-medium text-[var(--text)]">Keep your balance active</p>
              <p>Use reward coins to unlock premium partner offers and curated incentives.</p>
            </div>
            <Link href="/rewards" className="inline-flex w-full justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-elevated)]">
              View rewards
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
