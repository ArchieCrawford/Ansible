'use client'

import { useEffect, useState } from 'react'
import { useUIStore } from '@/store/ui-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/ui/field'

export function SplashGate({ children }: { children: React.ReactNode }) {
  const entered = useUIStore((s) => s.entered)
  const setEntered = useUIStore((s) => s.setEntered)
  const guestName = useUIStore((s) => s.guestName)
  const setGuestName = useUIStore((s) => s.setGuestName)
  const [name, setName] = useState(guestName)

  // Avoid SSR hydration mismatch: wait for client mount before reading
  // the persisted Zustand state. Without this, server renders entered=false
  // but client may rehydrate to entered=true, breaking hydration and event handlers.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    setName(useUIStore.getState().guestName)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" />
    )
  }

  if (entered) return <>{children}</>

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Ansible</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Maintenance &amp; asset tracker — demo mode
        </p>

        <div className="mt-6 space-y-4">
          <Field label="Display name (optional)">
            <Input
              placeholder="Guest"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              setGuestName(name)
              setEntered(true)
            }}
          >
            Enter
          </Button>
        </div>
      </div>
    </div>
  )
}
