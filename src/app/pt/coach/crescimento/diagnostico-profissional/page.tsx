'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function CoachDiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="coach" areaLabel="Coach">
      <DiagnosticoProfissionalQuiz areaCodigo="coach" areaLabel="Coach" />
    </YladaAreaShell>
  )
}
