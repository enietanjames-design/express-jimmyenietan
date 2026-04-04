'use client'

import { useState } from 'react'
import { Heart, Share2, Twitter, Facebook, Linkedin, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PostActionsProps = {
  postTitle: string
  postId: string
}

export function PostActions({ postTitle, postId }: PostActionsProps) {
  const [showShare, setShowShare] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = postTitle

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied to clipboard!')
    setShowShare(false)
  }

  const handleLike = () => {
    if (!liked) {
      setLiked(true)
      setLikeCount(prev => prev + 1)
    } else {
      setLiked(false)
      setLikeCount(prev => Math.max(0, prev - 1))
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* Like Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`gap-2 rounded-full border ${liked ? 'border-red-400/50 bg-red-400/10 text-red-300' : 'border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'}`}
      >
        <Heart className={`h-4 w-4 ${liked ? 'fill-red-400' : ''}`} />
        {likeCount > 0 && <span>{likeCount}</span>}
      </Button>

      {/* Share Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowShare(!showShare)}
          className="gap-2 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        
        {showShare && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowShare(false)}
            />
            {/* Share Modal */}
            <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex gap-3 rounded-xl border border-white/10 bg-[#0b0f14] p-4 shadow-xl">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowShare(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10"
                title="Share on Twitter"
              >
                <Twitter className="h-6 w-6 text-neutral-300" />
              </a>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowShare(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10"
                title="Share on Facebook"
              >
                <Facebook className="h-6 w-6 text-neutral-300" />
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowShare(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10"
                title="Share on LinkedIn"
              >
                <Linkedin className="h-6 w-6 text-neutral-300" />
              </a>
              <button
                onClick={copyToClipboard}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10"
                title="Copy link"
              >
                <Link2 className="h-6 w-6 text-neutral-300" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
