'use client'

import { useEffect } from 'react'

type VisitorTrackerProps = {
  postId?: string
  pagePath: string
}

export function VisitorTracker({ postId, pagePath }: VisitorTrackerProps) {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            post_id: postId || null,
            page_path: pagePath,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent || null,
          }),
        })
      } catch (error) {
        console.error('Failed to track visit:', error)
      }
    }

    trackVisit()
  }, [postId, pagePath])

  return null
}
