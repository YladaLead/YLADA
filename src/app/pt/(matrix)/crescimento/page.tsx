'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function SistemaCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <SistemaCrescimentoContent areaCodigo="ylada" areaLabel="YLADA" />
    </YladaAreaShell>
  )
}
