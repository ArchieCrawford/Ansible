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
  return (
    <Link href={`/issues/${issue.id}`}>
      <div className="rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-medium">{issue.title}</h4>
          <Badge variant={issue.status}>{labels[issue.status]}</Badge>
        </div>
        {item && (
          <div className="mt-1 text-xs text-muted-foreground">
            Item: <span className="font-medium text-foreground">{item.item_name}</span>
          </div>
        )}
        {issue.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {issue.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="capitalize">priority: {issue.priority}</span>
          <span>·</span>
          <span>{new Date(issue.created_at).toLocaleString()}</span>
        </div>
      </div>
    </Link>
  )
}
