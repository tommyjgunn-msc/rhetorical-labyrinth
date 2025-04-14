// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Rhetorical Labyrinth',
  description: 'An escape room experience where students solve rhetorical puzzles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}