import { notFound } from "next/navigation"
import { ExpressShell } from "@/components/ExpressShell"
import { expressPosts } from "@/data/express-posts"

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const post = expressPosts.find((item) => item.slug === slug && item.status === "Published")

  if (!post) {
    notFound()
  }

  return (
    <ExpressShell>
      <article className="mx-auto max-w-3xl">
        <header className="mb-10 border-b border-white/10 pb-8">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-cyan-300/90">{post.section}</p>
          <h2 className="mb-5 text-4xl font-semibold leading-tight text-white md:text-5xl">{post.title}</h2>
          <p className="mb-6 text-lg leading-relaxed text-neutral-300">{post.dek}</p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.13em] text-neutral-500">
            <span>{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-500" />
            <span>{post.publishedAt}</span>
            <span className="h-1 w-1 rounded-full bg-neutral-500" />
            <span>{post.readingTime}</span>
          </div>
        </header>

        <div className="space-y-6 text-[1.05rem] leading-8 text-neutral-200">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <footer className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
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

export function generateStaticParams() {
  return expressPosts
    .filter((post) => post.status === "Published")
    .map((post) => ({
      slug: post.slug,
    }))
}
