'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import WellnessSidebar from './WellnessSidebar'

interface ConditionalWellnessSidebarProps {
  children: React.ReactNode
}

export default function ConditionalWellnessSidebar({ children }: ConditionalWellnessSidebarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Esconder sidebar em rotas específicas (se necessário no futuro)
  const hideSidebarRoutes = [
    '/pt/wellness/login',
    '/pt/wellness/recuperar-senha',
    '/pt/wellness/recuperar-acesso'
  ]

  const shouldHideSidebar = hideSidebarRoutes.some(route => pathname?.startsWith(route))

  if (shouldHideSidebar) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <WellnessSidebar
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      {/* Em mobile: pl-14 reserva espaço para o botão hambúrguer (evita sobrepor o título) */}
      <div className="flex-1 lg:ml-64 pl-14 lg:pl-0 min-w-0">
        {/* Mobile menu button — alinhado à esquerda; conteúdo tem padding para não sobrepor */}
        <div className="lg:hidden fixed top-4 left-4 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="bg-white p-2 rounded-lg shadow-md border border-gray-200"
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
