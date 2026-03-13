'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function EsteticaCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="estetica" areaLabel="Estética">
      <SistemaCrescimentoContent areaCodigo="estetica" areaLabel="Estética" />
    </YladaAreaShell>
  )
}
