'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function NutriDiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="nutri" areaLabel="Nutri">
      <DiagnosticoProfissionalQuiz areaCodigo="nutri" areaLabel="Nutri" />
    </YladaAreaShell>
  )
}
