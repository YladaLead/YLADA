import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelChat from '@/components/ylada/NoelChat'

export default function SellerHomePage() {
  return (
    <YladaAreaShell areaCodigo="seller" areaLabel="Vendedores">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Noel</h1>
        <p className="text-gray-600 mb-4">
          Seu mentor para vendedores. Tire dúvidas, organize a rotina e use melhor seus links inteligentes para funil de vendas e conversas qualificadas no WhatsApp.
        </p>
        <NoelChat area="seller" className="mt-2" />
      </div>
    </YladaAreaShell>
  )
}
