'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, Reply, Heart, ThumbsUp, Laugh, Angry, Share2, X, Twitter, Facebook, Linkedin, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Comment, Reaction } from '@/lib/supabase'

type CommentSectionProps = {
  postId: string
  postTitle?: string
}

const REACTION_EMOJIS = [
  { type: 'like', icon: ThumbsUp, label: 'Like' },
  { type: 'love', icon: Heart, label: 'Love' },
  { type: 'laugh', icon: Laugh, label: 'Funny' },
  { type: 'angry', icon: Angry, label: 'Angry' },
]

export function CommentSection({ postId, postTitle }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [content, setContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [replyAuthorName, setReplyAuthorName] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  const [reactions, setReactions] = useState<Record<string, Reaction[]>>({})
  const [showReactions, setShowReactions] = useState<string | null>(null)
  const [showShare, setShowShare] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?post_id=${postId}`)
      const data = await res.json()
      setComments(Array.isArray(data) ? data : [])
      
      // Fetch reactions for each comment
      const commentIds = (data || []).map((c: Comment) => c.id)
      if (commentIds.length > 0) {
        const reactionsData: Record<string, Reaction[]> = {}
        await Promise.all(commentIds.map(async (id: string) => {
          const r = await fetch(`/api/reactions?comment_id=${id}`)
          const rd = await r.json()
          reactionsData[id] = Array.isArray(rd) ? rd : []
        }))
        setReactions(reactionsData)
      }
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

  const handleReply = async (parentId: string) => {
    if (!replyAuthorName.trim() || !replyContent.trim()) return

    setSubmittingReply(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          author_name: replyAuthorName.trim(),
          content: replyContent.trim(),
          parent_id: parentId,
        }),
      })
      const newComment = await res.json()
      if (newComment.id) {
        setComments([newComment, ...comments])
        setReplyingTo(null)
        setReplyContent('')
        setReplyAuthorName('')
      }
    } catch (error) {
      console.error('Failed to submit reply:', error)
    } finally {
      setSubmittingReply(false)
    }
  }

  const handleReaction = async (commentId: string, reactionType: string) => {
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment_id: commentId,
          reaction_type: reactionType,
        }),
      })
      fetchComments()
    } catch (error) {
      console.error('Failed to add reaction:', error)
    }
    setShowReactions(null)
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = postTitle || 'Check out this post on Express'

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied!')
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

  // Get root comments (no parent)
  const rootComments = comments.filter(c => !c.parent_id)
  // Get replies for a comment
  const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId)

  const getReactionCount = (commentId: string, type: string) => {
    return (reactions[commentId] || []).filter(r => r.reaction_type === type).length
  }

  return (
    <section className="mt-12 border-t border-white/10 pt-8">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-medium text-white">
        <MessageCircle className="h-5 w-5" />
        Comments ({comments.filter(c => !c.parent_id).length})
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
      ) : rootComments.length === 0 ? (
        <p className="text-neutral-400">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {rootComments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-white">{comment.author_name}</span>
                  <span className="text-xs text-neutral-500">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-sm leading-relaxed text-neutral-300">{comment.content}</p>
                
                {/* Actions */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {/* Reply button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo?.id === comment.id ? null : comment)}
                    className="h-7 px-2 text-xs text-neutral-400 hover:text-white"
                  >
                    <Reply className="mr-1 h-3 w-3" />
                    Reply
                  </Button>
                  
                  {/* Reactions */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReactions(showReactions === comment.id ? null : comment.id)}
                      className="h-7 px-2 text-xs text-neutral-400 hover:text-white"
                    >
                      <Heart className="mr-1 h-3 w-3" />
                      React
                    </Button>
                    {showReactions === comment.id && (
                      <div className="absolute left-0 top-8 z-10 flex gap-1 rounded-lg border border-white/10 bg-[#0b0f14] p-2">
                        {REACTION_EMOJIS.map(({ type, icon: Icon, label }) => (
                          <button
                            key={type}
                            onClick={() => handleReaction(comment.id, type)}
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
                            title={label}
                          >
                            <Icon className="h-4 w-4 text-neutral-300" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Share */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowShare(showShare === comment.id ? null : comment.id)}
                      className="h-7 px-2 text-xs text-neutral-400 hover:text-white"
                    >
                      <Share2 className="mr-1 h-3 w-3" />
                      Share
                    </Button>
                    {showShare === comment.id && (
                      <div className="absolute left-0 top-8 z-10 flex gap-2 rounded-lg border border-white/10 bg-[#0b0f14] p-2">
                        <a href={shareLinks.twitter} target="_blank" rel="noopener" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
                          <Twitter className="h-4 w-4 text-neutral-300" />
                        </a>
                        <a href={shareLinks.facebook} target="_blank" rel="noopener" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
                          <Facebook className="h-4 w-4 text-neutral-300" />
                        </a>
                        <a href={shareLinks.linkedin} target="_blank" rel="noopener" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
                          <Linkedin className="h-4 w-4 text-neutral-300" />
                        </a>
                        <button onClick={copyToClipboard} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
                          <Link2 className="h-4 w-4 text-neutral-300" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Reaction counts */}
                  <div className="flex gap-1">
                    {REACTION_EMOJIS.map(({ type, icon: Icon }) => {
                      const count = getReactionCount(comment.id, type)
                      if (count === 0) return null
                      return (
                        <span key={type} className="flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-xs text-neutral-300">
                          <Icon className="h-3 w-3" />
                          {count}
                        </span>
                      )
                    })}
                  </div>
                </div>
                
                {/* Reply form */}
                {replyingTo?.id === comment.id && (
                  <div className="mt-3 rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-cyan-100">Replying to {comment.author_name}</span>
                      <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)} className="h-6 w-6 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Your name *"
                      value={replyAuthorName}
                      onChange={(e) => setReplyAuthorName(e.target.value)}
                      className="mb-2 border-white/15 bg-[#0b0f14] text-sm text-neutral-100"
                    />
                    <textarea
                      placeholder="Write your reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={2}
                      className="mb-2 w-full rounded-md border border-white/15 bg-[#0b0f14] px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleReply(comment.id)}
                      disabled={submittingReply || !replyAuthorName.trim() || !replyContent.trim()}
                      className="rounded-full bg-cyan-400/80 text-xs text-[#03131c] hover:bg-cyan-300"
                    >
                      {submittingReply ? 'Posting...' : 'Post Reply'}
                    </Button>
                  </div>
                )}
                
                {/* Replies */}
                {getReplies(comment.id).length > 0 && (
                  <div className="mt-3 space-y-2 border-l-2 border-white/10 pl-4">
                    {getReplies(comment.id).map((reply) => (
                      <div key={reply.id} className="rounded-lg border border-white/10 bg-[#0b0f14] p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-white">{reply.author_name}</span>
                          <span className="text-xs text-neutral-500">{formatDate(reply.created_at)}</span>
                        </div>
                        <p className="text-sm text-neutral-300">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
