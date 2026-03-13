'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function DiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <DiagnosticoClienteMetricas areaCodigo="ylada" areaLabel="YLADA" />
    </YladaAreaShell>
  )
}
