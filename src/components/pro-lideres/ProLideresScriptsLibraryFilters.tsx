'use client'

import { ALL_SCRIPT_TOOL_ROWS } from '@/lib/pro-lideres-script-guided-briefing'
import {
  PL_SCRIPT_CONVERSATION_STAGE_OPTIONS,
  PL_SCRIPT_SECTION_FOCUS_OPTIONS,
  PL_SCRIPT_SECTION_INTENTION_OPTIONS,
  type ScriptLibraryFilters,
} from '@/lib/pro-lideres-script-section-meta'

type Props = {
  value: ScriptLibraryFilters
  onChange: (next: ScriptLibraryFilters) => void
  disabled?: boolean
  /** Mostrar filtro «com ferramenta ligada» (secções com \`ylada_link_id\`). */
  showYladaLinkFilter?: boolean
  /** Esconde o texto «ordem sugerida no campo» (vista equipe / UI mais compacta). */
  hideFieldOrderHint?: boolean
}

export function ProLideresScriptsLibraryFilters({
  value,
  onChange,
  disabled,
  showYladaLinkFilter,
  hideFieldOrderHint,
}: Props) {
  return (
    <div className="space-y-2">
      {!hideFieldOrderHint ? (
        <p className="text-xs font-medium text-gray-500">
          Ordem sugerida no campo: <span className="text-gray-700">situação</span> →{' '}
          <span className="text-gray-700">objetivo</span> → <span className="text-gray-700">ferramenta</span> →{' '}
          <span className="text-gray-700">linha</span> (vendas/recrutamento).
        </p>
      ) : null}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50/80 p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block min-w-[200px] flex-1 text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            1 · Situação
          </span>
          <span className="mb-1.5 block text-[11px] leading-snug text-gray-500">Momento da conversa</span>
          <select
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900"
            disabled={disabled}
            value={value.stage}
            onChange={(e) =>
              onChange({
                ...value,
                stage: e.target.value as ScriptLibraryFilters['stage'],
              })
            }
          >
            <option value="todos">Todas</option>
            {PL_SCRIPT_CONVERSATION_STAGE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-[160px] flex-1 text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            2 · Objetivo
          </span>
          <span className="mb-1.5 block text-[11px] leading-snug text-gray-500">O que quer fazer agora</span>
          <select
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900"
            disabled={disabled}
            value={value.intention}
            onChange={(e) => onChange({ ...value, intention: e.target.value })}
          >
            <option value="todos">Todos</option>
            {PL_SCRIPT_SECTION_INTENTION_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-[180px] flex-1 text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            3 · Ferramenta
          </span>
          <span className="mb-1.5 block text-[11px] leading-snug text-gray-500">Como executa (por último)</span>
          <select
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900"
            disabled={disabled}
            value={value.tool}
            onChange={(e) => onChange({ ...value, tool: e.target.value })}
          >
            <option value="todos">Todas</option>
            {showYladaLinkFilter ? (
              <option value="__ylada__">Com ferramenta ligada (painel)</option>
            ) : null}
            {ALL_SCRIPT_TOOL_ROWS.filter((r) => r.id !== 'outra').map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-[140px] flex-1 text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            4 · Linha
          </span>
          <span className="mb-1.5 block text-[11px] leading-snug text-gray-500">Canal do negócio</span>
          <select
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900"
            disabled={disabled}
            value={value.focus}
            onChange={(e) =>
              onChange({
                ...value,
                focus: e.target.value as ScriptLibraryFilters['focus'],
              })
            }
          >
            <option value="todos">Todas</option>
            {PL_SCRIPT_SECTION_FOCUS_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
