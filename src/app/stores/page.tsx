'use client'

import { useMemo, useState } from 'react'
import { useStoreSummaries } from '@/lib/hooks/useApi'
import { StoreCard } from '@/components/store/StoreCard'
import { CreateStoreModal } from '@/components/store/CreateStoreModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ExportToolbar } from '@/components/common/ExportToolbar'
import type { Store } from '@/lib/types'

export default function StoresPage() {
  const { data: stores = [], isLoading } = useStoreSummaries()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Store | null>(null)

  function openNew() {
    setEditing(null)
    setOpen(true)
  }
  function openEdit(s: Store) {
    setEditing(s)
    setOpen(true)
  }

  const exportRows = useMemo(
    () =>
      stores.map((s) => ({
        Name: s.name,
        Location: s.location ?? '',
        Open: s.open_count,
        'In Progress': s.in_progress_count,
        Resolved: s.resolved_count
      })),
    [stores]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
            Locations
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Stores</h1>
          <p className="text-sm text-muted-foreground">
            Locations being maintained.
          </p>
        </div>
        <Button onClick={openNew} className="shadow-sm">
          + New Store
        </Button>
      </div>

      <ExportToolbar
        filename={`firehouse-stores-${new Date().toISOString().slice(0, 10)}.csv`}
        rows={exportRows}
        emailSubject={`FireHouse — Stores export (${exportRows.length})`}
        emailIntro={`FireHouse stores export — ${exportRows.length} store(s) as of ${new Date().toLocaleString()}.`}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <Card className="p-6 text-sm text-muted-foreground">
          No stores yet. Click <strong>+ New Store</strong> to add one.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((s) => (
            <StoreCard key={s.id} store={s} onEdit={() => openEdit(s)} />
          ))}
        </div>
      )}

      <CreateStoreModal
        open={open}
        onClose={() => setOpen(false)}
        store={editing}
      />
    </div>
  )
}
