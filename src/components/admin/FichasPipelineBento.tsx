'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FichaPipelineItem, FichasPipelineLinha } from '@/lib/estetica-consultoria-fichas-pipeline'

function normalizeSearchText(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function fichaMatchesQuery(item: FichaPipelineItem, rawQuery: string) {
  const q = rawQuery.trim()
  if (!q) return true
  const nq = normalizeSearchText(q)
  const blob = [
    item.client.business_name,
    item.client.contact_name,
    item.client.contact_email,
    item.client.phone,
  ]
    .filter(Boolean)
    .join(' ')
  return normalizeSearchText(blob).includes(nq)
}

function formatData(iso: string | null) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function FichaCard({ item, linha, accent }: { item: FichaPipelineItem; linha: FichasPipelineLinha; accent: string }) {
  const { client, ultimoPreAt, ultimoDiagnosticoAt } = item
  const href = `/admin/estetica-consultoria?segmento=${linha}&cliente=${encodeURIComponent(client.id)}`
  return (
    <Link
      href={href}
      className={`block rounded-xl border bg-white p-3 shadow-sm transition hover:shadow-md ${accent} focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-400`}
    >
      <p className="font-semibold text-gray-900 leading-snug">{client.business_name}</p>
      {client.contact_name ? <p className="text-xs text-gray-500 mt-0.5">{client.contact_name}</p> : null}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
        {ultimoPreAt ? <span>Pré: {formatData(ultimoPreAt)}</span> : null}
        {ultimoDiagnosticoAt ? <span>Diagnóstico: {formatData(ultimoDiagnosticoAt)}</span> : null}
      </div>
    </Link>
  )
}

function Coluna({
  titulo,
  subtitulo,
  cor,
  items,
  linha,
  empty,
  emptyNoSearchMatch,
  buscaAtiva,
  large,
}: {
  titulo: string
  subtitulo: string
  cor: 'amber' | 'emerald' | 'slate'
  items: FichaPipelineItem[]
  linha: FichasPipelineLinha
  empty: string
  emptyNoSearchMatch: string
  buscaAtiva: boolean
  large?: boolean
}) {
  const border =
    cor === 'amber'
      ? 'border-amber-200 bg-amber-50/40'
      : cor === 'emerald'
        ? 'border-emerald-200 bg-emerald-50/40'
        : 'border-slate-200 bg-slate-50/50'
  const accent =
    cor === 'amber'
      ? 'border-amber-100 hover:border-amber-300'
      : cor === 'emerald'
        ? 'border-emerald-100 hover:border-emerald-300'
        : 'border-slate-200 hover:border-slate-300'

  return (
    <section
      className={`flex flex-col rounded-2xl border-2 p-4 ${border} ${large ? 'md:col-span-1 min-h-[12rem]' : ''}`}
    >
      <h3 className="text-sm font-bold text-gray-900">{titulo}</h3>
      <p className="text-xs text-gray-600 mt-0.5 mb-3">{subtitulo}</p>
      <p className="text-[11px] font-medium text-gray-500 mb-2">{items.length} ficha(s)</p>
      <div className="space-y-2 flex-1 overflow-y-auto max-h-[min(52vh,28rem)] pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">{buscaAtiva ? emptyNoSearchMatch : empty}</p>
        ) : (
          items.map((item) => (
            <FichaCard key={item.client.id} item={item} linha={linha} accent={accent} />
          ))
        )}
      </div>
    </section>
  )
}

export function FichasPipelineBento({ linha }: { linha: FichasPipelineLinha }) {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [preReuniao, setPreReuniao] = useState<FichaPipelineItem[]>([])
  const [diagnostico, setDiagnostico] = useState<FichaPipelineItem[]>([])
  const [novas, setNovas] = useState<FichaPipelineItem[]>([])
  const [busca, setBusca] = useState('')

  const buscaAtiva = busca.trim().length > 0

  const preFiltrado = useMemo(
    () => preReuniao.filter((it) => fichaMatchesQuery(it, busca)),
    [preReuniao, busca]
  )
  const diagFiltrado = useMemo(
    () => diagnostico.filter((it) => fichaMatchesQuery(it, busca)),
    [diagnostico, busca]
  )
  const novasFiltrado = useMemo(() => novas.filter((it) => fichaMatchesQuery(it, busca)), [novas, busca])

  const load = useCallback(async () => {
    setLoading(true)
    setErr(null)
    try {
      const res = await fetch(`/api/admin/estetica-consultoria/fichas-pipeline?linha=${linha}`, {
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErr((data as { error?: string }).error || 'Erro ao carregar fichas.')
        setPreReuniao([])
        setDiagnostico([])
        setNovas([])
        return
      }
      setPreReuniao((data as { preReuniao?: FichaPipelineItem[] }).preReuniao ?? [])
      setDiagnostico((data as { diagnostico?: FichaPipelineItem[] }).diagnostico ?? [])
      setNovas((data as { novas?: FichaPipelineItem[] }).novas ?? [])
    } finally {
      setLoading(false)
    }
  }, [linha])

  useEffect(() => {
    void load()
  }, [load])

  const labelLinha = linha === 'capilar' ? 'terapia capilar' : 'estética corporal'

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Fichas — pipeline</h2>
          <p className="text-xs text-gray-500 max-w-xl">
            Pré-reunião (pré-diagnóstico{linha === 'capilar' ? ' e pré-avaliação cliente' : ''} sem diagnóstico
            fechado) · Diagnóstico YLADA completo (início) · Fichas ainda sem estes envios. Clica numa ficha para abrir
            na consultoria. Para controlo manual por estágio (reunião, pagamento, etc.), usa o{' '}
            <Link
              href={`/admin/estetica-consultoria/funil?segmento=${linha}`}
              className="font-medium text-emerald-700 underline hover:text-emerald-900"
            >
              funil Kanban
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="shrink-0 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Atualizar
        </button>
      </div>

      <label className="block max-w-md">
        <span className="sr-only">Buscar fichas</span>
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, clínica ou e-mail…"
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </label>

      {err ? <p className="text-sm text-red-600">{err}</p> : null}
      {loading ? (
        <p className="text-sm text-gray-500">A carregar fichas…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Coluna
            titulo="Pré e reunião"
            subtitulo={`Já enviou o pré na linha ${labelLinha}; ainda sem diagnóstico completo YLADA.`}
            cor="amber"
            items={preFiltrado}
            linha={linha}
            empty="Nenhuma ficha nesta fase."
            emptyNoSearchMatch="Nenhum resultado nesta coluna."
            buscaAtiva={buscaAtiva}
            large
          />
          <Coluna
            titulo="Diagnóstico (início)"
            subtitulo="Diagnóstico YLADA completo recebido — integração e avanço."
            cor="emerald"
            items={diagFiltrado}
            linha={linha}
            empty="Nenhuma ainda."
            emptyNoSearchMatch="Nenhum resultado nesta coluna."
            buscaAtiva={buscaAtiva}
            large
          />
          <Coluna
            titulo="Novas / sem envio"
            subtitulo="Ficha criada; ainda sem pré nem diagnóstico nesta linha."
            cor="slate"
            items={novasFiltrado}
            linha={linha}
            empty="Nenhuma ficha vazia."
            emptyNoSearchMatch="Nenhum resultado nesta coluna."
            buscaAtiva={buscaAtiva}
            large
          />
        </div>
      )}
    </div>
  )
}
