'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface MenuItem {
  title: string
  icon: string
  href: string
  badge?: number
}

interface MenuSection {
  title: string
  icon: string
  href?: string
  items?: MenuItem[]
  color: string
}

interface NutriSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function NutriSidebar({ isMobileOpen = false, onMobileClose }: NutriSidebarProps) {
  const pathname = usePathname()
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
      href: '/pt/nutri/home',
      color: 'gray'
    },
    {
      title: 'Jornada 30 Dias',
      icon: '📘',
      href: '/pt/nutri/metodo/jornada',
      color: 'blue'
    },
    {
      title: 'Pilares do Método',
      icon: '📚',
      href: '/pt/nutri/metodo/pilares',
      color: 'purple'
    },
    {
      title: 'Ferramentas',
      icon: '🧰',
      color: 'blue',
      items: [
        { title: 'Meus Links', icon: '🔗', href: '/pt/nutri/ferramentas' },
        { title: 'Criar Fluxo', icon: '➕', href: '/pt/nutri/ferramentas/nova' },
        { title: 'Criar Quiz', icon: '🎯', href: '/pt/nutri/quiz-personalizado' },
        { title: 'Templates', icon: '🎨', href: '/pt/nutri/ferramentas/templates' },
        { title: 'Quizzes', icon: '📝', href: '/pt/nutri/quizzes' },
      ]
    },
    {
      title: 'Gestão GSAL',
      icon: '📊',
      color: 'green',
      href: '/pt/nutri/gsal',
      items: [
        { title: 'Painel GSAL', icon: '📊', href: '/pt/nutri/gsal' },
        { title: 'Clientes', icon: '👤', href: '/pt/nutri/clientes' },
        { title: 'Kanban', icon: '🗂️', href: '/pt/nutri/clientes/kanban' },
        { title: 'Acompanhamento', icon: '📊', href: '/pt/nutri/acompanhamento' },
        { title: 'Rotina Mínima', icon: '⚡', href: '/pt/nutri/metodo/painel/diario' },
        { title: 'Métricas', icon: '📈', href: '/pt/nutri/relatorios-gestao' },
      ]
    },
    {
      title: 'Biblioteca',
      icon: '🎒',
      href: '/pt/nutri/metodo/manual',
      color: 'yellow'
    },
    {
      title: 'Minhas Anotações',
      icon: '📝',
      href: '/pt/nutri/anotacoes',
      color: 'purple'
    },
    {
      title: 'Configurações',
      icon: '⚙️',
      href: '/pt/nutri/configuracao',
      color: 'gray'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/pt/nutri/home' || href === '/pt/nutri/dashboard') {
      return pathname === href || pathname === '/pt/nutri/home' || pathname === '/pt/nutri/dashboard'
    }
    return pathname?.startsWith(href)
  }

  const isSectionActive = (section: MenuSection) => {
    if (section.href) {
      return isActive(section.href)
    }
    if (section.items) {
      return section.items.some(item => isActive(item.href))
    }
    return false
  }

  const getColorClasses = (color: string, isActive: boolean = false) => {
    const colors = {
      blue: {
        bg: isActive ? 'bg-blue-50' : 'hover:bg-blue-50',
        text: isActive ? 'text-blue-700' : 'text-gray-700',
        border: 'border-blue-200',
        active: 'bg-blue-100 text-blue-900'
      },
      green: {
        bg: isActive ? 'bg-green-50' : 'hover:bg-green-50',
        text: isActive ? 'text-green-700' : 'text-gray-700',
        border: 'border-green-200',
        active: 'bg-green-100 text-green-900'
      },
      purple: {
        bg: isActive ? 'bg-purple-50' : 'hover:bg-purple-50',
        text: isActive ? 'text-purple-700' : 'text-gray-700',
        border: 'border-purple-200',
        active: 'bg-purple-100 text-purple-900'
      },
      yellow: {
        bg: isActive ? 'bg-yellow-50' : 'hover:bg-yellow-50',
        text: isActive ? 'text-yellow-700' : 'text-gray-700',
        border: 'border-yellow-200',
        active: 'bg-yellow-100 text-yellow-900'
      },
      gray: {
        bg: isActive ? 'bg-gray-50' : 'hover:bg-gray-50',
        text: isActive ? 'text-gray-900' : 'text-gray-700',
        border: 'border-gray-200',
        active: 'bg-gray-100 text-gray-900'
      }
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-200 shadow-sm z-50 overflow-y-auto transform transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:fixed lg:z-40`}>
        {/* Logo */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <Link href="/pt/nutri/home" onClick={onMobileClose} className="flex items-center w-full">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="Nutri by YLADA"
              width={180}
              height={60}
              className="h-7 w-auto max-w-full"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </Link>
          {/* Botão fechar mobile */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Principal */}
        <nav className="p-3 space-y-1">
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
                  <button
                    onClick={() => toggleSection(sectionId)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      sectionIsActive || isHovered
                        ? `${colors.bg} ${colors.text} font-medium`
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="flex-1 text-left truncate">{item.title}</span>
                    <svg
                      className={`w-4 h-4 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Subitens - Desktop (hover) e Mobile (expandido) */}
                  {(isHovered || isExpanded) && (
                    <div className={`
                      ${isExpanded ? 'block' : 'lg:block hidden'}
                      mt-1 ml-2 pl-3 border-l-2 ${colors.border} space-y-0.5
                    `}>
                      {item.items.map((subItem) => {
                        const subItemIsActive = isActive(subItem.href)
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={onMobileClose}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                              subItemIsActive
                                ? `${colors.active} font-medium`
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-sm flex-shrink-0">{subItem.icon}</span>
                            <span className="flex-1 truncate">{subItem.title}</span>
                            {subItem.badge && (
                              <span className={`px-1.5 py-0.5 text-xs rounded-full ${colors.bg} ${colors.text} flex-shrink-0`}>
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}

                  {/* Tooltip lateral no desktop (hover) */}
                  {isHovered && !isExpanded && (
                    <div className="hidden lg:block absolute left-full top-0 ml-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
                      <div className="space-y-0.5">
                        {item.items.map((subItem) => {
                          const subItemIsActive = isActive(subItem.href)
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={onMobileClose}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                                subItemIsActive
                                  ? `${colors.active} font-medium`
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <span className="text-sm">{subItem.icon}</span>
                              <span>{subItem.title}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            // Item simples (sem subitens)
            return (
              <Link
                key={item.title}
                href={item.href || '#'}
                onClick={onMobileClose}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  sectionIsActive
                    ? `${colors.bg} ${colors.text} font-medium`
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <span className="flex-1 truncate">{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
