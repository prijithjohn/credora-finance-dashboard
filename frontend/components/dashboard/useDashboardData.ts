'use client';

import { useEffect, useMemo, useState } from 'react';

import { getDashboardTransactions, getRewardBalance, RewardSummary, TransactionListResponse } from '@/lib/api';

interface DashboardState {
  transactions: TransactionListResponse | null;
  rewardSummary: RewardSummary | null;
  loadingTransactions: boolean;
  loadingRewards: boolean;
  errorTransactions?: string;
  errorRewards?: string;
}

export function useDashboardData() {
  const [transactions, setTransactions] = useState<TransactionListResponse | null>(null);
  const [rewardSummary, setRewardSummary] = useState<RewardSummary | null>(null);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [errorTransactions, setErrorTransactions] = useState<string>();
  const [errorRewards, setErrorRewards] = useState<string>();

  const loadTransactions = async () => {
    setLoadingTransactions(true);
    setErrorTransactions(undefined);

    try {
      const payload = await getDashboardTransactions();
      setTransactions(payload);
    } catch (error) {
      setErrorTransactions(error instanceof Error ? error.message : 'Unable to load transactions');
    } finally {
      setLoadingTransactions(false);
    }
  };

  const loadRewards = async () => {
    setLoadingRewards(true);
    setErrorRewards(undefined);

    try {
      const payload = await getRewardBalance();
      setRewardSummary(payload);
    } catch (error) {
      setErrorRewards(error instanceof Error ? error.message : 'Unable to load rewards');
    } finally {
      setLoadingRewards(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    loadRewards();
  }, []);

  const recentSpend = useMemo(() => {
    if (!transactions || transactions.items.length === 0) return 0;
    return transactions.items.reduce((sum, item) => sum + Number(item.amount), 0);
  }, [transactions]);

  return {
    transactions,
    rewardSummary,
    loadingTransactions,
    loadingRewards,
    errorTransactions,
    errorRewards,
    loadTransactions,
    loadRewards,
    recentSpend
  } as const;
}
