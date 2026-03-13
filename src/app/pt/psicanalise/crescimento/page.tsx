'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function PsicanaliseCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="psicanalise" areaLabel="Psicanálise">
      <SistemaCrescimentoContent areaCodigo="psicanalise" areaLabel="Psicanálise" />
    </YladaAreaShell>
  )
}
