import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ExpressShell } from "@/components/ExpressShell"
import { VisitorTracker } from "@/components/VisitorTracker"
import { supabase } from "@/lib/supabase"
import { Post } from "@/lib/supabase"

const SECTIONS = ["Featured", "Essays", "Insights"] as const

// Disable caching - always fetch fresh data
export const dynamic = 'force-dynamic'

export default async function ExpressHomePage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'Published')
    .order('published_at', { ascending: false })

  const publishedPosts = posts as Post[] || []
  const featuredPost = publishedPosts.find((post) => post.section === "Featured")

  return (
    <ExpressShell>
      <VisitorTracker pagePath="/" />
      <section className="mb-14 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-8 md:p-10">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cyan-300/90">Lead Story</p>
          <h2 className="mb-4 max-w-2xl text-3xl font-semibold leading-tight text-white md:text-5xl">
            {featuredPost?.title ?? "One mind. Many dimensions. Infinite expression."}
          </h2>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-neutral-300 md:text-lg">
            {featuredPost?.dek ??
              "Express is where I unfold the many layers of who I am—founder, creator, thinker, builder. A space for every dimension of my expression, unfiltered and unapologetic."}
          </p>
          {featuredPost ? (
            <Link
              href={`/${featuredPost.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white transition hover:border-cyan-300/70 hover:bg-cyan-300/10"
            >
              Read lead article
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">The Many of Me</p>
          <ul className="space-y-3 text-sm leading-relaxed text-neutral-300">
            <li>I am not one thing—I am many.</li>
            <li>Every thought deserves its own canvas.</li>
            <li>Expression without limitation.</li>
            <li>Authenticity over conformity.</li>
          </ul>
        </div>
      </section>

      {SECTIONS.map((section) => {
        const sectionPosts = publishedPosts.filter((post) => post.section === section)
        if (sectionPosts.length === 0) return null

        return (
          <section key={section} className="mb-14">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
              <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{section}</h3>
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                {sectionPosts.length} piece{sectionPosts.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {sectionPosts.map((post, index) => (
                <Link
                  href={`/${post.slug}`}
                  key={post.id}
                  className={`group rounded-2xl border border-white/10 p-6 transition hover:border-white/30 hover:bg-white/[0.03] ${
                    index === 0 ? "md:col-span-2" : ""
                  }`}
                >
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-300/80">{post.section}</p>
                  <h4 className="mb-3 max-w-3xl text-2xl font-medium leading-tight text-white transition group-hover:text-cyan-100">
                    {post.title}
                  </h4>
                  <p className="mb-5 max-w-2xl text-neutral-300">{post.dek}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-neutral-500">
                    <span>{post.reading_time}</span>
                    <span className="h-1 w-1 rounded-full bg-neutral-500" />
                    <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                    <span className="h-1 w-1 rounded-full bg-neutral-500" />
                    <span>{post.author}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </ExpressShell>
  )
}
