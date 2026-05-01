'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStores, useItems, useIssues } from '@/lib/hooks/useApi'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IssueCard } from '@/components/issue/IssueCard'
import { CreateIssueModal } from '@/components/issue/CreateIssueModal'
import { CreateItemModal } from '@/components/item/CreateItemModal'
import { CreateStoreModal } from '@/components/store/CreateStoreModal'
import type { Item } from '@/lib/types'

export default function StoreDetailPage({
  params
}: {
  params: { id: string }
}) {
  const { id } = params
  const { data: stores = [] } = useStores()
  const store = stores.find((s) => s.id === id)
  const { data: items = [], isLoading: itemsLoading } = useItems(id)
  const { data: issues = [], isLoading: issuesLoading } = useIssues(id)

  const [issueOpen, setIssueOpen] = useState(false)
  const [itemOpen, setItemOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [storeOpen, setStoreOpen] = useState(false)

  function openNewItem() {
    setEditingItem(null)
    setItemOpen(true)
  }
  function openEditItem(it: Item) {
    setEditingItem(it)
    setItemOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/stores" className="text-sm text-muted-foreground hover:underline">
          ← Stores
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {store?.name ?? 'Store'}
            </h1>
            {store?.location && (
              <p className="text-sm text-muted-foreground">{store.location}</p>
            )}
          </div>
          <div className="flex gap-2">
            {store && (
              <Button variant="ghost" onClick={() => setStoreOpen(true)}>
                Edit Store
              </Button>
            )}
            <Button variant="outline" onClick={openNewItem}>
              + Add Item
            </Button>
            <Button onClick={() => setIssueOpen(true)}>+ New Issue</Button>
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Items</h2>
        {itemsLoading ? (
          <Skel />
        ) : items.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">No items yet.</Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {items.map((it) => (
              <Card key={it.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium">{it.item_name}</div>
                  <div className="flex items-center gap-2">
                    {it.purchase_date && (
                      <span className="text-xs text-muted-foreground">
                        {it.purchase_date}
                      </span>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => openEditItem(it)}>
                      Edit
                    </Button>
                  </div>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {it.location && <Row label="Location" value={it.location} />}
                  {it.serial_number && <Row label="Serial #" value={it.serial_number} />}
                </dl>
                {it.notes && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {it.notes}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Issues</h2>
        {issuesLoading ? (
          <Skel />
        ) : issues.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">No issues yet.</Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {issues.map((i) => (
              <IssueCard key={i.id} issue={i} />
            ))}
          </div>
        )}
      </section>

      <CreateIssueModal
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
        defaultStoreId={id}
      />
      <CreateItemModal
        open={itemOpen}
        onClose={() => setItemOpen(false)}
        defaultStoreId={id}
        item={editingItem}
      />
      <CreateStoreModal
        open={storeOpen}
        onClose={() => setStoreOpen(false)}
        store={store ?? null}
      />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  )
}

function Skel() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  )
}
