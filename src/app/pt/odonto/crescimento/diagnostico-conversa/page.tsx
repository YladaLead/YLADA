'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function OdontoDiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="odonto" areaLabel="Odontologia">
      <DiagnosticoConversaHistorico areaCodigo="odonto" areaLabel="Odontologia" />
    </YladaAreaShell>
  )
}
