'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function NutraDiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="nutra" areaLabel="Nutra">
      <DiagnosticoProfissionalQuiz areaCodigo="nutra" areaLabel="Nutra" />
    </YladaAreaShell>
  )
}
