'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogTitle } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateStore, useUpdateStore } from '@/lib/hooks/useApi'
import type { Store } from '@/lib/types'

type Props = {
  open: boolean
  onClose: () => void
  store?: Store | null
}

export function CreateStoreModal({ open, onClose, store }: Props) {
  const create = useCreateStore()
  const update = useUpdateStore()
  const isEdit = !!store
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    if (open) {
      setName(store?.name ?? '')
      setLocation(store?.location ?? '')
    }
  }, [open, store])

  async function submit() {
    if (!name.trim()) return
    if (isEdit && store) {
      await update.mutateAsync({
        id: store.id,
        patch: { name: name.trim(), location: location.trim() || null }
      })
    } else {
      await create.mutateAsync({
        name: name.trim(),
        location: location.trim() || null
      })
    }
    onClose()
  }

  const pending = create.isPending || update.isPending

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEdit ? 'Edit Store' : 'New Store'}</DialogTitle>
      <div className="mt-4 space-y-4">
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Location">
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={pending || !name.trim()}>
          {pending ? 'Saving…' : isEdit ? 'Save' : 'Create'}
        </Button>
      </div>
    </Dialog>
  )
}
