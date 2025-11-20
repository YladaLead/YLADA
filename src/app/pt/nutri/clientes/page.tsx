'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'
import { displayPhoneWithFlag } from '@/utils/phoneFormatter'

export default function ClientesNutri() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <ClientesNutriContent />
    </ProtectedRoute>
  )
}

interface Cliente {
  id: string
  name: string
  email: string | null
  phone: string | null
  status: string
  created_at: string
  converted_from_lead: boolean
  lead_source: string | null
}

function ClientesNutriContent() {
  const { user, loading } = useAuth()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Carregar clientes
  useEffect(() => {
    if (!user) return

    const carregarClientes = async () => {
      try {
        setCarregando(true)
        setErro(null)

        const params = new URLSearchParams()
        if (busca) params.append('search', busca)
        if (filtroStatus !== 'todos') params.append('status', filtroStatus)
        params.append('limit', '50')
        params.append('order_by', 'created_at')
        params.append('order', 'desc')

        const response = await fetch(`/api/nutri/clientes?${params.toString()}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Erro ao carregar clientes' }))
          throw new Error(errorData.error || 'Erro ao carregar clientes')
        }

        const data = await response.json()
        if (data.success && data.data) {
          setClientes(data.data.clients || [])
        } else {
          setClientes([])
        }
      } catch (error: any) {
        console.error('Erro ao carregar clientes:', error)
        setErro(error.message || 'Erro ao carregar clientes')
      } finally {
        setCarregando(false)
      }
    }

    carregarClientes()
  }, [user, busca, filtroStatus])

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

  const statusOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'lead', label: 'Contato' },
    { value: 'pre_consulta', label: 'Pré-Consulta' },
    { value: 'ativa', label: 'Ativa' },
    { value: 'pausa', label: 'Pausa' },
    { value: 'finalizada', label: 'Finalizada' }
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      lead: 'bg-blue-100 text-blue-800',
      pre_consulta: 'bg-yellow-100 text-yellow-800',
      ativa: 'bg-green-100 text-green-800',
      pausa: 'bg-orange-100 text-orange-800',
      finalizada: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      lead: 'Contato',
      pre_consulta: 'Pré-Consulta',
      ativa: 'Ativa',
      pausa: 'Pausa',
      finalizada: 'Finalizada'
    }
    return labels[status] || status
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
          <h1 className="text-lg font-semibold text-gray-900">Clientes</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clientes</h1>
              <p className="text-gray-600 mt-1">Gerencie seus clientes e acompanhe seus atendimentos</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pt/nutri/clientes/kanban"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <span>🗂️</span>
                Ver Kanban
              </Link>
              <Link
                href="/pt/nutri/clientes/novo"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <span>➕</span>
                Novo Cliente
              </Link>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Busca */}
              <div>
                <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <input
                  id="busca"
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Nome, email ou telefone..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filtro de Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800">{erro}</p>
            </div>
          )}

          {/* Lista de Clientes */}
          {carregando ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando clientes...</p>
            </div>
          ) : clientes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cliente encontrado</h3>
              <p className="text-gray-600 mb-6">
                {busca || filtroStatus !== 'todos' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece adicionando seu primeiro cliente'}
              </p>
              <Link
                href="/pt/nutri/clientes/novo"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <span>➕</span>
                Criar Primeiro Cliente
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientes.map((cliente) => (
                <Link
                  key={cliente.id}
                  href={`/pt/nutri/clientes/${cliente.id}`}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{cliente.name}</h3>
                      {cliente.email && (
                        <p className="text-sm text-gray-600 mb-1">{cliente.email}</p>
                      )}
                      {cliente.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          {displayPhoneWithFlag(cliente.phone)}
                        </p>
                      )}
                    </div>
                    {cliente.converted_from_lead && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        Contato
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cliente.status)}`}>
                      {getStatusLabel(cliente.status)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

