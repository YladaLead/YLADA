'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function PerfumariaDiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="perfumaria" areaLabel="Perfumaria">
      <DiagnosticoClienteMetricas areaCodigo="perfumaria" areaLabel="Perfumaria" />
    </YladaAreaShell>
  )
}
