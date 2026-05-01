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
    <Card className="p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/stores/${store.id}`} className="flex-1">
          <h3 className="font-semibold hover:underline">{store.name}</h3>
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
        <div className="mt-4 flex gap-4 text-sm">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {store.open_count} open
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {store.in_progress_count} in progress
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {store.resolved_count} resolved
          </span>
        </div>
      </Link>
    </Card>
  )
}
