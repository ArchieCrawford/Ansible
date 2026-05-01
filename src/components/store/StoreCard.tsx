'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { StoreSummary } from '@/lib/types'

export function StoreCard({
  store,
  onEdit
}: {
  store: StoreSummary
  onEdit?: () => void
}) {
  return (
    <Card className="group relative overflow-hidden p-5 card-hover">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 brand-gradient opacity-80"
      />
      <div className="flex items-start justify-between gap-3">
        <Link href={`/stores/${store.id}`} className="flex-1">
          <h3 className="font-semibold tracking-tight group-hover:text-[hsl(var(--brand))]">
            {store.name}
          </h3>
          {store.location && (
            <p className="text-sm text-muted-foreground">{store.location}</p>
          )}
        </Link>
        {onEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onEdit()
            }}
          >
            Edit
          </Button>
        )}
      </div>
      <Link href={`/stores/${store.id}`}>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-700 ring-1 ring-red-100">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {store.open_count} open
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-800 ring-1 ring-amber-100">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {store.in_progress_count} in progress
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 ring-1 ring-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {store.resolved_count} resolved
          </span>
        </div>
      </Link>
    </Card>
  )
}
