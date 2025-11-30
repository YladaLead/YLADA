'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import FluxoDiagnostico from '@/components/wellness-system/FluxoDiagnostico'
import { getFluxoById } from '@/lib/wellness-system/fluxos-clientes'
import { fluxosRecrutamento } from '@/lib/wellness-system/fluxos-recrutamento'
import { FluxoCliente } from '@/types/wellness-system'
import Link from 'next/link'

function FluxoPublicPageContent() {
  const params = useParams()
  const userSlug = params['user-slug'] as string
  const tipo = params.tipo as 'cliente' | 'recrutamento'
  const fluxoId = params.id as string
  const [fluxo, setFluxo] = useState<FluxoCliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [whatsappNumber, setWhatsappNumber] = useState<string>('')
  const [countryCode, setCountryCode] = useState<string>('BR')

  useEffect(() => {
    // Buscar fluxo
    const fluxoEncontrado = tipo === 'cliente' 
      ? getFluxoById(fluxoId)
      : fluxosRecrutamento.find(f => f.id === fluxoId)
    
    setFluxo(fluxoEncontrado || null)
    
    // Buscar WhatsApp do distribuidor pelo user_slug
    const buscarPerfil = async () => {
      try {
        const response = await fetch(`/api/wellness/profile/by-slug?user_slug=${userSlug}`)
        if (response.ok) {
          const data = await response.json()
          if (data.profile) {
            setWhatsappNumber(data.profile.whatsapp || '')
            setCountryCode(data.profile.countryCode || 'BR')
          }
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error)
      }
    }
    
    buscarPerfil()
    setLoading(false)
  }, [userSlug, tipo, fluxoId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando diagnóstico...</p>
        </div>
      </div>
    )
  }

  if (!fluxo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Fluxo não encontrado
          </h1>
          <p className="text-gray-600">O fluxo que você está procurando não existe.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <FluxoDiagnostico
          fluxo={fluxo}
          whatsappNumber={whatsappNumber}
          countryCode={countryCode}
          mostrarProdutos={tipo === 'cliente'}
        />
      </main>
    </div>
  )
}

export default function FluxoPublicPage() {
  return <FluxoPublicPageContent />
}

