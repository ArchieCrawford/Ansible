'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Comment } from '@/lib/types'

/**
 * Subscribes to INSERTs on the comments table for a given issue and
 * keeps the React-Query cache for ['comments', issueId] in sync.
 */
export function useRealtimeComments(issueId?: string) {
  const qc = useQueryClient()

  useEffect(() => {
    if (!issueId) return

    const channel = supabase
      .channel(`comments:${issueId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `issue_id=eq.${issueId}`
        },
        (payload) => {
          const next = payload.new as Comment
          qc.setQueryData<Comment[]>(['comments', issueId], (prev) => {
            if (!prev) return [next]
            if (prev.some((c) => c.id === next.id)) return prev
            return [...prev, next]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [issueId, qc])
}
