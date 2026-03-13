'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function PsicanaliseDiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="psicanalise" areaLabel="Psicanálise">
      <DiagnosticoConversaHistorico areaCodigo="psicanalise" areaLabel="Psicanálise" />
    </YladaAreaShell>
  )
}
