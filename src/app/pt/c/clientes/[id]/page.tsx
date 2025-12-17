'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CoachSidebar from "@/components/coach/CoachSidebar"
import { useAuth } from '@/contexts/AuthContext'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { displayPhoneWithFlag } from '@/utils/phoneFormatter'
import DocumentosTab from '@/components/coach/DocumentosTab'

export default function ClienteDetalhesCoach() {
  return (
    <ProtectedRoute perfil="coach" allowAdmin={true}>
      <ClienteDetalhesCoachContent />
    </ProtectedRoute>
  )
}

type TabType = 'info' | 'evolucao' | 'avaliacao' | 'emocional' | 'reavaliacoes' | 'agenda' | 'timeline' | 'programa' | 'documentos'

function ClienteDetalhesCoachContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('info')
  const [cliente, setCliente] = useState<any>(null)
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  // Carregar cliente
  useEffect(() => {
    if (!user || !clientId) return

    const carregarCliente = async () => {
      try {
        setCarregando(true)
        const response = await fetch(`/api/c/clientes?id=${clientId}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Cliente não encontrado')
        }

        const data = await response.json()
        if (data.success && data.data.client) {
          setCliente(data.data.client)
        } else {
          setErro('Cliente não encontrado')
        }
      } catch (error: any) {
        console.error('Erro ao carregar cliente:', error)
        setErro(error.message || 'Erro ao carregar cliente')
      } finally {
        setCarregando(false)
      }
    }

    carregarCliente()
  }, [user, clientId])

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

  if (!user || !cliente) {
    if (erro) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{erro}</p>
            <button
              onClick={() => router.push('/pt/coach/clientes')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Voltar para Lista
            </button>
          </div>
        </div>
      )
    }
    return null
  }

  const tabs = [
    { id: 'info' as TabType, label: 'Informações Básicas', icon: '👤' },
    { id: 'evolucao' as TabType, label: 'Evolução Física', icon: '📈' },
    { id: 'avaliacao' as TabType, label: 'Avaliação Física', icon: '🏥' },
    { id: 'emocional' as TabType, label: 'Emocional/Comportamental', icon: '💭' },
    { id: 'reavaliacoes' as TabType, label: 'Reavaliações', icon: '🔄' },
    { id: 'agenda' as TabType, label: 'Agenda', icon: '📅' },
    { id: 'timeline' as TabType, label: 'Histórico', icon: '📜' },
    { id: 'programa' as TabType, label: 'Programa Atual', icon: '📋' },
    { id: 'documentos' as TabType, label: 'Documentos', icon: '📁' }
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      lead: 'bg-purple-100 text-purple-800',
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

  const handleExcluirCliente = async () => {
    try {
      setExcluindo(true)
      const response = await fetch(`/api/coach/clientes/${clientId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao excluir cliente')
      }

      // Redirecionar para a lista de clientes após exclusão
      router.push('/pt/coach/clientes')
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error)
      setErro(error.message || 'Erro ao excluir cliente')
      setMostrarModalExclusao(false)
    } finally {
      setExcluindo(false)
    }
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
          <h1 className="text-lg font-semibold text-gray-900">Cliente</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/pt/coach/clientes')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{cliente.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cliente.status)}`}>
                    {getStatusLabel(cliente.status)}
                  </span>
                  {cliente.converted_from_lead && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Convertido de Contato
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('info')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Editar
              </button>
                <button
                  onClick={() => setMostrarModalExclusao(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Excluir
                </button>
              </div>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800">{erro}</p>
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <div className="flex space-x-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab === 'info' && (
              <InfoTab cliente={cliente} clientId={clientId} />
            )}
            {activeTab === 'evolucao' && (
              <EvolucaoTab cliente={cliente} clientId={clientId} />
            )}
            {activeTab === 'avaliacao' && (
              <AvaliacaoTab cliente={cliente} clientId={clientId} />
            )}
            {activeTab === 'emocional' && (
              <EmocionalTab cliente={cliente} clientId={clientId} />
            )}
            {activeTab === 'reavaliacoes' && (
              <ReavaliacoesTab cliente={cliente} clientId={clientId} />
            )}
            {activeTab === 'agenda' && (
              <AgendaTab cliente={cliente} clientId={clientId} />
            )}
            {activeTab === 'timeline' && (
              <TimelineTab cliente={cliente} clientId={clientId} />
            )}
            {activeTab === 'programa' && (
              <ProgramaTab cliente={cliente} clientId={clientId} />
            )}
            {activeTab === 'documentos' && (
              <DocumentosTab clientId={clientId} />
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {mostrarModalExclusao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmar exclusão</h3>
                <p className="text-sm text-gray-600 mt-1">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Tem certeza que deseja excluir o cliente <strong>{cliente?.name}</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                O cliente será marcado como finalizado e não aparecerá mais na lista ativa.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setMostrarModalExclusao(false)}
                disabled={excluindo}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluirCliente}
                disabled={excluindo}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {excluindo && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {excluindo ? 'Excluindo...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente: Aba Informações Básicas
function InfoTab({ cliente, clientId }: { cliente: any; clientId: string }) {
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)
  const [formData, setFormData] = useState({
    name: cliente.name || '',
    email: cliente.email || '',
    phone: cliente.phone || '',
    phone_country_code: cliente.phone_country_code || 'BR',
    birth_date: cliente.birth_date || '',
    gender: cliente.gender || '',
    cpf: cliente.cpf || '',
    status: cliente.status || 'lead',
    goal: cliente.goal || '',
    instagram: cliente.instagram || '',
    address: {
      street: cliente.address_street || '',
      number: cliente.address_number || '',
      complement: cliente.address_complement || '',
      neighborhood: cliente.address_neighborhood || '',
      city: cliente.address_city || '',
      state: cliente.address_state || '',
      zipcode: cliente.address_zipcode || ''
    }
  })

  // Atualizar formData quando cliente mudar
  useEffect(() => {
    if (cliente) {
      setFormData({
        name: cliente.name || '',
        email: cliente.email || '',
        phone: cliente.phone || '',
        phone_country_code: cliente.phone_country_code || 'BR',
        birth_date: cliente.birth_date || '',
        gender: cliente.gender || '',
        cpf: cliente.cpf || '',
        status: cliente.status || 'lead',
        goal: cliente.goal || '',
        instagram: cliente.instagram || '',
        address: {
          street: cliente.address_street || '',
          number: cliente.address_number || '',
          complement: cliente.address_complement || '',
          neighborhood: cliente.address_neighborhood || '',
          city: cliente.address_city || '',
          state: cliente.address_state || '',
          zipcode: cliente.address_zipcode || ''
        }
      })
    }
  }, [cliente])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSalvando(true)

    try {
      // Preparar payload removendo campos não suportados pela API
      const { phone_country_code, ...payload } = formData
      
      // Preparar payload final
      const finalPayload: any = {
        name: payload.name.trim(),
        email: payload.email?.trim() || null,
        phone: payload.phone?.trim() || null,
        birth_date: payload.birth_date || null,
        gender: payload.gender || null,
        cpf: payload.cpf?.trim() || null,
        instagram: payload.instagram?.trim() || null,
        status: payload.status,
        goal: payload.goal?.trim() || null,
        address: {
          street: payload.address.street?.trim() || null,
          number: payload.address.number?.trim() || null,
          complement: payload.address.complement?.trim() || null,
          neighborhood: payload.address.neighborhood?.trim() || null,
          city: payload.address.city?.trim() || null,
          state: payload.address.state?.trim() || null,
          zipcode: payload.address.zipcode?.trim() || null
        }
      }

      const response = await fetch(`/api/coach/clientes/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(finalPayload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar cliente')
      }

      if (data.success) {
        setSucesso(true)
        setEditando(false)
        setTimeout(() => {
          setSucesso(false)
        // Recarregar página para atualizar dados
        window.location.reload()
        }, 1000)
      }
    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error)
      setErro(error.message || 'Erro ao atualizar cliente. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Informações Básicas</h2>
        {!editando && (
          <button
            onClick={() => setEditando(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Editar
          </button>
        )}
      </div>

      {erro && (
        <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800">{erro}</p>
        </div>
      )}

      {sucesso && (
        <div className="mb-4 bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <p className="text-green-800">Cliente atualizado com sucesso!</p>
        </div>
      )}

      {editando ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  id="birth_date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Selecione</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                </select>
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <PhoneInputWithCountry
                  value={formData.phone}
                  defaultCountryCode={formData.phone_country_code || 'BR'}
                  onChange={(phone, countryCode) => {
                    setFormData(prev => ({
                      ...prev,
                      phone,
                      phone_country_code: countryCode
                    }))
                  }}
                />
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@usuario"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Objetivo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivo</h3>
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo da Cliente
              </label>
              <textarea
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva o objetivo principal da cliente..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">
                  Rua
                </label>
                <input
                  type="text"
                  id="address.street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="address.number" className="block text-sm font-medium text-gray-700 mb-2">
                  Número
                </label>
                <input
                  type="text"
                  id="address.number"
                  name="address.number"
                  value={formData.address.number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="address.complement" className="block text-sm font-medium text-gray-700 mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  id="address.complement"
                  name="address.complement"
                  value={formData.address.complement}
                  onChange={handleChange}
                  placeholder="Apto, Bloco, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="address.neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  id="address.neighborhood"
                  name="address.neighborhood"
                  value={formData.address.neighborhood}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="UF"
                  maxLength={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="address.zipcode" className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  id="address.zipcode"
                  name="address.zipcode"
                  value={formData.address.zipcode}
                  onChange={handleChange}
                  placeholder="00000-000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status da Cliente
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="lead">Contato</option>
                <option value="pre_consulta">Pré-Consulta</option>
                <option value="ativa">Ativa</option>
                <option value="pausa">Pausa</option>
                <option value="finalizada">Finalizada</option>
              </select>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Dados Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="text-base font-medium text-gray-900">{cliente.name}</p>
              </div>
              {cliente.birth_date && (
                <div>
                  <p className="text-sm text-gray-600">Data de Nascimento</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(cliente.birth_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
              {cliente.gender && (
                <div>
                  <p className="text-sm text-gray-600">Gênero</p>
                  <p className="text-base font-medium text-gray-900 capitalize">{cliente.gender}</p>
                </div>
              )}
              {cliente.cpf && (
                <div>
                  <p className="text-sm text-gray-600">CPF</p>
                  <p className="text-base font-medium text-gray-900">{cliente.cpf}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cliente.email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-base font-medium text-gray-900">{cliente.email}</p>
                </div>
              )}
              {cliente.phone && (
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="text-base font-medium text-gray-900 flex items-center gap-1">
                    {displayPhoneWithFlag(cliente.phone)}
                  </p>
                </div>
              )}
              {cliente.instagram && (
                <div>
                  <p className="text-sm text-gray-600">Instagram</p>
                  <p className="text-base font-medium text-gray-900">{cliente.instagram}</p>
                </div>
              )}
            </div>
          </div>

          {/* Objetivo */}
          {cliente.goal && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivo</h3>
              <p className="text-base text-gray-700">{cliente.goal}</p>
            </div>
          )}

          {/* Endereço */}
          {(cliente.address_street || cliente.address_city) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cliente.address_street && (
                  <div>
                    <p className="text-sm text-gray-600">Rua</p>
                    <p className="text-base font-medium text-gray-900">
                      {cliente.address_street}
                      {cliente.address_number && `, ${cliente.address_number}`}
                      {cliente.address_complement && ` - ${cliente.address_complement}`}
                    </p>
                  </div>
                )}
                {cliente.address_neighborhood && (
                  <div>
                    <p className="text-sm text-gray-600">Bairro</p>
                    <p className="text-base font-medium text-gray-900">{cliente.address_neighborhood}</p>
                  </div>
                )}
                {cliente.address_city && (
                  <div>
                    <p className="text-sm text-gray-600">Cidade</p>
                    <p className="text-base font-medium text-gray-900">
                      {cliente.address_city}
                      {cliente.address_state && ` - ${cliente.address_state}`}
                    </p>
                  </div>
                )}
                {cliente.address_zipcode && (
                  <div>
                    <p className="text-sm text-gray-600">CEP</p>
                    <p className="text-base font-medium text-gray-900">{cliente.address_zipcode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Origem do Lead */}
          {cliente.converted_from_lead && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Origem</h3>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <span className="font-semibold">Convertido de Contato</span>
                  {cliente.lead_source && ` via ${cliente.lead_source}`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Aba: Evolução Física
function EvolucaoTab({ cliente, clientId }: { cliente: any; clientId: string }) {
  const [evolucoes, setEvolucoes] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [formData, setFormData] = useState({
    measurement_date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    waist_circumference: '',
    hip_circumference: '',
    neck_circumference: '',
    arm_circumference: '',
    thigh_circumference: '',
    body_fat_percentage: '',
    muscle_mass: '',
    water_percentage: '',
    visceral_fat: '',
    notes: '',
    photos_urls: [] as string[]
  })

  // Carregar evoluções
  useEffect(() => {
    const carregarEvolucoes = async () => {
      try {
        setCarregando(true)
        const response = await fetch(`/api/c/clientes/${clientId}/evolucao`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar evoluções')
        }

        const data = await response.json()
        if (data.success) {
          setEvolucoes(data.data.evolutions || [])
        }
      } catch (error: any) {
        console.error('Erro ao carregar evoluções:', error)
        setErro(error.message || 'Erro ao carregar evoluções')
      } finally {
        setCarregando(false)
      }
    }

    carregarEvolucoes()
  }, [clientId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSalvando(true)

    try {
      const payload: any = {
        measurement_date: formData.measurement_date,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        waist_circumference: formData.waist_circumference ? parseFloat(formData.waist_circumference) : null,
        hip_circumference: formData.hip_circumference ? parseFloat(formData.hip_circumference) : null,
        neck_circumference: formData.neck_circumference ? parseFloat(formData.neck_circumference) : null,
        arm_circumference: formData.arm_circumference ? parseFloat(formData.arm_circumference) : null,
        thigh_circumference: formData.thigh_circumference ? parseFloat(formData.thigh_circumference) : null,
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        muscle_mass: formData.muscle_mass ? parseFloat(formData.muscle_mass) : null,
        water_percentage: formData.water_percentage ? parseFloat(formData.water_percentage) : null,
        visceral_fat: formData.visceral_fat ? parseFloat(formData.visceral_fat) : null,
        notes: formData.notes || null,
        photos_urls: formData.photos_urls
      }

      const response = await fetch(`/api/c/clientes/${clientId}/evolucao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('❌ Erro na API de evolução:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          technical: data.technical
        })
        throw new Error(data.error || `Erro ao criar registro de evolução (${response.status})`)
      }

      if (data.success) {
        setMostrarForm(false)
        setFormData({
          measurement_date: new Date().toISOString().split('T')[0],
          weight: '',
          height: '',
          waist_circumference: '',
          hip_circumference: '',
          neck_circumference: '',
          arm_circumference: '',
          thigh_circumference: '',
          body_fat_percentage: '',
          muscle_mass: '',
          water_percentage: '',
          visceral_fat: '',
          notes: '',
          photos_urls: []
        })
        // Recarregar evoluções
        window.location.reload()
      }
    } catch (error: any) {
      console.error('Erro ao criar evolução:', error)
      setErro(error.message || 'Erro ao criar registro de evolução. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  // Preparar dados para gráficos
  const dadosGraficoPeso = evolucoes
    .filter(e => e.weight)
    .map(e => ({
      date: new Date(e.measurement_date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      weight: parseFloat(e.weight)
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const dadosGraficoIMC = evolucoes
    .filter(e => e.bmi)
    .map(e => ({
      date: new Date(e.measurement_date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      bmi: parseFloat(e.bmi)
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const maxPeso = dadosGraficoPeso.length > 0 ? Math.max(...dadosGraficoPeso.map(d => d.weight)) : 100
  const minPeso = dadosGraficoPeso.length > 0 ? Math.min(...dadosGraficoPeso.map(d => d.weight)) : 0
  const rangePeso = maxPeso - minPeso || 1

  const maxIMC = dadosGraficoIMC.length > 0 ? Math.max(...dadosGraficoIMC.map(d => d.bmi)) : 30
  const minIMC = dadosGraficoIMC.length > 0 ? Math.min(...dadosGraficoIMC.map(d => d.bmi)) : 0
  const rangeIMC = maxIMC - minIMC || 1

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando evoluções...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Evolução Física</h2>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          {mostrarForm ? 'Cancelar' : '+ Novo Registro'}
        </button>
      </div>

      {erro && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800">{erro}</p>
        </div>
      )}

      {/* Formulário de Novo Registro */}
      {mostrarForm && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Registro de Evolução</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="measurement_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Data da Medição *
                </label>
                <input
                  type="date"
                  id="measurement_date"
                  name="measurement_date"
                  value={formData.measurement_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (m)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="waist_circumference" className="block text-sm font-medium text-gray-700 mb-2">
                  Cintura (cm)
                </label>
                <input
                  type="number"
                  id="waist_circumference"
                  name="waist_circumference"
                  value={formData.waist_circumference}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="hip_circumference" className="block text-sm font-medium text-gray-700 mb-2">
                  Quadril (cm)
                </label>
                <input
                  type="number"
                  id="hip_circumference"
                  name="hip_circumference"
                  value={formData.hip_circumference}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="body_fat_percentage" className="block text-sm font-medium text-gray-700 mb-2">
                  % Gordura Corporal
                </label>
                <input
                  type="number"
                  id="body_fat_percentage"
                  name="body_fat_percentage"
                  value={formData.body_fat_percentage}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMostrarForm(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {salvando ? 'Salvando...' : 'Salvar Registro'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gráficos */}
      {evolucoes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Peso */}
          {dadosGraficoPeso.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução do Peso</h3>
              <div className="h-64 relative">
                <svg width="100%" height="100%" className="overflow-visible">
                  <defs>
                    <linearGradient id="pesoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Área do gráfico */}
                  <path
                    d={`M ${20} ${240 - ((dadosGraficoPeso[0].weight - minPeso) / rangePeso) * 200} ${dadosGraficoPeso.map((d, i) => `L ${20 + (i * (280 / (dadosGraficoPeso.length - 1 || 1)))} ${240 - ((d.weight - minPeso) / rangePeso) * 200}`).join(' ')} L ${300} 240 L 20 240 Z`}
                    fill="url(#pesoGradient)"
                  />
                  {/* Linha do gráfico */}
                  <polyline
                    points={dadosGraficoPeso.map((d, i) => `${20 + (i * (280 / (dadosGraficoPeso.length - 1 || 1)))},${240 - ((d.weight - minPeso) / rangePeso) * 200}`).join(' ')}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  {/* Pontos */}
                  {dadosGraficoPeso.map((d, i) => (
                    <circle
                      key={i}
                      cx={20 + (i * (280 / (dadosGraficoPeso.length - 1 || 1)))}
                      cy={240 - ((d.weight - minPeso) / rangePeso) * 200}
                      r="4"
                      fill="#3B82F6"
                    />
                  ))}
                  {/* Labels */}
                  {dadosGraficoPeso.map((d, i) => (
                    <text
                      key={i}
                      x={20 + (i * (280 / (dadosGraficoPeso.length - 1 || 1)))}
                      y={260}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {d.date}
                    </text>
                  ))}
                </svg>
                <div className="absolute top-0 right-0 text-sm text-gray-600">
                  {dadosGraficoPeso[dadosGraficoPeso.length - 1]?.weight.toFixed(1)} kg
                </div>
              </div>
            </div>
          )}

          {/* Gráfico de IMC */}
          {dadosGraficoIMC.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução do IMC</h3>
              <div className="h-64 relative">
                <svg width="100%" height="100%" className="overflow-visible">
                  <defs>
                    <linearGradient id="imcGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M ${20} ${240 - ((dadosGraficoIMC[0].bmi - minIMC) / rangeIMC) * 200} ${dadosGraficoIMC.map((d, i) => `L ${20 + (i * (280 / (dadosGraficoIMC.length - 1 || 1)))} ${240 - ((d.bmi - minIMC) / rangeIMC) * 200}`).join(' ')} L ${300} 240 L 20 240 Z`}
                    fill="url(#imcGradient)"
                  />
                  <polyline
                    points={dadosGraficoIMC.map((d, i) => `${20 + (i * (280 / (dadosGraficoIMC.length - 1 || 1)))},${240 - ((d.bmi - minIMC) / rangeIMC) * 200}`).join(' ')}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  {dadosGraficoIMC.map((d, i) => (
                    <circle
                      key={i}
                      cx={20 + (i * (280 / (dadosGraficoIMC.length - 1 || 1)))}
                      cy={240 - ((d.bmi - minIMC) / rangeIMC) * 200}
                      r="4"
                      fill="#10B981"
                    />
                  ))}
                  {dadosGraficoIMC.map((d, i) => (
                    <text
                      key={i}
                      x={20 + (i * (280 / (dadosGraficoIMC.length - 1 || 1)))}
                      y={260}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {d.date}
                    </text>
                  ))}
                </svg>
                <div className="absolute top-0 right-0 text-sm text-gray-600">
                  {dadosGraficoIMC[dadosGraficoIMC.length - 1]?.bmi.toFixed(1)} IMC
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabela Histórica */}
      {evolucoes.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso (kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cintura (cm)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quadril (cm)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Gordura</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {evolucoes
                  .sort((a, b) => new Date(b.measurement_date).getTime() - new Date(a.measurement_date).getTime())
                  .map((evolucao) => (
                    <tr key={evolucao.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(evolucao.measurement_date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {evolucao.weight ? `${parseFloat(evolucao.weight).toFixed(1)}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {evolucao.bmi ? `${parseFloat(evolucao.bmi).toFixed(1)}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {evolucao.waist_circumference ? `${parseFloat(evolucao.waist_circumference).toFixed(1)}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {evolucao.hip_circumference ? `${parseFloat(evolucao.hip_circumference).toFixed(1)}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {evolucao.body_fat_percentage ? `${parseFloat(evolucao.body_fat_percentage).toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">Nenhum registro de evolução encontrado.</p>
          <button
            onClick={() => setMostrarForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Adicionar Primeiro Registro
          </button>
        </div>
      )}
    </div>
  )
}

function AvaliacaoTab({ cliente, clientId }: { cliente: any; clientId: string }) {
  const [assessments, setAssessments] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null)

  const initialFormState = () => ({
    assessment_type: 'antropometrica',
    assessment_name: '',
    measurement_date: new Date().toISOString().split('T')[0],
    status: 'completo',
    is_reevaluation: false,
    parent_assessment_id: '',
    interpretation: '',
    recommendations: '',
    data: {
      weight: '',
      height: '',
      bmi: '',
      waist_circumference: '',
      hip_circumference: '',
      chest_circumference: '',
      arm_circumference: '',
      thigh_circumference: '',
      body_fat_percentage: '',
      muscle_mass: '',
      water_percentage: '',
      visceral_fat: '',
      notes: ''
    }
  })

  const [formData, setFormData] = useState(initialFormState)

  const carregarAvaliacoes = async () => {
    try {
      setCarregando(true)
      const params = new URLSearchParams()
      params.append('order_by', 'created_at')
      params.append('order', 'desc')
      params.append('limit', '100')

      const response = await fetch(`/api/c/clientes/${clientId}/avaliacoes?${params.toString()}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Erro ao carregar avaliações')
      }

      const data = await response.json()
      const lista = data.data?.assessments || []
      setAssessments(lista)
      if (lista.length > 0) {
        setSelectedAssessmentId((prev) => prev || lista[0].id)
      } else {
        setSelectedAssessmentId(null)
      }
    } catch (error: any) {
      console.error('Erro ao carregar avaliações:', error)
      setErro(error.message || 'Erro ao carregar avaliações')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarAvaliacoes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target
    if (name === 'is_reevaluation') {
      setFormData(prev => ({
        ...prev,
        is_reevaluation: checked,
        parent_assessment_id: checked ? prev.parent_assessment_id : ''
      }))
      return
    }

    if (name.startsWith('data.')) {
      const field = name.replace('data.', '')
      setFormData(prev => {
        const updated = {
          ...prev,
          data: {
            ...prev.data,
            [field]: value
          }
        }

        if (field === 'weight' || field === 'height') {
          const peso = parseFloat((field === 'weight' ? value : updated.data.weight || '').replace(',', '.'))
          const altura = parseFloat((field === 'height' ? value : updated.data.height || '').replace(',', '.'))
          if (!isNaN(peso) && !isNaN(altura) && altura > 0) {
            const bmi = (peso / (altura * altura)).toFixed(1)
            updated.data.bmi = bmi
          } else {
            updated.data.bmi = ''
          }
        }

        return updated
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const resetForm = () => {
    setFormData(initialFormState())
  }

  const normalizeNumber = (value: string) => {
    if (!value) return null
    const parsed = parseFloat(value.replace(',', '.'))
    return isNaN(parsed) ? null : parsed
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSalvando(true)

    try {
      const payload = {
        assessment_type: formData.assessment_type,
        assessment_name: formData.assessment_name || null,
        status: formData.status,
        is_reevaluation: formData.is_reevaluation,
        parent_assessment_id: formData.is_reevaluation && formData.parent_assessment_id ? formData.parent_assessment_id : null,
        interpretation: formData.interpretation || null,
        recommendations: formData.recommendations || null,
        data: {
          measurement_date: formData.measurement_date,
          weight: normalizeNumber(formData.data.weight),
          height: normalizeNumber(formData.data.height),
          bmi: normalizeNumber(formData.data.bmi),
          waist_circumference: normalizeNumber(formData.data.waist_circumference),
          hip_circumference: normalizeNumber(formData.data.hip_circumference),
          chest_circumference: normalizeNumber(formData.data.chest_circumference),
          arm_circumference: normalizeNumber(formData.data.arm_circumference),
          thigh_circumference: normalizeNumber(formData.data.thigh_circumference),
          body_fat_percentage: normalizeNumber(formData.data.body_fat_percentage),
          muscle_mass: normalizeNumber(formData.data.muscle_mass),
          water_percentage: normalizeNumber(formData.data.water_percentage),
          visceral_fat: normalizeNumber(formData.data.visceral_fat),
          notes: formData.data.notes || null
        }
      }

      const response = await fetch(`/api/coach/clientes/${clientId}/avaliacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar avaliação')
      }

      setMostrarForm(false)
      resetForm()
      await carregarAvaliacoes()
    } catch (error: any) {
      console.error('Erro ao salvar avaliação:', error)
      setErro(error.message || 'Erro ao salvar avaliação. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const selectedAssessment = assessments.find((assessment) => assessment.id === selectedAssessmentId)

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando avaliações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Avaliação Física</h2>
          <p className="text-sm text-gray-600">Registre medidas corporais, composição e notas rápidas.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {assessments.length > 0 && (
            <button
              onClick={() => carregarAvaliacoes()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              Atualizar lista
            </button>
          )}
          <button
            onClick={() => {
              setMostrarForm(!mostrarForm)
              if (!mostrarForm) {
                resetForm()
              }
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            {mostrarForm ? 'Cancelar' : '+ Nova Avaliação'}
          </button>
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{erro}</p>
        </div>
      )}

      {mostrarForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Registrar Avaliação</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Avaliação *</label>
                <select
                  name="assessment_type"
                  value={formData.assessment_type}
                  onChange={handleFieldChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="antropometrica">Antropométrica</option>
                  <option value="bioimpedancia">Bioimpedância</option>
                  <option value="anamnese">Anamnese</option>
                  <option value="questionario">Questionário</option>
                  <option value="reavaliacao">Reavaliação</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome / Identificação</label>
                <input
                  type="text"
                  name="assessment_name"
                  value={formData.assessment_name}
                  onChange={handleFieldChange}
                  placeholder="Ex: Avaliação inicial fevereiro"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data da avaliação *</label>
                <input
                  type="date"
                  name="measurement_date"
                  value={formData.measurement_date}
                  onChange={handleFieldChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFieldChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="rascunho">Rascunho</option>
                  <option value="completo">Completo</option>
                </select>
              </div>
              <label className="flex items-center gap-3 text-sm font-medium text-gray-700 mt-6">
                <input
                  type="checkbox"
                  name="is_reevaluation"
                  checked={formData.is_reevaluation}
                  onChange={handleFieldChange}
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                />
                Essa avaliação é uma reavaliação
              </label>
            </div>

            {formData.is_reevaluation && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação anterior</label>
                <select
                  name="parent_assessment_id"
                  value={formData.parent_assessment_id}
                  onChange={handleFieldChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Selecione a avaliação base</option>
                  {assessments
                    .filter(a => !a.is_reevaluation)
                    .map(a => (
                      <option key={a.id} value={a.id}>
                        #{a.assessment_number || 1} • {a.assessment_name || 'Avaliação'} ({new Date(a.created_at).toLocaleDateString('pt-BR')})
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Medidas corporais</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="data.weight"
                    value={formData.data.weight}
                    onChange={handleFieldChange}
                    placeholder="Ex: 68.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Altura (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="data.height"
                    value={formData.data.height}
                    onChange={handleFieldChange}
                    placeholder="Ex: 1.65"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IMC</label>
                  <input
                    type="text"
                    name="data.bmi"
                    value={formData.data.bmi}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-lg text-gray-600"
                    placeholder="Calculado automaticamente"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Circunferências (cm)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Cintura', name: 'waist_circumference' },
                  { label: 'Quadril', name: 'hip_circumference' },
                  { label: 'Peitoral', name: 'chest_circumference' },
                  { label: 'Braço', name: 'arm_circumference' },
                  { label: 'Coxa', name: 'thigh_circumference' }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                    <input
                      type="number"
                      step="0.1"
                      name={`data.${field.name}`}
                      value={(formData.data as any)[field.name]}
                      onChange={handleFieldChange}
                      placeholder="Ex: 82"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Composição corporal</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: '% Gordura', name: 'body_fat_percentage', placeholder: 'Ex: 28.5' },
                  { label: 'Massa Magra (kg)', name: 'muscle_mass', placeholder: 'Ex: 48' },
                  { label: '% Água', name: 'water_percentage', placeholder: 'Ex: 52' },
                  { label: 'Gordura visceral', name: 'visceral_fat', placeholder: 'Ex: 6' }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                    <input
                      type="number"
                      step="0.1"
                      name={`data.${field.name}`}
                      value={(formData.data as any)[field.name]}
                      onChange={handleFieldChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interpretação / Observações</label>
                <textarea
                  name="interpretation"
                  value={formData.interpretation}
                  onChange={handleFieldChange}
                  rows={3}
                  placeholder="Resumo rápido do que você percebeu nesta avaliação."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recomendações / Plano</label>
                <textarea
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleFieldChange}
                  rows={3}
                  placeholder="Ex: Ajustar ingestão de proteínas, revisar treino..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas internas</label>
                <textarea
                  name="data.notes"
                  value={formData.data.notes}
                  onChange={handleFieldChange}
                  rows={3}
                  placeholder="Essas notas não são compartilhadas com a cliente."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setMostrarForm(false)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                {salvando && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                Salvar avaliação
              </button>
            </div>
          </form>
        </div>
      )}

      {assessments.length === 0 && !mostrarForm ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-600 mb-4">Você ainda não registrou nenhuma avaliação física.</p>
          <button
            onClick={() => setMostrarForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Registrar primeira avaliação
          </button>
        </div>
      ) : null}

      {assessments.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {selectedAssessment ? (
              <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Avaliação selecionada</p>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {selectedAssessment.assessment_name || 'Avaliação'} #{selectedAssessment.assessment_number || 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedAssessment.assessment_type === 'antropometrica' && 'Antropométrica'}
                      {selectedAssessment.assessment_type === 'bioimpedancia' && 'Bioimpedância'}
                      {selectedAssessment.assessment_type === 'anamnese' && 'Anamnese'}
                      {['questionario', 'reavaliacao', 'outro'].includes(selectedAssessment.assessment_type) && selectedAssessment.assessment_type}
                      {' • '}
                      {selectedAssessment.data?.measurement_date
                        ? new Date(selectedAssessment.data.measurement_date).toLocaleDateString('pt-BR')
                        : new Date(selectedAssessment.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedAssessment.status === 'completo'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedAssessment.status === 'completo' ? 'Completo' : 'Rascunho'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Peso', value: selectedAssessment.data?.weight ? `${selectedAssessment.data.weight} kg` : '-' },
                    { label: 'Altura', value: selectedAssessment.data?.height ? `${selectedAssessment.data.height} m` : '-' },
                    { label: 'IMC', value: selectedAssessment.data?.bmi ? selectedAssessment.data?.bmi : '-' },
                    { label: 'Cintura', value: selectedAssessment.data?.waist_circumference ? `${selectedAssessment.data?.waist_circumference} cm` : '-' },
                    { label: 'Quadril', value: selectedAssessment.data?.hip_circumference ? `${selectedAssessment.data?.hip_circumference} cm` : '-' },
                    { label: 'Gordura corporal', value: selectedAssessment.data?.body_fat_percentage ? `${selectedAssessment.data?.body_fat_percentage}%` : '-' },
                    { label: 'Massa magra', value: selectedAssessment.data?.muscle_mass ? `${selectedAssessment.data?.muscle_mass} kg` : '-' },
                    { label: 'Água corporal', value: selectedAssessment.data?.water_percentage ? `${selectedAssessment.data?.water_percentage}%` : '-' }
                  ].map(item => (
                    <div key={item.label} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-xs uppercase text-gray-500">{item.label}</p>
                      <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>

                {selectedAssessment.interpretation && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Interpretação</h4>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{selectedAssessment.interpretation}</p>
                  </div>
                )}

                {selectedAssessment.recommendations && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Recomendações</h4>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{selectedAssessment.recommendations}</p>
                  </div>
                )}

                {selectedAssessment.data?.notes && (
                  <div className="mt-4 bg-purple-50 border border-purple-100 rounded-lg p-4">
                    <p className="text-sm font-semibold text-purple-900 mb-1">Notas internas</p>
                    <p className="text-sm text-purple-800 whitespace-pre-line">{selectedAssessment.data.notes}</p>
                  </div>
                )}

                {selectedAssessment.is_reevaluation && selectedAssessment.comparison_data && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Comparação automática</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['weight', 'bmi', 'body_fat_percentage', 'muscle_mass', 'waist_circumference', 'hip_circumference'].map((field) => {
                        const comp = selectedAssessment.comparison_data[field]
                        if (!comp || typeof comp !== 'object') return null
                        const diff = parseFloat(comp.difference ?? 0)
                        const signal = diff > 0 ? '+' : ''
                        return (
                          <div key={field} className="rounded-lg border border-gray-200 p-4">
                            <p className="text-xs uppercase text-gray-500">{field.replace('_', ' ')}</p>
                            <p className="text-lg font-semibold text-gray-900">{signal}{diff.toFixed(1)}</p>
                            {comp.percent_change && (
                              <p className="text-xs text-gray-500">{comp.percent_change}% desde a última avaliação</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500">
                Selecione uma avaliação para visualizar os detalhes.
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Histórico de avaliações</h3>
            <div className="space-y-3">
              {assessments.map((assessment) => {
                const data = assessment.data || {}
                const isSelected = assessment.id === selectedAssessmentId
                return (
                  <button
                    key={assessment.id}
                    onClick={() => setSelectedAssessmentId(assessment.id)}
                    className={`w-full text-left border rounded-lg p-4 transition-all ${
                      isSelected ? 'border-purple-400 bg-purple-50 shadow-sm' : 'border-gray-200 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {assessment.assessment_name || 'Avaliação'} #{assessment.assessment_number || 1}
                        </p>
                        <p className="text-xs text-gray-500">
                          {data.measurement_date
                            ? new Date(data.measurement_date).toLocaleDateString('pt-BR')
                            : new Date(assessment.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                        assessment.is_reevaluation ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {assessment.is_reevaluation ? 'Reavaliação' : 'Inicial'}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                      {data.weight && <span>⚖️ {data.weight} kg</span>}
                      {data.body_fat_percentage && <span>💧 {data.body_fat_percentage}% gordura</span>}
                      {data.waist_circumference && <span>📏 Cintura {data.waist_circumference} cm</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Aba: Emocional/Comportamental
function EmocionalTab({ cliente, clientId }: { cliente: any; clientId: string }) {
  const [registros, setRegistros] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos')
  const [formData, setFormData] = useState({
    record_date: new Date().toISOString().split('T')[0],
    record_type: 'ambos',
    emotional_state: '',
    emotional_notes: '',
    stress_level: '',
    mood_score: '',
    sleep_quality: '',
    energy_level: '',
    adherence_score: '',
    meal_following_percentage: '',
    exercise_frequency: '',
    water_intake_liters: '',
    behavioral_notes: '',
    patterns_identified: [] as string[],
    triggers: [] as string[],
    notes: ''
  })
  const [novoPadrao, setNovoPadrao] = useState('')
  const [novoGatilho, setNovoGatilho] = useState('')

  // Carregar registros
  useEffect(() => {
    const carregarRegistros = async () => {
      try {
        setCarregando(true)
        const params = new URLSearchParams()
        if (tipoFiltro !== 'todos') {
          params.append('record_type', tipoFiltro)
        }

        const response = await fetch(`/api/c/clientes/${clientId}/emocional?${params.toString()}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar registros')
        }

        const data = await response.json()
        if (data.success) {
          setRegistros(data.data.records || [])
        }
      } catch (error: any) {
        console.error('Erro ao carregar registros:', error)
        setErro(error.message || 'Erro ao carregar registros')
      } finally {
        setCarregando(false)
      }
    }

    carregarRegistros()
  }, [clientId, tipoFiltro])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const adicionarPadrao = () => {
    if (novoPadrao.trim()) {
      setFormData(prev => ({
        ...prev,
        patterns_identified: [...prev.patterns_identified, novoPadrao.trim()]
      }))
      setNovoPadrao('')
    }
  }

  const removerPadrao = (index: number) => {
    setFormData(prev => ({
      ...prev,
      patterns_identified: prev.patterns_identified.filter((_, i) => i !== index)
    }))
  }

  const adicionarGatilho = () => {
    if (novoGatilho.trim()) {
      setFormData(prev => ({
        ...prev,
        triggers: [...prev.triggers, novoGatilho.trim()]
      }))
      setNovoGatilho('')
    }
  }

  const removerGatilho = (index: number) => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSalvando(true)

    try {
      const payload = {
        record_date: formData.record_date,
        record_type: formData.record_type,
        emotional_state: formData.emotional_state || null,
        emotional_notes: formData.emotional_notes || null,
        stress_level: formData.stress_level ? parseInt(formData.stress_level) : null,
        mood_score: formData.mood_score ? parseInt(formData.mood_score) : null,
        sleep_quality: formData.sleep_quality || null,
        energy_level: formData.energy_level || null,
        adherence_score: formData.adherence_score ? parseInt(formData.adherence_score) : null,
        meal_following_percentage: formData.meal_following_percentage ? parseFloat(formData.meal_following_percentage) : null,
        exercise_frequency: formData.exercise_frequency || null,
        water_intake_liters: formData.water_intake_liters ? parseFloat(formData.water_intake_liters) : null,
        behavioral_notes: formData.behavioral_notes || null,
        patterns_identified: formData.patterns_identified,
        triggers: formData.triggers,
        notes: formData.notes || null
      }

      const response = await fetch(`/api/c/clientes/${clientId}/emocional`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('❌ Erro na API emocional:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          technical: data.technical
        })
        throw new Error(data.error || `Erro ao criar registro (${response.status})`)
      }

      if (data.success) {
        setMostrarForm(false)
        setFormData({
          record_date: new Date().toISOString().split('T')[0],
          record_type: 'ambos',
          emotional_state: '',
          emotional_notes: '',
          stress_level: '',
          mood_score: '',
          sleep_quality: '',
          energy_level: '',
          adherence_score: '',
          meal_following_percentage: '',
          exercise_frequency: '',
          water_intake_liters: '',
          behavioral_notes: '',
          patterns_identified: [],
          triggers: [],
          notes: ''
        })
        window.location.reload()
      }
    } catch (error: any) {
      console.error('Erro ao criar registro:', error)
      setErro(error.message || 'Erro ao criar registro. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  // Preparar dados para gráficos
  const dadosGraficoEstresse = registros
    .filter(r => r.stress_level)
    .map(r => ({
      date: new Date(r.record_date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      value: parseInt(r.stress_level)
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const dadosGraficoHumor = registros
    .filter(r => r.mood_score)
    .map(r => ({
      date: new Date(r.record_date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      value: parseInt(r.mood_score)
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const dadosGraficoAdesao = registros
    .filter(r => r.adherence_score)
    .map(r => ({
      date: new Date(r.record_date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      value: parseInt(r.adherence_score)
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando registros...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Avaliação Emocional/Comportamental</h2>
        <div className="flex gap-4">
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="todos">Todos</option>
            <option value="emocional">Emocional</option>
            <option value="comportamental">Comportamental</option>
            <option value="ambos">Ambos</option>
          </select>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            {mostrarForm ? 'Cancelar' : '+ Novo Registro'}
          </button>
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800">{erro}</p>
        </div>
      )}

      {/* Formulário */}
      {mostrarForm && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Registro</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="record_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Data *
                </label>
                <input
                  type="date"
                  id="record_date"
                  name="record_date"
                  value={formData.record_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="record_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Registro *
                </label>
                <select
                  id="record_type"
                  name="record_type"
                  value={formData.record_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="emocional">Emocional</option>
                  <option value="comportamental">Comportamental</option>
                  <option value="ambos">Ambos</option>
                </select>
              </div>
            </div>

            {/* Seção Emocional */}
            {(formData.record_type === 'emocional' || formData.record_type === 'ambos') && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-4">Dados Emocionais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="emotional_state" className="block text-sm font-medium text-gray-700 mb-2">
                      Estado Emocional
                    </label>
                    <select
                      id="emotional_state"
                      name="emotional_state"
                      value={formData.emotional_state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Selecione</option>
                      <option value="ansioso">Ansioso</option>
                      <option value="estressado">Estressado</option>
                      <option value="motivado">Motivado</option>
                      <option value="desanimado">Desanimado</option>
                      <option value="equilibrado">Equilibrado</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="stress_level" className="block text-sm font-medium text-gray-700 mb-2">
                      Nível de Estresse (1-10)
                    </label>
                    <input
                      type="number"
                      id="stress_level"
                      name="stress_level"
                      value={formData.stress_level}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="mood_score" className="block text-sm font-medium text-gray-700 mb-2">
                      Score de Humor (1-10)
                    </label>
                    <input
                      type="number"
                      id="mood_score"
                      name="mood_score"
                      value={formData.mood_score}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="sleep_quality" className="block text-sm font-medium text-gray-700 mb-2">
                      Qualidade do Sono
                    </label>
                    <select
                      id="sleep_quality"
                      name="sleep_quality"
                      value={formData.sleep_quality}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Selecione</option>
                      <option value="otimo">Ótimo</option>
                      <option value="bom">Bom</option>
                      <option value="regular">Regular</option>
                      <option value="ruim">Ruim</option>
                      <option value="pessimo">Péssimo</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="energy_level" className="block text-sm font-medium text-gray-700 mb-2">
                      Nível de Energia
                    </label>
                    <select
                      id="energy_level"
                      name="energy_level"
                      value={formData.energy_level}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Selecione</option>
                      <option value="alta">Alta</option>
                      <option value="media">Média</option>
                      <option value="baixa">Baixa</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="emotional_notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Observações Emocionais
                    </label>
                    <textarea
                      id="emotional_notes"
                      name="emotional_notes"
                      value={formData.emotional_notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Seção Comportamental */}
            {(formData.record_type === 'comportamental' || formData.record_type === 'ambos') && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-4">Dados Comportamentais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="adherence_score" className="block text-sm font-medium text-gray-700 mb-2">
                      Score de Adesão (1-10)
                    </label>
                    <input
                      type="number"
                      id="adherence_score"
                      name="adherence_score"
                      value={formData.adherence_score}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="meal_following_percentage" className="block text-sm font-medium text-gray-700 mb-2">
                      % Refeições Seguidas
                    </label>
                    <input
                      type="number"
                      id="meal_following_percentage"
                      name="meal_following_percentage"
                      value={formData.meal_following_percentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="exercise_frequency" className="block text-sm font-medium text-gray-700 mb-2">
                      Frequência de Exercícios
                    </label>
                    <input
                      type="text"
                      id="exercise_frequency"
                      name="exercise_frequency"
                      value={formData.exercise_frequency}
                      onChange={handleChange}
                      placeholder="Ex: 3x por semana"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="water_intake_liters" className="block text-sm font-medium text-gray-700 mb-2">
                      Ingestão de Água (litros)
                    </label>
                    <input
                      type="number"
                      id="water_intake_liters"
                      name="water_intake_liters"
                      value={formData.water_intake_liters}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="behavioral_notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Observações Comportamentais
                    </label>
                    <textarea
                      id="behavioral_notes"
                      name="behavioral_notes"
                      value={formData.behavioral_notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Padrões e Gatilhos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Padrões Identificados
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={novoPadrao}
                    onChange={(e) => setNovoPadrao(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarPadrao())}
                    placeholder="Ex: Come por ansiedade"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={adicionarPadrao}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.patterns_identified.map((padrao, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {padrao}
                      <button
                        type="button"
                        onClick={() => removerPadrao(index)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gatilhos Identificados
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={novoGatilho}
                    onChange={(e) => setNovoGatilho(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarGatilho())}
                    placeholder="Ex: Trabalho, fim de semana"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={adicionarGatilho}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.triggers.map((gatilho, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      {gatilho}
                      <button
                        type="button"
                        onClick={() => removerGatilho(index)}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Observações Gerais
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMostrarForm(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {salvando ? 'Salvando...' : 'Salvar Registro'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gráficos */}
      {registros.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {dadosGraficoEstresse.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nível de Estresse</h3>
              <div className="h-48">
                <svg width="100%" height="100%" className="overflow-visible">
                  <polyline
                    points={dadosGraficoEstresse.map((d, i) => `${20 + (i * (260 / (dadosGraficoEstresse.length - 1 || 1)))},${180 - ((d.value - 1) / 9) * 140}`).join(' ')}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                  />
                  {dadosGraficoEstresse.map((d, i) => (
                    <circle
                      key={i}
                      cx={20 + (i * (260 / (dadosGraficoEstresse.length - 1 || 1)))}
                      cy={180 - ((d.value - 1) / 9) * 140}
                      r="4"
                      fill="#EF4444"
                    />
                  ))}
                </svg>
              </div>
            </div>
          )}

          {dadosGraficoHumor.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Score de Humor</h3>
              <div className="h-48">
                <svg width="100%" height="100%" className="overflow-visible">
                  <polyline
                    points={dadosGraficoHumor.map((d, i) => `${20 + (i * (260 / (dadosGraficoHumor.length - 1 || 1)))},${180 - ((d.value - 1) / 9) * 140}`).join(' ')}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  {dadosGraficoHumor.map((d, i) => (
                    <circle
                      key={i}
                      cx={20 + (i * (260 / (dadosGraficoHumor.length - 1 || 1)))}
                      cy={180 - ((d.value - 1) / 9) * 140}
                      r="4"
                      fill="#10B981"
                    />
                  ))}
                </svg>
              </div>
            </div>
          )}

          {dadosGraficoAdesao.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Adesão ao Programa</h3>
              <div className="h-48">
                <svg width="100%" height="100%" className="overflow-visible">
                  <polyline
                    points={dadosGraficoAdesao.map((d, i) => `${20 + (i * (260 / (dadosGraficoAdesao.length - 1 || 1)))},${180 - ((d.value - 1) / 9) * 140}`).join(' ')}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  {dadosGraficoAdesao.map((d, i) => (
                    <circle
                      key={i}
                      cx={20 + (i * (260 / (dadosGraficoAdesao.length - 1 || 1)))}
                      cy={180 - ((d.value - 1) / 9) * 140}
                      r="4"
                      fill="#3B82F6"
                    />
                  ))}
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista de Registros */}
      {registros.length > 0 ? (
        <div className="space-y-4">
          {registros
            .sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime())
            .map((registro) => (
              <div key={registro.id} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {new Date(registro.record_date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h3>
                    <span className="text-sm text-gray-600 capitalize">{registro.record_type}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registro.emotional_state && (
                    <div>
                      <span className="text-sm text-gray-600">Estado Emocional: </span>
                      <span className="text-sm font-medium text-gray-900 capitalize">{registro.emotional_state}</span>
                    </div>
                  )}
                  {registro.stress_level && (
                    <div>
                      <span className="text-sm text-gray-600">Estresse: </span>
                      <span className="text-sm font-medium text-gray-900">{registro.stress_level}/10</span>
                    </div>
                  )}
                  {registro.mood_score && (
                    <div>
                      <span className="text-sm text-gray-600">Humor: </span>
                      <span className="text-sm font-medium text-gray-900">{registro.mood_score}/10</span>
                    </div>
                  )}
                  {registro.adherence_score && (
                    <div>
                      <span className="text-sm text-gray-600">Adesão: </span>
                      <span className="text-sm font-medium text-gray-900">{registro.adherence_score}/10</span>
                    </div>
                  )}
                </div>

                {registro.notes && (
                  <p className="mt-4 text-sm text-gray-700">{registro.notes}</p>
                )}

                {registro.patterns_identified && registro.patterns_identified.length > 0 && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-700">Padrões: </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {registro.patterns_identified.map((padrao: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {padrao}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {registro.triggers && registro.triggers.length > 0 && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-700">Gatilhos: </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {registro.triggers.map((gatilho: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                          {gatilho}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">Nenhum registro encontrado.</p>
          <button
            onClick={() => setMostrarForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Adicionar Primeiro Registro
          </button>
        </div>
      )}
    </div>
  )
}

// Aba: Reavaliações
function ReavaliacoesTab({ cliente, clientId }: { cliente: any; clientId: string }) {
  const [avaliacoes, setAvaliacoes] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<string | null>(null)
  const [comparacao, setComparacao] = useState<any>(null)
  const [carregandoComparacao, setCarregandoComparacao] = useState(false)

  // Carregar avaliações (incluindo reavaliações)
  useEffect(() => {
    const carregarAvaliacoes = async () => {
      try {
        setCarregando(true)
        const response = await fetch(`/api/c/clientes/${clientId}/avaliacoes?is_reevaluation=true`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar reavaliações')
        }

        const data = await response.json()
        if (data.success) {
          setAvaliacoes(data.data.assessments || [])
        }
      } catch (error: any) {
        console.error('Erro ao carregar reavaliações:', error)
        setErro(error.message || 'Erro ao carregar reavaliações')
      } finally {
        setCarregando(false)
      }
    }

    carregarAvaliacoes()
  }, [clientId])

  // Carregar comparação quando uma avaliação for selecionada
  useEffect(() => {
    if (!avaliacaoSelecionada) {
      setComparacao(null)
      return
    }

    const carregarComparacao = async () => {
      try {
        setCarregandoComparacao(true)
        const response = await fetch(`/api/coach/clientes/${clientId}/avaliacoes/${avaliacaoSelecionada}/comparacao`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar comparação')
        }

        const data = await response.json()
        if (data.success) {
          setComparacao(data.data)
        }
      } catch (error: any) {
        console.error('Erro ao carregar comparação:', error)
        setErro(error.message || 'Erro ao carregar comparação')
      } finally {
        setCarregandoComparacao(false)
      }
    }

    carregarComparacao()
  }, [clientId, avaliacaoSelecionada])

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando reavaliações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Reavaliações</h2>
      </div>

      {erro && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800">{erro}</p>
        </div>
      )}

      {/* Lista de Reavaliações */}
      {avaliacoes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Histórico de Reavaliações</h3>
            {avaliacoes
              .sort((a, b) => {
                const numA = a.assessment_number || 0
                const numB = b.assessment_number || 0
                return numB - numA
              })
              .map((avaliacao) => (
                <button
                  key={avaliacao.id}
                  onClick={() => setAvaliacaoSelecionada(avaliacao.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    avaliacaoSelecionada === avaliacao.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {avaliacao.assessment_number ? `${avaliacao.assessment_number}ª Reavaliação` : 'Reavaliação'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(avaliacao.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    {avaliacao.assessment_type && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
                        {avaliacao.assessment_type}
                      </span>
                    )}
                  </div>
                </button>
              ))}
          </div>

          {/* Comparação */}
          <div>
            {avaliacaoSelecionada ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparação</h3>
                {carregandoComparacao ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Carregando comparação...</p>
                    </div>
                  </div>
                ) : comparacao ? (
                  <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                    {/* Informações Gerais */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Informações da Comparação</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Avaliação Anterior: </span>
                          <span className="font-medium text-gray-900">
                            {comparacao.previous?.assessment_number
                              ? `${comparacao.previous.assessment_number}ª Avaliação`
                              : 'Avaliação Inicial'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Dias entre avaliações: </span>
                          <span className="font-medium text-gray-900">
                            {comparacao.comparison?.dates?.days_between || '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dados Comparativos */}
                    {comparacao.comparison && Object.keys(comparacao.comparison).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Diferenças</h4>
                        <div className="space-y-3">
                          {Object.entries(comparacao.comparison)
                            .filter(([key]) => key !== 'dates' && key !== 'summary')
                            .map(([key, value]: [string, any]) => {
                              if (!value || value.difference === null || value.difference === undefined) return null
                              return (
                                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-1">
                                    <span className="text-sm font-medium text-gray-700 capitalize block mb-1">
                                      {key.replace(/_/g, ' ')}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                      Anterior: {value.old?.toFixed(2) || '-'} → Atual: {value.current?.toFixed(2) || '-'}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-sm font-semibold ${
                                        value.difference > 0
                                          ? 'text-green-600'
                                          : value.difference < 0
                                          ? 'text-red-600'
                                          : 'text-gray-600'
                                      }`}
                                    >
                                      {value.difference > 0 ? '+' : ''}
                                      {typeof value.difference === 'number'
                                        ? value.difference.toFixed(2)
                                        : value.difference}
                                    </span>
                                    {value.percent_change !== null && value.percent_change !== undefined && (
                                      <span className="text-xs text-gray-500">
                                        ({value.percent_change > 0 ? '+' : ''}
                                        {value.percent_change.toFixed(1)}%)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    )}

                    {/* Interpretação */}
                    {comparacao.interpretation && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Interpretação</h4>
                        <p className="text-sm text-gray-700 bg-purple-50 p-4 rounded-lg">
                          {comparacao.interpretation}
                        </p>
                      </div>
                    )}

                    {/* Resumo */}
                    {comparacao.comparison?.summary && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Resumo</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-sm text-gray-600">Melhorias</p>
                            <p className="text-2xl font-bold text-green-600">
                              {comparacao.comparison.summary.improvements_count}
                            </p>
                          </div>
                          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <p className="text-sm text-gray-600">Regressões</p>
                            <p className="text-2xl font-bold text-red-600">
                              {comparacao.comparison.summary.regressions_count}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                    <p className="text-gray-600">Nenhuma comparação disponível para esta reavaliação.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                <p className="text-gray-600">Selecione uma reavaliação para ver a comparação.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">Nenhuma reavaliação encontrada.</p>
          <p className="text-sm text-gray-500">
            As reavaliações são criadas a partir de avaliações existentes na aba "Avaliação Física".
          </p>
        </div>
      )}
    </div>
  )
}

// Aba: Agenda
function AgendaTab({ cliente, clientId }: { cliente: any; clientId: string }) {
  const [consultas, setConsultas] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    appointment_type: 'consulta',
    start_time: '',
    end_time: '',
    location_type: 'online',
    location_address: '',
    location_url: '',
    notes: ''
  })

  // Carregar consultas
  useEffect(() => {
    const carregarConsultas = async () => {
      try {
        setCarregando(true)
        const params = new URLSearchParams({
          client_id: clientId
        })
        if (filtroStatus !== 'todos') {
          params.append('status', filtroStatus)
        }
        if (filtroTipo !== 'todos') {
          params.append('appointment_type', filtroTipo)
        }

        const response = await fetch(`/api/coach/appointments?${params.toString()}`, {
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
  }, [clientId, filtroStatus, filtroTipo])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSalvando(true)

    try {
      if (!formData.start_time || !formData.end_time) {
        throw new Error('Data e hora são obrigatórias')
      }

      const payload = {
        client_id: clientId,
        title: formData.title || 'Consulta',
        description: formData.description || null,
        appointment_type: formData.appointment_type,
        start_time: formData.start_time,
        end_time: formData.end_time,
        location_type: formData.location_type,
        location_address: formData.location_address || null,
        location_url: formData.location_url || null,
        notes: formData.notes || null,
        status: 'agendado'
      }

      const response = await fetch('/api/coach/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar consulta')
      }

      if (data.success) {
        setMostrarForm(false)
        setFormData({
          title: '',
          description: '',
          appointment_type: 'consulta',
          start_time: '',
          end_time: '',
          location_type: 'online',
          location_address: '',
          location_url: '',
          notes: ''
        })
        // Recarregar consultas
        window.location.reload()
      }
    } catch (error: any) {
      console.error('Erro ao criar consulta:', error)
      setErro(error.message || 'Erro ao criar consulta. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      agendado: 'bg-purple-100 text-purple-800',
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

  const getLocationLabel = (locationType: string) => {
    const labels: Record<string, string> = {
      presencial: 'Presencial',
      online: 'Online',
      domicilio: 'Domicílio'
    }
    return labels[locationType] || locationType
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando consultas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Agenda</h2>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          {mostrarForm ? 'Cancelar' : '+ Nova Consulta'}
        </button>
      </div>

      {erro && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800">{erro}</p>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="filtro-status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="filtro-status"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="todos">Todos</option>
            <option value="consulta">Consulta</option>
            <option value="retorno">Retorno</option>
            <option value="avaliacao">Avaliação</option>
            <option value="acompanhamento">Acompanhamento</option>
            <option value="outro">Outro</option>
          </select>
        </div>
      </div>

      {/* Formulário de Nova Consulta */}
      {mostrarForm && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Consulta</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Primeira Consulta"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="appointment_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Consulta *
                </label>
                <select
                  id="appointment_type"
                  name="appointment_type"
                  value={formData.appointment_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="consulta">Consulta</option>
                  <option value="retorno">Retorno</option>
                  <option value="avaliacao">Avaliação</option>
                  <option value="acompanhamento">Acompanhamento</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                  Data e Hora Início *
                </label>
                <input
                  type="datetime-local"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                  Data e Hora Fim *
                </label>
                <input
                  type="datetime-local"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="location_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Localização *
                </label>
                <select
                  id="location_type"
                  name="location_type"
                  value={formData.location_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="online">Online</option>
                  <option value="presencial">Presencial</option>
                  <option value="domicilio">Domicílio</option>
                </select>
              </div>

              {formData.location_type === 'presencial' || formData.location_type === 'domicilio' ? (
                <div>
                  <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    id="location_address"
                    name="location_address"
                    value={formData.location_address}
                    onChange={handleChange}
                    placeholder="Endereço completo"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="location_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Link da Reunião
                  </label>
                  <input
                    type="url"
                    id="location_url"
                    name="location_url"
                    value={formData.location_url}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Observações sobre a consulta..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMostrarForm(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {salvando ? 'Salvando...' : 'Agendar Consulta'}
              </button>
            </div>
          </form>
        </div>
      )}

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
                      <div>
                        <span className="font-medium">Localização:</span> {getLocationLabel(consulta.location_type)}
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
                        className="mt-2 inline-block text-sm text-purple-600 hover:text-purple-700"
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
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">Nenhuma consulta encontrada.</p>
          <button
            onClick={() => setMostrarForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Agendar Primeira Consulta
          </button>
        </div>
      )}
    </div>
  )
}

function TimelineTab({ cliente, clientId }: { cliente: any; clientId: string }) {
  const [history, setHistory] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [activityFilter, setActivityFilter] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [noteForm, setNoteForm] = useState({
    activity_type: 'nota_adicionada',
    title: '',
    description: ''
  })

  const activityOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'consulta', label: 'Consultas' },
    { value: 'avaliacao', label: 'Avaliações' },
    { value: 'reavaliacao', label: 'Reavaliações' },
    { value: 'programa_criado', label: 'Programa criado' },
    { value: 'programa_atualizado', label: 'Programa atualizado' },
    { value: 'programa_concluido', label: 'Programa concluído' },
    { value: 'nota_adicionada', label: 'Notas internas' },
    { value: 'status_alterado', label: 'Mudanças de status' },
    { value: 'evolucao_registrada', label: 'Registros físicos' },
    { value: 'registro_emocional', label: 'Registros emocionais' },
    { value: 'registro_comportamental', label: 'Registros comportamentais' },
    { value: 'lead_convertido', label: 'Conversões' },
    { value: 'outro', label: 'Outros' }
  ]

  const fetchHistory = async () => {
    try {
      setCarregando(true)
      setErro(null)
      const params = new URLSearchParams()
      params.append('limit', '200')
      params.append('order', 'desc')
      if (activityFilter !== 'todos') {
        params.append('activity_type', activityFilter)
      }
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      if (startDate) {
        params.append('start_date', `${startDate}T00:00:00Z`)
      }
      if (endDate) {
        params.append('end_date', `${endDate}T23:59:59Z`)
      }

      const response = await fetch(`/api/c/clientes/${clientId}/historico?${params.toString()}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Erro ao carregar histórico')
      }

      const data = await response.json()
      setHistory(data.data?.history || [])
    } catch (error: any) {
      console.error('Erro ao carregar histórico:', error)
      setErro(error.message || 'Erro ao carregar histórico')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    fetchHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, activityFilter, startDate, endDate])

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchHistory()
    }
  }

  const statusLabels: Record<string, string> = {
    lead: 'Contato',
    pre_consulta: 'Pré-Consulta',
    ativa: 'Ativa',
    pausa: 'Pausa',
    finalizada: 'Finalizada'
  }

  const groupedHistory = history.reduce((acc: Record<string, any[]>, item) => {
    const date = new Date(item.created_at)
    const label = date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
    if (!acc[label]) acc[label] = []
    acc[label].push(item)
    return acc
  }, {})

  const getIconForType = (type: string) => {
    const map: Record<string, string> = {
      consulta: '📅',
      avaliacao: '🏥',
      reavaliacao: '🔄',
      programa_criado: '📋',
      programa_atualizado: '🛠️',
      programa_concluido: '🏁',
      nota_adicionada: '📝',
      status_alterado: '⚙️',
      evolucao_registrada: '📈',
      registro_emocional: '💗',
      registro_comportamental: '🧠',
      cliente_criado: '✨',
      cliente_deletado: '🗑️',
      lead_convertido: '🎯',
      outro: '🔔'
    }
    return map[type] || '🔔'
  }

  const getTypeLabel = (type: string) => {
    const option = activityOptions.find(opt => opt.value === type)
    return option ? option.label : type
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNoteForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteForm.title.trim()) {
      setErro('Descreva rapidamente o que aconteceu.')
      return
    }
    setSalvando(true)
    setErro(null)

    try {
      const response = await fetch(`/api/c/clientes/${clientId}/historico`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          activity_type: noteForm.activity_type,
          title: noteForm.title.trim(),
          description: noteForm.description?.trim() || null
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registrar evento')
      }

      setNoteForm({
        activity_type: 'nota_adicionada',
        title: '',
        description: ''
      })
      setShowNoteForm(false)
      await fetchHistory()
    } catch (error: any) {
      console.error('Erro ao criar evento no histórico:', error)
      setErro(error.message || 'Erro ao criar evento. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando histórico...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Histórico completo</h2>
          <p className="text-sm text-gray-600">Veja tudo que já aconteceu com {cliente.name}.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => fetchHistory()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            Atualizar
          </button>
          <button
            onClick={() => setShowNoteForm(!showNoteForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
          >
            {showNoteForm ? 'Cancelar' : '+ Registrar evento rápido'}
          </button>
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-sm text-red-800">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKey}
              placeholder="Ex: consulta, avaliação..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
            <p className="text-[11px] text-gray-500 mt-1">Pressione Enter para buscar</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo de registro</label>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {activityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">De</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Até</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {showNoteForm && (
            <div className="bg-white border border-purple-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Registrar evento rápido</h3>
              <form onSubmit={handleCreateNote} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo</label>
                  <select
                    name="activity_type"
                    value={noteForm.activity_type}
                    onChange={handleNoteChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="nota_adicionada">Nota interna</option>
                    <option value="programa_atualizado">Programa atualizado</option>
                    <option value="programa_concluido">Programa concluído</option>
                    <option value="status_alterado">Mudança de status</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Resumo rápido *</label>
                  <input
                    type="text"
                    name="title"
                    value={noteForm.title}
                    onChange={handleNoteChange}
                    placeholder="Ex: Cliente pediu pausa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Detalhes (opcional)</label>
                  <textarea
                    name="description"
                    value={noteForm.description}
                    onChange={handleNoteChange}
                    rows={3}
                    placeholder="Anotações internas, combinado, próximos passos..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={salvando}
                  className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  {salvando && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  Registrar evento
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          {history.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-600 mb-4">Ainda não temos registros na timeline desta cliente.</p>
              <button
                onClick={() => setShowNoteForm(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                Criar primeiro registro
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 hidden sm:block"></div>
              <div className="space-y-8">
                {Object.entries(groupedHistory).map(([dateLabel, events]) => (
                  <div key={dateLabel}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="hidden sm:block w-2 h-2 rounded-full bg-purple-500"></div>
                      <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">{dateLabel}</p>
                      <div className="flex-1 border-t border-dashed border-gray-300"></div>
                    </div>

                    <div className="space-y-4">
                      {events.map(event => (
                        <div
                          key={event.id}
                          className="relative sm:pl-10"
                        >
                          <div className="hidden sm:flex absolute left-1 top-4 w-6 h-6 rounded-full border-2 border-white bg-purple-100 items-center justify-center text-sm">
                            {getIconForType(event.activity_type)}
                          </div>
                          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                  {getIconForType(event.activity_type)} {getTypeLabel(event.activity_type)}
                                  <span>• {new Date(event.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                </p>
                              </div>
                              {event.metadata?.status_novo && (
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
                                  {event.metadata.status_anterior ? `${statusLabels[event.metadata.status_anterior] || event.metadata.status_anterior} → ` : ''}
                                  {statusLabels[event.metadata.status_novo] || event.metadata.status_novo}
                                </span>
                              )}
                            </div>
                            {event.description && (
                              <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">{event.description}</p>
                            )}

                            {event.metadata?.patterns_identified && event.metadata.patterns_identified.length > 0 && (
                              <div className="mt-3 text-xs text-gray-600">
                                <p className="font-semibold mb-1">Padrões:</p>
                                <div className="flex flex-wrap gap-2">
                                  {event.metadata.patterns_identified.map((padrao: string) => (
                                    <span key={padrao} className="px-2 py-0.5 bg-pink-50 text-pink-700 rounded-full">
                                      {padrao}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {event.metadata?.triggers && event.metadata.triggers.length > 0 && (
                              <div className="mt-3 text-xs text-gray-600">
                                <p className="font-semibold mb-1">Gatilhos:</p>
                                <div className="flex flex-wrap gap-2">
                                  {event.metadata.triggers.map((gatilho: string) => (
                                    <span key={gatilho} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full">
                                      {gatilho}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProgramaTab({ cliente, clientId }: { cliente: any; clientId: string }) {
  const [programas, setProgramas] = useState<any[]>([])
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const initialFormState = () => ({
    name: '',
    program_type: 'plano_alimentar',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'ativo',
    meals_plan: '',
    protocol_notes: '',
    checklist: [] as { id: string; label: string; done: boolean }[],
    attachments: [] as { label: string; url: string }[]
  })

  const [formData, setFormData] = useState(initialFormState)
  const [newChecklistLabel, setNewChecklistLabel] = useState('')
  const [newAttachment, setNewAttachment] = useState({ label: '', url: '' })
  const [attachmentSaving, setAttachmentSaving] = useState(false)
  const [checklistSaving, setChecklistSaving] = useState(false)

  const parseContent = (content: any) => {
    if (!content) return {}
    if (typeof content === 'string') {
      try {
        return JSON.parse(content)
      } catch {
        return {}
      }
    }
    return content
  }

  const carregarProgramas = async () => {
    try {
      setCarregando(true)
      setErro(null)
      const response = await fetch(`/api/c/clientes/${clientId}/programas?order=desc&order_by=start_date`, {
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Erro ao carregar programas')
      }

      const data = await response.json()
      const lista = data.data?.programs || []
      setProgramas(lista)
      if (lista.length > 0) {
        const ativo = lista.find((programa: any) => programa.status === 'ativo')
        setSelectedProgramId((prev) => prev || (ativo ? ativo.id : lista[0].id))
      } else {
        setSelectedProgramId(null)
      }
    } catch (error: any) {
      console.error('Erro ao carregar programas:', error)
      setErro(error.message || 'Erro ao carregar programas')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarProgramas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addChecklistItemForm = () => {
    if (!newChecklistLabel.trim()) return
    setFormData(prev => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        { id: `${Date.now()}`, label: newChecklistLabel.trim(), done: false }
      ]
    }))
    setNewChecklistLabel('')
  }

  const removeChecklistItemForm = (id: string) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== id)
    }))
  }

  const addAttachmentForm = () => {
    if (!newAttachment.label.trim() || !newAttachment.url.trim()) return
    setFormData(prev => ({
      ...prev,
      attachments: [
        ...prev.attachments,
        { label: newAttachment.label.trim(), url: newAttachment.url.trim() }
      ]
    }))
    setNewAttachment({ label: '', url: '' })
  }

  const removeAttachmentForm = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    setErro(null)
    try {
      const payload = {
        name: formData.name.trim(),
        program_type: formData.program_type,
        description: formData.description || null,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        status: formData.status,
        content: {
          meals_plan: formData.meals_plan,
          protocol_notes: formData.protocol_notes,
          checklist: formData.checklist,
          attachments: formData.attachments
        }
      }

      const response = await fetch(`/api/coach/clientes/${clientId}/programas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar programa')
      }

      setMostrarForm(false)
      setFormData(initialFormState())
      await carregarProgramas()
    } catch (error: any) {
      console.error('Erro ao criar programa:', error)
      setErro(error.message || 'Erro ao criar programa. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const selectedProgram = programas.find(prog => prog.id === selectedProgramId)
  const selectedContent = parseContent(selectedProgram?.content)
  const checklist = selectedContent?.checklist || []
  const attachments = selectedContent?.attachments || []

  const updateProgramContent = async (programId: string, updatedContent: any) => {
    try {
      const response = await fetch(`/api/c/clientes/${clientId}/programas/${programId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ content: updatedContent })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar programa')
      }
      setProgramas(prev =>
        prev.map(program => (program.id === programId ? data.data.program : program))
      )
    } catch (error: any) {
      console.error('Erro ao atualizar conteúdo do programa:', error)
      setErro(error.message || 'Erro ao atualizar programa.')
    }
  }

  const toggleChecklistItem = async (itemId: string) => {
    if (!selectedProgram) return
    setChecklistSaving(true)
    const currentContent = parseContent(selectedProgram.content)
    const updatedChecklist = (currentContent.checklist || []).map((item: any) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    )
    const updatedContent = { ...currentContent, checklist: updatedChecklist }
    await updateProgramContent(selectedProgram.id, updatedContent)
    setChecklistSaving(false)
  }

  const addChecklistItemToProgram = async () => {
    if (!selectedProgram || !newChecklistLabel.trim()) return
    setChecklistSaving(true)
    const currentContent = parseContent(selectedProgram.content)
    const updatedChecklist = [
      ...(currentContent.checklist || []),
      { id: `${Date.now()}`, label: newChecklistLabel.trim(), done: false }
    ]
    const updatedContent = { ...currentContent, checklist: updatedChecklist }
    await updateProgramContent(selectedProgram.id, updatedContent)
    setNewChecklistLabel('')
    setChecklistSaving(false)
  }

  const addAttachmentToProgram = async () => {
    if (!selectedProgram || !newAttachment.label.trim() || !newAttachment.url.trim()) return
    setAttachmentSaving(true)
    const currentContent = parseContent(selectedProgram.content)
    const updatedAttachments = [
      ...(currentContent.attachments || []),
      { label: newAttachment.label.trim(), url: newAttachment.url.trim() }
    ]
    const updatedContent = { ...currentContent, attachments: updatedAttachments }
    await updateProgramContent(selectedProgram.id, updatedContent)
    setNewAttachment({ label: '', url: '' })
    setAttachmentSaving(false)
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando programas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Programa Atual</h2>
          <p className="text-sm text-gray-600">Organize planos alimentares, protocolos e anexos do jeito que você já faz.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {programas.length > 0 && (
            <select
              value={selectedProgramId || ''}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {programas.map(programa => (
                <option key={programa.id} value={programa.id}>
                  {programa.name} • {new Date(programa.start_date).toLocaleDateString('pt-BR')}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => {
              setMostrarForm(!mostrarForm)
              if (!mostrarForm) {
                setFormData(initialFormState())
              }
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            {mostrarForm ? 'Cancelar' : '+ Novo Programa'}
          </button>
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-sm text-red-800">
          {erro}
        </div>
      )}

      {mostrarForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Cadastrar novo programa</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do programa *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ex: Programa Equilíbrio 8 semanas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  name="program_type"
                  value={formData.program_type}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="plano_alimentar">Plano alimentar</option>
                  <option value="protocolo">Protocolo</option>
                  <option value="treinamento">Treinamento</option>
                  <option value="desafio">Desafio</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data início *</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data término</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="rascunho">Rascunho</option>
                  <option value="ativo">Ativo</option>
                  <option value="pausado">Pausado</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resumo do programa</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
                placeholder="Ex: foco em inflamação, protocolo com anti-inflamatórios naturais..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plano alimentar / refeições</label>
                <textarea
                  name="meals_plan"
                  value={formData.meals_plan}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Ex: café da manhã, lanches, almoço..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Protocolos / observações</label>
                <textarea
                  name="protocol_notes"
                  value={formData.protocol_notes}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Suplementação, treinos, materiais de apoio..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Checklist do acompanhamento</h4>
                  <button
                    type="button"
                    onClick={addChecklistItemForm}
                    className="text-xs text-purple-600 hover:text-purple-700"
                  >
                    + Adicionar
                  </button>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newChecklistLabel}
                    onChange={(e) => setNewChecklistLabel(e.target.value)}
                    placeholder="Ex: enviar cardápio PDF"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={addChecklistItemForm}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm"
                  >
                    Adicionar
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.checklist.length === 0 && (
                    <li className="text-sm text-gray-500">Nada adicionado ainda.</li>
                  )}
                  {formData.checklist.map(item => (
                    <li key={item.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                      <span>{item.label}</span>
                      <button
                        type="button"
                        onClick={() => removeChecklistItemForm(item.id)}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Materiais / links</h4>
                  <button
                    type="button"
                    onClick={addAttachmentForm}
                    className="text-xs text-purple-600 hover:text-purple-700"
                  >
                    + Adicionar
                  </button>
                </div>
                <div className="space-y-2 mb-3">
                  <input
                    type="text"
                    placeholder="Nome do material"
                    value={newAttachment.label}
                    onChange={(e) => setNewAttachment(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-purple-500"
                  />
                  <input
                    type="url"
                    placeholder="Link"
                    value={newAttachment.url}
                    onChange={(e) => setNewAttachment(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <ul className="space-y-2">
                  {formData.attachments.length === 0 && (
                    <li className="text-sm text-gray-500">Nenhum anexo adicionado.</li>
                  )}
                  {formData.attachments.map((attachment, index) => (
                    <li key={`${attachment.label}-${index}`} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                      <span className="truncate mr-2">{attachment.label}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachmentForm(index)}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setFormData(initialFormState())
                  setMostrarForm(false)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
              >
                {salvando && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                Salvar programa
              </button>
            </div>
          </form>
        </div>
      )}

      {programas.length === 0 && !mostrarForm ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-600 mb-4">Você ainda não cadastrou nenhum programa para esta cliente.</p>
          <button
            onClick={() => setMostrarForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
          >
            Criar primeiro programa
          </button>
        </div>
      ) : null}

      {selectedProgram && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{selectedProgram.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedProgram.program_type === 'plano_alimentar' && 'Plano alimentar'}
                    {selectedProgram.program_type === 'protocolo' && 'Protocolo'}
                    {selectedProgram.program_type === 'treinamento' && 'Treinamento'}
                    {selectedProgram.program_type === 'desafio' && 'Desafio'}
                    {selectedProgram.program_type === 'outro' && 'Programa personalizado'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedProgram.status === 'ativo' ? 'bg-green-100 text-green-700'
                  : selectedProgram.status === 'rascunho' ? 'bg-yellow-100 text-yellow-700'
                  : selectedProgram.status === 'concluido' ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedProgram.status?.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-xs uppercase text-gray-500">Início</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedProgram.start_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-xs uppercase text-gray-500">Término</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedProgram.end_date ? new Date(selectedProgram.end_date).toLocaleDateString('pt-BR') : 'Sem data'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-xs uppercase text-gray-500">Adesão</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedProgram.adherence_percentage ? `${selectedProgram.adherence_percentage}%` : '-'}
                  </p>
                </div>
              </div>

              {selectedProgram.description && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Resumo do programa</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{selectedProgram.description}</p>
                </div>
              )}

              {selectedContent?.meals_plan && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Plano alimentar</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{selectedContent.meals_plan}</p>
                </div>
              )}

              {selectedContent?.protocol_notes && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Protocolos e observações</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{selectedContent.protocol_notes}</p>
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Checklist de entregas</h3>
                {checklistSaving && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                    Salvando...
                  </span>
                )}
              </div>
              {checklist.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum item no checklist ainda.</p>
              ) : (
                <ul className="space-y-3">
                  {checklist.map((item: any) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!item.done}
                          onChange={() => toggleChecklistItem(item.id)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                        />
                        <span className={`text-sm ${item.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {item.label}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newChecklistLabel}
                  onChange={(e) => setNewChecklistLabel(e.target.value)}
                  placeholder="Adicionar próxima entrega..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-purple-500"
                />
                <button
                  onClick={addChecklistItemToProgram}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Materiais e links</h3>
              {attachments.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum material adicionado ainda.</p>
              ) : (
                <ul className="space-y-3">
                  {attachments.map((attachment: any, index: number) => (
                    <li key={`${attachment.url}-${index}`} className="text-sm flex items-center gap-2">
                      <span>📎</span>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 truncate"
                      >
                        {attachment.label || attachment.url}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  placeholder="Nome do material"
                  value={newAttachment.label}
                  onChange={(e) => setNewAttachment(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-purple-500"
                />
                <input
                  type="url"
                  placeholder="https://"
                  value={newAttachment.url}
                  onChange={(e) => setNewAttachment(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-purple-500"
                />
                <button
                  onClick={addAttachmentToProgram}
                  disabled={attachmentSaving}
                  className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  {attachmentSaving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  Adicionar material
                </button>
              </div>
            </div>

            {selectedProgram?.notes && (
              <div className="border border-gray-200 rounded-xl p-6 bg-purple-50">
                <h3 className="text-sm font-semibold text-purple-900 mb-2">Notas internas</h3>
                <p className="text-sm text-purple-900 whitespace-pre-line">{selectedProgram.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


















