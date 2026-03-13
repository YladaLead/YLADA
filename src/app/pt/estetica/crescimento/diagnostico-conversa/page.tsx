'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function EsteticaDiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="estetica" areaLabel="Estética">
      <DiagnosticoConversaHistorico areaCodigo="estetica" areaLabel="Estética" />
    </YladaAreaShell>
  )
}
