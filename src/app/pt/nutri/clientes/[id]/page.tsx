'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { displayPhoneWithFlag } from '@/utils/phoneFormatter'

export default function ClienteDetalhesNutri() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <ClienteDetalhesNutriContent />
    </ProtectedRoute>
  )
}

type TabType = 'info' | 'evolucao' | 'avaliacao' | 'emocional' | 'reavaliacoes' | 'agenda' | 'timeline' | 'programa'

function ClienteDetalhesNutriContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('info')
  const [cliente, setCliente] = useState<any>(null)

  // Carregar cliente
  useEffect(() => {
    if (!user || !clientId) return

    const carregarCliente = async () => {
      try {
        setCarregando(true)
        const response = await fetch(`/api/nutri/clientes?id=${clientId}`, {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              onClick={() => router.push('/pt/nutri/clientes')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
    { id: 'programa' as TabType, label: 'Programa Atual', icon: '📋' }
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
              onClick={() => router.push('/pt/nutri/clientes')}
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
              <button
                onClick={() => setActiveTab('info')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Editar
              </button>
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
                      ? 'bg-blue-600 text-white'
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
          </div>
        </div>
      </div>
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
      const response = await fetch(`/api/nutri/clientes/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar cliente')
      }

      if (data.success) {
        setSucesso(true)
        setEditando(false)
        setTimeout(() => setSucesso(false), 3000)
        // Recarregar página para atualizar dados
        window.location.reload()
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                  <option value="outro">Outro</option>
                  <option value="prefiro_nao_informar">Prefiro não informar</option>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
        const response = await fetch(`/api/nutri/clientes/${clientId}/evolucao`, {
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

      const response = await fetch(`/api/nutri/clientes/${clientId}/evolucao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar registro de evolução')
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Adicionar Primeiro Registro
          </button>
        </div>
      )}
    </div>
  )
}

function AvaliacaoTab({ cliente, clientId }: { cliente: any; clientId: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Avaliação Física</h2>
      <p className="text-gray-600">Aba de avaliação física será implementada em breve.</p>
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

        const response = await fetch(`/api/nutri/clientes/${clientId}/emocional?${params.toString()}`, {
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

      const response = await fetch(`/api/nutri/clientes/${clientId}/emocional`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar registro')
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="todos">Todos</option>
            <option value="emocional">Emocional</option>
            <option value="comportamental">Comportamental</option>
            <option value="ambos">Ambos</option>
          </select>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="emocional">Emocional</option>
                  <option value="comportamental">Comportamental</option>
                  <option value="ambos">Ambos</option>
                </select>
              </div>
            </div>

            {/* Seção Emocional */}
            {(formData.record_type === 'emocional' || formData.record_type === 'ambos') && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {padrao}
                      <button
                        type="button"
                        onClick={() => removerPadrao(index)}
                        className="text-blue-600 hover:text-blue-800"
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
        const response = await fetch(`/api/nutri/clientes/${clientId}/avaliacoes?is_reevaluation=true`, {
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
        const response = await fetch(`/api/nutri/clientes/${clientId}/avaliacoes/${avaliacaoSelecionada}/comparacao`, {
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
                      ? 'border-blue-500 bg-blue-50'
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
                        <p className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg">
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

      const response = await fetch('/api/nutri/appointments', {
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">Nenhuma consulta encontrada.</p>
          <button
            onClick={() => setMostrarForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Agendar Primeira Consulta
          </button>
        </div>
      )}
    </div>
  )
}

function TimelineTab({ cliente, clientId }: { cliente: any; clientId: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico Timeline</h2>
      <p className="text-gray-600">Aba de histórico timeline será implementada em breve.</p>
    </div>
  )
}

function ProgramaTab({ cliente, clientId }: { cliente: any; clientId: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Programa Atual</h2>
      <p className="text-gray-600">Aba de programa atual será implementada em breve.</p>
    </div>
  )
}
