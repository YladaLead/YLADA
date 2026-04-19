'use client'

import type { ProLideresScriptTemplateRow } from '@/types/leader-tenant'
import {
  focusLabel,
  intentionLabel,
  toolPresetLabelFromKey,
} from '@/lib/pro-lideres-script-section-meta'

type Props = {
  templates: ProLideresScriptTemplateRow[]
  loading: boolean
  saving: boolean
  onUse: (templateId: string) => Promise<void>
  onError: (msg: string | null) => void
}

export function ProLideresScriptsYladaTemplateList({ templates, loading, saving, onUse, onError }: Props) {
  if (loading) {
    return <p className="text-sm text-gray-600">A carregar modelos…</p>
  }
  if (templates.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-violet-200 bg-violet-50/40 px-4 py-8 text-center text-sm text-violet-950">
        Nenhum modelo com estes filtros. Experimente «Todos» ou outro foco.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {templates.map((t) => (
        <li
          key={t.id}
          className="rounded-2xl border border-violet-200/90 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Biblioteca YLADA</p>
              <h3 className="mt-1 text-base font-bold text-gray-900">{t.title}</h3>
              {t.subtitle?.trim() ? <p className="mt-0.5 text-sm text-gray-600">{t.subtitle}</p> : null}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800">
                  {focusLabel(t.focus_main)}
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-900">
                  {intentionLabel(t.intention_key)}
                </span>
                {t.tool_preset_key ? (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-950">
                    {toolPresetLabelFromKey(t.tool_preset_key) ?? t.tool_preset_key}
                  </span>
                ) : null}
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {t.entries.length} texto(s)
                </span>
              </div>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                onError(null)
                void onUse(t.id)
              }}
              className="min-h-[44px] shrink-0 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Usar na minha biblioteca
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
