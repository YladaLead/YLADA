'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function MedCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Médicos">
      <SistemaCrescimentoContent areaCodigo="med" areaLabel="Médicos" />
    </YladaAreaShell>
  )
}
