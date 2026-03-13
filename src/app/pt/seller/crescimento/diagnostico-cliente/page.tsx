'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import DiagnosticoClienteMetricas from '@/components/ylada/DiagnosticoClienteMetricas'

export default function SellerDiagnosticoClientePage() {
  return (
    <YladaAreaShell areaCodigo="seller" areaLabel="Vendedores">
      <DiagnosticoClienteMetricas areaCodigo="seller" areaLabel="Vendedores" />
    </YladaAreaShell>
  )
}
