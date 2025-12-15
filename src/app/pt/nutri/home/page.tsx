'use client'

import { useState } from 'react'
import ProtectedRoute from '../../../../components/auth/ProtectedRoute'
import RequireDiagnostico from '@/components/auth/RequireDiagnostico'
import NutriSidebar from '../../../../components/nutri/NutriSidebar'
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

export default function NutriHome() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <RequireDiagnostico area="nutri">
        <NutriHomeContent />
      </RequireDiagnostico>
    </ProtectedRoute>
  )
}

function NutriHomeContent() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          {/* Vídeo 1 — Boas-vindas (apenas na primeira visita) */}
          {videoUrl && (
            <div className="mb-8">
              <VideoPlayerYLADA
                videoUrl={videoUrl}
                title="Bem-vindo ao YLADA Premium"
                description="Descubra como o YLADA vai transformar sua prática profissional."
              />
            </div>
          )}

          {/* Análise da LYA Hoje */}
          <div className="mb-8">
            <LyaAnaliseHoje />
          </div>

          {/* Bloco 1: Jornada de Transformação */}
          <div className="mb-8">
            <JornadaBlock />
          </div>

          {/* Bloco 2: Pilares do Método (visualmente secundário) */}
          <div className="mb-8 opacity-75">
            <PilaresBlock />
          </div>

          {/* Bloco 3: Ferramentas Profissionais */}
          <div className="mb-8">
            <FerramentasBlock />
          </div>

          {/* Bloco 4: Gestão GSAL */}
          <div className="mb-8">
            <GSALBlock />
          </div>

          {/* Bloco 5: Biblioteca / Materiais Extras (visualmente secundário) */}
          <div className="mb-8 opacity-75">
            <BibliotecaBlock />
          </div>

          {/* Bloco 6: Minhas Anotações (visualmente secundário) */}
          <div className="mb-8 opacity-75">
            <AnotacoesBlock />
          </div>
        </div>

        {/* Chat Widget Flutuante - Mentora LYA */}
        <LyaChatWidget />
      </div>
    </div>
  )
}
