'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function NutraCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="nutra" areaLabel="Nutra">
      <SistemaCrescimentoContent areaCodigo="nutra" areaLabel="Nutra" />
    </YladaAreaShell>
  )
}
