'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function OdontoDiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="odonto" areaLabel="Odontologia">
      <DiagnosticoClienteMetricas areaCodigo="odonto" areaLabel="Odontologia" />
    </YladaAreaShell>
  )
}
