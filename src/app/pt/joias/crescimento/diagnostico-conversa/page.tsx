'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function JoiasDiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="joias" areaLabel="Joias e bijuterias">
      <DiagnosticoConversaHistorico areaCodigo="joias" areaLabel="Joias e bijuterias" />
    </YladaAreaShell>
  )
}
