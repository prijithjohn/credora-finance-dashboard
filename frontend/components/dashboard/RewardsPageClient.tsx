'use client';

import { useEffect, useState } from 'react';

import { PageShell } from '@/components/dashboard/PageShell';
import { RewardsCatalog } from '@/components/dashboard/RewardsCatalog';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getRewards, getRewardBalance, redeemReward } from '@/lib/api';
import type { Reward } from '@/lib/api';

export function RewardsPageClient() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [rewardError, setRewardError] = useState<string>();
  const [redeemingRewardId, setRedeemingRewardId] = useState<number | undefined>(undefined);
  const [redemptionResult, setRedemptionResult] = useState<string>();
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [balanceError, setBalanceError] = useState<string>();
  const [redeemedRewardIds, setRedeemedRewardIds] = useState<number[]>([]);

  useEffect(() => {
    void loadRewards();
    void loadBalance();
  }, []);

  const loadRewards = async () => {
    setLoadingRewards(true);
    setRewardError(undefined);
    try {
      const result = await getRewards();
      setRewards(result);
    } catch (err) {
      setRewardError(err instanceof Error ? err.message : 'Unable to load rewards');
    } finally {
      setLoadingRewards(false);
    }
  };

  const loadBalance = async () => {
    setLoadingBalance(true);
    setBalanceError(undefined);
    try {
      const result = await getRewardBalance();
      setBalance(result.current_balance);
    } catch (err) {
      setBalanceError(err instanceof Error ? err.message : 'Unable to load balance');
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleRedeem = async (rewardId: number) => {
    if (redeemingRewardId !== undefined) {
      return;
    }

    setRedeemingRewardId(rewardId);
    setRedemptionResult(undefined);
    try {
      const response = await redeemReward(rewardId);
      setRedeemedRewardIds((current) => (current.includes(rewardId) ? current : [...current, rewardId]));
      setRedemptionResult(`Redeemed ${response.reward_name ?? 'reward'} for ${response.coins_spent ?? 0} coins.`);
      await Promise.all([loadRewards(), loadBalance()]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to redeem reward.';
      setRedemptionResult(message);
      if (message.toLowerCase().includes('already redeemed')) {
        setRedeemedRewardIds((current) => (current.includes(rewardId) ? current : [...current, rewardId]));
      }
    } finally {
      setRedeemingRewardId(undefined);
    }
  };

  return (
    <PageShell title="Rewards" description="Redeem your available reward coins for partner offers and incentives." eyebrow="REWARDS">
      <div className="space-y-6">
        <Card className="rounded-[var(--radius-xl)] border-[var(--border)]">
          <CardHeader className="p-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Balance</div>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">Current reward coins</h2>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loadingBalance ? (
              <div className="h-24 rounded-[1.75rem] bg-[var(--surface-elevated)] p-5" />
            ) : balanceError ? (
              <div className="rounded-[var(--radius-xl)] border border-[rgba(193,68,82,0.18)] bg-[rgba(193,68,82,0.08)] p-5 text-sm text-[var(--danger)]">
                {balanceError}
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 text-center">
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">Coin balance</p>
                <p className="mt-4 text-5xl font-semibold text-[var(--text)]">{balance?.toLocaleString() ?? '—'}</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Available to redeem reward offers.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <RewardsCatalog
          rewards={rewards}
          loading={loadingRewards}
          error={rewardError}
          onRetry={loadRewards}
          onRedeem={handleRedeem}
          redeemingRewardId={redeemingRewardId}
          balance={balance}
          redeemedRewardIds={redeemedRewardIds}
        />

        {redemptionResult ? (
          <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--text-secondary)]">
            {redemptionResult}
          </div>
        ) : null}

        <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--text-secondary)]">
          <p className="font-semibold text-[var(--text)]">Reward redemption notes</p>
          <p className="mt-2">Your balance updates immediately after successful redemption. If redemption fails due to insufficient balance or repeated redemption, you will see the actual backend response message.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" onClick={() => void loadBalance()} disabled={loadingBalance}>
            Refresh balance
          </Button>
          <Button type="button" variant="secondary" onClick={() => void loadRewards()} disabled={loadingRewards}>
            Refresh offers
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
