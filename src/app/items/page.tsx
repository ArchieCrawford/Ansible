'use client'

import { useState } from 'react'
import { useItems, useStores } from '@/lib/hooks/useApi'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreateItemModal } from '@/components/item/CreateItemModal'

export default function ItemsPage() {
  const { data: items = [], isLoading } = useItems()
  const { data: stores = [] } = useStores()
  const [open, setOpen] = useState(false)

  const storeName = (id: string | null) =>
    stores.find((s) => s.id === id)?.name ?? '—'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Items</h1>
          <p className="text-sm text-muted-foreground">
            All tracked equipment
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>+ Add Item</Button>
      </div>

      {isLoading ? (
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />
      ) : items.length === 0 ? (
        <Card className="p-6 text-sm text-muted-foreground">No items yet.</Card>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3">Serial #</th>
                <th className="px-4 py-3">Purchase Date</th>
                <th className="px-4 py-3">Location</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{it.item_name}</td>
                  <td className="px-4 py-3">{storeName(it.store_id)}</td>
                  <td className="px-4 py-3">{it.serial_number ?? '—'}</td>
                  <td className="px-4 py-3">{it.purchase_date ?? '—'}</td>
                  <td className="px-4 py-3">{it.location ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateItemModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
