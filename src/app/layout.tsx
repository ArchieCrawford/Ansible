import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Providers } from '@/components/providers'
import { SplashGate } from '@/components/layout/SplashGate'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export const metadata: Metadata = {
  title: 'FireHouse — Maintenance Tracker',
  description: 'Track stores, items, and maintenance issues.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <SplashGate>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex min-h-screen flex-1 flex-col">
                <Topbar />
                <main className="flex-1">
                  <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </SplashGate>
        </Providers>
      </body>
    </html>
  )
}
