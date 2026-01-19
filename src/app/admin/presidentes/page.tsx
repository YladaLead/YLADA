'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface Presidente {
  id: string
  nome_completo: string
  email: string | null
  status: 'ativo' | 'inativo'
  observacoes: string | null
  autorizado_por_email: string | null
  created_at: string
  updated_at: string
}

function AdminPresidentesContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [presidentes, setPresidentes] = useState<Presidente[]>([])
  const [loadingList, setLoadingList] = useState(true)
  
  // Formulário para adicionar presidente
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    observacoes: '',
  })

  // Buscar lista de presidentes
  const carregarPresidentes = async () => {
    try {
      setLoadingList(true)
      const response = await fetch('/api/admin/presidentes/autorizar', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setPresidentes(data.presidentes || [])
        }
      }
    } catch (err) {
      console.error('Erro ao carregar presidentes:', err)
      setError('Erro ao carregar lista de presidentes')
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    carregarPresidentes()
  }, [])

  // Adicionar presidente
  const handleAdicionar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/presidentes/autorizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nome_completo: formData.nome_completo.trim(),
          email: formData.email.trim() || null,
          observacoes: formData.observacoes.trim() || null,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess('Presidente autorizado com sucesso!')
        setFormData({ nome_completo: '', email: '', observacoes: '' })
        carregarPresidentes()
      } else {
        setError(data.error || 'Erro ao autorizar presidente')
      }
    } catch (err: any) {
      setError('Erro ao autorizar presidente. Tente novamente.')
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  // Desativar presidente
  const handleDesativar = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar este presidente?')) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/presidentes/autorizar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess('Presidente desativado com sucesso!')
        carregarPresidentes()
      } else {
        setError(data.error || 'Erro ao desativar presidente')
      }
    } catch (err: any) {
      setError('Erro ao desativar presidente. Tente novamente.')
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  const presidentesAtivos = presidentes.filter(p => p.status === 'ativo')
  const presidentesInativos = presidentes.filter(p => p.status === 'inativo')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <h1 className="text-2xl font-bold text-gray-900">
                  🏆 Gerenciar Presidentes Autorizados
                </h1>
              </Link>
            </div>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Voltar
            </Link>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Gerencie a lista de presidentes autorizados para criar conta no ambiente exclusivo
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Formulário para adicionar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ➕ Adicionar Presidente Autorizado
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Adicione presidentes manualmente. O nome será usado no dropdown da página de trial.
            <strong className="text-gray-900"> Use nomes padronizados!</strong>
          </p>
          <form onSubmit={handleAdicionar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo do Presidente * (padronizado)
              </label>
              <input
                type="text"
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                required
                minLength={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Claudinei Leite"
              />
              <p className="text-xs text-gray-500 mt-1">
                ⚠️ Use o nome exato que aparecerá no dropdown (ex: "Andre e Deise Faula")
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (opcional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="presidente@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações (opcional)
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Observações sobre este presidente..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adicionando...' : 'Adicionar Presidente'}
            </button>
          </form>
        </div>

        {/* Lista de presidentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Lista de Presidentes ({presidentesAtivos.length} ativos, {presidentesInativos.length} inativos)
          </h2>

          {loadingList ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando...</p>
            </div>
          ) : presidentes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum presidente autorizado ainda. Adicione o primeiro acima.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome Completo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autorizado por
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {presidentes.map((presidente) => (
                    <tr key={presidente.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {presidente.nome_completo}
                        </div>
                        {presidente.observacoes && (
                          <div className="text-xs text-gray-500 mt-1">
                            {presidente.observacoes}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {presidente.email || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          presidente.status === 'ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {presidente.status === 'ativo' ? '✅ Ativo' : '❌ Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {presidente.autorizado_por_email || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(presidente.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {presidente.status === 'ativo' && (
                          <button
                            onClick={() => handleDesativar(presidente.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                          >
                            Desativar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function AdminPresidentesPage() {
  return (
    <AdminProtectedRoute>
      <AdminPresidentesContent />
    </AdminProtectedRoute>
  )
}
