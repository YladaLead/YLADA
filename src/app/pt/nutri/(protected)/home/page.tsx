'use client'

import { useState } from 'react'
import RequireDiagnostico from '@/components/auth/RequireDiagnostico'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'
import JornadaBlock from '@/components/nutri/home/JornadaBlock'
import PilaresBlock from '@/components/nutri/home/PilaresBlock'
import FerramentasBlock from '@/components/nutri/home/FerramentasBlock'
import GSALBlock from '@/components/nutri/home/GSALBlock'
import BibliotecaBlock from '@/components/nutri/home/BibliotecaBlock'
import AnotacoesBlock from '@/components/nutri/home/AnotacoesBlock'
import VideoPlayerYLADA from '@/components/formacao/VideoPlayerYLADA'
import LyaChatWidget from '@/components/nutri/LyaChatWidget'
import LyaAnaliseHoje from '@/components/nutri/LyaAnaliseHoje'
import WelcomeCard from '@/components/nutri/home/WelcomeCard'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { progress, loading: progressLoading } = useJornadaProgress()
  
  // Verificar se completou Dia 1 (current_day >= 2 ou completed_days >= 1)
  const dia1Completo = progress && (progress.current_day !== null && progress.current_day >= 2 || progress.completed_days >= 1)
  
  // Determinar se está nos primeiros dias (mostrar WelcomeCard simplificado)
  const currentDay = progress?.current_day || null
  const isFirstDays = currentDay === null || currentDay <= 1
  
  // Extrair primeiro nome da usuária para saudação personalizada
  const getUserFirstName = () => {
    if (userProfile?.nome_completo) {
      return userProfile.nome_completo.split(' ')[0]
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0]
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ')[0]
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return null
  }
  
  const userName = getUserFirstName()

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

  // Obter URL do vídeo de forma segura
  const videoUrl = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_VIDEO_BOAS_VINDAS || '')
    : (process.env.NEXT_PUBLIC_VIDEO_BOAS_VINDAS || '')

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
          {/* 🚨 REVELAÇÃO PROGRESSIVA: Conteúdo aparece quando faz sentido */}
          
          {/* Sempre visível: WelcomeCard e LyaAnaliseHoje */}
          <WelcomeCard currentDay={currentDay} userName={userName} />
          <div className="mb-8">
            <LyaAnaliseHoje />
          </div>

          {/* 
            🎯 JORNADA COMPLETA (Dia > 30): 
            Home LIMPA - apenas WelcomeCard + LyaAnaliseHoje
            Tudo já está acessível pelo sidebar
          */}
          
          {/* Dias 2-30: Blocos progressivos (NÃO aparece se > 30) */}
          {currentDay && currentDay >= 2 && currentDay <= 30 && (
            <>
              {/* Dia 8+: Jornada Block aparece */}
              {currentDay >= 8 && (
                <div className="mb-8">
                  <JornadaBlock />
                </div>
              )}

              {/* Dia 8-14: Ferramentas Block (filtrado por relevância) */}
              {currentDay >= 8 && currentDay <= 14 && (
                <div className="mb-8">
                  <FerramentasBlock />
                </div>
              )}

              {/* Dia 15-30: GSAL Block */}
              {currentDay >= 15 && (
                <div className="mb-8">
                  <GSALBlock />
                </div>
              )}

              {/* Dia 21-30: Pilares e Biblioteca */}
              {currentDay >= 21 && (
                <>
                  <div className="mb-8">
                    <PilaresBlock />
                  </div>
                  <div className="mb-8">
                    <BibliotecaBlock />
                  </div>
                </>
              )}

              {/* Anotações dias 2-30 */}
              <div className="mb-8">
                <AnotacoesBlock />
              </div>
            </>
          )}
        </div>

        {/* Chat Widget Flutuante - Mentora LYA (apenas após completar Dia 1) */}
        {dia1Completo && <LyaChatWidget />}
      </div>
    </div>
  )
}
