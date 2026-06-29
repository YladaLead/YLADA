import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isPortaUnicaEnabled } from '@/lib/porta-unica/porta-unica-flag'
import PortaUnica from '@/components/porta-unica/PortaUnica'

/**
 * Porta única de entrada (telas 1-2). Atrás da flag PORTA_UNICA_ENABLED:
 * com OFF a rota dá notFound() (inerte). Captura o desafio e leva pro cadastro
 * existente preservando o ?ref. A devolutiva que reage entra depois (lane do Noel).
 * @see blueprint-plataforma/Porta_Unica_Entrada_Regua.md
 */
export const metadata: Metadata = { title: 'YLADA' }

export default function DescubraPage() {
  if (!isPortaUnicaEnabled()) notFound()
  return <PortaUnica />
}
