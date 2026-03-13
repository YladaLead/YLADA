'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function EsteticaDiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="estetica" areaLabel="Estética">
      <DiagnosticoProfissionalQuiz areaCodigo="estetica" areaLabel="Estética" />
    </YladaAreaShell>
  )
}
