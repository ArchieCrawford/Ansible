import { supabase } from '@/lib/supabase/client'
import type { Comment, Issue, Item, Store } from '@/lib/types'

// ---- stores ---------------------------------------------------------------
export async function listStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function createStore(input: {
  name: string
  location?: string | null
}): Promise<Store> {
  const { data, error } = await supabase
    .from('stores')
    .insert([input])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateStore(
  id: string,
  patch: Partial<Pick<Store, 'name' | 'location'>>
): Promise<Store> {
  const { data, error } = await supabase
    .from('stores')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ---- items ----------------------------------------------------------------
export async function listItems(storeId?: string): Promise<Item[]> {
  let q = supabase.from('items').select('*').order('created_at', { ascending: false })
  if (storeId) q = q.eq('store_id', storeId)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function createItem(input: Partial<Item>): Promise<Item> {
  const { data, error } = await supabase
    .from('items')
    .insert([input])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateItem(
  id: string,
  patch: Partial<Item>
): Promise<Item> {
  const { data, error } = await supabase
    .from('items')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase.from('items').delete().eq('id', id)
  if (error) throw error
}

// ---- issues ---------------------------------------------------------------
export async function listIssues(storeId?: string): Promise<Issue[]> {
  let q = supabase.from('issues').select('*').order('created_at', { ascending: false })
  if (storeId) q = q.eq('store_id', storeId)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function getIssue(id: string): Promise<Issue> {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createIssue(input: Partial<Issue>): Promise<Issue> {
  const { data, error } = await supabase
    .from('issues')
    .insert([input])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateIssueStatus(
  id: string,
  status: Issue['status']
): Promise<Issue> {
  const { data, error } = await supabase
    .from('issues')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateIssue(
  id: string,
  patch: Partial<Issue>
): Promise<Issue> {
  const { data, error } = await supabase
    .from('issues')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ---- comments -------------------------------------------------------------
export async function listComments(issueId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function listAllComments(): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createComment(input: {
  issue_id: string
  author: string
  message: string
}): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert([input])
    .select()
    .single()
  if (error) throw error
  return data
}

// ---- dashboard summary ----------------------------------------------------
export async function getStoreSummaries() {
  const [stores, issues] = await Promise.all([listStores(), listIssues()])
  return stores.map((s) => {
    const mine = issues.filter((i) => i.store_id === s.id)
    return {
      ...s,
      open_count: mine.filter((i) => i.status === 'open').length,
      in_progress_count: mine.filter((i) => i.status === 'in_progress').length,
      resolved_count: mine.filter((i) => i.status === 'resolved').length
    }
  })
}
