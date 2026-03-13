'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function OdontoDiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="odonto" areaLabel="Odontologia">
      <DiagnosticoProfissionalQuiz areaCodigo="odonto" areaLabel="Odontologia" />
    </YladaAreaShell>
  )
}
