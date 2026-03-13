'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function DiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <DiagnosticoConversaHistorico areaCodigo="ylada" areaLabel="YLADA" />
    </YladaAreaShell>
  )
}
