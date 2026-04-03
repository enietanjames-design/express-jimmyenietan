export type ExpressSection = "Featured" | "Essays" | "Insights"
export type ExpressStatus = "Published" | "Draft"

export type ExpressPost = {
  slug: string
  title: string
  dek: string
  section: ExpressSection
  status: ExpressStatus
  readingTime: string
  publishedAt: string
  author: string
  tags: string[]
  body: string[]
}

export const expressPosts: ExpressPost[] = [
  {
    slug: "the-age-of-deliberate-builders",
    title: "The Age of Deliberate Builders",
    dek: "Velocity is cheap. Intention is rare. What wins now is craftsmanship at startup speed.",
    section: "Featured",
    status: "Published",
    readingTime: "8 min read",
    publishedAt: "Mar 30, 2026",
    author: "Jimmy Enietan",
    tags: ["Identity", "Craft", "Strategy"],
    body: [
      "The internet no longer rewards noise by default. It rewards people who can design, ship, and explain with precision. That means deliberate builders are becoming the new operators.",
      "Deliberate work is not slow work. It is directional work. Every page, line, and interaction should reveal intent, not trend-following.",
      "When a product reads like everybody else, it disappears. When it feels authored, it compounds trust.",
      "This is the central thesis of Express: publication as product, writing as interface, and clarity as leverage.",
    ],
  },
  {
    slug: "editorial-systems-for-modern-founders",
    title: "Editorial Systems for Modern Founders",
    dek: "A publication cadence is not about posting more; it is about creating a repeatable authority engine.",
    section: "Essays",
    status: "Published",
    readingTime: "6 min read",
    publishedAt: "Mar 21, 2026",
    author: "Jimmy Enietan",
    tags: ["Founders", "Content", "Systems"],
    body: [
      "Most founders treat content like promotion. The strongest founders treat content like infrastructure.",
      "An editorial system maps topics to outcomes: trust, demand, hiring quality, and category positioning.",
      "The key is distinction. A recognizable voice, a clear lens, and a consistent publishing rhythm.",
      "Once the system is real, each post becomes an asset instead of a one-time announcement.",
    ],
  },
  {
    slug: "signal-density-in-product-writing",
    title: "Signal Density in Product Writing",
    dek: "Say less, mean more: why dense clarity outperforms verbose copy in high-stakes digital products.",
    section: "Insights",
    status: "Draft",
    readingTime: "4 min read",
    publishedAt: "Apr 05, 2026",
    author: "Jimmy Enietan",
    tags: ["UX Writing", "Product", "Clarity"],
    body: [
      "Every sentence in product writing should carry decision value. If not, it is decoration.",
      "Signal density improves when copy aligns with user intent, not internal process language.",
      "Strong copy does not impress. It orients. It reduces cognitive cost and increases confidence.",
      "In premium products, language is a design material, not a final pass.",
    ],
  },
  {
    slug: "designing-for-authority-not-attention",
    title: "Designing for Authority, Not Attention",
    dek: "Attention spikes are temporary. Authority compounds when form and message remain coherent.",
    section: "Insights",
    status: "Published",
    readingTime: "5 min read",
    publishedAt: "Mar 12, 2026",
    author: "Jimmy Enietan",
    tags: ["Design", "Authority", "Brand"],
    body: [
      "Attention-seeking interfaces optimize for reaction. Authority-led interfaces optimize for trust.",
      "Authority is built through consistency in typography, spacing, pacing, and language.",
      "A premium publication does not need excess visuals. It needs confidence in hierarchy and tone.",
      "That confidence is visible long before a user reads the first full paragraph.",
    ],
  },
]

export const publicationSections: ExpressSection[] = ["Featured", "Essays", "Insights"]
