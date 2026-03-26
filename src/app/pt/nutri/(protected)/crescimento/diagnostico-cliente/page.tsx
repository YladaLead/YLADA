'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function NutriDiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="nutri" areaLabel="Nutri">
      <DiagnosticoClienteMetricas areaCodigo="nutri" areaLabel="Nutri" />
    </YladaAreaShell>
  )
}
