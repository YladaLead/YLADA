'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function MedDiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Médicos">
      <DiagnosticoProfissionalQuiz areaCodigo="med" areaLabel="Médicos" />
    </YladaAreaShell>
  )
}
