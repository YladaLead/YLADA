import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelChat from '@/components/ylada/NoelChat'

export default function EsteticaHomePage() {
  return (
    <YladaAreaShell areaCodigo="estetica" areaLabel="Estética">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Noel</h1>
        <p className="text-gray-600 mb-4">
          Seu mentor para estética. Tire dúvidas, organize a rotina e use melhor seus links inteligentes para captação de clientes.
        </p>
        <NoelChat area="estetica" className="mt-2" />
      </div>
    </YladaAreaShell>
  )
}
