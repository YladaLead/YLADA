'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoConversaHistorico from '@/components/ylada/DiagnosticoConversaHistorico'

export default function SellerDiagnosticoConversaPage() {
  return (
    <YladaAreaShell areaCodigo="seller" areaLabel="Vendedores">
      <DiagnosticoConversaHistorico areaCodigo="seller" areaLabel="Vendedores" />
    </YladaAreaShell>
  )
}
