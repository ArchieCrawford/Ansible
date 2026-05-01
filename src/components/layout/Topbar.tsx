'use client'

import { useUIStore } from '@/store/ui-store'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function Topbar() {
  const guestName = useUIStore((s) => s.guestName)
  const setEntered = useUIStore((s) => s.setEntered)
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-[hsl(var(--brand))] px-6 text-white">
      <div className="text-xl font-extrabold tracking-tight">FireHouse</div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-white/80">
          Signed in as <span className="font-medium text-white">{guestName}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEntered(false)}
          className="text-white hover:bg-white/15 hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Exit
        </Button>
      </div>
    </header>
  )
}
