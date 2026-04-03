import { notFound } from "next/navigation"
import { ExpressShell } from "@/components/ExpressShell"
import { supabase } from "@/lib/supabase"
import { Post } from "@/lib/supabase"

// Disable caching - always fetch fresh data
export const dynamic = 'force-dynamic'

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'Published')
    .single()

  if (!post) {
    notFound()
  }

  const article = post as Post

  return (
    <ExpressShell>
      <article className="mx-auto max-w-3xl">
        <header className="mb-10 border-b border-white/10 pb-8">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-cyan-300/90">{article.section}</p>
          <h2 className="mb-5 text-4xl font-semibold leading-tight text-white md:text-5xl">{article.title}</h2>
          <p className="mb-6 text-lg leading-relaxed text-neutral-300">{article.dek}</p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.13em] text-neutral-500">
            <span>{article.author}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-500" />
            <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-500" />
            <span>{article.reading_time}</span>
          </div>
        </header>

        <div 
          className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-neutral-200 prose-a:text-cyan-300"
          dangerouslySetInnerHTML={{ __html: article.body || '' }} 
        />

        <footer className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-wrap gap-2">
            {article.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.13em] text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </footer>
      </article>
    </ExpressShell>
  )
}

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'Published')

  return (posts || []).map((post) => ({
    slug: post.slug,
  }))
}
