'use client'

import { useState } from 'react'
import { Dialog, DialogTitle } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useCreateItem, useStores } from '@/lib/hooks/useApi'

type Props = {
  open: boolean
  onClose: () => void
  defaultStoreId?: string
}

const empty = {
  item_name: '',
  purchase_date: '',
  serial_number: '',
  location: '',
  notes: '',
  store_id: ''
}

export function CreateItemModal({ open, onClose, defaultStoreId }: Props) {
  const create = useCreateItem()
  const { data: stores = [] } = useStores()
  const [form, setForm] = useState({ ...empty, store_id: defaultStoreId ?? '' })

  function up<K extends keyof typeof empty>(k: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value })
  }

  async function submit() {
    if (!form.item_name.trim()) return
    await create.mutateAsync({
      item_name: form.item_name.trim(),
      purchase_date: form.purchase_date || null,
      serial_number: form.serial_number.trim() || null,
      location: form.location.trim() || null,
      notes: form.notes.trim() || null,
      store_id: form.store_id || null
    })
    setForm({ ...empty, store_id: defaultStoreId ?? '' })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Item</DialogTitle>
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
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={submit} disabled={create.isPending || !form.item_name.trim()}>
          {create.isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </Dialog>
  )
}
