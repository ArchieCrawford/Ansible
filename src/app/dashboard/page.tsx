'use client'

import { AlertCircle, CheckCircle2, Clock, Wrench } from 'lucide-react'
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
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
          Overview
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Stores, equipment, and the maintenance backlog at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Open"
          value={totals.open}
          icon={AlertCircle}
          gradient="from-rose-500/10 to-red-500/5"
          iconClass="bg-red-100 text-red-600"
        />
        <StatCard
          label="In Progress"
          value={totals.in_progress}
          icon={Clock}
          gradient="from-amber-500/10 to-yellow-500/5"
          iconClass="bg-amber-100 text-amber-600"
        />
        <StatCard
          label="Resolved"
          value={totals.resolved}
          icon={CheckCircle2}
          gradient="from-emerald-500/10 to-teal-500/5"
          iconClass="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          label="Total Issues"
          value={issues.length}
          icon={Wrench}
          gradient="from-slate-500/10 to-slate-500/5"
          iconClass="bg-slate-100 text-slate-700"
        />
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-tight">Stores</h2>
          <span className="text-xs text-muted-foreground">
            {stores.length} location{stores.length === 1 ? '' : 's'}
          </span>
        </div>
        {storesLoading ? (
          <SkeletonGrid />
        ) : stores.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No stores yet.
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-tight">Recent Issues</h2>
          <span className="text-xs text-muted-foreground">
            showing {Math.min(6, issues.length)} of {issues.length}
          </span>
        </div>
        {issuesLoading ? (
          <SkeletonGrid />
        ) : issues.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            No issues yet.
          </Card>
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

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  iconClass
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  iconClass: string
}) {
  return (
    <Card
      className={`relative overflow-hidden border-0 ring-soft card-hover bg-gradient-to-br ${gradient} p-5`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </div>
          <div className="mt-3 text-3xl font-extrabold tracking-tight">
            {value}
          </div>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-black/5 ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
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
