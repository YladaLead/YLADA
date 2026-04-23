'use client'

import type { ProLideresConsultoriaMaterialKind } from '@/lib/pro-lideres-consultoria'

export function ConsultoriaKindEditor({
  kind,
  content,
  onChange,
}: {
  kind: ProLideresConsultoriaMaterialKind
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  if (kind === 'roteiro') {
    const steps = Array.isArray(content.steps) ? [...content.steps] : []
    return (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Define o passo a passo da consultoria. Em “Modo consultoria” vês só isto.</p>
        {steps.map((raw, i) => {
          const s = (raw && typeof raw === 'object' ? raw : {}) as {
            title?: string
            detail?: string
            links?: { label: string; url: string }[]
          }
          const links = Array.isArray(s.links) ? s.links : []
          return (
            <div key={i} className="rounded-xl border border-gray-200 p-3 space-y-2">
              <div className="flex justify-between gap-2">
                <span className="text-xs font-semibold text-gray-500">Passo {i + 1}</span>
                <button
                  type="button"
                  className="text-xs text-red-700 hover:underline"
                  onClick={() => {
                    const next = steps.filter((_, j) => j !== i)
                    onChange({ ...content, steps: next })
                  }}
                >
                  Remover
                </button>
              </div>
              <input
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                placeholder="Título do passo"
                value={s.title ?? ''}
                onChange={(e) => {
                  const next = [...steps]
                  next[i] = { ...s, title: e.target.value }
                  onChange({ ...content, steps: next })
                }}
              />
              <textarea
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm min-h-[80px]"
                placeholder="O que dizes / observas neste passo"
                value={s.detail ?? ''}
                onChange={(e) => {
                  const next = [...steps]
                  next[i] = { ...s, detail: e.target.value, links }
                  onChange({ ...content, steps: next })
                }}
              />
              <p className="text-xs text-gray-500">Links (rótulo e URL)</p>
              {links.map((l, li) => (
                <div key={li} className="flex gap-2">
                  <input
                    className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
                    placeholder="Texto do link"
                    value={l.label}
                    onChange={(e) => {
                      const nextL = links.map((x, j) => (j === li ? { ...x, label: e.target.value } : x))
                      const next = [...steps]
                      next[i] = { ...s, links: nextL }
                      onChange({ ...content, steps: next })
                    }}
                  />
                  <input
                    className="flex-[2] rounded border border-gray-300 px-2 py-1 text-xs"
                    placeholder="https://…"
                    value={l.url}
                    onChange={(e) => {
                      const nextL = links.map((x, j) => (j === li ? { ...x, url: e.target.value } : x))
                      const next = [...steps]
                      next[i] = { ...s, links: nextL }
                      onChange({ ...content, steps: next })
                    }}
                  />
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => {
                      const nextL = links.filter((_, j) => j !== li)
                      const next = [...steps]
                      next[i] = { ...s, links: nextL }
                      onChange({ ...content, steps: next })
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-xs font-medium text-blue-700 hover:underline"
                onClick={() => {
                  const nextL = [...links, { label: '', url: '' }]
                  const next = [...steps]
                  next[i] = { ...s, links: nextL }
                  onChange({ ...content, steps: next })
                }}
              >
                + Link
              </button>
            </div>
          )
        })}
        <button
          type="button"
          className="text-sm font-medium text-emerald-700 hover:underline"
          onClick={() => onChange({ ...content, steps: [...steps, { title: '', detail: '', links: [] }] })}
        >
          + Adicionar passo
        </button>
      </div>
    )
  }

  if (kind === 'formulario') {
    const fields = Array.isArray(content.fields) ? [...content.fields] : []
    return (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">
          Cada campo tem um identificador técnico (id) usado nas respostas. Depois de publicar, gera links no separador
          Links.
        </p>
        {fields.map((raw, i) => {
          const f = (raw && typeof raw === 'object' ? raw : {}) as {
            id?: string
            label?: string
            type?: string
            required?: boolean
            options?: string[]
          }
          return (
            <div key={i} className="rounded-xl border border-gray-200 p-3 grid gap-2 sm:grid-cols-2">
              <input
                className="rounded border border-gray-300 px-2 py-1.5 text-sm"
                placeholder="id (ex.: faturacao_media)"
                value={f.id ?? ''}
                onChange={(e) => {
                  const next = [...fields]
                  next[i] = { ...f, id: e.target.value }
                  onChange({ ...content, fields: next })
                }}
              />
              <input
                className="rounded border border-gray-300 px-2 py-1.5 text-sm"
                placeholder="Pergunta / rótulo"
                value={f.label ?? ''}
                onChange={(e) => {
                  const next = [...fields]
                  next[i] = { ...f, label: e.target.value }
                  onChange({ ...content, fields: next })
                }}
              />
              <select
                className="rounded border border-gray-300 px-2 py-1.5 text-sm"
                value={
                  f.type === 'textarea'
                    ? 'textarea'
                    : f.type === 'select'
                      ? 'select'
                      : f.type === 'checkbox_group'
                        ? 'checkbox_group'
                        : 'text'
                }
                onChange={(e) => {
                  const next = [...fields]
                  next[i] = { ...f, type: e.target.value }
                  onChange({ ...content, fields: next })
                }}
              >
                <option value="text">Texto curto</option>
                <option value="textarea">Texto longo</option>
                <option value="select">Escolha (lista)</option>
                <option value="checkbox_group">Várias escolhas (checklist)</option>
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(f.required)}
                  onChange={(e) => {
                    const next = [...fields]
                    next[i] = { ...f, required: e.target.checked }
                    onChange({ ...content, fields: next })
                  }}
                />
                Obrigatório
              </label>
              {f.type === 'select' || f.type === 'checkbox_group' ? (
                <textarea
                  className="sm:col-span-2 rounded border border-gray-300 px-2 py-1.5 text-sm min-h-[64px]"
                  placeholder="Opções (uma por linha)"
                  value={(f.options ?? []).join('\n')}
                  onChange={(e) => {
                    const opts = e.target.value
                      .split('\n')
                      .map((x) => x.trim())
                      .filter(Boolean)
                    const next = [...fields]
                    next[i] = { ...f, options: opts }
                    onChange({ ...content, fields: next })
                  }}
                />
              ) : null}
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="button"
                  className="text-xs text-red-700 hover:underline"
                  onClick={() => onChange({ ...content, fields: fields.filter((_, j) => j !== i) })}
                >
                  Remover campo
                </button>
              </div>
            </div>
          )
        })}
        <button
          type="button"
          className="text-sm font-medium text-emerald-700 hover:underline"
          onClick={() =>
            onChange({
              ...content,
              fields: [...fields, { id: `campo_${fields.length + 1}`, label: '', type: 'text', required: false }],
            })
          }
        >
          + Campo
        </button>
      </div>
    )
  }

  if (kind === 'checklist') {
    const items = Array.isArray(content.items) ? [...content.items] : []
    return (
      <div className="space-y-2">
        {items.map((raw, i) => {
          const it = (raw && typeof raw === 'object' ? raw : {}) as { text?: string }
          return (
            <div key={i} className="flex gap-2">
              <input
                className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
                value={it.text ?? ''}
                onChange={(e) => {
                  const next = [...items]
                  next[i] = { text: e.target.value }
                  onChange({ ...content, items: next })
                }}
              />
              <button
                type="button"
                className="text-xs text-red-600 px-1"
                onClick={() => onChange({ ...content, items: items.filter((_, j) => j !== i) })}
              >
                ✕
              </button>
            </div>
          )
        })}
        <button
          type="button"
          className="text-sm font-medium text-emerald-700 hover:underline"
          onClick={() => onChange({ ...content, items: [...items, { text: '' }] })}
        >
          + Item
        </button>
      </div>
    )
  }

  if (kind === 'dicas') {
    const tips = Array.isArray(content.tips) ? content.tips.map(String) : []
    return (
      <label className="block text-sm">
        <span className="text-gray-600">Uma dica por linha</span>
        <textarea
          className="mt-1 w-full min-h-[160px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
          value={tips.join('\n')}
          onChange={(e) =>
            onChange({
              ...content,
              tips: e.target.value
                .split('\n')
                .map((x) => x.trim())
                .filter(Boolean),
            })
          }
        />
      </label>
    )
  }

  if (kind === 'documento') {
    return (
      <label className="block text-sm">
        <span className="text-gray-600">Markdown</span>
        <textarea
          className="mt-1 w-full min-h-[220px] rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
          value={String(content.markdown ?? '')}
          onChange={(e) => onChange({ ...content, markdown: e.target.value })}
        />
      </label>
    )
  }

  return null
}
