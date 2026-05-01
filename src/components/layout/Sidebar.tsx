'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Boxes, Flame, LayoutDashboard, Store, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/stores',    label: 'Stores',    icon: Store },
  { href: '/items',     label: 'Items',     icon: Boxes },
  { href: '/issues',    label: 'Issues',    icon: Wrench }
]

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-black/5">
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-extrabold leading-none tracking-tight">
            Fire<span className="text-[hsl(var(--brand))]">House</span>
          </div>
          <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Maintenance
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Workspace
        </div>
        {links.map((l) => {
          const active = pathname?.startsWith(l.href)
          const Icon = l.icon
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={onNavigate}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all',
                active
                  ? 'bg-[hsl(var(--brand)/0.08)] font-semibold text-[hsl(var(--brand))]'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <span
                className={cn(
                  'absolute inset-y-1.5 left-0 w-1 rounded-r-full transition-colors',
                  active ? 'bg-[hsl(var(--brand))]' : 'bg-transparent'
                )}
              />
              <Icon
                className={cn(
                  'h-4 w-4 transition-colors',
                  active
                    ? 'text-[hsl(var(--brand))]'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              {l.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <div className="rounded-xl bg-gradient-to-br from-[hsl(var(--brand)/0.08)] to-[hsl(var(--brand-yellow)/0.15)] p-3 text-xs">
          <div className="font-semibold text-foreground">Demo mode</div>
          <div className="mt-0.5 text-muted-foreground">
            Realtime sync enabled.
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-white/60 backdrop-blur md:flex md:flex-col">
      <SidebarContent />
    </aside>
  )
}
