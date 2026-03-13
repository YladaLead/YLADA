'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoProfissionalQuiz from '@/components/ylada/DiagnosticoProfissionalQuiz'

export default function SellerDiagnosticoProfissionalPage() {
  return (
    <YladaAreaShell areaCodigo="seller" areaLabel="Vendedores">
      <DiagnosticoProfissionalQuiz areaCodigo="seller" areaLabel="Vendedores" />
    </YladaAreaShell>
  )
}
