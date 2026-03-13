'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function PerfumariaDiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="perfumaria" areaLabel="Perfumaria">
      <DiagnosticoConversaHistorico areaCodigo="perfumaria" areaLabel="Perfumaria" />
    </YladaAreaShell>
  )
}
