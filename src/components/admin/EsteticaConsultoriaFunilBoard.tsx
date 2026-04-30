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
import type { FichaPipelineItem, FichasPipelineLinha } from '@/lib/estetica-consultoria-fichas-pipeline'
import type { EsteticaConsultFunnelStage } from '@/lib/estetica-consultoria-funnel'
import type { YladaEsteticaConsultClientRow } from '@/lib/estetica-consultoria'

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
  linha,
  dragId,
}: {
  item: FichaPipelineItem
  linha: FichasPipelineLinha
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
  const href = `/admin/estetica-consultoria?segmento=${linha}&cliente=${encodeURIComponent(item.client.id)}`
  const pre = formatShort(item.ultimoPreAt)
  const diag = formatShort(item.ultimoDiagnosticoAt)

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
          <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-gray-500">
            {pre ? <span>Pré: {pre}</span> : <span className="text-amber-700/90">Sem pré</span>}
            {diag ? <span>Diag.: {diag}</span> : null}
          </div>
          <Link
            href={href}
            className="mt-2 inline-block text-xs font-semibold text-pink-700 hover:text-pink-900 hover:underline"
            onPointerDown={(e) => e.stopPropagation()}
          >
            Abrir ficha →
          </Link>
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

export default function EsteticaConsultoriaFunilBoard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawSeg = searchParams.get('segmento')?.trim().toLowerCase() ?? ''
  const linha: FichasPipelineLinha = rawSeg === 'capilar' ? 'capilar' : 'corporal'

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
      const res = await fetch(`/api/admin/estetica-consultoria/funil?linha=${linha}`, { credentials: 'include' })
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
  }, [linha])

  useEffect(() => {
    void load()
  }, [load])

  const setSegmento = (next: FichasPipelineLinha) => {
    const p = new URLSearchParams(searchParams.toString())
    p.set('segmento', next)
    router.push(`/admin/estetica-consultoria/funil?${p.toString()}`)
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
      const res = await fetch(`/api/admin/estetica-consultoria/clients/${encodeURIComponent(clientId)}`, {
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

  const labelLinha = useMemo(() => (linha === 'capilar' ? 'Terapia capilar' : 'Estética corporal'), [linha])

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
            href={`/admin/estetica-consultoria?segmento=${linha}`}
            className="rounded-lg bg-pink-600 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-700"
          >
            Ir à consultoria
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Linha de negócio">
        {(['corporal', 'capilar'] as const).map((seg) => (
          <button
            key={seg}
            type="button"
            role="tab"
            aria-selected={linha === seg}
            onClick={() => setSegmento(seg)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              linha === seg ? 'bg-pink-600 text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
            }`}
          >
            {seg === 'corporal' ? 'Estética corporal' : 'Terapia capilar'}
            <span className="ml-1 text-[11px] opacity-80">(+ ambos)</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Linha activa: <strong>{labelLinha}</strong> — fichas com segmento «ambos» aparecem nas duas vistas (mesmo
        registo; ao moveres num quadro, o estágio actualiza-se para as duas).
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
                      linha={linha}
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
