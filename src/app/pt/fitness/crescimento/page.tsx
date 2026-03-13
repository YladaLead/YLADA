'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function FitnessCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="fitness" areaLabel="Fitness">
      <SistemaCrescimentoContent areaCodigo="fitness" areaLabel="Fitness" />
    </YladaAreaShell>
  )
}
