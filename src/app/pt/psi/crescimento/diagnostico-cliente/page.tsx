'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function PsiDiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="psi" areaLabel="Psicologia">
      <DiagnosticoClienteMetricas areaCodigo="psi" areaLabel="Psicologia" />
    </YladaAreaShell>
  )
}
