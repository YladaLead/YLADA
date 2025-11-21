'use client'

import { useState, useEffect } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface EmailAuthorization {
  id: string
  email: string
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  expires_in_days: number
  status: 'pending' | 'activated' | 'expired' | 'cancelled'
  activated_at: string | null
  activated_user_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

function EmailAuthorizationsContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [authorizations, setAuthorizations] = useState<EmailAuthorization[]>([])
  const [loadingAuths, setLoadingAuths] = useState(true)
  
  const [form, setForm] = useState({
    email: '',
    area: 'coach' as 'wellness' | 'nutri' | 'coach' | 'nutra',
    expires_in_days: 365,
    notes: ''
  })

  const [filterArea, setFilterArea] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Carregar autorizações
  useEffect(() => {
    loadAuthorizations()
  }, [filterArea, filterStatus])

  const loadAuthorizations = async () => {
    try {
      setLoadingAuths(true)
      const params = new URLSearchParams()
      if (filterArea !== 'all') {
        params.append('area', filterArea)
      }
      if (filterStatus !== 'all') {
        params.append('status', filterStatus)
      }

      const response = await fetch(`/api/admin/email-authorizations?${params.toString()}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar autorizações')
      }

      const data = await response.json()
      if (data.success) {
        setAuthorizations(data.data || [])
      }
    } catch (e: any) {
      console.error('Erro ao carregar autorizações:', e)
      setError('Erro ao carregar autorizações')
    } finally {
      setLoadingAuths(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/email-authorizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email.trim(),
          area: form.area,
          expires_in_days: form.expires_in_days,
          notes: form.notes.trim() || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar autorização')
      }

      setSuccess(data.message || 'Autorização criada com sucesso!')
      setForm({
        email: '',
        area: 'coach',
        expires_in_days: 365,
        notes: ''
      })
      loadAuthorizations()
    } catch (e: any) {
      setError(e.message || 'Erro ao criar autorização')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta autorização?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/email-authorizations/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cancelar autorização')
      }

      setSuccess('Autorização cancelada com sucesso!')
      loadAuthorizations()
    } catch (e: any) {
      setError(e.message || 'Erro ao cancelar autorização')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'activated':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'activated':
        return 'Ativada'
      case 'expired':
        return 'Expirada'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  const getAreaLabel = (area: string) => {
    const labels: Record<string, string> = {
      wellness: 'Wellness',
      nutri: 'Nutri',
      coach: 'Coach',
      nutra: 'Nutra'
    }
    return labels[area] || area
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          📧 Autorizações por Email
        </h1>
        <p className="text-gray-600 mb-8">
          Autorize emails antes do cadastro. Quando o usuário se cadastrar com o email autorizado, 
          a assinatura será ativada automaticamente.
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Formulário para criar autorização */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ➕ Criar Nova Autorização
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="usuario@exemplo.com"
                />
              </div>

              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  Área *
                </label>
                <select
                  id="area"
                  required
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="wellness">Wellness</option>
                  <option value="nutri">Nutri</option>
                  <option value="coach">Coach</option>
                  <option value="nutra">Nutra</option>
                </select>
              </div>

              <div>
                <label htmlFor="expires_in_days" className="block text-sm font-medium text-gray-700 mb-2">
                  Validade (dias) *
                </label>
                <input
                  type="number"
                  id="expires_in_days"
                  required
                  min="1"
                  max="3650"
                  value={form.expires_in_days}
                  onChange={(e) => setForm({ ...form, expires_in_days: parseInt(e.target.value) || 365 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="365"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ex: 365 = 1 ano, 30 = 1 mês
                </p>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <input
                  type="text"
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Convite especial, teste beta, etc"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : '✅ Criar Autorização'}
            </button>
          </form>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área
              </label>
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas</option>
                <option value="wellness">Wellness</option>
                <option value="nutri">Nutri</option>
                <option value="coach">Coach</option>
                <option value="nutra">Nutra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="activated">Ativada</option>
                <option value="expired">Expirada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de autorizações */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Área
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criada em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingAuths ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Carregando...
                    </td>
                  </tr>
                ) : authorizations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Nenhuma autorização encontrada
                    </td>
                  </tr>
                ) : (
                  authorizations.map((auth) => (
                    <tr key={auth.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {auth.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getAreaLabel(auth.area)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {auth.expires_in_days} dias
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(auth.status)}`}>
                          {getStatusLabel(auth.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(auth.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {auth.status === 'pending' && (
                          <button
                            onClick={() => handleCancel(auth.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Cancelar
                          </button>
                        )}
                        {auth.status === 'activated' && auth.activated_at && (
                          <span className="text-green-600 text-xs">
                            Ativada em {new Date(auth.activated_at).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EmailAuthorizationsPage() {
  return (
    <AdminProtectedRoute>
      <EmailAuthorizationsContent />
    </AdminProtectedRoute>
  )
}

