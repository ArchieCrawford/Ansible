'use client'

import { useStoreSummaries, useIssues } from '@/lib/hooks/useApi'
import { Card } from '@/components/ui/card'
import { StoreCard } from '@/components/store/StoreCard'
import { IssueCard } from '@/components/issue/IssueCard'

export default function DashboardPage() {
  const { data: stores = [], isLoading: storesLoading } = useStoreSummaries()
  const { data: issues = [], isLoading: issuesLoading } = useIssues()

  const totals = {
    open: issues.filter((i) => i.status === 'open').length,
    in_progress: issues.filter((i) => i.status === 'in_progress').length,
    resolved: issues.filter((i) => i.status === 'resolved').length
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of stores and open issues
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Open" value={totals.open} tone="text-red-600" />
        <StatCard label="In Progress" value={totals.in_progress} tone="text-amber-600" />
        <StatCard label="Resolved" value={totals.resolved} tone="text-emerald-600" />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Stores</h2>
        {storesLoading ? (
          <SkeletonGrid />
        ) : stores.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">No stores yet.</Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent Issues</h2>
        {issuesLoading ? (
          <SkeletonGrid />
        ) : issues.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">No issues yet.</Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {issues.slice(0, 6).map((i) => (
              <IssueCard key={i.id} issue={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <Card className="p-5">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className={`mt-2 text-3xl font-bold ${tone}`}>{value}</div>
    </Card>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  )
}
