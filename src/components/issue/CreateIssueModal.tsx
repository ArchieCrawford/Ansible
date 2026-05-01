'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogTitle } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useStores, useItems, useCreateIssue } from '@/lib/hooks/useApi'
import type { Issue } from '@/lib/types'

type Props = {
  open: boolean
  onClose: () => void
  defaultStoreId?: string
  defaultItemId?: string
}

const empty = {
  title: '',
  description: '',
  store_id: '',
  item_id: '',
  priority: 'normal' as Issue['priority']
}

export function CreateIssueModal({
  open,
  onClose,
  defaultStoreId,
  defaultItemId
}: Props) {
  const { data: stores = [] } = useStores()
  const { data: items = [] } = useItems()
  const createIssue = useCreateIssue()
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    setForm({
      ...empty,
      store_id: defaultStoreId ?? '',
      item_id: defaultItemId ?? ''
    })
  }, [open, defaultStoreId, defaultItemId])

  // Items filtered to selected store (or all if none chosen)
  const visibleItems = form.store_id
    ? items.filter((i) => i.store_id === form.store_id)
    : items

  function pickItem(itemId: string) {
    const it = items.find((i) => i.id === itemId)
    setForm({
      ...form,
      item_id: itemId,
      // auto-set store from item if not yet set
      store_id: form.store_id || it?.store_id || ''
    })
  }

  async function submit() {
    if (!form.title.trim()) return
    await createIssue.mutateAsync({
      title: form.title.trim(),
      description: form.description.trim() || null,
      store_id: form.store_id || null,
      item_id: form.item_id || null,
      priority: form.priority,
      status: 'open'
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Issue</DialogTitle>
      <div className="mt-4 space-y-4">
        <Field label="Title">
          <Input
            placeholder="e.g. Cooler not cooling"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <Field label="Store">
          <select
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            value={form.store_id}
            onChange={(e) =>
              setForm({ ...form, store_id: e.target.value, item_id: '' })
            }
          >
            <option value="">— None —</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Item">
          <select
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            value={form.item_id}
            onChange={(e) => pickItem(e.target.value)}
          >
            <option value="">— Select an item —</option>
            {visibleItems.map((it) => (
              <option key={it.id} value={it.id}>
                {it.item_name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Description">
          <Textarea
            placeholder="What's going on?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <Field label="Priority">
          <select
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value as Issue['priority'] })
            }
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={submit}
          disabled={createIssue.isPending || !form.title.trim()}
        >
          {createIssue.isPending ? 'Saving…' : 'Create'}
        </Button>
      </div>
    </Dialog>
  )
}
