'use client';

import { useMemo } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const statusOptions = [
  { label: 'All statuses', value: '' },
  { label: 'Success', value: 'SUCCESS' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Pending', value: 'PENDING' }
];

const categoryOptions = [
  { label: 'All categories', value: '' },
  { label: 'Groceries', value: 'Groceries' },
  { label: 'Shopping', value: 'Shopping' },
  { label: 'Food', value: 'Food' },
  { label: 'Transportation', value: 'Transportation' },
  { label: 'Bills', value: 'Bills' }
];

interface TransactionsFiltersProps {
  merchant: string;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  onMerchantChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onMinAmountChange: (value: string) => void;
  onMaxAmountChange: (value: string) => void;
  onSortByChange: (value: 'date' | 'amount') => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  onApply: () => void;
  onReset: () => void;
  loading: boolean;
}

export function TransactionsFilters({
  merchant,
  category,
  status,
  startDate,
  endDate,
  minAmount,
  maxAmount,
  sortBy,
  sortOrder,
  onMerchantChange,
  onCategoryChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onMinAmountChange,
  onMaxAmountChange,
  onSortByChange,
  onSortOrderChange,
  onApply,
  onReset,
  loading
}: TransactionsFiltersProps) {
  const sortOptions = useMemo(
    () => [
      { label: 'Date descending', value: 'date_desc' },
      { label: 'Date ascending', value: 'date_asc' },
      { label: 'Amount descending', value: 'amount_desc' },
      { label: 'Amount ascending', value: 'amount_asc' }
    ],
    []
  );

  return (
    <div className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
      <div className="grid gap-4 xl:grid-cols-3">
        <Input
          label="Merchant"
          value={merchant}
          onChange={(event) => onMerchantChange(event.target.value)}
          placeholder="Search merchant"
        />
        <Select label="Category" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select label="Status" value={status} onChange={(event) => onStatusChange(event.target.value)}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <Input
          label="Start date"
          type="date"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
        />
        <Input
          label="End date"
          type="date"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
        />
        <Input
          label="Min amount"
          type="number"
          min={0}
          step={0.01}
          value={minAmount}
          onChange={(event) => onMinAmountChange(event.target.value)}
          placeholder="0"
        />
        <Input
          label="Max amount"
          type="number"
          min={0}
          step={0.01}
          value={maxAmount}
          onChange={(event) => onMaxAmountChange(event.target.value)}
          placeholder="0"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Select
          label="Sort by"
          value={`${sortBy}_${sortOrder}`}
          onChange={(event) => {
            const [field, order] = event.target.value.split('_') as ['date' | 'amount', 'asc' | 'desc'];
            onSortByChange(field);
            onSortOrderChange(order);
          }}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <div className="flex flex-wrap items-end gap-3">
          <Button type="button" onClick={onApply} loading={loading}>
            Apply filters
          </Button>
          <Button type="button" variant="secondary" onClick={onReset} disabled={loading}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
