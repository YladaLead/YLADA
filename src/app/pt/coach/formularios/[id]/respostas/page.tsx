'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CoachSidebar from "@/components/coach/CoachSidebar"
import { useAuth } from '@/contexts/AuthContext'

export default function RespostasFormulario() {
  return (
    <ProtectedRoute perfil="coach" allowAdmin={true}>
      <RespostasFormularioContent />
    </ProtectedRoute>
  )
}

function RespostasFormularioContent() {
  const { user, loading } = useAuth()
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [formulario, setFormulario] = useState<any>(null)
  const [respostas, setRespostas] = useState<any[]>([])
  const [estatisticas, setEstatisticas] = useState<any>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [respostaSelecionada, setRespostaSelecionada] = useState<any>(null)
  const [filtroCliente, setFiltroCliente] = useState<string>('todos')
  const [filtroDataInicio, setFiltroDataInicio] = useState<string>('')
  const [filtroDataFim, setFiltroDataFim] = useState<string>('')

  useEffect(() => {
    if (!user || !formId) return

    const carregarDados = async () => {
      try {
        setCarregando(true)
        setErro(null)

        // Carregar formulário
        const formResponse = await fetch(`/api/c/formularios/${formId}`, {
          credentials: 'include'
        })

        if (!formResponse.ok) {
          throw new Error('Formulário não encontrado')
        }

        const formData = await formResponse.json()
        if (formData.success) {
          setFormulario(formData.data.form)
        }

        // Carregar respostas
        await carregarRespostas()
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error)
        setErro(error.message || 'Erro ao carregar dados')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [user, formId])

  const carregarRespostas = async () => {
    try {
      const params = new URLSearchParams()
      if (filtroCliente !== 'todos') {
        params.append('client_id', filtroCliente)
      }
      if (filtroDataInicio) {
        params.append('start_date', filtroDataInicio)
      }
      if (filtroDataFim) {
        params.append('end_date', filtroDataFim)
      }

      const response = await fetch(`/api/c/formularios/${formId}/respostas?${params.toString()}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar respostas')
      }

      const data = await response.json()
      if (data.success) {
        setRespostas(data.data.responses || [])
        setEstatisticas(data.data.statistics)
      }
    } catch (error: any) {
      console.error('Erro ao carregar respostas:', error)
      setErro(error.message || 'Erro ao carregar respostas')
    }
  }

  useEffect(() => {
    if (user && formId) {
      carregarRespostas()
    }
  }, [filtroCliente, filtroDataInicio, filtroDataFim])

  const formatarData = (data: string) => {
    if (!data) return '-'
    const date = new Date(data)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatarResposta = (field: any, resposta: any) => {
    if (resposta === null || resposta === undefined || resposta === '') {
      return <span className="text-gray-400 italic">Não respondido</span>
    }

    switch (field.type) {
      case 'checkbox':
        return Array.isArray(resposta) && resposta.length > 0
          ? resposta.join(', ')
          : <span className="text-gray-400 italic">Nenhuma opção selecionada</span>
      case 'radio':
      case 'select':
        return resposta
      case 'yesno':
        return resposta === true || resposta === 'true' || resposta === 'sim' ? 'Sim' : 'Não'
      case 'date':
        if (resposta) {
          const date = new Date(resposta)
          return date.toLocaleDateString('pt-BR')
        }
        return '-'
      case 'time':
        return resposta
      case 'file':
        return resposta ? <a href={resposta} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Ver arquivo</a> : '-'
      default:
        return String(resposta)
    }
  }

  const exportarCSV = () => {
    if (!formulario || !respostas.length) return

    // Cabeçalho
    const headers = ['Data/Hora', 'Cliente', 'Email']
    formulario.structure?.fields?.forEach((field: any) => {
      headers.push(field.label || field.id)
    })

    // Linhas
    const rows = respostas.map(response => {
      const row: string[] = [
        formatarData(response.created_at),
        response.clients?.name || 'Sem cliente',
        response.clients?.email || '-'
      ]
      
      formulario.structure?.fields?.forEach((field: any) => {
        const resposta = response.responses[field.id]
        let valor = ''
        
        if (resposta !== null && resposta !== undefined && resposta !== '') {
          if (Array.isArray(resposta)) {
            valor = resposta.join('; ')
          } else if (typeof resposta === 'boolean') {
            valor = resposta ? 'Sim' : 'Não'
          } else {
            valor = String(resposta)
          }
        }
        
        row.push(valor)
      })
      
      return row
    })

    // Criar CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    // Download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `respostas-${formulario.name}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const visualizarResposta = async (responseId: string) => {
    try {
      const response = await fetch(`/api/c/formularios/${formId}/respostas/${responseId}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar resposta')
      }

      const data = await response.json()
      if (data.success) {
        setRespostaSelecionada(data.data)
      }
    } catch (error: any) {
      console.error('Erro ao carregar resposta:', error)
      setErro(error.message || 'Erro ao carregar resposta')
    }
  }

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
          <h1 className="text-lg font-semibold text-gray-900">Respostas</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href="/pt/coach/formularios"
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  ← Voltar para Formulários
                </Link>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {formulario?.name || 'Respostas do Formulário'}
              </h1>
              <p className="text-gray-600 mt-1">
                Visualize e gerencie todas as respostas recebidas
              </p>
            </div>
            {respostas.length > 0 && (
              <button
                onClick={exportarCSV}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <span>📥</span>
                Exportar CSV
              </button>
            )}
          </div>

          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800">{erro}</p>
            </div>
          )}

          {/* Estatísticas */}
          {estatisticas && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">Total de Respostas</div>
                <div className="text-2xl font-bold text-gray-900">{estatisticas.total}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">Com Cliente</div>
                <div className="text-2xl font-bold text-green-600">{estatisticas.with_client}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">Sem Cliente</div>
                <div className="text-2xl font-bold text-orange-600">{estatisticas.without_client}</div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="filtro-cliente" className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente
                </label>
                <select
                  id="filtro-cliente"
                  value={filtroCliente}
                  onChange={(e) => setFiltroCliente(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="todos">Todos</option>
                  {Array.from(new Map(
                    respostas
                      .filter(r => r.clients && r.clients.id)
                      .map(r => [r.clients.id, r.clients])
                  ).values()).map((client: any) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="filtro-data-inicio" className="block text-sm font-medium text-gray-700 mb-2">
                  Data Início
                </label>
                <input
                  type="date"
                  id="filtro-data-inicio"
                  value={filtroDataInicio}
                  onChange={(e) => setFiltroDataInicio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="filtro-data-fim" className="block text-sm font-medium text-gray-700 mb-2">
                  Data Fim
                </label>
                <input
                  type="date"
                  id="filtro-data-fim"
                  value={filtroDataFim}
                  onChange={(e) => setFiltroDataFim(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Lista de Respostas */}
          {respostas.length > 0 ? (
            <div className="space-y-4">
              {respostas.map((response) => (
                <div
                  key={response.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {response.clients?.name || 'Sem cliente vinculado'}
                        </h3>
                        {response.clients?.email && (
                          <span className="text-sm text-gray-500">{response.clients.email}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatarData(response.created_at)}
                      </div>
                    </div>
                    <button
                      onClick={() => visualizarResposta(response.id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Ver Detalhes
                    </button>
                  </div>

                  {/* Preview das respostas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {formulario?.structure?.fields?.slice(0, 4).map((field: any) => (
                      <div key={field.id} className="text-sm">
                        <span className="font-medium text-gray-700">{field.label}:</span>{' '}
                        <span className="text-gray-900">
                          {formatarResposta(field, response.responses[field.id])}
                        </span>
                      </div>
                    ))}
                  </div>
                  {formulario?.structure?.fields?.length > 4 && (
                    <div className="mt-2 text-sm text-gray-500">
                      +{formulario.structure.fields.length - 4} campos adicionais
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma resposta encontrada</h3>
              <p className="text-gray-600">
                Ainda não há respostas para este formulário. Compartilhe o link do formulário para começar a receber respostas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Visualização de Resposta */}
      {respostaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Detalhes da Resposta</h2>
              <button
                onClick={() => setRespostaSelecionada(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Informações do Cliente */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Respondente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Cliente:</span>
                    <p className="text-gray-900 font-medium">
                      {respostaSelecionada.response.clients?.name || 'Sem cliente vinculado'}
                    </p>
                  </div>
                  {respostaSelecionada.response.clients?.email && (
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="text-gray-900">{respostaSelecionada.response.clients.email}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-600">Data/Hora:</span>
                    <p className="text-gray-900">{formatarData(respostaSelecionada.response.created_at)}</p>
                  </div>
                  {respostaSelecionada.response.ip_address && (
                    <div>
                      <span className="text-sm text-gray-600">IP:</span>
                      <p className="text-gray-900 font-mono text-sm">{respostaSelecionada.response.ip_address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Respostas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Respostas</h3>
                <div className="space-y-4">
                  {respostaSelecionada.form.structure?.fields?.map((field: any) => (
                    <div key={field.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </div>
                      <div className="text-gray-900">
                        {formatarResposta(field, respostaSelecionada.response.responses[field.id])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

