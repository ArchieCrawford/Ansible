'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useItems } from '@/lib/hooks/useApi'
import type { Issue } from '@/lib/types'

const labels: Record<Issue['status'], string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved'
}

export function IssueCard({ issue }: { issue: Issue }) {
  const { data: items = [] } = useItems()
  const item = issue.item_id ? items.find((i) => i.id === issue.item_id) : null
  const priorityClass =
    issue.priority === 'urgent'
      ? 'bg-red-50 text-red-700 ring-red-100'
      : issue.priority === 'high'
      ? 'bg-orange-50 text-orange-700 ring-orange-100'
      : issue.priority === 'normal'
      ? 'bg-slate-50 text-slate-700 ring-slate-200'
      : 'bg-slate-50 text-slate-500 ring-slate-200'

  return (
    <Link href={`/issues/${issue.id}`} className="block">
      <div className="group rounded-2xl border border-border bg-card p-4 card-hover">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-semibold tracking-tight group-hover:text-[hsl(var(--brand))]">
            {issue.title}
          </h4>
          <Badge variant={issue.status}>{labels[issue.status]}</Badge>
        </div>
        {item && (
          <div className="mt-1 text-xs text-muted-foreground">
            Item:{' '}
            <span className="font-medium text-foreground">
              {item.item_name}
            </span>
          </div>
        )}
        {issue.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {issue.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium capitalize ring-1 ${priorityClass}`}
          >
            {issue.priority}
          </span>
          <span className="text-muted-foreground">
            {new Date(issue.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  )
}
