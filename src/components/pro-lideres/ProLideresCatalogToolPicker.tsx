'use client'

import { useMemo, useState } from 'react'

import type { ProLideresCatalogItem } from '@/lib/pro-lideres-catalog-build'

type Props = {
  catalog: ProLideresCatalogItem[]
  value: string
  onChange: (yladaLinkId: string) => void
  disabled?: boolean
  /** Tom visual do contorno (indigo = Noel, gray = formulário manual) */
  accent?: 'indigo' | 'gray'
}

/**
 * Seletor compacto: opcional fechado por defeito; busca filtra a lista sem dropdown gigante.
 */
export function ProLideresCatalogToolPicker({
  catalog,
  value,
  onChange,
  disabled,
  accent = 'gray',
}: Props) {
  const [filter, setFilter] = useState('')
  const border =
    accent === 'indigo' ? 'border-indigo-200 bg-indigo-50/40' : 'border-gray-200 bg-gray-50/60'

  const items = useMemo(() => {
    const withId = catalog.filter((c): c is ProLideresCatalogItem & { yladaLinkId: string } =>
      Boolean(c.yladaLinkId)
    )
    const q = filter.trim().toLowerCase()
    if (!q) return withId
    return withId.filter((c) => c.label.toLowerCase().includes(q))
  }, [catalog, filter])

  const selectedLabel = useMemo(() => {
    if (!value) return null
    const hit = catalog.find((c) => c.yladaLinkId === value)
    return hit?.label ?? 'Ferramenta selecionada'
  }, [catalog, value])

  return (
    <details className={`rounded-lg border ${border}`}>
      <summary className="cursor-pointer list-none px-3 py-2.5 text-sm text-gray-800 [&::-webkit-details-marker]:hidden">
        <span className="font-medium">
          Ferramenta <span className="font-normal text-gray-500">(opcional · pesquisa pelo nome)</span>
        </span>
        {selectedLabel ? (
          <span className="mt-1 block truncate text-xs text-gray-600">
            Selecionada: <span className="font-semibold text-gray-800">{selectedLabel}</span>
          </span>
        ) : (
          <span className="mt-0.5 block text-xs text-gray-500">Sem ferramenta — abre só se quiser ligar uma</span>
        )}
      </summary>
      <div className="space-y-2 border-t border-gray-200/80 px-3 pb-3 pt-2">
        <input
          type="search"
          inputMode="search"
          placeholder="Procurar no catálogo…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          disabled={disabled}
          className="w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="max-h-32 overflow-y-auto rounded-md border border-gray-100 bg-white shadow-inner">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange('')}
            className={`flex w-full items-center px-2 py-2 text-left text-sm ${
              !value ? 'bg-blue-50 font-semibold text-blue-900' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Nenhuma
          </button>
          {items.map((c) => (
            <button
              key={c.yladaLinkId}
              type="button"
              disabled={disabled}
              onClick={() => onChange(c.yladaLinkId)}
              className={`flex w-full items-center px-2 py-2 text-left text-sm ${
                value === c.yladaLinkId ? 'bg-blue-50 font-semibold text-blue-900' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="line-clamp-2">{c.label}</span>
            </button>
          ))}
        </div>
        {items.length === 0 ? (
          <p className="text-xs text-gray-500">Nenhum resultado. Ajusta a pesquisa.</p>
        ) : null}
      </div>
    </details>
  )
}
