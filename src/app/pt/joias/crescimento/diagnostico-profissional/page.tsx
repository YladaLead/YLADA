'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function JoiasDiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="joias" areaLabel="Joias e bijuterias">
      <DiagnosticoProfissionalQuiz areaCodigo="joias" areaLabel="Joias e bijuterias" />
    </YladaAreaShell>
  )
}
