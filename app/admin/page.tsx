import { Plus, Search, Sparkles } from "lucide-react"
import { ExpressShell } from "@/components/ExpressShell"
import { expressPosts } from "@/data/express-posts"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ExpressAdminPage() {
  const drafts = expressPosts.filter((post) => post.status === "Draft")
  const published = expressPosts.filter((post) => post.status === "Published")

  return (
    <ExpressShell>
      <section className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300/90">Creator Workspace</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Editorial Control Room</h2>
        </div>
        <Button className="rounded-full border border-cyan-300/40 bg-cyan-300/15 text-cyan-100 hover:bg-cyan-300/25">
          <Plus className="mr-2 h-4 w-4" />
          New draft
        </Button>
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
            className="border-white/15 bg-[#0b0f14] pl-9 text-neutral-100 placeholder:text-neutral-500"
          />
        </label>
      </section>

      <section className="mb-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-5 text-lg font-medium text-white">Manage Content</h3>
          <div className="space-y-3">
            {expressPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-xl border border-white/10 bg-[#0b0f14] p-4 transition hover:border-white/25"
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-sm uppercase tracking-[0.14em] text-neutral-500">{post.section}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs uppercase tracking-[0.13em] ${
                      post.status === "Published"
                        ? "border border-emerald-300/35 bg-emerald-300/10 text-emerald-100"
                        : "border border-amber-300/35 bg-amber-300/10 text-amber-100"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <h4 className="mb-2 text-lg font-medium text-white">{post.title}</h4>
                <p className="mb-4 text-sm text-neutral-400">{post.dek}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-white/20 bg-transparent text-neutral-100 hover:bg-white/10"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-white/20 bg-transparent text-neutral-100 hover:bg-white/10"
                  >
                    Preview
                  </Button>
                  {post.status === "Draft" ? (
                    <Button size="sm" className="rounded-full bg-cyan-400/80 text-[#03131c] hover:bg-cyan-300">
                      Publish
                    </Button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-5 text-lg font-medium text-white">Compose / Edit</h3>
          <div className="space-y-4">
            <Input
              placeholder="Article title"
              defaultValue={expressPosts[0]?.title}
              className="border-white/15 bg-[#0b0f14] text-neutral-100"
            />
            <Input
              placeholder="Section (Featured, Essays, Insights)"
              defaultValue={expressPosts[0]?.section}
              className="border-white/15 bg-[#0b0f14] text-neutral-100"
            />
            <Textarea
              placeholder="Article deck"
              defaultValue={expressPosts[0]?.dek}
              className="min-h-20 border-white/15 bg-[#0b0f14] text-neutral-100"
            />
            <Textarea
              placeholder="Write the full article..."
              defaultValue={expressPosts[0]?.body.join("\n\n")}
              className="min-h-52 border-white/15 bg-[#0b0f14] text-neutral-100"
            />
          </div>
          <div className="mt-5 flex gap-3">
            <Button className="rounded-full bg-cyan-400/80 text-[#03131c] hover:bg-cyan-300">Save draft</Button>
            <Button
              variant="outline"
              className="rounded-full border-white/20 bg-transparent text-neutral-100 hover:bg-white/10"
            >
              Schedule
            </Button>
          </div>
        </div>
      </section>
    </ExpressShell>
  )
}
