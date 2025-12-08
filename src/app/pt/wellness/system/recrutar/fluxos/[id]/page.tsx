'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import FluxoDiagnostico from '@/components/wellness-system/FluxoDiagnostico'
import { getFluxoRecrutamentoById } from '@/lib/wellness-system/fluxos-recrutamento'
import { FluxoCliente } from '@/types/wellness-system'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Link from 'next/link'

function FluxoRecrutamentoPageContent() {
  const params = useParams()
  const fluxoId = params.id as string
  const [fluxo, setFluxo] = useState<FluxoCliente | null>(null)
  const [loading, setLoading] = useState(true)
  const { profile, loading: loadingProfile } = useWellnessProfile()

  useEffect(() => {
    // Buscar fluxo de recrutamento
    const fluxoEncontrado = getFluxoRecrutamentoById(fluxoId)
    setFluxo(fluxoEncontrado || null)
    setLoading(false)
  }, [fluxoId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <WellnessNavBar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando...</div>
        </main>
      </div>
    )
  }

  if (!fluxo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <WellnessNavBar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Fluxo não encontrado
            </h1>
            <Link
              href="/pt/wellness/home"
              className="text-green-600 hover:text-green-700"
            >
              Voltar ao Sistema
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title={fluxo.nome} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar ao Sistema - Bem visível no topo */}
        <div className="mb-6">
          <Link
            href="/pt/wellness/system"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Voltar ao Sistema</span>
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {fluxo.nome}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {fluxo.objetivo}
          </p>
        </div>

        {/* Componente de Diagnóstico */}
        {loadingProfile ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando perfil...</p>
          </div>
        ) : (
          <FluxoDiagnostico
            fluxo={fluxo}
            whatsappNumber={profile?.whatsapp || ''}
            countryCode={profile?.countryCode || 'BR'}
            mostrarProdutos={false} // Recrutamento não mostra produtos
          />
        )}
      </main>
    </div>
  )
}

export default function FluxoRecrutamentoPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <FluxoRecrutamentoPageContent />
    </ProtectedRoute>
  )
}

