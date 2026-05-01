import * as React from 'react'
import { Label } from './label'

type FieldProps = {
  label: string
  htmlFor?: string
  hint?: string
  children: React.ReactNode
}

export function Field({ label, htmlFor, hint, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
