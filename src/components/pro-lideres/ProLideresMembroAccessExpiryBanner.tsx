import Link from 'next/link'

import type { ProLideresMemberAccessExpiryUi } from '@/lib/pro-lideres-team-access-expiry-ui'
import { proLideresMemberExpiryBannerMessage } from '@/lib/pro-lideres-team-access-expiry-ui'

const URGENCY_STYLES: Record<
  Exclude<ProLideresMemberAccessExpiryUi['urgency'], 'none'>,
  string
> = {
  info: 'border-slate-200 bg-slate-50 text-slate-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  urgent: 'border-orange-300 bg-orange-50 text-orange-950',
}

export function ProLideresMembroAccessExpiryBanner({
  ui,
  renewHref = '/pro-lideres/membro/renovar',
}: {
  ui: ProLideresMemberAccessExpiryUi
  renewHref?: string
}) {
  if (!ui.showBanner || ui.urgency === 'none') return null

  const message = proLideresMemberExpiryBannerMessage(ui)
  const style = URGENCY_STYLES[ui.urgency]

  return (
    <div
      className={`border-b px-3 py-2.5 text-center text-xs leading-relaxed sm:px-4 sm:text-sm ${style}`}
      role="status"
    >
      <span>{message}</span>
      {ui.showRenewCta ? (
        <>
          {' '}
          <Link href={renewHref} className="font-semibold underline underline-offset-2 hover:opacity-90">
            Renovar acesso
          </Link>
        </>
      ) : null}
    </div>
  )
}
