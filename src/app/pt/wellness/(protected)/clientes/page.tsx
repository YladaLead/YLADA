'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
// REMOVIDO: ProtectedRoute - layout server-side cuida disso
import WellnessNavBar from '@/components/wellness/WellnessNavBar'

// Layout server-side já valida autenticação e perfil
export default function WellnessClientes() {
  return <WellnessClientesContent />
}

function WellnessClientesContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState<'leads' | 'clientes'>('leads')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [busca, setBusca] = useState('')
  const [leadsDb, setLeadsDb] = useState<any[]>([])
  const [clientesDb, setClientesDb] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [leadParaConverter, setLeadParaConverter] = useState<any>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [convertendo, setConvertendo] = useState(false)
  const [statusInicial, setStatusInicial] = useState('ativo')
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  // Carregar leads e clientes
  useEffect(() => {
    if (!user) return

    const carregarDados = async () => {
      try {
        setCarregando(true)
        
        // Carregar leads
        const responseLeads = await fetch('/api/wellness/leads', {
          credentials: 'include'
        })
        if (responseLeads.ok) {
          const dataLeads = await responseLeads.json()
          if (dataLeads.success && dataLeads.data.leads) {
            setLeadsDb(dataLeads.data.leads)
          }
        }

        // Carregar clientes
        const responseClientes = await fetch('/api/wellness/clientes', {
          credentials: 'include'
        })
        if (responseClientes.ok) {
          const dataClientes = await responseClientes.json()
          if (dataClientes.success && dataClientes.data.clients) {
            setClientesDb(dataClientes.data.clients)
          }
        }
      } catch (e: any) {
        console.error('Erro ao carregar dados:', e)
        setErro('Erro ao carregar dados. Tente novamente.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [user])

  const leadsFiltrados = leadsDb.filter(lead => {
    const statusMatch = filtroStatus === 'todos' || lead.status === filtroStatus
    const buscaMatch = busca === '' || 
      lead.lead_name?.toLowerCase().includes(busca.toLowerCase()) ||
      lead.lead_phone?.toLowerCase().includes(busca.toLowerCase()) ||
      lead.lead_email?.toLowerCase().includes(busca.toLowerCase())
    
    return statusMatch && buscaMatch
  })

  const clientesFiltrados = clientesDb.filter(cliente => {
    const statusMatch = filtroStatus === 'todos' || cliente.status === statusMatch
    const buscaMatch = busca === '' || 
      cliente.client_name?.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.client_phone?.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.client_email?.toLowerCase().includes(busca.toLowerCase())
    
    return statusMatch && buscaMatch
  })

  const getStatusClasses = (status: string) => {
    const statusClasses = {
      novo: 'bg-blue-100 text-blue-800',
      contato: 'bg-yellow-100 text-yellow-800',
      interessado: 'bg-purple-100 text-purple-800',
      cliente: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      ativo: 'bg-green-100 text-green-800',
      pausado: 'bg-orange-100 text-orange-800',
    }
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.novo
  }

  const abrirModalConversao = (lead: any) => {
    setLeadParaConverter(lead)
    setModalAberto(true)
    setStatusInicial('ativo')
    setErro(null)
    setMensagemSucesso(null)
  }

  const converterLead = async () => {
    if (!leadParaConverter) return

    try {
      setConvertendo(true)
      setErro(null)

      const response = await fetch(`/api/wellness/leads/${leadParaConverter.id}/convert-to-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: statusInicial,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao converter lead')
      }

      if (data.success) {
        setMensagemSucesso('Lead convertido em cliente com sucesso!')
        setModalAberto(false)
        
        // Recarregar dados
        const responseLeads = await fetch('/api/wellness/leads', { credentials: 'include' })
        const responseClientes = await fetch('/api/wellness/clientes', { credentials: 'include' })
        
        if (responseLeads.ok) {
          const dataLeads = await responseLeads.json()
          if (dataLeads.success) setLeadsDb(dataLeads.data.leads)
        }
        if (responseClientes.ok) {
          const dataClientes = await responseClientes.json()
          if (dataClientes.success) setClientesDb(dataClientes.data.clients)
        }
        
        // Mudar para aba de clientes após 1 segundo
        setTimeout(() => {
          setAbaAtiva('clientes')
        }, 1000)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Leads e Clientes" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leads e Clientes</h1>
            <p className="text-gray-600 mt-1">Gerencie seus contatos e converta leads em clientes</p>
          </div>
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

        {/* Abas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setAbaAtiva('leads')}
              className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
                abaAtiva === 'leads'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Leads ({leadsDb.length})
            </button>
            <button
              onClick={() => setAbaAtiva('clientes')}
              className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
                abaAtiva === 'clientes'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Clientes ({clientesDb.length})
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-3xl font-bold text-gray-900">{leadsDb.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-3xl font-bold text-gray-900">{clientesDb.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Novos Hoje</p>
                <p className="text-3xl font-bold text-blue-600">
                  {abaAtiva === 'leads' 
                    ? leadsDb.filter(l => {
                        const hoje = new Date().toISOString().split('T')[0]
                        return l.created_at?.split('T')[0] === hoje
                      }).length
                    : clientesDb.filter(c => {
                        const hoje = new Date().toISOString().split('T')[0]
                        return c.created_at?.split('T')[0] === hoje
                      }).length
                  }
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🆕</span>
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
                placeholder="Nome, telefone ou email..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="todos">Todos os status</option>
                {abaAtiva === 'leads' ? (
                  <>
                    <option value="novo">Novo</option>
                    <option value="contato">Contato</option>
                    <option value="interessado">Interessado</option>
                    <option value="cliente">Cliente</option>
                    <option value="inativo">Inativo</option>
                  </>
                ) : (
                  <>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="pausado">Pausado</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  {abaAtiva === 'leads' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  )}
                  {abaAtiva === 'clientes' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kits
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detox
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {abaAtiva === 'leads' ? (
                  leadsFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Nenhum lead encontrado
                      </td>
                    </tr>
                  ) : (
                    leadsFiltrados.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{lead.lead_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{lead.lead_phone || '-'}</div>
                          {lead.lead_email && (
                            <div className="text-xs text-gray-400">{lead.lead_email}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {lead.status !== 'cliente' && (
                            <button
                              onClick={() => abrirModalConversao(lead)}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Converter
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  clientesFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Nenhum cliente encontrado
                      </td>
                    </tr>
                  ) : (
                    clientesFiltrados.map((cliente) => (
                      <tr key={cliente.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cliente.client_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{cliente.client_phone || '-'}</div>
                          {cliente.client_email && (
                            <div className="text-xs text-gray-400">{cliente.client_email}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(cliente.status)}`}>
                            {cliente.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cliente.kits_vendidos || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cliente.upgrade_detox ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Conversão */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Converter Lead em Cliente
            </h2>
            <p className="text-gray-600 mb-4">
              Converter <strong>{leadParaConverter?.lead_name}</strong> em cliente?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Inicial
              </label>
              <select
                value={statusInicial}
                onChange={(e) => setStatusInicial(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="ativo">Ativo</option>
                <option value="pausado">Pausado</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setModalAberto(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={converterLead}
                disabled={convertendo}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {convertendo ? 'Convertendo...' : 'Converter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
