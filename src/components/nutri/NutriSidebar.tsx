'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

interface MenuItem {
  title: string
  icon: string
  href: string
  badge?: number
}

interface MenuSection {
  title: string
  icon: string
  color: string
  items: MenuItem[]
}

interface NutriSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function NutriSidebar({ isMobileOpen = false, onMobileClose }: NutriSidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(['captacao', 'gestao', 'formacao'])

  const toggleSection = (section: string) => {
    const sectionId = section.toLowerCase().replace(/\s+/g, '-')
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    )
  }

  const menuSections: MenuSection[] = [
    {
      title: 'Captação de Clientes',
      icon: '🎯',
      color: 'blue',
      items: [
        { title: 'Home / Visão Geral', icon: '🏠', href: '/pt/nutri/home' },
        { title: 'Meus Links', icon: '🔗', href: '/pt/nutri/ferramentas' },
        { title: 'Quizzes', icon: '🎯', href: '/pt/nutri/quizzes' },
        { title: 'Templates', icon: '🎨', href: '/pt/nutri/ferramentas/templates' },
        { title: 'Leads', icon: '📈', href: '/pt/nutri/leads' },
      ]
    },
    {
      title: 'Gestão de Clientes',
      icon: '👥',
      color: 'green',
      items: [
        { title: 'Meus Clientes', icon: '👤', href: '/pt/nutri/clientes' },
        { title: 'Agenda', icon: '📅', href: '/pt/nutri/agenda' },
        { title: 'Acompanhamento', icon: '📊', href: '/pt/nutri/acompanhamento' },
      ]
    },
    {
      title: 'Formação',
      icon: '📚',
      color: 'purple',
      items: [
        { title: 'Cursos', icon: '🎓', href: '/pt/nutri/cursos' },
        { title: 'Meu Progresso', icon: '📈', href: '/pt/nutri/meu-progresso' },
        { title: 'Certificados', icon: '🏆', href: '/pt/nutri/certificados' },
      ]
    }
  ]

  const isActive = (href: string) => {
    if (href === '/pt/nutri/dashboard') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        hover: 'hover:bg-blue-100',
        active: 'bg-blue-100 text-blue-900 border-blue-300'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        hover: 'hover:bg-green-100',
        active: 'bg-green-100 text-green-900 border-green-300'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        hover: 'hover:bg-purple-100',
        active: 'bg-purple-100 text-purple-900 border-purple-300'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
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
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm z-50 overflow-y-auto transform transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-40`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <Link href="/pt/nutri/home" onClick={onMobileClose}>
          <Image
            src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro.png"
            alt="YLADA Nutri"
            width={180}
            height={60}
            className="h-8 w-auto"
            style={{ backgroundColor: 'transparent' }}
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

      {/* Menu Sections */}
      <nav className="p-4 space-y-2">
        {menuSections.map((section) => {
          const colors = getColorClasses(section.color)
          const isExpanded = expandedSections.includes(section.title.toLowerCase().replace(/\s+/g, '-'))

          return (
            <div key={section.title} className="mb-4">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className={`w-full flex items-center justify-between p-3 rounded-lg ${colors.bg} ${colors.border} border transition-colors`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{section.icon}</span>
                  <span className={`font-semibold ${colors.text} text-sm`}>
                    {section.title}
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 ${colors.text} transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Section Items */}
              {isExpanded && (
                <div className="mt-2 ml-4 space-y-1">
                  {section.items.map((item) => {
                    const itemIsActive = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onMobileClose}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          itemIsActive
                            ? `${colors.active} font-medium`
                            : `text-gray-700 ${colors.hover}`
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-xs rounded-full ${colors.bg} ${colors.text}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Configurações */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <Link
            href="/pt/nutri/configuracao"
            onClick={onMobileClose}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === '/pt/nutri/configuracao'
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">⚙️</span>
            <span>Configurações</span>
          </Link>
        </div>
      </nav>
    </aside>
    </>
  )
}

