'use client'

import Link from 'next/link'
import {
  buildProLideresLandingHref,
  type ProLideresResetLandingSource,
} from '@/lib/pro-lideres-reset-content'

type Props = {
  source: ProLideresResetLandingSource
}

export default function ProLideresResetYladaFooter({ source }: Props) {
  return (
    <footer className="pl-reset-ylada-footer" role="contentinfo" aria-label="Ylada Pro Líderes">
      <p className="pl-reset-ylada-footer__label">Página criada com</p>
      <Link href={buildProLideresLandingHref(source)} className="pl-reset-ylada-footer__link">
        www.ylada.com/pro-lideres
      </Link>
    </footer>
  )
}
