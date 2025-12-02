'use client'

import { usePathname } from 'next/navigation'
import NutriSidebar from './NutriSidebar'
import { useState } from 'react'

interface ConditionalSidebarProps {
  children: React.ReactNode
}

export default function ConditionalSidebar({ children }: ConditionalSidebarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Esconder sidebar em rotas de formacao
  const isFormacaoRoute = pathname?.startsWith('/pt/nutri/formacao')

  if (isFormacaoRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NutriSidebar 
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 lg:ml-56">
        {children}
      </div>
    </div>
  )
}

