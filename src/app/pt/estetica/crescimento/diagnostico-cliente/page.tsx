'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function EsteticaDiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="estetica" areaLabel="Estética">
      <DiagnosticoClienteMetricas areaCodigo="estetica" areaLabel="Estética" />
    </YladaAreaShell>
  )
}
