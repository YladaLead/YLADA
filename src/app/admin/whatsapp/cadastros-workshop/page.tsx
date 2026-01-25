'use client'

import { useState, useEffect } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'

interface WorkshopRegistration {
  id: string
  nome: string
  email: string
  telefone: string
  crn?: string
  source?: string
  created_at: string
  conversation_id?: string
  conversation_tags?: string[]
  has_conversation?: boolean
}

function CadastrosWorkshopPage() {
  return (
    <AdminProtectedRoute>
      <CadastrosWorkshopContent />
    </AdminProtectedRoute>
  )
}

function CadastrosWorkshopContent() {
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'no_conversation' | 'no_tags'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/whatsapp/cadastros-workshop', {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setRegistrations(data.registrations || [])
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = () => {
    const filtered = getFilteredRegistrations()
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(r => r.id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const getFilteredRegistrations = () => {
    let filtered = registrations

    // Filtro por status
    if (filter === 'no_conversation') {
      filtered = filtered.filter(r => !r.has_conversation)
    } else if (filter === 'no_tags') {
      filtered = filtered.filter(r => !r.conversation_tags || r.conversation_tags.length === 0)
    }

    // Busca por nome, email ou telefone
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(r =>
        r.nome.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.telefone.includes(term)
      )
    }

    return filtered
  }

  const handleProcessSelected = async () => {
    if (selectedIds.size === 0) {
      alert('Selecione pelo menos um cadastro')
      return
    }

    if (!confirm(`Processar ${selectedIds.size} cadastro(s)? Isso vai criar/atualizar conversas e enviar mensagens da Carol.`)) {
      return
    }

    setProcessing(true)
    try {
      const res = await fetch('/api/admin/whatsapp/cadastros-workshop/processar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          registrationIds: Array.from(selectedIds)
        })
      })

      const data = await res.json()
      if (data.success) {
        alert(`✅ Processamento concluído!\n\n📊 Estatísticas:\n- Processados: ${data.processed}\n- Conversas criadas: ${data.conversationsCreated}\n- Mensagens enviadas: ${data.messagesSent}\n- Erros: ${data.errors}\n\n📋 Detalhes:\n${data.details || 'Nenhum detalhe disponível'}`)
        await loadRegistrations()
        setSelectedIds(new Set())
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro: ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  const handleAddTagsToSelected = async () => {
    if (selectedIds.size === 0) {
      alert('Selecione pelo menos um cadastro')
      return
    }

    const tagsInput = prompt('Digite as tags separadas por vírgula (ex: veio_aula_pratica, primeiro_contato):')
    if (!tagsInput || !tagsInput.trim()) {
      return
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0)

    setProcessing(true)
    try {
      const res = await fetch('/api/admin/whatsapp/cadastros-workshop/adicionar-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          registrationIds: Array.from(selectedIds),
          tags
        })
      })

      const data = await res.json()
      if (data.success) {
        alert(`✅ Tags adicionadas com sucesso!\n\n- Atualizadas: ${data.updated}`)
        await loadRegistrations()
        setSelectedIds(new Set())
      } else {
        alert(`Erro: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Erro: ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  const filteredRegistrations = getFilteredRegistrations()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📋 Cadastros do Workshop</h1>
              <p className="text-sm text-gray-500 mt-1">
                Lista de todas as pessoas que se cadastraram no workshop
              </p>
            </div>
            <Link
              href="/admin/whatsapp"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total de Cadastros</div>
            <div className="text-2xl font-bold text-gray-900">{registrations.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-2 border-orange-300">
            <div className="text-sm text-gray-600 font-semibold">⚠️ Sem Conversa no WhatsApp</div>
            <div className="text-2xl font-bold text-orange-600">
              {registrations.filter(r => !r.has_conversation).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Cadastrou mas não iniciou conversa
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Sem Tags</div>
            <div className="text-2xl font-bold text-yellow-600">
              {registrations.filter(r => !r.conversation_tags || r.conversation_tags.length === 0).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Selecionados</div>
            <div className="text-2xl font-bold text-blue-600">{selectedIds.size}</div>
          </div>
        </div>

        {/* Filtros e Ações */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            {/* Busca */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, email ou telefone..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Filtro */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">Todos</option>
              <option value="no_conversation">⚠️ Sem conversa (não iniciou WhatsApp)</option>
              <option value="no_tags">Sem tags</option>
            </select>

            {/* Ações */}
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              {selectedIds.size === filteredRegistrations.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </button>

            {selectedIds.size > 0 && (
              <>
                <button
                  onClick={handleAddTagsToSelected}
                  disabled={processing}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                >
                  🏷️ Adicionar Tags
                </button>
                <button
                  onClick={handleProcessSelected}
                  disabled={processing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {processing ? 'Processando...' : '🚀 Processar e Ativar'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando...</div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhum cadastro encontrado</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filteredRegistrations.length && filteredRegistrations.length > 0}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CRN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Cadastro</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(reg.id)}
                          onChange={() => handleSelectOne(reg.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{reg.nome}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{reg.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{reg.telefone}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{reg.crn || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(reg.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        {reg.has_conversation ? (
                          <Link
                            href={`/admin/whatsapp?conversation=${reg.conversation_id}`}
                            className="text-sm text-blue-600 hover:underline font-medium"
                          >
                            ✅ Ver conversa
                          </Link>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-sm text-orange-600 font-semibold">⚠️ Não iniciou conversa</span>
                            <span className="text-xs text-gray-500">Cadastrou mas não chamou no WhatsApp</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {reg.conversation_tags && reg.conversation_tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {reg.conversation_tags.map((tag, i) => (
                              <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Sem tags</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Como usar:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>Selecionar:</strong> Marque os cadastros que deseja processar</li>
            <li><strong>Adicionar Tags:</strong> Adicione tags manualmente antes de processar</li>
            <li><strong>Processar e Ativar:</strong> Cria/atualiza conversas e envia mensagens da Carol automaticamente</li>
            <li><strong>Filtros:</strong> Use os filtros para encontrar cadastros específicos</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CadastrosWorkshopPage
