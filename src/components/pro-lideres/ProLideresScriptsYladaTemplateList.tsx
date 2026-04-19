'use client'

import type { ProLideresScriptTemplateRow } from '@/types/leader-tenant'
import {
  conversationStageLabel,
  focusLabel,
  intentionLabel,
  toolPresetLabelFromKey,
} from '@/lib/pro-lideres-script-section-meta'

type Props = {
  templates: ProLideresScriptTemplateRow[]
  loading: boolean
  saving: boolean
  /** Abre o passo de revisão (ver textos e autorizar visibilidade) antes de gravar. */
  onReview: (template: ProLideresScriptTemplateRow) => void
  onError: (msg: string | null) => void
}

export function ProLideresScriptsYladaTemplateList({ templates, loading, saving, onReview, onError }: Props) {
  if (loading) {
    return <p className="text-sm text-gray-600">Carregando modelos…</p>
  }
  if (templates.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-violet-200 bg-violet-50/40 px-4 py-8 text-center text-sm text-violet-950">
        Nenhum modelo com estes filtros. Tente «Todos» ou outro foco.
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
              {t.usage_hint?.trim() ? (
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  <span className="font-semibold text-gray-800">Quando usar: </span>
                  {t.usage_hint.trim()}
                </p>
              ) : null}
              {t.sequence_label?.trim() ? (
                <p className="mt-1 text-xs text-gray-500">
                  <span className="font-semibold text-gray-600">Sequência: </span>
                  {t.sequence_label.trim()}
                </p>
              ) : null}
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
                {conversationStageLabel(t.conversation_stage) ? (
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-900">
                    {conversationStageLabel(t.conversation_stage)}
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
                onReview(t)
              }}
              className="min-h-[44px] shrink-0 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              Usar e ajustar
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
