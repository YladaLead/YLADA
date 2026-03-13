'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function PsiDiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="psi" areaLabel="Psicologia">
      <DiagnosticoProfissionalQuiz areaCodigo="psi" areaLabel="Psicologia" />
    </YladaAreaShell>
  )
}
