'use client'

import NutraOfertaContent from '@/components/nutra/NutraOfertaContent'

/**
 * Página oficial de oferta Nutra — pt.
 * Fluxo: Landing → /pt/nutra/oferta → Checkout.
 */
export default function NutraOfertaPage() {
  return <NutraOfertaContent locale="pt" basePath="/pt/nutra" />
}
