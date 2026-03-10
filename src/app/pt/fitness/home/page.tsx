import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelChat from '@/components/ylada/NoelChat'

export default function FitnessHomePage() {
  return (
    <YladaAreaShell areaCodigo="fitness" areaLabel="Fitness">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Noel</h1>
        <p className="text-gray-600 mb-4">
          Seu mentor para fitness. Tire dúvidas, organize a rotina e use melhor seus links inteligentes para captação de clientes.
        </p>
        <NoelChat area="fitness" className="mt-2" />
      </div>
    </YladaAreaShell>
  )
}
