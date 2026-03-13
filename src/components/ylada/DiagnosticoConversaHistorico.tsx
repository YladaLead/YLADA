'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'

interface ConversationDiagnosis {
  id: string
  user_message: string
  bloqueio: string | null
  estrategia: string | null
  exemplo: string | null
  assistant_response: string | null
  created_at: string
}

interface DiagnosticoConversaHistoricoProps {
  areaCodigo: string
  areaLabel: string
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function DiagnosticoConversaHistorico({ areaCodigo, areaLabel }: DiagnosticoConversaHistoricoProps) {
  const fetchAuth = useAuthenticatedFetch()
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const segment = areaCodigo === 'ylada' ? 'ylada' : areaCodigo

  const [items, setItems] = useState<ConversationDiagnosis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetchAuth(`/api/ylada/noel/diagnostico-conversa?segment=${segment}&limit=30`)
        const json = await res.json()
        if (!cancelled && json?.success && json?.data) setItems(json.data)
      } catch (e) {
        if (!cancelled) console.warn('[DiagnosticoConversaHistorico]', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [fetchAuth, segment])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500">Carregando histórico...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Diagnóstico da conversa</h1>
        <p className="mt-1 text-gray-600">
          Histórico de insights do Noel sobre como você conduz as conversas com clientes e leads.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">Nenhum insight ainda.</p>
          <p className="mt-2 text-sm text-gray-500">
            Converse com o Noel sobre suas conversas e dificuldades para gerar diagnósticos.
          </p>
          <Link
            href={`${prefix}/home`}
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Ir para o Noel
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs text-gray-500">{formatDate(item.created_at)}</p>
              <p className="mt-1 text-sm text-gray-700 italic">&quot;{item.user_message.slice(0, 150)}{item.user_message.length > 150 ? '…' : ''}&quot;</p>
              {item.bloqueio && (
                <p className="mt-3 font-medium text-gray-800">{item.bloqueio}</p>
              )}
              {item.estrategia && (
                <p className="mt-1 text-sm text-gray-600">{item.estrategia}</p>
              )}
              {item.exemplo && (
                <p className="mt-2 rounded-lg bg-gray-50 p-2 text-sm text-gray-700">
                  Exemplo: {item.exemplo}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Link href={`${prefix}/crescimento`} className="text-sm text-gray-500 hover:underline">
        ← Voltar ao sistema de crescimento
      </Link>
    </div>
  )
}
