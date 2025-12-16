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
            <h1 className="text-lg font-semibold text-gray-900">Pilares do Método</h1>
            <div className="w-10"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
            <Section
              title="📚 Pilares do Método YLADA"
              subtitle="Os 5 fundamentos que estruturam sua transformação em Nutri-Empresária."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pilaresConfig.map((pilar, index) => (
                  <Link key={pilar.id} href={`/pt/nutri/metodo/pilares/${pilar.id}`}>
                    <Card hover className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${coresPilares[index]} rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto`}>
                        {pilar.numero}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Pilar {pilar.numero} — {pilar.nome}
                      </h3>
                      {pilar.subtitulo && (
                        <p className="text-sm text-gray-500 mb-2 italic">
                          {pilar.subtitulo}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm mb-4">
                        {pilar.descricao_curta || 'Descrição será preenchida em breve.'}
                      </p>
                      <div className="text-blue-600 font-medium text-sm">
                        Acessar Pilar →
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

