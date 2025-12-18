'use client'

import Link from 'next/link'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'
import PageLayout from '@/components/shared/PageLayout'
import Section from '@/components/shared/Section'
import Card from '@/components/shared/Card'
import { pilaresConfig } from '@/types/pilares'
import { useState } from 'react'

const coresPilares = [
  'from-blue-600 to-indigo-600',
  'from-purple-600 to-pink-600',
  'from-green-600 to-teal-600',
  'from-orange-600 to-red-600',
  'from-indigo-600 to-purple-600'
]

export default function PilaresPage() {
  return <PilaresPageContent />
}

function PilaresPageContent() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 flex">
        <NutriSidebar
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

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
            <h1 className="text-lg font-semibold text-gray-900">Sobre o Método</h1>
            <div className="w-10"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
            {/* Header Institucional */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 mb-8 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold mb-3">
                O Método YLADA
              </h1>
              <p className="text-blue-100 text-lg mb-4 max-w-2xl">
                5 pilares que sustentam seu crescimento como Nutri-Empresária. 
                Não é curso, não é conteúdo para estudar — é a filosofia que guia tudo.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm text-blue-50 flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <span><strong>A LYA aplica esses pilares com você no dia a dia.</strong> Você não precisa decorar — precisa seguir.</span>
                </p>
              </div>
            </div>

            <Section
              title="Os 5 Pilares"
              subtitle="Conheça a estrutura por trás de tudo que você faz aqui."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pilaresConfig.map((pilar, index) => (
                  <Link key={pilar.id} href={`/pt/nutri/metodo/pilares/${pilar.id}`}>
                    <Card hover className="text-center h-full">
                      <div className={`w-16 h-16 bg-gradient-to-r ${coresPilares[index]} rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto`}>
                        {pilar.numero}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {pilar.nome}
                      </h3>
                      {pilar.subtitulo && (
                        <p className="text-sm text-gray-500 mb-3 italic">
                          {pilar.subtitulo}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {pilar.descricao_curta || 'Descrição será preenchida em breve.'}
                      </p>
                      <div className="text-blue-600 font-medium text-sm">
                        Entender este pilar →
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
              
              {/* Nota de rodapé */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 max-w-xl mx-auto">
                  💡 <strong>Dica:</strong> Você não precisa estudar todos os pilares antes de começar. 
                  A LYA vai te guiar pelo que importa, no momento certo.
                </p>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

