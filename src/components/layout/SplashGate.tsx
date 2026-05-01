'use client'

import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      {/* Background flair */}
      <div className="brand-gradient absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 opacity-[0.18] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -left-32 -top-32 -z-10 h-96 w-96 rounded-full bg-[hsl(var(--brand-yellow)/0.35)] blur-3xl" />
      <div className="absolute -bottom-32 -right-32 -z-10 h-96 w-96 rounded-full bg-white/15 blur-3xl" />

      <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-md ring-1 ring-black/10">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Fire<span className="text-[hsl(var(--brand))]">House</span>
            </h1>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Maintenance Tracker
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          Demo mode — pick a display name and jump in. Your changes sync in
          realtime across all sessions.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            setGuestName(name)
            setEntered(true)
          }}
        >
          <Field label="Display name (optional)">
            <Input
              placeholder="Guest"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Button className="w-full shadow-sm" size="lg" type="submit">
            Enter Workspace
          </Button>
        </form>
      </div>
    </div>
  )
}
