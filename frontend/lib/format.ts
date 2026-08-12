export function formatCurrency(value: number | string | null | undefined, digits = 2) {
  const numericValue = typeof value === 'number' ? value : Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return '₹0.00';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(numericValue);
}
