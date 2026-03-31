'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { trackFreemiumConversionEvent } from '@/lib/ylada-freemium-client'

/**
 * Modal quando o usuário Free atinge o limite de diagnósticos ativos (freemium).
 * @see FREEMIUM_LIMITS.FREE_LIMIT_ACTIVE_LINKS
 */
export function ActiveLinksProModal({
  open,
  onClose,
  message,
}: {
  open: boolean
  onClose: () => void
  message: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    try {
      const k = 'ylada_paywall_view_active_link_modal_v1'
      if (sessionStorage.getItem(k)) return
      sessionStorage.setItem(k, '1')
      trackFreemiumConversionEvent('freemium_paywall_view', { surface: 'active_links_modal', kind: 'active_link' })
    } catch {
      trackFreemiumConversionEvent('freemium_paywall_view', { surface: 'active_links_modal', kind: 'active_link' })
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="active-links-pro-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Fechar"
      />
      <div className="relative z-10 max-w-md w-full rounded-2xl border-2 border-amber-200 bg-white p-6 shadow-xl">
        <h2 id="active-links-pro-modal-title" className="text-lg font-bold text-gray-900">
          Limite do plano gratuito
        </h2>
        <p className="mt-1 text-sm font-medium text-amber-900">
          O link não foi criado: no plano gratuito você pode manter <strong>1 diagnóstico ativo por vez</strong>.
          Isso não é &quot;um link por mês&quot; — é um diagnóstico no ar ao mesmo tempo. Para criar outro, pause ou
          arquive um na página Links ou assine o Pro.
        </p>
        {message.trim() ? (
          <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap border-t border-amber-100 pt-3">
            {message.trim()}
          </p>
        ) : null}
        <p className="mt-3 text-sm text-gray-600">
          Com o <strong>Plano Pro</strong> você cria vários diagnósticos ativos, contatos ilimitados no WhatsApp
          por mês e análises completas do Noel.
        </p>
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Agora não
          </button>
          <Link
            href="/pt/precos"
            onClick={() =>
              trackFreemiumConversionEvent('freemium_upgrade_cta_click', {
                surface: 'active_links_modal',
                kind: 'active_link',
              })
            }
            className="inline-flex justify-center items-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 text-center"
          >
            Assinar Plano Pro
          </Link>
        </div>
      </div>
    </div>
  )
}
