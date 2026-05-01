export type IssueStatus = 'open' | 'in_progress' | 'resolved'
export type IssuePriority = 'low' | 'normal' | 'high' | 'urgent'

export type Store = {
  id: string
  name: string
  location: string | null
  created_at: string
}

export type Item = {
  id: string
  store_id: string | null
  item_name: string | null
  purchase_date: string | null
  serial_number: string | null
  location: string | null
  notes: string | null
  created_at: string
  updated_at: string | null
}

export type Issue = {
  id: string
  store_id: string | null
  item_id: string | null
  title: string
  description: string | null
  status: IssueStatus
  priority: IssuePriority
  created_at: string
  updated_at: string
}

export type Comment = {
  id: string
  issue_id: string
  author: string
  message: string
  created_at: string
}

export type StoreSummary = Store & {
  open_count: number
  in_progress_count: number
  resolved_count: number
}
