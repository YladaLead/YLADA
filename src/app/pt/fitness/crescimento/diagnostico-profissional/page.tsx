'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function FitnessDiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="fitness" areaLabel="Fitness">
      <DiagnosticoProfissionalQuiz areaCodigo="fitness" areaLabel="Fitness" />
    </YladaAreaShell>
  )
}
