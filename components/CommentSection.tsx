'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Comment } from '@/lib/supabase'

type CommentSectionProps = {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?post_id=${postId}`)
      const data = await res.json()
      setComments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !content.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          author_name: authorName.trim(),
          author_email: authorEmail.trim() || null,
          content: content.trim(),
        }),
      })
      const newComment = await res.json()
      if (newComment.id) {
        setComments([newComment, ...comments])
        setAuthorName('')
        setAuthorEmail('')
        setContent('')
      }
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <section className="mt-12 border-t border-white/10 pt-8">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-medium text-white">
        <MessageCircle className="h-5 w-5" />
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            placeholder="Your name *"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className="border-white/15 bg-[#0b0f14] text-neutral-100"
          />
          <Input
            type="email"
            placeholder="Email (optional)"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            className="border-white/15 bg-[#0b0f14] text-neutral-100"
          />
        </div>
        <textarea
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          className="w-full rounded-md border border-white/15 bg-[#0b0f14] px-3 py-2 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
        />
        <Button
          type="submit"
          disabled={submitting || !authorName.trim() || !content.trim()}
          className="rounded-full bg-cyan-400/80 text-[#03131c] hover:bg-cyan-300"
        >
          <Send className="mr-2 h-4 w-4" />
          {submitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>

      {/* Comments list */}
      {loading ? (
        <p className="text-neutral-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-neutral-400">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-white">{comment.author_name}</span>
                <span className="text-xs text-neutral-500">{formatDate(comment.created_at)}</span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-300">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
