'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function PerfumariaDiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="perfumaria" areaLabel="Perfumaria">
      <DiagnosticoProfissionalQuiz areaCodigo="perfumaria" areaLabel="Perfumaria" />
    </YladaAreaShell>
  )
}
