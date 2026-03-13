'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function CoachDiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="coach" areaLabel="Coach">
      <DiagnosticoConversaHistorico areaCodigo="coach" areaLabel="Coach" />
    </YladaAreaShell>
  )
}
