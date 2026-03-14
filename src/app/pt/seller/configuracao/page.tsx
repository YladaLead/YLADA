import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import YladaConfiguracaoContent from '@/components/ylada/YladaConfiguracaoContent'

export default function SellerConfiguracaoPage() {
  return (
    <YladaAreaShell areaCodigo="seller" areaLabel="Vendedores">
      <YladaConfiguracaoContent areaCodigo="seller" areaLabel="Vendedores" />
    </YladaAreaShell>
  )
}
