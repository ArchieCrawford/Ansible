'use client'

import { useMemo, useState } from 'react'
import { useAllComments, useIssues, useItems, useStores } from '@/lib/hooks/useApi'
import { IssueCard } from '@/components/issue/IssueCard'
import { CreateIssueModal } from '@/components/issue/CreateIssueModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ExportToolbar } from '@/components/common/ExportToolbar'
import type { Issue } from '@/lib/types'

const tabs: { value: Issue['status'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' }
]

export default function IssuesPage() {
  const { data: issues = [], isLoading } = useIssues()
  const { data: stores = [] } = useStores()
  const { data: items = [] } = useItems()
  const { data: comments = [] } = useAllComments()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<Issue['status'] | 'all'>('all')

  const filtered =
    filter === 'all' ? issues : issues.filter((i) => i.status === filter)

  const exportRows = useMemo(() => {
    const storeName = (id: string | null) =>
      id ? stores.find((s) => s.id === id)?.name ?? '' : ''
    const itemName = (id: string | null) =>
      id ? items.find((i) => i.id === id)?.item_name ?? '' : ''
    // Group comments by issue
    const byIssue = new Map<string, typeof comments>()
    for (const c of comments) {
      const arr = byIssue.get(c.issue_id) ?? []
      arr.push(c)
      byIssue.set(c.issue_id, arr)
    }
    return filtered.map((i) => {
      const cs = byIssue.get(i.id) ?? []
      const commentText = cs
        .slice()
        .reverse() // chronological
        .map((c) => `${c.author}: ${c.message}`)
        .join(' | ')
      return {
        Title: i.title,
        Status: i.status,
        Priority: i.priority,
        Store: storeName(i.store_id),
        Item: itemName(i.item_id),
        Description: i.description ?? '',
        'Comment Count': cs.length,
        Comments: commentText,
        Created: new Date(i.created_at).toLocaleString(),
        Updated: i.updated_at ? new Date(i.updated_at).toLocaleString() : ''
      }
    })
  }, [filtered, stores, items, comments])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
            Backlog
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Issues</h1>
          <p className="text-sm text-muted-foreground">
            All maintenance issues across stores.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="shadow-sm">
          + New Issue
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-border bg-white/60 p-1 shadow-sm backdrop-blur">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilter(t.value)}
              className={
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-all ' +
                (filter === t.value
                  ? 'bg-[hsl(var(--brand))] text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground')
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <ExportToolbar
          filename={`firehouse-issues-${filter}-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`}
          rows={exportRows}
          emailSubject={`FireHouse — Issues export (${filter}, ${exportRows.length})`}
          emailIntro={`FireHouse issues export — filter: ${filter}, ${exportRows.length} issue(s) as of ${new Date().toLocaleString()}.`}
        />
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
