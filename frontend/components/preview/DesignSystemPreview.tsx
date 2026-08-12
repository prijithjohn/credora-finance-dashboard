'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = ['Overview', 'Transactions', 'Treasury', 'Rewards', 'Insights'];

const metrics = [
  { label: 'Net cash', value: '$2.84M', change: '+8.4%' },
  { label: 'Monthly volume', value: '$11.6M', change: '+3.1%' },
  { label: 'Active accounts', value: '4,382', change: '+142' },
  { label: 'Yield rate', value: '6.32%', change: '+0.14%' }
];

const allocation = [
  { label: 'Treasury', value: 52, tone: 'bg-[var(--primary)]' },
  { label: 'Operations', value: 28, tone: 'bg-[var(--text-muted)]' },
  { label: 'Risk reserve', value: 14, tone: 'bg-[var(--success)]' },
  { label: 'Liquidity', value: 6, tone: 'bg-[var(--primary-subtle)]' }
];

const activity = [
  { name: 'Northstar Capital', amount: '+$48,200', time: '2 hours ago' },
  { name: 'Brixton Logistics', amount: '-$12,400', time: '4 hours ago' },
  { name: 'Harbor Ventures', amount: '+$87,600', time: 'Today' }
];

export function DesignSystemPreview() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden min-h-screen w-[260px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur lg:flex lg:flex-col">
          <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-subtle)] text-sm font-semibold text-[var(--primary)]">
              C
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Credora</div>
              <div className="text-sm font-medium text-[var(--text)]">Capital OS</div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-5">
            <div className="mb-5 px-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Workspace
            </div>
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={item}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                      index === 0
                        ? 'bg-[var(--primary-subtle)] text-[var(--primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text)]'
                    }`}
                  >
                    <span>{item}</span>
                    {index === 0 ? <span className="h-2 w-2 rounded-full bg-[var(--primary)]" /> : null}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-[var(--border)] p-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Portfolio health</div>
              <div className="mt-2 flex items-end justify-between">
                <div className="text-2xl font-semibold tabular-nums text-[var(--text)]">96.4%</div>
                <Badge variant="success">Strong</Badge>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--text)] lg:hidden">
                  C
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Overview</div>
                  <div className="text-sm font-medium text-[var(--text)]">Capital overview</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(true)}>
                  Filters
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <div className="space-y-6 px-4 py-6 sm:px-6 xl:px-8">
            <section className="flex flex-col gap-5 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)] sm:p-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <Badge variant="primary">Premium fintech</Badge>
                <h1 className="mt-4 max-w-[640px] text-[clamp(2.25rem,5vw,3.5rem)] font-semibold tracking-[-0.06em] text-[var(--text)]">
                  Capital movement, calibrated for confidence.
                </h1>
                <p className="mt-3 max-w-[560px] text-base text-[var(--text-secondary)]">
                  Thoughtful treasury oversight for modern finance teams, with disciplined liquidity and decision-ready clarity.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button>View report</Button>
                <Button variant="secondary">Export</Button>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <Card key={metric.label} className="rounded-[22px] border-[var(--border)]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{metric.label}</div>
                    <div className="flex items-end justify-between gap-3">
                      <div className="text-[clamp(1.5rem,2vw,2.1rem)] font-semibold tracking-[-0.05em] tabular-nums text-[var(--text)]">
                        {metric.value}
                      </div>
                      <Badge variant="success">{metric.change}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
              <Card className="rounded-[28px] border-[var(--border)]">
                <CardHeader className="p-5 sm:p-6">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Portfolio</div>
                    <h2 className="mt-2 text-[clamp(1.6rem,2vw,2rem)] font-semibold tracking-[-0.05em] text-[var(--text)]">
                      Allocation overview
                    </h2>
                  </div>
                  <Badge variant="neutral">Updated 5m ago</Badge>
                </CardHeader>
                <CardContent className="space-y-6 p-5 sm:p-6">
                  <div className="flex h-48 items-end gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                    {allocation.map((item, index) => (
                      <div key={item.label} className="flex h-full flex-1 flex-col justify-end">
                        <div className="mb-3 flex justify-center text-[11px] font-medium text-[var(--text-muted)]">{item.value}%</div>
                        <div
                          className={`${item.tone} w-full rounded-t-xl`}
                          style={{ height: `${Math.max(item.value * 2.4, 30)}px`, opacity: index === 0 ? 1 : 0.9 }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {allocation.map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className={`h-2.5 w-2.5 rounded-full ${item.tone}`} />
                          <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                        </div>
                        <span className="text-sm font-medium text-[var(--text)]">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="rounded-[28px] border-[var(--border)]">
                  <CardHeader className="p-5">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Activity</div>
                      <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">Recent flow</h2>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 p-5 pt-0">
                    {activity.map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-3">
                        <div>
                          <div className="text-sm font-medium text-[var(--text)]">{item.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">{item.time}</div>
                        </div>
                        <div className={`text-sm font-medium ${item.amount.startsWith('+') ? 'text-[var(--success)]' : 'text-[var(--text)]'}`}>
                          {item.amount}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="rounded-[28px] border-[var(--border)]">
                  <CardHeader className="p-5">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Quick actions</div>
                      <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">Controls</h2>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-5 pt-0">
                    <Input label="Account name" placeholder="Northstar Treasury" />
                    <Select label="Allocation bucket" defaultValue="treasury">
                      <option value="treasury">Treasury</option>
                      <option value="operations">Operations</option>
                      <option value="reserve">Risk reserve</option>
                    </Select>
                    <div className="flex gap-3 pt-2">
                      <Button size="sm" onClick={() => setModalOpen(true)}>Open modal</Button>
                      <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(true)}>Drawer</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <Card className="rounded-[28px] border-[var(--border)]">
                <CardHeader className="p-5">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">System</div>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">Buttons</h2>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 p-5 pt-0">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button loading>Loading</Button>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-[var(--border)]">
                <CardHeader className="p-5">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">States</div>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">Status</h2>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-5 pt-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary">Live</Badge>
                    <Badge variant="success">Healthy</Badge>
                    <Badge variant="warning">Pending</Badge>
                    <Badge variant="danger">Alert</Badge>
                  </div>
                  <Skeleton rows={3} />
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-[var(--border)]">
                <CardHeader className="p-5">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Feedback</div>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--text)]">States</h2>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-5 pt-0">
                  <EmptyState title="No alerts" description="Your financial workflow is clear and stable." />
                  <ErrorState title="Sync issue" message="The account feed was not refreshed. Retry once more." action={<Button variant="secondary">Retry</Button>} />
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Review transaction"
        description="A focused action for immediate decisions."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
            <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Amount</div>
            <div className="mt-2 text-2xl font-semibold tabular-nums text-[var(--text)]">$48,200.00</div>
          </div>
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            This mock modal demonstrates a premium finance interaction without extending the actual backend or dashboard flow.
          </p>
        </div>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        description="Refine your treasury overview."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Reset</Button>
            <Button onClick={() => setDrawerOpen(false)}>Apply</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Search" placeholder="Merchant or counterparty" />
          <Select label="Status" defaultValue="all">
            <option value="all">All records</option>
            <option value="pending">Pending</option>
            <option value="success">Successful</option>
            <option value="review">Review</option>
          </Select>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
            <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Quick filter</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="primary">This week</Badge>
              <Badge variant="neutral">Treasury</Badge>
              <Badge variant="neutral">Growth</Badge>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
