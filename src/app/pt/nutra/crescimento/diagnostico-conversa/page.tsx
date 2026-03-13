'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function NutraDiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="nutra" areaLabel="Nutra">
      <DiagnosticoConversaHistorico areaCodigo="nutra" areaLabel="Nutra" />
    </YladaAreaShell>
  )
}
