'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function MedDiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Médicos">
      <DiagnosticoConversaHistorico areaCodigo="med" areaLabel="Médicos" />
    </YladaAreaShell>
  )
}
