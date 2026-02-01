'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'
import { getCurrentPhase, isItemAvailable, type SidebarItemKey } from '@/lib/nutri/sidebar-phases'
import { getItemMicrocopy, getPhaseMessage, getStatusMessage } from '@/lib/nutri/sidebar-microcopy'

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
  isBlocked?: boolean
}

interface NutriSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function NutriSidebar({ isMobileOpen = false, onMobileClose }: NutriSidebarProps) {
  const pathname = usePathname()
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [novosLeadsCount, setNovosLeadsCount] = useState<number>(0)
  const { progress } = useJornadaProgress()
  
  // Verificar se completou Dia 1 (current_day >= 2)
  const dia1Completo = progress && progress.current_day >= 2
  
  // Determinar fase atual baseado no progresso
  const currentDay = progress?.current_day || null
  const currentPhase = getCurrentPhase(currentDay)

  // Carregar contador de novos leads
  useEffect(() => {
    const carregarNovosLeads = async () => {
      try {
        const response = await fetch('/api/leads', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.leads) {
            const novosLeads = data.data.leads.filter((l: any) => {
              const status = l.additional_data?.status || 'novo'
              return status === 'novo'
            })
            setNovosLeadsCount(novosLeads.length)
          }
        }
      } catch (error) {
        // Ignorar erros silenciosamente
      }
    }
    
    carregarNovosLeads()
    // Atualizar a cada 30 segundos
    const interval = setInterval(carregarNovosLeads, 30000)
    return () => clearInterval(interval)
  }, [])

  const toggleSection = (section: string) => {
    const sectionId = section.toLowerCase().replace(/\s+/g, '-')
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    )
  }

  // Mapeamento de títulos para chaves do sistema de fases
  const titleToKey: Record<string, SidebarItemKey> = {
    'Trilha Empresarial': 'jornada',
    'Captar': 'ferramentas',
    'Perfil Nutri-Empresária': 'perfil',
    'Configurações': 'configuracoes'
  }

  // Itens do menu (V1): sem bloqueio por fase.
  // A liberação progressiva fazia sentido para onboarding antigo, mas agora queremos
  // o core sempre acessível (Captar / Jornada / Perfil / Configurações).
  const menuItems = useMemo(() => {
    // Todos os itens do menu (estrutura completa)
    // Ordem reorganizada: áreas mais usadas no topo
    const allMenuItems: MenuSection[] = [
      {
        title: 'Captar',
        icon: '🧲',
        color: 'blue',
        href: '/pt/nutri/ferramentas/templates',
        items: [
          { title: 'Quiz e Calculadoras', icon: '🧮', href: '/pt/nutri/ferramentas/templates' },
          { title: 'Criar Quiz Personalizado', icon: '✨', href: '/pt/nutri/quiz-personalizado' },
          { title: 'Leads', icon: '🎯', href: '/pt/nutri/leads', badge: novosLeadsCount > 0 ? novosLeadsCount : undefined },
          { title: 'Métricas', icon: '📈', href: '/pt/nutri/relatorios-gestao' },
        ]
      },
      {
        title: 'Trilha Empresarial',
        icon: '📘',
        href: '/pt/nutri/metodo/jornada',
        color: 'blue'
      },
      {
        title: 'Perfil Nutri-Empresária',
        icon: '🎯',
        href: '/pt/nutri/diagnostico',
        color: 'orange'
      },
      {
        title: 'Configurações',
        icon: '⚙️',
        href: '/pt/nutri/configuracao',
        color: 'gray'
      }
    ]

    // V1: sempre disponível (sem cadeado).
    return allMenuItems.map(item => ({ ...item, isBlocked: false }))
  }, [currentDay, novosLeadsCount])

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
      orange: {
        bg: isActive ? 'bg-orange-50' : 'hover:bg-orange-50',
        text: isActive ? 'text-orange-700' : 'text-gray-700',
        border: 'border-orange-200',
        active: 'bg-orange-100 text-orange-900'
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

        {/* Indicador de Fase (opcional, discreto) */}
        {progress && currentDay && (
          <div className="px-3 py-2 border-b border-gray-100 bg-blue-50/50">
            <p className="text-xs text-gray-600 font-medium">
              {currentDay > 30 ? 'Trilha Concluída! 🏆' : getPhaseMessage(currentPhase)}
            </p>
            {currentDay > 0 && currentDay <= 30 && (
              <p className="text-xs text-gray-500 mt-0.5">
                Dia {currentDay} de 30
              </p>
            )}
            {currentDay > 30 && (
              <p className="text-xs text-green-600 mt-0.5 font-medium">
                Você e a LYA: parceiras de crescimento 💜
              </p>
            )}
          </div>
        )}

        {/* Botão Mentora LYA */}
        <div className="px-3 py-2 border-b border-gray-200">
          <button
            onClick={() => {
              // Disparar evento customizado para abrir o chat
              window.dispatchEvent(new CustomEvent('open-lya-chat'))
              onMobileClose?.()
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-sm"
            title="Falar com a Mentora LYA"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="flex-1 text-left">Mentora LYA</span>
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
              const itemKey = titleToKey[item.title] || ''
              const itemMicrocopy = getItemMicrocopy(itemKey)
              const isBlocked = (item as any).isBlocked || false
              
              return (
                <div 
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => setHoveredSection(sectionId)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  {isBlocked ? (
                    <div
                      title={itemMicrocopy?.tooltip || 'Disponível após concluir sua fase atual.'}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-400 cursor-not-allowed opacity-60"
                    >
                      <span className="text-lg flex-shrink-0">🔒</span>
                      <span className="flex-1 text-left truncate">{item.title}</span>
                      <svg
                        className="w-4 h-4 transition-transform flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleSection(sectionId)}
                      title={itemMicrocopy?.tooltip || item.title}
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
                  )}

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
            const itemKey = titleToKey[item.title] || ''
            const itemMicrocopy = getItemMicrocopy(itemKey)
            // V1: sem bloqueio por fase também para itens simples (Perfil/Configurações/etc.)
            const isBlocked = false
            
            return (
              <div key={item.title} className="relative group">
                {isBlocked ? (
                  <div
                    title={itemMicrocopy?.tooltip || 'Disponível após concluir sua fase atual.'}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-400 cursor-not-allowed opacity-60"
                  >
                    <span className="text-lg flex-shrink-0">🔒</span>
                    <span className="flex-1 truncate">{item.title}</span>
                  </div>
                ) : (
                  <Link
                    href={item.href || '#'}
                    onClick={onMobileClose}
                    title={itemMicrocopy?.tooltip || item.title}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      sectionIsActive
                        ? `${colors.bg} ${colors.text} font-medium`
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="flex-1 truncate">{item.title}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
