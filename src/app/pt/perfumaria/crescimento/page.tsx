'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function PerfumariaCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="perfumaria" areaLabel="Perfumaria">
      <SistemaCrescimentoContent areaCodigo="perfumaria" areaLabel="Perfumaria" />
    </YladaAreaShell>
  )
}
