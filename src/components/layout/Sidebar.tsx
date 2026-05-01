'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Boxes, LayoutDashboard, Store, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/stores',    label: 'Stores',    icon: Store },
  { href: '/items',     label: 'Items',     icon: Boxes },
  { href: '/issues',    label: 'Issues',    icon: Wrench }
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-background p-4 md:flex md:flex-col">
      <div className="mb-8 px-2">
        <div className="text-lg font-bold">Ansible</div>
        <div className="text-xs text-muted-foreground">Maintenance</div>
      </div>
      <nav className="space-y-1">
        {links.map((l) => {
          const active = pathname?.startsWith(l.href)
          const Icon = l.icon
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {l.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
