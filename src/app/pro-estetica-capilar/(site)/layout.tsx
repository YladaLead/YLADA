import type { ReactNode } from 'react'
import { ProEsteticaCapilarHeader } from '@/components/pro-estetica-capilar/ProEsteticaCapilarHeader'

export default function ProEsteticaCapilarSiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <ProEsteticaCapilarHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
