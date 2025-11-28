'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface Agent {
  id: string
  user_id: string
  area: string
  status: 'online' | 'offline' | 'ocupado' | 'pausado'
  max_concurrent_tickets: number
  current_tickets_count: number
  total_tickets_atendidos: number
  tickets_resolvidos: number
  satisfacao_media?: number
  name: string
  email: string
  created_at: string
  last_activity?: string
}

interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

function SupportAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchEmail, setSearchEmail] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [searching, setSearching] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedArea, setSelectedArea] = useState<'nutri' | 'coach' | 'wellness'>('nutri')
  const [maxTickets, setMaxTickets] = useState(3)
  const [creatingUser, setCreatingUser] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/nutri/support/agents', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar atendentes')
      }

      const data = await response.json()
      if (data.success) {
        setAgents(data.agents || [])
      } else {
        throw new Error(data.error || 'Erro ao carregar atendentes')
      }
    } catch (err: any) {
      console.error('Erro ao carregar atendentes:', err)
      setError(err.message || 'Erro ao carregar atendentes')
    } finally {
      setLoading(false)
    }
  }

  const searchUser = async () => {
    if (!searchEmail.trim()) {
      setSearchResults([])
      return
    }

    try {
      setSearching(true)
      const response = await fetch(`/api/admin/search-user?email=${encodeURIComponent(searchEmail)}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.users || [])
      } else {
        setSearchResults([])
      }
    } catch (err) {
      console.error('Erro ao buscar usuário:', err)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const createSupportUser = async () => {
    if (!searchEmail.trim() || !newUserName.trim() || !newUserPassword.trim()) {
      alert('⚠️ Preencha email, nome e senha')
      return
    }

    try {
      setCreatingUser(true)
      const response = await fetch('/api/admin/create-support-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: searchEmail.trim(),
          password: newUserPassword,
          nome_completo: newUserName.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao criar usuário')
      }

      const data = await response.json()
      if (data.success) {
        // Usuário criado, agora adicionar como atendente
        await addAgent(data.user.id)
        setNewUserName('')
        setNewUserPassword('')
      }
    } catch (err: any) {
      console.error('Erro ao criar usuário:', err)
      alert(`❌ Erro: ${err.message}`)
    } finally {
      setCreatingUser(false)
    }
  }

  const addAgent = async (userId: string) => {
    try {
      const response = await fetch('/api/nutri/support/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: userId,
          area: selectedArea,
          max_concurrent_tickets: maxTickets,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao adicionar atendente')
      }

      const data = await response.json()
      if (data.success) {
        setShowAddForm(false)
        setSearchEmail('')
        setSearchResults([])
        setNewUserName('')
        setNewUserPassword('')
        await loadAgents()
        alert('✅ Atendente adicionado com sucesso!')
      }
    } catch (err: any) {
      console.error('Erro ao adicionar atendente:', err)
      alert(`❌ Erro: ${err.message}`)
    }
  }

  const removeAgent = async (agentId: string, userId: string) => {
    if (!confirm('Tem certeza que deseja remover este atendente?')) {
      return
    }

    try {
      const response = await fetch(`/api/nutri/support/agents?id=${agentId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao remover atendente')
      }

      const data = await response.json()
      if (data.success) {
        await loadAgents()
        alert('✅ Atendente removido com sucesso!')
      }
    } catch (err: any) {
      console.error('Erro ao remover atendente:', err)
      alert(`❌ Erro: ${err.message}`)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      online: { label: 'Online', color: 'bg-green-100 text-green-800' },
      offline: { label: 'Offline', color: 'bg-gray-100 text-gray-800' },
      ocupado: { label: 'Ocupado', color: 'bg-yellow-100 text-yellow-800' },
      pausado: { label: 'Pausado', color: 'bg-blue-100 text-blue-800' },
    }
    const badge = badges[status] || badges.offline
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link href="/admin">
                <Image
                  src="/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png"
                  alt="YLADA Admin"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              </Link>
              <div className="h-10 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Gerenciar Atendentes
                </h1>
                <p className="text-sm text-gray-600">
                  Administrar equipe de suporte
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Adicionar Atendente */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Adicionar Novo Atendente
            </h2>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm)
                setSearchEmail('')
                setSearchResults([])
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showAddForm ? '❌ Cancelar' : '➕ Adicionar'}
            </button>
          </div>

          {showAddForm && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="nutri">Nutri</option>
                    <option value="coach">Coach</option>
                    <option value="wellness">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Tickets Simultâneos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={maxTickets}
                    onChange={(e) => setMaxTickets(parseInt(e.target.value) || 3)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar por Email
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          searchUser()
                        }
                      }}
                      placeholder="email@exemplo.com"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={searchUser}
                      disabled={searching}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {searching ? '🔍...' : '🔍 Buscar'}
                    </button>
                  </div>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Resultados da busca:
                  </p>
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.user_metadata?.full_name || 'Sem nome'}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <button
                          onClick={() => addAgent(user.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          ➕ Adicionar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchEmail && searchResults.length === 0 && !searching && (
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-gray-500">
                    Nenhum usuário encontrado com este email.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-3">
                      💡 Criar novo usuário de suporte
                    </p>
                    <p className="text-xs text-blue-700 mb-4">
                      Este usuário terá acesso a <strong>todas as áreas</strong> (Nutri, Coach, Wellness) sem precisar de assinatura.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="Ex: João Silva"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Senha Temporária
                        </label>
                        <input
                          type="password"
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          placeholder="Senha para primeiro login"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          O usuário precisará alterar no primeiro login
                        </p>
                      </div>
                      <button
                        onClick={createSupportUser}
                        disabled={creatingUser || !newUserName.trim() || !newUserPassword.trim()}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {creatingUser ? '⏳ Criando...' : '✨ Criar Usuário e Adicionar como Atendente'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Lista de Atendentes */}
        {loading ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando atendentes...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <p className="text-gray-600 text-lg">Nenhum atendente registrado</p>
            <p className="text-gray-500 text-sm mt-2">
              Adicione um atendente usando o formulário acima.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Atendentes ({agents.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {agents.map((agent) => (
                <div key={agent.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {agent.name}
                        </h3>
                        {getStatusBadge(agent.status)}
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {agent.area.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">{agent.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tickets Atendidos</p>
                          <p className="font-medium text-gray-900">
                            {agent.total_tickets_atendidos || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tickets Resolvidos</p>
                          <p className="font-medium text-gray-900">
                            {agent.tickets_resolvidos || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Capacidade</p>
                          <p className="font-medium text-gray-900">
                            {agent.current_tickets_count || 0} / {agent.max_concurrent_tickets}
                          </p>
                        </div>
                      </div>
                      {agent.satisfacao_media && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            Satisfação Média: ⭐ {agent.satisfacao_media.toFixed(1)}/5.0
                          </p>
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-500">
                        Registrado em: {formatDate(agent.created_at)}
                        {agent.last_activity && (
                          <> • Última atividade: {formatDate(agent.last_activity)}</>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => removeAgent(agent.id, agent.user_id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        🗑️ Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SupportAgentsAdminPage() {
  return (
    <AdminProtectedRoute>
      <SupportAgentsPage />
    </AdminProtectedRoute>
  )
}

