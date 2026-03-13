'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function OdontoCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="odonto" areaLabel="Odontologia">
      <SistemaCrescimentoContent areaCodigo="odonto" areaLabel="Odontologia" />
    </YladaAreaShell>
  )
}
