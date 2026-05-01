'use client'

import Link from 'next/link'
import { useIssue, useItems, useStores, useUpdateIssue, useUpdateIssueStatus } from '@/lib/hooks/useApi'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Comments } from '@/components/issue/Comments'
import type { Issue } from '@/lib/types'

const statuses: Issue['status'][] = ['open', 'in_progress', 'resolved']
const labels: Record<Issue['status'], string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved'
}

export default function IssueDetailPage({
  params
}: {
  params: { id: string }
}) {
  const { id } = params
  const { data: issue, isLoading } = useIssue(id)
  const { data: stores = [] } = useStores()
  const { data: items = [] } = useItems()
  const updateStatus = useUpdateIssueStatus()
  const updateIssue = useUpdateIssue()

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />
  }
  if (!issue) {
    return <Card className="p-6">Issue not found.</Card>
  }

  const store = stores.find((s) => s.id === issue.store_id)
  const item = issue.item_id ? items.find((i) => i.id === issue.item_id) : null

  const visibleItems = issue.store_id
    ? items.filter((i) => i.store_id === issue.store_id)
    : items

  function setLinkedItem(itemId: string) {
    const it = items.find((i) => i.id === itemId)
    updateIssue.mutate({
      id: issue!.id,
      patch: {
        item_id: itemId || null,
        // if issue had no store, inherit from item
        store_id: issue!.store_id || it?.store_id || null
      }
    })
  }

  function setLinkedStore(storeId: string) {
    updateIssue.mutate({
      id: issue!.id,
      patch: {
        store_id: storeId || null,
        // clear item if it doesn't belong to the new store
        item_id:
          item && (!storeId || item.store_id === storeId) ? item.id : null
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/issues"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Issues
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {issue.title}
            </h1>
            <div className="mt-1 text-sm text-muted-foreground">
              {store ? store.name : 'No store'}
              {item && (
                <>
                  {' · '}
                  Item: <span className="font-medium text-foreground">{item.item_name}</span>
                </>
              )}
              {' · '}
              priority <span className="capitalize">{issue.priority}</span>
            </div>
          </div>
          <Badge variant={issue.status}>{labels[issue.status]}</Badge>
        </div>

        {issue.description && (
          <p className="mt-4 whitespace-pre-wrap text-sm">
            {issue.description}
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Linked Store">
            <select
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              value={issue.store_id ?? ''}
              onChange={(e) => setLinkedStore(e.target.value)}
              disabled={updateIssue.isPending}
            >
              <option value="">— None —</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Linked Item">
            <select
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              value={issue.item_id ?? ''}
              onChange={(e) => setLinkedItem(e.target.value)}
              disabled={updateIssue.isPending}
            >
              <option value="">— None —</option>
              {visibleItems.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.item_name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {statuses.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={issue.status === s ? 'default' : 'outline'}
              disabled={updateStatus.isPending || issue.status === s}
              onClick={() => updateStatus.mutate({ id: issue.id, status: s })}
            >
              {labels[s]}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <Comments issueId={issue.id} />
      </Card>
    </div>
  )
}
