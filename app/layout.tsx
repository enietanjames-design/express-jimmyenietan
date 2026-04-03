import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Express | The Many Dimensions of Me",
  description: "A space where I unfold the many layers of who I am—founder, creator, thinker, builder. Every dimension of my expression, unfiltered and unapologetic.",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
