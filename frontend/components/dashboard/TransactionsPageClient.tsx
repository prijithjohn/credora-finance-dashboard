'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { PageShell } from '@/components/dashboard/PageShell';
import { TransactionsFilters } from '@/components/dashboard/TransactionsFilters';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { AnalyticsSummary } from '@/components/dashboard/AnalyticsSummary';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { RewardsCatalog } from '@/components/dashboard/RewardsCatalog';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Reward, Transaction, TransactionListResponse } from '@/lib/api';
import { getTransactions, getTransactionDetail, getRewards, redeemReward } from '@/lib/api';

type TransactionQueryState = {
  page: number;
  page_size: number;
  merchant: string;
  category: string;
  status: string;
  start_date: string;
  end_date: string;
  min_amount: string;
  max_amount: string;
  sort_by: 'date' | 'amount';
  sort_order: 'asc' | 'desc';
};

const initialQueryState: TransactionQueryState = {
  page: 1,
  page_size: 20,
  merchant: '',
  category: '',
  status: '',
  start_date: '',
  end_date: '',
  min_amount: '',
  max_amount: '',
  sort_by: 'date',
  sort_order: 'desc',
};

export function TransactionsPageClient() {
  const [query, setQuery] = useState<TransactionQueryState>(initialQueryState);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionResponse, setTransactionResponse] = useState<TransactionListResponse | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [error, setError] = useState<string>();
  const [rewardError, setRewardError] = useState<string>();
  const [redeemingRewardId, setRedeemingRewardId] = useState<number | undefined>(undefined);
  const [redemptionResult, setRedemptionResult] = useState<string>();
  const [balance, setBalance] = useState<number | null>(null);
  const [redeemedRewardIds, setRedeemedRewardIds] = useState<number[]>([]);
  const hasMountedRef = useRef(false);

  const loadTransactions = useCallback(async (page = 1) => {
    setLoading(true);
    setError(undefined);
    try {
      const response = await getTransactions({
        page,
        page_size: query.page_size,
        merchant: query.merchant || undefined,
        category: query.category || undefined,
        status: query.status || undefined,
        start_date: query.start_date || undefined,
        end_date: query.end_date || undefined,
        min_amount: query.min_amount ? Number(query.min_amount) : undefined,
        max_amount: query.max_amount ? Number(query.max_amount) : undefined,
        sort_by: query.sort_by,
        sort_order: query.sort_order,
      });
      setTransactionResponse(response);
      setTransactions(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load transactions');
    } finally {
      setLoading(false);
    }
  }, [
    query.page_size,
    query.merchant,
    query.category,
    query.status,
    query.start_date,
    query.end_date,
    query.min_amount,
    query.max_amount,
    query.sort_by,
    query.sort_order,
  ]);

  const loadRewards = useCallback(async () => {
    setLoadingRewards(true);
    setRewardError(undefined);
    try {
      const response = await getRewards();
      setRewards(response);
    } catch (err) {
      setRewardError(err instanceof Error ? err.message : 'Unable to load rewards');
    } finally {
      setLoadingRewards(false);
    }
  }, []);

  const loadBalance = useCallback(async () => {
    try {
      const response = await fetch('/api/rewards/balance', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const payload = await response.json() as { current_balance?: number };
      setBalance(payload.current_balance ?? null);
    } catch (err) {
      setBalance(null);
    }
  }, []);

  useEffect(() => {
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;

    void loadTransactions(1);
    void loadRewards();
    void loadBalance();
  }, [loadTransactions, loadRewards, loadBalance]);

  const handleRedeem = async (rewardId: number) => {
    if (redeemingRewardId !== undefined) {
      return;
    }

    setRedeemingRewardId(rewardId);
    setRedemptionResult(undefined);
    try {
      const response = await redeemReward(rewardId);
      setRedemptionResult(response.success ? `Redeemed ${response.reward_name} for ${response.coins_spent} coins.` : response.message || 'Reward redemption failed.');
      setRedeemedRewardIds((current) => (current.includes(rewardId) ? current : [...current, rewardId]));
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

  const applyFilters = () => {
    void loadTransactions(1);
  };

  const resetFilters = () => {
    setQuery(initialQueryState);
    void loadTransactions(1);
  };

  const pageNumber = transactionResponse?.page ?? 1;
  const totalPages = transactionResponse?.total_pages ?? 1;

  return (
    <PageShell title="Transactions" description="Browse your complete transaction history with filters and insights.">
      <div className="space-y-6">
        <TransactionsFilters
          merchant={query.merchant}
          category={query.category}
          status={query.status}
          startDate={query.start_date}
          endDate={query.end_date}
          minAmount={query.min_amount}
          maxAmount={query.max_amount}
          sortBy={query.sort_by}
          sortOrder={query.sort_order}
          onMerchantChange={(value) => setQuery((current) => ({ ...current, merchant: value }))}
          onCategoryChange={(value) => setQuery((current) => ({ ...current, category: value }))}
          onStatusChange={(value) => setQuery((current) => ({ ...current, status: value }))}
          onStartDateChange={(value) => setQuery((current) => ({ ...current, start_date: value }))}
          onEndDateChange={(value) => setQuery((current) => ({ ...current, end_date: value }))}
          onMinAmountChange={(value) => setQuery((current) => ({ ...current, min_amount: value }))}
          onMaxAmountChange={(value) => setQuery((current) => ({ ...current, max_amount: value }))}
          onSortByChange={(value) => setQuery((current) => ({ ...current, sort_by: value }))}
          onSortOrderChange={(value) => setQuery((current) => ({ ...current, sort_order: value }))}
          onApply={applyFilters}
          onReset={resetFilters}
          loading={loading}
        />

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
          <TransactionsTable transactions={transactions} loading={loading} error={error} onRetry={() => void loadTransactions(pageNumber)} />

          <div className="space-y-6">
            <AnalyticsSummary transactions={transactions} loading={loading} />
            <AnalyticsChart transactions={transactions} loading={loading} />
          </div>
        </div>

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

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--text-secondary)]">
          <div>{transactionResponse ? `${transactionResponse.total.toLocaleString()} results available` : 'Use filters to query transactions'}</div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={() => void loadTransactions(Math.max(1, pageNumber - 1))} disabled={pageNumber <= 1 || loading}>
              Previous
            </Button>
            <span>Page {pageNumber} of {totalPages}</span>
            <Button type="button" onClick={() => void loadTransactions(Math.min(totalPages, pageNumber + 1))} disabled={pageNumber >= totalPages || loading}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
