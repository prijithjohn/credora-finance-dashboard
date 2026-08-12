interface DashboardHeaderProps {
  userName: string;
  transactionCount: number;
}

export function DashboardHeader({ userName, transactionCount }: DashboardHeaderProps) {
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-muted)]">Good morning</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--text)]">Good morning, {userName}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">Your latest activity, balances, and rewards are presented here with focus and clarity.</p>
        </div>

        <div className="grid gap-3 rounded-[1.5rem] bg-[var(--surface-elevated)] p-4 text-sm text-[var(--text-secondary)] shadow-[0_4px_16px_rgba(23,27,26,0.04)] sm:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Overview</p>
            <p className="mt-2 text-xl font-semibold text-[var(--text)]">{transactionCount.toLocaleString()} transactions</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">As of</p>
            <p className="mt-2 text-xl font-semibold text-[var(--text)]">{today}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
