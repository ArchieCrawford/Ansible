'use client'

import { useState } from 'react'
import { useComments, useCreateComment } from '@/lib/hooks/useApi'
import { useRealtimeComments } from '@/lib/hooks/useRealtimeComments'
import { useUIStore } from '@/store/ui-store'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function Comments({ issueId }: { issueId: string }) {
  const { data: comments = [], isLoading } = useComments(issueId)
  const create = useCreateComment(issueId)
  const guestName = useUIStore((s) => s.guestName)
  const [message, setMessage] = useState('')

  useRealtimeComments(issueId)

  async function submit() {
    const text = message.trim()
    if (!text) return
    setMessage('')
    await create.mutateAsync({
      issue_id: issueId,
      author: guestName || 'Guest',
      message: text
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Comments
      </h3>

      <div className="space-y-2">
        {isLoading && (
          <div className="h-10 animate-pulse rounded-lg bg-muted" />
        )}
        {!isLoading && comments.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-medium">{c.author}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(c.created_at).toLocaleString()}
              </span>
            </div>
            <p className="mt-1 whitespace-pre-wrap">{c.message}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder={`Comment as ${guestName || 'Guest'}…`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex justify-end">
          <Button onClick={submit} disabled={create.isPending || !message.trim()}>
            {create.isPending ? 'Posting…' : 'Post comment'}
          </Button>
        </div>
      </div>
    </div>
  )
}
