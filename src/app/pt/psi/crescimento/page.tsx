'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function PsiCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="psi" areaLabel="Psicologia">
      <SistemaCrescimentoContent areaCodigo="psi" areaLabel="Psicologia" />
    </YladaAreaShell>
  )
}
