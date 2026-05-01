'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  type EsteticaConsultFunilVista,
  isEsteticaConsultFunilVista,
  type FichaPipelineItem,
  type FichasPipelineLinha,
  segmentoParamForConsultoriaLink,
} from '@/lib/estetica-consultoria-fichas-pipeline'
import type { EsteticaConsultFunnelStage } from '@/lib/estetica-consultoria-funnel'
import { esteticaConsultSegmentLabel, type YladaEsteticaConsultClientRow } from '@/lib/estetica-consultoria'

type FunilColumnApi = {
  key: EsteticaConsultFunnelStage
  label: string
  description: string
  border: string
  headerBg: string
  items: FichaPipelineItem[]
}

function formatShort(iso: string | null) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short' })
  } catch {
    return null
  }
}

function FunilCard({
  item,
  vista,
  segmentoLink,
  dragId,
}: {
  item: FichaPipelineItem
  vista: EsteticaConsultFunilVista
  segmentoLink: FichasPipelineLinha
  dragId: string
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: dragId,
    data: { clientId: item.client.id },
  })
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.45 : 1,
  }
  const hrefConsultoria = `/admin/estetica-consultoria?segmento=${segmentoLink}&cliente=${encodeURIComponent(item.client.id)}`
  const hrefOnboarding = `/admin/pro-lideres/onboarding?q=${encodeURIComponent(item.client.contact_email ?? '')}`
  const pre = formatShort(item.ultimoPreAt)
  const diag = formatShort(item.ultimoDiagnosticoAt)
  const isOnb = item.funilCardSource === 'leader_onboarding'
  const isPlr = item.funilCardSource === 'pro_lideres_consultoria'
  const showSegmento =
    isOnb || isPlr || vista === 'todos' || vista === 'lider' || item.client.segment === 'ambos'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
    >
      <div className="flex gap-2">
        <button
          type="button"
          className="mt-0.5 flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 active:cursor-grabbing"
          aria-label="Arrastar ficha"
          {...listeners}
          {...attributes}
        >
          <span className="text-xs leading-none text-gray-400">⋮⋮</span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 leading-snug text-sm">{item.client.business_name}</p>
          {item.client.contact_name ? (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{item.client.contact_name}</p>
          ) : null}
          {showSegmento ? (
            <p className="mt-1 text-[10px] font-medium text-gray-600">
              {isOnb ? (
                <span className="rounded bg-teal-100 px-1.5 py-0.5 text-teal-900">Onboarding Pro Líderes</span>
              ) : isPlr ? (
                <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-indigo-900">
                  Pré-diagnóstico Pro Líderes
                </span>
              ) : (
                <span className="rounded bg-gray-100 px-1.5 py-0.5">
                  {esteticaConsultSegmentLabel(item.client.segment)}
                </span>
              )}
              {!isOnb && !isPlr && vista !== 'lider' && item.client.leader_tenant_id ? (
                <span className="ml-1.5 rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-900">Pro líder</span>
              ) : null}
            </p>
          ) : null}
          <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-gray-500">
            {isOnb ? (
              pre ? (
                <span>Proposta / formulário: {pre}</span>
              ) : (
                <span className="text-amber-800/90">Ainda sem envio do formulário</span>
              )
            ) : isPlr ? (
              pre ? (
                <span>Formulário enviado: {pre}</span>
              ) : (
                <span className="text-amber-800/90">Sem data de envio</span>
              )
            ) : (
              <>
                {pre ? <span>Pré: {pre}</span> : <span className="text-amber-700/90">Sem pré</span>}
                {diag ? <span>Diag.: {diag}</span> : null}
              </>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {!isOnb && !isPlr ? (
              <Link
                href={hrefConsultoria}
                className="inline-block text-xs font-semibold text-pink-700 hover:text-pink-900 hover:underline"
                onPointerDown={(e) => e.stopPropagation()}
              >
                Abrir ficha →
              </Link>
            ) : null}
            {isOnb ? (
              <Link
                href={hrefOnboarding}
                className="inline-block text-xs font-semibold text-teal-800 hover:text-teal-950 hover:underline"
                onPointerDown={(e) => e.stopPropagation()}
              >
                Ver onboarding →
              </Link>
            ) : null}
            {isPlr && item.proLideresConsultoria ? (
              <Link
                href="/admin/pro-lideres/consultoria"
                className="inline-block text-xs font-semibold text-indigo-800 hover:text-indigo-950 hover:underline"
                onPointerDown={(e) => e.stopPropagation()}
              >
                Consultoria Pro Líderes →
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function FunilColumnDrop({
  stage,
  label,
  description,
  border,
  headerBg,
  children,
  count,
}: {
  stage: EsteticaConsultFunnelStage
  label: string
  description: string
  border: string
  headerBg: string
  children: React.ReactNode
  count: number
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${stage}`,
    data: { funnelStage: stage },
  })
  return (
    <section
      ref={setNodeRef}
      className={`flex w-[min(100vw-2rem,17.5rem)] shrink-0 flex-col rounded-2xl border-2 bg-white/90 shadow-sm ${border} ${
        isOver ? 'ring-2 ring-pink-400 ring-offset-1' : ''
      }`}
    >
      <div className={`rounded-t-2xl border-b px-3 py-2.5 ${border} ${headerBg}`}>
        <h3 className="text-sm font-bold text-gray-900">{label}</h3>
        <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{description}</p>
        <p className="text-[10px] font-medium text-gray-500 mt-1.5">{count} ficha(s)</p>
      </div>
      <div className="flex max-h-[min(58vh,32rem)] flex-1 flex-col gap-2 overflow-y-auto p-2.5">{children}</div>
    </section>
  )
}

function resolveVistaFromSearchParams(searchParams: URLSearchParams): EsteticaConsultFunilVista {
  const rawVista = searchParams.get('vista')?.trim().toLowerCase() ?? ''
  if (isEsteticaConsultFunilVista(rawVista)) return rawVista
  const legacySeg = searchParams.get('segmento')?.trim().toLowerCase() ?? ''
  const legacyLinha = searchParams.get('linha')?.trim().toLowerCase() ?? ''
  if (legacySeg === 'capilar' || legacyLinha === 'capilar') return 'capilar'
  if (legacySeg === 'corporal' || legacyLinha === 'corporal') return 'corporal'
  return 'corporal'
}

export default function EsteticaConsultoriaFunilBoard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vista = resolveVistaFromSearchParams(searchParams)

  const [columns, setColumns] = useState<FunilColumnApi[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [activeItem, setActiveItem] = useState<FichaPipelineItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const load = useCallback(async () => {
    setLoading(true)
    setErr(null)
    try {
      const res = await fetch(`/api/admin/estetica-consultoria/funil?vista=${encodeURIComponent(vista)}`, {
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErr((data as { error?: string }).error || 'Erro ao carregar funil.')
        setColumns([])
        return
      }
      setColumns((data as { columns?: FunilColumnApi[] }).columns ?? [])
    } finally {
      setLoading(false)
    }
  }, [vista])

  useEffect(() => {
    void load()
  }, [load])

  const setVista = (next: EsteticaConsultFunilVista) => {
    router.push(`/admin/estetica-consultoria/funil?vista=${encodeURIComponent(next)}`)
  }

  const findItemByClientId = useCallback(
    (clientId: string): { item: FichaPipelineItem; fromStage: EsteticaConsultFunnelStage } | null => {
      for (const col of columns) {
        const hit = col.items.find((i) => i.client.id === clientId)
        if (hit) return { item: hit, fromStage: col.key }
      }
      return null
    },
    [columns]
  )

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id)
    if (!id.startsWith('ficha-')) return
    const clientId = id.slice('ficha-'.length)
    const found = findItemByClientId(clientId)
    setActiveItem(found?.item ?? null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveItem(null)
    const { active, over } = event
    if (!over) return
    const targetStage = over.data.current?.funnelStage as EsteticaConsultFunnelStage | undefined
    if (!targetStage) return

    const activeId = String(active.id)
    if (!activeId.startsWith('ficha-')) return
    const clientId = activeId.slice('ficha-'.length)

    const found = findItemByClientId(clientId)
    if (!found || found.fromStage === targetStage) return

    const prevColumns = columns
    setColumns((cols) =>
      cols.map((c) => {
        if (c.key === found.fromStage) {
          return { ...c, items: c.items.filter((i) => i.client.id !== clientId) }
        }
        if (c.key === targetStage) {
          const client: YladaEsteticaConsultClientRow = {
            ...found.item.client,
            funnel_stage: targetStage,
          }
          const moved: FichaPipelineItem = { ...found.item, client }
          return { ...c, items: [moved, ...c.items] }
        }
        return c
      })
    )

    try {
      const isOnb = found.item.funilCardSource === 'leader_onboarding'
      const isPlr = found.item.funilCardSource === 'pro_lideres_consultoria'
      const plMeta = found.item.proLideresConsultoria
      const url = isOnb
        ? `/api/admin/pro-lideres/leader-onboarding/${encodeURIComponent(clientId)}`
        : isPlr && plMeta
          ? `/api/admin/pro-lideres/consultoria/materials/${encodeURIComponent(plMeta.materialId)}/responses/${encodeURIComponent(plMeta.responseId)}`
          : `/api/admin/estetica-consultoria/clients/${encodeURIComponent(clientId)}`
      const res = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funnel_stage: targetStage }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || 'PATCH falhou')
      }
    } catch {
      setColumns(prevColumns)
      setErr('Não foi possível mover esta ficha. Tenta outra vez.')
    }
  }

  const vistaLabel = useMemo(() => {
    switch (vista) {
      case 'todos':
        return 'Todas as fichas (capilar + corporal + ambos)'
      case 'lider':
        return 'Onboarding Pro Líderes (links) + fichas estética com tenant; colunas com nomes para este fluxo'
      case 'capilar':
        return 'Terapia capilar (+ segmento «ambos»)'
      default:
        return 'Estética corporal (+ segmento «ambos»)'
    }
  }, [vista])

  const consultoriaSegmentoDefault: FichasPipelineLinha =
    vista === 'capilar' ? 'capilar' : vista === 'corporal' ? 'corporal' : 'corporal'

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Funil — consultoria estética</h1>
          <p className="text-sm text-gray-600 max-w-2xl mt-1">
            Vista só para ti: arrasta cada ficha entre colunas para marcar onde estás no contacto (reunião, pagamento,
            espera da clínica, etc.). O conteúdo da ficha (pré, links, pagamento) não muda — isto é o teu controlo
            operacional.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            Atualizar
          </button>
          <Link
            href={`/admin/estetica-consultoria?segmento=${consultoriaSegmentoDefault}`}
            className="rounded-lg bg-pink-600 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-700"
          >
            Ir à consultoria
          </Link>
          {vista === 'lider' ? (
            <Link
              href="/admin/pro-lideres/onboarding"
              className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900 hover:bg-teal-100"
            >
              Onboarding Pro Líderes
            </Link>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtro do funil">
        {(
          [
            { key: 'todos' as const, label: 'Todos juntos' },
            { key: 'corporal' as const, label: 'Estética corporal' },
            { key: 'capilar' as const, label: 'Terapia capilar' },
            { key: 'lider' as const, label: 'Pro líder' },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={vista === key}
            onClick={() => setVista(key)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              vista === key
                ? 'bg-pink-600 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
            }`}
          >
            {label}
            {key === 'corporal' || key === 'capilar' ? (
              <span className="ml-1 text-[11px] opacity-80">(+ ambos)</span>
            ) : null}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Vista activa: <strong>{vistaLabel}</strong>. O estágio no funil é o mesmo registo em todas as vistas; em
        «Todos» vês o segmento no cartão.         Em «Pro líder» entram o onboarding (verde), as respostas do pré-diagnóstico estratégico na consultoria Pro
        Líderes (roxo) e fichas estética com tenant — o pré-diagnóstico enviado cai em «Pré-reunião feita · ficou de
        pagar».
      </p>

      {err ? (
        <p className="text-sm text-red-600" role="alert">
          {err}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-gray-500">A carregar funil…</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={(e) => void handleDragEnd(e)}
          onDragCancel={() => setActiveItem(null)}
        >
          <div className="overflow-x-auto pb-3">
            <div className="flex gap-3 min-w-max pr-2">
              {columns.map((col) => (
                <FunilColumnDrop
                  key={col.key}
                  stage={col.key}
                  label={col.label}
                  description={col.description}
                  border={col.border}
                  headerBg={col.headerBg}
                  count={col.items.length}
                >
                  {col.items.map((item) => (
                    <FunilCard
                      key={item.client.id}
                      item={item}
                      vista={vista}
                      segmentoLink={segmentoParamForConsultoriaLink(item.client, vista)}
                      dragId={`ficha-${item.client.id}`}
                    />
                  ))}
                  {col.items.length === 0 ? (
                    <p className="text-xs text-gray-400 py-6 text-center px-1">Arrasta fichas para aqui.</p>
                  ) : null}
                </FunilColumnDrop>
              ))}
            </div>
          </div>
          <DragOverlay dropAnimation={null}>
            {activeItem ? (
              <div className="w-[min(100vw-2rem,17rem)] rounded-xl border-2 border-pink-300 bg-white p-3 shadow-lg opacity-95">
                <p className="font-semibold text-gray-900 text-sm">{activeItem.client.business_name}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}
