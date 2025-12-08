'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface LearningSuggestion {
  id: string
  query: string
  suggested_response: string
  suggested_category: string
  frequency: number
  approved: boolean | null
  approved_at: string | null
  approved_by: string | null
  rejection_reason: string | null
  last_seen_at: string
  created_at: string
}

export default function AdminLearningSuggestionsPage() {
  return (
    <AdminProtectedRoute>
      <AdminLearningSuggestionsContent />
    </AdminProtectedRoute>
  )
}

function AdminLearningSuggestionsContent() {
  const [suggestions, setSuggestions] = useState<LearningSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [minFrequency, setMinFrequency] = useState(3)
  const [selectedSuggestion, setSelectedSuggestion] = useState<LearningSuggestion | null>(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [approveAction, setApproveAction] = useState<'add_to_scripts' | 'add_to_objections' | 'just_approve'>('just_approve')
  const [approveCategory, setApproveCategory] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    carregarSugestoes()
  }, [statusFilter, minFrequency])

  const carregarSugestoes = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/admin/wellness/learning-suggestions?status=${statusFilter}&min_frequency=${minFrequency}`,
        { credentials: 'include' }
      )

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error)
    } finally {
      setLoading(false)
    }
  }

  const aprovarSugestao = async () => {
    if (!selectedSuggestion) return

    try {
      const body: any = {}
      
      if (approveAction === 'add_to_scripts' || approveAction === 'add_to_objections') {
        body.action = approveAction
        body.category = approveCategory || selectedSuggestion.suggested_category
      }

      const response = await fetch(
        `/api/admin/wellness/learning-suggestions/${selectedSuggestion.id}/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          credentials: 'include',
        }
      )

      if (response.ok) {
        await carregarSugestoes()
        setShowApproveModal(false)
        setSelectedSuggestion(null)
        alert('Sugestão aprovada com sucesso!')
      } else {
        const error = await response.json()
        alert('Erro: ' + (error.error || 'Erro ao aprovar'))
      }
    } catch (error) {
      console.error('Erro ao aprovar sugestão:', error)
      alert('Erro ao aprovar')
    }
  }

  const rejeitarSugestao = async (suggestion: LearningSuggestion) => {
    if (!confirm('Tem certeza que deseja rejeitar esta sugestão?')) return

    try {
      const response = await fetch(
        `/api/admin/wellness/learning-suggestions/${suggestion.id}/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: rejectReason }),
          credentials: 'include',
        }
      )

      if (response.ok) {
        await carregarSugestoes()
        setRejectReason('')
        alert('Sugestão rejeitada')
      } else {
        const error = await response.json()
        alert('Erro: ' + (error.error || 'Erro ao rejeitar'))
      }
    } catch (error) {
      console.error('Erro ao rejeitar sugestão:', error)
      alert('Erro ao rejeitar')
    }
  }

  const getFrequencyBadge = (frequency: number) => {
    if (frequency >= 5) return { emoji: '🔴', label: 'Muito Frequente', color: 'bg-red-100 text-red-800' }
    if (frequency >= 3) return { emoji: '🟠', label: 'Frequente', color: 'bg-orange-100 text-orange-800' }
    return { emoji: '🟡', label: 'Recorrente', color: 'bg-yellow-100 text-yellow-800' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🧠 Sugestões de Aprendizado - NOEL
              </h1>
              <p className="text-gray-600">
                O NOEL identificou consultas recorrentes que podem ser adicionadas ao banco de conhecimento.
              </p>
            </div>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Voltar ao Dashboard
            </Link>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-4 flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="pending">Pendentes</option>
                <option value="approved">Aprovadas</option>
                <option value="rejected">Rejeitadas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequência Mínima
              </label>
              <input
                type="number"
                min="1"
                value={minFrequency}
                onChange={(e) => setMinFrequency(parseInt(e.target.value) || 1)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-24"
              />
            </div>
            <div className="ml-auto">
              <span className="text-sm text-gray-600">
                {suggestions.length} sugestão(ões) encontrada(s)
              </span>
            </div>
          </div>
        </div>

        {/* Lista de Sugestões */}
        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Nenhuma sugestão encontrada com os filtros selecionados.
            </div>
          ) : (
            suggestions.map((suggestion) => {
              const badge = getFrequencyBadge(suggestion.frequency)
              return (
                <div
                  key={suggestion.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
                          {badge.emoji} {badge.label} ({suggestion.frequency}x)
                        </span>
                        {suggestion.suggested_category && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                            {suggestion.suggested_category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {suggestion.query}
                      </h3>
                    </div>
                    {statusFilter === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedSuggestion(suggestion)
                            setShowApproveModal(true)
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                        >
                          ✓ Aprovar
                        </button>
                        <button
                          onClick={() => rejeitarSugestao(suggestion)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                        >
                          ✗ Rejeitar
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                    <p className="text-sm font-medium text-green-900 mb-1">💡 Resposta Sugerida:</p>
                    <p className="text-sm text-green-800 whitespace-pre-wrap">
                      {suggestion.suggested_response.substring(0, 500)}
                      {suggestion.suggested_response.length > 500 && '...'}
                    </p>
                  </div>

                  <div className="text-xs text-gray-500">
                    Última vez: {new Date(suggestion.last_seen_at).toLocaleString('pt-BR')} | 
                    Criada em: {new Date(suggestion.created_at).toLocaleString('pt-BR')}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal de Aprovação */}
        {showApproveModal && selectedSuggestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Aprovar Sugestão
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ação
                  </label>
                  <select
                    value={approveAction}
                    onChange={(e) => setApproveAction(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="just_approve">Apenas aprovar</option>
                    <option value="add_to_scripts">Adicionar aos Scripts</option>
                    <option value="add_to_objections">Adicionar às Objeções</option>
                  </select>
                </div>

                {(approveAction === 'add_to_scripts' || approveAction === 'add_to_objections') && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <input
                      type="text"
                      value={approveCategory}
                      onChange={(e) => setApproveCategory(e.target.value)}
                      placeholder={selectedSuggestion.suggested_category || 'Ex: clientes, recrutamento'}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setShowApproveModal(false)
                      setSelectedSuggestion(null)
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={aprovarSugestao}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Aprovar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


