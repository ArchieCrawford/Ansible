'use client'

import { useUIStore } from '@/store/ui-store'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function Topbar() {
  const guestName = useUIStore((s) => s.guestName)
  const setEntered = useUIStore((s) => s.setEntered)
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <div className="text-sm text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{guestName}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={() => setEntered(false)}>
        <LogOut className="mr-2 h-4 w-4" />
        Exit
      </Button>
    </header>
  )
}
