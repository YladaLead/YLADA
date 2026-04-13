import type { ReactNode } from 'react'
import { ProLideresHeader } from '@/components/pro-lideres/ProLideresHeader'

export default function ProLideresSiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <ProLideresHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
