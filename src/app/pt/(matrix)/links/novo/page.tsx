'use client'

import { usePathname } from 'next/navigation'
import { NovoLinkPageContent, type AreaCodigo } from '@/components/ylada/NovoLinkPageContent'

function useAreaFromPath(): { areaCodigo: AreaCodigo; areaLabel: string } {
  const pathname = usePathname()
  if (!pathname) return { areaCodigo: 'ylada', areaLabel: 'YLADA' }
  const m = pathname.match(
    /^\/pt\/(med|psi|odonto|nutra|nutri|coach|psicanalise|perfumaria|seller|estetica|fitness|joias)\//
  )
  const area = m?.[1] ?? 'ylada'
  const labels: Record<string, string> = {
    med: 'Médicos',
    psi: 'Psicologia',
    odonto: 'Odontologia',
    nutra: 'Nutra',
    nutri: 'Nutri',
    coach: 'Coach',
    psicanalise: 'Psicanálise',
    perfumaria: 'Perfumaria',
    seller: 'Vendedores',
    estetica: 'Estética',
    fitness: 'Fitness',
    joias: 'Joias e bijuterias',
  }
  return {
    areaCodigo: area as AreaCodigo,
    areaLabel: labels[area] ?? 'YLADA',
  }
}

export default function NovoLinkPage() {
  const { areaCodigo, areaLabel } = useAreaFromPath()
  return <NovoLinkPageContent areaCodigo={areaCodigo} areaLabel={areaLabel} />
}
