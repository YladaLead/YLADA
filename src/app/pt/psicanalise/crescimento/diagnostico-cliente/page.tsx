'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function PsicanaliseDiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="psicanalise" areaLabel="Psicanálise">
      <DiagnosticoClienteMetricas areaCodigo="psicanalise" areaLabel="Psicanálise" />
    </YladaAreaShell>
  )
}
