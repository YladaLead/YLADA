'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function CoachDiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="coach" areaLabel="Coach">
      <DiagnosticoClienteMetricas areaCodigo="coach" areaLabel="Coach" />
    </YladaAreaShell>
  )
}
