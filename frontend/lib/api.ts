export interface Transaction {
  id: number;
  merchant: string | null;
  category: string | null;
  status: string;
  amount: string;
  currency: string;
  transaction_date: string;
  payment_method?: string | null;
  description?: string | null;
  source_id?: string;
  source_name?: string | null;
}

export interface TransactionListResponse {
  items: Transaction[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface RewardSummary {
  current_balance: number;
}

export interface Reward {
  id: number;
  name: string;
  description?: string | null;
  coin_cost: number;
  active: boolean;
  image_url?: string | null;
}

export interface RewardRedemptionResponse {
  success: boolean;
  message: string;
  reward_id?: number;
  reward_name?: string;
  user_id?: number;
  redemption_id?: number;
  coins_spent?: number;
  remaining_balance?: number;
}

export interface TransactionQuery {
  page?: number;
  page_size?: number;
  merchant?: string;
  category?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  sort_by?: 'date' | 'amount';
  sort_order?: 'asc' | 'desc';
}

const rawApiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
const apiBase = rawApiBase ?? '';

function buildQuery(params: object) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = normalizedPath.startsWith('/api/') ? normalizedPath : apiBase ? `${apiBase}${normalizedPath}` : normalizedPath;
  const response = await fetch(url, { cache: 'no-store', ...init });

  if (!response.ok) {
    let detail = `API request failed with status ${response.status}`;

    try {
      const payload = await response.json() as { detail?: string | { message?: string } | Array<{ message?: string }> };
      if (typeof payload.detail === 'string') {
        detail = payload.detail;
      } else if (payload.detail && typeof payload.detail === 'object') {
        const message = 'message' in payload.detail ? payload.detail.message : undefined;
        if (message) {
          detail = message;
        }
      }
    } catch {
      // Ignore JSON parse errors and fall back to the default HTTP status message.
    }

    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

export function getDashboardTransactions() {
  return fetchJson<TransactionListResponse>('/api/transactions?page_size=5&sort_by=date&sort_order=desc');
}

export function getRewardBalance() {
  return fetchJson<RewardSummary>('/api/rewards/balance');
}

export function getTransactions(params: TransactionQuery = {}) {
  const query = buildQuery(params);
  return fetchJson<TransactionListResponse>(`/api/transactions${query ? `?${query}` : ''}`);
}

export function getTransactionDetail(transactionId: number) {
  return fetchJson<Transaction>(`/api/transactions/${transactionId}`);
}

export function getRewards() {
  return fetchJson<Reward[]>('/api/rewards');
}

export function redeemReward(rewardId: number, userId = 1) {
  return fetchJson<RewardRedemptionResponse>('/api/rewards/redeem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reward_id: rewardId, user_id: userId }),
  });
}
