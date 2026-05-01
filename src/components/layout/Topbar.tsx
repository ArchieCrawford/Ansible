'use client'

import { useUIStore } from '@/store/ui-store'
import { Button } from '@/components/ui/button'
import { Flame, LogOut } from 'lucide-react'

export function Topbar() {
  const guestName = useUIStore((s) => s.guestName)
  const setEntered = useUIStore((s) => s.setEntered)
  return (
    <header className="brand-gradient sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/10 px-4 text-white shadow-[0_4px_20px_-8px_hsl(var(--brand)/0.5)] sm:px-6 lg:px-8">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur md:hidden">
          <Flame className="h-5 w-5" />
        </div>
        <div className="text-xl font-extrabold tracking-tight">
          Fire<span className="text-[hsl(var(--brand-yellow))]">House</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-sm text-white/85 sm:block">
          Signed in as{' '}
          <span className="font-semibold text-white">{guestName}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEntered(false)}
          className="rounded-lg text-white ring-1 ring-white/20 hover:bg-white/15 hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Exit
        </Button>
      </div>
    </header>
  )
}
