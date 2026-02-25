'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface Trial {
  id: string
  user_id: string
  nome_completo: string
  email: string
  whatsapp: string
  status: 'active' | 'expired'
  dias_restantes: number
  dias_duracao?: number
  data_inicio: string
  data_fim: string
  data_criacao: string
  trial_group: 'geral' | 'presidentes'
  nome_presidente?: string | null
}

interface Stats {
  total: number
  ativos: number
  expirados: number
  gerais: number
  presidentes: number
}

function AdminTrialsContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trials, setTrials] = useState<Trial[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    ativos: 0,
    expirados: 0,
    gerais: 0,
    presidentes: 0,
  })

  // Filtros
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all')
  const [groupFilter, setGroupFilter] = useState<'all' | 'geral' | 'presidentes'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [fixingId, setFixingId] = useState<string | null>(null)

  // Carregar trials
  const carregarTrials = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (groupFilter !== 'all') params.append('trial_group', groupFilter)

      const response = await fetch(`/api/admin/trials/list?${params.toString()}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTrials(data.trials || [])
          setStats(data.stats || stats)
        }
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao carregar trials')
      }
    } catch (err: any) {
      setError('Erro ao carregar trials. Tente novamente.')
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarTrials()
  }, [statusFilter, groupFilter])

  // Filtrar por busca
  const filteredTrials = trials.filter((trial) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      trial.nome_completo.toLowerCase().includes(term) ||
      trial.email.toLowerCase().includes(term) ||
      trial.whatsapp.includes(term)
    )
  })

  // Formatar data
  const formatarData = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Copiar WhatsApp
  const copiarWhatsApp = (whatsapp: string) => {
    navigator.clipboard.writeText(whatsapp)
    alert('WhatsApp copiado!')
  }

  // Corrigir trial para 3 dias (quem recebeu 30 por engano)
  const corrigirPara3Dias = async (trialId: string) => {
    if (!confirm('Ajustar este trial para exatamente 3 dias a partir da data de início?')) return
    setFixingId(trialId)
    try {
      const res = await fetch(`/api/admin/trials/${trialId}/fix-duration`, {
        method: 'PATCH',
        credentials: 'include',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        await carregarTrials()
      } else {
        alert(data.error || 'Erro ao corrigir')
      }
    } catch (e) {
      alert('Erro ao corrigir. Tente novamente.')
    } finally {
      setFixingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <h1 className="text-2xl font-bold text-gray-900">
                  🎁 Gerenciar Trials de 3 Dias
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
            Visualize e coordene todos os trials ativos e expirados para otimizar conversões
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Relatório por Presidente */}
        {trials.filter(t => t.trial_group === 'presidentes' && t.nome_presidente).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📊 Relatório por Presidente
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Presidente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trials Ativos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trials Expirados
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(
                    trials
                      .filter(t => t.trial_group === 'presidentes' && t.nome_presidente)
                      .reduce((acc: any, trial) => {
                        const nome = trial.nome_presidente || 'Sem presidente'
                        if (!acc[nome]) {
                          acc[nome] = { ativos: 0, expirados: 0, total: 0 }
                        }
                        if (trial.status === 'active') {
                          acc[nome].ativos++
                        } else {
                          acc[nome].expirados++
                        }
                        acc[nome].total++
                        return acc
                      }, {})
                  )
                    .sort((a: any, b: any) => b[1].total - a[1].total)
                    .map(([nome, stats]: [string, any]) => (
                      <tr key={nome} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{nome}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {stats.ativos}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {stats.expirados}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{stats.total}</div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <div className="text-sm text-green-600">Ativos</div>
            <div className="text-2xl font-bold text-green-700">{stats.ativos}</div>
          </div>
          <div className="bg-gray-50 rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Expirados</div>
            <div className="text-2xl font-bold text-gray-700">{stats.expirados}</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <div className="text-sm text-blue-600">Geral</div>
            <div className="text-2xl font-bold text-blue-700">{stats.gerais}</div>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-4">
            <div className="text-sm text-purple-600">Presidentes</div>
            <div className="text-2xl font-bold text-purple-700">{stats.presidentes}</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="expired">Expirados</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ambiente
              </label>
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Todos</option>
                <option value="geral">Geral</option>
                <option value="presidentes">Presidentes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome, email ou WhatsApp..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando...</p>
            </div>
          ) : filteredTrials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum trial encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      WhatsApp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duração
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dias Rest.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ambiente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Presidente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Criação
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expira em
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTrials.map((trial) => (
                    <tr key={trial.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {trial.nome_completo}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{trial.email}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">{trial.whatsapp}</span>
                          <button
                            onClick={() => copiarWhatsApp(trial.whatsapp)}
                            className="text-green-600 hover:text-green-800 text-xs"
                            title="Copiar WhatsApp"
                          >
                            📋
                          </button>
                          <a
                            href={`https://wa.me/55${trial.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-xs"
                            title="Abrir WhatsApp"
                          >
                            💬
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trial.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {trial.status === 'active' ? '✅ Ativo' : '❌ Expirado'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          (trial.dias_duracao ?? 0) > 3 ? 'text-amber-700 bg-amber-100 px-2 py-0.5 rounded' : 'text-gray-700'
                        }`} title={(trial.dias_duracao ?? 0) > 3 ? 'Deveria ser 3 dias. Use "Corrigir para 3 dias".' : ''}>
                          {trial.dias_duracao != null ? `${trial.dias_duracao} dias` : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          trial.status === 'active'
                            ? trial.dias_restantes <= 1
                              ? 'text-red-600'
                              : trial.dias_restantes <= 2
                              ? 'text-orange-600'
                              : 'text-gray-900'
                            : 'text-gray-500'
                        }`}>
                          {trial.status === 'active' ? `${trial.dias_restantes} dias` : '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trial.trial_group === 'presidentes'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {trial.trial_group === 'presidentes' ? '🏆 Presidentes' : '🌐 Geral'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {trial.nome_presidente || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatarData(trial.data_criacao)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatarData(trial.data_fim)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {(trial.dias_duracao ?? 0) > 3 ? (
                          <button
                            type="button"
                            onClick={() => corrigirPara3Dias(trial.id)}
                            disabled={fixingId === trial.id}
                            className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 disabled:opacity-50"
                          >
                            {fixingId === trial.id ? 'Corrigindo…' : 'Corrigir para 3 dias'}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
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

export default function AdminTrialsPage() {
  return (
    <AdminProtectedRoute>
      <AdminTrialsContent />
    </AdminProtectedRoute>
  )
}
