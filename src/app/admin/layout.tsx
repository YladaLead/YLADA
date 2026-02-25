import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'

export const metadata: Metadata = {
  manifest: '/manifest-admin.json',
  icons: {
    icon: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
    apple: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
  },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Barra fixa: acesso rápido a Presidentes em qualquer página admin */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-center gap-6 shadow-sm">
        <Link
          href="/admin"
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/presidentes"
          className="text-sm font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors"
        >
          🏆 Presidentes
        </Link>
      </div>
      {children}
    </>
  )
}

