'use client'

import { useState } from 'react'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/hooks/useAuth'
import NutriChatWidget from '@/components/nutri/NutriChatWidget'
import PageLayout from '@/components/shared/PageLayout'
import Section from '@/components/shared/Section'
import JornadaSection from '@/components/formacao/JornadaSection'

export default function JornadaPage() {
  return <JornadaPageContent />
}

function JornadaPageContent() {
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
            <h1 className="text-lg font-semibold text-gray-900">Trilha Empresarial</h1>
            <div className="w-10"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
            <Section
              title="📘 Trilha Empresarial YLADA"
              subtitle="Capacitação empresarial em 30 dias: lote sua agenda e transforme sua rotina aplicando o Método YLADA – o que a faculdade não ensinou."
            >
              <JornadaSection />
            </Section>
          </div>
        </div>
      </div>

      {/* Chat Widget Flutuante - Assistente de Formação como padrão na Jornada */}
      <NutriChatWidget chatbotId="formacao" />
    </PageLayout>
  )
}

