'use client'

import { useMemo, type ReactNode } from 'react'
import {
  groupConsultoriaAnswerRowsBySection,
  type ConsultoriaAnswerRow,
} from '@/lib/consultoria-form-display'

export type ConsultoriaAdminResponseCardProps = {
  tone: 'rose' | 'gray' | 'sky'
  submittedAt: string
  respondentName?: string | null
  respondentEmail?: string | null
  respondentWhatsapp?: string | null
  rows: ConsultoriaAnswerRow[]
  rawAnswers: unknown
  /** Ações extra (ex.: eliminar ficha) — renderizado abaixo do JSON bruto. */
  footer?: ReactNode
}

export function ConsultoriaAdminResponseCard({
  tone,
  submittedAt,
  respondentName,
  respondentEmail,
  respondentWhatsapp,
  rows,
  rawAnswers,
  footer,
}: ConsultoriaAdminResponseCardProps) {
  const sections = useMemo(() => groupConsultoriaAnswerRowsBySection(rows), [rows])
  const shell =
    tone === 'rose'
      ? 'border-rose-200/90 bg-white shadow-sm'
      : tone === 'sky'
        ? 'border-sky-200/90 bg-white shadow-sm'
        : 'border-gray-200 bg-white shadow-sm'
  const accentBar = tone === 'rose' ? 'bg-rose-600' : tone === 'sky' ? 'bg-sky-600' : 'bg-gray-700'
  const blockTitle = tone === 'rose' ? 'text-rose-900/55' : tone === 'sky' ? 'text-sky-900/55' : 'text-gray-500'
  const qTone = tone === 'rose' ? 'text-rose-950/90' : tone === 'sky' ? 'text-sky-950/90' : 'text-gray-800'
  const aTone =
    tone === 'rose'
      ? 'border-rose-100/90 bg-rose-50/40 text-gray-900'
      : tone === 'sky'
        ? 'border-sky-100/90 bg-sky-50/40 text-gray-900'
        : 'border-gray-200/90 bg-gray-50 text-gray-900'

  return (
    <article className={`overflow-hidden rounded-xl border ${shell}`}>
      <div className={`h-1 w-full ${accentBar}`} aria-hidden />
      <div className="p-4">
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-black/[0.06] pb-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Envio</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(submittedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </p>
          </div>
          <div className="min-w-0 max-w-full text-right text-xs sm:max-w-[55%]">
            {respondentName ? <p className="font-semibold text-gray-900">{respondentName}</p> : null}
            {respondentEmail ? (
              <p className="break-all text-gray-600" title={respondentEmail ?? undefined}>
                {respondentEmail}
              </p>
            ) : null}
            {respondentWhatsapp?.trim() ? (
              <p className="mt-0.5 break-all text-gray-600" title={respondentWhatsapp}>
                {respondentWhatsapp.trim()}
              </p>
            ) : null}
          </div>
        </header>

        <div className="mt-4 space-y-6">
          {sections.map((sec, idx) => (
            <section key={`${sec.sectionKey}-${idx}`}>
              <h5 className={`mb-2.5 text-[11px] font-bold uppercase tracking-wider ${blockTitle}`}>
                {sec.sectionTitle}
              </h5>
              <dl className="space-y-3">
                {sec.rows.map((row) => (
                  <div
                    key={row.fieldId}
                    className="grid gap-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:items-start sm:gap-x-4"
                  >
                    <dt className={`text-xs font-semibold leading-snug sm:pt-1.5 ${qTone}`}>{row.label}</dt>
                    <dd
                      className={`rounded-lg border px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${aTone}`}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <details className="mt-4 border-t border-black/[0.06] pt-3">
          <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">JSON bruto (avançado)</summary>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-md bg-gray-900/[0.04] p-2.5 text-[11px] text-gray-600">
            {JSON.stringify(rawAnswers, null, 2)}
          </pre>
        </details>
        {footer ? <div className="mt-4 border-t border-black/[0.06] pt-4">{footer}</div> : null}
      </div>
    </article>
  )
}
