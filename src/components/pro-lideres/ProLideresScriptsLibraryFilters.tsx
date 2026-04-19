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
  /** Mostrar filtro «com ferramenta YLADA no catálogo» (secções com link). */
  showYladaLinkFilter?: boolean
}

export function ProLideresScriptsLibraryFilters({
  value,
  onChange,
  disabled,
  showYladaLinkFilter,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50/80 p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <label className="block min-w-[140px] flex-1 text-sm">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Foco</span>
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
          <option value="todos">Todos</option>
          {PL_SCRIPT_SECTION_FOCUS_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block min-w-[160px] flex-1 text-sm">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Intenção</span>
        <select
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900"
          disabled={disabled}
          value={value.intention}
          onChange={(e) => onChange({ ...value, intention: e.target.value })}
        >
          <option value="todos">Todas</option>
          {PL_SCRIPT_SECTION_INTENTION_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block min-w-[180px] flex-1 text-sm">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Ferramenta</span>
        <select
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900"
          disabled={disabled}
          value={value.tool}
          onChange={(e) => onChange({ ...value, tool: e.target.value })}
        >
          <option value="todos">Todas</option>
          {showYladaLinkFilter ? (
            <option value="__ylada__">Com link no catálogo YLADA</option>
          ) : null}
          {ALL_SCRIPT_TOOL_ROWS.filter((r) => r.id !== 'outra').map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block min-w-[200px] flex-1 text-sm">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Momento</span>
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
          <option value="todos">Todos</option>
          {PL_SCRIPT_CONVERSATION_STAGE_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
