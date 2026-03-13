'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function DiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <DiagnosticoProfissionalQuiz areaCodigo="ylada" areaLabel="YLADA" />
    </YladaAreaShell>
  )
}
