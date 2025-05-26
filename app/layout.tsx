import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CNOS',
  description: 'Chris Nikhils Operating System',
  generator: 'Chris Nikhil',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
