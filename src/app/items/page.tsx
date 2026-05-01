'use client'

import { useMemo, useState } from 'react'
import { useAllComments, useIssues, useItems, useStores } from '@/lib/hooks/useApi'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreateItemModal } from '@/components/item/CreateItemModal'
import type { Item } from '@/lib/types'

export default function ItemsPage() {
  const { data: items = [], isLoading } = useItems()
  const { data: stores = [] } = useStores()
  const { data: issues = [] } = useIssues()
  const { data: comments = [] } = useAllComments()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)

  const storeName = (id: string | null) =>
    stores.find((s) => s.id === id)?.name ?? '—'

  // Map item_id -> { count, lastMessage } using issues + comments
  const commentsByItem = useMemo(() => {
    const issueIdToItem = new Map<string, string>()
    for (const i of issues) {
      if (i.item_id) issueIdToItem.set(i.id, i.item_id)
    }
    const map = new Map<
      string,
      { count: number; last?: { author: string; message: string; created_at: string } }
    >()
    // comments are returned newest-first by listAllComments
    for (const c of comments) {
      const itemId = issueIdToItem.get(c.issue_id)
      if (!itemId) continue
      const cur = map.get(itemId) ?? { count: 0 }
      cur.count += 1
      if (!cur.last) {
        cur.last = {
          author: c.author,
          message: c.message,
          created_at: c.created_at
        }
      }
      map.set(itemId, cur)
    }
    return map
  }, [issues, comments])

  function openNew() {
    setEditing(null)
    setOpen(true)
  }
  function openEdit(item: Item) {
    setEditing(item)
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--brand))]">
            Inventory
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Items</h1>
          <p className="text-sm text-muted-foreground">
            All tracked equipment across every store.
          </p>
        </div>
        <Button onClick={openNew} className="shadow-sm">
          + Add Item
        </Button>
      </div>

      {isLoading ? (
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />
      ) : items.length === 0 ? (
        <Card className="p-6 text-sm text-muted-foreground">No items yet.</Card>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3">Serial #</th>
                <th className="px-4 py-3">Purchase Date</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Comments</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const c = commentsByItem.get(it.id)
                return (
                  <tr
                    key={it.id}
                    className="border-t border-border align-top transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">{it.item_name}</td>
                    <td className="px-4 py-3">{storeName(it.store_id)}</td>
                    <td className="px-4 py-3">{it.serial_number ?? '—'}</td>
                    <td className="px-4 py-3">{it.purchase_date ?? '—'}</td>
                    <td className="px-4 py-3">{it.location ?? '—'}</td>
                    <td className="px-4 py-3">
                      {c && c.count > 0 ? (
                        <div className="max-w-xs">
                          <div className="text-xs font-medium">
                            {c.count} comment{c.count === 1 ? '' : 's'}
                          </div>
                          {c.last && (
                            <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {c.last.author}:
                              </span>{' '}
                              {c.last.message}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(it)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <CreateItemModal
        open={open}
        onClose={() => setOpen(false)}
        item={editing}
      />
    </div>
  )
}
