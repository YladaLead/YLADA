'use client'

import { useState, useEffect } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'

type Fase =
  | 'inscrito_nao_chamou'
  | 'chamou_nao_fechou'
  | 'agendou'
  | 'participou'
  | 'nao_participou'

const FASE_LABELS: Record<Fase | '', string> = {
  '': 'Todas',
  inscrito_nao_chamou: 'Inscrito não chamou',
  chamou_nao_fechou: 'Chamou não fechou',
  agendou: 'Agendou',
  participou: 'Participou',
  nao_participou: 'Não participou',
}

interface ConversationWithFase {
  id: string
  phone: string
  name: string | null
  customer_name: string | null
  last_message_at: string | null
  created_at: string
  fase: Fase
  tags: string[]
  context: Record<string, unknown> | null
  /** Nome e telefone vindo de workshop_inscricoes/contact_submissions quando encontrado. */
  display_name?: string | null
  display_phone?: string | null
}

function V2AdminContent() {
  const [conversations, setConversations] = useState<ConversationWithFase[]>([])
  const [loading, setLoading] = useState(true)
  const [faseFilter, setFaseFilter] = useState<Fase | ''>('')
  const [area] = useState('nutri')
  const [actingId, setActingId] = useState<string | null>(null)
  const [workerRunning, setWorkerRunning] = useState(false)
  const [workerResult, setWorkerResult] = useState<{
    success?: boolean
    skipped?: boolean
    reason?: string
    boasVindas?: { enviados: number; erros: number }
    preAula?: { enviados: number; erros: number }
    followUpNaoRespondeu?: { enviados: number; erros: number }
    disabled?: boolean
    error?: string
  } | null>(null)

  const loadConversations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ area })
      if (faseFilter) params.set('fase', faseFilter)
      const res = await fetch(`/api/admin/whatsapp/v2/conversations?${params}`, {
        credentials: 'include',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Erro ${res.status}`)
      }
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao carregar'
      setConversations([])
      console.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [faseFilter, area])

  /** Nome do cliente: prioriza display_name (inscrições), customer_name, context.lead_name; evita "Ylada Nutri" e numeração. */
  const nome = (c: ConversationWithFase) => {
    const disp = (c.display_name || '').trim()
    if (disp) return disp
    const lead = (c.context as Record<string, unknown>)?.lead_name
    const leadStr = typeof lead === 'string' ? lead.trim() : ''
    const cust = (c.customer_name || '').trim()
    const n = (c.name || '').trim()
    const ehYladaNutri = n.toLowerCase() === 'ylada nutri'
    const ehSoNumero = /^\d[\d\s]*$/.test(n) && n.replace(/\D/g, '').length >= 6
    if (cust) return cust
    if (leadStr) return leadStr
    if (n && !ehYladaNutri && !ehSoNumero) return n
    return '—'
  }

  /** Formata telefone; valores que parecem ID/código (muitos dígitos, não-BR) exibem como "Código". */
  const formatPhone = (raw: string) => {
    if (!raw || typeof raw !== 'string') return '—'
    const d = raw.replace(/\D/g, '')
    if (d.length >= 15 || (d.length >= 10 && !d.startsWith('55'))) {
      return `Código ${d.slice(-6)}`
    }
    if (d.startsWith('55') && (d.length === 12 || d.length === 13)) {
      const ddd = d.slice(2, 4)
      const rest = d.slice(4)
      const mask = rest.length === 8 ? `${rest.slice(0, 4)}-${rest.slice(4)}` : `${rest.slice(0, 5)}-${rest.slice(5)}`
      return `+55 (${ddd}) ${mask}`
    }
    if (d.length >= 10) return `+${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4)}`
    return raw
  }

  const formatDate = (s: string | null) => {
    if (!s) return '—'
    try {
      const d = new Date(s)
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return '—'
    }
  }

  const handleParticipou = async (conversationId: string, participated: boolean) => {
    try {
      setActingId(conversationId)
      const res = await fetch('/api/admin/whatsapp/workshop/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ conversationId, participated }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `Erro ${res.status}`)
      await loadConversations()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erro ao marcar')
    } finally {
      setActingId(null)
    }
  }

  const handleDispararLink = async (conversationId: string) => {
    try {
      setActingId(conversationId)
      const res = await fetch('/api/admin/whatsapp/v2/disparar/link-pos-participou', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ conversationId, area }),
      })
      const data = await res.json().catch(() => ({}))
      if (!data.success) throw new Error(data.error || 'Falha ao disparar')
      await loadConversations()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erro ao disparar link')
    } finally {
      setActingId(null)
    }
  }

  const handleDispararRemarketing = async (conversationId: string) => {
    try {
      setActingId(conversationId)
      const res = await fetch('/api/admin/whatsapp/v2/disparar/remarketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ conversationId, area }),
      })
      const data = await res.json().catch(() => ({}))
      if (!data.success) throw new Error(data.error || 'Falha ao disparar')
      await loadConversations()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Erro ao disparar remarketing')
    } finally {
      setActingId(null)
    }
  }

  const runWorker = async () => {
    try {
      setWorkerRunning(true)
      setWorkerResult(null)
      const res = await fetch('/api/admin/whatsapp/v2/worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ area }),
      })
      const data = await res.json().catch(() => ({}))
      setWorkerResult(data)
      if (data.disabled) return
      await loadConversations()
    } catch (e: unknown) {
      setWorkerResult({
        success: false,
        error: e instanceof Error ? e.message : 'Erro ao rodar worker',
      })
    } finally {
      setWorkerRunning(false)
    }
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/whatsapp"
                className="text-sm text-blue-600 hover:underline"
              >
                ← WhatsApp (principal)
              </Link>
              <h1 className="text-xl font-semibold text-gray-800">
                Carol v2 — Conversas por fase
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={faseFilter}
                onChange={(e) => setFaseFilter((e.target.value || '') as Fase | '')}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm"
              >
                {(Object.keys(FASE_LABELS) as (Fase | '')[]).map((f) => (
                  <option key={f || 'todas'} value={f}>
                    {FASE_LABELS[f]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={runWorker}
                disabled={workerRunning}
                className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {workerRunning ? 'Rodando…' : 'Rodar worker'}
              </button>
            </div>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            Use o filtro por fase; marque &quot;Participou&quot; ou &quot;Não participou&quot; nas conversas agendadas; dispare link (participou) ou remarketing (não participou) quando precisar; use &quot;Rodar worker&quot; para enviar boas-vindas, pré-aula e follow-ups.
          </p>

          {workerResult && (
            <div
              className={`mb-4 rounded-lg border p-3 text-sm ${
                workerResult.disabled
                  ? 'border-amber-200 bg-amber-50 text-amber-800'
                  : workerResult.success
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : 'border-red-200 bg-red-50 text-red-800'
              }`}
            >
              {workerResult.disabled ? (
                <p>Automação desligada. Worker não executa envios.</p>
              ) : workerResult.error ? (
                <p>{workerResult.error}</p>
              ) : (
                <>
                  {workerResult.skipped && workerResult.reason && (
                    <p className="font-medium">Pulado: {workerResult.reason}</p>
                  )}
                  {workerResult.boasVindas && (
                    <p>
                      Boas-vindas: {workerResult.boasVindas.enviados} enviados,{' '}
                      {workerResult.boasVindas.erros} erros
                    </p>
                  )}
                  {workerResult.preAula && (
                    <p>
                      Pré-aula: {workerResult.preAula.enviados} enviados,{' '}
                      {workerResult.preAula.erros} erros
                    </p>
                  )}
                  {workerResult.followUpNaoRespondeu && (
                    <p>
                      Follow-up não respondeu:{' '}
                      {workerResult.followUpNaoRespondeu.enviados} enviados,{' '}
                      {workerResult.followUpNaoRespondeu.erros} erros
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {loading ? (
            <p className="py-8 text-center text-gray-500">Carregando…</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 font-medium">Nome</th>
                      <th className="px-4 py-2 font-medium">Telefone</th>
                      <th className="px-4 py-2 font-medium">Fase</th>
                      <th className="px-4 py-2 font-medium">Última msg</th>
                      <th className="px-4 py-2 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                          Nenhuma conversa encontrada.
                        </td>
                      </tr>
                    ) : (
                      conversations.map((c) => (
                        <tr
                          key={c.id}
                          className="border-b border-gray-100 hover:bg-gray-50/50"
                        >
                          <td className="px-4 py-2 font-medium text-gray-900">
                            {nome(c)}
                          </td>
                          <td className="px-4 py-2 text-gray-600 font-mono text-xs">{formatPhone(c.display_phone || c.phone)}</td>
                          <td className="px-4 py-2">
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-700">
                              {FASE_LABELS[c.fase] || c.fase}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-500">
                            {formatDate(c.last_message_at)}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex flex-wrap items-center gap-1">
                              <Link
                                href={`/admin/whatsapp?conversation=${c.id}`}
                                className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                              >
                                Abrir
                              </Link>
                              {c.fase === 'agendou' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleParticipou(c.id, true)}
                                    disabled={actingId === c.id}
                                    className="rounded bg-green-100 px-2 py-1 text-xs text-green-800 hover:bg-green-200 disabled:opacity-50"
                                  >
                                    Participou
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleParticipou(c.id, false)}
                                    disabled={actingId === c.id}
                                    className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-800 hover:bg-amber-200 disabled:opacity-50"
                                  >
                                    Não participou
                                  </button>
                                </>
                              )}
                              {c.fase === 'participou' && (
                                <button
                                  type="button"
                                  onClick={() => handleDispararLink(c.id)}
                                  disabled={actingId === c.id}
                                  className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 hover:bg-blue-200 disabled:opacity-50"
                                >
                                  Disparar link
                                </button>
                              )}
                              {c.fase === 'nao_participou' && (
                                <button
                                  type="button"
                                  onClick={() => handleDispararRemarketing(c.id)}
                                  disabled={actingId === c.id}
                                  className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800 hover:bg-purple-200 disabled:opacity-50"
                                >
                                  Disparar remarketing
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

export default function V2AdminPage() {
  return <V2AdminContent />
}
