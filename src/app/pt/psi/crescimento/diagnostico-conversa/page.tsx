'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function PsiDiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="psi" areaLabel="Psicologia">
      <DiagnosticoConversaHistorico areaCodigo="psi" areaLabel="Psicologia" />
    </YladaAreaShell>
  )
}
