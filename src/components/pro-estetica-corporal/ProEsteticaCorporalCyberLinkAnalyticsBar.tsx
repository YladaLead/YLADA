'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { PRO_ESTETICA_CORPORAL_BASE_PATH } from '@/config/pro-estetica-corporal-menu'

const LINKS_HUB = `${PRO_ESTETICA_CORPORAL_BASE_PATH}/biblioteca-links?tab=meus`

type Summary = {
  links_active: number
  link_opens: number
  whatsapp_clicks: number
}

export default function ProEsteticaCorporalCyberLinkAnalyticsBar({
  previewWithoutLogin,
}: {
  previewWithoutLogin?: boolean
}) {
  const [data, setData] = useState<Summary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!previewWithoutLogin)

  const load = useCallback(async () => {
    if (previewWithoutLogin) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-estetica-corporal/links-analytics-summary', {
        credentials: 'include',
        cache: 'no-store',
      })
      const json = (await res.json()) as { success?: boolean; data?: Summary; error?: string }
      if (!res.ok || !json.success || !json.data) {
        setError(typeof json.error === 'string' ? json.error : 'Indisponível')
        setData(null)
        return
      }
      setData(json.data)
    } catch {
      setError('Indisponível')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [previewWithoutLogin])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (previewWithoutLogin) return
    const onFocus = () => void load()
    window.addEventListener('focus', onFocus)
    const id = window.setInterval(() => void load(), 120_000)
    return () => {
      window.removeEventListener('focus', onFocus)
      window.clearInterval(id)
    }
  }, [load, previewWithoutLogin])

  if (previewWithoutLogin) {
    return (
      <div
        className="border-b border-violet-300/40 bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 px-3 py-2 text-center text-[11px] text-violet-200 sm:px-4 sm:text-xs"
        role="status"
      >
        Inicia sessão para veres aqui a análise dos teus links (aberturas e WhatsApp).
      </div>
    )
  }

  const kpi = (label: string, value: number | string, hint: string) => (
    <div
      className="flex min-w-0 flex-1 flex-col rounded-md border border-white/10 bg-white/5 px-2 py-1.5 sm:px-3 sm:py-2"
      title={hint}
    >
      <span className="truncate text-[10px] font-medium uppercase tracking-wide text-violet-300/90 sm:text-[11px]">
        {label}
      </span>
      <span className="text-base font-semibold tabular-nums text-white sm:text-lg">{value}</span>
    </div>
  )

  return (
    <div className="border-b border-violet-400/30 bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 px-3 py-2 sm:px-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="shrink-0 rounded border border-cyan-400/40 bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-200 sm:text-[10px]"
            aria-hidden
          >
            Links
          </span>
          <p className="min-w-0 text-[11px] font-medium leading-snug text-violet-100 sm:text-xs">
            <span className="hidden sm:inline">Análise rápida — </span>
            totais de todos os teus links YLADA nesta conta.
          </p>
        </div>
        {error ? (
          <p className="text-center text-[11px] text-rose-300 sm:text-left sm:text-xs">{error}</p>
        ) : loading && !data ? (
          <p className="w-full text-center text-[11px] text-violet-200 sm:text-left sm:text-xs">A carregar métricas…</p>
        ) : (
          <div className="flex w-full flex-wrap gap-2 sm:max-w-xl sm:flex-nowrap sm:justify-end">
            {kpi('Links ativos', data?.links_active ?? 0, 'Fluxos com link ligado (estado ativo).')}
            {kpi('Cliques no link', data?.link_opens ?? 0, 'Vezes que alguém abriu o link (página do fluxo).')}
            {kpi('WhatsApp', data?.whatsapp_clicks ?? 0, 'Cliques no botão para falar contigo no WhatsApp.')}
          </div>
        )}
        <Link
          href={LINKS_HUB}
          className="shrink-0 self-center rounded-lg border border-violet-400/50 px-2.5 py-1 text-center text-[11px] font-semibold text-violet-100 transition-colors hover:border-cyan-300/60 hover:bg-white/5 hover:text-white sm:self-auto sm:text-xs"
        >
          Ver links
        </Link>
      </div>
    </div>
  )
}
