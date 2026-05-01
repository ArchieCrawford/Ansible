import { useState } from 'react'
import { Button } from './ui/Button'
import { Dialog, DialogTitle } from './ui/Dialog'
import { Input } from './ui/Input'
import { useAddItem } from '../lib/hooks/useItems'

const empty = {
  item_name: '',
  purchase_date: '',
  serial_number: '',
  location: ''
}

export default function AddItemModal({ open, onClose }) {
  const [form, setForm] = useState(empty)
  const addItem = useAddItem()

  function update(field) {
    return e => setForm({ ...form, [field]: e.target.value })
  }

  async function handleSubmit() {
    if (!form.item_name.trim()) return
    await addItem.mutateAsync({
      ...form,
      purchase_date: form.purchase_date || null
    })
    setForm(empty)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Item</DialogTitle>
      <div className="mt-4 space-y-3">
        <Input
          placeholder="Item name"
          value={form.item_name}
          onChange={update('item_name')}
        />
        <Input
          type="date"
          value={form.purchase_date}
          onChange={update('purchase_date')}
        />
        <Input
          placeholder="Serial number"
          value={form.serial_number}
          onChange={update('serial_number')}
        />
        <Input
          placeholder="Location"
          value={form.location}
          onChange={update('location')}
        />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={addItem.isPending || !form.item_name.trim()}
        >
          {addItem.isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </Dialog>
  )
}
