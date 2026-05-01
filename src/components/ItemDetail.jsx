import { useState } from 'react'
import { Button } from './ui/Button'
import { Dialog, DialogTitle } from './ui/Dialog'
import { Input } from './ui/Input'
import { useAddMaintenance, useMaintenance } from '../lib/hooks/useItems'

export default function ItemDetail({ item, onClose }) {
  const [desc, setDesc] = useState('')
  const [date, setDate] = useState('')

  const { data: records = [], isLoading } = useMaintenance(item?.id)
  const addRecord = useAddMaintenance(item?.id)

  async function handleAdd() {
    if (!desc.trim()) return
    await addRecord.mutateAsync({
      description: desc,
      date: date || null
    })
    setDesc('')
    setDate('')
  }

  return (
    <Dialog
      open={!!item}
      onClose={onClose}
      className="max-w-lg"
    >
      {item && (
        <>
          <DialogTitle>{item.item_name}</DialogTitle>
          {item.location && (
            <p className="mt-1 text-sm text-muted-foreground">
              {item.location}
            </p>
          )}

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Maintenance
          </h3>

          <div className="mt-3 space-y-2">
            {isLoading && (
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
            )}
            {!isLoading && records.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No maintenance records yet.
              </p>
            )}
            {records.map(r => (
              <div
                key={r.id}
                className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm"
              >
                <div className="font-medium">
                  {r.date || 'Undated'}
                </div>
                <div className="text-muted-foreground">
                  {r.description}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <Input
              placeholder="Description"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={handleAdd}
              disabled={addRecord.isPending || !desc.trim()}
            >
              {addRecord.isPending ? 'Adding…' : 'Add'}
            </Button>
          </div>
        </>
      )}
    </Dialog>
  )
}
