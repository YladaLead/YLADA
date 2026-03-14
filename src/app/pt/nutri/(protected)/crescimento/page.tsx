'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function NutriCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="nutri" areaLabel="Nutri">
      <SistemaCrescimentoContent areaCodigo="nutri" areaLabel="Nutri" />
    </YladaAreaShell>
  )
}
