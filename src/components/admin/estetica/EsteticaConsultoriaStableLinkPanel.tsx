'use client'

import { pickPrimaryEsteticaShareLink } from '@/lib/estetica-consultoria-share-links'

export type EsteticaStablePanelLink = {
  id: string
  token: string
  created_at: string
  label?: string | null
  is_primary?: boolean | null
  responder_url?: string
}

type Props = {
  links: EsteticaStablePanelLink[]
  primaryHint: string
  /** Só aparece quando ainda não existe link principal (primeira geração). */
  generateFirstLabel: string
  generateLoading: boolean
  canGenerate: boolean
  onGenerateFirst: () => void
}

export function EsteticaConsultoriaStableLinkPanel({
  links,
  primaryHint,
  generateFirstLabel,
  generateLoading,
  canGenerate,
  onGenerateFirst,
}: Props) {
  const primary = pickPrimaryEsteticaShareLink(links)
  const extras = primary ? links.filter((l) => l.id !== primary.id) : []

  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-gradient-to-br from-slate-50/90 via-white to-white p-3 shadow-sm">
      <div>
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-gray-800">Link principal (estável)</h4>
        <p className="mt-1 text-xs leading-snug text-gray-600">{primaryHint}</p>
        {primary?.responder_url ? (
          <div className="mt-2 rounded-lg border border-gray-100 bg-white p-2">
            <code className="block break-all text-[11px] text-gray-800">{primary.responder_url}</code>
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(primary.responder_url ?? '')}
              className="mt-2 w-full rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800 sm:w-auto"
            >
              Copiar link principal
            </button>
          </div>
        ) : (
          <div className="mt-2 border-t border-gray-100 pt-2">
            <button
              type="button"
              disabled={generateLoading || !canGenerate}
              onClick={() => void onGenerateFirst()}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
            >
              {generateLoading ? 'A gerar…' : generateFirstLabel}
            </button>
          </div>
        )}
      </div>
      {extras.length > 0 ? (
        <details className="rounded-lg border border-gray-100 bg-white/90 p-2">
          <summary className="cursor-pointer text-[11px] font-semibold text-gray-800">
            Links antigos ({extras.length}) — ainda válidos se alguém os tiver guardados
          </summary>
          <ul className="mt-2 space-y-2">
            {extras.map((lk) => (
              <li key={lk.id} className="rounded border border-gray-100 bg-white p-2 text-[11px]">
                <code className="break-all text-gray-700">{lk.responder_url ?? lk.token}</code>
                {lk.label ? <p className="mt-0.5 text-[10px] text-gray-500">Nota: {lk.label}</p> : null}
                <button
                  type="button"
                  onClick={() => void navigator.clipboard.writeText(lk.responder_url ?? '')}
                  className="mt-1 text-[11px] font-medium text-blue-700 hover:underline"
                >
                  Copiar
                </button>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}
