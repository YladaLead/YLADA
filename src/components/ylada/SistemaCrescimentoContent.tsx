'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import { SISTEMA_CRESCIMENTO } from '@/config/sistema-crescimento'

interface StrategyMapData {
  stages: Array<{ id: string; name: string; completed: boolean }>
  current_stage: string | null
  profile: string | null
  goal: string | null
}

interface ConversationDiagnosis {
  id: string
  user_message: string
  bloqueio: string | null
  estrategia: string | null
  exemplo: string | null
  created_at: string
}

interface SistemaCrescimentoContentProps {
  areaCodigo: string
  areaLabel: string
}

const STAGE_NAMES: Record<string, string> = {
  posicionamento: 'Posicionamento',
  atracao: 'Atração',
  diagnostico: 'Diagnóstico',
  conversa: 'Conversa',
  clientes: 'Clientes',
  fidelizacao: 'Fidelização',
  indicacoes: 'Indicações',
}

export default function SistemaCrescimentoContent({ areaCodigo, areaLabel }: SistemaCrescimentoContentProps) {
  const fetchAuth = useAuthenticatedFetch()
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const segment = areaCodigo === 'ylada' ? 'ylada' : areaCodigo

  const [mapa, setMapa] = useState<StrategyMapData | null>(null)
  const [conversas, setConversas] = useState<ConversationDiagnosis[]>([])
  const [linksCount, setLinksCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [mapaRes, convRes, linksRes] = await Promise.all([
          fetchAuth(`/api/ylada/noel/mapa?segment=${segment}`),
          fetchAuth(`/api/ylada/noel/diagnostico-conversa?segment=${segment}&limit=5`),
          fetchAuth('/api/ylada/links'),
        ])
        if (cancelled) return
        const mapaJson = await mapaRes.json()
        const convJson = await convRes.json()
        const linksJson = await linksRes.json()
        if (mapaJson?.success && mapaJson?.data) setMapa(mapaJson.data)
        if (convJson?.success && convJson?.data) setConversas(convJson.data)
        if (linksJson?.success && Array.isArray(linksJson?.data)) setLinksCount(linksJson.data.length)
      } catch (e) {
        if (!cancelled) console.warn('[SistemaCrescimento]', e)
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
        <p className="text-gray-500">Carregando seu sistema de crescimento...</p>
      </div>
    )
  }

  const needsOnboarding = !mapa?.profile && !mapa?.goal && conversas.length === 0

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{SISTEMA_CRESCIMENTO.titulo}</h1>
        <p className="mt-1 text-gray-600">{SISTEMA_CRESCIMENTO.subtitulo}</p>
      </div>

      {needsOnboarding && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            <strong>Primeiro passo:</strong> Faça o diagnóstico do seu negócio para personalizar as orientações do Noel e ver seu perfil estratégico.
          </p>
          <Link
            href={`${prefix}/crescimento/diagnostico-profissional`}
            className="mt-2 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            Fazer diagnóstico do meu negócio
          </Link>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
        {/* 1. Diagnóstico do profissional */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl" aria-hidden>👤</span>
            <h2 className="font-semibold text-gray-900">{SISTEMA_CRESCIMENTO.diagnostico_profissional.titulo}</h2>
          </div>
          <p className="mb-3 text-sm text-gray-600">{SISTEMA_CRESCIMENTO.diagnostico_profissional.descricao}</p>
          {mapa ? (
            <div className="space-y-2 text-sm">
              {mapa.profile && (
                <p><span className="font-medium text-gray-700">Perfil:</span> {mapa.profile}</p>
              )}
              {mapa.goal && (
                <p><span className="font-medium text-gray-700">Próximo passo:</span> {mapa.goal}</p>
              )}
              {mapa.current_stage && (
                <p>
                  <span className="font-medium text-gray-700">Etapa atual:</span>{' '}
                  {STAGE_NAMES[mapa.current_stage] ?? mapa.current_stage}
                </p>
              )}
              <Link
                href={`${prefix}/crescimento/diagnostico-profissional`}
                className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Fazer diagnóstico do seu negócio →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Converse com o Noel ou faça o diagnóstico para preencher.
              </p>
              <Link
                href={`${prefix}/crescimento/diagnostico-profissional`}
                className="inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Fazer diagnóstico do seu negócio →
              </Link>
            </div>
          )}
        </div>

        {/* 2. Diagnóstico do cliente */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl" aria-hidden>🔗</span>
            <h2 className="font-semibold text-gray-900">{SISTEMA_CRESCIMENTO.diagnostico_cliente.titulo}</h2>
          </div>
          <p className="mb-3 text-sm text-gray-600">{SISTEMA_CRESCIMENTO.diagnostico_cliente.descricao}</p>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-700">Links ativos:</span>{' '}
              {linksCount !== null ? linksCount : '—'}
            </p>
            <Link
              href={`${prefix}/crescimento/diagnostico-cliente`}
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Ver métricas →
            </Link>
            <Link
              href={`${prefix}/links`}
              className="ml-3 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              Criar link →
            </Link>
          </div>
        </div>

        {/* 3. Diagnóstico da conversa */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl" aria-hidden>💬</span>
            <h2 className="font-semibold text-gray-900">{SISTEMA_CRESCIMENTO.diagnostico_conversa.titulo}</h2>
          </div>
          <p className="mb-3 text-sm text-gray-600">{SISTEMA_CRESCIMENTO.diagnostico_conversa.descricao}</p>
          {conversas.length > 0 ? (
            <div className="space-y-3">
              {conversas.slice(0, 2).map((c) => (
                <div key={c.id} className="rounded-lg bg-gray-50 p-3 text-sm">
                  {c.bloqueio && <p className="font-medium text-gray-800">{c.bloqueio}</p>}
                  {c.estrategia && <p className="mt-1 text-gray-600">{c.estrategia}</p>}
                </div>
              ))}
              <Link
                href={`${prefix}/crescimento/diagnostico-conversa`}
                className="inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Ver histórico completo →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Converse com o Noel para gerar insights.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Ciclo completo:</strong> {SISTEMA_CRESCIMENTO.ciclo_completo}
        </p>
      </div>
    </div>
  )
}
