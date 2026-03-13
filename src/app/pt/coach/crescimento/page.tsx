'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function CoachCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="coach" areaLabel="Coach">
      <SistemaCrescimentoContent areaCodigo="coach" areaLabel="Coach" />
    </YladaAreaShell>
  )
}
