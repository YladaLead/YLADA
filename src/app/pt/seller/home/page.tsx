import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelHomeContent from '@/components/ylada/NoelHomeContent'

export default function SellerHomePage() {
  return (
    <YladaAreaShell areaCodigo="seller" areaLabel="Vendedores">
      <NoelHomeContent
        areaCodigo="seller"
        areaLabel="Vendedores"
        area="seller"
        subtitle="Use o Noel para organizar seu marketing, criar diagnósticos e atrair conversas qualificadas no WhatsApp."
      />
    </YladaAreaShell>
  )
}
