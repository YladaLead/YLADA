'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function NutraDiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="nutra" areaLabel="Nutra">
      <DiagnosticoClienteMetricas areaCodigo="nutra" areaLabel="Nutra" />
    </YladaAreaShell>
  )
}
