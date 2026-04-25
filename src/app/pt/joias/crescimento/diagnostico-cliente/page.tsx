'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function JoiasDiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="joias" areaLabel="Joias e bijuterias">
      <DiagnosticoClienteMetricas areaCodigo="joias" areaLabel="Joias e bijuterias" />
    </YladaAreaShell>
  )
}
