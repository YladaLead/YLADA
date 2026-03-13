'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function PsicanaliseDiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="psicanalise" areaLabel="Psicanálise">
      <DiagnosticoProfissionalQuiz areaCodigo="psicanalise" areaLabel="Psicanálise" />
    </YladaAreaShell>
  )
}
