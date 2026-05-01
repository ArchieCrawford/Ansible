'use client'

import { Download, Mail, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  downloadCsv,
  emailRows,
  printCurrentPage,
  type Row
} from '@/lib/utils/export'

export function ExportToolbar({
  filename,
  rows,
  headers,
  emailSubject,
  emailIntro,
  defaultRecipient
}: {
  filename: string
  rows: Row[]
  headers?: string[]
  emailSubject: string
  emailIntro?: string
  defaultRecipient?: string
}) {
  function onEmail() {
    const to =
      typeof window !== 'undefined'
        ? window.prompt(
            'Send to (email address) — leave blank to choose in your mail app:',
            defaultRecipient ?? ''
          )
        : null
    if (to === null) return // cancelled
    emailRows({
      to: to || undefined,
      subject: emailSubject,
      intro: emailIntro,
      rows,
      headers
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <Button
        variant="outline"
        size="sm"
        onClick={() => downloadCsv(filename, rows, headers)}
        disabled={rows.length === 0}
      >
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={printCurrentPage}
      >
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onEmail}
        disabled={rows.length === 0}
      >
        <Mail className="mr-2 h-4 w-4" />
        Email
      </Button>
    </div>
  )
}
