'use client'

import { useState, useEffect } from 'react'
import CoachSidebar from "@/components/coach/CoachSidebar"
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function CoachAcompanhamento() {
  return <CoachAcompanhamentoContent />
}

function CoachAcompanhamentoContent() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // Carregar clientes ativos
  useEffect(() => {
    if (!user) return

    const carregarClientes = async () => {
      try {
        setCarregando(true)
        const response = await fetch('/api/coach/clientes?status=ativa&limit=50', {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar clientes')
        }

        const data = await response.json()
        if (data.success) {
          setClientes(data.data.clients || [])
        }
      } catch (error: any) {
        console.error('Erro ao carregar clientes:', error)
        setErro(error.message || 'Erro ao carregar clientes')
      } finally {
        setCarregando(false)
      }
    }

    carregarClientes()
  }, [user])

  if (loading || carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CoachSidebar 
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      
      <div className="flex-1 lg:ml-56">
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Acompanhamento</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Acompanhamento</h1>
            <p className="text-gray-600 mt-2">Acompanhe a evolução das suas clientes ativas</p>
          </div>

          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800">{erro}</p>
            </div>
          )}

          {/* Lista de Clientes */}
          {clientes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientes.map((cliente) => (
                <Link
                  key={cliente.id}
                  href={`/pt/coach/clientes/${cliente.id}`}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{cliente.name}</h3>
                      {cliente.email && (
                        <p className="text-sm text-gray-600 mt-1">{cliente.email}</p>
                      )}
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Ativa
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {cliente.client_since && (
                      <p>
                        Cliente desde:{' '}
                        {new Date(cliente.client_since).toLocaleDateString('pt-BR', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                      Ver detalhes →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-4">Nenhuma cliente ativa encontrada.</p>
              <Link
                href="/pt/coach/clientes/novo"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Adicionar Primeira Cliente
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


