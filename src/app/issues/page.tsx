'use client'

import { useState } from 'react'
import { useIssues } from '@/lib/hooks/useApi'
import { IssueCard } from '@/components/issue/IssueCard'
import { CreateIssueModal } from '@/components/issue/CreateIssueModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Issue } from '@/lib/types'

const tabs: { value: Issue['status'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' }
]

export default function IssuesPage() {
  const { data: issues = [], isLoading } = useIssues()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<Issue['status'] | 'all'>('all')

  const filtered =
    filter === 'all' ? issues : issues.filter((i) => i.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Issues</h1>
          <p className="text-sm text-muted-foreground">
            All maintenance issues across stores
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>+ New Issue</Button>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={
              'rounded-xl border px-3 py-1.5 text-sm transition-colors ' +
              (filter === t.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background hover:bg-accent')
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />
      ) : filtered.length === 0 ? (
        <Card className="p-6 text-sm text-muted-foreground">No issues.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((i) => (
            <IssueCard key={i.id} issue={i} />
          ))}
        </div>
      )}

      <CreateIssueModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
