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
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { progress } = useJornadaProgress()
  
  // Verificar se completou Dia 1 (current_day >= 2 ou completed_days >= 1)
  const dia1Completo = progress && (progress.current_day >= 2 || progress.completed_days >= 1)
  
  // Determinar se está nos primeiros dias (mostrar WelcomeCard simplificado)
  const currentDay = progress?.current_day || null
  const isFirstDays = currentDay === null || currentDay <= 1

  // Aguardar autenticação
  if (loading) {
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
          <WelcomeCard currentDay={currentDay} />
          <div className="mb-8">
            <LyaAnaliseHoje />
          </div>

          {/* Dias 1-7: Apenas WelcomeCard + LyaAnaliseHoje (já renderizados acima) */}
          {isFirstDays ? null : (
            <>
              {/* Dia 8+: Jornada Block aparece */}
              {currentDay && currentDay >= 8 && (
                <div className="mb-8">
                  <JornadaBlock />
                </div>
              )}

              {/* Dia 8-14: Ferramentas Block (filtrado por relevância) */}
              {currentDay && currentDay >= 8 && currentDay < 15 && (
                <div className="mb-8">
                  <FerramentasBlock />
                </div>
              )}

              {/* Dia 15+: GSAL Block (quando LYA detecta necessidade) */}
              {currentDay && currentDay >= 15 && (
                <div className="mb-8">
                  <GSALBlock />
                </div>
              )}

              {/* Dia 21+: Pilares e Biblioteca */}
              {currentDay && currentDay >= 21 && (
                <>
                  <div className="mb-8">
                    <PilaresBlock />
                  </div>
                  <div className="mb-8">
                    <BibliotecaBlock />
                  </div>
                </>
              )}

              {/* Anotações sempre disponíveis após Dia 1 */}
              {currentDay && currentDay >= 2 && (
                <div className="mb-8">
                  <AnotacoesBlock />
                </div>
              )}

              {/* Vídeo apenas se LYA não tiver mensagem relevante (opcional, pode remover) */}
              {/* {videoUrl && currentDay && currentDay >= 8 && (
                <div className="mb-8">
                  <VideoPlayerYLADA
                    videoUrl={videoUrl}
                    title="Bem-vindo ao YLADA Premium"
                    description="Descubra como o YLADA vai transformar sua prática profissional."
                  />
                </div>
              )} */}
            </>
          )}
        </div>

        {/* Chat Widget Flutuante - Mentora LYA (apenas após completar Dia 1) */}
        {dia1Completo && <LyaChatWidget />}
      </div>
    </div>
  )
}
