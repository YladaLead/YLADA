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
  has_welcome_message?: boolean
  welcome_sent_at?: string | null
  needs_manual_whatsapp?: boolean
}

const KNOWN_WORKSHOP_SOURCES = [
  'workshop_nutri_empresaria_landing_page',
  'workshop_agenda_instavel_landing_page',
  'workshop_landing_page',
] as const

function formatWorkshopSourceLabel(source?: string | null): string {
  switch (source) {
    case 'workshop_nutri_empresaria_landing_page':
      return 'Nutri → Empresária'
    case 'workshop_agenda_instavel_landing_page':
      return 'Agenda instável'
    case 'workshop_landing_page':
      return 'Workshop (landing)'
    case '':
    case undefined:
    case null:
      return '—'
    default:
      return source
  }
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
  const [filter, setFilter] = useState<'all' | 'pending_welcome' | 'no_conversation' | 'no_tags'>('pending_welcome')
  const [sourceFilter, setSourceFilter] = useState<
    '' | (typeof KNOWN_WORKSHOP_SOURCES)[number] | '__other__'
  >('')
  const [searchTerm, setSearchTerm] = useState('')
  const [tagsModalOpen, setTagsModalOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTagInput, setNewTagInput] = useState('')

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
    if (filter === 'pending_welcome') {
      filtered = filtered.filter(r => r.needs_manual_whatsapp)
    }
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

    if (sourceFilter === '__other__') {
      filtered = filtered.filter(r => {
        const s = r.source || ''
        return s !== '' && !KNOWN_WORKSHOP_SOURCES.includes(s as (typeof KNOWN_WORKSHOP_SOURCES)[number])
      })
    } else if (sourceFilter) {
      filtered = filtered.filter(r => r.source === sourceFilter)
    }

    // Ordenação: pendentes primeiro; depois mais recentes
    return filtered.sort((a, b) => {
      const ap = a.needs_manual_whatsapp ? 1 : 0
      const bp = b.needs_manual_whatsapp ? 1 : 0
      if (ap !== bp) return bp - ap
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }

  const handleProcessSelected = async () => {
    if (selectedIds.size === 0) {
      alert('Selecione pelo menos um cadastro')
      return
    }

    if (!confirm(`Disparar a 1ª mensagem do workshop para ${selectedIds.size} cadastro(s)?`)) {
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
        alert(
          `✅ Disparo concluído!\n\n📊 Estatísticas:\n- Processados: ${data.processed}\n- Conversas criadas: ${data.conversationsCreated}\n- Mensagens enviadas: ${data.messagesSent}\n- Já tinham mensagem (pulados): ${data.skippedAlreadySent || 0}\n- Erros: ${data.errors}\n\n📋 Detalhes:\n${data.details || 'Nenhum detalhe disponível'}`
        )
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

  const handleSendOne = async (id: string) => {
    setProcessing(true)
    try {
      const res = await fetch('/api/admin/whatsapp/cadastros-workshop/processar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ registrationIds: [id] }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Erro ao disparar')
      await loadRegistrations()
    } catch (e: any) {
      alert(e.message || 'Erro ao disparar')
    } finally {
      setProcessing(false)
    }
  }

  const handleMarkSentSelected = async () => {
    if (selectedIds.size === 0) {
      alert('Selecione pelo menos um cadastro')
      return
    }

    if (!confirm(`Marcar como "já enviei" para ${selectedIds.size} cadastro(s)? Isso NÃO envia WhatsApp.`)) {
      return
    }

    setProcessing(true)
    try {
      const res = await fetch('/api/admin/whatsapp/cadastros-workshop/marcar-enviado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ registrationIds: Array.from(selectedIds) }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Erro ao marcar')
      await loadRegistrations()
      setSelectedIds(new Set())
    } catch (e: any) {
      alert(e.message || 'Erro ao marcar')
    } finally {
      setProcessing(false)
    }
  }

  const handleMarkSentAllFiltered = async () => {
    if (filteredRegistrations.length === 0) {
      alert('Nenhum cadastro para marcar')
      return
    }
    const ids = filteredRegistrations.map((r) => r.id)
    if (!confirm(`Marcar como "já enviei" para ${ids.length} cadastro(s) exibido(s)? Isso NÃO envia WhatsApp.`)) {
      return
    }
    setProcessing(true)
    try {
      const res = await fetch('/api/admin/whatsapp/cadastros-workshop/marcar-enviado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ registrationIds: ids }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Erro ao marcar')
      await loadRegistrations()
      setSelectedIds(new Set())
    } catch (e: any) {
      alert(e.message || 'Erro ao marcar')
    } finally {
      setProcessing(false)
    }
  }

  const handleMarkSentOne = async (id: string) => {
    setProcessing(true)
    try {
      const res = await fetch('/api/admin/whatsapp/cadastros-workshop/marcar-enviado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ registrationIds: [id] }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Erro ao marcar')
      await loadRegistrations()
    } catch (e: any) {
      alert(e.message || 'Erro ao marcar')
    } finally {
      setProcessing(false)
    }
  }

  const getTagInfo = (tag: string): { label: string; color: string; icon: string } => {
    const tagMap: Record<string, { label: string; color: string; icon: string }> = {
      // Fase 1: Captação
      'veio_aula_pratica': { label: 'Aula Prática', color: 'bg-blue-100 text-blue-700', icon: '📝' },
      'primeiro_contato': { label: '1º Contato', color: 'bg-blue-50 text-blue-600', icon: '👋' },
      'cliente_iniciou': { label: 'Cliente Iniciou', color: 'bg-blue-100 text-blue-700', icon: '👤' },
      'agente_iniciou': { label: 'Agente Iniciou', color: 'bg-blue-50 text-blue-600', icon: '👨‍💼' },
      'carol_ativa': { label: 'Carol Ativa', color: 'bg-purple-100 text-purple-700', icon: '🤖' },
      'aguardando_resposta': { label: 'Aguardando Resposta', color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
      
      // Fase 2: Convite
      'recebeu_link_workshop': { label: 'Link Workshop', color: 'bg-purple-100 text-purple-700', icon: '📅' },
      'recebeu_segundo_link': { label: '2º Link', color: 'bg-purple-200 text-purple-800', icon: '📅📅' },
      
      // Fase 3: Participação
      'participou_aula': { label: 'Participou', color: 'bg-green-100 text-green-700', icon: '✅' },
      'nao_participou_aula': { label: 'Não Participou', color: 'bg-red-100 text-red-700', icon: '❌' },
      'adiou_aula': { label: 'Adiou', color: 'bg-yellow-100 text-yellow-700', icon: '⏸️' },
      
      // Fase 4: Remarketing
      'interessado': { label: 'Interessado', color: 'bg-purple-50 text-purple-600', icon: '💡' },
      'duvidas': { label: 'Dúvidas', color: 'bg-indigo-100 text-indigo-700', icon: '❓' },
      'analisando': { label: 'Analisando', color: 'bg-yellow-50 text-yellow-600', icon: '🤔' },
      'objeções': { label: 'Objeções', color: 'bg-orange-100 text-orange-700', icon: '🚫' },
      'negociando': { label: 'Negociando', color: 'bg-orange-50 text-orange-600', icon: '💰' },
      
      // Fase 5: Conversão
      'cliente_nutri': { label: 'Cliente Nutri', color: 'bg-green-200 text-green-800', icon: '🎉' },
      'perdeu': { label: 'Perdeu', color: 'bg-gray-200 text-gray-700', icon: '😔' },
      
      // Extras
      'retorno': { label: 'Retorno', color: 'bg-cyan-100 text-cyan-700', icon: '🔄' },
      'urgencia': { label: 'Urgência', color: 'bg-red-200 text-red-800', icon: '⚡' },
      
      // Tags antigas (compatibilidade)
      'form_lead': { label: 'Form', color: 'bg-blue-100 text-blue-700', icon: '📝' },
      'workshop_invited': { label: 'Workshop', color: 'bg-purple-100 text-purple-700', icon: '📅' },
    }
    
    return tagMap[tag] || { label: tag, color: 'bg-gray-100 text-gray-600', icon: '🏷️' }
  }

  const handleAddTagsToSelected = () => {
    if (selectedIds.size === 0) {
      alert('Selecione pelo menos um cadastro')
      return
    }
    setSelectedTags([])
    setNewTagInput('')
    setTagsModalOpen(true)
  }

  const handleSaveTags = async () => {
    if (selectedTags.length === 0) {
      alert('Selecione ou crie pelo menos uma tag')
      return
    }

    setProcessing(true)
    try {
      const res = await fetch('/api/admin/whatsapp/cadastros-workshop/adicionar-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          registrationIds: Array.from(selectedIds),
          tags: selectedTags
        })
      })

      const data = await res.json()
      if (data.success) {
        alert(`✅ Tags adicionadas com sucesso!\n\n- Atualizadas: ${data.updated}`)
        await loadRegistrations()
        setSelectedIds(new Set())
        setTagsModalOpen(false)
        setSelectedTags([])
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
  const pendingCount = registrations.filter(r => r.needs_manual_whatsapp).length

  return (
    <div className="h-[100dvh] bg-white flex flex-col overflow-hidden">
      {/* Header (fixo) */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">📋 Cadastros do Workshop</h1>
              <p className="text-xs text-gray-500 mt-1">
                Disparo manual e controle de pendências
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ← Voltar ao admin
            </Link>
          </div>
        </div>
      </div>

      {/* Conteúdo (sem scroll da página; só a tabela rola) */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-3 h-full flex flex-col gap-3 min-h-0">
        {pendingCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3 flex-shrink-0">
            <div className="text-sm text-amber-900">
              <span className="font-semibold">⚠️ Pendentes:</span> {pendingCount} pessoa(s) ainda aparecem como “Pendente (1ª msg)”.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilter('pending_welcome')}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-semibold"
              >
                Ver
              </button>
              <button
                type="button"
                onClick={() => {
                  if (filter !== 'pending_welcome') setFilter('pending_welcome')
                  setTimeout(() => handleMarkSentAllFiltered(), 0)
                }}
                disabled={processing}
                className="px-3 py-1.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 text-sm font-semibold"
                title="Marca como já enviado e etiqueta (não dispara WhatsApp)"
              >
                ✅ Marcar todos como já enviados
              </button>
            </div>
          </div>
        )}

        {/* Resumo compacto */}
        <div className="flex flex-wrap gap-2 items-center flex-shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
            Total: {registrations.length}
          </span>
          <button
            type="button"
            onClick={() => setFilter('pending_welcome')}
            className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-sm font-semibold hover:bg-amber-200"
            title="Filtrar pendentes"
          >
            ⚠️ Pendentes (1ª msg): {pendingCount}
          </button>
          <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-900 text-sm font-semibold">
            ⚠️ Sem conversa: {registrations.filter(r => !r.has_conversation).length}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-900 text-sm font-semibold">
            Sem tags: {registrations.filter(r => !r.conversation_tags || r.conversation_tags.length === 0).length}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 text-sm font-semibold">
            Selecionados: {selectedIds.size}
          </span>
        </div>

        {/* Filtros e Ações */}
        <div className="bg-white rounded-lg shadow p-4 flex-shrink-0">
          <div className="flex flex-wrap gap-3 items-center">
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
              <option value="pending_welcome">⚠️ Pendentes (1ª mensagem)</option>
              <option value="no_conversation">⚠️ Sem conversa (não iniciou WhatsApp)</option>
              <option value="no_tags">Sem tags</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) =>
                setSourceFilter(
                  e.target.value as '' | (typeof KNOWN_WORKSHOP_SOURCES)[number] | '__other__'
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg min-w-[200px]"
              title="Filtrar por página de origem da inscrição"
            >
              <option value="">Todas as origens</option>
              <option value="workshop_nutri_empresaria_landing_page">Nutri → Empresária</option>
              <option value="workshop_agenda_instavel_landing_page">Agenda instável</option>
              <option value="workshop_landing_page">Workshop (landing)</option>
              <option value="__other__">Outras origens</option>
            </select>

            {filter === 'pending_welcome' && filteredRegistrations.length > 0 && (
              <button
                type="button"
                onClick={handleMarkSentAllFiltered}
                disabled={processing}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 font-semibold"
                title="Marca como já enviado e etiqueta (não dispara WhatsApp)"
              >
                ✅ Marcar {filteredRegistrations.length} como já enviei
              </button>
            )}

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
                  onClick={handleMarkSentSelected}
                  disabled={processing}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
                  title="Marca como já enviado (não dispara WhatsApp)"
                >
                  {processing ? '…' : '✅ Já enviei'}
                </button>
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
                  {processing ? 'Enviando...' : '📤 Disparar 1ª mensagem'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow overflow-hidden flex-1 min-h-0 flex flex-col">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando...</div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhum cadastro encontrado</div>
          ) : (
            <div className="flex-1 min-h-0 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CRN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Cadastro</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
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
                      <td className="px-4 py-3">
                        {reg.has_welcome_message ? (
                          <div className="flex flex-col">
                            <span className="inline-flex w-fit items-center px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                              ✅ Já recebeu
                            </span>
                            {reg.welcome_sent_at && (
                              <span className="text-xs text-gray-500 mt-1">
                                {new Date(reg.welcome_sent_at).toLocaleString('pt-BR')}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                            ⚠️ Pendente
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{reg.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{reg.telefone}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{reg.crn || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[220px]" title={reg.source || ''}>
                        {formatWorkshopSourceLabel(reg.source)}
                      </td>
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
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          disabled={processing || reg.has_welcome_message}
                          onClick={() => handleSendOne(reg.id)}
                          className={`px-3 py-1.5 text-sm rounded-lg font-semibold ${
                            reg.has_welcome_message
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          } disabled:opacity-50`}
                          title={reg.has_welcome_message ? 'Já recebeu' : 'Disparar 1ª mensagem'}
                        >
                          {reg.has_welcome_message ? '—' : '📤 Disparar'}
                        </button>
                        {!reg.has_welcome_message && (
                          <button
                            type="button"
                            disabled={processing}
                            onClick={() => handleMarkSentOne(reg.id)}
                            className="ml-2 px-3 py-1.5 text-sm rounded-lg font-semibold bg-slate-600 text-white hover:bg-slate-700 disabled:opacity-50"
                            title="Marcar como já enviado (não dispara WhatsApp)"
                          >
                            ✅ Já enviei
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

        {/* Info */}
        <details className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex-shrink-0">
          <summary className="cursor-pointer font-semibold text-blue-900 text-sm">
            ℹ️ Como usar (clique para expandir)
          </summary>
          <ul className="mt-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>Disparar 1ª mensagem:</strong> envia a primeira mensagem (boas-vindas + opções)</li>
            <li><strong>✅ Já enviei:</strong> só etiqueta/marca como enviado (não dispara WhatsApp)</li>
            <li><strong>Filtros:</strong> use “Pendentes (1ª msg)” para limpar rapidamente</li>
          </ul>
        </details>
        </div>
      </div>

      {/* Modal de Tags */}
      {tagsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">🏷️ Adicionar Tags</h2>
              <button
                type="button"
                onClick={() => setTagsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 text-sm text-gray-600">
                Adicionando tags para <strong>{selectedIds.size}</strong> cadastro(s) selecionado(s)
              </div>

              {/* Tags Selecionadas */}
              {selectedTags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags Selecionadas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => {
                      const tagInfo = getTagInfo(tag)
                      return (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${tagInfo.color} cursor-pointer hover:opacity-80`}
                          onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                        >
                          {tagInfo.icon} {tagInfo.label}
                          <span className="ml-1">×</span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Tags Pré-definidas por Fase */}
              <div className="space-y-6">
                {/* FASE 1: CAPTAÇÃO */}
                <div>
                  <h3 className="text-sm font-semibold text-blue-700 mb-3">📝 Fase 1: Captação</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { tag: 'veio_aula_pratica', label: 'Aula Prática', icon: '📝' },
                      { tag: 'primeiro_contato', label: '1º Contato', icon: '👋' },
                    ].map(({ tag, label, icon }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FASE 2: CONVITE */}
                <div>
                  <h3 className="text-sm font-semibold text-purple-700 mb-3">📅 Fase 2: Convite</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { tag: 'recebeu_link_workshop', label: 'Link Workshop', icon: '📅' },
                      { tag: 'recebeu_segundo_link', label: '2º Link', icon: '📅📅' },
                    ].map(({ tag, label, icon }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-purple-100 border-purple-500 text-purple-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FASE 3: PARTICIPAÇÃO */}
                <div>
                  <h3 className="text-sm font-semibold text-green-700 mb-3">✅ Fase 3: Participação</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { tag: 'participou_aula', label: 'Participou', icon: '✅' },
                      { tag: 'nao_participou_aula', label: 'Não Participou', icon: '❌' },
                      { tag: 'adiou_aula', label: 'Adiou', icon: '⏸️' },
                    ].map(({ tag, label, icon }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FASE 4: REMARKETING */}
                <div>
                  <h3 className="text-sm font-semibold text-orange-700 mb-3">💡 Fase 4: Remarketing</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { tag: 'interessado', label: 'Interessado', icon: '💡' },
                      { tag: 'duvidas', label: 'Dúvidas', icon: '❓' },
                      { tag: 'analisando', label: 'Analisando', icon: '🤔' },
                      { tag: 'objeções', label: 'Objeções', icon: '🚫' },
                      { tag: 'negociando', label: 'Negociando', icon: '💰' },
                    ].map(({ tag, label, icon }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-orange-100 border-orange-500 text-orange-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FASE 5: CONVERSÃO */}
                <div>
                  <h3 className="text-sm font-semibold text-green-800 mb-3">🎉 Fase 5: Conversão</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { tag: 'cliente_nutri', label: 'Cliente Nutri', icon: '🎉' },
                      { tag: 'perdeu', label: 'Perdeu', icon: '😔' },
                    ].map(({ tag, label, icon }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-green-200 border-green-600 text-green-800'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-green-400'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* EXTRAS */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">🔄 Extras</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { tag: 'retorno', label: 'Retorno', icon: '🔄' },
                      { tag: 'urgencia', label: 'Urgência', icon: '⚡' },
                    ].map(({ tag, label, icon }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag))
                          } else {
                            setSelectedTags([...selectedTags, tag])
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-sm text-left border-2 transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-cyan-100 border-cyan-500 text-cyan-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-cyan-300'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Criar Nova Tag */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">➕ Criar Nova Tag</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newTagInput.trim()) {
                        const newTag = newTagInput.trim().toLowerCase().replace(/\s+/g, '_')
                        if (!selectedTags.includes(newTag)) {
                          setSelectedTags([...selectedTags, newTag])
                        }
                        setNewTagInput('')
                      }
                    }}
                    placeholder="Digite o nome da tag (ex: tag_personalizada)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTagInput.trim()) {
                        const newTag = newTagInput.trim().toLowerCase().replace(/\s+/g, '_')
                        if (!selectedTags.includes(newTag)) {
                          setSelectedTags([...selectedTags, newTag])
                        }
                        setNewTagInput('')
                      }
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Adicionar
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  A tag será criada automaticamente em minúsculas com underscores
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setTagsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveTags}
                disabled={processing || selectedTags.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Salvando...' : 'Salvar Tags'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CadastrosWorkshopPage
