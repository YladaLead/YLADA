'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import RequireDiagnostico from '@/components/auth/RequireDiagnostico'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'
import LyaChatWidget from '@/components/nutri/LyaChatWidget'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'

export default function NutriHome() {
  return (
    <RequireDiagnostico area="nutri">
      <NutriHomeContent />
    </RequireDiagnostico>
  )
}

function NutriHomeContent() {
  const { user, loading: authLoading, userProfile } = useAuth()
  const searchParams = useSearchParams()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { progress, loading: progressLoading } = useJornadaProgress()
  
  // Verificar se veio com query param para abrir LYA
  useEffect(() => {
    const lyaParam = searchParams.get('lya')
    if (lyaParam === 'tour' && !authLoading && !progressLoading && user) {
      // Aguardar um pouco para garantir que o widget está carregado
      setTimeout(() => {
        // Disparar evento customizado para abrir o chat
        window.dispatchEvent(new CustomEvent('open-lya-chat'))
        // Limpar URL para não abrir novamente ao recarregar
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          url.searchParams.delete('lya')
          window.history.replaceState({}, '', url.toString())
        }
      }, 800)
    }
  }, [searchParams, authLoading, progressLoading, user])
  
  // Verificar se completou Dia 1 (current_day >= 2 ou completed_days >= 1)
  const dia1Completo = progress && (progress.current_day !== null && progress.current_day >= 2 || progress.completed_days >= 1)
  
  // Determinar se está nos primeiros dias (mostrar WelcomeCard simplificado)
  const currentDay = progress?.current_day || null
  
  // Extrair nome do usuário para saudação personalizada
  // Usar o nome exatamente como configurado pelo usuário (sem adicionar títulos automaticamente)
  const getUserName = () => {
    // Priorizar nome completo do perfil (usar exatamente como configurado)
    if (userProfile?.nome_completo) {
      const nome = userProfile.nome_completo.trim()
      if (nome) {
        // Se o nome já tem título (Dra., Dr., Doutora, Doutor), usar como está
        // Caso contrário, usar o nome completo ou primeiro nome
        const primeiroNome = nome.split(' ')[0]
        return primeiroNome || nome
      }
    }
    // Tentar metadata
    if (user?.user_metadata?.full_name) {
      const nome = user.user_metadata.full_name.trim()
      if (nome) {
        const primeiroNome = nome.split(' ')[0]
        return primeiroNome || nome
      }
    }
    if (user?.user_metadata?.name) {
      const nome = user.user_metadata.name.trim()
      if (nome) {
        const primeiroNome = nome.split(' ')[0]
        return primeiroNome || nome
      }
    }
    // Fallback: email (sem título)
    if (user?.email) {
      const emailPart = user.email.split('@')[0]
      return emailPart || null
    }
    return null
  }
  
  const userName = getUserName()
  

  // Aguardar autenticação E progresso da jornada (evita flash do Dia 1)
  if (authLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NutriSidebar 
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-56">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Home</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* HOME IA-FIRST: conteúdo principal = chat com a LYA */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Mentora LYA
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Me diga seu objetivo de hoje e eu te direciono para o próximo passo certo.
            </p>
          </div>

          <div className="h-[70vh] sm:h-[72vh] lg:h-[75vh]">
            <LyaChatWidget embedded defaultOpen className="h-full" />
          </div>
        </div>

        {/* Em Home IA-first o chat já está embutido */}
      </div>
    </div>
  )
}
