'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Issue } from '@/lib/types'

const labels: Record<Issue['status'], string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved'
}

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <Link href={`/issues/${issue.id}`}>
      <div className="rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-medium">{issue.title}</h4>
          <Badge variant={issue.status}>{labels[issue.status]}</Badge>
        </div>
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
