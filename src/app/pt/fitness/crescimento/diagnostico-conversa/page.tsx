'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function FitnessDiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="fitness" areaLabel="Fitness">
      <DiagnosticoConversaHistorico areaCodigo="fitness" areaLabel="Fitness" />
    </YladaAreaShell>
  )
}
