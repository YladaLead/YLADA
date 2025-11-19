'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'

export default function NutriAgenda() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <NutriAgendaContent />
    </ProtectedRoute>
  )
}

function NutriAgendaContent() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [consultas, setConsultas] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [filtroData, setFiltroData] = useState<string>('')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')

  // Carregar consultas
  useEffect(() => {
    if (!user) return

    const carregarConsultas = async () => {
      try {
        setCarregando(true)
        const params = new URLSearchParams()
        if (filtroData) {
          // Buscar consultas do dia inteiro
          const startOfDay = `${filtroData}T00:00:00.000Z`
          const endOfDay = `${filtroData}T23:59:59.999Z`
          params.append('start_date', startOfDay)
          params.append('end_date', endOfDay)
        }
        if (filtroStatus !== 'todos') {
          params.append('status', filtroStatus)
        }
        if (filtroTipo !== 'todos') {
          params.append('appointment_type', filtroTipo)
        }

        const response = await fetch(`/api/nutri/appointments?${params.toString()}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar consultas')
        }

        const data = await response.json()
        if (data.success) {
          setConsultas(data.data.appointments || [])
        }
      } catch (error: any) {
        console.error('Erro ao carregar consultas:', error)
        setErro(error.message || 'Erro ao carregar consultas')
      } finally {
        setCarregando(false)
      }
    }

    carregarConsultas()
  }, [user, filtroData, filtroStatus, filtroTipo])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      agendado: 'bg-blue-100 text-blue-800',
      confirmado: 'bg-green-100 text-green-800',
      em_andamento: 'bg-yellow-100 text-yellow-800',
      concluido: 'bg-gray-100 text-gray-800',
      cancelado: 'bg-red-100 text-red-800',
      falta: 'bg-orange-100 text-orange-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      agendado: 'Agendado',
      confirmado: 'Confirmado',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
      falta: 'Falta'
    }
    return labels[status] || status
  }

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      consulta: 'Consulta',
      retorno: 'Retorno',
      avaliacao: 'Avaliação',
      acompanhamento: 'Acompanhamento',
      outro: 'Outro'
    }
    return labels[tipo] || tipo
  }

  if (loading || carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NutriSidebar 
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
          <h1 className="text-lg font-semibold text-gray-900">Agenda</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Agenda</h1>
            <p className="text-gray-600 mt-2">Gerencie todas as suas consultas em um só lugar</p>
          </div>

          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800">{erro}</p>
            </div>
          )}

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="filtro-data" className="block text-sm font-medium text-gray-700 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  id="filtro-data"
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="filtro-status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="filtro-status"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="agendado">Agendado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="falta">Falta</option>
                </select>
              </div>

              <div>
                <label htmlFor="filtro-tipo" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  id="filtro-tipo"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="consulta">Consulta</option>
                  <option value="retorno">Retorno</option>
                  <option value="avaliacao">Avaliação</option>
                  <option value="acompanhamento">Acompanhamento</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFiltroData('')
                    setFiltroStatus('todos')
                    setFiltroTipo('todos')
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Consultas */}
          {consultas.length > 0 ? (
            <div className="space-y-4">
              {consultas
                .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                .map((consulta) => (
                  <div key={consulta.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{consulta.title || 'Consulta'}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consulta.status)}`}>
                            {getStatusLabel(consulta.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Cliente:</span>{' '}
                            {(typeof consulta.clients === 'object' && consulta.clients !== null && !Array.isArray(consulta.clients))
                              ? consulta.clients.name
                              : consulta.client_name || 'Não informado'}
                          </div>
                          <div>
                            <span className="font-medium">Data/Hora:</span>{' '}
                            {new Date(consulta.start_time).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div>
                            <span className="font-medium">Tipo:</span> {getTipoLabel(consulta.appointment_type)}
                          </div>
                          {consulta.duration_minutes && (
                            <div>
                              <span className="font-medium">Duração:</span> {consulta.duration_minutes} minutos
                            </div>
                          )}
                        </div>
                        {consulta.description && (
                          <p className="mt-2 text-sm text-gray-700">{consulta.description}</p>
                        )}
                        {consulta.location_url && (
                          <a
                            href={consulta.location_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-700"
                          >
                            🔗 Acessar link da reunião
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-4">Nenhuma consulta encontrada.</p>
              <p className="text-sm text-gray-500">
                {filtroData || filtroStatus !== 'todos' || filtroTipo !== 'todos'
                  ? 'Tente ajustar os filtros ou agende uma nova consulta na página do cliente.'
                  : 'Agende consultas na página de detalhes do cliente.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

