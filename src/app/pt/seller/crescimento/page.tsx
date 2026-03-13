'use client'

import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import SistemaCrescimentoContent from '@/components/ylada/SistemaCrescimentoContent'

export default function SellerCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="seller" areaLabel="Vendedores">
      <SistemaCrescimentoContent areaCodigo="seller" areaLabel="Vendedores" />
    </YladaAreaShell>
  )
}
