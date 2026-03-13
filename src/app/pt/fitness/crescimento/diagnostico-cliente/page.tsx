'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function FitnessDiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="fitness" areaLabel="Fitness">
      <DiagnosticoClienteMetricas areaCodigo="fitness" areaLabel="Fitness" />
    </YladaAreaShell>
  )
}
