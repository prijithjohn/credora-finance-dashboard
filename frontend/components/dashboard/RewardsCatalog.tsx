'use client';

import { useMemo } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Reward } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

interface RewardsCatalogProps {
  rewards: Reward[];
  loading: boolean;
  error?: string;
  onRetry: () => void;
  onRedeem: (rewardId: number) => void;
  redeemingRewardId?: number;
  balance: number | null;
  redeemedRewardIds: number[];
}

export function RewardsCatalog({ rewards, loading, error, onRetry, onRedeem, redeemingRewardId, balance, redeemedRewardIds }: RewardsCatalogProps) {
  const sortedRewards = useMemo(
    () => [...rewards].sort((a, b) => a.coin_cost - b.coin_cost),
    [rewards]
  );

  return (
    <Card className="rounded-[var(--radius-xl)] border-[var(--border)]">
      <CardHeader className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Rewards</div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">Rewards marketplace</h2>
        </div>
        <Badge variant="primary">Partner offers</Badge>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                <Skeleton rows={4} />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Unable to load rewards" message={error} action={<button type="button" className="mt-4 inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-elevated)]" onClick={onRetry}>Retry</button>} />
        ) : rewards.length === 0 ? (
          <EmptyState title="No rewards available" description="Active rewards will appear here when available." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sortedRewards.map((reward) => {
              const isRedeemed = redeemedRewardIds.includes(reward.id);
              const affordable = (balance ?? 0) >= reward.coin_cost;
              const actionLabel = isRedeemed ? 'Redeemed' : affordable ? 'Redeem' : 'Insufficient coins';

              return (
                <div key={reward.id} className="flex min-w-0 flex-col justify-between gap-4 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 space-y-2">
                        <h3 className="text-lg font-semibold text-[var(--text)]">{reward.name}</h3>
                        <p className="text-sm leading-6 text-[var(--text-secondary)]">{reward.description || 'Redeem your coins for a partner reward.'}</p>
                      </div>
                      <Badge variant={isRedeemed ? 'neutral' : 'success'}>{reward.coin_cost} coins</Badge>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                      <span>Cost</span>
                      <span className="font-semibold text-[var(--text)]">{reward.coin_cost} coins</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      loading={redeemingRewardId === reward.id}
                      disabled={isRedeemed || !affordable || redeemingRewardId === reward.id}
                      variant={isRedeemed ? 'secondary' : 'primary'}
                      onClick={() => onRedeem(reward.id)}
                    >
                      {actionLabel}
                    </Button>
                    <span className="text-sm text-[var(--text-secondary)]">
                      {isRedeemed ? 'Already redeemed' : affordable ? 'Available now' : 'Balance too low'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
