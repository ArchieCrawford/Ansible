'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '@/services/api'

export function useStores() {
  return useQuery({ queryKey: ['stores'], queryFn: api.listStores })
}

export function useStoreSummaries() {
  return useQuery({
    queryKey: ['stores', 'summaries'],
    queryFn: api.getStoreSummaries
  })
}

export function useCreateStore() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.createStore,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stores'] })
  })
}

export function useUpdateStore() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; patch: { name?: string; location?: string | null } }) =>
      api.updateStore(vars.id, vars.patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stores'] })
  })
}

export function useItems(storeId?: string) {
  return useQuery({
    queryKey: ['items', storeId ?? null],
    queryFn: () => api.listItems(storeId)
  })
}

export function useCreateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.createItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] })
  })
}

export function useUpdateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; patch: Parameters<typeof api.updateItem>[1] }) =>
      api.updateItem(vars.id, vars.patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] })
  })
}

export function useDeleteItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.deleteItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] })
  })
}

export function useIssues(storeId?: string) {
  return useQuery({
    queryKey: ['issues', storeId ?? null],
    queryFn: () => api.listIssues(storeId)
  })
}

export function useIssue(id?: string) {
  return useQuery({
    queryKey: ['issue', id],
    enabled: !!id,
    queryFn: () => api.getIssue(id!)
  })
}

export function useCreateIssue() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.createIssue,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['issues'] })
      qc.invalidateQueries({ queryKey: ['stores', 'summaries'] })
    }
  })
}

export function useUpdateIssueStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; status: 'open' | 'in_progress' | 'resolved' }) =>
      api.updateIssueStatus(vars.id, vars.status),
    onSuccess: (issue) => {
      qc.invalidateQueries({ queryKey: ['issues'] })
      qc.invalidateQueries({ queryKey: ['issue', issue.id] })
      qc.invalidateQueries({ queryKey: ['stores', 'summaries'] })
    }
  })
}

export function useComments(issueId?: string) {
  return useQuery({
    queryKey: ['comments', issueId],
    enabled: !!issueId,
    queryFn: () => api.listComments(issueId!)
  })
}

export function useAllComments() {
  return useQuery({
    queryKey: ['comments', 'all'],
    queryFn: api.listAllComments
  })
}

export function useCreateComment(issueId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.createComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', issueId] })
      qc.invalidateQueries({ queryKey: ['comments', 'all'] })
    }
  })
}
