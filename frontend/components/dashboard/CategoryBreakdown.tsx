import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface CategoryItem {
  label: string;
  value: number;
  tone: string;
}

interface CategoryBreakdownProps {
  categories: CategoryItem[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const total = categories.reduce((sum, item) => sum + item.value, 0) || 1;
  const maxValue = Math.max(...categories.map((item) => item.value), 1);

  return (
    <Card className="rounded-[var(--radius-xl)] border-[var(--border)]">
      <CardHeader className="p-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Categories</div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">Spending breakdown</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        <div className="grid gap-4">
          {categories.map((category) => {
            const percent = Math.round((category.value / total) * 100);
            return (
              <div key={category.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                  <span>{category.label}</span>
                  <span className="font-semibold text-[var(--text)]">{category.value} · {percent}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
                  <div
                    className={`${category.tone} h-full rounded-full`}
                    style={{ width: `${(category.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-sm text-[var(--text-secondary)]">
          <p className="font-semibold text-[var(--text)]">Category focus</p>
          <p className="mt-1">This view is based on the most recent transaction feed available to the dashboard.</p>
          <p className="mt-2 text-xs">Total categories represented: {categories.length}</p>
        </div>
      </CardContent>
    </Card>
  );
}
