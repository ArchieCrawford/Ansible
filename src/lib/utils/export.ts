// Lightweight CSV/print/email helpers — no extra deps.
// Excel opens .csv directly; we prepend a UTF-8 BOM so accented chars survive.

export type Row = Record<string, string | number | null | undefined>

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return ''
  const s = String(value)
  if (/[",\n\r]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

export function toCsv(rows: Row[], headers?: string[]): string {
  if (rows.length === 0) return ''
  const cols = headers ?? Object.keys(rows[0])
  const head = cols.map(escapeCsv).join(',')
  const body = rows
    .map((r) => cols.map((c) => escapeCsv(r[c])).join(','))
    .join('\r\n')
  return head + '\r\n' + body
}

export function downloadCsv(filename: string, rows: Row[], headers?: string[]) {
  const csv = toCsv(rows, headers)
  // BOM so Excel detects UTF-8
  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function printCurrentPage() {
  window.print()
}

/**
 * Open the user's email client with a pre-filled message.
 * Body is plain-text formatted as a simple table-like list.
 */
export function emailRows(opts: {
  to?: string
  subject: string
  intro?: string
  rows: Row[]
  headers?: string[]
}) {
  const cols = opts.headers ?? (opts.rows[0] ? Object.keys(opts.rows[0]) : [])
  const lines: string[] = []
  if (opts.intro) {
    lines.push(opts.intro, '')
  }
  for (const r of opts.rows) {
    for (const c of cols) {
      const v = r[c]
      if (v === null || v === undefined || v === '') continue
      lines.push(`${c}: ${v}`)
    }
    lines.push('—'.repeat(20))
  }
  const body = lines.join('\n')
  const url =
    'mailto:' +
    encodeURIComponent(opts.to ?? '') +
    '?subject=' +
    encodeURIComponent(opts.subject) +
    '&body=' +
    encodeURIComponent(body)
  // Use location.href so Outlook / default mail client handler picks it up.
  window.location.href = url
}
