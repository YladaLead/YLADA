'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function NutriDiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="nutri" areaLabel="Nutri">
      <DiagnosticoConversaHistorico areaCodigo="nutri" areaLabel="Nutri" />
    </YladaAreaShell>
  )
}
