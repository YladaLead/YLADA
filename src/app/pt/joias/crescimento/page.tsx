'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function JoiasCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="joias" areaLabel="Joias e bijuterias">
      <SistemaCrescimentoContent areaCodigo="joias" areaLabel="Joias e bijuterias" />
    </YladaAreaShell>
  )
}
