import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../supabase'

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    }
  })
}

export function useAddItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async item => {
      const { error } = await supabase.from('items').insert([item])
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] })
  })
}

export function useMaintenance(itemId) {
  return useQuery({
    queryKey: ['maintenance', itemId],
    enabled: !!itemId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('item_id', itemId)
        .order('date', { ascending: false })
      if (error) throw error
      return data ?? []
    }
  })
}

export function useAddMaintenance(itemId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async record => {
      const { error } = await supabase
        .from('maintenance_records')
        .insert([{ ...record, item_id: itemId }])
      if (error) throw error
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['maintenance', itemId] })
  })
}
