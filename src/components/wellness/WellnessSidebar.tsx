'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

interface MenuItem {
  title: string
  icon: string
  href?: string
  color?: string
  badge?: number
}

interface MenuSection {
  title: string
  icon: string
  href?: string
  color?: string
  items?: MenuItem[]
}

interface WellnessSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function WellnessSidebar({ isMobileOpen = false, onMobileClose }: WellnessSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (section: string) => {
    const sectionId = section.toLowerCase().replace(/\s+/g, '-')
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    )
  }

  const menuItems: MenuSection[] = [
    {
      title: 'Home',
      icon: '🏠',
      href: '/pt/wellness/home',
      color: 'gray'
    },
    {
      title: 'Meus Links',
      icon: '🔗',
      href: '/pt/wellness/links',
      color: 'green'
    },
    {
      title: 'Fluxos & Ações',
      icon: '🔄',
      color: 'green',
      href: '/pt/wellness/fluxos', // Link direto para a página principal
      items: [
        { title: 'Todos os Fluxos', icon: '📋', href: '/pt/wellness/fluxos' },
        { title: 'Ação Diária', icon: '⚡', href: '/pt/wellness/fluxos/acao-diaria' },
        { title: 'Vendas', icon: '💰', href: '/pt/wellness/fluxos/vendas' },
        { title: 'Acompanhamento', icon: '👥', href: '/pt/wellness/fluxos/acompanhamento' },
        { title: 'Apresentação', icon: '🎯', href: '/pt/wellness/fluxos/apresentacao' },
        { title: 'Treino Novos', icon: '🎓', href: '/pt/wellness/fluxos/treino-novos' }
      ]
    },
    {
      title: 'Biblioteca',
      icon: '📚',
      color: 'orange',
      href: '/pt/wellness/biblioteca', // Link direto para a página principal
      items: [
        { title: 'Materiais', icon: '📄', href: '/pt/wellness/biblioteca/materiais' },
        { title: 'Cartilhas', icon: '📖', href: '/pt/wellness/biblioteca/cartilhas' },
        { title: 'Produtos', icon: '🥤', href: '/pt/wellness/biblioteca/produtos' },
        { title: 'Scripts', icon: '💬', href: '/pt/wellness/biblioteca/scripts' },
        { title: 'Vídeos', icon: '🎥', href: '/pt/wellness/biblioteca/videos' }
      ]
    },
    {
      title: 'Mentoria NOEL',
      icon: '🤖',
      href: '/pt/wellness/noel',
      color: 'blue'
    },
    {
      title: 'Comunidade',
      icon: '🏘️',
      href: '/pt/wellness/comunidade',
      color: 'green'
    },
    {
      title: 'Treinos & Plano',
      icon: '🎯',
      color: 'purple',
      href: '/pt/wellness/treinos', // Link direto para a página principal
      items: [
        { title: 'Treino 2-5-10', icon: '⚡', href: '/pt/wellness/treinos/2-5-10' },
        { title: 'Filosofia YLADA', icon: '✨', href: '/pt/wellness/treinos/filosofia' },
        { title: 'Liderança', icon: '👑', href: '/pt/wellness/treinos/lideranca' },
        { title: 'Plano Presidente', icon: '🏆', href: '/pt/wellness/treinos/plano-presidente' }
      ]
    },
    {
      title: 'Minha Conta',
      icon: '⚙️',
      color: 'gray',
      href: '/pt/wellness/conta', // Link direto para a página principal
      items: [
        { title: 'Perfil', icon: '👤', href: '/pt/wellness/conta/perfil' },
        { title: 'Metas', icon: '🎯', href: '/pt/wellness/conta/metas' },
        { title: 'Vendas', icon: '💰', href: '/pt/wellness/conta/vendas' },
        { title: 'Materiais', icon: '📥', href: '/pt/wellness/conta/materiais' },
        { title: 'Histórico NOEL', icon: '💬', href: '/pt/wellness/conta/historico' },
        { title: 'Configurações', icon: '⚙️', href: '/pt/wellness/configuracao' }
      ]
    }
  ]

  const getColorClasses = (color?: string, isActive?: boolean) => {
    if (!color) return { bg: '', text: '' }
    
    const colors: Record<string, { bg: string; text: string }> = {
      green: { bg: isActive ? 'bg-green-100' : 'bg-green-50', text: 'text-green-700' },
      orange: { bg: isActive ? 'bg-orange-100' : 'bg-orange-50', text: 'text-orange-700' },
      blue: { bg: isActive ? 'bg-blue-100' : 'bg-blue-50', text: 'text-blue-700' },
      purple: { bg: isActive ? 'bg-purple-100' : 'bg-purple-50', text: 'text-purple-700' },
      gray: { bg: isActive ? 'bg-gray-100' : 'bg-gray-50', text: 'text-gray-700' }
    }
    
    return colors[color] || { bg: '', text: '' }
  }

  const isSectionActive = (item: MenuSection): boolean => {
    if (item.href && pathname === item.href) return true
    if (item.items) {
      return item.items.some(subItem => subItem.href === pathname)
    }
    return false
  }

  const isItemActive = (href?: string): boolean => {
    return href ? pathname === href : false
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/pt')
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          <Link href="/pt/wellness/home" className="flex items-center">
            <Image
              src="/images/logo/wellness-horizontal.png"
              alt="WELLNESS"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <button
            onClick={onMobileClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map((item) => {
            const sectionId = item.title.toLowerCase().replace(/\s+/g, '-')
            const isExpanded = expandedSections.includes(sectionId)
            const isHovered = hoveredSection === sectionId
            const sectionIsActive = isSectionActive(item)
            const colors = getColorClasses(item.color, sectionIsActive)

            // Se tem subitens, mostrar dropdown
            if (item.items && item.items.length > 0) {
              return (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => setHoveredSection(sectionId)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <div className="flex items-center gap-1">
                    {/* Link direto para o item principal se tiver href */}
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          // Se clicar no link principal, não expandir (só navegar)
                          // Mas permitir que o botão de expandir funcione
                          onMobileClose?.()
                        }}
                        className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                          sectionIsActive || isHovered
                            ? `${colors.bg} ${colors.text} font-medium`
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        <span className="flex-1 text-left truncate">{item.title}</span>
                      </Link>
                    ) : (
                      <span className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                        sectionIsActive || isHovered
                          ? `${colors.bg} ${colors.text} font-medium`
                          : 'text-gray-700'
                      }`}>
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        <span className="flex-1 text-left truncate">{item.title}</span>
                      </span>
                    )}
                    {/* Botão para expandir/recolher */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleSection(sectionId)
                      }}
                      onMouseEnter={(e) => {
                        // Manter hover ao passar mouse sobre a seta
                        e.stopPropagation()
                      }}
                      className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                        sectionIsActive || isHovered
                          ? `${colors.bg} ${colors.text}`
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                      title={isExpanded ? 'Recolher' : 'Expandir'}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Subitens */}
                  {(isHovered || isExpanded) && (
                    <div className={`
                      mt-1 space-y-1
                      ${isExpanded 
                        ? 'block' // Se expandido via clique, sempre mostrar embaixo
                        : isHovered 
                          ? 'lg:absolute lg:left-full lg:ml-2 lg:top-0 lg:bg-white lg:border lg:border-gray-200 lg:rounded-lg lg:shadow-lg lg:p-2 lg:min-w-[200px] lg:z-50' // Hover no desktop mostra popup
                          : 'hidden'
                      }
                    `}>
                      {item.items.map((subItem) => {
                        const subItemActive = isItemActive(subItem.href)
                        return (
                          <Link
                            key={subItem.title}
                            href={subItem.href || '#'}
                            onClick={onMobileClose}
                            className={`
                              flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                              ${subItemActive
                                ? `${colors.bg} ${colors.text} font-medium`
                                : 'text-gray-600 hover:bg-gray-50'
                              }
                            `}
                          >
                            <span className="text-base">{subItem.icon}</span>
                            <span className="flex-1">{subItem.title}</span>
                            {subItem.badge && (
                              <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            // Item simples (sem subitens)
            const itemActive = isItemActive(item.href)
            return (
              <Link
                key={item.title}
                href={item.href || '#'}
                onClick={onMobileClose}
                className={`
                  flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all
                  ${itemActive
                    ? `${colors.bg} ${colors.text} font-medium`
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1">{item.title}</span>
              </Link>
            )
          })}

          {/* Logout */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <span className="text-lg">🚪</span>
              <span>Sair</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}
