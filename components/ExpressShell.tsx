import Link from "next/link"
import { Sparkles } from "lucide-react"

type ExpressShellProps = {
  children: React.ReactNode
}

export function ExpressShell({ children }: ExpressShellProps) {
  return (
    <main className="min-h-screen bg-[#080a0d] text-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10 md:px-10">
        <header className="mb-14 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <Sparkles className="h-4 w-4 text-cyan-300" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">Digital Publication</p>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Express</h1>
              </div>
            </Link>
          </div>
        </header>
        {children}
      </div>
    </main>
  )
}
