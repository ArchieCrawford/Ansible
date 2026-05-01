'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogTitle } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  useCreateItem,
  useDeleteItem,
  useStores,
  useUpdateItem
} from '@/lib/hooks/useApi'
import type { Item } from '@/lib/types'

type Props = {
  open: boolean
  onClose: () => void
  defaultStoreId?: string
  item?: Item | null
}

const empty = {
  item_name: '',
  purchase_date: '',
  serial_number: '',
  location: '',
  notes: '',
  store_id: ''
}

export function CreateItemModal({ open, onClose, defaultStoreId, item }: Props) {
  const create = useCreateItem()
  const update = useUpdateItem()
  const del = useDeleteItem()
  const { data: stores = [] } = useStores()
  const isEdit = !!item
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (item) {
      setForm({
        item_name: item.item_name ?? '',
        purchase_date: item.purchase_date ?? '',
        serial_number: item.serial_number ?? '',
        location: item.location ?? '',
        notes: item.notes ?? '',
        store_id: item.store_id ?? ''
      })
    } else {
      setForm({ ...empty, store_id: defaultStoreId ?? '' })
    }
  }, [open, item, defaultStoreId])

  function up<K extends keyof typeof empty>(k: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value })
  }

  async function submit() {
    if (!form.item_name.trim()) return
    const payload = {
      item_name: form.item_name.trim(),
      purchase_date: form.purchase_date || null,
      serial_number: form.serial_number.trim() || null,
      location: form.location.trim() || null,
      notes: form.notes.trim() || null,
      store_id: form.store_id || null
    }
    if (isEdit && item) {
      await update.mutateAsync({ id: item.id, patch: payload })
    } else {
      await create.mutateAsync(payload)
    }
    onClose()
  }

  async function remove() {
    if (!item) return
    if (!confirm(`Delete "${item.item_name}"?`)) return
    await del.mutateAsync(item.id)
    onClose()
  }

  const pending = create.isPending || update.isPending || del.isPending

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEdit ? 'Edit Item' : 'Add Item'}</DialogTitle>
      <div className="mt-4 space-y-4">
        <Field label="Item Name">
          <Input
            placeholder="e.g. 3 door cooler"
            value={form.item_name}
            onChange={up('item_name')}
          />
        </Field>
        <Field label="Store">
          <select
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            value={form.store_id}
            onChange={up('store_id')}
          >
            <option value="">— None —</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Purchase Date">
          <Input type="date" value={form.purchase_date} onChange={up('purchase_date')} />
        </Field>
        <Field label="Serial Number">
          <Input value={form.serial_number} onChange={up('serial_number')} />
        </Field>
        <Field label="Location">
          <Input value={form.location} onChange={up('location')} />
        </Field>
        <Field label="Notes / Comments">
          <Textarea value={form.notes} onChange={up('notes')} />
        </Field>
      </div>
      <div className="mt-6 flex justify-between gap-2">
        <div>
          {isEdit && (
            <Button variant="outline" onClick={remove} disabled={pending}>
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={pending || !form.item_name.trim()}>
            {pending ? 'Saving…' : isEdit ? 'Save' : 'Add'}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
