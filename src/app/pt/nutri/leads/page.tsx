'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import NutriSidebar from '@/components/nutri/NutriSidebar'

export default function NutriLeads() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <NutriLeadsContent />
    </ProtectedRoute>
  )
}

function NutriLeadsContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroFerramenta, setFiltroFerramenta] = useState('todas')
  const [busca, setBusca] = useState('')
  const [leadsDb, setLeadsDb] = useState<any[] | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [leadParaConverter, setLeadParaConverter] = useState<any>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [convertendo, setConvertendo] = useState(false)
  const [criarAvaliacaoInicial, setCriarAvaliacaoInicial] = useState(false)
  const [statusInicial, setStatusInicial] = useState('pre_consulta')
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [alertas, setAlertas] = useState<any[]>([])
  const [diasAlerta, setDiasAlerta] = useState(3)

  const leads = leadsDb ?? [
    {
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '(11) 99999-9999',
      idade: 28,
      cidade: 'São Paulo',
      ferramenta: 'Quiz Interativo',
      resultado: 'Metabolismo Rápido',
      status: 'novo',
      data: '2024-01-15',
      ultimoContato: null,
      observacoes: 'Interessada em emagrecimento',
      score: 85
    },
    {
      id: 2,
      nome: 'João Santos',
      email: 'joao@email.com',
      telefone: '(11) 88888-8888',
      idade: 35,
      cidade: 'Rio de Janeiro',
      ferramenta: 'Calculadora de IMC',
      resultado: 'IMC: 28.5 (Sobrepeso)',
      status: 'contatado',
      data: '2024-01-14',
      ultimoContato: '2024-01-16',
      observacoes: 'Agendou consulta para próxima semana',
      score: 92
    },
    {
      id: 3,
      nome: 'Ana Costa',
      email: 'ana@email.com',
      telefone: '(11) 77777-7777',
      idade: 24,
      cidade: 'Belo Horizonte',
      ferramenta: 'Post de Curiosidades',
      resultado: 'Interesse em Detox',
      status: 'convertido',
      data: '2024-01-13',
      ultimoContato: '2024-01-15',
      observacoes: 'Primeira consulta realizada',
      score: 78
    },
    {
      id: 4,
      nome: 'Carlos Oliveira',
      email: 'carlos@email.com',
      telefone: '(11) 66666-6666',
      idade: 42,
      cidade: 'Salvador',
      ferramenta: 'Quiz Interativo',
      resultado: 'Metabolismo Lento',
      status: 'novo',
      data: '2024-01-12',
      ultimoContato: null,
      observacoes: 'Busca por ganho de massa muscular',
      score: 73
    },
    {
      id: 5,
      nome: 'Fernanda Lima',
      email: 'fernanda@email.com',
      telefone: '(11) 55555-5555',
      idade: 31,
      cidade: 'Porto Alegre',
      ferramenta: 'Template Post Dica',
      resultado: 'Interesse em Alimentação Saudável',
      status: 'contatado',
      data: '2024-01-11',
      ultimoContato: '2024-01-14',
      observacoes: 'Aguardando retorno',
      score: 88
    }
  ]

  // Carregar leads reais da API
  useEffect(() => {
    if (!user) return

    const carregarLeads = async () => {
      try {
        setCarregando(true)
        const response = await fetch('/api/leads', {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar leads')
        }

        const data = await response.json()
        if (data.success && data.data.leads) {
          const leadsMapeados = data.data.leads.map((l: any) => ({
            id: l.id,
            nome: l.name,
            email: l.email,
            telefone: l.phone,
            idade: l.additional_data?.idade || null,
            cidade: l.additional_data?.cidade || '-',
            ferramenta: l.additional_data?.ferramenta || l.template_id || 'Ferramenta',
            resultado: l.additional_data?.resultado || '-',
            status: l.additional_data?.status || 'novo',
            data: new Date(l.created_at).toISOString().slice(0, 10),
            ultimoContato: l.additional_data?.ultimo_contato || null,
            observacoes: l.additional_data?.observacoes || '',
            score: l.additional_data?.score || 0,
            leadOriginal: l // Guardar lead original para conversão
          }))
          setLeadsDb(leadsMapeados)
        }
      } catch (e: any) {
        console.error('Erro ao carregar leads:', e)
        setErro('Erro ao carregar leads. Tente novamente.')
      } finally {
        setCarregando(false)
      }
    }

    carregarLeads()
    carregarAlertas()
  }, [user, diasAlerta])

  const carregarAlertas = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/nutri/leads/alerts?days=${diasAlerta}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        return
      }

      const data = await response.json()
      if (data.success && data.data.alerts) {
        setAlertas(data.data.alerts)
      }
    } catch (e) {
      // Ignorar erros silenciosamente
    }
  }

  const calcularDiasParado = (lead: any) => {
    // Tentar pegar a data de criação do lead original ou da data formatada
    const dataCriacao = lead.leadOriginal?.created_at || lead.data || lead.created_at
    if (!dataCriacao) return 0
    
    const createdDate = new Date(dataCriacao)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff
  }

  const leadPrecisaAtencao = (lead: any) => {
    const diasParado = calcularDiasParado(lead)
    return diasParado >= diasAlerta && lead.status !== 'convertido'
  }

  const status = ['todos', 'novo', 'contatado', 'convertido', 'perdido']
  const ferramentas = ['todas', 'Quiz Interativo', 'Calculadora de IMC', 'Post de Curiosidades', 'Template Post Dica']

  const leadsFiltrados = leads.filter(lead => {
    const statusMatch = filtroStatus === 'todos' || lead.status === filtroStatus
    const ferramentaMatch = filtroFerramenta === 'todas' || lead.ferramenta === filtroFerramenta
    const buscaMatch = busca === '' || 
      lead.nome.toLowerCase().includes(busca.toLowerCase()) ||
      lead.email.toLowerCase().includes(busca.toLowerCase()) ||
      lead.cidade.toLowerCase().includes(busca.toLowerCase())
    
    return statusMatch && ferramentaMatch && buscaMatch
  })

  const getStatusClasses = (status: string) => {
    const statusClasses = {
      novo: 'bg-blue-100 text-blue-800',
      contatado: 'bg-yellow-100 text-yellow-800',
      convertido: 'bg-green-100 text-green-800',
      perdido: 'bg-red-100 text-red-800'
    }
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.novo
  }

  const getScoreClasses = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-blue-100 text-blue-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const abrirModalConversao = (lead: any) => {
    setLeadParaConverter(lead)
    setModalAberto(true)
    setCriarAvaliacaoInicial(false)
    setStatusInicial('pre_consulta')
    setErro(null)
    setMensagemSucesso(null)
  }

  const converterLead = async () => {
    if (!leadParaConverter) return

    try {
      setConvertendo(true)
      setErro(null)

      const response = await fetch(`/api/nutri/leads/${leadParaConverter.id}/convert-to-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: statusInicial === 'auto' ? undefined : statusInicial,
          create_initial_assessment: criarAvaliacaoInicial
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao converter lead')
      }

      if (data.success) {
        setMensagemSucesso('Lead convertido em cliente com sucesso!')
        setModalAberto(false)
        
        // Redirecionar para o perfil do cliente após 1.5 segundos
        setTimeout(() => {
          router.push(`/pt/nutri/clientes/${data.data.client.id}`)
        }, 1500)
      }
    } catch (error: any) {
      console.error('Erro ao converter lead:', error)
      setErro(error.message || 'Erro ao converter lead. Tente novamente.')
    } finally {
      setConvertendo(false)
    }
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
          <h1 className="text-lg font-semibold text-gray-900">Leads</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leads</h1>
              <p className="text-gray-600 mt-1">Gerencie seus leads e converta em clientes</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Exportar Leads
            </button>
          </div>

          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800">{erro}</p>
            </div>
          )}

          {mensagemSucesso && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-green-800">{mensagemSucesso}</p>
            </div>
          )}

          {/* Alertas de Leads Parados */}
          {alertas.length > 0 && (
            <div className="mb-6 bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <h3 className="font-semibold text-orange-900">
                    {alertas.length} {alertas.length === 1 ? 'lead precisa' : 'leads precisam'} de atenção
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-orange-700">Alertar após:</label>
                  <select
                    value={diasAlerta}
                    onChange={(e) => setDiasAlerta(parseInt(e.target.value))}
                    className="px-2 py-1 border border-orange-300 rounded text-sm bg-white"
                  >
                    <option value="1">1 dia</option>
                    <option value="2">2 dias</option>
                    <option value="3">3 dias</option>
                    <option value="5">5 dias</option>
                    <option value="7">7 dias</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                {alertas.slice(0, 5).map((alerta) => (
                  <div key={alerta.id} className="flex items-center justify-between bg-white rounded p-2">
                    <div>
                      <span className="font-medium text-gray-900">{alerta.name}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        - {alerta.days_stale} {alerta.days_stale === 1 ? 'dia' : 'dias'} sem contato
                      </span>
                    </div>
                    <button
                      onClick={() => abrirModalConversao({ 
                        id: alerta.id, 
                        nome: alerta.name, 
                        email: alerta.email, 
                        telefone: alerta.phone,
                        leadOriginal: alerta
                      })}
                      className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
                    >
                      Converter
                    </button>
                  </div>
                ))}
                {alertas.length > 5 && (
                  <p className="text-sm text-orange-700 text-center mt-2">
                    +{alertas.length - 5} {alertas.length - 5 === 1 ? 'outro lead' : 'outros leads'} precisam de atenção
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Novos</p>
                <p className="text-3xl font-bold text-blue-600">{leads.filter(l => l.status === 'novo').length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🆕</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contatados</p>
                <p className="text-3xl font-bold text-yellow-600">{leads.filter(l => l.status === 'contatado').length}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📞</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Convertidos</p>
                <p className="text-3xl font-bold text-green-600">{leads.filter(l => l.status === 'convertido').length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Nome, email ou cidade..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {status.map(statusItem => (
                  <option key={statusItem} value={statusItem}>
                    {statusItem === 'todos' ? 'Todos os status' : statusItem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ferramenta
              </label>
              <select
                value={filtroFerramenta}
                onChange={(e) => setFiltroFerramenta(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {ferramentas.map(ferramenta => (
                  <option key={ferramenta} value={ferramenta}>
                    {ferramenta === 'todas' ? 'Todas as ferramentas' : ferramenta}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Leads ({leadsFiltrados.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ferramenta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leadsFiltrados.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.nome}</div>
                        <div className="text-sm text-gray-500">{lead.idade} anos • {lead.cidade}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.telefone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.ferramenta}</div>
                      <div className="text-sm text-gray-500">{lead.data}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.resultado}</div>
                      <div className="text-sm text-gray-500">{lead.observacoes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(lead.status)}`}>
                          {lead.status}
                        </span>
                        {leadPrecisaAtencao(lead) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800" title={`Parado há ${calcularDiasParado(lead)} dias`}>
                            ⚠️ {calcularDiasParado(lead)}d
                          </span>
                        )}
                      </div>
                      {lead.ultimoContato && (
                        <div className="text-xs text-gray-500 mt-1">
                          Último contato: {lead.ultimoContato}
                        </div>
                      )}
                      {!lead.ultimoContato && leadPrecisaAtencao(lead) && (
                        <div className="text-xs text-orange-600 mt-1">
                          Sem contato há {calcularDiasParado(lead)} dias
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreClasses(lead.score)}`}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {lead.status !== 'convertido' && (
                          <button
                            onClick={() => abrirModalConversao(lead)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Converter em Cliente
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">
                          Contatar
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Ver Detalhes
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-2xl mr-3">📧</span>
              <div>
                <h3 className="font-medium text-gray-900">Campanha de Email</h3>
                <p className="text-sm text-gray-600">Enviar email para leads selecionados</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-2xl mr-3">📊</span>
              <div>
                <h3 className="font-medium text-gray-900">Relatório de Leads</h3>
                <p className="text-sm text-gray-600">Gerar relatório detalhado</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <h3 className="font-medium text-gray-900">Segmentação</h3>
                <p className="text-sm text-gray-600">Criar segmentos de leads</p>
              </div>
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Modal de Conversão */}
      {modalAberto && leadParaConverter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Converter Lead em Cliente</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Você está convertendo:</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-900">{leadParaConverter.nome}</p>
                  <p className="text-sm text-gray-600">{leadParaConverter.email}</p>
                  <p className="text-sm text-gray-600">{leadParaConverter.telefone}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Inicial (Kanban)
                </label>
                <select
                  value={statusInicial}
                  onChange={(e) => setStatusInicial(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="auto">Automático (baseado na origem)</option>
                  <option value="lead">Contato</option>
                  <option value="pre_consulta">Pré-Consulta</option>
                  <option value="ativa">Ativa</option>
                  <option value="pausa">Pausa</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {statusInicial === 'auto' 
                    ? 'O status será determinado automaticamente baseado na origem do lead (quiz/calculadora → Contato, checklist/ebook → Pré-Consulta)'
                    : 'Você escolheu manualmente o status inicial'}
                </p>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={criarAvaliacaoInicial}
                    onChange={(e) => setCriarAvaliacaoInicial(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Criar avaliação inicial automaticamente
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Uma avaliação em rascunho será criada para você completar depois
                </p>
              </div>

              {erro && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{erro}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setModalAberto(false)}
                  disabled={convertendo}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={converterLead}
                  disabled={convertendo}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {convertendo ? 'Convertendo...' : 'Converter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
