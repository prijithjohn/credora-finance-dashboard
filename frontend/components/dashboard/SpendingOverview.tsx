import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Transaction } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

interface SpendingOverviewProps {
  transactions: Transaction[];
  loading: boolean;
}

function buildPath(values: number[]) {
  const width = 320;
  const height = 150;
  const padding = 24;
  const entries = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (values.length - 1);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const ratio = max === min ? 0.5 : (value - min) / (max - min);
    const y = height - padding - ratio * (height - padding * 2);
    return { x, y };
  });

  const line = entries.map((point) => `${point.x},${point.y}`).join(' L');
  const firstPoint = entries[0];
  const lastPoint = entries[entries.length - 1];
  const area = `M${firstPoint.x},${height - padding} L${line} L${lastPoint.x},${height - padding} Z`;

  return { line: `M${line}`, area };
}

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value));
}

export function SpendingOverview({ transactions, loading }: SpendingOverviewProps) {
  const chartData = transactions.length > 0 ? [...transactions].sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()).map((item) => Number(item.amount)) : [0, 0, 0, 0, 0];
  const chartLabels = transactions.length > 0 ? [...transactions].sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()).map((item) => formatDateLabel(item.transaction_date)) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const path = buildPath(chartData);
  const maxValue = Math.max(...chartData, 1);

  return (
    <Card className="rounded-[var(--radius-xl)] border-[var(--border)]">
      <CardHeader className="p-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Spending</div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">Recent spend trend</h2>
        </div>
        <Badge variant="neutral">Based on recent activity</Badge>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="text-sm text-[var(--text-secondary)]">This line chart is generated from the most recent transactions loaded by the dashboard.</div>

        <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
          <svg viewBox="0 0 320 150" className="h-44 w-full" aria-label="Recent spend trend">
            <defs>
              <linearGradient id="spend-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(99,198,155,0.24)" />
                <stop offset="100%" stopColor="rgba(99,198,155,0)" />
              </linearGradient>
            </defs>
            <path d={path.area} fill="url(#spend-gradient)" stroke="none" />
            <path d={path.line} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <g stroke="var(--border)" strokeWidth="1">
              {[0, 1, 2].map((index) => (
                <line key={index} x1="24" x2="296" y1={34 + index * 38} y2={34 + index * 38} strokeDasharray="3 6" />
              ))}
            </g>
          </svg>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {chartLabels.slice(0, 4).map((label) => (
              <div key={label} className="text-sm text-[var(--text-secondary)]">
                <p className="font-semibold text-[var(--text)]">{label}</p>
                <p>{formatCurrency(Math.round(maxValue * 0.75), 0)}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
