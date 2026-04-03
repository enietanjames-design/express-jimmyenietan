import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Express | Digital Publication",
  description: "A minimalist editorial publication for founders, creators, and product leaders building authority through craft.",
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
