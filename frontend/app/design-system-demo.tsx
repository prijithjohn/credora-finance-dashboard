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

export default function DesignSystemDemo() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <Badge variant="primary">Premium fintech</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Design system foundation
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Clean, minimal components with a strong SaaS visual language for Credora.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">Buttons</p>
                <h2 className="mt-2 text-xl font-semibold">Actions</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">Status</p>
                <h2 className="mt-2 text-xl font-semibold">Badges</h2>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge variant="primary">Active</Badge>
              <Badge variant="success">Healthy</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="danger">Alert</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">Form</p>
                <h2 className="mt-2 text-xl font-semibold">Inputs</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input label="Email" placeholder="name@company.com" />
              <Select label="Region" defaultValue="us">
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="eu">Europe</option>
              </Select>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">Skeleton</p>
                <h2 className="mt-2 text-xl font-semibold">Loading states</h2>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton rows={4} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-500">States</p>
                <h2 className="mt-2 text-xl font-semibold">Empty and error</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <EmptyState
                title="No transactions yet"
                description="Once activity appears, it will be listed here."
                action={<Button variant="secondary">Refresh</Button>}
              />
              <ErrorState
                title="Sync failed"
                message="We could not load the latest data. Try again in a moment."
                action={<Button variant="secondary">Retry</Button>}
              />
            </CardContent>
          </Card>
        </section>
      </div>

      <Modal
        open={false}
        onClose={() => undefined}
        title="Account detail"
        description="A modal for focused workflows."
        footer={
          <>
            <Button variant="secondary">Cancel</Button>
            <Button>Save</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">This modal demonstrates the modal foundation.</p>
      </Modal>

      <Drawer
        open={false}
        onClose={() => undefined}
        title="Filters"
        description="Use this for contextual actions and settings."
        footer={
          <>
            <Button variant="secondary">Reset</Button>
            <Button>Apply</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Search" placeholder="Filter by merchant" />
          <Select label="Status" defaultValue="all">
            <option value="all">All transactions</option>
            <option value="pending">Pending</option>
            <option value="successful">Successful</option>
          </Select>
        </div>
      </Drawer>
    </main>
  );
}
