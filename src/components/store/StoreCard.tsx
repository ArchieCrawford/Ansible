'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import type { StoreSummary } from '@/lib/types'

export function StoreCard({ store }: { store: StoreSummary }) {
  return (
    <Link href={`/stores/${store.id}`}>
      <Card className="cursor-pointer p-5 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{store.name}</h3>
            {store.location && (
              <p className="text-sm text-muted-foreground">{store.location}</p>
            )}
          </div>
        </div>
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
      </Card>
    </Link>
  )
}
