'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Sparkles, Trash2, ExternalLink, X, Lock, LogOut, Image as ImageIcon } from 'lucide-react'
import { ExpressShell } from '@/components/ExpressShell'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RichTextEditor } from '@/components/RichTextEditor'
import { Post } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/lib/posts'

const SECTIONS = ['Featured', 'Essays', 'Insights']

export default function ExpressAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [dek, setDek] = useState('')
  const [section, setSection] = useState('Essays')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth')
        const data = await res.json()
        setIsAuthenticated(data.authenticated)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError('')
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      
      if (data.success) {
        setIsAuthenticated(true)
        setPassword('')
      } else {
        setLoginError('Invalid password')
      }
    } catch {
      setLoginError('Login failed')
    } finally {
      setLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    setIsAuthenticated(false)
  }

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      if (Array.isArray(data)) {
        setPosts(data)
      } else if (Array.isArray(data.data)) {
        setPosts(data.data)
      } else {
        console.error('Invalid response format:', data)
        setPosts([])
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts()
    }
  }, [isAuthenticated, fetchPosts])

  const drafts = posts.filter(p => p.status === 'Draft')
  const published = posts.filter(p => p.status === 'Published')

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      post.title.toLowerCase().includes(query) ||
      post.section.toLowerCase().includes(query) ||
      post.tags?.some(t => t.toLowerCase().includes(query))
    )
  })

  const resetForm = () => {
    setTitle('')
    setDek('')
    setSection('Essays')
    setBody('')
    setTags('')
    setFeaturedImage('')
    setEditingPost(null)
    setIsCreating(false)
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setTitle(post.title)
    setDek(post.dek)
    setSection(post.section)
    setBody(post.body || '')
    setTags(post.tags?.join(', ') || '')
    setFeaturedImage(post.featured_image || '')
    setIsCreating(true)
  }

  const handleNew = () => {
    resetForm()
    setIsCreating(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName)

      setFeaturedImage(publicUrl)
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async (publish = false) => {
    const slug = editingPost?.slug || generateSlug(title)
    const postData = {
      title,
      dek,
      section,
      slug,
      body,
      featured_image: featuredImage,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status: publish ? 'Published' : 'Draft',
      published_at: publish ? new Date().toISOString() : null,
    }

    try {
      if (editingPost) {
        await fetch(`/api/posts/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        })
      } else {
        await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        })
      }
      await fetchPosts()
      resetForm()
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Published', published_at: new Date().toISOString() }),
      })
      await fetchPosts()
    } catch (error) {
      console.error('Failed to publish post:', error)
    }
  }

  const handleUnpublish = async (id: string) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Draft' }),
      })
      await fetchPosts()
    } catch (error) {
      console.error('Failed to unpublish post:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      await fetchPosts()
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  return (
    <ExpressShell>
      {/* Loading state */}
      {checkingAuth && (
        <div className="flex items-center justify-center py-20">
          <p className="text-neutral-400">Loading...</p>
        </div>
      )}

      {/* Login form */}
      {!checkingAuth && !isAuthenticated && (
        <div className="mx-auto max-w-md py-20">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="mb-6 flex items-center justify-center">
              <div className="rounded-full border border-cyan-300/30 bg-cyan-300/10 p-4">
                <Lock className="h-8 w-8 text-cyan-300" />
              </div>
            </div>
            <h2 className="mb-2 text-center text-2xl font-semibold text-white">Admin Access</h2>
            <p className="mb-6 text-center text-sm text-neutral-400">Enter password to access the workspace</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-white/15 bg-[#0b0f14] text-neutral-100"
              />
              {loginError && (
                <p className="text-sm text-red-400">{loginError}</p>
              )}
              <Button 
                type="submit" 
                disabled={loggingIn}
                className="w-full rounded-full bg-cyan-400/80 text-[#03131c] hover:bg-cyan-300"
              >
                {loggingIn ? 'Logging in...' : 'Enter Workspace'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Admin dashboard */}
      {!checkingAuth && isAuthenticated && (
        <>
          <section className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300/90">Creator Workspace</p>
              <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Editorial Control Room</h2>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleNew} className="rounded-full border border-cyan-300/40 bg-cyan-300/15 text-cyan-100 hover:bg-cyan-300/25">
                <Plus className="mr-2 h-4 w-4" />
                New draft
              </Button>
              <Button onClick={handleLogout} variant="outline" className="rounded-full border-white/20 bg-transparent text-neutral-100 hover:bg-white/10">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Published</p>
          <p className="mt-3 text-3xl font-semibold text-white">{published.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Drafts</p>
          <p className="mt-3 text-3xl font-semibold text-white">{drafts.length}</p>
        </div>
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/80">Identity Signal</p>
          <p className="mt-3 flex items-center gap-2 text-lg font-medium text-cyan-50">
            <Sparkles className="h-4 w-4" />
            Distinctive publication voice
          </p>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search by title, section, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-white/15 bg-[#0b0f14] pl-9 text-neutral-100 placeholder:text-neutral-500"
          />
        </label>
      </section>

      {isCreating && (
        <section className="mb-8 rounded-2xl border border-cyan-300/30 bg-cyan-300/5 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              {editingPost ? 'Edit Article' : 'Create New Article'}
            </h3>
            <Button variant="ghost" size="sm" onClick={resetForm} className="text-neutral-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <Input
              placeholder="Article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-white/15 bg-[#0b0f14] text-neutral-100"
            />
            
            {/* Featured Image Upload */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-400">Featured Image</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer rounded-full border border-white/15 bg-[#0b0f14] px-4 py-2 text-sm text-neutral-200 transition hover:border-white/40 hover:bg-white/5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </label>
                {featuredImage && (
                  <div className="flex items-center gap-2">
                    <img src={featuredImage} alt="Featured" className="h-12 w-12 rounded object-cover" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFeaturedImage('')}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="flex-1 rounded-md border border-white/15 bg-[#0b0f14] px-3 py-2 text-neutral-100"
              >
                {SECTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <Input
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="flex-1 border-white/15 bg-[#0b0f14] text-neutral-100"
              />
            </div>
            <Input
              placeholder="Article deck (subtitle)"
              value={dek}
              onChange={(e) => setDek(e.target.value)}
              className="border-white/15 bg-[#0b0f14] text-neutral-100"
            />
            <RichTextEditor
              content={body}
              onChange={setBody}
              placeholder="Write your article here..."
            />
          </div>
          
          <div className="mt-5 flex gap-3">
            <Button onClick={() => handleSave(false)} className="rounded-full bg-cyan-400/80 text-[#03131c] hover:bg-cyan-300">
              Save draft
            </Button>
            <Button onClick={() => handleSave(true)} className="rounded-full bg-emerald-400/80 text-[#03131c] hover:bg-emerald-300">
              Publish
            </Button>
            {editingPost && (
              <Button variant="outline" onClick={resetForm} className="rounded-full border-white/20 bg-transparent text-neutral-100 hover:bg-white/10">
                Cancel
              </Button>
            )}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h3 className="mb-5 text-lg font-medium text-white">Manage Content</h3>
        {loading ? (
          <p className="text-neutral-400">Loading posts...</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-neutral-400">No posts found.</p>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl border border-white/10 bg-[#0b0f14] p-4 transition hover:border-white/25"
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-sm uppercase tracking-[0.14em] text-neutral-500">{post.section}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs uppercase tracking-[0.13em] ${
                      post.status === 'Published'
                        ? 'border border-emerald-300/35 bg-emerald-300/10 text-emerald-100'
                        : 'border border-amber-300/35 bg-amber-300/10 text-amber-100'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <h4 className="mb-2 text-lg font-medium text-white">{post.title}</h4>
                <p className="mb-4 text-sm text-neutral-400">{post.dek}</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                    className="rounded-full border-white/20 bg-transparent text-neutral-100 hover:bg-white/10"
                  >
                    Edit
                  </Button>
                  {post.status === 'Published' && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="rounded-full border-white/20 bg-transparent text-neutral-100 hover:bg-white/10"
                    >
                      <a href={`/${post.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Preview
                      </a>
                    </Button>
                  )}
                  {post.status === 'Draft' ? (
                    <Button 
                      size="sm" 
                      onClick={() => handlePublish(post.id)}
                      className="rounded-full bg-cyan-400/80 text-[#03131c] hover:bg-cyan-300"
                    >
                      Publish
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnpublish(post.id)}
                      className="rounded-full border-amber-300/30 bg-amber-300/10 text-amber-100 hover:bg-amber-300/20"
                    >
                      Unpublish
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="rounded-full border-red-300/30 bg-red-300/10 text-red-100 hover:bg-red-300/20"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
        </>
      )}
    </ExpressShell>
  )
}
