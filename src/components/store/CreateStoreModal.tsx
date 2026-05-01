'use client'

import { useState } from 'react'
import { Dialog, DialogTitle } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateStore } from '@/lib/hooks/useApi'

export function CreateStoreModal({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {
  const create = useCreateStore()
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  async function submit() {
    if (!name.trim()) return
    await create.mutateAsync({
      name: name.trim(),
      location: location.trim() || null
    })
    setName('')
    setLocation('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Store</DialogTitle>
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
        <Button onClick={submit} disabled={create.isPending || !name.trim()}>
          {create.isPending ? 'Saving…' : 'Create'}
        </Button>
      </div>
    </Dialog>
  )
}
