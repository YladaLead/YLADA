import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import MetodoYLADAContent from '@/components/ylada/MetodoYLADAContent'

export default function SellerMetodoPage() {
  return (
    <YladaAreaShell areaCodigo="seller" areaLabel="Vendedores">
      <MetodoYLADAContent areaCodigo="seller" areaLabel="Vendedores" />
    </YladaAreaShell>
  )
}
