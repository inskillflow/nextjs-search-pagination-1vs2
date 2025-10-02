import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'API Articles Next.js 15',
  description: 'API CRUD complète pour articles avec Next.js 15'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
      {children}
    
  )
}