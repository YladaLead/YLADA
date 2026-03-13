'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function MedDiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Médicos">
      <DiagnosticoClienteMetricas areaCodigo="med" areaLabel="Médicos" />
    </YladaAreaShell>
  )
}
