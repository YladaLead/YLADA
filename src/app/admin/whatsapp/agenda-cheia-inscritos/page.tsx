'use client'

import { useState, useEffect } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'

interface Inscricao {
  id: string
  nome: string
  email: string
  telefone: string
  status: string
  created_at: string
  updated_at?: string
}

function AgendaCheiaInscritosContent() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [customMessage, setCustomMessage] = useState('')
  const [lastResult, setLastResult] = useState<{ enviados: number; total: number } | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/nutri/agenda-cheia-inscritos', { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setInscricoes(data.inscricoes || [])
      } else {
        alert(data.error || 'Erro ao carregar')
      }
    } catch (e: any) {
      alert(e?.message || 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const toggleAll = () => {
    if (selectedIds.size === inscricoes.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(inscricoes.map((i) => i.id)))
    }
  }

  const openWhatsApp = (telefone: string) => {
    const p = String(telefone).replace(/\D/g, '')
    const num = p.length >= 10 && p.length <= 11 ? '55' + p : p
    window.open(`https://wa.me/${num}`, '_blank')
  }

  const sendLembrete = async () => {
    if (selectedIds.size === 0) {
      alert('Selecione pelo menos um inscrito.')
      return
    }
    try {
      setSending(true)
      setLastResult(null)
      const res = await fetch('/api/admin/nutri/agenda-cheia-inscritos/lembrete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          message: customMessage.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setLastResult({ enviados: data.enviados, total: data.total })
        setSelectedIds(new Set())
        setCustomMessage('')
      } else {
        alert(data.error || 'Erro ao enviar')
      }
    } catch (e: any) {
      alert(e?.message || 'Erro ao enviar')
    } finally {
      setSending(false)
    }
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Link
              href="/admin/whatsapp"
              className="text-blue-600 hover:underline font-medium"
            >
              ← WhatsApp
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Inscritos – Aula paga (Agenda Cheia)
            </h1>
          </div>

          <p className="text-gray-600 mb-4">
            Lista de quem se inscreveu na aula de R$ 37 (página /pt/nutri/agenda-cheia). Use para enviar lembretes e o link da aula.
          </p>

          {lastResult && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-800 font-medium">
              Lembrete enviado para {lastResult.enviados} de {lastResult.total} inscrito(s).
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Carregando...</div>
            ) : inscricoes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Nenhum inscrito ainda.</div>
            ) : (
              <>
                <div className="p-4 border-b border-gray-200 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                  >
                    {selectedIds.size === inscricoes.length ? 'Desmarcar todos' : 'Selecionar todos'}
                  </button>
                  {selectedIds.size > 0 && (
                    <>
                      <span className="text-sm text-gray-600">
                        {selectedIds.size} selecionado(s)
                      </span>
                      <button
                        type="button"
                        disabled={sending}
                        onClick={sendLembrete}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-semibold"
                      >
                        {sending ? 'Enviando...' : 'Enviar lembrete por WhatsApp'}
                      </button>
                    </>
                  )}
                </div>

                {selectedIds.size > 0 && (
                  <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem do lembrete (opcional; se vazio, usa o texto padrão):
                    </label>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Ex: Olá! Lembrete: nossa aula é quarta às 20h. Em breve você receberá o link."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      rows={2}
                    />
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          <input
                            type="checkbox"
                            checked={inscricoes.length > 0 && selectedIds.size === inscricoes.length}
                            onChange={toggleAll}
                            className="rounded"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inscricoes.map((i) => (
                        <tr key={i.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(i.id)}
                              onChange={() => toggleOne(i.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{i.nome}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{i.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{i.telefone}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                i.status === 'confirmado'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {i.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(i.created_at).toLocaleString('pt-BR')}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => openWhatsApp(i.telefone)}
                              className="text-sm text-green-600 hover:underline font-medium"
                            >
                              Abrir WhatsApp
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          <details className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <summary className="cursor-pointer font-semibold text-blue-900 text-sm">
              ℹ️ Como usar
            </summary>
            <ul className="mt-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li><strong>Abrir WhatsApp:</strong> abre conversa com o número do inscrito para você enviar o link ou tirar dúvidas.</li>
              <li><strong>Enviar lembrete:</strong> envia mensagem em massa por WhatsApp (quarta 20h, link em breve). Você pode editar o texto antes.</li>
            </ul>
          </details>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

export default function AgendaCheiaInscritosPage() {
  return <AgendaCheiaInscritosContent />
}
